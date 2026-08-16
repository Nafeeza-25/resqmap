import StatusPill from './StatusPill.jsx';

export default function ConfidenceMeter({ confidence }) {
  const score = confidence?.score ?? 0;
  return (
    <div className="confidence-meter">
      <div className="section-heading section-heading--compact">
        <div><span className="eyebrow">Evidence support</span><h3>Evidence confidence</h3></div>
        <StatusPill value={confidence?.level ?? 'LOW'} />
      </div>
      <div className="meter" aria-label={`Evidence confidence ${score} out of 100`}>
        <div className="meter__fill" style={{ width: `${score}%` }} />
      </div>
      <strong className="meter__score">{score}/100</strong>
      <div className="confidence-components">
        {(confidence?.components ?? []).map((component, index) => (
          <div className="confidence-component" key={`${component.label}-${index}`}>
            <span>{component.label}</span><strong>{component.effect}</strong><small>{component.detail}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
