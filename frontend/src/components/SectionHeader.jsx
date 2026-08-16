export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-rq-text">{title}</h2>
        {subtitle && <p className="text-sm text-rq-text-secondary">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
