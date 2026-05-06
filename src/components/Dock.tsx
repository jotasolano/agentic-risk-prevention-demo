import React from 'react';
import { Icon } from './Icon';
import '../styles/desktop.css';

interface DockProps {
  terminalActive: boolean;
  browserActive: boolean;
}

export function Dock({ terminalActive, browserActive }: DockProps) {
  const items = [
    { key: 'finder', icon: 'finder', label: 'Finder', active: false, bg: 'transparent' },
    { key: 'terminal', icon: 'terminal-icon', label: 'Terminal', active: terminalActive, bg: 'transparent' },
    { key: 'chrome', icon: 'chrome-icon', label: 'Google Chrome', active: browserActive, bg: 'transparent' },
    { key: 'slack', icon: 'slack-icon', label: 'Slack', active: false, bg: 'transparent' },
    { key: 'vscode', icon: 'vscode-icon', label: 'Visual Studio Code', active: false, bg: 'transparent' },
    { key: 'settings', icon: 'settings-icon', label: 'System Settings', active: false, bg: 'transparent' },
  ];

  return (
    <div className="dock" role="toolbar" aria-label="Dock">
      {items.map((item, i) => (
        <React.Fragment key={item.key}>
          {i === 5 && <div className="dock__separator" />}
          <div
            className="dock__item"
            role="button"
            tabIndex={-1}
            aria-label={item.label}
            title={item.label}
          >
            <div className="dock__item-icon">
              <Icon name={item.icon} size={44} />
            </div>
            {item.active && <div className="dock__item-dot" />}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
