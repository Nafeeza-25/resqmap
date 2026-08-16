# ResQMap Decision-First Tailwind Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the ResQMap command center immediately explain its conflict-reconciliation purpose to emergency operators and migrate application presentation to Tailwind utilities.

**Architecture:** Keep the existing API repository and domain intelligence unchanged. DashboardPage will derive a primary unresolved incident and pass it to focused presentation components; all React-owned layout and styling will move into JSX Tailwind utilities, while app.css will retain tokens, global defaults, reduced-motion behavior, and unavoidable Leaflet selectors.

**Tech Stack:** React 18, React Router 6, Tailwind CSS 3, Lucide React, Leaflet, Vitest, Testing Library, Node test runner.

## Global Constraints

- Primary audience: emergency control-room operator.
- The dominant question is `Do people still need rescue?`.
- Display urgency and evidence confidence separately.
- Preserve source text and human decision authority.
- Use Rescue Orange `#F97316`, Critical Red `#EF4444`, Verified Green `#4ADE80`, Operations Black `#090909`, and Warm Foreground `#FFF7ED` through semantic Tailwind tokens.
- Do not add gradients or new runtime dependencies.
- Keep app.css only for Tailwind directives, semantic variables, global defaults, reduced motion, referenced keyframes, and Leaflet overrides.
- Do not modify backend/domain algorithms or repository contracts.

---

### Task 1: Lock the operator-facing contract

**Files:**
- Modify: `frontend/tests/app.smoke.test.jsx`
- Modify: `tests/static/uiContract.test.js`

**Interfaces:**
- Consumes: the current command-center route at `/` and source files under `frontend/src`.
- Produces: regression requirements for operator copy and the Tailwind-only application styling boundary.

- [ ] **Step 1: Replace the presenter-guide UI test with the operator decision contract**

Add a test that renders `App` and requires these visible concepts:

```jsx
expect(screen.getByRole('heading', { name: 'Do people still need rescue?' })).toBeInTheDocument();
expect(screen.getByText('Family already rescued.')).toBeInTheDocument();
expect(screen.getByText('People are still shouting from the roof.')).toBeInTheDocument();
expect(screen.getByText('Critical urgency')).toBeInTheDocument();
expect(screen.getByText('Medium evidence confidence')).toBeInTheDocument();
expect(screen.getByText('Confirm current rescue status')).toBeInTheDocument();
expect(screen.getByRole('link', { name: 'Verify rescue status' })).toBeInTheDocument();
```

- [ ] **Step 2: Change the reset interaction contract**

Spy on `repository.resetDemo`, click `Reset scenario`, and require `Training scenario restored.`.

- [ ] **Step 3: Add a static Tailwind boundary test**

Read `frontend/src/styles/app.css` and assert that these removed application selectors are absent:

```js
for (const selector of ['.ops-shell', '.command-page', '.demo-briefing', '.operation-strip', '.response-queue', '.prototype-page-header', '.response-stage', '.report-card']) {
  assert.equal(css.includes(selector), false, `application selector remains: ${selector}`);
}
```

Also read JSX files and require representative Tailwind utilities such as `bg-rq-bg`, `border-rq-border`, `text-rq-orange`, `lg:grid-cols`, and `focus-visible:ring-2`.

- [ ] **Step 4: Run the UI and static tests and verify RED**

Run: `npm run test:ui`

Expected: FAIL because the operator question and source conflict are not rendered.

Run: `node --test tests/static/uiContract.test.js`

Expected: FAIL because named application selectors remain in app.css.

---

### Task 2: Build the decision-first incident presentation

**Files:**
- Create: `frontend/src/components/SourceConflict.jsx`
- Create: `frontend/src/components/DecisionSignal.jsx`
- Create: `frontend/src/components/CriticalIncidentPanel.jsx`
- Modify: `frontend/src/pages/DashboardPage.jsx`
- Delete: `frontend/src/components/DemoGuide.jsx`
- Test: `frontend/tests/app.smoke.test.jsx`

**Interfaces:**
- Consumes: incident fields `id`, `title`, `locationLabel`, `reports`, `contradictions`, and `intelligence`; router paths `/review` and `/incidents/:incidentId`.
- Produces: `CriticalIncidentPanel({ incident, onReset, resetting, feedback })` and the operator-visible decision contract.

- [ ] **Step 1: Create SourceConflict**

Implement `SourceConflict({ leftClaim, rightClaim })` as a responsive two-column Tailwind section. Each claim has `source`, `timestamp`, and `text`. Render preserved text in blockquotes and place an explicit `Conflict detected` label between/above them. Use red only for the contradiction signal and borders.

- [ ] **Step 2: Create DecisionSignal**

Implement `DecisionSignal({ urgency, confidence, question, workflow })` with three compact cells:

```jsx
<span>Critical urgency</span>
<span>Medium evidence confidence</span>
<strong>Confirm current rescue status</strong>
```

