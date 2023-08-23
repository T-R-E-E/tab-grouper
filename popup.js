// Initialize empty arrays to store tabs to the right of the currently active tab & ones that are not in group
let tabsToRight = [];
let notInGroup = [];

// Query for the currently active tab in the current window.
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) 
{
  // Get the index of the currently active tab.
  const activeTabIndex = tabs[0].index;

  // Query for all tabs in the current window.
  chrome.tabs.query({ currentWindow: true }, async function(allTabs) 
  {

    // Filter the tabs to include those to the right & those NOT currently in a group
    tabsToRight = allTabs.filter(tab => tab.index >= activeTabIndex);
    
    // Iterate through tabs to right to see if they're in a group
    for (const tab of tabsToRight)
    {
      // Error handling
      try 
      {
        
        const isInGroup = await tabInGroup(tab.id);
    
        // Checks if the tab is in a group or not
        if (!isInGroup) 
        {
          notInGroup.push(tab);
        }
      } 
      catch (error) 
      {
        console.error('Error checking tab group status:', error);
      }
    }

    // Fetch the button element.
    const form = document.getElementById("groupsubmit");

    // Add a click event listener to the button.
    form.addEventListener('submit', async (event) => 
    {

      // Prevent default refresh of the page
      event.preventDefault();

      // Retrieve group name from extension
      const groupName = document.getElementById("name").value;
      const groupColor = document.getElementById("color").value.toLowerCase();

      // Validate group name
      if (!groupName || groupName.trim() == '' || !groupColor || groupColor.trim() == '') 
      {
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

    // Changes the input field from the keyboard --> allows user to input without having to use mouse
    document.addEventListener('keydown', function(event) 
    {
      // Checks if switching key was pressed
      if (event.key == 'Tab') 
      {
        event.preventDefault();
        const name = document.getElementById("name");
        const color = document.getElementById("color");

        if (name == document.activeElement) 
        {
          color.focus();
        }
        else 
        {
          name.focus();
        }
      }
    });
  });
});

// Checks if a tab is already in a group
async function tabInGroup (tabIdToCheck)
{
  // set up flags
  let inGroup = false;

  // Query for all groups in the current window
  const groups = await chrome.tabGroups.query({windowId: chrome.windows.WINDOW_ID_CURRENT});
  for (const group of groups)
  {

    // Query for all tabs that are within those groups
    const tabs = await chrome.tabs.query({groupId: group.id});
    for (const tab of tabs)
    {
      // Check each tab id against the signature provided
      if (tabIdToCheck == tab.id)
      {
        inGroup = true;
      }
    }
  }

  return inGroup;
}