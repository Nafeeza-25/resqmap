ResQMap — Conflict-Aware Disaster Intelligence

A human-in-the-loop disaster-response intelligence prototype that reconciles fragmented and conflicting reports into a source-linked, auditable incident picture.






Live Demo: https://resqmap.web.app
Backend API Health: https://api-eujvax6bvq-uc.a.run.app/api/health

ResQMap helps disaster-response operators reason about incomplete, duplicated, and contradictory field reports without hiding uncertainty. Instead of collapsing all incoming information into a single assumed truth, it:

preserves conflicting claims and their sources;

separates urgency from evidence confidence;

identifies the decision-critical evidence gap;

recommends a next operational workflow;

keeps the final decision under human control; and

records model/rule and operator actions for auditability.

The implementation follows:

docs/reference/resqmap-full-project-spec.md

Table of Contents

Why ResQMap

What Changed in This Version

Core Principles

Architecture

Operator Workflow

Operator Screens

Canonical Demo

Project Structure

Requirements

Run Locally

Frontend Configuration

Backend Modes

Firebase / Firestore Configuration

REST API

Testing

Production Build

Firebase Hosting

Security and Architecture Notes

Prototype Boundaries

Why ResQMap

During a disaster, reports may arrive from residents, volunteers, field teams, call centers, and other sources at different times and with different levels of reliability.

Those reports can:

refer to the same incident using different wording;

contain incomplete or stale information;

directly contradict one another;

create false confidence when merged too aggressively; or

leave operators unsure what should be verified next.

ResQMap is designed around a different assumption:

Contradictions are operational evidence, not data-cleaning errors.

The system keeps source claims visible, reconstructs incidents behind an API boundary, scores operational danger separately from confidence in the available evidence, and gives an operator an auditable workflow recommendation to approve, reject, or override.

What Changed in This Version

This build is organized like a small SaaS product rather than a single frontend prototype.

UI and product structure

Light SaaS dashboard using white/slate surfaces, subtle borders and shadows, blue primary actions, and semantic red/amber/emerald states.

Tailwind CSS for the visual system through utility classes and component layers.

No decorative gradients in the application UI.

Multiple operator-focused screens instead of a single prototype page.

Backend architecture

Separate backend service for state, reconciliation actions, persistence, and audit mutations.

The React frontend does not import Firebase.

Firestore access is server-side through Firebase Admin.

A repository boundary allows the backend to switch between:

an in-memory controlled demo repository; and

Firebase / Firestore persistence.

Demo reliability

The application can run without Firebase Admin credentials.

In that case, the backend automatically uses the controlled Chennai demo dataset in memory.

The demo still supports ingestion, review, evidence updates, workflow decisions, and audit history.

Core Principles

1. Preserve source claims

ResQMap does not overwrite disagreement with a single synthesized statement. Source-level claims remain visible so operators can see who reported what.

2. Separate urgency from confidence

A situation can be highly dangerous even when the evidence is incomplete.

ResQMap therefore treats:

Urgency as the severity and time sensitivity of the incident; and

Evidence confidence as the strength and consistency of the available evidence.

These are intentionally different dimensions.

3. Surface the highest-impact evidence gap

The system identifies the unresolved fact most likely to change the operational decision.

4. Keep humans in control

Recommendations such as RAPID VERIFY or DISPATCH FOR APPROVAL are workflow recommendations, not autonomous responder dispatches.

5. Maintain an audit trail

Important model/rule outputs and operator actions are retained in append-style audit history.

Architecture

Browser
  │
  │ HTTP / JSON
  ▼
frontend/                       backend/
React + Vite                    Node REST API
Tailwind CSS                    Repository boundary
Leaflet / OpenStreetMap         │
                               ├── Demo in-memory repository
                               └── Firebase Admin / Firestore
                                         │
                                         ▼
shared/
Conflict-aware reconciliation engine
+ controlled demo data

Responsibility boundaries

Layer

Responsibility

frontend/

Presentation, operator interaction, API calls, map rendering

backend/

REST endpoints, validation, state transitions, persistence, audit mutations

shared/domain/

Deterministic conflict-aware reconciliation logic

shared/data/

Controlled demo report pack

Firestore

Persistent reports, incidents, and audit events when Firebase mode is enabled

The browser is intentionally presentation/action only.

