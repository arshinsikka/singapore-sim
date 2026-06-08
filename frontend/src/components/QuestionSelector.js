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

      {/* Custom question option — disabled placeholder */}
      <div className="custom-question-section">
        <label className="custom-question-label">
          Or describe your own policy question
        </label>
        <div
          style={{
            background: '#f0ede8',
            border: '1.5px solid #e0ddd8',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            minHeight: '76px',
            display: 'flex',
            alignItems: 'center',
            color: '#a0a0a0',
            fontStyle: 'italic',
            fontSize: '0.85rem',
            cursor: 'default',
            userSelect: 'none',
          }}
        >
          Custom questions coming soon
        </div>
      </div>
    </div>
  );
}

export default QuestionSelector;
