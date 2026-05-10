import React from 'react';
import PressureChart from './PressureChart';

const TENSION_COLORS = {
  LOW: '#22c55e',
  MEDIUM: '#f59e0b',
  HIGH: '#ef4444',
  CRITICAL: '#7c3aed',
};

function getBallDotClass(event) {
  if (!event) return 'dot-ball';
  switch (event.outcome) {
    case 'Wicket': return 'wicket';
    case 'Six': return 'six';
    case 'Four': return 'four';
    case 'Single':
    case 'Two':
    case 'Three': return 'single';
    case 'Wide':
    case 'No Ball': return 'extra';
    default: return 'dot-ball';
  }
}

function getBallDotLabel(event) {
  if (!event) return '•';
  switch (event.outcome) {
    case 'Wicket': return 'W';
    case 'Six': return '6';
    case 'Four': return '4';
    case 'Single': return '1';
    case 'Two': return '2';
    case 'Three': return '3';
    case 'Dot': return '•';
    case 'Wide': return 'Wd';
    case 'No Ball': return 'Nb';
    default: return '•';
  }
}

export default function ScorePanel({ matchState, pressureScore, source }) {
  if (!matchState) {
    return (
      <div className="p-4">
        <p className="text-text-muted text-sm italic text-center mt-8">
          Waiting for match setup...
        </p>
      </div>
    );
  }

  const tensionLevel = matchState.tensionLevel || 'LOW';
  const tensionColor = TENSION_COLORS[tensionLevel];
  const rrr = matchState.ballsRemaining > 0
    ? ((matchState.runsRequired / matchState.ballsRemaining) * 6).toFixed(2)
    : '0.00';
  const currentRR = matchState.totalBalls > 0
    ? (matchState.runs / (matchState.totalBalls / 6)).toFixed(2)
    : '0.00';

  // Tension bar fill percentage based on pressure score
  const tensionFill = pressureScore || 0;

  return (
    <div className="p-4 flex flex-col h-full overflow-y-auto">
      {/* Team Score */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Scoreboard
          </h3>
          {source === 'live_api' ? (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#22c55e', animation: 'criticalPulse 1.2s ease-in-out infinite' }}
              />
              LIVE
            </span>
          ) : (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}
            >
              MANUAL
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-text-primary">
          {matchState.battingTeam}{' '}
          <span style={{ color: 'var(--accent-rcb)' }}>
            {matchState.runs}/{matchState.wickets}
          </span>
        </div>
        <div className="text-sm text-text-secondary mt-1">
          {matchState.overs} overs
        </div>
        {matchState.runsRequired > 0 && (
          <div className="text-xs text-text-muted mt-1">
            Need {matchState.runsRequired} off {matchState.ballsRemaining} balls
          </div>
        )}
      </div>

      {/* Run Rates */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="text-xs text-text-muted uppercase mb-1">Current RR</div>
          <div className="text-lg font-bold text-text-primary">{currentRR}</div>
        </div>
        <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="text-xs text-text-muted uppercase mb-1">Required RR</div>
          <div className="text-lg font-bold" style={{ color: tensionColor }}>{rrr}</div>
        </div>
      </div>

      {/* Tension Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-secondary uppercase">Tension</span>
          <span
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: tensionColor }}
          >
            {tensionLevel}
          </span>
        </div>
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: '12px', background: 'rgba(255,255,255,0.06)' }}
        >
          <div
            className={tensionLevel === 'CRITICAL' ? 'tension-critical-pulse' : ''}
            style={{
              height: '100%',
              width: `${tensionFill}%`,
              backgroundColor: tensionColor,
              borderRadius: '9999px',
              transition: 'width 0.8s ease, background-color 0.8s ease',
            }}
          />
        </div>
      </div>

      {/* Last 6 Balls */}
      <div className="mb-4">
        <h4 className="text-xs text-text-secondary uppercase mb-2">Last 6 Balls</h4>
        <div className="flex gap-2 justify-center">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const event = matchState.recentEvents?.[i];
            return (
              <div
                key={i}
                className={`ball-dot ${getBallDotClass(event)}`}
              >
                {getBallDotLabel(event)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pressure Chart */}
      <div className="flex-1 min-h-[180px]">
        <h4 className="text-xs text-text-secondary uppercase mb-2">Pressure Over Time</h4>
        <PressureChart
          data={matchState.pressureHistory || []}
          tensionColor={tensionColor}
        />
      </div>
    </div>
  );
}
