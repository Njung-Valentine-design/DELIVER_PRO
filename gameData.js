export const CAREER_LEVELS = [
  { level: 1, title: 'Associate Project Coordinator', industry: 'Hospitality', company: 'Meridian Hotel Group', salary: 38000, unlocks: ['situation', 'inbox', 'people'] },
  { level: 2, title: 'Project Coordinator', industry: 'Hospitality', company: 'Meridian Hotel Group', salary: 48000, unlocks: ['raid'] },
  { level: 3, title: 'Junior Project Manager', industry: 'Retail & E-Commerce', company: 'Vantage Retail Corp', salary: 65000, unlocks: ['evm'] },
  { level: 4, title: 'Project Manager', industry: 'Retail & E-Commerce', company: 'Vantage Retail Corp', salary: 82000, unlocks: ['criticalPath'] },
  { level: 5, title: 'Senior Project Manager', industry: 'Banking & Finance', company: 'Crestline Bank', salary: 105000, unlocks: ['career'] },
  { level: 6, title: 'Program Manager', industry: 'Healthcare', company: 'NovaCare Health Systems', salary: 132000, unlocks: ['wellness'] },
  { level: 7, title: 'PMO Manager', industry: 'Government', company: 'Dept. Infrastructure & Transport', salary: 160000, unlocks: ['brand'] },
  { level: 8, title: 'Portfolio Manager', industry: 'Energy & Utilities', company: 'Solara Energy Group', salary: 205000, unlocks: ['portfolio'] },
  { level: 9, title: 'Transformation Director', industry: 'Airlines & Aviation', company: 'Apex Airlines', salary: 255000, unlocks: ['sandbox'] },
  { level: 10, title: 'Chief Delivery Officer', industry: 'Manufacturing', company: 'Kronos Industrial Systems', salary: 325000, unlocks: ['enterprise'] }
];

export const FRAMEWORKS = [
  { id: 'scrum', name: 'Scrum', risk: 'Scope pressure during sprint execution', bonus: 'stakeholderTrust' },
  { id: 'kanban', name: 'Kanban', risk: 'Weak urgency without cadence', bonus: 'deliveryHealth' },
  { id: 'lean', name: 'Lean', risk: 'Resistance to waste elimination', bonus: 'budgetHealth' },
  { id: 'safe', name: 'SAFe', risk: 'Governance overhead', bonus: 'strategicAlignment' },
  { id: 'prince2', name: 'PRINCE2', risk: 'Documentation friction', bonus: 'governance' },
  { id: 'pmi', name: 'PMBOK / PMP', risk: 'Heavy planning expectations', bonus: 'riskControl' },
  { id: 'hybrid', name: 'Hybrid Agile', risk: 'Agile versus PMO tension', bonus: 'adaptability' },
  { id: 'xp', name: 'Extreme Programming', risk: 'Engineering discipline pressure', bonus: 'technicalQuality' }
];

export const INITIAL_STATE = {
  level: 1,
  turn: 1,
  xp: 0,
  framework: 'hybrid',
  difficulty: 1,
  metrics: {
    deliveryHealth: 72,
    stakeholderTrust: 68,
    budgetHealth: 70,
    teamMorale: 67,
    reputation: 45,
    burnout: 22,
    strategicAlignment: 55,
    riskControl: 52
  },
  competencies: {
    leadership: 42,
    decisionMaking: 44,
    communication: 40,
    riskManagement: 38,
    stakeholderManagement: 41,
    financialControl: 35,
    politicalIntelligence: 36,
    deliveryExcellence: 45
  },
  memory: [],
  achievements: [],
  salary: 38000,
  bonus: 0,
  cloudStatus: 'local'
};

export const SCENARIO_SEEDS = [
  'A vendor delay threatens the milestone while the sponsor demands certainty.',
  'A senior stakeholder bypasses governance and pressures the team for undocumented scope.',
  'Your best performer is burning out while the deadline remains fixed.',
  'Finance questions the business value after cost variance increases.',
  'Two department heads disagree publicly and the project team is caught between them.',
  'The product owner wants speed, compliance wants evidence, and operations wants stability.'
];
