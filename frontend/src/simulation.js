// simulation.js — Client-side simulation engine (ported from Python backend)

export const ALL_PERSONAS = [
  // --- Chinese (9) ---
  {
    id: 1,
    name: "Lim Ah Kow",
    age: 58,
    ethnicity: "Chinese",
    occupation: "Hawker owner",
    education: "Secondary school",
    planning_area: "Toa Payoh",
    income_level: "median",
    gender: "Male",
    values: ["hard work and self-reliance", "family legacy", "community bonds"],
    concerns: ["rising hawker centre rental costs", "finding a successor for my stall", "escalating ingredient prices"],
  },
  {
    id: 2,
    name: "Chen Mei Ling",
    age: 34,
    ethnicity: "Chinese",
    occupation: "Software engineer",
    education: "University degree",
    planning_area: "Queenstown",
    income_level: "above_median",
    gender: "Female",
    values: ["meritocracy", "work-life balance", "digital innovation"],
    concerns: ["sky-high private housing prices", "career plateau in a saturated tech market", "childcare availability near my home"],
  },
  {
    id: 3,
    name: "Tan Boon Huat",
    age: 67,
    ethnicity: "Chinese",
    occupation: "Retiree (former civil servant)",
    education: "Diploma",
    planning_area: "Bishan",
    income_level: "median",
    gender: "Male",
    values: ["national stability", "respect for institutions", "prudent savings"],
    concerns: ["adequacy of CPF payouts in retirement", "healthcare costs as I age", "whether my children will care for me"],
  },
  {
    id: 4,
    name: "Wong Jia Yi",
    age: 23,
    ethnicity: "Chinese",
    occupation: "University student",
    education: "Undergraduate (in progress)",
    planning_area: "Clementi",
    income_level: "low",
    gender: "Female",
    values: ["social mobility", "environmental sustainability", "gender equality"],
    concerns: ["graduate employment prospects", "student loan and cost of living", "mental health pressures from academic competition"],
  },
  {
    id: 5,
    name: "Ong Wei Jian",
    age: 45,
    ethnicity: "Chinese",
    occupation: "Financial analyst",
    education: "University degree",
    planning_area: "Bukit Timah",
    income_level: "high",
    gender: "Male",
    values: ["economic freedom", "meritocracy", "wealth building for the next generation"],
    concerns: ["regulatory overreach stifling investment", "property cooling measures affecting my portfolio", "talent brain drain to overseas markets"],
  },
  {
    id: 6,
    name: "Chua Siew Lian",
    age: 52,
    ethnicity: "Chinese",
    occupation: "Secondary school teacher",
    education: "University degree",
    planning_area: "Tampines",
    income_level: "median",
    gender: "Female",
    values: ["education as an equaliser", "discipline and character building", "intergenerational fairness"],
    concerns: ["widening achievement gap between rich and poor students", "teacher workload and administrative burden", "children's screen time and mental resilience"],
  },
  {
    id: 7,
    name: "Goh Cheng Hock",
    age: 39,
    ethnicity: "Chinese",
    occupation: "Accountant",
    education: "University degree",
    planning_area: "Ang Mo Kio",
    income_level: "above_median",
    gender: "Male",
    values: ["fiscal responsibility", "rule of law", "family financial security"],
    concerns: ["GST impact on household expenses", "HDB resale prices outpacing wage growth", "adequacy of savings for my children's university fees"],
  },
  {
    id: 8,
    name: "Ng Pei Shan",
    age: 29,
    ethnicity: "Chinese",
    occupation: "Property agent",
    education: "Diploma",
    planning_area: "Pasir Ris",
    income_level: "above_median",
    gender: "Female",
    values: ["entrepreneurial hustle", "homeownership as security", "client relationships"],
    concerns: ["policy uncertainty disrupting the property market", "commission income volatility", "qualifying for my own BTO while income fluctuates"],
  },
  {
    id: 9,
    name: "Lee Kok Weng",
    age: 61,
    ethnicity: "Chinese",
    occupation: "Poly lecturer",
    education: "Postgraduate degree",
    planning_area: "Hougang",
    income_level: "above_median",
    gender: "Male",
    values: ["applied education over paper qualifications", "mentoring younger Singaporeans", "intellectual honesty"],
    concerns: ["polytechnic graduates being undervalued by employers", "keeping curriculum relevant amid rapid tech change", "my own retirement adequacy after a mid-career switch"],
  },

  // --- Malay (5) ---
  {
    id: 10,
    name: "Siti Rahimah",
    age: 41,
    ethnicity: "Malay",
    occupation: "Nurse",
    education: "Diploma",
    planning_area: "Woodlands",
    income_level: "median",
    gender: "Female",
    values: ["community care and solidarity", "religious faith", "healthcare as a right"],
    concerns: ["nurse-to-patient ratios that threaten patient safety", "shift work affecting family time", "rising household costs on a single income"],
  },
  {
    id: 11,
    name: "Ahmad Fadzillah",
    age: 35,
    ethnicity: "Malay",
    occupation: "Logistics supervisor",
    education: "Diploma",
    planning_area: "Jurong West",
    income_level: "median",
    gender: "Male",
    values: ["job security for locals", "religious community belonging", "fairness in workplace promotion"],
    concerns: ["foreign PMET competition for supervisory roles", "cost of raising three children in Singapore", "halal food access near my workplace"],
  },
  {
    id: 12,
    name: "Norzahra Binte Yusof",
    age: 27,
    ethnicity: "Malay",
    occupation: "Social worker",
    education: "University degree",
    planning_area: "Geylang",
    income_level: "low",
    gender: "Female",
    values: ["social justice", "inclusion of marginalised communities", "dignity of every person"],
    concerns: ["chronic underfunding of social services", "rental flat waiting times for low-income families", "stigma around receiving government assistance"],
  },
  {
    id: 13,
    name: "Mohd Faizal",
    age: 48,
    ethnicity: "Malay",
    occupation: "Taxi driver",
    education: "Secondary school",
    planning_area: "Yishun",
    income_level: "low",
    gender: "Male",
    values: ["honest day's work", "family honour", "religious duty"],
    concerns: ["ride-hailing apps eroding taxi income", "vehicle rental costs eating into earnings", "whether my children can afford housing"],
  },
  {
    id: 14,
    name: "Haslinda Binte Ramli",
    age: 55,
    ethnicity: "Malay",
    occupation: "Seamstress",
    education: "Secondary school",
    planning_area: "Kallang",
    income_level: "low",
    gender: "Female",
    values: ["craftsmanship and cultural heritage", "family cohesion", "honest livelihood"],
    concerns: ["declining demand for traditional tailoring", "inability to retire without adequate CPF", "medical bills for ageing parents"],
  },

  // --- Indian (4) ---
  {
    id: 15,
    name: "Dr. Rajan Pillai",
    age: 50,
    ethnicity: "Indian",
    occupation: "Cardiologist",
    education: "Postgraduate degree",
    planning_area: "Buona Vista",
    income_level: "high",
    gender: "Male",
    values: ["clinical excellence", "evidence-based policy", "meritocracy"],
    concerns: ["public healthcare system capacity under strain", "medical brain drain to private sector", "equity of access to specialist care for lower-income patients"],
  },
  {
    id: 16,
    name: "Priya Nair",
    age: 31,
    ethnicity: "Indian",
    occupation: "HR manager",
    education: "University degree",
    planning_area: "Sengkang",
    income_level: "above_median",
    gender: "Female",
    values: ["workplace diversity and inclusion", "professional development", "work-life integration"],
    concerns: ["unconscious bias in hiring practices", "fair parental leave policies being adopted", "dual-income couple qualifying for BTO together"],
  },
  {
    id: 17,
    name: "Suresh Krishnaswamy",
    age: 44,
    ethnicity: "Indian",
    occupation: "Primary school teacher",
    education: "University degree",
    planning_area: "Marine Parade",
    income_level: "median",
    gender: "Male",
    values: ["equal opportunity in education", "cultural pluralism", "civic responsibility"],
    concerns: ["class sizes limiting individual attention for struggling students", "parental pressure affecting children's wellbeing", "keeping up with rising tuition culture"],
  },
  {
    id: 18,
    name: "Kavitha Devi",
    age: 38,
    ethnicity: "Indian",
    occupation: "NGO volunteer",
    education: "University degree",
    planning_area: "Punggol",
    income_level: "low",
    gender: "Female",
    values: ["volunteerism and service", "women's empowerment", "environmental stewardship"],
    concerns: ["lack of sustainable funding for grassroots organisations", "women re-entering workforce after caregiving gaps", "children growing up without green spaces nearby"],
  },

  // --- Others (2) ---
  {
    id: 19,
    name: "David Tan Shao Wei",
    age: 36,
    ethnicity: "Others",
    occupation: "Construction worker",
    education: "Secondary school",
    planning_area: "Choa Chu Kang",
    income_level: "low",
    gender: "Male",
    values: ["physical safety on the job", "honest fair wages", "sending remittances home"],
    concerns: ["workplace injury compensation adequacy", "dormitory living conditions", "foreign worker levy eating into take-home pay"],
  },
  {
    id: 20,
    name: "Aisha Fernandez",
    age: 26,
    ethnicity: "Others",
    occupation: "Food delivery rider",
    education: "ITE certificate",
    planning_area: "Bedok",
    income_level: "low",
    gender: "Female",
    values: ["flexible work autonomy", "gig economy rights", "affordable daily living"],
    concerns: ["platform algorithm changes cutting my income unpredictably", "no CPF contributions or employment benefits as a gig worker", "traffic safety and insurance gaps on the road"],
  },
];

