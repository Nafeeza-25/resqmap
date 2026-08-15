import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));

function walk(dir) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap((entry) => {
    const rel = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(rel) : [rel];
  });
}

test('project is split into frontend backend and shared packages', () => {
  assert.equal(exists('frontend/package.json'), true);
  assert.equal(exists('backend/package.json'), true);
  assert.equal(exists('shared/domain/reconcileIncident.js'), true);
  assert.equal(exists('frontend/src/api/client.js'), true);
});

test('frontend uses Tailwind and contains no gradient styling', () => {
  assert.equal(exists('frontend/tailwind.config.js'), true);
  assert.equal(exists('frontend/postcss.config.js'), true);
  const files = walk('frontend/src').filter((file) => /\.(jsx|js|css)$/.test(file));
  assert.ok(files.length > 0);
  for (const file of files) {
    const source = read(file);
    assert.doesNotMatch(source, /gradient/i, `${file} must not contain gradient styling`);
  }
});

test('frontend never imports Firebase SDKs', () => {
  const files = walk('frontend/src').filter((file) => /\.(jsx|js)$/.test(file));
  for (const file of files) {
    const source = read(file);
    assert.doesNotMatch(source, /from ['"]firebase(?:\/|['"])/, `${file} imports firebase directly`);
    assert.doesNotMatch(source, /firebase-admin/, `${file} imports firebase-admin directly`);
  }
});
