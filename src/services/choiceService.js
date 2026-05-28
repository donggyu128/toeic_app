/**
 * 4지선다 보기 생성
 * wordPool을 주입받아 wordService와 결합도 없음 — 단독 테스트 가능
 */
import { shuffle } from '../utils/shuffle.js';

export function generateChoices(correctWord, wordPool) {
  const distractors = shuffle(wordPool.filter(w => w.id !== correctWord.id)).slice(0, 3);
  return shuffle([correctWord, ...distractors]);
}