Matching, incident reconstruction, workflow recomputation, audit mutations, and Firestore persistence happen behind the backend API.

Operator Workflow

A typical ResQMap workflow is:

Incoming report
      │
      ▼
Match recommendation
      │
      ├── LINK
      ├── CREATE
      └── HOLD
      │
      ▼
Source-linked incident reconstruction
      │
      ▼
Agreements + contradictions + missing evidence
      │
      ▼
Urgency score + evidence confidence
      │
      ▼
Decision-critical evidence gap
      │
      ▼
Recommended workflow
      │
      ├── RAPID VERIFY
      ├── DISPATCH FOR APPROVAL
      ├── STANDARD QUEUE
      └── MONITOR
      │
      ▼
Human APPROVE / REJECT / OVERRIDE
      │
      ▼
Audit history

Operator Screens

1. Overview

Shows the current operational picture, including:

current workload;

critical incidents;

visible contradictions; and

the guided demo journey.

2. Incoming Reports

Supports source-preserving report ingestion.

Incoming reports remain traceable rather than being flattened into an anonymous incident summary.

3. LINK / CREATE / HOLD Review

Allows a human operator to confirm the incident-matching decision:

LINK — attach the report to an existing incident;

CREATE — create a new incident; or

HOLD — defer the matching decision.

4. Source-Linked Incident & Conflict View

Displays:

agreements;

contradictions;

missing evidence; and

linked source reports.

5. Urgency & Evidence Confidence

Keeps operational danger separate from evidence strength.

This prevents low confidence from being interpreted as low urgency.

6. Decision Card & Human Approval

Displays the recommended workflow:

RAPID VERIFY

DISPATCH FOR APPROVAL

STANDARD QUEUE

MONITOR

The operator can then take an explicit action.

7. Live Disaster Map

Displays current incidents using Leaflet and OpenStreetMap.

8. Audit History

Shows append-style history for:

model/rule-driven changes; and

operator decisions.

Canonical Demo

The controlled demo centers on a flood incident on Gandhi Street.

Reports A–D describe the same incident.

Two reports create a direct operational contradiction:

Report C says the family was rescued.

Report D says people are still shouting from the roof.

ResQMap does not discard either statement.

Instead, it:

keeps both claims source-linked and visible;

scores urgency as Critical;

scores evidence confidence as Medium;

identifies current rescue status as the highest-impact evidence gap; and

recommends RAPID VERIFY.

Demo progression

On Incident #21, choose:

Add verified field evidence

Field Unit 3 then confirms:

rescue is not complete; and

two elderly people remain on the rooftop.

After that evidence is added:

the current rescue-status evidence gap is resolved;

evidence confidence becomes High;

the older contradiction remains visible in source/audit history; and

the recommendation changes to DISPATCH FOR APPROVAL.

This demonstrates that new verified evidence can change the current operational decision without rewriting historical claims.

Project Structure

resqmap/
├── frontend/
│   ├── src/
│   │   ├── api/          # HTTP client only
│   │   ├── app/          # routes and application root
│   │   ├── components/   # reusable dashboard UI
│   │   ├── hooks/        # API-backed state subscriptions
│   │   ├── pages/        # operator screens
│   │   ├── repository/   # API repository adapter
│   │   └── styles/       # Tailwind component layer
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/
│   ├── src/
│   │   ├── app.js        # REST routing and validation
│   │   ├── server.js     # Node HTTP server
│   │   └── repository/   # demo + Firebase Admin adapters
│   └── tests/
│
├── shared/
│   ├── data/             # controlled report pack
│   └── domain/           # deterministic reconciliation engine
│
└── tests/                # domain + architecture/UI contracts

Requirements

Node.js 20+

npm

Firebase credentials are not required for the default demo mode.

Run Locally

1. Install dependencies

From the project root:

npm install

2. Start frontend and backend together

npm run dev

Default development URLs:

Service

URL

Frontend

http://localhost:5173

Backend

http://localhost:8787

Health check

http://localhost:8787/api/health

3. Run services separately

Backend:

npm run dev:backend

Frontend:

npm run dev:frontend

Frontend Configuration

You only need a frontend .env file when the API is hosted somewhere other than the default local backend.

Copy the template:

cp frontend/.env.example frontend/.env

Set the API base URL:

