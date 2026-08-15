# ResQMap Government Operations UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign every ResQMap operator screen into a polished, responsive government emergency-operations interface while preserving all routes, domain behavior, repository boundaries, auditability, and Leaflet map behavior.

**Architecture:** Keep the existing React/Vite/Tailwind application and backend unchanged. Add a small shadcn-style primitive layer built on Tailwind/Radix, Lucide icons, and Motion; then refactor the shell and existing domain components incrementally so every page shares the same semantic tokens, interaction patterns, and responsive behavior. Keep Leaflet and enhance the existing incident map rather than migrating map engines.

**Tech Stack:** React 18, Vite 5, React Router 6, Tailwind CSS 3, Radix UI primitives, shadcn-style JavaScript components, Lucide React, Motion for React, React-Leaflet 4, Leaflet 1.9, Vitest, Testing Library.

## Global Constraints

- Preserve all current ResQMap behavior and current routes.
- Preserve LINK / CREATE / HOLD human review.
- Preserve urgency and evidence confidence as separate concepts.
- Preserve contradictions and source attribution.
- Preserve audit history.
- Preserve server-side Firebase ownership; frontend may only use the HTTP repository boundary.
- Do not add autonomous dispatch language or behavior.
- No gradients anywhere in frontend source.
- Critical red is reserved for operational danger/conflict, not general decoration.
- Keep Tailwind CSS as the single styling system; do not introduce MUI.
- Keep Leaflet + React-Leaflet during this redesign.
- Motion must respect `prefers-reduced-motion` and remain restrained.
- The supplied archive has no `.git` metadata. Commit commands below are for the real repository; archive execution should skip commits and produce a revised ZIP instead.

---

## File Structure

### New files

- `frontend/src/lib/utils.js` — `cn()` class-merging helper used by all primitives.
- `frontend/src/components/ui/Button.jsx` — semantic button primitive with variants and loading-safe states.
- `frontend/src/components/ui/Badge.jsx` — semantic compact badge primitive.
- `frontend/src/components/ui/Card.jsx` — card/header/content primitives.
- `frontend/src/components/ui/Separator.jsx` — accessible separator primitive.
- `frontend/src/components/ui/Sheet.jsx` — Radix Dialog-backed mobile navigation sheet.
- `frontend/src/components/ui/Tooltip.jsx` — Radix tooltip wrapper for icon-only controls.
- `frontend/src/components/PageHeader.jsx` — shared page title, eyebrow, description, actions, and trailing status region.
- `frontend/src/components/SectionHeader.jsx` — shared section heading/action layout.
- `frontend/src/components/MetricCard.jsx` — icon-aware dashboard/incident metric card.
- `frontend/src/components/StatusBadge.jsx` — semantic status renderer replacing `StatusPill` usage incrementally.
- `frontend/src/components/EmptyState.jsx` — consistent empty state with optional action.
- `frontend/src/components/IncidentListItem.jsx` — reusable incident row/card for dashboard and map rail.
- `frontend/src/components/MapIncidentRail.jsx` — selectable incident detail rail for the map page.
- `frontend/tests/navigation.test.jsx` — responsive app-shell/navigation behavior.
- `frontend/tests/statusBadge.test.jsx` — semantic label/tone regression tests.
- `frontend/tests/dashboard.test.jsx` — dashboard operations-header regression tests.
- `frontend/tests/mapPage.test.jsx` — map rail/filter interaction regression tests.

### Modified files

