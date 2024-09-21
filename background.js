chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
 if (changeInfo.status === 'complete' && /^https?:/.test(tab.url)) {
   chrome.scripting.executeScript({
     target: { tabId: tabId },
     files: ['content.js']
   });
 }
});
