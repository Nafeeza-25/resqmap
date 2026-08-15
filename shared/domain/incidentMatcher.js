import { extractClaims } from './claimExtractor.js';

const STOP = new Set(['the','a','an','on','at','near','inside','across','people','person','family','already','still','is','are','from']);

function tokens(text='') {
  return new Set(text.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(t => t.length > 2 && !STOP.has(t)));
}

function overlapScore(reportText, incident) {
  const a = tokens(reportText);
  const b = new Set([...(incident.keywords ?? []), ...tokens(incident.locationLabel ?? ''), ...tokens(incident.title ?? '')]);
  if (!a.size || !b.size) return 0;
  let common = 0;
  for (const t of a) if (b.has(t)) common += 1;
  return Math.min(1, common / Math.min(3, a.size));
}

function haversineMeters(a, b) {
  if (!a || !b) return null;
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat/2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function geographicScore(reportLoc, incidentLoc) {
  const distance = haversineMeters(reportLoc, incidentLoc);
  if (distance == null) return { score: 0.45, distance: null };
  if (distance <= 250) return { score: 1, distance };
  if (distance <= 500) return { score: 0.55, distance };
  if (distance <= 900) return { score: 0.2, distance };
  return { score: 0, distance };
}

function temporalScore(a, b) {
  if (!a || !b) return 0.5;
  const minutes = Math.abs(new Date(a).getTime() - new Date(b).getTime()) / 60000;
  if (minutes <= 30) return 1;
  if (minutes <= 120) return 0.7;
  if (minutes <= 360) return 0.35;
  return 0.1;
}

export function scoreReportAgainstIncident(report, incident) {
  const claims = extractClaims(report);
  const semantic = overlapScore(report.text, incident);
  const geo = geographicScore(report.location, incident.location);
  const temporal = temporalScore(report.timestamp, incident.latestTimestamp);
  const typeCompatibility = claims.hazardType === 'unknown'
    ? 0.6
    : claims.hazardType === incident.hazardType ? 1 : 0;

  const total = Number((semantic * 0.30 + geo.score * 0.30 + temporal * 0.20 + typeCompatibility * 0.20).toFixed(3));
  const recommendation = total >= 0.62 ? 'LINK' : total >= 0.46 ? 'HOLD' : 'CREATE';
  const reasons = [
    `${Math.round(semantic*100)}% semantic/location-token overlap`,
    geo.distance == null ? 'location not precise' : `${Math.round(geo.distance)} m from incident`,
    `${Math.round(temporal*100)}% temporal proximity`,
    typeCompatibility === 1 ? 'incident type compatible' : typeCompatibility === 0 ? 'incident type conflicts' : 'incident type not stated'
  ];
  return { semantic, geographic: geo.score, distanceMeters: geo.distance, temporal, typeCompatibility, total, recommendation, reasons };
}
