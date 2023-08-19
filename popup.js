// Initialize an empty array to store tabs to the right of the currently active tab.
let tabsToRight = [];

// Query for the currently active tab in the current window.
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  // Get the index of the currently active tab.
  const activeTabIndex = tabs[0].index;

  // Query for all tabs in the current window.
  chrome.tabs.query({ currentWindow: true }, function(allTabs) {
    // Filter the tabs to include only those with an index greater than OR equal to the active tab's index.
    tabsToRight = allTabs.filter(tab => tab.index >= activeTabIndex);

    // Fetch the button element.
    const button = document.querySelector("button");


    // Add a click event listener to the button.
    button.addEventListener("click", async () => {
      // Create an array of tab IDs from 'tabsToRight'.
      const tabIds = tabsToRight.map(({ id }) => id);

      // Group the selected tabs into a new tab group.
      const group = await chrome.tabs.group({ tabIds });

      // Update the title of the created tab group to whatever the name input is
      await chrome.tabGroups.update(group, { title: document.getElementById("name").value});
    });
  });
});
