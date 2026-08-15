import { useMemo, useState } from 'react';
import ReportCard from '../components/ReportCard.jsx';
import { useReports } from '../hooks/useRepositoryData.js';
import { repository } from '../repository/index.js';

function Icon({ name, className = 'h-5 w-5' }) {
  const icons = {
    inbox: (
      <>
        <path d="M4 4h16v16H4z" />
        <path d="M4 14h5l2 3h2l2-3h5" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M5 20h14" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    language: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a14 14 0 0 1 0 18" />
        <path d="M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    channel: (
      <>
        <path d="M4 5h16v11H7l-3 3V5Z" />
        <path d="M8 9h8M8 12h5" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
    activity: <path d="M3 12h4l2-6 4 12 2-6h6" />,
    error: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16h.01" />
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

export default function IncomingReportsPage() {
  const { data: reports, error } = useReports();

  const [text, setText] = useState('');
  const [channel, setChannel] = useState('Citizen form');
  const [language, setLanguage] = useState('English');
  const [submitting, setSubmitting] = useState(false);

  const sortedReports = useMemo(
    () =>
      [...reports].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      ),
    [reports],
  );

  const submit = async event => {
    event.preventDefault();

    if (!text.trim()) return;

    setSubmitting(true);

    try {
      await repository.submitReport({
        sourceId: 'Live Demo Reporter',
        sourceType: 'citizen_form',
        channel,
        language,
        text: text.trim(),
        location: {
          lat: 12.9819,
          lng: 80.2182,
        },
        timestamp: new Date().toISOString(),
      });

      setText('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">

        {/* Page header */}
        <header className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center rounded-md bg-blue-50 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700 ring-1 ring-inset ring-blue-100">
                Stage 01
              </span>

              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Evidence ingestion
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Incoming Reports
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Preserve original source evidence before extraction,
              reconciliation, or incident matching. ResQMap keeps the
              submitted report available throughout the complete decision
              trail.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-100">
              <Icon name="inbox" className="h-[18px] w-[18px]" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Evidence received
              </p>

              <p className="mt-0.5 text-sm font-bold text-slate-900">
                {reports.length}{' '}
                <span className="font-medium text-slate-500">
                  {reports.length === 1 ? 'report' : 'reports'}
                </span>
              </p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.6fr)]">

          {/* Ingestion form */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-6">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  <Icon name="upload" className="h-3.5 w-3.5" />
                  Multi-source ingestion
                </div>

                <h2 className="mt-1 text-lg font-bold text-slate-950">
                  Add a live report
                </h2>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Original evidence preserved
              </div>
            </div>

            <form
              onSubmit={submit}
              className="p-5 lg:p-6"
            >
              {/* Metadata selectors */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Icon
                      name="channel"
                      className="h-3.5 w-3.5 text-slate-400"
                    />
                    Report channel
                  </span>

                  <div className="relative">
                    <select
                      value={channel}
                      onChange={event => setChannel(event.target.value)}
                      className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-10 text-sm font-medium text-slate-800 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option>Citizen form</option>
                      <option>Call note</option>
                      <option>Field note</option>
                    </select>

                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Icon
                      name="language"
                      className="h-3.5 w-3.5 text-slate-400"
                    />
                    Source language
                  </span>

                  <div className="relative">
                    <select
                      value={language}
                      onChange={event => setLanguage(event.target.value)}
                      className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-10 text-sm font-medium text-slate-800 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option>English</option>
                      <option>Tamil</option>
                    </select>

                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </label>
              </div>

              {/* Report input */}
              <label className="mt-5 block">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-slate-700">
                    Original report text
                  </span>

                  <span className="text-[11px] font-medium text-slate-400">
                    {text.length} characters
                  </span>
                </div>

                <textarea
                  value={text}
                  onChange={event => setText(event.target.value)}
                  placeholder="Paste or type the original disaster report here…"
                  rows={8}
                  className="min-h-[190px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </label>

              {/* Form footer */}
              <div className="mt-4 flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex max-w-xl gap-3">
                  <Icon
                    name="location"
                    className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                  />

                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Demo location
                    </p>

                    <p className="mt-0.5 text-[11px] leading-5 text-slate-500">
                      Live submissions are assigned to the Gandhi Street
                      demo area at 12.9819, 80.2182.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !text.trim()}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Ingesting…
                    </>
                  ) : (
                    <>
                      <Icon name="upload" className="h-4 w-4" />
                      Ingest report
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Evidence principles */}
          <aside className="rounded-2xl border border-slate-200 bg-[#102A43] p-6 text-white shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
              <Icon
                name="shield"
                className="h-[18px] w-[18px] text-cyan-200"
              />
            </div>

            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">
              Evidence integrity
            </p>

            <h2 className="mt-2 text-xl font-bold leading-snug">
              Preserve first. Interpret second.
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Incoming evidence remains available in its original form while
              ResQMap creates structured claims and evaluates whether it
              belongs to an existing incident.
            </p>

            <div className="mt-6 space-y-3">
              {[
                {
                  number: '01',
                  title: 'Source preserved',
                  text: 'Original wording remains attached to the evidence record.',
                },
                {
                  number: '02',
                  title: 'Structured separately',
                  text: 'Extraction never silently replaces submitted text.',
                },
                {
                  number: '03',
                  title: 'Human-auditable',
                  text: 'Later decisions can always be traced back to source evidence.',
                },
              ].map(item => (
                <div
                  key={item.number}
                  className="rounded-xl border border-white/10 bg-white/[0.06] p-4"
                >
                  <div className="flex gap-3">
                    <span className="font-mono text-[10px] font-bold text-cyan-200">
                      {item.number}
                    </span>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-red-800"
          >
            <Icon
              name="error"
              className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
            />

            <div>
              <p className="text-sm font-semibold">
                Unable to load incoming reports
              </p>

              <p className="mt-0.5 text-xs leading-5 text-red-700">
                {error.message}
              </p>
            </div>
          </div>
        )}

        {/* Reports */}
        <section className="mt-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                <Icon name="activity" className="h-3.5 w-3.5" />
                Evidence stream
              </div>

              <h2 className="mt-1 text-lg font-bold text-slate-950">
                Latest submissions
              </h2>
            </div>

            {reports.length > 0 && (
              <p className="text-xs text-slate-500">
                Showing newest evidence first
              </p>
            )}
          </div>

          {sortedReports.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {sortedReports.map(report => (
                <ReportCard
                  key={report.id}
                  report={report}
                />
              ))}
            </div>
          ) : (
            !error && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <Icon name="inbox" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  No reports received yet
                </h3>

                <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-slate-500">
                  Add a report above or seed your demonstration dataset.
                  Incoming evidence will appear here immediately.
                </p>
              </div>
            )
          )}
        </section>
      </div>
    </main>
  );
}