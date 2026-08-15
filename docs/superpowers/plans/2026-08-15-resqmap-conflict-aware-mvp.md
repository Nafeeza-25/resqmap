# ResQMap Conflict-Aware MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a submission-ready React + Vite ResQMap prototype that turns conflicting disaster reports into a source-linked incident, preserves contradictions, separates urgency from evidence confidence, ranks decision-critical missing evidence, supports human LINK/CREATE/HOLD and workflow approval, shows incidents on a Chennai map, and preserves an audit trail.

**Architecture:** A single React operator console uses a deterministic, explainable reconciliation engine for the controlled round-one demo dataset and a repository abstraction that can persist through Firebase Firestore when Vite Firebase environment variables are present. The same app remains fully runnable without credentials through a seeded in-memory/local demo repository so judging is not blocked by cloud setup. Domain logic is isolated from React and Firebase so matching, conflict detection, scoring, workflow recommendations, and audit behavior can be tested directly.

**Tech Stack:** React 18, Vite 5, React Router, Firebase Firestore, Leaflet + React Leaflet + OpenStreetMap, Vitest + Testing Library, plain CSS.

## Global Constraints

- Treat `docs/reference/resqmap-full-project-spec.md` as the product source of truth.
- Preserve the product framing: ResQMap is a human-in-the-loop disaster-response intelligence platform, not an autonomous dispatcher.
- Never silently merge uncertain reports; all LINK / CREATE / HOLD decisions remain reviewable.
- Keep urgency and evidence confidence as separate fields and visual concepts.
- Preserve original report text and source-linked claims.
- Surface contradictions rather than replacing them with a single generated summary.
- Human operators remain final authority for incident linking and workflow recommendations.
- Firebase is the project backend choice for this prototype; demo fallback exists only to keep the prototype runnable without credentials.
- No production credentials or sensitive personal data are committed.
- The clean demo centers on the Chennai/Velachery flood scenario from the supplied spec.

---

## Planned File Structure

```text
resqmap/
├── .env.example
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   └── routes.jsx
│   ├── components/
│   │   ├── AppShell.jsx
│   │   ├── ConfidenceMeter.jsx
│   │   ├── ConflictPanel.jsx
│   │   ├── DecisionCard.jsx
│   │   ├── IncidentMap.jsx
│   │   ├── ReportCard.jsx
│   │   ├── StatCard.jsx
│   │   └── StatusPill.jsx
│   ├── data/
│   │   └── demoReports.js
│   ├── domain/
│   │   ├── claimExtractor.js
│   │   ├── conflictEngine.js
│   │   ├── evidenceEngine.js
│   │   ├── incidentMatcher.js
│   │   ├── reconcileIncident.js
│   │   ├── urgencyEngine.js
│   │   └── workflowEngine.js
│   ├── pages/
│   │   ├── AuditHistoryPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── IncidentDetailPage.jsx
│   │   ├── IncomingReportsPage.jsx
│   │   ├── MapPage.jsx
│   │   └── ReviewQueuePage.jsx
│   ├── repository/
│   │   ├── demoRepository.js
│   │   ├── firebase.js
│   │   ├── firestoreRepository.js
│   │   └── index.js
│   ├── styles/
│   │   └── app.css
│   ├── test/
│   │   └── setup.js
│   └── main.jsx
└── tests/
    ├── claimExtractor.test.js
    ├── conflictEngine.test.js
    ├── evidenceEngine.test.js
    ├── incidentMatcher.test.js
    ├── reconcileIncident.test.js
    └── workflowEngine.test.js
```

### Task 1: Scaffold the React/Vite prototype and test harness

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `.env.example`
- Create: `src/main.jsx`, `src/app/App.jsx`, `src/app/routes.jsx`, `src/test/setup.js`, `src/styles/app.css`

**Interfaces:**
- Produces `App` as the SPA root.
- Produces browser routes: `/`, `/reports`, `/review`, `/incidents/:incidentId`, `/map`, `/audit`.

- [ ] **Step 1: Add package/test configuration** with React, Vite, React Router, Firebase, Leaflet, React Leaflet, Vitest, jsdom, and Testing Library dependencies.
- [ ] **Step 2: Add a smoke test** that renders the application title `ResQMap` and fails before App exists.
- [ ] **Step 3: Run `npm test -- --run`** and verify the smoke test fails for the missing app.
- [ ] **Step 4: Implement the minimal SPA shell and routes** so the smoke test passes.
- [ ] **Step 5: Run `npm test -- --run` and `npm run build`** and verify both pass.

### Task 2: Add the controlled Chennai report pack and structured claim extraction

