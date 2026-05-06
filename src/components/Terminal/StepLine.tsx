import React from 'react';

type StepStatus = 'pending' | 'running' | 'done';

interface StepLineProps {
  status: StepStatus;
  label: string;
  subLine?: string;
}

const GLYPH: Record<StepStatus, string> = {
  pending: '○',
  running: '⏺',
  done: '●',
};

export function StepLine({ status, label, subLine }: StepLineProps) {
  return (
    <div className="step-line">
      <div className="step-line__main">
        <span className={`step-line__glyph step-line__glyph--${status}`} aria-hidden="true">
          {GLYPH[status]}
        </span>
        <span className="step-line__label">{label}</span>
      </div>
      {status === 'done' && subLine && (
        <div className="step-line__sub">{subLine}</div>
      )}
    </div>
  );
}
