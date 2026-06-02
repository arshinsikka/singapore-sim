import React, { useState, useMemo } from 'react';

const ETHNICITY_CLASS = {
  Chinese: 'avatar-chinese',
  Malay:   'avatar-malay',
  Indian:  'avatar-indian',
  Others:  'avatar-others',
};

const ETH_FILTERS = ['Chinese', 'Malay', 'Indian', 'Others'];
const POS_FILTERS = ['Support', 'Oppose', 'Neutral'];

function getInitials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function FeedPost({ response, persona, isLast, round1Position }) {
  const initials  = getInitials(response.persona_name);
  const avatarCls = persona ? (ETHNICITY_CLASS[persona.ethnicity] || 'avatar-others') : 'avatar-others';
  const pos       = response.position;
  const badgeCls  = pos === 'Support' ? 'badge-support' : pos === 'Oppose' ? 'badge-oppose' : 'badge-neutral';
  const changed   = response.round_number > 0 && round1Position && pos !== round1Position;

  return (
    <div className={`thread-post${response.round_number > 0 ? ' post-indented' : ''}`}>
      <div className="thread-left">
        <div className={`persona-avatar ${avatarCls}`}>{initials}</div>
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
              {persona.occupation} · {persona.planning_area}
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
    setActiveFilters(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  const filteredThreads = useMemo(() => {
    if (!activeFilters.length) return agentThreads;
    const ethFilters = activeFilters.filter(f => ETH_FILTERS.includes(f));
    const posFilters = activeFilters.filter(f => POS_FILTERS.includes(f));
    return agentThreads.filter(thread => {
      const persona = personaMap[thread[0].persona_id];
      const latest  = thread[thread.length - 1];
      const ethOk   = !ethFilters.length || (persona && ethFilters.includes(persona.ethnicity));
      const posOk   = !posFilters.length || posFilters.includes(latest.position);
      return ethOk && posOk;
    });
  }, [agentThreads, activeFilters, personaMap]);

  const allFilterLabels = ['All', ...ETH_FILTERS, ...POS_FILTERS];

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