VITE_API_URL=http://localhost:8787/api

Important: There are no Firebase web credentials in the frontend.

The browser communicates only with the ResQMap backend API.

Backend Modes

ResQMap supports two backend repository modes.

Zero-Configuration Demo Mode

When Firebase Admin credentials are absent, the backend uses the controlled in-memory demo repository.

Start it with:

npm run dev:backend

This mode supports:

report ingestion;

LINK / CREATE / HOLD review decisions;

verified field evidence;

workflow decisions; and

audit history.

Because the repository is in memory, state exists only for the lifetime of the running backend process.

Firebase / Firestore Configuration

For persistent storage, copy the backend environment template:

cp backend/.env.example backend/.env

Configure:

RESQMAP_BACKEND_MODE=firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
CORS_ORIGIN=http://localhost:5173
PORT=8787

The backend loads .env using Node's:

--env-file-if-exists

Credential rules

Keep Firebase service-account credentials on the server.

Do not expose them through frontend environment variables and never prefix a private service credential with VITE_.

Firestore collections

ResQMap uses:

reports
incidents
auditEvents

When Firestore is empty, the Overview screen can call the backend demo-seeding endpoint.

REST API

Base path:

/api

Endpoints

Method

Endpoint

Purpose

GET

/api/health

Backend health check

GET

/api/state

Retrieve current application state

POST

/api/reports

Ingest a source-linked report

POST

/api/reviews/:reportId

Apply a report matching decision

POST

/api/incidents/:incidentId/evidence

Add verified incident evidence

POST

/api/incidents/:incidentId/decisions

Record a human workflow decision

POST

/api/admin/seed-demo

Seed the controlled demo dataset

POST

/api/demo/reset

Reset demo state

Review decisions

POST /api/reviews/:reportId accepts only:

LINK
CREATE
HOLD

Workflow decisions

POST /api/incidents/:incidentId/decisions accepts only:

APPROVE
REJECT
OVERRIDE

Testing

Run the core, backend, and static contract test suite:

npm test

The suite covers:

reconciliation behavior;

contradiction preservation;

evidence ranking;

workflow transitions;

backend REST behavior;

backend mode selection;

UI route contracts;

Tailwind architecture;

no-gradient enforcement; and

no-Firebase-in-frontend enforcement.

After installing dependencies, run the React smoke test:

npm run test:ui

Then verify the production build:

npm run build

Production Build

Build the frontend from the repository root:

npm run build

The generated frontend output is expected under:

frontend/dist

Firebase Hosting

firebase.json points Firebase Hosting at:

frontend/dist

Build and deploy the frontend:

npm run build
firebase deploy --only hosting

The backend must be deployed separately, for example to a Node server, Cloud Run, or a Functions-style HTTP environment.

Before building the frontend for production, configure:

VITE_API_URL=https://your-backend.example.com/api

so the browser points to the deployed backend rather than localhost.

Security and Architecture Notes

No Firebase Admin credentials in the browser

Firebase Admin credentials belong only in the backend environment.

No direct frontend-to-Firestore access

The frontend does not read or mutate Firestore directly.

All application state changes go through the backend API.

Source history is preserved

Adding better evidence updates the current operational picture but does not erase earlier contradictory reports.

Human approval remains explicit

The system can recommend an operational workflow, but it does not autonomously dispatch responders.

Demo mode is intentionally controlled

The in-memory mode exists to make the prototype reproducible without requiring external Firebase credentials during evaluation.

Prototype Boundaries

The current claim extractor is deterministic and tuned to the controlled round-one vocabulary.

Its purpose is to demonstrate:

source-preserving data contracts;

deterministic conflict handling;

incident reconstruction;

evidence-gap prioritization;

urgency/confidence separation;

workflow transitions;

operator approval; and

auditability.

It does not require an external model credential during judging.

A later implementation could replace the extraction boundary with a schema-constrained LLM and add embedding-based similarity while preserving the current system guarantees:

source preservation;

deterministic conflict handling;

audit history; and

human approval.

ResQMap does not claim to discover ground truth and does not autonomously dispatch responders.

Quick Start

For the shortest local demo path:

npm install
npm run dev

Then open:

http://localhost:5173

The backend will use the controlled in-memory dataset automatically when Firebase Admin credentials are not configured.