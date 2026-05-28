/**
 * 테스트 진행 상태 — 단일 책임
 * - TOEIC / HSK3 모드 지원
 * - 객관식(multiple) / 주관식(subjective) 모드 지원
 * - 오답노트 10개 세트 시험 지원
 */
import { useReducer, useCallback } from 'react';
import {
  shuffleWords,
  makeChoices,
  makeHSKChoices,
  getSetNumber,
  getHSK3SetNumber,
  isHSKWord,
} from '../services/wordService.js';

// ─── State 초기값 ─────────────────────────────────────────────
const INIT = {
  hasStarted:   false,
  isActive:     false,
  isWrongTest:  false,
  questionMode: 'multiple', // 'multiple' | 'subjective'
  vocabType:    'toeic',    // 'toeic' | 'hsk3'
  sourceSetNum: null,
  testWords:    [],
  currentIndex: 0,
  choices:      [],
  answered:     null,
  answers:      [],
};

// ─── 보기 생성 헬퍼 ────────────────────────────────────────────
function buildChoices(word, questionMode) {
  if (questionMode === 'subjective') return []; // 주관식은 보기 불필요
  return isHSKWord(word) ? makeHSKChoices(word) : makeChoices(word);
}

// ─── Reducer ──────────────────────────────────────────────────
export function reducer(state, action) {
  switch (action.type) {

    case 'START': {
      const words        = shuffleWords(action.words);
      const questionMode = action.questionMode ?? 'multiple';
      const vocabType    = action.vocabType ?? 'toeic';
      const sourceSetNum = action.words[0]
        ? (vocabType === 'hsk3' ? getHSK3SetNumber(action.words[0].id) : getSetNumber(action.words[0].id))
        : null;
      return {
        ...INIT,
        hasStarted:   true,
        isActive:     true,
        isWrongTest:  action.isWrongTest ?? false,
        questionMode,
        vocabType,
        sourceSetNum,
        testWords:    words,
        choices:      buildChoices(words[0], questionMode),
      };
    }

    case 'SUBMIT_ANSWER': {
      return {
        ...state,
        answered: { selected: action.selected, correct: action.correct, typed: action.typed },
      };
    }

    case 'NEXT': {
      if (!state.answered) return state;

      const record     = { word: state.testWords[state.currentIndex], correct: state.answered.correct };
      const newAnswers = [...state.answers, record];
      const nextIndex  = state.currentIndex + 1;

      if (nextIndex >= state.testWords.length) {
        return { ...state, answers: newAnswers, isActive: false };
      }

      return {
        ...state,
        currentIndex: nextIndex,
        choices:      buildChoices(state.testWords[nextIndex], state.questionMode),
        answered:     null,
        answers:      newAnswers,
      };
    }

    case 'RESET':
      return INIT;

    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────
export function useTestStore() {
  const [state, dispatch] = useReducer(reducer, INIT);

  const startTest = useCallback((words, isWrongTest = false, questionMode = 'multiple', vocabType = 'toeic') => {
    dispatch({ type: 'START', words, isWrongTest, questionMode, vocabType });
  }, []);

  const submitAnswer = useCallback((selected, typed = '') => {
    const currentWord = state.testWords[state.currentIndex];
    if (!currentWord) return false;

    let correct;
    if (state.questionMode === 'subjective') {
      // 주관식: HSK는 한국어 뜻 입력, TOEIC은 영어 단어 입력
      const answer = typed.trim();
      if (state.vocabType === 'hsk3') {
        // 중국어 보여주고 한국어 뜻 입력 — 쉼표 앞 첫 뜻도 정답 허용
        const correctKorean = currentWord.korean.trim();
        const firstMeaning  = correctKorean.split(/[,，]/)[0].trim();
        correct = answer === correctKorean || answer === firstMeaning;
      } else {
        correct = answer.toLowerCase() === currentWord.english.toLowerCase();
      }
    } else {
      correct = currentWord ? selected.id === currentWord.id : false;
    }

    dispatch({ type: 'SUBMIT_ANSWER', selected, correct, typed });
    return correct;
  }, [state.testWords[state.currentIndex]?.id, state.questionMode, state.vocabType]); // eslint-disable-line

  const nextQuestion = useCallback(() => dispatch({ type: 'NEXT' }), []);
  const resetTest    = useCallback(() => dispatch({ type: 'RESET' }), []);

  const currentWord = state.testWords[state.currentIndex] ?? null;
  const isDone      = state.hasStarted && !state.isActive && state.answers.length > 0;

  return { ...state, currentWord, isDone, startTest, submitAnswer, nextQuestion, resetTest };
}
