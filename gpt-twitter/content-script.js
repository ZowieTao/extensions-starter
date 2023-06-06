// this content script will execute in twitter site
function getDivElement() {
  alert("getDivElement function was trigger, check the log");
  console.log("content-script:4", document.getElementsByTagName("div"));
}

(() => {
  chrome.runtime.sendMessage(
    { greeting: "content-script: 'script inject and send to sw'" },
    function (response) {
      alert("sw response to content-script: " + JSON.stringify(response));
    }
  );
})();

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("receive message:", message);
  const { event, data } = message;
  // todo some work use event data

  switch (event) {
    case "publishTweet": {
      console.log("!!!", event, data);
      break;
    }
    case "getHotTweets": {
      console.log("!!!", event, data);
      break;
    }
    case "reply": {
      console.log("!!!", event, data);
      break;
    }
    case "retweet": {
      console.log("!!!", event, data);
      break;
    }
    case "like": {
      console.log("!!!", event, data);
      break;
    }
    case "bookmark": {
      console.log("!!!", event, data);
      break;
    }
    case "follow": {
      console.log("!!!", event, data);
      break;
    }
    case "followers": {
      console.log("!!!", event, data);
      break;
    }
    case "account": {
      console.log("!!!", event, data);
      break;
    }

    default:
      break;
  }

  sendResponse({ response: "Received the message!" });
});
