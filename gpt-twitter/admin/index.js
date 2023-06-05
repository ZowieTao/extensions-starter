document.querySelector(".submit-bottom").addEventListener("click", async () => {
  const eventVal = document.querySelector(".options-select").value;
  chrome.tabs.query({ url: "https://twitter.com/*" }, function (tabs) {
    console.log(tabs);
    if (tabs && tabs.length > 0) {
      var twitterTabId = tabs[0].id;
      chrome.tabs.update(twitterTabId, { active: true }, function () {
        chrome.tabs.sendMessage(twitterTabId, { triggerEvent: eventVal });
      });
    } else {
      chrome.tabs.create({ url: "https://twitter.com" }, function (newTab) {
        // listen tab update
        function handleUpdated(tabId, changeInfo, tab) {
          if (tabId === newTab.id && changeInfo.status === "complete") {
            // send message to twitter's content script
            chrome.tabs.sendMessage(newTab.id, {
              triggerEvent: eventVal,
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
});
