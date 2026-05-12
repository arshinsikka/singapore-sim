// QuestionSelector.js — Lets the user pick a predefined policy question or type their own

import React from 'react';

function QuestionSelector({ questions, selectedId, onSelect, customQuestion, onCustomChange }) {
  return (
    <div className="question-selector">
      <p className="section-title">Select a policy question</p>

      {questions.map((q) => (
        <div
          key={q.id}
          className={`question-card${selectedId === q.id ? ' selected' : ''}`}
          onClick={() => onSelect(q.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelect(q.id)}
        >
          <div className="question-card-title">{q.title}</div>
          <div className="question-tags">
            {q.tags.map((tag) => (
              <span key={tag} className="tag-pill">{tag}</span>
            ))}
          </div>
        </div>
      ))}

      {/* Custom question option */}
      <div className="custom-question-section">
        <label className="custom-question-label" htmlFor="custom-question">
          Or describe your own policy question
        </label>
        <span className="custom-question-note">
          (Custom questions use the diverse population by default)
        </span>
        <textarea
          id="custom-question"
          className="custom-question-textarea"
          placeholder="Describe a Singapore policy scenario in plain language…"
          value={customQuestion}
          onChange={(e) => onCustomChange(e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
}

export default QuestionSelector;
