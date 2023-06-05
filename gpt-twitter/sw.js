class twitterController {
  async publishTweet({ username, content, image }) {
    return "";
  }

  getHotTweets({ username, search }) {
    return [];
  }

  reply({ username, url, reply }) {}

  retweet({ username, url }) {}

  like({ username, url }) {}

  bookmark({ username, url }) {}

  follow({ username, url }) {}

  followers({ username }) {
    return 0;
  }

  account({ username }) {
    return 0;
  }
}

async function openAdminTab() {
  chrome.tabs.create({ url: "admin/index.html" });
}

let _prepare;

let twitterTabId;

chrome.action.onClicked.addListener(openAdminTab);

chrome.webNavigation.onDOMContentLoaded.addListener(async ({ tabId, url }) => {
  console.log("sw.js:15", "webNavigation.onDOMContentLoaded");
  if (!url.startsWith("https://twitter.com")) return;

  chrome.scripting.executeScript({
    target: { tabId },
    files: ["content-loaded-script.js"],
  });
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const { greeting, prepare } = request;

  _prepare = prepare;
  twitterTabId = sender.tab.id;
  console.log("sw.js:25", "onMessage", request, sender.tab.id);

  return sendResponse(`sw: ${greeting}`);
});

let _controller;

function getController() {
  return (
    !!_controller ? _controller : (_controller = new twitterController()),
    _controller
  );
}
