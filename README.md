# Caffeine Job Copilot

Exported from Caffeine project: ATS Autofill.

A small starter repo for a review-first Chrome extension that helps fill job applications from a living resume.

This first version intentionally keeps the backend simple. It gives us something real to push to GitHub, inspect, and evolve before wiring a full Caffeine AI backend.

## What Is Included

- A tiny Node HTTP backend with mocked profile, answer-bank, job-draft, and application-history APIs.
- A local web dashboard at `http://localhost:4321`.
- A Manifest V3 Chrome extension skeleton in `extension/`.
- A content script that detects fields and proposes a review-before-fill draft.
- A popup that calls the backend and shows connection/profile state.
- Shared schemas and ATS field detection utilities.
- Node tests for the schema and field-mapping logic.
- Biome and TypeScript config for linting/type-checking once dependencies are installed.

## Commands

```bash
npm install
npm run dev
npm test
npm run build
npm run typecheck
npm run lint
```

The backend uses only Node built-ins, so `npm run dev` and `npm test` work without downloading runtime dependencies. `typecheck`, `lint`, and `format` require `npm install`.

## Load The Extension

1. Run `npm run build`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Click **Load unpacked**.
5. Select the generated `dist/extension` folder.
6. Keep the backend running with `npm run dev` so the popup can call `http://localhost:4321`.

## Safety Principles

- The extension does not auto-submit applications.
- Generated or stored answers are shown for review first.
- Sensitive fields should stay manual-confirm by default.
- The backend is local and mocked until the real Caffeine API contract is ready.

## Next Milestones

1. Tighten the living resume schema.
2. Add real ATS adapters for Greenhouse, Lever, Ashby, Workable, Workday, and iCIMS.
3. Build an editable answer bank.
4. Connect to the real Caffeine AI backend.
5. Add authenticated sync and application tracking.
