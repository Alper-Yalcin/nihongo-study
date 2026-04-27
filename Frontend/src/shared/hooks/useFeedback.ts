/**
 * useFeedback — Sprint 1 Day 2 omurga hook'u.
 *
 * Combo (連続), Ki (気), Hanabira (花), Shield (盾) state'ini ve
 * doğru/yanlış cevap aksiyonlarını yönetir. Diğer pratik/quiz sayfaları
 * bu hook'u kullanır → feedback merkezîleşir.
 *
 * Sprint 1 Day 3'te bu hook'a `ComboIndicator`, `KiBar`, `HanabiraFly`
 * component'leri bağlanır. TopNav `hanabira` değerini buradan okur.
 */

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'kototsuna.feedback.state.v1';
const EVENT_NAME = 'kototsuna:feedback-state';
const EVENT_PULSE = 'kototsuna:feedback-pulse';

export type FeedbackPulseKind = 'correct' | 'wrong' | 'milestone' | 'mushin' | 'shield';

export interface FeedbackPulseDetail {
  kind: FeedbackPulseKind;
  combo: number;
  multiplier: number;
  hanabiraAwarded?: number;
  milestoneThreshold?: number;
  ki: number;
  lowKiMode?: boolean;
}

const dispatchPulse = (detail: FeedbackPulseDetail): void => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<FeedbackPulseDetail>(EVENT_PULSE, { detail }));
};

export const subscribeFeedbackPulse = (
  callback: (detail: FeedbackPulseDetail) => void
): (() => void) => {
  if (typeof window === 'undefined') return () => undefined;
  const handler = (e: Event) => callback((e as CustomEvent<FeedbackPulseDetail>).detail);
  window.addEventListener(EVENT_PULSE, handler);
  return () => window.removeEventListener(EVENT_PULSE, handler);
};

const KI_MAX_DEFAULT = 5;
const KI_REGEN_INTERVAL_MS = 10 * 60 * 1000; // 10 dk
const SESSION_IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 dk hareketsizlik = oturum reset
const HANABIRA_BASE_PER_CORRECT = 10;
const KI_LOW_PENALTY = 0.5; // ki=0 iken kazanım %50

// Combo eşikleri — multiplier + side effect
export interface ComboTier {
  threshold: number;
  multiplier: number;
  label: string;
}

export const COMBO_TIERS: ComboTier[] = [
  { threshold: 3, multiplier: 1.5, label: '×1.5' },
  { threshold: 5, multiplier: 2, label: '×2' },
  { threshold: 10, multiplier: 3, label: '×3' },
  { threshold: 20, multiplier: 3, label: 'Mushin' }
];

export const getComboMultiplier = (combo: number): number => {
  let m = 1;
  for (const tier of COMBO_TIERS) {
    if (combo >= tier.threshold) m = tier.multiplier;
  }
  return m;
};

export interface PersistedFeedbackState {
  hanabira: number;
  ki: number;
  kiMax: number;
  lastKiRegenAt: number;
  comboMaxAllTime: number;
  mushinLastAwardedDay: string | null; // YYYY-MM-DD
}

export interface SessionFeedbackState {
  combo: number;
  comboMaxSession: number;
  shieldAvailable: boolean;
  sessionStartedAt: number | null;
  lastInteractionAt: number;
}

export interface FeedbackState extends PersistedFeedbackState, SessionFeedbackState {}

const defaultPersisted: PersistedFeedbackState = {
  hanabira: 0,
  ki: KI_MAX_DEFAULT,
  kiMax: KI_MAX_DEFAULT,
  lastKiRegenAt: Date.now(),
  comboMaxAllTime: 0,
  mushinLastAwardedDay: null
};

const defaultSession: SessionFeedbackState = {
  combo: 0,
  comboMaxSession: 0,
  shieldAvailable: true,
  sessionStartedAt: null,
  lastInteractionAt: Date.now()
};

// === Module-level singleton store ===
let state: FeedbackState = { ...defaultPersisted, ...defaultSession };
let initialized = false;

const todayKey = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const safeNonNegativeInt = (value: unknown, fallback: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return fallback;
  return Math.floor(value);
};

const safeTimestamp = (value: unknown): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return Date.now();
  // Gelecekten gelen anormal timestamp (saat oynamış olabilir) → şimdi
  if (value > Date.now() + 24 * 60 * 60 * 1000) return Date.now();
  return value;
};

