import test from 'node:test';
import assert from 'node:assert/strict';
import { extractClaims } from '../../shared/domain/claimExtractor.js';

test('extracts flood, five people, trapped state and Gandhi Street from Report A', () => {
  const report = {
    id: 'A', sourceId: 'Reporter A', timestamp: '2026-08-15T14:05:00+05:30',
    text: 'Five people trapped inside a flooded house on Gandhi Street, Velachery.'
  };
  const claims = extractClaims(report);
  assert.equal(claims.hazardType, 'flood');
  assert.equal(claims.peopleAffected, 5);
  assert.equal(claims.rescueStatus, 'still_trapped');
  assert.match(claims.locationLabel, /Gandhi Street/i);
});

test('extracts rescued status from Report C', () => {
  const claims = extractClaims({
    id: 'C', sourceId: 'Reporter C', timestamp: '2026-08-15T14:12:00+05:30',
    text: 'Family at Gandhi Street already rescued.'
  });
  assert.equal(claims.rescueStatus, 'rescued');
});
