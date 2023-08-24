// Query the active tab in the browser
let tabs = await chrome.tabs.query({active: true, currentWindow: true});

// Get the index of the current tab
const activeTabIndex = tabs[0].index;

// Get all the tabs in the current window
let allTabs = await chrome.tabs.query({currentWindow: true});

// Filter the tabs that are to the right of the active's index
let tabsToRight = allTabs.filter(tab => tab.index >= activeTabIndex);

// Define temporary array to put non-grouped tabs into
let temp = [];

for (const tab of tabsToRight)
{
    try 
    {
        // If the tab is not in a group
        if (!(await tabInGroup(tab.id)))
        {
            temp.push(tab);
        }
    }
    catch (error)
    {
        console.error('Error checking tab group status', error);
    }
}

// Transfer tabs to be grouped into original array
tabsToRight = temp;

const form = document.getElementById('groupsubmit');

form.addEventListener('submit', async (event) => 
{
    // Prevent page reload
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