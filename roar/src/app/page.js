'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMatch } from '../context/MatchContext';
import { TEAMS, MOCK_MATCH } from '../lib/constants';

import TeamSelect from '../components/TeamSelect';
import Scoreboard from '../components/Scoreboard';
import FanDots from '../components/FanDots';
import LiveChat from '../components/LiveChat';
import EmotionButtons from '../components/EmotionButtons';
import EventBanner from '../components/EventBanner';
import EventFeed from '../components/EventFeed';
import TribalNarrator from '../components/TribalNarrator';
import EmotionSplit from '../components/EmotionSplit';
import MomentGroup from '../components/MomentGroup';
import GhostBall from '../components/GhostBall';
import RivalBridge from '../components/RivalBridge';

export default function Home() {
  const {
    selectedTeam, setSelectedTeam,
    screen, setScreen,
    score, players, events, currentEvent,
    showEventBanner,
    fanCount,
    chatMessages, myEmotion, submitEmotion, sendMessage,
    narratorText, isNarrating,
    ghostBallActive, setGhostBallActive,
    ghostBallReady,
    momentGroup, setMomentGroup,
    startMatch, stopMatch, fireEvent,
  } = useMatch();

  const [rivalBridgeActive, setRivalBridgeActive] = useState(false);
  const [demoSpeed, setDemoSpeed] = useState(1);

  // Team selection handler with explosion effect
  const handleTeamSelect = useCallback((team) => {
    setSelectedTeam(team);
    // Brief explosion delay then move to lobby
    setTimeout(() => setScreen('lobby'), 1200);
  }, [setSelectedTeam, setScreen]);

  // Enter match from lobby
  const handleEnterMatch = useCallback(() => {
    setScreen('match');
    startMatch(demoSpeed);
  }, [setScreen, startMatch, demoSpeed]);

  // Cleanup
  useEffect(() => {
    return () => stopMatch();
  }, [stopMatch]);

  const team = TEAMS[selectedTeam];

  // ========================
  // SCREEN: TEAM SELECT
  // ========================
  if (screen === 'team-select') {
    return (
      <>
        <TeamSelect onSelect={handleTeamSelect} />
        {/* Team explosion overlay */}
        <AnimatePresence>
          {selectedTeam && (
            <motion.div
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 50, opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
            >
              <div className="w-8 h-8 rounded-full"
                style={{ background: team?.color || '#EC1C24' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // ========================
  // SCREEN: LOBBY
  // ========================
  if (screen === 'lobby') {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center">
        {/* Playful bright gradient stadium glow */}
        <div className={`stadium-glow ${selectedTeam === 'RCB' ? 'stadium-glow-rcb' : 'stadium-glow-dc'}`} style={{ opacity: 0.3 }} />
        
        {/* Floating animated background trophies and balls */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[20%] left-[10%] text-6xl animate-swing-bat opacity-50">🏏</div>
          <div className="absolute bottom-[20%] right-[10%] text-6xl animate-bounce-ball opacity-50">⚾</div>
          <div className="absolute top-[15%] right-[20%] text-5xl animate-float-trophy opacity-50">🏆</div>
          <div className="absolute bottom-[30%] left-[15%] text-5xl animate-float-trophy opacity-30" style={{ animationDelay: '1.5s' }}>🏏</div>
        </div>

        <div className="relative z-10 w-full max-w-2xl px-6 py-10 flex flex-col items-center">
          
          {/* Animated Header Icons */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex items-center gap-4 mb-6 text-5xl"
          >
            <div className="animate-swing-bat">🏏</div>
            <div className="animate-bounce-ball">⚾</div>
            <div className="animate-float-trophy">🏆</div>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 flex flex-col items-center"
          >
            <div className="live-badge mb-4 animate-pulse">LIVE NOW 🔥</div>
            <h1 className="text-4xl md:text-5xl font-black mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              style={{ fontFamily: 'Outfit, sans-serif' }}>
              <span style={{ color: team?.color || 'white' }}>{MOCK_MATCH.batting}</span> 
              <span className="text-white/50 mx-3 text-3xl">VS</span> 
              <span style={{ color: selectedTeam === 'RCB' ? 'var(--color-dc)' : 'var(--color-rcb)' }}>{MOCK_MATCH.bowling}</span>
            </h1>
            <p className="text-sm font-semibold tracking-wider uppercase text-white/70 bg-white/5 py-2 px-6 rounded-full glass-strong">
              {MOCK_MATCH.venue} • {MOCK_MATCH.date}
            </p>
          </motion.div>

          {/* Fan dots visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full flex justify-center mb-8"
          >
            <FanDots count={fanCount} teamColor={team?.color} />
          </motion.div>

          {/* Pre-match narrator provocation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-strong rounded-2xl p-8 mb-10 text-center w-full max-w-xl shadow-[0_0_40px_rgba(255,255,255,0.05)] border-white/10"
            style={{ borderTop: `4px solid ${team?.color}` }}
          >
            <p className="text-sm tracking-widest uppercase mb-4 font-bold flex justify-center items-center gap-2"
              style={{ color: team?.color }}>
              <span className="animate-pulse">🎙️</span> Tribal Narrator
            </p>
            <p className="text-xl md:text-2xl leading-relaxed text-white drop-shadow-md"
              style={{ fontFamily: 'Outfit, sans-serif', fontStyle: 'italic' }}>
              "Chinnaswamy is not a ground tonight. It is a courtroom. And every ball is a verdict.
              {selectedTeam === 'RCB'
                ? ' The faithful are here. Twelve thousand hearts beating as one.'
                : ' The DC Army doesn\'t travel to watch. The DC Army travels to conquer.'}
              "
            </p>
          </motion.div>

          {/* Demo speed control */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>Demo Speed</span>
            <div className="flex gap-2">
              {[1, 2, 3].map(s => (
                <button
                  key={s}
                  onClick={() => setDemoSpeed(s)}
                  className={`w-10 h-10 rounded-xl text-sm font-black cursor-pointer transition-all hover:scale-110 active:scale-95 flex items-center justify-center`}
                  style={{
                    background: demoSpeed === s ? team?.color : 'rgba(255,255,255,0.05)',
                    color: demoSpeed === s ? 'white' : 'var(--color-text-muted)',
                    border: `2px solid ${demoSpeed === s ? team?.color : 'var(--color-stadium-border)'}`,
                    boxShadow: demoSpeed === s ? `0 0 15px ${team?.color}50` : 'none'
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>
          </motion.div>

          {/* Enter match button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.2 }}
            className="text-center w-full max-w-sm"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnterMatch}
              className="w-full py-5 rounded-3xl text-xl font-black tracking-widest cursor-pointer shadow-2xl relative overflow-hidden group"
              style={{
                background: team?.gradient || 'var(--color-rcb)',
                color: 'white',
              }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <div className="absolute inset-0 opacity-50" style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`, transform: 'skewX(-20deg) translateX(-150%)', animation: 'slide-in-right 2s infinite' }} />
              <span className="relative z-10 flex items-center justify-center gap-3">
                ENTER THE MATCH <span className="animate-bounce-subtle text-2xl">🔥</span>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ========================
  // SCREEN: LIVE MATCH
  // ========================
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Stadium glow */}
      <div className={`stadium-glow ${selectedTeam === 'RCB' ? 'stadium-glow-rcb' : 'stadium-glow-dc'}`} />

      {/* Event Banner (fixed top) */}
      <EventBanner event={currentEvent} visible={showEventBanner} />

      {/* Ghost Ball Overlay */}
      <GhostBall
        active={ghostBallActive}
        onClose={() => setGhostBallActive(false)}
        fanCount={fanCount}
      />

      {/* Rival Bridge Overlay */}
      <RivalBridge
        active={rivalBridgeActive}
        onClose={() => setRivalBridgeActive(false)}
        selectedTeam={selectedTeam}
      />

      {/* Main layout */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-6 h-screen flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black tracking-tighter"
              style={{ fontFamily: 'Outfit, sans-serif' }}>
              <span className="text-shimmer">ROAR</span>
            </h1>
            <div className="live-badge text-[10px] px-2 py-0.5">LIVE</div>
          </div>
          <div className="flex items-center gap-4 bg-[rgba(255,255,255,0.03)] px-4 py-2 rounded-full border border-[color:var(--color-stadium-border)]">
            <span className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
              {MOCK_MATCH.date}
            </span>
            <div className="w-px h-3 bg-[color:var(--color-text-muted)] opacity-30" />
            <span className="text-xs font-bold flex items-center gap-2"
              style={{ color: 'var(--color-text-primary)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: 'var(--color-hopeful)', boxShadow: '0 0 10px var(--color-hopeful)' }} />
              {fanCount.toLocaleString()} fans live
            </span>
          </div>
        </div>

        {/* Main 3-column Grid */}
        <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
          
          {/* LEFT PANEL: Live Lounge (Chat) & Emotions (col-span-3) */}
          <div className="col-span-3 flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              <LiveChat 
                messages={chatMessages} 
                sendMessage={sendMessage} 
                selectedTeam={selectedTeam} 
              />
            </div>
            <div className="shrink-0">
              <EmotionButtons onSubmit={submitEmotion} currentEmotion={myEmotion} />
            </div>
          </div>

          {/* CENTER PANEL: Scoreboard & Narrative (col-span-6) */}
          <div className="col-span-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Scoreboard score={score} players={players} selectedTeam={selectedTeam} />
            </motion.div>
            
            <div className="flex-1 flex flex-col gap-4">
              <EventFeed events={events} />
              
              <TribalNarrator
                narratorText={narratorText}
                isNarrating={isNarrating}
                selectedTeam={selectedTeam}
              />

              <AnimatePresence>
                {momentGroup && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <MomentGroup
                      group={momentGroup}
                      selectedTeam={selectedTeam}
                      onDismiss={() => setMomentGroup(null)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT PANEL: Insights & Magic Actions (col-span-3) */}
          <div className="col-span-3 flex flex-col gap-6">
            <EmotionSplit selectedTeam={selectedTeam} />

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-shimmer">
                  Shared Experiences
                </span>
                <div className="flex-1 h-px bg-[color:var(--color-stadium-border)]" />
              </div>

              {ghostBallReady && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(255, 107, 53, 0.2)',
                      '0 0 25px rgba(255, 107, 53, 0.4)',
                      '0 0 10px rgba(255, 107, 53, 0.2)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  onClick={() => setGhostBallActive(true)}
                  className="w-full py-4 rounded-xl font-bold tracking-wider relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #FF6B35 0%, #CC4400 100%)',
                    color: 'white',
                    border: '1px solid rgba(255, 107, 53, 0.5)',
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="text-lg">⚾</span> PLAY GHOST BALL
                  </span>
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRivalBridgeActive(true)}
                className="w-full py-3 rounded-xl text-sm font-bold tracking-wide relative overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--color-stadium-border)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                🌉 Meet a Rival
              </motion.button>
            </div>

            <div className="glass rounded-xl p-4 mt-auto">
              <p className="text-[10px] font-bold tracking-wider uppercase mb-3 text-center"
                style={{ color: 'var(--color-text-muted)' }}>
                Demo Developer Controls
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '💥 SIX', idx: 3 },
                  { label: '🏏 FOUR', idx: 1 },
                  { label: '💀 WICKET', idx: 4 },
                  { label: '😱 CLOSE', idx: 6 },
                ].map(({ label, idx }) => (
                  <motion.button
                    key={label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fireEvent(idx)}
                    className="py-2.5 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors"
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--color-stadium-border)',
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
