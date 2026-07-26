import React, { useMemo, useState, useEffect } from 'react';
import DiscussionFeed from './DiscussionFeed';
import AnalyticsPanel from './AnalyticsPanel';
import CalibrationPanel from './CalibrationPanel';
import { REDDIT_POSTS, fetchRedditComments, classifyRedditComments } from '../utils/redditData';

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

function ResultsDashboard({ result, numRounds, personas, question, selectedQuestionId, apiKey }) {
  const [activeTab, setActiveTab] = useState('discussion');
  const [calibrationLoading, setCalibrationLoading]   = useState(false);
  const [calibrationLoaded,  setCalibrationLoaded]    = useState(false);
  const [classifiedComments, setClassifiedComments]   = useState([]);

  useEffect(() => {
    if (result) setActiveTab('discussion');
  }, [result]);

  // Reset calibration whenever the question changes
  useEffect(() => {
    setCalibrationLoaded(false);
    setCalibrationLoading(false);
    setClassifiedComments([]);
  }, [selectedQuestionId]);

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

  const redditPost = selectedQuestionId ? REDDIT_POSTS[selectedQuestionId] : null;

  const handleCalibrationTab = async () => {
    setActiveTab('calibration');
    if (calibrationLoaded || calibrationLoading || !redditPost || !result) return;

    setCalibrationLoading(true);
    try {
      const comments    = await fetchRedditComments(redditPost.post_id);
      const enriched    = await classifyRedditComments(comments, question?.title || '', apiKey);
      setClassifiedComments(enriched);
    } finally {
      setCalibrationLoaded(true);
      setCalibrationLoading(false);
    }
  };

  const tabs = [
    { id: 'discussion',   label: 'Discussion',  onClick: () => setActiveTab('discussion') },
    { id: 'analytics',    label: 'Analytics',   onClick: () => setActiveTab('analytics') },
    { id: 'calibration',  label: 'Calibration', onClick: handleCalibrationTab },
  ];

  return (
    <div className="results-dashboard">

      {result && (
        <div className="results-summary-bar">
          {summary && <div className="summary-headline">"{summary}"</div>}

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

          <div className="avg-confidence">
            Average certainty: <strong>{avg_confidence}%</strong>
          </div>
        </div>
      )}

      <div
        className="tab-bar"
        style={{ position: 'sticky', top: 0, zIndex: 20, background: '#ffffff' }}
      >
        {tabs.map(tab => {
          const isCalibration = tab.id === 'calibration';
          const disabled = isCalibration && !redditPost;
          return (
            <button
              key={tab.id}
              className={`tab-button${activeTab === tab.id ? ' active' : ''}`}
              onClick={disabled ? undefined : tab.onClick}
              type="button"
              style={disabled ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="tab-content">
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
              personas={personas}
            />
          ) : (
            <div className="tab-empty-state">Run a simulation to see analytics.</div>
          )
        )}

        {activeTab === 'calibration' && (
          !redditPost ? (
            <div className="tab-empty-state">No Reddit calibration data available for this question.</div>
          ) : !result ? (
            <div className="tab-empty-state">Run a simulation first to enable calibration.</div>
          ) : (
            <CalibrationPanel
              redditPost={redditPost}
              classifiedComments={classifiedComments}
              simulationResult={result}
              loading={calibrationLoading}
            />
          )
        )}
      </div>
    </div>
  );
}

export default ResultsDashboard;