export const POLICY_QUESTIONS = [
  {
    id: "pwm_expansion",
    title: "PWM Expansion to All Private-Sector Firms Including SMEs Under 25 Employees",
    description:
      "The government proposes extending the Progressive Wage Model (PWM) to cover all private-sector " +
      "workers, including those employed by small and medium enterprises (SMEs) with fewer than 25 employees, " +
      "who are currently exempt. Covered workers would receive mandatory structured wage increments tied " +
      "to skills upgrading and productivity milestones.",
    context:
      "Singapore's PWM was introduced to uplift lower-wage workers in specific sectors such as cleaning, " +
      "security, and food services. As of 2024, smaller firms remain exempt due to concerns about compliance " +
      "costs. Proponents argue universal coverage is needed to close the wage gap; critics warn that imposing " +
      "the model on micro-enterprises could trigger retrenchments or business closures among already thin-margin SMEs.",
    tags: ["wages", "SME", "labour", "inequality", "PWM"],
  },
  {
    id: "hdb_mop_extension",
    title: "HDB MOP Extension from 5 to 10 Years to Cool the Resale Market",
    description:
      "The Housing Development Board (HDB) is considering doubling the Minimum Occupation Period (MOP) " +
      "for new Build-To-Order (BTO) flats from the current 5 years to 10 years before owners may sell " +
      "on the open resale market or purchase private property.",
    context:
      "Record-breaking HDB resale flat prices — some exceeding S$1 million — have raised affordability " +
      "concerns and accusations that subsidised public housing is being used for speculative profit. " +
      "A longer MOP would reduce resale supply in the short term but is intended to reinforce the " +
      "owner-occupation ethos of public housing. Opponents contend it unfairly restricts the life " +
      "choices of flat owners who may need to move for work, family, or health reasons.",
    tags: ["housing", "HDB", "MOP", "affordability", "resale"],
  },
  {
    id: "foreign_worker_levy",
    title: "Foreign Worker Levy Increase of 20% Across All Sectors",
    description:
      "The Ministry of Manpower proposes raising foreign worker levies by 20% across all sectors — " +
      "construction, marine, process, and services — to encourage firms to hire and train local workers " +
      "and to invest in automation.",
    context:
      "Singapore relies heavily on foreign labour, with Work Permit and S-Pass holders making up a " +
      "significant share of the workforce in construction, F&B, and manufacturing. Levy hikes are a " +
      "key tool for managing foreign worker dependency ratios. Industry groups warn that a 20% increase " +
      "would sharply raise project costs and could delay infrastructure and housing development at a time " +
      "when Singapore is ramping up BTO supply and major public works.",
    tags: ["labour", "immigration", "levy", "construction", "localisation"],
  },
  {
    id: "cpf_life_age",
    title: "Lowering CPF Life Auto-Participation Age from 55 to 45",
    description:
      "The government is studying a proposal to lower the age at which CPF members are automatically " +
      "enrolled into CPF LIFE — the national longevity insurance scheme — from 55 to 45, locking in " +
      "a portion of Ordinary and Special Account savings earlier to fund retirement payouts from age 65.",
    context:
      "CPF LIFE provides lifelong monthly payouts to help Singaporeans fund retirement. Currently, " +
      "members with sufficient balances are auto-enrolled at 55. Lowering the threshold to 45 would " +
      "give the CPF Board a longer investment runway and potentially increase payout amounts. However, " +
      "critics argue it reduces liquidity for members who may need CPF funds for housing, children's " +
      "education, or healthcare emergencies during their 40s — a financially demanding life stage.",
    tags: ["CPF", "retirement", "savings", "social security", "ageing"],
  },
  {
    id: "carbon_tax_rebates",
    title: "Redirect Carbon Tax Rebates from Universal Vouchers to Targeted Lower-Income Household Subsidies",
    description:
      "The government proposes discontinuing the universal GST Voucher — U-Save rebate scheme funded " +
      "by carbon tax revenues and instead channelling those funds exclusively to the bottom 20% of " +
      "households via means-tested utility and transport subsidies.",
    context:
      "Singapore's carbon tax, set at S$25 per tonne of CO₂ in 2024 and rising to S$50–80 by 2030, " +
      "generates significant revenue. Currently, U-Save rebates are distributed broadly to all HDB " +
      "households to offset higher energy bills. Reforming the distribution to target only the lowest-income " +
      "households would improve progressivity but would remove a tangible benefit from the majority of " +
      "middle-income Singaporeans, potentially undermining public support for carbon pricing altogether.",
    tags: ["carbon tax", "climate", "inequality", "subsidies", "energy"],
  },
];

