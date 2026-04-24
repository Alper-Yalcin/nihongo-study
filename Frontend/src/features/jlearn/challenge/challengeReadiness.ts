import { JLearnLevel, JLearnStep, JLearnTrack } from '../../../data/jlearn/jlearnTypes';
import { MissionProgress } from '../../../data/jlearn/jlearnStorage';
import {
  JLearnFeatureFlags,
  JLearnUserState,
} from '../debug/debugStore';

const JLEARN_CHALLENGE_ATTEMPTS_KEY = 'kototsuna.jlearn.challenge-attempts.v1';

interface ChallengePreview {
  title: string;
  description: string;
}

export interface JLearnChallengeAttempt {
  challengeId: string;
  levelId: string;
  attemptedAt: string;
}

export interface JLearnChallengeCta {
  challengeId: string;
  levelId: string;
  levelTitle: string;
  title: string;
  description: string;
  checkpointStepId: string | null;
  isPreview: boolean;
}

const challengePreviewByLevelId: Record<string, ChallengePreview> = {
  JL1: {
    title: 'Social Starter Challenge',
    description: 'A mixed checkpoint remix for greeting, host-family, and daily-life basics.',
  },
  JL2: {
    title: 'Transfer Student Challenge',
    description: 'A school-life remix that checks introductions, classroom cues, and friend talk.',
  },
  JL3: {
    title: 'Market Errand Challenge',
    description: 'A shopping remix for prices, requests, and quick corrections under pressure.',
  },
};

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const readChallengeAttempts = (): JLearnChallengeAttempt[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(JLEARN_CHALLENGE_ATTEMPTS_KEY);
  return safeParse<JLearnChallengeAttempt[]>(raw, []).filter(
    (attempt) =>
      typeof attempt.challengeId === 'string' &&
      typeof attempt.levelId === 'string' &&
      typeof attempt.attemptedAt === 'string'
  );
};

export const markChallengeAttempted = (challenge: JLearnChallengeCta): void => {
  if (typeof window === 'undefined') return;
  const attempts = readChallengeAttempts();
  const next = attempts.some((attempt) => attempt.challengeId === challenge.challengeId)
    ? attempts
    : [
        ...attempts,
        {
          challengeId: challenge.challengeId,
          levelId: challenge.levelId,
          attemptedAt: new Date().toISOString(),
        },
      ];

  window.localStorage.setItem(JLEARN_CHALLENGE_ATTEMPTS_KEY, JSON.stringify(next));
};

export const isChallengeAttempted = (challengeId: string): boolean =>
  readChallengeAttempts().some((attempt) => attempt.challengeId === challengeId);

export const getLevelCheckpointStep = (level: JLearnLevel): JLearnStep | null => {
  const checkpointUnit = level.units.find((unit) => unit.id === level.checkpointUnitId);
  if (!checkpointUnit) return null;
  return checkpointUnit.steps.find((step) => step.isCheckpoint) ?? checkpointUnit.steps.at(-1) ?? null;
};

export const isLevelCheckpointPassed = (
  level: JLearnLevel,
  progress: MissionProgress
): boolean => {
  if (progress.completedLevelIds.includes(level.id)) return true;
  const checkpointStep = getLevelCheckpointStep(level);
  return Boolean(checkpointStep && progress.completedStepIds.includes(checkpointStep.id));
};

export const getChallengeCtaForLevel = (
  level: JLearnLevel,
  progress: MissionProgress,
  userState: JLearnUserState,
  featureFlags: JLearnFeatureFlags
): JLearnChallengeCta | null => {
  if (!featureFlags.challengeCta) return null;
  if (userState.confidenceLevel !== 'high') return null;
  if (!isLevelCheckpointPassed(level, progress)) return null;

  const preview = challengePreviewByLevelId[level.id];
  const mission = level.challengeMission;
  if (!mission && !preview) return null;

  const challengeId = mission?.id ?? `${level.id}-challenge-preview`;
  if (isChallengeAttempted(challengeId)) return null;

  const checkpointStep = getLevelCheckpointStep(level);

  return {
    challengeId,
    levelId: level.id,
    levelTitle: level.title,
    title: mission?.title ?? preview.title,
    description: mission?.goal ?? mission?.scenario ?? preview.description,
    checkpointStepId: checkpointStep?.id ?? null,
    isPreview: !mission,
  };
};

export const getReadyChallengeCtas = (
  track: JLearnTrack,
  progress: MissionProgress,
  userState: JLearnUserState,
  featureFlags: JLearnFeatureFlags
): JLearnChallengeCta[] =>
  track.levels
    .map((level) => getChallengeCtaForLevel(level, progress, userState, featureFlags))
    .filter((challenge): challenge is JLearnChallengeCta => Boolean(challenge));
