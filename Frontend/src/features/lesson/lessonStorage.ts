import type { ConfidenceScores, ExerciseAdaptiveData, LessonResult } from './lessonTypes';

const STORAGE_KEY = 'kototsuna.lesson-progress';

interface LessonProgress {
  completedLessonIds: string[];
  lessonResults: Record<string, LessonResult>;
  adaptiveData: Record<string, ExerciseAdaptiveData>;
  confidenceHistory: ConfidenceScores[];
}

function defaultProgress(): LessonProgress {
  return {
    completedLessonIds: [],
    lessonResults: {},
    adaptiveData: {},
    confidenceHistory: [],
  };
}

function read(): LessonProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return { ...defaultProgress(), ...JSON.parse(raw) };
  } catch {
    return defaultProgress();
  }
}

function write(data: LessonProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable — silent fail
  }
}

export function isLessonCompleted(lessonId: string): boolean {
  return read().completedLessonIds.includes(lessonId);
}

export function saveLessonResult(result: LessonResult): void {
  const data = read();
  if (!data.completedLessonIds.includes(result.lessonId)) {
    data.completedLessonIds.push(result.lessonId);
  }
  data.lessonResults[result.lessonId] = result;
  data.confidenceHistory.push(result.confidenceScores);
  if (data.confidenceHistory.length > 100) data.confidenceHistory.shift();
  write(data);
}

export function getAdaptiveData(exerciseId: string): ExerciseAdaptiveData {
  const stored = read().adaptiveData[exerciseId];
  if (stored) return stored;
  return {
    exerciseId,
    lastSeen: 0,
    correctCount: 0,
    wrongCount: 0,
    easeFactor: 2.5,
    masteryLevel: 0,
  };
}

export function updateAdaptiveData(
  exerciseId: string,
  correct: boolean
): void {
  const data = read();
  const entry = data.adaptiveData[exerciseId] ?? {
    exerciseId,
    lastSeen: 0,
    correctCount: 0,
    wrongCount: 0,
    easeFactor: 2.5,
    masteryLevel: 0 as const,
  };

  entry.lastSeen = Date.now();
  if (correct) {
    entry.correctCount += 1;
    entry.easeFactor = Math.min(3.0, entry.easeFactor + 0.1);
  } else {
    entry.wrongCount += 1;
    entry.easeFactor = Math.max(1.3, entry.easeFactor - 0.2);
  }

  const total = entry.correctCount + entry.wrongCount;
  const accuracy = total > 0 ? entry.correctCount / total : 0;
  entry.masteryLevel = accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : accuracy >= 0.4 ? 1 : 0;

  data.adaptiveData[exerciseId] = entry;
  write(data);
}

export function getLessonResult(lessonId: string): LessonResult | null {
  return read().lessonResults[lessonId] ?? null;
}

export function getCompletedLessonIds(): string[] {
  return read().completedLessonIds;
}
