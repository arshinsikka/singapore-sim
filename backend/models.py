# models.py — Pydantic data models shared across the simulation system

from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from enum import Enum


class Ethnicity(str, Enum):
    chinese = "Chinese"
    malay = "Malay"
    indian = "Indian"
    others = "Others"


class IncomeLevel(str, Enum):
    low = "low"
    median = "median"
    above_median = "above_median"
    high = "high"


class Position(str, Enum):
    support = "Support"
    oppose = "Oppose"
    neutral = "Neutral"


class SimulationMode(str, Enum):
    diverse = "diverse"
    homogeneous = "homogeneous"


class Persona(BaseModel):
    id: int
    name: str
    age: int
    ethnicity: str
    occupation: str
    education: str
    planning_area: str
    income_level: str
    gender: str
    values: List[str]
    concerns: List[str]


class PolicyQuestion(BaseModel):
    id: str
    title: str
    description: str
    context: str
    tags: List[str]


class AgentResponse(BaseModel):
    persona_id: int
    persona_name: str
    position: str
    confidence: int
    reasoning: str
    key_concern: str
    round_number: int


class SimulationRequest(BaseModel):
    question_id: str
    mode: str = "diverse"
    num_rounds: int = 1


class SimulationResult(BaseModel):
    question: PolicyQuestion
    agent_responses: List[AgentResponse]
    aggregate: Dict[str, Any]
    demographic_breakdown: Dict[str, Any]
    rounds_completed: int
