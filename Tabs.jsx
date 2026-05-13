export default function Tabs({ active, setActive, unlocked }) {
  const tabs = [
    ['situation', 'Situation'], ['inbox', 'Inbox'], ['people', 'People'], ['raid', 'RAID'], ['evm', 'EVM'],
    ['criticalPath', 'Critical Path'], ['career', 'Career $'], ['wellness', 'Wellness'], ['brand', 'Brand'], ['portfolio', 'Portfolio']
  ];
  return <div className="tabs">{tabs.map(([id, label]) => <button key={id} disabled={!unlocked.includes(id)} className={active === id ? 'active' : ''} onClick={() => setActive(id)}>{label}</button>)}</div>;
}
