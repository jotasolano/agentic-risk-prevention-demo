import React from 'react';

interface SparklineProps {
  values: number[];
  deployIdx: number;
  width?: number;
  height?: number;
}

export function Sparkline({ values, deployIdx, width = 180, height = 40 }: SparklineProps) {
  const padding = 3;

  // Use a stable ID derived from values to avoid hydration issues
  const id = React.useId();
  const gradientId = `sg-${id}`;

  const allMax = Math.max(...values);
  const allMin = Math.min(...values);
  const range = allMax - allMin || 1;
  const stepX = (width - 2 * padding) / (values.length - 1);

  const getX = (i: number) => padding + i * stepX;
  const getY = (v: number) => height - padding - ((v - allMin) / range) * (height - 2 * padding);

  // Current line using global scale (up to and including deployIdx)
  const currentPath = values
    .slice(0, deployIdx + 1)
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(v).toFixed(1)}`)
    .join(' ');

  // Predicted line using global scale
  const predictedPath = values
    .slice(deployIdx)
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(deployIdx + i).toFixed(1)} ${getY(v).toFixed(1)}`)
    .join(' ');

  // Area fill under predicted line
  const areaPath = (() => {
    const pts = values.slice(deployIdx).map((v, i) => ({
      x: getX(deployIdx + i),
      y: getY(v),
    }));
    if (pts.length < 2) return '';
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const lastPt = pts[pts.length - 1]!;
    const firstPt = pts[0]!;
    const close = ` L ${lastPt.x.toFixed(1)} ${(height - padding).toFixed(1)} L ${firstPt.x.toFixed(1)} ${(height - padding).toFixed(1)} Z`;
    return line + close;
  })();

  const deployX = getX(deployIdx);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e02f44" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#e02f44" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Area fill under predicted */}
      {areaPath && (
        <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      )}

      {/* Current line (green, solid) */}
      <path
        d={currentPath}
        fill="none"
        stroke="#56a64b"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Predicted line (red, dashed) */}
      <path
        d={predictedPath}
        fill="none"
        stroke="#e02f44"
        strokeWidth={1.5}
        strokeDasharray="3 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Deploy vertical hairline */}
      <line
        x1={deployX}
        y1={padding}
        x2={deployX}
        y2={height - padding}
        stroke="#8e8e8e"
        strokeWidth={1}
        strokeDasharray="2 2"
        opacity={0.5}
      />

      {/* Deploy label */}
      <text
        x={deployX + 3}
        y={padding + 7}
        fontSize={8}
        fill="#8e8e8e"
        fontFamily="Inter, sans-serif"
      >
        deploy
      </text>
    </svg>
  );
}
