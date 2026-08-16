# ResQMap Full UI Theme Implementation Plan

> **For implementation:** Complete the phases in order. Each phase should leave the application usable and testable before moving to the next.

## Goal

Redesign the complete ResQMap frontend into a **simple, user-friendly emergency intelligence interface** that a first-time operator can understand within seconds.

The visual identity should be:

**Dark • Calm • Urgent when necessary • Easy to scan • Human-centered**

The primary experience should communicate:

**Incident → Conflict → Verify → Decision**

The redesign must preserve the existing API, repository layer, incident logic, reconciliation logic, audit history, and Firebase deployment architecture.

---

# 1. Global UX Rules

These rules apply to every page.

### Rule 1 — One main question per screen

Every screen should make its purpose obvious.

Examples:

* Command Center → **What needs my attention?**
* Incident Review → **What is actually happening?**
* Verification → **What do we still need to confirm?**
* Decision → **What should I approve?**
* Reports → **What information just came in?**
* Map → **Where are incidents happening?**

Avoid several competing dashboard sections.

### Rule 2 — Plain language first

Replace technical wording wherever possible.

Use:

* **Reports disagree**
* **Needs verification**
* **How sure are we?**
* **Recommended next step**
* **Human approval required**
* **Verified**
* **Still unknown**

Avoid exposing terms such as:

* Evidence aggregation
* Reconstruction confidence
* Reconciliation state
* Decision intelligence workflow
* Evidence gap prioritization

These can remain in advanced details.

### Rule 3 — Red has meaning

Red must not be decorative.

Use red only for:

* Critical incidents
* Immediate danger
* Destructive actions
* Active contradictions requiring attention

Use orange for:

* Warnings
* Uncertainty
* Recommended attention

Use green for:

* Verified evidence
* Confirmed states
* Successful actions

### Rule 4 — Progressive disclosure

The initial screen shows only what is necessary.

Detailed report metadata, confidence calculations, internal IDs, source scoring, and audit records should sit behind:

**View details**

---

# 2. Design System

## Color tokens

Modify:

`frontend/src/styles/app.css`

Replace the current light-first theme variables with the ResQMap dark palette.

```css
:root {
  --rq-bg: #090b0f;
  --rq-bg-soft: #0d1015;

  --rq-surface: #11151b;
  --rq-surface-raised: #171c24;
  --rq-surface-hover: #1c222c;

  --rq-border: #262d38;
  --rq-border-soft: #1d232c;

  --rq-text: #f8fafc;
  --rq-text-secondary: #a8b0bd;
  --rq-text-muted: #737d8c;

  --rq-red: #ef4444;
  --rq-red-soft: rgba(239, 68, 68, 0.12);

  --rq-orange: #f97316;
  --rq-orange-soft: rgba(249, 115, 22, 0.12);

  --rq-warning: #f59e0b;
  --rq-warning-soft: rgba(245, 158, 11, 0.12);

  --rq-success: #22c55e;
  --rq-success-soft: rgba(34, 197, 94, 0.12);

  --rq-info: #38bdf8;

  --rq-focus: #fb923c;
}
```

## Color semantics

| Meaning        | Color      |
| -------------- | ---------- |
| Background     | Near black |
| Panels         | Charcoal   |
| Critical       | Red        |
| High attention | Orange     |
| Uncertain      | Amber      |
| Verified       | Green      |
| Informational  | Blue       |
| Primary text   | Soft white |
| Secondary text | Grey       |

---

# 3. Typography

Do not introduce another font dependency.

Use the existing system/Tailwind sans stack.

Hierarchy:

```text
Page title       28–32px / bold
Section title    18–20px / semibold
Card title       15–17px / semibold
Body             14px
Supporting text  12–13px
Status label     10–11px / uppercase
```

Avoid excessive uppercase text.

Use uppercase only for:

* CRITICAL
* HIGH
* VERIFIED
* WARNING

---

# 4. Spacing and Layout

Use a consistent spacing scale:

```text
4px
8px
12px
16px
24px
32px
48px
```

Main desktop container:

```text
max-width: 1500–1600px
horizontal padding: 24–32px
```

Cards:

```text
border-radius: 14–18px
padding: 16–24px
```

Avoid nested cards inside cards unless the inner card represents real information.

---

# 5. Interaction Style

Buttons should have three levels.

### Primary

Orange/red depending on context.

Examples:

* Review incident
* Request verification
* Approve dispatch

### Secondary

Dark raised surface with border.

Examples:

* View report details
* Open map
* View evidence

### Destructive

Red outline or red surface.

Example:

* Reject / Override

Focus states must remain visible.

```css
:focus-visible {
  outline: 2px solid var(--rq-focus);
  outline-offset: 3px;
}
```

Animations should be subtle.

