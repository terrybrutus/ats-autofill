const selector = "input, textarea, select";
const fieldAttribute = "data-caffeine-job-copilot-field";

const platformMatchers = [
  ["greenhouse", /greenhouse\.io|boards\.greenhouse\.io/i],
  ["lever", /jobs\.lever\.co|lever\.co/i],
  ["ashby", /ashbyhq\.com/i],
  ["workable", /workable\.com/i],
  ["smartrecruiters", /smartrecruiters\.com/i],
  ["workday", /myworkdayjobs\.com|workdayjobs\.com/i],
  ["icims", /icims\.com/i],
  ["taleo", /taleo\.net/i],
  ["bamboohr", /bamboohr\.com/i],
];

const detectPlatform = () => {
  const haystack = `${window.location.hostname} ${window.location.href}`;
  const match = platformMatchers.find(([, pattern]) => pattern.test(haystack));
  return match?.[0] ?? "generic";
};

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
    .map((element, index) => {
      const fieldId =
        element.getAttribute(fieldAttribute) ||
        element.id ||
        element.getAttribute("name") ||
        `detected-${index}`;
      element.setAttribute(fieldAttribute, fieldId);

      return {
        id: fieldId,
        name: element.getAttribute("name") || "",
        label: getLabelFor(element),
        placeholder: element.getAttribute("placeholder") || "",
        ariaLabel: element.getAttribute("aria-label") || "",
        tagName: element.tagName.toLowerCase(),
        type: element.getAttribute("type") || element.tagName.toLowerCase(),
      };
    });

const setNativeValue = (element, value) => {
  const prototype = Object.getPrototypeOf(element);
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
  descriptor?.set?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
};

const applySuggestions = (suggestions) => {
  const fields = new Map(
    Array.from(document.querySelectorAll(`[${fieldAttribute}]`)).map(
      (element) => [element.getAttribute(fieldAttribute), element],
    ),
  );
  let filled = 0;
  const skipped = [];

  for (const suggestion of suggestions) {
    if (!suggestion.value) {
      skipped.push({ fieldId: suggestion.fieldId, reason: "empty-value" });
      continue;
    }

    const element = fields.get(suggestion.fieldId);
    if (!element) {
      skipped.push({ fieldId: suggestion.fieldId, reason: "field-not-found" });
      continue;
    }

    if (element.tagName.toLowerCase() === "select") {
      const option = Array.from(element.options).find(
        (item) =>
          item.value.toLowerCase() === suggestion.value.toLowerCase() ||
          item.textContent.trim().toLowerCase() ===
            suggestion.value.toLowerCase(),
      );

      if (!option) {
        skipped.push({
          fieldId: suggestion.fieldId,
          reason: "option-not-found",
        });
        continue;
      }

      element.value = option.value;
      element.dispatchEvent(new Event("change", { bubbles: true }));
      filled += 1;
      continue;
    }

    setNativeValue(element, suggestion.value);
    filled += 1;
  }

  return { filled, skipped };
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "DETECT_FIELDS") {
    sendResponse({
      url: window.location.href,
      title: document.title,
      platform: detectPlatform(),
      fields: detectFields(),
    });
  }

  if (message.type === "APPLY_SUGGESTIONS") {
    sendResponse(applySuggestions(message.suggestions ?? []));
  }

  return true;
});
