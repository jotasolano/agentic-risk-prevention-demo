import React from 'react';

const WIDTH = 49; // inner width (between │ space and space │)

function padRight(s: string): string {
  return s + ' '.repeat(Math.max(0, WIDTH - s.length));
}

// Each entry: [content, hasAccent]
const BANNER_LINES: Array<[string, boolean]> = [
  [padRight(' ✻ Welcome to Claude Code!'), true],
  [padRight(''), false],
  [padRight('   /help for help, /status for your current setup'), false],
  [padRight(''), false],
  [padRight('   cwd: ~/work/grafana-platform'), false],
];

export function ClaudeBanner() {
  const top = `╭${'─'.repeat(WIDTH + 2)}╮`;
  const bottom = `╰${'─'.repeat(WIDTH + 2)}╯`;

  return (
    <div className="claude-banner" aria-label="Claude Code welcome message">
      <div>{top}</div>
      {BANNER_LINES.map(([content, hasAccent], i) => {
        if (!hasAccent) {
          return <div key={i}>{'│ '}{content}{' │'}</div>;
        }
        // Split on ✻ to colorize it
        const parts = content.split('✻');
        return (
          <div key={i}>
            {'│ '}
            {parts[0]}
            <span className="claude-banner__accent">✻</span>
            {parts[1]}
            {' │'}
          </div>
        );
      })}
      <div>{bottom}</div>
    </div>
  );
}
