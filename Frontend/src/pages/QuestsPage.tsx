import React, { useMemo, useState } from 'react';
import { Clock3, Gift, Sparkles } from 'lucide-react';
import { Card } from '../shared/ui';
import { AppLanguage } from '../data/appPreferences';
import {
  evaluateChallengeProgress,
  getPlayChallenges
} from '../features/play/challenges/challengeEngine';
import { usePlayProgressStore } from '../features/play/progress/usePlayProgressStore';
import { QuestCard } from '../components/quests/QuestCard';
import { awardBonusHanabira } from '../shared/hooks/useFeedback';
import { playKoto } from '../shared/feedback/sounds';
import { getSeasonInfo } from '../features/quests/seasonalQuest';

interface QuestsPageProps {
  language: AppLanguage;
}

const localUserId = 'local-user';

const getHoursToReset = () => {
  const now = new Date();
  const reset = new Date(now);
  reset.setHours(24, 0, 0, 0);
  return Math.max(0, Math.round((reset.getTime() - now.getTime()) / 3600000));
};

const tryVibrate = (pattern: number | number[]): void => {
  if (typeof navigator === 'undefined') return;
  const nav = navigator as unknown as { vibrate?: (p: number | number[]) => boolean };
  try { nav.vibrate?.(pattern); } catch { /* yok say */ }
};

interface NextRewardPreview {
  totalRemaining: number;
  count: number;
}

