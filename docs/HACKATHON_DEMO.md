# ResQMap Hackathon Demo

## Event setup

1. Use Node.js 20 or newer.
2. From the project root, run `npm install` if dependencies are not already present.
3. Run `npm run dev` to start the API and frontend together.
4. Open the local frontend address printed in the terminal.
5. Confirm the terminal says `ResQMap API ready at http://localhost:8787/api`.
6. Confirm the sidebar says **Operational** and the command center shows two active incidents.
7. Keep the browser at 100% zoom and use a screen width of at least 1280 pixels for the clearest map-and-queue layout.

## Two-minute presentation flow

### 1. Explain the problem — 20 seconds

“During a disaster, the same incident arrives through citizen forms, calls, field notes, and multiple languages. Responders lose time deciding which reports belong together and which facts are trustworthy.”

On the command center, point to the Chennai flood incident, the conflicting evidence, and the **Verify evidence** posture.

### 2. Verify a duplicate report — 35 seconds

Open **Verify** from the guided panel. Find Reporter G and link it to **INC-21**. Explain that ResQMap recommends a match, but a human confirms the relationship before the incident record changes.

### 3. Resolve decision-critical uncertainty — 35 seconds

Open **Inspect intelligence** from the guided panel. Show the contradiction between “already rescued” and “still trapped.” Add the prepared Field Unit 3 evidence. Explain that verified field evidence raises confidence and changes the workflow from rapid verification to dispatch approval.

### 4. Make and preserve the decision — 25 seconds

Open **Open decision desk**, approve the response, and add a short dispatch note. Then open **History** to show that the original reports, machine recommendations, field evidence, and human decision remain auditable.

### 5. Close — 5 seconds

“ResQMap does not replace responders. It helps them turn noisy reports into a faster, explainable, human-controlled rescue decision.”

## Restart and recovery

- Click **Restart demo** on the command center before every judging session. Wait for: “Demo restored. Start with the verification queue.”
- If a page says the response network is unavailable, confirm the backend terminal is still running and click **Try again**.
- If the map tiles are unavailable because event Wi-Fi is down, the incident queue, evidence workflow, decisions, and audit trail still demonstrate the core prototype.
- If the browser was left in the middle of a previous run, return to the command center and restart instead of manually reversing actions.

## Pre-presentation checklist

- `npm run test:all` passes.
- `npm run build` passes.
- Restart demo works twice in a row.
- Verification, field evidence, approval, and history are reachable.
- Desktop projector view and one mobile-width view are readable.
- The event machine has power, the correct browser tab, and no visible developer console.
