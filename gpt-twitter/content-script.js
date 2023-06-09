// this content script will execute in twitter site
function getDivElement() {
  alert("getDivElement function was trigger, check the log");
  console.log("content-script:4", document.getElementsByTagName("div"));
}

setTimeout(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const usernameInput = document.querySelector(
      'input[autocomplete="username"]'
    );

    const passwordInput = document.querySelector(
      'input[autocomplete="current-password"]'
    );

    usernameInput.value = "your_username";
    passwordInput.value = "your_password";

    const loginButton = document.querySelector(
      'div[data-testid="LoginForm_Login_Button"]'
    );
    loginButton.click();
  });
}, 1000);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("receive message:", message);
  const { event, data } = message;
  // todo some work use event data

  switch (event) {
    case "login": {
      break;
    }

    case "publishTweet": {
      const textBox = document.querySelector('div[role="textbox"]');

      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      });

      textBox.dispatchEvent(enterEvent);

      const inputEvent = new InputEvent("input", {
        bubbles: true,
        cancelable: true,
      });
      textBox.dispatchEvent(inputEvent);

      textBox.innerText = "Hello, Twitter!";

      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      });

      const tweetButton = document.querySelector(
        'div[data-testid="tweetButtonInline"]'
      );
      tweetButton.dispatchEvent(clickEvent);

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
