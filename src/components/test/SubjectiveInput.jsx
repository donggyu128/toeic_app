import { useEffect, useRef } from 'react';
import { Button } from '../ui.jsx';

export function SubjectiveInput({
  word, vocabType, answered, typedAnswer, onType, onSubmit, onNext, confirmRef,
}) {
  const inputRef = useRef(null);
  const isHSK    = vocabType === 'hsk3';

  useEffect(() => {
    if (!answered) inputRef.current?.focus();
  }, [word?.id, answered]);

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      if (!answered) onSubmit();
      else onNext();
    }
  };

  // 정답 표시: HSK는 한국어 뜻, TOEIC은 영단어
  const correctText    = isHSK ? word.korean : word.english;
  const placeholder    = isHSK ? '한국어 뜻을 입력하세요' : '영단어를 입력하세요';
  const exampleHint    = isHSK ? `예: ${word.korean.split(/[,，]/)[0].trim()}` : `예: ${word.english}`;

  const isCorrect = answered?.correct;
  const isWrong   = answered && !answered.correct;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)', marginBottom: '-0.25rem' }}>
        {isHSK ? '한국어 뜻을 입력하세요 (첫 번째 뜻만 입력해도 정답)' : '영단어를 입력하세요'}
      </div>

      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          value={typedAnswer}
          onChange={e => !answered && onType(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          disabled={!!answered}
          style={{
            width: '100%', padding: '1rem 1.25rem',
            borderRadius: '12px', fontSize: '1rem',
            background: isCorrect ? 'rgba(34,197,94,0.08)'
                       : isWrong  ? 'rgba(239,68,68,0.08)'
                       : 'var(--c-surface)',
            border: `1px solid ${
              isCorrect ? '#22c55e' : isWrong ? '#ef4444' : 'var(--c-border)'
            }`,
            color: isCorrect ? '#4ade80' : isWrong ? '#f87171' : 'var(--c-text)',
            outline: 'none', boxSizing: 'border-box',
            transition: 'all 0.2s',
          }}
        />
        {answered && (
          <span style={{
            position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
            fontSize: '1.2rem',
          }}>
            {isCorrect ? '✅' : '❌'}
          </span>
        )}
      </div>

      {isWrong && (
        <div className="anim-fade-up" style={{
          padding: '0.85rem 1.25rem', borderRadius: '12px',
          background: 'rgba(34,197,94,0.08)', border: '1px solid #22c55e',
        }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--c-muted)', marginRight: '0.5rem' }}>정답:</span>
          <span style={{ color: '#4ade80', fontWeight: 600 }}>{correctText}</span>
        </div>
      )}

      {!answered ? (
        <Button
          variant="accent"
          onClick={onSubmit}
          disabled={!typedAnswer.trim()}
          style={{
            padding: '0.9rem', borderRadius: '12px', cursor: typedAnswer.trim() ? 'pointer' : 'not-allowed',
            fontSize: '0.9rem', fontWeight: 500, opacity: typedAnswer.trim() ? 1 : 0.5,
            transition: 'all 0.15s',
          }}
        >
          확인 (Enter)
        </Button>
      ) : (
        <Button
          ref={confirmRef}
          variant="accent"
          onClick={onNext}
          style={{ padding: '0.9rem', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}
        >
          다음 문제 →
        </Button>
      )}
    </div>
  );
}
