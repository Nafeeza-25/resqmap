import ResponseStage from './ResponseStage.jsx';

export default function PageHeader({ title, subtitle, stage, children }) {
  return (
    <header className="prototype-page-header">
      <div className="prototype-page-header__row">
        <div>
          <span className="prototype-page-header__eyebrow">Conflict-aware response</span>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {children && <div className="prototype-page-header__actions">{children}</div>}
      </div>
      {stage && <ResponseStage stage={stage} />}
    </header>
  );
}
