import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoRepository } from '../../backend/src/repository/demoRepository.js';

test('demo backend exposes a 12-20 report pack and canonical RAPID_VERIFY incident', async () => {
  const repo = createDemoRepository();
  const { reports, incidents } = await repo.getState();
  assert.ok(reports.length >= 12 && reports.length <= 20);
  const canonical = incidents.find(i => i.id === 'INC-21');
  assert.ok(canonical);
  assert.equal(canonical.intelligence.workflow.workflow, 'RAPID_VERIFY');
});

test('adding verified field evidence raises canonical incident confidence and changes workflow', async () => {
  const repo = createDemoRepository();
  await repo.addEvidence({
    incidentId: 'INC-21',
    report: {
      sourceId: 'Field Unit 3', sourceType: 'field_unit', verified: true,
      timestamp: '2026-08-15T14:18:00+05:30',
      text: 'Rescue has not been completed. Two elderly people remain on the rooftop near Gandhi Street.',
      location: { lat: 12.9820, lng: 80.2182 }
    }
  });
  const { incidents, audit } = await repo.getState();
  const canonical = incidents.find(i => i.id === 'INC-21');
  assert.equal(canonical.intelligence.confidence.level, 'HIGH');
  assert.equal(canonical.intelligence.workflow.workflow, 'DISPATCH_FOR_APPROVAL');
  assert.ok(audit.some(event => event.type === 'FIELD_EVIDENCE_ADDED'));
});

test('human link decisions are appended to backend audit history', async () => {
  const repo = createDemoRepository();
  await repo.reviewReport({ reportId: 'G', decision: 'HOLD', incidentId: 'INC-21', operator: 'Demo Operator' });
  const { audit } = await repo.getState();
  const event = audit.at(-1);
  assert.equal(event.type, 'LINK_DECISION');
  assert.equal(event.decision, 'HOLD');
  assert.equal(event.operator, 'Demo Operator');
});

test('CREATE decision creates a separate source-linked incident', async () => {
  const repo = createDemoRepository();
  await repo.reviewReport({ reportId: 'M', decision: 'CREATE', incidentId: 'INC-21', operator: 'Demo Operator' });
  const { incidents, reports } = await repo.getState();
  const created = incidents.find(i => i.linkedReportIds?.includes('M'));
  assert.ok(created);
  assert.notEqual(created.id, 'INC-21');
  assert.equal(reports.find(r => r.id === 'M').incidentId, created.id);
});
