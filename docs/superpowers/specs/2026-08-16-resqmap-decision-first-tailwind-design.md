# ResQMap Decision-First Tailwind Design

## Objective

Redesign ResQMap as an emergency control-room interface whose purpose is understandable within seconds, and express the application presentation primarily through Tailwind utility classes.

The interface must make this problem explicit:

> Emergency teams receive different versions of the same incident and must determine what remains unresolved before making a response decision.

ResQMap helps the operator group related reports, preserve contradictions, identify the decision-critical missing evidence, and record a human-approved next action.

## Audience and Primary Job

The primary user is an emergency control-room operator reviewing incoming disaster reports under time pressure.

The command center has one primary job: show the most urgent unresolved incident, explain why it cannot safely proceed yet, and provide a direct path to verify the evidence that could change the response decision.

The map provides spatial context. It is not presented as the core product or innovation.

## Information Hierarchy

The command center presents information in this order:

1. The incident requiring immediate attention.
2. The human-safety question that remains unresolved.
3. The source-linked claims that contradict each other.
4. Urgency and evidence confidence as separate signals.
5. The exact fact the operator should verify next.
6. A direct action to begin verification.
7. The live map and remaining incident queue.

The primary incident for the controlled Chennai scenario is Incident INC-21, Gandhi Street Flood Rescue.

Its operator-facing question is:

> Do people still need rescue?

The decision-critical contradiction is:

- Report C: Family already rescued.
- Report D: People are still shouting from the roof.

The system displays Critical urgency and Medium evidence confidence separately. It identifies Confirm current rescue status as the next verification and provides a Verify rescue status action.

## Command Center Layout

The desktop layout contains:

- persistent control-room navigation;
- a compact page heading explaining that the view prioritizes unresolved response decisions;
- one dominant critical-incident panel;
- a supporting map and incident queue beneath the critical panel;
- a quiet Reset scenario control for repeatable demonstrations.

The critical-incident panel contains:

- critical status, incident identifier, location, and latest-update context;
- the operator-facing unresolved question as the main heading;
- two visibly opposed source claims with source and timestamp;
- an explicit Conflict detected divider or label;
- separate Urgency and Evidence confidence signals;
- the decision-critical verification question;
- a primary Verify rescue status action linked to the verification workflow;
- a secondary View full incident action.

On mobile, the source claims stack vertically and the primary action remains visible without horizontal scrolling. Navigation becomes compact, while labels remain available through accessible names.

## Workflow Language

The operator workflow uses these terms consistently:

1. Reports received
2. Conflict detected
3. Verify critical evidence
4. Approve response

The primary interface does not use Hackathon demo language. Demonstration controls use Training scenario terminology:

- Reset scenario
- Training scenario restored.
- Load training scenario

## Visual Direction

The visual language remains a night-shift rescue console, not a general analytics dashboard.

### Color tokens

- Operations black: `#090909`
- Raised charcoal: `#141414`
- Control charcoal: `#202020`
- Rescue orange: `#F97316`
- Critical red: `#EF4444`
- Verified green: `#4ADE80`
- Warm foreground: `#FFF7ED`

Orange indicates the next operator action. Red is reserved for critical danger, contradictions, and failures. Green indicates verified or operational state. Neutral surfaces carry all secondary information.

### Typography

- Display and headings: the existing strong sans-serif stack with compact line height and high weight.
- Body: the existing readable sans-serif stack.
- Utility labels and incident metadata: uppercase, compact tracking, and restrained size.

No new font dependency is required for this prototype.

### Signature element

The memorable element is the source-versus-source conflict presentation. It visually connects two contradictory claims to one unresolved operational question, making the product purpose visible without explanation.

Motion is limited to loading or live-status feedback and respects reduced-motion preferences.

## Component Responsibilities

### AppShell

Owns responsive navigation, product identity, operator identity, and network status. It does not own incident data.

### DashboardPage

Reads report and incident subscriptions, selects the highest-priority unresolved incident, coordinates loading/error/empty states, handles scenario reset, and composes the command-center layout.

### CriticalIncidentPanel

