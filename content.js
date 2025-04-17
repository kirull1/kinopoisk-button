console.log('Kinopoisk Button: Content script loaded');

const BUTTON_CONTENT = 'Смотерть';

function initializeButton() {
  chrome.storage.sync.get({ customDomain: 'kirull.ru' }, function(items) {
    const customDomain = items.customDomain;
    console.log('Kinopoisk Button: Using domain:', customDomain);
    addButton(customDomain);
  });
}

function addButton(domain) {
  if (!window.location.pathname.includes('/film/')) {
    console.log('Kinopoisk Button: Not a film page');
    return;
  }
  
  const match = window.location.pathname.match(/\/film\/(\d+)/);
  if (!match) {
    console.log('Kinopoisk Button: Could not extract film ID');
    return;
  }
  
  const filmId = match[1];
  const targetUrl = `https://${domain}/film/${filmId}/`;
  console.log('Kinopoisk Button: Target URL:', targetUrl);
  
  if (document.querySelector('#kinopoisk-button')) {
    console.log('Kinopoisk Button: Button already exists');
    return;
  }
  
  const watchButton = document.querySelector('button[title="Буду смотреть"]');
  
  if (!watchButton) {
    console.log('Kinopoisk Button: Could not find the "Буду смотреть" button, using fallback position');
    const button = document.createElement('a');
    button.id = 'kinopoisk-button';
    button.href = targetUrl;
    button.target = '_blank';
    button.textContent = 'Test';
    
    button.style.position = 'fixed';
    button.style.top = '100px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.backgroundColor = '#f60';
    button.style.color = 'white';
    button.style.padding = '10px 15px';
    button.style.borderRadius = '8px';
    button.style.textDecoration = 'none';
    button.style.fontWeight = 'bold';
    button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    button.style.fontFamily = 'Arial, sans-serif';
    button.style.fontSize = '14px';
    button.style.cursor = 'pointer';
    
    document.body.appendChild(button);
    console.log('Kinopoisk Button: Button added to page (fallback position)');
    return;
  }
  
  const buttonContainer = watchButton.closest('div');
  
  if (!buttonContainer) {
    console.log('Kinopoisk Button: Could not find the button container');
    return;
  }
  
  const testButton = document.createElement('a');
  testButton.id = 'kinopoisk-button';
  testButton.href = targetUrl;
  testButton.target = '_blank';
  testButton.textContent = BUTTON_CONTENT;
  
  testButton.style.display = 'inline-block';
  testButton.style.backgroundColor = '#f60';
  testButton.style.color = 'white';
  testButton.style.padding = '10px 15px';
  testButton.style.borderRadius = '8px';
  testButton.style.textDecoration = 'none';
  testButton.style.fontWeight = 'bold';
  testButton.style.marginTop = '10px';
  testButton.style.fontFamily = 'Arial, sans-serif';
  testButton.style.fontSize = '14px';
  testButton.style.cursor = 'pointer';
  
  buttonContainer.appendChild(testButton);
  console.log('Kinopoisk Button: Button added');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeButton);
} else {
  initializeButton();
}

setTimeout(initializeButton, 1000);
setTimeout(initializeButton, 3000);
