import { AppLanguage } from '../../../data/appPreferences';
import {
  Challenge,
  ChallengeResetPeriod,
  ChallengeType,
  GameSession,
  UserChallengeProgress
} from '../domain/playTypes';

export interface EvaluatedChallenge {
  challenge: Challenge;
  progress: UserChallengeProgress;
}

const getLocalDayKey = (dateValue: Date | string) => {
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getIsoWeekKey = (dateValue: Date) => {
  const date = new Date(Date.UTC(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate()));
  const dayNumber = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNumber);

  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);

  return `${date.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
};

export const getChallengePeriodKey = (period: ChallengeResetPeriod, now: Date) =>
  period === 'daily' ? getLocalDayKey(now) : getIsoWeekKey(now);

export const isValidChallengePeriodKey = (
  period: ChallengeResetPeriod,
  periodKey: string,
  now = new Date()
) => getChallengePeriodKey(period, now) === periodKey;

export const isChallengeSessionInPeriod = (
  session: GameSession,
  period: ChallengeResetPeriod,
  periodKey: string
) => {
  const endedAt = new Date(session.endedAt);

  if (Number.isNaN(endedAt.getTime())) {
    return false;
  }

  return getChallengePeriodKey(period, endedAt) === periodKey;
};

const isSessionInPeriod = (
  session: GameSession,
  period: ChallengeResetPeriod,
  periodKey: string
) => isChallengeSessionInPeriod(session, period, periodKey);

const evaluateChallengeValue = (type: ChallengeType, sessions: GameSession[]) => {
  switch (type) {
    case 'correct_answers':
      return sessions.reduce((total, session) => total + session.correctAnswers, 0);
    case 'games_completed':
      return sessions.length;
    case 'accuracy_threshold':
      return sessions.reduce((maxAccuracy, session) => Math.max(maxAccuracy, session.accuracy), 0);
    case 'active_days':
      return new Set(sessions.map((session) => getLocalDayKey(session.endedAt))).size;
    case 'distinct_games':
      return new Set(sessions.map((session) => session.gameId)).size;
    default:
      return 0;
  }
};

const findCompletionTimestamp = (challenge: Challenge, sessions: GameSession[]) => {
  const ordered = [...sessions].sort((left, right) => left.endedAt.localeCompare(right.endedAt));

  if (challenge.type === 'accuracy_threshold') {
    const completed = ordered.find((session) => session.accuracy >= challenge.goalValue);
    return completed?.endedAt ?? null;
  }

  if (challenge.type === 'distinct_games') {
    const seenGames = new Set<string>();

    for (const session of ordered) {
      seenGames.add(session.gameId);

      if (seenGames.size >= challenge.goalValue) {
        return session.endedAt;
      }
    }

    return null;
  }

  if (challenge.type === 'active_days') {
    const seenDays = new Set<string>();

    for (const session of ordered) {
      seenDays.add(getLocalDayKey(session.endedAt));

      if (seenDays.size >= challenge.goalValue) {
        return session.endedAt;
      }
    }

    return null;
  }

  let progress = 0;

  for (const session of ordered) {
    if (challenge.type === 'games_completed') {
      progress += 1;
    }

    if (challenge.type === 'correct_answers') {
      progress += session.correctAnswers;
    }

    if (progress >= challenge.goalValue) {
      return session.endedAt;
    }
  }

  return null;
};

export const getPlayChallenges = (language: AppLanguage): Challenge[] => {
  if (language === 'tr') {
    return [
      {
        id: 'daily-kana-correct-10',
        title: 'Gunluk 10 dogru cevap',
        type: 'correct_answers',
        goalValue: 10,
        rewardType: 'xp',
        rewardValue: 60,
        resetPeriod: 'daily'
      },
      {
        id: 'daily-finish-3-games',
        title: 'Gunluk 3 oyun bitir',
        type: 'games_completed',
        goalValue: 3,
        rewardType: 'badge',
        rewardValue: 1,
        resetPeriod: 'daily'
      },
      {
        id: 'daily-accuracy-90',
        title: 'Bir oyunu %90 accuracy ile tamamla',
        type: 'accuracy_threshold',
        goalValue: 90,
        rewardType: 'streak',
        rewardValue: 1,
        resetPeriod: 'daily'
      },
      {
        id: 'weekly-active-5-days',
        title: 'Haftada 5 aktif gun',
        type: 'active_days',
        goalValue: 5,
        rewardType: 'xp',
        rewardValue: 180,
        resetPeriod: 'weekly'
      },
      {
        id: 'weekly-correct-100',
        title: 'Haftada 100 dogru cevap',
        type: 'correct_answers',
        goalValue: 100,
        rewardType: 'theme',
        rewardValue: 1,
        resetPeriod: 'weekly'
      },
      {
        id: 'weekly-play-2-modes',
        title: 'Haftada 2 farkli oyun modu oyna',
        type: 'distinct_games',
        goalValue: 2,
        rewardType: 'unlock',
        rewardValue: 1,
        resetPeriod: 'weekly'
      }
    ];
  }

  return [
    {
      id: 'daily-kana-correct-10',
      title: 'Get 10 correct answers today',
      type: 'correct_answers',
      goalValue: 10,
      rewardType: 'xp',
      rewardValue: 60,
      resetPeriod: 'daily'
    },
    {
      id: 'daily-finish-3-games',
      title: 'Complete 3 games today',
      type: 'games_completed',
      goalValue: 3,
      rewardType: 'badge',
      rewardValue: 1,
      resetPeriod: 'daily'
    },
    {
      id: 'daily-accuracy-90',
      title: 'Finish one game with 90% accuracy',
      type: 'accuracy_threshold',
      goalValue: 90,
      rewardType: 'streak',
      rewardValue: 1,
      resetPeriod: 'daily'
    },
    {
      id: 'weekly-active-5-days',
      title: 'Be active for 5 days this week',
      type: 'active_days',
      goalValue: 5,
      rewardType: 'xp',
      rewardValue: 180,
      resetPeriod: 'weekly'
    },
    {
      id: 'weekly-correct-100',
      title: 'Get 100 correct answers this week',
      type: 'correct_answers',
      goalValue: 100,
      rewardType: 'theme',
      rewardValue: 1,
      resetPeriod: 'weekly'
    },
    {
      id: 'weekly-play-2-modes',
      title: 'Play 2 different game modes this week',
      type: 'distinct_games',
      goalValue: 2,
      rewardType: 'unlock',
      rewardValue: 1,
      resetPeriod: 'weekly'
    }
  ];
};

interface EvaluateChallengeProgressInput {
  challenges: Challenge[];
  sessions: GameSession[];
  userId: string;
  now?: Date;
}

export const evaluateChallengeProgress = ({
  challenges,
  sessions,
  userId,
  now = new Date()
}: EvaluateChallengeProgressInput): EvaluatedChallenge[] => {
  const orderedSessions = [...sessions].sort((left, right) => left.endedAt.localeCompare(right.endedAt));

  return challenges.map((challenge) => {
    const periodKey = getChallengePeriodKey(challenge.resetPeriod, now);
    const scopedSessions = orderedSessions.filter((session) =>
      isSessionInPeriod(session, challenge.resetPeriod, periodKey)
    );

    const rawProgress = evaluateChallengeValue(challenge.type, scopedSessions);
    const completed = rawProgress >= challenge.goalValue;

    const progress: UserChallengeProgress = {
      userId,
      challengeId: challenge.id,
      progress: Math.min(rawProgress, challenge.goalValue),
      completed,
      completedAt: completed ? findCompletionTimestamp(challenge, scopedSessions) : null,
      periodKey
    };

    return {
      challenge,
      progress
    };
  });
};
