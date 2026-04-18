'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function EventBanner({ event, visible }) {
  if (!event || !visible) return null;

  // Color by event type
  const colors = {
    SIX: { bg: 'var(--color-euphoric)', text: '#FFFFFF' },
    FOUR: { bg: 'var(--color-hopeful)', text: '#FFFFFF' },
    WICKET: { bg: 'var(--color-devastated)', text: '#FFFFFF' },
    CLOSE_CALL: { bg: 'var(--color-disbelief)', text: '#FFFFFF' },
    DOT: { bg: 'var(--color-stadium-card)', text: 'var(--color-text-primary)' },
  };

  const color = colors[event.type] || colors.DOT;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -100, scaleY: 0.3, opacity: 0 }}
          animate={{ y: 0, scaleY: 1, opacity: 1 }}
          exit={{ y: -50, opacity: 0, scaleY: 0.5 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center py-4 px-6"
          style={{
            background: `linear-gradient(135deg, ${color.bg} 0%, ${color.bg}CC 100%)`,
            boxShadow: `0 8px 40px ${color.bg}60`,
          }}
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 400 }}
            className="text-center"
          >
            <p className="text-2xl md:text-3xl font-black tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif', color: color.text }}>
              {event.banner || event.description}
            </p>
            <p className="text-sm mt-1 opacity-80" style={{ color: color.text }}>
              Over {event.over}
            </p>
          </motion.div>

          {/* Side pulse effects */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute left-4 w-3 h-3 rounded-full"
            style={{ background: color.text, opacity: 0.3 }}
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute right-4 w-3 h-3 rounded-full"
            style={{ background: color.text, opacity: 0.3 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
