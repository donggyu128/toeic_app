import { useState, useCallback } from 'react';
import { storage } from '../services/storage.js';

const CONSECUTIVE_CORRECT_TO_REMOVE = 3;

export function useWrongNoteStore() {
  const [wrongNote, setWrongNote] = useState(() => storage.getWrongNote());

  const update = useCallback((fn) => {
    setWrongNote(prev => {
      const next = fn(prev);
      storage.saveWrongNote(next);
      return next;
    });
  }, []);

  const addWrong = useCallback((word, vocabType = 'toeic') => {
    update(prev => {
      const idx = prev.findIndex(i => i.word.id === word.id);
      if (idx >= 0) {
        return prev.map((item, i) =>
          i === idx ? { ...item, wrongCount: item.wrongCount + 1, consecutiveCorrect: 0 } : item,
        );
      }
      return [...prev, { word, vocabType: vocabType ?? (word.id >= 1001 ? 'hsk3' : 'toeic'), wrongCount: 1, consecutiveCorrect: 0 }];
    });
  }, [update]);

  const recordCorrect = useCallback((word) => {
    update(prev => {
      const idx = prev.findIndex(i => i.word.id === word.id);
      if (idx < 0) return prev;
      const newConsec = prev[idx].consecutiveCorrect + 1;
      if (newConsec >= CONSECUTIVE_CORRECT_TO_REMOVE) {
        return prev.filter((_, i) => i !== idx);
      }
      return prev.map((item, i) =>
        i === idx ? { ...item, consecutiveCorrect: newConsec } : item,
      );
    });
  }, [update]);

  const recordWrong = useCallback((word) => {
    update(prev => {
      const idx = prev.findIndex(i => i.word.id === word.id);
      if (idx < 0) return prev;
      return prev.map((item, i) =>
        i === idx ? { ...item, wrongCount: item.wrongCount + 1, consecutiveCorrect: 0 } : item,
      );
    });
  }, [update]);

  const deleteItem = useCallback((wordId) => {
    update(prev => prev.filter(i => i.word.id !== wordId));
  }, [update]);

  return { wrongNote, addWrong, recordCorrect, recordWrong, deleteItem };
}
