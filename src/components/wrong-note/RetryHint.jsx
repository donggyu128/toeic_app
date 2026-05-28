import { Card } from '../ui.jsx';

export function RetryHint() {
  return (
    <Card style={{ fontSize: '0.75rem', color: 'var(--c-muted)', marginBottom: '1rem', padding: '0.6rem 0.85rem', borderRadius: '8px' }}>
      💡 재시험에서 연속 3회 정답 시 자동 삭제 · 오답 발생 시 카운트 초기화
    </Card>
  );
}
