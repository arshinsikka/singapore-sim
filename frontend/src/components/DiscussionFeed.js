import React, { useState, useMemo } from 'react';

const POS_FILTERS = ['Support', 'Oppose', 'Neutral'];

function FeedPost({ response, persona, isLast, round1Position }) {
  const [expanded, setExpanded] = useState(false);
  const pos      = response.position;
  const badgeCls = pos === 'Support' ? 'badge-support' : pos === 'Oppose' ? 'badge-oppose' : 'badge-neutral';
  const changed  = response.round_number > 0 && round1Position && pos !== round1Position;

  return (
    <div className={`thread-post${response.round_number > 0 ? ' post-indented' : ''}`}>
      <div className="thread-left">
        <div className="persona-avatar avatar-others" style={{ background: 'var(--navy, #0a193c)', color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>
          {response.persona_name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()}
        </div>
        {!isLast && <div className="thread-connector" />}
      </div>

      <div className="thread-right">
        {changed && (
          <div className="thread-updated-banner">
            ↺ Updated view after hearing from the group
          </div>
        )}

        <div className="thread-post-header">
          <span className="thread-name">{response.persona_name}</span>
          {persona && (
            <span className="thread-meta">
              {persona.sex} · {persona.age} · {persona.marital_status} · {persona.education_level} · {persona.occupation} · {persona.industry} · {persona.planning_area}
            </span>
          )}
          <span className="thread-round-pill">Round {response.round_number + 1}</span>
        </div>

        <div className="thread-position-row">
          <span className={`position-badge ${badgeCls}`}>{pos}</span>
          <span className="confidence-text">{response.confidence}% certain</span>
        </div>

        <p className="thread-reasoning">{response.reasoning}</p>

        {response.key_concern && (
          <div className={`thread-key-concern concern-${pos.toLowerCase()}`}>
            <span className="concern-icon">"</span>
            {response.key_concern}
          </div>
        )}

        {persona && (persona.persona || persona.cultural_background) && (
          <div style={{ marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setExpanded(x => !x)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted, #5a6a85)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              {expanded ? 'Hide profile ▲' : 'Show full profile ▼'}
            </button>
            {expanded && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                background: '#f6f4ef',
                borderRadius: '6px',
                fontSize: '0.78rem',
                color: '#2c3e50',
              }}>
                {persona.persona && (
                  <p style={{ margin: '0 0 0.5rem' }}><strong>Persona:</strong> {persona.persona}</p>
                )}
                {persona.cultural_background && (
                  <p style={{ margin: 0 }}><strong>Cultural background:</strong> {persona.cultural_background}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DiscussionFeed({ responses, personas, numRounds }) {
  const [activeFilters, setActiveFilters] = useState([]);

  const personaMap = useMemo(() => {
    const map = {};
    (personas || []).forEach(p => { map[p.id] = p; });
    return map;
  }, [personas]);

  const agentThreads = useMemo(() => {
    const byAgent = {};
    (responses || []).forEach(r => {
      if (!byAgent[r.persona_id]) byAgent[r.persona_id] = [];
      byAgent[r.persona_id].push(r);
    });
    Object.values(byAgent).forEach(arr => arr.sort((a, b) => a.round_number - b.round_number));
    return Object.values(byAgent);
  }, [responses]);

  const toggleFilter = (f) => {
    if (f === 'All') { setActiveFilters([]); return; }
    setActiveFilters(prev => prev.includes(f) ? [] : [f]);
  };

  const filteredThreads = useMemo(() => {
    if (!activeFilters.length) return agentThreads;
    return agentThreads.filter(thread => {
      const latest = thread[thread.length - 1];
      return activeFilters.includes(latest.position);
    });
  }, [agentThreads, activeFilters]);

  const allFilterLabels = ['All', ...POS_FILTERS];

  return (
    <div className="discussion-feed">
      <div className="feed-filter-bar">
        {allFilterLabels.map(f => (
          <button
            key={f}
            className={`filter-pill${
              f === 'All' && !activeFilters.length ? ' active' :
              activeFilters.includes(f) ? ' active' : ''
            }`}
            onClick={() => toggleFilter(f)}
            type="button"
          >
            {f}
          </button>
        ))}
      </div>

      <div className="feed-list">
        {filteredThreads.map(thread => {
          const round1Pos = thread[0]?.position;
          return (
            <div key={thread[0].persona_id} className="agent-thread">
              {thread.map((response, i) => (
                <FeedPost
                  key={`${response.persona_id}-${response.round_number}`}
                  response={response}
                  persona={personaMap[response.persona_id]}
                  isLast={i === thread.length - 1}
                  round1Position={round1Pos}
                />
              ))}
            </div>
          );
        })}
        {filteredThreads.length === 0 && (
          <div className="feed-empty">No citizens match the selected filters.</div>
        )}
      </div>
    </div>
  );
}

export default DiscussionFeed;
