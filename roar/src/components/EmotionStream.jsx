'use client';

import { useEffect, useRef, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EmotionReaction = memo(function EmotionReaction({ reaction }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -140, scale: reaction.isMe ? 1.3 : 0.8 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3, ease: 'easeOut' }}
      className="absolute pointer-events-none"
      style={{
        left: `${reaction.x}%`,
        bottom: '0px',
        zIndex: reaction.isMe ? 10 : 1,
      }}
    >
      <div className="flex flex-col items-center gap-0.5">
        <span className={`text-2xl ${reaction.isMe ? 'text-3xl' : ''}`}>
          {reaction.icon}
        </span>
        {reaction.isMe && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: 'var(--color-euphoric)', color: 'white' }}>
            YOU
          </span>
        )}
      </div>
    </motion.div>
  );
});

export default function EmotionStream({ reactions }) {
  // Only render last 30 for performance (virtualized)
  const visibleReactions = reactions.slice(-30);
  const containerRef = useRef(null);

  return (
    <div ref={containerRef}
      className="relative w-full h-full min-h-[200px] overflow-hidden rounded-xl"
      style={{ background: 'rgba(10, 10, 15, 0.5)' }}>
      
      {/* Background ambient */}
      <div className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, var(--color-euphoric) 0%, transparent 60%)',
        }} />

      {/* Header */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
        <span className="text-xs font-semibold tracking-wider uppercase"
          style={{ color: 'var(--color-text-muted)' }}>
          Emotion Stream
        </span>
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {reactions.length} reactions
        </span>
      </div>

      {/* Floating reactions */}
      <AnimatePresence mode="popLayout">
        {visibleReactions.map((reaction) => (
          <EmotionReaction key={reaction.id} reaction={reaction} />
        ))}
      </AnimatePresence>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16"
        style={{ background: 'linear-gradient(to top, var(--color-stadium-dark), transparent)' }} />
    </div>
  );
}
