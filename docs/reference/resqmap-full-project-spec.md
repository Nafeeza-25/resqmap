# ResQMap — Conflict-Aware Incident Reconstruction for Disaster Response

> **Tagline:** From conflicting reports to auditable human decisions.

## 1. Project Overview

**ResQMap** is a human-in-the-loop disaster-response intelligence platform designed to help emergency operators make sense of fragmented, duplicated, incomplete, outdated, and contradictory disaster reports.

During floods, cyclones, earthquakes, fires, landslides, and other emergencies, responders may receive many reports about what appears to be the same incident. One person may report that people are trapped, another may say they were rescued, a third may provide a different victim count, and another may describe a nearby but separate event.

ResQMap does not try to automatically decide which citizen is telling the truth. Instead, it:

1. extracts source-level claims from incoming reports;
2. identifies which reports probably describe the same incident;
3. reconstructs them into one evolving, source-linked incident record;
4. preserves agreements, contradictions, and missing evidence;
5. separates **urgency** from **evidence confidence**;
6. identifies the unresolved fact most likely to change the next human response decision;
7. recommends an auditable workflow action;
8. keeps the emergency operator as the final authority.

The map is an important visualization layer, but **the map itself is not the core innovation**.

---

# 2. The Real Problem

## Problem Statement

During the first hours of a disaster, emergency teams receive reports through calls, citizen messages, online forms, field personnel, and other operational channels.

Several reports may describe the same emergency while being:

- incomplete;
- duplicated;
- paraphrased;
- outdated;
- geographically imprecise;
- inconsistent in victim counts;
- contradictory about rescue status;
- contradictory about hazard severity;
- related to a nearby but different incident.

The emergency operator must manually compare these reports before answering critical questions such as:

- Are these reports describing the same incident?
- Are people still trapped?
- Has a rescue already been completed?
- How many people may still need help?
- Is the situation getting worse?
- Which report is newest?
- Which contradiction matters most?
- What should be verified first?
- Is there enough evidence to justify escalation?

This manual reconciliation can delay action, create duplicate incidents, waste responder attention, prematurely close unresolved incidents, and hide dangerous contradictions.

### One-line pain point

> **Emergency teams do not only receive too many reports; they receive different versions of the same emergency and must quickly determine what remains unresolved.**

### Human consequence

A missed contradiction such as **“already rescued” versus “still trapped”** may be far more dangerous than an ordinary classification error.

ResQMap targets the information-reconciliation step **before a human emergency-response decision**.

---

# 3. Proposed Solution

ResQMap converts multiple fragmented reports into one evolving, source-linked incident record while retaining the original evidence.

> **Multiple conflicting reports in → one source-linked incident → visible contradictions → decision-critical missing evidence → justified human next action.**

The solution is built around two decision stages.

---

## Stage A — Report Reconciliation

For each new report, ResQMap recommends:

### LINK
The report is probably an update to an existing incident.

### CREATE
The report is probably a new incident.

### HOLD FOR REVIEW
There is not enough evidence to confidently determine whether it belongs to an existing incident.

The operator can confirm or correct the recommendation.

**ResQMap never silently merges uncertain reports.**

---

## Stage B — Incident Workflow Recommendation

After reports are reconstructed into an incident, ResQMap recommends one of four workflows:

### DISPATCH FOR APPROVAL
High urgency with adequate supporting evidence.

### RAPID VERIFY
High urgency, but an important contradiction or evidence gap remains unresolved.

### STANDARD QUEUE
Credible but lower-urgency incident.

### MONITOR
Low urgency and/or insufficient evidence for immediate action.

The system does **not** autonomously dispatch responders.  
The emergency operator can approve, reject, or override every recommendation.

---

# 4. Working Core Feature

## Conflict-Aware Incident Reconciler

The **working core feature** of ResQMap is the **Conflict-Aware Incident Reconciler**.

It solves the real operational problem of turning multiple inconsistent reports into one auditable incident picture without hiding uncertainty.

The reconciler performs five essential functions:

### 1. Source-Level Claim Extraction
Every report is converted into structured claims such as:

