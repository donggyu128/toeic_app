import { useMemo, useState } from 'react';
import { Button, PageContainer } from '../components/ui.jsx';
import { WrongNoteHeader } from '../components/wrong-note/WrongNoteHeader.jsx';
import { RetryHint }       from '../components/wrong-note/RetryHint.jsx';
import { WrongNoteItem }   from '../components/wrong-note/WrongNoteItem.jsx';

const SET_SIZE = 10;

// ─── 공용 문제유형 선택 버튼 ─────────────────────────────────
function ModeButtons({ mode, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem' }}>
      {[
        { value: 'multiple',   label: '🔘 객관식', desc: '4지선다' },
        { value: 'subjective', label: '✏️ 주관식', desc: '직접 입력' },
      ].map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)} style={{
          flex: 1, padding: '0.75rem', borderRadius: '12px', cursor: 'pointer',
          background: mode === opt.value ? 'rgba(124,109,250,0.15)' : 'var(--c-surface2)',
          border: `1px solid ${mode === opt.value ? 'var(--c-accent)' : 'var(--c-border)'}`,
          color: mode === opt.value ? 'var(--c-accent)' : 'var(--c-text)', transition: 'all 0.15s',
        }}>
          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{opt.label}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--c-muted)', marginTop: '0.2rem' }}>{opt.desc}</div>
        </button>
      ))}
    </div>
  );
}

// ─── 섹션 헤더 ───────────────────────────────────────────────
function SectionLabel({ color, label, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', marginTop: '0.25rem' }}>
      <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color, letterSpacing: '0.06em' }}>{label}</span>
      <div style={{ flex: 1, height: '1px', background: 'var(--c-border)' }} />
      <span style={{ fontSize: '0.72rem', color: 'var(--c-muted)' }}>{count}개</span>
    </div>
  );
}

