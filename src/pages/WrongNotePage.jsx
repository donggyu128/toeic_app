import { useMemo } from 'react';
import { Button, PageContainer } from '../components/ui.jsx';
import { WrongNoteHeader } from '../components/wrong-note/WrongNoteHeader.jsx';
import { RetryHint }       from '../components/wrong-note/RetryHint.jsx';
import { WrongNoteItem }   from '../components/wrong-note/WrongNoteItem.jsx';

export default function WrongNotePage({ wrongNote, onStartWrongTest, onDelete, onGoHome }) {
  const sorted = useMemo(
    () => [...wrongNote].sort((a, b) => b.wrongCount - a.wrongCount),
    [wrongNote],
  );

  return (
    <PageContainer maxWidth={600}>
      <WrongNoteHeader count={wrongNote.length} onGoHome={onGoHome} />

      {wrongNote.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--c-muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎉</div>
          <div>오답 단어가 없습니다!</div>
        </div>
      ) : (
        <>
          <Button
            variant="accent"
            onClick={onStartWrongTest}
            className="ui-interactive"
            style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.15s' }}
          >
            📝 오답 재시험 시작 ({wrongNote.length}단어)
          </Button>

          <RetryHint />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sorted.map(item => (
              <WrongNoteItem key={item.word.id} item={item} onDelete={onDelete} />
            ))}
          </div>
        </>
      )}
    </PageContainer>
  );
}
