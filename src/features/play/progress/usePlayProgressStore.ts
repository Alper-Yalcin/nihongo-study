import { useEffect, useMemo } from 'react';
import { usePersistentState } from '../../../hooks/usePersistentState';
import { isValidChallengePeriodKey } from '../challenges/challengeEngine';
import {
  Challenge,
  CompletedGameRun,
  GameSession,
  PlayRewardUnlockRegistry,
  UserChallengeClaim
} from '../domain/playTypes';

const PLAY_SESSIONS_STORAGE_KEY = 'kototsuna.play.sessions.v1';
const LEGACY_PLAY_SESSIONS_STORAGE_KEY = 'kotonoha.play.sessions.v1';
const PLAY_CHALLENGE_CLAIMS_STORAGE_KEY = 'kototsuna.play.challenge-claims.v1';
const LEGACY_PLAY_CHALLENGE_CLAIMS_STORAGE_KEY = 'kotonoha.play.challenge-claims.v1';
const PLAY_REWARD_REGISTRY_STORAGE_KEY = 'kototsuna.play.reward-registry.v1';
const LEGACY_PLAY_REWARD_REGISTRY_STORAGE_KEY = 'kotonoha.play.reward-registry.v1';
const MAX_STORED_RUNS = 300;
const MAX_STORED_CLAIMS = 500;

const deserializeRuns = (value: string): CompletedGameRun[] => {
  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => Boolean(item) && typeof item === 'object')
      .map((item) => item as CompletedGameRun)
      .filter((item) => Boolean(item.session?.id));
  } catch {
    return [];
  }
};

const deserializeChallengeClaims = (value: string): UserChallengeClaim[] => {
  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => Boolean(item) && typeof item === 'object')
      .map((item) => item as Partial<UserChallengeClaim>)
      .filter(
        (item): item is UserChallengeClaim =>
          typeof item.userId === 'string' &&
          typeof item.challengeId === 'string' &&
          typeof item.periodKey === 'string' &&
          (item.resetPeriod === 'daily' || item.resetPeriod === 'weekly') &&
          (item.rewardType === 'xp' ||
            item.rewardType === 'badge' ||
            item.rewardType === 'streak' ||
            item.rewardType === 'theme' ||
            item.rewardType === 'unlock') &&
          typeof item.rewardValue === 'number' &&
          Number.isFinite(item.rewardValue) &&
          typeof item.claimedAt === 'string'
      );
  } catch {
    return [];
  }
};