- `frontend/package.json` — add UI/motion/icon dependencies.
- `frontend/tailwind.config.js` — semantic token colors, radii, shadows, animation-safe utility extensions.
- `frontend/src/styles/app.css` — CSS variables, base styles, Leaflet overrides, legacy class compatibility during migration.
- `frontend/src/components/AppShell.jsx` — responsive sidebar, mobile sheet, icon navigation, topbar.
- `frontend/src/components/StatCard.jsx` — compatibility wrapper around `MetricCard` or final removal after page migration.
- `frontend/src/components/StatusPill.jsx` — compatibility wrapper around `StatusBadge` until all imports migrate.
- `frontend/src/components/ReportCard.jsx` — evidence-first report card styling and metadata hierarchy.
- `frontend/src/components/ConflictPanel.jsx` — stronger contradiction/source presentation.
- `frontend/src/components/ConfidenceMeter.jsx` — semantic confidence visualization.
- `frontend/src/components/DecisionCard.jsx` — calmer operator decision hierarchy and busy states.
- `frontend/src/components/IncidentMap.jsx` — urgency-aware marker styling and selected incident behavior.
- `frontend/src/pages/DashboardPage.jsx` — operations overview layout.
- `frontend/src/pages/IncomingReportsPage.jsx` — structured intake workspace.
- `frontend/src/pages/ReviewQueuePage.jsx` — triage decision workspace.
- `frontend/src/pages/IncidentDetailPage.jsx` — incident/conflict workspace.
- `frontend/src/pages/IntelligencePage.jsx` — urgency/confidence and evidence-routing layout.
- `frontend/src/pages/DecisionPage.jsx` — human approval workspace.
- `frontend/src/pages/MapPage.jsx` — map + filters + incident rail.
- `frontend/src/pages/AuditHistoryPage.jsx` — operational audit timeline.
- `tests/static/uiContract.test.js` — add app-wide design-system contracts without weakening existing route/concept checks.

---

### Task 1: Establish UI dependencies, semantic tokens, and class utilities

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/tailwind.config.js`
- Modify: `frontend/src/styles/app.css`
- Create: `frontend/src/lib/utils.js`
- Modify: `tests/static/uiContract.test.js`

**Interfaces:**
- Consumes: existing Tailwind pipeline and `frontend/src/styles/app.css` import from `main.jsx`.
- Produces: `cn(...inputs): string`, semantic Tailwind colors backed by CSS variables, shared radius/shadow tokens, and installed packages used by later tasks.

- [ ] **Step 1: Add a failing static contract for semantic tokens and no competing UI framework**

Append to `tests/static/uiContract.test.js`:

```js
test('frontend uses the ResQMap semantic theme without MUI or gradients', async () => {
  const config = await source('frontend/tailwind.config.js');
  const css = await source('frontend/src/styles/app.css');
  const pkg = JSON.parse(await source('frontend/package.json'));
  for (const token of ['background', 'foreground', 'card', 'muted', 'border', 'primary', 'warning', 'success']) {
    assert.ok(config.includes(token), `missing semantic token ${token}`);
  }
  assert.ok(css.includes('--background'));
  assert.equal(Boolean(pkg.dependencies?.['@mui/material']), false);
  assert.equal(/gradient/i.test(css), false);
});
```

- [ ] **Step 2: Run the contract and verify it fails**

Run: `npm test -- --test-name-pattern="semantic theme"`

Expected: FAIL because semantic tokens do not exist yet.

- [ ] **Step 3: Add UI dependencies**

Update `frontend/package.json` dependencies with:

```json
{
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-tooltip": "^1.2.8",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-react": "^0.468.0",
  "motion": "^12.23.12",
  "tailwind-merge": "^2.6.0"
}
```

Then run `npm install` from the repository root.

- [ ] **Step 4: Create the class helper**

Create `frontend/src/lib/utils.js`:

```js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 5: Add semantic Tailwind tokens**

Refactor `frontend/tailwind.config.js` so `theme.extend.colors` exposes `background`, `foreground`, `card`, `muted`, `border`, `primary`, `destructive`, `warning`, `success`, `info`, and `ring` through `hsl(var(--token))`. Keep the existing font family and add operational shadow/radius tokens only; do not add gradients.

Core shape:

```js
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
  muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
  border: 'hsl(var(--border))',
  primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
  destructive: 'hsl(var(--destructive))',
  warning: 'hsl(var(--warning))',
  success: 'hsl(var(--success))',
  info: 'hsl(var(--info))',
  ring: 'hsl(var(--ring))'
}
```

