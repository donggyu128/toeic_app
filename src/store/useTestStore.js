/**
 * 테스트 진행 상태 — 단일 책임
 *
 * 핵심 설계 결정:
 * - reducer를 export해 순수 함수로 단독 테스트 가능
 * - 정답 판별 로직은 reducer 한 곳에만 존재
 *   hook의 submitAnswer는 action에 correct를 실어 보내고, reducer는 저장만 함
 * - hasStarted 플래그로 RESET 후 isDone=false를 명시적으로 보장
 * - sourceSetNum을 셔플 전 원본 첫 단어 기준으로 고정 (진행률 오기록 방지)
 */
import { useReducer, useCallback } from 'react';
import { shuffleWords, makeChoices, getSetNumber } from '../services/wordService.js';

// ─── State 초기값 ─────────────────────────────────────────────

const INIT = {
  hasStarted:   false,  // RESET 후 isDone=false 보장용 명시적 플래그
  isActive:     false,
  isWrongTest:  false,
  sourceSetNum: null,   // 셔플 전 원본 첫 단어 기준 세트 번호 — 진행률 정확성 보장
  testWords:    [],
  currentIndex: 0,
  choices:      [],
  answered:     null,   // { selected: Word, correct: boolean } | null
  answers:      [],     // { word: Word, correct: boolean }[]
};

// ─── Reducer ──────────────────────────────────────────────────

export function reducer(state, action) {
  switch (action.type) {

    case 'START': {
      const words      = shuffleWords(action.words);
      const sourceSetNum = action.words[0] ? getSetNumber(action.words[0].id) : null;
      return {
        ...INIT,
        hasStarted:   true,
        isActive:     true,
        isWrongTest:  action.isWrongTest ?? false,
        sourceSetNum,
        testWords:    words,
        choices:      makeChoices(words[0]),
      };
    }

    case 'SUBMIT_ANSWER': {
      // 정답 판별 로직은 여기 한 곳에만 존재
      // hook에서 correct를 계산해 action에 싣고, reducer는 저장만 담당
      return {
        ...state,
        answered: { selected: action.selected, correct: action.correct },
      };
    }

    case 'NEXT': {
      if (!state.answered) return state; // 방어 가드 — 답 없이 NEXT 불가

      const record     = { word: state.testWords[state.currentIndex], correct: state.answered.correct };
      const newAnswers = [...state.answers, record];
      const nextIndex  = state.currentIndex + 1;

      if (nextIndex >= state.testWords.length) {
        return { ...state, answers: newAnswers, isActive: false };
      }

      return {
        ...state,
        currentIndex: nextIndex,
        choices:      makeChoices(state.testWords[nextIndex]),
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

  const startTest = useCallback((words, isWrongTest = false) => {
    dispatch({ type: 'START', words, isWrongTest });
  }, []);

  /**
   * 정답 판별은 hook에서 수행하고 결과를 action에 포함시킴
   * reducer는 이 값을 그대로 저장 → 판별 로직이 단 한 곳에만 존재
   * deps: 현재 단어 id(숫자)만 — 배열 참조 변경에 불필요하게 반응하지 않음
   */
  const submitAnswer = useCallback((selected) => {
    const currentWord = state.testWords[state.currentIndex];
    const correct     = currentWord ? selected.id === currentWord.id : false;
    dispatch({ type: 'SUBMIT_ANSWER', selected, correct });
    return correct;
  }, [state.testWords[state.currentIndex]?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const nextQuestion = useCallback(() => dispatch({ type: 'NEXT' }), []);
  const resetTest    = useCallback(() => dispatch({ type: 'RESET' }), []);

  const currentWord = state.testWords[state.currentIndex] ?? null;
  const isDone      = state.hasStarted && !state.isActive && state.answers.length > 0;

  return { ...state, currentWord, isDone, startTest, submitAnswer, nextQuestion, resetTest };
}
