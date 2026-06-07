import React, { useState, useMemo } from 'react';
import { getRandomSample } from '../utils/personas';

function PersonaCard({ persona, selected, onToggle }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        border: selected ? '2px solid var(--navy, #0a193c)' : '1.5px solid #d6d0c8',
        borderRadius: '10px',
        padding: '0.9rem',
        background: selected ? 'rgba(10,25,60,0.06)' : '#ffffff',
        cursor: 'pointer',
        transition: 'border 0.12s, background 0.12s',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
        position: 'relative',
      }}
      onClick={() => onToggle(persona.id)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy, #0a193c)', marginRight: '0.5rem' }}>
          {persona.name}
        </div>
        <button
          type="button"
          onClick={e => { e.stopPropagation(); setExpanded(x => !x); }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted, #5a6a85)',
            fontSize: '0.78rem',
            padding: '0',
            flexShrink: 0,
          }}
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #5a6a85)' }}>
        {persona.sex} · {persona.age} · {persona.marital_status}
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #5a6a85)' }}>
        {persona.education_level}
      </div>
      <div style={{ fontSize: '0.78rem', color: '#2c3e50' }}>{persona.occupation}</div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #5a6a85)' }}>{persona.planning_area}</div>

      {expanded && (
        <div
          style={{
            marginTop: '0.6rem',
            borderTop: '1px solid #e8e4dc',
            paddingTop: '0.6rem',
            maxHeight: '160px',
            overflowY: 'auto',
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ fontSize: '0.75rem', color: '#2c3e50', marginBottom: '0.5rem' }}>
            <strong>Persona:</strong> {persona.persona}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#2c3e50' }}>
            <strong>Cultural background:</strong> {persona.cultural_background}
          </div>
        </div>
      )}
    </div>
  );
}

function AgentSelectionPanel({ personas, selectedIds, onToggle, onNext }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return personas;
    return personas.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.occupation.toLowerCase().includes(q) ||
      p.planning_area.toLowerCase().includes(q)
    );
  }, [personas, search]);

  const handleRandomSelect = () => {
    const sample = getRandomSample(10);
    const newIds = new Set(sample.map(p => p.id));
    // Replace selection with these 10
    sample.forEach(p => {
      if (!selectedIds.has(p.id)) onToggle(p.id);
    });
    // Deselect any currently selected that are not in new sample
    selectedIds.forEach(id => {
      if (!newIds.has(id)) onToggle(id);
    });
  };

  const handleClearAll = () => {
    selectedIds.forEach(id => onToggle(id));
  };

  const selectedCount = selectedIds.size;

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy, #0a193c)', margin: '0 0 0.3rem' }}>
          Step 1 — Select Your Agents
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #5a6a85)', margin: 0 }}>
          Choose which synthetic Singapore citizens will participate in the simulation
        </p>
      </div>

      {/* Controls row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--navy, #0a193c)', minWidth: '130px' }}>
          {selectedCount} agent{selectedCount !== 1 ? 's' : ''} selected
        </div>
        <button
          type="button"
          onClick={handleRandomSelect}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: '999px',
            border: '1.5px solid var(--navy, #0a193c)',
            background: 'var(--navy, #0a193c)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.82rem',
            cursor: 'pointer',
          }}
        >
          Random Selection
        </button>
        <button
          type="button"
          onClick={handleClearAll}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: '999px',
            border: '1.5px solid var(--navy, #0a193c)',
            background: 'transparent',
            color: 'var(--navy, #0a193c)',
            fontWeight: 600,
            fontSize: '0.82rem',
            cursor: 'pointer',
          }}
        >
          Clear All
        </button>
        <input
          type="text"
          placeholder="Search by name, occupation, or area…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '0.45rem 0.8rem',
            borderRadius: '8px',
            border: '1.5px solid #d6d0c8',
            fontSize: '0.85rem',
            outline: 'none',
          }}
        />
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.85rem',
      }}>
        {filtered.map(p => (
          <PersonaCard
            key={p.id}
            persona={p}
            selected={selectedIds.has(p.id)}
            onToggle={onToggle}
          />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', color: 'var(--text-muted, #5a6a85)', padding: '2rem', textAlign: 'center' }}>
            No agents match your search.
          </div>
        )}
      </div>

      {/* Bottom next button — sticky */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255,255,255,0.96)',
        borderTop: '1px solid #e8e4dc',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 100,
      }}>
        <button
          type="button"
          onClick={onNext}
          disabled={selectedCount < 2}
          style={{
            padding: '0.65rem 1.75rem',
            borderRadius: '8px',
            border: 'none',
            background: selectedCount >= 2 ? 'var(--navy, #0a193c)' : '#c5c5c5',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: selectedCount >= 2 ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s',
          }}
        >
          Next: Configure Simulation →
        </button>
      </div>
    </div>
  );
}

export default AgentSelectionPanel;
