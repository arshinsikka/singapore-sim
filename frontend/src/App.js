// App.js — Main application shell; owns all global state and orchestrates layout

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import QuestionSelector   from './components/QuestionSelector';
import SimulationControls from './components/SimulationControls';
import PersonaGrid        from './components/PersonaGrid';
import ResultsDashboard   from './components/ResultsDashboard';
import ComparisonView     from './components/ComparisonView';

const API = 'http://localhost:8000';

function App() {
  const [questions, setQuestions]                   = useState([]);
  const [personas, setPersonas]                     = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [customQuestion, setCustomQuestion]         = useState('');
  const [mode, setMode]                             = useState('diverse');
  const [numRounds, setNumRounds]                   = useState(1);
  const [result, setResult]                         = useState(null);
  const [comparisonResult, setComparisonResult]     = useState(null);
  const [loading, setLoading]                       = useState(false);
  const [comparisonLoading, setComparisonLoading]   = useState(false);
  const [error, setError]                           = useState(null);

  // Fetch questions and personas on mount
  useEffect(() => {
    Promise.all([
      axios.get(`${API}/questions`),
      axios.get(`${API}/personas`),
    ])
      .then(([qRes, pRes]) => {
        setQuestions(qRes.data);
        setPersonas(pRes.data);
        if (qRes.data.length > 0) setSelectedQuestionId(qRes.data[0].id);
      })
      .catch(() => {
        setError(
          'Could not connect to the simulation server. ' +
          'Please ensure it is running at http://localhost:8000.'
        );
      });
  }, []);

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
      const response = await axios.post(`${API}/simulate`, {
        question_id: selectedQuestionId,
        mode,
        num_rounds: numRounds,
      });
      setResult(response.data);
    } catch {
      setError(
        'Something went wrong — please try again. ' +
        'If the problem persists, check that the simulation server is running.'
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
      const [diverseRes, homogRes] = await Promise.all([
        axios.post(`${API}/simulate`, {
          question_id: selectedQuestionId,
          mode: 'diverse',
          num_rounds: numRounds,
        }),
        axios.post(`${API}/simulate`, {
          question_id: selectedQuestionId,
          mode: 'homogeneous',
          num_rounds: numRounds,
        }),
      ]);
      setComparisonResult({ diverse: diverseRes.data, homogeneous: homogRes.data });
    } catch {
      setError(
        'Something went wrong — please try again. ' +
        'If the problem persists, check that the simulation server is running.'
      );
    } finally {
      setComparisonLoading(false);
    }
  };

  const canAct = !loading && !comparisonLoading &&
                 (!!selectedQuestionId || !!customQuestion.trim());

  const isLoading     = loading || comparisonLoading;
  const showPersonas  = !result && !comparisonResult;
  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId) || null;

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-inner">
          <h1 className="header-title">Singapore Society Simulation</h1>
          <p className="header-subtitle">How might citizens respond to public policy?</p>
        </div>
      </header>

      {/* ── Full-width loading banner ── */}
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
          {showPersonas && (
            <PersonaGrid personas={personas} mode={mode} />
          )}

          {result && (
            <ResultsDashboard result={result} numRounds={numRounds} personas={personas} />
          )}

          {/* ComparisonView: below ResultsDashboard if both exist; sole content if result is null */}
          {comparisonResult && (
            <>
              <ComparisonView
                comparisonResult={comparisonResult}
                question={selectedQuestion}
                numRounds={numRounds}
              />
              <div className="clear-comparison-wrap">
                <button
                  className="clear-comparison-link"
                  onClick={() => setComparisonResult(null)}
                  type="button"
                >
                  Clear comparison
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
