// Initialize default API suggestions
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chrome.storage.local.set({
      gitInfo: { zowietao: {}, opencorddotxyz: {}, openIMSDK: {} },
    });
  }
});

const URL_GITHUB = "https://github.com/";
const NUMBER_OF_PREVIOUS_SEARCHES = 4;

// owner , repo , { {pulls|issues|} | tree/{branch} }

// Display the suggestions after user starts typing
chrome.omnibox.onInputChanged.addListener(async (input, suggest) => {
  // get history from local

  const [ownerSearchStr, repo, action] = input
    .trim()
    .replace(/\s+/g, " ")
    .split(" ");

  // first item
  await chrome.omnibox.setDefaultSuggestion({
    content: `/${[ownerSearchStr, repo, action].join("/")}`,
    description: "Enter keyword separate by blank or choose from past searches",
  });

  const { gitInfo } = await chrome.storage.local.get("gitInfo");
  const ownerNames = Object.keys(gitInfo);

  if (ownerSearchStr && !repo) {
    for (let idx in ownerNames) {
      const startsWith = ownerNames[idx].startsWith(ownerSearchStr);
      if (startsWith || idx + 1 === ownerNames.length) {
        const _ownerName = ownerNames[idx];
        suggest(
          ownerGenerateSuggestions(
            startsWith ? _ownerName : ownerSearchStr,
            gitInfo[_ownerName]
          )
        );
      }
    }
  } else if (!ownerSearchStr) {
    const DefaultOwner = "zowietao";
    suggest(ownerGenerateSuggestions(DefaultOwner));
  } else {
    //
  }
});

// Open the reference page of the chosen API
chrome.omnibox.onInputEntered.addListener((input) => {
  chrome.tabs.create({ url: URL_GITHUB + input });
  // Save the latest keyword
  updateHistory(input);
});

async function updateHistory(input) {
  const { apiSuggestions } = await chrome.storage.local.get("apiSuggestions");
  apiSuggestions.unshift(input);
  apiSuggestions.splice(NUMBER_OF_PREVIOUS_SEARCHES);
  return chrome.storage.local.set({ apiSuggestions });
}

function ownerGenerateSuggestions(owner, repos) {
  if (repos?.length > 0) {
    return repos.map((repoName) => {
      return {
        content: `/${owner}/${repoName}`,
        description: `Owner:${owner}, repo: ${repoName}`,
      };
    });
  } else {
    return [
      {
        content: `/${owner}`,
        description: `visit ${owner}'s github`,
      },
    ];
  }
}
