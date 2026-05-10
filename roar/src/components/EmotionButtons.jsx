'use client';

import { motion } from 'framer-motion';
import { EMOTIONS } from '../lib/constants';

export default function EmotionButtons({ onSubmit, currentEmotion, disabled }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider uppercase"
          style={{ color: 'var(--color-text-muted)' }}>
          How are you feeling?
        </span>
        {currentEmotion && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{
              background: `${EMOTIONS.find(e => e.id === currentEmotion)?.color}20`,
              color: EMOTIONS.find(e => e.id === currentEmotion)?.color,
            }}
          >
            Sent!
          </motion.span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {EMOTIONS.map((emotion) => {
          const isActive = currentEmotion === emotion.id;
          return (
            <motion.button
              key={emotion.id}
              onClick={() => !disabled && onSubmit(emotion.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              disabled={disabled || isActive}
              className="relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl cursor-pointer no-select transition-all duration-200"
              style={{
                background: isActive
                  ? `${emotion.color}25`
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? `${emotion.color}50` : 'var(--color-stadium-border)'}`,
                opacity: disabled && !isActive ? 0.5 : 1,
              }}
            >
              {/* Glow on active */}
              {isActive && (
                <motion.div
                  layoutId="emotion-glow"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `radial-gradient(circle, ${emotion.color}15 0%, transparent 70%)`,
                  }}
                />
              )}

              <span className="text-xl relative z-10">{emotion.icon}</span>
              <span className="text-[10px] font-bold tracking-wider uppercase relative z-10"
                style={{ color: isActive ? emotion.color : 'var(--color-text-secondary)' }}>
                {emotion.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
