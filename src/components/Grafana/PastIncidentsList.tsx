import React, { useState } from 'react';
import { PAST_INCIDENTS } from '../../data/incidents';

export function PastIncidentsList() {
  const [shakingIdx, setShakingIdx] = useState<number | null>(null);

  const handleViewPostmortem = (idx: number) => {
    setShakingIdx(idx);
    setTimeout(() => setShakingIdx(null), 350);
  };

  return (
    <div className="section-block">
      <div className="section-header">
        <span className="section-title">Similar Past Incidents</span>
        <span style={{ fontSize: 11, color: 'var(--gf-text-secondary)' }}>
          Pattern match: code-shape + service graph
        </span>
      </div>
      <div className="incidents-grid">
        {PAST_INCIDENTS.map((inc, idx) => (
          <div key={inc.id} className="incident-card">
            <div className="incident-card__date">{inc.date}</div>
            <div>
              <span className="incident-card__id">{inc.id}</span>
            </div>
            <div className="incident-card__title">{inc.title}</div>
            <div className="incident-card__stats">
              <div className="incident-card__stat">
                <span className="incident-card__stat-label">Duration</span>
                <span className="incident-card__stat-value">{inc.durationMin}m</span>
              </div>
              <div className="incident-card__stat incident-card__stat--similarity">
                <span className="incident-card__stat-label">Similarity</span>
                <div className="similarity-bar" aria-hidden="true">
                  <div
                    className="similarity-bar__fill"
                    style={{ width: `${inc.similarity}%` }}
                  />
                </div>
                <span className="incident-card__stat-value">{inc.similarity}%</span>
              </div>
            </div>
            <button
              className={`incident-card__link${shakingIdx === idx ? ' btn-shaking' : ''}`}
              onClick={() => handleViewPostmortem(idx)}
              aria-label={`View postmortem for ${inc.id}`}
            >
              View postmortem →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
