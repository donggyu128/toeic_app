/**
 * 세 store를 조합하는 오케스트레이터
 * - 단어 종류(toeic/hsk3) 및 문제 모드(multiple/subjective) 전달
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

  useEffect(() => { storage.migrate(); }, []);

  useEffect(() => {
    const handleQuotaExceeded = () =>
      alert('저장 공간이 부족합니다. 브라우저 데이터를 정리해주세요.');
    window.addEventListener('storage-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('storage-quota-exceeded', handleQuotaExceeded);
  }, []);

  const submitAnswer = useCallback((selected, typed = '') => {
    const { currentWord, isWrongTest, sourceSetNum, currentIndex, vocabType } = test;
    if (!currentWord) return;

    const correct = test.submitAnswer(selected, typed);

    if (!isWrongTest) {
      if (!correct) wrongNote.addWrong(currentWord, vocabType);
      if (sourceSetNum && vocabType === 'toeic') progress.updateProgress(sourceSetNum, currentIndex + 1);
      if (sourceSetNum && vocabType === 'hsk3')  progress.updateHSKProgress(sourceSetNum, currentIndex + 1);
    } else {
      if (correct) wrongNote.recordCorrect(currentWord);
      else         wrongNote.recordWrong(currentWord);
    }
  }, [
    test.currentWord?.id,
    test.isWrongTest,
    test.sourceSetNum,
    test.currentIndex,
    test.vocabType,
    test.submitAnswer,
    wrongNote.addWrong,
    wrongNote.recordCorrect,
    wrongNote.recordWrong,
    progress.updateProgress,
    progress.updateHSKProgress,
  ]);

  // 오답노트 세트 시험 (10개 한 묶음)
  const startWrongSetTest = useCallback((words, questionMode = 'multiple', vocabType) => {
    if (!words || words.length === 0) return;
    // vocabType 명시 없으면 id로 추론
    const type = vocabType ?? (words[0]?.id >= 1001 ? 'hsk3' : 'toeic');
    test.startTest(words, true, questionMode, type);
  }, [test.startTest]);

  const startWrongTest = useCallback((questionMode = 'multiple') => {
    if (wrongNote.wrongNote.length === 0) return;
    const words     = wrongNote.wrongNote.map(i => i.word);
    const vocabType = words[0]?.id >= 1001 ? 'hsk3' : 'toeic';
    test.startTest(words, true, questionMode, vocabType);
  }, [wrongNote.wrongNote, test.startTest]);

  const startTest = useCallback((words, questionMode = 'multiple', vocabType = 'toeic') => {
    test.startTest(words, false, questionMode, vocabType);
  }, [test.startTest]);

  return {
    testState:       test,
    wrongNote:       wrongNote.wrongNote,
    progress:        progress.progress,
    hskProgress:     progress.hskProgress,
    startTest,
    startWrongTest,
    startWrongSetTest,
    submitAnswer,
    nextQuestion:    test.nextQuestion,
    resetTest:       test.resetTest,
    deleteWrongItem: wrongNote.deleteItem,
  };
}
