export class twitterController {
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
  console.log("trigger sw dom load");
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
  console.log("sw.js:25", request, sender.tab.id);

  return sendResponse(`sw: ${greeting}`);
});

let _controller;

function getController() {
  return (
    !!_controller ? _controller : (_controller = new twitterController()),
    _controller
  );
}

// (() => {
//   setInterval(() => {
//     twitterTabId &&
//       chrome.scripting.executeScript({
//         target: { tabId: twitterTabId },
//         files: ["exec_div.js"],
//       });
//   }, 10000);
// })();

// (() => {
//   setInterval(() => {
//     twitterTabId &&
//       chrome.scripting.executeScript({
//         target: { tabId: twitterTabId },
//         func: () => {
//           alert("a function was trigger, check the log");
//           console.log("ability", document.getElementsByTagName("a"));
//         },
//       });
//   }, 10000);
// })();