Use existing `motion` only where it improves clarity:

* card entrance
* panel transitions
* button feedback

Duration:

```text
150–220ms
```

No dramatic dashboard animations.

---

# 6. Phase 1 — Theme Foundation

## Files

Modify:

* `frontend/src/styles/app.css`
* `frontend/src/main.jsx`

Review:

* `tailwind.config.js`

## Work

* [ ] Replace light theme CSS variables with ResQMap dark tokens.
* [ ] Change body background to near-black.
* [ ] Change global text to soft white.
* [ ] Update focus rings.
* [ ] Update text selection styling.
* [ ] Standardize borders and surfaces.
* [ ] Remove global assumptions that force `white`, `slate-50`, and light backgrounds.
* [ ] Preserve Tailwind utilities.

## Acceptance

Every route should remain functional even before individual pages are redesigned.

Run:

```bash
npm run dev
```

Check:

```text
/
/reports
/review
/map
/audit
```

---

# 7. Phase 2 — Application Shell

## File

Modify:

`frontend/src/components/AppShell.jsx`

The current sidebar should become a cleaner application header.

## Desktop navigation

```text
RESQMAP

Command Center
Reports
Verify
Map
History

                     ● Operational     Demo Operator
```

Recommended routes:

```text
Command Center  /
Reports         /reports
Verify          /review
Map             /map
History         /audit
```

Do not expose Decision or Intelligence globally.

Those screens belong inside an incident.

## Mobile navigation

Below approximately `768px`:

Keep:

```text
Command
Reports
Verify
Map
```

History can move into an overflow/menu action.

## Remove from shell

Remove presentation such as:

> Separate API backend
> React stays presentation-only...

Architecture documentation does not belong in the operational UI.

## Acceptance

The user should understand the application's major areas from navigation labels alone.

---

# 8. Phase 3 — Shared UI Components

Update existing components rather than building a second component system.

## Modify

```text
frontend/src/components/StatusPill.jsx
frontend/src/components/StatCard.jsx
frontend/src/components/ConfidenceMeter.jsx
frontend/src/components/ConflictPanel.jsx
frontend/src/components/DecisionCard.jsx
frontend/src/components/ReportCard.jsx
frontend/src/components/IncidentMap.jsx
```

## Create

```text
frontend/src/components/PageHeader.jsx
frontend/src/components/SectionHeader.jsx
frontend/src/components/IncidentPriorityCard.jsx
frontend/src/components/EmptyState.jsx
```

Use `lucide-react` for standard icons rather than maintaining several duplicated inline SVG icon maps.

### StatusPill

Display technical workflow values as plain language.

```js
const LABELS = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',

  RAPID_VERIFY: 'Needs verification',
  DISPATCH_FOR_APPROVAL: 'Ready for approval',
  STANDARD_QUEUE: 'Standard review',
  MONITOR: 'Monitoring',

  LINK: 'Link report',
  CREATE: 'New incident',
  HOLD: 'Needs review',
};
```

Keep original internal values unchanged.

Only change presentation.

---

# 9. Phase 4 — Command Center

## File

Modify:

`frontend/src/pages/DashboardPage.jsx`

This becomes the strongest page in the application.

Page title:

# Command Center

Subtitle:

> Focus on incidents that need attention now.

## Top metrics

Only three:

```text
ACTIVE INCIDENTS
12

NEEDS VERIFICATION
5

DECISIONS PENDING
3
```

Avoid four-to-six analytics cards.

## Main layout

Desktop:

```text
┌──────────────────────────────┬───────────────────────┐
│                              │ URGENT INCIDENTS      │
│                              │                       │
│          LIVE MAP            │ Critical incident     │
│                              │ High incident         │
│                              │ Medium incident       │
│                              │                       │
└──────────────────────────────┴───────────────────────┘
```

Approximately:

```text
Map: 60–65%
Incident panel: 35–40%
```

## Priority incident card

Display:

```text
CRITICAL

Flood at Gandhi Street

⚠ Reports disagree

What needs checking?
Are people still trapped?

Confidence: Medium

[ Review incident → ]
```

Do not show internal incident IDs as the primary identifier.

They can appear under details.

## Empty state

If no demo data exists:

```text
No active incidents

Load the demo scenario to explore how ResQMap
handles conflicting disaster reports.

[ Load demo scenario ]
```

---

# 10. Phase 5 — Incoming Reports

## File

Modify:

`frontend/src/pages/IncomingReportsPage.jsx`

Goal:

> Make new reports easy to scan without turning the page into a data table.

## Header

```text
Incoming Reports

Review information arriving from field teams,
citizens, and other sources.
```

## Filter bar

Keep only:

```text
All
Needs review
Linked
Held
```

Optional search:

```text
Search reports...
```

## Report card

Display:

