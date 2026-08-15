import { Link, useParams } from 'react-router-dom';
import ConflictPanel from '../components/ConflictPanel.jsx';
import ReportCard from '../components/ReportCard.jsx';
import StatusPill from '../components/StatusPill.jsx';
import { useIncidents, useReports } from '../hooks/useRepositoryData.js';
import { repository } from '../repository/index.js';
import { CANONICAL_FIELD_EVIDENCE } from '../data/demoEvidence.js';

function Icon({ name, className = 'h-5 w-5' }) {
  const icons = {
    map: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    alert: (
      <>
        <path d="M12 3 2.7 19a2 2 0 0 0 1.73 3h15.14a2 2 0 0 0 1.73-3L12 3Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    evidence: (
      <>
        <path d="M6 3h12v18H6z" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
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

function Metric({ label, value, description, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    red: 'bg-red-50 text-red-700 ring-red-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span
        className={`inline-flex rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ring-1 ring-inset ${tones[tone]}`}
      >
        {label}
      </span>

      <p className="mt-4 text-xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </article>
  );
}

function IncidentNav({ incidentId, active }) {
  const tabs = [
    {
      key: 'incident',
      label: 'Incident & conflict',
      to: `/incidents/${incidentId}`,
    },
    {
      key: 'intelligence',
      label: 'Urgency & confidence',
      to: `/incidents/${incidentId}/intelligence`,
    },
    {
      key: 'decision',
      label: 'Decision & approval',
      to: `/incidents/${incidentId}/decision`,
    },
  ];

  return (
    <nav className="mb-6 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      <div className="flex min-w-max gap-1">
        {tabs.map(tab => (
          <Link
            key={tab.key}
            to={tab.to}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              active === tab.key
                ? 'bg-slate-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function IncidentDetailPage() {
  const { incidentId } = useParams();
  const { data: incidents } = useIncidents();
  const { data: reports } = useReports();

  const incident = incidents.find(i => i.id === incidentId);

  if (!incident) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <Icon name="search" />
          </div>

          <h1 className="mt-4 text-lg font-bold text-slate-950">
            Incident not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The selected incident is not available in the current repository.
          </p>

          <Link
            to="/"
            className="mt-5 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Return to dashboard
          </Link>
        </div>
      </main>
    );
  }

  const linked = reports.filter(
    report =>
      incident.linkedReportIds?.includes(report.id) ||
      report.incidentId === incident.id,
  );

  const fieldAdded = linked.some(
    report => report.sourceType === 'field_unit' || report.verified,
  );

  const topGap = incident.intelligence?.evidenceGaps?.[0];

  const addFieldEvidence = () =>
    repository.addFieldEvidence({
      incidentId: incident.id,
      report: CANONICAL_FIELD_EVIDENCE,
    });

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">

        {/* Header */}
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-blue-50 px-2 py-1 font-mono text-[10px] font-bold text-blue-700 ring-1 ring-blue-100">
                  {incident.id}
                </span>

                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Source-linked incident
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                {incident.title}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <Icon name="map" className="h-4 w-4" />
                {incident.locationLabel}
              </div>
            </div>

            <StatusPill value={incident.status ?? 'active'} />
          </div>
        </header>

        {/* Metrics */}
        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <Metric
            label="Urgency"
            value={incident.intelligence?.urgency?.level ?? '—'}
            description="Danger if the currently reported situation is true."
            tone="red"
          />

          <Metric
            label="Evidence confidence"
            value={incident.intelligence?.confidence?.level ?? '—'}
            description="Support for the current reconstructed incident picture."
            tone="amber"
          />

          <Metric
            label="Decision-critical evidence"
            value={topGap?.label ?? 'Resolved'}
            description={topGap?.question ?? 'No top unresolved evidence gap.'}
          />
        </section>

        <IncidentNav incidentId={incident.id} active="incident" />

        {/* Agreement */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 lg:px-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Reconstructed incident
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-950">
                Evidence agreement
              </h2>
            </div>

            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {linked.length} linked sources
            </span>
          </div>

          <div className="p-5 lg:p-6">
            {(incident.agreements ?? []).length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {(incident.agreements ?? []).map(item => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4"
                  >
                    <Icon
                      name="check"
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
                    />

                    <p className="text-sm leading-6 text-slate-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No shared claims have been established yet.
              </p>
            )}
          </div>
        </section>

        {/* Conflicts */}
        <section className="mb-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-700 ring-1 ring-red-100">
              <Icon name="alert" className="h-[17px] w-[17px]" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-600">
                Critical contradiction
              </p>

              <h2 className="text-lg font-bold text-slate-950">
                Conflicting source claims
              </h2>
            </div>
          </div>

          <ConflictPanel conflicts={incident.contradictions ?? []} />
        </section>

        {/* Missing evidence */}
        <section className="mb-6 grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_0.8fr]">
          <div className="p-5 lg:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Missing evidence
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-950">
              What remains unknown?
            </h2>

            <div className="mt-5 space-y-3">
              {(incident.missingEvidence ?? []).map((gap, index) => (
                <article
                  key={gap.key}
                  className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <span className="font-mono text-xs font-bold text-blue-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div>
                    <strong className="text-sm text-slate-900">
                      {gap.label}
                    </strong>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {gap.question}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="bg-[#102A43] p-5 text-white lg:p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-cyan-200 ring-1 ring-white/10">
              <Icon name="shield" className="h-[18px] w-[18px]" />
            </div>

            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">
              Verification transition
            </p>

            <h3 className="mt-2 text-xl font-bold">
              {fieldAdded
                ? 'Field evidence received'
                : 'Verify the highest-impact fact'}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {fieldAdded
                ? 'Field Unit 3 confirms rescue is not complete and two elderly people remain. Confidence can increase while the historical conflict remains auditable.'
                : 'Inject the canonical field confirmation to demonstrate how new verified evidence changes the current recommendation.'}
            </p>

            {!fieldAdded && incident.id === 'INC-21' && (
              <button
                type="button"
                onClick={addFieldEvidence}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                <Icon name="plus" className="h-4 w-4" />
                Add verified field evidence
              </button>
            )}

            {fieldAdded && (
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs font-semibold text-emerald-100">
                <Icon name="check" className="h-4 w-4" />
                Verification evidence recorded
              </div>
            )}
          </aside>
        </section>

        {/* Reports */}
        <section className="mb-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Original evidence
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-950">
                Linked reports
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Icon name="evidence" className="h-4 w-4" />
              Source text preserved
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {linked.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </section>

        {/* Decision preview */}
        <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between lg:p-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Human decision
            </p>

            <strong className="mt-1 block text-lg text-slate-950">
              {(incident.intelligence?.workflow?.workflow ?? 'MONITOR').replaceAll(
                '_',
                ' ',
              )}
            </strong>

            <p className="mt-1 text-sm text-slate-500">
              Review the recommendation and record the operator’s approval or override.
            </p>
          </div>

          <Link
            to={`/incidents/${incident.id}/decision`}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Open decision card
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}