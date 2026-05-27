export default function WrongNotePage({ wrongNote, onStartWrongTest, onDelete, onGoHome }) {
  const sorted = [...wrongNote].sort((a, b) => b.wrongCount - a.wrongCount);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={onGoHome}
          style={{ background: 'none', border: 'none', color: 'var(--c-muted)', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}
        >
          ← 홈
        </button>
        <div className="font-display" style={{ fontSize: '1.8rem', letterSpacing: '0.04em' }}>
          오답노트
        </div>
        <span style={{ marginLeft: 'auto', background: 'rgba(250,109,109,0.12)', color: '#f87171', borderRadius: '99px', padding: '2px 10px', fontSize: '0.8rem', border: '1px solid rgba(250,109,109,0.25)' }}>
          {wrongNote.length}개
        </span>
      </div>

      {wrongNote.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--c-muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎉</div>
          <div>오답 단어가 없습니다!</div>
        </div>
      ) : (
        <>
          {/* 재시험 버튼 */}
          <button
            onClick={onStartWrongTest}
            style={{
              width: '100%',
              padding: '1rem',
              marginBottom: '1.5rem',
              background: 'rgba(124,109,250,0.1)',
              border: '1px solid rgba(124,109,250,0.3)',
              borderRadius: '12px',
              color: 'var(--c-accent)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,109,250,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,109,250,0.1)'}
          >
            📝 오답 재시험 시작 ({wrongNote.length}단어)
          </button>

          {/* 안내 */}
          <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)', marginBottom: '1rem', padding: '0.6rem 0.85rem', background: 'var(--c-surface)', borderRadius: '8px', border: '1px solid var(--c-border)' }}>
            💡 재시험에서 연속 3회 정답 시 자동 삭제됩니다. 오답 발생 시 카운트 초기화.
          </div>

          {/* 단어 목록 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sorted.map(item => (
              <WrongNoteCard key={item.word.id} item={item} onDelete={onDelete} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function WrongNoteCard({ item, onDelete }) {
  const { word, wrongCount, consecutiveCorrect } = item;

  const handleDelete = () => {
    if (window.confirm(`"${word.english}"을 오답노트에서 삭제할까요?`)) {
      onDelete(word.id);
    }
  };

  return (
    <div
      className="anim-slide-in"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.85rem 1rem',
        background: 'var(--c-surface)',
        border: '1px solid var(--c-border)',
        borderRadius: '10px',
      }}
    >
      {/* 단어 정보 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{word.english}</div>
        <div style={{ color: 'var(--c-muted)', fontSize: '0.8rem', marginTop: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {word.korean}
        </div>
      </div>

      {/* 통계 + 삭제 */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: '0.72rem', color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', padding: '2px 7px' }}>
          ✗ {wrongCount}
        </span>
        {/* 연속 정답 도트 */}
        <div style={{ display: 'flex', gap: '3px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < consecutiveCorrect ? '#4ade80' : 'var(--c-border)' }} />
          ))}
        </div>
        {/* 삭제 버튼 (확인창 포함) */}
        <button
          onClick={handleDelete}
          title="삭제"
          style={{ background: 'none', border: 'none', color: 'var(--c-muted)', cursor: 'pointer', fontSize: '1rem', padding: '0 0.2rem', lineHeight: 1, transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--c-muted)'}
        >
          ×
        </button>
      </div>
    </div>
  );
}