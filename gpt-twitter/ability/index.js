function a(params) {
  alert("a function was trigger, check the log");
  console.log("ability", document.getElementsByTagName("a"));
}

function p() {
  alert("p function was trigger, check the log");
  console.log("ability", document.getElementsByTagName("p"));
}

function div() {
  alert("div function was trigger, check the log");
  console.log("ability", document.getElementsByTagName("div"));
}

function span() {
  alert("span function was trigger, check the log");
  console.log("ability", document.getElementsByTagName("span"));
}

(() => {
  chrome.runtime.sendMessage(
    { greeting: "tw: ability inject send to sw", prepare: true },
    function (response) {
      alert("response: " + JSON.stringify(response));
    }
  );
})();