export function sampleDiverse(n = 10) {
  const buckets = {};
  for (const p of ALL_PERSONAS) {
    const ageGroup = p.age < 35 ? "young" : p.age < 50 ? "mid" : "senior";
    const key = `${p.ethnicity}|${ageGroup}|${p.income_level}|${p.gender}`;
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(p);
  }

  const selected = [];
  const seenIds = new Set();
  const bucketKeys = Object.keys(buckets).sort(() => Math.random() - 0.5);

  for (const key of bucketKeys) {
    const candidates = buckets[key].filter(p => !seenIds.has(p.id));
    if (candidates.length > 0 && selected.length < n) {
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      selected.push(chosen);
      seenIds.add(chosen.id);
    }
  }

  const remaining = ALL_PERSONAS.filter(p => !seenIds.has(p.id)).sort(() => Math.random() - 0.5);
  for (const p of remaining) {
    if (selected.length >= n) break;
    selected.push(p);
    seenIds.add(p.id);
  }

  return selected.slice(0, n);
}

export function sampleHomogeneous(n = 10) {
  let pool = ALL_PERSONAS.filter(p => p.ethnicity === "Chinese" && p.income_level === "median");
  if (pool.length === 0) pool = ALL_PERSONAS.filter(p => p.ethnicity === "Chinese");
  if (pool.length >= n) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  }
  // sample with replacement when pool < n
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return result;
}

