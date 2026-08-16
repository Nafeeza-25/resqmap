export default function ConflictPanel({ conflicts = [] }) {
  if (!conflicts.length) {
    return <div className="empty-state empty-state--good"><strong>No active contradictions detected</strong><span>Current linked claims do not contain a critical structured conflict.</span></div>;
  }
  return (
    <div className="conflict-stack">
      {conflicts.map(conflict => (
        <article className="conflict-panel" key={conflict.field}>
          <div className="conflict-panel__header">
            <div><span className="eyebrow">Critical contradiction</span><h3>{conflict.label}</h3></div>
            <span className="conflict-severity">{conflict.resolved ? 'resolved by newer evidence' : conflict.severity}</span>
          </div>
          <div className="claim-grid">
            {conflict.claims.map(claim => (
              <div className="claim-card" key={`${claim.reportId}-${claim.value}`}>
                <span className="claim-card__source">Report {claim.reportId} · {claim.sourceId}</span>
                <strong>{claim.value === 'rescued' ? 'Reported rescued' : 'Still trapped / requesting help'}</strong>
                <small>{new Date(claim.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</small>
              </div>
            ))}
          </div>
          <p className="conflict-note">Both claims remain attached to their original sources. {conflict.resolved ? `Newer verified evidence from ${conflict.resolution?.sourceId} establishes the current status while preserving this conflict in history.` : 'ResQMap does not silently choose which one is true.'}</p>
        </article>
      ))}
    </div>
  );
}
