chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    let tabURL = tabs[0].url;
    console.log(tabURL);
});