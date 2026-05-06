import React, { useEffect, useRef, useState } from 'react';
import { AppState, Action } from '../../state';
import { TIMING } from '../../data/timeline';
import { ClaudeBanner } from './ClaudeBanner';
import { StepLine } from './StepLine';
import { Box } from './Box';
import '../../styles/terminal.css';

const PUSH_STEPS = [
  { label: 'Staging changes', sub: 'Adding 7 files (+312 / −48)' },
  { label: 'Creating commit', sub: '[feat/cache-layer 9a2f1c4] feat(cache): introduce write-through Redis cache for /api/search' },
  { label: 'Pushing to origin', sub: 'remote: Resolving deltas: 100% (12/12), done.' },
  { label: 'Opening pull request', sub: 'https://github.com/grafana/platform/pull/1247' },
];

const FIX_STEPS = [
  { label: 'Pushing safety changes to feat/cache-layer', sub: 'Added cache-stampede guard, request coalescing, and 30s TTL ceiling. (+58 / −4 across 3 files)' },
  { label: 'Implementing alert rules with suggested thresholds', sub: 'Created 4 alert rules: search-latency-p99, cache-hit-ratio, redis-evictions, error-rate-search-api' },
  { label: 'Wiring on-call escalation paths', sub: 'Routed to team-search (primary) → team-platform (secondary). Owners derived from service graph.' },
];

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

interface TerminalProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

function useSpinner(active: boolean): string {
  const [frame, setFrame] = React.useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (active) {
      timerRef.current = setInterval(() => {
        setFrame((f) => (f + 1) % SPINNER_FRAMES.length);
      }, 80);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active]);

  return SPINNER_FRAMES[frame] ?? '⠋';
}

