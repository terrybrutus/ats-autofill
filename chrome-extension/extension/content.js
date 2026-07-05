const selector = "input, textarea, select";

const getLabelFor = (element) => {
  if (element.id) {
    const label = document.querySelector(
      `label[for="${CSS.escape(element.id)}"]`,
    );
    if (label?.textContent) {
      return label.textContent;
    }
  }

  const wrappingLabel = element.closest("label");
  if (wrappingLabel?.textContent) {
    return wrappingLabel.textContent;
  }

  return "";
};

const detectFields = () =>
  Array.from(document.querySelectorAll(selector))
    .filter((element) => !element.disabled && element.type !== "hidden")
    .slice(0, 80)
    .map((element, index) => ({
      id: element.id || `detected-${index}`,
      name: element.getAttribute("name") || "",
      fieldLabel: getLabelFor(element),
      placeholder: element.getAttribute("placeholder") || "",
      ariaLabel: element.getAttribute("aria-label") || "",
      tagName: element.tagName.toLowerCase(),
      fieldType: element.getAttribute("type") || element.tagName.toLowerCase(),
    }));

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "DETECT_FIELDS") {
    sendResponse({
      url: window.location.href,
      pageTitle: document.title,
      fields: detectFields(),
    });
  }

  return true;
});
