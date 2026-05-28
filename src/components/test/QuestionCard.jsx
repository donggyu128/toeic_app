import { Card } from '../ui.jsx';

export function QuestionCard({ currentIndex, english }) {
  return (
    // key로 currentIndex 사용 — 문제 전환 시 컴포넌트를 새로 마운트해 애니메이션 재실행
    <Card
      key={currentIndex}
      className="anim-fade-up"
      style={{ borderRadius: '20px', padding: '3rem 2rem', textAlign: 'center', marginBottom: '1.5rem', flex: 'none' }}
    >
      <div style={{ fontSize: '0.72rem', color: 'var(--c-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
        영어 → 한국어
      </div>
      <div className="font-display" style={{ fontSize: '3rem', letterSpacing: '0.04em', lineHeight: 1 }}>
        {english}
      </div>
    </Card>
  );
}
