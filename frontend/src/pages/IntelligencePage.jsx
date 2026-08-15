import { Link, useParams } from 'react-router-dom';
import ConfidenceMeter from '../components/ConfidenceMeter.jsx';
import StatusPill from '../components/StatusPill.jsx';
import { useIncidents } from '../hooks/useRepositoryData.js';

function Icon({ name, className = 'h-5 w-5' }) {
  const icons = {
    alert: (
      <>
        <path d="M12 3 2.7 19a2 2 0 0 0 1.73 3h15.14a2 2 0 0 0 1.73-3L12 3Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

function IncidentNav({ incidentId }) {
  return (
    <nav className="mb-6 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      <div className="flex min-w-max gap-1">
        <Link
          to={`/incidents/${incidentId}`}
          className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Incident & conflict
        </Link>

        <Link
          to={`/incidents/${incidentId}/intelligence`}
          className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
        >
          Urgency & confidence
        </Link>

        <Link
          to={`/incidents/${incidentId}/decision`}
          className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Decision & approval
        </Link>
      </div>
    </nav>
  );
}

export default function IntelligencePage() {
  const { incidentId } = useParams();
  const { data: incidents } = useIncidents();

  const incident = incidents.find(i => i.id === incidentId);

  if (!incident) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] p-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <strong className="text-lg text-slate-950">
            Incident not found
          </strong>
        </div>
      </main>
    );
  }

  const urgency = incident.intelligence?.urgency;
  const gaps = incident.intelligence?.evidenceGaps ?? [];

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">

        <header className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Incident intelligence
          </span>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {incident.title}
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Danger and certainty remain separate so a critical but uncertain
            situation is never hidden inside a single opaque priority score.
          </p>
        </header>

        <IncidentNav incidentId={incident.id} />

        {/* Urgency + Confidence */}
        <section className="grid gap-6 lg:grid-cols-2">

          {/* Urgency */}
          <article className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
            <div className="flex items-start justify-between border-b border-red-100 bg-red-50/60 p-5 lg:p-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-600">
                  If the situation is true
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Urgency
                </h2>
              </div>

              <StatusPill value={urgency?.level} />
            </div>

            <div className="p-5 lg:p-6">
              <div className="flex items-end gap-2">
                <span className="text-6xl font-bold tracking-tight text-slate-950">
                  {urgency?.score ?? 0}
                </span>

                <span className="mb-2 text-sm font-semibold text-slate-400">
                  /100
                </span>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-red-600 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, urgency?.score ?? 0))}%`,
                  }}
                />
              </div>

              <div className="mt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Urgency drivers
                </p>

                <ul className="mt-3 space-y-3">
                  {(urgency?.reasons ?? []).map(reason => (
                    <li
                      key={reason}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          {/* Confidence */}
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              How strongly current evidence supports the picture
            </p>

            <ConfidenceMeter
              confidence={incident.intelligence?.confidence}
            />
          </article>
        </section>

        {/* Evidence routing */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between lg:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                <Icon name="target" className="h-[18px] w-[18px]" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">
                  Decision-Critical Evidence Routing
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-950">
                  What should be verified next?
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Ranked by decision impact and the effort required to verify it.
                </p>
              </div>
            </div>

            {gaps.length > 0 && (
              <span className="w-fit rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
                {gaps.length} unresolved
              </span>
            )}
          </div>

          {gaps.length > 0 ? (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      {[
                        'Priority',
                        'Missing evidence',
                        'Decision impact',
                        'Verification effort',
                        'Why it matters',
                      ].map(label => (
                        <th
                          key={label}
                          className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500"
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {gaps.map((gap, index) => (
                      <tr
                        key={gap.key}
                        className="align-top transition hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-5">
                          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-blue-50 px-2 font-mono text-xs font-bold text-blue-700">
                            #{index + 1}
                          </span>
                        </td>

                        <td className="max-w-sm px-5 py-5">
                          <strong className="text-sm leading-6 text-slate-900">
                            {gap.question}
                          </strong>
                        </td>

                        <td className="px-5 py-5 text-sm text-slate-600">
                          {gap.decisionImpact ?? '—'}
                        </td>

                        <td className="px-5 py-5 text-sm text-slate-600">
                          {gap.verificationEffort ?? '—'}
                        </td>

                        <td className="max-w-md px-5 py-5 text-xs leading-5 text-slate-500">
                          {gap.rationale}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-slate-100 md:hidden">
                {gaps.map((gap, index) => (
                  <article key={gap.key} className="p-5">
                    <div className="flex items-start gap-3">
                      <span className="rounded-lg bg-blue-50 px-2 py-1 font-mono text-xs font-bold text-blue-700">
                        #{index + 1}
                      </span>

                      <strong className="text-sm leading-6 text-slate-900">
                        {gap.question}
                      </strong>
                    </div>

                    <dl className="mt-4 grid gap-3">
                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Decision impact
                        </dt>
                        <dd className="mt-1 text-sm text-slate-600">
                          {gap.decisionImpact ?? '—'}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Verification effort
                        </dt>
                        <dd className="mt-1 text-sm text-slate-600">
                          {gap.verificationEffort ?? '—'}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Why it matters
                        </dt>
                        <dd className="mt-1 text-xs leading-5 text-slate-500">
                          {gap.rationale}
                        </dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="p-6 text-center sm:p-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                <Icon name="check" />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-950">
                Decision-critical rescue status verified
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                The highest-impact evidence gap has been resolved by current
                field evidence.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}