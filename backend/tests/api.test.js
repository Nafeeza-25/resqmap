import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { createDemoRepository } from '../src/repository/demoRepository.js';
import { createApiHandler } from '../src/app.js';

async function withServer(run) {
  const repository = createDemoRepository();
  const server = createServer(createApiHandler({ repository }));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const { port } = server.address();
  try {
    await run(`http://127.0.0.1:${port}`, repository);
  } finally {
    server.close();
    await once(server, 'close');
  }
}

test('GET /api/health and /api/state expose demo backend state', async () => {
  await withServer(async (base) => {
    const health = await fetch(`${base}/api/health`).then(r => r.json());
    assert.deepEqual(health, { ok: true, mode: 'demo', service: 'resqmap-api' });

    const state = await fetch(`${base}/api/state`).then(r => r.json());
    assert.equal(state.mode, 'demo');
    assert.ok(state.reports.length >= 5);
    assert.ok(state.incidents.some(item => item.id === 'INC-21'));
    assert.ok(state.audit.length >= 1);
  });
});

test('review endpoint records a HOLD decision without merging the report', async () => {
  await withServer(async (base) => {
    const create = await fetch(`${base}/api/reports`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: 'Flood water near Gandhi Street, location uncertain.', sourceId: 'Caller X', sourceType: 'call_note', location: { lat: 12.9819, lng: 80.2182 } })
    }).then(r => r.json());

    const response = await fetch(`${base}/api/reviews/${create.id}`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ decision: 'HOLD', incidentId: 'INC-21', operator: 'Test Operator' })
    });
    assert.equal(response.status, 200);

    const state = await fetch(`${base}/api/state`).then(r => r.json());
    const report = state.reports.find(item => item.id === create.id);
    assert.equal(report.humanDecision, 'HOLD');
    assert.equal(report.status, 'hold');
  });
});

test('verified field evidence changes canonical workflow to DISPATCH_FOR_APPROVAL', async () => {
  await withServer(async (base) => {
    const before = await fetch(`${base}/api/state`).then(r => r.json());
    assert.equal(before.incidents.find(i => i.id === 'INC-21').intelligence.workflow.workflow, 'RAPID_VERIFY');

    const response = await fetch(`${base}/api/incidents/INC-21/evidence`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sourceId: 'Field Unit 3', sourceType: 'field_unit', text: 'Rescue has not been completed. Two elderly people remain on the rooftop.', verified: true, location: { lat: 12.9819, lng: 80.2182 } })
    });
    assert.equal(response.status, 200);

    const after = await fetch(`${base}/api/state`).then(r => r.json());
    const incident = after.incidents.find(i => i.id === 'INC-21');
    assert.equal(incident.intelligence.workflow.workflow, 'DISPATCH_FOR_APPROVAL');
    assert.equal(incident.intelligence.confidence.level, 'HIGH');
  });
});

test('decision endpoint records human approval in incident and audit history', async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/api/incidents/INC-21/decisions`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'APPROVE', operator: 'Test Operator', note: 'Proceed after rapid verification.' })
    });
    assert.equal(response.status, 200);

    const state = await fetch(`${base}/api/state`).then(r => r.json());
    const incident = state.incidents.find(i => i.id === 'INC-21');
    assert.equal(incident.operatorDecision.action, 'APPROVE');
    assert.ok(state.audit.some(item => item.type === 'WORKFLOW_DECISION' && item.decision === 'APPROVE'));
  });
});

test('invalid review actions are rejected with 400', async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/api/reviews/A`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ decision: 'AUTO_MERGE', incidentId: 'INC-21', operator: 'Test Operator' })
    });
    assert.equal(response.status, 400);
    const payload = await response.json();
    assert.match(payload.error, /LINK, CREATE, or HOLD/);
  });
});
