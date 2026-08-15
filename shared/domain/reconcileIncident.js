import { extractClaims } from './claimExtractor.js';
import { detectContradictions } from './conflictEngine.js';

function centroid(reports) {
  const located = reports.filter(r => r.location && Number.isFinite(r.location.lat) && Number.isFinite(r.location.lng));
  if (!located.length) return null;
  return {
    lat: located.reduce((sum, r) => sum + r.location.lat, 0) / located.length,
    lng: located.reduce((sum, r) => sum + r.location.lng, 0) / located.length
  };
}

export function reconcileIncident(reports) {
  const claims = reports.map(extractClaims);
  let contradictions = detectContradictions(claims);
  const verifiedCurrent = [...reports]
    .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))
    .find(r => (r.verified || r.sourceType === 'field_unit') && extractClaims(r).rescueStatus !== 'unknown');
  const verifiedCurrentClaims = verifiedCurrent ? extractClaims(verifiedCurrent) : null;
  if (verifiedCurrentClaims && contradictions.length) {
    contradictions = contradictions.map(conflict => conflict.field === 'rescueStatus'
      ? { ...conflict, resolved: true, resolution: { reportId: verifiedCurrent.id, sourceId: verifiedCurrent.sourceId, value: verifiedCurrentClaims.rescueStatus, timestamp: verifiedCurrent.timestamp } }
      : conflict);
  }
  const floodCount = claims.filter(c => c.hazardType === 'flood').length;
  const strandedCount = claims.filter(c => c.rescueStatus === 'still_trapped').length;
  const hasElderly = claims.some(c => c.vulnerableGroups.includes('elderly'));

  const agreements = [];
  if (floodCount >= 2) agreements.push('Flood emergency reported near Gandhi Street / Velachery.');
  if (strandedCount >= 2) agreements.push('Multiple sources report people stranded or still requesting assistance.');
  if (hasElderly) agreements.push('At least one source reports elderly people requiring assistance.');

  const missingEvidence = [];
  if (contradictions.some(c => c.field === 'rescueStatus') && !verifiedCurrentClaims) {
    missingEvidence.push({ key: 'current_rescue_status', label: 'Current rescue status', question: 'Are the victims still trapped?' });
  }
  const peopleCounts = claims.map(c => c.peopleAffected).filter(Number.isFinite);
  if (new Set(peopleCounts).size > 1 || peopleCounts.length < reports.length) {
    missingEvidence.push({ key: 'people_remaining', label: 'People remaining', question: 'How many people still need rescue?' });
  }
  if (claims.some(c => c.locationLabel === 'Location unconfirmed')) {
    missingEvidence.push({ key: 'exact_location', label: 'Exact location', question: 'What is the exact rooftop or house location?' });
  }

  const latest = [...reports].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  const maxPeople = peopleCounts.length ? Math.max(...peopleCounts) : null;
  return {
    id: 'INC-21',
    title: 'Gandhi Street Flood Rescue',
    hazardType: 'flood',
    locationLabel: 'Gandhi Street, Velachery',
    location: centroid(reports),
    firstReportedAt: reports[0]?.timestamp ?? null,
    latestTimestamp: latest?.timestamp ?? null,
    linkedReportIds: reports.map(r => r.id),
    reports,
    claims,
    agreements,
    contradictions,
    missingEvidence,
    currentClaims: {
      peopleAffectedMax: maxPeople,
      rescueStatus: verifiedCurrentClaims?.rescueStatus ?? (contradictions.length ? 'conflicted' : (claims.findLast?.(c => c.rescueStatus !== 'unknown')?.rescueStatus ?? 'unknown'))
    }
  };
}
