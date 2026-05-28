/**
 * useTestStore reducer 순수 함수 테스트
 * 비즈니스 로직의 핵심 — 모든 케이스와 경계값 검증
 */
import { describe, expect, it } from 'vitest';
import { reducer } from './useTestStore.js';

// ─── 픽스처 ───────────────────────────────────────────────────

const w = (id) => ({ id, english: `word${id}`, korean: `단어${id}` });
const [w1, w2, w3] = [w(1), w(2), w(3)];

const INIT = {
  hasStarted: false, isActive: false, isWrongTest: false,
  sourceSetNum: null, testWords: [], currentIndex: 0,
  choices: [], answered: null, answers: [],
};

/** 테스트용 진행 중 상태 — START의 shuffle을 우회해 deterministic 상태 생성 */
function activeState(words = [w1, w2, w3], overrides = {}) {
  return { ...INIT, hasStarted: true, isActive: true, testWords: words, choices: words, ...overrides };
}

// ─── START ────────────────────────────────────────────────────

describe('START', () => {
  it('hasStarted, isActive를 true로 설정', () => {
    const next = reducer(INIT, { type: 'START', words: [w1, w2], isWrongTest: false });
    expect(next.hasStarted).toBe(true);
    expect(next.isActive).toBe(true);
  });

  it('이전 answers를 초기화함', () => {
    const withAnswers = { ...INIT, answers: [{ word: w1, correct: true }], hasStarted: true };
    const next = reducer(withAnswers, { type: 'START', words: [w1], isWrongTest: false });
    expect(next.answers).toHaveLength(0);
  });

  it('isWrongTest 플래그를 올바르게 설정', () => {
    const next = reducer(INIT, { type: 'START', words: [w1], isWrongTest: true });
    expect(next.isWrongTest).toBe(true);
  });
});

// ─── SUBMIT_ANSWER ────────────────────────────────────────────

describe('SUBMIT_ANSWER', () => {
  it('action.correct를 그대로 answered에 저장 (로직 위임)', () => {
    const state = activeState();
    const next  = reducer(state, { type: 'SUBMIT_ANSWER', selected: w1, correct: true });
    expect(next.answered).toEqual({ selected: w1, correct: true });
  });

  it('오답도 올바르게 저장', () => {
    const state = activeState();
    const next  = reducer(state, { type: 'SUBMIT_ANSWER', selected: w2, correct: false });
    expect(next.answered.correct).toBe(false);
  });
});

// ─── NEXT ─────────────────────────────────────────────────────

describe('NEXT', () => {
  it('answered가 null이면 state를 변경하지 않음 (방어 가드)', () => {
    const state = activeState();
    const next  = reducer(state, { type: 'NEXT' });
    expect(next).toBe(state); // 동일 참조 — 불변
  });

  it('정상 진행: currentIndex 증가, answered 초기화, answers에 기록', () => {
    const state    = activeState([w1, w2, w3]);
    const answered = reducer(state, { type: 'SUBMIT_ANSWER', selected: w1, correct: true });
    const next     = reducer(answered, { type: 'NEXT' });

    expect(next.currentIndex).toBe(1);
    expect(next.answered).toBeNull();
    expect(next.answers).toHaveLength(1);
    expect(next.answers[0]).toEqual({ word: w1, correct: true });
  });

  it('마지막 문제: isActive = false, answers에 마지막 기록 추가', () => {
    const state    = activeState([w1]); // 단어 1개
    const answered = reducer(state, { type: 'SUBMIT_ANSWER', selected: w1, correct: true });
    const next     = reducer(answered, { type: 'NEXT' });

    expect(next.isActive).toBe(false);
    expect(next.answers).toHaveLength(1);
  });
});

// ─── RESET ────────────────────────────────────────────────────

describe('RESET', () => {
  it('hasStarted = false → isDone 조건 성립 불가', () => {
    const state    = activeState([w1]);
    const answered = reducer(state, { type: 'SUBMIT_ANSWER', selected: w1, correct: true });
    const done     = reducer(answered, { type: 'NEXT' });
    expect(done.isActive).toBe(false);

    const reset = reducer(done, { type: 'RESET' });
    expect(reset.hasStarted).toBe(false);
    expect(reset.answers).toHaveLength(0);
    expect(reset.answered).toBeNull();
  });
});
