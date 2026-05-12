/**
 * masterySession — oturum başına mastery delta snapshot store'u.
 *
 * sessionRunCoordinator iki uçtan çağırır:
 *   - syncProgressFromSessionAnswer her cevapta `captureMasteryBefore`
 *     (yalnız ilk seferde kayıt yapar) ve `captureMasteryAfter` (en
 *     güncel halini saklar) çağırır.
 *   - completeAndPersistSession `finalizeMasterySession(sessionId)`
 *     çağırarak deltaları hesaplar ve `kototsuna:mastery-delta`
 *     CustomEvent'i ile yayınlar; sonra snapshot'ı temizler.
 *
 * Day 4 DoD: oturum sonu MasteryDeltaToast bu olayı dinler ve
 * "ね 72 → 81 (+9)" gibi listeyi gösterir.
 */

import { KanaProgress } from '../../features/kana/domain/kanaProgress';
import { computeMastery, MasteryDelta } from '../../learn/data/masterySystem';

const EVENT_NAME = 'kototsuna:mastery-delta';

interface SnapshotEntry {
  before: KanaProgress;
  after: KanaProgress;
}

const snapshots: Map<string, Map<string, SnapshotEntry>> = new Map();

const getOrCreate = (sessionId: string): Map<string, SnapshotEntry> => {
  let map = snapshots.get(sessionId);
  if (!map) {
    map = new Map();
    snapshots.set(sessionId, map);
  }
  return map;
};

export const captureMasteryBefore = (
  sessionId: string,
  itemId: string,
  before: KanaProgress
): void => {
  const map = getOrCreate(sessionId);
  if (!map.has(itemId)) {
    map.set(itemId, { before, after: before });
  }
};

export const captureMasteryAfter = (
  sessionId: string,
  itemId: string,
  after: KanaProgress
): void => {
  const map = getOrCreate(sessionId);
  const entry = map.get(itemId);
  if (entry) {
    entry.after = after;
  } else {
    map.set(itemId, { before: after, after });
  }
};

export interface MasteryDeltaEventDetail {
  sessionId: string;
  deltas: MasteryDelta[];
  improvedCount: number;
  totalDelta: number;
}

export const subscribeMasteryDelta = (
  callback: (detail: MasteryDeltaEventDetail) => void
): (() => void) => {
  if (typeof window === 'undefined') return () => undefined;
  const handler = (e: Event) =>
    callback((e as CustomEvent<MasteryDeltaEventDetail>).detail);
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
};

export const finalizeMasterySession = (sessionId: string): MasteryDeltaEventDetail | null => {
  const map = snapshots.get(sessionId);
  if (!map || map.size === 0) {
    snapshots.delete(sessionId);
    return null;
  }

  const deltas: MasteryDelta[] = [];
  let totalDelta = 0;
  let improvedCount = 0;

  for (const [kanaId, entry] of map.entries()) {
    const before = computeMastery(entry.before);
    const after = computeMastery(entry.after);
    const delta = after - before;
    deltas.push({ kanaId, before, after, delta });
    totalDelta += delta;
    if (delta > 0) improvedCount += 1;
  }

  // En çok ilerleyenler önde
  deltas.sort((a, b) => b.delta - a.delta);

  snapshots.delete(sessionId);

  const detail: MasteryDeltaEventDetail = {
    sessionId,
    deltas,
    improvedCount,
    totalDelta
  };

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<MasteryDeltaEventDetail>(EVENT_NAME, { detail }));
  }

  return detail;
};

export const clearMasterySession = (sessionId: string): void => {
  snapshots.delete(sessionId);
};

// Test/debug
export const __peekMasterySnapshots = () => snapshots;
