export function HomeHero() {
  return (
    <header style={{ marginBottom: '2.5rem' }}>
      <div className="font-display" style={{ fontSize: '4rem', lineHeight: 1, letterSpacing: '0.04em', color: 'var(--c-text)' }}>
        TOEIC<br />
        <span style={{ color: 'var(--c-accent)' }}>WORDS</span>
      </div>
      <p style={{ marginTop: '0.75rem', color: 'var(--c-muted)', fontSize: '0.875rem' }}>
        테스트 기반 영단어 암기 시스템
      </p>
    </header>
  );
}
