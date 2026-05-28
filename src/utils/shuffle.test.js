import { describe, expect, it } from 'vitest';
import { shuffle } from './shuffle.js';

describe('shuffle', () => {
  it('원본 배열을 변경하지 않음', () => {
    const original = [1, 2, 3, 4, 5];
    const frozen   = [...original];
    shuffle(original);
    expect(original).toEqual(frozen);
  });

  it('모든 원소를 유지함 (정렬 후 비교)', () => {
    const input  = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result.sort((a, b) => a - b)).toEqual(input);
  });

  it('빈 배열 입력 시 빈 배열 반환', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('원소 1개 배열은 그대로 반환', () => {
    expect(shuffle([42])).toEqual([42]);
  });
});
