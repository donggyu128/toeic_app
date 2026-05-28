import { Card } from '../ui.jsx';

const STATS = [
  { key: 'total',   label: '총 문제', color: 'var(--c-text)' },
  { key: 'correct', label: '맞음',    color: '#4ade80'       },
  { key: 'wrong',   label: '틀림',    color: '#f87171'       },
];

export function ResultStatsGrid({ total, correct, wrong }) {
  const values = { total, correct, wrong };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '2.5rem' }}>
      {STATS.map(({ key, label, color }) => (
        <Card key={key} style={{ padding: '1rem 0.75rem' }}>
          <div className="font-display" style={{ fontSize: '2rem', color }}>{values[key]}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)', marginTop: '0.2rem' }}>{label}</div>
        </Card>
      ))}
    </div>
  );
}
