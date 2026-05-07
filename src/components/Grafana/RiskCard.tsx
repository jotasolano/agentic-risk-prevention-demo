import React from 'react';
import { Risk } from '../../data/risks';

interface RiskCardProps {
  risk: Risk;
  queued: boolean;
  onFix: (id: string) => void;
}

const RISK_NUMBERS: Record<string, number> = {
  r1: 3,
  r2: 1,
  r3: 2,
  r4: 1,
};

export function RiskCard({ risk, queued, onFix }: RiskCardProps) {
  const number = RISK_NUMBERS[risk.id] ?? 1;

  return (
    <div className="risk-card-new" role="article" aria-label={`Risk: ${risk.title}`}>
      <div className="risk-card-new__inner">
        <div className="risk-card-new__header">
          <span className="risk-card-new__label">{risk.category}</span>
          <div className="risk-card-new__buttons">
            <button
              className={`risk-card-new__btn-fix${queued ? ' risk-card-new__btn-fix--queued' : ''}`}
              onClick={() => !queued && onFix(risk.id)}
              aria-label={queued ? `${risk.title} fixed` : `Fix ${risk.title}`}
              aria-pressed={queued}
            >
              {queued ? '✓' : 'Fix'}
            </button>
            <button
              className="risk-card-new__btn-learn"
              aria-label={`Learn more about ${risk.title}`}
            >
              Learn more
            </button>
          </div>
        </div>

        <div
          className={`risk-card-new__number${queued ? ' risk-card-new__number--fixed' : ''}`}
          aria-label={`${number} incident${number !== 1 ? 's' : ''}`}
        >
          {number}
        </div>
      </div>
      <div className="risk-card-new__bar" aria-hidden="true" />
    </div>
  );
}
