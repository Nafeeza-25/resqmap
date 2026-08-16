import { DEMO_REPORTS } from '#shared/data/demoReports.js';
import { extractClaims } from '#shared/domain/claimExtractor.js';
import { scoreReportAgainstIncident } from '#shared/domain/incidentMatcher.js';
import { buildSingleReportIncident, evaluateCanonicalIncident } from '#shared/domain/buildIncidentIntelligence.js';

function toPlain(snapshot) {
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function createFirebaseAdminRepository(env = process.env) {
  const [{ initializeApp, cert, getApps }, { getFirestore }] = await Promise.all([
    import('firebase-admin/app'),
    import('firebase-admin/firestore')
  ]);

  if (!getApps().length) {
    const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const hasServiceAccount = env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && privateKey;
    initializeApp(hasServiceAccount ? {
      credential: cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey
      })
    } : {});
  }

  const db = getFirestore();

  const appendAudit = async (event) => {
    await db.collection('auditEvents').add({ createdAt: new Date().toISOString(), ...event });
  };

  const recomputeCanonical = async () => {
    const snapshot = await db.collection('reports').where('incidentId', '==', 'INC-21').get();
    const reports = toPlain(snapshot);
    if (!reports.length) return;
    await db.collection('incidents').doc('INC-21').set(evaluateCanonicalIncident(reports), { merge: true });
  };

  return {
    mode: 'firebase',

    async getState() {
      const [reportSnap, incidentSnap, auditSnap] = await Promise.all([
        db.collection('reports').orderBy('timestamp', 'desc').get(),
        db.collection('incidents').get(),
        db.collection('auditEvents').orderBy('createdAt', 'asc').get()
      ]);
      return {
        mode: 'firebase',
        reports: toPlain(reportSnap),
        incidents: toPlain(incidentSnap),
        audit: toPlain(auditSnap)
      };
    },

    async submitReport(input) {
      const payload = {
        ...input,
        extractedClaims: extractClaims(input),
        status: 'review',
        timestamp: input.timestamp ?? new Date().toISOString()
      };
      const canonicalSnap = await db.collection('incidents').doc('INC-21').get();
      if (canonicalSnap.exists) payload.matchRecommendation = scoreReportAgainstIncident(payload, { id: canonicalSnap.id, ...canonicalSnap.data() });
      const ref = await db.collection('reports').add(payload);
      await appendAudit({ type: 'REPORT_INGESTED', actor: 'System', reportId: ref.id, message: `Report ${ref.id} ingested; original evidence preserved.` });
      return { id: ref.id, report: { id: ref.id, ...payload } };
    },

    async reviewReport({ reportId, decision, incidentId = 'INC-21', operator = 'Demo Operator' }) {
      let targetIncidentId = incidentId;
      if (decision === 'CREATE') targetIncidentId = `INC-${String(reportId).slice(0, 8).toUpperCase()}`;

      const update = {
        humanDecision: decision,
        status: decision === 'HOLD' ? 'hold' : decision === 'LINK' || decision === 'CREATE' ? 'linked' : 'separate'
      };
      if (decision === 'LINK' || decision === 'CREATE') update.incidentId = targetIncidentId;
      await db.collection('reports').doc(reportId).update(update);

      if (decision === 'CREATE') {
        const reportSnap = await db.collection('reports').doc(reportId).get();
        if (!reportSnap.exists) {
          const error = new Error(`Report ${reportId} not found.`);
          error.code = 'NOT_FOUND';
          throw error;
        }
        const sourceReport = { id: reportSnap.id, ...reportSnap.data(), incidentId: targetIncidentId, status: 'linked' };
        await db.collection('incidents').doc(targetIncidentId).set(buildSingleReportIncident(sourceReport, targetIncidentId));
      }
      if (decision === 'LINK' && targetIncidentId === 'INC-21') await recomputeCanonical();

      await appendAudit({ type: 'LINK_DECISION', actor: operator, operator, reportId, incidentId: targetIncidentId, decision, message: `${operator} selected ${decision} for report ${reportId}.` });
      return { reportId, decision, incidentId: targetIncidentId };
    },

    async addEvidence({ incidentId, report }) {
      const payload = {
        ...report,
        incidentId,
        verified: report.verified ?? true,
        status: 'linked',
        timestamp: report.timestamp ?? new Date().toISOString()
      };
      const ref = await db.collection('reports').add(payload);
      await appendAudit({ type: 'FIELD_EVIDENCE_ADDED', actor: payload.sourceId ?? 'Field unit', reportId: ref.id, incidentId, message: `Verified field evidence added to ${incidentId}.` });
      if (incidentId === 'INC-21') await recomputeCanonical();
      return { id: ref.id, incidentId };
    },

    async recordDecision({ incidentId, action, operator = 'Demo Operator', note = '' }) {
      const timestamp = new Date().toISOString();
      await db.collection('incidents').doc(incidentId).update({ operatorDecision: { action, operator, note, timestamp } });
      await appendAudit({ type: 'WORKFLOW_DECISION', actor: operator, operator, incidentId, decision: action, note, message: `${operator} recorded ${action} for ${incidentId}.` });
      return { incidentId, action };
    },

    async seedDemoData() {
      const existing = await db.collection('reports').limit(1).get();
      if (!existing.empty) return { seeded: false };
      const batch = db.batch();
      for (const report of DEMO_REPORTS) batch.set(db.collection('reports').doc(report.id), report);
      await batch.commit();
      await recomputeCanonical();
      const tree = DEMO_REPORTS.find(report => report.id === 'E');
      await db.collection('incidents').doc('INC-22').set(buildSingleReportIncident(tree, 'INC-22'));
      await appendAudit({ type: 'DEMO_SEEDED', actor: 'System', message: 'Controlled Chennai demo dataset seeded into Firestore.' });
      return { seeded: true };
    }
  };
}
