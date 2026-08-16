import { AlertTriangle, ArrowRight, MapPin, Clock } from 'lucide-react';
import StatusPill from './StatusPill';

export default function IncidentPriorityCard({ incident, onClick }) {
  if (!incident) return null;

  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl border border-rq-border bg-rq-surface p-5 shadow-sm transition hover:border-rq-border-soft hover:bg-rq-surface-hover sm:p-6" onClick={onClick} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="flex items-start justify-between gap-4">
        <StatusPill value={incident.urgency} />
        {incident.hasConflicts && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rq-warning">
            <AlertTriangle className="h-4 w-4" />
            <span>Reports disagree</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold text-rq-text">{incident.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-rq-text-secondary">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {incident.location?.name || 'Unknown location'}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {incident.createdAt ? new Date(incident.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Recently'}
          </div>
        </div>
      </div>

      {incident.pendingQuestions?.length > 0 && (
        <div className="rounded-xl border border-rq-border bg-rq-surface-raised p-3">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-rq-text-muted">What needs checking?</span>
          <strong className="text-sm text-rq-text">{incident.pendingQuestions[0]}</strong>
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-rq-border-soft pt-4">
        <div className="text-xs text-rq-text-secondary">
          Confidence: <span className="font-semibold text-rq-text">{incident.confidence?.level || 'Medium'}</span>
        </div>
        {onClick && (
          <div className="text-sm font-semibold text-rq-info group-hover:text-rq-info/80">
            Review incident <ArrowRight aria-hidden="true" className="inline h-3.5 w-3.5" />
          </div>
        )}
      </div>
    </div>
  );
}
