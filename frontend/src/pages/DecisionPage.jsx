import { Link, useParams, useNavigate } from 'react-router-dom';
import StatusPill from '../components/StatusPill.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useIncidents } from '../hooks/useRepositoryData.js';
import { repository } from '../repository/index.js';
import { ArrowLeft, User } from 'lucide-react';
import { useState } from 'react';

export default function DecisionPage() {
  const { incidentId } = useParams();
  const { data: incidents } = useIncidents();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  const incident = incidents.find(i => i.id === incidentId);

  if (!incident) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <h1 className="text-xl font-bold text-rq-text">Incident not found</h1>
        <Link to="/" className="mt-6 rounded-xl bg-rq-text px-6 py-3 text-sm font-semibold text-rq-bg hover:bg-rq-text-secondary">Return to Command Center</Link>
      </div>
    );
  }

  const recommendation = incident.intelligence?.workflow;

  const decide = async (action) => {
    setBusy(true);
    try {
      await repository.applyWorkflowDecision({
        incidentId: incident.id,
        action,
        operator: 'Demo Operator',
        note,
      });
      navigate(`/incidents/${incident.id}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <Link to={`/incidents/${incident.id}`} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-rq-text-secondary transition hover:text-rq-text">
        <ArrowLeft className="h-4 w-4" /> Back to Incident Review
      </Link>

      <PageHeader 
        title="Decision / Approval" 
        subtitle={incident.title}
        stage="decide"
      />

      <div className="mb-8 flex items-center gap-3 rounded-2xl border border-rq-info/20 bg-rq-info/10 p-6 text-rq-info shadow-sm">
         <User className="h-6 w-6" />
         <div>
            <h2 className="text-sm font-bold">Human approval required</h2>
            <p className="mt-1 text-xs">ResQMap recommends actions. It does not dispatch responders automatically.</p>
         </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
         {/* Left Column: Context */}
         <div className="flex flex-col gap-6">
            <section className="rounded-2xl border border-rq-border bg-rq-surface p-6 shadow-sm">
               <h3 className="text-[11px] font-bold uppercase tracking-wider text-rq-text-secondary">SITUATION</h3>
               <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-rq-border bg-rq-surface-raised p-4">
                     <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-rq-text-muted">URGENCY</p>
                     <StatusPill value={incident.intelligence?.urgency?.level} />
                  </div>
                  <div className="rounded-xl border border-rq-border bg-rq-surface-raised p-4">
                     <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-rq-text-muted">CONFIDENCE</p>
                     <StatusPill value={incident.intelligence?.confidence?.level} />
                  </div>
               </div>
               
               {recommendation?.reasons?.length > 0 && (
                 <div className="mt-6">
                   <h3 className="text-[11px] font-bold uppercase tracking-wider text-rq-text-secondary">Recommendation Reasons</h3>
                   <ul className="mt-3 space-y-2">
                     {recommendation.reasons.map((r, idx) => (
                       <li key={idx} className="flex items-start gap-2 text-sm text-rq-text-secondary">
                         <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rq-info" />
                         {r}
                       </li>
                     ))}
                   </ul>
                 </div>
               )}
            </section>
         </div>

         {/* Right Column: Recommended Action & Approval */}
         <div className="flex flex-col gap-6">
            <section className="rounded-2xl border border-rq-border bg-rq-surface p-8 shadow-sm">
               <div className="mb-6 rounded-xl border border-rq-border bg-rq-surface-raised p-6 text-center">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-rq-info">RECOMMENDED ACTION</h3>
                  <p className="mt-4 text-2xl font-bold uppercase text-rq-text">
                     {recommendation?.workflow ? recommendation.workflow.replaceAll('_', ' ') : 'MONITOR'}
                  </p>
               </div>

               <div className="flex flex-col gap-4">
                 <textarea 
                    placeholder="Optional operator note (required for override)..." 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full resize-none rounded-xl border border-rq-border bg-rq-surface-raised p-3 text-sm text-rq-text placeholder:text-rq-text-muted focus:border-rq-focus focus:outline-none focus:ring-1 focus:ring-rq-focus"
                    rows={3}
                 />
                 
                 <button
                    onClick={() => decide('APPROVE_RECOMMENDATION')}
                    disabled={busy}
                    className="w-full rounded-xl bg-rq-red px-4 py-3 text-sm font-bold text-rq-bg shadow-sm transition hover:bg-rq-red/90 disabled:opacity-50"
                 >
                    Approve action
                 </button>
                 
                 <button
                    onClick={() => decide('REJECT')}
                    disabled={busy || !note.trim()}
                    className="w-full rounded-xl border border-rq-red/30 bg-transparent px-4 py-3 text-sm font-bold text-rq-red shadow-sm transition hover:bg-rq-red/10 disabled:opacity-50"
                 >
                    Reject / Override
                 </button>
               </div>
            </section>
         </div>
      </div>
    </div>
  );
}
