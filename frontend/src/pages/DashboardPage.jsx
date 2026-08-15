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
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
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
    location: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    activity: <path d="M3 12h4l2-6 4 12 2-6h6" />,
    database: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
        <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    radio: (
      <>
        <circle cx="12" cy="12" r="2" />
        <path d="M16.24 7.76a6 6 0 0 1 0 8.48M7.76 16.24a6 6 0 0 1 0-8.48" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </>
    ),
    siren: (
      <>
        <path d="M6 18h12M8 18V9a4 4 0 0 1 8 0v9" />
        <path d="M4 8H2M22 8h-2M5 3 3.5 1.5M19 3l1.5-1.5M12 2V0" />
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

const metricStyles = {
  blue: {
    icon: 'bg-blue-600 text-white shadow-blue-200/70',
    dot: 'bg-blue-500',
    border: 'hover:border-blue-200',
  },
  orange: {
    icon: 'bg-orange-500 text-white shadow-orange-200/70',
    dot: 'bg-orange-500',
    border: 'hover:border-orange-200',
  },
  red: {
    icon: 'bg-red-600 text-white shadow-red-200/70',
    dot: 'bg-red-500',
    border: 'hover:border-red-200',
  },
  green: {
    icon: 'bg-emerald-600 text-white shadow-emerald-200/70',
    dot: 'bg-emerald-500',
    border: 'hover:border-emerald-200',
  },
};

function MetricCard({ label, value, hint, icon, tone = 'blue' }) {
  const style = metricStyles[tone];

  return (
    <article
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(15,23,42,0.08)] ${style.border}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-lg ${style.icon}`}
        >
          <Icon name={icon} className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] font-extrabold uppercase leading-5 tracking-[0.08em] text-slate-700">
              {label}
            </p>
            <span className={`mt-1 h-2.5 w-2.5 rounded-full ${style.dot}`} />
          </div>

          <div className="mt-1 text-3xl font-black tracking-tight text-slate-950">
            {value}
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">{hint}</p>
        </div>
      </div>
    </article>
  );
}

function SidebarItem({ icon, label, sublabel, active = false, to }) {
  const content = (
    <>
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          active
            ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
            : 'bg-slate-100 text-slate-500'
        }`}
      >
        <Icon name={icon} className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div
          className={`truncate text-sm font-bold ${
            active ? 'text-orange-600' : 'text-slate-800'
          }`}
        >
          {label}
        </div>
        {sublabel && (
          <div className="mt-0.5 truncate text-[11px] text-slate-400">
            {sublabel}
          </div>
        )}
      </div>
    </>
  );

  const classes = `flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
    active
      ? 'border-orange-200 bg-orange-50/70 shadow-sm'
      : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
  }`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}

function EmptyState({ onSeed }) {
  return (
    <section className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/40 px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-orange-500 shadow-sm ring-1 ring-orange-100">
        <Icon name="database" className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-900">
        No rescue incidents available
      </h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
        Seed the controlled Chennai submission dataset to populate the rescue
        operations dashboard and demonstrate the reconstruction workflow.
      </p>
      <button
        type="button"
        onClick={onSeed}
        className="mt-5 inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
      >
        Seed demo dataset
      </button>
    </section>
  );
}

