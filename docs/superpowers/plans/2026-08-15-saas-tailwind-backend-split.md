# ResQMap SaaS Tailwind + Backend Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert ResQMap to a light Tailwind SaaS dashboard and move Firebase access behind a standalone Express backend.

**Architecture:** The React/Vite application moves to `frontend/` and calls REST endpoints only. A new `backend/` Node HTTP service owns Firebase Admin/Firestore and falls back to an in-memory demo repository. Deterministic reconciliation logic is shared under `shared/` and consumed by the backend.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, React Router 6, Leaflet/React-Leaflet, Node.js HTTP server, Firebase Admin, Node test runner.

## Global Constraints
- Preserve the existing Conflict-Aware Incident Reconciler behaviors and seven operator views.
- No gradients anywhere in frontend CSS or Tailwind class names.
- Frontend may not import `firebase` or `firebase-admin`.
- Backend is the only layer that can access Firebase Admin/Firestore.
- Demo mode must work without Firebase credentials.

---

### Task 1: Lock architecture contracts with failing static tests

**Files:**
- Create: `tests/static/architectureContract.test.js`
- Modify: `package.json`

**Interfaces:**
- Consumes: repository file tree.
- Produces: executable checks for frontend/backend split, Tailwind config, no gradients, and no frontend Firebase imports.

- [ ] **Step 1: Write tests that expect `frontend/`, `backend/`, `shared/`, Tailwind config, and API client files.**
- [ ] **Step 2: Run `node --test tests/static/architectureContract.test.js` and confirm failure because the split does not exist.**
- [ ] **Step 3: Add only package/test script changes required to make the contract runnable.**
- [ ] **Step 4: Keep the contract red until Tasks 2–4 provide the implementation.**
- [ ] **Step 5: Commit the contract.**

### Task 2: Move shared deterministic domain engine

**Files:**
- Move: `src/domain/*` → `shared/domain/*`
- Move: `src/data/demoReports.js` → `shared/data/demoReports.js`
- Modify: `tests/domain/*.test.js`

**Interfaces:**
- Consumes: current pure domain functions.
- Produces: shared ESM modules importable by backend tests and runtime.

- [ ] **Step 1: Update one domain test import to `shared/` and verify it fails before moving files.**
- [ ] **Step 2: Move the domain/data files without behavior changes.**
- [ ] **Step 3: Update all domain test imports and run the full domain suite.**
- [ ] **Step 4: Confirm the current reconciliation outputs remain unchanged.**
- [ ] **Step 5: Commit shared-domain relocation.**

### Task 3: Build standalone backend with demo and Firebase Admin repositories

**Files:**
- Create: `backend/package.json`
- Create: `backend/src/app.js`
- Create: `backend/src/server.js`
- Create: `backend/src/repository/demoRepository.js`
- Create: `backend/src/repository/firebaseAdminRepository.js`
- Create: `backend/src/repository/index.js`
- Create: `backend/src/services/resqmapService.js`
- Create: `backend/tests/api.test.js`
- Create: `backend/.env.example`

**Interfaces:**
- Consumes: `shared/domain/*`, `shared/data/demoReports.js`.
- Produces: REST API under `/api` and repository methods `getState`, `createReport`, `reviewReport`, `addEvidence`, `recordDecision`.

- [ ] **Step 1: Write backend API tests against the demo repository for health/state/review/evidence/decision flows.**
- [ ] **Step 2: Run backend tests and verify failure because server modules do not exist.**
- [ ] **Step 3: Implement the minimal Node HTTP API handler and demo repository to satisfy tests.**
- [ ] **Step 4: Add Firebase Admin repository with credential-detection fallback and equivalent method signatures.**
- [ ] **Step 5: Run backend and domain tests together and commit.**

### Task 4: Move React app to `frontend/` and replace repository layer with HTTP API client

**Files:**
- Move: current Vite app files into `frontend/`.
- Create: `frontend/src/api/client.js`
- Create: `frontend/src/repository/apiRepository.js`
- Modify: `frontend/src/hooks/useRepositoryData.js`
- Remove: frontend Firebase repository/config modules.

**Interfaces:**
- Consumes: backend REST API.
- Produces: same UI data/actions expected by current pages.

- [ ] **Step 1: Update smoke/static tests to expect API repository and no Firebase imports; verify failure.**
- [ ] **Step 2: Move Vite app and update relative imports/config paths.**
- [ ] **Step 3: Implement API client methods matching existing hook actions.**
- [ ] **Step 4: Remove direct Firebase SDK usage from frontend.**
- [ ] **Step 5: Run static/domain/backend tests and commit.**

### Task 5: Install/configure Tailwind and rebuild AppShell visual system

**Files:**
- Create: `frontend/tailwind.config.js`
- Create: `frontend/postcss.config.js`
- Replace: `frontend/src/styles/app.css`
- Modify: `frontend/src/components/AppShell.jsx`
- Modify: `frontend/src/components/StatusPill.jsx`
- Modify: `frontend/src/components/StatCard.jsx`

**Interfaces:**
- Consumes: existing routes/navigation/state.
- Produces: light SaaS shell and reusable semantic card/badge primitives.

- [ ] **Step 1: Add/update static tests for Tailwind directives and forbidden gradient tokens.**
- [ ] **Step 2: Add Tailwind dependencies/configuration and minimal global base CSS.**
- [ ] **Step 3: Restyle sidebar/topbar/content shell using Tailwind classes only.**
- [ ] **Step 4: Restyle shared cards/badges/buttons with flat light surfaces and semantic colors.**
- [ ] **Step 5: Run architecture/static checks and commit.**

### Task 6: Restyle all seven operator views in consistent SaaS patterns

**Files:**
- Modify: `frontend/src/pages/*.jsx`
- Modify: `frontend/src/components/ConflictPanel.jsx`
- Modify: `frontend/src/components/DecisionCard.jsx`
- Modify: `frontend/src/components/ConfidenceMeter.jsx`
- Modify: `frontend/src/components/ReportCard.jsx`
- Modify: `frontend/src/components/IncidentMap.jsx`

**Interfaces:**
- Consumes: AppShell primitives and existing page data.
- Produces: responsive light SaaS dashboard views with no gradients.

- [ ] **Step 1: Extend UI contract tests to verify required screen copy/routes remain.**
- [ ] **Step 2: Convert page layouts to Tailwind grid/flex/table/card patterns.**
- [ ] **Step 3: Replace old custom class styling with Tailwind utility classes.**
- [ ] **Step 4: Ensure map containers, forms, conflict/evidence states, and decision controls remain usable on narrow widths.**
- [ ] **Step 5: Run all available tests and commit.**

### Task 7: Root scripts, documentation, and final verification

**Files:**
- Modify: root `package.json`
- Modify: `README.md`
- Modify: `.gitignore`
- Create: `.env.example` if needed for frontend API URL.

**Interfaces:**
- Consumes: frontend/backend packages.
- Produces: clear local startup commands for both services.

- [ ] **Step 1: Add root scripts `dev:frontend`, `dev:backend`, `test`, and `build:frontend`.**
- [ ] **Step 2: Document backend Firebase Admin environment variables and frontend API base URL.**
- [ ] **Step 3: Run domain, backend, static architecture, and UI contract tests.**
- [ ] **Step 4: Run frontend build if dependencies can be installed; otherwise record the exact environment limitation.**
- [ ] **Step 5: Commit docs/scripts and create the downloadable archive.**
