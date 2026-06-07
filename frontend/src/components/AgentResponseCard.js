import React, { useState } from 'react';

const POSITION_BADGE = {
  Support: 'badge-support',
  Oppose:  'badge-oppose',
  Neutral: 'badge-neutral',
};

const POSITION_CARD_CLASS = {
  Support: 'pos-support',
  Oppose:  'pos-oppose',
  Neutral: 'pos-neutral',
};

function getInitials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function AgentResponseCard({ response, persona }) {
  const [expanded, setExpanded] = useState(false);
  const initials = getInitials(response.persona_name);

  return (
    <div className={`agent-response-card ${POSITION_CARD_CLASS[response.position] || ''}`}>
      <div className="agent-card-left">
        <div className="persona-avatar" style={{ background: 'var(--navy, #0a193c)', color: '#fff' }}>
          {initials}
        </div>
        <div className="agent-card-name">{response.persona_name}</div>
        {persona && (
          <div className="agent-card-detail">
            {persona.sex} · Age {persona.age}
            <br />{persona.marital_status}
            <br />{persona.education_level}
            <br />{persona.occupation}
            <br />{persona.planning_area}
          </div>
        )}
      </div>

      <div className="agent-card-right">
        <div className="agent-card-header">
          <span className={`position-badge ${POSITION_BADGE[response.position] || ''}`}>
            {response.position}
          </span>
          <span className="confidence-text">{response.confidence}% certain</span>
        </div>

        <p className="agent-reasoning">{response.reasoning}</p>
        <p className="agent-key-concern"><strong>Main concern:</strong> {response.key_concern}</p>

        {persona && (persona.persona || persona.cultural_background) && (
          <div style={{ marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setExpanded(x => !x)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted, #5a6a85)', fontSize: '0.75rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
            >
              {expanded ? 'Hide profile ▲' : 'Show full profile ▼'}
            </button>
            {expanded && (
              <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#f6f4ef', borderRadius: '6px', fontSize: '0.78rem', color: '#2c3e50' }}>
                {persona.persona && <p style={{ margin: '0 0 0.5rem' }}><strong>Persona:</strong> {persona.persona}</p>}
                {persona.cultural_background && <p style={{ margin: 0 }}><strong>Cultural background:</strong> {persona.cultural_background}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentResponseCard;
