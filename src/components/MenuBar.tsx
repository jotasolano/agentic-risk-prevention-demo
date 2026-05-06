import React, { useState, useEffect } from 'react';
import '../styles/desktop.css';

interface MenuBarProps {
  focusedApp: string;
  onReset: () => void;
}

function formatTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export function MenuBar({ focusedApp, onReset }: MenuBarProps) {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    const tick = () => setTime(formatTime(new Date()));

    const initialTimer = setTimeout(() => {
      tick();
      const interval = setInterval(tick, 60_000);
      return () => clearInterval(interval);
    }, msUntilNextMinute);

    return () => clearTimeout(initialTimer);
  }, []);

  const menus = ['File', 'Edit', 'View', 'Window', 'Help'];

  return (
    <div className="menu-bar">
      <div className="menu-bar__left">
        <span className="menu-bar__apple" aria-label="Apple menu"></span>
        <span className="menu-bar__app-name">{focusedApp}</span>
        <div className="menu-bar__menus" aria-hidden="true">
          {menus.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
      <div className="menu-bar__right">
        {/* Battery */}
        <span className="menu-bar__icon" aria-hidden="true">
          <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
            <rect x="0.5" y="0.5" width="18" height="11" rx="2" stroke="currentColor" strokeOpacity="0.7" />
            <rect x="19.5" y="3.5" width="2" height="5" rx="1" fill="currentColor" fillOpacity="0.5" />
            <rect x="2" y="2" width="13" height="8" rx="1" fill="currentColor" fillOpacity="0.55" />
          </svg>
        </span>
        {/* Wifi */}
        <span className="menu-bar__icon" aria-hidden="true">
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1 4c1.8-2.2 4.3-3.5 7-3.5s5.2 1.3 7 3.5" opacity="0.4" />
            <path d="M3 6.5c1.2-1.4 3-2.2 5-2.2s3.8.8 5 2.2" opacity="0.65" />
            <path d="M5.5 9c.6-.8 1.5-1.3 2.5-1.3s1.9.5 2.5 1.3" />
            <circle cx="8" cy="12" r="1.2" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <span className="menu-bar__clock" aria-live="polite" aria-label={`Current time: ${time}`}>
          {time}
        </span>
        <button
          className="menu-bar__reset"
          onClick={onReset}
          title="Reset demo to beginning"
        >
          Reset demo
        </button>
      </div>
    </div>
  );
}
