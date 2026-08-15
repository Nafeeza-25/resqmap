export function detectContradictions(claims) {
  const usable = claims.filter(c => c.rescueStatus && c.rescueStatus !== 'unknown');
  const values = new Set(usable.map(c => c.rescueStatus));
  const hasRescueConflict = values.has('rescued') && values.has('still_trapped');
  if (!hasRescueConflict) return [];

  return [{
    field: 'rescueStatus',
    label: 'Rescued vs still trapped',
    severity: 'critical',
    claims: usable
      .filter(c => c.rescueStatus === 'rescued' || c.rescueStatus === 'still_trapped')
      .map(c => ({
        reportId: c.reportId,
        value: c.rescueStatus,
        sourceId: c.sourceId,
        timestamp: c.timestamp
      }))
  }];
}
