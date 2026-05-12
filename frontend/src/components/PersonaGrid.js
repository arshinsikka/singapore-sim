// PersonaGrid.js — Shows the 10 simulated personas based on the current population mode

import React, { useMemo } from 'react';

const ETHNICITY_CLASS = {
  Chinese: 'avatar-chinese',
  Malay:   'avatar-malay',
  Indian:  'avatar-indian',
  Others:  'avatar-others',
};

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

// Diverse: bucket by ethnicity × age-group × income × gender, pick one per bucket
function pickDiverse(personas, n = 10) {
  const buckets = {};
  personas.forEach((p) => {
    const age = p.age < 35 ? 'young' : p.age < 50 ? 'mid' : 'senior';
    const key = `${p.ethnicity}|${age}|${p.income_level}|${p.gender}`;
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(p);
  });

  const selected = [];
  const seen = new Set();

  Object.values(buckets).forEach((group) => {
    if (selected.length < n) {
      const available = group.filter((p) => !seen.has(p.id));
      if (available.length) {
        selected.push(available[0]);
        seen.add(available[0].id);
      }
    }
  });

  // Fill up to n if buckets were exhausted
  personas.forEach((p) => {
    if (selected.length < n && !seen.has(p.id)) {
      selected.push(p);
      seen.add(p.id);
    }
  });

  return selected.slice(0, n);
}

// Homogeneous: first 10 Chinese median-income personas
function pickHomogeneous(personas, n = 10) {
  const pool = personas.filter(
    (p) => p.ethnicity === 'Chinese' && p.income_level === 'median'
  );
  if (pool.length >= n) return pool.slice(0, n);
  // Pad with any Chinese personas if pool is small
  const extra = personas.filter(
    (p) => p.ethnicity === 'Chinese' && !pool.includes(p)
  );
  return [...pool, ...extra].slice(0, n);
}

function PersonaGrid({ personas, mode }) {
  const displayed = useMemo(() => {
    if (!personas || personas.length === 0) return [];
    return mode === 'homogeneous'
      ? pickHomogeneous(personas)
      : pickDiverse(personas);
  }, [personas, mode]);

  const incomeLabel = {
    low:          'Low income',
    median:       'Median income',
    above_median: 'Above median',
    high:         'High income',
  };

  return (
    <div className="persona-grid-container">
      <div className="persona-grid-header">
        <div className="persona-grid-title">Who will be simulated?</div>
        <div className="persona-grid-subtitle">
          A sample of 10 synthetic Singapore citizens drawn from the Nemotron-Singapore
          dataset (888,000 personas)
        </div>
      </div>

      {displayed.length === 0 ? (
        <div className="persona-grid-empty">Loading personas…</div>
      ) : (
        <div className="persona-grid">
          {displayed.map((p) => (
            <div key={p.id} className="persona-card">
              <div
                className={`persona-avatar ${ETHNICITY_CLASS[p.ethnicity] || 'avatar-others'}`}
                title={p.ethnicity}
              >
                {getInitials(p.name)}
              </div>
              <div className="persona-name">{p.name}</div>
              <div className="persona-meta">
                Age {p.age}
                <br />
                {p.occupation}
                <br />
                {p.planning_area}
                <br />
                <span style={{ fontStyle: 'italic' }}>{incomeLabel[p.income_level] || p.income_level}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PersonaGrid;
