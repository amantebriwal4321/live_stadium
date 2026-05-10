'use client';

import { motion } from 'framer-motion';
import { TEAMS } from '../lib/constants';

export default function TribalNarrator({ narratorText, isNarrating, selectedTeam }) {
  const opponentTeam = selectedTeam === 'RCB' ? 'DC' : 'RCB';
  const team = TEAMS[selectedTeam] || TEAMS.RCB;
  const opponent = TEAMS[opponentTeam];

  if (!narratorText.india && !narratorText.opponent) return null;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold tracking-wider uppercase"
          style={{ color: 'var(--color-text-muted)' }}>
          Tribal Narrator
        </span>
        {isNarrating && (
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--color-euphoric)' }}
          />
        )}
      </div>

      {/* Team perspective */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative rounded-xl p-4 overflow-hidden"
        style={{
          background: `${team.color}10`,
          border: `1px solid ${team.color}25`,
        }}
      >
        {/* Accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: team.color }} />

        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: team.gradient, fontSize: '0.5rem', fontWeight: 900 }}>
            {team.short}
          </div>
          <span className="text-xs font-bold tracking-wider uppercase" style={{ color: team.color }}>
            {team.fans}
          </span>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)', fontStyle: 'italic' }}>
          "{narratorText.india}"
          {isNarrating && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-0.5 h-4 ml-0.5 align-middle"
              style={{ background: team.color }}
            />
          )}
        </p>
      </motion.div>

      {/* Opponent perspective */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="relative rounded-xl p-4 overflow-hidden"
        style={{
          background: `${opponent.color}10`,
          border: `1px solid ${opponent.color}25`,
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: opponent.color }} />

        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: opponent.gradient, fontSize: '0.5rem', fontWeight: 900 }}>
            {opponent.short}
          </div>
          <span className="text-xs font-bold tracking-wider uppercase" style={{ color: opponent.color }}>
            {opponent.fans}
          </span>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)', fontStyle: 'italic' }}>
          "{narratorText.opponent}"
          {isNarrating && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-0.5 h-4 ml-0.5 align-middle"
              style={{ background: opponent.color }}
            />
          )}
        </p>
      </motion.div>
    </div>
  );
}
