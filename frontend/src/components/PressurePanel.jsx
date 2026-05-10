import React, { useMemo } from 'react';

export default function PressurePanel({ pressureScore, psychRead, currentBatsman }) {
  const score = pressureScore || 0;

  // Determine color based on score
  const getColor = (s) => {
    if (s <= 30) return '#22c55e';    // green
    if (s <= 60) return '#f59e0b';    // amber
    if (s <= 85) return '#ef4444';    // red
    return '#7c3aed';                 // purple
  };

  const color = getColor(score);

  // SVG arc calculations
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const fillPercent = score / 100;
  const dashOffset = circumference * (1 - fillPercent);

  // Determine if pulse should be active
  const shouldPulse = score > 75;

  return (
    <div className="p-4 flex flex-col items-center">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
        Pressure Index
      </h3>

      {/* Batsman Name */}
      {currentBatsman && (
        <p className="text-sm font-semibold text-text-primary mb-3 text-center">
          {currentBatsman}
        </p>
      )}

      {/* SVG Gauge */}
      <div className={`relative ${shouldPulse ? 'pressure-pulse' : ''}`}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Background arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#222244"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Foreground arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 100 100)"
            style={{
              transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease',
            }}
          />
          {/* Center score */}
          <text
            x="100"
            y="95"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={color}
            fontSize="48"
            fontWeight="700"
            fontFamily="Inter, system-ui, sans-serif"
            style={{ transition: 'fill 0.5s ease' }}
          >
            {score}
          </text>
          {/* /100 label */}
          <text
            x="100"
            y="125"
            textAnchor="middle"
            fill="#7777aa"
            fontSize="14"
            fontFamily="Inter, system-ui, sans-serif"
          >
            / 100
          </text>
        </svg>
      </div>

      {/* Pressure Level Label */}
      <div
        className="mt-2 text-xs font-bold uppercase tracking-widest"
        style={{ color }}
      >
        {score <= 30 ? 'LOW' : score <= 60 ? 'MEDIUM' : score <= 85 ? 'HIGH' : 'CRITICAL'}
      </div>

      {/* Psych Read */}
      <div className="mt-4 px-2">
        {psychRead ? (
          <p
            className="text-sm italic leading-relaxed text-center"
            style={{ color: 'var(--text-secondary)' }}
          >
            "{psychRead}"
          </p>
        ) : (
          <p
            className="text-sm italic text-center"
            style={{ color: 'var(--text-muted)' }}
          >
            Awaiting first delivery...
          </p>
        )}
      </div>
    </div>
  );
}
