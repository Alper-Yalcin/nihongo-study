/**
 * danSystem — kyū / dan rütbe sistemi (10. kyū → 1. kyū → 1. dan → ...).
 * Kaynak: hanabira (XP) + streak gün sayısı kombinasyonu.
 * Plan: streak ve XP birlikte rütbe yükseltir; sadece streak gerilemez (saygı).
 *
 * Eşikler manuel kalibre — gerçek metriklerle Sprint 4 öncesi ayarlanabilir.
 */

export type DanGrade = {
  rank: string;            // "10. kyū", "5. kyū", "1. dan"
  label: string;           // kısa: "10°"
  minHanabira: number;
  minStreakDays: number;
};

const KYU_THRESHOLDS: { kyu: number; minHanabira: number; minStreakDays: number }[] = [
  { kyu: 10, minHanabira: 0,    minStreakDays: 0 },
  { kyu: 9,  minHanabira: 200,  minStreakDays: 3 },
  { kyu: 8,  minHanabira: 600,  minStreakDays: 7 },
  { kyu: 7,  minHanabira: 1400, minStreakDays: 14 },
  { kyu: 6,  minHanabira: 2800, minStreakDays: 21 },
  { kyu: 5,  minHanabira: 5000, minStreakDays: 30 },
  { kyu: 4,  minHanabira: 8000, minStreakDays: 45 },
  { kyu: 3,  minHanabira: 12000, minStreakDays: 60 },
  { kyu: 2,  minHanabira: 18000, minStreakDays: 90 },
  { kyu: 1,  minHanabira: 26000, minStreakDays: 120 }
];

const DAN_THRESHOLDS: { dan: number; minHanabira: number; minStreakDays: number }[] = [
  { dan: 1, minHanabira: 36000, minStreakDays: 150 },
  { dan: 2, minHanabira: 50000, minStreakDays: 200 },
  { dan: 3, minHanabira: 70000, minStreakDays: 270 }
];

export interface DanInfo {
  kind: 'kyu' | 'dan';
  level: number;
  rank: string;
  label: string;
}

const formatKyu = (k: number): DanInfo => ({
  kind: 'kyu',
  level: k,
  rank: `${k}. kyū`,
  label: `${k}°`
});

const formatDan = (d: number): DanInfo => ({
  kind: 'dan',
  level: d,
  rank: `${d}. dan`,
  label: `${d}D`
});

export const getKyuFromXp = (hanabira: number, streakDays: number): DanInfo => {
  // En yüksek dan'dan başla, koşulu sağlayanı seç
  for (let i = DAN_THRESHOLDS.length - 1; i >= 0; i--) {
    const t = DAN_THRESHOLDS[i];
    if (hanabira >= t.minHanabira && streakDays >= t.minStreakDays) {
      return formatDan(t.dan);
    }
  }
  for (let i = 0; i < KYU_THRESHOLDS.length; i++) {
    const t = KYU_THRESHOLDS[i];
    const next = KYU_THRESHOLDS[i + 1];
    const advance = next && hanabira >= next.minHanabira && streakDays >= next.minStreakDays;
    if (!advance) {
      return formatKyu(t.kyu);
    }
  }
  return formatKyu(1);
};

export const getDanByKyu = getKyuFromXp;

export interface DanProgressInfo {
  current: DanInfo;
  next: DanInfo | null;
  percent: number; // 0-100, hanabira axis
  nextLabel: string;
}

export const getDanProgress = (hanabira: number, streakDays: number): DanProgressInfo => {
  const current = getKyuFromXp(hanabira, streakDays);

  // Basit progress: hanabira'nın bir sonraki eşiğine oranı
  const allThresholds: { minHanabira: number; minStreakDays: number; label: string }[] = [
    ...KYU_THRESHOLDS.map((t) => ({
      minHanabira: t.minHanabira,
      minStreakDays: t.minStreakDays,
      label: `${t.kyu}°`
    })),
    ...DAN_THRESHOLDS.map((t) => ({
      minHanabira: t.minHanabira,
      minStreakDays: t.minStreakDays,
      label: `${t.dan}D`
    }))
  ];

  const passedIndex = allThresholds.reduce((acc, t, i) => {
    if (hanabira >= t.minHanabira && streakDays >= t.minStreakDays) return i;
    return acc;
  }, 0);

  const passed = allThresholds[passedIndex];
  const next = allThresholds[passedIndex + 1] ?? null;
  if (!next) {
    return { current, next: null, percent: 100, nextLabel: '—' };
  }
  const span = next.minHanabira - passed.minHanabira;
  const within = hanabira - passed.minHanabira;
  const percent = span <= 0 ? 100 : Math.max(0, Math.min(100, (within / span) * 100));
  return { current, next: getKyuFromXp(next.minHanabira, next.minStreakDays), percent, nextLabel: next.label };
};
