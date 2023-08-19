chrome.action.onClicked.addListener(function (tab) {
  // Send a message to the content script in the active tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getActiveTabUrl
  });
});

// Define a function to retrieve the active tab's URL
function getActiveTabUrl() {
  chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
  function(tabs) {
    chrome.runtime.sendMessage({ url: tabs[0].url});
  });
}