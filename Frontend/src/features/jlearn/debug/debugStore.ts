export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type FormalityPreference = 'casual' | 'neutral' | 'polite';
export type RelationshipStage = 0 | 1 | 2 | 3;

export interface JLearnUserState {
  confidenceLevel: ConfidenceLevel;
  recentMistakes: string[];
  relationshipLevels: Record<string, RelationshipStage>;
  formalityPreference: FormalityPreference;
  missedDays: number;
  streakDays: number;
}

export const JLEARN_USER_STATE_KEY = 'kototsuna.jlearn.user-state';
export const JLEARN_ACTIVE_STEP_KEY = 'kototsuna.jlearn.active-step';

export const defaultUserState: JLearnUserState = {
  confidenceLevel: 'medium',
  recentMistakes: [],
  relationshipLevels: {
    'yuki': 0,
    'tanaka-sensei': 0,
    'mrs-tanaka': 0,
    'keita': 0,
    'sora': 0
  },
  formalityPreference: 'neutral',
  missedDays: 0,
  streakDays: 0
};

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const getJLearnUserState = (): JLearnUserState => {
  if (typeof window === 'undefined') return defaultUserState;
  const raw = window.localStorage.getItem(JLEARN_USER_STATE_KEY);
  const parsed = safeParse<Partial<JLearnUserState>>(raw, {});
  return {
    ...defaultUserState,
    ...parsed,
    relationshipLevels: {
      ...defaultUserState.relationshipLevels,
      ...(parsed.relationshipLevels ?? {})
    }
  };
};

export const setJLearnUserState = (next: JLearnUserState): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(JLEARN_USER_STATE_KEY, JSON.stringify(next));
};

export const resetJLearnUserState = (): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(JLEARN_USER_STATE_KEY);
  window.localStorage.removeItem(JLEARN_ACTIVE_STEP_KEY);
};

export const jumpToStep = (stepId: string): void => {
  if (typeof window === 'undefined') return;
  if (!stepId) {
    window.localStorage.removeItem(JLEARN_ACTIVE_STEP_KEY);
    return;
  }
  window.localStorage.setItem(JLEARN_ACTIVE_STEP_KEY, stepId);
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
