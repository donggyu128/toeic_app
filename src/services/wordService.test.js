import { describe, expect, it } from 'vitest';
import { ALL_SETS, ALL_WORDS, getSetNumber } from './wordService.js';

describe('wordService', () => {
  it('세트가 1개 이상 존재함', () => {
    expect(ALL_SETS.length).toBeGreaterThan(0);
  });

  it('각 세트의 startId, endId가 words 배열과 일치함', () => {
    ALL_SETS.forEach(set => {
      expect(set.words.length).toBeGreaterThan(0);
      expect(set.startId).toBe(set.words[0].id);
      expect(set.endId).toBe(set.words.at(-1).id);
    });
  });

  it('getSetNumber가 단어 id를 올바른 세트로 매핑함', () => {
    const set        = ALL_SETS[0];
    const sampleWord = set.words[0];
    expect(getSetNumber(sampleWord.id)).toBe(set.setNumber);
  });

  it('존재하지 않는 id → null 반환', () => {
    expect(getSetNumber(999999)).toBeNull();
  });

  it('ALL_WORDS가 비어있지 않음', () => {
    expect(ALL_WORDS.length).toBeGreaterThan(0);
  });
});
