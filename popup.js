// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.url) {
      // Update the URL in the popup
      document.getElementById('url').textContent = message.url;
    }
  });