export function WrongWordsList({ wrongWords }) {
  if (wrongWords.length === 0) return null;

  return (
    <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
        틀린 단어
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: 200, overflowY: 'auto' }}>
        {wrongWords.map(word => (
          <div key={word.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: 'var(--c-surface)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
            <span style={{ fontWeight: 500 }}>{word.english}</span>
            <span style={{ color: 'var(--c-muted)', fontSize: '0.85rem' }}>{word.korean}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
