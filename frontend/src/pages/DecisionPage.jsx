import { Link, useParams } from 'react-router-dom';
import DecisionCard from '../components/DecisionCard.jsx';
import StatusPill from '../components/StatusPill.jsx';
import { useIncidents } from '../hooks/useRepositoryData.js';
import { repository } from '../repository/index.js';

function Icon({ name, className = 'h-5 w-5' }) {
  const icons = {
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    alert: (
      <>
        <path d="M12 3 2.7 19a2 2 0 0 0 1.73 3h15.14a2 2 0 0 0 1.73-3L12 3Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
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
          className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Urgency & confidence
        </Link>

        <Link
          to={`/incidents/${incidentId}/decision`}
          className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
        >
          Decision & approval
        </Link>
      </div>
    </nav>
  );
}

function ContextCard({ label, children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-50 ring-slate-200',
    red: 'bg-red-50 ring-red-100',
    amber: 'bg-amber-50 ring-amber-100',
    blue: 'bg-blue-50 ring-blue-100',
  };

  return (
    <div
      className={`rounded-xl p-4 ring-1 ring-inset ${tones[tone]}`}
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500">
        {label}
      </span>

      <strong className="mt-2 block text-sm leading-5 text-slate-900">
        {children}
      </strong>
    </div>
  );
}

export default function DecisionPage() {
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

  const decide = (action, note) =>
    repository.applyWorkflowDecision({
      incidentId: incident.id,
      action,
      operator: 'Demo Operator',
      note,
    });

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <div className="mx-auto max-w-[1450px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">

        {/* Header */}
        <header className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700 ring-1 ring-blue-100">
                Stage B
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Incident workflow recommendation
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Decision Card & Human Approval
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              ResQMap recommends an auditable workflow action. It does not
              autonomously dispatch responders or replace the responsible
              human decision-maker.
            </p>
          </div>

          <StatusPill
            value={incident.intelligence?.workflow?.workflow}
          />
        </header>

        <IncidentNav incidentId={incident.id} />

        {/* Human authority banner */}
        <section className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 ring-1 ring-blue-200">
              <Icon name="shield" className="h-[18px] w-[18px]" />
            </div>

            <div>
              <p className="text-sm font-bold text-blue-950">
                Human authority remains final
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-800">
                The recommendation, supporting evidence, operator decision,
                and any override note remain traceable in the audit history.
              </p>
            </div>

            <div className="sm:ml-auto">
              <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-blue-800 ring-1 ring-blue-200">
                <Icon name="user" className="h-3.5 w-3.5" />
                Demo Operator
              </span>
            </div>
          </div>
        </section>

        {/* Context */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Decision context
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-950">
              Current incident picture
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ContextCard label="Urgency" tone="red">
              {incident.intelligence?.urgency?.level ?? '—'}
            </ContextCard>

            <ContextCard label="Evidence confidence" tone="amber">
              {incident.intelligence?.confidence?.level ?? '—'}
            </ContextCard>

            <ContextCard label="Critical contradiction" tone="slate">
              {incident.contradictions?.[0]?.label ?? 'None active'}
            </ContextCard>

            <ContextCard label="Top evidence gap" tone="blue">
              {incident.intelligence?.evidenceGaps?.[0]?.label ?? 'Resolved'}
            </ContextCard>
          </div>
        </section>

        {/* Decision card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 lg:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                <Icon name="shield" className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  Operator action
                </p>

                <h2 className="mt-0.5 text-base font-bold text-slate-950">
                  Review recommendation and record decision
                </h2>
              </div>
            </div>
          </div>

          <div className="p-5 lg:p-6">
            <DecisionCard
              incident={incident}
              onDecision={decide}
            />
          </div>
        </section>

        {/* Footer safety */}
        <footer className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-xs leading-5 text-slate-500">
          <Icon
            name="alert"
            className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
          />

          Workflow recommendations are decision-support outputs. Operational
          dispatch remains subject to authorized human approval and the
          organization’s response procedures.
        </footer>
      </div>
    </main>
  );
}