```text
Citizen report
12 minutes ago

"Water has reached the first floor.
Two people may still be trapped."

Gandhi Street

Needs review

[ Review report ]
```

Secondary information goes into expanded details.

---

# 11. Phase 6 — Verification / Review Queue

## File

Modify:

`frontend/src/pages/ReviewQueuePage.jsx`

Rename visible page:

# Verification Queue

Not:

`LINK / CREATE / HOLD`

Those remain internal operations.

## User-facing decisions

Translate:

```text
LINK   → Link to existing incident
CREATE → Create new incident
HOLD   → Need more information
```

## Layout

Use a single focused review card.

```text
Report

"I saw people on the rooftop."

Likely related incident

Flood at Gandhi Street
87% location/time match

What would you like to do?

[ Link to incident ]

[ Create new incident ]

[ Need more information ]
```

Avoid showing many decision controls simultaneously.

---

# 12. Phase 7 — Incident Review

## File

Modify:

`frontend/src/pages/IncidentDetailPage.jsx`

This is ResQMap's **hero screen**.

It should explain why the product is different.

## Page structure

### Header

```text
← Command Center

Flood at Gandhi Street

Critical
Gandhi Street • 15 min ago
```

### What we know

```text
✓ Flooding confirmed
✓ Rescue team reached location
✓ People were reported on rooftop
```

### Reports disagree

Side-by-side:

```text
REPORT A

"There are still people
trapped on the rooftop."

               VS

REPORT B

"The family has already
been rescued."
```

Keep original evidence source visible in secondary text.

### Situation status

```text
URGENCY              CONFIDENCE

Critical             Medium
```

Always keep urgency and confidence separate.

### What should we verify?

Large highlighted question:

> **Are people still trapped on the rooftop?**

Explanation:

> Confirming this will determine whether another rescue response is needed.

Primary button:

**Request verification**

Secondary:

**View all evidence**

---

# 13. Phase 8 — Intelligence Details

## File

Modify:

`frontend/src/pages/IntelligencePage.jsx`

This should become the **advanced details page**, not part of the required beginner flow.

Rename visible page:

# Situation Analysis

Show:

```text
Urgency
Confidence
Why ResQMap thinks this
Missing information
Source agreement
Contradictions
```

Internal scoring can live here.

Add a link from Incident Review:

**View analysis details**

Do not force operators through this screen before making a decision.

---

# 14. Phase 9 — Decision / Approval

## File

Modify:

`frontend/src/pages/DecisionPage.jsx`

Goal:

> The operator should understand the recommendation and approve/reject it in seconds.

## Header

```text
Decision / Approval

Flood at Gandhi Street
```

## Verification result

```text
VERIFICATION RESULT

Rescue incomplete

New field evidence confirms people
remain on the rooftop.
```

## Situation

```text
Urgency
Critical

Confidence
High
```

## Recommended action

Large highlighted card:

```text
RECOMMENDED ACTION

Dispatch rescue team

Conditions indicate an active rescue
is still required.
```

## Human-control notice

```text
👤 Human approval required

ResQMap recommends actions.
It does not dispatch responders automatically.
```

## Actions

Primary:

**Approve dispatch**

Secondary:

**Reject / Override**

Require an override reason when rejecting a high-confidence recommendation.

Preserve:

```js
repository.applyWorkflowDecision(...)
```

No backend decision behavior should be rewritten.

---

# 15. Phase 10 — Disaster Map

## File

Modify:

`frontend/src/pages/MapPage.jsx`

## Goal

The map should answer:

> Where are the incidents I need to care about?

Do not make the map a separate analytics dashboard.

## Design

Full-width dark map.

Floating top-left control:

```text
Disaster Map

12 active incidents
```

Floating filter:

```text
All
Critical
High
Needs verification
```

Markers:

```text
Critical    red
High        orange
Medium      amber
Resolved    muted green
```

Clicking a marker opens a compact incident preview:

```text
Flood at Gandhi Street

Critical

Reports disagree

[ Review incident ]
```

Keep Leaflet and OpenStreetMap architecture unchanged.

---

# 16. Phase 11 — Audit History

## File

Modify:

`frontend/src/pages/AuditHistoryPage.jsx`

Rename visible page:

# Activity History

Subtitle:

> See how reports, evidence, and human decisions changed over time.

Use a timeline rather than a dense log table.

Example:

```text
10:39

Field evidence added
People confirmed on rooftop

Demo Operator


10:42

Recommendation updated
Dispatch rescue team


10:44

Dispatch approved
Demo Operator
```

Technical raw audit information can be expandable.

---

# 17. Loading, Empty and Error States

Every major screen must have all three.

## Loading

Use quiet skeletons.

Do not use large spinning loaders.

## Empty

Explain what the user can do.

Bad:

```text
No data
```

Good:

```text
No incidents need attention.

New incidents will appear here when
incoming reports require action.
```

## Error

Example:

```text
We couldn't load incident information.

Your existing data has not been changed.

[ Try again ]
```

Never expose raw API errors to normal users.

---

# 18. Responsive Design

Test at minimum:

```text
375px
768px
1024px
1440px
```

## Mobile

Command Center becomes:

```text
Metrics

Urgent incidents

Map preview
```

Do not force map + cards side-by-side.

Incident Review conflicts become vertically stacked.

```text
Report A
   ↓ disagrees with
Report B
```

Decision actions become full-width.

---

# 19. Accessibility

Minimum requirements:

* [ ] All buttons have clear text or accessible labels.
* [ ] Color is never the only indicator of status.
* [ ] Keyboard navigation works across navigation and actions.
* [ ] Focus states are visible.
* [ ] Critical/status badges include text.
* [ ] Contrast should meet WCAG AA.
* [ ] Map controls remain keyboard accessible where Leaflet supports them.
* [ ] Respect reduced-motion preferences.

Add:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

# 20. Testing Plan

Current frontend testing is too small for the redesigned workflow.

Expand:

`frontend/tests/app.smoke.test.jsx`

Create:

```text
frontend/tests/navigation.test.jsx
frontend/tests/command-center.test.jsx
frontend/tests/incident-review.test.jsx
frontend/tests/decision.test.jsx
```

## Navigation test

Verify:

```text
Command Center
Reports
Verify
Map
History
```

are accessible.

## Command Center

Test that a populated repository renders:

```text
Active incidents
Needs verification
Review incident
```

## Incident Review

Test that:

```text
What we know
Reports disagree
What should we verify?
```

are displayed.

## Decision

Test:

```text
Recommended action
Human approval required
Approve
Reject / Override
```

## Run

```bash
npm run test:ui
```

Then:

```bash
npm run test:all
```

---

# 21. Build Verification

Run:

```bash
npm run build
```

Expected:

```text
frontend/dist/
```

Then locally inspect the production build.

From frontend:

```bash
npm run preview
```

Check every existing route manually:

```text
/
/reports
/review
/map
/audit
/incidents/:incidentId
/incidents/:incidentId/intelligence
/incidents/:incidentId/decision
```

---

# 22. Git Strategy

Do not implement the entire redesign as one huge commit.

Recommended commits:

```bash
git commit -m "style: add ResQMap dark design system"

git commit -m "feat: simplify application navigation"

git commit -m "feat: redesign command center"

git commit -m "feat: simplify report verification workflow"

git commit -m "feat: redesign incident review experience"

git commit -m "feat: redesign decision approval flow"

git commit -m "feat: update map and activity history"

git commit -m "test: cover core ResQMap user journey"
```

This makes regressions easier to find.

---

# 23. Deployment

After all tests pass:

```bash
npm run test:all
npm run build
```

Verify:

```text
frontend/dist
```

Then deploy Hosting.

Because API/backend behavior has not changed, only Hosting needs deployment for UI-only work:

```bash
firebase deploy --only hosting
```

After deployment check:

```text
https://resqmap.web.app/
```

Test the complete production flow:

```text
Command Center
      ↓
Review incident
      ↓
Understand disagreement
      ↓
Verify information
      ↓
Decision
      ↓
Approve / Override
```

---

# 24. Definition of Done

The UI redesign is complete when a new person can open ResQMap and understand these three things without explanation:

### 1. What is happening?

> Flood at Gandhi Street.

### 2. What is uncertain?

> Reports disagree about whether people are still trapped.

### 3. What should I do?

> Verify whether rescue is complete.

Then after verification:

> Approve or reject the recommended response.

The user should **not need to understand the internal ResQMap algorithm before using ResQMap.**

---

# Final Product Structure

```text
ResQMap
│
├── Command Center
│   ├── Active incidents
│   ├── Urgent incidents
│   └── Map overview
│
├── Reports
│   └── Incoming information
│
├── Verify
│   └── Report review queue
│
├── Map
│   └── Geographic incident view
│
└── History
    └── Human + system audit trail


Incident
│
├── What we know
├── Reports disagree
├── What should we verify?
├── Situation Analysis
└── Decision / Approval
```

## Implementation Priority

### Priority 1 — Must feel excellent

```text
AppShell
Command Center
Incident Review
Decision / Approval
```

### Priority 2 — Must be consistent

```text
Incoming Reports
Verification Queue
Map
```

### Priority 3 — Supporting experience

```text
Situation Analysis
Activity History
Empty states
Responsive polish
Animations
```

The redesign should be judged primarily by one question:

> **Can someone who has never seen ResQMap understand the situation and their next action within 5–10 seconds?**

If the answer is yes, the UI is doing its job.