**Files:**
- Create: `src/data/demoReports.js`
- Create: `src/domain/claimExtractor.js`
- Test: `tests/claimExtractor.test.js`

**Interfaces:**
- `extractClaims(report) -> { hazardType, locationLabel, peopleAffected, vulnerableGroups, rescueStatus, condition, severitySignals, timestamp, sourceId }`
- `DEMO_REPORTS` contains 12–20 source reports, including the five canonical A–E reports plus Tamil/English duplicates, paraphrases, stale updates, missing-location reports, and nearby unrelated incidents.

- [ ] **Step 1: Write failing tests** for Report A extracting flood/trapped/5/Gandhi Street and Report C extracting rescued status.
- [ ] **Step 2: Run the focused test and verify failure.**
- [ ] **Step 3: Implement deterministic schema extraction** for the controlled MVP vocabulary, preserving `originalText` separately on every report.
- [ ] **Step 4: Run extraction tests and verify pass.**

### Task 3: Implement LINK / CREATE / HOLD matching

**Files:**
- Create: `src/domain/incidentMatcher.js`
- Test: `tests/incidentMatcher.test.js`

**Interfaces:**
- `scoreReportAgainstIncident(report, incident) -> { semantic, geographic, temporal, typeCompatibility, total, recommendation, reasons }`
- Recommendation is exactly `LINK`, `CREATE`, or `HOLD`.

- [ ] **Step 1: Write failing tests** proving A/B/C/D link to the same Gandhi Street flood incident and E is recommended CREATE.
- [ ] **Step 2: Run tests and verify failure.**
- [ ] **Step 3: Implement transparent weighted matching** using token overlap, haversine distance, time difference, disaster type, and structured compatibility.
- [ ] **Step 4: Run tests and verify pass.**

### Task 4: Implement contradiction preservation and incident reconstruction

**Files:**
- Create: `src/domain/conflictEngine.js`
- Create: `src/domain/reconcileIncident.js`
- Test: `tests/conflictEngine.test.js`, `tests/reconcileIncident.test.js`

**Interfaces:**
- `detectContradictions(claims) -> Conflict[]`
- `reconcileIncident(reports) -> { agreements, contradictions, missingEvidence, linkedReportIds, currentClaims }`
- Conflict includes `{ field, label, severity, claims: [{ reportId, value, sourceId, timestamp }] }`.

- [ ] **Step 1: Write failing test** for `rescued` vs `still_trapped` becoming a critical rescue-status conflict with both source IDs preserved.
- [ ] **Step 2: Write failing reconstruction test** for A–D agreement, conflict, missing current rescue status, and source links.
- [ ] **Step 3: Implement conflict detection and reconstruction.**
- [ ] **Step 4: Run focused tests and verify pass.**

### Task 5: Implement urgency, evidence confidence, decision-critical evidence, and workflow recommendation

**Files:**
- Create: `src/domain/urgencyEngine.js`
- Create: `src/domain/evidenceEngine.js`
- Create: `src/domain/workflowEngine.js`
- Test: `tests/evidenceEngine.test.js`, `tests/workflowEngine.test.js`

**Interfaces:**
- `calculateUrgency(incident) -> { level: 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL', score, reasons }`
- `calculateEvidenceConfidence(incident) -> { level: 'LOW'|'MEDIUM'|'HIGH', score, components }`
- `rankEvidenceGaps(incident) -> [{ key, question, decisionImpact, verificationEffort, priority, rationale }]`
- `recommendWorkflow({ urgency, confidence, contradictions, evidenceGaps }) -> { workflow: 'DISPATCH_FOR_APPROVAL'|'RAPID_VERIFY'|'STANDARD_QUEUE'|'MONITOR', reasons }`

- [ ] **Step 1: Write failing tests** for the canonical scenario yielding Critical urgency, Medium evidence confidence, current rescue status as top evidence gap, and RAPID_VERIFY.
- [ ] **Step 2: Write failing test** that a field confirmation of two people still trapped raises confidence and yields DISPATCH_FOR_APPROVAL.
- [ ] **Step 3: Implement transparent scoring and ranking rules.**
- [ ] **Step 4: Run tests and verify pass.**

### Task 6: Add Firebase repository with safe demo fallback and audit history

**Files:**
- Create: `src/repository/firebase.js`, `src/repository/firestoreRepository.js`, `src/repository/demoRepository.js`, `src/repository/index.js`
- Create: `.env.example`

