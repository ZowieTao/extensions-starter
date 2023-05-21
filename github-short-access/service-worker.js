// Initialize default API suggestions
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chrome.storage.local.set({
      gitInfo: {
        zowietao: ["extensions-starter"],
        opencorddotxyz: ["opencord-frontend"],
        openIMSDK: ["openim-sdk-core"],
      },
    });
  }
});

const URL_GITHUB = "https://github.com/";
const NUMBER_OF_PREVIOUS_SEARCHES = 4;

// owner , repo , { {pulls|issues|} | tree/{branch} }

// Display the suggestions after user starts typing
chrome.omnibox.onInputChanged.addListener(async (input, suggest) => {
  // get history from local

  const [ownerSearchStr, repoSearchStr, action] = input
    .trim()
    .replace(/\s+/g, " ")
    .split(" ");

  // first item
  await chrome.omnibox.setDefaultSuggestion({
    // content: `/${[ownerSearchStr, repoSearchStr, action].join("/")}`,
    description: "Enter keyword separate by blank or choose from past searches",
  });

  const { gitInfo } = await chrome.storage.local.get("gitInfo");
  const ownerNames = Object.keys(gitInfo);

  for (let idx in ownerNames) {
    const startsWith = ownerNames[idx].startsWith(ownerSearchStr || "");
    const _ownerName = ownerNames[idx];

    if (ownerSearchStr && !repoSearchStr) {
      if (startsWith || idx + 1 === ownerNames.length) {
        suggest(
          ownerGenerateSuggestions(
            startsWith ? _ownerName : ownerSearchStr,
            gitInfo[_ownerName]
          )
        );
      }
    } else if (!ownerSearchStr) {
      const DefaultOwner = "zowietao";
      suggest(ownerGenerateSuggestions(DefaultOwner));
    } else {
      suggest(
        ownerGenerateSuggestions(
          startsWith ? _ownerName : ownerSearchStr,
          gitInfo[_ownerName],
          repoSearchStr
        )
      );
    }
  }
});

// Open the reference page of the chosen API
chrome.omnibox.onInputEntered.addListener(
  (mediaQueryList, mediaQueryListEvent) => {
    console.log("entry and input: ", mediaQueryList, mediaQueryListEvent);
    chrome.tabs.create({
      url: URL_GITHUB + mediaQueryList.split(" ").join("/"),
    });
    // Save the latest keyword
    // updateHistory(input);
  }
);

async function updateHistory(input) {
  const { apiSuggestions } = await chrome.storage.local.get("apiSuggestions");
  apiSuggestions.unshift(input);
  apiSuggestions.splice(NUMBER_OF_PREVIOUS_SEARCHES);
  return chrome.storage.local.set({ apiSuggestions });
}

function ownerGenerateSuggestions(owner, repos, repoSearchStr) {
  if (repos?.length > 0) {
    return repos
      .filter((repoName) => {
        return repoSearchStr ? repoName.startsWith(repoSearchStr) : true;
      })
      .map((repoName) => {
        return {
          content: `${owner} ${repoName}`,
          description: `SUGGESTION: Owner: ${owner}, Repo: ${repoName}`,
        };
      });
  } else {
    return [
      {
        content: `${owner} ${repoSearchStr ? `${repoSearchStr}` : ""}`,
        description: `visit ${owner}'s github`,
      },
    ];
  }
}
