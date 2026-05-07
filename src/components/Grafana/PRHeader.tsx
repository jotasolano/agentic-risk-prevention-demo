import React, { useState } from 'react';
import { PR } from '../../data/pr';

interface PRHeaderProps {
  onFixAll: () => void;
  phase?: string;
}

function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M7 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M10 2h4v4M14 2 8 8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M6 1L11 10H1L6 1Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M6 5v2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="6" cy="9" r="0.5" fill="currentColor" />
    </svg>
  );
}

const PLAN_TITLE = `Risk prevention plan for ${PR.title}`;

export function PRHeader({ onFixAll, phase }: PRHeaderProps) {
  const [pulsing, setPulsing] = useState(false);
  const isFixing = phase === 'fixing' || phase === 'done';

  const handleFixAll = () => {
    if (isFixing) return;
    setPulsing(true);
    setTimeout(() => {
      setPulsing(false);
      onFixAll();
    }, 600);
  };

  return (
    <div className="gf-plan__header">
      <div className="gf-plan__title-row">
        <h1 className="gf-plan__title">{PLAN_TITLE}</h1>
        <a
          href={PR.url}
          target="_blank"
          rel="noopener noreferrer"
          className="gf-plan__ext-link"
          aria-label="Open PR in GitHub"
        >
          <ExternalLinkIcon />
        </a>
        <span className="gf-plan__badge">
          <WarningIcon />
          High confidence
        </span>
      </div>

      <button
        className={`gf-plan__fix-all${pulsing ? ' gf-plan__fix-all--pulse' : ''}`}
        onClick={handleFixAll}
        aria-label="Fix all predicted risks"
        disabled={isFixing}
      >
        Fix all
      </button>

      <p className="gf-plan__subtitle">4 risks identified – 10 files changed</p>
      <div className="gf-plan__divider" />
    </div>
  );
}
