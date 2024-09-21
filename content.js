chrome.storage.sync.get(null, function (data) {
 const url = new URL(window.location.href);
 const domain = url.hostname;

 const globalReplacePairs = data['globalSettings'] || [];
 const domainReplacePairs = data[domain]?.replacePairs || [];

 // グローバルな置き換えペアと、ドメイン固有の置き換えペアの両方を適用
 const replacePairs = [...globalReplacePairs, ...domainReplacePairs];

 replacePairs.forEach(pair => {
   if (pair.enabled) {
     replaceText(pair.replaceFrom, pair.replaceTo);
   }
 });

 // タイトルの変更
 if (data[domain]?.titleChangeEnabled) {
   const titleOption = data[domain]?.titleOption;
   if (titleOption === 'template') {
     document.title = 'チャット | Microsoft Teams';  // テンプレートタイトルを適用
   } else if (titleOption === 'custom') {
     document.title = data[domain]?.customTitle || document.title;
   }
 }
});

// テキストを置き換える関数
function replaceText(from, to) {
 const walker = document.createTreeWalker(
   document.body,
   NodeFilter.SHOW_TEXT,
   null,
   false
 );

 let node;
 while (node = walker.nextNode()) {
   node.nodeValue = node.nodeValue.replace(new RegExp(from, 'g'), to);
 }
}
