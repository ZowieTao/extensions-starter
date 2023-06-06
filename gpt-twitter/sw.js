export function jsonEncode(obj, init = "{}", prettier = false) {
  try {
    return prettier ? JSON.stringify(obj, undefined, 4) : JSON.stringify(obj);
  } catch (error) {
    return init;
  }
}

function generateUUID() {
  let d = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

// event: string, data: jsonString
async function sendMessageToTwitterTab(event, data) {
  chrome.tabs.query({ url: "https://twitter.com/*" }, function (tabs) {
    if (tabs && tabs.length > 0) {
      var twitterTabId = tabs[0].id;
      // set twitter tab focus and callback to sendMessage
      chrome.tabs.update(twitterTabId, { active: true }, function () {
        chrome.tabs.sendMessage(twitterTabId, { event, data });
      });
    } else {
      chrome.tabs.create({ url: "https://twitter.com" }, function (newTab) {
        // listen tab update
        function handleUpdated(tabId, changeInfo, tab) {
          if (tabId === newTab.id && changeInfo.status === "complete") {
            // send message to twitter's content script
            chrome.tabs.sendMessage(newTab.id, {
              event,
              data,
            });

            // remote listener
            chrome.tabs.onUpdated.removeListener(handleUpdated);
          }
        }

        // add listener
        chrome.tabs.onUpdated.addListener(handleUpdated);
      });
    }
  });
}

// maintain websocket connect and consider inactive state
class WebSocketController {
  constructor(url) {
    this.url = url;
    this.websocket = null;
    this.reconnectInterval = 5000; // internal of reconnect(ms)
    this.reconnectTimeoutId = null;
    this.isConnected = false;
  }

  connect() {
    this.websocket = new WebSocket(this.url);

    this.websocket.addEventListener("open", this.handleOpen.bind(this));
    this.websocket.addEventListener("message", this.handleMessage.bind(this));
    this.websocket.addEventListener("close", this.handleClose.bind(this));
    this.websocket.addEventListener("error", this.handleError.bind(this));
  }

  handleOpen(event) {
    console.log("WebSocket Connected");
    this.isConnected = true;
    setTimeout(() => {
      this.send(
        jsonEncode({
          event: "nothing",
          errCode: 0,
          errMsg: "none",
          data: "",
          operationID: generateUUID(),
        })
      );
    }, 1000);
  }

  // declare type WsResponse = {
  //   event: RequestFunc; publishTweet getHotTweets reply retweet like bookmark follow followers account
  //   errCode: number;
  //   errMsg: string;
  //   data: jsonString;
  //   operationID: string;
  // };

  handleMessage(msg) {
    const { event, errCode, errMsg, data, operationID } =
      JSON.parse(msg.data) ?? {};

    if (errCode !== 0) {
      throw new Error("handleMessage:106" + typeof msg.data + errCode + errMsg);
    }

    sendMessageToTwitterTab(event, data);
  }

  handleClose(event) {
    console.log("WebSocket was close");
    this.isConnected = false;

    // auto connect after close connect
    this.reconnectTimeoutId = setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  handleError(event) {
    console.error("WebSocket connect error:", event);
  }

  send(message) {
    if (this.isConnected) {
      this.websocket.send(message);
    } else {
      console.warn("WebSocket wasn't connected, cannot send message");
    }
  }

  close() {
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
    }

    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }
}

async function openAdminTab() {
  chrome.tabs.create({ url: "admin/index.html" });
}

chrome.action.onClicked.addListener(openAdminTab);

chrome.webNavigation.onDOMContentLoaded.addListener(async ({ tabId, url }) => {
  console.log("sw.js:70", "webNavigation.onDOMContentLoaded");
  if (!url.startsWith("https://twitter.com")) return;

  chrome.scripting.executeScript({
    target: { tabId },
    files: ["content-loaded-script.js"],
  });
});

// listen message from ws or admin page
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const { adminEvent, adminData } = request;

  console.log("sw.js:162 onMessage", request, adminEvent, adminData);

  await sendMessageToTwitterTab(adminEvent, adminData);

  return sendResponse(`sw tell content-script ${adminEvent} and success`);
});

let _controller = new WebSocketController(
  "wss://s9104.nyc1.piesocket.com/v3/1?api_key=Sk1e6udYsCBKSVYAEkERufcJhWps8JhH0TTIvtYm&notify_self=1"
);

function getController() {
  return (
    !!_controller ? _controller : (_controller = new WebSocketController()),
    _controller
  );
}

_controller.connect();
