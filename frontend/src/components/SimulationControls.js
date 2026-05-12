// SimulationControls.js — Population mode toggle, rounds selector, Run and Compare buttons

import React from 'react';

const MODE_EXPLANATIONS = {
  diverse:      'Agents drawn from across Singapore\'s demographic groups',
  homogeneous:  'All agents share the same ethnicity and income level — useful as a comparison baseline',
};

function SimulationControls({
  mode, onModeChange,
  numRounds, onRoundsChange,
  onRun, onCompare,
  loading, comparisonLoading, disabled,
}) {
  return (
    <div className="simulation-controls">
      {/* ── Population mode toggle ── */}
      <div>
        <div className="control-group-label">Population type</div>
        <div className="toggle-group">
          <button
            className={`toggle-option${mode === 'diverse' ? ' active' : ''}`}
            onClick={() => onModeChange('diverse')}
            type="button"
          >
            Diverse population
          </button>
          <button
            className={`toggle-option${mode === 'homogeneous' ? ' active' : ''}`}
            onClick={() => onModeChange('homogeneous')}
            type="button"
          >
            Uniform population
          </button>
        </div>
        <p className="toggle-explanation">{MODE_EXPLANATIONS[mode]}</p>
      </div>

      {/* ── Rounds selector ── */}
      <div>
        <div className="control-group-label">Simulation rounds</div>
        <div className="rounds-group">
          <label className={`rounds-option${numRounds === 1 ? ' active' : ''}`}>
            <input
              type="radio"
              name="rounds"
              checked={numRounds === 1}
              onChange={() => onRoundsChange(1)}
            />
            <span>
              <span className="rounds-option-title">Single round (independent views)</span>
              <span className="rounds-option-desc">
                Each citizen responds without hearing from others first
              </span>
            </span>
          </label>

          <label className={`rounds-option${numRounds === 3 ? ' active' : ''}`}>
            <input
              type="radio"
              name="rounds"
              checked={numRounds === 3}
              onChange={() => onRoundsChange(3)}
            />
            <span>
              <span className="rounds-option-title">3 rounds (agents update after hearing from the group)</span>
              <span className="rounds-option-desc">
                Shows how opinions shift when people learn what others think — belief drift
              </span>
            </span>
          </label>
        </div>
      </div>

      {/* ── Run button ── */}
      <button
        className="run-button"
        onClick={onRun}
        disabled={disabled}
        type="button"
      >
        {loading ? 'Running simulation…' : 'Run Simulation'}
      </button>

      {/* ── Compare button ── */}
      <button
        className="compare-button"
        onClick={onCompare}
        disabled={disabled}
        type="button"
      >
        {comparisonLoading ? 'Running comparison…' : 'Compare: Diverse vs Uniform'}
      </button>
    </div>
  );
}

export default SimulationControls;
