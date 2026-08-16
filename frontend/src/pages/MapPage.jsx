import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import IncidentMap from '../components/IncidentMap.jsx';
import StatusPill from '../components/StatusPill.jsx';
import { useIncidents } from '../hooks/useRepositoryData.js';
import { AlertTriangle } from 'lucide-react';

export default function MapPage() {
  const { data: incidents } = useIncidents();
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [filter, setFilter] = useState('All');

  const stats = useMemo(() => {
    const critical = incidents.filter(i => i.intelligence?.urgency?.level === 'CRITICAL').length;
    const high = incidents.filter(i => i.intelligence?.urgency?.level === 'HIGH').length;
    const needsVerification = incidents.filter(i => (i.intelligence?.evidenceGaps?.length ?? 0) > 0).length;
    return { critical, high, needsVerification };
  }, [incidents]);

  const filteredIncidents = useMemo(() => {
    switch (filter) {
      case 'Critical': return incidents.filter(i => i.intelligence?.urgency?.level === 'CRITICAL');
      case 'High': return incidents.filter(i => i.intelligence?.urgency?.level === 'HIGH');
      case 'Needs verification': return incidents.filter(i => (i.intelligence?.evidenceGaps?.length ?? 0) > 0);
      default: return incidents;
    }
  }, [incidents, filter]);

  const selectedIncident = filteredIncidents.find(i => i.id === selectedIncidentId) ?? null;

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-rq-bg">
      <IncidentMap
        incidents={filteredIncidents}
        selectedIncidentId={selectedIncidentId}
        onSelectIncident={setSelectedIncidentId}
        height="100%"
      />

      {/* Floating top-left control */}
      <div className="absolute left-4 top-4 z-[500] flex flex-col gap-4 sm:left-6 sm:top-6">
         <div className="rounded-2xl border border-rq-border bg-rq-surface/95 p-4 shadow-lg backdrop-blur-md">
            <h1 className="text-xl font-bold text-rq-text">Disaster Map</h1>
            <p className="mt-1 text-sm text-rq-text-secondary">{incidents.length} active incidents</p>
         </div>

         <div className="flex flex-col gap-1 rounded-2xl border border-rq-border bg-rq-surface/95 p-2 shadow-lg backdrop-blur-md w-[220px]">
            {['All', 'Critical', 'High', 'Needs verification'].map(f => (
               <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${filter === f ? 'bg-rq-surface-hover text-rq-text' : 'text-rq-text-secondary hover:bg-rq-surface-hover/50 hover:text-rq-text'}`}
               >
                  {f}
                  {f === 'Critical' && <span className="rounded bg-rq-red/20 px-1.5 py-0.5 text-[10px] text-rq-red">{stats.critical}</span>}
                  {f === 'High' && <span className="rounded bg-rq-orange/20 px-1.5 py-0.5 text-[10px] text-rq-orange">{stats.high}</span>}
                  {f === 'Needs verification' && <span className="rounded bg-rq-warning/20 px-1.5 py-0.5 text-[10px] text-rq-warning">{stats.needsVerification}</span>}
               </button>
            ))}
         </div>
      </div>

      {/* Selected incident preview */}
      {selectedIncident && (
        <div className="absolute bottom-4 left-4 z-[500] w-[calc(100%-32px)] sm:w-[350px] sm:bottom-6 sm:left-6 rounded-2xl border border-rq-border bg-rq-surface/95 p-5 shadow-lg backdrop-blur-md">
           <h3 className="text-lg font-bold text-rq-text">{selectedIncident.title}</h3>
           <div className="mt-3 flex flex-wrap gap-2">
              <StatusPill value={selectedIncident.intelligence?.urgency?.level} />
              {(selectedIncident.contradictions?.length ?? 0) > 0 && (
                 <span className="flex items-center gap-1 rounded-md bg-rq-red-soft px-2 py-1 text-xs font-bold text-rq-red">
                    <AlertTriangle className="h-3 w-3" /> Reports disagree
                 </span>
              )}
           </div>
           <Link
             to={`/incidents/${selectedIncident.id}`}
             className="mt-5 block w-full rounded-xl bg-rq-text px-4 py-2.5 text-center text-sm font-bold text-rq-bg shadow-sm transition hover:bg-rq-text-secondary"
           >
             Review incident
           </Link>
        </div>
      )}
    </div>
  );
}