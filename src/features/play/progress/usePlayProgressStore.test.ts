import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getChallengePeriodKey } from '../challenges/challengeEngine';
import { Challenge } from '../domain/playTypes';
import { usePlayProgressStore } from './usePlayProgressStore';

const dailyXpChallenge: Challenge = {
  id: 'daily-xp-claim',
  title: 'Daily XP claim',
  type: 'games_completed',
  goalValue: 1,
  rewardType: 'xp',
  rewardValue: 30,
  resetPeriod: 'daily'
};

const weeklyUnlockChallenge: Challenge = {
  id: 'weekly-unlock-claim',
  title: 'Weekly unlock claim',
  type: 'distinct_games',
  goalValue: 2,
  rewardType: 'unlock',
  rewardValue: 1,
  resetPeriod: 'weekly'
};

const weeklyThemeChallenge: Challenge = {
  id: 'weekly-theme-claim',
  title: 'Weekly theme claim',
  type: 'correct_answers',
  goalValue: 10,
  rewardType: 'theme',
  rewardValue: 1,
  resetPeriod: 'weekly'
};

describe('usePlayProgressStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('rejects claims that are not completed and validates period key', () => {
    const { result } = renderHook(() => usePlayProgressStore('test-user'));
    const validPeriodKey = getChallengePeriodKey('daily', new Date());

    act(() => {
      const notCompleted = result.current.claimChallengeReward(dailyXpChallenge, validPeriodKey, {
        completed: false
      });
      expect(notCompleted).toBe(false);
    });

    act(() => {
      const invalidPeriod = result.current.claimChallengeReward(dailyXpChallenge, '2099-01-01', {
        completed: true
      });
      expect(invalidPeriod).toBe(false);
    });

    expect(result.current.challengeClaims).toHaveLength(0);
  });

  it('prevents duplicate claims and updates unlock registry from claims', async () => {
    const { result } = renderHook(() => usePlayProgressStore('test-user'));

    const dailyPeriodKey = getChallengePeriodKey('daily', new Date());

    act(() => {
      const firstClaim = result.current.claimChallengeReward(dailyXpChallenge, dailyPeriodKey, {
        completed: true
      });
      expect(firstClaim).toBe(true);
    });

    act(() => {
      const duplicateClaim = result.current.claimChallengeReward(dailyXpChallenge, dailyPeriodKey, {
        completed: true
      });
      expect(duplicateClaim).toBe(false);
    });

    act(() => {
      const weeklyPeriodKeyNow = getChallengePeriodKey('weekly', new Date());
      expect(
        result.current.claimChallengeReward(weeklyThemeChallenge, weeklyPeriodKeyNow, {
          completed: true
        })
      ).toBe(true);
    });

    act(() => {
      const weeklyPeriodKeyNow = getChallengePeriodKey('weekly', new Date());
      expect(
        result.current.claimChallengeReward(weeklyUnlockChallenge, weeklyPeriodKeyNow, {
          completed: true
        })
      ).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.challengeClaims).toHaveLength(3);
      expect(result.current.summary.unlockedThemeIds).toHaveLength(1);
      expect(result.current.summary.unlockedFeatureIds).toHaveLength(1);
      expect(result.current.summary.claimedXp).toBe(30);
    });
  });

  it('recalculates reward registry when claims are reset', async () => {
    const { result } = renderHook(() => usePlayProgressStore('test-user'));

    act(() => {
      result.current.claimChallengeReward(weeklyThemeChallenge, getChallengePeriodKey('weekly', new Date()), {
        completed: true
      });
      result.current.claimChallengeReward(weeklyUnlockChallenge, getChallengePeriodKey('weekly', new Date()), {
        completed: true
      });
    });

    await waitFor(() => {
      expect(result.current.summary.unlockedThemeIds).toHaveLength(1);
      expect(result.current.summary.unlockedFeatureIds).toHaveLength(1);
    });

    act(() => {
      result.current.resetChallengeClaims('weekly');
    });

    await waitFor(() => {
      expect(result.current.summary.unlockedThemeIds).toHaveLength(0);
      expect(result.current.summary.unlockedFeatureIds).toHaveLength(0);
      expect(
        result.current.challengeClaims.filter((claim) => claim.resetPeriod === 'weekly')
      ).toHaveLength(0);
    });
  });
});
