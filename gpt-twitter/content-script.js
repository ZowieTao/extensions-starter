// this content script will execute in twitter site
function getDivElement() {
  alert("getDivElement function was trigger, check the log");
  console.log("content-script:4", document.getElementsByTagName("div"));
}

async function getAccountStatics(callBack) {
  const mainElement = document.querySelector("main");
  console.log("mainElement", mainElement);

  const getCount = () => {
    const followInfoEle = document.querySelector('div[data-testid="UserName"]')
      .nextSibling.nextSibling.nextSibling;
    const childContents = [];
    console.log("followInfoEle", followInfoEle);

    followInfoEle.childNodes.forEach((childNode) => {
      if (childNode.nodeType === Node.ELEMENT_NODE) {
        const content = childNode.textContent;
        childContents.push(content);
      }
    });

    if (childContents.length >= 2) {
      console.log("childContents", childContents);

      return {
        Following: childContents[0].split(" ").shift(),
        Followers: childContents[1].split(" ").shift(),
      };
    }
  };

  const getCountDebounce = getCount;

  const observer = new MutationObserver((mutations) => {
    const result = getCountDebounce();
    result && callBack(result);

    observer.disconnect();
  });

  const observerOptions = {
    childList: true,
    subtree: true,
  };

  observer.observe(mainElement, observerOptions);
  console.log("will observe");
  let getCountDebounceResult = getCountDebounce();
  console.log("getCountDebounceResult", getCountDebounceResult);
  if (getCountDebounceResult) {
    callBack(getCountDebounceResult);
    observer.disconnect();
  }

  document.querySelector('a[aria-label="Profile"][role="link"]').click();
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("receive message:", message);
  const { action, payload, request_id } = message;
  // todo some work use event data

  switch (action) {
    case "get_account_statics": {
      getAccountStatics((result) => {
        let resp = { request_id, data: result };
        console.log("will send response", resp);
        sendResponse(resp);
      });
      break;
    }
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
});