const getLocalDayKey = (dateValue: Date | string) => {
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const calculateCurrentStreak = (sessions: GameSession[]) => {
  if (sessions.length === 0) {
    return 0;
  }

  const daySet = new Set(sessions.map((session) => getLocalDayKey(session.endedAt)));
  const today = new Date();
  const todayKey = getLocalDayKey(today);
  const yesterday = addDays(today, -1);
  const yesterdayKey = getLocalDayKey(yesterday);

  if (!daySet.has(todayKey) && !daySet.has(yesterdayKey)) {
    return 0;
  }

  let streak = 0;
  let cursor = daySet.has(todayKey) ? today : yesterday;

  while (daySet.has(getLocalDayKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
};

const createInitialRewardRegistry = (userId: string): PlayRewardUnlockRegistry => ({
  userId,
  unlockedThemeIds: [],
  unlockedFeatureIds: [],
  badges: 0,
  streakBonusDays: 0,
  updatedAt: new Date(0).toISOString()
});

const deserializeRewardRegistry = (value: string): PlayRewardUnlockRegistry | null => {
  try {
    const parsed = JSON.parse(value) as Partial<PlayRewardUnlockRegistry>;

    if (!parsed || typeof parsed !== 'object' || typeof parsed.userId !== 'string') {
      return null;
    }

    return {
      userId: parsed.userId,
      unlockedThemeIds: Array.isArray(parsed.unlockedThemeIds)
        ? parsed.unlockedThemeIds.filter((item): item is string => typeof item === 'string')
        : [],
      unlockedFeatureIds: Array.isArray(parsed.unlockedFeatureIds)
        ? parsed.unlockedFeatureIds.filter((item): item is string => typeof item === 'string')
        : [],
      badges:
        typeof parsed.badges === 'number' && Number.isFinite(parsed.badges)
          ? Math.max(0, Math.round(parsed.badges))
          : 0,
      streakBonusDays:
        typeof parsed.streakBonusDays === 'number' && Number.isFinite(parsed.streakBonusDays)
          ? Math.max(0, Math.round(parsed.streakBonusDays))
          : 0,
      updatedAt:
        typeof parsed.updatedAt === 'string'
          ? parsed.updatedAt
          : new Date().toISOString()
    };
  } catch {
    return null;
  }
};

const toThemeUnlockId = (claim: UserChallengeClaim) =>
  `theme-${claim.challengeId}`;

const toFeatureUnlockId = (claim: UserChallengeClaim) =>
  `unlock-${claim.challengeId}`;

const buildRewardRegistryFromClaims = (
  userId: string,
  claims: UserChallengeClaim[]
): PlayRewardUnlockRegistry => {
  const userClaims = claims.filter((claim) => claim.userId === userId);
  const unlockedThemeIds = Array.from(
    new Set(
      userClaims
        .filter((claim) => claim.rewardType === 'theme')
        .map((claim) => toThemeUnlockId(claim))
    )
  );
  const unlockedFeatureIds = Array.from(
    new Set(
      userClaims
        .filter((claim) => claim.rewardType === 'unlock')
        .map((claim) => toFeatureUnlockId(claim))
    )
  );

  return {
    userId,
    unlockedThemeIds,
    unlockedFeatureIds,
    badges: userClaims.reduce(
      (total, claim) => total + (claim.rewardType === 'badge' ? claim.rewardValue : 0),
      0
    ),
    streakBonusDays: userClaims.reduce(
      (total, claim) => total + (claim.rewardType === 'streak' ? claim.rewardValue : 0),
      0
    ),
    updatedAt: new Date().toISOString()
  };
};

const areRewardRegistriesEqual = (
  left: PlayRewardUnlockRegistry,
  right: PlayRewardUnlockRegistry
) =>
  left.userId === right.userId &&
  left.badges === right.badges &&
  left.streakBonusDays === right.streakBonusDays &&
  left.unlockedThemeIds.join('|') === right.unlockedThemeIds.join('|') &&
  left.unlockedFeatureIds.join('|') === right.unlockedFeatureIds.join('|');

export interface PlayProgressSummary {
  baseXp: number;
  claimedXp: number;
  totalXp: number;
  streakRewardDays: number;
  badges: number;
  unlockedThemeIds: string[];
  unlockedFeatureIds: string[];
  totalSessions: number;
  totalChallengeClaims: number;
  totalCorrectAnswers: number;
  totalQuestions: number;
  averageAccuracy: number;
  bestScore: number;
  currentStreakDays: number;
  lastSession: GameSession | null;
}

export const usePlayProgressStore = (userId: string) => {
  const [runs, setRuns] = usePersistentState<CompletedGameRun[]>(
    PLAY_SESSIONS_STORAGE_KEY,
    [],
    {
      serialize: JSON.stringify,
      deserialize: deserializeRuns,
      legacyKeys: [LEGACY_PLAY_SESSIONS_STORAGE_KEY]
    }
  );

  const [challengeClaims, setChallengeClaims] = usePersistentState<UserChallengeClaim[]>(
    PLAY_CHALLENGE_CLAIMS_STORAGE_KEY,
    [],
    {
      serialize: JSON.stringify,
      deserialize: deserializeChallengeClaims,
      legacyKeys: [LEGACY_PLAY_CHALLENGE_CLAIMS_STORAGE_KEY]
    }
  );

  const rewardRegistryStorageKey = `${PLAY_REWARD_REGISTRY_STORAGE_KEY}.${userId}`;
  const legacyRewardRegistryStorageKey = `${LEGACY_PLAY_REWARD_REGISTRY_STORAGE_KEY}.${userId}`;

  const [rewardRegistry, setRewardRegistry] = usePersistentState<PlayRewardUnlockRegistry>(
    rewardRegistryStorageKey,
    () => createInitialRewardRegistry(userId),
    {
      serialize: JSON.stringify,
      deserialize: (value) =>
        deserializeRewardRegistry(value) ?? createInitialRewardRegistry(userId),
      legacyKeys: [legacyRewardRegistryStorageKey]
    }
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== PLAY_CHALLENGE_CLAIMS_STORAGE_KEY) {
        return;
      }

      if (!event.newValue) {
        setChallengeClaims([]);
        return;
      }

      setChallengeClaims(deserializeChallengeClaims(event.newValue));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [setChallengeClaims]);

  const userRuns = useMemo(
    () =>
      runs
        .filter((run) => run.session.userId === userId)
        .sort((left, right) => right.session.endedAt.localeCompare(left.session.endedAt)),
    [runs, userId]
  );

  const userClaims = useMemo(
    () =>
      challengeClaims
        .filter((claim) => claim.userId === userId)
        .sort((left, right) => right.claimedAt.localeCompare(left.claimedAt)),
    [challengeClaims, userId]
  );

  useEffect(() => {
    const nextRegistry = buildRewardRegistryFromClaims(userId, challengeClaims);

    setRewardRegistry((current) =>
      areRewardRegistriesEqual(current, nextRegistry)
        ? current
        : {
            ...nextRegistry,
            updatedAt: new Date().toISOString()
          }
    );
  }, [challengeClaims, setRewardRegistry, userId]);

  const summary = useMemo<PlayProgressSummary>(() => {
    const sessions = userRuns.map((run) => run.session);
    const baseXp = userRuns.reduce((total, run) => total + run.xpEarned, 0);
    const claimedXp = userClaims.reduce(
      (total, claim) => total + (claim.rewardType === 'xp' ? claim.rewardValue : 0),
      0
    );
    const streakRewardDays = userClaims.reduce(
      (total, claim) => total + (claim.rewardType === 'streak' ? claim.rewardValue : 0),
      0
    );
    const totalSessions = sessions.length;
    const totalCorrectAnswers = sessions.reduce(
      (total, session) => total + session.correctAnswers,
      0
    );
    const totalQuestions = sessions.reduce((total, session) => total + session.totalQuestions, 0);
    const averageAccuracy =
      totalQuestions > 0 ? Math.round((totalCorrectAnswers / totalQuestions) * 1000) / 10 : 0;

    return {
      baseXp,
      claimedXp,
      totalXp: baseXp + claimedXp,
      streakRewardDays,
      badges: rewardRegistry.badges,
      unlockedThemeIds: rewardRegistry.unlockedThemeIds,
      unlockedFeatureIds: rewardRegistry.unlockedFeatureIds,
      totalSessions,
      totalChallengeClaims: userClaims.length,
      totalCorrectAnswers,
      totalQuestions,
      averageAccuracy,
      bestScore: sessions.reduce((bestScore, session) => Math.max(bestScore, session.score), 0),
      currentStreakDays: calculateCurrentStreak(sessions),
      lastSession: sessions[0] ?? null
    };
  }, [rewardRegistry, userClaims, userRuns]);

  const saveRun = (run: CompletedGameRun) => {
    setRuns((current) => {
      const next = [run, ...current.filter((entry) => entry.session.id !== run.session.id)];
      return next.slice(0, MAX_STORED_RUNS);
    });
  };

  const clearRuns = () => {
    setRuns([]);
  };

  const isChallengeClaimed = (challengeId: string, periodKey: string) =>
    userClaims.some(
      (claim) => claim.challengeId === challengeId && claim.periodKey === periodKey
    );

  const readClaimsSnapshot = () => {
    if (typeof window === 'undefined') {
      return userClaims;
    }

    try {
      const rawClaims = window.localStorage.getItem(PLAY_CHALLENGE_CLAIMS_STORAGE_KEY);

      if (!rawClaims) {
        return userClaims;
      }

      return deserializeChallengeClaims(rawClaims).filter((claim) => claim.userId === userId);
    } catch {
      return userClaims;
    }
  };

  const claimChallengeReward = (
    challenge: Challenge,
    periodKey: string,
    options: { completed?: boolean } = {}
  ) => {
    if (!options.completed) {
      return false;
    }

    if (!isValidChallengePeriodKey(challenge.resetPeriod, periodKey, new Date())) {
      return false;
    }

    if (isChallengeClaimed(challenge.id, periodKey)) {
      return false;
    }

    const snapshotClaims = readClaimsSnapshot();

    if (
      snapshotClaims.some(
        (claim) => claim.challengeId === challenge.id && claim.periodKey === periodKey
      )
    ) {
      return false;
    }

    const nowIso = new Date().toISOString();

    setChallengeClaims((current) => {
      const alreadyClaimed = current.some(
        (entry) =>
          entry.userId === userId &&
          entry.challengeId === challenge.id &&
          entry.periodKey === periodKey
      );

      if (alreadyClaimed) {
        return current;
      }

      const claim: UserChallengeClaim = {
        userId,
        challengeId: challenge.id,
        periodKey,
        resetPeriod: challenge.resetPeriod,
        rewardType: challenge.rewardType,
        rewardValue: challenge.rewardValue,
        claimedAt: nowIso
      };

      const deduped = current.filter(
        (entry) =>
          !(
            entry.userId === userId &&
            entry.challengeId === challenge.id &&
            entry.periodKey === periodKey
          )
      );
      return [claim, ...deduped].slice(0, MAX_STORED_CLAIMS);
    });

    return true;
  };

  const resetChallengeClaims = (resetPeriod?: Challenge['resetPeriod']) => {
    setChallengeClaims((current) =>
      current.filter((claim) => {
        if (claim.userId !== userId) {
          return true;
        }

        if (!resetPeriod) {
          return false;
        }

        return claim.resetPeriod !== resetPeriod;
      })
    );
  };

  return {
    runs: userRuns,
    challengeClaims: userClaims,
    rewardRegistry,
    summary,
    saveRun,
    clearRuns,
    isChallengeClaimed,
    claimChallengeReward,
    resetChallengeClaims
  };
};
