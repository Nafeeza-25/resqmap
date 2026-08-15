import { useAudit } from '../hooks/useRepositoryData.js';
import StatusPill from '../components/StatusPill.jsx';

export default function AuditHistoryPage() {
  const { data: events } = useAudit();
  return (
    <div className="page">
      <div className="page-header"><div><span className="eyebrow">Accountability layer</span><h1>Audit trail</h1><p>Original evidence, model/rule recommendations, human corrections, workflow decisions, and field updates remain reviewable.</p></div><span className="count-badge">{events.length} events</span></div>
      <section className="audit-timeline">
        {[...events].sort((a,b)=>new Date(b.timestamp ?? b.createdAt)-new Date(a.timestamp ?? a.createdAt)).map((event,index)=><article className="audit-event" key={event.id ?? index}><div className="audit-event__rail"><span>{events.length-index}</span></div><div className="audit-event__body"><div className="audit-event__top"><strong>{event.type.replaceAll('_',' ')}</strong>{event.decision && <StatusPill value={event.decision} />}</div><p>{event.message}</p><div className="audit-meta"><span>{event.actor}</span>{event.reportId && <span>Report {event.reportId}</span>}{event.incidentId && <span>{event.incidentId}</span>}<span>{new Date(event.timestamp ?? event.createdAt).toLocaleString('en-IN')}</span></div>{event.note && <blockquote>{event.note}</blockquote>}</div></article>)}
      </section>
    </div>
  );
}
