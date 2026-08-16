import { AlertCircle } from 'lucide-react';

export default function EmptyState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-rq-border bg-rq-surface-raised p-8 text-center sm:p-12">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-rq-surface ring-1 ring-rq-border">
        <AlertCircle className="h-6 w-6 text-rq-text-muted" />
      </div>
      <h3 className="mb-2 text-base font-semibold text-rq-text">{title}</h3>
      <p className="max-w-sm text-sm text-rq-text-secondary">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