- location;
- disaster type;
- number of affected people;
- medical condition;
- rescue status;
- hazard severity;
- time;
- source;
- evidence context.

Example:

> “Five people are trapped inside a flooded house on Gandhi Street.”

becomes:

- Location: Gandhi Street
- Hazard: Flood
- People: 5
- Condition: Trapped
- Rescue status: Not confirmed
- Source: Reporter A
- Time: 14:05

---

### 2. Same-Incident Matching

ResQMap compares:

- semantic similarity;
- location proximity;
- time proximity;
- disaster/incident type;
- structured claim compatibility.

It then recommends:

**LINK / CREATE / HOLD FOR REVIEW**

This prevents both:

- duplicate incident creation;
- unsafe false merging of unrelated nearby incidents.

---

### 3. Contradiction Preservation

If two reports disagree, ResQMap does not compress them into one potentially misleading AI summary.

Example:

- Report C: **“Family already rescued.”**
- Report D: **“People are still shouting from the roof.”**

ResQMap explicitly displays:

> **Critical contradiction: Rescued vs still trapped**

Both claims remain attached to their original sources until the human operator resolves the conflict.

---

### 4. Urgency and Evidence Confidence Are Separate

ResQMap does not hide everything inside one opaque priority score.

#### Urgency
> If the reported situation is true, how immediate is the potential danger?

#### Evidence Confidence
> How strongly do the available reports support the current incident picture?

Example:

- **Urgency:** Critical
- **Evidence confidence:** Medium

This tells the operator:

> “The situation could be extremely dangerous, but a key fact is still unresolved.”

That naturally leads to **RAPID VERIFY**, rather than blindly dispatching or ignoring the report.

---

### 5. Decision-Critical Evidence Routing

This is ResQMap's central innovation.

ResQMap does not merely list missing information.

It asks:

> **Which unresolved contradiction or missing fact is most likely to change the next human response decision?**

For example, an incident may have several unknowns:

- exact house number;
- whether 2 or 3 people remain;
- exact water depth;
- whether the victims have already been rescued.

All are missing facts, but they are not equally important.

The most decision-critical question may be:

> **“Are the victims still trapped?”**

because resolving that question can change the workflow from:

**MONITOR / RAPID VERIFY → DISPATCH FOR APPROVAL**

This is what ResQMap means by **Decision-Critical Evidence Routing**.

---

# 5. Upgraded Decision-Impact Evidence Ranking

To make the innovation more measurable, ResQMap can rank unresolved evidence by expected decision impact.

A simple conceptual model is:

**Decision Impact = Probability the workflow changes × Urgency × Uncertainty**

Then verification effort can also be considered:

**Verification Priority = Decision Impact / (Verification Time + Verification Cost)**

Example:

| Missing Evidence | Decision Impact | Verification Effort | Priority |
|---|---:|---:|---:|
| Exact house number | Medium | Low | 2 |
| Exact victim count | Medium | Medium | 3 |
| Water depth | Low | High | 4 |
| **Rescue completed?** | **Critical** | Low | **1** |

The goal is not to claim that ResQMap discovers ground truth.

The goal is to help the operator decide:

> **“If we can verify only one thing next, which one matters most?”**

---

# 6. Interactive Disaster Intelligence Map

ResQMap includes a live, interactive map similar in interaction style to familiar map applications.

The map is used for **situational awareness**, not as the core novelty.

## Current Disaster Layer

The operator can view current reconstructed incidents as markers or clusters.

Clicking an incident opens an **Incident Intelligence Card** showing:

- disaster type;
- location;
- time first reported;
- latest update;
- estimated people affected;
- confirmed/verified casualty information if available;
- current rescue status;
- urgency;
- evidence confidence;
- agreements;
- contradictions;
- missing evidence;
- decision-critical evidence gap;
- recommended workflow;
- linked reports and sources.

## Historical Disaster Layer

A second layer can show previous disaster locations for context.

When the user clicks a historical incident, the system can display:

