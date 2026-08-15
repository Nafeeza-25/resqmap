const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10
};

function extractPeopleCount(text) {
  const digit = text.match(/\b(\d{1,2})\b/);
  if (digit) return Number(digit[1]);
  const lower = text.toLowerCase();
  for (const [word, count] of Object.entries(NUMBER_WORDS)) {
    if (new RegExp(`\\b${word}\\b`).test(lower)) return count;
  }
  return null;
}

function extractLocation(text) {
  const gandhi = text.match(/(Gandhi (?:Street|Nagar Road)(?:,?\s*Velachery)?)/i);
  if (gandhi) return gandhi[1];
  const velachery = text.match(/\bVelachery\b/i);
  return velachery ? 'Velachery' : 'Location unconfirmed';
}

export function extractClaims(report) {
  const text = report.text ?? '';
  const lower = text.toLowerCase();
  const hazardType = /flood|flooded|water rising|roof|வெள்ள/.test(lower)
    ? 'flood'
    : /tree fallen|fallen tree/.test(lower)
      ? 'fallen_tree'
      : /fire/.test(lower)
        ? 'fire'
        : 'unknown';

  let rescueStatus = 'unknown';
  if (/already rescued|rescue (?:is )?complete|rescued/.test(lower)) rescueStatus = 'rescued';
  if (/still trapped|trapped|still shouting|remain on the rooftop|rescue has not been completed|not completed/.test(lower)) {
    rescueStatus = 'still_trapped';
  }

  const vulnerableGroups = [];
  if (/elderly|senior citizen/.test(lower)) vulnerableGroups.push('elderly');
  if (/child|children/.test(lower)) vulnerableGroups.push('children');

  const severitySignals = [];
  if (/water is rising|water rising/.test(lower)) severitySignals.push('worsening_conditions');
  if (/trapped|rooftop|roof/.test(lower)) severitySignals.push('people_stranded');

  return {
    reportId: report.id,
    sourceId: report.sourceId,
    timestamp: report.timestamp,
    hazardType,
    locationLabel: extractLocation(text),
    peopleAffected: extractPeopleCount(text),
    vulnerableGroups,
    rescueStatus,
    condition: rescueStatus === 'still_trapped' ? 'requires_assistance' : rescueStatus === 'rescued' ? 'reported_safe' : 'unknown',
    severitySignals
  };
}
