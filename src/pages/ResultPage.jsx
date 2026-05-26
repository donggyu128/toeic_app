export default function ResultPage({ state, onGoHome, onGoWrongNote }) {
  const { answers, isWrongTest } = state;
  const total   = answers.length;
  const correct = answers.filter(a => a.correct).length;
  const wrong   = total - correct;
  const pct     = total > 0 ? Math.round((correct / total) * 100) : 0;

  const grade = pct >= 90 ? { label: 'S', color: '#a78bfa' }
              : pct >= 70 ? { label: 'A', color: '#4ade80' }
              : pct >= 50 ? { label: 'B', color: '#facc15' }
              :              { label: 'C', color: '#f87171' };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '3rem 1.5rem', textAlign: 'center' }}>
      <div className="anim-fade-up" style={{ animationDelay: '0s' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          {isWrongTest ? '오답노트 재시험 결과' : '테스트 결과'}
        </div>

        {/* Grade circle */}
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          border: `3px solid ${grade.color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
          background: `${grade.color}15`,
        }}>
          <span className="font-display" style={{ fontSize: '3.5rem', color: grade.color, lineHeight: 1 }}>
            {grade.label}
          </span>
        </div>

        {/* Stats */}
        <div className="font-display" style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: '0.25rem' }}>
          {pct}<span style={{ fontSize: '1.5rem', color: 'var(--c-muted)' }}>%</span>
        </div>
        <div style={{ color: 'var(--c-muted)', fontSize: '0.85rem', marginBottom: '2.5rem' }}>정답률</div>

        {/* Score breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {[
            { label: '총 문제', value: total, color: 'var(--c-text)' },
            { label: '맞음',   value: correct, color: '#4ade80' },
            { label: '틀림',   value: wrong,   color: '#f87171' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '12px', padding: '1rem 0.75rem' }}>
              <div className="font-display" style={{ fontSize: '2rem', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Wrong word list */}
        {wrong > 0 && (
          <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              틀린 단어
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: 200, overflowY: 'auto' }}>
              {answers.filter(a => !a.correct).map(({ word }) => (
                <div key={word.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: 'var(--c-surface)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <span style={{ fontWeight: 500 }}>{word.english}</span>
                  <span style={{ color: 'var(--c-muted)', fontSize: '0.85rem' }}>{word.korean}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {wrong > 0 && (
            <button
              onClick={onGoWrongNote}
              style={{ padding: '0.9rem', background: 'rgba(250,109,109,0.1)', border: '1px solid rgba(250,109,109,0.3)', borderRadius: '12px', color: '#f87171', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}
            >
              오답노트 보기
            </button>
          )}
          <button
            onClick={onGoHome}
            style={{ padding: '0.9rem', background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '12px', color: 'var(--c-text)', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
