export function recommendWorkflow({ incident, urgency, confidence, evidenceGaps }) {
  const verifiedStillTrapped = (incident.reports ?? []).some(r =>
    (r.verified || r.sourceType === 'field_unit') && /not been completed|remain on the rooftop|still trapped/i.test(r.text ?? '')
  );

  if ((urgency.level === 'CRITICAL' || urgency.level === 'HIGH') && verifiedStillTrapped && confidence.level === 'HIGH') {
    return {
      workflow: 'DISPATCH_FOR_APPROVAL',
      reasons: ['High/critical danger is supported by verified field evidence.', 'A human operator must approve dispatch.']
    };
  }

  if ((urgency.level === 'CRITICAL' || urgency.level === 'HIGH') &&
      ((incident.contradictions ?? []).some(c => c.severity === 'critical') || evidenceGaps?.[0]?.key === 'current_rescue_status')) {
    return {
      workflow: 'RAPID_VERIFY',
      reasons: ['Potential danger is high.', 'A decision-critical rescue-status conflict remains unresolved.']
    };
  }

  if (urgency.level === 'HIGH' || (urgency.level === 'MEDIUM' && confidence.level !== 'LOW')) {
    return { workflow: 'STANDARD_QUEUE', reasons: ['Credible incident without an immediate critical decision conflict.'] };
  }
  return { workflow: 'MONITOR', reasons: ['Current evidence does not justify immediate escalation.'] };
}
