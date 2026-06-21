import React, { useState, useMemo } from 'react';
import { buildThreadTree, computeAgreementCounts } from '../simulation';

const POS_FILTERS = ['Support', 'Oppose', 'Neutral'];
const ETHNIC_FILTERS = ['Chinese', 'Malay', 'Indian', 'Others'];

function countDescendants(post) {
  if (!post.replies || post.replies.length === 0) return 0;
  return post.replies.reduce((sum, r) => sum + 1 + countDescendants(r), 0);
}

function ThreadPost({ post, depth, agreementCounts, postById, personaMap }) {
  const [expanded, setExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pos = post.position;
  const badgeCls = pos === 'Support' ? 'badge-support' : pos === 'Oppose' ? 'badge-oppose' : 'badge-neutral';
  const persona = personaMap[post.persona_id];
  const sharedCount = agreementCounts[post.id] || 0;
  const parentPost = post.parent_id ? postById[post.parent_id] : null;

  return (
    <div
      style={{
        marginLeft: depth > 0 ? 28 : 0,
        borderLeft: depth > 0 ? '1px solid #e0e4ea' : 'none',
        paddingLeft: depth > 0 ? 12 : 0,
      }}
    >
      <div className="thread-post">
        <div className="thread-left">
          <div
            className="persona-avatar avatar-others"
            style={{ background: 'var(--navy, #0a193c)', color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}
          >
            {post.persona_name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()}
          </div>
          {post.replies && post.replies.length > 0 && <div className="thread-connector" />}
        </div>

        <div className="thread-right">
<div className="thread-post-header">
            {post.replies && post.replies.length > 0 && (
              <button
                type="button"
                onClick={() => setCollapsed(x => !x)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontSize: '11px',
                  color: 'var(--text-muted, #5a6a85)',
                  lineHeight: 1,
                  flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-secondary, #3a4a65)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted, #5a6a85)'; }}
              >
                {collapsed ? '▶' : '▼'}
              </button>
            )}
            <span className="thread-name">{post.persona_name}</span>
            {persona && (
              <span className="thread-meta">
                {persona.sex} · {persona.age} · {persona.marital_status} · {persona.ethnic_group} · {persona.education_level} · {persona.occupation} · {persona.industry} · {persona.planning_area}
              </span>
            )}
            <span className="thread-round-pill">Round {post.round_number + 1}</span>
          </div>

          <div className="thread-position-row">
            <span className={`position-badge ${badgeCls}`}>{pos}</span>
            <span className="confidence-text">{post.confidence}% certain</span>
          </div>

          {sharedCount > 0 && (
            <div style={{ fontSize: '11px', color: 'var(--text-muted, #5a6a85)', marginTop: '-2px' }}>
              {sharedCount} agent{sharedCount !== 1 ? 's' : ''} share this view
            </div>
          )}

          {parentPost && post.stance_towards_parent && (
            <div style={{ fontSize: '12px', color: 'var(--text-muted, #5a6a85)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>↳ Replying to {parentPost.persona_name} ·</span>
              <span style={{
                color: post.stance_towards_parent === 'agrees' ? '#2d7a4f' : '#c0392b',
                fontWeight: 600,
              }}>
                {post.stance_towards_parent === 'agrees' ? 'agrees with' : 'disagrees with'}
              </span>
            </div>
          )}

          <p className="thread-reasoning">{post.reasoning}</p>

          {post.key_concern && (
            <div className={`thread-key-concern concern-${pos.toLowerCase()}`}>
              <span className="concern-icon">"</span>
              {post.key_concern}
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

      {collapsed ? (
        post.replies && post.replies.length > 0 && (
          <div
            style={{
              fontSize: '11px',
              color: 'var(--text-muted, #5a6a85)',
              cursor: 'pointer',
              padding: '4px 0 4px 14px',
              marginLeft: depth > 0 ? 0 : 54,
            }}
            onClick={() => setCollapsed(false)}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-secondary, #3a4a65)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted, #5a6a85)'; }}
          >
            ▶ {countDescendants(post)} {countDescendants(post) === 1 ? 'reply' : 'replies'} hidden
          </div>
        )
      ) : (
        (post.replies || []).map(reply => (
          <ThreadPost
            key={reply.id}
            post={reply}
            depth={depth + 1}
            agreementCounts={agreementCounts}
            postById={postById}
            personaMap={personaMap}
          />
        ))
      )}
    </div>
  );
}

function DiscussionFeed({ responses, personas, numRounds }) {
  const [activeFilters, setActiveFilters] = useState([]);
  const [activeEthnicFilter, setActiveEthnicFilter] = useState('All');

  const personaMap = useMemo(() => {
    const map = {};
    (personas || []).forEach(p => { map[p.id] = p; });
    return map;
  }, [personas]);

  const postById = useMemo(() => {
    const map = {};
    (responses || []).forEach(r => { map[r.id] = r; });
    return map;
  }, [responses]);

  const agreementCounts = useMemo(() => {
    const allRounds = [...new Set((responses || []).map(r => r.round_number))];
    const merged = {};
    for (const rn of allRounds) {
      Object.assign(merged, computeAgreementCounts(responses, rn));
    }
    return merged;
  }, [responses]);

  const rootPosts = useMemo(() => buildThreadTree(responses || []), [responses]);

  const toggleFilter = (f) => {
    if (f === 'All') { setActiveFilters([]); return; }
    setActiveFilters(prev => prev.includes(f) ? [] : [f]);
  };

  const toggleEthnicFilter = (f) => {
    setActiveEthnicFilter(prev => prev === f ? 'All' : f);
  };

  const filteredRoots = useMemo(() => {
    const hasPosFilter = activeFilters.length > 0;
    const hasEthnicFilter = activeEthnicFilter !== 'All';
    if (!hasPosFilter && !hasEthnicFilter) return rootPosts;
    return rootPosts.filter(root => {
      if (hasPosFilter && !activeFilters.includes(root.position)) return false;
      if (hasEthnicFilter) {
        const persona = personaMap[root.persona_id];
        if ((persona?.ethnic_group || 'Others') !== activeEthnicFilter) return false;
      }
      return true;
    });
  }, [rootPosts, activeFilters, activeEthnicFilter, personaMap]);

  return (
    <div className="discussion-feed">
      <div className="feed-filter-bar">
        {['All', ...POS_FILTERS].map(f => (
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

      <div className="feed-filter-bar" style={{ marginTop: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted, #5a6a85)', marginRight: '0.25rem', whiteSpace: 'nowrap' }}>
          By ethnicity:
        </span>
        {['All', ...ETHNIC_FILTERS].map(f => (
          <button
            key={f}
            className={`filter-pill${activeEthnicFilter === f ? ' active' : ''}`}
            onClick={() => toggleEthnicFilter(f)}
            type="button"
          >
            {f}
          </button>
        ))}
      </div>

      <div className="feed-list">
        {filteredRoots.map(root => (
          <div key={root.id} className="agent-thread">
            <ThreadPost
              post={root}
              depth={0}
              agreementCounts={agreementCounts}
              postById={postById}
              personaMap={personaMap}
            />
          </div>
        ))}
        {filteredRoots.length === 0 && (
          <div className="feed-empty">No citizens match the selected filters.</div>
        )}
      </div>
    </div>
  );
}

export default DiscussionFeed;
