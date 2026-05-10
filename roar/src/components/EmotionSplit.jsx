'use client';

import { motion } from 'framer-motion';
import { MOCK_EMOTION_DISTRIBUTION, TEAMS, EMOTIONS } from '../lib/constants';

export default function EmotionSplit({ selectedTeam }) {
  const opponentTeam = selectedTeam === 'RCB' ? 'DC' : 'RCB';
  const team = TEAMS[selectedTeam] || TEAMS.RCB;
  const opponent = TEAMS[opponentTeam];

  // Simulate different distributions for each team
  const teamDist = {
    euphoric: 52, nervous: 20, devastated: 3, disbelief: 8, furious: 2, hopeful: 15,
  };
  const opponentDist = {
    euphoric: 5, nervous: 15, devastated: 38, disbelief: 22, furious: 12, hopeful: 8,
  };

  return (
    <div className="w-full glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold tracking-wider uppercase"
          style={{ color: 'var(--color-text-muted)' }}>
          Emotion Split
        </span>
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Live
        </span>
      </div>

      {/* Team headers */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ background: team.gradient }} />
          <span className="text-sm font-bold">{team.short}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{opponent.short}</span>
          <div className="w-4 h-4 rounded-full" style={{ background: opponent.gradient }} />
        </div>
      </div>

      {/* Distribution bars */}
      {EMOTIONS.map((emotion) => (
        <div key={emotion.id} className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs tabular-nums" style={{ color: emotion.color }}>
              {teamDist[emotion.id]}%
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {emotion.icon} {emotion.label}
            </span>
            <span className="text-xs tabular-nums" style={{ color: emotion.color }}>
              {opponentDist[emotion.id]}%
            </span>
          </div>
          <div className="flex items-center gap-1 h-2">
            {/* Team bar (right aligned) */}
            <div className="flex-1 flex justify-end">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${teamDist[emotion.id]}%` }}
                transition={{ duration: 1, delay: 0.1 }}
                className="h-full rounded-l-full"
                style={{ background: team.color, maxWidth: '100%' }}
              />
            </div>
            {/* Opponent bar (left aligned) */}
            <div className="flex-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${opponentDist[emotion.id]}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full rounded-r-full"
                style={{ background: opponent.color, maxWidth: '100%' }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
