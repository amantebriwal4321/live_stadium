'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GHOST_BALL_SCRIPT, MOCK_EMOTION_DISTRIBUTION } from '../lib/constants';

export default function GhostBall({ active, onClose, fanCount }) {
  const [phase, setPhase] = useState('intro'); // intro, playing, ended
  const [currentBeat, setCurrentBeat] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [audioProgress, setAudioProgress] = useState(0);
  const [waveformData, setWaveformData] = useState(new Array(40).fill(0.3));
  const orbRef = useRef(null);
  const intervalRef = useRef(null);
  const textIntervalRef = useRef(null);

  // Generate waveform animation
  useEffect(() => {
    if (!active || phase !== 'playing') return;

    const waveInterval = setInterval(() => {
      setWaveformData(prev =>
        prev.map(() => Math.random() * 0.7 + 0.3)
      );
    }, 150);

    return () => clearInterval(waveInterval);
  }, [active, phase]);

  // Simulate the Ghost Ball experience
  useEffect(() => {
    if (!active) {
      setPhase('intro');
      setCurrentBeat(0);
      setDisplayText('');
      setAudioProgress(0);
      return;
    }

    // Intro phase — 2 seconds of dark silence
    const introTimer = setTimeout(() => {
      setPhase('playing');
      startNarration();
    }, 2000);

    return () => {
      clearTimeout(introTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (textIntervalRef.current) clearInterval(textIntervalRef.current);
    };
  }, [active]);

  const startNarration = useCallback(() => {
    const beats = GHOST_BALL_SCRIPT.beats;
    let beatIndex = 0;
    let charIndex = 0;

    // Progress bar
    const totalDuration = 30000; // 30 seconds
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setAudioProgress(Math.min(1, elapsed / totalDuration));

      if (elapsed >= totalDuration) {
        clearInterval(intervalRef.current);
        setPhase('ended');
      }
    }, 100);

    // Text typewriter across beats
    const typeNextChar = () => {
      if (beatIndex >= beats.length) {
        clearInterval(textIntervalRef.current);
        return;
      }

      const currentBeatText = beats[beatIndex];
      if (charIndex <= currentBeatText.length) {
        setDisplayText(currentBeatText.substring(0, charIndex));
        setCurrentBeat(beatIndex);
        charIndex++;
      } else {
        // Pause between beats
        beatIndex++;
        charIndex = 0;
        if (beatIndex < beats.length) {
          // Brief pause
          clearInterval(textIntervalRef.current);
          setTimeout(() => {
            textIntervalRef.current = setInterval(typeNextChar, 40);
          }, 1500);
        }
      }
    };

    textIntervalRef.current = setInterval(typeNextChar, 40);
  }, []);

  if (!active) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
        style={{ background: 'rgba(0, 0, 0, 0.95)' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/30 hover:text-white/60 transition-colors cursor-pointer z-10"
          style={{ fontSize: '1.5rem' }}
        >
          ✕
        </button>

        {/* Ghost Ball label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-8 left-0 right-0 text-center"
        >
          <span className="text-xs tracking-[0.4em] uppercase font-semibold"
            style={{ color: 'rgba(255, 107, 53, 0.6)' }}>
            Ghost Ball
          </span>
        </motion.div>

        {/* The Orb */}
        <motion.div
          ref={orbRef}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: phase === 'playing' ? [1, 1.05, 1] : phase === 'ended' ? 0.8 : 0.5,
            opacity: phase === 'intro' ? 0.3 : 1,
          }}
          transition={{
            scale: { duration: 2, repeat: phase === 'playing' ? Infinity : 0, ease: 'easeInOut' },
            opacity: { duration: 1 },
          }}
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-full mb-10"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #FF8C5A 0%, #FF6B35 30%, #CC4400 70%, #661A00 100%)',
            boxShadow: phase === 'playing'
              ? '0 0 40px rgba(255, 107, 53, 0.4), 0 0 80px rgba(255, 107, 53, 0.2), 0 0 120px rgba(255, 107, 53, 0.1)'
              : '0 0 20px rgba(255, 107, 53, 0.2)',
          }}
        >
          {/* Cricket ball seam line */}
          <div className="absolute inset-3 rounded-full border-2 border-dashed opacity-20"
            style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
          
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.2) 0%, transparent 50%)',
            }} />
        </motion.div>

        {/* Waveform visualization */}
        {phase === 'playing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-end justify-center gap-[2px] h-12 mb-8"
          >
            {waveformData.map((height, i) => (
              <motion.div
                key={i}
                animate={{ scaleY: height }}
                transition={{ duration: 0.15 }}
                className="w-[3px] rounded-full origin-bottom"
                style={{
                  height: '100%',
                  background: `rgba(255, 107, 53, ${0.3 + height * 0.5})`,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Narration text */}
        <div className="max-w-lg mx-auto px-6 text-center min-h-[100px] flex items-center justify-center">
          {phase === 'playing' && (
            <motion.p
              key={currentBeat}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg md:text-xl leading-relaxed"
              style={{
                fontFamily: 'Outfit, sans-serif',
                color: 'rgba(255, 255, 255, 0.85)',
                fontStyle: 'italic',
              }}
            >
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-0.5 h-5 ml-1 align-middle"
                style={{ background: 'var(--color-euphoric)' }}
              />
            </motion.p>
          )}

          {phase === 'ended' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <p className="text-xl md:text-2xl font-bold"
                style={{ fontFamily: 'Outfit, sans-serif' }}>
                This is what {(fanCount || 11847).toLocaleString()} people felt at this exact moment.
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Send it to someone who felt the opposite.
              </p>

              {/* Share / Gift buttons */}
              <div className="flex items-center justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-xl font-bold text-sm tracking-wider cursor-pointer"
                  style={{
                    background: 'var(--color-euphoric)',
                    color: 'white',
                  }}
                >
                  🎁 GIFT THIS MOMENT
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-xl font-bold text-sm tracking-wider cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                  onClick={onClose}
                >
                  SHARE
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Progress bar */}
        {phase === 'playing' && (
          <div className="absolute bottom-12 left-8 right-8">
            <div className="h-0.5 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.1)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${audioProgress * 100}%`,
                  background: 'var(--color-euphoric)',
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {Math.floor(audioProgress * 30)}s
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                30s
              </span>
            </div>
          </div>
        )}

        {/* Emotion distribution (subtle) */}
        {phase === 'playing' && (
          <div className="absolute bottom-28 left-8 right-8">
            <div className="flex items-center justify-center gap-4 text-xs"
              style={{ color: 'var(--color-text-muted)' }}>
              <span>🔥 {MOCK_EMOTION_DISTRIBUTION.euphoric}%</span>
              <span>😰 {MOCK_EMOTION_DISTRIBUTION.nervous}%</span>
              <span>😱 {MOCK_EMOTION_DISTRIBUTION.disbelief}%</span>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
