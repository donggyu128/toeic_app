import { Button } from '../ui.jsx';

export function TestTopBar({ isWrongTest, currentIndex, total, progressPct, onGoHome, questionMode, vocabType }) {
  const modeLabel = questionMode === 'subjective' ? '✏️ 주관식' : '🔘 객관식';
  const vocabLabel = vocabType === 'hsk3' ? '🇨🇳 HSK3' : '🇺🇸 TOEIC';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
      <Button variant="ghost" onClick={onGoHome} style={{ fontSize: '0.85rem' }}>
        ← 나가기
      </Button>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--c-muted)' }}>
            {isWrongTest ? '📕 오답노트 재시험' : `${vocabLabel} · ${modeLabel}`}
          </span>
          <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--c-muted)' }}>
            {currentIndex + 1} / {total}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`진행률 ${currentIndex + 1} / ${total}`}
          style={{ height: '3px', background: 'var(--c-border)', borderRadius: '99px', overflow: 'hidden' }}
        >
          <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--c-accent)', borderRadius: '99px', transition: 'width 0.3s ease' }} />
        </div>
      </div>
    </div>
  );
}