function WorkflowStep({ index, label, detail, state, icon }) {
  const stateStyles = {
    complete: {
      bubble: 'border-emerald-500 bg-emerald-500 text-white',
      line: 'bg-emerald-300',
      detail: 'text-emerald-700',
    },
    active: {
      bubble: 'border-orange-500 bg-orange-500 text-white',
      line: 'bg-orange-200',
      detail: 'text-orange-600',
    },
    pending: {
      bubble: 'border-slate-200 bg-white text-slate-400',
      line: 'bg-slate-200',
      detail: 'text-slate-400',
    },
  };
  const style = stateStyles[state];

  return (
    <div className="relative flex gap-3 pb-5 last:pb-0">
      <div className="relative flex w-8 shrink-0 justify-center">
        {index < 8 && (
          <span
            className={`absolute left-1/2 top-8 h-[calc(100%-1rem)] w-px -translate-x-1/2 ${style.line}`}
          />
        )}
        <span
          className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-black ${style.bubble}`}
        >
          {state === 'complete' ? (
            <Icon name="check" className="h-3.5 w-3.5" />
          ) : state === 'active' ? (
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          ) : (
            index
          )}
        </span>
      </div>

      <div className="min-w-0 pt-0.5">
        <div className="flex items-center gap-2">
          <Icon
            name={icon}
            className={`h-3.5 w-3.5 ${
              state === 'active'
                ? 'text-orange-500'
                : state === 'complete'
                  ? 'text-emerald-600'
                  : 'text-slate-400'
            }`}
          />
          <p className="text-xs font-bold text-slate-800">{label}</p>
        </div>
        <p className={`mt-1 text-[11px] leading-4 ${style.detail}`}>
          {detail}
        </p>
      </div>
    </div>
  );
}

function SnapshotTile({ icon, label, value, hint, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-50 text-slate-700 ring-slate-200',
    orange: 'bg-orange-50 text-orange-600 ring-orange-100',
    red: 'bg-red-50 text-red-600 ring-red-100',
    green: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ring-1 ${tones[tone]}`}
        >
          <Icon name={icon} className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-400">
            {label}
          </p>
          <p className="mt-0.5 text-xl font-black text-slate-950">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-[11px] leading-4 text-slate-500">{hint}</p>
    </div>
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
    incident => incident.intelligence?.urgency?.level === 'CRITICAL',
  ).length;

  const conflicts = incidents.reduce(
    (sum, incident) => sum + (incident.contradictions?.length ?? 0),
    0,
  );

  const priorityIncident =
    incidents.find(
      incident => incident.intelligence?.urgency?.level === 'CRITICAL',
    ) ?? incidents[0];

  const priorityConflictCount = priorityIncident?.contradictions?.length ?? 0;

  const seed = async () => {
    if (repository.seedDemoData) {
      await repository.seedDemoData();
    }
  };

  const flow = [
    {
      label: 'SOS Received',
      detail: 'Emergency report submitted',
      state: 'complete',
      icon: 'radio',
    },
    {
      label: 'Reports Correlated',
      detail: 'Sources grouped for review',
      state: 'complete',
      icon: 'link',
    },
    {
      label: 'Victim Status Conflict',
      detail: 'Conflicting evidence remains visible',
      state: 'complete',
      icon: 'conflict',
    },
    {
      label: 'Critical Priority',
      detail: 'Response urgency assessed',
      state: 'complete',
      icon: 'alert',
    },
    {
      label: 'Field Verification',
      detail: 'Decision-critical fact queued',
      state: 'active',
      icon: 'search',
    },
    {
      label: 'Rescue Team Confirmation',
      detail: 'Awaiting field confirmation',
      state: 'pending',
      icon: 'users',
    },
    {
      label: 'Dispatch Review',
      detail: 'Human approval remains required',
      state: 'pending',
      icon: 'review',
    },
    {
      label: 'Dispatch Approved',
      detail: 'Response action authorized',
      state: 'pending',
      icon: 'shield',
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAFBFC] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <aside className="hidden w-[235px] shrink-0 border-r border-slate-200 bg-white px-4 py-5 xl:flex xl:flex-col">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-200">
              <Icon name="siren" className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight">
                ResQ<span className="text-orange-500">Map</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Disaster Rescue System
              </div>
            </div>
          </div>

          <nav className="mt-8 space-y-1.5" aria-label="Rescue dashboard navigation">
            <SidebarItem
              icon="dashboard"
              label="Dashboard"
              sublabel="Operations overview"
              active
            />
            <SidebarItem
              icon="reports"
              label="Rescue Reports"
              sublabel="Incoming submissions"
            />
            <SidebarItem
              icon="alert"
              label="Active Incidents"
              sublabel="Live operations"
            />
            <SidebarItem
              icon="review"
              label="Field Verification"
              sublabel="Pending checks"
              to="/review"
            />
            <SidebarItem
              icon="map"
              label="Resource Map"
              sublabel="Operational map"
              to="/map"
            />
            <SidebarItem
              icon="database"
              label="Audit Trail"
              sublabel={`${audit.length} recorded events`}
            />
          </nav>

          <div className="mt-auto rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-emerald-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              System operational
            </div>
            <p className="mt-2 text-xs leading-5 text-emerald-700/80">
              Evidence repository and incident reconstruction services are
              available.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                    Rescue Operations Command Center
                  </h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-red-600">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                    Live
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                  Live monitoring • Chennai rescue reconstruction region
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="hidden items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500 md:flex">
                  <Icon name="clock" className="h-4 w-4" />
                  <span>Decision support active</span>
                </div>
                <Link
                  to="/map"
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600"
                >
                  <Icon name="map" className="h-4 w-4" />
                  Live map
                </Link>
                <Link
                  to="/review"
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-600"
                >
                  <Icon name="review" className="h-4 w-4" />
                  Open review queue
                </Link>
              </div>
            </div>
          </header>

          <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              <MetricCard
                label="Emergency reports"
                value={reports.length}
                hint="Multi-source rescue reports in the evidence repository."
                icon="reports"
                tone="blue"
              />
              <MetricCard
                label="Awaiting rescue verification"
                value={reviewCount}
                hint="Human LINK, CREATE, or HOLD decisions still required."
                icon="users"
                tone="orange"
              />
              <MetricCard
                label="Critical rescue incidents"
                value={critical}
                hint="Critical urgency incidents requiring operator attention."
                icon="alert"
                tone="red"
              />
              <MetricCard
                label="Conflicting field reports"
                value={conflicts}
                hint="Contradictory claims remain visible and source-linked."
                icon="conflict"
                tone="green"
              />
            </section>

            {reports.length === 0 && (
              <div className="mt-5">
                <EmptyState onSeed={seed} />
              </div>
            )}

            <section className="mt-5 grid gap-5 2xl:grid-cols-[minmax(0,1fr)_330px]">
              <div className="min-w-0 space-y-5">
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                  <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-orange-600">
                        <Icon name="activity" className="h-4 w-4" />
                        Active Rescue Operations
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Prioritized incidents reconstructed from incoming evidence.
                      </p>
                    </div>
                    <Link
                      to="/map"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
                    >
                      View all incidents
                      <Icon name="arrow" className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {incidents.length > 0 ? (
                    <div className="overflow-x-auto">
                      <div className="min-w-[840px]">
                        <div className="grid grid-cols-[145px_minmax(230px,1.6fr)_130px_120px_145px_48px] gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-3 text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">
                          <span>Incident ID</span>
                          <span>Incident / Location</span>
                          <span>Urgency</span>
                          <span>Conflicts</span>
                          <span>Workflow</span>
                          <span />
                        </div>

                        <div className="divide-y divide-slate-100">
                          {incidents.map(incident => {
                            const contradictionCount =
                              incident.contradictions?.length ?? 0;

                            return (
                              <Link
                                key={incident.id}
                                to={`/incidents/${incident.id}`}
                                className="group grid grid-cols-[145px_minmax(230px,1.6fr)_130px_120px_145px_48px] items-center gap-3 px-5 py-4 transition hover:bg-orange-50/40"
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`h-8 w-1 rounded-full ${
                                      incident.intelligence?.urgency?.level ===
                                      'CRITICAL'
                                        ? 'bg-red-500'
                                        : 'bg-orange-400'
                                    }`}
                                  />
                                  <span className="font-mono text-[11px] font-black uppercase text-slate-800">
                                    {incident.id}
                                  </span>
                                </div>

                                <div className="min-w-0">
                                  <h3 className="truncate text-sm font-bold text-slate-900 group-hover:text-orange-700">
                                    {incident.title}
                                  </h3>
                                  <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500">
                                    <Icon
                                      name="location"
                                      className="h-3.5 w-3.5 shrink-0"
                                    />
                                    {incident.locationLabel ||
                                      'Location unavailable'}
                                  </p>
                                </div>

                                <div>
                                  <StatusPill
                                    value={incident.intelligence?.urgency?.level}
                                  />
                                </div>

                                <div>
                                  {contradictionCount > 0 ? (
                                    <span className="inline-flex rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-red-600">
                                      {contradictionCount}{' '}
                                      {contradictionCount === 1
                                        ? 'conflict'
                                        : 'conflicts'}
                                    </span>
                                  ) : (
                                    <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                      Clear
                                    </span>
                                  )}
                                </div>

                                <div>
                                  <StatusPill
                                    value={
                                      incident.intelligence?.workflow?.workflow
                                    }
                                  />
                                </div>

                                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition group-hover:border-orange-200 group-hover:text-orange-600">
                                  <Icon name="chevron" className="h-4 w-4" />
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="px-6 py-14 text-center">
                      <p className="text-sm font-bold text-slate-700">
                        No active rescue operations
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Reconstructed incidents will appear here as reports are
                        processed.
                      </p>
                    </div>
                  )}
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <SnapshotTile
                    icon="alert"
                    label="Active incidents"
                    value={incidents.length}
                    hint="All reconstructed incident records currently visible."
                    tone="orange"
                  />
                  <SnapshotTile
                    icon="review"
                    label="Review queue"
                    value={reviewCount}
                    hint="Reports waiting on a human evidence-routing decision."
                    tone="slate"
                  />
                  <SnapshotTile
                    icon="conflict"
                    label="Contradictions"
                    value={conflicts}
                    hint="Open conflicting claims preserved for operators."
                    tone="red"
                  />
                  <SnapshotTile
                    icon="database"
                    label="Audit events"
                    value={audit.length}
                    hint="Recorded evidence and workflow audit events."
                    tone="green"
                  />
                </section>
              </div>

              <aside className="space-y-5">
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                  <div className="border-b border-slate-200 px-5 py-4">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-orange-600">
                      <Icon name="siren" className="h-4 w-4" />
                      Rescue Decision Center
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-orange-600">
                        Operator question
                      </p>
                      <p className="mt-2 text-lg font-black leading-6 text-slate-950">
                        If we can verify only one thing next, which fact matters
                        most?
                      </p>
                    </div>

                    <div className="mt-3 rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm shadow-red-200">
                          <Icon name="alert" className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-red-600">
                            Decision-critical fact
                          </p>
                          <p className="mt-2 text-lg font-black leading-6 text-slate-950">
                            Are people still trapped at this location?
                          </p>

                          {priorityIncident ? (
                            <>
                              <p className="mt-3 font-mono text-[11px] font-black uppercase text-orange-700">
                                {priorityIncident.id}
                              </p>
                              <p className="mt-1 text-sm font-bold text-slate-800">
                                {priorityIncident.title}
                              </p>
                              <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
                                <Icon
                                  name="location"
                                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                                />
                                {priorityIncident.locationLabel ||
                                  'Location unavailable'}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <StatusPill
                                  value={
                                    priorityIncident.intelligence?.urgency?.level
                                  }
                                />
                                <StatusPill
                                  value={
                                    priorityIncident.intelligence?.confidence
                                      ?.level
                                  }
                                />
                              </div>
                            </>
                          ) : (
                            <p className="mt-3 text-xs leading-5 text-slate-500">
                              A priority question will appear when an incident is
                              reconstructed.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Evidence conflicts
                        </p>
                        <p className="mt-1 text-lg font-black text-slate-900">
                          {priorityConflictCount}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Audit events
                        </p>
                        <p className="mt-1 text-lg font-black text-slate-900">
                          {audit.length}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/review"
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white shadow-sm shadow-orange-200 transition hover:bg-orange-600"
                    >
                      <Icon name="review" className="h-4 w-4" />
                      Review evidence
                      <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                  <div className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-orange-600">
                    <Icon name="link" className="h-4 w-4" />
                    Rescue Workflow
                  </div>
                  <div>
                    {flow.map((step, index) => (
                      <WorkflowStep
                        key={step.label}
                        index={index + 1}
                        label={step.label}
                        detail={step.detail}
                        state={step.state}
                        icon={step.icon}
                      />
                    ))}
                  </div>
                </section>
              </aside>
            </section>

            <footer className="mt-5 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-semibold">ResQMap Incident Intelligence Platform</span>
              <span className="flex items-center gap-2 font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Operational system available
              </span>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}