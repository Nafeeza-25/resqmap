import test from 'node:test';
import assert from 'node:assert/strict';
import { reconcileIncident } from '../../shared/domain/reconcileIncident.js';
import { calculateUrgency } from '../../shared/domain/urgencyEngine.js';
import { calculateEvidenceConfidence, rankEvidenceGaps } from '../../shared/domain/evidenceEngine.js';

const baseReports = [
  { id:'A', sourceId:'Reporter A', timestamp:'2026-08-15T14:05:00+05:30', text:'Five people trapped inside a flooded house on Gandhi Street, Velachery.', location:{lat:12.9818,lng:80.2180} },
  { id:'B', sourceId:'Reporter B', timestamp:'2026-08-15T14:09:00+05:30', text:'Two elderly people waiting on a rooftop near Gandhi Street pharmacy.', location:{lat:12.9821,lng:80.2183} },
  { id:'C', sourceId:'Reporter C', timestamp:'2026-08-15T14:12:00+05:30', text:'Family at Gandhi Street already rescued.', location:{lat:12.9817,lng:80.2182} },
  { id:'D', sourceId:'Reporter D', timestamp:'2026-08-15T14:14:00+05:30', text:'Water is rising. People are still shouting from the roof near Gandhi Street.', location:{lat:12.9819,lng:80.2181} }
];

test('canonical conflicting flood incident is critical urgency with medium evidence confidence', () => {
  const incident = reconcileIncident(baseReports);
  const urgency = calculateUrgency(incident);
  const confidence = calculateEvidenceConfidence(incident);
  assert.equal(urgency.level, 'CRITICAL');
  assert.equal(confidence.level, 'MEDIUM');
});

test('current rescue status ranks as the top decision-critical evidence gap', () => {
  const incident = reconcileIncident(baseReports);
  const gaps = rankEvidenceGaps(incident);
  assert.equal(gaps[0].key, 'current_rescue_status');
  assert.match(gaps[0].question, /still trapped/i);
});

test('verified field confirmation raises evidence confidence to high', () => {
  const incident = reconcileIncident([...baseReports, {
    id:'F', sourceId:'Field Unit 3', sourceType:'field_unit', verified:true,
    timestamp:'2026-08-15T14:18:00+05:30',
    text:'Rescue has not been completed. Two elderly people remain on the rooftop near Gandhi Street.',
    location:{lat:12.9820,lng:80.2182}
  }]);
  const confidence = calculateEvidenceConfidence(incident);
  assert.equal(confidence.level, 'HIGH');
});
