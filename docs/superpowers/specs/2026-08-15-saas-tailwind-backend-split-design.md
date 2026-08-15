# ResQMap SaaS UI + Separate Backend Design

## Goal
Refactor the current ResQMap prototype into a professional light SaaS dashboard using Tailwind CSS, with no gradients, while separating Firebase/Firestore access into a standalone Node REST backend service.

## Product constraints
- Preserve the existing ResQMap conflict-aware workflow and domain behavior.
- Keep the seven operator views and existing demo journey.
- Do not use gradients anywhere in the UI.
- Use a light SaaS visual system: white surfaces, slate neutrals, subtle borders/shadows, blue primary actions, red/amber/emerald semantic states.
- Use Tailwind CSS for application styling instead of the current handwritten theme stylesheet.
- Frontend must not import Firebase SDKs.
- Backend owns Firebase Admin/Firestore access and exposes REST endpoints.
- Provide a demo/in-memory backend mode when Firebase Admin credentials are not configured.

## Architecture

### Frontend
`frontend/` contains the React + Vite SPA. It uses Tailwind for styling and calls the backend through a small API client. The existing domain visualization concepts and page structure remain, but repository hooks become HTTP-backed rather than Firebase-backed.

### Backend
`backend/` contains a Node HTTP service. The service exposes reports, incidents, review decisions, field evidence, operator decisions, and audit events. It uses Firebase Admin when credentials are present and an in-memory demo repository otherwise.

### Shared domain
The current deterministic reconciliation engine is moved into `shared/domain/` so the backend can use it without duplication. Demo reports move to `shared/data/`.

## API surface
- `GET /api/health`
- `GET /api/state` — reports, incidents, audit events
- `POST /api/reports` — ingest report
- `POST /api/reviews/:reportId` — LINK / CREATE / HOLD decision
- `POST /api/incidents/:incidentId/evidence` — append verified field evidence
- `POST /api/incidents/:incidentId/decisions` — approve / reject / override workflow recommendation

## Frontend visual system
- App background: slate-50 / neutral off-white.
- Sidebar: white, 1px slate border, fixed desktop rail, collapsible/mobile friendly.
- Topbar: white with compact context labels and operator avatar/chip.
- Cards: white with `border-slate-200`, `shadow-sm`, 12–16px radius.
- Typography: dark slate headings, muted slate body text.
- Primary: blue-600/700.
- Critical: red-600 on red-50.
- Warning: amber-600 on amber-50.
- Success: emerald-600 on emerald-50.
- No glassmorphism, backdrop blur, decorative radial effects, or gradients.

## Error handling
The API client normalizes non-2xx responses into readable errors. The frontend shows a compact inline error banner and keeps the last loaded data. The backend validates known action enums and returns JSON errors with suitable HTTP status codes.

## Testing
- Existing domain tests continue to pass after relocation.
- Backend route/repository tests cover demo state and decision mutations.
- Static UI contract tests assert Tailwind is configured, no gradient utilities/CSS gradients exist, frontend has no Firebase imports, and all required routes remain.
