import React, { useState } from 'react';
import { Risk, Severity } from '../../data/risks';

interface RiskCardProps {
  risk: Risk;
  queued: boolean;
  onFix: (id: string) => void;
}

const SEV_COLOR: Record<Severity, string> = {
  critical: 'var(--sev-critical)',
  high: 'var(--sev-high)',
  medium: 'var(--sev-medium)',
  low: 'var(--sev-low)',
};

const EVIDENCE_COUNT: Record<string, number> = {
  r1: 3,
  r2: 2,
  r3: 2,
  r4: 2,
};

export function RiskCard({ risk, queued, onFix }: RiskCardProps) {
  const [shaking, setShaking] = useState(false);

  const color = SEV_COLOR[risk.severity];
  const evidence = EVIDENCE_COUNT[risk.id] ?? 2;

  const handleDetails = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 350);
  };

  return (
    <div className="risk-card">
      {/* Top accent stripe */}
      <div className="risk-card__stripe" style={{ background: color }} />

      <div className="risk-card__inner">
        <div className="risk-card__top">
          <span className="risk-card__category">{risk.category}</span>
          <span
            className="risk-card__severity-pill"
            style={{
              background: `${color}2e`,
              color: color,
            }}
          >
            {risk.severity.toUpperCase()}
          </span>
        </div>

        <h3 className={`risk-card__title${queued ? ' risk-card__title--fixed' : ''}`}>
          {risk.title}
        </h3>

        <p className="risk-card__body">{risk.body}</p>

        <div className="risk-card__footer">
          <div className="risk-card__evidence">
            <span>📊</span>
            <span>{evidence} past incident{evidence > 1 ? 's' : ''}</span>
          </div>

          <div className="risk-card__buttons">
            {queued ? (
              <span className="risk-card__fixed-badge">
                <span>✓</span>
                <span>Fix queued</span>
              </span>
            ) : (
              <button
                className="btn-card-fix"
                onClick={() => onFix(risk.id)}
                aria-label={`Fix ${risk.title}`}
              >
                Fix
              </button>
            )}
            <button
              className={`btn-card-details${shaking ? ' btn-shaking' : ''}`}
              onClick={handleDetails}
              aria-label={`View details for ${risk.title}`}
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
