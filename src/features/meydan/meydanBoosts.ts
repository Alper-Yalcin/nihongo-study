/**
 * meydanBoosts — Timed Challenge XP multiplier (Sprint 4 D1).
 * Speed Mode: streak +1 (debugStore üzerinden uygulanır)
 * Timed Challenge: belirli süre boyunca ×N hanabira
 *
 * Persistence: localStorage. Saat bazlı; sayfa yenilense bile kalır.
 */

const STORAGE_KEY = 'kototsuna.meydan.boost.v1';
const EVENT_NAME = 'kototsuna:meydan-boost';

export interface XpBoost {
  multiplier: number;
  startedAt: number;
  expiresAt: number;
}

const safeRead = (): XpBoost | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<XpBoost>;
    if (
      typeof parsed.multiplier !== 'number' ||
      typeof parsed.expiresAt !== 'number' ||
      typeof parsed.startedAt !== 'number'
    )
      return null;
    if (parsed.expiresAt <= Date.now()) return null;
    return {
      multiplier: Math.max(1, Math.min(10, Math.round(parsed.multiplier))),
      startedAt: parsed.startedAt,
      expiresAt: parsed.expiresAt
    };
  } catch {
    return null;
  }
};

const write = (boost: XpBoost | null): void => {
  if (typeof window === 'undefined') return;
  try {
    if (boost) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(boost));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* yok say */
  }
};

const emit = (): void => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(EVENT_NAME));
};

export const getActiveMeydanBoost = (): XpBoost | null => {
  const b = safeRead();
  if (!b) return null;
  if (b.expiresAt <= Date.now()) {
    write(null);
    return null;
  }
  return b;
};

export const startTimedXpBoost = (multiplier: number, durationMinutes: number): XpBoost => {
  const now = Date.now();
  const boost: XpBoost = {
    multiplier: Math.max(1, Math.min(10, Math.round(multiplier))),
    startedAt: now,
    expiresAt: now + durationMinutes * 60 * 1000
  };
  write(boost);
  emit();
  return boost;
};

export const consumeXpMultiplier = (): number => {
  const b = getActiveMeydanBoost();
  return b?.multiplier ?? 1;
};

export const clearMeydanBoost = (): void => {
  write(null);
  emit();
};

export const subscribeMeydanBoost = (cb: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener(EVENT_NAME, cb);
  // Storage event de dinle — sekmeler arası senk
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(EVENT_NAME, cb);
    window.removeEventListener('storage', onStorage);
  };
};
