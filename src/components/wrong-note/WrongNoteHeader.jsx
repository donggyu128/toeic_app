import { Button } from '../ui.jsx';

export function WrongNoteHeader({ count, onGoHome }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
      <Button variant="ghost" onClick={onGoHome} style={{ fontSize: '0.85rem' }}>← 홈</Button>
      <div className="font-display" style={{ fontSize: '1.8rem', letterSpacing: '0.04em' }}>오답노트</div>
      <span style={{ marginLeft: 'auto', background: 'rgba(250,109,109,0.12)', color: '#f87171', borderRadius: '99px', padding: '2px 10px', fontSize: '0.8rem', border: '1px solid rgba(250,109,109,0.25)' }}>
        {count}개
      </span>
    </div>
  );
}
