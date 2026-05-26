const KEYS = {
  WRONG_NOTE: 'toeic_wrong_note',
  PROGRESS:   'toeic_progress',
};

export const storage = {
  getWrongNote() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.WRONG_NOTE) || '[]');
    } catch { return []; }
  },
  saveWrongNote(items) {
    localStorage.setItem(KEYS.WRONG_NOTE, JSON.stringify(items));
  },
  getProgress() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.PROGRESS) || '{}');
    } catch { return {}; }
  },
  saveProgress(data) {
    localStorage.setItem(KEYS.PROGRESS, JSON.stringify(data));
  },
};
