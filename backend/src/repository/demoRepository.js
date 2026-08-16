import { DEMO_REPORTS } from '#shared/data/demoReports.js';
import { extractClaims } from '#shared/domain/claimExtractor.js';
import { scoreReportAgainstIncident } from '#shared/domain/incidentMatcher.js';
import { buildSingleReportIncident, evaluateCanonicalIncident } from '#shared/domain/buildIncidentIntelligence.js';

function clone(value) {
  return typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

function buildTreeIncident(report) {
  return {
    id: 'INC-22', title: 'Gandhi Nagar Road Obstruction', hazardType: 'fallen_tree',
    locationLabel: 'Gandhi Nagar Road, Velachery', location: report.location,
    firstReportedAt: report.timestamp, latestTimestamp: report.timestamp,
    linkedReportIds: [report.id], reports: [report], agreements: ['Road obstruction reported by one source.'],
    contradictions: [], missingEvidence: [{ key: 'road_blockage_extent', label: 'Blockage extent', question: 'Is the road fully blocked?' }],
    currentClaims: { rescueStatus: 'not_applicable', peopleAffectedMax: 0 }, status: 'active',
    intelligence: {
      urgency: { level: 'MEDIUM', score: 35, reasons: ['Road obstruction may affect local access.'] },
      confidence: { level: 'MEDIUM', score: 55, components: [{ label: 'Single direct report', effect: '+20', detail: 'One source' }] },
      evidenceGaps: [{ key: 'road_blockage_extent', label: 'Blockage extent', question: 'Is the road fully blocked?', decisionImpact: 45, verificationEffort: 20, priority: 2.25, rationale: 'Determines whether traffic support is needed.' }],
      workflow: { workflow: 'STANDARD_QUEUE', reasons: ['Credible lower-urgency obstruction.'] }
    }
  };
}

function initialAudit() {
  return [
    { id: 'AUD-1', type: 'REPORT_INGESTED', timestamp: '2026-08-15T14:05:02+05:30', actor: 'System', reportId: 'A', message: 'Report A ingested and source text preserved.' },
    { id: 'AUD-2', type: 'MATCH_RECOMMENDATION', timestamp: '2026-08-15T14:09:03+05:30', actor: 'Reconciliation engine', reportId: 'B', incidentId: 'INC-21', decision: 'LINK', message: 'Report B recommended as probable update to Incident #21.' },
    { id: 'AUD-3', type: 'LINK_DECISION', timestamp: '2026-08-15T14:09:20+05:30', actor: 'Demo Operator', operator: 'Demo Operator', reportId: 'B', incidentId: 'INC-21', decision: 'LINK', message: 'Operator confirmed report B belongs to Incident #21.' },
    { id: 'AUD-4', type: 'CONTRADICTION_DETECTED', timestamp: '2026-08-15T14:14:02+05:30', actor: 'Conflict engine', incidentId: 'INC-21', message: 'Critical contradiction preserved: rescued vs still trapped.' },
    { id: 'AUD-5', type: 'WORKFLOW_RECOMMENDATION', timestamp: '2026-08-15T14:14:03+05:30', actor: 'Decision engine', incidentId: 'INC-21', decision: 'RAPID_VERIFY', message: 'Critical urgency with unresolved rescue-status evidence gap.' }
  ];
}

export function createDemoRepository() {
  let reports = clone(DEMO_REPORTS);
  let audit = initialAudit();
  const annotateReviewReports = () => {
    const canonical = evaluateCanonicalIncident(reports.filter(report => report.incidentId === 'INC-21'));
    reports = reports.map(report => report.status === 'review' || report.status === 'hold'
      ? { ...report, extractedClaims: extractClaims(report), matchRecommendation: scoreReportAgainstIncident(report, canonical) }
      : report);
  };
  annotateReviewReports();
  let incidents = [
    evaluateCanonicalIncident(reports.filter(report => report.incidentId === 'INC-21')),
    buildTreeIncident(reports.find(report => report.id === 'E'))
  ];

  const rebuildCanonical = () => {
    const linked = reports.filter(report => report.incidentId === 'INC-21');
    incidents = incidents.map(incident => incident.id === 'INC-21' ? evaluateCanonicalIncident(linked) : incident);
  };

  const appendAudit = (event) => {
    audit = [...audit, { id: `AUD-${audit.length + 1}`, timestamp: new Date().toISOString(), ...event }];
  };

  return {
    mode: 'demo',

    async getState() {
      return clone({ mode: 'demo', reports, incidents, audit });
    },

    async submitReport(input) {
      const id = input.id ?? `R-${String(reports.length + 1).padStart(2, '0')}`;
      const report = { ...input, id, status: 'review', timestamp: input.timestamp ?? new Date().toISOString() };
      report.extractedClaims = extractClaims(report);
      const canonical = incidents.find(incident => incident.id === 'INC-21');
      report.matchRecommendation = scoreReportAgainstIncident(report, canonical);
      reports = [...reports, report];
      appendAudit({ type: 'REPORT_INGESTED', actor: 'System', reportId: id, message: `Report ${id} ingested; original evidence preserved.` });
      return { id, report: clone(report) };
    },

    async reviewReport({ reportId, decision, incidentId = 'INC-21', operator = 'Demo Operator' }) {
      let targetIncidentId = incidentId;
      if (decision === 'CREATE') {
        const maxId = incidents.reduce((max, item) => Math.max(max, Number(String(item.id).replace('INC-', '')) || 0), 22);
        targetIncidentId = `INC-${maxId + 1}`;
      }

      reports = reports.map(report => report.id === reportId ? {
        ...report,
        humanDecision: decision,
        incidentId: decision === 'LINK' || decision === 'CREATE' ? targetIncidentId : report.incidentId,
        status: decision === 'HOLD' ? 'hold' : decision === 'LINK' || decision === 'CREATE' ? 'linked' : 'separate'
      } : report);

      if (decision === 'CREATE') {
        const sourceReport = reports.find(report => report.id === reportId);
        incidents = [...incidents, buildSingleReportIncident(sourceReport, targetIncidentId)];
      }
      if (decision === 'LINK' && targetIncidentId === 'INC-21') rebuildCanonical();

      appendAudit({ type: 'LINK_DECISION', actor: operator, operator, reportId, incidentId: targetIncidentId, decision, message: `${operator} selected ${decision} for report ${reportId}.` });
      return { reportId, decision, incidentId: targetIncidentId };
    },

    async addEvidence({ incidentId, report }) {
      const id = report.id ?? `FIELD-${reports.filter(item => item.sourceType === 'field_unit').length + 1}`;
      const evidence = {
        ...report,
        id,
        incidentId,
        status: 'linked',
        verified: report.verified ?? true,
        timestamp: report.timestamp ?? new Date().toISOString()
      };
      reports = [...reports, evidence];
      appendAudit({ type: 'FIELD_EVIDENCE_ADDED', actor: evidence.sourceId ?? 'Field unit', reportId: id, incidentId, message: `Verified field evidence added to ${incidentId}.` });
      if (incidentId === 'INC-21') rebuildCanonical();
      return { id, incidentId };
    },

    async recordDecision({ incidentId, action, operator = 'Demo Operator', note = '' }) {
      const timestamp = new Date().toISOString();
      incidents = incidents.map(incident => incident.id === incidentId
        ? { ...incident, operatorDecision: { action, operator, note, timestamp } }
        : incident);
      appendAudit({ type: 'WORKFLOW_DECISION', actor: operator, operator, incidentId, decision: action, note, message: `${operator} recorded ${action} for ${incidentId}.` });
      return { incidentId, action };
    },

    async reset() {
      reports = clone(DEMO_REPORTS);
      audit = initialAudit();
      annotateReviewReports();
      incidents = [
        evaluateCanonicalIncident(reports.filter(report => report.incidentId === 'INC-21')),
        buildTreeIncident(reports.find(report => report.id === 'E'))
      ];
      return this.getState();
    },

    async seedDemoData() {
      await this.reset();
      return { seeded: true };
    }
  };
}
