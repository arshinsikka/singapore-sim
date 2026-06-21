// simulation.js — Client-side simulation engine

import { ALL_PERSONAS } from './utils/personas';
export { ALL_PERSONAS };

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
  {
    id: "mental_health_days",
    title: "Mandatory 2 Paid Mental Health Days Per Year for All Full-Time Employees",
    description:
      "The Ministry of Manpower proposes requiring all employers to grant full-time employees two additional " +
      "paid leave days per year designated specifically for mental health, to be taken at the employee's " +
      "discretion without requiring a medical certificate.",
    context:
      "Singapore's workforce consistently ranks among the most overworked in Asia, with surveys reporting " +
      "high rates of burnout and presenteeism. Mandated mental health leave is already law in several OECD " +
      "countries. Critics argue the policy adds compliance costs for SMEs and that existing sick-leave entitlements " +
      "are sufficient; supporters contend the stigma around taking sick leave for psychological reasons makes " +
      "a dedicated category necessary.",
    tags: ["mental health", "workplace", "labour", "wellbeing", "MOM"],
  },
  {
    id: "sugar_tax",
    title: "30% Sugar Tax on All Beverages Exceeding 5g of Sugar per 100ml",
    description:
      "The Health Promotion Board proposes a 30% excise tax on all pre-packaged and fountain beverages " +
      "that contain more than 5 grams of sugar per 100ml, covering soft drinks, sweetened teas, juices, " +
      "and bubble tea, sold through retail and food-service outlets.",
    context:
      "Singapore has one of the highest diabetes rates in the developed world, with the government's " +
      "'War on Diabetes' already driving Healthier Choice labelling and advertising restrictions on " +
      "high-sugar drinks. A sugar tax modelled on the UK's Soft Drinks Industry Levy has been debated " +
      "since 2019. F&B operators and lower-income households warn it disproportionately burdens those " +
      "who rely on affordable sugary drinks as a daily staple, while public health economists argue " +
      "price signals are among the most effective tools for changing consumption behaviour.",
    tags: ["health", "diabetes", "tax", "F&B", "nutrition"],
  },
  {
    id: "ns_pr_optional",
    title: "Making National Service Optional for Singapore PRs Resident for More Than 10 Years",
    description:
      "The Ministry of Defence is consulting on a proposal to allow male Permanent Residents who have " +
      "lived continuously in Singapore for more than 10 years to opt out of full-time National Service, " +
      "instead fulfilling a shorter 6-month vocational training programme.",
    context:
      "Current law requires male PRs to serve NS on the same basis as citizens. The policy has long " +
      "been a source of tension: some long-term PR families feel it is equitable given their commitment " +
      "to Singapore, while many citizens argue NS is a national burden that PRs currently avoid by " +
      "naturalising late or leaving before enlistment age. Any relaxation risks being perceived as " +
      "undermining the social compact underpinning NS, but proponents say it could attract and retain " +
      "high-value long-term residents.",
    tags: ["NS", "defence", "PR", "immigration", "social compact"],
  },
  {
    id: "medisave_mental_health",
    title: "Expanding Medisave Withdrawal Limits for Outpatient Mental Health Treatment",
    description:
      "The Ministry of Health proposes raising the annual Medisave withdrawal cap for outpatient " +
      "psychiatric and psychological treatment from the current S$500 to S$2,000, covering consultations, " +
      "psychotherapy sessions, and approved digital mental health programmes at both public and private clinics.",
    context:
      "Out-of-pocket costs are the most commonly cited barrier to seeking mental health care in Singapore. " +
      "A single private psychotherapy session can cost S$150–300, making sustained treatment unaffordable " +
      "for many. Medisave currently covers inpatient psychiatric care but imposes tight limits on outpatient " +
      "use. Expanding access could reduce emergency admissions and workplace absenteeism, though critics " +
      "note that drawing down retirement savings for recurring outpatient costs could leave individuals " +
      "with insufficient funds at retirement.",
    tags: ["mental health", "Medisave", "CPF", "healthcare", "affordability"],
  },
  {
    id: "wealth_tax",
    title: "1% Annual Wealth Tax on Net Assets Above SGD 10 Million",
    description:
      "The Ministry of Finance is studying a proposal to levy a 1% annual tax on the net wealth " +
      "of Singapore tax residents whose worldwide assets — including property, equities, business " +
      "interests, and cash — exceed SGD 10 million, with primary residence excluded up to SGD 5 million.",
    context:
      "Singapore's status as a wealth hub has seen family offices grow from under 100 in 2017 to over " +
      "1,400 by 2024, drawing scrutiny over wealth concentration and tax fairness. Proponents argue a " +
      "modest wealth tax would raise revenue for social spending without significantly deterring investment, " +
      "citing examples in Norway and Spain. Opponents warn that ultra-high-net-worth individuals are highly " +
      "mobile and could relocate to competing jurisdictions such as Dubai or Hong Kong, eroding Singapore's " +
      "competitive position as a financial centre.",
    tags: ["wealth tax", "inequality", "finance", "fiscal policy", "UHNWIs"],
  },
];

