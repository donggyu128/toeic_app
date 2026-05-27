import RAW_WORDS from '../data/words.js';

const SET_SIZE = 100;

export function getSetNumber(id) {
  return Math.ceil(id / SET_SIZE);
}

export function getAllSets() {
  const totalSets = Math.ceil(RAW_WORDS.length / SET_SIZE);
  return Array.from({ length: totalSets }, (_, i) => {
    const setNum = i + 1;
    const words = RAW_WORDS.filter(w => getSetNumber(w.id) === setNum);
    return {
      setNumber: setNum,
      words,
      startId: words[0].id,
      endId: words[words.length - 1].id,
    };
  });
}

// Fisher-Yates shuffle
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 4지선다 보기 생성: 정답 1 + 랜덤 오답 3
export function generateChoices(correctWord, allWords) {
  const pool = allWords.filter(w => w.id !== correctWord.id);
  const wrongs = shuffle(pool).slice(0, 3);
  return shuffle([correctWord, ...wrongs]);
}

// 모듈 로드 시 한 번만 계산 (매 렌더링마다 재계산 방지)
export const ALL_SETS = getAllSets();