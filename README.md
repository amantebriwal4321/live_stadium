# 🏏 The Living Match

**Real-time AI-powered cricket narrative intelligence.**

The Living Match transforms a live cricket match into a literary experience. As you watch a match (like RCB vs DC), the application tracks the match state either via **Live Data Polling** or **Manual Entry**. Using Google Gemini 1.5 Flash, the app generates two things simultaneously:
- A **Pressure Index**: A psychological assessment of the batsman's mental state, updated dynamically based on tension level.
- A **Match Narrator**: Literary chapters that stream in real-time when triggered by match events (wickets, boundaries, milestones), turning the match into a novel-like story.

The narrative engine uses a continuity system — every 3 chapters, all previous chapters are compressed into a summary that feeds into future chapter prompts, ensuring the story maintains emotional continuity across the full innings.

---

## ✨ Features

- **Dual Modes:** Track matches via an automated Live Cricket API or input ball-by-ball events manually.
- **Dynamic Pressure Calculation:** An algorithm continuously evaluates match tension based on required run rates, wickets remaining, and recent events.
- **AI-Driven Psych Reads:** Uses Gemini to generate short, intense psychological reads of the players' mental state.
- **Real-Time Narrative Generation:** Streams rich narrative "chapters" and "epilogues" as the match progresses and reaches critical turning points.
- **Server-Sent Events (SSE):** Ensures instantaneous frontend updates without constant polling.

---

## 📋 Prerequisites

