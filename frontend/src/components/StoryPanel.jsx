import React, { useRef, useEffect, useState } from 'react';

// Typewriter component for streaming text
function TypewriterText({ text, isStreaming }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!text) return;

    // If text is longer than what we've displayed, type the new chars
    if (text.length > indexRef.current) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        if (indexRef.current < text.length) {
          indexRef.current += 1;
          setDisplayed(text.substring(0, indexRef.current));
        } else {
          clearInterval(intervalRef.current);
        }
      }, 18);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  // When not streaming anymore, show full text
  useEffect(() => {
    if (!isStreaming && text) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      indexRef.current = text.length;
      setDisplayed(text);
    }
  }, [isStreaming, text]);

  return (
    <span>
      {displayed}
      {isStreaming && <span className="typewriter-cursor" />}
    </span>
  );
}

export default function StoryPanel({ chapters, isNarrating, epilogue, isEpilogueStreaming }) {
  const scrollRef = useRef(null);
  const [shareMessage, setShareMessage] = useState('');

  // Auto-scroll to top on new chapter
  useEffect(() => {
    if (scrollRef.current && chapters.length > 0) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [chapters.length]);

  const handleEndMatch = async () => {
    const result = prompt('Enter match result (e.g., "RCB won by 3 wickets"):');
    if (!result) return;

    try {
      await fetch('/endmatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result }),
      });
    } catch (err) {
      console.error('End match error:', err);
    }
  };

  const handleShareStory = () => {
    const allText = chapters
      .map((ch, i) => `--- Chapter ${ch.chapterNumber || i + 1} ---\n${ch.text}`)
      .join('\n\n');
    
    const fullText = epilogue
      ? `${allText}\n\n--- Epilogue ---\n${epilogue}`
      : allText;

    navigator.clipboard.writeText(fullText).then(() => {
      setShareMessage('Copied to clipboard!');
      setTimeout(() => setShareMessage(''), 2000);
    }).catch(() => {
      setShareMessage('Failed to copy');
      setTimeout(() => setShareMessage(''), 2000);
    });
  };

  const reversedChapters = [...chapters].reverse();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex-shrink-0">
        <h1
          className="text-center font-bold text-lg tracking-widest uppercase"
          style={{ color: 'var(--accent-rcb)', fontFamily: 'var(--font-ui)' }}
        >
          The Living Match
        </h1>
        <p className="text-center text-sm text-text-secondary mt-1">
          {chapters.length > 0 && chapters[0] ? 'RCB vs DC • IPL 2025' : ''}
        </p>

        {/* Narrating indicator */}
        {isNarrating && (
          <div className="flex items-center justify-center mt-2 gap-2">
            <span className="narrating-pulse inline-block w-2 h-2 rounded-full bg-accent-rcb" />
            <span className="narrating-pulse text-xs font-semibold uppercase tracking-wider text-accent-rcb">
              Narrating...
            </span>
          </div>
        )}
      </div>

      {/* Chapters */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Epilogue */}
        {(epilogue || isEpilogueStreaming) && (
          <div className="epilogue-card chapter-enter">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="inline-block px-2 py-0.5 rounded text-xs font-bold"
                style={{ background: 'var(--accent-gold)', color: '#000' }}
              >
                EPILOGUE
              </span>
            </div>
            <p className="chapter-text">
              <TypewriterText text={epilogue} isStreaming={isEpilogueStreaming} />
            </p>
          </div>
        )}

        {reversedChapters.length === 0 && !epilogue && (
          <div className="flex items-center justify-center h-full">
            <p
              className="text-center italic text-lg"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-story)' }}
            >
              The match awaits its first story...
            </p>
          </div>
        )}

        {reversedChapters.map((chapter, i) => {
          const isActive = i === 0 && chapter.streaming;
          return (
            <div
              key={`chapter-${chapters.length - i}`}
              className={`chapter-card ${isActive ? 'active' : ''} ${i === 0 ? 'chapter-enter' : ''}`}
            >
              {/* Chapter number badge */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-block px-2 py-0.5 rounded text-xs font-bold"
                  style={{ background: 'var(--accent-rcb)', color: '#fff' }}
                >
                  Ch. {chapter.chapterNumber || chapters.length - i}
                </span>
                {chapter.triggerLabel && (
                  <span className="text-xs text-text-muted">
                    After: {chapter.triggerLabel}
                  </span>
                )}
              </div>

              {/* Chapter text */}
              <p className="chapter-text">
                {isActive ? (
                  <TypewriterText text={chapter.text} isStreaming={chapter.streaming} />
                ) : (
                  chapter.text
                )}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom actions */}
      <div className="p-3 border-t border-white/5 flex-shrink-0 space-y-2">
        <button
          className="w-full py-2 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200"
          style={{
            background: 'rgba(204, 0, 0, 0.15)',
            color: 'var(--accent-rcb)',
            border: '1px solid rgba(204, 0, 0, 0.3)',
          }}
          onClick={handleEndMatch}
          id="end-match-btn"
        >
          🏁 End Match + Generate Epilogue
        </button>

        {chapters.length > 0 && (
          <button
            className="w-full py-2 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-secondary)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            onClick={handleShareStory}
            id="share-story-btn"
          >
            {shareMessage || '📋 Share Story (Copy All)'}
          </button>
        )}
      </div>
    </div>
  );
}
