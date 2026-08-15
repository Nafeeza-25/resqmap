import { Link } from 'react-router-dom';
import StatusPill from '../components/StatusPill.jsx';
import {
  useAudit,
  useIncidents,
  useReports,
} from '../hooks/useRepositoryData.js';
import { repository } from '../repository/index.js';

function Icon({ name, className = 'h-5 w-5' }) {
  const paths = {
    reports: (
      <>
        <path d="M6 2h8l4 4v16H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
        <path d="M14 2v5h5" />
        <path d="M8 13h8M8 17h5M8 9h2" />
      </>
    ),
    review: (
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </>
    ),
    alert: (
      <>
        <path d="M12 3 2.7 19a2 2 0 0 0 1.73 3h15.14a2 2 0 0 0 1.73-3L12 3Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
    conflict: (
      <>
        <circle cx="8" cy="8" r="3" />
        <circle cx="16" cy="16" r="3" />
        <path d="M10.5 10.5 13.5 13.5M16 5h3v3M8 19H5v-3" />
      </>
    ),
    map: (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
        <path d="M9 3v15M15 6v15" />
      </>
    ),
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    activity: (
      <>
        <path d="M3 12h4l2-6 4 12 2-6h6" />
      </>
    ),
    database: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
        <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
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
      {paths[name]}
    </svg>
  );
}

function MetricCard({
  label,
  value,
  hint,
  icon,
  tone = 'blue',
}) {
  const tones = {
    blue: {
      icon: 'bg-blue-50 text-blue-700 ring-blue-100',
      dot: 'bg-blue-600',
    },
    amber: {
      icon: 'bg-amber-50 text-amber-700 ring-amber-100',
      dot: 'bg-amber-500',
    },
    red: {
      icon: 'bg-red-50 text-red-700 ring-red-100',
      dot: 'bg-red-600',
    },
    slate: {
      icon: 'bg-slate-100 text-slate-700 ring-slate-200',
      dot: 'bg-slate-500',
    },
  };

  const style = tones[tone];

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${style.icon}`}
        >
          <Icon name={icon} className="h-[18px] w-[18px]" />
        </div>

        <span
          className={`mt-1 h-2.5 w-2.5 rounded-full ${style.dot}`}
        />
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </p>

        <div className="mt-1.5 text-3xl font-bold tracking-tight text-slate-950">
          {value}
        </div>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          {hint}
        </p>
      </div>
    </article>
  );
}

function EmptyState({ onSeed }) {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200">
        <Icon name="database" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-900">
        No incident data available
      </h3>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
        Seed the controlled Chennai submission dataset to populate the
        operator dashboard and demonstrate the reconstruction workflow.
      </p>

      <button
        type="button"
        onClick={onSeed}
        className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
      >
        Seed demo dataset
      </button>
    </section>
  );
}

export default function DashboardPage() {
  const { data: reports } = useReports();
  const { data: incidents } = useIncidents();
  const { data: audit } = useAudit();

  const reviewCount = reports.filter(
    report => report.status === 'review' || report.status === 'hold',
  ).length;

  const critical = incidents.filter(
    incident =>
      incident.intelligence?.urgency?.level === 'CRITICAL',
  ).length;

  const conflicts = incidents.reduce(
    (sum, incident) =>
      sum + (incident.contradictions?.length ?? 0),
    0,
  );

  const seed = async () => {
    if (repository.seedDemoData) {
      await repository.seedDemoData();
    }
  };

  const flow = [
    'Reports A–D arrive',
    'Probable same incident',
    'Rescued vs still trapped',
    'Critical + Medium',
    'Verify rescue status',
    'RAPID VERIFY',
    'Field unit confirms',
    'DISPATCH FOR APPROVAL',
  ];

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">

        {/* Header */}
        <header className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Operations overview
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Incident Intelligence
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Reconstruct fragmented disaster reports, expose conflicting
              evidence, and route the next decision-critical verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/map"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Icon name="map" className="h-4 w-4" />
              Live map
            </Link>

            <Link
              to="/review"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Open review queue
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Incoming reports"
            value={reports.length}
            hint="Multi-source reports currently in the evidence repository."
            icon="reports"
          />

          <MetricCard
            label="Awaiting review"
            value={reviewCount}
            hint="Reports requiring a human LINK, CREATE, or HOLD decision."
            icon="review"
            tone="amber"
          />

          <MetricCard
            label="Critical incidents"
            value={critical}
            hint="Critical urgency incidents. Urgency does not imply confidence."
            icon="alert"
            tone="red"
          />

          <MetricCard
            label="Visible contradictions"
            value={conflicts}
            hint="Conflicting claims remain visible and source-linked."
            icon="conflict"
            tone="slate"
          />
        </section>

        {reports.length === 0 && (
          <div className="mt-6">
            <EmptyState onSeed={seed} />
          </div>
        )}

        {/* Main dashboard */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.65fr)]">

          {/* Live incidents */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-6">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  <Icon
                    name="activity"
                    className="h-3.5 w-3.5"
                  />
                  Live incidents
                </div>

                <h2 className="mt-1 text-lg font-bold text-slate-950">
                  Operator attention
                </h2>
              </div>

              <Link
                to="/map"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
              >
                Open operational map
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>

            {incidents.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {incidents.map((incident, index) => {
                  const contradictionCount =
                    incident.contradictions?.length ?? 0;

                  return (
                    <Link
                      key={incident.id}
                      to={`/incidents/${incident.id}`}
                      className="group flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between lg:px-6"
                    >
                      <div className="flex min-w-0 gap-4">
                        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 sm:flex">
                          {String(index + 1).padStart(2, '0')}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold uppercase tracking-wide text-blue-700">
                              {incident.id}
                            </span>

                            {contradictionCount > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700 ring-1 ring-inset ring-red-100">
                                {contradictionCount}{' '}
                                {contradictionCount === 1
                                  ? 'conflict'
                                  : 'conflicts'}
                              </span>
                            )}
                          </div>

                          <h3 className="mt-1 truncate text-sm font-semibold text-slate-950 transition group-hover:text-blue-800 sm:text-[15px]">
                            {incident.title}
                          </h3>

                          <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                            {incident.locationLabel ||
                              'Location unavailable'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <StatusPill
                          value={
                            incident.intelligence?.urgency?.level
                          }
                        />

                        <StatusPill
                          value={
                            incident.intelligence?.confidence?.level
                          }
                        />

                        <StatusPill
                          value={
                            incident.intelligence?.workflow?.workflow
                          }
                        />

                        <span className="ml-1 hidden text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-600 lg:block">
                          <Icon name="arrow" className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <p className="text-sm font-medium text-slate-700">
                  No active incidents
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Incident records will appear here when reports are
                  reconstructed.
                </p>
              </div>
            )}
          </div>

          {/* Evidence routing */}
          <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-[#102A43] text-white shadow-sm">
            <div className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                <Icon
                  name="shield"
                  className="h-[18px] w-[18px] text-cyan-200"
                />
              </div>

              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">
                Core intelligence
              </p>

              <h2 className="mt-2 text-xl font-bold leading-snug">
                Decision-Critical Evidence Routing
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-300">
                ResQMap keeps uncertainty explicit and identifies which
                missing fact has the greatest impact on the next human
                response decision.
              </p>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Operator question
                </p>

                <p className="mt-2 text-sm font-semibold leading-6 text-white">
                  “If we can verify only one thing next, which fact
                  matters most?”
                </p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Audit events recorded
                  </span>
                  <span className="font-mono font-bold text-white">
                    {audit.length}
                  </span>
                </div>

                <Link
                  to="/review"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  Review evidence
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </section>

        {/* Workflow */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Submission walkthrough
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-950">
                Reconstruction workflow
              </h2>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {audit.length} audit events
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {flow.map((step, index) => (
              <div
                key={step}
                className="group relative border-b border-slate-100 p-5 transition hover:bg-slate-50 sm:border-r lg:min-h-[145px]"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {index < flow.length - 1 && (
                    <Icon
                      name="arrow"
                      className="h-3.5 w-3.5 text-slate-300"
                    />
                  )}
                </div>

                <strong className="mt-7 block max-w-[180px] text-sm font-semibold leading-5 text-slate-800">
                  {step}
                </strong>
              </div>
            ))}
          </div>
        </section>

        {/* Footer status */}
        <footer className="mt-6 flex flex-col gap-2 px-1 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            ResQMap Incident Intelligence Platform
          </span>

          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Operational system available
          </span>
        </footer>
      </div>
    </main>
  );
}