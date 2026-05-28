import { describe, expect, it } from 'vitest';
import { calcGrade } from './grade.js';

describe('calcGrade', () => {
  it.each([
    [100, 'S'], [90, 'S'],
    [89,  'A'], [70, 'A'],
    [69,  'B'], [50, 'B'],
    [49,  'C'], [0,  'C'],
  ])('%i점 → %s등급', (pct, label) => {
    expect(calcGrade(pct).label).toBe(label);
  });

  it('모든 등급에 color 속성이 존재함', () => {
    [0, 50, 70, 90].forEach(pct => {
      expect(calcGrade(pct).color).toBeTruthy();
    });
  });
});
