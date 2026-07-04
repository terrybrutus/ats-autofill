const status = document.querySelector("#status");
const results = document.querySelector("#results");
const scanButton = document.querySelector("#scan");
const applyButton = document.querySelector("#apply");
const apiUrlInput = document.querySelector("#api-url");
const fillModeInput = document.querySelector("#fill-mode");

let latestSuggestions = [];

const getSettings = async () => {
  const stored = await chrome.storage.local.get(["apiBaseUrl", "fillMode"]);
  return {
    apiBaseUrl: stored.apiBaseUrl ?? apiUrlInput.value,
    fillMode: stored.fillMode ?? fillModeInput.value,
  };
};

const saveSettings = async () => {
  await chrome.storage.local.set({
    apiBaseUrl: apiUrlInput.value.replace(/\/$/, ""),
    fillMode: fillModeInput.value,
  });
};

const checkHealth = async () => {
  const { apiBaseUrl, fillMode } = await getSettings();
  apiUrlInput.value = apiBaseUrl;
  fillModeInput.value = fillMode;

  const response = await fetch(`${apiBaseUrl}/api/health`);
  const data = await response.json();
  status.textContent = data.ok ? "Backend connected." : "Backend unavailable.";
};

const getActiveTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
};

const renderSuggestions = (draft) => {
  latestSuggestions = draft.suggestions;
  applyButton.disabled = latestSuggestions.length === 0;
  results.replaceChildren();

  const heading = document.createElement("h2");
  heading.textContent = `${draft.suggestions.length} fields detected`;
  results.append(heading);

  const meta = document.createElement("p");
  meta.textContent = `${draft.platform} - ${draft.mode}`;
  results.append(meta);

  for (const suggestion of draft.suggestions) {
    const row = document.createElement("label");
    row.className = "suggestion";
    row.dataset.fieldId = suggestion.fieldId;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(suggestion.value) && !suggestion.requiresReview;
    checkbox.dataset.role = "include";

    const copy = document.createElement("span");
    copy.className = "suggestion-copy";

    const title = document.createElement("strong");
    title.textContent = suggestion.label || suggestion.kind;

    const kind = document.createElement("small");
    kind.textContent = suggestion.requiresReview
      ? `${suggestion.kind} - review required`
      : suggestion.kind;

    const value = document.createElement("input");
    value.type = "text";
    value.value = suggestion.value ?? "";
    value.placeholder = "No value drafted";
    value.dataset.role = "value";

    copy.append(title, kind, value);
    row.append(checkbox, copy);
    results.append(row);
  }
};

const scanPage = async () => {
  await saveSettings();
  const { apiBaseUrl, fillMode } = await getSettings();
  const tab = await getActiveTab();
  if (!tab?.id) {
    results.textContent = "No active tab found.";
    return;
  }

  status.textContent = "Scanning current page...";
  const page = await chrome.tabs.sendMessage(tab.id, { type: "DETECT_FIELDS" });
  const draftResponse = await fetch(`${apiBaseUrl}/api/draft`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: page.url,
      title: page.title,
      fields: page.fields,
      mode: fillMode,
      platform: page.platform ?? "generic",
    }),
  });
  const draft = await draftResponse.json();
  renderSuggestions(draft);
  status.textContent = "Review the draft before filling.";
};

const selectedSuggestions = () =>
  Array.from(results.querySelectorAll(".suggestion"))
    .filter((row) => row.querySelector('[data-role="include"]').checked)
    .map((row) => {
      const original = latestSuggestions.find(
        (suggestion) => suggestion.fieldId === row.dataset.fieldId,
      );
      return {
        ...original,
        value: row.querySelector('[data-role="value"]').value.trim(),
      };
    })
    .filter((suggestion) => suggestion.value);

const applySelected = async () => {
  const suggestions = selectedSuggestions();
  if (suggestions.length === 0) {
    status.textContent = "Select at least one drafted value first.";
    return;
  }

  const tab = await getActiveTab();
  if (!tab?.id) {
    status.textContent = "No active tab found.";
    return;
  }

  const result = await chrome.tabs.sendMessage(tab.id, {
    type: "APPLY_SUGGESTIONS",
    suggestions,
  });

  status.textContent = `Filled ${result.filled} field${
    result.filled === 1 ? "" : "s"
  }. ${result.skipped.length} skipped.`;
};

scanButton.addEventListener("click", () => {
  scanPage().catch((error) => {
    status.textContent =
      error instanceof Error ? error.message : "Scan failed.";
  });
});

applyButton.addEventListener("click", () => {
  applySelected().catch((error) => {
    status.textContent =
      error instanceof Error ? error.message : "Fill failed.";
  });
});

checkHealth().catch(() => {
  status.textContent = "Start the backend with npm run dev.";
});
