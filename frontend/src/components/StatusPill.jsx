const LABELS = {
  LINK: 'LINK', CREATE: 'CREATE', HOLD: 'HOLD',
  RAPID_VERIFY: 'RAPID VERIFY', DISPATCH_FOR_APPROVAL: 'DISPATCH FOR APPROVAL',
  STANDARD_QUEUE: 'STANDARD QUEUE', MONITOR: 'MONITOR',
  CRITICAL: 'CRITICAL', HIGH: 'HIGH', MEDIUM: 'MEDIUM', LOW: 'LOW',
  linked: 'Linked', review: 'Review', hold: 'Hold', separate: 'Separate', active: 'Active'
};

export default function StatusPill({ value, tone }) {
  const normalized = String(value ?? 'unknown');
  const derivedTone = tone ?? normalized.toLowerCase().replaceAll('_', '-');
  return <span className={`pill pill--${derivedTone}`}>{LABELS[normalized] ?? normalized.replaceAll('_', ' ')}</span>;
}