Normalize enum labels for display without combining their scores.

- [ ] **Step 3: Create CriticalIncidentPanel**

Render:

- eyebrow `Critical unresolved incident · INC-21`;
- heading `Do people still need rescue?`;
- explanatory copy `Reports about the same Gandhi Street flood disagree on whether rescue is complete.`;
- SourceConflict using the rescued and trapped claims;
- DecisionSignal using the incident intelligence;
- primary link `Verify rescue status` to `/review`;
- secondary link `View full incident` to `/incidents/INC-21`;
- quiet button `Reset scenario` using `onReset`.

Use direct Tailwind utilities and no component-specific stylesheet selectors.

- [ ] **Step 4: Derive the primary incident in DashboardPage**

Choose incidents by RAPID_VERIFY workflow first, then contradiction severity, urgency score, and latest timestamp. For INC-21, map the preserved rescued/trapped reports into the explicit display claims. Fall back to contradiction statements if the reports cannot be resolved.

- [ ] **Step 5: Replace DemoGuide and generic metrics**

Remove DemoGuide from the dashboard. Place CriticalIncidentPanel immediately after PageHeader. Retain a compact operational summary only where it helps orient the operator; remove duplicate counts that compete with the unresolved decision.

- [ ] **Step 6: Update scenario state copy**

Use `Training scenario restored.`, `Scenario reset failed: …`, and `Load training scenario`.

- [ ] **Step 7: Run UI tests and verify GREEN for the operator contract**

Run: `npm run test:ui`

Expected: all UI tests pass except any later Tailwind cleanup contract still intentionally red.

---

### Task 3: Migrate shell, workflow, and state components to Tailwind

**Files:**
- Modify: `frontend/src/components/AppShell.jsx`
- Modify: `frontend/src/components/PageHeader.jsx`
- Modify: `frontend/src/components/ResponseStage.jsx`
- Modify: `frontend/src/components/LoadingState.jsx`
- Modify: `frontend/src/components/ErrorState.jsx`
- Modify: `frontend/src/components/EmptyState.jsx`
- Modify: `frontend/src/pages/DashboardPage.jsx`
- Modify: `frontend/src/pages/IncomingReportsPage.jsx`

**Interfaces:**
- Consumes: existing component props and route definitions.
- Produces: the same public component APIs with all React-owned styling expressed as Tailwind utilities.

- [ ] **Step 1: Convert AppShell**

Replace every `ops-*` class with responsive utilities. Use a top navigation below `lg` and a `lg:grid lg:grid-cols-[232px_minmax(0,1fr)]` shell at desktop. NavLink returns a complete active/inactive utility string. Preserve `aria-label="Primary navigation"` and accessible text for compact links.

- [ ] **Step 2: Convert PageHeader and workflow language**

Use Tailwind utilities in PageHeader and update the eyebrow to `Decision support · Human controlled`. ResponseStage displays `Reports received`, `Conflict detected`, `Verify critical evidence`, and `Approve response`; support four stage identifiers while retaining existing page mappings.

- [ ] **Step 3: Convert LoadingState and ErrorState**

Use Tailwind utilities for layout, icon wells, borders, typography, and buttons. Loading copy becomes `Receiving incident updates`. Error copy remains actionable and the retry button keeps its accessible name.

- [ ] **Step 4: Confirm EmptyState is Tailwind-only**

Keep its existing component API and change default operational copy only at callers.

- [ ] **Step 5: Convert remaining dashboard structure**

Replace `command-*`, `operation-*`, `response-queue`, and rescue action classes with responsive Tailwind utilities. Use `lg:grid-cols-[minmax(0,1fr)_minmax(330px,0.39fr)]` for map and queue, and a minimum map height of `430px` mobile / `630px` desktop.

- [ ] **Step 6: Replace the incoming-report primary action class**

Use an inline Tailwind button with visible focus, disabled state, and orange action color.

- [ ] **Step 7: Run UI tests**

Run: `npm run test:ui`

Expected: PASS.

---

### Task 4: Migrate shared cards and supporting control-room presentation

**Files:**
- Modify: `frontend/src/components/ReportCard.jsx`
- Modify: `frontend/src/components/IncidentPriorityCard.jsx`
- Modify: `frontend/src/components/StatusPill.jsx`
- Modify: `frontend/src/components/ConfidenceMeter.jsx`
- Modify: `frontend/src/components/ConflictPanel.jsx`
- Modify: `frontend/src/components/DecisionCard.jsx`
- Modify: `frontend/src/components/StatCard.jsx`
- Modify: `frontend/src/components/IncidentMap.jsx`

**Interfaces:**
- Consumes: existing props and domain objects.
- Produces: unchanged component APIs with Tailwind-owned presentation.

- [ ] **Step 1: Convert ReportCard**

