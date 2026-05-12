// AgentResponseCard.js — Displays one citizen's simulated response to a policy question

import React from 'react';

const ETHNICITY_CLASS = {
  Chinese: 'avatar-chinese',
  Malay:   'avatar-malay',
  Indian:  'avatar-indian',
  Others:  'avatar-others',
};

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
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function AgentResponseCard({ response, persona }) {
  const initials = getInitials(response.persona_name);
  const avatarClass = persona
    ? ETHNICITY_CLASS[persona.ethnicity] || 'avatar-others'
    : 'avatar-others';

  return (
    <div className={`agent-response-card ${POSITION_CARD_CLASS[response.position] || ''}`}>
      {/* Left: avatar + name + demographics */}
      <div className="agent-card-left">
        <div className={`persona-avatar ${avatarClass}`}>{initials}</div>
        <div className="agent-card-name">{response.persona_name}</div>
        {persona && (
          <div className="agent-card-detail">
            Age {persona.age}
            <br />
            {persona.occupation}
            <br />
            {persona.planning_area}
          </div>
        )}
      </div>

      {/* Right: position, confidence, reasoning, key concern */}
      <div className="agent-card-right">
        <div className="agent-card-header">
          <span className={`position-badge ${POSITION_BADGE[response.position] || ''}`}>
            {response.position}
          </span>
          <span className="confidence-text">{response.confidence}% certain</span>
        </div>

        <p className="agent-reasoning">{response.reasoning}</p>

        <p className="agent-key-concern">
          <strong>Main concern:</strong> {response.key_concern}
        </p>
      </div>
    </div>
  );
}

export default AgentResponseCard;
