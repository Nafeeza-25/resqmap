import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function source(path) { return readFile(new URL(`../../${path}`, import.meta.url), 'utf8'); }

test('routes expose all required prototype screens', async () => {
  const routes = await source('frontend/src/app/routes.jsx');
  for (const path of ['/reports', '/review', '/incidents/:incidentId', '/map', '/audit']) {
    assert.ok(routes.includes(path), `missing route ${path}`);
  }
});

test('incident detail surfaces conflict, urgency, evidence confidence, decision-critical evidence and human action', async () => {
  const detail = await source('frontend/src/pages/IncidentDetailPage.jsx');
  for (const term of ['Critical contradiction', 'Urgency', 'Evidence confidence', 'Decision-critical evidence', 'Human decision']) {
    assert.ok(detail.includes(term), `missing incident detail concept: ${term}`);
  }
});

test('map uses OpenStreetMap tiles and audit page identifies an audit trail', async () => {
  const map = await source('frontend/src/components/IncidentMap.jsx');
  const audit = await source('frontend/src/pages/AuditHistoryPage.jsx');
  assert.ok(map.includes('openstreetmap.org'));
  assert.ok(audit.includes('Audit trail'));
});


test('frontend uses the ResQMap semantic theme without MUI or gradients', async () => {
  const config = await source('frontend/tailwind.config.js');
  const css = await source('frontend/src/styles/app.css');
  const pkg = JSON.parse(await source('frontend/package.json'));
  for (const token of ['background', 'foreground', 'card', 'muted', 'border', 'primary', 'warning', 'success']) {
    assert.ok(config.includes(token), `missing semantic token ${token}`);
  }
  assert.ok(css.includes('--background'));
  assert.equal(Boolean(pkg.dependencies?.['@mui/material']), false);
  assert.equal(/gradient/i.test(css), false);
});
