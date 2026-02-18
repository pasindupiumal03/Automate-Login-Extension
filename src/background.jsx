// Background script for Chrome extension
// This runs in the background and handles extension lifecycle events

// Install event
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed');
  } else if (details.reason === 'update') {
    console.log('Extension updated');
  }
});

// Message handling between content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle messages from content script or popup
  console.log('Message received:', message);
  
  // Example: respond to message
  sendResponse({ success: true });
});

// Browser action (extension icon) click handler
chrome.action.onClicked.addListener((tab) => {
  // This will only trigger if no popup is defined in manifest
  console.log('Extension icon clicked');
});