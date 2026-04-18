import { NextResponse } from 'next/server';

// POST /api/narrator
// Generates tribal narration for both team perspectives
// In production: calls Gemini 1.5 Pro. For demo: returns fallback text.
export async function POST(request) {
  try {
    const body = await request.json();
    const { eventType, teamLoyalty, matchContext, fanSentiment } = body;

    // In production, this would call Gemini via @google/generative-ai
    // const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    // For now, return contextual fallback text

    const indiaTexts = {
      SIX: "The ball disappears and so does every shred of doubt. Chinnaswamy doesn't have a roof but right now it has a religion.",
      FOUR: "Through the gap like a knife through years of heartbreak. This is what loyalty earns you.",
      WICKET: "The ground tilts. Everything we built, ball by ball, cracks in one moment of cruelty.",
      CLOSE_CALL: "The heart stops. Then starts again. This is not sport. This is cardiac arrest with a scoreboard.",
      DOT: "One ball. No runs. The pressure is a living thing now, sitting on the batsman's shoulder.",
    };

    const opponentTexts = {
      SIX: "We watch it sail over the boundary and feel the game slip through our fingers like sand.",
      FOUR: "They find the gap again. The Chinnaswamy roars and we hear nothing but the sound of control slipping.",
      WICKET: "Finally. The crack in their armor. Mumbai doesn't celebrate quietly — Mumbai celebrates like it owns the night.",
      CLOSE_CALL: "So close to ending their fairytale. The cricket gods are cruel tonight.",
      DOT: "Bumrah delivers perfection. Dot balls are not silence — they are our battle cry.",
    };

    const indiaText = indiaTexts[eventType] || indiaTexts.DOT;
    const opponentText = opponentTexts[eventType] || opponentTexts.DOT;

    return NextResponse.json({ indiaText, opponentText });
  } catch (error) {
    console.error('Narrator error:', error);
    return NextResponse.json(
      { error: 'Failed to generate narration' },
      { status: 500 }
    );
  }
}
