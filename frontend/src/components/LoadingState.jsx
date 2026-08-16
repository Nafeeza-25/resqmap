import { Radio } from 'lucide-react';

export default function LoadingState({ label = 'Connecting to response network' }) {
  return (
    <div className="rescue-loading-state" role="status" aria-live="polite">
      <span className="rescue-loading-state__icon" aria-hidden="true"><Radio size={20} /></span>
      <div>
        <strong>{label}</strong>
        <span>Receiving the latest reports and incident intelligence.</span>
      </div>
    </div>
  );
}
