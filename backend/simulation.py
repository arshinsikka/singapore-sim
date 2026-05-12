# simulation.py — Async simulation engine using CAMEL-style inception prompting via OpenRouter

import asyncio
import json
import logging
import os
import re

from dotenv import load_dotenv
from openai import AsyncOpenAI

from models import (
    AgentResponse,
    Persona,
    PolicyQuestion,
    SimulationRequest,
    SimulationResult,
)

load_dotenv()

_client = AsyncOpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY", ""),
    base_url="https://openrouter.ai/api/v1",
)

_MODEL = "anthropic/claude-sonnet-4-5"

logger = logging.getLogger(__name__)


def build_messages(
    persona: Persona,
    question: PolicyQuestion,
    prior_round_summary: str | None = None,
    round_number: int = 0,
) -> list[dict]:
    system = (
        f"You are {persona.name}, a {persona.age}-year-old {persona.ethnicity} {persona.gender.lower()} "
        f"living in {persona.planning_area}, Singapore. "
        f"Your occupation is {persona.occupation}. "
        f"Your highest education level is {persona.education}. "
        f"Your household income level is {persona.income_level.replace('_', ' ')}. "
        f"Your core values are: {', '.join(persona.values)}. "
        f"Your primary concerns are: {', '.join(persona.concerns)}. "
        "\n\n"
        "You are a real Singapore citizen, not a chatbot or an AI. "
        "Reason and respond ONLY as this specific person based on your lived experience, "
        "background, and the values and concerns listed above. "
        "Never break character. Never give generic or balanced policy-analyst answers. "
        "Your opinion is personal, rooted in your daily life, and may be imperfect or biased — that is authentic. "
        "\n\n"
        "You must respond only in valid JSON with exactly these fields: "
        "position (one of: Support, Oppose, Neutral), "
        "confidence (integer 0-100), "
        "reasoning (2-3 sentences in your own voice as this person), "
        "key_concern (one specific concern driving your view). "
        "No preamble, no markdown, only the JSON object."
    )

    user_parts = []

    if prior_round_summary and round_number > 0:
        user_parts.append(
            f"After hearing from others in the group, here is what people thought overall: "
            f"{prior_round_summary} "
            "You may update your view or hold it — but you must reason from your own lived experience."
        )

    user_parts.append(
        f"Policy question: {question.title}\n\n"
        f"Description: {question.description}\n\n"
        f"Context: {question.context}"
    )

    return [
        {"role": "system", "content": system},
        {"role": "user", "content": "\n\n".join(user_parts)},
    ]


async def _call_llm(messages: list[dict]) -> dict:
    raw = await _client.chat.completions.create(
        model=_MODEL,
        messages=messages,
        temperature=0.7,
        max_tokens=300,
    )
    content = raw.choices[0].message.content.strip()

    # Stage 1: direct parse
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        pass

    # Stage 2: strip markdown code fences
    cleaned = re.sub(r"```(?:json)?", "", content).replace("```", "").strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Stage 3: extract first JSON object found anywhere in the response
    match = re.search(r"\{.*?\}", content, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    raise ValueError(f"Could not parse JSON from model response")


async def _get_agent_response(
    persona: Persona,
    question: PolicyQuestion,
    prior_round_summary: str | None,
    round_number: int,
) -> AgentResponse:
    messages = build_messages(persona, question, prior_round_summary, round_number)
    fallback = AgentResponse(
        persona_id=persona.id,
        persona_name=persona.name,
        position="Neutral",
        confidence=50,
        reasoning="Unable to parse response",
        key_concern="Unknown",
        round_number=round_number,
    )

    try:
        data = await _call_llm(messages)
    except Exception:
        try:
            data = await _call_llm(messages)
        except Exception:
            return fallback

    try:
        position = data.get("position", "Neutral")
        if position not in ("Support", "Oppose", "Neutral"):
            position = "Neutral"
        confidence = int(data.get("confidence", 50))
        confidence = max(0, min(100, confidence))
        return AgentResponse(
            persona_id=persona.id,
            persona_name=persona.name,
            position=position,
            confidence=confidence,
            reasoning=str(data.get("reasoning", "")),
            key_concern=str(data.get("key_concern", "")),
            round_number=round_number,
        )
    except Exception:
        return fallback


def compute_aggregate(responses: list[AgentResponse]) -> dict:
    total = len(responses)
    if total == 0:
        return {"support_pct": 0, "oppose_pct": 0, "neutral_pct": 0, "avg_confidence": 0, "position_counts": {}}
    counts = {"Support": 0, "Oppose": 0, "Neutral": 0}
    confidence_sum = 0
    for r in responses:
        counts[r.position] = counts.get(r.position, 0) + 1
        confidence_sum += r.confidence
    return {
        "support_pct": round(counts["Support"] / total * 100, 1),
        "oppose_pct": round(counts["Oppose"] / total * 100, 1),
        "neutral_pct": round(counts["Neutral"] / total * 100, 1),
        "avg_confidence": round(confidence_sum / total, 1),
        "position_counts": counts,
    }


def compute_demographic_breakdown(
    responses: list[AgentResponse], personas: list[Persona]
) -> dict:
    persona_map = {p.id: p for p in personas}
    breakdown: dict[str, dict] = {"ethnicity": {}, "income_level": {}}

    for r in responses:
        p = persona_map.get(r.persona_id)
        if not p:
            continue
        for dim, key in [("ethnicity", p.ethnicity), ("income_level", p.income_level)]:
            if key not in breakdown[dim]:
                breakdown[dim][key] = {"Support": 0, "Oppose": 0, "Neutral": 0, "total": 0}
            breakdown[dim][key][r.position] += 1
            breakdown[dim][key]["total"] += 1

    return breakdown


def summarise_round(responses: list[AgentResponse]) -> str:
    agg = compute_aggregate(responses)
    counts = agg["position_counts"]
    total = len(responses)
    support_n = counts.get("Support", 0)
    oppose_n = counts.get("Oppose", 0)
    neutral_n = counts.get("Neutral", 0)

    support_concerns = [r.key_concern for r in responses if r.position == "Support"]
    oppose_concerns = [r.key_concern for r in responses if r.position == "Oppose"]

    summary = (
        f"{support_n} out of {total} people supported this policy"
        + (f", mainly citing: {support_concerns[0]}" if support_concerns else "")
        + f". {oppose_n} opposed it"
        + (f", mostly concerned about: {oppose_concerns[0]}" if oppose_concerns else "")
        + f". {neutral_n} remained undecided."
    )
    return summary


async def run_simulation(
    request: SimulationRequest,
    personas: list[Persona],
    question: PolicyQuestion,
) -> SimulationResult:
    all_responses: list[AgentResponse] = []
    prior_summary: str | None = None

    for round_num in range(request.num_rounds):
        tasks = [
            _get_agent_response(p, question, prior_summary, round_num)
            for p in personas
        ]
        round_responses = await asyncio.gather(*tasks)
        all_responses.extend(round_responses)
        prior_summary = summarise_round(list(round_responses))

    latest_round = max(r.round_number for r in all_responses) if all_responses else 0
    latest_responses = [r for r in all_responses if r.round_number == latest_round]

    return SimulationResult(
        question=question,
        agent_responses=all_responses,
        aggregate=compute_aggregate(latest_responses),
        demographic_breakdown=compute_demographic_breakdown(latest_responses, personas),
        rounds_completed=request.num_rounds,
    )