export function Terminal({ state, dispatch }: TerminalProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const spinnerChar = useSpinner(state.phase === 'scanning' && !state.scanDone);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  });

  // Focus the input when in idle
  useEffect(() => {
    if (state.phase === 'idle') {
      inputRef.current?.focus();
    }
  }, [state.phase]);

  // Phase timers
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (state.phase === 'pushing') {
      // Schedule each push step
      let elapsed = 0;
      for (let i = 0; i < PUSH_STEPS.length; i++) {
        const stepIdx = i;
        elapsed += TIMING.pushSteps[stepIdx] ?? 600;
        timers.push(setTimeout(() => {
          dispatch({ type: 'push_step_done', index: stepIdx });
        }, elapsed));
      }
      // Then show PR box
      elapsed += TIMING.prBoxAppear;
      timers.push(setTimeout(() => dispatch({ type: 'show_pr_box' }), elapsed));
    }

    if (state.phase === 'pr_created') {
      timers.push(setTimeout(() => dispatch({ type: 'start_scanning' }), TIMING.scanPause));
    }

    if (state.phase === 'scanning') {
      timers.push(setTimeout(() => dispatch({ type: 'scan_done' }), TIMING.scanDuration));
    }

    if (state.phase === 'fixing') {
      let elapsed = 0;
      for (let i = 0; i < FIX_STEPS.length; i++) {
        const stepIdx = i;
        elapsed += TIMING.fixingSteps[stepIdx] ?? 1400;
        timers.push(setTimeout(() => {
          dispatch({ type: 'fix_step_done', index: stepIdx });
        }, elapsed));
      }
      elapsed += TIMING.doneBoxAppear;
      timers.push(setTimeout(() => dispatch({ type: 'done' }), elapsed));
    }

    return () => timers.forEach(clearTimeout);
  }, [state.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      dispatch({ type: 'start_pushing', command: inputValue.trim() });
      setInputValue('');
    }
  };

  const handleBodyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'r' || e.key === 'R') {
      dispatch({ type: 'reset' });
    }
  };

  const getStepStatus = (index: number) => {
    if (state.pushDone.includes(index)) return 'done';
    if (state.pushStep === index) return 'running';
    return 'pending';
  };

  const getFixStatus = (index: number) => {
    if (state.fixDone.includes(index)) return 'done';
    if (state.fixStep === index) return 'running';
    return 'pending';
  };

  const showPushSteps = ['pushing', 'pr_created', 'scanning', 'plan_open', 'fixing', 'done'].includes(state.phase);
  const showPrBox = ['pr_created', 'scanning', 'plan_open', 'fixing', 'done'].includes(state.phase);
  const showScan = ['scanning', 'plan_open', 'fixing', 'done'].includes(state.phase);
  const showFix = ['fixing', 'done'].includes(state.phase);
  const showDoneBox = state.phase === 'done';

  return (
    <div
      className="terminal-body"
      ref={bodyRef}
      role="log"
      aria-live="polite"
      aria-label="Claude Code terminal"
      onKeyDown={handleBodyKeyDown}
      tabIndex={-1}
      style={{ outline: 'none' }}
    >
      <ClaudeBanner />

      {/* Submitted command */}
      {state.phase !== 'idle' && (
        <div className="prompt-line" style={{ marginBottom: 12 }}>
          <span className="prompt-line__chevron">&gt;</span>
          <span className="prompt-line__text">{state.typedText}</span>
        </div>
      )}

      {/* Live input prompt */}
      {state.phase === 'idle' && (
        <div className="prompt-line prompt-line--input" style={{ marginBottom: 4 }}>
          <span className="prompt-line__chevron">&gt;</span>
          <input
            ref={inputRef}
            className="prompt-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Terminal input"
          />
        </div>
      )}

      {/* Push steps */}
      {showPushSteps && (
        <div style={{ marginBottom: 8 }}>
          {PUSH_STEPS.map((step, i) => {
            const status = getStepStatus(i);
            // In pushing phase: only show steps up to current running step
            if (state.phase === 'pushing' && i > state.pushStep) return null;
            return (
              <StepLine
                key={i}
                status={status}
                label={step.label}
                subLine={status === 'done' ? step.sub : undefined}
              />
            );
          })}
        </div>
      )}

      {/* PR Success Box */}
      {showPrBox && (
        <Box
          lines={[
            { text: '● Pull request opened', type: 'bullet' },
            { text: '' },
            { text: '   #1247  feat(cache): introduce write-through Redis cache' },
            { text: '   feat/cache-layer → main' },
            { text: '   7 files changed · +312 −48' },
          ]}
          width={63}
        />
      )}

      {/* Scanning / agent section */}
      {showScan && (
        <div className="scan-block">
          <div className="scan-block__header">
            <span
              className={state.scanDone ? 'step-line__glyph step-line__glyph--done' : 'step-line__glyph step-line__glyph--running'}
              aria-hidden="true"
            >
              {state.scanDone ? '●' : '⏺'}
            </span>
            &nbsp;
            <span>
              {state.scanDone
                ? 'grafana-risk-agent · 4 risks identified'
                : 'grafana-risk-agent · auto-triggered by PR #1247'}
            </span>
            {!state.scanDone && (
              <span className="spinner" aria-hidden="true" style={{ marginLeft: 6 }}>
                {spinnerChar}
              </span>
            )}
          </div>
          <div className="scan-block__sub">
            {state.scanDone
              ? null
              : 'Analyzing diff against past incidents and SLO history…'}
          </div>

          {state.scanDone && (
            <>
              <div style={{ height: 8 }} />
              <Box
                lines={[
                  { text: '  4 predicted risks · 3 similar past incidents' },
                  { text: '' },
                  { text: '  Open the prevention plan:' },
                  {
                    text: '  → https://ephemeral-pr1247.grafana-risk.app/plan',
                    type: 'link',
                    onLinkClick: () => dispatch({ type: 'open_browser' }),
                  },
                ]}
                width={61}
              />
              <div className="terminal-hint" style={{ marginTop: 4 }}>
                Press the link, or run /fix-all to apply remediations now.
              </div>
            </>
          )}
        </div>
      )}

      {/* Fixing section */}
      {showFix && (
        <div style={{ marginTop: 16 }}>
          <div className="step-line" style={{ marginBottom: 8 }}>
            <div className="step-line__main">
              <span className="step-line__glyph step-line__glyph--done" aria-hidden="true">●</span>
              &nbsp;
              <span>grafana-risk-agent · applying remediation plan for PR #1247</span>
            </div>
          </div>
          {FIX_STEPS.map((step, i) => {
            const status = getFixStatus(i);
            // Only show steps up to and including the currently active one
            if (i > state.fixStep) return null;
            return (
              <StepLine
                key={i}
                status={status}
                label={step.label}
                subLine={status === 'done' ? step.sub : undefined}
              />
            );
          })}
        </div>
      )}

      {/* Done Box */}
      {showDoneBox && (
        <Box
          lines={[
            { text: '● Remediation plan applied', type: 'bullet' },
            { text: '' },
            { text: '   PR #1247 updated · 4/4 risks mitigated' },
            { text: '   Predicted error rate: 4.8% → 0.3%' },
            { text: '' },
            {
              text: '   View updated plan: → https://ephemeral-pr1247.grafana-risk.app/plan',
              type: 'link',
              onLinkClick: () => dispatch({ type: 'focus_window', window: 'browser' }),
            },
          ]}
          width={67}
        />
      )}
    </div>
  );
}
