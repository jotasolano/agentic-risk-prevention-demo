import React, { useState } from 'react';
import { PR } from '../../data/pr';

interface PRHeaderProps {
  onFixAll: () => void;
  phase?: string;
}

export function PRHeader({ onFixAll, phase }: PRHeaderProps) {
  const [pulsing, setPulsing] = useState(false);
  const [exportShaking, setExportShaking] = useState(false);
  const isFixing = phase === 'fixing' || phase === 'done';

  const handleFixAll = () => {
    if (isFixing) return;
    setPulsing(true);
    setTimeout(() => {
      setPulsing(false);
      onFixAll();
    }, 600);
  };

  const handleExport = () => {
    setExportShaking(true);
    setTimeout(() => setExportShaking(false), 350);
  };

  return (
    <div className="pr-header">
      <div className="pr-header__left">
        <div className="pr-header__tag">
          PULL REQUEST · GITHUB.COM/GRAFANA/PLATFORM
        </div>
        <h1 className="pr-header__title">
          #{PR.number}&nbsp;&nbsp;{PR.title}
        </h1>
        <div className="pr-header__meta">
          <div className="pr-header__avatar" aria-hidden="true">
            {PR.authorInitials}
          </div>
          <span>{PR.author} opened this PR</span>
          <span>·</span>
          <span className="pr-header__branch">
            <span>{PR.branch}</span>
            <span style={{ color: 'var(--gf-text-secondary)' }}>→</span>
            <span>{PR.base}</span>
          </span>
          <span>·</span>
          <span>{PR.filesChanged} files changed</span>
        </div>
      </div>

      <div className="pr-header__right">
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div className="risk-summary">
            <span className="risk-summary__count" aria-label="4 predicted risks">4</span>
            <span className="risk-summary__label">predicted risks</span>
            <span className="risk-summary__incidents">3 similar past incidents</span>
          </div>
        </div>
        <div className="pr-header__actions">
          <button
            className={`btn-primary${pulsing ? ' btn-primary--pulse' : ''}`}
            onClick={handleFixAll}
            aria-label="Fix all predicted risks"
            disabled={isFixing}
            style={isFixing ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
          >
            <span>⚡</span>
            <span>Fix all</span>
          </button>
          <button
            className={`btn-ghost${exportShaking ? ' btn-shaking' : ''}`}
            onClick={handleExport}
            aria-label="Export prevention plan"
          >
            Export plan
          </button>
        </div>
      </div>
    </div>
  );
}
