/**
 * seasonalQuest — 90 günlük sezon konsepti.
 * Sezon 1 Mart, 1 Haziran, 1 Eylül, 1 Aralık'ta başlar (~ilkbahar/yaz/sonbahar/kış).
 * UI: progress + sticker placeholder + countdown.
 */

export type SeasonName = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SeasonInfo {
  name: SeasonName;
  label: string;
  startedAt: number;
  endsAt: number;
  durationDays: number;
  daysElapsed: number;
  daysRemaining: number;
  percent: number;
  yearLabel: string;
}

const seasonStartFor = (date: Date): { name: SeasonName; start: Date } => {
  const y = date.getFullYear();
  const month = date.getMonth(); // 0-11
  const candidates: { name: SeasonName; start: Date }[] = [
    { name: 'spring', start: new Date(y, 2, 1) },   // 1 March
    { name: 'summer', start: new Date(y, 5, 1) },   // 1 June
    { name: 'autumn', start: new Date(y, 8, 1) },   // 1 Sept
    { name: 'winter', start: new Date(y, 11, 1) }   // 1 Dec
  ];

  // Geçmiş yıl kışı: Ocak/Şubat → previous Dec
  if (month < 2) {
    return { name: 'winter', start: new Date(y - 1, 11, 1) };
  }

  let chosen = candidates[0];
  for (const c of candidates) {
    if (date.getTime() >= c.start.getTime()) {
      chosen = c;
    }
  }
  return chosen;
};

const SEASON_LABELS: Record<SeasonName, { tr: string; en: string }> = {
  spring: { tr: 'İlkbahar', en: 'Spring' },
  summer: { tr: 'Yaz', en: 'Summer' },
  autumn: { tr: 'Sonbahar', en: 'Autumn' },
  winter: { tr: 'Kış', en: 'Winter' }
};

export const getSeasonInfo = (lang: 'tr' | 'en' = 'tr', now: Date = new Date()): SeasonInfo => {
  const { name, start } = seasonStartFor(now);
  const end = new Date(start);
  end.setDate(end.getDate() + 90);
  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  const daysElapsed = Math.max(0, Math.floor(elapsed / 86400000));
  const daysTotal = Math.round(total / 86400000);
  return {
    name,
    label: SEASON_LABELS[name][lang],
    startedAt: start.getTime(),
    endsAt: end.getTime(),
    durationDays: daysTotal,
    daysElapsed: Math.min(daysElapsed, daysTotal),
    daysRemaining: Math.max(0, daysTotal - daysElapsed),
    percent: Math.max(0, Math.min(100, (elapsed / total) * 100)),
    yearLabel: String(start.getFullYear())
  };
};
