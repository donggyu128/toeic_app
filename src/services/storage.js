/**
 * localStorage 추상화 레이어
 * 저장소 교체 시 이 파일만 수정하면 됨
 */

const KEYS = {
  WRONG_NOTE: 'toeic_wrong_note',
  PROGRESS:   'toeic_progress',
  VERSION:    'toeic_schema_version',
};

const SCHEMA_VERSION = 1;

/**
 * 버전별 마이그레이션 함수
 * 스키마 변경 시 여기에만 추가: { 2: () => { ... } }
 */
const MIGRATIONS = {};

// ─── 내부 유틸 ────────────────────────────────────────────────

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
    // 저장 실패 이벤트 발행 — App에서 구독해 사용자에게 알림
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('storage-quota-exceeded', { detail: { key } }));
    }
    return false;
  }
}

// ─── 데이터 정규화 (손상된 localStorage 데이터 방어) ──────────

function normalizeWrongNote(data) {
  if (!Array.isArray(data)) return [];
  return data
    .filter(item => item?.word?.id != null && item?.word?.english && item?.word?.korean)
    .map(item => ({
      word:               item.word,
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

// ─── 공개 API ─────────────────────────────────────────────────

export const storage = {
  getWrongNote:  ()     => normalizeWrongNote(safeGet(KEYS.WRONG_NOTE, [])),
  saveWrongNote: (data) => safeSet(KEYS.WRONG_NOTE, normalizeWrongNote(data)),
  getProgress:   ()     => normalizeProgress(safeGet(KEYS.PROGRESS, {})),
  saveProgress:  (data) => safeSet(KEYS.PROGRESS, normalizeProgress(data)),
  getVersion:    ()     => safeGet(KEYS.VERSION, 0),

  /**
   * 버전을 순서대로 밟아 마이그레이션 실행
   * this 대신 내부 함수 직접 호출 — 구조분해 사용 시에도 안전
   */
  migrate() {
    const current = safeGet(KEYS.VERSION, 0);
    if (current >= SCHEMA_VERSION) return;

    for (let v = current + 1; v <= SCHEMA_VERSION; v++) {
      if (!MIGRATIONS[v]) continue;
      try {
        MIGRATIONS[v]();
      } catch (e) {
        console.error(`[storage] v${v} 마이그레이션 실패:`, e);
        return; // 실패 시 중단 — 버전 번호 올리지 않음
      }
    }
    safeSet(KEYS.VERSION, SCHEMA_VERSION);
  },

  clear() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },
};
