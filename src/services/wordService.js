/**
 * 단어 데이터 가공 — 데이터 소스 교체 시 이 파일만 수정
 */
import TOEIC_WORDS from '../data/words.js';
import HSK3_WORDS  from '../data/hsk3words.js';
import { shuffle } from '../utils/shuffle.js';
import { generateChoices, generateHSKChoices } from './choiceService.js';

const SET_SIZE = 100;

// ─── TOEIC ────────────────────────────────────────────────────
const toeicSorted = [...TOEIC_WORDS].sort((a, b) => a.id - b.id);

export const ALL_WORDS = TOEIC_WORDS;

export const ALL_SETS = Array.from(
  { length: Math.ceil(toeicSorted.length / SET_SIZE) },
  (_, i) => {
    const words  = toeicSorted.slice(i * SET_SIZE, (i + 1) * SET_SIZE);
    const setNum = i + 1;
    return { setNumber: setNum, words, startId: words[0].id, endId: words.at(-1).id };
  },
);

// word.id → setNumber 역방향 인덱스 (TOEIC)
const WORD_TO_SET = Object.fromEntries(
  ALL_SETS.flatMap(set => set.words.map(w => [w.id, set.setNumber])),
);

// ─── HSK3 ────────────────────────────────────────────────────
const hsk3Sorted = [...HSK3_WORDS].sort((a, b) => a.id - b.id);

export const ALL_HSK3_WORDS = HSK3_WORDS;

export const ALL_HSK3_SETS = Array.from(
  { length: Math.ceil(hsk3Sorted.length / SET_SIZE) },
  (_, i) => {
    const words  = hsk3Sorted.slice(i * SET_SIZE, (i + 1) * SET_SIZE);
    const setNum = i + 1;
    return { setNumber: setNum, words, startId: words[0].id, endId: words.at(-1).id };
  },
);

// word.id → setNumber 역방향 인덱스 (HSK3)
const HSK3_WORD_TO_SET = Object.fromEntries(
  ALL_HSK3_SETS.flatMap(set => set.words.map(w => [w.id, set.setNumber])),
);

// ─── 공통 유틸 ────────────────────────────────────────────────
export const getSetNumber     = (id) => WORD_TO_SET[id] ?? null;
export const getHSK3SetNumber = (id) => HSK3_WORD_TO_SET[id] ?? null;
export const shuffleWords     = (words) => shuffle(words);
export const makeChoices      = (word) => generateChoices(word, TOEIC_WORDS);
export const makeHSKChoices   = (word) => generateHSKChoices(word, HSK3_WORDS);

// 단어 타입 판별 (HSK3 단어는 id >= 1001)
export const isHSKWord = (word) => word && word.id >= 1001;