- [ ] **Step 6: Define the government-operations palette in CSS variables**

At the start of `@layer base` in `frontend/src/styles/app.css`, define:

```css
:root {
  --background: 210 33% 98%;
  --foreground: 215 42% 15%;
  --card: 0 0% 100%;
  --card-foreground: 215 42% 15%;
  --muted: 210 25% 96%;
  --muted-foreground: 215 15% 43%;
  --border: 214 24% 89%;
  --primary: 211 75% 36%;
  --primary-foreground: 0 0% 100%;
  --destructive: 0 67% 42%;
  --warning: 36 82% 40%;
  --success: 160 68% 30%;
  --info: 190 70% 30%;
  --ring: 211 75% 45%;
}
```

Update base body/focus styles to consume these semantic classes while retaining legacy component classes temporarily.

- [ ] **Step 7: Run static tests and build**

Run: `npm test && npm run build`

Expected: PASS.

- [ ] **Step 8: Commit in a real git checkout**

```bash
git add frontend/package.json package-lock.json frontend/tailwind.config.js frontend/src/styles/app.css frontend/src/lib/utils.js tests/static/uiContract.test.js
git commit -m "feat(ui): establish ResQMap operations theme"
```

---

### Task 2: Build reusable UI primitives and semantic status components

**Files:**
- Create: `frontend/src/components/ui/Button.jsx`
- Create: `frontend/src/components/ui/Badge.jsx`
- Create: `frontend/src/components/ui/Card.jsx`
- Create: `frontend/src/components/ui/Separator.jsx`
- Create: `frontend/src/components/ui/Sheet.jsx`
- Create: `frontend/src/components/ui/Tooltip.jsx`
- Create: `frontend/src/components/StatusBadge.jsx`
- Create: `frontend/src/components/MetricCard.jsx`
- Create: `frontend/src/components/PageHeader.jsx`
- Create: `frontend/src/components/SectionHeader.jsx`
- Create: `frontend/src/components/EmptyState.jsx`
- Modify: `frontend/src/components/StatusPill.jsx`
- Modify: `frontend/src/components/StatCard.jsx`
- Create: `frontend/tests/statusBadge.test.jsx`

**Interfaces:**
- Consumes: `cn()` and semantic Tailwind tokens from Task 1.
- Produces: shared UI primitives and domain presentation components consumed by Tasks 3–8.

- [ ] **Step 1: Write a failing StatusBadge regression test**

Create `frontend/tests/statusBadge.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import StatusBadge from '../src/components/StatusBadge.jsx';

test('renders workflow labels with semantic status data', () => {
  render(<StatusBadge value="RAPID_VERIFY" />);
  expect(screen.getByText('RAPID VERIFY')).toHaveAttribute('data-tone', 'warning');
});

test('reserves danger tone for critical operational status', () => {
  render(<StatusBadge value="CRITICAL" />);
  expect(screen.getByText('CRITICAL')).toHaveAttribute('data-tone', 'danger');
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm --prefix frontend exec vitest run tests/statusBadge.test.jsx`

Expected: FAIL because `StatusBadge.jsx` does not exist.

- [ ] **Step 3: Implement primitives using shadcn-style patterns**

Use `forwardRef`, Radix Slot where polymorphism is useful, CVA for button/badge variants, and `cn()` for merging. Button variants must include `default`, `secondary`, `outline`, `ghost`, and `danger`; sizes must include `sm`, `default`, and `icon`. Sheet must wrap Radix Dialog and expose `Sheet`, `SheetTrigger`, `SheetContent`, `SheetClose`, `SheetTitle`.

- [ ] **Step 4: Implement `StatusBadge` with one status-to-tone map**

The map must include at least:

