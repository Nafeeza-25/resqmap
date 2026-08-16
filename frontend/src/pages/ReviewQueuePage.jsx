import { useMemo, useState } from 'react';
import ReportCard from '../components/ReportCard.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useIncidents, useReports } from '../hooks/useRepositoryData.js';
import { repository } from '../repository/index.js';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ReviewQueuePage() {
  const { data: reports, error: reportsError, loading: reportsLoading, retry: retryReports } = useReports();
  const { data: incidents, error: incidentsError, loading: incidentsLoading, retry: retryIncidents } = useIncidents();
  const [busyId, setBusyId] = useState(null);

  const canonical = incidents.find(incident => incident.id === 'INC-21');
  const queue = useMemo(() => reports.filter(r => r.status === 'review' || r.status === 'hold'), [reports]);
  const error = reportsError || incidentsError;
  const loading = reportsLoading || incidentsLoading;
  const retry = () => Promise.all([retryReports(), retryIncidents()]);

  const decide = async (reportId, decision) => {
    setBusyId(reportId);
    try {
      await repository.applyLinkDecision({
        reportId,
        decision,
        incidentId: 'INC-21',
        operator: 'Demo Operator',
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader 
        title="Verification Queue" 
        subtitle="Confirm whether each report belongs to an incident, creates a new one, or needs to wait."
        stage="verify"
      >
        <div className="flex items-center gap-2 rounded-full border border-rq-border bg-rq-surface px-4 py-2 shadow-sm">
           <span className="text-sm font-semibold text-rq-text">{queue.length}</span>
           <span className="text-sm text-rq-text-secondary">pending review</span>
        </div>
      </PageHeader>

      {loading ? (
        <div className="mt-8"><LoadingState label="Preparing the verification queue" /></div>
      ) : error ? (
        <div className="mt-8"><ErrorState title="Verification queue unavailable" error={error} onRetry={retry} /></div>
      ) : queue.length > 0 ? (
        <div className="mx-auto mt-8 max-w-3xl">
          <div className="mb-6 flex items-center justify-between">
             <div className="flex items-center gap-2 text-sm text-rq-text-secondary">
               <ShieldAlert className="h-4 w-4 text-rq-warning" />
               Automated matches require human verification.
             </div>
          </div>
          <div className="flex flex-col gap-8">
            {queue.map(report => {
              const result = canonical ? report.matchRecommendation : null;
              const matchPercent = result ? Math.round(result.total * 100) : null;
              
              return (
              <div key={report.id} className="overflow-hidden rounded-2xl border border-rq-border bg-rq-surface shadow-sm">
                <ReportCard report={report} />
                
                <div className="border-t border-rq-border-soft bg-rq-surface-raised p-6">
                   {result && (
                     <div className="mb-6 rounded-xl border border-rq-border bg-rq-bg p-4">
                       <p className="text-[11px] font-bold uppercase tracking-wider text-rq-text-secondary">AI Recommendation</p>
                       <p className="mt-1 text-sm text-rq-text">
                         {matchPercent}% similarity to <strong>{canonical.id} ({canonical.title})</strong>.
                       </p>
                       {result.reasons?.length > 0 && (
                         <ul className="mt-2 space-y-1">
                           {result.reasons.map(r => (
                             <li key={r} className="text-xs text-rq-text-muted">• {r}</li>
                           ))}
                         </ul>
                       )}
                     </div>
                   )}

                   <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-rq-text-secondary">Verification Decision</h3>
                   <div className="grid gap-4 sm:grid-cols-3">
                     <button
                        onClick={() => decide(report.id, 'LINK')}
                        disabled={busyId === report.id}
                        className="flex flex-col items-center justify-center text-center gap-2 rounded-xl border border-rq-border bg-rq-bg p-4 text-sm font-semibold text-rq-text transition hover:border-rq-info/50 hover:bg-rq-surface-hover hover:text-rq-info disabled:opacity-50"
                     >
                        Link to existing incident {canonical ? `(${canonical.id})` : ''}
                     </button>
                     <button
                        onClick={() => decide(report.id, 'CREATE')}
                        disabled={busyId === report.id}
                        className="flex flex-col items-center justify-center text-center gap-2 rounded-xl border border-rq-border bg-rq-bg p-4 text-sm font-semibold text-rq-text transition hover:border-rq-success/50 hover:bg-rq-surface-hover hover:text-rq-success disabled:opacity-50"
                     >
                        Create new incident
                     </button>
                     <button
                        onClick={() => decide(report.id, 'HOLD')}
                        disabled={busyId === report.id}
                        className="flex flex-col items-center justify-center text-center gap-2 rounded-xl border border-rq-border bg-rq-bg p-4 text-sm font-semibold text-rq-text transition hover:border-rq-warning/50 hover:bg-rq-surface-hover hover:text-rq-warning disabled:opacity-50"
                     >
                        Need more information
                     </button>
                   </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      ) : (
        <div className="mt-12">
          <EmptyState 
            title="Queue clear" 
            message="No reports are currently waiting for verification."
            action={<CheckCircle2 className="mx-auto h-8 w-8 text-rq-success" />}
          />
        </div>
      )}
    </div>
  );
}
