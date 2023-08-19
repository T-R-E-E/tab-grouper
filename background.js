chrome.action.onClicked.addListener(function (tab) {
  // Send a message to the content script in the active tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getActiveTabUrl
  });
});

// Define a function to retrieve the active tab's URL
function getActiveTabUrl() {
  const url = window.location.href;
  // Send the URL back to the extension
  chrome.runtime.sendMessage({ url: url });
}