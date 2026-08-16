import { useMemo, useState } from 'react';
import ReportCard from '../components/ReportCard.jsx';
import { useReports } from '../hooks/useRepositoryData.js';
import { repository } from '../repository/index.js';
import PageHeader from '../components/PageHeader.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { Plus, Search, Filter } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { Link } from 'react-router-dom';

export default function IncomingReportsPage() {
  const { data: reports, error, loading, retry } = useReports();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  // Quick ingestion form state
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filteredReports = useMemo(() => {
    return [...reports]
      .filter(r => {
        if (filter === 'Needs review') return r.status === 'review';
        if (filter === 'Linked') return r.status === 'linked';
        if (filter === 'Held') return r.status === 'hold';
        return true;
      })
      .filter(r => {
        if (!search) return true;
        return (r.text || '').toLowerCase().includes(search.toLowerCase());
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [reports, filter, search]);

  const submit = async event => {
    event.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await repository.submitReport({
        sourceId: 'Live Demo Reporter',
        sourceType: 'citizen_form',
        channel: 'Citizen form',
        language: 'English',
        text: text.trim(),
        location: { lat: 12.9819, lng: 80.2182 },
        timestamp: new Date().toISOString(),
      });
      setText('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader 
        title="Incoming Reports" 
        subtitle="Read every source clearly, then send uncertain reports to verification."
        stage="report"
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_350px]">
        
        {/* Main reports list */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Needs review', 'Linked', 'Held'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${filter === f ? 'bg-rq-text text-rq-bg' : 'bg-rq-surface border border-rq-border text-rq-text-secondary hover:text-rq-text hover:border-rq-border-soft'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rq-text-muted" />
              <input
                type="text"
                placeholder="Search reports..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-full border border-rq-border bg-rq-surface py-2 pl-9 pr-4 text-sm text-rq-text outline-none placeholder:text-rq-text-muted hover:border-rq-border-soft focus:border-rq-focus focus:ring-2 focus:ring-rq-focus/20"
              />
            </div>
          </div>

          {loading ? (
            <LoadingState label="Receiving incoming reports" />
          ) : error ? (
            <ErrorState title="Incoming reports unavailable" error={error} onRetry={retry} />
          ) : filteredReports.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredReports.map(report => (
                <ReportCard
                  key={report.id}
                  report={report}
                  footer={
                    report.status === 'review' ? (
                      <Link to="/review" className="inline-flex w-full items-center justify-center rounded-lg border border-rq-border bg-rq-surface-raised px-4 py-2 text-sm font-semibold text-rq-text transition hover:bg-rq-surface-hover">
                        Review report
                      </Link>
                    ) : null
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No reports found" 
              message={reports.length === 0 ? "No reports have been received yet." : "No reports match your current filters."}
            />
          )}
        </div>

        {/* Quick Ingestion Form */}
        <div>
          <div className="rounded-2xl border border-rq-border bg-rq-surface p-5 shadow-sm sticky top-24">
            <SectionHeader title="Add a live report" />
            <form onSubmit={submit} className="mt-4 flex flex-col gap-4">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Paste or type a disaster report here..."
                rows={5}
                className="w-full resize-none rounded-xl border border-rq-border bg-rq-surface-raised p-3 text-sm text-rq-text outline-none placeholder:text-rq-text-muted focus:border-rq-focus focus:ring-2 focus:ring-rq-focus/20"
              />
              <button
                type="submit"
                disabled={submitting || !text.trim()}
                className="rescue-primary-action"
              >
                <Plus aria-hidden="true" size={17} /> {submitting ? 'Adding report...' : 'Add report'}
              </button>
              <p className="text-center text-xs text-rq-text-muted">
                Demo location: Gandhi Street (12.9819, 80.2182)
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
