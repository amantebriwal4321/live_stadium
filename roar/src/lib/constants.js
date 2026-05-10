// ========================
// ROAR — Constants & Mock Data
// IPL 2026: RCB vs DC @ Chinnaswamy Stadium
// ========================

export const TEAMS = {
  RCB: {
    name: 'Royal Challengers Bengaluru',
    short: 'RCB',
    color: '#EC1C24',
    gradient: 'linear-gradient(135deg, #EC1C24 0%, #B8000F 50%, #7A0000 100%)',
    accent: '#FFD700',
    textColor: '#FFFFFF',
    fans: 'RCB faithful',
  },
  DC: {
    name: 'Delhi Capitals',
    short: 'DC',
    color: '#17479E',
    gradient: 'linear-gradient(135deg, #17479E 0%, #E03A3E 50%, #17479E 100%)',
    accent: '#E03A3E',
    textColor: '#FFFFFF',
    fans: 'DC Army',
  },
};

export const STADIUM = {
  name: 'M. Chinnaswamy Stadium',
  city: 'Bengaluru',
  capacity: '40,000',
};

export const EMOTIONS = [
  { id: 'euphoric', label: 'EUPHORIC', icon: '🔥', color: '#FF6B35' },
  { id: 'nervous', label: 'NERVOUS', icon: '😰', color: '#FFD700' },
  { id: 'devastated', label: 'DEVASTATED', icon: '💀', color: '#8B0000' },
  { id: 'disbelief', label: 'DISBELIEF', icon: '😱', color: '#9B59B6' },
  { id: 'furious', label: 'FURIOUS', icon: '🤬', color: '#E74C3C' },
  { id: 'hopeful', label: 'HOPEFUL', icon: '🙏', color: '#2ECC71' },
];

// Mock scoreboard state (simulates a tense chase)
export const MOCK_MATCH = {
  id: 'ipl2026-rcb-dc-0418',
  league: 'IPL 2026',
  date: 'April 18, 2026',
  status: 'LIVE',
  venue: STADIUM.name,
  city: STADIUM.city,
  innings: 2, // chase
  batting: 'RCB',
  bowling: 'DC',
  target: 192,
  score: {
    runs: 178,
    wickets: 4,
    overs: '18.2',
    ballsTotal: 110,
    ballsRemaining: 10,
    runRate: 9.71,
    requiredRate: 8.40,
    required: 14,
  },
  players: {
    striker: { name: 'V Kohli', runs: 72, balls: 41, fours: 6, sixes: 3, sr: 175.6 },
    nonStriker: { name: 'G Maxwell', runs: 18, balls: 9, fours: 1, sixes: 1, sr: 200.0 },
    bowler: { name: 'K Yadav', overs: '3.2', maidens: 0, runs: 28, wickets: 2, economy: 8.40 },
  },
  firstInnings: {
    team: 'DC',
    score: '191/6',
    overs: '20',
    topScorer: 'R Pant 71(38)',
  },
};

// ========================
// MOCK MATCH EVENT TIMELINE
// Events fire in sequence during demo
// ========================
export const MOCK_EVENTS = [
  {
    id: 'evt-001',
    type: 'DOT',
    description: 'Kuldeep to Kohli — dot ball, defended back',
    intensity: 3,
    over: '18.3',
    timestamp: 0,
    scoreChange: { runs: 0, wickets: 0 },
    playerHighlight: 'Kohli',
  },
  {
    id: 'evt-002',
    type: 'FOUR',
    description: 'Kohli drives through covers — FOUR! Class shot.',
    intensity: 6,
    over: '18.4',
    timestamp: 8000,
    scoreChange: { runs: 4, wickets: 0 },
    playerHighlight: 'Kohli',
    banner: '🏏 FOUR BY KOHLI!',
  },
  {
    id: 'evt-003',
    type: 'DOT',
    description: 'Kuldeep bowls a googly — Kohli digs it out',
    intensity: 5,
    over: '18.5',
    timestamp: 16000,
    scoreChange: { runs: 0, wickets: 0 },
    playerHighlight: 'Kuldeep',
  },
  {
    id: 'evt-004',
    type: 'SIX',
    description: 'KOHLI LAUNCHES IT OVER LONG-ON — SIX! The crowd loses it!',
    intensity: 9,
    over: '18.6',
    timestamp: 24000,
    scoreChange: { runs: 6, wickets: 0 },
    playerHighlight: 'Kohli',
    banner: '💥 SIX BY KOHLI! INTO THE STANDS!',
  },
  {
    id: 'evt-005',
    type: 'WICKET',
    description: 'MAXWELL IS OUT! Caught at deep midwicket! Axar takes it!',
    intensity: 9,
    over: '19.1',
    timestamp: 35000,
    scoreChange: { runs: 0, wickets: 1 },
    playerHighlight: 'Maxwell',
    banner: '💀 WICKET! MAXWELL OUT! CAUGHT AXAR!',
  },
  {
    id: 'evt-006',
    type: 'SINGLE',
    description: 'New batsman Dinesh Karthik takes a single off the first ball',
    intensity: 4,
    over: '19.2',
    timestamp: 46000,
    scoreChange: { runs: 1, wickets: 0 },
    playerHighlight: 'Karthik',
  },
  {
    id: 'evt-007',
    type: 'CLOSE_CALL',
    description: 'Kohli almost caught! Drops just short of fielder. Hearts stop.',
    intensity: 8,
    over: '19.3',
    timestamp: 54000,
    scoreChange: { runs: 0, wickets: 0 },
    playerHighlight: 'Kohli',
    banner: '😱 CLOSE CALL! DROPPED SHORT!',
  },
  {
    id: 'evt-008',
    type: 'FOUR',
    description: 'KOHLI FINISHES IT WITH A BOUNDARY THROUGH MID-OFF! RCB WIN!',
    intensity: 10,
    over: '19.4',
    timestamp: 62000,
    scoreChange: { runs: 4, wickets: 0 },
    playerHighlight: 'Kohli',
    banner: '🏆 FOUR! RCB WIN! KOHLI UNBEATEN!',
  },
];

