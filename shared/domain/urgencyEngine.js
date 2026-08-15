export function calculateUrgency(incident) {
  const claims = incident.claims ?? [];
  let score = 0;
  const reasons = [];

  if (claims.some(c => c.rescueStatus === 'still_trapped')) {
    score += 45;
    reasons.push('People may still be trapped or stranded');
  }
  if (claims.some(c => c.severitySignals?.includes('worsening_conditions'))) {
    score += 25;
    reasons.push('Conditions are reported to be worsening');
  }
  if (claims.some(c => c.vulnerableGroups?.includes('elderly'))) {
    score += 15;
    reasons.push('Vulnerable people are reported');
  }
  if ((incident.currentClaims?.peopleAffectedMax ?? 0) >= 5) {
    score += 15;
    reasons.push('Multiple people may be affected');
  }

  score = Math.min(100, score);
  const level = score >= 75 ? 'CRITICAL' : score >= 55 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW';
  return { level, score, reasons };
}
