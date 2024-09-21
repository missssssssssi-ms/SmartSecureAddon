document.addEventListener('DOMContentLoaded', function () {
 let currentDomain = '';

 // 現在のタブのドメインを取得
 chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
   const url = new URL(tabs[0].url);
   currentDomain = url.hostname; // ドメイン名の取得
   document.getElementById('domainDisplay').textContent = `設定の対象: ${currentDomain}`;

   // ドメインごとの設定をストレージから取得して反映
   chrome.storage.sync.get([currentDomain, 'globalSettings'], function (data) {
     const settings = data[currentDomain] || {};
     const globalSettings = data['globalSettings'] || [];

     // タイトル変更の設定を反映
     document.getElementById('titleChangeCheckbox').checked = settings.titleChangeEnabled || false;
     document.getElementById('newTitle').value = settings.customTitle || '';
     
     // ラジオボタンの設定を反映
     if (settings.titleOption === 'template') {
       document.querySelector('input[name="titleOption"][value="template"]').checked = true;
     } else {
       document.querySelector('input[name="titleOption"][value="custom"]').checked = true; // デフォルトはカスタムタイトル
     }

     // テキスト置き換えペアの設定を反映
     const replacePairs = settings.replacePairs || [];
     replacePairs.forEach(function (pair) {
       addReplacePair(pair.replaceFrom, pair.replaceTo, pair.enabled, pair.applyToAllSites);
     });

     // グローバル設定がある場合の処理
     globalSettings.forEach(function (pair) {
       addReplacePair(pair.replaceFrom, pair.replaceTo, pair.enabled, true);
     });
   });
 });

 // 新しい置き換えペアを追加する
 document.getElementById('addPairButton').addEventListener('click', function () {
   addReplacePair('', '', true, false);  // 空のペアを追加
 });

 // 置き換えペアのHTMLを生成する関数
 function addReplacePair(replaceFrom, replaceTo, enabled, applyToAllSites) {
   const div = document.createElement('div');
   div.classList.add('replace-pair');
   
   // 削除ボタン付きの入力フィールドを作成
   div.innerHTML = `
     <div>
       <input type="checkbox" class="replace-enabled" ${enabled ? 'checked' : ''}/>
       変更前: <input type="text" class="replace-from" value="${replaceFrom}" />
       変更後: <input type="text" class="replace-to" value="${replaceTo}" />
       <br /><input type="checkbox" class="apply-to-all-sites" ${applyToAllSites ? 'checked' : ''}/> すべてのサイトで適応
       <button class="removePairButton">削除</button>
     </div>
   `;

   // 削除ボタンの動作を追加
   div.querySelector('.removePairButton').addEventListener('click', function() {
     div.remove();  // この置き換えペアを削除
   });

   document.getElementById('replacePairs').appendChild(div);
 }

 // 保存ボタンがクリックされたときに全ての設定をドメインごとにストレージに保存
 document.getElementById('saveButton').addEventListener('click', function () {
   const replacePairs = [];
   const globalReplacePairs = [];
   
   document.querySelectorAll('.replace-pair').forEach(function (pairDiv) {
     const replaceFrom = pairDiv.querySelector('.replace-from').value;
     const replaceTo = pairDiv.querySelector('.replace-to').value;
     const enabled = pairDiv.querySelector('.replace-enabled').checked;
     const applyToAllSites = pairDiv.querySelector('.apply-to-all-sites').checked;

     // グローバル適用の場合は別の配列に保存
     if (applyToAllSites) {
       globalReplacePairs.push({ replaceFrom, replaceTo, enabled });
     } else {
       replacePairs.push({ replaceFrom, replaceTo, enabled });
     }
   });

   // タイトル変更設定をストレージに保存
   const titleOption = document.querySelector('input[name="titleOption"]:checked').value;

   const settings = {
     titleChangeEnabled: document.getElementById('titleChangeCheckbox').checked,
     customTitle: document.getElementById('newTitle').value,
     titleOption: titleOption,
     replacePairs: replacePairs
   };

   // ドメインごとの設定を保存
   chrome.storage.sync.set({ [currentDomain]: settings }, function () {
     console.log('Settings saved for domain:', currentDomain, settings);
   });

   // グローバル（全サイトに適用する設定）を保存
   chrome.storage.sync.set({ 'globalSettings': globalReplacePairs }, function () {
     console.log('Global replace pairs saved:', globalReplacePairs);
   });
 });
});
