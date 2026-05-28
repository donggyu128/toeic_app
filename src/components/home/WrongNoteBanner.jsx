import { Button } from '../ui.jsx';

export function WrongNoteBanner({ count, onClick }) {
  const hasWords = count > 0;
  return (
    <Button
      onClick={onClick}
      className="ui-interactive"
      style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        width: '100%', padding: '1rem 1.25rem', marginBottom: '2rem',
        background: hasWords ? 'rgba(250,109,109,0.08)' : 'var(--c-surface)',
        border: `1px solid ${hasWords ? 'rgba(250,109,109,0.3)' : 'var(--c-border)'}`,
        borderRadius: '12px', cursor: 'pointer', color: 'var(--c-text)', textAlign: 'left',
      }}
    >
      <span style={{ fontSize: '1.5rem' }}>📕</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>오답노트</div>
        <div style={{ color: 'var(--c-muted)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
          {hasWords ? `${count}개 단어 학습 대기` : '오답 단어가 없습니다'}
        </div>
      </div>
      {hasWords && (
        <span style={{ background: 'var(--c-accent2)', color: '#fff', borderRadius: '20px', padding: '2px 10px', fontSize: '0.78rem', fontWeight: 600 }}>
          {count}
        </span>
      )}
    </Button>
  );
}
