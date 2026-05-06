export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface Risk {
  id: string;
  severity: Severity;
  category: string;
  title: string;
  body: string;
  fix: string;
}

export const RISKS: Risk[] = [
  {
    id: 'r1',
    severity: 'critical',
    category: 'CACHE',
    title: 'Cache stampede risk on cold start',
    body: 'New write-through cache has no request coalescing. On a cold Redis instance or eviction wave, /api/search will fan out N×concurrent-requests to Postgres. Past incident INC-2049 was caused by this exact pattern in /api/dashboards.',
    fix: 'Wrap fetch in singleflight + add 30s TTL ceiling',
  },
  {
    id: 'r2',
    severity: 'high',
    category: 'LATENCY',
    title: 'p99 search latency predicted to regress 4.2×',
    body: 'Synthetic replay against last 24h of /api/search traffic shows p99 moving from 142ms → 600ms during cache misses. Threshold for the search-api SLO (450ms p99) will be breached within ~6 minutes of deploy under typical Tuesday load.',
    fix: 'Add cache warmup on deploy + raise Redis maxmemory',
  },
  {
    id: 'r3',
    severity: 'high',
    category: 'RELIABILITY',
    title: 'No fallback when Redis is unreachable',
    body: 'New code path treats Redis as required. If the Redis cluster is unhealthy, /api/search returns 5xx instead of degrading to direct-DB reads. Past incidents INC-1832 and INC-1901 were both caused by hard Redis dependencies in hot paths.',
    fix: 'Add circuit breaker + direct-DB fallback',
  },
  {
    id: 'r4',
    severity: 'medium',
    category: 'OBSERVABILITY',
    title: 'New code path has no alerts or dashboards',
    body: 'cache-hit-ratio, eviction-rate, and stampede-coalesce-count are not exported. On-call cannot diagnose this surface during an incident. Two of the three similar past incidents took >40 min to mitigate primarily due to missing telemetry on the cache layer.',
    fix: 'Emit 3 metrics + create 4 alert rules with suggested thresholds',
  },
];