- disaster name/type;
- date;
- affected region;
- people affected;
- deaths/injuries where reliable verified data exists;
- short incident summary;
- historical source/reference.

Historical casualty values should come from reliable external datasets and should not be generated by the AI.

## Why the Map Matters

The map allows responders to quickly understand:

- where incidents are happening;
- which reports are geographically close;
- whether two reports may describe the same event;
- where severe or unresolved incidents are concentrated;
- what happened previously in the same region.

Again:

> **The map visualizes the intelligence. The innovation is the conflict-aware reasoning underneath it.**

---

# 7. Key Features

## Feature 1 — Multi-Source Report Ingestion
Supports reports from:

- emergency call notes;
- citizen forms;
- field reports;
- CSV/JSON uploads;
- simulated message streams;
- multilingual Tamil/English inputs in the MVP.

---

## Feature 2 — Structured AI Claim Extraction
A schema-constrained AI model converts natural-language reports into structured fields while preserving the original text.

---

## Feature 3 — LINK / CREATE / HOLD Incident Matching
Semantic, geographic, temporal, and incident-type evidence is combined to suggest whether a report belongs to an existing incident.

---

## Feature 4 — Conflict Detection and Preservation
Contradictory claims remain visible instead of being silently overwritten.

---

## Feature 5 — Urgency + Evidence Confidence
The system keeps danger and certainty separate.

---

## Feature 6 — Decision-Critical Evidence Routing
ResQMap identifies what must be verified next because the answer could change the operational decision.

---

## Feature 7 — Live Interactive Disaster Map
Current and historical disaster incidents can be explored spatially through incident cards and map layers.

---

## Feature 8 — Human Approval and Override
The AI recommends; the emergency operator decides.

---

## Feature 9 — Full Audit Trail
The system stores:

- original report;
- extracted claims;
- source;
- model recommendation;
- human correction;
- incident-link decision;
- contradiction history;
- evidence updates;
- workflow recommendation;
- human override/approval.

---

## Feature 10 — Continuous Incident Updating
An incident changes as new evidence arrives instead of remaining a static one-time record.

---

# 8. Clean Working Demo

## Demo Scenario — Chennai Flood Incident

### Report A — 14:05
> “Five people trapped inside a flooded house on Gandhi Street, Velachery.”

### Report B — 14:09
> “Two elderly people waiting on a rooftop near Gandhi Street pharmacy.”

### Report C — 14:12
> “Family at Gandhi Street already rescued.”

### Report D — 14:14
> “Water is rising. People are still shouting from the roof.”

### Report E — 14:16
> “Tree fallen across Gandhi Nagar Road.”

---

## Step 1 — AI Extracts Source-Level Claims

| Report | Location | People | Condition | Time |
|---|---|---:|---|---|
| A | Gandhi Street, Velachery | 5 | Trapped | 14:05 |
| B | Near Gandhi Street pharmacy | 2 elderly | Rooftop | 14:09 |
| C | Gandhi Street | Family | Reported rescued | 14:12 |
| D | Probable Gandhi Street area | Unknown | Still requesting help | 14:14 |
| E | Gandhi Nagar Road | None reported | Fallen tree | 14:16 |

---

## Step 2 — Incident Matching

ResQMap compares semantic meaning, geographic proximity, time difference, and incident type.

Recommended result:

- Reports A, B, C, D → **probable same incident**
- Report E → **probable separate incident**

The operator confirms or corrects the links.

---

## Step 3 — Incident Reconstruction

### Incident #21 — Gandhi Street Flood Rescue

#### Agreement
- Flood emergency reported near Gandhi Street.
- People were reportedly stranded.
- Rooftop assistance may be required.

#### Critical Conflict
- Report C: family reportedly rescued.
- Report D: people still requesting help.

#### Missing Evidence
- current rescue status;
- exact number of people remaining;
- confirmed rooftop location.

---

## Step 4 — Decision Card

| Decision Field | Output |
|---|---|
| Urgency | **Critical** |
| Evidence confidence | **Medium** |
| Critical contradiction | Rescued vs still trapped |
| Decision-critical evidence gap | Current rescue status |
| Recommended workflow | **RAPID VERIFY** |
| Suggested verification | Contact newest identifiable reporter or nearby field unit |
| Final authority | Emergency operator |

