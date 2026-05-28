import { Button, Card } from '../ui.jsx';

export function WrongNoteItem({ item, onDelete }) {
  const { word, wrongCount, consecutiveCorrect } = item;

  const handleDelete = () => {
    if (window.confirm(`"${word.english}"을 오답노트에서 삭제할까요?`)) {
      onDelete(word.id);
    }
  };

  return (
    <Card
      className="anim-slide-in"
      style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1rem', borderRadius: '10px' }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{word.english}</div>
        <div style={{ color: 'var(--c-muted)', fontSize: '0.8rem', marginTop: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {word.korean}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: '0.72rem', color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', padding: '2px 7px' }}>
          ✗ {wrongCount}
        </span>

        {/* 연속 정답 도트 — 이미지 역할, 스크린리더에 상태 전달 */}
        <div
          role="img"
          aria-label={`연속 정답 ${consecutiveCorrect}회 / 3회`}
          style={{ display: 'flex', gap: '3px' }}
        >
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{ width: 8, height: 8, borderRadius: '50%', background: i < consecutiveCorrect ? '#4ade80' : 'var(--c-border)' }}
            />
          ))}
        </div>

        <Button
          onClick={handleDelete}
          aria-label={`${word.english} 삭제`}
          className="ui-interactive"
          style={{ background: 'none', border: 'none', color: 'var(--c-muted)', cursor: 'pointer', fontSize: '1rem', padding: '0 0.2rem', lineHeight: 1, transition: 'color 0.15s', borderRadius: 0 }}
        >
          ×
        </Button>
      </div>
    </Card>
  );
}