// ─── 전체 재시험 모달 ────────────────────────────────────────
function FullTestModal({ toeicCount, hskCount, onStart, onClose }) {
  const [lang, setMode] = useState(toeicCount > 0 ? 'toeic' : 'hsk3');
  const [mode, setType] = useState('multiple');

  const langOptions = [
    toeicCount > 0 && { value: 'toeic', label: '🇺🇸 TOEIC', count: toeicCount },
    hskCount   > 0 && { value: 'hsk3',  label: '🇨🇳 HSK3',  count: hskCount  },
  ].filter(Boolean);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--c-surface)', border: '1px solid var(--c-border)',
        borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '400px',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>📝 전체 오답 재시험</div>

        {/* 언어 선택 */}
        <div style={{ fontSize: '0.78rem', color: 'var(--c-muted)', marginBottom: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          언어 선택
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {langOptions.map(opt => (
            <button key={opt.value} onClick={() => setMode(opt.value)} style={{
              flex: 1, padding: '0.75rem', borderRadius: '12px', cursor: 'pointer',
              background: lang === opt.value ? (opt.value === 'hsk3' ? 'rgba(250,109,109,0.12)' : 'rgba(124,109,250,0.12)') : 'var(--c-surface2)',
              border: `1px solid ${lang === opt.value ? (opt.value === 'hsk3' ? '#fa6d6d' : 'var(--c-accent)') : 'var(--c-border)'}`,
              color: lang === opt.value ? (opt.value === 'hsk3' ? '#fa6d6d' : 'var(--c-accent)') : 'var(--c-text)',
              transition: 'all 0.15s',
            }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{opt.label}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--c-muted)', marginTop: '0.2rem' }}>{opt.count}개</div>
            </button>
          ))}
        </div>

        {/* 문제 유형 */}
        <div style={{ fontSize: '0.78rem', color: 'var(--c-muted)', marginBottom: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          문제 유형
        </div>
        <ModeButtons mode={mode} onChange={setType} />

        <button onClick={() => onStart(lang, mode)} style={{
          width: '100%', padding: '0.9rem', borderRadius: '12px', cursor: 'pointer',
          background: lang === 'hsk3' ? '#fa6d6d' : 'var(--c-accent)',
          border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.95rem',
        }}>
          시작하기 →
        </button>
      </div>
    </div>
  );
}

// ─── 세트 시험 모달 ───────────────────────────────────────────
function SetTestModal({ toeicSets, hskSets, onStart, onClose }) {
  const hasToeic = toeicSets.length > 0;
  const hasHsk   = hskSets.length > 0;
  const [lang,        setLang]        = useState(hasToeic ? 'toeic' : 'hsk3');
  const [selectedSet, setSelectedSet] = useState(0);
  const [mode,        setMode]        = useState('multiple');

  const sets       = lang === 'toeic' ? toeicSets : hskSets;
  const currentSet = sets[selectedSet] ?? [];
  const accent     = lang === 'hsk3' ? '#fa6d6d' : 'var(--c-accent)';
  const accentBg   = lang === 'hsk3' ? 'rgba(250,109,109,0.12)' : 'rgba(124,109,250,0.12)';

  const handleLangChange = (l) => { setLang(l); setSelectedSet(0); };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--c-surface)', border: '1px solid var(--c-border)',
        borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '440px',
        maxHeight: '88vh', overflowY: 'auto',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>🗂️ 세트별 시험</div>

        {/* 언어 선택 */}
        {hasToeic && hasHsk && (
          <>
            <div style={{ fontSize: '0.78rem', color: 'var(--c-muted)', marginBottom: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>언어 선택</div>
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {[
                { value: 'toeic', label: '🇺🇸 TOEIC', count: toeicSets.flat().length },
                { value: 'hsk3',  label: '🇨🇳 HSK3',  count: hskSets.flat().length },
              ].map(opt => (
                <button key={opt.value} onClick={() => handleLangChange(opt.value)} style={{
                  flex: 1, padding: '0.65rem', borderRadius: '12px', cursor: 'pointer',
                  background: lang === opt.value ? (opt.value === 'hsk3' ? 'rgba(250,109,109,0.12)' : 'rgba(124,109,250,0.12)') : 'var(--c-surface2)',
                  border: `1px solid ${lang === opt.value ? (opt.value === 'hsk3' ? '#fa6d6d' : 'var(--c-accent)') : 'var(--c-border)'}`,
                  color: lang === opt.value ? (opt.value === 'hsk3' ? '#fa6d6d' : 'var(--c-accent)') : 'var(--c-text)',
                  transition: 'all 0.15s',
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{opt.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--c-muted)', marginTop: '0.15rem' }}>{opt.count}개</div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 세트 선택 */}
        <div style={{ fontSize: '0.78rem', color: 'var(--c-muted)', marginBottom: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          세트 선택 (10개씩)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
          {sets.map((set, i) => (
            <button key={i} onClick={() => setSelectedSet(i)} style={{
              padding: '0.4rem 0.85rem', borderRadius: '8px', cursor: 'pointer',
              background: selectedSet === i ? accentBg : 'var(--c-surface2)',
              border: `1px solid ${selectedSet === i ? accent : 'var(--c-border)'}`,
              color: selectedSet === i ? accent : 'var(--c-muted)',
              fontSize: '0.8rem', fontWeight: selectedSet === i ? 700 : 400, transition: 'all 0.15s',
            }}>
              세트 {i + 1}
              <span style={{ fontSize: '0.68rem', display: 'block', color: 'var(--c-muted)' }}>{set.length}개</span>
            </button>
          ))}
        </div>

        {/* 단어 미리보기 */}
        <div style={{ fontSize: '0.78rem', color: 'var(--c-muted)', marginBottom: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          세트 {selectedSet + 1} 단어
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1.5rem' }}>
          {currentSet.map(item => (
            <span key={item.word.id} style={{
              padding: '0.2rem 0.5rem', borderRadius: '6px',
              background: accentBg,
              border: `1px solid ${lang === 'hsk3' ? 'rgba(250,109,109,0.25)' : 'rgba(124,109,250,0.25)'}`,
              fontSize: '0.78rem', color: accent,
            }}>
              {lang === 'hsk3' ? item.word.chinese : item.word.english}
            </span>
          ))}
        </div>

        {/* 문제 유형 */}
        <div style={{ fontSize: '0.78rem', color: 'var(--c-muted)', marginBottom: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          문제 유형
        </div>
        <ModeButtons mode={mode} onChange={setMode} />

        <button
          onClick={() => onStart(currentSet.map(i => i.word), mode, lang)}
          disabled={currentSet.length === 0}
          style={{
            width: '100%', padding: '0.9rem', borderRadius: '12px',
            cursor: currentSet.length > 0 ? 'pointer' : 'not-allowed',
            background: accent, border: 'none', color: '#fff',
            fontWeight: 700, fontSize: '0.95rem',
            opacity: currentSet.length > 0 ? 1 : 0.4,
          }}>
          세트 {selectedSet + 1} 시작 →
        </button>
      </div>
    </div>
  );
}

// ─── 메인 페이지 ─────────────────────────────────────────────
export default function WrongNotePage({ wrongNote, onStartWrongTest, onStartWrongSetTest, onDelete, onGoHome }) {
  const [modal, setModal] = useState(null);
  const [tab,   setTab]   = useState('all');

  const sorted = useMemo(
    () => [...wrongNote].sort((a, b) => b.wrongCount - a.wrongCount),
    [wrongNote],
  );

  const toeicItems = useMemo(() => sorted.filter(i => i.word.id < 1001),  [sorted]);
  const hskItems   = useMemo(() => sorted.filter(i => i.word.id >= 1001), [sorted]);

  const displayItems = tab === 'toeic' ? toeicItems : tab === 'hsk3' ? hskItems : sorted;

  // 탭 필터 기준으로 세트 생성
  const toeicSets = useMemo(() => {
    const res = [];
    for (let i = 0; i < toeicItems.length; i += SET_SIZE) res.push(toeicItems.slice(i, i + SET_SIZE));
    return res;
  }, [toeicItems]);

  const hskSets = useMemo(() => {
    const res = [];
    for (let i = 0; i < hskItems.length; i += SET_SIZE) res.push(hskItems.slice(i, i + SET_SIZE));
    return res;
  }, [hskItems]);

  // 전체 재시험: lang + mode 받아서 해당 언어 단어만 전달
  const handleFullStart = (lang, mode) => {
    const words = (lang === 'hsk3' ? hskItems : toeicItems).map(i => i.word);
    setModal(null);
    onStartWrongSetTest(words, mode);
  };

  // 세트 시험: words + mode + vocabType 전달
  const handleSetStart = (words, mode, vocabType) => {
    setModal(null);
    onStartWrongSetTest(words, mode, vocabType);
  };

  const tabStyle = (active) => ({
    padding: '0.45rem 1rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.82rem',
    fontWeight: active ? 700 : 400, transition: 'all 0.15s',
    background: active ? 'var(--c-surface2)' : 'transparent',
    border: `1px solid ${active ? 'var(--c-border)' : 'transparent'}`,
    color: active ? 'var(--c-text)' : 'var(--c-muted)',
  });

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
          {/* 필터 탭 */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
            <button style={tabStyle(tab === 'all')}   onClick={() => setTab('all')}>전체 {wrongNote.length}</button>
            <button style={tabStyle(tab === 'toeic')} onClick={() => setTab('toeic')}>🇺🇸 TOEIC {toeicItems.length}</button>
            <button style={tabStyle(tab === 'hsk3')}  onClick={() => setTab('hsk3')}>🇨🇳 HSK3 {hskItems.length}</button>
          </div>

          {/* 재시험 버튼 */}
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Button
              variant="accent"
              onClick={() => setModal('full')}
              className="ui-interactive"
              style={{ flex: 1, padding: '0.85rem', borderRadius: '12px', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 500 }}
            >
              📝 전체 재시험
            </Button>
            <Button
              onClick={() => setModal('set')}
              className="ui-interactive"
              style={{
                flex: 1, padding: '0.85rem', borderRadius: '12px', cursor: 'pointer',
                fontSize: '0.83rem', fontWeight: 500,
                background: 'rgba(250,109,109,0.08)', border: '1px solid rgba(250,109,109,0.3)', color: '#f87171',
              }}
            >
              🗂️ 세트별 시험 (10개)
            </Button>
          </div>

          <RetryHint />

          {/* 단어 목록 */}
          {tab === 'all' ? (
            <>
              {toeicItems.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <SectionLabel color="var(--c-accent)" label="TOEIC 영어" count={toeicItems.length} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {toeicItems.map(item => <WrongNoteItem key={item.word.id} item={item} onDelete={onDelete} />)}
                  </div>
                </div>
              )}
              {hskItems.length > 0 && (
                <div style={{ marginTop: '1.25rem' }}>
                  <SectionLabel color="#fa6d6d" label="HSK 3급 중국어" count={hskItems.length} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {hskItems.map(item => <WrongNoteItem key={item.word.id} item={item} onDelete={onDelete} />)}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '1rem' }}>
              {displayItems.map(item => <WrongNoteItem key={item.word.id} item={item} onDelete={onDelete} />)}
            </div>
          )}
        </>
      )}

      {modal === 'full' && (
        <FullTestModal
          toeicCount={toeicItems.length}
          hskCount={hskItems.length}
          onStart={handleFullStart}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'set' && (
        <SetTestModal
          toeicSets={toeicSets}
          hskSets={hskSets}
          onStart={handleSetStart}
          onClose={() => setModal(null)}
        />
      )}
    </PageContainer>
  );
}
