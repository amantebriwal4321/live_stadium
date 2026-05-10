// In-memory match state — the single source of truth for the entire match

const matchState = {
  runs: 0,
  wickets: 0,
  totalBalls: 0,
  overs: 0,
  ballsRemaining: 120,
  runsRequired: 180,
  battingTeam: "RCB",
  bowlingTeam: "DC",
  consecutiveDots: 0,
  recentEvents: [],
  eventLog: [],
  currentBatsman: "",
  currentBowler: "",
  lastPsychRead: "",
  pressureHistory: [],
  chapters: [],
  storySummary: "",
  tensionLevel: "LOW",
  lastEventType: "",
  chapterCount: 0,
  matchEnded: false,
};

function setupMatch(target, battingTeam, bowlingTeam) {
  matchState.runsRequired = target;
  matchState.battingTeam = battingTeam;
  matchState.bowlingTeam = bowlingTeam;
  matchState.ballsRemaining = 120;
  matchState.runs = 0;
  matchState.wickets = 0;
  matchState.totalBalls = 0;
  matchState.overs = 0;
  matchState.consecutiveDots = 0;
  matchState.recentEvents = [];
  matchState.eventLog = [];
  matchState.currentBatsman = "";
  matchState.currentBowler = "";
  matchState.lastPsychRead = "";
  matchState.pressureHistory = [];
  matchState.chapters = [];
  matchState.storySummary = "";
  matchState.tensionLevel = "LOW";
  matchState.lastEventType = "";
  matchState.chapterCount = 0;
  matchState.matchEnded = false;
}

function updateMatchState(event) {
  const { over, ball, batsman, bowler, outcome, runs } = event;

  matchState.currentBatsman = batsman;
  matchState.currentBowler = bowler;
  matchState.lastEventType = outcome;

  // Wides and No Balls don't count as legitimate deliveries
  const isExtra = outcome === "Wide" || outcome === "No Ball";

  if (!isExtra) {
    matchState.totalBalls += 1;
    matchState.overs = Math.floor(matchState.totalBalls / 6) + (matchState.totalBalls % 6) / 10;
    // More precise overs display: e.g. 3.4 means 3 overs 4 balls
    const completedOvers = Math.floor(matchState.totalBalls / 6);
    const remainingBalls = matchState.totalBalls % 6;
    matchState.overs = parseFloat(`${completedOvers}.${remainingBalls}`);
    matchState.ballsRemaining = 120 - matchState.totalBalls;
  }

  matchState.runs += runs;
  matchState.runsRequired -= runs;

  // Consecutive dots tracking
  if (outcome === "Dot") {
    matchState.consecutiveDots += 1;
  } else {
    matchState.consecutiveDots = 0;
  }

  // Wickets
  if (outcome === "Wicket") {
    matchState.wickets += 1;
  }

  // Store event in log
  const eventEntry = {
    over,
    ball,
    batsman,
    bowler,
    outcome,
    runs,
    totalBalls: matchState.totalBalls,
    timestamp: Date.now(),
  };

  matchState.eventLog.push(eventEntry);

  // Recent events — keep last 6
  matchState.recentEvents.push(eventEntry);
  if (matchState.recentEvents.length > 6) {
    matchState.recentEvents.shift();
  }

  // Update tension level
  matchState.tensionLevel = calculateTensionLevel(matchState);
}

function calculatePressureScore(state) {
  if (state.ballsRemaining <= 0) return 0;
  const rrr = (state.runsRequired / state.ballsRemaining) * 6;
  const currentRR = state.overs > 0 ? (state.runs / getOversAsDecimal(state)) : 8;
  const rrrGap = Math.max(0, rrr - currentRR);
  const wicketPressure = state.wickets * 8;
  const dotPressure = state.consecutiveDots * 7;
  const deathPressure = getOversAsDecimal(state) >= 15 ? 20 : 0;
  const middlePressure = (getOversAsDecimal(state) >= 10 && getOversAsDecimal(state) < 15) ? 8 : 0;
  const raw = (rrrGap * 4) + wicketPressure + dotPressure +
    deathPressure + middlePressure;
  return Math.min(100, Math.round(raw));
}

// Helper: convert overs display (3.4) to decimal overs (3.6667)
function getOversAsDecimal(state) {
  const completedOvers = Math.floor(state.totalBalls / 6);
  const remainingBalls = state.totalBalls % 6;
  return completedOvers + (remainingBalls / 6);
}

function calculateTensionLevel(state) {
  const score = calculatePressureScore(state);
  if (score >= 86) return "CRITICAL";
  if (score >= 61) return "HIGH";
  if (score >= 31) return "MEDIUM";
  return "LOW";
}

function getPhase(state) {
  const oversDecimal = getOversAsDecimal(state);
  if (oversDecimal < 6) return "POWERPLAY";
  if (oversDecimal < 15) return "MIDDLE OVERS";
  return "DEATH OVERS";
}

function getRecentBallsFormatted(state) {
  return state.recentEvents
    .map((e) => `${e.batsman} — ${e.outcome}${e.runs > 0 ? ` (${e.runs})` : ""} off ${e.bowler}`)
    .join("\n");
}

module.exports = {
  matchState,
  setupMatch,
  updateMatchState,
  calculatePressureScore,
  calculateTensionLevel,
  getPhase,
  getOversAsDecimal,
  getRecentBallsFormatted,
};
