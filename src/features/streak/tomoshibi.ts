/**
 * tomoshibi — streak görsel evrim kademesi + freeze logic.
 * Kademe: 0 (sönmüş) · 1g · 7g · 30g · 100g
 * Hafta sonu freeze: pazar günü streak kırılırsa otomatik 1 freeze tüketilir.
 */

const FREEZE_KEY = 'kototsuna.tomoshibi.freeze.v1';
const HEAT_KEY = 'kototsuna.tomoshibi.heat.v1';

export type TomoshibiTier = 0 | 1 | 2 | 3 | 4 | 5;

export interface TomoshibiVisual {
  tier: TomoshibiTier;
  glow: number;        // box-shadow blur scale
  haloColor: string;
  label: string;
}

export const tomoshibiTier = (streakDays: number): TomoshibiTier => {
  if (streakDays <= 0) return 0;
  if (streakDays < 3) return 1;
  if (streakDays < 7) return 2;
  if (streakDays < 30) return 3;
  if (streakDays < 100) return 4;
  return 5;
};

export const tomoshibiVisual = (streakDays: number): TomoshibiVisual => {
  const tier = tomoshibiTier(streakDays);
  const map: Record<TomoshibiTier, TomoshibiVisual> = {
    0: { tier: 0, glow: 0,  haloColor: 'transparent',         label: 'sönük' },
    1: { tier: 1, glow: 6,  haloColor: '#f0a14a',            label: 'kıvılcım' },
    2: { tier: 2, glow: 10, haloColor: '#f0a14a',            label: 'parlıyor' },
    3: { tier: 3, glow: 16, haloColor: '#f0a14a',            label: 'güçlü' },
    4: { tier: 4, glow: 22, haloColor: 'var(--kt-dan-gold)', label: 'altın' },
    5: { tier: 5, glow: 28, haloColor: '#ff9bb2',            label: 'sakura' }
  };
  return map[tier];
};

// === Freeze ===
interface FreezeRecord {
  available: number;        // şu an elde olan freeze sayısı
  lastWeeklyGrant: string;  // YYYY-Www (ISO week)
  consumedDays: string[];   // hangi günleri kurtardı (YYYY-MM-DD)
}

const isoWeekKey = (d: Date): string => {
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${target.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
};

const todayKey = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const readFreeze = (): FreezeRecord => {
  if (typeof window === 'undefined') return { available: 0, lastWeeklyGrant: '', consumedDays: [] };
  try {
    const raw = window.localStorage.getItem(FREEZE_KEY);
    if (!raw) return { available: 0, lastWeeklyGrant: '', consumedDays: [] };
    const parsed = JSON.parse(raw);
    return {
      available: typeof parsed.available === 'number' ? Math.max(0, Math.min(5, parsed.available)) : 0,
      lastWeeklyGrant: typeof parsed.lastWeeklyGrant === 'string' ? parsed.lastWeeklyGrant : '',
      consumedDays: Array.isArray(parsed.consumedDays) ? parsed.consumedDays : []
    };
  } catch {
    return { available: 0, lastWeeklyGrant: '', consumedDays: [] };
  }
};

const writeFreeze = (rec: FreezeRecord): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(FREEZE_KEY, JSON.stringify(rec));
  } catch { /* yok say */ }
};

/** Haftalık 1 freeze ver — pazartesi sabahı veya ilk açılış. */
export const ensureWeeklyFreezeGrant = (): FreezeRecord => {
  const rec = readFreeze();
  const wk = isoWeekKey(new Date());
  if (rec.lastWeeklyGrant !== wk) {
    rec.available = Math.min(2, rec.available + 1);
    rec.lastWeeklyGrant = wk;
    writeFreeze(rec);
  }
  return rec;
};

export const getFreezeStatus = (): FreezeRecord => readFreeze();

export const consumeFreeze = (): boolean => {
  const rec = readFreeze();
  if (rec.available <= 0) return false;
  rec.available -= 1;
  rec.consumedDays.push(todayKey());
  writeFreeze(rec);
  return true;
};

// === Heat calendar (1 gün = bool, son 365 gün) ===
interface HeatRecord {
  days: Record<string, boolean>;
}

const readHeat = (): HeatRecord => {
  if (typeof window === 'undefined') return { days: {} };
  try {
    const raw = window.localStorage.getItem(HEAT_KEY);
    if (!raw) return { days: {} };
    const parsed = JSON.parse(raw);
    return { days: parsed.days && typeof parsed.days === 'object' ? parsed.days : {} };
  } catch {
    return { days: {} };
  }
};

const writeHeat = (rec: HeatRecord): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(HEAT_KEY, JSON.stringify(rec));
  } catch { /* yok say */ }
};

export const markPracticedToday = (): void => {
  const rec = readHeat();
  rec.days[todayKey()] = true;
  // 400 günden eskiyi süpür
  const limit = Date.now() - 400 * 86400000;
  for (const k of Object.keys(rec.days)) {
    const ts = Date.parse(k);
    if (Number.isFinite(ts) && ts < limit) delete rec.days[k];
  }
  writeHeat(rec);
};

export const getHeatGrid = (days = 365): { date: string; active: boolean }[] => {
  const rec = readHeat();
  const out: { date: string; active: boolean }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    out.push({ date: key, active: !!rec.days[key] });
  }
  return out;
};
