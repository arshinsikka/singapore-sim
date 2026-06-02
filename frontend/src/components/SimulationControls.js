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

const MODEL_OPTIONS = [
  { label: 'GPT-4o mini', value: 'gpt-4o-mini' },
  { label: 'GPT-4o',      value: 'gpt-4o'      },
];

function roundsDescription(n) {
  if (n === 1) return 'Each citizen reasons independently';
  if (n <= 3)  return `Agents update their views across ${n} rounds`;
  return `Extended deliberation across ${n} rounds — shows strongest belief drift`;
}

function SimulationControls({
  mode, onModeChange,
  numRounds, onRoundsChange,
  numAgents, onNumAgentsChange,
  model, onModelChange,
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

      {/* Simulation rounds — slider */}
      <div>
        <div className="control-group-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Simulation rounds</span>
          <span style={{ fontWeight: 700, color: 'var(--navy, #0a193c)' }}>{numRounds}</span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={numRounds}
          onChange={e => onRoundsChange(Number(e.target.value))}
          style={sliderStyle}
        />
        <div style={sliderCaption}>{roundsDescription(numRounds)}</div>
      </div>

      {/* Number of agents — slider */}
      <div>
        <div className="control-group-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Number of agents</span>
          <span style={{ fontWeight: 700, color: 'var(--navy, #0a193c)' }}>{numAgents}</span>
        </div>
        <input
          type="range"
          min={10}
          max={50}
          step={5}
          value={numAgents}
          onChange={e => onNumAgentsChange(Number(e.target.value))}
          style={sliderStyle}
        />
        <div style={sliderCaption}>Simulating {numAgents} synthetic Singapore citizens</div>
      </div>

      {/* Language model */}
      <div>
        <div className="control-group-label">Language model</div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {MODEL_OPTIONS.map(opt => {
            const active = model === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onModelChange(opt.value)}
                style={{
                  flex: 1,
                  padding: '0.45rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: `1.5px solid var(--navy, #0a193c)`,
                  background: active ? 'var(--navy, #0a193c)' : 'transparent',
                  color: active ? '#ffffff' : 'var(--navy, #0a193c)',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {opt.label}
              </button>
            );
          })}
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

const sliderStyle = {
  width: '100%',
  marginTop: '0.4rem',
  accentColor: 'var(--navy, #0a193c)',
  cursor: 'pointer',
};

const sliderCaption = {
  fontSize: '0.78rem',
  color: 'var(--text-muted, #5a6a85)',
  marginTop: '0.3rem',
};

export default SimulationControls;
