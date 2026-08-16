import { Link, useParams } from 'react-router-dom';
import { useIncidents, useReports } from '../hooks/useRepositoryData.js';
import StatusPill from '../components/StatusPill.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { ArrowLeft, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { repository } from '../repository/index.js';
import { CANONICAL_FIELD_EVIDENCE } from '../data/demoEvidence.js';

export default function IncidentDetailPage() {
  const { incidentId } = useParams();
  const { data: incidents } = useIncidents();
  const { data: reports } = useReports();
  
  const incident = incidents.find(i => i.id === incidentId);

  if (!incident) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <h1 className="text-xl font-bold text-rq-text">Incident not found</h1>
        <p className="mt-2 text-rq-text-secondary">This incident does not exist in the current repository.</p>
        <Link to="/" className="mt-6 rounded-xl bg-rq-text px-6 py-3 text-sm font-semibold text-rq-bg hover:bg-rq-text-secondary">Return to Command Center</Link>
      </div>
    );
  }

  const linked = reports.filter(
    report => incident.linkedReportIds?.includes(report.id) || report.incidentId === incident.id
  );
  
  const fieldAdded = linked.some(
    report => report.sourceType === 'field_unit' || report.verified
  );

  const topGap = incident.intelligence?.gaps?.[0] || incident.intelligence?.evidenceGaps?.[0];

  const addFieldEvidence = () =>
    repository.addFieldEvidence({
      incidentId: incident.id,
      report: CANONICAL_FIELD_EVIDENCE,
    });

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-rq-text-secondary transition hover:text-rq-text">
        <ArrowLeft className="h-4 w-4" /> Command Center
      </Link>
      
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
         <div>
           <h1 className="text-3xl font-bold tracking-tight text-rq-text">{incident.title}</h1>
           <p className="mt-2 flex items-center gap-3 text-sm text-rq-text-secondary">
             <span>{incident.locationLabel || 'Unknown location'}</span>
             <span>•</span>
             <span>{incident.createdAt ? new Date(incident.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Recently'}</span>
           </p>
         </div>
         <div className="flex flex-wrap gap-4">
           <div className="flex flex-col items-start sm:items-end">
             <span className="text-[10px] font-bold uppercase tracking-wider text-rq-text-muted">Urgency</span>
             <StatusPill value={incident.intelligence?.urgency?.level || 'MEDIUM'} />
           </div>
           <div className="flex flex-col items-start sm:items-end">
             <span className="text-[10px] font-bold uppercase tracking-wider text-rq-text-muted">Evidence confidence</span>
             <StatusPill value={incident.intelligence?.confidence?.level || 'MEDIUM'} />
           </div>
         </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
         {/* Left Column: Facts and Conflicts */}
         <div className="flex flex-col gap-8">
           {/* What we know */}
           <section className="rounded-2xl border border-rq-border bg-rq-surface p-6 shadow-sm">
             <h2 className="text-[11px] font-bold uppercase tracking-wider text-rq-text-secondary">What we know</h2>
             {incident.agreements?.length > 0 ? (
               <ul className="mt-4 flex flex-col gap-3">
                 {incident.agreements.map((agreement, idx) => (
                   <li key={idx} className="flex items-start gap-3">
                     <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-rq-success" />
                     <span className="text-sm font-medium text-rq-text">{agreement}</span>
                   </li>
                 ))}
               </ul>
             ) : (
               <p className="mt-4 text-sm text-rq-text-secondary">No confirmed facts yet.</p>
             )}
           </section>

           {/* Reports disagree */}
           {incident.contradictions?.length > 0 && (
             <section className="rounded-2xl border border-rq-red/20 bg-rq-red-soft p-6 shadow-sm">
               <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-rq-red">
                 <AlertTriangle className="h-4 w-4" /> Critical contradiction
               </h2>
               <div className="mt-4 flex flex-col gap-6">
                 {incident.contradictions.map((conflict, idx) => (
                   <div key={idx} className="flex flex-col gap-4">
                     <p className="text-sm font-semibold text-rq-red">{conflict.label || conflict.field}</p>
                     <div className="grid grid-cols-2 gap-4 rounded-xl border border-rq-red/10 bg-rq-surface/50 p-4">
                        {conflict.claims?.slice(0,2).map((claim, cIdx) => (
                          <div key={cIdx} className="flex flex-col border-r border-rq-red/10 pr-4 last:border-0 last:pr-0">
                             <span className="mb-2 text-[10px] font-bold uppercase text-rq-text-muted">REPORT {claim.reportId || (cIdx === 0 ? 'A' : 'B')}</span>
                             <p className="text-sm italic text-rq-text">"{claim.value === 'rescued' ? 'Reported rescued' : 'Still trapped / requesting help'}"</p>
                             <span className="mt-3 text-xs text-rq-text-muted">{claim.sourceId || 'Unknown source'}</span>
                          </div>
                        ))}
                     </div>
                   </div>
                 ))}
               </div>
             </section>
           )}
         </div>

         {/* Right Column: Verification */}
         <div className="flex flex-col gap-8">
           {/* What should we verify? */}
           <section className="rounded-2xl border border-rq-border bg-rq-surface-raised p-6 sm:p-8 shadow-sm">
             <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-rq-warning">
                <HelpCircle className="h-4 w-4" /> Decision-critical evidence
             </h2>
             {topGap ? (
               <div className="mt-4">
                 <p className="text-2xl font-bold leading-snug text-rq-text">{topGap.question || topGap.label}</p>
                 <p className="mt-3 text-sm text-rq-text-secondary">Confirming this will determine whether another rescue response is needed.</p>
                 
                 <div className="mt-8 flex flex-col gap-3">
                   {!fieldAdded && incident.id === 'INC-21' ? (
                     <button
                       onClick={addFieldEvidence}
                       className="w-full rounded-xl bg-rq-warning px-4 py-3 text-sm font-bold text-rq-bg shadow-sm transition hover:bg-rq-warning/90"
                     >
                       Request verification (Demo)
                     </button>
                   ) : fieldAdded ? (
                     <div className="w-full rounded-xl bg-rq-success/20 px-4 py-3 text-center text-sm font-bold text-rq-success ring-1 ring-rq-success/30">
                       Field evidence received
                     </div>
                   ) : (
                     <button className="w-full rounded-xl bg-rq-text px-4 py-3 text-sm font-bold text-rq-bg shadow-sm transition hover:bg-rq-text-secondary">
                       Request verification
                     </button>
                   )}
                   <Link to={`/incidents/${incident.id}/intelligence`} className="w-full rounded-xl border border-rq-border bg-rq-surface px-4 py-3 text-center text-sm font-bold text-rq-text transition hover:bg-rq-surface-hover">
                     View analysis details
                   </Link>
                 </div>
               </div>
             ) : (
               <div className="mt-4">
                 <p className="text-lg font-semibold text-rq-text">No outstanding verifications.</p>
                 <p className="mt-2 text-sm text-rq-text-secondary">All critical facts have been established.</p>
               </div>
             )}
           </section>
           
           <section className="rounded-2xl border border-rq-border bg-rq-surface p-6 shadow-sm">
             <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-sm font-bold text-rq-text">Human decision</h3>
                   <p className="text-xs text-rq-text-secondary mt-1">Review recommendation and approve response.</p>
                </div>
                <Link to={`/incidents/${incident.id}/decision`} className="rounded-lg bg-rq-surface-raised px-4 py-2 text-sm font-semibold text-rq-info transition hover:bg-rq-surface-hover hover:text-rq-info/80 ring-1 ring-rq-border">
                  Open decision &rarr;
                </Link>
             </div>
           </section>
         </div>
      </div>
    </div>
  );
}
