const image = "https://mock.image/xxx.png";
const username = "zowietao";
const content = "mock content";
const search = "no search";
const url = "https://twitter.com/code/status/1665425943928750080";
const reply = "no Reply";

const events = {
  publishTweet: { username, content, image },
  getHotTweets: { username, search },
  reply: { username, url, reply },
  retweet: { username, url },
  like: { username, url },
  bookmark: { username, url },
  follow: { username, url },
  followers: { username },
  account: { username },
};

document.querySelector(".submit-bottom").addEventListener("click", async () => {
  const eventVal = document.querySelector(".options-select").value;
  chrome.runtime.sendMessage(
    { adminEvent: eventVal, adminData: JSON.stringify(events[eventVal]) },
    function (response) {
      alert("callback command to sw: " + JSON.stringify(response));
    }
  );
});
