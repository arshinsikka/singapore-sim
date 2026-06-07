import React, { useState } from 'react';

function ApiKeyModal({ onKeySubmit }) {
  const [key, setKey]     = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed.startsWith('sk-') || trimmed.length <= 20) {
      setError('Key must start with sk- and be longer than 20 characters.');
      return;
    }
    setError('');
    onKeySubmit(trimmed);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(10, 25, 60, 0.80)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '2.5rem 2rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 8px 40px rgba(10,25,60,0.35)',
      }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0a193c', margin: '0 0 0.35rem' }}>
          Singapore Society Simulation
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#5a6a85', margin: '0 0 1.75rem', lineHeight: 1.55 }}>
          Enter your OpenAI API key to run simulations. Your key is held in memory only
          for this session and is never stored or logged.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="sk-..."
            value={key}
            onChange={e => { setKey(e.target.value); setError(''); }}
            autoFocus
            style={{
              width: '100%',
              padding: '0.6rem 0.85rem',
              borderRadius: '7px',
              border: `1.5px solid ${error ? '#b83232' : '#d6d0c8'}`,
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: '0.5rem',
            }}
          />
          {error && (
            <p style={{ fontSize: '0.78rem', color: '#b83232', margin: '0 0 0.75rem' }}>{error}</p>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.65rem',
              borderRadius: '8px',
              border: 'none',
              background: '#0a193c',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              marginTop: error ? 0 : '0.5rem',
            }}
          >
            Start Simulation
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApiKeyModal;