---

## Step 5 — Map Interaction

The incident appears on the live map.

When the operator clicks the Gandhi Street marker, the incident card shows:

- Critical urgency
- Medium evidence confidence
- linked reports A–D
- rescued vs still trapped contradiction
- current rescue status as the key evidence gap
- RAPID VERIFY recommendation

A separate marker shows the fallen-tree incident.

---

## Step 6 — New Field Evidence Arrives

A responder reports:

> “Rescue has not been completed. Two elderly people remain on the rooftop.”

ResQMap updates the incident:

- Rescue status → **Not completed**
- People remaining → **At least 2**
- Evidence confidence → **High**
- Workflow → **DISPATCH FOR APPROVAL**

The emergency operator approves or overrides the recommendation.

The full history remains auditable.

---

# 9. How the AI Works

ResQMap does not depend on one giant black-box model.

It combines AI with deterministic rules and human review.

## AI Layer 1 — Information Extraction
A language model extracts structured claims from text.

## AI Layer 2 — Semantic Similarity
Embeddings help determine whether two differently worded reports may describe the same event.

Example:

> “Two elderly people on the roof.”

and

> “Senior citizens stranded above flood water.”

can be semantically similar even if the wording is different.

## Rule Layer — Geographic + Temporal Matching
Location distance and time windows reduce unsafe false matches.

## Conflict Engine
Structured attributes are compared.

Example:

- RescueStatus = Rescued
- RescueStatus = Still trapped

→ contradiction detected.

## Urgency Engine
Transparent and configurable disaster-response rules determine danger indicators.

## Evidence Confidence Engine
Confidence indicators can include:

- independent corroboration;
- recency;
- completeness;
- source context;
- consistency;
- unresolved contradiction count.

## Decision-Critical Evidence Engine
The system ranks unresolved evidence according to its likely effect on the next workflow decision.

## Human-in-the-Loop Layer
The operator:

- confirms links;
- corrects extraction;
- resolves conflicts;
- approves or overrides recommendations.

---

# 10. System Architecture / Workflow

```text
Citizen Reports / Call Notes / Field Reports / Forms
                        |
                        v
             Structured Claim Extraction
                        |
                        v
        Semantic + Location + Time Comparison
                        |
                        v
              LINK / CREATE / HOLD
                        |
                        v
           Source-Linked Incident Record
                        |
          +-------------+--------------+
          |                            |
          v                            v
     Agreements                  Contradictions
          |                            |
          +-------------+--------------+
                        |
                        v
                 Missing Evidence
                        |
                        v
       Urgency  +  Evidence Confidence
                        |
                        v
       Decision-Critical Evidence Ranking
                        |
                        v
   DISPATCH / RAPID VERIFY / QUEUE / MONITOR
                        |
                        v
                Human Operator
                        |
                Approve / Override
                        |
                        v
         Incident Update + Audit History
                        |
                        v
            Interactive Disaster Map
```

---

# 11. Proposed Technology Stack

| Component | Practical MVP |
|---|---|
| Frontend | React / Next.js |
| Database | PostgreSQL + PostGIS or Supabase |
| Map | MapLibre or Leaflet |
| Claim Extraction | Schema-constrained LLM |
| Semantic Matching | Text embeddings |
| Location Processing | Gazetteer/geocoder + manual correction |
| Incident Matching | Semantic + geographic + time-window rules |
| Conflict Detection | Structured comparison + deterministic rules |
| Urgency | Transparent configurable policy rules |
| Evidence Confidence | Corroboration, recency, completeness, source context, unresolved conflicts |
| Audit Trail | Source, model output, human corrections, recommendation history |

The MVP uses established technical building blocks instead of training a foundation model from scratch.

---

# 12. Uniqueness and Innovation

Many disaster-management systems already support parts of the workflow.

Typical systems may focus on:

