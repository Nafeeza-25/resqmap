import { api } from '../api/client.js';

export function createApiRepository() {
  let state = { mode: 'loading', reports: [], incidents: [], audit: [] };
  let timer = null;
  let subscriberCount = 0;
  const listeners = { reports: new Set(), incidents: new Set(), audit: new Set(), errors: new Set() };

  const emit = () => {
    for (const listener of listeners.reports) listener(state.reports ?? []);
    for (const listener of listeners.incidents) listener(state.incidents ?? []);
    for (const listener of listeners.audit) listener(state.audit ?? []);
  };

  const emitError = (error) => {
    for (const listener of listeners.errors) listener(error);
  };

  const refresh = async () => {
    try {
      state = await api.state();
      emit();
      return state;
    } catch (error) {
      emitError(error);
      throw error;
    }
  };

  const ensurePolling = () => {
    if (!timer) timer = setInterval(() => refresh().catch(() => {}), 4000);
  };

  const subscribe = (kind, callback, onError) => {
    listeners[kind].add(callback);
    if (onError) listeners.errors.add(onError);
    subscriberCount += 1;
    callback(state[kind] ?? []);
    refresh().catch(() => {});
    ensurePolling();

    return () => {
      listeners[kind].delete(callback);
      if (onError) listeners.errors.delete(onError);
      subscriberCount = Math.max(0, subscriberCount - 1);
      if (!subscriberCount && timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  };

  const mutate = async (operation) => {
    const result = await operation();
    await refresh();
    return result;
  };

  return {
    mode: 'api',
    get backendMode() { return state.mode; },
    subscribeReports(callback, onError) { return subscribe('reports', callback, onError); },
    subscribeIncidents(callback, onError) { return subscribe('incidents', callback, onError); },
    subscribeAudit(callback, onError) { return subscribe('audit', callback, onError); },
    submitReport(input) { return mutate(() => api.submitReport(input)); },
    applyLinkDecision({ reportId, ...payload }) { return mutate(() => api.reviewReport(reportId, payload)); },
    addFieldEvidence({ incidentId, report }) { return mutate(() => api.addEvidence(incidentId, report)); },
    applyWorkflowDecision({ incidentId, ...payload }) { return mutate(() => api.recordDecision(incidentId, payload)); },
    resetDemo() { return mutate(() => api.resetDemo()); },
    seedDemoData() { return mutate(() => api.seedDemoData()); },
    refresh
  };
}
