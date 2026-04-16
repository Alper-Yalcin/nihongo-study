import { describe, expect, it } from 'vitest';
import { kanaInventoryByScript } from '../data/kanaInventory';
import { KanaProgress } from '../domain/kanaProgress';
import {
  buildAdaptiveWeakCarryover,
  buildKanaProgressSummary,
  getLessonMasteryPercent
} from './progressSelectors';

const createProgressEntry = (
  itemIndex: number,
  overrides: Partial<KanaProgress> = {}
): KanaProgress => {
  const item = kanaInventoryByScript.hiragana[itemIndex];
  const nowIso = new Date('2026-04-16T10:00:00.000Z').toISOString();

  return {
    kanaId: item.id,
    script: item.script,
    state: 'learning',
    masteryScore: 2,
    recognitionScore: 2,
    typingScore: 2,
    drawingScore: 2,
    listeningScore: 2,
    timesSeen: 4,
    timesCorrect: 2,
    timesWrong: 1,
    lastSeenAt: nowIso,
    lastCorrectAt: nowIso,
    lastWrongAt: null,
    nextReviewAt: null,
    confusedWith: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    ...overrides
  };
};

describe('progressSelectors', () => {
  it('builds summary counts and due count by script', () => {
    const now = new Date('2026-04-16T12:00:00.000Z');
    const entries: KanaProgress[] = [
      createProgressEntry(0, {
        state: 'learning',
        nextReviewAt: new Date('2026-04-16T11:00:00.000Z').toISOString()
      }),
      createProgressEntry(1, {
        state: 'weak',
        nextReviewAt: null
      }),
      createProgressEntry(2, {
        state: 'mastered',
        masteryScore: 4,
        timesCorrect: 8,
        timesWrong: 0
      })
    ];

    const summary = buildKanaProgressSummary('hiragana', entries, now);

    expect(summary.script).toBe('hiragana');
    expect(summary.learningCount).toBe(1);
    expect(summary.weakCount).toBe(1);
    expect(summary.masteredCount).toBe(1);
    expect(summary.tracked).toBe(3);
    expect(summary.dueCount).toBe(1);
    expect(summary.newCount).toBe(summary.totalCount - 3);
  });

  it('computes lesson mastery percent from scoped lesson ids', () => {
    const lessonIds = [
      kanaInventoryByScript.hiragana[0].id,
      kanaInventoryByScript.hiragana[1].id
    ];

    const entries: KanaProgress[] = [
      createProgressEntry(0, { masteryScore: 4 }),
      createProgressEntry(1, { masteryScore: 2 }),
      createProgressEntry(2, { masteryScore: 0 })
    ];

    expect(getLessonMasteryPercent(lessonIds, entries)).toBe(75);
  });

  it('prioritizes adaptive weak carryover by overdue then weakness and respects exclusions', () => {
    const now = new Date('2026-04-16T12:00:00.000Z');
    const dueHeavy = createProgressEntry(0, {
      state: 'known',
      timesCorrect: 6,
      timesWrong: 1,
      masteryScore: 3,
      nextReviewAt: new Date('2026-04-11T12:00:00.000Z').toISOString()
    });
    const weakRecent = createProgressEntry(1, {
      state: 'weak',
      timesCorrect: 1,
      timesWrong: 6,
      masteryScore: 1,
      lastWrongAt: new Date('2026-04-16T11:59:00.000Z').toISOString()
    });
    const neutral = createProgressEntry(2, {
      state: 'known',
      timesCorrect: 4,
      timesWrong: 0,
      masteryScore: 3,
      nextReviewAt: null
    });

    const carryover = buildAdaptiveWeakCarryover([dueHeavy, weakRecent, neutral], {
      excludedKanaIds: [weakRecent.kanaId],
      maxCount: 2,
      now
    });

    expect(carryover).toEqual([dueHeavy.kanaId]);

    const fullCarryover = buildAdaptiveWeakCarryover([dueHeavy, weakRecent, neutral], {
      maxCount: 2,
      now
    });

    expect(fullCarryover).toHaveLength(2);
    expect(fullCarryover[0]).toBe(dueHeavy.kanaId);
    expect(fullCarryover[1]).toBe(weakRecent.kanaId);
  });
});
