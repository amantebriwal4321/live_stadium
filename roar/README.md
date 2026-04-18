# 🏏 ROAR — Feel the Match. Find Your People.

**Real-time AI-powered cricket fan experience for IPL 2026.**

ROAR transforms watching a cricket match into a collective emotional experience. Pick your team, feel the crowd pulse, react in real-time, and experience the Ghost Ball — an AI-generated emotional reconstruction of what thousands of fans felt at the same moment.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** — Check: `node --version`
- **npm** — Comes with Node.js

### Setup
```bash
cd Statium_Network/roar
npm install
```

### Run
```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🎯 Demo Flow (4 minutes)

| Time | What Happens |
|------|-------------|
| 0:00 | Open app. Stadium lights flicker on. "Who do you bleed for?" Select RCB. Screen explodes red. |
| 0:30 | Match lobby. 12,847 pulsing fan dots. Tribal Narrator reads pre-match provocation. |
| 1:00 | Enter live match. Emotion Stream flowing. Reactions floating up. Living pulse of the crowd. |
| 1:30 | Events fire automatically — FOUR, SIX, WICKET. Event banners slam in. Emotion split shows live. Tribal Narrator generates both perspectives. |
| 2:15 | Moment Group forms: "You and 7 others just lost their minds." |
| 2:45 | Trigger Ghost Ball. Dark overlay. Glowing orb. Waveform animates. Text types out. |
| 3:15 | Ghost Ball ends: "This is what 11,000 people felt." Gift button appears. |
| 3:45 | Rival Bridge: Two fans, opposite emotions, introduced by AI. 90-second timer. |
| 4:00 | End on ROAR wordmark: "Feel the match. Find your people." |

### Demo Controls
- Use the **Demo Speed** buttons (1x, 2x, 3x) in the lobby to control event timing
- Use **manual event triggers** (SIX, FOUR, WICKET, CLOSE CALL) during the match
- **PLAY GHOST BALL** button appears after any intensity 8+ event

---

## 🏗️ Architecture

```
ROAR (Next.js 14 App Router)
├── Team Select Screen       → "Who do you bleed for?"
├── Match Lobby Screen        → Fan dots, presence count, tribal narrator
├── Live Match Screen         → Scoreboard, emotion stream, events, narrator
├── Ghost Ball Overlay        → AI-generated emotional reconstruction
├── Rival Bridge Overlay      → Meet a fan with the opposite emotion
└── API Routes
    ├── /api/narrator         → Gemini tribal text (fallback mode)
    └── /api/ghostball        → Gemini + TTS (fallback mode)
```

---

## 📁 File Structure

```
roar/
├── src/
│   ├── app/
│   │   ├── layout.js              # Root layout + fonts + metadata
│   │   ├── page.js                # All 3 screens (team select → lobby → match)
│   │   ├── globals.css            # Design system + animations
│   │   └── api/
│   │       ├── narrator/route.js  # Tribal narrator endpoint
│   │       └── ghostball/route.js # Ghost Ball endpoint
│   ├── context/
│   │   └── MatchContext.js        # Global state + mock match engine
│   ├── lib/
│   │   ├── constants.js           # Teams, emotions, mock data, events
│   │   └── matchEngine.js         # Event sequencer + reaction generator
│   └── components/
│       ├── TeamSelect.jsx         # "Who do you bleed for?" selector
│       ├── Scoreboard.jsx         # Live scoreboard + player highlights
│       ├── FanDots.jsx            # Canvas pulsing fan visualization
│       ├── EmotionStream.jsx      # Virtualized floating emoji reactions
│       ├── EmotionButtons.jsx     # Emotion submission UI
│       ├── EventBanner.jsx        # Full-width event takeover banner
│       ├── EventFeed.jsx          # Ball-by-ball event log
│       ├── TribalNarrator.jsx     # Dual AI narrator (both perspectives)
│       ├── EmotionSplit.jsx       # Side-by-side emotion distribution
│       ├── MomentGroup.jsx        # "You and N others" group card
│       ├── GhostBall.jsx          # Full Ghost Ball experience
│       └── RivalBridge.jsx        # Split-screen rival meeting
├── .env.local                     # Environment variables (placeholder)
├── package.json
└── README.md
```

---

## 🔧 Google Cloud Products

| Product | Usage | Status |
|---------|-------|--------|
| **Vertex AI / Gemini 1.5 Pro** | Tribal Narrator + Ghost Ball scripts | Placeholder (fallback active) |
| **Cloud Text-to-Speech** | Ghost Ball audio generation | Placeholder |
| **Firebase Firestore** | Real-time emotions + groups | Placeholder (mock data) |
| **Firebase Realtime DB** | Presence counter | Placeholder (mock data) |
| **Firebase Storage** | Ghost Ball audio files | Placeholder |
| **Firebase Hosting** | Production deployment | Not yet deployed |

---

## 📋 Environment Variables

Copy `.env.local` and fill in:

| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console |
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) |
| `GOOGLE_CLOUD_PROJECT_ID` | GCP Console |

**For the demo, no environment variables are needed.** Everything runs with mock data and fallbacks.

---

## 🎨 Features

### Core Experience
- **Team Selection** — Dramatic "Who do you bleed for?" with team explosion
- **Live Scoreboard** — RCB 178/4 chasing 192, with player highlights (Kohli 72*)
- **Match Situation Banner** — Dynamic: "FINAL OVER DRAMA", "HIGH PRESSURE MOMENT"

### Real-Time
- **Emotion Stream** — Virtualized floating reactions (max 30 DOM nodes)
- **Emotion Buttons** — 6 emotions: Euphoric, Nervous, Devastated, Disbelief, Furious, Hopeful
- **Fan Presence** — 12,847 pulsing fan dots with live count
- **Moment Groups** — "You and 7 others just lost their minds"

### AI-Powered
- **Tribal Narrator** — Dual perspective (RCB faithful + Paltan) on every major event
- **Ghost Ball** — 30-second AI-narrated emotional reconstruction with glowing orb
- **Rival Bridge** — Meet a fan who felt the opposite, with AI conversation starter

### Match Events
- 💥 SIX — highest intensity, triggers Ghost Ball
- 🏏 FOUR — high intensity, triggers narrator
- 💀 WICKET — devastating, triggers narrator + moment groups
- 😱 CLOSE CALL — near miss, triggers narrator
- Events fire automatically OR manually via Demo Controls

---

## 📦 Deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

Or deploy to Vercel:
```bash
npx vercel --prod
```

---

## License

Built for the Google Cloud Hackathon, 2025-26.
