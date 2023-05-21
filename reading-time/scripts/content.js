console.log("scripts/content:1", "this is content script");

const article = document.querySelector("article");
const linkElements = document.getElementsByTagName("a");

// `document.querySelector` may return null if the selector doesn't match anything.
if (article) {
  const text = article.textContent;
  const wordMatchRegExp = /[^\s]+/g; // Regular expression
  const words = text.matchAll(wordMatchRegExp);
  // matchAll returns an iterator, convert to array to get word count
  const wordCount = [...words].length;
  const readingTime = Math.round(wordCount / 200);
  const badge = document.createElement("p");
  // Use the same styling as the publish information in an article's header
  badge.classList.add("color-secondary-text", "type--caption");
  badge.textContent = `⏱️ ${readingTime} min read`;

  // Support for API reference docs
  const heading = article.querySelector("h1");
  // Support for article docs with date
  const date = article.querySelector("time")?.parentNode;

  const insertEle = date ?? heading;

  insertEle && insertEle.insertAdjacentElement("afterend", badge);
}

if (linkElements) {
  const linkMap = new Map();

  Array.from(linkElements).forEach((link) => {
    const content = link.textContent;
    const href = link.href;

    linkMap.set(content, href);
  });

  const linkListContainer = document.createElement("ul");

  linkListContainer.style.position = "fixed";
  linkListContainer.style.zIndex = "9999";
  linkListContainer.style.left = "10px";
  linkListContainer.style.bottom = "100px";
  linkListContainer.style.maxHeight = "200px";
  linkListContainer.style.width = "auto";
  linkListContainer.style.overflow = "auto";
  linkListContainer.style.border = "1px solid black";
  linkListContainer.style.background = "rgba(28,28,28,0.8)";
  linkListContainer.style.display = "none";

  linkMap.forEach((href, content) => {
    const listItem = document.createElement("li");

    const newLinkElement = document.createElement("a");
    newLinkElement.textContent = content;
    newLinkElement.href = href;

    listItem.appendChild(newLinkElement);

    linkListContainer.appendChild(listItem);
  });

  const body = document.getElementsByTagName("body")[0];
  body.insertBefore(linkListContainer, body.firstChild);

  const toggleButton = document.createElement("div");
  toggleButton.textContent = "click to show/hide";

  toggleButton.style.position = "fixed";
  toggleButton.style.zIndex = "9999";
  toggleButton.style.left = "10px";
  toggleButton.style.bottom = "10px";
  toggleButton.style.width = "auto";
  toggleButton.style.border = "1px solid yellow";
  toggleButton.style.padding = "0.1rem";
  toggleButton.style.background = "rgba(88,88,88,0.2)";
  toggleButton.style.borderRadius = "4px";

  toggleButton.addEventListener("click", function () {
    linkListContainer.style.display =
      linkListContainer.style.display === "none" ? "block" : "none";
  });

  body.insertBefore(toggleButton, body.firstChild);
}
