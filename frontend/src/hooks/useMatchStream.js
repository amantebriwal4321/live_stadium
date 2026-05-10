import { useState, useEffect, useRef, useCallback } from 'react';

export default function useMatchStream() {
  const [matchState, setMatchState] = useState(null);
  const [pressureScore, setPressureScore] = useState(0);
  const [psychRead, setPsychRead] = useState('');
  const [chapters, setChapters] = useState([]);
  const [isNarrating, setIsNarrating] = useState(false);
  const [epilogue, setEpilogue] = useState('');
  const [isEpilogueStreaming, setIsEpilogueStreaming] = useState(false);
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [source, setSource] = useState('manual');

  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const chaptersRef = useRef([]);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource('/stream');
    eventSourceRef.current = es;

    es.onopen = () => {
      setConnected(true);
      setReconnecting(false);
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'connected':
            setConnected(true);
            setReconnecting(false);
            break;

          case 'state_update':
            setMatchState(data.matchState);
            setPressureScore(data.pressureScore);
            if (data.source) setSource(data.source);
            break;

          case 'psych_read':
            setPsychRead(data.text);
            setPressureScore(data.score);
            break;

          case 'chapter_start':
            setIsNarrating(true);
            // Add a new empty chapter
            setChapters(prev => {
              const next = [...prev, { text: '', streaming: true, chapterNumber: prev.length + 1, triggerLabel: '' }];
              chaptersRef.current = next;
              return next;
            });
            break;

          case 'chapter_chunk':
            setChapters(prev => {
              if (prev.length === 0) return prev;
              const next = [...prev];
              const last = { ...next[next.length - 1] };
              last.text += data.text;
              next[next.length - 1] = last;
              chaptersRef.current = next;
              return next;
            });
            break;

          case 'chapter_end':
            setIsNarrating(false);
            setChapters(prev => {
              if (prev.length === 0) return prev;
              const next = [...prev];
              const last = { ...next[next.length - 1] };
              last.streaming = false;
              last.chapterNumber = data.chapterNumber || last.chapterNumber;
              last.triggerLabel = data.triggerLabel || '';
              next[next.length - 1] = last;
              chaptersRef.current = next;
              return next;
            });
            break;

          case 'epilogue_start':
            setIsEpilogueStreaming(true);
            setEpilogue('');
            break;

          case 'epilogue_chunk':
            setEpilogue(prev => prev + data.text);
            break;

          case 'epilogue_end':
            setIsEpilogueStreaming(false);
            break;

          default:
            break;
        }
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };

    es.onerror = () => {
      setConnected(false);
      es.close();
      setReconnecting(true);
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000);
    };
  }, []);

  useEffect(() => {
    connect();

    // Also fetch initial state for reconnection recovery
    fetch('/state')
      .then(res => res.json())
      .then(data => {
        if (data.matchState) {
          setMatchState(data.matchState);
          setPressureScore(data.pressureScore);
          if (data.source) setSource(data.source);
          if (data.matchState.lastPsychRead) {
            setPsychRead(data.matchState.lastPsychRead);
          }
          // Restore chapters
          if (data.matchState.chapters && data.matchState.chapters.length > 0) {
            const restoredChapters = data.matchState.chapters.map((text, i) => ({
              text,
              streaming: false,
              chapterNumber: i + 1,
              triggerLabel: '',
            }));
            setChapters(restoredChapters);
            chaptersRef.current = restoredChapters;
          }
        }
      })
      .catch(() => {
        // Server not available yet — SSE will recover
      });

    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [connect]);

  return {
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
  };
}