export const QuestsPage: React.FC<QuestsPageProps> = ({ language }) => {
  const {
    runs,
    isChallengeClaimed,
    claimChallengeReward
  } = usePlayProgressStore(localUserId);
  const quests = useMemo(
    () =>
      evaluateChallengeProgress({
        challenges: getPlayChallenges(language),
        sessions: runs.map((run) => run.session),
        userId: localUserId
      }),
    [language, runs]
  );

  const daily = quests.filter((item) => item.challenge.resetPeriod === 'daily');
  const weekly = quests.filter((item) => item.challenge.resetPeriod === 'weekly');
  const season = useMemo(() => getSeasonInfo(language === 'tr' ? 'tr' : 'en'), [language]);

  const claim = (challengeId: string, periodKey: string, rewardValue: number, rewardType: string) => {
    claimChallengeReward({ id: challengeId } as never, periodKey, { completed: true });
    if (rewardType === 'xp') {
      awardBonusHanabira(rewardValue);
    }
    playKoto();
    tryVibrate([30, 40, 30]);
  };

  const claimAll = () => {
    let claimedCount = 0;
    [...daily, ...weekly].forEach((item) => {
      const claimable =
        item.progress.completed &&
        !isChallengeClaimed(item.challenge.id, item.progress.periodKey);
      if (claimable) {
        claim(item.challenge.id, item.progress.periodKey, item.challenge.rewardValue, item.challenge.rewardType);
        claimedCount += 1;
      }
    });
    if (claimedCount === 0) playKoto();
  };

  const nextPreview: NextRewardPreview = useMemo(() => {
    const incomplete = [...daily, ...weekly].filter((item) => !item.progress.completed);
    const xpRemaining = incomplete
      .filter((item) => item.challenge.rewardType === 'xp')
      .reduce((sum, item) => sum + item.challenge.rewardValue, 0);
    return { totalRemaining: xpRemaining, count: incomplete.length };
  }, [daily, weekly]);

  const anyClaimable = [...daily, ...weekly].some(
    (item) => item.progress.completed && !isChallengeClaimed(item.challenge.id, item.progress.periodKey)
  );

  return (
    <div className="space-y-6 pb-10">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
        <Card padding="lg" className="bg-[linear-gradient(135deg,var(--kt-accent-plum)_0%,var(--kt-accent-info)_100%)] text-white">
          <h1 className="text-3xl font-black">{language === 'tr' ? 'Görevler' : 'Quests'}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">
            {language === 'tr'
              ? 'Günlük → haftalık → sezonluk üç katman. Hazır olanları topla, sırada ne var gör.'
              : 'Daily → weekly → seasonal three layers. Claim ready ones, see what is next.'}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={claimAll}
              disabled={!anyClaimable}
              className={`kt-tap-bounce inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition disabled:opacity-50 ${
                anyClaimable ? 'kt-claim-anticipation' : ''
              }`}
              style={{
                background: 'rgba(255,255,255,0.18)',
                color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.45)'
              }}
            >
              <Gift size={14} />
              <span>{language === 'tr' ? 'Tümünü Al' : 'Claim All'}</span>
            </button>
            {nextPreview.count > 0 && (
              <span className="text-xs font-semibold text-white/80">
                {language === 'tr'
                  ? `Sonraki ödüller: +${nextPreview.totalRemaining} 花 · ${nextPreview.count} görev kaldı`
                  : `Next rewards: +${nextPreview.totalRemaining} 花 · ${nextPreview.count} quests left`}
              </span>
            )}
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center gap-3">
            <Clock3 size={18} className="text-[var(--kt-accent-warning)]" />
            <h2 className="text-lg font-black uppercase tracking-[0.12em] text-[var(--kt-ink-strong)]">
              {language === 'tr' ? 'Günlük yenileme' : 'Daily reset'}
            </h2>
          </div>
          <div className="mt-2 text-4xl font-black text-[var(--kt-ink-strong)]">{`${getHoursToReset()}h`}</div>
          <p className="mt-2 text-xs leading-6 text-[var(--kt-ink-muted)]">
            {language === 'tr'
              ? 'Günlük görevler gece yarısı sıfırlanır.'
              : 'Daily quests reset at midnight.'}
          </p>
        </Card>
      </section>

      {/* Sezon — 90 günlük */}
      <section
        className="rounded-[1.4rem] border p-5"
        style={{
          borderColor: 'color-mix(in srgb, var(--kt-dan-gold) 36%, transparent)',
          background: 'var(--kt-dan-gold-soft)',
          color: 'var(--kt-dan-ink)'
        }}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} />
          <h2 className="text-sm font-black uppercase tracking-[0.14em]">
            {language === 'tr' ? 'Sezon' : 'Season'} · {season.label} {season.yearLabel}
          </h2>
        </div>
        <div className="mt-2 text-base font-bold">
          {language === 'tr'
            ? `${season.daysElapsed}. gün · ${season.daysRemaining} gün kaldı`
            : `Day ${season.daysElapsed} · ${season.daysRemaining} days left`}
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full" style={{ background: 'rgba(0,0,0,0.08)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${season.percent}%`, background: 'var(--kt-dan-gold)' }}
          />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {(['🌸', '🍵', '🎴', '⛩️'] as const).map((emoji, i) => {
            const unlocked = season.percent > i * 25;
            return (
              <div
                key={emoji}
                className="flex h-12 items-center justify-center rounded-[0.7rem]"
                style={{
                  background: unlocked ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.04)',
                  fontSize: '1.4rem',
                  opacity: unlocked ? 1 : 0.35
                }}
                title={unlocked ? 'Kazanıldı' : 'Kilitli'}
              >
                {emoji}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] tabular-nums opacity-75">
          {language === 'tr'
            ? 'Sezon sonu: dan terfi şansı + sticker koleksiyonu.'
            : 'End of season: dan promotion + sticker collection.'}
        </p>
      </section>

      {/* Daily */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-[var(--kt-ink-strong)]">
          {language === 'tr' ? 'Günlük Görevler' : 'Daily quests'}
        </h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {daily.map((item, index) => {
            const claimable =
              item.progress.completed && !isChallengeClaimed(item.challenge.id, item.progress.periodKey);
            return (
              <div key={item.challenge.id} className={claimable ? 'kt-claim-anticipation rounded-[1rem]' : ''}>
                <QuestCard
                  title={item.challenge.title}
                  progress={item.progress.progress}
                  goal={item.challenge.goalValue}
                  reward={`${item.challenge.rewardValue} ${item.challenge.rewardType.toUpperCase()}`}
                  completed={item.progress.completed}
                  accent={index % 2 === 0 ? 'warning' : 'brand'}
                  action={
                    claimable ? (
                      <button
                        type="button"
                        onClick={() =>
                          claim(
                            item.challenge.id,
                            item.progress.periodKey,
                            item.challenge.rewardValue,
                            item.challenge.rewardType
                          )
                        }
                        className="kt-tap-bounce w-full rounded-[0.85rem] px-3 py-2 text-xs font-black uppercase tracking-[0.14em]"
                        style={{
                          background: 'var(--kt-brand)',
                          color: 'var(--kt-brand-on)',
                          boxShadow: 'var(--kt-tomoshibi-glow)'
                        }}
                      >
                        🎁 {language === 'tr' ? 'AL' : 'CLAIM'}
                      </button>
                    ) : undefined
                  }
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Weekly */}
      <section className="space-y-3">
        <h2 className="text-xl font-black text-[var(--kt-ink-strong)]">
          {language === 'tr' ? 'Haftalık Görevler' : 'Weekly quests'}
        </h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {weekly.map((item, index) => {
            const claimable =
              item.progress.completed && !isChallengeClaimed(item.challenge.id, item.progress.periodKey);
            return (
              <div key={item.challenge.id} className={claimable ? 'kt-claim-anticipation rounded-[1rem]' : ''}>
                <QuestCard
                  title={item.challenge.title}
                  progress={item.progress.progress}
                  goal={item.challenge.goalValue}
                  reward={`${item.challenge.rewardValue} ${item.challenge.rewardType.toUpperCase()}`}
                  completed={item.progress.completed}
                  accent={index % 2 === 0 ? 'plum' : 'info'}
                  action={
                    claimable ? (
                      <button
                        type="button"
                        onClick={() =>
                          claim(
                            item.challenge.id,
                            item.progress.periodKey,
                            item.challenge.rewardValue,
                            item.challenge.rewardType
                          )
                        }
                        className="kt-tap-bounce w-full rounded-[0.85rem] px-3 py-2 text-xs font-black uppercase tracking-[0.14em]"
                        style={{
                          background: 'var(--kt-accent-plum)',
                          color: '#fff',
                          boxShadow: 'var(--kt-tomoshibi-glow)'
                        }}
                      >
                        🎁 {language === 'tr' ? 'AL' : 'CLAIM'}
                      </button>
                    ) : undefined
                  }
                />
              </div>
            );
          })}
        </div>
      </section>

      <style>{`
        @keyframes kt-claim-pulse {
          0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--kt-dan-gold) 60%, transparent); }
          50%      { box-shadow: 0 0 14px 3px color-mix(in srgb, var(--kt-dan-gold) 70%, transparent); }
        }
        .kt-claim-anticipation {
          animation: kt-claim-pulse 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .kt-claim-anticipation { animation: none; }
        }
      `}</style>
    </div>
  );
};
