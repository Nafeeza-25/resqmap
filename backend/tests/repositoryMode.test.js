import test from 'node:test';
import assert from 'node:assert/strict';
import { wantsFirebase } from '../src/repository/index.js';

test('backend defaults to demo mode without credentials', () => {
  assert.equal(wantsFirebase({}), false);
  assert.equal(wantsFirebase({ RESQMAP_BACKEND_MODE: 'demo' }), false);
});

test('backend selects firebase mode explicitly or with full service account', () => {
  assert.equal(wantsFirebase({ RESQMAP_BACKEND_MODE: 'firebase' }), true);
  assert.equal(wantsFirebase({ FIREBASE_PROJECT_ID: 'p', FIREBASE_CLIENT_EMAIL: 'x@y', FIREBASE_PRIVATE_KEY: 'key' }), true);
});
