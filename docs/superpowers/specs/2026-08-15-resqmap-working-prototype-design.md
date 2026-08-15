# ResQMap Working Prototype Design

> **SUPERSEDED:** This early citizen/responder concept is retained only for history. The current source of truth is `docs/reference/resqmap-full-project-spec.md`, and the active implementation plan is `docs/superpowers/plans/2026-08-15-resqmap-conflict-aware-mvp.md`.


Date: 2026-08-15
Status: Approved design for implementation planning

## 1. Goal

Build a submission-ready, working ResQMap prototype that demonstrates one complete emergency-response journey using the project's real stack: React + Vite on the frontend and Firebase Firestore on the backend.

The prototype must prove that a citizen can report an emergency on a real map, the report is persisted to Firestore, a responder can see and update the incident, and the citizen's tracking view reflects those status changes in real time.

## 2. Scope

### Included

- React + Vite single-page web application.
- One application with a simple Citizen / Responder role switch; no authentication in this stage.
- Leaflet map using OpenStreetMap tiles.
- A fixed demo map location so the presentation is predictable.
- Optional browser geolocation via a "Use My Location" action.
- Citizen emergency-report form.
- Firestore `emergencies` collection.
- Real-time Firestore listeners for incident updates.
- Citizen incident tracking.
- Responder dashboard with map markers and incident cards.
- Responder status updates.
- Basic validation, loading, empty, and error states.
- Responsive layout suitable for desktop presentation and mobile-width use.

### Explicitly excluded from this prototype

- Firebase Authentication and protected responder accounts.
- Push notifications or SMS.
- In-app chat.
- Turn-by-turn routing/navigation.
- AI-based prioritization or classification.
- Admin analytics.
- Multi-organization or multi-responder assignment logic.
- Production-grade authorization/security model.

These are deferred so the submission prototype can focus on a reliable end-to-end workflow.

## 3. Chosen Approach

Use one React + Vite application containing both citizen and responder views. The user selects a role from the landing page or role switcher. Both views read and write the same Firestore `emergencies` collection.

This approach is preferred over separate applications or a full authentication flow because it minimizes setup and demo risk while still proving the core ResQMap concept with real persisted data and real-time synchronization.

## 4. User Flows

### 4.1 Citizen flow

1. User opens ResQMap.
2. User selects **Report Emergency**.
3. The report screen opens with the map centered on a fixed demo location.
4. User chooses an emergency type: Medical, Fire, Flood, Accident, or Other.
5. User adds a short description.
6. User enters a reporter name and contact value.
7. User confirms the map location by moving/selecting the marker, or uses **Use My Location**.
8. User submits the report.
9. The app validates required fields and writes a new document to Firestore.
10. The app navigates to the incident tracking screen.
11. The tracking screen listens to that incident document in real time and shows the current status.

### 4.2 Responder flow

1. User switches to **Responder Dashboard**.
2. The dashboard subscribes to Firestore emergency records.
3. Active incidents appear as map markers and cards.
4. The responder selects an incident.
5. The responder updates its status through the supported workflow.
6. The app writes the new status and update timestamp to Firestore.
7. The citizen tracking view receives the Firestore update without requiring a manual refresh.

## 5. Incident Status Model

The prototype uses these canonical status values:

- `pending` — report submitted and waiting for a responder.
- `accepted` — a responder has acknowledged the incident.
- `on_the_way` — responder is traveling to the incident.
- `resolved` — incident marked complete.

Allowed forward transitions:

`pending -> accepted -> on_the_way -> resolved`

For prototype simplicity, the responder UI does not support arbitrary backward transitions.

Citizen-facing labels map to these values:

- `pending`: Awaiting responder
- `accepted`: Responder assigned
- `on_the_way`: Help is on the way
- `resolved`: Resolved

## 6. Firestore Data Model

Collection: `emergencies`

Each emergency document contains:

