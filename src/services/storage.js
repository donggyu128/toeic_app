/**
 * localStorage 추상화 레이어
 * TOEIC / HSK3 / 오답노트 통합 관리
 */

const KEYS = {
  WRONG_NOTE:   'toeic_wrong_note',
  PROGRESS:     'toeic_progress',
  HSK_PROGRESS: 'hsk3_progress',
  VERSION:      'toeic_schema_version',
};

const SCHEMA_VERSION = 1;
const MIGRATIONS = {};

function safeGet(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`[storage] 저장 실패 (${key}):`, e);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('storage-quota-exceeded', { detail: { key } }));
    }
    return false;
  }
}

// HSK3 단어도 허용 (chinese 필드)
function normalizeWrongNote(data) {
  if (!Array.isArray(data)) return [];
  return data
    .filter(item => item?.word?.id != null && item?.word?.korean)
    .map(item => ({
      word:               item.word,
      vocabType:          item.vocabType ?? (item.word.id >= 1001 ? 'hsk3' : 'toeic'),
      wrongCount:         Math.max(0, Number.isFinite(item.wrongCount)         ? item.wrongCount         : 0),
      consecutiveCorrect: Math.max(0, Number.isFinite(item.consecutiveCorrect) ? item.consecutiveCorrect : 0),
    }));
}

function normalizeProgress(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, Math.max(0, Number.isFinite(v) ? v : 0)]),
  );
}

export const storage = {
  getWrongNote:    ()     => normalizeWrongNote(safeGet(KEYS.WRONG_NOTE, [])),
  saveWrongNote:   (data) => safeSet(KEYS.WRONG_NOTE, normalizeWrongNote(data)),
  getProgress:     ()     => normalizeProgress(safeGet(KEYS.PROGRESS, {})),
  saveProgress:    (data) => safeSet(KEYS.PROGRESS, normalizeProgress(data)),
  getHSKProgress:  ()     => normalizeProgress(safeGet(KEYS.HSK_PROGRESS, {})),
  saveHSKProgress: (data) => safeSet(KEYS.HSK_PROGRESS, normalizeProgress(data)),
  getVersion:      ()     => safeGet(KEYS.VERSION, 0),

  migrate() {
    const current = safeGet(KEYS.VERSION, 0);
    if (current >= SCHEMA_VERSION) return;
    for (let v = current + 1; v <= SCHEMA_VERSION; v++) {
      if (!MIGRATIONS[v]) continue;
      try { MIGRATIONS[v](); } catch (e) {
        console.error(`[storage] v${v} 마이그레이션 실패:`, e);
        return;
      }
    }
    safeSet(KEYS.VERSION, SCHEMA_VERSION);
  },

  clear() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },
};