const loadFromStorage = (): PersistedFeedbackState => {
  if (typeof window === 'undefined') return { ...defaultPersisted };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultPersisted };
    const parsed = JSON.parse(raw) as Partial<PersistedFeedbackState>;

    const kiMaxCandidate = safeNonNegativeInt(parsed.kiMax, KI_MAX_DEFAULT);
    const kiMax = Math.max(1, Math.min(20, kiMaxCandidate)); // sanity bound
    const ki = Math.max(0, Math.min(kiMax, safeNonNegativeInt(parsed.ki, kiMax)));
    const hanabira = Math.min(safeNonNegativeInt(parsed.hanabira, 0), 1_000_000_000); // overflow guard

    const today = todayKey();
    const mushinLastAwardedDay =
      typeof parsed.mushinLastAwardedDay === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(parsed.mushinLastAwardedDay)
        ? parsed.mushinLastAwardedDay
        : null;
    // İleri tarihli day key (saat oynaması) — invalidate
    const safeMushinDay =
      mushinLastAwardedDay && mushinLastAwardedDay > today ? null : mushinLastAwardedDay;

    return {
      hanabira,
      ki,
      kiMax,
      lastKiRegenAt: safeTimestamp(parsed.lastKiRegenAt),
      comboMaxAllTime: safeNonNegativeInt(parsed.comboMaxAllTime, 0),
      mushinLastAwardedDay: safeMushinDay
    };
  } catch {
    return { ...defaultPersisted };
  }
};

const saveToStorage = (next: PersistedFeedbackState): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota / private mode — sessizce yut */
  }
};

const ensureInitialized = (): void => {
  if (initialized) return;
  state = { ...loadFromStorage(), ...defaultSession };
  initialized = true;
};

const emit = (): void => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(EVENT_NAME));
};

const persist = (): void => {
  saveToStorage({
    hanabira: state.hanabira,
    ki: state.ki,
    kiMax: state.kiMax,
    lastKiRegenAt: state.lastKiRegenAt,
    comboMaxAllTime: state.comboMaxAllTime,
    mushinLastAwardedDay: state.mushinLastAwardedDay
  });
};

// Ki passive regen — read-time tick
const applyPassiveKiRegen = (): boolean => {
  if (state.ki >= state.kiMax) {
    state.lastKiRegenAt = Date.now();
    return false;
  }
  const elapsed = Date.now() - state.lastKiRegenAt;
  if (elapsed < KI_REGEN_INTERVAL_MS) return false;
  const ticks = Math.floor(elapsed / KI_REGEN_INTERVAL_MS);
  const before = state.ki;
  state.ki = Math.min(state.kiMax, state.ki + ticks);
  state.lastKiRegenAt = state.lastKiRegenAt + ticks * KI_REGEN_INTERVAL_MS;
  return state.ki !== before;
};

const maybeResetIdleSession = (): void => {
  const now = Date.now();
  if (state.sessionStartedAt && now - state.lastInteractionAt > SESSION_IDLE_TIMEOUT_MS) {
    state.combo = 0;
    state.comboMaxSession = 0;
    state.shieldAvailable = true;
    state.sessionStartedAt = null;
  }
};

// === Public actions ===

export interface CorrectResult {
  combo: number;
  multiplier: number;
  hanabiraAwarded: number;
  milestoneCrossed: ComboTier | null;
  kiRegenerated: boolean;
  mushinAwarded: boolean;
}

export interface WrongResult {
  shielded: boolean;
  comboBefore: number;
  kiBefore: number;
  kiAfter: number;
  lowKiMode: boolean;
}

const startSessionInternal = (): void => {
  ensureInitialized();
  if (!state.sessionStartedAt) {
    state.sessionStartedAt = Date.now();
    state.shieldAvailable = true;
    state.combo = 0;
    state.comboMaxSession = 0;
  }
  state.lastInteractionAt = Date.now();
};

export const startSession = (): void => {
  startSessionInternal();
  emit();
};

export const recordCorrect = (): CorrectResult => {
  ensureInitialized();
  applyPassiveKiRegen();
  maybeResetIdleSession();
  startSessionInternal();

  const comboBefore = state.combo;
  state.combo += 1;
  state.comboMaxSession = Math.max(state.comboMaxSession, state.combo);
  state.comboMaxAllTime = Math.max(state.comboMaxAllTime, state.combo);

  const multiplier = getComboMultiplier(state.combo);
  const lowKi = state.ki <= 0;
  const award = Math.round(HANABIRA_BASE_PER_CORRECT * multiplier * (lowKi ? KI_LOW_PENALTY : 1));
  state.hanabira += award;

  // Eşik geçişi tespiti
  let milestoneCrossed: ComboTier | null = null;
  for (const tier of COMBO_TIERS) {
    if (comboBefore < tier.threshold && state.combo >= tier.threshold) {
      milestoneCrossed = tier;
    }
  }

  // 5-combo'da +1 ki yenilenir
  let kiRegenerated = false;
  if (milestoneCrossed?.threshold === 5 && state.ki < state.kiMax) {
    state.ki += 1;
    kiRegenerated = true;
  }

  // 20-combo Mushin — günde 1 kez
  let mushinAwarded = false;
  if (milestoneCrossed?.threshold === 20) {
    const today = todayKey();
    if (state.mushinLastAwardedDay !== today) {
      state.mushinLastAwardedDay = today;
      mushinAwarded = true;
    }
  }

  state.lastInteractionAt = Date.now();
  persist();
  emit();

  dispatchPulse({
    kind: 'correct',
    combo: state.combo,
    multiplier,
    hanabiraAwarded: award,
    ki: state.ki
  });
  if (milestoneCrossed) {
    dispatchPulse({
      kind: 'milestone',
      combo: state.combo,
      multiplier,
      milestoneThreshold: milestoneCrossed.threshold,
      ki: state.ki
    });
  }
  if (mushinAwarded) {
    dispatchPulse({
      kind: 'mushin',
      combo: state.combo,
      multiplier,
      ki: state.ki
    });
  }

  return {
    combo: state.combo,
    multiplier,
    hanabiraAwarded: award,
    milestoneCrossed,
    kiRegenerated,
    mushinAwarded
  };
};

