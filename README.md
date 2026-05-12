# Singapore Society Simulation

**CP2107 Independent Study Module** — supervised by Prof Zhang Xuan, National University of Singapore.

## Overview

This project simulates how synthetic Singapore citizens reason about public policy using LLM agents. A set of 20 demographically realistic personas — spanning ethnicity, age, occupation, income, and planning area — are instantiated as individual agents and prompted via CAMEL-style inception prompting to respond to policy questions in character. The tool is designed for social scientists to explore how demographic composition shapes collective opinion: researchers can compare a diverse population against a homogeneous baseline, run multi-round deliberation to observe belief drift, and inspect each agent's reasoning and key concern. All personas are drawn from the Nemotron-Singapore synthetic dataset (888,000 personas).

## Architecture

| Layer | Technology |
|-------|-----------|
| Backend API | FastAPI (Python), served with Uvicorn |
| LLM inference | Claude Sonnet (`anthropic/claude-sonnet-4-5`) via OpenRouter |
| Frontend | React (Create React App), plain CSS — no UI libraries |
| Data | 20 hardcoded synthetic personas in `backend/personas.py` |

The backend exposes REST endpoints (`/questions`, `/personas`, `/simulate`) and handles all LLM orchestration asynchronously. The frontend is a single-page app that communicates with the backend over HTTP.

## Setup

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install fastapi uvicorn openai python-dotenv pydantic
```

Create `backend/.env`:
```
OPENROUTER_API_KEY=sk-or-your-key-here
```

Start the server:
```bash
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm start          # runs on http://localhost:3000
```

## What's implemented

- **20 synthetic Singapore personas** across Chinese, Malay, Indian, and Others ethnicities with realistic occupations, planning areas, income levels, values, and concerns
- **5 policy questions** covering PWM expansion, HDB MOP extension, foreign worker levy increase, CPF LIFE age change, and carbon tax rebate redistribution
- **Single and multi-round simulation** — 3-round mode feeds each agent a plain-English summary of the prior round before they respond, enabling belief drift analysis
- **Diverse vs uniform population modes** — diverse samples maximally across demographic axes; uniform uses a homogeneous Chinese median-income baseline for comparison
- **Population comparison view** — runs both modes simultaneously and displays side-by-side results with a plain-English "key differences" interpretation and an ethnic breakdown table
