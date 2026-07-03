const status = document.querySelector("#status");
const results = document.querySelector("#results");
const scanButton = document.querySelector("#scan");
const apiBaseUrl = "http://localhost:4321";

const checkHealth = async () => {
  const response = await fetch(`${apiBaseUrl}/api/health`);
  const data = await response.json();
  status.textContent = data.ok ? "Backend connected." : "Backend unavailable.";
};

const getActiveTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
};

const scanPage = async () => {
  const tab = await getActiveTab();
  if (!tab?.id) {
    results.textContent = "No active tab found.";
    return;
  }

  const page = await chrome.tabs.sendMessage(tab.id, { type: "DETECT_FIELDS" });
  const draftResponse = await fetch(`${apiBaseUrl}/api/draft`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: page.url,
      fields: page.fields,
      mode: "approved-answer",
      platform: "generic",
    }),
  });
  const draft = await draftResponse.json();
  const reviewCount = draft.suggestions.filter(
    (suggestion) => suggestion.requiresReview,
  ).length;
  results.innerHTML = `
    <h2>${draft.suggestions.length} fields detected</h2>
    <p>${reviewCount} need review before fill.</p>
    <ul>
      ${draft.suggestions
        .slice(0, 8)
        .map(
          (suggestion) =>
            `<li><strong>${suggestion.label}</strong>: ${suggestion.kind}</li>`,
        )
        .join("")}
    </ul>
  `;
};

scanButton.addEventListener("click", () => {
  scanPage().catch((error) => {
    results.textContent =
      error instanceof Error ? error.message : "Scan failed.";
  });
});

checkHealth().catch(() => {
  status.textContent = "Start the backend with npm run dev.";
});
