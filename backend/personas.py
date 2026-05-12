# personas.py — Hardcoded synthetic Singapore personas and sampling utilities

import random
from models import Persona

ALL_PERSONAS: list[Persona] = [
    # --- Chinese (9) ---
    Persona(
        id=1,
        name="Lim Ah Kow",
        age=58,
        ethnicity="Chinese",
        occupation="Hawker owner",
        education="Secondary school",
        planning_area="Toa Payoh",
        income_level="median",
        gender="Male",
        values=["hard work and self-reliance", "family legacy", "community bonds"],
        concerns=["rising hawker centre rental costs", "finding a successor for my stall", "escalating ingredient prices"],
    ),
    Persona(
        id=2,
        name="Chen Mei Ling",
        age=34,
        ethnicity="Chinese",
        occupation="Software engineer",
        education="University degree",
        planning_area="Queenstown",
        income_level="above_median",
        gender="Female",
        values=["meritocracy", "work-life balance", "digital innovation"],
        concerns=["sky-high private housing prices", "career plateau in a saturated tech market", "childcare availability near my home"],
    ),
    Persona(
        id=3,
        name="Tan Boon Huat",
        age=67,
        ethnicity="Chinese",
        occupation="Retiree (former civil servant)",
        education="Diploma",
        planning_area="Bishan",
        income_level="median",
        gender="Male",
        values=["national stability", "respect for institutions", "prudent savings"],
        concerns=["adequacy of CPF payouts in retirement", "healthcare costs as I age", "whether my children will care for me"],
    ),
    Persona(
        id=4,
        name="Wong Jia Yi",
        age=23,
        ethnicity="Chinese",
        occupation="University student",
        education="Undergraduate (in progress)",
        planning_area="Clementi",
        income_level="low",
        gender="Female",
        values=["social mobility", "environmental sustainability", "gender equality"],
        concerns=["graduate employment prospects", "student loan and cost of living", "mental health pressures from academic competition"],
    ),
    Persona(
        id=5,
        name="Ong Wei Jian",
        age=45,
        ethnicity="Chinese",
        occupation="Financial analyst",
        education="University degree",
        planning_area="Bukit Timah",
        income_level="high",
        gender="Male",
        values=["economic freedom", "meritocracy", "wealth building for the next generation"],
        concerns=["regulatory overreach stifling investment", "property cooling measures affecting my portfolio", "talent brain drain to overseas markets"],
    ),
    Persona(
        id=6,
        name="Chua Siew Lian",
        age=52,
        ethnicity="Chinese",
        occupation="Secondary school teacher",
        education="University degree",
        planning_area="Tampines",
        income_level="median",
        gender="Female",
        values=["education as an equaliser", "discipline and character building", "intergenerational fairness"],
        concerns=["widening achievement gap between rich and poor students", "teacher workload and administrative burden", "children's screen time and mental resilience"],
    ),
    Persona(
        id=7,
        name="Goh Cheng Hock",
        age=39,
        ethnicity="Chinese",
        occupation="Accountant",
        education="University degree",
        planning_area="Ang Mo Kio",
        income_level="above_median",
        gender="Male",
        values=["fiscal responsibility", "rule of law", "family financial security"],
        concerns=["GST impact on household expenses", "HDB resale prices outpacing wage growth", "adequacy of savings for my children's university fees"],
    ),
    Persona(
        id=8,
        name="Ng Pei Shan",
        age=29,
        ethnicity="Chinese",
        occupation="Property agent",
        education="Diploma",
        planning_area="Pasir Ris",
        income_level="above_median",
        gender="Female",
        values=["entrepreneurial hustle", "homeownership as security", "client relationships"],
        concerns=["policy uncertainty disrupting the property market", "commission income volatility", "qualifying for my own BTO while income fluctuates"],
    ),
    Persona(
        id=9,
        name="Lee Kok Weng",
        age=61,
        ethnicity="Chinese",
        occupation="Poly lecturer",
        education="Postgraduate degree",
        planning_area="Hougang",
        income_level="above_median",
        gender="Male",
        values=["applied education over paper qualifications", "mentoring younger Singaporeans", "intellectual honesty"],
        concerns=["polytechnic graduates being undervalued by employers", "keeping curriculum relevant amid rapid tech change", "my own retirement adequacy after a mid-career switch"],
    ),

    # --- Malay (5) ---
    Persona(
        id=10,
        name="Siti Rahimah",
        age=41,
        ethnicity="Malay",
        occupation="Nurse",
        education="Diploma",
        planning_area="Woodlands",
        income_level="median",
        gender="Female",
        values=["community care and solidarity", "religious faith", "healthcare as a right"],
        concerns=["nurse-to-patient ratios that threaten patient safety", "shift work affecting family time", "rising household costs on a single income"],
    ),
    Persona(
        id=11,
        name="Ahmad Fadzillah",
        age=35,
        ethnicity="Malay",
        occupation="Logistics supervisor",
        education="Diploma",
        planning_area="Jurong West",
        income_level="median",
        gender="Male",
        values=["job security for locals", "religious community belonging", "fairness in workplace promotion"],
        concerns=["foreign PMET competition for supervisory roles", "cost of raising three children in Singapore", "halal food access near my workplace"],
    ),
    Persona(
        id=12,
        name="Norzahra Binte Yusof",
        age=27,
        ethnicity="Malay",
        occupation="Social worker",
        education="University degree",
        planning_area="Geylang",
        income_level="low",
        gender="Female",
        values=["social justice", "inclusion of marginalised communities", "dignity of every person"],
        concerns=["chronic underfunding of social services", "rental flat waiting times for low-income families", "stigma around receiving government assistance"],
    ),
    Persona(
        id=13,
        name="Mohd Faizal",
        age=48,
        ethnicity="Malay",
        occupation="Taxi driver",
        education="Secondary school",
        planning_area="Yishun",
        income_level="low",
        gender="Male",
        values=["honest day's work", "family honour", "religious duty"],
        concerns=["ride-hailing apps eroding taxi income", "vehicle rental costs eating into earnings", "whether my children can afford housing"],
    ),
    Persona(
        id=14,
        name="Haslinda Binte Ramli",
        age=55,
        ethnicity="Malay",
        occupation="Seamstress",
        education="Secondary school",
        planning_area="Kallang",
        income_level="low",
        gender="Female",
        values=["craftsmanship and cultural heritage", "family cohesion", "honest livelihood"],
        concerns=["declining demand for traditional tailoring", "inability to retire without adequate CPF", "medical bills for ageing parents"],
    ),

    # --- Indian (4) ---
    Persona(
        id=15,
        name="Dr. Rajan Pillai",
        age=50,
        ethnicity="Indian",
        occupation="Cardiologist",
        education="Postgraduate degree",
        planning_area="Buona Vista",
        income_level="high",
        gender="Male",
        values=["clinical excellence", "evidence-based policy", "meritocracy"],
        concerns=["public healthcare system capacity under strain", "medical brain drain to private sector", "equity of access to specialist care for lower-income patients"],
    ),
    Persona(
        id=16,
        name="Priya Nair",
        age=31,
        ethnicity="Indian",
        occupation="HR manager",
        education="University degree",
        planning_area="Sengkang",
        income_level="above_median",
        gender="Female",
        values=["workplace diversity and inclusion", "professional development", "work-life integration"],
        concerns=["unconscious bias in hiring practices", "fair parental leave policies being adopted", "dual-income couple qualifying for BTO together"],
    ),
    Persona(
        id=17,
        name="Suresh Krishnaswamy",
        age=44,
        ethnicity="Indian",
        occupation="Primary school teacher",
        education="University degree",
        planning_area="Marine Parade",
        income_level="median",
        gender="Male",
        values=["equal opportunity in education", "cultural pluralism", "civic responsibility"],
        concerns=["class sizes limiting individual attention for struggling students", "parental pressure affecting children's wellbeing", "keeping up with rising tuition culture"],
    ),
    Persona(
        id=18,
        name="Kavitha Devi",
        age=38,
        ethnicity="Indian",
        occupation="NGO volunteer",
        education="University degree",
        planning_area="Punggol",
        income_level="low",
        gender="Female",
        values=["volunteerism and service", "women's empowerment", "environmental stewardship"],
        concerns=["lack of sustainable funding for grassroots organisations", "women re-entering workforce after caregiving gaps", "children growing up without green spaces nearby"],
    ),

    # --- Others (2) ---
    Persona(
        id=19,
        name="David Tan Shao Wei",
        age=36,
        ethnicity="Others",
        occupation="Construction worker",
        education="Secondary school",
        planning_area="Choa Chu Kang",
        income_level="low",
        gender="Male",
        values=["physical safety on the job", "honest fair wages", "sending remittances home"],
        concerns=["workplace injury compensation adequacy", "dormitory living conditions", "foreign worker levy eating into take-home pay"],
    ),
    Persona(
        id=20,
        name="Aisha Fernandez",
        age=26,
        ethnicity="Others",
        occupation="Food delivery rider",
        education="ITE certificate",
        planning_area="Bedok",
        income_level="low",
        gender="Female",
        values=["flexible work autonomy", "gig economy rights", "affordable daily living"],
        concerns=["platform algorithm changes cutting my income unpredictably", "no CPF contributions or employment benefits as a gig worker", "traffic safety and insurance gaps on the road"],
    ),
]


