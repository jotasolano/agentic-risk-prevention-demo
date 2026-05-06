import React from 'react';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  'aria-label'?: string;
}

export function Icon({ name, size = 16, color = 'currentColor', 'aria-label': ariaLabel }: IconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-label': ariaLabel,
    'aria-hidden': ariaLabel ? undefined : true,
  };

  switch (name) {
    case 'home':
      return (
        <svg {...props}>
          <path d="M2 7L8 2l6 5v7a1 1 0 01-1 1H9v-3H7v3H3a1 1 0 01-1-1V7z" />
        </svg>
      );
    case 'dashboards':
      return (
        <svg {...props}>
          <rect x="2" y="2" width="5" height="5" rx="0.5" />
          <rect x="9" y="2" width="5" height="5" rx="0.5" />
          <rect x="2" y="9" width="5" height="5" rx="0.5" />
          <rect x="9" y="9" width="5" height="5" rx="0.5" />
        </svg>
      );
    case 'explore':
      return (
        <svg {...props}>
          <circle cx="8" cy="8" r="6" />
          <path d="M10.5 5.5l-2 4.5-4.5 2 2-4.5 4.5-2z" />
          <circle cx="8" cy="8" r="1" fill={color} stroke="none" />
        </svg>
      );
    case 'alerting':
      return (
        <svg {...props}>
          <path d="M8 2l6 11H2L8 2z" />
          <line x1="8" y1="7" x2="8" y2="9.5" />
          <circle cx="8" cy="11.5" r="0.5" fill={color} stroke="none" />
        </svg>
      );
    case 'connections':
      return (
        <svg {...props}>
          <circle cx="3.5" cy="8" r="2" />
          <circle cx="12.5" cy="3.5" r="2" />
          <circle cx="12.5" cy="12.5" r="2" />
          <line x1="5.5" y1="8" x2="10.5" y2="4" />
          <line x1="5.5" y1="8" x2="10.5" y2="12" />
        </svg>
      );
    case 'admin':
      return (
        <svg {...props}>
          <circle cx="8" cy="5" r="3" />
          <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        </svg>
      );
    case 'grafana-logo':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
          <circle cx="16" cy="16" r="15" fill="#F6BE00" />
          <circle cx="16" cy="16" r="9" fill="#FF7F00" />
          <circle cx="16" cy="16" r="4" fill="#E02F44" />
        </svg>
      );
    case 'arrow-right':
      return (
        <svg {...props} viewBox="0 0 12 12">
          <line x1="2" y1="6" x2="10" y2="6" />
          <polyline points="6,2 10,6 6,10" />
        </svg>
      );
    case 'wifi':
      return (
        <svg {...props} viewBox="0 0 16 16">
          <path d="M1 6c1.8-2 4.2-3 7-3s5.2 1 7 3" />
          <path d="M3.5 8.5c1.2-1.3 2.8-2 4.5-2s3.3.7 4.5 2" />
          <path d="M6 11c.5-.6 1.2-1 2-1s1.5.4 2 1" />
          <circle cx="8" cy="13" r="1" fill={color} stroke="none" />
        </svg>
      );
    case 'battery':
      return (
        <svg {...props} viewBox="0 0 20 16">
          <rect x="1" y="4" width="15" height="8" rx="1.5" />
          <path d="M17 6.5v3" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="2.5" y="5.5" width="11" height="5" rx="0.5" fill={color} stroke="none" opacity="0.5" />
        </svg>
      );
    case 'finder':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-hidden>
          <rect width="44" height="44" rx="10" fill="#1B7AEA" />
          <rect width="44" height="44" rx="10" fill="url(#finderGrad)" />
          <circle cx="15" cy="22" r="8" fill="#E8E8E8" />
          <circle cx="29" cy="22" r="8" fill="#3A3A3A" />
          <circle cx="15" cy="22" r="3" fill="#1A7AEA" />
          <circle cx="29" cy="22" r="3" fill="#6CC1FF" />
          <defs>
            <linearGradient id="finderGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#5EB5F7" />
              <stop offset="100%" stopColor="#1A5AE8" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'terminal-icon':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-hidden>
          <rect width="44" height="44" rx="10" fill="#1A1A1A" />
          <polyline points="10,16 18,22 10,28" stroke="#56D364" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <line x1="20" y1="28" x2="34" y2="28" stroke="#56D364" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'chrome-icon':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-hidden>
          <rect width="44" height="44" rx="10" fill="#fff" />
          <circle cx="22" cy="22" r="10" fill="#fff" />
          <circle cx="22" cy="22" r="7" fill="#4285F4" />
          <path d="M22 22m-10 0 a10 10 0 0 1 10-10 l7 0" stroke="#EA4335" strokeWidth="6" fill="none" />
          <path d="M22 22l8.66 5-5-8.66" stroke="#FBBC04" strokeWidth="6" fill="none" />
          <path d="M22 22l-8.66 5 5-8.66" stroke="#34A853" strokeWidth="6" fill="none" />
          <circle cx="22" cy="22" r="5" fill="white" />
        </svg>
      );
    case 'slack-icon':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-hidden>
          <rect width="44" height="44" rx="10" fill="#4A154B" />
          <g transform="translate(8,8)">
            <rect x="0" y="10" width="5" height="8" rx="2.5" fill="#E01E5A" />
            <rect x="0" y="14" width="13" height="5" rx="2.5" fill="#E01E5A" />
            <rect x="10" y="0" width="8" height="5" rx="2.5" fill="#36C5F0" />
            <rect x="10" y="0" width="5" height="13" rx="2.5" fill="#36C5F0" />
            <rect x="23" y="10" width="5" height="8" rx="2.5" fill="#2EB67D" />
            <rect x="15" y="14" width="13" height="5" rx="2.5" fill="#2EB67D" />
            <rect x="10" y="23" width="8" height="5" rx="2.5" fill="#ECB22E" />
            <rect x="10" y="15" width="5" height="13" rx="2.5" fill="#ECB22E" />
          </g>
        </svg>
      );
    case 'vscode-icon':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-hidden>
          <rect width="44" height="44" rx="10" fill="#0066B8" />
          <path d="M30 8L18 20l-6-5-4 3v14l4 3 6-5 12 12 6-3V11l-6-3z" fill="white" opacity="0.9" />
        </svg>
      );
    case 'settings-icon':
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-hidden>
          <rect width="44" height="44" rx="10" fill="#636366" />
          <circle cx="22" cy="22" r="6" stroke="white" strokeWidth="2" fill="none" />
          <path d="M22 8v4M22 32v4M8 22h4M32 22h4M12 12l2.8 2.8M29.2 29.2l2.8 2.8M12 32l2.8-2.8M29.2 14.8l2.8-2.8" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'close':
      return (
        <svg {...props} viewBox="0 0 10 10">
          <line x1="2" y1="2" x2="8" y2="8" strokeWidth={1.5} />
          <line x1="8" y1="2" x2="2" y2="8" strokeWidth={1.5} />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="8" cy="8" r="6" />
        </svg>
      );
  }
}
