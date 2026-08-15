import test from 'node:test';
import assert from 'node:assert/strict';
import { detectContradictions } from '../../shared/domain/conflictEngine.js';

const claims = [
  { reportId: 'C', sourceId: 'Reporter C', timestamp: '2026-08-15T14:12:00+05:30', rescueStatus: 'rescued' },
  { reportId: 'D', sourceId: 'Reporter D', timestamp: '2026-08-15T14:14:00+05:30', rescueStatus: 'still_trapped' }
];

test('preserves rescued vs still-trapped as a critical source-linked contradiction', () => {
  const conflicts = detectContradictions(claims);
  assert.equal(conflicts.length, 1);
  assert.equal(conflicts[0].field, 'rescueStatus');
  assert.equal(conflicts[0].severity, 'critical');
  assert.deepEqual(conflicts[0].claims.map(c => c.sourceId).sort(), ['Reporter C', 'Reporter D']);
});
