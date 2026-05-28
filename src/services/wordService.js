/**
 * 단어 데이터 가공 — 데이터 소스 교체 시 이 파일만 수정
 */
import RAW_WORDS from '../data/words.js';
import { shuffle } from '../utils/shuffle.js';
import { generateChoices } from './choiceService.js';

const SET_SIZE = 100;

// 모듈 로드 시 한 번만 계산
const sorted = [...RAW_WORDS].sort((a, b) => a.id - b.id);

export const ALL_WORDS = RAW_WORDS;

export const ALL_SETS = Array.from(
  { length: Math.ceil(sorted.length / SET_SIZE) },
  (_, i) => {
    const words  = sorted.slice(i * SET_SIZE, (i + 1) * SET_SIZE);
    const setNum = i + 1;
    return { setNumber: setNum, words, startId: words[0].id, endId: words.at(-1).id };
  },
);

// word.id → setNumber 역방향 인덱스
const WORD_TO_SET = Object.fromEntries(
  ALL_SETS.flatMap(set => set.words.map(w => [w.id, set.setNumber])),
);

export const getSetNumber = (id) => WORD_TO_SET[id] ?? null;
export const shuffleWords  = (words) => shuffle(words);
export const makeChoices   = (word)  => generateChoices(word, ALL_WORDS);
