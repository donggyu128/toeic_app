import { useEffect, useRef } from 'react';

export default function TestPage({ state, onSubmit, onNext, onGoHome }) {
  const { testWords, currentIndex, choices, answered, isWrongTest } = state;
  const currentWord = testWords[currentIndex];
  const total = testWords.length;
  const progressPct = ((currentIndex + 1) / total) * 100; // 수정: +1 해서 100%까지
  const confirmRef = useRef(null);

  // 정답: 자동 이동 / 오답: 확인 버튼 포커스
  useEffect(() => {
    if (answered?.correct) {
      const t = setTimeout(() => onNext(), 800);
      return () => clearTimeout(t);
    }
    if (answered && !answered.correct) {
      const t = setTimeout(() => confirmRef.current?.focus(), 50);
      return () => clearTimeout(t); // 클린업 추가
    }
  }, [answered]);

  if (!currentWord) return null;

  // 나가기 전 확인창
  const handleGoHome = () => {
    if (window.confirm('테스트를 종료하시겠어요?\n지금까지 푼 내용은 저장됩니다.')) {
      onGoHome();
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '2rem 1.5rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={handleGoHome}
          style={{ background: 'none', border: 'none', color: 'var(--c-muted)', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}
        >
          ← 나가기
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--c-muted)' }}>
              {isWrongTest ? '📕 오답노트 재시험' : '테스트'}
            </span>
            <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--c-muted)' }}>
              {currentIndex + 1} / {total}
            </span>
          </div>
          <div style={{ height: '3px', background: 'var(--c-border)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--c-accent)', borderRadius: '99px', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      </div>

      {/* Word card */}
      <div
        key={currentIndex}
        className="anim-fade-up"
        style={{
          background: 'var(--c-surface)',
          border: '1px solid var(--c-border)',
          borderRadius: '20px',
          padding: '3rem 2rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          flex: 'none',
        }}
      >
        <div style={{ fontSize: '0.72rem', color: 'var(--c-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          영어 → 한국어
        </div>
        <div className="font-display" style={{ fontSize: '3rem', letterSpacing: '0.04em', lineHeight: 1 }}>
          {currentWord.english}
        </div>
      </div>

      {/* 보기 4개 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
        {choices.map((choice, i) => {
          let bg = 'var(--c-surface)';
          let border = 'var(--c-border)';
          let color = 'var(--c-text)';
          let animClass = '';

          if (answered) {
            if (choice.id === currentWord.id) {
              // 정답 항목 → 초록
              bg = 'rgba(34,197,94,0.12)';
              border = '#22c55e';
              color = '#4ade80';
              if (answered.correct && answered.selected.id === choice.id) animClass = 'anim-correct';
            } else if (answered.selected.id === choice.id && !answered.correct) {
              // 내가 고른 오답 → 빨강
              bg = 'rgba(239,68,68,0.12)';
              border = '#ef4444';
              color = '#f87171';
              animClass = 'anim-wrong';
            } else {
              // 나머지 → 흐리게
              color = 'var(--c-muted)';
            }
          }

          return (
            <button
              key={choice.id}
              className={animClass}
              disabled={!!answered}
              onClick={() => onSubmit(choice)}
              style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                textAlign: 'left',
                cursor: answered ? 'default' : 'pointer',
                color,
                fontSize: '0.9rem',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
              onMouseEnter={e => { if (!answered) e.currentTarget.style.borderColor = 'var(--c-accent)'; }}
              onMouseLeave={e => { if (!answered) e.currentTarget.style.borderColor = 'var(--c-border)'; }}
            >
              <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--c-muted)', minWidth: '1.2rem' }}>
                {['A', 'B', 'C', 'D'][i]}
              </span>
              {choice.korean}
            </button>
          );
        })}
      </div>

      {/* 오답 피드백 */}
      {answered && !answered.correct && (
        <div className="anim-fade-up" style={{ marginTop: '1.25rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#f87171' }}>
              정답: <strong style={{ color: '#4ade80' }}>{currentWord.korean}</strong> — 충분히 확인 후 다음으로 넘어가세요
            </span>
          </div>
          <button
            ref={confirmRef}
            onClick={onNext}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: 'var(--c-surface2)',
              border: '1px solid var(--c-border)',
              borderRadius: '12px',
              color: 'var(--c-text)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--c-accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--c-border)'}
          >
            확인 → 다음 문제
          </button>
        </div>
      )}
    </div>
  );
}