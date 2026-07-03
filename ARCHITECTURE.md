# Architecture

## Product Shape

Caffeine Job Copilot has two halves:

- **Extension:** reads the current ATS page, detects fields, proposes fill values, and asks the user to review.
- **Backend:** stores the living resume, answer bank, application history, and role-specific drafts.

This repo starts with both halves locally so the project can be pushed to GitHub and iterated without waiting on a deployed Caffeine app.

## Current Flow

1. The content script scans visible form fields.
2. The popup verifies the backend is reachable.
3. The extension can request a draft from `/api/draft`.
4. The backend returns field suggestions using mocked profile data.
5. The extension shows a review panel before filling anything.

## Future Caffeine Contract

The local backend should later become a Caffeine-hosted API with endpoints like:

- `GET /api/profile`
- `GET /api/answers`
- `POST /api/draft`
- `POST /api/applications`

The extension should keep depending on this contract, not on Caffeine implementation details.

## Adapter Strategy

The first adapters should be:

1. Generic forms
2. Greenhouse
3. Lever
4. Ashby
5. Workable
6. SmartRecruiters
7. Workday
8. iCIMS
9. Oracle Taleo

Enterprise ATS support should reuse the same review-first flow, even when field detection becomes site-specific.
