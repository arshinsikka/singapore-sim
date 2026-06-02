import React, { useState } from 'react';

function ApiKeyModal({ onKeySubmit }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed.startsWith('sk-') || trimmed.length <= 20) {
      setError('Please enter a valid OpenAI API key (starts with sk-).');
      return;
    }
    localStorage.setItem('openrouter_api_key', trimmed);
    onKeySubmit(trimmed);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h1 style={styles.title}>Singapore Society Simulation</h1>
        <p style={styles.explanation}>
          Enter your OpenAI API key to run simulations. Your key is stored locally
          in your browser and never sent to any server other than OpenAI.
        </p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            value={key}
            onChange={e => { setKey(e.target.value); setError(''); }}
            placeholder="sk-... (OpenAI API key)"
            style={styles.input}
            autoFocus
          />
          {error && <p style={styles.errorText}>{error}</p>}
          <button type="submit" style={styles.button}>
            Start Simulating
          </button>
        </form>
        <span style={styles.link}>Enter your OpenAI API key</span>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(10, 25, 60, 0.80)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'var(--bg-card, #ffffff)',
    borderRadius: '12px',
    padding: '2.5rem 2rem',
    maxWidth: '440px',
    width: '90%',
    boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: 'var(--navy, #0a193c)',
    margin: 0,
  },
  explanation: {
    fontSize: '0.9rem',
    color: 'var(--text-muted, #5a6a85)',
    lineHeight: 1.6,
    margin: 0,
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  input: {
    width: '100%',
    padding: '0.65rem 0.85rem',
    fontSize: '0.95rem',
    border: '1.5px solid #c8d3e8',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'monospace',
  },
  button: {
    width: '100%',
    padding: '0.7rem',
    fontSize: '0.95rem',
    fontWeight: 600,
    background: 'var(--navy, #0a193c)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  errorText: {
    color: '#c0392b',
    fontSize: '0.82rem',
    margin: 0,
  },
  link: {
    fontSize: '0.82rem',
    color: 'var(--text-muted, #5a6a85)',
    textDecoration: 'underline',
  },
};

export default ApiKeyModal;