**Interfaces:**
- `repository.subscribeReports(callback) -> unsubscribe`
- `repository.subscribeIncidents(callback) -> unsubscribe`
- `repository.submitReport(report) -> Promise<id>`
- `repository.applyLinkDecision({ reportId, decision, incidentId, operator }) -> Promise<void>`
- `repository.applyWorkflowDecision({ incidentId, action, operator, note }) -> Promise<void>`
- `repository.addFieldEvidence({ incidentId, report }) -> Promise<void>`
- `repository.subscribeAudit(callback) -> unsubscribe`

- [ ] **Step 1: Add repository contract tests** against the demo implementation for report ingestion, decisions, and audit append behavior.
- [ ] **Step 2: Implement demo repository with seeded canonical scenario.**
- [ ] **Step 3: Implement Firestore adapter** using collections `reports`, `incidents`, and `auditEvents`, selected only when all required `VITE_FIREBASE_*` values exist.
- [ ] **Step 4: Verify tests pass without Firebase credentials.**

### Task 7: Build the operator console and required prototype screens

**Files:**
- Create: `src/components/AppShell.jsx`, `ReportCard.jsx`, `StatusPill.jsx`, `StatCard.jsx`, `ConflictPanel.jsx`, `ConfidenceMeter.jsx`, `DecisionCard.jsx`
- Create: `src/pages/DashboardPage.jsx`, `IncomingReportsPage.jsx`, `ReviewQueuePage.jsx`, `IncidentDetailPage.jsx`
- Modify: `src/app/routes.jsx`, `src/styles/app.css`

**Interfaces:**
- Dashboard exposes counts for incoming, review-needed, critical incidents, and unresolved contradictions.
- Reports screen supports controlled report ingestion.
- Review queue exposes LINK / CREATE / HOLD recommendation + reasoning and requires operator confirmation.
- Incident detail shows agreements, source-linked conflicts, missing evidence, urgency, confidence, top verification question, and workflow decision with approve/override.

- [ ] **Step 1: Add component/page tests** for required labels and operator actions.
- [ ] **Step 2: Implement responsive shell and dashboard.**
- [ ] **Step 3: Implement Incoming Reports and Review Queue.**
- [ ] **Step 4: Implement source-linked Incident Intelligence and Decision Card.**
- [ ] **Step 5: Run UI tests and verify pass.**

### Task 8: Build live incident map and audit history

**Files:**
- Create: `src/components/IncidentMap.jsx`
- Create: `src/pages/MapPage.jsx`, `src/pages/AuditHistoryPage.jsx`
- Modify: `src/styles/app.css`

**Interfaces:**
- Current map displays reconstructed incidents and opens an incident intelligence summary.
- Separate layer control can show synthetic historical-context markers without fabricated casualty claims.
- Audit page displays chronological report ingestion, model/rule recommendation, human linking correction, evidence update, workflow recommendation, and operator approval/override.

- [ ] **Step 1: Add rendering tests** for map-page incident metadata and audit-history event semantics (Leaflet itself may be mocked in jsdom).
- [ ] **Step 2: Implement Chennai-centered Leaflet map and incident popups.**
- [ ] **Step 3: Implement audit history timeline.**
- [ ] **Step 4: Run tests and verify pass.**

### Task 9: Wire the canonical end-to-end demo transition

**Files:**
- Modify: `src/repository/demoRepository.js`, `src/pages/IncidentDetailPage.jsx`, `src/pages/DashboardPage.jsx`
- Test: `tests/reconcileIncident.test.js`, UI integration test if practical.

**Interfaces:**
- Initial demo: A–D linked, E separate; rescue-status conflict; Critical urgency; Medium confidence; RAPID_VERIFY.
- Operator can inject canonical field evidence: “Rescue has not been completed. Two elderly people remain on the rooftop.”
- Updated demo: rescue status not completed, at least 2 remaining, confidence High, workflow DISPATCH_FOR_APPROVAL.

- [ ] **Step 1: Add failing transition test.**
- [ ] **Step 2: Implement field-evidence action and recomputation.**
- [ ] **Step 3: Verify UI updates and audit event append.**

### Task 10: Final accessibility, responsive polish, and verification

**Files:**
- Modify: `src/styles/app.css`, relevant page/component files, `README.md`

**Interfaces:**
- App remains legible at mobile width and presentation desktop width.
- Interactive controls have accessible labels and visible focus states.
- README explains demo mode, Firebase configuration, commands, canonical judging flow, and what is intentionally not autonomous.

- [ ] **Step 1: Add README and environment setup instructions.**
- [ ] **Step 2: Run `npm test -- --run`.**
- [ ] **Step 3: Run `npm run build`.**
- [ ] **Step 4: Run the app locally and smoke-test the canonical flow.**
- [ ] **Step 5: Inspect git diff for secrets, placeholders, and accidental generated files.**
