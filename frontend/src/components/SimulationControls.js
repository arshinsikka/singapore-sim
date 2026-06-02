import React from 'react';

const MODE_CONFIG = [
  {
    key:   'diverse',
    icon:  '🌏',
    title: 'Diverse population',
    desc:  'Agents drawn from across Singapore\'s demographic groups',
  },
  {
    key:   'homogeneous',
    icon:  '👥',
    title: 'Uniform population',
    desc:  'All agents share the same ethnicity and income level',
  },
];

const ROUNDS_CONFIG = [
  {
    key:   1,
    icon:  '○',
    title: 'Single round',
    desc:  'Each citizen responds without hearing from others first',
  },
  {
    key:   3,
    icon:  '◎',
    title: '3 rounds',
    desc:  'Agents update after hearing the group — reveals belief drift',
  },
];

function SimulationControls({
  mode, onModeChange,
  numRounds, onRoundsChange,
  onRun, onCompare,
  loading, comparisonLoading, disabled,
}) {
  return (
    <div className="simulation-controls">

      {/* Population type */}
      <div>
        <div className="control-group-label">Population type</div>
        <div className="mode-cards">
          {MODE_CONFIG.map(cfg => (
            <button
              key={cfg.key}
              className={`mode-card${mode === cfg.key ? ' active' : ''}`}
              onClick={() => onModeChange(cfg.key)}
              type="button"
            >
              <span className="mode-card-icon">{cfg.icon}</span>
              <span className="mode-card-title">{cfg.title}</span>
              <span className="mode-card-desc">{cfg.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Simulation rounds */}
      <div>
        <div className="control-group-label">Simulation rounds</div>
        <div className="rounds-cards">
          {ROUNDS_CONFIG.map(cfg => (
            <button
              key={cfg.key}
              className={`rounds-card${numRounds === cfg.key ? ' active' : ''}`}
              onClick={() => onRoundsChange(cfg.key)}
              type="button"
            >
              <span className="rounds-card-icon">{cfg.icon}</span>
              <span className="rounds-card-title">{cfg.title}</span>
              <span className="rounds-card-desc">{cfg.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Run button */}
      <button
        className="run-button"
        onClick={onRun}
        disabled={disabled}
        type="button"
      >
        {loading ? 'Running simulation…' : 'Run Simulation'}
      </button>

      {/* Compare button */}
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
