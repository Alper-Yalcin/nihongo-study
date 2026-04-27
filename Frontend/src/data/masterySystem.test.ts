import { describe, expect, it } from 'vitest';
import {
  computeMastery,
  computeMasteryDelta,
  computeMasteryDeltasForSession,
  isWeak,
  masteryBucket
} from './masterySystem';
import { KanaProgress } from '../features/kana/domain/kanaProgress';

const baseProgress = (overrides: Partial<KanaProgress> = {}): KanaProgress => ({
  kanaId: 'hira-a',
  script: 'hiragana',
  state: 'new',
  masteryScore: 0,
  recognitionScore: 0,
  typingScore: 0,
  drawingScore: 0,
  listeningScore: 0,
  timesSeen: 0,
  timesCorrect: 0,
  timesWrong: 0,
  lastSeenAt: null,
  lastCorrectAt: null,
  lastWrongAt: null,
  nextReviewAt: null,
  confusedWith: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

describe('computeMastery', () => {
  it('returns 0 for null/undefined', () => {
    expect(computeMastery(null)).toBe(0);
    expect(computeMastery(undefined)).toBe(0);
  });

  it('returns 0 for fresh kana with no exposure', () => {
    expect(computeMastery(baseProgress())).toBe(0);
  });

  it('rewards accuracy + exposure + recency together', () => {
    const fresh = baseProgress({
      timesSeen: 12,
      timesCorrect: 12,
      lastSeenAt: new Date().toISOString()
    });
    expect(computeMastery(fresh)).toBe(100);
  });

  it('penalises confusable bonds', () => {
    const clean = baseProgress({
      timesSeen: 12,
      timesCorrect: 12,
      lastSeenAt: new Date().toISOString()
    });
    const confused = baseProgress({
      ...clean,
      confusedWith: ['hira-i', 'hira-u', 'hira-e', 'hira-o', 'hira-ka']
    });
    expect(computeMastery(confused)).toBeLessThan(computeMastery(clean));
  });

  it('decays with old lastSeenAt', () => {
    const recent = baseProgress({
      timesSeen: 8,
      timesCorrect: 7,
      lastSeenAt: new Date().toISOString()
    });
    const stale = baseProgress({
      ...recent,
      lastSeenAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    });
    expect(computeMastery(stale)).toBeLessThan(computeMastery(recent));
  });

  it('respects persisted masteryScore as a floor', () => {
    const p = baseProgress({ masteryScore: 80 });
    expect(computeMastery(p)).toBe(80);
  });
});

describe('masteryBucket / isWeak', () => {
  it('buckets at boundaries', () => {
    expect(masteryBucket(0)).toBe('cold');
    expect(masteryBucket(15)).toBe('learning');
    expect(masteryBucket(40)).toBe('warm');
    expect(masteryBucket(70)).toBe('strong');
    expect(masteryBucket(90)).toBe('mastered');
  });
  it('isWeak < 40', () => {
    expect(isWeak(39)).toBe(true);
    expect(isWeak(40)).toBe(false);
  });
});

describe('computeMasteryDelta(s)', () => {
  it('returns positive delta when after improves', () => {
    const before = baseProgress({ timesSeen: 4, timesCorrect: 3 });
    const after = baseProgress({
      timesSeen: 6,
      timesCorrect: 5,
      lastSeenAt: new Date().toISOString()
    });
    const d = computeMasteryDelta(before, after, 'hira-a');
    expect(d.kanaId).toBe('hira-a');
    expect(d.delta).toBeGreaterThan(0);
    expect(d.after).toBeGreaterThan(d.before);
  });

  it('deduplicates ids when computing session deltas', () => {
    const map: Record<string, KanaProgress> = {
      a: baseProgress({ kanaId: 'a', timesSeen: 6, timesCorrect: 5, lastSeenAt: new Date().toISOString() }),
      b: baseProgress({ kanaId: 'b', timesSeen: 3, timesCorrect: 2, lastSeenAt: new Date().toISOString() })
    };
    const ds = computeMasteryDeltasForSession(['a', 'b', 'a'], () => null, (id) => map[id]);
    expect(ds.length).toBe(2);
    expect(ds.map((d) => d.kanaId).sort()).toEqual(['a', 'b']);
  });
});
