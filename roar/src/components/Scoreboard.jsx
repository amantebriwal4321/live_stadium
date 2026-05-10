'use client';

import { motion } from 'framer-motion';
import { MOCK_MATCH, TEAMS } from '../lib/constants';

export default function Scoreboard({ score, players, selectedTeam }) {
  const team = TEAMS[MOCK_MATCH.batting];
  const opponent = TEAMS[MOCK_MATCH.bowling];
  const isChasing = true;

  // Determine match situation
  let situationText = '';
  let situationColor = 'var(--color-nervous)';
  if (score.required <= 10 && score.ballsRemaining <= 6) {
    situationText = '🔥 FINAL OVER DRAMA';
    situationColor = 'var(--color-furious)';
  } else if (score.required <= 20 && score.ballsRemaining <= 12) {
    situationText = '🔥 HIGH PRESSURE MOMENT';
    situationColor = 'var(--color-euphoric)';
  } else if (score.ballsRemaining <= 18) {
    situationText = '⚡ Last 3 overs — match on the line';
    situationColor = 'var(--color-nervous)';
  } else {
    situationText = '🏏 Run chase in progress';
    situationColor = 'var(--color-hopeful)';
  }

  return (
    <div className="w-full">
      {/* Match context banner */}
      <motion.div
        key={situationText}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-2 px-4 mb-3 rounded-lg"
        style={{
          background: `${situationColor}15`,
          border: `1px solid ${situationColor}30`,
        }}
      >
        <span className="text-sm font-bold tracking-wide" style={{ color: situationColor }}>
          {situationText}
        </span>
      </motion.div>

      {/* Main scoreboard */}
      <div className="glass rounded-xl p-4">
        {/* Header: league + status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
              {MOCK_MATCH.league}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>•</span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {MOCK_MATCH.venue}
            </span>
          </div>
          <div className="live-badge">LIVE</div>
        </div>

        {/* First innings summary */}
        <div className="flex items-center gap-2 mb-2 pb-2" style={{ borderBottom: '1px solid var(--color-stadium-border)' }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: opponent.gradient, fontSize: '0.6rem' }}>
            {opponent.short}
          </div>
          <span className="text-sm font-medium">{MOCK_MATCH.firstInnings.team}</span>
          <span className="text-sm font-bold ml-auto">{MOCK_MATCH.firstInnings.score}</span>
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            ({MOCK_MATCH.firstInnings.overs} ov)
          </span>
        </div>

        {/* Current innings - MAIN SCORE */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: team.gradient, fontSize: '0.65rem' }}>
            {team.short}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {score.runs}/{score.wickets}
            </span>
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              ({score.overs} ov)
            </span>
          </div>
        </div>

        {/* Required runs */}
        <div className="flex items-center justify-between mb-3 py-2 px-3 rounded-lg"
          style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)' }}>
          <span className="text-sm font-semibold" style={{ color: 'var(--color-gold)' }}>
            Need {Math.max(0, score.required)} runs
          </span>
          <span className="text-sm" style={{ color: 'var(--color-gold)' }}>
            from {Math.max(0, score.ballsRemaining)} balls
          </span>
        </div>

        {/* Player highlights */}
        <div className="space-y-2">
          {/* Striker */}
          <div className="flex items-center justify-between py-1.5 px-3 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-hopeful)' }} />
              <span className="text-sm font-semibold">{players.striker.name}*</span>
              {players.striker.runs >= 50 && <span className="text-xs">🔥</span>}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold">{players.striker.runs}</span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                ({players.striker.balls})
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {players.striker.fours}×4 {players.striker.sixes}×6
              </span>
            </div>
          </div>

          {/* Bowler */}
          <div className="flex items-center justify-between py-1.5 px-3 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-furious)' }} />
              <span className="text-sm">{players.bowler.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm">{players.bowler.wickets}-{players.bowler.runs}</span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                ({players.bowler.overs} ov)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
