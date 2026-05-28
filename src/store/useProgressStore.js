import { useState, useCallback } from 'react';
import { storage } from '../services/storage.js';

export function useProgressStore() {
  const [progress,    setProgress]    = useState(() => storage.getProgress());
  const [hskProgress, setHskProgress] = useState(() => storage.getHSKProgress());

  const updateProgress = useCallback((setNum, solvedCount) => {
    setProgress(prev => {
      const next = { ...prev, [setNum]: Math.max(prev[setNum] ?? 0, solvedCount) };
      storage.saveProgress(next);
      return next;
    });
  }, []);

  const updateHSKProgress = useCallback((setNum, solvedCount) => {
    setHskProgress(prev => {
      const next = { ...prev, [setNum]: Math.max(prev[setNum] ?? 0, solvedCount) };
      storage.saveHSKProgress(next);
      return next;
    });
  }, []);

  return { progress, hskProgress, updateProgress, updateHSKProgress };
}
