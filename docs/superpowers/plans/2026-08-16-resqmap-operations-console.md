# ResQMap Operations Console Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign ResQMap as a responsive dark emergency-operations console while preserving existing routes, data behavior, and user-owned worktree changes.

**Architecture:** Reuse the existing React pages, components, and Tailwind/CSS token system. Establish the shared visual system through the shell and CSS first, then apply it to the Command Center and workflow pages without changing API, routing, or repository contracts.

**Tech Stack:** React 18, React Router 6, Tailwind CSS 3, custom CSS tokens, Lucide React, React Leaflet, Vite, Vitest.

## Global Constraints

- Preserve all current route URLs and repository/API data contracts.
- Preserve current worktree edits; touch only files required by this redesign.
- Use command black `#07090C`, graphite `#0D1117`, raised graphite `#151B23`, rescue amber `#F59E0B`, alert red `#EF4444`, verified cyan `#46D7FF`, and safe green `#34D399`.
- Reserve red for risk and conflicts; use amber for attention and verification.
- Maintain visible focus, reduced-motion support, and responsive mobile layouts.

---

### Task 1: Establish the shared operations-console shell and tokens

**Files:**

- Modify: `frontend/tailwind.config.js`
- Modify: `frontend/src/styles/app.css`
- Modify: `frontend/src/components/AppShell.jsx`
- Test: `frontend/tests/app.smoke.test.jsx`

**Interfaces:**

- Consumes: React Router `NavLink` and `Outlet`.
- Produces: responsive `.ops-shell` and `.ops-sidebar` frame, semantic `rq` colors, and accessible primary navigation.

- [ ] **Step 1: Write a failing shell smoke test**

```jsx
expect(screen.getByText('RESQMAP')).toBeInTheDocument();
expect(screen.getByLabelText('Primary navigation')).toBeInTheDocument();
expect(screen.getByText('Operational')).toBeInTheDocument();
```

- [ ] **Step 2: Run the test to capture the previous shell**

Run: `npm run test:ui`

- [ ] **Step 3: Implement the shell and command palette**

```jsx
<aside className="ops-sidebar">
  <NavLink to="/" className="ops-nav-link">Command center</NavLink>
</aside>
<main className="ops-main"><Outlet /></main>
```

Set shared tokens for graphite surfaces, amber active indicators, cyan verified states, red danger states, and an accessible amber focus ring.

- [ ] **Step 4: Verify Task 1**

Run: `npm run test:ui` and `npm run build`

- [ ] **Step 5: Commit Task 1**

```bash
git add frontend/tailwind.config.js frontend/src/styles/app.css frontend/src/components/AppShell.jsx frontend/tests/app.smoke.test.jsx
git commit -m "feat: add operations console shell"
```

### Task 2: Make the Command Center a live response workspace

**Files:**

- Modify: `frontend/src/pages/DashboardPage.jsx`
- Modify: `frontend/src/components/IncidentPriorityCard.jsx`
- Modify: `frontend/src/components/IncidentMap.jsx`
- Modify: `frontend/src/styles/app.css`
- Test: `frontend/tests/app.smoke.test.jsx`

**Interfaces:**

- Consumes: `useIncidents`, `useReports`, `repository.seedDemoData`, `IncidentMap`, and `IncidentPriorityCard`.
- Produces: live-operation strip, summary metrics, map-first workspace, and highest-priority response queue.

- [ ] **Step 1: Add failing operation-strip assertions**

```jsx
expect(screen.getByText('Live operation')).toBeInTheDocument();
expect(screen.getByText('Response queue')).toBeInTheDocument();
```

- [ ] **Step 2: Run the test to verify the assertions fail**

Run: `npm run test:ui`

- [ ] **Step 3: Implement the workspace**

```jsx
<section className="operation-strip" aria-label="Live operation status">
  <span>Live operation</span><strong>Operational</strong>
</section>
<section className="command-workspace">
  <IncidentMap incidents={incidents} height="100%" />
  <aside aria-label="Response queue">...</aside>
</section>
```

