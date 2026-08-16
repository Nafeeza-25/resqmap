# ResQMap Hackathon Readiness Implementation Plan

**Goal:** Make the existing rescue prototype reliable, repeatable, and easy to present as a complete Chennai disaster-response journey.

**Architecture:** Keep the existing API-backed repository as the single state source. Repair its shared-domain imports, expose the existing deterministic reset through a guided dashboard panel, and make subscription state explicit so pages can distinguish loading, failure, and genuine empty data.

**Tech Stack:** React 18, React Router, Tailwind CSS, Express, Node test runner, Vitest and Testing Library.

---

### Task 1: Restore the backend demo repository

**Files:**
- Modify: `backend/src/repository/demoRepository.js`
- Test: `tests/domain/demoRepository.test.js`
- Test: `backend/tests/api.test.js`

1. Run the existing repository tests and confirm the import-resolution failure.
2. Correct only the repository-to-shared import paths.
3. Run the repository and API tests and confirm they pass.

### Task 2: Prove the complete Chennai response journey

**Files:**
- Modify: `tests/domain/demoRepository.test.js`

1. Add a failing journey test covering report verification, field evidence, human dispatch approval, and audit history.
2. Implement only any repository behavior missing from that journey.
3. Run the domain test and confirm the full workflow passes.

### Task 3: Add explicit loading and retry behavior

**Files:**
- Modify: `frontend/src/hooks/useRepositoryData.js`
- Create: `frontend/src/components/LoadingState.jsx`
- Create: `frontend/src/components/ErrorState.jsx`
- Modify: `frontend/src/pages/DashboardPage.jsx`
- Modify: `frontend/src/pages/IncomingReportsPage.jsx`
- Modify: `frontend/src/pages/ReviewQueuePage.jsx`
- Test: `frontend/tests/app.smoke.test.jsx`

1. Add failing UI assertions for useful loading and recovery controls.
2. Return loading state from subscriptions and provide a retry action.
3. Render accessible loading, error, and empty states on the main demo pages.
4. Run the UI test and confirm it passes.

### Task 4: Add a guided, repeatable hackathon demo

**Files:**
- Create: `frontend/src/components/DemoGuide.jsx`
- Modify: `frontend/src/pages/DashboardPage.jsx`
- Modify: `frontend/src/styles/app.css`
- Test: `frontend/tests/app.smoke.test.jsx`

1. Add failing UI assertions for the guided demo and restart control.
2. Add a compact three-step Chennai walkthrough with direct page links.
3. Connect Restart demo to the existing API reset and show success or failure feedback.
4. Run the UI test and confirm it passes.

### Task 5: Add event-day instructions and verify the prototype

**Files:**
- Create: `docs/HACKATHON_DEMO.md`

1. Document startup, a two-minute presentation flow, reset/recovery, and event setup checks.
2. Run all domain, static, backend, and frontend tests.
3. Run the production frontend build.
4. Inspect the local app at desktop and mobile widths if the development server can be launched.

