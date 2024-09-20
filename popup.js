// チェックボックスの状態をストレージに保存
document.addEventListener('DOMContentLoaded', function() {
 const checkbox = document.getElementById('titleChangeCheckbox');

 // ストレージから現在の設定を取得
 chrome.storage.sync.get('titleChangeEnabled', function(data) {
   checkbox.checked = data.titleChangeEnabled || false;
 });

 // チェックボックスが変更されたときに設定を保存
 checkbox.addEventListener('change', function() {
   chrome.storage.sync.set({titleChangeEnabled: checkbox.checked});
 });
});