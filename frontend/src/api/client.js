const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8787/api').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers || {})
    }
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || `ResQMap API request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

export const api = {
  health: () => request('/health'),
  state: () => request('/state'),
  submitReport: (report) => request('/reports', { method: 'POST', body: JSON.stringify(report) }),
  reviewReport: (reportId, payload) => request(`/reviews/${encodeURIComponent(reportId)}`, { method: 'POST', body: JSON.stringify(payload) }),
  addEvidence: (incidentId, payload) => request(`/incidents/${encodeURIComponent(incidentId)}/evidence`, { method: 'POST', body: JSON.stringify(payload) }),
  recordDecision: (incidentId, payload) => request(`/incidents/${encodeURIComponent(incidentId)}/decisions`, { method: 'POST', body: JSON.stringify(payload) }),
  resetDemo: () => request('/demo/reset', { method: 'POST' }),
  seedDemoData: () => request('/admin/seed-demo', { method: 'POST' })
};
