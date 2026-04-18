'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { MOCK_MATCH, MOCK_EVENTS, TEAMS, TRIBAL_FALLBACKS, MOCK_FANS, EMOTIONS } from '../lib/constants';
import { MockMatchEngine, startReactionStream } from '../lib/matchEngine';

const MatchContext = createContext(null);

// Random chat messages fake fans might say
const MOCK_CHAT_TEXTS = [
  "What a shot! 🔥",
  "Kohli is looking dangerous today.",
  "We need a wicket right now.",
  "Chinnaswamy is going crazy!",
  "Can they chase this?",
  "Kuldeep is bowling so well.",
  "Come on boys!!!",
  "That was so close 😱",
  "I can't watch...",
  "Best match of the season hands down."
];

export function MatchProvider({ children }) {
  // Team selection
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [screen, setScreen] = useState('team-select'); // team-select, lobby, match, moment, bridge

  // Match state
  const [score, setScore] = useState({ ...MOCK_MATCH.score });
  const [players, setPlayers] = useState(JSON.parse(JSON.stringify(MOCK_MATCH.players)));
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showEventBanner, setShowEventBanner] = useState(false);

  // Fan presence
  const [fanCount, setFanCount] = useState(12847);

  // Live Lounge Chat & Emotions
  const [chatMessages, setChatMessages] = useState([]);
  const [myEmotion, setMyEmotion] = useState(null);

  // Tribal narrator
  const [narratorText, setNarratorText] = useState({ india: '', opponent: '' });
  const [isNarrating, setIsNarrating] = useState(false);

  // Ghost Ball
  const [ghostBallActive, setGhostBallActive] = useState(false);
  const [ghostBallReady, setGhostBallReady] = useState(false);

  // Moment Group
  const [momentGroup, setMomentGroup] = useState(null);

  // Match engine ref
  const engineRef = useRef(null);
  const reactionCleanupRef = useRef(null);

  // Simulated fan count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setFanCount(prev => {
        const delta = Math.floor(Math.random() * 40) - 15;
        return Math.max(12500, Math.min(13200, prev + delta));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle match event
  const handleEvent = useCallback((event, index) => {
    setEvents(prev => [...prev, event]);
    setCurrentEvent(event);

    // Show banner for intensity >= 6
    if (event.intensity >= 6 && event.banner) {
      setShowEventBanner(true);
      setTimeout(() => setShowEventBanner(false), 4000);
    }

    // Ghost Ball ready for intensity >= 8
    if (event.intensity >= 8) {
      setGhostBallReady(true);
    }

    // Generate tribal narrator text for intensity >= 6
    if (event.intensity >= 6 && selectedTeam) {
      setIsNarrating(true);
      const teamTexts = TRIBAL_FALLBACKS[selectedTeam];
      const opponentTeam = selectedTeam === 'RCB' ? 'DC' : 'RCB';
      const opponentTexts = TRIBAL_FALLBACKS[opponentTeam];

      // Simulate streaming with typewriter
      const indiaText = teamTexts[event.type] || teamTexts['DOT'];
      const opponentText = opponentTexts[event.type] || opponentTexts['DOT'];

      setNarratorText({ india: '', opponent: '' });

      // Typewriter for narrator
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i <= indiaText.length) {
          setNarratorText(prev => ({
            india: indiaText.substring(0, i),
            opponent: opponentText.substring(0, Math.min(i, opponentText.length)),
          }));
          i++;
        } else {
          clearInterval(typeInterval);
          setIsNarrating(false);
        }
      }, 25);
    }

    // Simulate moment group for intensity >= 8
    if (event.intensity >= 8) {
      setTimeout(() => {
        const groupSize = Math.floor(Math.random() * 6) + 2;
        const shuffled = [...MOCK_FANS].sort(() => Math.random() - 0.5);
        setMomentGroup({
          id: `mg-${Date.now()}`,
          emotion: 'euphoric',
          members: shuffled.slice(0, groupSize),
          eventId: event.id,
          createdAt: Date.now(),
        });
      }, 2000);
    }

    // Generate burst of chat/emotions
    const burstCount = Math.min(event.intensity * 2, 10);
    const burstMessages = [];
    const emotionWeights = event.type === 'WICKET'
      ? ['devastated', 'devastated', 'euphoric', 'furious', 'disbelief', 'nervous']
      : event.type === 'SIX' || event.type === 'FOUR'
        ? ['euphoric', 'euphoric', 'euphoric', 'hopeful', 'nervous', 'disbelief']
        : ['nervous', 'nervous', 'hopeful', 'disbelief', 'furious', 'euphoric'];

    for (let j = 0; j < burstCount; j++) {
      const isText = Math.random() > 0.6;
      const fan = MOCK_FANS[Math.floor(Math.random() * MOCK_FANS.length)];
      
      if (isText) {
        burstMessages.push({
          id: `burst-text-${Date.now()}-${j}`,
          type: 'text',
          fanName: fan.name,
          team: fan.team,
          text: MOCK_CHAT_TEXTS[Math.floor(Math.random() * MOCK_CHAT_TEXTS.length)],
          timestamp: Date.now(),
        });
      } else {
        const emotionId = emotionWeights[Math.floor(Math.random() * emotionWeights.length)];
        const emotionData = EMOTIONS.find(e => e.id === emotionId);
        burstMessages.push({
          id: `burst-emo-${Date.now()}-${j}`,
          type: 'emotion',
          fanName: fan.name,
          team: fan.team,
          emotion: emotionId,
          icon: emotionData?.icon || '🔥',
          label: emotionData?.label || 'EUPHORIC',
          timestamp: Date.now(),
        });
      }
    }
    setChatMessages(prev => [...prev.slice(-50), ...burstMessages]);
  }, [selectedTeam]);

  const handleScoreUpdate = useCallback((newScore, newPlayers) => {
    setScore(newScore);
    setPlayers(newPlayers);
  }, []);

  // Start match engine
  const startMatch = useCallback((speed = 1) => {
    if (engineRef.current) engineRef.current.stop();

    engineRef.current = new MockMatchEngine(handleEvent, handleScoreUpdate, speed);
    engineRef.current.start();

    // Start continuous chat/reaction stream
    if (reactionCleanupRef.current) reactionCleanupRef.current();
    reactionCleanupRef.current = startReactionStream((newReactions) => {
      const enriched = newReactions.map(r => {
        const isText = Math.random() > 0.7; // 30% chance for a continuous stream message to be text
        if (isText) {
          return {
            id: `chat-${Date.now()}-${Math.random()}`,
            type: 'text',
            fanName: r.fanName,
            team: r.team,
            text: MOCK_CHAT_TEXTS[Math.floor(Math.random() * MOCK_CHAT_TEXTS.length)],
            timestamp: r.timestamp,
          }
        } else {
          const emotionData = EMOTIONS.find(e => e.id === r.emotion);
          return {
            ...r,
            type: 'emotion',
            icon: emotionData?.icon || '🔥',
            label: emotionData?.label || 'EUPHORIC',
          };
        }
      });
      setChatMessages(prev => [...prev.slice(-50), ...enriched]);
    }, 2000);
  }, [handleEvent, handleScoreUpdate]);

  const stopMatch = useCallback(() => {
    if (engineRef.current) engineRef.current.stop();
    if (reactionCleanupRef.current) reactionCleanupRef.current();
  }, []);

  // Submit user emotion
  const submitEmotion = useCallback((emotionId) => {
    setMyEmotion(emotionId);
    const emotionData = EMOTIONS.find(e => e.id === emotionId);

    const message = {
      id: `me-emo-${Date.now()}`,
      type: 'emotion',
      fanName: 'You',
      emotion: emotionId,
      icon: emotionData?.icon || '🔥',
      label: emotionData?.label || 'EUPHORIC',
      team: selectedTeam || 'RCB',
      timestamp: Date.now(),
      isMe: true,
    };
    setChatMessages(prev => [...prev.slice(-50), message]);

    // Reset after some time if needed for UI state
    setTimeout(() => setMyEmotion(null), 3000);
  }, [selectedTeam]);

  // Submit user chat message
  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;
    const message = {
      id: `me-txt-${Date.now()}`,
      type: 'text',
      fanName: 'You',
      text: text.trim(),
      team: selectedTeam || 'RCB',
      timestamp: Date.now(),
      isMe: true,
    };
    setChatMessages(prev => [...prev.slice(-50), message]);
  }, [selectedTeam]);

  // Fire specific event manually (for demo control)
  const fireEvent = useCallback((eventIndex) => {
    const event = MOCK_EVENTS[eventIndex];
    if (event) {
      handleEvent(event, eventIndex);
      // Update score
      const newScore = { ...score };
      newScore.runs += event.scoreChange.runs;
      newScore.wickets += event.scoreChange.wickets;
      newScore.required -= event.scoreChange.runs;
      newScore.ballsRemaining -= 1;
      setScore(newScore);
    }
  }, [handleEvent, score]);

  const value = {
    // Team
    selectedTeam, setSelectedTeam,
    screen, setScreen,
    // Match
    score, players, events, currentEvent,
    showEventBanner, setShowEventBanner,
    // Fans
    fanCount,
    // Live Lounge (Chat & Emotions)
    chatMessages, myEmotion, submitEmotion, sendMessage,
    // Narrator
    narratorText, isNarrating,
    // Ghost Ball
    ghostBallActive, setGhostBallActive,
    ghostBallReady, setGhostBallReady,
    // Groups
    momentGroup, setMomentGroup,
    // Engine controls
    startMatch, stopMatch, fireEvent,
  };

  return (
    <MatchContext.Provider value={value}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error('useMatch must be used within MatchProvider');
  return ctx;
}
