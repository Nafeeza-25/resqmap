# ResQMap — Conflict-Aware Disaster Intelligence

**Live Demo**: [https://resqmap.web.app](https://resqmap.web.app)
**Backend API**: [https://api-eujvax6bvq-uc.a.run.app/api/health](https://api-eujvax6bvq-uc.a.run.app/api/health)

ResQMap is a human-in-the-loop disaster-response intelligence prototype that turns fragmented and conflicting reports into a source-linked incident picture. It preserves contradictions, separates **urgency** from **evidence confidence**, identifies the **decision-critical evidence gap**, and recommends an auditable next workflow for an operator to approve or override.

The project follows `docs/reference/resqmap-full-project-spec.md`.

## What changed in this version

This build is organized like a small SaaS product instead of a single frontend prototype:

- **Light SaaS dashboard** — white/slate surfaces, subtle borders and shadows, blue primary actions, semantic red/amber/emerald states.
- **Tailwind CSS** — the UI system is implemented through Tailwind utilities/component layers.
- **No gradients** — there are no decorative color gradients in the application UI.
- **Separate backend** — the React app never imports Firebase. All Firestore access is server-side through Firebase Admin.
- **Demo-safe backend** — if Firebase Admin credentials are absent, the backend runs the controlled Chennai dataset in memory.

## Architecture

```text
Browser
  │
  │ HTTP / JSON
  ▼
frontend/                 backend/
React + Vite              Node REST API
Tailwind CSS              repository boundary
Leaflet / OSM             │
                          ├── demo in-memory repository
                          └── Firebase Admin / Firestore
                                  │
                                  ▼
shared/
Conflict-aware reconciliation engine + controlled demo data
```

The browser is presentation/action only. Matching, reconstruction, workflow recomputation, audit mutations, and Firestore persistence happen behind the backend API.

## Operator screens

1. **Overview** — current workload, critical incidents, visible contradictions, demo journey.
2. **Incoming Reports** — source-preserving report ingestion.
3. **LINK / CREATE / HOLD Review** — human confirmation of incident matching.
4. **Source-Linked Incident & Conflict View** — agreements, contradictions, missing evidence, linked sources.
5. **Urgency & Evidence Confidence** — danger and evidence strength kept separate.
6. **Decision Card & Human Approval** — RAPID VERIFY / DISPATCH FOR APPROVAL / STANDARD QUEUE / MONITOR with operator action.
7. **Live Disaster Map** — current incidents on Leaflet/OpenStreetMap.
8. **Audit History** — append-style model/rule and operator action history.

## Canonical demo

Reports A–D describe the Gandhi Street flood incident. Report C says the family was rescued while Report D says people are still shouting from the roof. ResQMap keeps both source claims visible, scores urgency as **Critical**, evidence confidence as **Medium**, identifies current rescue status as the highest-impact evidence gap, and recommends **RAPID VERIFY**.

On Incident #21, choose **Add verified field evidence**. Field Unit 3 confirms that rescue is not complete and two elderly people remain on the rooftop. The current evidence gap resolves, confidence becomes **High**, the old contradiction remains in the audit/source history, and the recommendation changes to **DISPATCH FOR APPROVAL**.

## Project structure

```text
resqmap/
├── frontend/
│   ├── src/
│   │   ├── api/          # HTTP client only
│   │   ├── app/          # routes/application root
│   │   ├── components/   # reusable dashboard UI
│   │   ├── hooks/        # API-backed state subscriptions
│   │   ├── pages/        # operator screens
│   │   ├── repository/   # API repository adapter
│   │   └── styles/       # Tailwind component layer
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/
│   ├── src/
│   │   ├── app.js        # REST routing/validation
│   │   ├── server.js     # Node HTTP server
│   │   └── repository/   # demo + Firebase Admin adapters
│   └── tests/
├── shared/
│   ├── data/             # controlled report pack
│   └── domain/           # deterministic reconciliation engine
└── tests/                # domain + architecture/UI contracts
```

## Run locally

Requirements: Node.js 20+ and npm.

Install workspace dependencies from the project root:

```bash
npm install
```

Start both services:

```bash
npm run dev
```

Default development URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8787`
- Health check: `http://localhost:8787/api/health`

You can also run them separately:

```bash
npm run dev:backend
npm run dev:frontend
```

### Frontend configuration

Copy the template only when the API lives somewhere other than the default local backend:

```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_URL=http://localhost:8787/api
```

There are **no Firebase web credentials in the frontend**.

## Backend modes

### Zero-configuration demo mode

The backend defaults to the controlled in-memory dataset when service-account credentials are absent.

```bash
npm run dev:backend
```

This mode supports report ingestion, LINK / CREATE / HOLD decisions, field evidence, workflow decisions, and audit history for the current process lifetime.

### Firebase / Firestore mode

Copy the server template:

```bash
cp backend/.env.example backend/.env
```

Then configure:

```env
RESQMAP_BACKEND_MODE=firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
CORS_ORIGIN=http://localhost:5173
PORT=8787
```

The backend loads `.env` through Node's `--env-file-if-exists` option. Keep the service-account private key server-side and never prefix it with `VITE_`.

Firestore collections:

- `reports`
- `incidents`
- `auditEvents`

When Firestore is empty, the Overview screen can call the backend demo-seeding endpoint.

## REST API

```text
GET  /api/health
GET  /api/state
POST /api/reports
POST /api/reviews/:reportId
POST /api/incidents/:incidentId/evidence
POST /api/incidents/:incidentId/decisions
POST /api/admin/seed-demo
POST /api/demo/reset
```

Review decisions accept only `LINK`, `CREATE`, or `HOLD`. Workflow decisions accept only `APPROVE`, `REJECT`, or `OVERRIDE`.

## Tests

No third-party packages are required for the core/backend/static suite once the repository is present:

```bash
npm test
```

It covers the reconciliation engine, contradiction preservation, evidence ranking, workflow transition, backend REST behavior, backend mode selection, UI routes, Tailwind architecture, **no-gradient enforcement**, and **no-Firebase-in-frontend enforcement**.

After `npm install`, run the React smoke test and production build:

```bash
npm run test:ui
npm run build
```

## Firebase Hosting

`firebase.json` points Hosting at `frontend/dist`:

```bash
npm run build
firebase deploy --only hosting
```

The backend must be deployed separately (for example to a Node server/Cloud Run/Functions-style HTTP environment) and `VITE_API_URL` must point to that deployment before building the frontend.

## Prototype boundaries

The current claim extractor is deterministic and tuned to the controlled round-one vocabulary. It demonstrates the data contracts and decision workflow without requiring an external model credential during judging. A later stage can replace the extraction boundary with a schema-constrained LLM and add embedding-based similarity while keeping source preservation, deterministic conflict handling, audit history, and human approval intact.

ResQMap does not claim to discover ground truth and does not autonomously dispatch responders.
