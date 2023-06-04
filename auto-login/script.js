const account = "zowietao@gmail.com";
const password = "";

let inputElements = document.getElementsByTagName("input");

var input1Event = new Event("input", { bubbles: true });
var input2Event = new Event("input", { bubbles: true });
inputElements[0].value = account;
inputElements[0].dispatchEvent(input1Event);

// inputElements[1].dispatchEvent(inputEvent1);
inputElements[1].value = password;
inputElements[1].dispatchEvent(input2Event);

let submitButton = Array.from(document.getElementsByTagName("button")).filter(
  function (element) {
    return element.type === "submit";
  }
)[0];

let clickEvent = new MouseEvent("click", {
  bubbles: true,
  cancelable: true,
  view: window,
});

submitButton.dispatchEvent(clickEvent);
