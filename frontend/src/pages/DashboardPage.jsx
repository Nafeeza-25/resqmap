import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidents, useReports } from '../hooks/useRepositoryData.js';
import { repository } from '../repository/index.js';
import PageHeader from '../components/PageHeader.jsx';
import IncidentPriorityCard from '../components/IncidentPriorityCard.jsx';
import IncidentMap from '../components/IncidentMap.jsx';
import EmptyState from '../components/EmptyState.jsx';
import DemoGuide from '../components/DemoGuide.jsx';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { Siren } from 'lucide-react';

export default function DashboardPage() {
  const { data: incidents, error: incidentsError, loading: incidentsLoading, retry: retryIncidents } = useIncidents();
  const { data: reports, error: reportsError, loading: reportsLoading, retry: retryReports } = useReports();
  const [restarting, setRestarting] = useState(false);
  const [demoFeedback, setDemoFeedback] = useState('');
  const navigate = useNavigate();
  const error = incidentsError || reportsError;
  const loading = incidentsLoading || reportsLoading;

  const activeIncidents = incidents.length;
  const needsVerification = incidents.filter(
    i => i.intelligence?.workflow?.workflow === 'RAPID_VERIFY'
  ).length;
  const decisionsPending = incidents.filter(
    i => i.intelligence?.workflow?.workflow === 'DISPATCH_FOR_APPROVAL'
  ).length;

  const seed = async () => {
    if (repository.seedDemoData) {
      await repository.seedDemoData();
    }
  };

  const retry = () => Promise.all([retryIncidents(), retryReports()]);

  const restartDemo = async () => {
    setRestarting(true);
    setDemoFeedback('');
    try {
      await repository.resetDemo();
      setDemoFeedback('Demo restored. Start with the verification queue.');
    } catch (restartError) {
      setDemoFeedback(`Restart failed: ${restartError.message}`);
    } finally {
      setRestarting(false);
    }
  };

  const enhancedIncidents = incidents.map(incident => ({
    ...incident,
    hasConflicts: (incident.contradictions?.length ?? 0) > 0,
    pendingQuestions: incident.intelligence?.gaps?.map(g => g.question) ?? []
  }));

  const sortedIncidents = [...enhancedIncidents].sort((a, b) => {
    const val = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    const scoreA = val[a.intelligence?.urgency?.level] || 0;
    const scoreB = val[b.intelligence?.urgency?.level] || 0;
    return scoreB - scoreA;
  });

  return (
    <div className="command-page">
      <PageHeader 
        title="Command center" 
        subtitle="Triage live evidence, verify what matters, and move the response forward."
        stage="verify"
      />

      <DemoGuide onRestart={restartDemo} restarting={restarting} feedback={demoFeedback} />

      <section className="operation-strip" aria-label="Live operation status">
        <div className="operation-strip__status"><span className="operation-strip__pulse" /><div><small>Live operation</small><strong>Operational</strong></div></div>
        <div><small>Last sync</small><strong>Just now</strong></div>
        <div><small>Active incidents</small><strong>{activeIncidents}</strong></div>
        <div><small>Response posture</small><strong>{needsVerification > 0 ? 'Verify evidence' : 'Monitor network'}</strong></div>
      </section>

      <section className="command-metrics" aria-label="Incident summary">
        <div><small>Active incidents</small><strong>{activeIncidents}</strong><span>Open response situations</span></div>
        <div className="command-metrics__attention"><small>Needs verification</small><strong>{needsVerification}</strong><span>Conflicting or incomplete evidence</span></div>
        <div className="command-metrics__verified"><small>Decisions pending</small><strong>{decisionsPending}</strong><span>Ready for approval</span></div>
      </section>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : incidents.length === 0 ? (
        <EmptyState 
          title="No active incidents"
          message="Load the demo scenario to explore how ResQMap handles conflicting disaster reports."
          action={
            <button
              onClick={seed}
              className="rescue-primary-action"
            >
              <Siren aria-hidden="true" size={17} /> Load demo scenario
            </button>
          }
        />
      ) : (
        <div className="command-workspace">
          <div className="command-map">
            <div className="command-map__label"><span>Live incident field</span><small>Map markers update as reports are assessed</small></div>
            <IncidentMap incidents={incidents} height="100%" />
          </div>
          <aside className="response-queue" aria-label="Response queue">
            <div className="response-queue__heading"><div><span>Response queue</span><h2>Prioritize next</h2></div><small>{sortedIncidents.length} open</small></div>
            <div className="response-queue__list">
              {sortedIncidents.map(incident => (
                <IncidentPriorityCard 
                  key={incident.id} 
                  incident={incident} 
                  onClick={() => navigate(`/incidents/${incident.id}`)}
                />
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
