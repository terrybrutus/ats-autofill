const status = document.querySelector("#status");
const results = document.querySelector("#results");
const scanButton = document.querySelector("#scan");
const settingsForm = document.querySelector("#settings");
const apiBaseUrlInput = document.querySelector("#apiBaseUrl");
const fillModeSelect = document.querySelector("#fillMode");
const openBackendLink = document.querySelector("#openBackend");

const defaultSettings = {
  apiBaseUrl: "http://localhost:4321",
  fillMode: "approved-answer",
};

const getSettings = async () =>
  chrome.storage.local.get(defaultSettings);

const saveSettings = async () => {
  const apiBaseUrl = apiBaseUrlInput.value.trim().replace(/\/$/, "");
  const fillMode = fillModeSelect.value;
  await chrome.storage.local.set({ apiBaseUrl, fillMode });
  openBackendLink.href = apiBaseUrl;
  await checkHealth();
};

const setStatus = (message, tone = "neutral") => {
  status.textContent = message;
  status.dataset.tone = tone;
};

const checkHealth = async () => {
  const { apiBaseUrl } = await getSettings();
  openBackendLink.href = apiBaseUrl;

  try {
    const response = await fetch(`${apiBaseUrl}/api/health`);
    const data = await response.json();
    setStatus(
      data.ok ? `Backend connected: ${apiBaseUrl}` : "Backend unavailable.",
      data.ok ? "success" : "warning",
    );
  } catch {
    setStatus(`Backend not reachable: ${apiBaseUrl}`, "warning");
  }
};

const getActiveTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const scanPage = async () => {
  const { apiBaseUrl, fillMode } = await getSettings();
  const tab = await getActiveTab();
  if (!tab?.id) {
    results.textContent = "No active tab found.";
    return;
  }

  results.textContent = "Scanning current page...";
  const page = await chrome.tabs.sendMessage(tab.id, { type: "DETECT_FIELDS" });
  const draftResponse = await fetch(`${apiBaseUrl}/api/draft`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: page.url,
      pageTitle: page.pageTitle,
      fields: page.fields,
      mode: fillMode,
      platform: "generic",
      job: {
        company: "",
        title: page.pageTitle || "",
        description: "",
      },
    }),
  });

  if (!draftResponse.ok) {
    throw new Error(`Draft request failed: ${draftResponse.status}`);
  }

  const draft = await draftResponse.json();
  const suggestions = Array.isArray(draft.suggestions)
    ? draft.suggestions
    : [];
  const reviewCount = suggestions.filter(
    (suggestion) => suggestion.requiresReview,
  ).length;

  results.innerHTML = `
    <h2>${suggestions.length} fields detected</h2>
    <p>${reviewCount} need review before fill.</p>
    <ul>
      ${suggestions
        .slice(0, 10)
        .map((suggestion) => {
          const label = suggestion.fieldLabel ?? suggestion.label ?? "Field";
          const value = suggestion.value ? `: ${suggestion.value}` : "";
          const review = suggestion.requiresReview ? " review" : "";
          return `<li><strong>${escapeHtml(label)}</strong>: ${escapeHtml(
            suggestion.kind,
          )}${escapeHtml(value)}${escapeHtml(review)}</li>`;
        })
        .join("")}
    </ul>
  `;
};

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveSettings().catch((error) => {
    setStatus(error instanceof Error ? error.message : "Settings failed.");
  });
});

scanButton.addEventListener("click", () => {
  scanPage().catch((error) => {
    results.textContent =
      error instanceof Error ? error.message : "Scan failed.";
  });
});

getSettings()
  .then((settings) => {
    apiBaseUrlInput.value = settings.apiBaseUrl;
    fillModeSelect.value = settings.fillMode;
    openBackendLink.href = settings.apiBaseUrl;
    return checkHealth();
  })
  .catch(() => {
    setStatus("Extension settings unavailable.", "warning");
  });