// Ghost Ball pre-generated script (fallback)
export const GHOST_BALL_SCRIPT = {
  beats: [
    "The roar begins before the ball lands. Forty thousand throats open at once, a sound that has no word in any language.",
    "Kohli stands there, bat raised, and for one second the entire city holds its breath. The weight of a decade presses down on Chinnaswamy.",
    "Then the silence. Not the silence of emptiness but of awe. Of people realizing they were part of something that will be spoken about in whispers for years.",
  ],
  fullText: "The roar begins before the ball lands. Forty thousand throats open at once, a sound that has no word in any language. Kohli stands there, bat raised, and for one second the entire city holds its breath. The weight of a decade presses down on Chinnaswamy. Then the silence. Not the silence of emptiness but of awe. Of people realizing they were part of something that will be spoken about in whispers for years.",
};

// Tribal narrator fallback texts
export const TRIBAL_FALLBACKS = {
  RCB: {
    SIX: "The ball disappears and so does every shred of doubt. Chinnaswamy doesn't have a roof but right now it has a religion.",
    FOUR: "Through the gap like a knife through years of heartbreak. This is what loyalty earns you.",
    WICKET: "The ground tilts. Everything we built, ball by ball, cracks in one moment of cruelty.",
    CLOSE_CALL: "The heart stops. Then starts again. This is not sport. This is cardiac arrest with a scoreboard.",
    DOT: "The pressure builds. Kuldeep versus Kohli. The wizard against the king.",
  },
  DC: {
    SIX: "We watch it sail over the boundary and feel the game slip through our fingers like sand.",
    FOUR: "They find the gap again. The Chinnaswamy roars and we hear nothing but the sound of control slipping away.",
    WICKET: "Finally. The crack in their armor. Delhi doesn't celebrate quietly — Delhi celebrates like it owns the capital.",
    CLOSE_CALL: "So close to ending their fairytale. The cricket gods are cruel tonight.",
    DOT: "Kuldeep delivers perfection. One dot ball at a time, we strangle their hope.",
  },
};

// Emotion distribution mock (for Ghost Ball)
export const MOCK_EMOTION_DISTRIBUTION = {
  euphoric: 42,
  nervous: 28,
  devastated: 5,
  disbelief: 12,
  furious: 3,
  hopeful: 10,
};

// Fan names for seeded fake users
export const MOCK_FANS = [
  { id: 'fan-001', name: 'Arjun', team: 'RCB', city: 'Bengaluru' },
  { id: 'fan-002', name: 'Priya', team: 'DC', city: 'Delhi' },
  { id: 'fan-003', name: 'Pant_fan', team: 'DC', city: 'Roorkee' },
  { id: 'fan-004', name: 'Virat18', team: 'RCB', city: 'Delhi' },
  { id: 'fan-005', name: 'Dhoni_Forever', team: 'RCB', city: 'Chennai' },
  { id: 'fan-006', name: 'DC_diehard', team: 'DC', city: 'Delhi' },
  { id: 'fan-007', name: 'CricketNerd', team: 'RCB', city: 'Hyderabad' },
  { id: 'fan-008', name: 'DilliSe', team: 'DC', city: 'New Delhi' },
];
