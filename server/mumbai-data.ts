/**
 * Mock Mumbai regions data
 * These are key areas in Mumbai with approximate coordinates
 */
export const mumbaiRegions = [
  { name: 'Andheri West', lat: 19.1136, lng: 72.8697, baseScore: 75 },
  { name: 'Andheri East', lat: 19.1197, lng: 72.8694, baseScore: 72 },
  { name: 'Bandra West', lat: 19.0596, lng: 72.8295, baseScore: 80 },
  { name: 'Bandra East', lat: 19.0544, lng: 72.8420, baseScore: 68 },
  { name: 'Borivali West', lat: 19.2403, lng: 72.8565, baseScore: 65 },
  { name: 'Borivali East', lat: 19.2304, lng: 72.8564, baseScore: 62 },
  { name: 'Colaba', lat: 18.9067, lng: 72.8147, baseScore: 85 },
  { name: 'Dadar West', lat: 19.0178, lng: 72.8478, baseScore: 70 },
  { name: 'Dadar East', lat: 19.0189, lng: 72.8489, baseScore: 66 },
  { name: 'Fort', lat: 18.9330, lng: 72.8350, baseScore: 82 },
  { name: 'Goregaon West', lat: 19.1663, lng: 72.8526, baseScore: 68 },
  { name: 'Goregaon East', lat: 19.1549, lng: 72.8639, baseScore: 64 },
  { name: 'Juhu', lat: 19.1075, lng: 72.8263, baseScore: 78 },
  { name: 'Kandivali West', lat: 19.2074, lng: 72.8320, baseScore: 67 },
  { name: 'Kandivali East', lat: 19.2039, lng: 72.8550, baseScore: 63 },
  { name: 'Kurla West', lat: 19.0728, lng: 72.8826, baseScore: 58 },
  { name: 'Kurla East', lat: 19.0653, lng: 72.8935, baseScore: 55 },
  { name: 'Malad West', lat: 19.1864, lng: 72.8411, baseScore: 65 },
  { name: 'Malad East', lat: 19.1858, lng: 72.8489, baseScore: 61 },
  { name: 'Marine Drive', lat: 18.9432, lng: 72.8236, baseScore: 88 },
  { name: 'Mulund West', lat: 19.1722, lng: 72.9565, baseScore: 72 },
  { name: 'Mulund East', lat: 19.1607, lng: 72.9560, baseScore: 69 },
  { name: 'Powai', lat: 19.1176, lng: 72.9060, baseScore: 76 },
  { name: 'Santa Cruz West', lat: 19.0812, lng: 72.8347, baseScore: 70 },
  { name: 'Santa Cruz East', lat: 19.0896, lng: 72.8422, baseScore: 67 },
  { name: 'Thane West', lat: 19.2183, lng: 72.9781, baseScore: 68 },
  { name: 'Versova', lat: 19.1311, lng: 72.8158, baseScore: 73 },
  { name: 'Vile Parle West', lat: 19.1045, lng: 72.8370, baseScore: 74 },
  { name: 'Vile Parle East', lat: 19.0990, lng: 72.8489, baseScore: 71 },
  { name: 'Worli', lat: 19.0176, lng: 72.8170, baseScore: 79 },
];

/**
 * Sample alert messages for different severity levels
 */
export const alertTemplates = {
  critical: [
    'Major incident detected near {area} - high police activity reported',
    'Safety alert: Avoid {area} - critical incident in progress',
    'Emergency response active in {area} - seek alternate routes',
  ],
  warning: [
    'Incident detected near {area} — low lighting and sparse crowd',
    'Safety concern in {area} — multiple incidents reported in last hour',
    'Increased crowd density in {area} — exercise caution',
    'Poor lighting conditions reported in {area}',
  ],
  info: [
    'Heavy rainfall affecting visibility in {area}',
    'Increased police presence in {area} - routine patrol',
    'Traffic congestion in {area} may affect safety perception',
  ],
};

/**
 * Get a random alert template
 */
export function getRandomAlert(severity: 'critical' | 'warning' | 'info', areaName: string): string {
  const templates = alertTemplates[severity];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template.replace('{area}', areaName);
}
