import test from 'node:test';
import assert from 'node:assert/strict';
import { wantsFirebase } from '../../backend/src/repository/index.js';

test('Firebase is selected only by backend mode or complete server credentials', () => {
  assert.equal(wantsFirebase({}), false);
  assert.equal(wantsFirebase({ RESQMAP_BACKEND_MODE: 'demo' }), false);
  assert.equal(wantsFirebase({ RESQMAP_BACKEND_MODE: 'firebase' }), true);
  assert.equal(wantsFirebase({ FIREBASE_PROJECT_ID: 'p', FIREBASE_CLIENT_EMAIL: 'svc@example.com', FIREBASE_PRIVATE_KEY: 'key' }), true);
});
