const selector = "input, textarea, select";

const textSelectors = [
  "label",
  "legend",
  "[role='heading']",
  "[data-automation-id*='formLabel']",
  "[data-automation-id*='question']",
  "[data-automation-id*='prompt']",
  "[class*='question']",
  "[class*='label']",
];

const platformPatterns = [
  ["workday", /(^|\.)myworkdayjobs\.com$|workday/i],
  ["greenhouse", /greenhouse\.io|greenhouse/i],
  ["lever", /(^|\.)lever\.co$|lever/i],
  ["ashby", /ashbyhq\.com|ashby/i],
  ["workable", /workable\.com|workable/i],
  ["smartrecruiters", /smartrecruiters\.com|smartrecruiters/i],
  ["icims", /icims\.com|icims/i],
  ["taleo", /taleo\.net|taleo/i],
  ["bamboohr", /bamboohr\.com|bamboohr/i],
];

const normalizeText = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

const compactLabel = (value) => {
  const text = normalizeText(value);
  return text.length > 220 ? `${text.slice(0, 217)}...` : text;
};

const getPlatform = () => {
  const haystack = `${window.location.hostname} ${window.location.href} ${document.title}`;
  const match = platformPatterns.find(([, pattern]) => pattern.test(haystack));
  return match?.[0] ?? "generic";
};

const getTextByIds = (ids) =>
  ids
    .split(/\s+/)
    .map((id) => document.getElementById(id)?.textContent)
    .filter(Boolean)
    .join(" ");

const getLabelFor = (element) => {
  if (element.id) {
    const label = document.querySelector(
      `label[for="${CSS.escape(element.id)}"]`,
    );
    if (label?.textContent) {
      return label.textContent;
    }
  }

  const labelledBy = element.getAttribute("aria-labelledby");
  if (labelledBy) {
    const text = getTextByIds(labelledBy);
    if (text) {
      return text;
    }
  }

  const wrappingLabel = element.closest("label");
  if (wrappingLabel?.textContent) {
    return wrappingLabel.textContent;
  }

  return "";
};

const getSectionText = (element) => {
  const section = element.closest(
    "fieldset, [role='group'], [data-automation-id*='formField'], [data-automation-id*='question'], section, article",
  );
  if (!section) {
    return "";
  }

  const legend = section.querySelector("legend");
  if (legend?.textContent) {
    return legend.textContent;
  }

  const heading = section.querySelector(
    "h1, h2, h3, h4, [role='heading'], [data-automation-id*='heading']",
  );
  if (heading?.textContent) {
    return heading.textContent;
  }

  const labelish = section.querySelector(textSelectors.join(","));
  if (labelish?.textContent) {
    return labelish.textContent;
  }

  return "";
};

const getNearbyText = (element) => {
  const texts = [];
  let current = element.parentElement;

  for (let depth = 0; current && depth < 4; depth += 1) {
    const labelish = Array.from(
      current.querySelectorAll(textSelectors.join(",")),
    )
      .map((node) => node.textContent)
      .filter(Boolean)
      .slice(0, 4);
    texts.push(...labelish);

    const previous = current.previousElementSibling;
    if (previous?.textContent) {
      texts.push(previous.textContent);
    }

    current = current.parentElement;
  }

  return texts.map(compactLabel).filter(Boolean).join(" | ");
};

const getOptions = (element) => {
  if (element.tagName.toLowerCase() === "select") {
    return Array.from(element.options)
      .map((option) => normalizeText(option.textContent))
      .filter(Boolean)
      .slice(0, 20);
  }

  if (element.type === "radio" || element.type === "checkbox") {
    const groupName = element.getAttribute("name");
    if (!groupName) {
      return [];
    }

    return Array.from(
      document.querySelectorAll(
        `input[name="${CSS.escape(groupName)}"][type="${CSS.escape(element.type)}"]`,
      ),
    )
      .map((input) => compactLabel(getLabelFor(input) || input.value))
      .filter(Boolean)
      .slice(0, 20);
  }

  return [];
};

const getStableFieldId = (element, index) =>
  element.id ||
  element.getAttribute("name") ||
  element.getAttribute("data-automation-id") ||
  `detected-${index}`;

const detectFields = () =>
  Array.from(document.querySelectorAll(selector))
    .filter((element) => !element.disabled && element.type !== "hidden")
    .slice(0, 80)
    .map((element, index) => {
      const directLabel = compactLabel(getLabelFor(element));
      const sectionLabel = compactLabel(getSectionText(element));
      const nearbyText = compactLabel(getNearbyText(element));
      const fieldLabel = directLabel || sectionLabel || nearbyText;
      const options = getOptions(element);

      return {
        id: getStableFieldId(element, index),
        name: element.getAttribute("name") || "",
        fieldLabel,
        placeholder: compactLabel(element.getAttribute("placeholder") || ""),
        ariaLabel: compactLabel(element.getAttribute("aria-label") || ""),
        sectionLabel,
        nearbyText,
        options,
        required:
          element.required ||
          element.getAttribute("aria-required") === "true" ||
          /\*/.test(`${fieldLabel} ${sectionLabel}`),
        tagName: element.tagName.toLowerCase(),
        fieldType:
          element.getAttribute("type") || element.tagName.toLowerCase(),
      };
    });

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "DETECT_FIELDS") {
    sendResponse({
      url: window.location.href,
      pageTitle: document.title,
      platform: getPlatform(),
      fields: detectFields(),
    });
  }

  return true;
});
