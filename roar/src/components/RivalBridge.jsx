'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEAMS, MOCK_FANS } from '../lib/constants';

export default function RivalBridge({ active, onClose, selectedTeam }) {
  const [phase, setPhase] = useState('matching'); // matching, connected, ended
  const [timer, setTimer] = useState(90);
  const [starterMessage, setStarterMessage] = useState('');
  const timerRef = useRef(null);

  const opponentTeam = selectedTeam === 'RCB' ? 'DC' : 'RCB';
  const team = TEAMS[selectedTeam] || TEAMS.RCB;
  const opponent = TEAMS[opponentTeam];

  // Find an opponent fan
  const rivalFan = MOCK_FANS.find(f => f.team === opponentTeam) || MOCK_FANS[1];

  useEffect(() => {
    if (!active) {
      setPhase('matching');
      setTimer(90);
      return;
    }

    // Simulate matching delay
    const matchTimer = setTimeout(() => {
      setPhase('connected');
      setStarterMessage(`You both lost it at over 18.6. For different reasons.`);

      // Start countdown
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setPhase('ended');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 3000);

    return () => {
      clearTimeout(matchTimer);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex flex-col"
        style={{ background: 'var(--color-stadium-dark)' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white/60 z-20 cursor-pointer text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center py-4 z-10">
          <span className="text-xs tracking-[0.3em] uppercase font-semibold"
            style={{ color: 'var(--color-text-muted)' }}>
            Rival Bridge
          </span>
          {phase === 'connected' && (
            <div className="mt-1">
              <span className="text-sm font-bold tabular-nums"
                style={{ color: timer <= 10 ? 'var(--color-furious)' : 'var(--color-text-secondary)' }}>
                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        {/* Matching state */}
        {phase === 'matching' && (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 mx-auto rounded-full border-2 border-t-transparent"
                style={{ borderColor: 'var(--color-text-muted)', borderTopColor: 'transparent' }}
              />
              <p className="text-lg font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Finding someone who felt the opposite...
              </p>
            </motion.div>
          </div>
        )}

        {/* Connected state — split screen */}
        {phase === 'connected' && (
          <div className="flex-1 flex flex-col md:flex-row">
            {/* Your side */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 flex flex-col items-center justify-center p-6"
              style={{
                background: `linear-gradient(180deg, ${team.color}15 0%, transparent 100%)`,
                borderRight: '1px solid var(--color-stadium-border)',
              }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 text-2xl font-black"
                style={{ background: team.gradient, fontFamily: 'Outfit, sans-serif' }}>
                {team.short.charAt(0)}
              </div>
              <span className="text-lg font-bold mb-1">You</span>
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ background: `${team.color}20`, color: team.color }}>
                {team.short} • Euphoric 🔥
              </span>
            </motion.div>

            {/* Divider with AI message */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="glass-strong rounded-2xl p-4 max-w-xs text-center pointer-events-auto"
              >
                <p className="text-xs tracking-wider uppercase mb-2"
                  style={{ color: 'var(--color-text-muted)' }}>
                  AI Conversation Starter
                </p>
                <p className="text-sm font-medium leading-relaxed"
                  style={{ fontFamily: 'Outfit, sans-serif' }}>
                  "{starterMessage}"
                </p>
              </motion.div>
            </div>

            {/* Rival side */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex-1 flex flex-col items-center justify-center p-6"
              style={{
                background: `linear-gradient(180deg, ${opponent.color}15 0%, transparent 100%)`,
              }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 text-2xl font-black"
                style={{ background: opponent.gradient, fontFamily: 'Outfit, sans-serif' }}>
                {opponent.short.charAt(0)}
              </div>
              <span className="text-lg font-bold mb-1">{rivalFan.name}</span>
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ background: `${opponent.color}20`, color: opponent.color }}>
                {opponent.short} • Devastated 💀
              </span>
            </motion.div>
          </div>
        )}

        {/* Ended state */}
        {phase === 'ended' && (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4 p-6"
            >
              <p className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
                This moment is saved.
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Check in next match.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-bold text-sm tracking-wider cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                BACK TO MATCH
              </motion.button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
