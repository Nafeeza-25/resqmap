# ResQMap Rescue Prototype Design

## Purpose

Build a friendly working-stage prototype for emergency operators. ResQMap’s primary value is helping people reconcile conflicting disaster reports, identify what must be verified next, and make an auditable human decision. The map supports this workflow but does not replace it.

## Visual direction

The interface uses a matte-black rescue theme that feels direct and human rather than military or generic. Orange communicates active work and guidance. Red is reserved for critical urgency and unresolved contradictions. Neutral light text keeps reports and evidence easy to read.

### Tokens

- #090909 — rescue black: application background
- #141414 — graphite: primary surfaces
- #202020 — raised panel: controls and nested content
- #343434 — boundary line: borders and dividers
- #FFF7ED — warm white: primary text
- #B8B1AA — field grey: supporting text
- #F97316 — rescue orange: primary actions, active navigation, and workflow signal
- #EF4444 — emergency red: critical urgency and contradiction states
- #FDBA74 — alert amber: attention and verification
- #4ADE80 — verified green: confirmed evidence and approved state

## Signature interaction

Each main screen displays a compact rescue-signal stage indicator:

Report received → Verify evidence → Human decision

The active stage carries the orange signal line and icon. Red appears only when a report contradiction or a critical incident needs attention. This gives the prototype one visible, consistent story: ResQMap turns raw reports into a verified human decision.

## Working demo journey

1. Incoming Reports: show individual citizen, field, and call-note reports with source, time, location, and status icons.
2. Review: recommend LINK, CREATE, or HOLD and make the operator confirmation action clear.
3. Incident: show source-linked reports, agreement, the rescued-versus-still-trapped contradiction, and missing evidence.
4. Intelligence: show urgency separately from evidence confidence, with current rescue status identified as the most decision-critical question.
5. Decision: present RAPID VERIFY or DISPATCH FOR APPROVAL, with Approve and Override actions.
6. Map: show current incidents and historical context as situational awareness.
7. Audit: retain every source and human decision.

## Icon system

Use Lucide icons already included by the frontend:

- Radio / FileText for incoming reports
- Link2 / PlusCircle / PauseCircle for match recommendations
- TriangleAlert for a contradiction or critical incident
- ShieldCheck / BadgeCheck for verified evidence
- MapPin for location
- ScanSearch for decision-critical verification
- Send / Siren for a response recommendation
- History for audit events

Icons must clarify labels, not replace them. All important actions remain text-labelled.

## Layout

Desktop uses a compact left navigation rail and focused content area. On mobile, navigation becomes a horizontal icon bar and the content stacks.

ResQMap rail | stage signal
reports      | page title + plain-language next action
verify       | source evidence | decision guidance
incident/map | reports/conflicts | human action
audit        | audit record

## Scope

Keep existing React routes, mock data, repository actions, and Leaflet behavior. Modify visual tokens, the shared shell, page hierarchy, icon treatment, and component styling. Do not add external APIs or claim autonomous dispatch.

## Accessibility and verification

Keep visible orange focus states, 44px touch targets, text alongside icons, and reduced-motion support. Verify the frontend UI smoke test and production build after the redesign. Existing unrelated backend fixture failures remain out of scope.
