const KEYS = {
  WRONG_NOTE: 'toeic_wrong_note',
  PROGRESS:   'toeic_progress',
};

export const storage = {
  getWrongNote() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.WRONG_NOTE) || '[]');
    } catch {
      return [];
    }
  },

  saveWrongNote(items) {
    try {
      localStorage.setItem(KEYS.WRONG_NOTE, JSON.stringify(items));
    } catch (e) {
      console.warn('오답노트 저장 실패:', e);
    }
  },

  getProgress() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.PROGRESS) || '{}');
    } catch {
      return {};
    }
  },

  saveProgress(data) {
    try {
      localStorage.setItem(KEYS.PROGRESS, JSON.stringify(data));
    } catch (e) {
      console.warn('진행률 저장 실패:', e);
    }
  },

  // 전체 데이터 초기화
  clear() {
    localStorage.removeItem(KEYS.WRONG_NOTE);
    localStorage.removeItem(KEYS.PROGRESS);
  },
};