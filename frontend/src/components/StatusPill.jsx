const LABELS = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',

  RAPID_VERIFY: 'Needs verification',
  DISPATCH_FOR_APPROVAL: 'Ready for approval',
  STANDARD_QUEUE: 'Standard review',
  MONITOR: 'Monitoring',

  LINK: 'Link report',
  CREATE: 'New incident',
  HOLD: 'Needs review',

  linked: 'Linked', review: 'Review', hold: 'Hold', separate: 'Separate', active: 'Active'
};

export default function StatusPill({ value, tone }) {
  const normalized = String(value ?? 'unknown');
  const derivedTone = tone ?? normalized.toLowerCase().replaceAll('_', '-');
  return <span className={`pill pill--${derivedTone}`}>{LABELS[normalized] ?? normalized.replaceAll('_', ' ')}</span>;
}