def sample_diverse(n: int = 10) -> list[Persona]:
    """Sample n personas maximising spread across ethnicity, age group, income level, and gender."""
    buckets: dict[str, list[Persona]] = {}
    for p in ALL_PERSONAS:
        age_group = "young" if p.age < 35 else ("mid" if p.age < 50 else "senior")
        key = f"{p.ethnicity}|{age_group}|{p.income_level}|{p.gender}"
        buckets.setdefault(key, []).append(p)

    selected: list[Persona] = []
    seen_ids: set[int] = set()

    bucket_keys = list(buckets.keys())
    random.shuffle(bucket_keys)

    for key in bucket_keys:
        candidates = [p for p in buckets[key] if p.id not in seen_ids]
        if candidates and len(selected) < n:
            chosen = random.choice(candidates)
            selected.append(chosen)
            seen_ids.add(chosen.id)

    # fill up to n if buckets were exhausted
    remaining = [p for p in ALL_PERSONAS if p.id not in seen_ids]
    random.shuffle(remaining)
    for p in remaining:
        if len(selected) >= n:
            break
        selected.append(p)
        seen_ids.add(p.id)

    return selected[:n]


def sample_homogeneous(n: int = 10) -> list[Persona]:
    """Return n Chinese median-income personas; samples with replacement when pool < n."""
    pool = [p for p in ALL_PERSONAS if p.ethnicity == "Chinese" and p.income_level == "median"]
    if not pool:
        pool = [p for p in ALL_PERSONAS if p.ethnicity == "Chinese"]
    if len(pool) >= n:
        return random.sample(pool, n)
    # Fewer unique personas than needed — sample with replacement so we always return exactly n
    return random.choices(pool, k=n)
