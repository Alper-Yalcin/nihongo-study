/**
 * masterySystem — kana başına 0-100 mastery skoru hesaplama.
 *
 * Sprint 1 Day 4: Pure-function modül. Persist edilmiş `KanaProgress`
 * üzerinden mastery'yi türetir. Mevcut `progress.masteryScore` alanı
 * varsa onu base alır, yoksa formülle hesaplar. UI tarafı bu modülü
 * çağırarak heatmap/delta gösterimini yapar (LettersPage Sprint 2 Day 4).
 *
 * Formül (basit ve şeffaf):
 *   accuracy   = timesCorrect / max(timesSeen, 1)
 *   exposure   = min(1, timesSeen / 12)              — 12 görüş = tam görülmüş
 *   recencyBoost = recency tazeliği (son 7 gün max)
 *
 *   raw = (0.55 * accuracy + 0.30 * exposure + 0.15 * recencyBoost)
 *   mastery = round(clamp(raw * 100, 0, 100))
 *
 * Confused-with cezası: confusedWith.length > 0 ise küçük penalty.
 *
 * Persist edilmiş `progress.masteryScore` mevcutsa (>= 0) — kanıt
 * olarak kabul edilir; iki değerin maksimumunu alırız (geriye
 * uyumluluk).
 */

import { KanaProgress } from '../../features/kana/domain/kanaProgress';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const FULL_EXPOSURE_AT = 12;

const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

const recencyFactor = (lastSeenAt: string | null): number => {
  if (!lastSeenAt) return 0;
  const ts = Date.parse(lastSeenAt);
  if (Number.isNaN(ts)) return 0;
  const elapsed = Date.now() - ts;
  if (elapsed <= 0) return 1;
  if (elapsed >= SEVEN_DAYS_MS) return 0;
  return 1 - elapsed / SEVEN_DAYS_MS;
};

export const computeMastery = (progress: KanaProgress | null | undefined): number => {
  if (!progress) return 0;

  const seen = Math.max(0, progress.timesSeen);
  const correct = Math.max(0, progress.timesCorrect);
  const accuracy = seen === 0 ? 0 : clamp01(correct / seen);
  const exposure = clamp01(seen / FULL_EXPOSURE_AT);
  const recency = recencyFactor(progress.lastSeenAt);

  let raw = 0.55 * accuracy + 0.30 * exposure + 0.15 * recency;

  // Karışan kana cezası — her bağ -2 puan, max -10
  const confusedPenalty = Math.min(0.10, (progress.confusedWith?.length ?? 0) * 0.02);
  raw = Math.max(0, raw - confusedPenalty);

  const formulaMastery = Math.round(clamp01(raw) * 100);

  // Geriye uyumluluk: persist edilmiş değer varsa max al
  const persisted =
    typeof progress.masteryScore === 'number' && progress.masteryScore > 0
      ? Math.round(progress.masteryScore)
      : 0;

  return Math.max(formulaMastery, Math.min(100, persisted));
};

export type MasteryBucket = 'cold' | 'learning' | 'warm' | 'strong' | 'mastered';

export const masteryBucket = (mastery: number): MasteryBucket => {
  if (mastery >= 90) return 'mastered';
  if (mastery >= 70) return 'strong';
  if (mastery >= 40) return 'warm';
  if (mastery >= 15) return 'learning';
  return 'cold';
};

export const isWeak = (mastery: number): boolean => mastery < 40;

export interface MasteryDelta {
  kanaId: string;
  before: number;
  after: number;
  delta: number;
}

export const computeMasteryDelta = (
  before: KanaProgress | null | undefined,
  after: KanaProgress | null | undefined,
  kanaId: string
): MasteryDelta => {
  const b = computeMastery(before);
  const a = computeMastery(after);
  return { kanaId, before: b, after: a, delta: a - b };
};

export const computeMasteryDeltasForSession = (
  itemIds: string[],
  getBefore: (id: string) => KanaProgress | null | undefined,
  getAfter: (id: string) => KanaProgress | null | undefined
): MasteryDelta[] => {
  const seen = new Set<string>();
  const out: MasteryDelta[] = [];
  for (const id of itemIds) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(computeMasteryDelta(getBefore(id), getAfter(id), id));
  }
  return out;
};
