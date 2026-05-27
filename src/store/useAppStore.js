import { useReducer, useCallback } from 'react';
import { storage } from '../utils/storage.js';
import { shuffle, generateChoices } from '../utils/wordset.js';
import RAW_WORDS from '../data/words.js';

// ── State shape ──────────────────────────────────────────────
// {
//   view: 'home' | 'test' | 'result' | 'wrongnote',
//   testWords: Word[],
//   currentIndex: number,
//   choices: Word[],
//   answered: null | { selected: Word, correct: boolean },
//   answers: { word: Word, correct: boolean }[],
//   wrongNote: WrongNoteItem[],
//   isWrongTest: boolean,
// }
//
// WrongNoteItem: { word, wrongCount, consecutiveCorrect }

// ── 초기 상태 ────────────────────────────────────────────────
const INIT = {
  view: 'home',
  testWords: [],
  currentIndex: 0,
  choices: [],
  answered: null,
  answers: [],
  wrongNote: storage.getWrongNote(),
  progress: storage.getProgress(),
  isWrongTest: false,
};

function makeChoices(word) {
  return generateChoices(word, RAW_WORDS);
}

// ── Reducer ──────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    // 일반 테스트 시작
    case 'START_TEST': {
      const words = shuffle(action.words);
      return {
        ...state,
        view: 'test',
        testWords: words,
        currentIndex: 0,
        choices: makeChoices(words[0]),
        answered: null,
        answers: [],
        isWrongTest: false,
      };
    }

    // 오답 재시험 시작
    case 'START_WRONG_TEST': {
      const words = shuffle(state.wrongNote.map(i => i.word));
      if (words.length === 0) return state;
      return {
        ...state,
        view: 'test',
        testWords: words,
        currentIndex: 0,
        choices: makeChoices(words[0]),
        answered: null,
        answers: [],
        isWrongTest: true,
      };
    }

    case 'SUBMIT_ANSWER': {
      const { selected } = action;
      const currentWord = state.testWords[state.currentIndex];
      const correct = selected.id === currentWord.id;
      let wrongNote = [...state.wrongNote];
      let progress = { ...state.progress }; // state에서 가져오기
    
      if (!state.isWrongTest) {
        // 오답이면 오답노트에 즉시 반영
        if (!correct) {
          const idx = wrongNote.findIndex(i => i.word.id === currentWord.id);
          if (idx >= 0) {
            wrongNote[idx] = {
              ...wrongNote[idx],
              wrongCount: wrongNote[idx].wrongCount + 1,
              consecutiveCorrect: 0,
            };
          } else {
            wrongNote.push({ word: currentWord, wrongCount: 1, consecutiveCorrect: 0 });
          }
          storage.saveWrongNote(wrongNote);
        }
    
        // 진행률 즉시 저장 + state 반영
        const setNum = Math.ceil(state.testWords[0].id / 100);
        progress[setNum] = Math.max(progress[setNum] || 0, state.currentIndex + 1);
        storage.saveProgress(progress);
    
      } else {
        // 오답 재시험: 연속 정답 카운트 즉시 업데이트
        const idx = wrongNote.findIndex(i => i.word.id === currentWord.id);
        if (idx >= 0) {
          if (correct) {
            const newConsec = wrongNote[idx].consecutiveCorrect + 1;
            if (newConsec >= 3) {
              wrongNote.splice(idx, 1); // 연속 3회 정답 → 자동 삭제
            } else {
              wrongNote[idx] = { ...wrongNote[idx], consecutiveCorrect: newConsec };
            }
          } else {
            wrongNote[idx] = {
              ...wrongNote[idx],
              wrongCount: wrongNote[idx].wrongCount + 1,
              consecutiveCorrect: 0,
            };
          }
          storage.saveWrongNote(wrongNote);
        }
      }
    
      return {
        ...state,
        answered: { selected, correct },
        wrongNote,
        progress, // state에 반영
      };
    }

    // 다음 문제로 이동
    case 'NEXT_QUESTION': {
      const nextIndex = state.currentIndex + 1;

      // 현재 문제 답 기록
      const newAnswers = [
        ...state.answers,
        { word: state.testWords[state.currentIndex], correct: state.answered?.correct ?? false },
      ];

      // 마지막 문제였으면 결과 화면으로 (마지막 답도 포함해서)
      if (nextIndex >= state.testWords.length) {
        return {
          ...state,
          view: 'result',
          answers: newAnswers,
          wrongNote: state.wrongNote,
        };
      }

      // 다음 문제로
      const nextWord = state.testWords[nextIndex];
      return {
        ...state,
        currentIndex: nextIndex,
        choices: makeChoices(nextWord),
        answered: null,
        answers: newAnswers,
      };
    }

    // 홈으로 (테스트 상태 완전 초기화)
    case 'GO_HOME':
      return {
        ...state,
        view: 'home',
        testWords: [],
        currentIndex: 0,
        choices: [],
        answered: null,
        answers: [],
        isWrongTest: false,
      };

    // 오답노트로
    case 'GO_WRONG_NOTE':
      return { ...state, view: 'wrongnote' };

    // 오답노트 단어 수동 삭제
    case 'DELETE_WRONG_ITEM': {
      const wrongNote = state.wrongNote.filter(i => i.word.id !== action.wordId);
      storage.saveWrongNote(wrongNote);
      return { ...state, wrongNote };
    }

    default:
      return state;
  }
}

// ── Hook ─────────────────────────────────────────────────────
export function useAppStore() {
  const [state, dispatch] = useReducer(reducer, INIT);

  const startTest       = useCallback(words => dispatch({ type: 'START_TEST', words }), []);
  const startWrongTest  = useCallback(() => dispatch({ type: 'START_WRONG_TEST' }), []);
  const submitAnswer    = useCallback(selected => dispatch({ type: 'SUBMIT_ANSWER', selected }), []);
  const nextQuestion    = useCallback(() => dispatch({ type: 'NEXT_QUESTION' }), []);
  const goHome          = useCallback(() => dispatch({ type: 'GO_HOME' }), []);
  const goWrongNote     = useCallback(() => dispatch({ type: 'GO_WRONG_NOTE' }), []);
  const deleteWrongItem = useCallback(wordId => dispatch({ type: 'DELETE_WRONG_ITEM', wordId }), []);

  return { state, startTest, startWrongTest, submitAnswer, nextQuestion, goHome, goWrongNote, deleteWrongItem };
}