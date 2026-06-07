import rawPersonas from '../nemotron_personas.json';

export function formatPersona(raw) {
  return {
    id: raw.uuid,
    name: raw.name,
    sex: raw.sex,
    age: raw.age,
    marital_status: raw.marital_status,
    education_level: raw.education_level,
    occupation: raw.occupation,
    industry: raw.industry,
    planning_area: raw.planning_area,
    persona: raw.persona,
    cultural_background: raw.cultural_background,
  };
}

export const ALL_PERSONAS = rawPersonas.map(formatPersona);

export function getRandomSample(n) {
  if (n >= ALL_PERSONAS.length) return [...ALL_PERSONAS];
  const shuffled = [...ALL_PERSONAS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
