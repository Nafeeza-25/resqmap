import { useMemo, useState } from 'react';
import ReportCard from '../components/ReportCard.jsx';
import StatusPill from '../components/StatusPill.jsx';
import {
  useIncidents,
  useReports,
} from '../hooks/useRepositoryData.js';
import { repository } from '../repository/index.js';

function Icon({ name, className = 'h-5 w-5' }) {
  const icons = {
    review: (
      <>
        <path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M8 8h8M8 12h5M8 16h3" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="M9 12h6" />
      </>
    ),
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
        <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
      </>
    ),
    plus: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </>
    ),
    hold: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M10 9v6M14 9v6" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),
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
    activity: <path d="M3 12h4l2-6 4 12 2-6h6" />,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
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

function DecisionButton({
  type,
  disabled,
  loading,
  onClick,
  children,
}) {
  const styles = {
    link:
      'bg-slate-950 text-white hover:bg-slate-800 focus:ring-slate-900',
    create:
      'border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-400',
    hold:
      'border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 focus:ring-amber-400',
  };

  const iconNames = {
    link: 'link',
    create: 'plus',
    hold: 'hold',
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${styles[type]}`}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70" />
      ) : (
        <Icon
          name={iconNames[type]}
          className="h-4 w-4"
        />
      )}

      {children}
    </button>
  );
}

export default function ReviewQueuePage() {
  const { data: reports } = useReports();
  const { data: incidents } = useIncidents();

  const [busyId, setBusyId] = useState(null);

  const canonical = incidents.find(
    incident => incident.id === 'INC-21',
  );

  const queue = useMemo(
    () =>
      reports.filter(
        report =>
          report.status === 'review' ||
          report.status === 'hold',
      ),
    [reports],
  );

  const decide = async (reportId, decision) => {
    setBusyId(reportId);

    try {
      await repository.applyLinkDecision({
        reportId,
        decision,
        incidentId: 'INC-21',
        operator: 'Demo Operator',
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">

        {/* Page heading */}
        <header className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-6 items-center rounded-md bg-amber-50 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700 ring-1 ring-inset ring-amber-100">
                Stage A
              </span>

              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Report reconciliation
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              LINK / CREATE / HOLD Review
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              ResQMap may recommend whether evidence belongs to an
              existing incident, but uncertain reconciliation decisions
              remain explicitly controlled by the human operator.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 ring-1 ring-amber-100">
              <Icon
                name="review"
                className="h-[18px] w-[18px]"
              />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Awaiting decision
              </p>

              <p className="mt-0.5 text-sm font-bold text-slate-900">
                {queue.length}{' '}
                <span className="font-medium text-slate-500">
                  {queue.length === 1 ? 'report' : 'reports'}
                </span>
              </p>
            </div>
          </div>
        </header>

        {/* Safety message */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50 shadow-sm">
          <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 ring-1 ring-amber-200">
                <Icon
                  name="shield"
                  className="h-[18px] w-[18px]"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-amber-950">
                  No silent merge
                </p>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-amber-800">
                  Low-confidence matches stay visible as HOLD FOR REVIEW.
                  Source evidence is never silently attached to an incident
                  simply because an automated score exceeds a threshold.
                </p>
              </div>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-800 ring-1 ring-amber-200">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Human confirmation required
            </div>
          </div>
        </section>

        {/* Queue info / baseline */}
        {queue.length > 0 && (
          <section className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                <Icon
                  name="target"
                  className="h-[17px] w-[17px]"
                />
              </div>

              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Current baseline
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                {canonical
                  ? `${canonical.id} · ${canonical.title}`
                  : 'Incident baseline unavailable'}
              </p>

              {canonical && (
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {canonical.locationLabel}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                <Icon
                  name="link"
                  className="h-[17px] w-[17px]"
                />
              </div>

              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                LINK
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                Same real-world incident
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Attach the report to the existing source-linked incident
                record.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 ring-1 ring-slate-200">
                <Icon
                  name="plus"
                  className="h-[17px] w-[17px]"
                />
              </div>

              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                CREATE / HOLD
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                Preserve uncertainty
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Create a separate incident or leave the evidence unresolved
                for additional verification.
              </p>
            </div>
          </section>
        )}

        {/* Queue */}
        {queue.length > 0 ? (
          <section className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  <Icon
                    name="activity"
                    className="h-3.5 w-3.5"
                  />
                  Decision queue
                </div>

                <h2 className="mt-1 text-lg font-bold text-slate-950">
                  Reports requiring operator review
                </h2>
              </div>

              <p className="text-xs text-slate-500">
                Automated recommendations are advisory only
              </p>
            </div>

            {queue.map((report, index) => {
              const result = canonical
                ? report.matchRecommendation
                : null;

              const isBusy = busyId === report.id;

              const matchPercent = result
                ? Math.round(result.total * 100)
                : null;

              return (
                <div
                  key={report.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* Queue position */}
                  <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3 lg:px-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-white px-2 font-mono text-[10px] font-bold text-slate-500 ring-1 ring-slate-200">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                        Human reconciliation required
                      </span>
                    </div>

                    {isBusy && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />
                        Recording decision
                      </div>
                    )}
                  </div>

                  <ReportCard
                    report={report}
                    footer={
                      <div className="border-t border-slate-200 bg-[#F8FAFC] p-5 lg:p-6">

                        {/* Recommendation */}
                        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                              Model / rule recommendation
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-3">
                              <StatusPill
                                value={
                                  result?.recommendation ??
                                  'HOLD'
                                }
                              />

                              {result && (
                                <span className="text-sm font-bold text-slate-900">
                                  {matchPercent}% match score
                                </span>
                              )}
                            </div>

                            {!result && (
                              <p className="mt-2 text-sm font-semibold text-amber-700">
                                Incident baseline unavailable
                              </p>
                            )}
                          </div>

                          {result && (
                            <div className="min-w-[150px] rounded-xl border border-slate-200 bg-white px-4 py-3">
                              <div className="flex items-end justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                  Similarity
                                </span>

                                <strong className="font-mono text-sm text-slate-900">
                                  {matchPercent}%
                                </strong>
                              </div>

                              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className={`h-full rounded-full ${
                                    matchPercent >= 75
                                      ? 'bg-emerald-500'
                                      : matchPercent >= 50
                                        ? 'bg-amber-500'
                                        : 'bg-slate-400'
                                  }`}
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.max(
                                        0,
                                        matchPercent,
                                      ),
                                    )}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Reasons */}
                        {result?.reasons?.length > 0 && (
                          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                              Why this recommendation was made
                            </p>

                            <ul className="mt-3 space-y-2.5">
                              {result.reasons.map(reason => (
                                <li
                                  key={reason}
                                  className="flex items-start gap-2.5 text-xs leading-5 text-slate-600"
                                >
                                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Human decision */}
                        <div className="mt-5">
                          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs font-bold text-slate-800">
                                Record human decision
                              </p>

                              <p className="mt-0.5 text-[11px] text-slate-500">
                                Your decision is recorded in the
                                audit trail.
                              </p>
                            </div>

                            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400 sm:mt-0">
                              Demo Operator
                            </span>
                          </div>

                          <div className="grid gap-2.5 sm:grid-cols-3">
                            <DecisionButton
                              type="link"
                              disabled={
                                busyId !== null
                              }
                              loading={isBusy}
                              onClick={() =>
                                decide(
                                  report.id,
                                  'LINK',
                                )
                              }
                            >
                              LINK to #21
                            </DecisionButton>

                            <DecisionButton
                              type="create"
                              disabled={
                                busyId !== null
                              }
                              loading={false}
                              onClick={() =>
                                decide(
                                  report.id,
                                  'CREATE',
                                )
                              }
                            >
                              CREATE incident
                            </DecisionButton>

                            <DecisionButton
                              type="hold"
                              disabled={
                                busyId !== null
                              }
                              loading={false}
                              onClick={() =>
                                decide(
                                  report.id,
                                  'HOLD',
                                )
                              }
                            >
                              HOLD for review
                            </DecisionButton>
                          </div>
                        </div>
                      </div>
                    }
                  />
                </div>
              );
            })}
          </section>
        ) : (
          /* Cleared queue */
          <section className="rounded-2xl border border-emerald-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
              <Icon
                name="check"
                className="h-6 w-6"
              />
            </div>

            <span className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700 ring-1 ring-inset ring-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Queue clear
            </span>

            <h2 className="mt-4 text-lg font-bold text-slate-950">
              Review queue cleared
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Every current report has a recorded human reconciliation
              decision. New uncertain matches will appear here automatically.
            </p>
          </section>
        )}

        {/* Footer note */}
        <footer className="mt-6 flex items-start gap-2 border-t border-slate-200 px-1 pt-4 text-[11px] leading-5 text-slate-400">
          <Icon
            name="alert"
            className="mt-0.5 h-3.5 w-3.5 shrink-0"
          />

          Automated match scores support operator review. They do not
          automatically establish incident identity.
        </footer>
      </div>
    </main>
  );
}