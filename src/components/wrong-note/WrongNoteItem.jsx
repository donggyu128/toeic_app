import { Button, Card } from '../ui.jsx';

export function WrongNoteItem({ item, onDelete }) {
  const { word, wrongCount, consecutiveCorrect } = item;
  const isHSK = word.id >= 1001;

  const handleDelete = () => {
    const name = isHSK ? word.chinese : word.english;
    if (window.confirm(`"${name}"을 오답노트에서 삭제할까요?`)) {
      onDelete(word.id);
    }
  };

  return (
    <Card
      className="anim-slide-in"
      style={{
        display: 'flex', alignItems: 'stretch', gap: 0,
        padding: 0, borderRadius: '12px', overflow: 'hidden',
      }}
    >
      {/* 왼쪽 컬러 사이드바 */}
      <div style={{
        width: '4px', flexShrink: 0,
        background: isHSK ? '#fa6d6d' : 'var(--c-accent)',
      }} />

      {/* 언어 뱃지 */}
      <div style={{
        width: '36px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isHSK ? 'rgba(250,109,109,0.08)' : 'rgba(124,109,250,0.08)',
      }}>
        <span style={{
          fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.04em',
          color: isHSK ? '#fa6d6d' : 'var(--c-accent)',
          writingMode: 'vertical-rl',
        }}>
          {isHSK ? 'HSK' : 'ENG'}
        </span>
      </div>

      {/* 단어 정보 */}
      <div style={{ flex: 1, minWidth: 0, padding: '0.75rem 0.85rem' }}>
        {isHSK ? (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--c-text)' }}>
                {word.chinese}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--c-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                {word.pinyin}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--c-muted)', marginTop: '0.15rem' }}>
              {word.korean}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--c-text)' }}>
              {word.english}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--c-muted)', marginTop: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {word.korean}
            </div>
          </>
        )}
      </div>

      {/* 오른쪽 메타 */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: '0.4rem',
        padding: '0.6rem 0.75rem',
        borderLeft: '1px solid var(--c-border)',
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: '0.68rem', color: '#f87171',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '6px', padding: '2px 6px',
        }}>
          ✗ {wrongCount}
        </span>

        <div
          role="img"
          aria-label={`연속 정답 ${consecutiveCorrect}회 / 3회`}
          style={{ display: 'flex', gap: '3px' }}
        >
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: 7, height: 7, borderRadius: '50%',
                background: i < consecutiveCorrect ? '#4ade80' : 'var(--c-border)',
              }}
            />
          ))}
        </div>

        <Button
          onClick={handleDelete}
          aria-label="삭제"
          style={{
            background: 'none', border: 'none', color: 'var(--c-muted)',
            cursor: 'pointer', fontSize: '1rem', padding: '0',
            lineHeight: 1, transition: 'color 0.15s', borderRadius: 0,
          }}
        >
          ×
        </Button>
      </div>
    </Card>
  );
}
