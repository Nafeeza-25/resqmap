import { extractClaims } from './claimExtractor.js';
import { reconcileIncident } from './reconcileIncident.js';
import { calculateUrgency } from './urgencyEngine.js';
import { calculateEvidenceConfidence, rankEvidenceGaps } from './evidenceEngine.js';
import { recommendWorkflow } from './workflowEngine.js';

export function evaluateCanonicalIncident(reports, id = 'INC-21') {
  const base = reconcileIncident(reports);
  const urgency = calculateUrgency(base);
  const confidence = calculateEvidenceConfidence(base);
  const evidenceGaps = rankEvidenceGaps(base);
  const workflow = recommendWorkflow({ incident: base, urgency, confidence, evidenceGaps });
  return { ...base, id, status: 'active', intelligence: { urgency, confidence, evidenceGaps, workflow } };
}

export function buildSingleReportIncident(report, id) {
  const claims = extractClaims(report);
  const hazardLabel = claims.hazardType === 'fire' ? 'Fire Incident'
    : claims.hazardType === 'fallen_tree' ? 'Road Obstruction'
      : claims.hazardType === 'flood' ? 'Flood Incident' : 'Reported Incident';
  const locationLabel = claims.locationLabel === 'Location unconfirmed' ? 'Location under review' : claims.locationLabel;
  const base = {
    id,
    title: `${hazardLabel} — ${locationLabel}`,
    hazardType: claims.hazardType,
    locationLabel,
    location: report.location,
    firstReportedAt: report.timestamp,
    latestTimestamp: report.timestamp,
    linkedReportIds: [report.id],
    reports: [report],
    claims: [claims],
    agreements: ['One source currently supports this newly created incident.'],
    contradictions: [],
    missingEvidence: [{ key: 'corroboration', label: 'Independent corroboration', question: 'Can another source or field unit confirm this incident?' }],
    currentClaims: { rescueStatus: claims.rescueStatus, peopleAffectedMax: claims.peopleAffected },
    status: 'active'
  };
  const urgency = calculateUrgency(base);
  const confidence = { level: 'LOW', score: 35, components: [{ label: 'Single-source incident', effect: '+35', detail: 'Awaiting corroboration' }] };
  const evidenceGaps = [{ key: 'corroboration', label: 'Independent corroboration', question: 'Can another source or field unit confirm this incident?', decisionImpact: 45, verificationEffort: 30, priority: 1.5, rationale: 'A second independent source would materially strengthen the incident picture.' }];
  const workflow = urgency.level === 'CRITICAL' || urgency.level === 'HIGH'
    ? { workflow: 'RAPID_VERIFY', reasons: ['Potentially urgent single-source incident requires rapid verification.'] }
    : { workflow: 'MONITOR', reasons: ['New single-source incident awaiting corroboration.'] };
  return { ...base, intelligence: { urgency, confidence, evidenceGaps, workflow } };
}