export const recordWrong = (): WrongResult => {
  ensureInitialized();
  applyPassiveKiRegen();
  maybeResetIdleSession();
  startSessionInternal();

  const comboBefore = state.combo;
  const kiBefore = state.ki;

  if (state.shieldAvailable) {
    state.shieldAvailable = false;
    state.lastInteractionAt = Date.now();
    emit();
    dispatchPulse({
      kind: 'shield',
      combo: state.combo,
      multiplier: getComboMultiplier(state.combo),
      ki: state.ki
    });
    return {
      shielded: true,
      comboBefore,
      kiBefore,
      kiAfter: state.ki,
      lowKiMode: state.ki <= 0
    };
  }

  state.combo = 0;
  state.ki = Math.max(0, state.ki - 1);
  if (state.ki < state.kiMax) {
    state.lastKiRegenAt = Date.now();
  }
  state.lastInteractionAt = Date.now();
  persist();
  emit();

  dispatchPulse({
    kind: 'wrong',
    combo: 0,
    multiplier: 1,
    ki: state.ki,
    lowKiMode: state.ki <= 0
  });

  return {
    shielded: false,
    comboBefore,
    kiBefore,
    kiAfter: state.ki,
    lowKiMode: state.ki <= 0
  };
};

export interface SessionSummary {
  comboMaxSession: number;
  shieldUsed: boolean;
  kiAtEnd: number;
  kiFullBonusEligible: boolean;
}

export const endSession = (): SessionSummary => {
  ensureInitialized();
  const summary: SessionSummary = {
    comboMaxSession: state.comboMaxSession,
    shieldUsed: !state.shieldAvailable,
    kiAtEnd: state.ki,
    kiFullBonusEligible: state.ki === state.kiMax
  };
  state.combo = 0;
  state.comboMaxSession = 0;
  state.shieldAvailable = true;
  state.sessionStartedAt = null;
  emit();
  return summary;
};

export const resetFeedbackState = (): void => {
  state = { ...defaultPersisted, ...defaultSession };
  saveToStorage(defaultPersisted);
  emit();
};

/**
 * awardBonusHanabira — combo dışı, doğrudan reward (claim, quest, vs.)
 * UI tarafı flyUp ister mi karar verir; helper sadece state'i günceller.
 */
export const awardBonusHanabira = (amount: number): number => {
  ensureInitialized();
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  const safeAmount = Math.min(1_000_000, Math.floor(amount));
  state.hanabira += safeAmount;
  persist();
  emit();
  dispatchPulse({
    kind: 'milestone',
    combo: state.combo,
    multiplier: getComboMultiplier(state.combo),
    hanabiraAwarded: safeAmount,
    milestoneThreshold: 10, // büyük flyUp / yağmur tetikle
    ki: state.ki
  });
  return safeAmount;
};

export const getFeedbackState = (): FeedbackState => {
  ensureInitialized();
  applyPassiveKiRegen();
  return { ...state };
};

export const subscribeFeedback = (callback: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener(EVENT_NAME, callback);
  return () => window.removeEventListener(EVENT_NAME, callback);
};

// === React hook ===
export interface UseFeedbackApi {
  state: FeedbackState;
  multiplier: number;
  recordCorrect: () => CorrectResult;
  recordWrong: () => WrongResult;
  startSession: () => void;
  endSession: () => SessionSummary;
  reset: () => void;
}

export const useFeedback = (): UseFeedbackApi => {
  const [snapshot, setSnapshot] = useState<FeedbackState>(() => getFeedbackState());

  useEffect(() => {
    const update = () => setSnapshot(getFeedbackState());
    const unsub = subscribeFeedback(update);
    // Passive regen tick — her dakikada bir state'i tazele
    const tick = window.setInterval(() => setSnapshot(getFeedbackState()), 60_000);
    return () => {
      unsub();
      window.clearInterval(tick);
    };
  }, []);

  return {
    state: snapshot,
    multiplier: getComboMultiplier(snapshot.combo),
    recordCorrect,
    recordWrong,
    startSession,
    endSession,
    reset: resetFeedbackState
  };
};

// === Debug bridge — devtools console'dan çalıştırılabilir ===
if (typeof window !== 'undefined') {
  (window as unknown as { __feedback?: unknown }).__feedback = {
    get: getFeedbackState,
    correct: recordCorrect,
    wrong: recordWrong,
    start: startSession,
    end: endSession,
    reset: resetFeedbackState,
    multiplier: getComboMultiplier
  };
}
