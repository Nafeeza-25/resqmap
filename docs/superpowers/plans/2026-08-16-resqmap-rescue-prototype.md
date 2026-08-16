# ResQMap Rescue Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Turn the current frontend into a user-friendly, working black–orange–red ResQMap prototype that visibly demonstrates the report-to-verification-to-human-decision workflow.

**Architecture:** Preserve the current React routes, repository hooks, and Leaflet behavior. Add one reusable ResponseStage component through PageHeader, strengthen shared theme tokens and icon-led components, then tune each prototype screen around the approved demo journey.

**Tech Stack:** React 18, React Router 6, Tailwind CSS 3, Lucide React, React Leaflet, Vite, Vitest.

## Global Constraints

- Preserve all current routes, mock data, and repository actions.
- Use matte black #090909, rescue orange #F97316, critical red #EF4444, warm white #FFF7ED, and verified green #4ADE80.
- Red communicates only critical danger or contradiction.
- Icons clarify text labels and never replace them.
- Keep 44px touch targets, visible focus, responsive layouts, and reduced-motion support.
- Do not add external APIs, autonomous dispatch, or unsupported performance claims.

---

### Task 1: Add the reusable rescue workflow signal

**Files:**

- Create: frontend/src/components/ResponseStage.jsx
- Modify: frontend/src/components/PageHeader.jsx
- Modify: frontend/tests/app.smoke.test.jsx

**Interfaces:**

- ResponseStage consumes stage with one of report, verify, or decide.
- PageHeader accepts stage and renders ResponseStage below the title row.

- [ ] Step 1: Add a smoke assertion for Report received, Verify evidence, and Human decision.
- [ ] Step 2: Run npm run test:ui and confirm failure because the stages are absent.
- [ ] Step 3: Implement ResponseStage with Radio, ScanSearch, and ShieldCheck icons plus accessible text.
- [ ] Step 4: Pass stage through PageHeader and verify npm run test:ui.

### Task 2: Apply the rescue theme and icon-led shell

**Files:**

- Modify: frontend/src/styles/app.css
- Modify: frontend/src/components/AppShell.jsx
- Modify: frontend/src/components/ReportCard.jsx
- Modify: frontend/src/components/IncidentPriorityCard.jsx

**Interfaces:**

- Shared classes consume the existing rq token utilities.
- AppShell preserves NavLink destinations and Outlet rendering.

- [ ] Step 1: Add assertions for Incoming reports, Verify, Map, and History navigation labels.
- [ ] Step 2: Run the smoke test and confirm the desired rescue signal assertion remains red.
- [ ] Step 3: Set approved tokens, orange active navigation, red conflict states, solid surfaces, and responsive behavior.
- [ ] Step 4: Add meaningful report/source/location/action icons while keeping text labels.
- [ ] Step 5: Run npm run test:ui and npm run build.

### Task 3: Connect every working prototype page to the demo journey

**Files:**

- Modify: frontend/src/pages/DashboardPage.jsx
- Modify: frontend/src/pages/IncomingReportsPage.jsx
- Modify: frontend/src/pages/ReviewQueuePage.jsx
- Modify: frontend/src/pages/IncidentDetailPage.jsx
- Modify: frontend/src/pages/IntelligencePage.jsx
- Modify: frontend/src/pages/DecisionPage.jsx
- Modify: frontend/src/pages/AuditHistoryPage.jsx
- Modify: frontend/src/pages/MapPage.jsx

**Interfaces:**

- PageHeader stage values are report for Incoming Reports, verify for Review and Intelligence, and decide for Decision and Audit.
- Existing hooks, route params, repository mutations, and map selection behavior remain unchanged.

- [ ] Step 1: Add page-stage props and plain-language subtitles describing the next operator action.
- [ ] Step 2: Keep source evidence, contradiction, confidence, recommendation, approval, and audit information visible.
- [ ] Step 3: Use icon-led section labels and empty states without changing data behavior.
- [ ] Step 4: Run npm run test:ui and npm run build.

### Task 4: Final accessibility and repository verification

**Files:**

- Modify: frontend/src/styles/app.css
- Modify: frontend/tests/app.smoke.test.jsx

**Interfaces:**

- Consumes all classes and component output from Tasks 1–3.
- Produces the final responsive, keyboard-accessible prototype.

- [ ] Step 1: Verify focus-visible, reduced-motion, icon aria behavior, and mobile stacking in CSS.
- [ ] Step 2: Run npm run test:ui and npm run build.
- [ ] Step 3: Run npm run test:all and distinguish frontend results from known backend fixture failures.
- [ ] Step 4: Inspect the final diff without modifying unrelated worktree changes.
