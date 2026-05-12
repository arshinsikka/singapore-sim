# main.py — FastAPI entry point; wires together personas, questions, and the simulation engine

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import PolicyQuestion, SimulationRequest, SimulationResult
from personas import ALL_PERSONAS, sample_diverse, sample_homogeneous
from simulation import run_simulation

app = FastAPI(title="Singapore Society Simulation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

POLICY_QUESTIONS: list[PolicyQuestion] = [
    PolicyQuestion(
        id="pwm_expansion",
        title="PWM Expansion to All Private-Sector Firms Including SMEs Under 25 Employees",
        description=(
            "The government proposes extending the Progressive Wage Model (PWM) to cover all private-sector "
            "workers, including those employed by small and medium enterprises (SMEs) with fewer than 25 employees, "
            "who are currently exempt. Covered workers would receive mandatory structured wage increments tied "
            "to skills upgrading and productivity milestones."
        ),
        context=(
            "Singapore's PWM was introduced to uplift lower-wage workers in specific sectors such as cleaning, "
            "security, and food services. As of 2024, smaller firms remain exempt due to concerns about compliance "
            "costs. Proponents argue universal coverage is needed to close the wage gap; critics warn that imposing "
            "the model on micro-enterprises could trigger retrenchments or business closures among already thin-margin SMEs."
        ),
        tags=["wages", "SME", "labour", "inequality", "PWM"],
    ),
    PolicyQuestion(
        id="hdb_mop_extension",
        title="HDB MOP Extension from 5 to 10 Years to Cool the Resale Market",
        description=(
            "The Housing Development Board (HDB) is considering doubling the Minimum Occupation Period (MOP) "
            "for new Build-To-Order (BTO) flats from the current 5 years to 10 years before owners may sell "
            "on the open resale market or purchase private property."
        ),
        context=(
            "Record-breaking HDB resale flat prices — some exceeding S$1 million — have raised affordability "
            "concerns and accusations that subsidised public housing is being used for speculative profit. "
            "A longer MOP would reduce resale supply in the short term but is intended to reinforce the "
            "owner-occupation ethos of public housing. Opponents contend it unfairly restricts the life "
            "choices of flat owners who may need to move for work, family, or health reasons."
        ),
        tags=["housing", "HDB", "MOP", "affordability", "resale"],
    ),
    PolicyQuestion(
        id="foreign_worker_levy",
        title="Foreign Worker Levy Increase of 20% Across All Sectors",
        description=(
            "The Ministry of Manpower proposes raising foreign worker levies by 20% across all sectors — "
            "construction, marine, process, and services — to encourage firms to hire and train local workers "
            "and to invest in automation."
        ),
        context=(
            "Singapore relies heavily on foreign labour, with Work Permit and S-Pass holders making up a "
            "significant share of the workforce in construction, F&B, and manufacturing. Levy hikes are a "
            "key tool for managing foreign worker dependency ratios. Industry groups warn that a 20% increase "
            "would sharply raise project costs and could delay infrastructure and housing development at a time "
            "when Singapore is ramping up BTO supply and major public works."
        ),
        tags=["labour", "immigration", "levy", "construction", "localisation"],
    ),
    PolicyQuestion(
        id="cpf_life_age",
        title="Lowering CPF Life Auto-Participation Age from 55 to 45",
        description=(
            "The government is studying a proposal to lower the age at which CPF members are automatically "
            "enrolled into CPF LIFE — the national longevity insurance scheme — from 55 to 45, locking in "
            "a portion of Ordinary and Special Account savings earlier to fund retirement payouts from age 65."
        ),
        context=(
            "CPF LIFE provides lifelong monthly payouts to help Singaporeans fund retirement. Currently, "
            "members with sufficient balances are auto-enrolled at 55. Lowering the threshold to 45 would "
            "give the CPF Board a longer investment runway and potentially increase payout amounts. However, "
            "critics argue it reduces liquidity for members who may need CPF funds for housing, children's "
            "education, or healthcare emergencies during their 40s — a financially demanding life stage."
        ),
        tags=["CPF", "retirement", "savings", "social security", "ageing"],
    ),
    PolicyQuestion(
        id="carbon_tax_rebates",
        title="Redirect Carbon Tax Rebates from Universal Vouchers to Targeted Lower-Income Household Subsidies",
        description=(
            "The government proposes discontinuing the universal GST Voucher — U-Save rebate scheme funded "
            "by carbon tax revenues and instead channelling those funds exclusively to the bottom 20% of "
            "households via means-tested utility and transport subsidies."
        ),
        context=(
            "Singapore's carbon tax, set at S$25 per tonne of CO₂ in 2024 and rising to S$50–80 by 2030, "
            "generates significant revenue. Currently, U-Save rebates are distributed broadly to all HDB "
            "households to offset higher energy bills. Reforming the distribution to target only the lowest-income "
            "households would improve progressivity but would remove a tangible benefit from the majority of "
            "middle-income Singaporeans, potentially undermining public support for carbon pricing altogether."
        ),
        tags=["carbon tax", "climate", "inequality", "subsidies", "energy"],
    ),
]

_question_map: dict[str, PolicyQuestion] = {q.id: q for q in POLICY_QUESTIONS}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/personas")
async def get_personas():
    return ALL_PERSONAS


@app.get("/questions")
async def get_questions():
    return POLICY_QUESTIONS


@app.post("/simulate", response_model=SimulationResult)
async def simulate(request: SimulationRequest):
    question = _question_map.get(request.question_id)
    if not question:
        raise HTTPException(status_code=404, detail=f"Question '{request.question_id}' not found.")

    if request.mode == "diverse":
        personas = sample_diverse(10)
    elif request.mode == "homogeneous":
        personas = sample_homogeneous(10)
    else:
        raise HTTPException(status_code=400, detail="mode must be 'diverse' or 'homogeneous'.")

    if request.num_rounds < 1:
        raise HTTPException(status_code=400, detail="num_rounds must be at least 1.")

    result = await run_simulation(request, personas, question)
    return result
