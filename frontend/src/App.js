import React, { useState } from 'react';
import './App.css';

import QuestionSelector   from './components/QuestionSelector';
import SimulationControls from './components/SimulationControls';
import PersonaGrid        from './components/PersonaGrid';
import ResultsDashboard   from './components/ResultsDashboard';

import { ALL_PERSONAS, POLICY_QUESTIONS, runSimulation } from './simulation';

function App() {
  const [questions]                                     = useState(POLICY_QUESTIONS);
  const [personas]                                      = useState(ALL_PERSONAS);
  const [selectedQuestionId, setSelectedQuestionId]     = useState(POLICY_QUESTIONS[0]?.id || null);
  const [customQuestion, setCustomQuestion]             = useState('');
  const [mode, setMode]                                 = useState('diverse');
  const [numRounds, setNumRounds]                       = useState(1);
  const [numAgents, setNumAgents]                       = useState(10);
  const [model, setModel]                               = useState('gpt-4o-mini');
  const [result, setResult]                             = useState(null);
  const [comparisonResult, setComparisonResult]         = useState(null);
  const [loading, setLoading]                           = useState(false);
  const [comparisonLoading, setComparisonLoading]       = useState(false);
  const [error, setError]                               = useState(null);

  const handleSelectQuestion = (id) => {
    setSelectedQuestionId(id);
    setCustomQuestion('');
    setResult(null);
    setComparisonResult(null);
    setError(null);
  };

  const handleCustomChange = (val) => {
    setCustomQuestion(val);
    if (val.trim()) setSelectedQuestionId(null);
    setResult(null);
    setComparisonResult(null);
    setError(null);
  };

  const handleModeChange = (m) => {
    setMode(m);
    setResult(null);
  };

  const handleRoundsChange = (n) => {
    setNumRounds(n);
    setResult(null);
    setComparisonResult(null);
  };

  const guardCustom = () => {
    if (customQuestion.trim()) {
      setError(
        'Custom question simulation is not yet supported — ' +
        'please select one of the predefined policy questions.'
      );
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
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await runSimulation(selectedQuestionId, mode, numRounds, numAgents, model);
      setResult(data);
    } catch {
      setError(
        'Something went wrong — please try again. ' +
        'Check your network connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (guardCustom()) return;
    setComparisonLoading(true);
    setError(null);
    setComparisonResult(null);
    try {
      const [diverseData, homogData] = await Promise.all([
        runSimulation(selectedQuestionId, 'diverse', numRounds, numAgents, model),
        runSimulation(selectedQuestionId, 'homogeneous', numRounds, numAgents, model),
      ]);
      setComparisonResult({ diverse: diverseData, homogeneous: homogData });
    } catch {
      setError(
        'Something went wrong — please try again. ' +
        'Check your network connection and try again.'
      );
    } finally {
      setComparisonLoading(false);
    }
  };

  const canAct        = !loading && !comparisonLoading &&
                        (!!selectedQuestionId || !!customQuestion.trim());
  const isLoading     = loading || comparisonLoading;
  const showSkeleton  = loading && !result;
  const showPersonas  = !result && !comparisonResult && !loading;
  const selectedQuestion = questions.find(q => q.id === selectedQuestionId) || null;

  return (
    <div className="app">

      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-inner">
          <h1 className="header-title">Singapore Society Simulation</h1>
          <p className="header-subtitle">How might citizens respond to public policy?</p>
        </div>
      </header>

      {/* ── Loading banner ── */}
      {isLoading && (
        <div className="loading-banner">
          <div className="spinner" />
          <p className="loading-message">
            {comparisonLoading
              ? 'Running both simulations for comparison — this may take 30–40 seconds'
              : 'Simulating citizen responses — this may take 15–20 seconds'}
          </p>
        </div>
      )}

      {/* ── Two-column layout ── */}
      <main className="app-main">

        {/* Left 38% */}
        <div className="left-column">
          <QuestionSelector
            questions={questions}
            selectedId={selectedQuestionId}
            onSelect={handleSelectQuestion}
            customQuestion={customQuestion}
            onCustomChange={handleCustomChange}
          />

          <SimulationControls
            mode={mode}
            onModeChange={handleModeChange}
            numRounds={numRounds}
            onRoundsChange={handleRoundsChange}
            numAgents={numAgents}
            onNumAgentsChange={setNumAgents}
            model={model}
            onModelChange={setModel}
            onRun={handleRun}
            onCompare={handleCompare}
            loading={loading}
            comparisonLoading={comparisonLoading}
            disabled={!canAct}
          />

          {error && <div className="error-banner">{error}</div>}
        </div>

        {/* Right 62% */}
        <div className="right-column">
          {showSkeleton && (
            <div className="skeleton-container">
              <div className="skeleton-bar" />
              <div className="skeleton-bar" style={{ width: '85%' }} />
              <div className="skeleton-bar" style={{ width: '68%' }} />
            </div>
          )}

          {showPersonas && <PersonaGrid personas={personas} mode={mode} />}

          {(result || comparisonResult) && (
            <ResultsDashboard
              result={result}
              numRounds={numRounds}
              personas={personas}
              comparisonResult={comparisonResult}
              question={selectedQuestion}
              onClearComparison={() => setComparisonResult(null)}
            />
          )}
        </div>

      </main>
    </div>
  );
}

export default App;
