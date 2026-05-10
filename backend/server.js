require("dotenv").config();
const express = require("express");
const cors = require("cors");

const {
  matchState,
  setupMatch,
  updateMatchState,
  calculatePressureScore,
  getPhase,
  getOversAsDecimal,
  getRecentBallsFormatted,
} = require("./logic/matchState");
const { shouldGenerateChapter, getTriggerLabel } = require("./logic/chapterTrigger");
const { updateStorySummary } = require("./logic/continuitySummary");
const { getPressureRead } = require("./gemini/pressureCall");
const { generateChapter, generateEpilogue } = require("./gemini/narratorCall");
const { getLiveMatchId, getLiveScore } = require("./api/cricketPoller");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ---------- SSE ----------
const sseClients = [];
let isChapterGenerating = false;
const chapterQueue = [];

// ---------- LIVE POLLING STATE ----------
let livePollingInterval = null;
let liveMatchId = null;
let liveSource = "manual"; // "manual" or "live_api"

function broadcast(data) {
  const msg = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((res) => {
    try {
      res.write(msg);
    } catch (e) {
      // client likely disconnected
    }
  });
}

app.get("/stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  // Send initial heartbeat
  res.write("data: {\"type\":\"connected\"}\n\n");

  sseClients.push(res);
  console.log(`SSE client connected. Total: ${sseClients.length}`);

  req.on("close", () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
    console.log(`SSE client disconnected. Total: ${sseClients.length}`);
  });
});

// ---------- ENDPOINTS ----------

// POST /setup — initialize match
app.post("/setup", (req, res) => {
  const { target, battingTeam, bowlingTeam } = req.body;
  setupMatch(target || 180, battingTeam || "RCB", bowlingTeam || "DC");
  console.log(`Match setup: ${matchState.battingTeam} vs ${matchState.bowlingTeam}, target: ${matchState.runsRequired}`);
  res.json({ success: true });
});

// POST /event — submit a ball event
app.post("/event", async (req, res) => {
  const { over, ball, batsman, bowler, outcome, runs } = req.body;

  if (!batsman || !bowler || !outcome) {
    return res.status(400).json({ error: "Missing required fields: batsman, bowler, outcome" });
  }

  // 1. Update match state
  updateMatchState({ over, ball, batsman, bowler, outcome, runs: Number(runs) || 0 });

  // 2. Calculate pressure score
  const pressureScore = calculatePressureScore(matchState);

  // Store in pressure history
  matchState.pressureHistory.push({
    ball: matchState.totalBalls,
    score: pressureScore,
  });

  // 3. Broadcast state update
  liveSource = "manual";
  broadcast({
    type: "state_update",
    matchState: { ...matchState },
    pressureScore,
    source: "manual",
  });

  // Respond immediately so UI doesn't block
  res.json({ success: true, pressureScore });

  // 4. Call getPressureRead (async, non-blocking for the HTTP response)
  try {
    const psychRead = await getPressureRead(matchState, pressureScore);
    matchState.lastPsychRead = psychRead;

    // 5. Broadcast psych read
    broadcast({
      type: "psych_read",
      text: psychRead,
      score: pressureScore,
    });
  } catch (err) {
    console.error("Psych read error:", err.message);
    matchState.lastPsychRead = "The batsman steadies himself under the weight of the moment.";
    broadcast({
      type: "psych_read",
      text: matchState.lastPsychRead,
      score: pressureScore,
    });
  }

  // 6. Check if chapter should generate
  if (shouldGenerateChapter(matchState)) {
    if (isChapterGenerating) {
      // Queue it
      chapterQueue.push({ pressureScore });
      console.log("Chapter queued. Queue size:", chapterQueue.length);
    } else {
      await processChapter(pressureScore);
    }
  }
});

async function processChapter(pressureScore) {
  isChapterGenerating = true;

  const triggerLabel = getTriggerLabel(matchState);

  // 7a. Broadcast chapter start
  broadcast({ type: "chapter_start" });

  // 7b. Generate chapter with streaming
  const fullText = await generateChapter(
    matchState,
    pressureScore,
    triggerLabel,
    (chunk) => {
      broadcast({ type: "chapter_chunk", text: chunk });
    }
  );

  // 7c. Store chapter
  matchState.chapterCount += 1;
  matchState.chapters.push(fullText);

  // 7d. Broadcast chapter end
  broadcast({
    type: "chapter_end",
    chapterNumber: matchState.chapterCount,
    triggerLabel,
  });

  // 7e. Update continuity summary every 3 chapters
  if (matchState.chapters.length % 3 === 0) {
    try {
      const summary = await updateStorySummary(matchState.chapters);
      if (summary) {
        matchState.storySummary = summary;
        console.log("Story summary updated:", summary.substring(0, 80) + "...");
      }
    } catch (err) {
      console.error("Summary update error:", err.message);
    }
  }

  isChapterGenerating = false;

  // Process queued chapters
  if (chapterQueue.length > 0) {
    const queued = chapterQueue.shift();
    await processChapter(queued.pressureScore);
  }
}