Retain empty state, seed action, sort order, and incident navigation. Label active, verification, and dispatch counts clearly.

- [ ] **Step 4: Verify Task 2**

Run: `npm run test:ui` and `npm run build`

- [ ] **Step 5: Commit Task 2**

```bash
git add frontend/src/pages/DashboardPage.jsx frontend/src/components/IncidentPriorityCard.jsx frontend/src/components/IncidentMap.jsx frontend/src/styles/app.css frontend/tests/app.smoke.test.jsx
git commit -m "feat: redesign command center workspace"
```

### Task 3: Align operational workflow pages

**Files:**

- Modify: `frontend/src/pages/IncomingReportsPage.jsx`
- Modify: `frontend/src/pages/ReviewQueuePage.jsx`
- Modify: `frontend/src/pages/MapPage.jsx`
- Modify: `frontend/src/pages/IncidentDetailPage.jsx`
- Modify: `frontend/src/pages/IntelligencePage.jsx`
- Modify: `frontend/src/pages/DecisionPage.jsx`
- Modify: `frontend/src/pages/AuditHistoryPage.jsx`
- Modify: `frontend/src/components/PageHeader.jsx`, `ReportCard.jsx`, `StatusPill.jsx`, `ConfidenceMeter.jsx`, `ConflictPanel.jsx`, `DecisionCard.jsx`, and `StatCard.jsx`
- Modify: `frontend/src/styles/app.css`
- Test: `frontend/tests/app.smoke.test.jsx`

**Interfaces:**

- Consumes: current page hooks, route params, repository actions, and existing shared-component props.
- Produces: consistent headers, evidence desk/report cards, verification states, map controls, incident workspace panels, and audit rows.

- [ ] **Step 1: Extend route-heading smoke coverage**

```jsx
expect(screen.getByRole('heading', { name: /incoming reports/i })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: /review/i })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: /disaster map/i })).toBeInTheDocument();
```

- [ ] **Step 2: Run the test to identify missing accessible headings**

Run: `npm run test:ui`

- [ ] **Step 3: Apply shared operational treatment**

```jsx
<PageHeader eyebrow="Evidence desk" title="Incoming reports" subtitle="..." />
<article className="report-card report-card--operations">...</article>
```

Keep actions, messages, and data behavior intact while improving status placement, metadata hierarchy, responsive behavior, and focus states.

- [ ] **Step 4: Verify Task 3**

Run: `npm run test:ui` and `npm run build`

- [ ] **Step 5: Commit Task 3**

```bash
git add frontend/src/pages frontend/src/components frontend/src/styles/app.css frontend/tests/app.smoke.test.jsx
git commit -m "feat: unify disaster response workflow styling"
```

### Task 4: Verify responsive and accessibility behavior

**Files:**

- Modify: `frontend/src/styles/app.css`
- Test: `frontend/tests/app.smoke.test.jsx`

**Interfaces:**

- Consumes: CSS classes from Tasks 1–3.
- Produces: mobile breakpoints, reduced-motion rules, visible focus states, and a validated frontend build.

- [ ] **Step 1: Add primary-navigation regression assertions**

```jsx
['Command center', 'Incoming reports', 'Verify', 'Map', 'History'].forEach(label => {
  expect(screen.getByText(label)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test before final CSS adjustments**

Run: `npm run test:ui`

- [ ] **Step 3: Add responsive and reduced-motion CSS**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

At small widths, stack the operation strip, map workspace, response queue, report intake form, and page controls while retaining 44px interactive targets.

- [ ] **Step 4: Run full verification**

Run: `npm run test:ui` and `npm run build`

- [ ] **Step 5: Commit final accessibility polish**

```bash
git add frontend/src/styles/app.css frontend/tests/app.smoke.test.jsx
git commit -m "fix: polish operations console accessibility"
```