export function buildMessages(persona, question, threadContext, roundNumber) {
  const personaIntro =
    `You are ${persona.name}, a ${persona.age}-year-old ${(persona.sex || '').toLowerCase()} ` +
    `living in ${persona.planning_area}, Singapore. ` +
    `Your marital status is ${persona.marital_status}. ` +
    `Your highest education level is ${persona.education_level}. ` +
    `Your occupation is ${persona.occupation}, working in the ${persona.industry} industry. ` +
    "\n\n" +
    `About you: ${persona.persona}\n\n` +
    `Your cultural background: ${persona.cultural_background}\n\n` +
    "You are a real Singapore citizen, not a chatbot or an AI. " +
    "Reason and respond ONLY as this specific person based on your lived experience, " +
    "background, and the persona and cultural background described above. " +
    "Never break character. Never give generic or balanced policy-analyst answers. " +
    "Your opinion is personal, rooted in your daily life, and may be imperfect or biased — that is authentic.";

  if (roundNumber === 0) {
    const system =
      personaIntro +
      "\n\n" +
      "You must respond only in valid JSON with exactly these fields: " +
      "position (one of: Support, Oppose, Neutral), " +
      "confidence (integer 0-100), " +
      "reasoning (2-3 sentences in your own voice as this person), " +
      "key_concern (one specific concern driving your view). " +
      "No preamble, no markdown, only the JSON object.";

    const user =
      `Policy question: ${question.title}\n\n` +
      `Description: ${question.description}\n\n` +
      `Context: ${question.context}`;

    return [
      { role: "system", content: system },
      { role: "user", content: user },
    ];
  }

  // Round N > 0: threaded reply mode
  const system =
    personaIntro +
    "\n\n" +
    `You are in round ${roundNumber} of a threaded policy discussion. ` +
    "You will read what others said in the previous round and reply to the ONE post that provokes " +
    "your strongest reaction — either because you strongly agree and want to build on it, or strongly " +
    "disagree and want to rebut it." +
    "\n\n" +
    "You must respond only in valid JSON with exactly these fields: " +
    "position (one of: Support, Oppose, Neutral), " +
    "confidence (integer 0-100), " +
    "reasoning (2-3 sentences in your own voice as this person, responding directly to the post you chose), " +
    "key_concern (one specific concern driving your view), " +
    "replying_to_post_number (integer — the number of the post you are replying to), " +
    "stance_towards_parent (one of: agrees, disagrees). " +
    "No preamble, no markdown, only the JSON object.";

  const postList = (threadContext || [])
    .map((post, idx) =>
      `Post ${idx + 1} — ${post.persona_name} (${post.position}):\n${post.reasoning}`
    )
    .join("\n\n");

  const user =
    `Policy question: ${question.title}\n\n` +
    `Description: ${question.description}\n\n` +
    `Context: ${question.context}\n\n` +
    `=== POSTS FROM THE PREVIOUS ROUND ===\n\n` +
    postList +
    "\n\n" +
    "Pick exactly one post by its number to reply to. " +
    "State the number you are replying to, whether you agree or disagree with it, " +
    "then give your own position and reasoning, responding directly to that specific post's argument.";

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

async function fetchLLMRaw(messages, apiKey, model, maxTokens) {
  const body = {
    model,
    messages,
    max_completion_tokens: maxTokens,
    ...(model !== 'gpt-5-mini' && { temperature: 0.7 }),
  };
  const response = await fetch("https://singapore-sim-proxy.sikka-arshin.workers.dev", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  console.log('Status:', response.status);
  const rawText = await response.text();
  console.log('Raw response:', rawText);

  if (!response.ok) {
    if (model === "gpt-5-mini" && (response.status === 400 || response.status === 401)) {
      console.error("OpenAI API error response:", rawText);
      throw new Error("Model not available with this API key");
    }
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const parsed = JSON.parse(rawText);
  const content = parsed.choices[0].message.content
    || parsed.choices[0].message.reasoning_content
    || '';
  if (!content || content.trim() === '') {
    throw new Error('Empty response content from model');
  }
  return content;
}

export async function callLLM(messages, apiKey, model = "gpt-4o-mini") {
  const content = await fetchLLMRaw(messages, apiKey, model, model === 'gpt-5-mini' ? 2000 : 300);
  try { return JSON.parse(content); } catch (_) {}
  const cleaned = content.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();
  try { return JSON.parse(cleaned); } catch (_) {}
  const match = content.match(/\{[\s\S]*?\}/);
  if (match) { try { return JSON.parse(match[0]); } catch (_) {} }
  throw new Error("Could not parse JSON from model response");
}

export async function getAgentResponse(persona, question, threadContext, roundNumber, apiKey, model = "gpt-4o-mini") {
  const postId = `${persona.id}-r${roundNumber}`;
  const messages = buildMessages(persona, question, threadContext, roundNumber);

  const fallback = {
    id: postId,
    persona_id: persona.id,
    persona_name: persona.name,
    position: "Neutral",
    attitude: "Neutral",
    confidence: 50,
    reasoning: "Unable to parse response",
    key_concern: "Unknown",
    round_number: roundNumber,
    parent_id: null,
    stance_towards_parent: null,
  };

  let data;
  try {
    data = await callLLM(messages, apiKey, model);
  } catch (_) {
    try {
      data = await callLLM(messages, apiKey, model);
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

    let parent_id = null;
    let stance_towards_parent = null;

    if (roundNumber > 0 && Array.isArray(threadContext) && threadContext.length > 0) {
      const replyNum = parseInt(data.replying_to_post_number, 10);
      const stance = data.stance_towards_parent;

      if (!isNaN(replyNum) && replyNum >= 1 && replyNum <= threadContext.length) {
        parent_id = threadContext[replyNum - 1].id;
      } else {
        console.warn(
          `[simulation] Agent ${persona.name} returned invalid replying_to_post_number: ${data.replying_to_post_number}. Defaulting parent_id to null.`
        );
      }

      if (stance === "agrees" || stance === "disagrees") {
        stance_towards_parent = stance;
      } else {
        console.warn(
          `[simulation] Agent ${persona.name} returned invalid stance_towards_parent: ${data.stance_towards_parent}. Defaulting to null.`
        );
      }
    }

    return {
      id: postId,
      persona_id: persona.id,
      persona_name: persona.name,
      position,
      attitude: position,
      confidence,
      reasoning: String(data.reasoning || ""),
      key_concern: String(data.key_concern || ""),
      round_number: roundNumber,
      parent_id,
      stance_towards_parent,
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
  const breakdown = { sex: {}, education_level: {}, ethnic_group: {} };
  for (const r of responses) {
    const p = personaMap[r.persona_id];
    if (!p) continue;
    for (const [dim, key] of [["sex", p.sex], ["education_level", p.education_level], ["ethnic_group", p.ethnic_group || 'Others']]) {
      if (!breakdown[dim][key]) {
        breakdown[dim][key] = { Support: 0, Oppose: 0, Neutral: 0, total: 0 };
      }
      breakdown[dim][key][r.position] += 1;
      breakdown[dim][key].total += 1;
    }
  }
  return breakdown;
}

export function computeAgreementCounts(responses, roundNumber) {
  const roundPosts = responses.filter(r => r.round_number === roundNumber);
  const counts = {};
  for (const post of roundPosts) {
    counts[post.id] = roundPosts.filter(
      other => other.id !== post.id && other.position === post.position
    ).length;
  }
  return counts;
}

export function buildThreadTree(allResponses) {
  const byId = {};
  for (const r of allResponses) byId[r.id] = { ...r, replies: [] };

  const roots = [];
  for (const r of allResponses) {
    const node = byId[r.id];
    if (r.parent_id === null || r.parent_id === undefined) {
      roots.push(node);
    } else if (byId[r.parent_id]) {
      byId[r.parent_id].replies.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export async function runSimulation(questionId, selectedPersonas, numRounds, apiKey, model = "gpt-4o-mini") {
  const question = POLICY_QUESTIONS.find(q => q.id === questionId);
  if (!question) throw new Error(`Question '${questionId}' not found.`);

  const allResponses = [];

  for (let roundNum = 0; roundNum < numRounds; roundNum++) {
    const threadContext = roundNum === 0
      ? null
      : allResponses.filter(r => r.round_number === roundNum - 1);

    const roundResponses = await Promise.all(
      selectedPersonas.map(p =>
        getAgentResponse(p, question, threadContext, roundNum, apiKey, model)
      )
    );

    allResponses.push(...roundResponses);
  }

  const latestRound = allResponses.length > 0 ? Math.max(...allResponses.map(r => r.round_number)) : 0;
  const latestResponses = allResponses.filter(r => r.round_number === latestRound);

  return {
    question,
    agent_responses: allResponses,
    aggregate: computeAggregate(latestResponses),
    demographic_breakdown: computeDemographicBreakdown(latestResponses, selectedPersonas),
    rounds_completed: numRounds,
    personas: selectedPersonas,
  };
}
