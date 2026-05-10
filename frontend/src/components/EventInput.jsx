import React, { useState, useEffect, useCallback } from 'react';

const OUTCOME_RUNS = {
  Six: 6,
  Four: 4,
  Three: 3,
  Two: 2,
  Single: 1,
  Dot: 0,
  Wicket: 0,
  Wide: 1,
  'No Ball': 1,
};

const OUTCOMES = ['Six', 'Four', 'Three', 'Two', 'Single', 'Dot', 'Wicket', 'Wide', 'No Ball'];

export default function EventInput({ matchState }) {
  const [matchStarted, setMatchStarted] = useState(false);
  const [setupData, setSetupData] = useState({
    target: 180,
    battingTeam: 'RCB',
    bowlingTeam: 'DC',
  });
  const [formData, setFormData] = useState({
    over: 1,
    ball: 1,
    batsman: '',
    bowler: '',
    outcome: 'Dot',
    runs: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [eventLog, setEventLog] = useState([]);

  // Check if match was already started (reconnection)
  useEffect(() => {
    if (matchState && matchState.totalBalls > 0) {
      setMatchStarted(true);
      if (matchState.eventLog) {
        setEventLog(matchState.eventLog.slice(-10));
      }
    }
  }, [matchState]);

  const handleOutcomeChange = (outcome) => {
    setFormData(prev => ({
      ...prev,
      outcome,
      runs: OUTCOME_RUNS[outcome] ?? 0,
    }));
  };

  const handleSetup = async () => {
    try {
      const res = await fetch('/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: Number(setupData.target),
          battingTeam: setupData.battingTeam,
          bowlingTeam: setupData.bowlingTeam,
        }),
      });
      if (res.ok) {
        setMatchStarted(true);
      }
    } catch (err) {
      console.error('Setup error:', err);
    }
  };

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (submitting) return;
    if (!formData.batsman.trim() || !formData.bowler.trim()) return;

    setSubmitting(true);

    try {
      const res = await fetch('/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          over: Number(formData.over),
          ball: Number(formData.ball),
          batsman: formData.batsman.trim(),
          bowler: formData.bowler.trim(),
          outcome: formData.outcome,
          runs: Number(formData.runs),
        }),
      });

      if (res.ok) {
        // Add to local event log
        const newEntry = {
          over: formData.over,
          ball: formData.ball,
          batsman: formData.batsman,
          bowler: formData.bowler,
          outcome: formData.outcome,
          runs: formData.runs,
        };
        setEventLog(prev => [...prev.slice(-9), newEntry]);

        // Auto-increment ball number
        let nextBall = Number(formData.ball) + 1;
        let nextOver = Number(formData.over);

        // Wides and No Balls don't increment ball count
        if (formData.outcome === 'Wide' || formData.outcome === 'No Ball') {
          nextBall = Number(formData.ball);
        } else if (nextBall > 6) {
          nextBall = 1;
          nextOver += 1;
        }

        setFormData(prev => ({
          ...prev,
          over: nextOver,
          ball: nextBall,
          batsman: formData.outcome === 'Wicket' ? '' : prev.batsman,
          bowler: nextBall === 1 && formData.outcome !== 'Wide' && formData.outcome !== 'No Ball' ? '' : prev.bowler,
          outcome: 'Dot',
          runs: 0,
        }));
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  }, [formData, submitting]);

  // Keyboard shortcut: Enter submits
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && matchStarted && !submitting) {
        // Only if not focused on setup inputs
        const active = document.activeElement;
        if (active && active.closest('.setup-section')) return;
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit, matchStarted, submitting]);

  // Setup section
  if (!matchStarted) {
    return (
      <div className="p-4 setup-section">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-4">
          Match Setup
        </h3>

        <div className="space-y-3">
          <div>
            <label className="form-label">Target Runs</label>
            <input
              type="number"
              className="form-input"
              value={setupData.target}
              onChange={(e) => setSetupData(prev => ({ ...prev, target: e.target.value }))}
              id="setup-target"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="form-label">Batting Team</label>
              <select
                className="form-input"
                value={setupData.battingTeam}
                onChange={(e) => setSetupData(prev => ({ ...prev, battingTeam: e.target.value }))}
                id="setup-batting"
              >
                <option value="RCB">RCB</option>
                <option value="DC">DC</option>
              </select>
            </div>
            <div>
              <label className="form-label">Bowling Team</label>
              <select
                className="form-input"
                value={setupData.bowlingTeam}
                onChange={(e) => setSetupData(prev => ({ ...prev, bowlingTeam: e.target.value }))}
                id="setup-bowling"
              >
                <option value="DC">DC</option>
                <option value="RCB">RCB</option>
              </select>
            </div>
          </div>

          <button
            className="btn-submit mt-4"
            onClick={handleSetup}
            id="start-match-btn"
          >
            🏏 Start Match
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
        Ball Entry
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Over & Ball */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="form-label">Over</label>
            <input
              type="number"
              className="form-input"
              min="1"
              max="20"
              value={formData.over}
              onChange={(e) => setFormData(prev => ({ ...prev, over: e.target.value }))}
              id="input-over"
            />
          </div>
          <div>
            <label className="form-label">Ball</label>
            <select
              className="form-input"
              value={formData.ball}
              onChange={(e) => setFormData(prev => ({ ...prev, ball: e.target.value }))}
              id="input-ball"
            >
              {[1, 2, 3, 4, 5, 6].map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Batsman & Bowler */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="form-label">Batsman</label>
            <input
              type="text"
              className="form-input"
              placeholder="Kohli"
              value={formData.batsman}
              onChange={(e) => setFormData(prev => ({ ...prev, batsman: e.target.value }))}
              id="input-batsman"
            />
          </div>
          <div>
            <label className="form-label">Bowler</label>
            <input
              type="text"
              className="form-input"
              placeholder="Axar"
              value={formData.bowler}
              onChange={(e) => setFormData(prev => ({ ...prev, bowler: e.target.value }))}
              id="input-bowler"
            />
          </div>
        </div>

        {/* Outcome */}
        <div>
          <label className="form-label">Outcome</label>
          <select
            className="form-input"
            value={formData.outcome}
            onChange={(e) => handleOutcomeChange(e.target.value)}
            id="input-outcome"
          >
            {OUTCOMES.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        {/* Runs */}
        <div>
          <label className="form-label">Runs Scored</label>
          <input
            type="number"
            className="form-input"
            min="0"
            max="12"
            value={formData.runs}
            onChange={(e) => setFormData(prev => ({ ...prev, runs: e.target.value }))}
            id="input-runs"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn-submit"
          disabled={submitting || !formData.batsman.trim() || !formData.bowler.trim()}
          id="submit-ball-btn"
        >
          {submitting ? '⏳ Submitting...' : '🏏 Submit Ball'}
        </button>
      </form>

      {/* Event Log */}
      {eventLog.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
            Recent Balls
          </h4>
          <div className="space-y-1 max-h-[140px] overflow-y-auto">
            {eventLog.slice().reverse().map((e, i) => (
              <div
                key={i}
                className="text-xs px-2 py-1 rounded"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <span className="text-text-muted">{e.over}.{e.ball}</span>
                {' '}
                <span className="text-text-primary">{e.batsman}</span>
                {' → '}
                <span className={
                  e.outcome === 'Wicket' ? 'text-tension-high font-semibold' :
                  e.outcome === 'Six' ? 'text-accent-gold font-semibold' :
                  e.outcome === 'Four' ? 'text-accent-green font-semibold' :
                  'text-text-secondary'
                }>
                  {e.outcome}
                  {e.runs > 0 && e.outcome !== 'Six' && e.outcome !== 'Four' ? ` (${e.runs})` : ''}
                </span>
                <span className="text-text-muted"> off {e.bowler}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
