chrome.storage.sync.get(['titleChangeEnabled', 'customTitle'], function(data) {
 if (data.titleChangeEnabled) {
   const newTitle = data.customTitle || 'Google';  // カスタムタイトルがなければ"Google"を使う
   document.title = newTitle;
 }
});