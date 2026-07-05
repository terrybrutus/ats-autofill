const health = document.querySelector("#health");
const profile = document.querySelector("#profile");
const captures = document.querySelector("#captures");

const loadDashboard = async () => {
  const healthResponse = await fetch("/api/health");
  const healthData = await healthResponse.json();
  health.textContent = healthData.ok
    ? "Connected at /api/health"
    : "Backend unavailable";

  const profileResponse = await fetch("/api/profile");
  const profileData = await profileResponse.json();
  profile.textContent = `${profileData.identity.fullName} - ${profileData.identity.location}`;

  const capturesResponse = await fetch("/api/scan-captures");
  const captureData = await capturesResponse.json();
  if (!captureData.length) {
    captures.textContent = "No captures saved yet.";
    return;
  }

  captures.innerHTML = `<ul>${captureData
    .slice(0, 10)
    .map(
      (capture) =>
        `<li><strong>${capture.fieldCount} fields</strong> from ${capture.platform} - ${capture.pageTitle || capture.url}</li>`,
    )
    .join("")}</ul>`;
};

loadDashboard().catch((error) => {
  health.textContent = "Could not reach local backend.";
  profile.textContent =
    error instanceof Error ? error.message : "Unknown error";
});
