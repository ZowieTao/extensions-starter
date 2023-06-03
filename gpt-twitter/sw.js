function openAdminTab() {
  console.log("open");
  chrome.tabs.create({ url: "admin/index.html" });
}

let _prepare;

let twitterTabId;

chrome.runtime.onInstalled.addListener();

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

(() => {
  setInterval(() => {
    twitterTabId &&
      chrome.scripting.executeScript({
        target: { tabId: twitterTabId },
        files: ["exec_div.js"],
      });
  }, 10000);
})();
