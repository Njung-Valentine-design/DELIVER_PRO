import { useEffect, useMemo, useState } from 'react';
import { INITIAL_STATE, CAREER_LEVELS } from './data/gameData';
import { applyDecision, generateScenario, getCareer } from './engine/simulationEngine';
import { saveGame, loadGame, submitLeaderboard } from './services/supabaseClient';
import MetricBar from './components/MetricBar';
import Tabs from './components/Tabs';
import GamePanel from './components/GamePanel';
import './styles/app.css';

const USER_ID = 'local-player';

function unlockedTabs(state) {
  const base = ['situation'];
  CAREER_LEVELS.filter(c => c.level <= state.level).forEach(c => c.unlocks.forEach(u => base.push(u)));
  return [...new Set(base)];
}

export default function App() {
  const [state, setState] = useState(INITIAL_STATE);
  const [tab, setTab] = useState('situation');
  const [screen, setScreen] = useState('menu');
  const [notice, setNotice] = useState('');
  const career = getCareer(state);
  const scenario = useMemo(() => generateScenario(state), [state.level, state.turn, state.difficulty]);
  const unlocked = unlockedTabs(state);

  useEffect(() => { loadGame(USER_ID).then(saved => saved && setState(saved)).catch(() => {}); }, []);
  useEffect(() => { if (!unlocked.includes(tab)) setTab('situation'); }, [state.level]);

  async function persist(next) {
    setState(next);
    await saveGame(USER_ID, next);
    await submitLeaderboard(USER_ID, next).catch(() => {});
  }

  async function handleDecision(option) {
    const next = applyDecision(state, option);
    await persist(next);
    if (next.failed) setNotice('Project failure. Delivery health and stakeholder trust collapsed.');
    else if (next.won) setNotice('You reached Chief Delivery Officer status.');
    else if (next.promoted) setNotice(`Promotion earned: ${getCareer(next).title}`);
    else setNotice(next.lastCoach);
  }

  function reset() {
    localStorage.removeItem('deliver_save');
    setState(INITIAL_STATE);
    setNotice('New career started.');
    setScreen('game');
  }

  if (screen === 'menu') return <main className="shell menu"><div className="hero"><img src="/assets/deliver-logo.png" alt="DELIVER. Enterprise Simulation logo" className="brandLogo"/><p className="eyebrow">Enterprise Career Simulation</p><h1>DELIVER<span>.</span></h1><p>Rise from project coordinator to Chief Delivery Officer through pressure, politics, delivery risk, money, burnout, and reputation.</p><button onClick={() => setScreen('game')}>Resume Career</button><button className="secondary" onClick={reset}>Start New Career</button></div></main>;

  return <main className="shell">
    <header className="topbar"><div className="topBrand"><img src="/assets/deliver-logo.png" alt="DELIVER. logo" className="topLogo"/><div><h1>DELIVER<span>.</span></h1><p>{career.title} · {career.company} · {career.industry}</p></div></div><button onClick={() => setScreen('menu')}>Menu</button></header>
    <section className="status"><div><b>Level {state.level}</b><span>Turn {state.turn}</span></div><div className="xp"><span>XP</span><div><i style={{width: `${state.xp}%`}} /></div><b>{state.xp}%</b></div></section>
    {notice && <div className="notice" onClick={() => setNotice('')}>{notice}</div>}
    <section className="dashboard">
      <MetricBar label="Delivery Health" value={state.metrics.deliveryHealth}/>
      <MetricBar label="Stakeholder Trust" value={state.metrics.stakeholderTrust}/>
      <MetricBar label="Budget Health" value={state.metrics.budgetHealth}/>
      <MetricBar label="Burnout" value={state.metrics.burnout}/>
    </section>
    <Tabs active={tab} setActive={setTab} unlocked={unlocked}/>
    <GamePanel tab={tab} state={state} scenario={scenario} onDecision={handleDecision}/>
    <section className="card coach"><h2>AI Coach / Decision Memory</h2><p>{state.lastCoach || 'Make a decision to receive coaching.'}</p>{state.memory.slice(0,3).map((m, i) => <div className="memory" key={i}><b>Turn {m.turn}</b><p>{m.consequence}</p></div>)}</section>
  </main>;
}
