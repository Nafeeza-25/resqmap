export function calculateEvidenceConfidence(incident) {
  const reports = incident.reports ?? [];
  const verifiedReports = reports.filter(r => r.verified || r.sourceType === 'field_unit');
  const sourceCount = new Set(reports.map(r => r.sourceId)).size;
  const unresolvedCritical = (incident.contradictions ?? []).filter(c => c.severity === 'critical').length;

  let score = 35;
  const components = [];
  if (sourceCount >= 3) {
    score += 25;
    components.push({ label: 'Independent source coverage', effect: '+25', detail: `${sourceCount} sources` });
  }
  if (reports.length >= 4) {
    score += 10;
    components.push({ label: 'Report volume', effect: '+10', detail: `${reports.length} linked reports` });
  }
  if (unresolvedCritical) {
    score -= 18;
    components.push({ label: 'Critical contradiction', effect: '-18', detail: 'Rescue status disagrees across sources' });
  }
  if (verifiedReports.length) {
    score += 35;
    components.push({ label: 'Verified field evidence', effect: '+35', detail: `${verifiedReports.length} field confirmation` });
  }
  score = Math.max(0, Math.min(100, score));
  const level = score >= 75 ? 'HIGH' : score >= 45 ? 'MEDIUM' : 'LOW';
  return { level, score, components };
}

const GAP_META = {
  current_rescue_status: { decisionImpact: 100, verificationEffort: 20, rationale: 'This answer can change the workflow from verification to dispatch approval.' },
  people_remaining: { decisionImpact: 65, verificationEffort: 35, rationale: 'Victim count affects resource planning but not the immediate need to verify rescue status.' },
  exact_location: { decisionImpact: 55, verificationEffort: 20, rationale: 'Precise location improves response but follows confirmation that rescue is still required.' }
};

export function rankEvidenceGaps(incident) {
  const hasVerifiedCurrentStatus = (incident.reports ?? []).some(r => (r.verified || r.sourceType === 'field_unit') && /not been completed|remain on the rooftop|still trapped/i.test(r.text ?? ''));
  return (incident.missingEvidence ?? [])
    .filter(gap => !(gap.key === 'current_rescue_status' && hasVerifiedCurrentStatus))
    .map(gap => {
      const meta = GAP_META[gap.key] ?? { decisionImpact: 35, verificationEffort: 35, rationale: 'Useful unresolved evidence.' };
      const priority = meta.decisionImpact / Math.max(1, meta.verificationEffort);
      return { ...gap, ...meta, priority };
    })
    .sort((a,b) => b.priority - a.priority);
}