```js
{
  type: "medical",              // medical | fire | flood | accident | other
  description: "Person injured near road",
  reporterName: "Demo User",
  contact: "9876543210",
  location: {
    lat: 12.9716,
    lng: 77.5946
  },
  status: "pending",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

The Firestore document ID is the incident ID used in the tracking route.

No sensitive production data should be used in the submission demo. Reporter details are demo data only.

## 7. Routes and Screens

### `/`
Home / role entry.

Primary actions:
- Report Emergency
- Responder Dashboard

### `/report`
Citizen emergency-report screen.

Contains:
- emergency type selector
- map/location picker
- Use My Location action
- description
- reporter name
- contact
- submit action

### `/track/:incidentId`
Citizen tracking screen for a submitted emergency.

Contains:
- incident summary
- status progress indicator
- map/location summary
- real-time state changes
- clear resolved state

### `/responder`
Responder dashboard.

Contains:
- active-emergency map
- incident list/cards
- selected incident detail
- status transition controls
- resolved incidents may remain visible but visually separated from active incidents

## 8. Component Boundaries

Suggested structure:

```text
src/
├── components/
│   ├── Navbar.jsx
│   ├── RoleSwitcher.jsx
│   ├── EmergencyMap.jsx
│   ├── LocationPicker.jsx
│   ├── EmergencyCard.jsx
│   ├── StatusBadge.jsx
│   └── StatusTimeline.jsx
├── pages/
│   ├── Home.jsx
│   ├── ReportEmergency.jsx
│   ├── TrackEmergency.jsx
│   └── ResponderDashboard.jsx
├── services/
│   ├── firebase.js
│   └── emergencyService.js
├── data/
│   └── demoLocation.js
├── App.jsx
└── main.jsx
```

Responsibilities:

- `firebase.js`: initialize Firebase from Vite environment variables and export Firestore.
- `emergencyService.js`: isolate Firestore create, subscribe, list, and status-update operations.
- `EmergencyMap.jsx`: display incidents or a selected location on Leaflet.
- `LocationPicker.jsx`: citizen-specific location selection behavior.
- `StatusTimeline.jsx`: map canonical statuses to citizen-facing progress.
- Page components coordinate UI state and navigation; they should not contain raw Firebase initialization logic.

## 9. Data Flow

### Create report

`ReportEmergency -> emergencyService.createEmergency -> Firestore -> navigate to /track/:incidentId`

### Track report

`TrackEmergency -> emergencyService.subscribeToEmergency(incidentId) -> Firestore onSnapshot -> UI`

### Dashboard

`ResponderDashboard -> emergencyService.subscribeToEmergencies -> Firestore onSnapshot -> cards + map markers`

### Update status

`ResponderDashboard -> emergencyService.updateEmergencyStatus -> Firestore -> all active listeners receive update`

## 10. Mapping Behavior

- Use Leaflet with OpenStreetMap tiles.
- The prototype starts at a fixed demo location configured in `src/data/demoLocation.js`.
- Default design location: Bengaluru city center, approximately `12.9716, 77.5946`.
- Citizen can move/select the incident marker before submission.
- Browser geolocation is optional and never blocks the flow.
- If geolocation is denied or unavailable, the fixed demo location remains active and an inline message explains that the demo location is being used.
- The responder map displays markers for stored incidents with valid coordinates.

## 11. Error and Edge-State Handling

### Firebase configuration missing

Display a clear configuration error instead of a blank screen or uncaught exception.

### Firestore write failure

Keep the form values and show a retryable submission error.

### Firestore listener failure

Show an error state and allow a page refresh/retry rather than silently showing stale data.

### Unknown tracking ID

Show "Incident not found" with a route back to the home screen.

### No incidents

Responder dashboard shows a clear empty state.

### Invalid form

Required fields are validated before a Firestore write. Description should have a sensible prototype length limit; location coordinates must be valid numbers.

### Geolocation failure

Continue using the demo location and show a non-blocking explanation.

## 12. Firebase Configuration

Use Vite environment variables, for example:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Provide `.env.example`; do not commit real Firebase secrets/configuration values supplied for a private project.

Firestore is the only Firebase product required for this prototype. Authentication is intentionally not part of this stage.

## 13. Prototype Security Note

Because the responder dashboard has no authentication, this prototype is not production-safe. Firestore rules used for a public demo must be narrowly scoped to the demo project and should not be treated as production rules.

The UI should visibly position the build as a prototype/demo if appropriate for the submission.

## 14. Visual Direction

The interface should communicate emergency-response utility rather than look like a generic dashboard.

- Clear hierarchy and high-visibility emergency actions.
- Map is a primary visual element, not decorative.
- Status colors and labels remain consistent across citizen and responder views.
- Cards use concise information density so incidents can be scanned quickly.
- Mobile layout stacks controls below/above the map without breaking core actions.
- Desktop responder view gives the map and incident list enough simultaneous space for a convincing live demo.

No complex design system is required for stage one.

## 15. Testing Strategy

Minimum automated tests should cover the isolated application logic where practical:

- form validation
- status-label/status-transition utilities
- Firestore service behavior using mocks
- key page behavior for success and error states

Manual submission test:

1. Start app with Firebase configuration.
2. Submit a citizen emergency.
3. Verify document appears in Firestore.
4. Open responder dashboard and verify incident appears without manually injecting data.
5. Change `pending -> accepted` and verify citizen tracking updates.
6. Change `accepted -> on_the_way` and verify citizen tracking updates.
7. Change `on_the_way -> resolved` and verify citizen tracking updates.
8. Refresh both views and verify persisted Firestore state remains correct.
9. Deny browser geolocation and verify the fixed demo-location flow still works.

## 16. Definition of Done

The working-stage prototype is complete when:

- It runs locally through the standard Vite development command.
- Firebase configuration can be supplied through environment variables.
- A citizen can submit a valid emergency from the UI.
- Firestore persists the incident.
- The responder dashboard displays the incident from Firestore.
- The responder can progress it through all four statuses.
- Citizen tracking updates in real time from Firestore.
- The real Leaflet/OpenStreetMap map renders on report and responder views.
- Fixed demo location works without browser-location permission.
- Primary success, loading, empty, invalid-input, and Firebase-error states are handled visibly.
- The app remains usable at common mobile and desktop widths.
- The project contains setup instructions sufficient for the submission team to run the prototype.

## 17. Deferred Follow-up

After this prototype is stable, the next logical stage is Firebase Authentication with responder-only protected actions and production-oriented Firestore security rules. That is intentionally outside the current submission milestone.
