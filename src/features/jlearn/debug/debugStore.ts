export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type FormalityPreference = 'casual' | 'neutral' | 'polite';
export type RelationshipStage = 0 | 1 | 2 | 3;

export interface RecoveryFlag {
  targetId: string;
  missionsRemaining: number;
  createdAt: string;
}

export const JLEARN_RELATIONSHIP_CHARACTER_IDS = [
  'yuki',
  'tanaka-sensei',
  'yamada-sensei',
  'mrs-tanaka',
  'mr-tanaka',
  'keita',
  'sora',
  'obaasan',
] as const;

export type JLearnRelationshipCharacterId = (typeof JLEARN_RELATIONSHIP_CHARACTER_IDS)[number];

const buildDefaultRelationshipMap = <T,>(initialValue: T): Record<string, T> =>
  Object.fromEntries(
    JLEARN_RELATIONSHIP_CHARACTER_IDS.map((characterId) => [characterId, initialValue])
  ) as Record<string, T>;

export interface JLearnUserState {
  confidenceLevel: ConfidenceLevel;
  recentMistakes: string[];
  relationshipLevels: Record<string, RelationshipStage>;
  relationshipMissionCounts: Record<string, number>;
  recoveryFlags: RecoveryFlag[];
  formalityPreference: FormalityPreference;
  formalityDriftScore: number;
  missedDays: number;
  streakDays: number;
  lastSessionAt: string | null;
  highConfidenceClearCount: number;
}

export const JLEARN_USER_STATE_KEY = 'kototsuna.jlearn.user-state';
export const JLEARN_ACTIVE_STEP_KEY = 'kototsuna.jlearn.active-step';
export const JLEARN_FEATURE_FLAGS_KEY = 'kototsuna.jlearn.feature-flags';
export const JLEARN_USER_STATE_EVENT = 'kototsuna:jlearn-user-state';

export interface JLearnFeatureFlags {
  challengeCta: boolean;
  speakingMode: boolean;
}

export const defaultUserState: JLearnUserState = {
  confidenceLevel: 'medium',
  recentMistakes: [],
  relationshipLevels: buildDefaultRelationshipMap<RelationshipStage>(0),
  relationshipMissionCounts: buildDefaultRelationshipMap<number>(0),
  recoveryFlags: [],
  formalityPreference: 'neutral',
  formalityDriftScore: 0,
  missedDays: 0,
  streakDays: 0,
  lastSessionAt: null,
  highConfidenceClearCount: 0,
};

export const defaultFeatureFlags: JLearnFeatureFlags = {
  challengeCta: false,
  speakingMode: false,
};

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const normalizeConfidenceLevel = (value: unknown): ConfidenceLevel =>
  value === 'low' || value === 'medium' || value === 'high' ? value : 'medium';

const notifyUserStateChanged = (): void => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(JLEARN_USER_STATE_EVENT));
};

export const subscribeJLearnUserState = (callback: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (
      event.key === JLEARN_USER_STATE_KEY ||
      event.key === JLEARN_FEATURE_FLAGS_KEY ||
      event.key === null
    ) {
      callback();
    }
  };

  window.addEventListener(JLEARN_USER_STATE_EVENT, callback);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener(JLEARN_USER_STATE_EVENT, callback);
    window.removeEventListener('storage', onStorage);
  };
};

export const getJLearnUserState = (): JLearnUserState => {
  if (typeof window === 'undefined') return defaultUserState;
  const raw = window.localStorage.getItem(JLEARN_USER_STATE_KEY);
  const parsed = safeParse<Partial<JLearnUserState>>(raw, {});
  return {
    ...defaultUserState,
    ...parsed,
    confidenceLevel: normalizeConfidenceLevel(parsed.confidenceLevel),
    relationshipLevels: {
      ...defaultUserState.relationshipLevels,
      ...(parsed.relationshipLevels ?? {})
    },
    relationshipMissionCounts: {
      ...defaultUserState.relationshipMissionCounts,
      ...(parsed.relationshipMissionCounts ?? {})
    },
  };
};

export const setJLearnUserState = (next: JLearnUserState): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    JLEARN_USER_STATE_KEY,
    JSON.stringify({ ...next, confidenceLevel: normalizeConfidenceLevel(next.confidenceLevel) })
  );
  notifyUserStateChanged();
};

export const getJLearnFeatureFlags = (): JLearnFeatureFlags => {
  if (typeof window === 'undefined') return defaultFeatureFlags;
  const raw = window.localStorage.getItem(JLEARN_FEATURE_FLAGS_KEY);
  const parsed = safeParse<Partial<JLearnFeatureFlags>>(raw, {});
  return {
    ...defaultFeatureFlags,
    challengeCta: Boolean(parsed.challengeCta),
    speakingMode: Boolean(parsed.speakingMode),
  };
};

export const setJLearnFeatureFlags = (next: JLearnFeatureFlags): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    JLEARN_FEATURE_FLAGS_KEY,
    JSON.stringify({ ...defaultFeatureFlags, ...next })
  );
  notifyUserStateChanged();
};

export const resetJLearnUserState = (): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(JLEARN_USER_STATE_KEY);
  window.localStorage.removeItem(JLEARN_ACTIVE_STEP_KEY);
  window.localStorage.removeItem(JLEARN_FEATURE_FLAGS_KEY);
  notifyUserStateChanged();
};

export const jumpToStep = (stepId: string): void => {
  if (typeof window === 'undefined') return;
  if (!stepId) {
    window.localStorage.removeItem(JLEARN_ACTIVE_STEP_KEY);
    notifyUserStateChanged();
    return;
  }
  window.localStorage.setItem(JLEARN_ACTIVE_STEP_KEY, stepId);
  notifyUserStateChanged();
};

export const forceConfidence = (value: ConfidenceLevel): void => {
  const state = getJLearnUserState();
  setJLearnUserState({ ...state, confidenceLevel: value });
};

export const forceRelationship = (characterId: string, value: RelationshipStage): void => {
  const state = getJLearnUserState();
  setJLearnUserState({
    ...state,
    relationshipLevels: { ...state.relationshipLevels, [characterId]: value }
  });
};

export const forceMissedDays = (value: number): void => {
  const state = getJLearnUserState();
  setJLearnUserState({ ...state, missedDays: Math.max(0, Math.floor(value)) });
};