// POST /endmatch — generate epilogue
app.post("/endmatch", async (req, res) => {
  const { result } = req.body;
  matchState.matchEnded = true;

  broadcast({ type: "epilogue_start" });

  try {
    const epilogueText = await generateEpilogue(matchState, (chunk) => {
      broadcast({ type: "epilogue_chunk", text: chunk });
    });

    matchState.chapters.push(`[EPILOGUE]\n${epilogueText}`);
    broadcast({ type: "epilogue_end" });
  } catch (err) {
    console.error("Epilogue error:", err.message);
    broadcast({ type: "epilogue_end" });
  }

  res.json({ success: true });
});

// GET /state — return current state for reconnection
app.get("/state", (req, res) => {
  const pressureScore = calculatePressureScore(matchState);
  res.json({
    matchState: { ...matchState },
    pressureScore,
    source: liveSource,
  });
});

// ---------- LIVE CRICKET API ENDPOINTS ----------

// POST /startlive — find match and begin polling every 30s
app.post("/startlive", async (req, res) => {
  const apiKey = process.env.CRICKET_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "CRICKET_API_KEY not set in .env" });
  }

  // Stop any existing polling
  if (livePollingInterval) {
    clearInterval(livePollingInterval);
    livePollingInterval = null;
  }

  // Find the match
  try {
    liveMatchId = await getLiveMatchId(apiKey);
  } catch (err) {
    console.error("Error finding live match:", err.message);
  }

  if (!liveMatchId) {
    return res.status(404).json({
      error: "RCB vs DC match not found in current live matches. Ensure the match is live.",
    });
  }

  console.log(`[Live] Polling started for match: ${liveMatchId}`);
  liveSource = "live_api";

  // Do an immediate first poll
  await pollLiveScore(apiKey);

  // Start interval — poll every 30 seconds
  livePollingInterval = setInterval(() => {
    pollLiveScore(apiKey);
  }, 30000);

  res.json({ success: true, matchId: liveMatchId });
});

// POST /stoplive — stop live polling
app.post("/stoplive", (req, res) => {
  if (livePollingInterval) {
    clearInterval(livePollingInterval);
    livePollingInterval = null;
    liveMatchId = null;
    liveSource = "manual";
    console.log("[Live] Polling stopped.");

    // Notify frontend that source changed back to manual
    const pressureScore = calculatePressureScore(matchState);
    broadcast({
      type: "state_update",
      matchState: { ...matchState },
      pressureScore,
      source: "manual",
    });
  }
  res.json({ success: true });
});

/**
 * Core polling function — fetches live score and updates match state.
 * Called by the 30s interval. Silently fails on API errors.
 */
async function pollLiveScore(apiKey) {
  try {
    const score = await getLiveScore(apiKey, liveMatchId);
    if (!score) return;

    // Update the core fields from API data
    matchState.runs = score.runs;
    matchState.wickets = score.wickets;
    matchState.overs = score.overs;
    matchState.totalBalls = score.totalBalls;
    matchState.ballsRemaining = 120 - score.totalBalls;
    matchState.battingTeam = score.battingTeam || matchState.battingTeam;

    // Recalculate derived values using existing logic
    matchState.tensionLevel = calculateTensionLevel(matchState);
    const pressureScore = calculatePressureScore(matchState);

    // Store in pressure history
    matchState.pressureHistory.push({
      ball: matchState.totalBalls,
      score: pressureScore,
    });

    // Broadcast to all SSE clients
    broadcast({
      type: "state_update",
      matchState: { ...matchState },
      pressureScore,
      source: "live_api",
    });

    console.log(
      `[Live] ${matchState.battingTeam} ${matchState.runs}/${matchState.wickets}` +
      ` (${matchState.overs} ov) | Pressure: ${pressureScore} | Tension: ${matchState.tensionLevel}`
    );

    // Stop polling if match ended
    if (score.matchStatus === "completed") {
      console.log("[Live] Match completed. Stopping poll.");
      clearInterval(livePollingInterval);
      livePollingInterval = null;
      matchState.matchEnded = true;
    }
  } catch (err) {
    console.error("[Live] Poll error (silent):", err.message);
    // Silent fail — don't crash the app
  }
}

// ---------- START ----------
app.listen(PORT, () => {
  console.log(`\n🏏 The Living Match — Backend running on http://localhost:${PORT}`);
  console.log(`   SSE endpoint: http://localhost:${PORT}/stream`);
  console.log(`   Gemini API key: ${process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ MISSING — add GEMINI_API_KEY to .env"}`);
  console.log(`   Cricket API key: ${process.env.CRICKET_API_KEY ? "✅ Loaded" : "⚠️  Not set (live polling disabled)"}\n`);
});
