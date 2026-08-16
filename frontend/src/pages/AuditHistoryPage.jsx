import { useAudit } from '../hooks/useRepositoryData.js';
import StatusPill from '../components/StatusPill.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function AuditHistoryPage() {
  const { data: events } = useAudit();
  
  const sortedEvents = [...events].sort((a,b) => 
    new Date(b.timestamp ?? b.createdAt) - new Date(a.timestamp ?? a.createdAt)
  );

  return (
    <div className="mx-auto max-w-[900px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader 
        title="Audit trail" 
        subtitle="See how reports, evidence, recommendations, and human decisions changed over time."
        stage="decide"
      >
        <div className="flex items-center gap-2 rounded-full border border-rq-border bg-rq-surface px-4 py-2 shadow-sm">
           <span className="text-sm font-semibold text-rq-text">{events.length}</span>
           <span className="text-sm text-rq-text-secondary">events</span>
        </div>
      </PageHeader>

      <div className="mt-8">
        <div className="relative border-l-2 border-rq-border-soft pl-6 sm:pl-8 ml-2">
          {sortedEvents.map((event, index) => {
            const time = new Date(event.timestamp ?? event.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            return (
              <div key={event.id ?? index} className="mb-10 last:mb-0 relative">
                <div className="absolute -left-[35px] sm:-left-[43px] mt-1.5 h-4 w-4 rounded-full border-4 border-rq-bg bg-rq-info" />
                
                <div className="mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rq-text-muted">{time}</span>
                </div>
                
                <div className="rounded-2xl border border-rq-border bg-rq-surface p-5 shadow-sm transition hover:bg-rq-surface-hover">
                   <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                     <div>
                       <strong className="block text-sm font-bold text-rq-text">
                         {event.type.replaceAll('_', ' ')}
                       </strong>
                       <p className="mt-1 text-sm text-rq-text-secondary">{event.message}</p>
                     </div>
                     {event.decision && (
                       <div className="mt-2 sm:mt-0 sm:shrink-0">
                         <StatusPill value={event.decision} />
                       </div>
                     )}
                   </div>
                   
                   <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-rq-text-muted">
                     {event.actor && (
                       <span className="flex items-center gap-1.5 text-rq-text">
                         <span className="h-2 w-2 rounded-full bg-rq-info"></span> {event.actor}
                       </span>
                     )}
                     {event.reportId && <span>Report {event.reportId}</span>}
                     {event.incidentId && <span>Incident {event.incidentId}</span>}
                   </div>
                   
                   {event.note && (
                     <div className="mt-4 rounded-xl border border-rq-border-soft bg-rq-surface-raised p-4">
                       <p className="text-xs italic text-rq-text-secondary">"{event.note}"</p>
                     </div>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
