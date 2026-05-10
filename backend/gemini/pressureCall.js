// Pressure psychological assessment via Gemini 1.5 Flash
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const FALLBACK_TEXT = "The batsman steadies himself under the weight of the moment.";

async function getPressureRead(state, pressureScore) {
  const { getPhase, getOversAsDecimal } = require("../logic/matchState");

  const rrr = state.ballsRemaining > 0
    ? ((state.runsRequired / state.ballsRemaining) * 6).toFixed(2)
    : "0.00";
  const currentRR = getOversAsDecimal(state) > 0
    ? (state.runs / getOversAsDecimal(state)).toFixed(2)
    : "8.00";
  const phase = getPhase(state);

  const prompt = `You are a cricket sports psychologist giving a real-time mental state assessment.

MATCH DATA:
- Batsman: ${state.currentBatsman}
- Pressure Score: ${pressureScore}/100
- Consecutive dot balls: ${state.consecutiveDots}
- Required run rate: ${rrr}
- Current run rate: ${currentRR}
- Wickets fallen: ${state.wickets}
- Balls remaining: ${state.ballsRemaining}
- Phase: ${phase}

Write exactly 2 sentences assessing ${state.currentBatsman}'s psychological state.
Be specific to the numbers. Sound like a sports psychologist, not a commentator.
Output ONLY the 2 sentences. No labels, no preamble, no explanation.`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 120,
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Pressure call error:", error.message);
    return FALLBACK_TEXT;
  }
}

module.exports = { getPressureRead };