- crowdsourced report collection;
- social-media filtering;
- disaster classification;
- incident logging;
- dispatch coordination;
- mapping;
- hazard visualization.

ResQMap's narrower contribution is the difficult information gap **between receiving multiple reports and forming an auditable incident picture under uncertainty**.

## What ResQMap Does Differently

### 1. Incident as a Source-Linked Claim Graph
Claims remain attached to their original evidence.

### 2. Contradictions Stay Visible
The system does not hide disagreements in a generated summary.

### 3. Urgency and Confidence Stay Separate
A critical but uncertain case is treated differently from a low-risk confident case.

### 4. Decision-Critical Evidence Routing
ResQMap identifies **which unresolved fact should be verified next because its answer could change the response decision**.

### 5. Auditable Human Decision Support
The system recommends actions but keeps humans in control.

---

# 13. What Is NOT the Novelty

The following should not be presented as globally unique on their own:

- AI disaster classification;
- mapping emergency incidents;
- grouping similar reports;
- duplicate detection;
- summarizing disaster messages;
- assigning severity;
- displaying historical disasters.

These are useful building blocks.

The stronger novelty hypothesis is:

> **Conflict-aware incident reconstruction + contradiction preservation + separate urgency/evidence confidence + decision-impact-based evidence selection for the next human response action.**

Until a full literature and patent review is complete, ResQMap should be described as a **novel proposed approach** rather than claiming to be the world's first.

---

# 14. Feasibility

## Round-1 Prototype Scope

The MVP can use a controlled dataset of approximately 12–20 Chennai-style flood reports.

The test pack should include:

- 3 or more real-world-style incidents;
- Tamil and English messages;
- call notes and form submissions;
- timestamps;
- approximate locations;
- duplicate reports;
- paraphrased reports;
- outdated reports;
- a rescue-status contradiction;
- an unrelated nearby incident;
- missing-location cases.

## Required Prototype Screens

1. **Incoming Reports**
2. **LINK / CREATE / HOLD Review**
3. **Source-Linked Incident & Conflict View**
4. **Urgency & Evidence Confidence View**
5. **Decision Card & Human Approval**
6. **Live Disaster Map**
7. **Audit History**

## Why It Is Feasible

The prototype does not require:

- training a new foundation model;
- government control-room integration;
- satellite processing;
- autonomous dispatch;
- production-grade communications infrastructure.

It can be built with existing APIs, embeddings, geospatial tools, databases, and transparent rules.

---

# 15. Proof of Feasibility

A working prototype should demonstrate that it can:

1. ingest differently formatted reports;
2. extract structured claims correctly;
3. suggest probable same-incident links;
4. keep unrelated incidents separate;
5. expose “already rescued” vs “still trapped” as a contradiction;
6. preserve every source;
7. display urgency separately from evidence confidence;
8. identify current rescue status as the decision-critical evidence gap;
9. recommend RAPID VERIFY with a visible reason;
10. update the incident after field confirmation;
11. change the workflow recommendation when evidence changes;
12. display the incident on the interactive map;
13. preserve model and operator actions in the audit trail.

---

# 16. Evaluation Metrics

| Metric | What It Tests |
|---|---|
| Claim extraction accuracy | Whether report facts were extracted correctly |
| Incident-linking precision | Whether linked reports truly belong together |
| Incident-linking recall | Whether related reports were successfully found |
| Contradiction-detection precision | Whether detected conflicts are real |
| Contradiction-detection recall | Whether important conflicts were missed |
| Source-citation coverage | Whether important outputs remain linked to evidence |
| Operator correction rate | How often human correction is needed |
| Decision-preparation time | Manual reconstruction vs ResQMap-assisted review |
| Recommendation override rate | Whether workflow recommendations align with operator judgement |
| Map incident accuracy | Whether reconstructed incidents are placed correctly |
| Evidence-gap ranking quality | Whether the top-ranked question is actually decision-critical |

No performance percentage should be claimed until testing has been completed.

---

# 17. Expected Impact

ResQMap is designed to support:

- faster review of fragmented reports;
- fewer duplicate incident records;
- clearer visibility of contradictions;
- faster recognition of uncertain but potentially fatal incidents;
- more focused verification;
- source-linked and accountable decision preparation;
- continuously updated incident awareness;
- improved map-based situational understanding.

## Measurable Impact Hypothesis

The prototype should test whether ResQMap can reduce:

- manual report-comparison time;
- duplicate incident creation;
- missed contradictions;
- time required to identify the next verification step.

## Defensible Impact Statement

> **By reducing the time required to reconcile fragmented reports and making uncertainty visible, ResQMap has the potential to support faster and more accountable human triage during the early stages of a disaster.**

---

# 18. Safety and Responsible AI

ResQMap should include the following safeguards:

- no silent merging of uncertain reports;
- no automatic truth declaration;
- no autonomous dispatch;
- no opaque combined priority score;
- original evidence always accessible;
- operator correction of AI-extracted claims;
- operator approval/override of recommendations;
- visible evidence-confidence components;
- verified external sources for historical casualty data;
- full audit history.

---

# 19. Out of Scope for the MVP

To keep the prototype realistic, the first version should not attempt:

- unrestricted social-media scraping;
- automatic truth detection;
- autonomous responder dispatch;
- government control-room integration;
- satellite damage assessment;
- advanced route/resource optimization;
- complex weather forecasting;
- production-grade offline mesh networking.

These can become future extensions.

---

# 20. Future Scope

Future versions can add:

- verified real-time government disaster feeds;
- responder mobile applications;
- multilingual voice-to-incident extraction;
- photo/video evidence analysis;
- trusted historical disaster datasets;
- resource allocation support;
- route optimization;
- sensor/IoT feeds;
- offline emergency communication;
- federated deployments across districts;
- decision-impact verification requests sent directly to field teams.

A particularly strong future extension is:

> ResQMap detects the most decision-critical missing evidence and sends that specific verification request to the best available field responder.

This turns the system from passive information display into **targeted evidence acquisition for human decision-making**.

---

# 21. HackFusion-Ready Summary

## Problem

Emergency responders receive incomplete and conflicting versions of the same incident and must manually reconstruct what happened before deciding what to do.

## Solution

ResQMap transforms fragmented reports into an evolving, source-linked incident record containing:

- agreements;
- contradictions;
- missing evidence;
- urgency;
- evidence confidence;
- decision-critical evidence;
- a justified workflow recommendation.

## Working Core Feature

> **Conflict-Aware Incident Reconciler**

It links probable same-incident reports, preserves contradictory claims, separates danger from confidence, and identifies what should be verified next.

## Core Innovation

> **Decision-Critical Evidence Routing**

ResQMap identifies the unresolved evidence most likely to change the next human response decision.

## Working Demo

Five reports enter. Four are linked to one probable flood incident and one is kept separate. “Already rescued” versus “still trapped” is exposed as a contradiction. Urgency is critical, but evidence confidence is medium. ResQMap identifies current rescue status as the key evidence gap and recommends RAPID VERIFY. A new field report confirms two people are still trapped; evidence confidence increases and the workflow changes to DISPATCH FOR APPROVAL.

## Feasibility

The MVP uses:

- structured AI extraction;
- embeddings;
- geospatial matching;
- deterministic conflict rules;
- transparent urgency/evidence logic;
- a source-linked database;
- an interactive map;
- human approval.

## Expected Impact

Potential benefits include:

- faster incident reconstruction;
- fewer duplicates;
- fewer hidden contradictions;
- more focused verification;
- more auditable emergency triage.

---

# 22. Final Pitch

> **ResQMap does not try to decide which citizen is telling the truth. It helps emergency operators see what the reports agree on, where they conflict, what remains unknown, and what they need to verify next before making a critical response decision.**

## One-Line Innovation Pitch

> **Most disaster systems ask, “How urgent is this incident?” ResQMap also asks, “What uncertainty must we resolve next because its answer could change what the responder does?”**

## One-Line Product Pitch

> **ResQMap turns conflicting disaster reports into an auditable incident picture and helps responders determine what to verify next before making a critical decision.**
