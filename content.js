console.log("Kinopoisk Button: Content script loaded");

const BUTTON_CONTENT = "Смотреть :)";

function initializeButton() {
  chrome.storage.sync.get({ customDomain: "kirull.ru" }, function (items) {
    const customDomain = items.customDomain;
    console.log("Kinopoisk Button: Using domain:", customDomain);
    addButton(customDomain);
  });
}

function addButton(domain) {
  const pageType = getPageTypeAndId();
  if (!pageType) {
    console.log("Kinopoisk Button: Unsupported page or invalid ID");
    return;
  }

  const { type, id } = pageType;
  const targetUrl = `https://${domain}/${type}/${id}/`;
  console.log("Kinopoisk Button: Target URL:", targetUrl);

  if (document.querySelector("#kinopoisk-button")) {
    console.log("Kinopoisk Button: Button already exists");
    return;
  }

  const watchButton = getWatchButton();

  if (!watchButton) {
    console.log('Kinopoisk Button: Could not find the "Буду смотреть" button, using fallback position');
    appendButtonFallback(targetUrl);
    return;
  }

  const buttonContainer = watchButton.closest("div");
  if (!buttonContainer) {
    console.log("Kinopoisk Button: Could not find the button container");
    return;
  }

  const button = createButton(targetUrl);
  buttonContainer.appendChild(button);
  console.log("Kinopoisk Button: Button added");
}

function getPageTypeAndId() {
  const match = window.location.pathname.match(/\/(film|series)\/(?:.*?-)?(\d+)/);
  if (!match) return null;
  return { type: match[1], id: match[2] };
}

function getWatchButton() {
  return (
    document.querySelector('[data-test-id="Watch"]') ||
    document.querySelector('button[title="Буду смотреть"]')
  );
}

function createButton(href) {
  const button = document.createElement("a");
  button.id = "kinopoisk-button";
  button.href = href;
  button.target = "_blank";
  button.textContent = BUTTON_CONTENT;

  button.style.display = "inline-block";
  button.style.background = "var(--primary-gradient, linear-gradient(135deg, #f50 69.93%, #d6bb00 100%))";
  button.style.color = "white";
  button.style.paddingBlockStart = "1.4rem";
  button.style.paddingBlockEnd = "1.4rem";
  button.style.paddingInlineStart = "2.2rem";
  button.style.paddingInlineEnd = "2.6rem";
  button.style.lineHeight = "1.8rem";
  button.style.borderRadius = "5.2rem";
  button.style.textDecoration = "none";
  button.style.fontWeight = "bold";
  button.style.marginTop = "10px";
  button.style.fontFamily = "Arial, sans-serif";
  button.style.fontSize = "14px";
  button.style.cursor = "pointer";

  return button;
}

function appendButtonFallback(href) {
  const button = createButton(href);
  button.style.position = "fixed";
  button.style.top = "100px";
  button.style.right = "20px";
  button.style.zIndex = "9999";
  button.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
  document.body.appendChild(button);
  console.log("Kinopoisk Button: Button added to page (fallback position)");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeButton);
} else {
  initializeButton();
}

setTimeout(initializeButton, 1000);
setTimeout(initializeButton, 3000);