- **Node.js 18+** — Check: `node --version`
  - If not installed: [https://nodejs.org](https://nodejs.org) → download LTS
- **npm** — Comes with Node.js
- **Google AI Studio account** (free) — [https://aistudio.google.com](https://aistudio.google.com)
- *(Optional)* **CricketData API account** (free) — [https://cricketdata.org/](https://cricketdata.org/) for automated live score polling.

---

## 🚀 Quick Start (Under 10 Minutes)

### Step 1: Get API Keys
1. **Gemini API Key (Required):** Go to [Google AI Studio](https://aistudio.google.com), sign in, and create an API key.
2. **CricketData API Key (Optional):** Go to [CricketData.org](https://cricketdata.org/), sign up for the free tier, and get your API key.

### Step 2: Setup Backend
```bash
cd living-match/backend
npm install
```

Create a `.env` file in the `backend/` directory based on the `.env.example`:
```env
GEMINI_API_KEY=AIza...your_gemini_key_here
CRICKET_API_KEY=your_cricket_api_key_here # Optional for manual mode
```

Start the backend server:
```bash
npm run dev
```
You should see: `🏏 The Living Match — Backend running on http://localhost:3001`

### Step 3: Setup Frontend
Open a **new terminal**:
```bash
cd living-match/frontend
npm install
npm run dev
```

### Step 4: Open the App
Open **http://localhost:5173** in your browser.

### Step 5: Start the Match

**Mode A: Live Polling (Requires CRICKET_API_KEY)**
1. Ensure your `.env` has the `CRICKET_API_KEY` configured.
2. Click **"Start Live Polling"** in the Score Panel. The app will automatically find the live match and poll for updates every 30 seconds.

**Mode B: Manual Entry**
1. Set the target runs (e.g., 180).
2. Select batting team and bowling team.
3. Click **"Start Match"** in the Event Input panel.
4. After each delivery, enter the ball details (Over, Ball, Batsman, Bowler, Outcome).
5. Click **"Submit Ball"** (or press Enter).

---

## 🎯 How to Use During the Match (Manual Mode)

1. **Watch the match on TV.**
2. After each delivery, enter the ball details:
   - Over number, Ball number
   - Batsman and Bowler names
   - Outcome (Six, Four, Single, Dot, Wicket, etc.)
3. Click **"Submit Ball"**.
4. Watch the **Pressure Gauge** update with each ball.
5. Read the **Psychological Assessment** below the gauge.
6. When trigger events happen (wicket, boundaries, milestone overs), a **narrative chapter streams in** the center panel.
7. At the end of the match, click **"End Match + Generate Epilogue"**.

---

## 🔧 Google Cloud Products Used

| Product | Usage |
|---------|-------|
| **Google Gemini 1.5 Flash** | AI model for pressure reads, narrative chapters, continuity summaries, and epilogue generation. |
| **Google AI Studio** | API key management. |
| **@google/generative-ai SDK** | Node.js client for Gemini API calls with streaming support. |

---

## 🏗️ Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                        BROWSER (React SPA)                    │
│  ┌──────────┐    ┌──────────────┐    ┌─────────────┐         │
│  │ Pressure │    │  Story Panel │    │  Score Panel │         │
│  │  Panel   │    │  (chapters)  │    │  (live data) │         │
│  │  + Form  │    │              │    │  + chart     │         │
│  └────┬─────┘    └──────┬───────┘    └──────┬──────┘         │
│       │                 │                    │                 │
│       └────────┬────────┴───────────────────┘                │
│                │  EventSource (SSE)                            │
│                ▼                                              │
├──────────────────────────────────────────────────────────────┤
│                     EXPRESS SERVER (:3001)                     │
│  ┌──────────┐   ┌──────────────┐   ┌──────────────────┐      │
│  │ /event   │   │ /stream (SSE)│   │ Match State      │      │
│  │ /setup   │   │              │   │ (in-memory)      │      │
│  │ /startlive│  │              │   │                  │      │
│  └────┬─────┘   └──────────────┘   └──────────────────┘      │
│       │                                                       │
│       ▼                                                       │
│  ┌──────────────────────────────────────────┐                │
│  │          GEMINI 1.5 FLASH API            │                │
│  │  • Pressure Psychology (per ball)        │                │
│  │  • Narrative Chapters (on triggers)      │                │
│  │  • Continuity Summary (every 3 chapters) │                │
│  │  • Epilogue (end of match)               │                │
│  └──────────────────────────────────────────┘                │
└──────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure

```text
living-match/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventInput.jsx      # Ball entry form + manual setup
│   │   │   ├── PressurePanel.jsx   # SVG pressure gauge + psych read
│   │   │   ├── StoryPanel.jsx      # Narrative chapters + typewriter
│   │   │   ├── ScorePanel.jsx      # Scoreboard + Live Polling controls
│   │   │   └── PressureChart.jsx   # Recharts pressure timeline
│   │   ├── hooks/
│   │   │   └── useMatchStream.js   # SSE connection + state management
│   │   ├── App.jsx                 # Three-panel layout
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Global styles + CSS variables
│   ├── index.html                  # HTML with Google Fonts
│   ├── vite.config.js              # Vite + proxy config
│   ├── tailwind.config.js          # Tailwind theme
│   └── package.json
├── backend/
│   ├── api/
│   │   └── cricketPoller.js        # External API integration for live match polling
│   ├── gemini/
│   │   ├── pressureCall.js         # Gemini pressure assessment
│   │   └── narratorCall.js         # Gemini narrator + epilogue
│   ├── logic/
│   │   ├── matchState.js           # State + pressure formula
│   │   ├── chapterTrigger.js       # Chapter trigger conditions
│   │   └── continuitySummary.js    # Story compression
│   ├── server.js                   # Express + SSE + endpoints
│   ├── .env.example                # API key template
│   └── package.json
└── README.md
```

---

## 📋 Credentials Required

| What | Where to Get | Where to Put |
|------|-------------|-------------|
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) → Get API Key | `backend/.env` |
| `CRICKET_API_KEY` (Optional) | [cricketdata.org](https://cricketdata.org/) → Dashboard | `backend/.env` |

The Gemini 1.5 Flash free tier allows 15 requests/minute and 1 million tokens/day — more than enough for an entire 4-hour match.

---

## 📜 License

Built for the **Agentic Premier League** Google Cloud , Bengaluru 2026
