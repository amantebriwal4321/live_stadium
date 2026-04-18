'use client';

import { motion } from 'framer-motion';
import { TEAMS } from '../lib/constants';

export default function TeamSelect({ onSelect }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #111118 0%, #0A0A0F 100%)' }}>
      
      {/* Stadium light beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none animate-stadium-lights">
        <div className="absolute top-0 left-1/4 w-1 h-full opacity-5"
          style={{ background: 'linear-gradient(to bottom, white, transparent)', transform: 'rotate(-5deg)' }} />
        <div className="absolute top-0 left-1/2 w-1 h-full opacity-5"
          style={{ background: 'linear-gradient(to bottom, white, transparent)' }} />
        <div className="absolute top-0 right-1/4 w-1 h-full opacity-5"
          style={{ background: 'linear-gradient(to bottom, white, transparent)', transform: 'rotate(5deg)' }} />
        {/* Wider beams */}
        <div className="absolute top-0 left-1/3 w-32 h-full opacity-[0.02]"
          style={{ background: 'linear-gradient(to bottom, white, transparent)', transform: 'rotate(-3deg)' }} />
        <div className="absolute top-0 right-1/3 w-32 h-full opacity-[0.02]"
          style={{ background: 'linear-gradient(to bottom, white, transparent)', transform: 'rotate(3deg)' }} />
      </div>

      {/* ROAR wordmark */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mb-6 z-10"
      >
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter"
          style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.05em' }}>
          <span className="text-shimmer">ROAR</span>
        </h1>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="text-sm md:text-base tracking-[0.3em] uppercase mb-16 z-10"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Feel the match. Find your people.
      </motion.p>

      {/* Question */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="text-2xl md:text-4xl font-bold mb-12 z-10 text-center px-4"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        Who do you bleed for?
      </motion.h2>

      {/* Team cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.2 }}
        className="flex flex-col md:flex-row gap-6 z-10 px-4"
      >
        {Object.values(TEAMS).map((team) => (
          <motion.button
            key={team.short}
            onClick={() => onSelect(team.short)}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            className="relative group cursor-pointer no-select"
          >
            <div className="relative w-72 h-44 rounded-2xl overflow-hidden"
              style={{
                background: team.gradient,
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at center, ${team.color}40 0%, transparent 70%)`,
                }} />

              {/* Content */}
              <div className="relative flex flex-col items-center justify-center h-full p-6">
                <span className="text-4xl font-black tracking-tight mb-2"
                  style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {team.short}
                </span>
                <span className="text-sm opacity-70 tracking-wider">
                  {team.name}
                </span>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1"
                style={{ background: team.accent }} />
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* IPL 2026 badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
        className="absolute bottom-8 z-10"
      >
        <div className="flex items-center gap-3 text-xs tracking-widest uppercase"
          style={{ color: 'var(--color-text-muted)' }}>
          <span>IPL 2026</span>
          <span className="w-1 h-1 rounded-full bg-current" />
          <span>April 18</span>
          <span className="w-1 h-1 rounded-full bg-current" />
          <span>Live Match</span>
        </div>
      </motion.div>
    </div>
  );
}
