const patreonUrl = "https://www.patreon.com/login";

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  console.log("!!!", tab);
  if (tab.url.startsWith(patreonUrl)) {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'

    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === "ON" ? "OFF" : "ON";

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    if (nextState === "ON") {
      console.log("start auto login");

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["script.js"],
      });
    } else if (nextState === "OFF") {
      console.log("OFF");
    }
  }
});
