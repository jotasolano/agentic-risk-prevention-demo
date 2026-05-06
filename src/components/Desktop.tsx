import React from 'react';
import { MenuBar } from './MenuBar';
import { Dock } from './Dock';
import { TerminalWindow } from './TerminalWindow';
import { BrowserWindow } from './BrowserWindow';
import { AppState, Action } from '../state';
import '../styles/desktop.css';

interface DesktopProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export function Desktop({ state, dispatch }: DesktopProps) {
  const { focusedWindow, browserOpen, phase } = state;

  const appName = focusedWindow === 'browser' ? 'Google Chrome' : 'Terminal';

  const terminalZ = focusedWindow === 'terminal' ? 10 : 5;
  const browserZ = focusedWindow === 'browser' ? 10 : 5;

  return (
    <div className="desktop">
      <MenuBar
        focusedApp={appName}
        onReset={() => dispatch({ type: 'reset' })}
      />

      <div className="wallpaper">
        {/* Terminal Window */}
        <TerminalWindow
          state={state}
          dispatch={dispatch}
          focused={focusedWindow === 'terminal'}
          onFocus={() => dispatch({ type: 'focus_window', window: 'terminal' })}
          style={{
            width: 720,
            height: 460,
            left: 40,
            top: 30,
            zIndex: terminalZ,
          }}
        />

        {/* Browser Window */}
        {browserOpen && (
          <BrowserWindow
            state={state}
            dispatch={dispatch}
            focused={focusedWindow === 'browser'}
            onFocus={() => dispatch({ type: 'focus_window', window: 'browser' })}
            style={{
              width: 1060,
              height: 700,
              left: 120,
              top: 20,
              zIndex: browserZ,
            }}
          />
        )}

        {/* Dock */}
        <Dock
          terminalActive={true}
          browserActive={browserOpen}
        />
      </div>
    </div>
  );
}
