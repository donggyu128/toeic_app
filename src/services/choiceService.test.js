import { describe, expect, it } from 'vitest';
import { generateChoices } from './choiceService.js';

const mkWord = (id) => ({ id, english: `word${id}`, korean: `단어${id}` });
const POOL   = [1, 2, 3, 4, 5].map(mkWord);

describe('generateChoices', () => {
  it('정답 단어를 항상 포함함', () => {
    const correct = POOL[0];
    const choices = generateChoices(correct, POOL);
    expect(choices.some(c => c.id === correct.id)).toBe(true);
  });

  it('풀이 충분할 때 4지선다 반환', () => {
    expect(generateChoices(POOL[0], POOL)).toHaveLength(4);
  });

  it('풀이 부족할 때 가능한 만큼만 반환', () => {
    const tinyPool = [mkWord(1), mkWord(2)];
    expect(generateChoices(tinyPool[0], tinyPool)).toHaveLength(2);
  });

  it('반환 배열에 중복 없음', () => {
    const choices = generateChoices(POOL[0], POOL);
    const ids     = choices.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
