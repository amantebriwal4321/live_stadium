'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TEAMS } from '../lib/constants';

export default function MomentGroup({ group, selectedTeam, onDismiss }) {
  if (!group) return null;

  const team = TEAMS[selectedTeam] || TEAMS.RCB;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="glass-strong rounded-2xl p-5 w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ background: 'var(--color-euphoric)' }}
            />
            <span className="text-xs font-bold tracking-wider uppercase"
              style={{ color: 'var(--color-euphoric)' }}>
              Moment Group
            </span>
          </div>
          <button onClick={onDismiss}
            className="text-xs px-2 py-1 rounded-lg cursor-pointer"
            style={{ color: 'var(--color-text-muted)', background: 'rgba(255,255,255,0.05)' }}>
            ✕
          </button>
        </div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-bold mb-4"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          You and {group.members.length - 1} others just lost their minds.
        </motion.p>

        {/* Members */}
        <div className="flex flex-wrap gap-2 mb-4">
          {group.members.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: TEAMS[member.team]?.color + '20',
                border: `1px solid ${TEAMS[member.team]?.color}30`,
              }}
            >
              <div className="w-2 h-2 rounded-full"
                style={{ background: TEAMS[member.team]?.color }} />
              <span className="text-xs font-medium">{member.name}</span>
            </motion.div>
          ))}
        </div>

        {/* Emoji reaction */}
        <div className="flex items-center gap-2 pt-3"
          style={{ borderTop: '1px solid var(--color-stadium-border)' }}>
          <span className="text-xl">🔥</span>
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            All feeling <span className="font-bold" style={{ color: 'var(--color-euphoric)' }}>
              {group.emotion}
            </span> at the same time
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
