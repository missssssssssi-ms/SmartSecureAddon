chrome.storage.sync.get('titleChangeEnabled', function(data) {
 if (data.titleChangeEnabled) {
   document.title = "Google";
 }
});