import React from 'react';

export interface BoxLine {
  text: string;
  type?: 'normal' | 'bullet' | 'link';
  onLinkClick?: () => void;
}

interface BoxProps {
  lines: BoxLine[];
  width?: number;
}

export function Box({ lines, width = 63 }: BoxProps) {
  const top = `╭${'─'.repeat(width + 2)}╮`;
  const bottom = `╰${'─'.repeat(width + 2)}╯`;

  const renderLine = (line: BoxLine, idx: number) => {
    const padLen = Math.max(0, width - line.text.length);
    const paddedText = line.text + ' '.repeat(padLen);

    // Bullet line: color the ●
    if (line.type === 'bullet') {
      const parts = paddedText.split('●');
      return (
        <div key={idx} style={{ display: 'flex' }}>
          <span>{'│ '}</span>
          {parts[0]}
          <span className="ansi-box__bullet">●</span>
          {parts[1]}
          <span>{' │'}</span>
        </div>
      );
    }

    // Link line: render the URL as a button
    if (line.type === 'link' && line.onLinkClick) {
      const arrowIdx = line.text.indexOf('→');
      if (arrowIdx !== -1) {
        const before = line.text.substring(0, arrowIdx + 2); // include → and space
        const urlPart = line.text.substring(arrowIdx + 2).trim();
        const afterPad = ' '.repeat(Math.max(0, width - before.length - urlPart.length));
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
            <span>{'│ '}</span>
            <span>{before}</span>
            <button
              className="ansi-box__link terminal-url"
              onClick={line.onLinkClick}
              aria-label={`Open ${urlPart}`}
            >
              {urlPart}
            </button>
            <span>{afterPad}</span>
            <span>{' │'}</span>
          </div>
        );
      }
    }

    // Normal line
    return (
      <div key={idx}>{'│ '}{paddedText}{' │'}</div>
    );
  };

  return (
    <div className="ansi-box">
      <div>{top}</div>
      {lines.map((line, idx) => renderLine(line, idx))}
      <div>{bottom}</div>
    </div>
  );
}
