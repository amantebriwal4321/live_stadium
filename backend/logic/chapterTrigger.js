// Determines whether the current ball event should trigger a narrative chapter

function shouldGenerateChapter(matchState) {
  const { lastEventType, totalBalls, recentEvents, eventLog } = matchState;

  // 1. Wicket — always triggers
  if (lastEventType === "Wicket") return true;

  // 2. Start of innings (first ball)
  if (totalBalls === 1) return true;

  // 3. Every 5 overs (ball 30, 60, 90)
  if (totalBalls > 0 && totalBalls % 30 === 0) return true;

  // 4. Back-to-back boundaries (last 2 events are both Four or Six)
  if (recentEvents.length >= 2) {
    const last = recentEvents[recentEvents.length - 1];
    const secondLast = recentEvents[recentEvents.length - 2];
    const isBoundary = (e) => e.outcome === "Four" || e.outcome === "Six";
    if (isBoundary(last) && isBoundary(secondLast)) return true;
  }

  // 5. Big over (12+ runs in the current over)
  const currentOverBalls = getCurrentOverEvents(eventLog, totalBalls);
  if (currentOverBalls.length === 6) {
    const overRuns = currentOverBalls.reduce((sum, e) => sum + e.runs, 0);
    if (overRuns >= 12) return true;
  }

  // 6. Final over (starts at ball 115, i.e. over 19.1)
  if (totalBalls === 115) return true;

  return false;
}

function getCurrentOverEvents(eventLog, totalBalls) {
  const currentOverStart = Math.floor((totalBalls - 1) / 6) * 6 + 1;
  return eventLog.filter((e) => e.totalBalls >= currentOverStart && e.totalBalls <= totalBalls);
}

function getTriggerLabel(matchState) {
  const { lastEventType, currentBatsman, currentBowler, totalBalls } = matchState;

  if (totalBalls === 1) return "Innings begins";
  if (lastEventType === "Wicket") return `WICKET: ${currentBatsman} dismissed by ${currentBowler}`;
  if (totalBalls % 30 === 0) return `After ${Math.floor(totalBalls / 6)} overs`;
  if (totalBalls === 115) return "Final over begins";

  // Check back-to-back boundaries
  const recent = matchState.recentEvents;
  if (recent.length >= 2) {
    const last = recent[recent.length - 1];
    const isBoundary = (e) => e.outcome === "Four" || e.outcome === "Six";
    if (isBoundary(last)) {
      return `${currentBatsman} — ${lastEventType} off ${currentBowler}`;
    }
  }

  return `${currentBatsman} — ${lastEventType} off ${currentBowler}`;
}

module.exports = { shouldGenerateChapter, getTriggerLabel };
