import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import IncidentMap from '../components/IncidentMap.jsx';
import StatusPill from '../components/StatusPill.jsx';
import { useIncidents } from '../hooks/useRepositoryData.js';

function Icon({ name, className = 'h-5 w-5' }) {
  const icons = {
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
        <path d="m10 10 4 4" />
      </>
    ),
    activity: <path d="M3 12h4l2-6 4 12 2-6h6" />,
    layers: (
      <>
        <path d="m12 2 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 17 9 5 9-5" />
      </>
    ),
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
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

export default function MapPage() {
  const { data: incidents } = useIncidents();
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);

  const selectedIncident =
    incidents.find(incident => incident.id === selectedIncidentId) ?? null;

  const stats = useMemo(() => {
    const critical = incidents.filter(
      incident =>
        incident.intelligence?.urgency?.level === 'CRITICAL',
    ).length;

    const contradictions = incidents.reduce(
      (sum, incident) =>
        sum + (incident.contradictions?.length ?? 0),
      0,
    );

    const needsVerification = incidents.filter(
      incident =>
        (incident.intelligence?.evidenceGaps?.length ?? 0) > 0,
    ).length;

    return {
      critical,
      contradictions,
      needsVerification,
    };
  }, [incidents]);

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <div className="mx-auto max-w-[1800px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">

        {/* Header */}
        <header className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                <Icon name="map" className="h-4 w-4" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Interactive disaster intelligence
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Live Disaster Map
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Reconstructed incidents are mapped by location while urgency,
              confidence, contradictions, and evidence gaps remain visible
              to the operator.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Active
              </span>
              <strong className="ml-2 text-sm text-slate-900">
                {incidents.length}
              </strong>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wide text-red-600">
                Critical
              </span>
              <strong className="ml-2 text-sm text-red-900">
                {stats.critical}
              </strong>
            </div>
          </div>
        </header>

        {/* Operational summary */}
        <section className="mb-4 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Icon name="location" className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                Located incidents
              </p>

              <strong className="text-sm text-slate-900">
                {
                  incidents.filter(
                    incident =>
                      incident.location?.lat &&
                      incident.location?.lng,
                  ).length
                }
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-700">
              <Icon name="conflict" className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                Visible contradictions
              </p>

              <strong className="text-sm text-slate-900">
                {stats.contradictions}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Icon name="activity" className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                Need verification
              </p>

              <strong className="text-sm text-slate-900">
                {stats.needsVerification}
              </strong>
            </div>
          </div>
        </section>

        {/* Map workspace */}
        <section className="grid min-h-[680px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:grid-cols-[minmax(0,1fr)_390px]">

          {/* Map */}
          <div className="relative min-h-[520px] overflow-hidden bg-slate-100 xl:min-h-[680px]">
            <IncidentMap
              incidents={incidents}
              selectedIncidentId={selectedIncidentId}
              onSelectIncident={setSelectedIncidentId}
              height="100%"
            />

            {/* Map heading overlay */}
            <div className="pointer-events-none absolute left-4 top-4 z-[500] hidden sm:block">
              <div className="rounded-xl border border-white/80 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Operational layer
                  </span>
                </div>

                <p className="mt-1 text-xs font-semibold text-slate-900">
                  Current reconstructed incidents
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-[500] rounded-xl border border-white/80 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Urgency
              </p>

              <div className="flex flex-wrap gap-3 text-[10px] font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                  Critical
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  High
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  Medium
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  Other
                </span>
              </div>
            </div>
          </div>

          {/* Incident rail */}
          <aside className="flex max-h-[680px] flex-col border-t border-slate-200 bg-white xl:border-l xl:border-t-0">
            <div className="border-b border-slate-200 px-5 py-5">
              <div className="flex items-center gap-2">
                <Icon
                  name="layers"
                  className="h-4 w-4 text-slate-400"
                />

                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Incident layer
                </span>
              </div>

              <h2 className="mt-1 text-lg font-bold text-slate-950">
                Operator attention
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Select an incident to focus its map position and review
                current intelligence.
              </p>
            </div>

            {/* Selected incident */}
            {selectedIncident && (
              <div className="border-b border-slate-200 bg-[#102A43] p-5 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-cyan-200">
                      {selectedIncident.id}
                    </span>

                    <h3 className="mt-1 text-base font-bold leading-5">
                      {selectedIncident.title}
                    </h3>

                    <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-300">
                      <Icon
                        name="location"
                        className="h-3.5 w-3.5"
                      />

                      {selectedIncident.locationLabel}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusPill
                    value={
                      selectedIncident.intelligence?.urgency?.level
                    }
                  />

                  <StatusPill
                    value={
                      selectedIncident.intelligence?.confidence?.level
                    }
                  />
                </div>

                {(selectedIncident.contradictions?.length ?? 0) > 0 && (
                  <div className="mt-4 rounded-xl border border-red-300/20 bg-red-300/10 px-3 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-red-200">
                      Conflicting evidence
                    </p>

                    <p className="mt-1 text-xs text-slate-200">
                      {selectedIncident.contradictions.length}{' '}
                      {selectedIncident.contradictions.length === 1
                        ? 'contradiction requires'
                        : 'contradictions require'}{' '}
                      operator attention.
                    </p>
                  </div>
                )}

                <Link
                  to={`/incidents/${selectedIncident.id}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  Open incident intelligence
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
            )}

            {/* Incident list */}
            <div className="flex-1 overflow-y-auto">
              {incidents.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {incidents.map(incident => {
                    const selected =
                      selectedIncidentId === incident.id;

                    const contradictionCount =
                      incident.contradictions?.length ?? 0;

                    return (
                      <button
                        key={incident.id}
                        type="button"
                        onClick={() =>
                          setSelectedIncidentId(incident.id)
                        }
                        className={`w-full px-5 py-4 text-left transition ${
                          selected
                            ? 'bg-blue-50'
                            : 'bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                              incident.intelligence?.urgency?.level ===
                              'CRITICAL'
                                ? 'bg-red-600'
                                : incident.intelligence?.urgency?.level ===
                                    'HIGH'
                                  ? 'bg-orange-500'
                                  : incident.intelligence?.urgency?.level ===
                                      'MEDIUM'
                                    ? 'bg-amber-400'
                                    : 'bg-blue-500'
                            }`}
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[10px] font-bold text-blue-700">
                                {incident.id}
                              </span>

                              {contradictionCount > 0 && (
                                <span className="rounded-md bg-red-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-red-700 ring-1 ring-red-100">
                                  {contradictionCount}{' '}
                                  {contradictionCount === 1
                                    ? 'conflict'
                                    : 'conflicts'}
                                </span>
                              )}
                            </div>

                            <strong className="mt-1 block truncate text-sm text-slate-900">
                              {incident.title}
                            </strong>

                            <span className="mt-1 block truncate text-xs text-slate-500">
                              {incident.locationLabel}
                            </span>

                            <div className="mt-3 flex flex-wrap gap-1.5">
                              <StatusPill
                                value={
                                  incident.intelligence?.urgency
                                    ?.level
                                }
                              />

                              <StatusPill
                                value={
                                  incident.intelligence?.workflow
                                    ?.workflow
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <Icon
                    name="map"
                    className="mx-auto h-7 w-7 text-slate-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No mapped incidents
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Reconstructed incidents will appear here when location
                    evidence is available.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </section>

        {/* Context note */}
        <section className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
          <Icon
            name="info"
            className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
          />

          <p className="text-xs leading-5 text-slate-500">
            <strong className="text-slate-700">
              Historical context layer:
            </strong>{' '}
            demonstration-only context markers are shown without fabricated
            casualty values. Production statistics should originate from
            verified external datasets.
          </p>
        </section>
      </div>
    </main>
  );
}