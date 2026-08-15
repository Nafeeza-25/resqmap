import test from 'node:test';
import assert from 'node:assert/strict';
import { reconcileIncident } from '../../shared/domain/reconcileIncident.js';

const reports = [
  { id:'A', sourceId:'Reporter A', timestamp:'2026-08-15T14:05:00+05:30', text:'Five people trapped inside a flooded house on Gandhi Street, Velachery.', location:{lat:12.9818,lng:80.2180} },
  { id:'B', sourceId:'Reporter B', timestamp:'2026-08-15T14:09:00+05:30', text:'Two elderly people waiting on a rooftop near Gandhi Street pharmacy.', location:{lat:12.9821,lng:80.2183} },
  { id:'C', sourceId:'Reporter C', timestamp:'2026-08-15T14:12:00+05:30', text:'Family at Gandhi Street already rescued.', location:{lat:12.9817,lng:80.2182} },
  { id:'D', sourceId:'Reporter D', timestamp:'2026-08-15T14:14:00+05:30', text:'Water is rising. People are still shouting from the roof near Gandhi Street.', location:{lat:12.9819,lng:80.2181} }
];

test('reconstructs A-D into a source-linked incident with a rescue-status conflict', () => {
  const incident = reconcileIncident(reports);
  assert.deepEqual(incident.linkedReportIds, ['A','B','C','D']);
  assert.equal(incident.contradictions[0].field, 'rescueStatus');
  assert.ok(incident.agreements.some(a => /flood/i.test(a)));
  assert.ok(incident.missingEvidence.some(e => e.key === 'current_rescue_status'));
});

test('verified field evidence resolves the current rescue-status gap while preserving conflict history', () => {
  const field = {
    id:'F', sourceId:'Field Unit 3', sourceType:'field_unit', verified:true,
    timestamp:'2026-08-15T14:18:00+05:30',
    text:'Rescue has not been completed. Two elderly people remain on the rooftop near Gandhi Street.',
    location:{lat:12.9820,lng:80.2182}
  };
  const incident = reconcileIncident([...reports, field]);
  assert.equal(incident.currentClaims.rescueStatus, 'still_trapped');
  assert.equal(incident.missingEvidence.some(e => e.key === 'current_rescue_status'), false);
  assert.equal(incident.contradictions[0].resolved, true);
  assert.equal(incident.contradictions[0].resolution.reportId, 'F');
});
