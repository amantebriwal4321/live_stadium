'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEAMS } from '../lib/constants';

export default function LiveChat({ messages, sendMessage, selectedTeam }) {
  const [inputText, setInputText] = useState('');
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[400px] max-h-[600px] glass rounded-xl border border-[color:var(--color-stadium-border)] overflow-hidden">
      
      {/* Header */}
      <div className="bg-[rgba(0,0,0,0.5)] p-3 border-b border-[color:var(--color-stadium-border)] flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-euphoric)' }} />
          <span className="text-sm font-bold tracking-wider uppercase text-white">
            Live Lounge
          </span>
        </div>
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Syncing...
        </span>
      </div>

      {/* Message List */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar relative"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.isMe;
            const team = TEAMS[msg.team] || TEAMS.RCB;
            const isEmotion = msg.type === 'emotion';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex flex-col max-w-[85%] ${isMe ? 'items-end' : 'items-start'}`}>
                  {/* Name Tag */}
                  <span className="text-[10px] font-bold tracking-wider uppercase mb-0.5 flex items-center gap-1.5"
                    style={{ color: isMe ? 'var(--color-euphoric)' : 'var(--color-text-muted)' }}>
                    {!isMe && (
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: team.color }} />
                    )}
                    {msg.fanName}
                  </span>

                  {/* Message Bubble */}
                  <div 
                    className={`px-3 py-2 rounded-2xl ${isMe ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                    style={{
                      background: isEmotion 
                        ? 'rgba(255, 255, 255, 0.03)' 
                        : isMe 
                          ? `var(--color-${selectedTeam.toLowerCase()}-glow)` 
                          : 'rgba(255, 255, 255, 0.05)',
                      border: isEmotion 
                        ? '1px dashed var(--color-stadium-border)' 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {isEmotion ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xl animate-bounce-subtle">{msg.icon}</span>
                        <span className="text-xs font-bold tracking-widest uppercase"
                          style={{ color: 'var(--color-text-secondary)' }}>
                          feeling {msg.label}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-white leading-relaxed break-words">
                        {msg.text}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-[rgba(0,0,0,0.4)] border-t border-[color:var(--color-stadium-border)] shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Shout it out..."
            className="flex-1 bg-black/50 border border-[color:var(--color-stadium-border)] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!inputText.trim()}
            className="bg-white text-black p-2.5 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
            </svg>
          </motion.button>
        </form>
      </div>
    </div>
  );
}