```js
const STATUS_META = {
  CRITICAL: ['CRITICAL', 'danger'],
  HIGH: ['HIGH', 'danger'],
  MEDIUM: ['MEDIUM', 'warning'],
  LOW: ['LOW', 'neutral'],
  RAPID_VERIFY: ['RAPID VERIFY', 'warning'],
  DISPATCH_FOR_APPROVAL: ['DISPATCH FOR APPROVAL', 'info'],
  STANDARD_QUEUE: ['STANDARD QUEUE', 'neutral'],
  MONITOR: ['MONITOR', 'neutral'],
  LINK: ['LINK', 'info'],
  CREATE: ['CREATE', 'success'],
  HOLD: ['HOLD', 'warning'],
  active: ['Active', 'success'],
  review: ['Review', 'warning'],
  linked: ['Linked', 'success']
};
```

Render `data-tone={resolvedTone}` for testability and accessibility debugging.

- [ ] **Step 5: Add compatibility wrappers**

Make `StatusPill` render `StatusBadge`, preserving the current `{ value, tone }` API. Make `StatCard` render `MetricCard`, preserving `{ label, value, hint, accent }` so pages can migrate incrementally without behavior changes.

- [ ] **Step 6: Run primitive tests and existing UI smoke test**

Run: `npm --prefix frontend exec vitest run tests/statusBadge.test.jsx tests/app.smoke.test.jsx`

Expected: PASS.

- [ ] **Step 7: Commit in a real git checkout**

```bash
git add frontend/src/components frontend/src/lib frontend/tests/statusBadge.test.jsx
git commit -m "feat(ui): add reusable operations primitives"
```

---

### Task 3: Redesign the responsive application shell

**Files:**
- Modify: `frontend/src/components/AppShell.jsx`
- Modify: `frontend/src/styles/app.css`
- Create: `frontend/tests/navigation.test.jsx`

**Interfaces:**
- Consumes: `Button`, `Sheet`, `Tooltip`, semantic tokens, Lucide icons.
- Produces: desktop 256px navigation rail, mobile sheet navigation, sticky operator topbar, active route state.

- [ ] **Step 1: Write failing navigation tests**

Create `frontend/tests/navigation.test.jsx` and render `AppShell` inside a `MemoryRouter` + nested test route. Assert that:

```jsx
expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();
expect(screen.getByRole('button', { name: 'Open navigation' })).toBeInTheDocument();
expect(screen.getByText('Decision Intelligence')).toBeInTheDocument();
expect(screen.getByText('System operational')).toBeInTheDocument();
```

- [ ] **Step 2: Run the test and verify the new controls are missing**

Run: `npm --prefix frontend exec vitest run tests/navigation.test.jsx`

Expected: FAIL on mobile navigation/system status assertions.

- [ ] **Step 3: Refactor `AppShell` navigation data to icon-aware objects**

Use Lucide `LayoutDashboard`, `Inbox`, `GitMerge`, `Map`, and `ScrollText`. Keep route destinations exactly `/`, `/reports`, `/review`, `/map`, `/audit`.

- [ ] **Step 4: Implement desktop sidebar and mobile Sheet using the same navigation renderer**

Desktop rail is hidden below `lg`; mobile topbar shows the `Open navigation` icon button. Active items use `NavLink` `isActive`. The bottom status area must say `System operational` and `API-connected workspace` without claiming external responder connectivity.

- [ ] **Step 5: Add restrained route content motion**

Wrap `<Outlet />` in a Motion container keyed by `location.pathname`, with approximately 180ms opacity + 8px vertical translate and `useReducedMotion()` to disable transform for reduced-motion users.

- [ ] **Step 6: Run navigation, smoke, static tests, and build**

Run: `npm --prefix frontend exec vitest run tests/navigation.test.jsx tests/app.smoke.test.jsx && npm test && npm run build`

Expected: PASS.

- [ ] **Step 7: Commit in a real git checkout**

```bash
git add frontend/src/components/AppShell.jsx frontend/src/styles/app.css frontend/tests/navigation.test.jsx
git commit -m "feat(ui): redesign responsive app shell"
```

---

### Task 4: Convert the dashboard into an operations overview

**Files:**
- Modify: `frontend/src/pages/DashboardPage.jsx`
- Create: `frontend/src/components/IncidentListItem.jsx`
- Create: `frontend/tests/dashboard.test.jsx`

