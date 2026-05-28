import { Card } from '../ui.jsx';

export function QuestionCard({ currentIndex, word, vocabType, questionMode }) {
  const isHSK = vocabType === 'hsk3';

  return (
    <Card
      key={currentIndex}
      className="anim-fade-up"
      style={{ borderRadius: '20px', padding: '3rem 2rem', textAlign: 'center', marginBottom: '1.5rem', flex: 'none' }}
    >
      <div style={{ fontSize: '0.72rem', color: 'var(--c-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
        {isHSK ? '중국어 → 한국어' : '영어 → 한국어'}
        {questionMode === 'subjective' && (
          <span style={{ marginLeft: '0.5rem', color: 'var(--c-accent)', fontSize: '0.68rem' }}>✏️ 직접 입력</span>
        )}
      </div>

      {isHSK ? (
        <>
          <div className="font-display" style={{ fontSize: '3.2rem', letterSpacing: '0.06em', lineHeight: 1, marginBottom: '0.6rem' }}>
            {word.chinese}
          </div>
          <div style={{ fontSize: '1rem', color: 'var(--c-muted)', letterSpacing: '0.08em' }}>
            {word.pinyin}
          </div>
        </>
      ) : (
        <div className="font-display" style={{ fontSize: '3rem', letterSpacing: '0.04em', lineHeight: 1 }}>
          {word.english}
        </div>
      )}
    </Card>
  );
}
