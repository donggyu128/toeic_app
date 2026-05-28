import { useState, useCallback } from 'react';
import { ALL_SETS, ALL_HSK3_SETS } from '../services/wordService.js';
import { PageContainer } from '../components/ui.jsx';
import { HomeHero }        from '../components/home/HomeHero.jsx';
import { WrongNoteBanner } from '../components/home/WrongNoteBanner.jsx';
import { SetCard }         from '../components/home/SetCard.jsx';

// ─── 문제 모드 선택 모달 ─────────────────────────────────────
function ModeSelectModal({ setInfo, vocabType, onStart, onClose }) {
  const [mode, setMode] = useState('multiple');

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem',
    }} onClick={onClose}>
      <div
        style={{
          background: 'var(--c-surface)', border: '1px solid var(--c-border)',
          borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '400px',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          {vocabType === 'hsk3' ? '🇨🇳' : '🇺🇸'} SET {setInfo.setNumber} 시작
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--c-muted)', marginBottom: '1.5rem' }}>
          {setInfo.words.length}개 단어
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--c-muted)', marginBottom: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          문제 유형
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {[
            { value: 'multiple',   label: '🔘 객관식', desc: '4지선다' },
            { value: 'subjective', label: '✏️ 주관식', desc: '직접 입력' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setMode(opt.value)}
              style={{
                flex: 1, padding: '0.75rem', borderRadius: '12px', cursor: 'pointer',
                background: mode === opt.value ? 'rgba(124,109,250,0.15)' : 'var(--c-surface2)',
                border: `1px solid ${mode === opt.value ? 'var(--c-accent)' : 'var(--c-border)'}`,
                color: mode === opt.value ? 'var(--c-accent)' : 'var(--c-text)',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{opt.label}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--c-muted)', marginTop: '0.2rem' }}>{opt.desc}</div>
            </button>
          ))}
        </div>

        <button
          onClick={() => onStart(setInfo.words, mode, vocabType)}
          style={{
            width: '100%', padding: '0.9rem', borderRadius: '12px', cursor: 'pointer',
            background: 'var(--c-accent)', border: 'none', color: '#fff',
            fontWeight: 700, fontSize: '0.95rem', transition: 'opacity 0.15s',
          }}
        >
          시작하기 →
        </button>
      </div>
    </div>
  );
}

// ─── 탭 버튼 ─────────────────────────────────────────────────
function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.55rem 1.2rem', borderRadius: '20px', cursor: 'pointer',
        background: active ? 'var(--c-accent)' : 'var(--c-surface2)',
        border: `1px solid ${active ? 'var(--c-accent)' : 'var(--c-border)'}`,
        color: active ? '#fff' : 'var(--c-muted)',
        fontWeight: active ? 700 : 400,
        fontSize: '0.85rem', transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

export default function HomePage({ progress = {}, hskProgress = {}, wrongNoteCount, onStartTest, onGoWrongNote }) {
  const [tab,     setTab]     = useState('toeic'); // 'toeic' | 'hsk3'
  const [pending, setPending] = useState(null);    // { setInfo, vocabType } | null

  const sets       = tab === 'toeic' ? ALL_SETS      : ALL_HSK3_SETS;
  const progressMap = tab === 'toeic' ? progress      : hskProgress;

  const handleCardClick = useCallback((set) => {
    setPending({ setInfo: set, vocabType: tab });
  }, [tab]);

  const handleStart = useCallback((words, mode, vocabType) => {
    setPending(null);
    onStartTest(words, mode, vocabType);
  }, [onStartTest]);

  return (
    <PageContainer maxWidth={720}>
      <HomeHero />
      <WrongNoteBanner count={wrongNoteCount} onClick={onGoWrongNote} />

      {/* 탭 선택 */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <TabButton active={tab === 'toeic'} onClick={() => setTab('toeic')}>🇺🇸 TOEIC</TabButton>
        <TabButton active={tab === 'hsk3'}  onClick={() => setTab('hsk3')}>🇨🇳 HSK 3급</TabButton>
      </div>

      {/* 세트 레이블 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <span style={{ color: 'var(--c-muted)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          단어 세트
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--c-border)' }} />
        <span style={{ color: 'var(--c-muted)', fontSize: '0.75rem' }}>{sets.length} SETS</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {sets.map(set => {
          const done = progressMap[set.setNumber] ?? 0;
          const pct  = Math.round((done / set.words.length) * 100);
          return (
            <SetCard
              key={set.setNumber}
              set={set}
              pct={pct}
              vocabType={tab}
              onStart={() => handleCardClick(set)}
            />
          );
        })}
      </div>

      {/* 모드 선택 모달 */}
      {pending && (
        <ModeSelectModal
          setInfo={pending.setInfo}
          vocabType={pending.vocabType}
          onStart={handleStart}
          onClose={() => setPending(null)}
        />
      )}
    </PageContainer>
  );
}