**Interfaces:**
- Consumes: existing `useReports`, `useIncidents`, `useAudit`, repository seed behavior, `PageHeader`, `MetricCard`, `StatusBadge`, `IncidentListItem`, Lucide icons.
- Produces: operations-first overview preserving all existing dashboard counts and demo seed action.

- [ ] **Step 1: Write a failing dashboard copy/layout regression test**

Mock repository hooks with empty arrays and render `DashboardPage`. Assert:

```jsx
expect(screen.getByText('Incident intelligence')).toBeInTheDocument();
expect(screen.getByText('Operations overview')).toBeInTheDocument();
expect(screen.getByRole('link', { name: /Review queue/i })).toHaveAttribute('href', '/review');
expect(screen.getByRole('link', { name: /Open live map/i })).toHaveAttribute('href', '/map');
expect(screen.queryByText('From conflicting reports to auditable human decisions.')).not.toBeInTheDocument();
```

- [ ] **Step 2: Run test and verify the marketing hero causes failure**

Run: `npm --prefix frontend exec vitest run tests/dashboard.test.jsx`

Expected: FAIL until the hero is replaced.

- [ ] **Step 3: Replace the hero with `PageHeader`**

Use eyebrow `Operations overview`, title `Incident intelligence`, concise description about reconstructing source-linked incidents, and two actions: `Review queue` and `Open live map`.

- [ ] **Step 4: Render four icon-aware `MetricCard`s**

Preserve calculations exactly: reports length, review/hold count, critical urgency count, total contradiction count. Use neutral/info for report/review cards, danger only for critical/conflict.

- [ ] **Step 5: Promote `Operator attention` and demote the demo walkthrough**

Use `IncidentListItem` for incident navigation with title, location, urgency, confidence, workflow, and contradiction/source metadata when available. Keep the eight-step walkthrough but present it as a compact lower-priority process strip.

- [ ] **Step 6: Preserve zero-data seed behavior using `EmptyState`**

The existing `repository.seedDemoData()` behavior must remain unchanged.

- [ ] **Step 7: Run dashboard/UI/static tests and build**

Run: `npm --prefix frontend exec vitest run tests/dashboard.test.jsx tests/app.smoke.test.jsx && npm test && npm run build`

Expected: PASS.

- [ ] **Step 8: Commit in a real git checkout**

```bash
git add frontend/src/pages/DashboardPage.jsx frontend/src/components/IncidentListItem.jsx frontend/tests/dashboard.test.jsx
git commit -m "feat(ui): create operations overview dashboard"
```

---

### Task 5: Redesign incoming reports and LINK / CREATE / HOLD review

**Files:**
- Modify: `frontend/src/pages/IncomingReportsPage.jsx`
- Modify: `frontend/src/pages/ReviewQueuePage.jsx`
- Modify: `frontend/src/components/ReportCard.jsx`
- Modify: `frontend/src/styles/app.css`
- Modify: `frontend/tests/app.smoke.test.jsx`

**Interfaces:**
- Consumes: current report submission/link-decision repository calls and current report data model.
- Produces: evidence-first intake cards and human triage workspace without changing backend actions.

- [ ] **Step 1: Extend smoke coverage for safety-critical copy**

Add route-targeted renders/mocks that verify `Original report text`, `No silent merge.`, and all three action labels `LINK`, `CREATE`, `HOLD` remain visible.

- [ ] **Step 2: Run UI tests before refactor**

Run: `npm --prefix frontend run test:ui`

Expected: PASS baseline; this is a characterization step before visual refactoring.

- [ ] **Step 3: Refactor incoming reports into a structured intake workspace**

Use `PageHeader`, a bordered Card for the form, compact two-column channel/language controls above the source textarea, a submission footer with the demo-location note, disabled/loading icon state, and a responsive list of `ReportCard`s. Preserve the exact `repository.submitReport(...)` payload.

- [ ] **Step 4: Refactor `ReportCard` hierarchy**

