import React from 'react';
import useMatchStream from './hooks/useMatchStream';
import PressurePanel from './components/PressurePanel';
import EventInput from './components/EventInput';
import StoryPanel from './components/StoryPanel';
import ScorePanel from './components/ScorePanel';

export default function App() {
  const {
    matchState,
    pressureScore,
    psychRead,
    chapters,
    isNarrating,
    epilogue,
    isEpilogueStreaming,
    connected,
    reconnecting,
    source,
  } = useMatchStream();

  return (
    <div className="h-screen w-screen overflow-hidden p-3 relative">
      {/* Reconnecting badge */}
      {reconnecting && (
        <div className="reconnecting-badge">
          ⚡ Reconnecting...
        </div>
      )}

      {/* Three-panel grid */}
      <div
        className="h-full w-full gap-3"
        style={{
          display: 'grid',
          gridTemplateColumns: '340px 1fr 300px',
        }}
      >
        {/* LEFT PANEL — Pressure + Input */}
        <div className="panel-card flex flex-col overflow-hidden">
          <div className="flex-shrink-0 overflow-y-auto" style={{ maxHeight: '50%' }}>
            <PressurePanel
              pressureScore={pressureScore}
              psychRead={psychRead}
              currentBatsman={matchState?.currentBatsman}
            />
          </div>
          <div
            className="flex-1 overflow-y-auto border-t"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <EventInput matchState={matchState} />
          </div>
        </div>

        {/* CENTER PANEL — Story */}
        <div className="panel-card flex flex-col overflow-hidden">
          <StoryPanel
            chapters={chapters}
            isNarrating={isNarrating}
            epilogue={epilogue}
            isEpilogueStreaming={isEpilogueStreaming}
          />
        </div>

        {/* RIGHT PANEL — Score */}
        <div className="panel-card overflow-hidden">
          <ScorePanel
            matchState={matchState}
            pressureScore={pressureScore}
            source={source}
          />
        </div>
      </div>

      {/* Connection status dot */}
      <div
        className="fixed bottom-3 right-3 flex items-center gap-1.5"
        title={connected ? 'Connected' : 'Disconnected'}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{
            background: connected ? 'var(--accent-green)' : 'var(--tension-high)',
          }}
        />
        <span className="text-[10px] text-text-muted">
          {connected ? 'Live' : 'Offline'}
        </span>
      </div>
    </div>
  );
}
