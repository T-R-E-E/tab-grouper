// Initialize an empty array to store tabs to the right of the currently active tab.
let tabsToRight = [];

// Query for the currently active tab in the current window.
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  // Get the index of the currently active tab.
  const activeTabIndex = tabs[0].index;

  // Query for all tabs in the current window.
  chrome.tabs.query({ currentWindow: true }, function(allTabs) {
    // Filter the tabs to include only those with an index greater than the active tab's index.
    tabsToRight = allTabs.filter(tab => tab.index > activeTabIndex);

    // Now that 'tabsToRight' has been populated, you can proceed to use it.

    // Fetch an HTML template element with the id "li_template."
    const template = document.getElementById("li_template");

    // Create a set to store elements that will be appended to the DOM.
    const elements = new Set();

    // Iterate through the 'tabsToRight' array.
    for (const tab of tabsToRight) {
      // Clone the template element to create a new list item.
      const element = template.content.firstElementChild.cloneNode(true);

      // Extract the title and pathname information from the tab.
      const title = tab.title.split("-")[0].trim();
      const pathname = new URL(tab.url).pathname.slice("/docs".length);

      // Update the cloned element with tab information.
      element.querySelector(".title").textContent = title;
      element.querySelector(".pathname").textContent = pathname;

      // Add a click event listener to the anchor tag within the list item.
      element.querySelector("a").addEventListener("click", async () => {
        // Set the clicked tab as active and focus its window.
        await chrome.tabs.update(tab.id, { active: true });
        await chrome.windows.update(tab.windowId, { focused: true });
      });

      // Add the cloned element to the 'elements' set.
      elements.add(element);
    }

    // Append the elements to the unordered list in the DOM.
    document.querySelector("ul").append(...elements);

    // Fetch the button element.
    const button = document.querySelector("button");

    // Add a click event listener to the button.
    button.addEventListener("click", async () => {
      // Create an array of tab IDs from 'tabsToRight'.
      const tabIds = tabsToRight.map(({ id }) => id);

      // Group the selected tabs into a new tab group.
      const group = await chrome.tabs.group({ tabIds });

      // Update the title of the created tab group to "DOCS."
      await chrome.tabGroups.update(group, { title: "DOCS" });
    });
  });
});
