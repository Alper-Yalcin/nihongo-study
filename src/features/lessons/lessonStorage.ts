import type {
  ConceptProgress,
  LessonProgressMap,
  LessonSessionNumber,
  SessionCompletionStatus,
} from './lessonTypes';

const LESSON_PROGRESS_KEY = 'kototsuna.lessons.progress';

// ─── Safe parse / write ───────────────────────────────────────────────────────

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota veya private mode — sessizce geç
  }
}

// ─── Core read / write ────────────────────────────────────────────────────────

export function readLessonProgress(): LessonProgressMap {
  if (typeof window === 'undefined') return {};
  const raw = window.localStorage.getItem(LESSON_PROGRESS_KEY);
  return safeParse<LessonProgressMap>(raw, {});
}

export function writeLessonProgress(map: LessonProgressMap): void {
  safeWrite(LESSON_PROGRESS_KEY, map);
}

// ─── Derived helpers ──────────────────────────────────────────────────────────

export function getConceptProgress(conceptId: string): ConceptProgress {
  const map = readLessonProgress();
  return (
    map[conceptId] ?? {
      conceptId,
      completedSessions: [],
    }
  );
}

export function getSessionStatus(
  conceptId: string,
  sessionNumber: LessonSessionNumber
): SessionCompletionStatus {
  const progress = getConceptProgress(conceptId);

  if (progress.completedSessions.includes(sessionNumber)) return 'complete';

  // Session 1 her zaman açık; diğerleri önceki session'ın tamamlanmasını gerektirir
  if (sessionNumber === 1) return 'available';

  const previousSession = (sessionNumber - 1) as LessonSessionNumber;
  if (progress.completedSessions.includes(previousSession)) return 'available';

  return 'locked';
}

export function markSessionComplete(
  conceptId: string,
  sessionNumber: LessonSessionNumber
): void {
  const map = readLessonProgress();
  const existing = map[conceptId] ?? { conceptId, completedSessions: [] };

  if (!existing.completedSessions.includes(sessionNumber)) {
    existing.completedSessions = [...existing.completedSessions, sessionNumber];
  }
  existing.lastSessionCompletedAt = new Date().toISOString();

  map[conceptId] = existing;
  writeLessonProgress(map);
}

export function getConceptPercentage(conceptId: string): number {
  const progress = getConceptProgress(conceptId);
  return progress.completedSessions.length * 25;
}

export function getNextAvailableSession(
  conceptId: string
): LessonSessionNumber | null {
  for (const n of [1, 2, 3, 4] as LessonSessionNumber[]) {
    const status = getSessionStatus(conceptId, n);
    if (status === 'available') return n;
  }
  return null; // hepsi complete
}

export function resetConceptProgress(conceptId: string): void {
  const map = readLessonProgress();
  delete map[conceptId];
  writeLessonProgress(map);
}
