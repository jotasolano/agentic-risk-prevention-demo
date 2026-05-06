import React, { useRef } from 'react';
import { Window } from './Window';
import { RiskPlanPage } from './Grafana/RiskPlanPage';
import { AppState, Action } from '../state';
import '../styles/browser.css';

interface BrowserWindowProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  focused: boolean;
  onFocus: () => void;
  style?: React.CSSProperties;
}

export function BrowserWindow({ state, dispatch, focused, onFocus, style }: BrowserWindowProps) {
  const urlText = 'ephemeral-pr1247.grafana-risk.app/plan';

  const handleFixAll = () => {
    dispatch({ type: 'fix_all_clicked' });
  };

  const handleFixRisk = (id: string) => {
    dispatch({ type: 'fix_risk', id });
  };

  return (
    <Window
      className="browser-window"
      focused={focused}
      onFocus={onFocus}
      onClose={() => dispatch({ type: 'close_browser' })}
      style={style}
    >
      <div className="browser-chrome">
        {/* Tab strip */}
        <div className="browser-tabs">
          <div className="browser-tab" role="tab" aria-selected="true">
            {/* Grafana favicon */}
            <span className="browser-tab__favicon" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" fill="#F6BE00" />
                <circle cx="16" cy="16" r="9" fill="#FF7F00" />
                <circle cx="16" cy="16" r="4" fill="#E02F44" />
              </svg>
            </span>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Risk Prevention · PR #1247 — Grafana
            </span>
            <span className="browser-tab__close" aria-label="Close tab" onClick={() => dispatch({ type: 'close_browser' })}>
              ×
            </span>
          </div>
        </div>

        {/* Address bar */}
        <div className="browser-addressbar">
          {/* Nav buttons */}
          <button className="browser-nav-btn" aria-label="Go back" onClick={() => {}}>‹</button>
          <button className="browser-nav-btn" aria-label="Go forward" onClick={() => {}}>›</button>
          <button className="browser-nav-btn" aria-label="Reload page" onClick={() => {}}>↻</button>

          {/* URL bar */}
          <div className="browser-urlbar" onClick={() => {}}>
            <span className="browser-urlbar__lock" aria-hidden="true">🔒</span>
            <span className="browser-urlbar__text">{urlText}</span>
          </div>

          {/* Extra controls */}
          <button className="browser-nav-btn" aria-label="Bookmark" onClick={() => {}}>☆</button>
        </div>

        {/* Content */}
        <div className="browser-content">
          <RiskPlanPage
            onFixAll={handleFixAll}
            fixedRisks={state.fixedRisks}
            onFixRisk={handleFixRisk}
            phase={state.phase}
          />
        </div>
      </div>
    </Window>
  );
}
