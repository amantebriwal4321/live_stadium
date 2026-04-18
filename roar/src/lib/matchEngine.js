// ========================
// ROAR — Mock Match Engine
// Fires events in sequence, simulates a live match
// ========================

import { MOCK_EVENTS, MOCK_MATCH } from './constants';

export class MockMatchEngine {
  constructor(onEvent, onScoreUpdate, speed = 1) {
    this.events = [...MOCK_EVENTS];
    this.currentIndex = 0;
    this.onEvent = onEvent;
    this.onScoreUpdate = onScoreUpdate;
    this.speed = speed; // 1 = real-time, 3 = 3x speed for demo
    this.timers = [];
    this.running = false;
    this.score = { ...MOCK_MATCH.score };
    this.players = JSON.parse(JSON.stringify(MOCK_MATCH.players));
  }

  start() {
    if (this.running) return;
    this.running = true;

    this.events.forEach((event, index) => {
      const delay = event.timestamp / this.speed;
      const timer = setTimeout(() => {
        if (!this.running) return;

        // Update score
        this.score.runs += event.scoreChange.runs;
        this.score.wickets += event.scoreChange.wickets;
        this.score.required -= event.scoreChange.runs;
        this.score.ballsRemaining -= 1;
        this.score.ballsTotal += 1;

        // Update overs display
        const totalBalls = this.score.ballsTotal;
        const oversComplete = Math.floor(totalBalls / 6);
        const ballsInOver = totalBalls % 6;
        this.score.overs = `${oversComplete}.${ballsInOver}`;

        // Update player stats
        if (event.playerHighlight === 'Kohli' && event.scoreChange.runs > 0) {
          this.players.striker.runs += event.scoreChange.runs;
          this.players.striker.balls += 1;
          if (event.type === 'FOUR') this.players.striker.fours += 1;
          if (event.type === 'SIX') this.players.striker.sixes += 1;
        } else if (event.playerHighlight === 'Kohli') {
          this.players.striker.balls += 1;
        }

        this.currentIndex = index;

        // Fire callbacks
        this.onEvent(event, index);
        this.onScoreUpdate({ ...this.score }, { ...this.players });
      }, delay);

      this.timers.push(timer);
    });
  }

  // Fire a specific event manually
  fireEvent(eventId) {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      this.score.runs += event.scoreChange.runs;
      this.score.wickets += event.scoreChange.wickets;
      this.score.required -= event.scoreChange.runs;
      this.score.ballsRemaining -= 1;
      this.onEvent(event, this.currentIndex);
      this.onScoreUpdate({ ...this.score }, { ...this.players });
    }
  }

  stop() {
    this.running = false;
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
  }

  reset() {
    this.stop();
    this.currentIndex = 0;
    this.score = { ...MOCK_MATCH.score };
    this.players = JSON.parse(JSON.stringify(MOCK_MATCH.players));
  }
}

// Generate random emotion reactions from mock fans  
export function generateMockReactions(count = 5) {
  const emotions = ['euphoric', 'nervous', 'devastated', 'disbelief', 'furious', 'hopeful'];
  const teams = ['RCB', 'DC'];
  const names = ['Arjun', 'Priya', 'Ravi', 'Sneha', 'Amit', 'Neha', 'Karthik', 'Divya', 'Rohan', 'Ananya', 'Varun', 'Meera', 'Sachin', 'Pooja', 'Vikram'];

  const reactions = [];
  for (let i = 0; i < count; i++) {
    reactions.push({
      id: `reaction-${Date.now()}-${i}`,
      fanName: names[Math.floor(Math.random() * names.length)],
      emotion: emotions[Math.floor(Math.random() * emotions.length)],
      team: teams[Math.floor(Math.random() * teams.length)],
      timestamp: Date.now() - Math.floor(Math.random() * 10000),
    });
  }
  return reactions;
}

// Generate continuous stream of reactions
export function startReactionStream(callback, interval = 2000) {
  const id = setInterval(() => {
    const count = Math.floor(Math.random() * 3) + 1;
    const reactions = generateMockReactions(count);
    callback(reactions);
  }, interval);
  return () => clearInterval(id);
}
