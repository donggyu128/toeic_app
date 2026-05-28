/**
 * 세 store를 조합하는 오케스트레이터
 * App 진입점에서만 사용 — store 간 상호작용 담당
 */
import { useCallback, useEffect } from 'react';
import { useTestStore }      from './useTestStore.js';
import { useWrongNoteStore } from './useWrongNoteStore.js';
import { useProgressStore }  from './useProgressStore.js';
import { storage } from '../services/storage.js';

export function useAppStore() {
  const test      = useTestStore();
  const wrongNote = useWrongNoteStore();
  const progress  = useProgressStore();

  // 앱 마운트 시 마이그레이션 실행 (실제 로직은 storage.js에 위임)
  useEffect(() => { storage.migrate(); }, []);

  // localStorage 저장 실패 시 사용자 알림
  // TODO: alert → 커스텀 토스트 컴포넌트로 교체
  useEffect(() => {
    const handleQuotaExceeded = () =>
      alert('저장 공간이 부족합니다. 브라우저 데이터를 정리해주세요.');
    window.addEventListener('storage-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('storage-quota-exceeded', handleQuotaExceeded);
  }, []);

  /**
   * 정답 판별은 test.submitAnswer가 담당 (반환값으로 correct 수령)
   * deps: 원시값과 안정화된 함수 참조만 포함
   */
  const submitAnswer = useCallback((selected) => {
    const { currentWord, isWrongTest, sourceSetNum, currentIndex } = test;
    if (!currentWord) return;

    const correct = test.submitAnswer(selected);

    if (!isWrongTest) {
      if (!correct) wrongNote.addWrong(currentWord);
      if (sourceSetNum) progress.updateProgress(sourceSetNum, currentIndex + 1);
    } else {
      if (correct) wrongNote.recordCorrect(currentWord);
      else         wrongNote.recordWrong(currentWord);
    }
  }, [
    test.currentWord?.id,
    test.isWrongTest,
    test.sourceSetNum,
    test.currentIndex,
    test.submitAnswer,
    wrongNote.addWrong,
    wrongNote.recordCorrect,
    wrongNote.recordWrong,
    progress.updateProgress,
  ]);

  const startWrongTest = useCallback(() => {
    if (wrongNote.wrongNote.length === 0) return;
    test.startTest(wrongNote.wrongNote.map(i => i.word), true);
  }, [wrongNote.wrongNote, test.startTest]);

  return {
    testState:       test,
    wrongNote:       wrongNote.wrongNote,
    progress:        progress.progress,
    startTest:       test.startTest,
    startWrongTest,
    submitAnswer,
    nextQuestion:    test.nextQuestion,
    resetTest:       test.resetTest,
    deleteWrongItem: wrongNote.deleteItem,
  };
}
