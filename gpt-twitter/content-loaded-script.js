alert("loaded exec!");

setTimeout(() => {
  chrome.runtime.sendMessage(
    { greeting: "tw: twitter loaded send to sw" },
    function (response) {
      alert("response: " + JSON.stringify(response));
    }
  );
}, 5000);
