import { JLearnUserState, getJLearnUserState, setJLearnUserState } from '../../features/jlearn/debug/debugStore';
import { LearningEvent, WeakTopic } from './jlearnTypes';

// ─── Storage keys ────────────────────────────────────────────────────────────

const PROGRESS_KEY = 'kototsuna.jlearn.progress';
const VOCAB_KEY = 'kototsuna.jlearn.vocab-progress';
const LEARNING_EVENTS_KEY = 'kototsuna.jlearn.learning-events';
const WEAK_TOPICS_KEY = 'kototsuna.jlearn.weak-topics';

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
export type LearningEventLog = LearningEvent[];
export type WeakTopicMap = Record<string, WeakTopic>;

interface VocabAttemptUpdate {
  vocabId: string;
  missionId: string;
  wasCorrect: boolean;
  seenAt?: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const REVIEW_INTERVALS_BY_MASTERY: Record<MasteryLevel, number> = {
  0: 0,
  1: 1,
  2: 3,
  3: 7,
  4: 30,
};

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

export function readLearningEvents(): LearningEventLog {
  return safeParse<LearningEventLog>(LEARNING_EVENTS_KEY, []);
}

export function writeLearningEvents(events: LearningEventLog): void {
  safeWrite(LEARNING_EVENTS_KEY, events.slice(-500));
}

export function readWeakTopics(): WeakTopicMap {
  return safeParse<WeakTopicMap>(WEAK_TOPICS_KEY, {});
}

export function writeWeakTopics(topics: WeakTopicMap): void {
  safeWrite(WEAK_TOPICS_KEY, topics);
}

export function deriveWeakTopicsFromEvents(events: LearningEvent[]): WeakTopicMap {
  const byTarget = new Map<string, LearningEvent[]>();

  for (const event of events) {
    const key = `${event.targetType}:${event.targetId}`;
    byTarget.set(key, [...(byTarget.get(key) ?? []), event]);
  }

  const topics: WeakTopicMap = {};

  for (const [key, targetEvents] of byTarget) {
    const recent = targetEvents.slice(-8);
    const latest = recent[recent.length - 1];
    if (!latest) continue;

    const wrongCount = recent.filter((event) => !event.correct).length;
    const hintCount = recent.filter((event) => event.hintUsed).length;
    const slowCount = recent.filter((event) => event.latencyMs > 12000).length;
    const reason =
      wrongCount >= 3
        ? 'accuracy-low'
        : hintCount >= 3
          ? 'hint-dependence'
          : slowCount >= 3
            ? 'slow-response'
            : null;

    if (!reason) continue;

    topics[key] = {
      targetType: latest.targetType,
      targetId: latest.targetId,
      reason,
      severity: Math.min(3, Math.max(1, wrongCount + hintCount >= 5 ? 3 : wrongCount >= 3 ? 2 : 1)) as 1 | 2 | 3,
      lastSeenAt: latest.createdAt,
    };
  }

  return topics;
}

export function appendLearningEvents(events: LearningEvent[]): void {
  if (events.length === 0) return;
  const nextEvents = [...readLearningEvents(), ...events].slice(-500);
  writeLearningEvents(nextEvents);
  writeWeakTopics(deriveWeakTopicsFromEvents(nextEvents));
}

export function deriveVocabNextReviewAt(
  masteryLevel: MasteryLevel,
  seenAt: string
): string {
  const baseMs = new Date(seenAt).getTime();
  const offsetDays = REVIEW_INTERVALS_BY_MASTERY[masteryLevel];
  return new Date(baseMs + offsetDays * DAY_MS).toISOString();
}

export function validateVocabProgress(vocab: VocabProgressMap): string[] {
  const issues: string[] = [];

  for (const [vocabId, entry] of Object.entries(vocab)) {
    if (entry.vocabId !== vocabId) {
      issues.push(`${vocabId}: key/vocabId mismatch`);
    }

    if (!Number.isInteger(entry.masteryLevel) || entry.masteryLevel < 0 || entry.masteryLevel > 4) {
      issues.push(`${vocabId}: invalid masteryLevel ${entry.masteryLevel}`);
    }

    if (!Number.isInteger(entry.errorCount) || entry.errorCount < 0) {
      issues.push(`${vocabId}: invalid errorCount ${entry.errorCount}`);
    }

    if (Number.isNaN(Date.parse(entry.lastSeenAt))) {
      issues.push(`${vocabId}: invalid lastSeenAt ${entry.lastSeenAt}`);
    }

    if (Number.isNaN(Date.parse(entry.nextReviewAt))) {
      issues.push(`${vocabId}: invalid nextReviewAt ${entry.nextReviewAt}`);
    }

    if (!Array.isArray(entry.seenInMissions)) {
      issues.push(`${vocabId}: seenInMissions must be an array`);
    }
  }

  return issues;
}

export function updateVocabProgress(
  current: VocabProgressMap,
  update: VocabAttemptUpdate
): VocabProgressMap {
  const seenAt = update.seenAt ?? new Date().toISOString();
  const existing = current[update.vocabId];
  const nextSeenInMissions = existing?.seenInMissions.includes(update.missionId)
    ? existing.seenInMissions
    : [...(existing?.seenInMissions ?? []), update.missionId];

  const nextMastery = update.wasCorrect
    ? Math.min(4, (existing?.masteryLevel ?? 0) + 1)
    : Math.max(0, (existing?.masteryLevel ?? 0) - 1);

  const nextRecord: VocabProgressRecord = {
    vocabId: update.vocabId,
    masteryLevel: nextMastery as MasteryLevel,
    errorCount: (existing?.errorCount ?? 0) + (update.wasCorrect ? 0 : 1),
    lastSeenAt: seenAt,
    nextReviewAt: deriveVocabNextReviewAt(nextMastery as MasteryLevel, seenAt),
    seenInMissions: nextSeenInMissions,
    confusedWith: existing?.confusedWith,
  };

  return {
    ...current,
    [update.vocabId]: nextRecord,
  };
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
