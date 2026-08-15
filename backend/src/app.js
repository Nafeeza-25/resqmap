import express from 'express';
import cors from 'cors';

const REVIEW_ACTIONS = new Set(['LINK', 'CREATE', 'HOLD']);
const WORKFLOW_ACTIONS = new Set(['APPROVE', 'REJECT', 'OVERRIDE']);

export function createApiHandler({ repository }) {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
  app.use(express.json());

  app.get('/api/health', async (req, res) => {
    res.status(200).json({ ok: true, mode: repository.mode, service: 'resqmap-api' });
  });

  app.get('/api/state', async (req, res) => {
    try {
      res.status(200).json(await repository.getState());
    } catch (error) {
      const status = error?.code === 'NOT_FOUND' ? 404 : 500;
      res.status(status).json({ error: error?.message || 'Unexpected server error.' });
    }
  });

  app.post('/api/reports', async (req, res) => {
    try {
      if (!req.body.text?.trim()) return res.status(400).json({ error: 'Report text is required.' });
      res.status(201).json(await repository.submitReport(req.body));
    } catch (error) {
      const status = error?.code === 'NOT_FOUND' ? 404 : 500;
      res.status(status).json({ error: error?.message || 'Unexpected server error.' });
    }
  });

  app.post('/api/reviews/:reportId', async (req, res) => {
    try {
      if (!REVIEW_ACTIONS.has(req.body.decision)) {
        return res.status(400).json({ error: 'Review decision must be LINK, CREATE, or HOLD.' });
      }
      res.status(200).json(await repository.reviewReport({ reportId: req.params.reportId, ...req.body }));
    } catch (error) {
      const status = error?.code === 'NOT_FOUND' ? 404 : 500;
      res.status(status).json({ error: error?.message || 'Unexpected server error.' });
    }
  });

  app.post('/api/incidents/:incidentId/evidence', async (req, res) => {
    try {
      if (!req.body.text?.trim()) return res.status(400).json({ error: 'Evidence text is required.' });
      res.status(200).json(await repository.addEvidence({ incidentId: req.params.incidentId, report: req.body }));
    } catch (error) {
      const status = error?.code === 'NOT_FOUND' ? 404 : 500;
      res.status(status).json({ error: error?.message || 'Unexpected server error.' });
    }
  });

  app.post('/api/incidents/:incidentId/decisions', async (req, res) => {
    try {
      if (!WORKFLOW_ACTIONS.has(req.body.action)) {
        return res.status(400).json({ error: 'Workflow action must be APPROVE, REJECT, or OVERRIDE.' });
      }
      res.status(200).json(await repository.recordDecision({ incidentId: req.params.incidentId, ...req.body }));
    } catch (error) {
      const status = error?.code === 'NOT_FOUND' ? 404 : 500;
      res.status(status).json({ error: error?.message || 'Unexpected server error.' });
    }
  });

  app.post('/api/demo/reset', async (req, res) => {
    try {
      if (typeof repository.reset !== 'function') return res.status(409).json({ error: 'Reset is only available in demo mode.' });
      res.status(200).json(await repository.reset());
    } catch (error) {
      const status = error?.code === 'NOT_FOUND' ? 404 : 500;
      res.status(status).json({ error: error?.message || 'Unexpected server error.' });
    }
  });

  app.post('/api/admin/seed-demo', async (req, res) => {
    try {
      if (typeof repository.seedDemoData !== 'function') return res.status(409).json({ error: 'Demo seeding is not available for this backend mode.' });
      res.status(200).json(await repository.seedDemoData());
    } catch (error) {
      const status = error?.code === 'NOT_FOUND' ? 404 : 500;
      res.status(status).json({ error: error?.message || 'Unexpected server error.' });
    }
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
  });

  return app;
}
