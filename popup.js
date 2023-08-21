// Initialize an empty array to store tabs to the right of the currently active tab.
let tabsToRight = [];

// Query for the currently active tab in the current window.
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  // Get the index of the currently active tab.
  const activeTabIndex = tabs[0].index;

  // Query for all tabs in the current window.
  chrome.tabs.query({ currentWindow: true }, function(allTabs) {

    // Filter the tabs to include those to the right & those NOT currently in a group
    tabsToRight = allTabs.filter(tab => (tab.index >= activeTabIndex && !tabInGroup(tab.id, handleTabInGroupResult)));

    // Fetch the button element.
    const button = document.querySelector("button");

    // Add a click event listener to the button.
    button.addEventListener("click", async () => {
    
      // Retrieve group name from extension
      const groupName = document.getElementById("name").value;
      const groupColor = document.getElementById("color").value.toLowerCase();

      // Validate group name
      if (!groupName || groupName.trim() == '' || !groupColor || groupColor.trim() == '') {
        alert("Please provide valid group name &/or group color");
        return;
      }

      // Create an array of tab ids from tabsToRight
      const tabIds = tabsToRight.map(({ id }) => id);

      // Group the selected tabs into a new tab group.
      const group = await chrome.tabs.group({ tabIds });

      // Update the title of the created tab group to whatever the name input is + color
      await chrome.tabGroups.update(group, { title: groupName, color: groupColor});
    });
  });
});

// Checks if a tab is already in a group
function tabInGroup(tabIdToCheck, callback) {

  // Query the groups in the window
  chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, function(groups) {
  
    // keep track of how many instances of the tab there is in a group.
    let counter = 0;
    
    // For each group
    for (const group of groups) {

      // Check if tab is in the group or not
      chrome.tabs.query({ groupId: group.id}, function(groupTabs) {

        for (const tab of groupTabs) {
          if (tabIdToCheck == tab.id) {
            counter++;
          }
        }
      });
    }

    // If a tab is in a group
    if (counter > 0)
    {
      callback(true);
    }
    else 
    {
      callback(false);
    }
  });
}


// Define a callback function to handle the result
function handleTabInGroupResult(isInGroup) {
  return isInGroup;
}