export function buildMessages(persona, question, priorRoundSummary, roundNumber) {
  const system =
    `You are ${persona.name}, a ${persona.age}-year-old ${persona.ethnicity} ${persona.gender.toLowerCase()} ` +
    `living in ${persona.planning_area}, Singapore. ` +
    `Your occupation is ${persona.occupation}. ` +
    `Your highest education level is ${persona.education}. ` +
    `Your household income level is ${persona.income_level.replace(/_/g, " ")}. ` +
    `Your core values are: ${persona.values.join(", ")}. ` +
    `Your primary concerns are: ${persona.concerns.join(", ")}. ` +
    "\n\n" +
    "You are a real Singapore citizen, not a chatbot or an AI. " +
    "Reason and respond ONLY as this specific person based on your lived experience, " +
    "background, and the values and concerns listed above. " +
    "Never break character. Never give generic or balanced policy-analyst answers. " +
    "Your opinion is personal, rooted in your daily life, and may be imperfect or biased — that is authentic. " +
    "\n\n" +
    "You must respond only in valid JSON with exactly these fields: " +
    "position (one of: Support, Oppose, Neutral), " +
    "confidence (integer 0-100), " +
    "reasoning (2-3 sentences in your own voice as this person), " +
    "key_concern (one specific concern driving your view). " +
    "No preamble, no markdown, only the JSON object.";

  const userParts = [];

  if (priorRoundSummary && roundNumber > 0) {
    userParts.push(
      `After hearing from others in the group, here is what people thought overall: ` +
      `${priorRoundSummary} ` +
      "You may update your view or hold it — but you must reason from your own lived experience."
    );
  }

  userParts.push(
    `Policy question: ${question.title}\n\n` +
    `Description: ${question.description}\n\n` +
    `Context: ${question.context}`
  );

  return [
    { role: "system", content: system },
    { role: "user", content: userParts.join("\n\n") },
  ];
}