Show report ID/source/channel/time in the header, source text as the dominant content, and evidence/status metadata as compact badges. Do not truncate or rewrite original report text.

- [ ] **Step 5: Refactor review queue into evidence + decision regions**

Each queued report keeps its source content, recommendation, numeric score, reasons, and three explicit human actions. Use primary emphasis for LINK only as an action style, not as proof the recommendation is correct; CREATE is outline/secondary; HOLD uses warning/ghost treatment. Preserve `applyLinkDecision({ reportId, decision, incidentId: 'INC-21', operator: 'Demo Operator' })` exactly.

- [ ] **Step 6: Run UI/static tests and build**

Run: `npm run test:all && npm run build`

Expected: PASS.

- [ ] **Step 7: Commit in a real git checkout**

```bash
git add frontend/src/pages/IncomingReportsPage.jsx frontend/src/pages/ReviewQueuePage.jsx frontend/src/components/ReportCard.jsx frontend/src/styles/app.css frontend/tests/app.smoke.test.jsx
git commit -m "feat(ui): redesign evidence intake and review"
```

---

### Task 6: Redesign incident, intelligence, and human-decision views

**Files:**
- Modify: `frontend/src/pages/IncidentDetailPage.jsx`
- Modify: `frontend/src/pages/IntelligencePage.jsx`
- Modify: `frontend/src/pages/DecisionPage.jsx`
- Modify: `frontend/src/components/ConflictPanel.jsx`
- Modify: `frontend/src/components/ConfidenceMeter.jsx`
- Modify: `frontend/src/components/DecisionCard.jsx`
- Modify: `frontend/src/styles/app.css`
- Modify: `tests/static/uiContract.test.js`

**Interfaces:**
- Consumes: current incident intelligence structure, contradiction claims, evidence gaps, canonical field evidence mutation, workflow decision mutation.
- Produces: one coherent incident workspace across the existing three routes.

- [ ] **Step 1: Keep and strengthen static concept contracts**

Retain assertions for `Critical contradiction`, `Urgency`, `Evidence confidence`, `Decision-critical evidence`, and `Human decision`. Add assertions that `IncidentDetailPage.jsx` still calls `repository.addFieldEvidence` and `DecisionPage.jsx` still routes operator decisions through `repository.applyWorkflowDecision`.

- [ ] **Step 2: Run static tests before refactor**

Run: `npm test -- --test-name-pattern="incident detail|workflow"`

Expected: PASS baseline.

- [ ] **Step 3: Standardize the incident header and subnavigation**

Use a calm PageHeader with incident ID/location, active badge, and optional map action. Keep the three existing routes exactly unchanged and present them as an accessible compact tab-like subnavigation.

- [ ] **Step 4: Refactor incident detail hierarchy**

Make urgency, confidence, and decision-critical evidence immediately scannable. Agreements are supportive/neutral; contradictions use the strongest red treatment. Missing evidence and the canonical field-evidence demo action stay visible. Linked source reports remain source-preserving.

- [ ] **Step 5: Refactor `ConflictPanel` to make provenance explicit**

Each conflicting claim must display source/report identity, interpreted claim, timestamp, and resolved/unresolved state. Preserve the sentence explaining that both claims remain attached to original sources.

- [ ] **Step 6: Refactor intelligence page without collapsing urgency and confidence**

Keep separate side-by-side cards on wide screens and stacked cards on small screens. Keep the evidence-routing table semantics, but provide responsive horizontal scrolling and stronger priority/impact hierarchy.

- [ ] **Step 7: Refactor DecisionCard around human authority**

Recommendation is clearly labeled as a recommendation; operator note remains optional; Approve, Override, and Defer remain distinct. Preserve current decision callback behavior and the final-authority copy.

- [ ] **Step 8: Run full tests and build**

Run: `npm run test:all && npm run build`

Expected: PASS.

- [ ] **Step 9: Commit in a real git checkout**

