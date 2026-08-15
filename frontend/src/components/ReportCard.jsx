import StatusPill from './StatusPill.jsx';

function displayTime(value) {
  if (!value) return 'Time unknown';
  try { return new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }
  catch { return value; }
}

export default function ReportCard({ report, footer }) {
  return (
    <article className="report-card">
      <div className="report-card__meta">
        <div>
          <strong>Report {report.id}</strong>
          <span>{report.sourceId} · {report.channel ?? report.sourceType}</span>
        </div>
        <div className="report-card__meta-right">
          <StatusPill value={report.status ?? 'review'} />
          <span>{displayTime(report.timestamp)}</span>
        </div>
      </div>
      <p className="report-card__text">“{report.text}”</p>
      <div className="report-card__tags">
        {report.language && <span>{report.language}</span>}
        {report.stale && <span>Possibly outdated</span>}
        {!report.location && <span>Location missing</span>}
        {report.verified && <span>Verified field evidence</span>}
      </div>
      {footer && <div className="report-card__footer">{footer}</div>}
    </article>
  );
}
