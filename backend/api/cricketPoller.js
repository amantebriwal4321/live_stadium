// Cricket live score poller using CricketData.org (CricAPI)
const axios = require("axios");

const API_BASE = "https://api.cricapi.com/v1";

// Team name mapping — CricAPI uses full names, we use abbreviations
const TEAM_MAP = {
  "Royal Challengers Bengaluru": "RCB",
  "Royal Challengers Bangalore": "RCB",
  "Delhi Capitals": "DC",
  RCB: "RCB",
  DC: "DC",
};

const TEAM_KEYWORDS = {
  RCB: ["royal challengers", "rcb", "bengaluru", "bangalore"],
  DC: ["delhi capitals", "delhi", "dc"],
};

/**
 * Search current live matches for the RCB vs DC match.
 * Returns the match ID string or null if not found.
 */
async function getLiveMatchId(apiKey) {
  try {
    const res = await axios.get(`${API_BASE}/currentMatches`, {
      params: { apikey: apiKey, offset: 0 },
      timeout: 10000,
    });

    if (res.data?.status !== "success" || !Array.isArray(res.data?.data)) {
      console.warn("[CricPoller] API returned unexpected format:", res.data?.status);
      return null;
    }

    const matches = res.data.data;

    // Find the RCB vs DC match
    for (const match of matches) {
      if (!match.teams || !Array.isArray(match.teams)) continue;

      const teamsLower = match.teams.map((t) => t.toLowerCase());
      const hasRCB = teamsLower.some((t) =>
        TEAM_KEYWORDS.RCB.some((kw) => t.includes(kw))
      );
      const hasDC = teamsLower.some((t) =>
        TEAM_KEYWORDS.DC.some((kw) => t.includes(kw))
      );

      if (hasRCB && hasDC) {
        console.log(`[CricPoller] Found match: "${match.name}" (id: ${match.id})`);
        return match.id;
      }
    }

    console.warn("[CricPoller] No RCB vs DC match found among", matches.length, "current matches");
    return null;
  } catch (err) {
    console.error("[CricPoller] getLiveMatchId error:", err.message);
    return null;
  }
}

/**
 * Fetch live score for a specific match ID.
 * Returns a normalized score object or null on failure.
 */
async function getLiveScore(apiKey, matchId) {
  try {
    const res = await axios.get(`${API_BASE}/match_info`, {
      params: { apikey: apiKey, id: matchId },
      timeout: 10000,
    });

    if (res.data?.status !== "success" || !res.data?.data) {
      console.warn("[CricPoller] match_info returned unexpected format:", res.data?.status);
      return null;
    }

    const match = res.data.data;
    const scoreArr = match.score;

    if (!scoreArr || !Array.isArray(scoreArr) || scoreArr.length === 0) {
      console.warn("[CricPoller] No score data available yet");
      return null;
    }

    // Determine which inning is currently batting (use the last score entry)
    // CricAPI returns score entries in order; the last one is the current inning
    const currentInning = scoreArr[scoreArr.length - 1];
    const runs = currentInning.r ?? 0;
    const wickets = currentInning.w ?? 0;
    const overs = currentInning.o ?? 0;

    // Parse overs into total balls: "12.3" → 12*6+3 = 75 balls
    const oversParts = String(overs).split(".");
    const completedOvers = parseInt(oversParts[0], 10) || 0;
    const partialBalls = parseInt(oversParts[1], 10) || 0;
    const totalBalls = completedOvers * 6 + partialBalls;

    // Try to detect batting team from inning string
    let battingTeam = "";
    const inningStr = (currentInning.inning || "").toLowerCase();
    for (const [abbr, keywords] of Object.entries(TEAM_KEYWORDS)) {
      if (keywords.some((kw) => inningStr.includes(kw))) {
        battingTeam = abbr;
        break;
      }
    }

    // Match status
    const matchStatus = match.matchEnded
      ? "completed"
      : match.matchStarted
        ? "live"
        : "upcoming";

    return {
      runs,
      wickets,
      overs,
      totalBalls,
      battingTeam: battingTeam || "RCB",
      matchStatus,
      matchName: match.name || "RCB vs DC",
      inningLabel: currentInning.inning || "",
    };
  } catch (err) {
    console.error("[CricPoller] getLiveScore error:", err.message);
    return null;
  }
}

module.exports = { getLiveMatchId, getLiveScore };
