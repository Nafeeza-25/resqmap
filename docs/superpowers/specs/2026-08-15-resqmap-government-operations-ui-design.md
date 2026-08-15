# ResQMap Government Operations UI Redesign

## Goal
Transform the existing ResQMap frontend into a polished, responsive, calm emergency-operations application across every operator page while preserving the current backend, repository boundary, domain logic, routes, audit behavior, and no-gradient architecture contract.

The redesign should feel like a modern public-sector emergency command product rather than a generic SaaS template: clear hierarchy, disciplined semantic color, high information density without clutter, and subtle motion that helps operators understand changes.

## Existing architecture confirmed from project

The supplied project already uses:

- React 18 + Vite 5
- React Router 6
- Tailwind CSS 3
- Leaflet 1.9 + React-Leaflet 4
- Node backend with demo/Firebase Admin repositories
- HTTP-only frontend repository boundary
- Static tests enforcing Tailwind, no gradients, and no Firebase imports in frontend code

The redesign must preserve these contracts.

## UI stack decision

### Keep
- React 18
- Vite 5
- React Router 6
- Tailwind CSS 3
- Leaflet + React-Leaflet
- Existing backend/API/repository/hooks

### Add
- shadcn/ui primitives in JavaScript mode for accessible, consistent controls and overlays
- Lucide React icons
- class-variance-authority, clsx, and tailwind-merge for reusable component variants
- Motion for React for restrained transitions and layout animation

### Do not add
- MUI: it would create a second competing styling/theming system on top of Tailwind.
- MapLibre during this redesign: the existing Leaflet integration is adequate and migration would add unrelated risk.
- Gradients, glassmorphism, decorative glow, or heavy animation.

## Product constraints

- Preserve all current ResQMap behavior.
- Preserve all current routes.
- Preserve LINK / CREATE / HOLD human review.
- Preserve urgency and evidence confidence as separate concepts.
- Preserve contradictions and source attribution.
- Preserve audit history.
- Preserve server-side Firebase ownership.
- No autonomous dispatch language or behavior.
- No gradients anywhere in frontend source.
- Critical red is reserved for operational danger/conflict, not general decoration.

## Visual language

### Personality
Calm, trustworthy, operational, evidence-first, public-sector modern.

### Base palette
- App canvas: cool off-white / slate-50
- Primary surface: white
- Secondary surface: slate-50/100
- Primary text: deep navy/slate-950
- Secondary text: slate-500/600
- Border: slate-200
- Action blue: blue-700 range
- Operational teal: teal-700 range
- Success/verified: emerald
- Review/uncertain: amber
- Critical/contradiction: red
- Neutral/monitor: slate

Exact tokens should be centralized in Tailwind theme/CSS variables rather than repeated ad hoc.

### Shape and depth
- Main panels: 12–16px radius
- Controls: 8–10px radius
- Pills: full radius
- Shadows: subtle only; borders carry most grouping
- No floating glass effects
- No oversized consumer-SaaS rounded cards

### Typography
- Inter/system sans remains acceptable
- Page title: 28–34px desktop, 24–28px mobile
- Section title: 18–22px
- Body: 13–15px
- Metadata/status: 10–12px
- Use tabular numerals for counters/timestamps where appropriate

## Design tokens

Refactor `frontend/tailwind.config.js` and global CSS to expose semantic tokens for:

- background
- foreground
- card
- card-foreground
- muted
- muted-foreground
- border
- primary
- primary-foreground
- destructive
- warning
- success
- info
- ring

Use CSS variables so shadcn/ui and existing custom components share one visual system.

## Application shell

### Desktop
A 248–264px left navigation rail with:
- ResQMap brand
- compact mission label
- primary navigation with Lucide icons
- active navigation indicator using blue/teal accent
- small system/API status area at bottom

A sticky topbar contains:
- current workspace/breadcrumb context
- optional global search trigger
- system status
- operator profile/menu

Main content uses a centered max-width grid with responsive page gutters.

### Tablet/mobile
- Sidebar becomes a shadcn Sheet/Drawer opened from the topbar.
- Primary content remains single-column where needed.
- Dense decision/status data wraps without horizontal overflow.
- Touch targets remain at least 40–44px.

## Shared component system

Create or refactor reusable components instead of duplicating page-specific markup.

### UI primitives
Under `frontend/src/components/ui/`:
- Button
- Badge
- Card
- Separator
- Sheet
- Dialog
- DropdownMenu
- Tooltip
- Tabs
- ScrollArea
- Input
- Textarea
- Select where useful
- Skeleton

### ResQMap domain components
- `PageHeader`
- `MetricCard`
- `StatusBadge` (replaces/extends StatusPill)
- `SectionHeader`
- `IncidentListItem`
- `EvidenceSourceBadge`
- `EmptyState`
- `SafetyNotice`
- `OperatorDecisionPanel`
- `MapIncidentRail`

