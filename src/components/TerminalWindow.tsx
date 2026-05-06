import React from 'react';
import { Window } from './Window';
import { Terminal } from './Terminal/Terminal';
import { AppState, Action } from '../state';

interface TerminalWindowProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  focused: boolean;
  onFocus: () => void;
  style?: React.CSSProperties;
}

export function TerminalWindow({ state, dispatch, focused, onFocus, style }: TerminalWindowProps) {
  return (
    <Window
      className="terminal-window"
      title="claude — -zsh — 100×30"
      titleColor="var(--term-dim)"
      titleBarBg="var(--term-bg-titlebar)"
      focused={focused}
      onFocus={onFocus}
      style={style}
    >
      <Terminal state={state} dispatch={dispatch} />
    </Window>
  );
}
