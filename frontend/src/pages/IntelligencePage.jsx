import { Link, useParams } from 'react-router-dom';
import ConfidenceMeter from '../components/ConfidenceMeter.jsx';
import StatusPill from '../components/StatusPill.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useIncidents } from '../hooks/useRepositoryData.js';
import { ArrowLeft, Target, CheckCircle2 } from 'lucide-react';

export default function IntelligencePage() {
  const { incidentId } = useParams();
  const { data: incidents } = useIncidents();

  const incident = incidents.find(i => i.id === incidentId);

  if (!incident) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <h1 className="text-xl font-bold text-rq-text">Incident not found</h1>
        <Link to="/" className="mt-6 rounded-xl bg-rq-text px-6 py-3 text-sm font-semibold text-rq-bg hover:bg-rq-text-secondary">Return to Command Center</Link>
      </div>
    );
  }

  const urgency = incident.intelligence?.urgency;
  const gaps = incident.intelligence?.evidenceGaps ?? [];

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <Link to={`/incidents/${incident.id}`} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-rq-text-secondary transition hover:text-rq-text">
        <ArrowLeft className="h-4 w-4" /> Back to Incident Review
      </Link>
      
      <PageHeader 
        title="Situation Analysis" 
        subtitle="See what is urgent, what is supported by evidence, and what must be checked next."
        stage="verify"
      />

      <section className="mb-8 grid gap-6 lg:grid-cols-2">
         {/* Urgency */}
         <div className="rounded-2xl border border-rq-border bg-rq-surface p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
               <span className="text-[11px] font-bold uppercase tracking-wider text-rq-text-muted">URGENCY</span>
               <StatusPill value={urgency?.level} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-rq-text">{urgency?.score ?? 0}</span>
              <span className="mb-1 text-sm text-rq-text-secondary">/100</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-rq-surface-raised">
               <div className="h-full bg-rq-red" style={{ width: `${Math.min(100, Math.max(0, urgency?.score ?? 0))}%` }} />
            </div>
            <div className="mt-6">
               <p className="text-[11px] font-bold uppercase tracking-wider text-rq-text-muted">Urgency Drivers</p>
               <ul className="mt-3 space-y-2">
                 {(urgency?.reasons ?? []).map((reason, idx) => (
                   <li key={idx} className="flex items-start gap-2 text-sm text-rq-text-secondary">
                     <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rq-red" />
                     {reason}
                   </li>
                 ))}
               </ul>
            </div>
         </div>

         {/* Confidence */}
         <div className="rounded-2xl border border-rq-border bg-rq-surface p-6 shadow-sm">
            <div className="mb-4">
               <span className="text-[11px] font-bold uppercase tracking-wider text-rq-text-muted">CONFIDENCE</span>
            </div>
            <ConfidenceMeter confidence={incident.intelligence?.confidence} />
         </div>
      </section>

      <section className="rounded-2xl border border-rq-border bg-rq-surface p-6 shadow-sm sm:p-8">
         <div className="mb-6 flex items-center gap-3 border-b border-rq-border-soft pb-4">
            <Target className="h-6 w-6 text-rq-info" />
            <div>
               <h2 className="text-lg font-bold text-rq-text">Decision-Critical Evidence Routing</h2>
               <p className="text-sm text-rq-text-secondary">What should be verified next?</p>
            </div>
         </div>

         {gaps.length > 0 ? (
           <div className="flex flex-col gap-6">
             {gaps.map((gap, index) => (
               <div key={gap.key} className="rounded-xl border border-rq-border-soft bg-rq-surface-raised p-5">
                 <div className="flex items-start gap-3">
                    <span className="rounded-lg bg-rq-info/10 px-2 py-1 font-mono text-xs font-bold text-rq-info">#{index + 1}</span>
                    <strong className="text-base text-rq-text">{gap.question}</strong>
                 </div>
                 <div className="mt-4 grid gap-4 sm:grid-cols-3">
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-wider text-rq-text-muted">Decision impact</p>
                     <p className="mt-1 text-sm text-rq-text-secondary">{gap.decisionImpact ?? '—'}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-wider text-rq-text-muted">Verification effort</p>
                     <p className="mt-1 text-sm text-rq-text-secondary">{gap.verificationEffort ?? '—'}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-wider text-rq-text-muted">Why it matters</p>
                     <p className="mt-1 text-sm text-rq-text-secondary">{gap.rationale}</p>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center p-8 text-center">
              <CheckCircle2 className="mb-4 h-12 w-12 text-rq-success" />
              <h3 className="text-lg font-bold text-rq-text">No missing evidence</h3>
              <p className="mt-2 text-sm text-rq-text-secondary">All critical facts have been established.</p>
           </div>
         )}
      </section>
    </div>
  );
}
