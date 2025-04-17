function saveOptions() {
  const domain = document.getElementById('domain').value.trim();
  
  const domainToSave = domain || 'kirull.ru';
  
  chrome.storage.sync.set(
    { customDomain: domainToSave },
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
    { customDomain: 'kirull.ru' },
    function(items) {
      document.getElementById('domain').value = items.customDomain;
    }
  );
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
