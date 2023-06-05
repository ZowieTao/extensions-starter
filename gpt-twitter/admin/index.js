document.querySelector(".submit-bottom").addEventListener("click", async () => {
  const eventVal = document.querySelector(".options-select").value;
  chrome.tabs.query({ url: "https://twitter.com/*" }, function (tabs) {
    console.log(tabs);
    if (tabs && tabs.length > 0) {
      var googleTabId = tabs[0].id;
      chrome.tabs.update(googleTabId, { active: true }, function () {
        chrome.tabs.sendMessage(googleTabId, { keyword: "your_keyword_here" });
      });
    } else {
    }
  });
});