export async function callLLM(messages, apiKey) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://arshinsikka.github.io/singapore-sim",
    },
    body: JSON.stringify({
      model: "anthropic/claude-sonnet-4-5",
      messages,
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  let content = data.choices[0].message.content.trim();

  // Stage 1: direct parse
  try {
    return JSON.parse(content);
  } catch (_) {}

  // Stage 2: strip markdown code fences
  const cleaned = content.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (_) {}

  // Stage 3: extract first JSON object using regex with dotall
  const match = content.match(/\{[\s\S]*?\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch (_) {}
  }

  throw new Error("Could not parse JSON from model response");
}

export async function getAgentResponse(persona, question, priorRoundSummary, roundNumber, apiKey) {
  const messages = buildMessages(persona, question, priorRoundSummary, roundNumber);
  const fallback = {
    persona_id: persona.id,
    persona_name: persona.name,
    position: "Neutral",
    confidence: 50,
    reasoning: "Unable to parse response",
    key_concern: "Unknown",
    round_number: roundNumber,
  };

  let data;
  try {
    data = await callLLM(messages, apiKey);
  } catch (_) {
    try {
      data = await callLLM(messages, apiKey);
    } catch (_) {
      return fallback;
    }
  }

  try {
    let position = data.position || "Neutral";
    if (!["Support", "Oppose", "Neutral"].includes(position)) position = "Neutral";
    let confidence = parseInt(data.confidence ?? 50, 10);
    if (isNaN(confidence)) confidence = 50;
    confidence = Math.max(0, Math.min(100, confidence));
    return {
      persona_id: persona.id,
      persona_name: persona.name,
      position,
      confidence,
      reasoning: String(data.reasoning || ""),
      key_concern: String(data.key_concern || ""),
      round_number: roundNumber,
    };
  } catch (_) {
    return fallback;
  }
}

export function computeAggregate(responses) {
  const total = responses.length;
  if (total === 0) {
    return { support_pct: 0, oppose_pct: 0, neutral_pct: 0, avg_confidence: 0, position_counts: {} };
  }
  const counts = { Support: 0, Oppose: 0, Neutral: 0 };
  let confidenceSum = 0;
  for (const r of responses) {
    counts[r.position] = (counts[r.position] || 0) + 1;
    confidenceSum += r.confidence;
  }
  return {
    support_pct: Math.round((counts.Support / total) * 1000) / 10,
    oppose_pct: Math.round((counts.Oppose / total) * 1000) / 10,
    neutral_pct: Math.round((counts.Neutral / total) * 1000) / 10,
    avg_confidence: Math.round((confidenceSum / total) * 10) / 10,
    position_counts: counts,
  };
}

export function computeDemographicBreakdown(responses, personas) {
  const personaMap = {};
  for (const p of personas) personaMap[p.id] = p;

  const breakdown = { ethnicity: {}, income_level: {} };

  for (const r of responses) {
    const p = personaMap[r.persona_id];
    if (!p) continue;
    for (const [dim, key] of [["ethnicity", p.ethnicity], ["income_level", p.income_level]]) {
      if (!breakdown[dim][key]) {
        breakdown[dim][key] = { Support: 0, Oppose: 0, Neutral: 0, total: 0 };
      }
      breakdown[dim][key][r.position] += 1;
      breakdown[dim][key].total += 1;
    }
  }

  return breakdown;
}

export function summariseRound(responses) {
  const agg = computeAggregate(responses);
  const counts = agg.position_counts;
  const total = responses.length;
  const supportN = counts.Support || 0;
  const opposeN = counts.Oppose || 0;
  const neutralN = counts.Neutral || 0;

  const supportConcerns = responses.filter(r => r.position === "Support").map(r => r.key_concern);
  const opposeConcerns = responses.filter(r => r.position === "Oppose").map(r => r.key_concern);

  return (
    `${supportN} out of ${total} people supported this policy` +
    (supportConcerns.length > 0 ? `, mainly citing: ${supportConcerns[0]}` : "") +
    `. ${opposeN} opposed it` +
    (opposeConcerns.length > 0 ? `, mostly concerned about: ${opposeConcerns[0]}` : "") +
    `. ${neutralN} remained undecided.`
  );
}

export async function runSimulation(questionId, mode, numRounds, apiKey) {
  const personas = mode === "homogeneous" ? sampleHomogeneous(10) : sampleDiverse(10);
  const question = POLICY_QUESTIONS.find(q => q.id === questionId);
  if (!question) throw new Error(`Question '${questionId}' not found.`);

  const allResponses = [];
  let priorSummary = null;

  for (let roundNum = 0; roundNum < numRounds; roundNum++) {
    const roundResponses = await Promise.all(
      personas.map(p => getAgentResponse(p, question, priorSummary, roundNum, apiKey))
    );
    allResponses.push(...roundResponses);
    priorSummary = summariseRound(roundResponses);
  }

  const latestRound = allResponses.length > 0 ? Math.max(...allResponses.map(r => r.round_number)) : 0;
  const latestResponses = allResponses.filter(r => r.round_number === latestRound);

  return {
    question,
    agent_responses: allResponses,
    aggregate: computeAggregate(latestResponses),
    demographic_breakdown: computeDemographicBreakdown(latestResponses, personas),
    rounds_completed: numRounds,
    personas,
  };
}