```bash
git add frontend/src/pages/IncidentDetailPage.jsx frontend/src/pages/IntelligencePage.jsx frontend/src/pages/DecisionPage.jsx frontend/src/components/ConflictPanel.jsx frontend/src/components/ConfidenceMeter.jsx frontend/src/components/DecisionCard.jsx frontend/src/styles/app.css tests/static/uiContract.test.js
git commit -m "feat(ui): redesign incident intelligence workflow"
```

---

### Task 7: Upgrade the Leaflet map into an operational map workspace

**Files:**
- Modify: `frontend/src/components/IncidentMap.jsx`
- Modify: `frontend/src/pages/MapPage.jsx`
- Create: `frontend/src/components/MapIncidentRail.jsx`
- Create: `frontend/tests/mapPage.test.jsx`
- Modify: `frontend/src/styles/app.css`

**Interfaces:**
- Consumes: existing incident locations/intelligence, existing OpenStreetMap tile source, React-Leaflet.
- Produces: urgency-aware markers, selectable incident rail, operational filters, accessible map/list coordination.

- [ ] **Step 1: Write a failing map-page interaction test**

Mock `IncidentMap` for jsdom and return two incidents from the hook. Assert the page renders `Live incident map`, a `Critical` filter control, and selecting an incident exposes `Open incident` linking to `/incidents/<id>`.

- [ ] **Step 2: Run the map test and verify new workspace controls are missing**

Run: `npm --prefix frontend exec vitest run tests/mapPage.test.jsx`

Expected: FAIL.

- [ ] **Step 3: Add selection and urgency marker styling to `IncidentMap`**

Extend props to:

```js
IncidentMap({
  incidents = [],
  height = 520,
  showHistorical = true,
  selectedIncidentId,
  onSelectIncident
})
```

Map urgency to Leaflet path colors using fixed solid values (no gradients): critical/deep red, high/red-orange, medium/amber, low/slate/blue. Selected marker gets larger radius and stronger outline. Marker click invokes `onSelectIncident(incident.id)` while retaining the popup and OpenStreetMap tiles.

- [ ] **Step 4: Add map filters and `MapIncidentRail`**

`MapPage` owns selected incident ID and urgency filter state. Filter values are `ALL`, `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`. The rail shows incident ID/title/location, urgency, confidence, workflow, contradiction count, and an `Open incident` link.

- [ ] **Step 5: Make the layout responsive**

Desktop: map plus 320–360px detail rail. Mobile: map first, selected incident card/scrollable list below. Map controls must remain usable and not sit underneath the sticky topbar.

- [ ] **Step 6: Preserve historical-layer integrity copy and OSM contract**

Keep the existing historical context note and `openstreetmap.org` tile URL so current static tests remain valid.

- [ ] **Step 7: Run map, static, and build tests**

Run: `npm --prefix frontend exec vitest run tests/mapPage.test.jsx && npm test && npm run build`

Expected: PASS.

- [ ] **Step 8: Commit in a real git checkout**

```bash
git add frontend/src/components/IncidentMap.jsx frontend/src/components/MapIncidentRail.jsx frontend/src/pages/MapPage.jsx frontend/src/styles/app.css frontend/tests/mapPage.test.jsx
git commit -m "feat(ui): upgrade operational incident map"
```

---

### Task 8: Redesign the audit trail and finish cross-page responsive/accessibility states

**Files:**
- Modify: `frontend/src/pages/AuditHistoryPage.jsx`
- Modify: `frontend/src/styles/app.css`
- Modify: `frontend/src/components/EmptyState.jsx`
- Modify: `frontend/tests/app.smoke.test.jsx`
- Modify: `tests/static/uiContract.test.js`

**Interfaces:**
- Consumes: current audit event schema and shared design primitives.
- Produces: responsive audit timeline, consistent empty/error/focus states, final application polish.

- [ ] **Step 1: Add regression assertions for audit trail and focus/reduced-motion CSS**

Static checks must confirm `Audit trail` remains in the audit page and CSS contains both `:focus-visible` and `prefers-reduced-motion`.

- [ ] **Step 2: Run the new checks and verify reduced-motion support fails if absent**

Run: `npm test -- --test-name-pattern="audit|motion"`

