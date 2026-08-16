import { RefreshCw, TriangleAlert } from 'lucide-react';

export default function ErrorState({ title = 'Response network unavailable', error, onRetry }) {
  return (
    <div className="rescue-error-state" role="alert">
      <span className="rescue-error-state__icon" aria-hidden="true"><TriangleAlert size={20} /></span>
      <div>
        <strong>{title}</strong>
        <p>{error?.message || 'The latest operation data could not be loaded.'} Check that the ResQMap backend is running, then try again.</p>
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry} className="rescue-secondary-action">
          <RefreshCw aria-hidden="true" size={15} /> Try again
        </button>
      )}
    </div>
  );
}