Existing components can be incrementally refactored rather than deleted wholesale.

## Motion system

Use Motion for React only where it improves state comprehension.

- Route content enter: 160–220ms opacity + 6–10px translate
- Sidebar/Sheet: spring or short ease-out
- Selected incident rail: short slide/fade
- Expanding evidence sections: height/opacity layout animation
- Cards/list items: tiny hover lift or border emphasis
- Status changes: soft crossfade
- Empty/loading replacement: fade

Respect `prefers-reduced-motion`; disable nonessential transforms for reduced-motion users.

Do not animate every list item independently on every render.

## Page designs

### 1. Overview / Dashboard

Replace the current marketing-heavy hero with an operations header.

Top area:
- eyebrow: `Operations overview`
- title: `Incident intelligence`
- brief contextual copy
- actions: `Review queue`, `Open live map`

Metrics:
- Incoming reports
- Awaiting review
- Critical incidents
- Visible contradictions

Each metric card receives:
- icon
- label
- prominent value
- compact explanatory hint
- semantic accent only when necessary

Main working area:
- `Operator attention` incident list as the primary card
- status badges aligned consistently
- clearer selected/hover state
- optional source/contradiction count metadata

The submission walkthrough moves to a lower-priority compact process strip/timeline instead of competing with live operational information.

### 2. Incoming Reports

Turn ingestion into a structured intake workspace:
- page header + incoming count
- intake form in a clear Card
- source/time/location fields aligned responsively
- report list with source metadata and status badges
- stronger distinction between raw source text and extracted tags
- loading/submit state with disabled controls and spinner

### 3. LINK / CREATE / HOLD Review

Make this feel like a triage decision workspace.

Each review item shows:
- report identity/source/time
- report text
- candidate incident
- match score
- evidence reasons
- recommendation badge
- explicit decision controls

Desktop can use a 2-column composition inside each item: evidence on left, decision summary/actions on right.

Safety notice remains prominent but calm.

LINK is primary only when appropriate; CREATE and HOLD remain visually distinct without implying that the model recommendation is authoritative.

### 4. Incident Detail / Conflict View

Header:
- incident ID + title + location
- active state
- quick actions/map link if useful

Summary cards:
- urgency
- evidence confidence
- decision-critical evidence

Use shadcn Tabs styling for the existing three incident routes while keeping the route URLs intact.

Agreement section:
- evidence-backed facts in a compact verified list

Contradiction section:
- red reserved for active conflict
- side-by-side source claims on desktop
- stacked on mobile
- source IDs and timestamps highly visible
- resolved contradictions remain visible with a resolved treatment instead of disappearing

Linked reports section:
- source-preserving report cards
- verified field evidence visually distinct

### 5. Urgency & Evidence Confidence

Build a more analytical but readable intelligence view:
- separate large urgency and confidence cards
- explanations beneath each score
- confidence meter refactored for accessibility
- evidence-gap ranking card
- clear `what would change the decision?` emphasis
- source support summary

Avoid representing confidence and urgency as a single combined gauge.

### 6. Decision & Human Approval

Decision card becomes a first-class operator control panel:
- recommended workflow badge
- reasons list
- current urgency/confidence/conflict/evidence gap summary
- operator note
- approve/override/defer actions
- latest recorded human decision

Use a confirmation Dialog for high-consequence workflow actions only if it does not make the demo cumbersome.

The footer statement that the operator remains final authority stays visible.

### 7. Live Disaster Map

Keep Leaflet/React-Leaflet but redesign the surrounding experience.

Map canvas:
- cleaner OSM styling and controls
- urgency-aware CircleMarker colors
- visible selected marker state
- accessible popup content

Desktop layout:
- map occupies primary width
- right incident rail supports selecting an incident
- rail items show ID, title, location, urgency, workflow, confidence, contradiction count

Map controls:
- urgency filter
- workflow filter if useful
- current vs historical layer control
- result count

Selection behavior:
- clicking a map marker selects the incident
- clicking a rail incident selects/focuses its marker
- selected incident gets a detailed summary panel with `Open incident` action

Historical context remains clearly labeled demo context and never implies fabricated casualty data.

### 8. Audit History

Use a disciplined timeline/activity design:
- event count/header
- event type badge/icon
- actor
- report/incident references
- timestamp
- decision badge when present
- operator note separated visually

Add simple filtering only if it can be done without changing backend contracts; otherwise keep the first redesign display-only.

## Loading, empty, and error states

Existing hooks expose data loading behavior indirectly; pages should gain consistent UI states without changing repository semantics.

- Skeletons for high-value cards/lists where possible
- EmptyState component with icon, title, explanation, optional action
- Error banner using destructive semantic tokens
- Preserve last loaded information when repository hook behavior already supports it

## Accessibility

