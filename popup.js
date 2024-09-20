// ポップアップの内容を読み込んだときに現在の設定を反映
document.addEventListener('DOMContentLoaded', function() {
 const checkbox = document.getElementById('titleChangeCheckbox');
 const newTitleInput = document.getElementById('newTitle');
 const saveButton = document.getElementById('saveButton');

 // ストレージから現在の設定を取得して反映
 chrome.storage.sync.get(['titleChangeEnabled', 'customTitle'], function(data) {
   checkbox.checked = data.titleChangeEnabled || false;
   newTitleInput.value = data.customTitle || '';  // カスタムタイトルがあれば表示
 });

 // 「保存」ボタンがクリックされたときに設定を保存
 saveButton.addEventListener('click', function() {
   const newTitle = newTitleInput.value || 'Google';  // ユーザーが何も入力していなければ"Google"を使う
   chrome.storage.sync.set({
     titleChangeEnabled: checkbox.checked,
     customTitle: newTitle
   }, function() {
     console.log('Settings saved');
   });
 });
});