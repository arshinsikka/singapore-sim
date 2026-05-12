// ResultsDashboard.js — Full results view: summary bar, breakdowns, agent cards, belief drift

import React, { useMemo } from 'react';
import AgentResponseCard from './AgentResponseCard';

const INCOME_LABEL = {
  low:          'Low income',
  median:       'Median income',
  above_median: 'Above median',
  high:         'High income',
};

function ResultsDashboard({ result, numRounds, personas }) {
  const personaMap = useMemo(() => {
    const map = {};
    (personas || []).forEach((p) => { map[p.id] = p; });
    return map;
  }, [personas]);

  // Identify the latest round's responses
  const latestRound = useMemo(() => {
    if (!result.agent_responses.length) return 0;
    return Math.max(...result.agent_responses.map((r) => r.round_number));
  }, [result]);

  const latestResponses = useMemo(
    () => result.agent_responses.filter((r) => r.round_number === latestRound),
    [result, latestRound]
  );

  const { support_pct, oppose_pct, neutral_pct, avg_confidence } = result.aggregate;

  // Belief drift: compare round 0 vs round (numRounds - 1)
  const driftRows = useMemo(() => {
    if (numRounds < 2) return [];
    const firstRound  = result.agent_responses.filter((r) => r.round_number === 0);
    const finalRound  = result.agent_responses.filter((r) => r.round_number === latestRound);
    const finalByPid  = {};
    finalRound.forEach((r) => { finalByPid[r.persona_id] = r; });

    return firstRound.map((r) => {
      const final = finalByPid[r.persona_id];
      const changed = final && final.position !== r.position;
      return {
        name:       r.persona_name,
        round1:     r.position,
        roundFinal: final ? final.position : '—',
        changed,
      };
    });
  }, [result, numRounds, latestRound]);

  // Demographic breakdown
  const { ethnicity: ethnicityBreakdown, income_level: incomeBreakdown } =
    result.demographic_breakdown;

  // Render coloured dots for each person's position in a demographic cell
  function renderDots(group) {
    const dots = [];
    if (!group) return null;
    for (let i = 0; i < (group.Support || 0); i++)
      dots.push(<span key={`s${i}`} className="pos-dot support" title="Support" />);
    for (let i = 0; i < (group.Oppose || 0); i++)
      dots.push(<span key={`o${i}`} className="pos-dot oppose" title="Oppose" />);
    for (let i = 0; i < (group.Neutral || 0); i++)
      dots.push(<span key={`n${i}`} className="pos-dot neutral" title="Neutral" />);
    return dots;
  }

  const roundLabel = numRounds === 1 ? 'single round' : `round ${latestRound + 1} of ${numRounds}`;

  return (
    <div className="results-dashboard">

      {/* ── Summary stacked bar ── */}
      <div className="results-summary-panel">
        <div className="summary-panel-title">Simulation results</div>
        <div className="summary-panel-subtitle">
          Showing responses for the {roundLabel} · {latestResponses.length} citizens simulated
        </div>

        <div className="stacked-bar-wrap">
          <div className="stacked-bar">
            {support_pct > 0 && (
              <div
                className="bar-segment seg-support"
                style={{ width: `${support_pct}%` }}
                title={`Support: ${support_pct}%`}
              >
                {support_pct >= 10 ? `${support_pct}%` : ''}
              </div>
            )}
            {neutral_pct > 0 && (
              <div
                className="bar-segment seg-neutral"
                style={{ width: `${neutral_pct}%` }}
                title={`Neutral: ${neutral_pct}%`}
              >
                {neutral_pct >= 10 ? `${neutral_pct}%` : ''}
              </div>
            )}
            {oppose_pct > 0 && (
              <div
                className="bar-segment seg-oppose"
                style={{ width: `${oppose_pct}%` }}
                title={`Oppose: ${oppose_pct}%`}
              >
                {oppose_pct >= 10 ? `${oppose_pct}%` : ''}
              </div>
            )}
          </div>

          <div className="bar-legend">
            <div className="legend-item">
              <span className="legend-dot support" />
              Support {support_pct}%
            </div>
            <div className="legend-item">
              <span className="legend-dot neutral" />
              Neutral {neutral_pct}%
            </div>
            <div className="legend-item">
              <span className="legend-dot oppose" />
              Oppose {oppose_pct}%
            </div>
          </div>
        </div>

        <div className="avg-confidence">
          Average certainty: <strong>{avg_confidence}%</strong> — how confident each
          citizen felt in their stated position
        </div>
      </div>

      {/* ── Demographic breakdown ── */}
      <div className="results-section-panel">
        <p className="section-title">Responses by demographic group</p>
        <div className="breakdown-grid">

          {/* Ethnicity */}
          <div>
            <div className="breakdown-group-title">By ethnicity</div>
            {Object.entries(ethnicityBreakdown || {}).map(([group, counts]) => (
              <div key={group} className="breakdown-row">
                <span className="breakdown-label">{group}</span>
                <div className="breakdown-dots">
                  {renderDots(counts)}
                  <span className="breakdown-counts">
                    {counts.Support || 0}S · {counts.Oppose || 0}O · {counts.Neutral || 0}N
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Income level */}
          <div>
            <div className="breakdown-group-title">By income level</div>
            {Object.entries(incomeBreakdown || {}).map(([group, counts]) => (
              <div key={group} className="breakdown-row">
                <span className="breakdown-label">{INCOME_LABEL[group] || group}</span>
                <div className="breakdown-dots">
                  {renderDots(counts)}
                  <span className="breakdown-counts">
                    {counts.Support || 0}S · {counts.Oppose || 0}O · {counts.Neutral || 0}N
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Belief drift table (only for multi-round) ── */}
      {numRounds > 1 && driftRows.length > 0 && (
        <div className="results-section-panel">
          <p className="section-title">Belief drift</p>
          <p className="section-subtitle">
            Which citizens changed their position between round 1 and round {numRounds}?
          </p>
          <table className="belief-drift-table">
            <thead>
              <tr>
                <th>Citizen</th>
                <th>Round 1 position</th>
                <th>Round {numRounds} position</th>
                <th>Changed?</th>
              </tr>
            </thead>
            <tbody>
              {driftRows.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>
                    <span className={`position-badge badge-${row.round1.toLowerCase()}`}>
                      {row.round1}
                    </span>
                  </td>
                  <td>
                    <span className={`position-badge badge-${row.roundFinal.toLowerCase()}`}>
                      {row.roundFinal}
                    </span>
                  </td>
                  <td>
                    {row.changed ? (
                      <span className="drift-changed-yes">Yes</span>
                    ) : (
                      <span className="drift-changed-no">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Individual agent responses ── */}
      <div className="results-section-panel">
        <p className="section-title">What each citizen said</p>
        <p className="section-subtitle">
          Responses from the {roundLabel} — each citizen reasons from their own lived experience
        </p>
        <div className="agent-responses-list">
          {latestResponses.map((response) => (
            <AgentResponseCard
              key={`${response.persona_id}-${response.round_number}`}
              response={response}
              persona={personaMap[response.persona_id]}
            />
          ))}
        </div>
      </div>

    </div>
  );
}

export default ResultsDashboard;