- Semantic landmark structure remains (`aside`, `nav`, `header`, `main`)
- All icon-only controls have accessible labels
- Focus-visible ring is consistent across custom and shadcn controls
- Status cannot rely on color alone; text labels remain
- Contradiction claims keep readable contrast
- Motion respects reduced-motion preference
- Leaflet controls/popups remain keyboard reachable where supported
- Mobile drawer traps/focuses correctly through accessible primitive behavior

## Responsive behavior

Breakpoints follow the existing Tailwind responsive system.

- `<640px`: single-column, mobile navigation Sheet, stacked actions, map rail below/overlayed via Sheet if needed
- `640–1023px`: two-column stats where useful, horizontal incident subnav/tabs
- `>=1024px`: persistent sidebar, multi-column operations layout
- `>=1280px`: map + incident rail layout and richer review/detail grids

No required horizontal page scrolling at 320px viewport width.

## File-level implementation scope

### Dependencies/config
- `frontend/package.json`
- `frontend/tailwind.config.js`
- `frontend/vite.config.js` only if an import alias is added
- `frontend/jsconfig.json` if using `@/` JavaScript aliases
- `frontend/components.json`

### Global styling
- `frontend/src/styles/app.css`
- `frontend/src/lib/utils.js`

### App shell
- `frontend/src/components/AppShell.jsx`

### Shared components
- existing files under `frontend/src/components/`
- new primitives under `frontend/src/components/ui/`

### Pages
- `DashboardPage.jsx`
- `IncomingReportsPage.jsx`
- `ReviewQueuePage.jsx`
- `IncidentDetailPage.jsx`
- `IntelligencePage.jsx`
- `DecisionPage.jsx`
- `MapPage.jsx`
- `AuditHistoryPage.jsx`

### Map
- `frontend/src/components/IncidentMap.jsx`

### Tests
- `tests/static/architectureContract.test.js`
- `frontend/tests/app.smoke.test.jsx`
- add focused UI tests for navigation and critical operator workflows where worthwhile

## Data-flow guarantees

No domain/backend redesign is part of this UI project.

The following remain untouched unless a UI bug reveals a required compatibility fix:
- `frontend/src/api/client.js`
- `frontend/src/repository/*`
- `frontend/src/hooks/useRepositoryData.js` public behavior
- `backend/*`
- `shared/domain/*`
- `shared/data/*`

UI actions continue to call the same repository methods.

## Error handling

- Existing async actions retain `try/finally` busy-state behavior.
- Buttons show disabled/loading state while mutations are active.
- Any existing hook error surface should use the shared error alert component.
- No optimistic state should falsely imply an emergency decision succeeded before the repository confirms it.

## Testing strategy

1. Preserve architecture tests:
   - Tailwind remains configured
   - no `gradient` token anywhere in frontend source
   - no frontend Firebase imports
2. Preserve existing domain/backend suites.
3. Preserve smoke render of `ResQMap`.
4. Add UI contract coverage for:
   - required routes/navigation labels
   - dashboard metrics and critical status labels
   - review decision buttons
   - incident tabs/routes
   - human-authority wording
   - live map page rendering with an incident rail
5. Run production build after dependency changes.

## Migration approach

Use incremental replacement, not a big-bang rewrite.

1. Add tokens, utilities, icons, shadcn primitives, and Motion.
2. Rebuild AppShell.
3. Refactor shared status/button/card primitives.
4. Redesign Dashboard.
5. Redesign Review + Reports.
6. Redesign Incident/Intelligence/Decision views.
7. Redesign Map interactions and rail.
8. Redesign Audit.
9. Accessibility/responsive pass.
10. Full test/build verification.

At every step the app should remain runnable.

## Explicit non-goals

- No backend rewrite.
- No Firebase client SDK.
- No domain scoring changes.
- No autonomous response actions.
- No MapLibre migration in this pass.
- No TypeScript migration in this pass.
- No Tailwind 4 migration in this pass.
- No gradient styling.

## Success criteria

The redesign is successful when:

- every existing operator route shares one coherent visual system;
- the interface clearly distinguishes urgency, confidence, contradiction, workflow, and verification state;
- the dashboard prioritizes operator work over marketing copy;
- the live map feels integrated with incident intelligence rather than isolated;
- mobile/tablet layouts remain usable;
- transitions feel smooth but restrained;
- current product behavior and backend boundaries are preserved;
- architecture/domain/backend/UI tests pass;
- production frontend build passes.

## Self-review

- Placeholder scan: no TBD/TODO requirements remain.
- Internal consistency: stack remains React/Vite/Tailwind/Leaflet and does not conflict with architecture tests.
- Scope: UI redesign only; no backend/domain or map-engine migration.
- Ambiguity: library additions, page scope, visual direction, responsive behavior, motion behavior, and non-goals are explicit.
