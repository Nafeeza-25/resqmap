# ResQMap

**A disaster intelligence tool that turns conflicting reports into clear, actionable incident pictures.**

🌐 **Live App**: [https://resqmap.web.app](https://resqmap.web.app)
🔌 **API Health**: [https://api-eujvax6bvq-uc.a.run.app/api/health](https://api-eujvax6bvq-uc.a.run.app/api/health)

---

## What is ResQMap?

During disasters, rescue teams receive multiple conflicting reports about the same incident — one source says a person was rescued, another says people are still trapped. ResQMap helps operators make sense of these contradictions.

It:
- **Groups** reports that likely belong to the same incident
- **Preserves contradictions** instead of hiding them
- **Scores urgency** and **evidence confidence** separately
- **Identifies the most critical missing fact** to verify next
- **Recommends a workflow** (e.g. RAPID VERIFY, DISPATCH FOR APPROVAL)
- **Requires human approval** before any action is taken

---

## Demo Scenario

Reports A–D describe a flood at Gandhi Street, Chennai:
- Report C says the family was **rescued**
- Report D says people are **still shouting from the rooftop**

ResQMap keeps both claims visible, scores urgency as **Critical**, confidence as **Medium**, and recommends **RAPID VERIFY** to resolve the conflict.

When a field unit confirms rescue is incomplete, the confidence rises to **High** and the recommendation changes to **DISPATCH FOR APPROVAL**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express (Firebase Cloud Functions) |
| Database | Firebase Firestore (or in-memory demo mode) |
| Map | Leaflet + OpenStreetMap |
| Hosting | Firebase Hosting |

---

## Project Structure

```
resqmap/
├── frontend/        # React app (UI, pages, components)
├── backend/         # REST API (Firebase Cloud Functions)
├── shared/          # Shared logic (reconciliation engine, demo data)
└── tests/           # Domain and architecture tests
```

---

## Run Locally

**Requirements:** Node.js 20+

```bash
# Install all dependencies
npm install

# Run frontend + backend together
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8787
- API Health: http://localhost:8787/api/health

---

## API Endpoints

```
GET  /api/health                           — check if the server is running
GET  /api/state                            — get all reports, incidents, audit log
POST /api/reports                          — submit a new report
POST /api/reviews/:reportId                — LINK, CREATE, or HOLD a report
POST /api/incidents/:incidentId/evidence   — add verified field evidence
POST /api/incidents/:incidentId/decisions  — APPROVE, REJECT, or OVERRIDE
POST /api/admin/seed-demo                  — load the Chennai demo dataset
POST /api/demo/reset                       — reset to initial demo state
```

---

## Backend Modes

**Demo mode (default)** — no setup needed, runs in-memory with the Chennai dataset.

**Firebase mode** — connects to Firestore for persistent storage. Set these environment variables in `backend/.env`:



---

## Deploy

```bash
# Build the frontend
npm run build

# Deploy everything to Firebase
firebase deploy
```

---

## Key Design Decisions

- **No autonomous dispatch** — a human must always approve before action
- **Contradictions are never hidden** — they stay visible in the audit trail
- **Urgency ≠ Confidence** — a critical incident can still have low evidence confidence
- **Firebase credentials stay server-side** — the frontend never touches them
