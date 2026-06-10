# Singapore Society Simulation

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=flat-square)](https://arshinsikka.github.io/singapore-sim)

## Overview

Singapore Society Simulation is a web-based multi-agent social simulation that models how synthetic Singapore citizens reason about public policy questions. Each agent is grounded in a persona from the [NVIDIA Nemotron-Personas-Singapore](https://huggingface.co/datasets/nvidia/Nemotron-Personas-Singapore) dataset — 888,000 synthetic personas reflecting Singapore's real demographic distributions across ethnicity, age, occupation, education, and planning area.

The project explores a core research question: **does demographic diversity in agent populations shift collective predictions on policy outcomes?** It is developed as part of NUS CP2107 (Independent Study Module), supervised by Zhang Xuan (PhD student, NUS School of Computing) under Professor See-Kiong Ng — Professor of Practice, Department of Computer Science, NUS School of Computing, and Director of Translational Research at the NUS Institute of Data Science. Professor Ng's research spans AI, data science, and smart cities.

## Demo Flow

- **Step 1 — Select agents:** Choose from a pool of 100 real Nemotron-Singapore personas. Filter by age, sex, ethnicity, education level, marital status, and planning area.
- **Step 2 — Configure simulation:** Choose a policy question (preset or custom), number of deliberation rounds, and language model.
- **Step 3 — Explore results:** Run the simulation and examine results via a Discussion feed, Analytics charts, and demographic breakdowns.

## Key Features

- 100 synthetic Singapore personas drawn from the NVIDIA Nemotron-Personas-Singapore dataset
- Multi-round deliberation with belief drift tracking — each agent sees its own prior reasoning and an LLM-generated summary of other agents' views before updating its position
- Demographic breakdowns by sex, education level, and ethnic group
- Filter and search agents by demographic attributes
- Export results as CSV
- Fully static frontend deployed on GitHub Pages — no backend required
- Session-only API key handling — key is never persisted beyond the browser session

## Academic Grounding

This project builds on the following literature:

1. Park et al. — [Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442)
2. Li et al. — [CAMEL: Communicative Agents for Mind Exploration](https://arxiv.org/abs/2303.17760)
3. Argyle et al. — [1000-Person Generative Agent Simulation](https://arxiv.org/abs/2411.10109)
4. Gao et al. — [AgentSociety](https://arxiv.org/abs/2502.08691)

## Dataset

**NVIDIA Nemotron-Personas-Singapore** — [huggingface.co/datasets/nvidia/Nemotron-Personas-Singapore](https://huggingface.co/datasets/nvidia/Nemotron-Personas-Singapore)

888,000 synthetic personas calibrated to Singapore's census distributions across age, sex, ethnicity, education, marital status, occupation, income, and planning area.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React (Create React App) |
| Deployment | GitHub Pages |
| LLM inference | OpenAI API (GPT-4o mini / GPT-5 mini) |
| API proxy | Cloudflare Workers |
| Charts | Plotly |

## Local Development

```bash
cd frontend
npm install
npm start
```

An OpenAI API key is required — enter it in the UI on page load. It is held in memory for the session only.

## Deployment

```bash
cd frontend
npm run deploy
```

Deploys to GitHub Pages via the `gh-pages` package.
