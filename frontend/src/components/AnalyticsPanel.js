import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';

const PLOTLY_CONFIG = { displayModeBar: false };

const LAYOUT_BASE = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor:  'rgba(0,0,0,0)',
  font: { family: 'Plus Jakarta Sans, sans-serif', color: '#5a6a7a', size: 12 },
  margin: { t: 12, r: 16, b: 44, l: 48 },
  height: 220,
  xaxis: { gridcolor: '#e8e4dc', zerolinecolor: '#e8e4dc', tickfont: { size: 11 } },
  yaxis: { gridcolor: '#e8e4dc', zerolinecolor: '#e8e4dc', tickfont: { size: 11 } },
  showlegend: false,
};

const INCOME_LABEL = {
  low:          'Low income',
  median:       'Median income',
  above_median: 'Above median',
  high:         'High income',
};

function AnalyticsPanel({ result, numRounds, comparisonResult, personas }) {
  const personaMap = useMemo(() => {
    const map = {};
    (personas || []).forEach(p => { map[p.id] = p; });
    return map;
  }, [personas]);

  const latestRound = useMemo(() => {
    if (!result?.agent_responses?.length) return 0;
    return Math.max(...result.agent_responses.map(r => r.round_number));
  }, [result]);

  const latestResponses = useMemo(
    () => result?.agent_responses.filter(r => r.round_number === latestRound) || [],
    [result, latestRound]
  );

  const positionChartData = useMemo(() => {
    if (comparisonResult) {
      const dAgg = comparisonResult.diverse.aggregate;
      const hAgg = comparisonResult.homogeneous.aggregate;
      return {
        data: [
          {
            name: 'Diverse',
            x: [Math.round(dAgg.support_pct / 10), Math.round(dAgg.neutral_pct / 10), Math.round(dAgg.oppose_pct / 10)],
            y: ['Support', 'Neutral', 'Oppose'],
            type: 'bar',
            orientation: 'h',
            marker: { color: '#2d7a4f' },
          },
          {
            name: 'Uniform',
            x: [Math.round(hAgg.support_pct / 10), Math.round(hAgg.neutral_pct / 10), Math.round(hAgg.oppose_pct / 10)],
            y: ['Support', 'Neutral', 'Oppose'],
            type: 'bar',
            orientation: 'h',
            marker: { color: '#1a3a5c' },
          },
        ],
        layout: {
          ...LAYOUT_BASE,
          barmode: 'group',
          showlegend: true,
          legend: { orientation: 'h', y: -0.28, font: { size: 11 } },
          xaxis: { ...LAYOUT_BASE.xaxis, title: { text: 'Citizens', font: { size: 11 } }, dtick: 1 },
          margin: { ...LAYOUT_BASE.margin, b: 60 },
        },
      };
    }

    const supportCount = latestResponses.filter(r => r.position === 'Support').length;
    const neutralCount = latestResponses.filter(r => r.position === 'Neutral').length;
    const opposeCount  = latestResponses.filter(r => r.position === 'Oppose').length;

    return {
      data: [{
        x: [supportCount, neutralCount, opposeCount],
        y: ['Support', 'Neutral', 'Oppose'],
        type: 'bar',
        orientation: 'h',
        marker: { color: ['#2d7a4f', '#c8973a', '#b83232'] },
      }],
      layout: {
        ...LAYOUT_BASE,
        xaxis: { ...LAYOUT_BASE.xaxis, title: { text: 'Citizens', font: { size: 11 } }, dtick: 1 },
      },
    };
  }, [latestResponses, comparisonResult]);

  const confidenceChartData = useMemo(() => ({
    data: [{
      x: latestResponses.map(r => r.confidence),
      type: 'histogram',
      xbins: { start: 0, end: 100, size: 10 },
      marker: { color: '#1a3a5c', opacity: 0.78 },
      hovertemplate: '%{x}–%{x+10}%: %{y} citizens<extra></extra>',
    }],
    layout: {
      ...LAYOUT_BASE,
      xaxis: { ...LAYOUT_BASE.xaxis, title: { text: 'Certainty (%)', font: { size: 11 } }, range: [0, 100] },
      yaxis: { ...LAYOUT_BASE.yaxis, title: { text: 'Citizens', font: { size: 11 } }, dtick: 1 },
      margin: { ...LAYOUT_BASE.margin, l: 52 },
    },
  }), [latestResponses]);

  const driftChartData = useMemo(() => {
    if (numRounds !== 3 || !result) return null;
    const supportPcts = [0, 1, 2].map(rn => {
      const roundResps = result.agent_responses.filter(r => r.round_number === rn);
      if (!roundResps.length) return 0;
      return Math.round((roundResps.filter(r => r.position === 'Support').length / roundResps.length) * 100);
    });
    return {
      data: [{
        x: ['Round 1', 'Round 2', 'Round 3'],
        y: supportPcts,
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: '#2d7a4f', width: 2.5 },
        marker: { color: '#2d7a4f', size: 9, line: { color: '#ffffff', width: 2 } },
        hovertemplate: '%{x}: %{y}% support<extra></extra>',
      }],
      layout: {
        ...LAYOUT_BASE,
        xaxis: { ...LAYOUT_BASE.xaxis },
        yaxis: { ...LAYOUT_BASE.yaxis, title: { text: 'Support (%)', font: { size: 11 } }, range: [0, 100] },
      },
    };
  }, [result, numRounds]);

  const driftRows = useMemo(() => {
    if (!result || numRounds < 2) return [];
    const firstRound = result.agent_responses.filter(r => r.round_number === 0);
    const finalByPid = {};
    result.agent_responses.filter(r => r.round_number === latestRound).forEach(r => {
      finalByPid[r.persona_id] = r;
    });
    return firstRound.map(r => {
      const final = finalByPid[r.persona_id];
      return {
        name:       r.persona_name,
        round1:     r.position,
        roundFinal: final ? final.position : '—',
        changed:    final && final.position !== r.position,
      };
    });
  }, [result, numRounds, latestRound]);

  const downloadCSV = () => {
    if (!result) return;
    const headers = ['Name', 'Age', 'Ethnicity', 'Occupation', 'Income Level', 'Planning Area', 'Round', 'Position', 'Confidence', 'Reasoning', 'Key Concern'];
    const rows = result.agent_responses.map(r => {
      const p = personaMap[r.persona_id];
      return [
        r.persona_name,
        p?.age ?? '',
        p?.ethnicity ?? '',
        p?.occupation ?? '',
        p?.income_level ?? '',
        p?.planning_area ?? '',
        r.round_number + 1,
        r.position,
        r.confidence,
        `"${(r.reasoning || '').replace(/"/g, '""')}"`,
        `"${(r.key_concern || '').replace(/"/g, '""')}"`,
      ].join(',');
    });
    const csv  = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'simulation_results.csv' });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const { ethnicity: ethBreakdown, income_level: incomeBreakdown } =
    result?.demographic_breakdown || {};

  function renderDots(group) {
    if (!group) return null;
    const dots = [];
    for (let i = 0; i < (group.Support || 0); i++)
      dots.push(<span key={`s${i}`} className="pos-dot support" title="Support" />);
    for (let i = 0; i < (group.Oppose || 0); i++)
      dots.push(<span key={`o${i}`} className="pos-dot oppose" title="Oppose" />);
    for (let i = 0; i < (group.Neutral || 0); i++)
      dots.push(<span key={`n${i}`} className="pos-dot neutral" title="Neutral" />);
    return dots;
  }

  if (!result) return null;

  return (
    <div className="analytics-panel">

      {/* Chart 1 — Position distribution */}
      <div className="analytics-chart-wrapper">
        <div className="analytics-chart-title">Position distribution</div>
        <Plot
          data={positionChartData.data}
          layout={positionChartData.layout}
          config={PLOTLY_CONFIG}
          style={{ width: '100%' }}
          useResizeHandler
        />
      </div>

      {/* Chart 2 — Confidence histogram */}
      <div className="analytics-chart-wrapper">
        <div className="analytics-chart-title">How certain were citizens?</div>
        <Plot
          data={confidenceChartData.data}
          layout={confidenceChartData.layout}
          config={PLOTLY_CONFIG}
          style={{ width: '100%' }}
          useResizeHandler
        />
      </div>

      {/* Chart 3 — Belief drift (3-round only) */}
      {driftChartData && (
        <div className="analytics-chart-wrapper">
          <div className="analytics-chart-title">Support rate across rounds</div>
          <Plot
            data={driftChartData.data}
            layout={driftChartData.layout}
            config={PLOTLY_CONFIG}
            style={{ width: '100%' }}
            useResizeHandler
          />
        </div>
      )}

      {/* Demographic breakdown */}
      <div className="analytics-section">
        <div className="analytics-section-title">Responses by demographic group</div>
        <div className="breakdown-grid">
          <div>
            <div className="breakdown-group-title">By ethnicity</div>
            {Object.entries(ethBreakdown || {}).map(([group, counts]) => (
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

      {/* Belief drift table (multi-round only) */}
      {driftRows.length > 0 && (
        <div className="analytics-section">
          <div className="analytics-section-title">
            Belief drift — Round 1 → Round {numRounds}
          </div>
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
              {driftRows.map(row => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>
                    <span className={`position-badge badge-${row.round1.toLowerCase()}`}>
                      {row.round1}
                    </span>
                  </td>
                  <td>
                    <span className={`position-badge badge-${(row.roundFinal || 'neutral').toLowerCase()}`}>
                      {row.roundFinal}
                    </span>
                  </td>
                  <td>
                    {row.changed
                      ? <span className="drift-changed-yes">Yes</span>
                      : <span className="drift-changed-no">No</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CSV export */}
      <div className="analytics-export-row">
        <button className="export-button" onClick={downloadCSV} type="button">
          Export results as CSV
        </button>
      </div>

    </div>
  );
}

export default AnalyticsPanel;
