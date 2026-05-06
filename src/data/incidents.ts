export interface Incident {
  id: string;
  date: string;
  title: string;
  durationMin: number;
  similarity: number;
}

export const PAST_INCIDENTS: Incident[] = [
  { id: 'INC-2049', date: 'MAR 4, 2026', title: 'Cache stampede on /api/dashboards after cold deploy', durationMin: 47, similarity: 91 },
  { id: 'INC-1901', date: 'NOV 12, 2025', title: 'Redis cluster failover, hard dependency caused 5xx burst', durationMin: 62, similarity: 84 },
  { id: 'INC-1832', date: 'SEP 28, 2025', title: 'Search API p99 regression after caching change', durationMin: 38, similarity: 79 },
];
