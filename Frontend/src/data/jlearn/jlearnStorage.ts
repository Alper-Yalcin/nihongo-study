import { JLearnUserState, getJLearnUserState, setJLearnUserState } from '../../features/jlearn/debug/debugStore';

// ─── Storage keys ────────────────────────────────────────────────────────────

const PROGRESS_KEY = 'kototsuna.jlearn.progress';
const VOCAB_KEY = 'kototsuna.jlearn.vocab-progress';

// ─── Schema: Mission Progress ─────────────────────────────────────────────────

export interface MissionProgress {
  completedStepIds: string[];
  completedUnitIds: string[];
  completedLevelIds: string[];
  earnedBadgeIds: string[];
  lastUpdatedAt: string;
}

const defaultProgress = (): MissionProgress => ({
  completedStepIds: [],
  completedUnitIds: [],
  completedLevelIds: [],
  earnedBadgeIds: [],
  lastUpdatedAt: new Date().toISOString(),
});

// ─── Schema: Vocab Progress (SRS) ────────────────────────────────────────────

export type MasteryLevel = 0 | 1 | 2 | 3 | 4;

export interface VocabProgressRecord {
  vocabId: string;
  masteryLevel: MasteryLevel;
  errorCount: number;
  lastSeenAt: string;
  nextReviewAt: string;
  seenInMissions: string[];
  confusedWith?: string[];
}

export type VocabProgressMap = Record<string, VocabProgressRecord>;

// ─── Safe parse helper ────────────────────────────────────────────────────────

function safeParse<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
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
    console.warn(`[jlearnStorage] Failed to write key "${key}"`);
  }
}

// ─── Progress helpers ─────────────────────────────────────────────────────────

export function readProgress(): MissionProgress {
  return {
    ...defaultProgress(),
    ...safeParse<Partial<MissionProgress>>(PROGRESS_KEY, {}),
  };
}

export function writeProgress(p: MissionProgress): void {
  safeWrite(PROGRESS_KEY, { ...p, lastUpdatedAt: new Date().toISOString() });
}

// ─── Vocab progress helpers ───────────────────────────────────────────────────

export function readVocab(): VocabProgressMap {
  return safeParse<VocabProgressMap>(VOCAB_KEY, {});
}

export function writeVocab(v: VocabProgressMap): void {
  safeWrite(VOCAB_KEY, v);
}

// ─── User state helpers (delegates to debugStore) ────────────────────────────

export function readUserState(): JLearnUserState {
  return getJLearnUserState();
}

export function writeUserState(u: JLearnUserState): void {
  setJLearnUserState(u);
}

// ─── Re-export type so callers have one import ────────────────────────────────

export type { JLearnUserState };