Expected: FAIL until final motion CSS is present.

- [ ] **Step 3: Refactor audit timeline presentation**

Keep reverse chronological sorting. Render event type, decision badge, message, actor, report/incident references, timestamp, and operator note. Use a restrained timeline rail on desktop and compact stacked cards on mobile.

- [ ] **Step 4: Add global reduced-motion and responsive safeguards**

In CSS:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

Ensure controls have at least 40px practical touch height, tables/map rails do not force page-wide horizontal overflow, and focus rings remain visible.

- [ ] **Step 5: Run full test suite and production build**

Run: `npm run test:all && npm run build`

Expected: PASS with no frontend Firebase imports and no gradients.

- [ ] **Step 6: Commit in a real git checkout**

```bash
git add frontend/src/pages/AuditHistoryPage.jsx frontend/src/components/EmptyState.jsx frontend/src/styles/app.css frontend/tests/app.smoke.test.jsx tests/static/uiContract.test.js
git commit -m "feat(ui): finish audit and accessibility polish"
```

---

### Task 9: Final visual QA and archive delivery

**Files:**
- Modify only files with verified defects from the checks below.
- Create delivery archive outside the repository root.

**Interfaces:**
- Consumes: completed UI tasks.
- Produces: a tested ResQMap project ZIP that runs with the existing root commands.

- [ ] **Step 1: Run every automated verification command**

Run:

```bash
npm run test:all
npm run build
```

Expected: all tests PASS and Vite production build succeeds.

- [ ] **Step 2: Search for prohibited frontend patterns**

Run:

```bash
grep -RniE 'gradient|@mui|firebase' frontend/src frontend/tailwind.config.js || true
```

Expected: no gradient/MUI/Firebase application imports or styling. A textual safety explanation may contain the word `Firebase` only where the architecture explicitly explains that Firebase is server-side; existing static architecture tests remain the source of truth.

- [ ] **Step 3: Inspect key responsive breakpoints in a running build**

Verify at approximately 390px, 768px, 1024px, and 1440px widths:
- shell navigation remains reachable;
- no page-wide horizontal overflow;
- review actions remain tap-friendly;
- incident subnavigation remains usable;
- evidence table scrolls within its container;
- map and incident rail stack correctly;
- audit timeline remains readable.

- [ ] **Step 4: Verify safety-critical operator flows manually**

Using demo data, confirm:
1. Dashboard counts render.
2. Review item can LINK / CREATE / HOLD.
3. Incident #21 displays contradiction, urgency, confidence, and top evidence gap.
4. Adding canonical field evidence updates the incident while preserving historical contradiction/audit history.
5. Decision page records a human action.
6. Audit History surfaces that action.
7. Map links back to the correct incident.

- [ ] **Step 5: Create delivery archive**

From `/mnt/data`, create a ZIP containing the project root while excluding `node_modules`, `dist`, local `.env` files, and temporary caches:

```bash
zip -qr resqmap-government-operations-ui.zip resqmap_work \
  -x '*/node_modules/*' '*/dist/*' '*/.env' '*/.vite/*'
```

- [ ] **Step 6: Commit in a real git checkout**

```bash
git status --short
git log --oneline -8
```

Expected in the real repository: clean working tree and one focused commit per completed task.

---

## Plan Self-Review

- **Spec coverage:** App shell, shared primitives, dashboard, incoming reports, review queue, incident/conflict, urgency/confidence, decision approval, Leaflet map, audit history, motion, responsive behavior, accessibility, semantic tokens, backend preservation, and no-gradient/no-Firebase constraints all map to explicit tasks.
- **Placeholder scan:** No TBD/TODO/“implement later” instructions are present. Each code-bearing step provides exact signatures, assertions, values, or implementation behavior.
- **Interface consistency:** `StatusBadge`, `MetricCard`, `PageHeader`, `IncidentListItem`, `MapIncidentRail`, `cn`, and the extended `IncidentMap` props are defined before downstream use. Existing repository call signatures and routes are preserved exactly.
