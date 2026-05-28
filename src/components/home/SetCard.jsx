import { Card } from '../ui.jsx';

export function SetCard({ set, pct, onStart }) {
  const isComplete = pct === 100;
  return (
    <Card
      className="anim-fade-up ui-interactive ui-lift"
      style={{ padding: '1.25rem', cursor: 'pointer', transition: 'all 0.2s', animationDelay: `${(set.setNumber - 1) * 0.04}s` }}
      onClick={onStart}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div className="font-display" style={{ fontSize: '1.8rem', color: 'var(--c-accent)', lineHeight: 1 }}>
          {String(set.setNumber).padStart(2, '0')}
        </div>
        {isComplete && (
          <span style={{ fontSize: '0.7rem', background: 'rgba(124,109,250,0.15)', color: 'var(--c-accent)', padding: '2px 8px', borderRadius: '99px', border: '1px solid rgba(124,109,250,0.3)' }}>
            완료
          </span>
        )}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--c-muted)', marginBottom: '0.85rem', fontFamily: 'JetBrains Mono, monospace' }}>
        {set.startId} – {set.endId}
      </div>
      <div style={{ height: '3px', background: 'var(--c-border)', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: isComplete ? 'var(--c-accent)' : 'rgba(124,109,250,0.5)', borderRadius: '99px', transition: 'width 0.4s' }} />
      </div>
      <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'var(--c-muted)', textAlign: 'right' }}>
        {set.words.length}단어
      </div>
    </Card>
  );
}
