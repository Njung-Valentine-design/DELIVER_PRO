export default function MetricBar({ label, value }) {
  const color = value >= 70 ? '#4ade80' : value >= 45 ? '#fbbf24' : '#f87171';
  return <div className="metric"><div className="metricTop"><span>{label}</span><b>{value}</b></div><div className="bar"><div style={{ width: `${value}%`, background: color }} /></div></div>;
}
