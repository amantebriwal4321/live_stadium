'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';

const typeColors = {
  SIX: 'var(--color-euphoric)',
  FOUR: 'var(--color-hopeful)',
  WICKET: 'var(--color-devastated)',
  CLOSE_CALL: 'var(--color-disbelief)',
  DOT: 'var(--color-text-muted)',
  SINGLE: 'var(--color-text-secondary)',
};

const typeIcons = {
  SIX: '💥',
  FOUR: '🏏',
  WICKET: '💀',
  CLOSE_CALL: '😱',
  DOT: '•',
  SINGLE: '🏃',
};

export default function EventFeed({ events }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events.length]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold tracking-wider uppercase"
          style={{ color: 'var(--color-text-muted)' }}>
          Ball-by-Ball
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-stadium-border)' }} />
      </div>

      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="flex items-start gap-3 py-2 px-3 rounded-lg"
              style={{
                background: event.intensity >= 6 ? `${typeColors[event.type]}08` : 'transparent',
                borderLeft: `2px solid ${typeColors[event.type] || 'var(--color-text-muted)'}`,
              }}
            >
              <span className="text-sm mt-0.5">{typeIcons[event.type] || '•'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tabular-nums"
                    style={{ color: typeColors[event.type] }}>
                    {event.over}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: typeColors[event.type] }}>
                    {event.type}
                  </span>
                </div>
                <p className="text-sm mt-0.5 leading-snug"
                  style={{ color: 'var(--color-text-secondary)' }}>
                  {event.description}
                </p>
              </div>
              {event.intensity >= 8 && (
                <div className="flex items-center gap-1 shrink-0">
                  {Array.from({ length: Math.min(event.intensity - 6, 4) }).map((_, i) => (
                    <div key={i} className="w-1 h-3 rounded-full"
                      style={{ background: typeColors[event.type] }} />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