Receives one incident and its linked reports. It renders the unresolved question, conflict evidence, decision signals, and operator actions. It contains no repository mutations.

### SourceConflict

Receives two source claims and renders their source, timestamp, preserved text, and disagreement relationship. It remains reusable for other contradiction types.

### DecisionSignal

Receives urgency, evidence confidence, workflow, and the top evidence gap. It explains why verification is required without combining urgency and confidence into one opaque score.

### Existing supporting components

IncidentMap and IncidentPriorityCard continue to provide map context and the remaining response queue. Their visual styling is migrated to Tailwind utilities without changing their data contracts.

## Tailwind Migration Boundary

React pages and components use Tailwind utility classes directly in `className` values for layout, spacing, color, typography, borders, responsive behavior, focus states, and transitions.

Reusable visual patterns may use focused components or small JavaScript class constants. The migration must not replace named CSS classes with unreadable generated abstractions.

`frontend/src/styles/app.css` retains only:

- Tailwind base, components, and utilities directives;
- semantic CSS color variables consumed by Tailwind configuration;
- minimal global element defaults;
- visible keyboard-focus behavior;
- reduced-motion behavior;
- Leaflet library selectors and unavoidable third-party overrides;
- animation keyframes that Tailwind configuration references.

Application-specific selectors such as `command-page`, `demo-briefing`, `operation-strip`, `response-queue`, and similar presentation classes are removed after their consumers use Tailwind utilities.

The existing semantic `rq` Tailwind colors remain the source of truth. No gradients are introduced.

## Data and State Behavior

No backend or repository contract changes are required.

DashboardPage derives the primary incident from current subscribed incidents by prioritizing:

1. RAPID_VERIFY workflow;
2. unresolved critical contradictions;
3. urgency score;
4. most recent update.

For the controlled dataset, this selects INC-21.

The critical panel derives its displayed claims from the incident contradiction source references and linked reports. If exact source references are unavailable, it displays the contradiction statements already preserved by the domain model rather than inventing text.

Reset scenario uses the existing repository reset operation and refreshes all subscribers.

## Loading, Error, and Empty States

- Loading: Receiving incident updates. Supporting text explains that current reports and incident intelligence are being synchronized.
- Error: Response network unavailable. The state displays the actual safe error message, tells the operator to check the backend connection, and provides Try again.
- Empty: No incidents require attention. The state provides Load training scenario.
- Reset success: Training scenario restored.
- Reset failure: Scenario reset failed followed by the safe error message.

Failures do not erase previously received data unless the repository returns an empty state.

## Accessibility

- The unresolved incident question is a page-visible heading.
- Urgency, confidence, conflict, and workflow are conveyed with text in addition to color.
- Buttons use action-specific accessible names.
- Focus indicators remain visible against black surfaces.
- Icon-only compact navigation retains accessible labels.
- The source conflict uses semantic articles or blockquotes and source attribution.
- Status feedback uses appropriate live regions without producing duplicate announcements.
- Mobile layouts do not require horizontal scrolling at 390 CSS pixels.

## Testing and Acceptance Criteria

Automated UI tests must verify that the command center displays:

- Do people still need rescue?
- Family already rescued.
- People are still shouting from the roof.
- Critical urgency.
- Medium evidence confidence.
- Confirm current rescue status.
- Verify rescue status.
- Training scenario restored after reset.

Static checks must verify that migrated application JSX uses Tailwind utilities and that removed application-specific CSS selectors no longer appear in the stylesheet.

The full domain, backend, static, and UI test suites must pass. The production frontend build must pass.

Live visual QA must cover:

- 1440 by 900 projector/desktop viewport;
- 390 by 844 mobile viewport;
- no horizontal overflow;
- visible primary verification action;
- readable conflict sources and decision signals;
- working reset action and data-loaded state.

## Out of Scope

- Changing claim extraction, conflict detection, evidence scoring, or workflow algorithms.
- Autonomous dispatch.
- Replacing Leaflet or changing map data providers.
- Adding a public/citizen landing page.
- Adding new backend persistence.
- Converting third-party Leaflet CSS internals into Tailwind utilities.

