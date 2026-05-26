import { getAllSets } from '../utils/wordset.js';
import { storage } from '../utils/storage.js';

export default function HomePage({ onStartTest, onGoWrongNote, wrongNoteCount }) {
  const sets = getAllSets();
  const progress = storage.getProgress();

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <header style={{ marginBottom: '2.5rem' }}>
        <div className="font-display" style={{ fontSize: '4rem', lineHeight: 1, letterSpacing: '0.04em', color: 'var(--c-text)' }}>
          TOEIC<br/>
          <span style={{ color: 'var(--c-accent)' }}>WORDS</span>
        </div>
        <p style={{ marginTop: '0.75rem', color: 'var(--c-muted)', fontSize: '0.875rem' }}>
          테스트 기반 영단어 암기 시스템
        </p>
      </header>

      {/* Wrong note quick-access */}
      <button
        onClick={onGoWrongNote}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          width: '100%',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          background: wrongNoteCount > 0 ? 'rgba(250,109,109,0.08)' : 'var(--c-surface)',
          border: `1px solid ${wrongNoteCount > 0 ? 'rgba(250,109,109,0.3)' : 'var(--c-border)'}`,
          borderRadius: '12px',
          cursor: 'pointer',
          color: 'var(--c-text)',
          textAlign: 'left',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--c-accent2)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = wrongNoteCount > 0 ? 'rgba(250,109,109,0.3)' : 'var(--c-border)'}
      >
        <span style={{ fontSize: '1.5rem' }}>📕</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>오답노트</div>
          <div style={{ color: 'var(--c-muted)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
            {wrongNoteCount > 0 ? `${wrongNoteCount}개 단어 학습 대기` : '오답 단어가 없습니다'}
          </div>
        </div>
        {wrongNoteCount > 0 && (
          <span style={{
            background: 'var(--c-accent2)',
            color: '#fff',
            borderRadius: '20px',
            padding: '2px 10px',
            fontSize: '0.78rem',
            fontWeight: 600,
          }}>{wrongNoteCount}</span>
        )}
      </button>

      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <span style={{ color: 'var(--c-muted)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          단어 세트
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--c-border)' }} />
        <span style={{ color: 'var(--c-muted)', fontSize: '0.75rem' }}>{sets.length} SETS</span>
      </div>

      {/* Set cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {sets.map(set => {
          const done = progress[set.setNumber] || 0;
          const pct = Math.round((done / set.words.length) * 100);
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
    </div>
  );
}

function SetCard({ set, pct, onStart }) {
  return (
    <div
      className="anim-fade-up"
      style={{
        background: 'var(--c-surface)',
        border: '1px solid var(--c-border)',
        borderRadius: '12px',
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        animationDelay: `${(set.setNumber - 1) * 0.04}s`,
      }}
      onClick={onStart}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--c-accent)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--c-border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div className="font-display" style={{ fontSize: '1.8rem', color: 'var(--c-accent)', lineHeight: 1 }}>
          {String(set.setNumber).padStart(2, '0')}
        </div>
        {pct === 100 && (
          <span style={{ fontSize: '0.7rem', background: 'rgba(124,109,250,0.15)', color: 'var(--c-accent)', padding: '2px 8px', borderRadius: '99px', border: '1px solid rgba(124,109,250,0.3)' }}>완료</span>
        )}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--c-muted)', marginBottom: '0.85rem', fontFamily: 'JetBrains Mono, monospace' }}>
        {set.startId} – {set.endId}
      </div>
      {/* Progress bar */}
      <div style={{ height: '3px', background: 'var(--c-border)', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? 'var(--c-accent)' : 'rgba(124,109,250,0.5)', borderRadius: '99px', transition: 'width 0.4s' }} />
      </div>
      <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'var(--c-muted)', textAlign: 'right' }}>
        {set.words.length}단어
      </div>
    </div>
  );
}
