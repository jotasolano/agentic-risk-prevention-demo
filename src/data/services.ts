export interface Service {
  name: string;
  owner: string;
  current: number;
  predicted: number;
  spark: number[];
}

export const SERVICES: Service[] = [
  {
    name: 'search-api',
    owner: 'team-search',
    current: 0.12,
    predicted: 4.8,
    spark: [0.1,0.12,0.11,0.13,0.1,0.12,0.11,0.13,0.12,0.11,0.12,0.13,0.12,0.11,4.8,4.6,5.1,5.3,5.0,5.2],
  },
  {
    name: 'dashboard-api',
    owner: 'team-platform',
    current: 0.08,
    predicted: 1.2,
    spark: [0.07,0.08,0.09,0.07,0.08,0.08,0.09,0.07,0.08,0.07,0.08,0.09,0.08,0.07,1.2,1.3,1.5,1.4,1.2,1.3],
  },
  {
    name: 'redis-cache',
    owner: 'team-platform',
    current: 0.01,
    predicted: 2.1,
    spark: [0.01,0.01,0.02,0.01,0.01,0.01,0.02,0.01,0.01,0.01,0.02,0.01,0.01,0.01,2.1,2.4,2.0,2.3,2.5,2.2],
  },
  {
    name: 'auth-service',
    owner: 'team-identity',
    current: 0.05,
    predicted: 0.18,
    spark: [0.05,0.04,0.05,0.05,0.04,0.05,0.05,0.04,0.05,0.05,0.04,0.05,0.05,0.04,0.18,0.16,0.19,0.17,0.18,0.16],
  },
];
