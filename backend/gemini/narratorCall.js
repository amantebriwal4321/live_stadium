// Narrator and Epilogue calls via Gemini 1.5 Flash with streaming support
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const NARRATOR_FALLBACK = "The match paused for breath. Another delivery was coming.";

const SYSTEM_INSTRUCTION = `You are a literary cricket narrator writing a real-time match novel. Your style blends Harsha Bhogle's warmth with the narrative tension of literary fiction. You write in present tense, third person. You show, you never summarize. Short urgent sentences when pressure is critical. Long flowing prose when calm.`;

async function generateChapter(state, pressureScore, triggerLabel, broadcastChunk) {
  const { getOversAsDecimal, getRecentBallsFormatted } = require("../logic/matchState");

  const rrr = state.ballsRemaining > 0
    ? ((state.runsRequired / state.ballsRemaining) * 6).toFixed(2)
    : "0.00";

  const chapterNumber = state.chapterCount + 1;
  const recentBallsFormatted = getRecentBallsFormatted(state);

  const prompt = `MATCH CONTEXT:
- Match: ${state.battingTeam} vs ${state.bowlingTeam}, IPL 2025
- Score: ${state.runs}/${state.wickets} in ${state.overs} overs
- Required: ${state.runsRequired} runs off ${state.ballsRemaining} balls
- Required RR: ${rrr}
- Tension level: ${state.tensionLevel}

BATSMAN PSYCHOLOGICAL STATE:
- ${state.currentBatsman} — Pressure Score: ${pressureScore}/100
- Psych read: ${state.lastPsychRead}

STORY SO FAR (maintain emotional continuity with this):
${state.storySummary || "This is the beginning of the match narrative."}

RECENT BALLS (last 6):
${recentBallsFormatted || "No balls bowled yet."}

TRIGGER EVENT:
${state.currentBatsman} — ${state.lastEventType} off ${state.currentBowler}

Write chapter ${chapterNumber} of this match novel in 180-220 words.
Rules:
- Present tense, third person, literary style
- Sentence rhythm must match pressure: fragmented and urgent if score > 70, flowing and measured if score < 30
- Reference specific player names
- The psychological state must bleed into the narrative
- End on a sentence that creates anticipation for the next delivery
- Output ONLY the chapter text. No title, no chapter number, no explanation.`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        temperature: 0.78,
        maxOutputTokens: 350,
      },
    });

    const result = await model.generateContentStream(prompt);

    let fullText = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        fullText += chunkText;
        broadcastChunk(chunkText);
      }
    }

    return fullText.trim() || NARRATOR_FALLBACK;
  } catch (error) {
    console.error("Narrator call error:", error.message);
    broadcastChunk(NARRATOR_FALLBACK);
    return NARRATOR_FALLBACK;
  }
}

async function generateEpilogue(state, broadcastChunk) {
  const originalTarget = state.runs + state.runsRequired;
  const result = state.runsRequired <= 0
    ? `${state.battingTeam} won`
    : `${state.bowlingTeam} defended`;

  const prompt = `MATCH SUMMARY:
- Final score: ${state.runs}/${state.wickets} in ${state.overs} overs
- Target was: ${originalTarget}
- Result: ${result}

FULL STORY SO FAR:
${state.storySummary || "A match filled with moments of tension and brilliance."}

Write a 100-120 word literary epilogue that closes this match story. 
It should feel like the final paragraph of a novel — reflective, warm, conclusive.
Reference specific players and moments from the story so far.
Output ONLY the epilogue text.`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 200,
      },
    });

    const genResult = await model.generateContentStream(prompt);

    let fullText = "";
    for await (const chunk of genResult.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        fullText += chunkText;
        broadcastChunk(chunkText);
      }
    }

    return fullText.trim();
  } catch (error) {
    console.error("Epilogue call error:", error.message);
    const fallback = "And so the match found its end, leaving behind echoes of brilliance and grit.";
    broadcastChunk(fallback);
    return fallback;
  }
}

module.exports = { generateChapter, generateEpilogue };
