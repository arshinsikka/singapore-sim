import React, { useState } from 'react';
import './App.css';

import QuestionSelector    from './components/QuestionSelector';
import SimulationControls  from './components/SimulationControls';
import ResultsDashboard    from './components/ResultsDashboard';
import AgentSelectionPanel from './components/AgentSelectionPanel';
import ApiKeyModal         from './components/ApiKeyModal';

import { ALL_PERSONAS, POLICY_QUESTIONS, runSimulation } from './simulation';

function App() {
  const [apiKey, setApiKey]                           = useState(null);
  const [step, setStep]                               = useState(1);
  const [selectedPersonaIds, setSelectedPersonaIds]   = useState(new Set());
  const [questions]                                   = useState(POLICY_QUESTIONS);
  const [selectedQuestionId, setSelectedQuestionId]   = useState(POLICY_QUESTIONS[0]?.id || null);
  const [customQuestion, setCustomQuestion]           = useState('');
  const [numRounds, setNumRounds]                     = useState(1);
  const [model, setModel]                             = useState('gpt-4o-mini');
  const [result, setResult]                           = useState(null);
  const [loading, setLoading]                         = useState(false);
  const [error, setError]                             = useState(null);

  const selectedPersonas = ALL_PERSONAS.filter(p => selectedPersonaIds.has(p.id));

  const handleTogglePersona = (id) => {
    setSelectedPersonaIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectQuestion = (id) => {
    setSelectedQuestionId(id);
    setCustomQuestion('');
    setResult(null);
    setError(null);
  };

  const handleCustomChange = (val) => {
    setCustomQuestion(val);
    if (val.trim()) setSelectedQuestionId(null);
    setResult(null);
    setError(null);
  };

  const handleRoundsChange = (n) => {
    setNumRounds(n);
    setResult(null);
  };

  const guardCustom = () => {
    if (customQuestion.trim()) {
      setError('Custom question simulation is not yet supported — please select one of the predefined policy questions.');
      return true;
    }
    if (!selectedQuestionId) {
      setError('Please select a policy question before running the simulation.');
      return true;
    }
    return false;
  };

  const handleRun = async () => {
    if (guardCustom()) return;
    setStep(3);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await runSimulation(selectedQuestionId, selectedPersonas, numRounds, apiKey, model);
      setResult(data);
    } catch {
      setError('Something went wrong — please try again. Check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId) || null;
  const canRun = !loading && (!!selectedQuestionId || !!customQuestion.trim());

  const mainStyle = step === 1
    ? { display: 'block', maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }
    : {};

  if (!apiKey) {
    return <ApiKeyModal onKeySubmit={setApiKey} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <h1 className="header-title">Singapore Society Simulation</h1>
          <p className="header-subtitle">How might citizens respond to public policy?</p>
        </div>
        <button
          type="button"
          onClick={() => setApiKey(null)}
          style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem',
            cursor: 'pointer', textDecoration: 'underline',
            padding: '0 1rem', alignSelf: 'center',
          }}
        >
          Change API key
        </button>
      </header>

      {loading && (
        <div className="loading-banner">
          <div className="spinner" />
          <p className="loading-message">Simulating citizen responses — this may take 15–20 seconds</p>
        </div>
      )}

      <main className="app-main" style={mainStyle}>

        {step === 1 && (
          <AgentSelectionPanel
            personas={ALL_PERSONAS}
            selectedIds={selectedPersonaIds}
            onToggle={handleTogglePersona}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <>
            <div className="left-column">
              <QuestionSelector
                questions={questions}
                selectedId={selectedQuestionId}
                onSelect={handleSelectQuestion}
                customQuestion={customQuestion}
                onCustomChange={handleCustomChange}
              />
              <SimulationControls
                numRounds={numRounds}
                onRoundsChange={handleRoundsChange}
                numAgents={selectedPersonas.length}
                model={model}
                onModelChange={setModel}
                onRun={handleRun}
                loading={loading}
                disabled={!canRun}
                onBack={() => setStep(1)}
              />
              {error && <div className="error-banner">{error}</div>}
            </div>
            <div className="right-column">
              <div style={{ paddingTop: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--navy, #0a193c)', marginBottom: '1rem' }}>
                  {selectedPersonas.length} agent{selectedPersonas.length !== 1 ? 's' : ''} selected
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '0.75rem' }}>
                  {selectedPersonas.map(p => (
                    <div key={p.id} style={{
                      border: '1.5px solid var(--navy, #0a193c)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      fontSize: '0.82rem',
                      background: 'rgba(10,25,60,0.04)',
                    }}>
                      <div style={{ fontWeight: 700, marginBottom: '0.2rem', color: 'var(--navy, #0a193c)' }}>{p.name}</div>
                      <div style={{ color: 'var(--text-muted, #5a6a85)' }}>{p.age} · {p.sex}</div>
                      <div style={{ color: 'var(--text-muted, #5a6a85)' }}>{p.occupation}</div>
                      <div style={{ color: 'var(--text-muted, #5a6a85)' }}>{p.planning_area}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="left-column">
              <SimulationControls
                numRounds={numRounds}
                onRoundsChange={handleRoundsChange}
                numAgents={selectedPersonas.length}
                model={model}
                onModelChange={setModel}
                onRun={handleRun}
                loading={loading}
                disabled={true}
                onBack={() => setStep(2)}
              />
              {error && <div className="error-banner">{error}</div>}
            </div>
            <div className="right-column">
              {loading && !result && (
                <div className="skeleton-container">
                  <div className="skeleton-bar" />
                  <div className="skeleton-bar" style={{ width: '85%' }} />
                  <div className="skeleton-bar" style={{ width: '68%' }} />
                </div>
              )}
              {result && (
                <ResultsDashboard
                  result={result}
                  numRounds={numRounds}
                  personas={selectedPersonas}
                  question={selectedQuestion}
                />
              )}
            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default App;