Replace all `report-card*` selectors with utilities for a bordered charcoal article, source/time metadata, orange evidence quote rule, tag pills, and optional footer.

- [ ] **Step 2: Audit and complete existing Tailwind cards**

IncidentPriorityCard already uses utilities; remove inline cursor style, add keyboard activation for role-button behavior or use a semantic button, and make location read `locationLabel` before falling back to unknown.

- [ ] **Step 3: Convert intelligence and decision components**

Replace remaining named selectors in StatusPill, ConfidenceMeter, ConflictPanel, DecisionCard, and StatCard. Preserve exact concept terms required by static tests: `Critical contradiction`, `Urgency`, `Evidence confidence`, `Decision-critical evidence`, and `Human decision`.

- [ ] **Step 4: Limit IncidentMap CSS coupling**

Use Tailwind on React-owned map wrappers, controls, labels, and popups where possible. Keep `.incident-map` plus Leaflet-generated selectors in app.css because Leaflet owns those DOM nodes.

- [ ] **Step 5: Run UI and static tests**

Run: `npm run test:ui`

Run: `node --test tests/static/*.test.js`

Expected: UI tests pass; the stylesheet-selector test may remain red until Task 5 removes obsolete CSS.

---

### Task 5: Migrate remaining pages and prune app.css

**Files:**
- Modify: `frontend/src/pages/AuditHistoryPage.jsx`
- Modify: `frontend/src/pages/DecisionPage.jsx`
- Modify: `frontend/src/pages/IncidentDetailPage.jsx`
- Modify: `frontend/src/pages/IntelligencePage.jsx`
- Modify: `frontend/src/pages/MapPage.jsx`
- Modify: `frontend/src/pages/ReviewQueuePage.jsx`
- Modify: `frontend/src/styles/app.css`
- Modify: `frontend/tailwind.config.js`
- Test: `tests/static/uiContract.test.js`

**Interfaces:**
- Consumes: existing page routes and component contracts.
- Produces: a Tailwind-first frontend with only approved global/third-party CSS remaining.

- [ ] **Step 1: Convert page-owned named classes**

For each page, replace custom application classes with Tailwind utilities while preserving data behavior, forms, links, labels, and route actions. Keep page containers consistently bounded with `mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8`.

- [ ] **Step 2: Prune app.css**

Delete application-specific selector blocks. Retain:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { /* semantic color channels */ }
/* minimal global body/form/focus defaults */
/* Leaflet-generated DOM selectors */
@media (prefers-reduced-motion: reduce) { /* motion safety */ }
```

Do not retain `ops-*`, `command-*`, `demo-*`, `prototype-*`, `response-stage*`, `report-card*`, `panel`, `button`, or page-specific presentation selectors.

- [ ] **Step 3: Add any required Tailwind primitives**

If the loading pulse needs a named animation, add a `rescueSignal` keyframe and `signal` animation in tailwind.config.js. Keep all colors tied to existing semantic variables.

- [ ] **Step 4: Run the Tailwind boundary test and verify GREEN**

Run: `node --test tests/static/uiContract.test.js`

Expected: PASS with no removed selector found.

- [ ] **Step 5: Run all automated tests**

Run: `npm run test:all`

Expected: all domain, backend, static, and UI tests pass.

- [ ] **Step 6: Run the production build**

Run: `npm run build`

Expected: Vite exits 0 and writes the frontend bundle to `frontend/dist`.

---

### Task 6: Live operator workflow and responsive verification

**Files:**
- Modify if defects are found: files from Tasks 2–5
- Update: `docs/HACKATHON_DEMO.md`

**Interfaces:**
- Consumes: `npm run dev`, local API at `http://localhost:8787/api`, and frontend Vite URL.
- Produces: visually verified operator-first desktop and mobile experiences.

- [ ] **Step 1: Update the presentation guide**

Explain the product using the operator problem: conflicting versions of one emergency delay action. Replace references to the old Hackathon demo panel with the critical unresolved incident panel and Reset scenario control.

- [ ] **Step 2: Start the complete local prototype**

Run: `npm run dev`

Expected: API announces `ResQMap API ready at http://localhost:8787/api` and Vite prints a local frontend URL.

- [ ] **Step 3: Verify desktop at 1440 by 900**

Confirm the unresolved question, contradictory sources, urgency/confidence split, verification action, map, and response queue are visible and readable. Confirm data loads with two active incidents.

- [ ] **Step 4: Verify mobile at 390 by 844**

Confirm no horizontal overflow, source claims stack, navigation remains accessible, and Verify rescue status remains reachable.

- [ ] **Step 5: Verify reset behavior**

Click Reset scenario and require the visible live-region message `Training scenario restored.`.

- [ ] **Step 6: Run the final verification gate**

Run: `npm run test:all`

Run: `npm run build`

Expected: both commands exit 0 with no failures.

