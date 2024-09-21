document.addEventListener('DOMContentLoaded', function () {
 let currentDomain = '';

 // ���݂̃^�u�̃h���C�����擾
 chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
   const url = new URL(tabs[0].url);
   currentDomain = url.hostname; // �h���C�����̎擾
   document.getElementById('domainDisplay').textContent = `�ݒ�̑Ώ�: ${currentDomain}`;

   // �h���C�����Ƃ̐ݒ���X�g���[�W����擾���Ĕ��f
   chrome.storage.sync.get([currentDomain, 'globalSettings'], function (data) {
     const settings = data[currentDomain] || {};
     const globalSettings = data['globalSettings'] || [];

     // �^�C�g���ύX�̐ݒ�𔽉f
     document.getElementById('titleChangeCheckbox').checked = settings.titleChangeEnabled || false;
     document.getElementById('newTitle').value = settings.customTitle || '';
     
     // ���W�I�{�^���̐ݒ�𔽉f
     if (settings.titleOption === 'template') {
       document.querySelector('input[name="titleOption"][value="template"]').checked = true;
     } else {
       document.querySelector('input[name="titleOption"][value="custom"]').checked = true; // �f�t�H���g�̓J�X�^���^�C�g��
     }

     // �e�L�X�g�u�������y�A�̐ݒ�𔽉f
     const replacePairs = settings.replacePairs || [];
     replacePairs.forEach(function (pair) {
       addReplacePair(pair.replaceFrom, pair.replaceTo, pair.enabled, pair.applyToAllSites);
     });

     // �O���[�o���ݒ肪����ꍇ�̏���
     globalSettings.forEach(function (pair) {
       addReplacePair(pair.replaceFrom, pair.replaceTo, pair.enabled, true);
     });
   });
 });

 // �V�����u�������y�A��ǉ�����
 document.getElementById('addPairButton').addEventListener('click', function () {
   addReplacePair('', '', true, false);  // ��̃y�A��ǉ�
 });

 // �u�������y�A��HTML�𐶐�����֐�
 function addReplacePair(replaceFrom, replaceTo, enabled, applyToAllSites) {
   const div = document.createElement('div');
   div.classList.add('replace-pair');
   
   // �폜�{�^���t���̓��̓t�B�[���h���쐬
   div.innerHTML = `
     <div>
       <input type="checkbox" class="replace-enabled" ${enabled ? 'checked' : ''}/>
       �ύX�O: <input type="text" class="replace-from" value="${replaceFrom}" />
       �ύX��: <input type="text" class="replace-to" value="${replaceTo}" />
       <br /><input type="checkbox" class="apply-to-all-sites" ${applyToAllSites ? 'checked' : ''}/> ���ׂẴT�C�g�œK��
       <button class="removePairButton">�폜</button>
     </div>
   `;

   // �폜�{�^���̓����ǉ�
   div.querySelector('.removePairButton').addEventListener('click', function() {
     div.remove();  // ���̒u�������y�A���폜
   });

   document.getElementById('replacePairs').appendChild(div);
 }

 // �ۑ��{�^�����N���b�N���ꂽ�Ƃ��ɑS�Ă̐ݒ���h���C�����ƂɃX�g���[�W�ɕۑ�
 document.getElementById('saveButton').addEventListener('click', function () {
   const replacePairs = [];
   const globalReplacePairs = [];
   
   document.querySelectorAll('.replace-pair').forEach(function (pairDiv) {
     const replaceFrom = pairDiv.querySelector('.replace-from').value;
     const replaceTo = pairDiv.querySelector('.replace-to').value;
     const enabled = pairDiv.querySelector('.replace-enabled').checked;
     const applyToAllSites = pairDiv.querySelector('.apply-to-all-sites').checked;

     // �O���[�o���K�p�̏ꍇ�͕ʂ̔z��ɕۑ�
     if (applyToAllSites) {
       globalReplacePairs.push({ replaceFrom, replaceTo, enabled });
     } else {
       replacePairs.push({ replaceFrom, replaceTo, enabled });
     }
   });

   // �^�C�g���ύX�ݒ���X�g���[�W�ɕۑ�
   const titleOption = document.querySelector('input[name="titleOption"]:checked').value;

   const settings = {
     titleChangeEnabled: document.getElementById('titleChangeCheckbox').checked,
     customTitle: document.getElementById('newTitle').value,
     titleOption: titleOption,
     replacePairs: replacePairs
   };

   // �h���C�����Ƃ̐ݒ��ۑ�
   chrome.storage.sync.set({ [currentDomain]: settings }, function () {
     console.log('Settings saved for domain:', currentDomain, settings);
   });

   // �O���[�o���i�S�T�C�g�ɓK�p����ݒ�j��ۑ�
   chrome.storage.sync.set({ 'globalSettings': globalReplacePairs }, function () {
     console.log('Global replace pairs saved:', globalReplacePairs);
   });
 });
});
