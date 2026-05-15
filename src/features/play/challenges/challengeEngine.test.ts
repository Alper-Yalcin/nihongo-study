import { describe, expect, it } from 'vitest';
import { Challenge, GameSession } from '../domain/playTypes';
import {
  evaluateChallengeProgress,
  getChallengePeriodKey,
  isChallengeSessionInPeriod,
  isValidChallengePeriodKey
} from './challengeEngine';

const createSession = (overrides: Partial<GameSession> = {}): GameSession => ({
  id: `session-${Math.random().toString(36).slice(2, 8)}`,
  userId: 'local-user',
  gameId: 'kana-match',
  startedAt: new Date('2026-04-16T10:00:00.000Z').toISOString(),
  endedAt: new Date('2026-04-16T10:02:00.000Z').toISOString(),
  score: 500,
  accuracy: 90,
  comboMax: 5,
  totalQuestions: 10,
  correctAnswers: 9,
  wrongAnswers: 1,
  contentSetUsed: 'hiragana',
  difficulty: 'normal',
  ...overrides
});

describe('challengeEngine', () => {
  it('creates period keys and validates active period keys', () => {
    const now = new Date();
    const dailyKey = getChallengePeriodKey('daily', now);
    const weeklyKey = getChallengePeriodKey('weekly', now);

    expect(dailyKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(weeklyKey).toMatch(/^\d{4}-W\d{2}$/);
    expect(isValidChallengePeriodKey('daily', dailyKey, now)).toBe(true);
    expect(isValidChallengePeriodKey('weekly', weeklyKey, now)).toBe(true);
    expect(isValidChallengePeriodKey('daily', '2099-01-01', now)).toBe(false);
  });

  it('evaluates challenge progress and completion from in-period sessions', () => {
    const now = new Date();
    const sessions: GameSession[] = [
      createSession({
        correctAnswers: 4,
        accuracy: 82,
        endedAt: new Date(now.getTime() - 2 * 60 * 1000).toISOString(),
        gameId: 'kana-match'
      }),
      createSession({
        correctAnswers: 5,
        accuracy: 95,
        endedAt: new Date(now.getTime() - 1 * 60 * 1000).toISOString(),
        gameId: 'meaning-match'
      })
    ];

    const challenges: Challenge[] = [
      {
        id: 'daily-correct-8',
        title: 'Daily correct answers',
        type: 'correct_answers',
        goalValue: 8,
        rewardType: 'xp',
        rewardValue: 80,
        resetPeriod: 'daily'
      },
      {
        id: 'daily-two-games',
        title: 'Daily two games',
        type: 'games_completed',
        goalValue: 2,
        rewardType: 'badge',
        rewardValue: 1,
        resetPeriod: 'daily'
      }
    ];

    const evaluated = evaluateChallengeProgress({
      challenges,
      sessions,
      userId: 'local-user',
      now
    });

    expect(evaluated).toHaveLength(2);
    expect(evaluated[0].progress.progress).toBe(8);
    expect(evaluated[0].progress.completed).toBe(true);
    expect(evaluated[0].progress.completedAt).not.toBeNull();
    expect(evaluated[1].progress.progress).toBe(2);
    expect(evaluated[1].progress.completed).toBe(true);
    expect(
      isChallengeSessionInPeriod(
        sessions[0],
        'daily',
        getChallengePeriodKey('daily', now)
      )
    ).toBe(true);
  });
});
