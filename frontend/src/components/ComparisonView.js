// ComparisonView.js — Side-by-side population comparison with key differences and demographic table

import React from 'react';

// Reusable stacked bar (same visual language as ResultsDashboard)
function StackedBar({ support_pct, neutral_pct, oppose_pct }) {
  return (
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
  );
}

// Compute support % for a demographic breakdown cell
function toSupportPct(group) {
  if (!group || group.total === 0) return null;
  return Math.round(((group.Support || 0) / group.total) * 100);
}

function ComparisonView({ comparisonResult, question, numRounds }) {
  const { diverse, homogeneous } = comparisonResult;
  const dAgg = diverse.aggregate;
  const hAgg = homogeneous.aggregate;

  // ── Key differences ──────────────────────────────────────────
  const supportDiff = Math.round(Math.abs(dAgg.support_pct - hAgg.support_pct));
  const diverseMoreSupportive = dAgg.support_pct >= hAgg.support_pct;

  let supportSentence;
  if (supportDiff < 1) {
    supportSentence = 'Both populations showed nearly identical levels of support for this policy.';
  } else {
    supportSentence =
      `The ${diverseMoreSupportive ? 'diverse' : 'uniform'} population was ${supportDiff}% ` +
      `more supportive of this policy.`;
  }

  const certSentence =
    dAgg.avg_confidence >= hAgg.avg_confidence
      ? `The diverse population expressed higher average certainty (${dAgg.avg_confidence}% vs ${hAgg.avg_confidence}%).`
      : `The uniform population expressed higher average certainty (${hAgg.avg_confidence}% vs ${dAgg.avg_confidence}%).`;

  let interpretation;
  if (supportDiff > 15) {
    interpretation =
      'This suggests demographic diversity meaningfully shifts collective opinion on this question.';
  } else if (supportDiff < 10) {
    interpretation =
      'Both populations converged on a similar view, suggesting this policy transcends demographic lines.';
  } else {
    interpretation =
      'There is a moderate divergence in opinion, suggesting demographic background has some influence on this question.';
  }

  // ── Demographic breakdown table ──────────────────────────────
  const diverseEthn = diverse.demographic_breakdown.ethnicity  || {};
  const homogEthn   = homogeneous.demographic_breakdown.ethnicity || {};
  const allEthnicities = [
    ...new Set([...Object.keys(diverseEthn), ...Object.keys(homogEthn)]),
  ].filter((eth) => {
    const d = toSupportPct(diverseEthn[eth]);
    const h = toSupportPct(homogEthn[eth]);
    return d !== null || h !== null;
  });

  const roundLabel = numRounds === 1 ? '1 round' : `${numRounds} rounds`;

  return (
    <div className="comparison-view">
      {/* ── Header ── */}
      <div className="comparison-header">
        <h2 className="comparison-title">Population comparison</h2>
        {question && (
          <p className="comparison-question">{question.title}</p>
        )}
        <p className="comparison-meta">{roundLabel} · 10 agents per population</p>
      </div>

      {/* ── Side-by-side bars ── */}
      <div className="comparison-columns-panel">
        {/* Diverse column */}
        <div className="comparison-col">
          <div className="comparison-col-header">Diverse population</div>
          <div className="comparison-col-subtitle">
            10 agents across all demographic groups
          </div>

          <div className="stacked-bar-wrap">
            <StackedBar
              support_pct={dAgg.support_pct}
              neutral_pct={dAgg.neutral_pct}
              oppose_pct={dAgg.oppose_pct}
            />
            <div className="bar-legend">
              <div className="legend-item">
                <span className="legend-dot support" />
                Support {dAgg.support_pct}%
              </div>
              <div className="legend-item">
                <span className="legend-dot neutral" />
                Neutral {dAgg.neutral_pct}%
              </div>
              <div className="legend-item">
                <span className="legend-dot oppose" />
                Oppose {dAgg.oppose_pct}%
              </div>
            </div>
          </div>

          <div className="comparison-certainty">
            Average certainty: <strong>{dAgg.avg_confidence}%</strong>
          </div>
        </div>

        <div className="comparison-divider" />

        {/* Homogeneous column */}
        <div className="comparison-col">
          <div className="comparison-col-header">Uniform population</div>
          <div className="comparison-col-subtitle">
            10 Chinese median-income agents
          </div>

          <div className="stacked-bar-wrap">
            <StackedBar
              support_pct={hAgg.support_pct}
              neutral_pct={hAgg.neutral_pct}
              oppose_pct={hAgg.oppose_pct}
            />
            <div className="bar-legend">
              <div className="legend-item">
                <span className="legend-dot support" />
                Support {hAgg.support_pct}%
              </div>
              <div className="legend-item">
                <span className="legend-dot neutral" />
                Neutral {hAgg.neutral_pct}%
              </div>
              <div className="legend-item">
                <span className="legend-dot oppose" />
                Oppose {hAgg.oppose_pct}%
              </div>
            </div>
          </div>

          <div className="comparison-certainty">
            Average certainty: <strong>{hAgg.avg_confidence}%</strong>
          </div>
        </div>
      </div>

      {/* ── Key differences ── */}
      <div className="comparison-section">
        <p className="section-title">Key differences</p>
        <ul className="key-differences-list">
          <li>{supportSentence}</li>
          <li>{certSentence}</li>
          <li className="interpretation">{interpretation}</li>
        </ul>
      </div>

      {/* ── Ethnic breakdown comparison table ── */}
      {allEthnicities.length > 0 && (
        <div className="comparison-section">
          <p className="section-title">Support by ethnicity</p>
          <p className="section-subtitle">
            Percentage within each group who supported the policy
          </p>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Ethnic group</th>
                <th>Diverse — Support %</th>
                <th>Uniform — Support %</th>
              </tr>
            </thead>
            <tbody>
              {allEthnicities.map((eth) => {
                const dPct = toSupportPct(diverseEthn[eth]);
                const hPct = toSupportPct(homogEthn[eth]);
                return (
                  <tr key={eth}>
                    <td>{eth}</td>
                    <td className={dPct !== null ? 'td-pct' : ''}>
                      {dPct !== null ? `${dPct}%` : '—'}
                    </td>
                    <td className={hPct !== null ? 'td-pct' : ''}>
                      {hPct !== null ? `${hPct}%` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ComparisonView;
