import React from 'react';
import preventionIcon from '../../assets/prevention-icon.png';

interface HistoryEntry {
  id: string;
  title: string;
  time: string;
  active?: boolean;
}

const HISTORY: HistoryEntry[] = [
  {
    id: 'h1',
    title: 'feat(payments): switch Stripe charge flow from sync to async webhooks',
    time: 'Today',
    active: true,
  },
  {
    id: 'h2',
    title: 'refactor(db): switch primary connection pool from pgbouncer to pgpool-II',
    time: '13m',
  },
  {
    id: 'h3',
    title: 'perf(search): replace Elasticsearch with OpenSearch 2.x',
    time: '14m',
  },
  {
    id: 'h4',
    title: 'chore(deps): bump node from 18 to 22 across all services',
    time: '14m',
  },
  {
    id: 'h5',
    title: 'feat(payments): introduce idempotency keys to checkout API',
    time: '17m',
  },
  {
    id: 'h6',
    title: 'fix(rate-limit): change token bucket from per-IP to per-user',
    time: '18m',
  },
  {
    id: 'h7',
    title: 'feat(infra): enable cross-region replication on primary RDS cluster',
    time: '21m',
  },
];

function NavPrevIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M8.5 2.5L4.5 7 8.5 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NavNextIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M5.5 2.5L9.5 7 5.5 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NewIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 2V12M2 7H12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function SidebarHistory() {
  return (
    <aside className="gf-sidebar" aria-label="Conversation history">
      <div className="gf-sidebar__header">
        <button className="gf-sidebar__icon-btn" aria-label="Previous">
          <NavPrevIcon />
        </button>
        <button className="gf-sidebar__icon-btn" aria-label="Next">
          <NavNextIcon />
        </button>
        <div className="gf-sidebar__header-spacer" />
        <button className="gf-sidebar__icon-btn" aria-label="New plan">
          <NewIcon />
        </button>
      </div>

      <div className="gf-sidebar__list" role="list">
        <div className="gf-sidebar__section-label">Recent</div>
        {HISTORY.map((entry) => (
          <div
            key={entry.id}
            className={`gf-sidebar__item${entry.active ? ' gf-sidebar__item--active' : ''}`}
            role="listitem"
            tabIndex={0}
            aria-current={entry.active ? 'true' : undefined}
          >
            <span className="gf-sidebar__item-icon">
              <img src={preventionIcon} alt="" width={12} height={12} style={{ opacity: 0.7, display: 'block' }} />
            </span>
            <span className="gf-sidebar__item-title" title={entry.title}>
              {entry.title}
            </span>
            <span className="gf-sidebar__item-time">{entry.time}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
