import React from 'react';

const MODEL_OPTIONS = [
  { label: 'GPT-4o mini',   value: 'gpt-4o-mini'   },
  { label: 'GPT-5 mini',    value: 'gpt-5-mini'    },
  { label: 'GPT-4.1 mini',  value: 'gpt-4.1-mini'  },
];

function roundsDescription(n) {
  if (n === 1) return 'Each citizen reasons independently';
  if (n <= 3)  return `Agents update their views across ${n} rounds`;
  return `Extended deliberation across ${n} rounds — shows strongest belief drift`;
}

function SimulationControls({
  numRounds, onRoundsChange,
  numAgents,
  model, onModelChange,
  onRun,
  loading, disabled,
  onBack,
}) {
  return (
    <div className="simulation-controls">

      {/* Back link */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--navy, #0a193c)',
            cursor: 'pointer',
            fontSize: '0.88rem',
            fontWeight: 600,
            textDecoration: 'underline',
            padding: '0 0 0.5rem',
            display: 'block',
          }}
        >
          ← Back
        </button>
      )}

      {/* Selected agents (read-only) */}
      <div>
        <div className="control-group-label">Agents</div>
        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--navy, #0a193c)' }}>
          {numAgents} agent{numAgents !== 1 ? 's' : ''} selected
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
          disabled={disabled}
        />
        <div style={sliderCaption}>{roundsDescription(numRounds)}</div>
      </div>

      {/* Language model */}
      <div>
        <div className="control-group-label">Language model</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {MODEL_OPTIONS.map(opt => {
            const active = model === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onModelChange(opt.value)}
                disabled={disabled}
                style={{
                  flex: '1 1 auto',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  border: `1.5px solid var(--navy, #0a193c)`,
                  background: active ? 'var(--navy, #0a193c)' : 'transparent',
                  color: active ? '#ffffff' : 'var(--navy, #0a193c)',
                  transition: 'background 0.15s, color 0.15s',
                  opacity: disabled ? 0.6 : 1,
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
