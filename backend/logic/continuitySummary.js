// Continuity summary — compresses all chapters into a 4-sentence summary every 3 chapters
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function updateStorySummary(chapters) {
  const allChaptersText = chapters
    .map((ch, i) => `Chapter ${i + 1}:\n${ch}`)
    .join("\n\n---\n\n");

  const prompt = `Summarize the following cricket match narrative chapters in exactly 4 sentences.
Preserve: the emotional arc, key player names, pivotal moments, the current tension level, and any narrative threads that are building.
Output ONLY the 4-sentence summary. No labels, no preamble.

CHAPTERS:
${allChaptersText}`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 150,
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Continuity summary error:", error.message);
    // Return whatever we had before
    return "";
  }
}

module.exports = { updateStorySummary };
