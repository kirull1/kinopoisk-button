const DOMAIN = 'kirull.ru';
const BUTTON_CONTENT = "Смотреть";

function saveOptions() {
  const domain = document.getElementById('domain').value.trim();
  const buttonContent = document.getElementById('buttonContent').value.trim();
  
  const domainToSave = domain || DOMAIN;
  const buttonContentToSave = buttonContent || BUTTON_CONTENT;
  
  chrome.storage.sync.set(
    { customDomain: domainToSave, buttonContent: buttonContentToSave },
    function() {
      const status = document.getElementById('status');
      status.textContent = 'Settings saved.';
      status.className = 'status success';
      status.style.display = 'block';
      
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
      
      setTimeout(function() {
        window.close();
      }, 1000);
    }
  );
}

function restoreOptions() {
  chrome.storage.sync.get(
    { customDomain: DOMAIN, buttonContent: BUTTON_CONTENT },
    function(items) {
      document.getElementById('domain').value = items.customDomain;
      document.getElementById('buttonContent').value = items.buttonContent;
    }
  );
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
