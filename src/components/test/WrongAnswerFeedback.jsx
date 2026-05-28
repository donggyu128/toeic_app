import { Button } from '../ui.jsx';

export function WrongAnswerFeedback({ answered, currentWord, confirmRef, onNext, vocabType }) {
  if (!answered || answered.correct) return null;

  const isHSK = vocabType === 'hsk3';

  return (
    <div className="anim-fade-up" style={{ marginTop: '1.25rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#f87171' }}>
        정답:{' '}
        <strong style={{ color: '#4ade80' }}>{currentWord.korean}</strong>
        {isHSK && (
          <span style={{ color: 'var(--c-muted)', marginLeft: '0.5rem', fontSize: '0.75rem' }}>
            ({currentWord.chinese} · {currentWord.pinyin})
          </span>
        )}
        {' '}&mdash; 충분히 확인 후 다음으로 넘어가세요
      </div>
      <Button
        ref={confirmRef}
        onClick={onNext}
        className="ui-interactive"
        style={{ width: '100%', padding: '0.9rem', background: 'var(--c-surface2)', border: '1px solid var(--c-border)', borderRadius: '12px', color: 'var(--c-text)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.15s' }}
      >
        확인 → 다음 문제
      </Button>
    </div>
  );
}
