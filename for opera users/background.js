
// Try to use sidePanel if available (Chrome), otherwise use popup (Opera)
chrome.action.onClicked.addListener(async (tab) => {
  if (chrome.sidePanel) {
    // Chrome with sidePanel support
    chrome.sidePanel.open({ tabId: tab.id });
  }
  // For Opera and other browsers, the popup will open automatically via default_popup
});
