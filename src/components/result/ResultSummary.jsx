export function ResultSummary({ isWrongTest, grade, pct }) {
  return (
    <>
      <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
        {isWrongTest ? '오답노트 재시험 결과' : '테스트 결과'}
      </div>
      <div style={{ width: 120, height: 120, borderRadius: '50%', border: `3px solid ${grade.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', background: `${grade.color}18` }}>
        <span className="font-display" style={{ fontSize: '3.5rem', color: grade.color, lineHeight: 1 }}>
          {grade.label}
        </span>
      </div>
      <div className="font-display" style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: '0.25rem' }}>
        {pct}<span style={{ fontSize: '1.5rem', color: 'var(--c-muted)' }}>%</span>
      </div>
      <div style={{ color: 'var(--c-muted)', fontSize: '0.85rem', marginBottom: '2.5rem' }}>정답률</div>
    </>
  );
}
