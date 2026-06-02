import React, { useMemo, useState, useEffect } from 'react';
import DiscussionFeed from './DiscussionFeed';
import AnalyticsPanel from './AnalyticsPanel';
import ComparisonView from './ComparisonView';

function makeSummary(support_pct, oppose_pct, neutral_pct, total) {
  if (!total) return null;
  const s = Math.round(total * support_pct / 100);
  const o = Math.round(total * oppose_pct / 100);
  const n = Math.round(total * neutral_pct / 100);
  if (support_pct >= oppose_pct && support_pct >= neutral_pct)
    return `${s} out of ${total} citizens supported this policy`;
  if (oppose_pct > support_pct && oppose_pct >= neutral_pct)
    return `${o} out of ${total} citizens opposed this policy`;
  return `${n} out of ${total} citizens were neutral on this policy`;
}

function ResultsDashboard({ result, numRounds, personas, comparisonResult, question, onClearComparison }) {
  const [activeTab, setActiveTab] = useState('discussion');

  useEffect(() => {
    if (result) {
      setActiveTab('discussion');
    } else if (comparisonResult) {
      setActiveTab('comparison');
    }
  }, [result, comparisonResult]);

  const latestRound = useMemo(() => {
    if (!result?.agent_responses?.length) return 0;
    return Math.max(...result.agent_responses.map(r => r.round_number));
  }, [result]);

  const latestResponses = useMemo(
    () => result?.agent_responses.filter(r => r.round_number === latestRound) || [],
    [result, latestRound]
  );

  const agg = result?.aggregate || {};
  const { support_pct = 0, oppose_pct = 0, neutral_pct = 0, avg_confidence = 0 } = agg;
  const total   = latestResponses.length;
  const summary = result ? makeSummary(support_pct, oppose_pct, neutral_pct, total) : null;

  const tabs = [
    { id: 'discussion', label: 'Discussion' },
    { id: 'analytics',  label: 'Analytics' },
    { id: 'comparison', label: 'Comparison', locked: !comparisonResult },
  ];

  return (
    <div className="results-dashboard">

      {/* Always-visible summary bar */}
      {result && (
        <div className="results-summary-bar">
          {summary && <div className="summary-headline">"{summary}"</div>}

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
              <div className="legend-item"><span className="legend-dot support" />Support {support_pct}%</div>
              <div className="legend-item"><span className="legend-dot neutral" />Neutral {neutral_pct}%</div>
              <div className="legend-item"><span className="legend-dot oppose" />Oppose {oppose_pct}%</div>
            </div>
          </div>

          <div className="avg-confidence">
            Average certainty: <strong>{avg_confidence}%</strong>
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="tab-bar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button${activeTab === tab.id ? ' active' : ''}${tab.locked ? ' locked' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
            {tab.locked && <span className="tab-lock-hint"> (run compare first)</span>}
          </button>
        ))}
      </div>

      {/* Tab content — key forces re-mount so fadeInUp re-fires on tab switch */}
      <div key={activeTab} className="tab-content">

        {activeTab === 'discussion' && (
          result ? (
            <DiscussionFeed
              responses={result.agent_responses}
              personas={personas}
              numRounds={numRounds}
            />
          ) : (
            <div className="tab-empty-state">Run a simulation to see the discussion feed.</div>
          )
        )}

        {activeTab === 'analytics' && (
          result ? (
            <AnalyticsPanel
              result={result}
              numRounds={numRounds}
              comparisonResult={comparisonResult}
              personas={personas}
            />
          ) : (
            <div className="tab-empty-state">Run a simulation to see analytics.</div>
          )
        )}

        {activeTab === 'comparison' && (
          comparisonResult ? (
            <>
              <ComparisonView
                comparisonResult={comparisonResult}
                question={question}
                numRounds={numRounds}
              />
              <div className="clear-comparison-wrap">
                <button
                  className="clear-comparison-link"
                  onClick={onClearComparison}
                  type="button"
                >
                  Clear comparison
                </button>
              </div>
            </>
          ) : (
            <div className="tab-empty-state">Run a comparison to unlock this tab.</div>
          )
        )}

      </div>
    </div>
  );
}

export default ResultsDashboard;
