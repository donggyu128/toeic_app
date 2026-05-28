import { describe, expect, it, beforeEach, vi } from 'vitest';

// localStorage mock
const store = {};
const localStorageMock = {
  getItem:    (key)      => store[key] ?? null,
  setItem:    (key, val) => { store[key] = String(val); },
  removeItem: (key)      => { delete store[key]; },
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });

import { storage } from './storage.js';

const VALID_ITEM = { word: { id: 1, english: 'abandon', korean: '버리다' }, wrongCount: 1, consecutiveCorrect: 0 };

beforeEach(() => {
  Object.keys(store).forEach(k => delete store[k]);
  vi.clearAllMocks();
});

describe('getWrongNote', () => {
  it('초기 상태 → 빈 배열', () => {
    expect(storage.getWrongNote()).toEqual([]);
  });

  it('손상된 항목 필터링', () => {
    store['toeic_wrong_note'] = JSON.stringify([{ word: null }, VALID_ITEM]);
    expect(storage.getWrongNote()).toHaveLength(1);
  });

  it('음수 wrongCount → 0으로 정규화', () => {
    store['toeic_wrong_note'] = JSON.stringify([{ ...VALID_ITEM, wrongCount: -3, consecutiveCorrect: -1 }]);
    const [item] = storage.getWrongNote();
    expect(item.wrongCount).toBe(0);
    expect(item.consecutiveCorrect).toBe(0);
  });

  it('JSON 파싱 실패 → 빈 배열', () => {
    store['toeic_wrong_note'] = 'INVALID{{';
    expect(storage.getWrongNote()).toEqual([]);
  });
});

describe('getProgress', () => {
  it('초기 상태 → 빈 객체', () => {
    expect(storage.getProgress()).toEqual({});
  });

  it('배열이 저장된 경우 → 빈 객체로 복구', () => {
    store['toeic_progress'] = JSON.stringify([]);
    expect(storage.getProgress()).toEqual({});
  });
});

describe('migrate', () => {
  it('버전 없음 → 마이그레이션 실행 후 버전 1 저장', () => {
    expect(storage.getVersion()).toBe(0);
    storage.migrate();
    expect(storage.getVersion()).toBe(1);
  });

  it('최신 버전 → 재실행하지 않음', () => {
    storage.migrate();
    const spy = vi.spyOn(localStorageMock, 'setItem');
    storage.migrate();
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('clear', () => {
  it('clear 후 모든 데이터 삭제', () => {
    storage.saveWrongNote([VALID_ITEM]);
    storage.saveProgress({ 1: 5 });
    storage.migrate();
    storage.clear();
    expect(storage.getWrongNote()).toEqual([]);
    expect(storage.getProgress()).toEqual({});
    expect(storage.getVersion()).toBe(0);
  });
});
