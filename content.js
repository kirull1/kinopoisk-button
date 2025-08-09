console.log("Kinopoisk Button: Content script loaded");

let isInitialized = false;

function initializeButton() {
  chrome.storage.sync.get({ customDomain: "kirull.ru", buttonContent: "Смотреть" }, function (items) {
    const customDomain = items.customDomain;
    const customButton = items.buttonContent;
    console.log("Kinopoisk Button:", customDomain, customButton);
    addButton(customDomain, customButton);
  });
}

function addButton(domain, buttonContent) {
  const pageType = getPageTypeAndId();

  if (!pageType) {
    console.log("Kinopoisk Button: Unsupported page or invalid ID");
    return;
  }

  const { type, id } = pageType;
  const targetUrl = `https://${domain}/${type}/${id}/`;
  console.log("Kinopoisk Button: Target URL:", targetUrl);

  if (document.querySelector("#kinopoisk-button")) {
    isInitialized = true;
    console.log("Kinopoisk Button: Button already exists");
    return;
  }

  const watchButton = getWatchButton();

  if (!watchButton) {
    console.log('Kinopoisk Button: Could not find the "Буду смотреть" button, using fallback position');
    appendButtonFallback(targetUrl, buttonContent);
    return;
  }

  const buttonContainer = watchButton.closest("div");
  if (!buttonContainer) {
    console.log("Kinopoisk Button: Could not find the button container");
    return;
  }

  const button = createButton(targetUrl, buttonContent);
  buttonContainer.appendChild(button);
  console.log("Kinopoisk Button: Button added");

  isInitialized = true;
}

function getPageTypeAndId() {
  const match = window.location.pathname.match(/\/(film|series)\/(?:.*?-)?(\d+)/);
  if (!match) return null;
  return { type: match[1], id: match[2] };
}

function getWatchButton() {
  return (
    document.querySelector('[data-test-id="Watch"]') ||
    document.querySelector('button[title="Буду смотреть"]') ||
    document.querySelector('[data-tid="ContentActionsTransition"]')
  );
}

function createButton(href, buttonContent) {
  const button = document.createElement("a");
  button.id = "kinopoisk-button";
  button.href = href;
  button.target = "_blank";
  button.textContent = buttonContent || "Смотреть";

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

function appendButtonFallback(href, buttonContent) {
  const button = createButton(href, buttonContent);
  button.style.position = "fixed";
  button.style.top = "100px";
  button.style.right = "20px";
  button.style.zIndex = "9999";
  button.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
  document.body.appendChild(button);
  console.log("Kinopoisk Button: Button added to page (fallback position)");
}

async function main() {
  initializeButton();
  
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (!isInitialized) {
    await main();
  }
}

(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  await main();
})();
