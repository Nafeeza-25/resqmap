# ResQMap Night-Shift Operations Console

## Purpose

ResQMap should help a disaster-response operator understand what is happening, decide what needs verification, and move toward dispatch without losing the provenance of incoming reports. The redesign applies one coherent visual and interaction system across the full frontend: Command Center, Incoming Reports, Verify, Map, incident intelligence, decisions, and audit history.

## Visual direction

The product becomes a night-shift emergency operations console: calm, high-contrast, information-dense, and unmistakably built for incident response. The interface should feel like a trustworthy coordination instrument rather than a generic analytics dashboard.

### Token system

- `#07090C` — command black: application background
- `#0D1117` — graphite: primary panels and navigation surfaces
- `#151B23` — raised graphite: controls, selected states, and nested cards
- `#27313D` — instrument line: borders and dividers
- `#F5F7FA` — signal white: primary text
- `#9BA8B7` — field grey: secondary text
- `#F59E0B` — rescue amber: active operations, attention, and verification
- `#EF4444` — alert red: critical risk and conflicts only
- `#46D7FF` — verified cyan: connected state, evidence, and map context
- `#34D399` — safe green: linked, approved, and healthy system states

Red is intentionally scarce. Amber communicates “operator attention required,” while red communicates immediate danger. Cyan is reserved for trustworthy system/data signals so it does not compete with urgency.

### Type and shape

- Use a condensed display face for the product wordmark, page titles, and operational numbers where available through a local/system-safe fallback stack.
- Use a clean sans-serif for body copy, labels, controls, and long-form evidence.
- Use a monospaced utility face for incident IDs, coordinates, timestamps, and source metadata.
- Prefer compact 10–14px radii: panels can be approachable, but the system should retain instrument-like precision.
- Use hairline dividers, inset highlights, and restrained shadows instead of floating “card soup.”

## Signature experience

The Command Center opens with a persistent live-operation strip above the main work area. It exposes the operational state, last data sync, active incident count, and the current highest-priority queue signal in one glance. This strip is the primary brand signature and gives the app a response-room rhythm.

The main Command Center layout is:

```text
┌─ left rail ──────┬─ live operation strip ──────────────────────────┐
│ brand            │ OPERATIONAL  last sync  active  verify  dispatch │
│ command          ├───────────────────────────────┬─────────────────┤
│ reports          │ live incident map             │ response queue  │
│ verify           │                               │ critical first  │
│ map              │                               │                 │
│ history          ├───────────────────────────────┴─────────────────┤
│                  │ evidence / workflow summary                      │
└──────────────────┴──────────────────────────────────────────────────┘
```

On mobile, the left rail becomes a compact top bar and the map, queue, and evidence summary stack in that order. No critical action should be hidden behind hover-only behavior.

## Shared shell

- Replace the current horizontal primary navigation with a compact responsive left rail on large screens.
- Keep the product name, a small rescue-mark treatment, operator identity, and connection state visible without consuming dashboard space.
- Group navigation into operational sections: Command, Incoming, Verify, Map, and History.
- Add an active-route treatment that uses an amber edge marker and subtle raised graphite background.
- Preserve React Router routes and existing page responsibilities.
- Respect keyboard focus, reduced motion, and minimum touch target sizing.

## Page treatments

### Command Center

Make the map and response queue the dominant workspace. Add the live-operation strip, compact status metrics, clearer incident prioritization, and a bottom evidence/workflow summary. The empty state should tell the operator exactly what loading the demo scenario does.

### Incoming Reports

Use a two-column evidence desk: searchable report stream on the left and a sticky “Add live report” intake panel on the right. Make report source, timestamp, status, and location metadata easy to scan. Keep report text readable and make the review action explicit.

### Verify

Frame the page as a review queue with a visible safety note, strong conflict emphasis, and clear next actions. Preserve the distinction between evidence agreement, contradiction, and missing evidence.

### Map

Keep Leaflet as the map engine, but add a dark map treatment where possible, with high-contrast urgency markers and a legible floating filter control. Selected incidents should expose a concise intelligence preview and a single clear “Review incident” action.

### Incident intelligence and decision pages

Treat these pages as a focused incident workspace. Keep the incident identity and urgency visible, use consistent sub-navigation, and make confidence, conflicts, evidence gaps, and dispatch decisions feel like stages of one operational handoff.

### Audit history

Use the same instrument vocabulary for event type, actor, timestamp, and outcome. Dense history is acceptable, but the page must retain strong row separation and readable metadata.

## Interaction and accessibility

- Use motion only for page entry, selection, and status changes; honor `prefers-reduced-motion`.
- Provide visible `:focus-visible` states with an amber focus ring against black backgrounds.
- Maintain WCAG-friendly contrast for primary and secondary text.
- Ensure controls remain usable at mobile widths and provide non-hover equivalents for all important information.
- Use plain-language labels such as “Review report,” “Open incident,” “Approve dispatch,” and “Load demo scenario.”
- Keep destructive or high-consequence actions visually distinct and require existing confirmation flows where present.

## Scope boundaries

This is a visual and interaction redesign within the existing frontend. It will not change repository data models, API contracts, route URLs, Leaflet data behavior, or backend logic. Existing user changes in the worktree will be preserved and the implementation will be layered carefully on top of them.

## Verification

After implementation, run the frontend build and UI smoke test. Check the responsive layout at mobile and desktop widths, inspect focus states, verify map and route behavior, and confirm the new styles do not introduce broken utility classes or unreadable status combinations.
