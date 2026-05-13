import { computeEvm } from '../engine/simulationEngine';
import MetricBar from './MetricBar';

export default function GamePanel({ tab, state, scenario, onDecision }) {
  if (tab === 'situation') return <section className="card"><h2>{scenario.title}</h2><p className="muted">{scenario.context}</p><p>{scenario.situation}</p><div className="politics">{scenario.politicalContext}</div><div className="options">{scenario.options.map(o => <button key={o.id} onClick={() => onDecision(o)}><b>{o.id}</b> {o.label}</button>)}</div></section>;
  if (tab === 'inbox') return <section className="card"><h2>Inbox Signals</h2><p><b>Sponsor:</b> I need confidence before the steering committee.</p><p><b>Finance:</b> Cost variance must be justified with evidence.</p><p><b>Team Lead:</b> The team can push, but not indefinitely.</p></section>;
  if (tab === 'people') return <section className="card"><h2>Stakeholders</h2><MetricBar label="Stakeholder Trust" value={state.metrics.stakeholderTrust}/><MetricBar label="Team Morale" value={state.metrics.teamMorale}/><MetricBar label="Reputation" value={state.metrics.reputation}/></section>;
  if (tab === 'raid') return <section className="card"><h2>RAID Log</h2><ul><li>Risk: sponsor pressure may force poor commitment.</li><li>Assumption: vendor can recover if decision is made this turn.</li><li>Issue: team capacity is below forecast.</li><li>Dependency: Finance approval for contingency budget.</li></ul></section>;
  if (tab === 'evm') { const evm = computeEvm(state); return <section className="card"><h2>Earned Value</h2><div className="grid"><div>SPI<br/><b>{evm.spi}</b></div><div>CPI<br/><b>{evm.cpi}</b></div><div>BAC<br/><b>${evm.bac.toLocaleString()}</b></div><div>AC<br/><b>${evm.ac.toLocaleString()}</b></div></div></section>; }
  if (tab === 'criticalPath') return <section className="card"><h2>Critical Path</h2><p>Discovery → Vendor Recovery → UAT → Launch Readiness → Executive Acceptance</p><p className="warning">Current constraint: Vendor Recovery.</p></section>;
  if (tab === 'career') return <section className="card"><h2>Compensation</h2><p>Salary: <b>${state.salary.toLocaleString()}</b></p><p>Bonus Bank: <b>${state.bonus.toLocaleString()}</b></p></section>;
  if (tab === 'wellness') return <section className="card"><h2>Wellness</h2><MetricBar label="Burnout Risk" value={state.metrics.burnout}/><p>Burnout now affects decision quality and adaptive difficulty.</p></section>;
  if (tab === 'brand') return <section className="card"><h2>Personal Brand</h2><MetricBar label="Executive Reputation" value={state.metrics.reputation}/><p>High reputation unlocks recruiter offers, enterprise sandbox access, and board-level scenarios.</p></section>;
  return <section className="card"><h2>Portfolio View</h2><p>Multiple-program simulation layer. This module is prepared for Phase 4 expansion.</p></section>;
}
