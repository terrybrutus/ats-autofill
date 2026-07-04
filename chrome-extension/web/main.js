const health = document.querySelector("#health");
const profile = document.querySelector("#profile");

const loadDashboard = async () => {
  const healthResponse = await fetch("/api/health");
  const healthData = await healthResponse.json();
  health.textContent = healthData.ok
    ? "Connected at /api/health"
    : "Backend unavailable";

  const profileResponse = await fetch("/api/profile");
  const profileData = await profileResponse.json();
  profile.textContent = `${profileData.identity.fullName} - ${profileData.identity.location}`;
};

loadDashboard().catch((error) => {
  health.textContent = "Could not reach local backend.";
  profile.textContent =
    error instanceof Error ? error.message : "Unknown error";
});
