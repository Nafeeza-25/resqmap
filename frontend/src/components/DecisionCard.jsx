import { useState } from 'react';
import StatusPill from './StatusPill.jsx';

export default function DecisionCard({ incident, onDecision }) {
  const recommendation = incident?.intelligence?.workflow;
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const act = async action => {
    setBusy(true);
    try { await onDecision(action, note); }
    finally { setBusy(false); }
  };
  return (
    <article className="decision-card">
      <div className="section-heading section-heading--compact">
        <div><span className="eyebrow">Recommended workflow</span><h2>Human decision</h2></div>
        <StatusPill value={recommendation?.workflow} />
      </div>
      <div className="reason-list">
        {(recommendation?.reasons ?? []).map(reason => <div key={reason}><span>Reason</span><p>{reason}</p></div>)}
      </div>
      <label className="field-label" htmlFor="decision-note">Operator note</label>
      <textarea id="decision-note" value={note} onChange={e => setNote(e.target.value)} placeholder="Optional justification or operational context" />
      <div className="button-row">
        <button className="button button--primary" disabled={busy} onClick={() => act('APPROVE_RECOMMENDATION')}>Approve recommendation</button>
        <button className="button button--secondary" disabled={busy} onClick={() => act('OVERRIDE_STANDARD_QUEUE')}>Override → Standard Queue</button>
        <button className="button button--ghost" disabled={busy} onClick={() => act('DEFER_FOR_REVIEW')}>Defer</button>
      </div>
      <p className="human-authority">ResQMap recommends. The emergency operator remains the final authority.</p>
      {incident?.operatorDecision && <div className="decision-record"><strong>Latest operator action:</strong> {incident.operatorDecision.action.replaceAll('_',' ')}</div>}
    </article>
  );
}
