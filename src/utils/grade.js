/**
 * 정답률(0~100)을 등급으로 변환 — 순수 함수
 * ResultPage와 무관하게 단독 테스트 가능
 */
const GRADE_MAP = [
  { min: 90, label: 'S', color: '#a78bfa' },
  { min: 70, label: 'A', color: '#4ade80' },
  { min: 50, label: 'B', color: '#facc15' },
  { min:  0, label: 'C', color: '#f87171' },
];

export function calcGrade(pct) {
  return GRADE_MAP.find(g => pct >= g.min) ?? GRADE_MAP.at(-1);
}
