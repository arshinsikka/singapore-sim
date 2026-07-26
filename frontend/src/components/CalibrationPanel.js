import React from 'react';

function computeBarPcts(items) {
  const total = items.length;
  if (!total) return { support_pct: 0, oppose_pct: 0, neutral_pct: 0 };
  const support = items.filter(c => c.position === 'Support').length;
  const oppose  = items.filter(c => c.position === 'Oppose').length;
  const neutral = items.filter(c => c.position === 'Neutral').length;
  return {
    support_pct: Math.round((support / total) * 1000) / 10,
    oppose_pct:  Math.round((oppose  / total) * 1000) / 10,
    neutral_pct: Math.round((neutral / total) * 1000) / 10,
  };
}

function topConcerns(items, n = 3) {
  const freq = {};
  for (const item of items) {
    const c = (item.key_concern || '').trim();
    if (c) freq[c] = (freq[c] || 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([concern]) => concern);
}

function comparisonSentence(rPcts, sPcts) {
  const diff = Math.round(rPcts.support_pct - sPcts.support_pct);
  const abs  = Math.abs(diff);
  if (abs <= 5) {
    if (rPcts.oppose_pct > 50 && sPcts.oppose_pct > 50)
      return 'Both Reddit users and the simulated agents leaned toward opposition on this question.';
    if (rPcts.support_pct > 50 && sPcts.support_pct > 50)
      return 'Both Reddit users and the simulated agents leaned toward support on this question.';
    return 'Reddit users and the simulated agents held similarly mixed views on this question.';
  }
  if (diff > 0)
    return `Reddit users were ${abs}% more supportive than the simulated agents on this question.`;
  return `The simulated agents were ${abs}% more supportive than Reddit users on this question.`;
}

function StackedBar({ support_pct, oppose_pct, neutral_pct }) {
  return (
    <div className="stacked-bar-wrap">
      <div className="stacked-bar">
        {support_pct > 0 && (
          <div className="bar-segment seg-support" style={{ width: `${support_pct}%` }} title={`Support: ${support_pct}%`}>
            {support_pct >= 10 ? `${support_pct}%` : ''}
          </div>
        )}
        {neutral_pct > 0 && (
          <div className="bar-segment seg-neutral" style={{ width: `${neutral_pct}%` }} title={`Neutral: ${neutral_pct}%`}>
            {neutral_pct >= 10 ? `${neutral_pct}%` : ''}
          </div>
        )}
        {oppose_pct > 0 && (
          <div className="bar-segment seg-oppose" style={{ width: `${oppose_pct}%` }} title={`Oppose: ${oppose_pct}%`}>
            {oppose_pct >= 10 ? `${oppose_pct}%` : ''}
          </div>
        )}
      </div>
      <div className="bar-legend">
        <div className="legend-item"><span className="legend-dot support" />Support {support_pct}%</div>
        <div className="legend-item"><span className="legend-dot neutral" />Neutral {neutral_pct}%</div>
        <div className="legend-item"><span className="legend-dot oppose" />Oppose {oppose_pct}%</div>
      </div>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h3 style={{
      fontSize: '13px',
      fontWeight: 700,
      color: 'var(--text-secondary, #3a4a65)',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      marginBottom: '1rem',
      marginTop: 0,
    }}>
      {children}
    </h3>
  );
}

function CalibrationPanel({ redditPost, classifiedComments, simulationResult, loading }) {
  if (loading) {
    return (
      <div style={{ padding: '2rem 0', color: 'var(--text-muted, #5a6a85)', fontSize: '14px' }}>
        Fetching and classifying r/Singapore comments…
      </div>
    );
  }

  const redditPcts = computeBarPcts(classifiedComments);

  const simAgg = simulationResult?.aggregate || {};
  const simPcts = {
    support_pct: simAgg.support_pct || 0,
    oppose_pct:  simAgg.oppose_pct  || 0,
    neutral_pct: simAgg.neutral_pct || 0,
  };

  const latestRound = simulationResult?.agent_responses?.length
    ? Math.max(...simulationResult.agent_responses.map(r => r.round_number))
    : 0;
  const latestAgentResponses = (simulationResult?.agent_responses || [])
    .filter(r => r.round_number === latestRound);

  const redditTopConcernsList = topConcerns(classifiedComments);
  const agentTopConcernsList  = topConcerns(latestAgentResponses);
  const comparison = comparisonSentence(redditPcts, simPcts);

  const displayComments = [...classifiedComments]
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingTop: '1rem' }}>

      {/* Section 1 — side-by-side summary */}
      <div>
        <SectionHeading>Sentiment Comparison</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '1.5rem', alignItems: 'start' }}>

          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--navy, #0a193c)', marginBottom: '0.25rem' }}>
              r/Singapore
            </div>
            <a
              href={redditPost.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '12px', color: 'var(--navy-mid, #2a4080)', display: 'block', marginBottom: '0.5rem', textDecoration: 'underline', lineHeight: 1.4 }}
            >
              {redditPost.title}
            </a>
            <div style={{ fontSize: '12px', color: 'var(--text-muted, #5a6a85)', marginBottom: '0.75rem' }}>
              {classifiedComments.length} comments classified
            </div>
            <StackedBar {...redditPcts} />
          </div>

          <div style={{ background: 'var(--border, #e0e4ea)', alignSelf: 'stretch' }} />

          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--navy, #0a193c)', marginBottom: '0.25rem' }}>
              Agent simulation
            </div>
            {/* spacer to align with link row */}
            <div style={{ fontSize: '12px', marginBottom: '0.5rem', lineHeight: 1.4, visibility: 'hidden' }}>
              &nbsp;
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted, #5a6a85)', marginBottom: '0.75rem' }}>
              {latestAgentResponses.length} agent{latestAgentResponses.length !== 1 ? 's' : ''}
            </div>
            <StackedBar {...simPcts} />
          </div>
        </div>

        <div style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'var(--grey-subtle, #f0f2f6)',
          borderRadius: '8px',
          fontSize: '13px',
          color: 'var(--text-primary, #1a2940)',
          fontStyle: 'italic',
        }}>
          {comparison}
        </div>
      </div>

      {/* Section 2 — key concerns */}
      <div>
        <SectionHeading>Key Concerns</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--navy, #0a193c)', marginBottom: '0.5rem' }}>
              Top concerns on Reddit
            </div>
            {redditTopConcernsList.length ? (
              <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '13px', color: 'var(--text-primary, #1a2940)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {redditTopConcernsList.map((c, i) => <li key={i}>{c}</li>)}
              </ol>
            ) : (
              <div style={{ fontSize: '13px', color: 'var(--text-muted, #5a6a85)' }}>No concerns extracted.</div>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--navy, #0a193c)', marginBottom: '0.5rem' }}>
              Top concerns in simulation
            </div>
            {agentTopConcernsList.length ? (
              <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '13px', color: 'var(--text-primary, #1a2940)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {agentTopConcernsList.map((c, i) => <li key={i}>{c}</li>)}
              </ol>
            ) : (
              <div style={{ fontSize: '13px', color: 'var(--text-muted, #5a6a85)' }}>No concerns extracted.</div>
            )}
          </div>
        </div>
      </div>

      {/* Section 3 — Reddit comments feed */}
      <div>
        <SectionHeading>Reddit Comments</SectionHeading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {displayComments.map((c, i) => {
            const pos = c.position;
            const badgeCls = pos === 'Support' ? 'badge-support' : pos === 'Oppose' ? 'badge-oppose' : 'badge-neutral';
            const truncated = c.body.length > 300;
            return (
              <div key={i} style={{
                border: '1px solid var(--border, #e0e4ea)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                background: 'var(--surface, #fff)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--navy, #0a193c)' }}>
                    u/{c.author}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted, #5a6a85)' }}>
                    ▲ {c.score}
                  </span>
                  <span className={`position-badge ${badgeCls}`}>{pos}</span>
                  {c.key_concern && (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted, #5a6a85)', fontStyle: 'italic' }}>
                      {c.key_concern}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary, #1a2940)', lineHeight: 1.55 }}>
                  {truncated ? c.body.slice(0, 300) + '… ' : c.body}
                  {truncated && (
                    <a
                      href={redditPost.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--navy-mid, #2a4080)', fontSize: '12px' }}
                    >
                      read more
                    </a>
                  )}
                </div>
              </div>
            );
          })}
          {displayComments.length === 0 && (
            <div style={{ fontSize: '14px', color: 'var(--text-muted, #5a6a85)', fontStyle: 'italic' }}>
              No comments to display.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default CalibrationPanel;
