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
    return { setNumber: setNum, words, startId: words[0].id, endId: words[words.length - 1].id };
  });
}

export function getSetWords(setNumber) {
  return RAW_WORDS.filter(w => getSetNumber(w.id) === setNumber);
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

// Generate 4 choices: 1 correct + 3 random wrong from all words
export function generateChoices(correctWord, allWords) {
  const pool = allWords.filter(w => w.id !== correctWord.id);
  const wrongs = shuffle(pool).slice(0, 3);
  return shuffle([correctWord, ...wrongs]);
}
