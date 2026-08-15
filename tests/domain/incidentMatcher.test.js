import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreReportAgainstIncident } from '../../shared/domain/incidentMatcher.js';

const incident = {
  id: 'INC-21',
  title: 'Gandhi Street Flood Rescue',
  hazardType: 'flood',
  locationLabel: 'Gandhi Street, Velachery',
  location: { lat: 12.9818, lng: 80.2180 },
  latestTimestamp: '2026-08-15T14:05:00+05:30',
  keywords: ['gandhi', 'street', 'velachery', 'flood', 'roof', 'trapped']
};

const relatedReports = [
  { id: 'B', sourceId: 'Reporter B', timestamp: '2026-08-15T14:09:00+05:30', text: 'Two elderly people waiting on a rooftop near Gandhi Street pharmacy.', location: { lat: 12.9821, lng: 80.2183 } },
  { id: 'C', sourceId: 'Reporter C', timestamp: '2026-08-15T14:12:00+05:30', text: 'Family at Gandhi Street already rescued.', location: { lat: 12.9817, lng: 80.2182 } },
  { id: 'D', sourceId: 'Reporter D', timestamp: '2026-08-15T14:14:00+05:30', text: 'Water is rising. People are still shouting from the roof near Gandhi Street.', location: { lat: 12.9819, lng: 80.2181 } }
];

test('recommends LINK for reports B, C and D around the Gandhi Street incident', () => {
  for (const report of relatedReports) {
    const result = scoreReportAgainstIncident(report, incident);
    assert.equal(result.recommendation, 'LINK', `${report.id} should link but scored ${result.total}`);
  }
});

test('recommends CREATE for the nearby but separate fallen-tree report E', () => {
  const result = scoreReportAgainstIncident({
    id: 'E', sourceId: 'Reporter E', timestamp: '2026-08-15T14:16:00+05:30',
    text: 'Tree fallen across Gandhi Nagar Road.',
    location: { lat: 12.9875, lng: 80.2245 }
  }, incident);
  assert.equal(result.recommendation, 'CREATE');
});
