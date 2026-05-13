import { CAREER_LEVELS, SCENARIO_SEEDS } from '../data/gameData';

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export function getCareer(state) {
  return CAREER_LEVELS.find(item => item.level === state.level) || CAREER_LEVELS[0];
}

export function generateScenario(state) {
  const career = getCareer(state);
  const seed = SCENARIO_SEEDS[(state.turn + state.level) % SCENARIO_SEEDS.length];
  const pressure = state.difficulty + Math.floor(state.level / 2);
  return {
    title: `Level ${state.level}: ${career.title}`,
    context: `${career.company} | ${career.industry} | ${career.title}`,
    situation: seed,
    politicalContext: `The sponsor is watching delivery credibility. Your team is sensitive to workload, and Finance is monitoring variance. Pressure index: ${pressure}.`,
    options: [
      { id: 'A', label: 'Escalate transparently with impact, options, and recommended recovery path.', style: 'balanced' },
      { id: 'B', label: 'Protect the team first and renegotiate scope before committing externally.', style: 'people' },
      { id: 'C', label: 'Commit to the date and absorb the pressure internally.', style: 'heroic' },
      { id: 'D', label: 'Freeze changes, enforce governance, and reset stakeholder expectations.', style: 'governance' }
    ]
  };
}

const IMPACTS = {
  balanced: { deliveryHealth: 5, stakeholderTrust: 6, budgetHealth: 2, teamMorale: 1, riskControl: 6, burnout: -1, xp: 16 },
  people: { deliveryHealth: 1, stakeholderTrust: 2, budgetHealth: -1, teamMorale: 7, riskControl: 2, burnout: -4, xp: 13 },
  heroic: { deliveryHealth: 4, stakeholderTrust: -5, budgetHealth: -4, teamMorale: -7, riskControl: -6, burnout: 8, xp: 8 },
  governance: { deliveryHealth: 2, stakeholderTrust: 1, budgetHealth: 5, teamMorale: -2, riskControl: 7, burnout: 1, xp: 14 }
};

export function applyDecision(state, option) {
  const impact = IMPACTS[option.style] || IMPACTS.balanced;
  const difficultyPenalty = Math.floor(state.difficulty / 2);
  const metrics = { ...state.metrics };
  Object.entries(impact).forEach(([key, value]) => {
    if (key === 'xp') return;
    metrics[key] = clamp((metrics[key] ?? 50) + value - (value > 0 ? difficultyPenalty : 0));
  });

  const competencies = { ...state.competencies };
  if (option.style === 'balanced') {
    competencies.communication = clamp(competencies.communication + 3);
    competencies.stakeholderManagement = clamp(competencies.stakeholderManagement + 3);
    competencies.riskManagement = clamp(competencies.riskManagement + 2);
  }
  if (option.style === 'people') competencies.leadership = clamp(competencies.leadership + 4);
  if (option.style === 'governance') competencies.riskManagement = clamp(competencies.riskManagement + 4);
  if (option.style === 'heroic') competencies.deliveryExcellence = clamp(competencies.deliveryExcellence + 1);

  let xp = state.xp + impact.xp + Math.max(0, Math.floor((metrics.reputation - 40) / 10));
  let level = state.level;
  let salary = state.salary;
  let bonus = state.bonus;
  let promoted = false;

  if (xp >= 100 && level < 10) {
    level += 1;
    xp = xp - 100;
    const nextCareer = CAREER_LEVELS.find(c => c.level === level);
    salary = nextCareer.salary;
    bonus += 2500 * level;
    metrics.reputation = clamp(metrics.reputation + 7);
    promoted = true;
  }

  const failed = metrics.deliveryHealth < 25 && metrics.stakeholderTrust < 25;
  const won = level === 10 && xp >= 85;
  const adaptiveDifficulty = clamp(state.difficulty + (metrics.deliveryHealth > 75 && metrics.stakeholderTrust > 70 ? 1 : 0) - (metrics.burnout > 75 ? 1 : 0), 1, 10);

  const memoryEntry = {
    turn: state.turn,
    level: state.level,
    decision: option.label,
    consequence: explainConsequence(option.style, promoted),
    impact
  };

  return {
    ...state,
    turn: state.turn + 1,
    level,
    xp,
    salary,
    bonus,
    metrics,
    competencies,
    difficulty: adaptiveDifficulty,
    memory: [memoryEntry, ...state.memory].slice(0, 20),
    lastCoach: coach(option.style, metrics, promoted),
    promoted,
    failed,
    won
  };
}

function explainConsequence(style, promoted) {
  const lines = {
    balanced: 'You preserved trust by giving executives choices instead of vague optimism.',
    people: 'You protected capacity, but some executives may read it as slower delivery.',
    heroic: 'You created short-term movement but increased hidden organizational debt.',
    governance: 'You strengthened control, but the team feels the process weight.'
  };
  return `${lines[style]}${promoted ? ' The promotion board noticed consistent executive judgement.' : ''}`;
}

function coach(style, metrics, promoted) {
  const base = {
    balanced: 'Strong executive pattern: clarify impact, give options, recommend a path, and preserve accountability.',
    people: 'Good human leadership, but remember that senior project leadership must convert empathy into delivery structure.',
    heroic: 'Classic trap: absorbing pressure feels responsible, but it hides risk and punishes the team later.',
    governance: 'Good control move. The risk is over-processing when speed and trust are already fragile.'
  };
  const warning = metrics.burnout > 65 ? ' Burnout is becoming a strategic risk, not a personal issue.' : '';
  const promo = promoted ? ' Promotion earned because your pattern showed repeatable judgement.' : '';
  return `${base[style]}${warning}${promo}`;
}

export function computeEvm(state) {
  const spi = (state.metrics.deliveryHealth / 75).toFixed(2);
  const cpi = (state.metrics.budgetHealth / 75).toFixed(2);
  const bac = 1000000 + state.level * 250000;
  const ev = Math.round(bac * (state.turn / (state.turn + 6)) * (state.metrics.deliveryHealth / 100));
  const ac = Math.round(ev / Math.max(cpi, 0.2));
  return { spi, cpi, bac, ev, ac };
}
