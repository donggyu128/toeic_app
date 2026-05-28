import { useCallback } from 'react';
import { ALL_SETS } from '../services/wordService.js';
import { PageContainer } from '../components/ui.jsx';
import { HomeHero }        from '../components/home/HomeHero.jsx';
import { WrongNoteBanner } from '../components/home/WrongNoteBanner.jsx';
import { SetCard }         from '../components/home/SetCard.jsx';

export default function HomePage({ progress = {}, wrongNoteCount, onStartTest, onGoWrongNote }) {
  return (
    <PageContainer maxWidth={720}>
      <HomeHero />
      <WrongNoteBanner count={wrongNoteCount} onClick={onGoWrongNote} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <span style={{ color: 'var(--c-muted)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          단어 세트
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--c-border)' }} />
        <span style={{ color: 'var(--c-muted)', fontSize: '0.75rem' }}>{ALL_SETS.length} SETS</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {ALL_SETS.map(set => {
          const done = progress[set.setNumber] ?? 0;
          const pct  = Math.round((done / set.words.length) * 100);
          // SetCard의 onStart를 useCallback으로 안정화하려면 별도 컴포넌트로 분리해야 함.
          // 현재 SetCard가 React.memo가 아니므로 인라인 핸들러로 충분.
          return (
            <SetCard
              key={set.setNumber}
              set={set}
              pct={pct}
              onStart={() => onStartTest(set.words)}
            />
          );
        })}
      </div>
    </PageContainer>
  );
}
