import React, { useMemo } from 'react';
import { Clock3 } from 'lucide-react';
import { Button, Card } from '../shared/ui';
import { AppLanguage } from '../data/appPreferences';
import {
  evaluateChallengeProgress,
  getPlayChallenges
} from '../features/play/challenges/challengeEngine';
import { usePlayProgressStore } from '../features/play/progress/usePlayProgressStore';
import { QuestCard } from '../components/quests/QuestCard';

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

  return (
    <div className="space-y-8 pb-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(19rem,0.9fr)]">
        <Card padding="lg" className="bg-[linear-gradient(135deg,var(--kt-accent-plum)_0%,var(--kt-accent-info)_100%)] text-white">
          <h1 className="text-4xl font-black">{language === 'tr' ? 'Hos geldin!' : 'Welcome back!'}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/78">
            {language === 'tr'
              ? 'Odulleri kazanmak icin gunluk ve haftalik gorevleri tamamla. Bu ekran artik shell icinde ayri bir hedef merkezi olarak yasiyor.'
              : 'Complete daily and weekly quests to earn rewards. This screen now lives as a dedicated goal center inside the shell.'}
          </p>
        </Card>

        <Card padding="lg">
          <div className="flex items-center gap-3">
            <Clock3 size={18} className="text-[var(--kt-accent-warning)]" />
            <h2 className="text-2xl font-black text-[var(--kt-ink-strong)]">
              {language === 'tr' ? 'Geri sayim' : 'Countdown'}
            </h2>
          </div>
          <div className="mt-4 text-5xl font-black text-[var(--kt-ink-strong)]">{`${getHoursToReset()} SAAT`}</div>
          <p className="mt-3 text-sm leading-7 text-[var(--kt-ink-muted)]">
            {language === 'tr'
              ? 'Gunluk gorevler gece yarisi sifirlanir. Haftalik gorevler ayni shell uzerinden birikir.'
              : 'Daily quests reset at midnight. Weekly quests keep stacking inside the same shell.'}
          </p>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-black text-[var(--kt-ink-strong)]">
          {language === 'tr' ? 'Gunluk Gorevler' : 'Daily quests'}
        </h2>
        <div className="grid gap-4 xl:grid-cols-2">
          {daily.map((item, index) => {
            const claimable = item.progress.completed && !isChallengeClaimed(item.challenge.id, item.progress.periodKey);

            return (
              <QuestCard
                key={item.challenge.id}
                title={item.challenge.title}
                progress={item.progress.progress}
                goal={item.challenge.goalValue}
                reward={`${item.challenge.rewardValue} ${item.challenge.rewardType.toUpperCase()}`}
                completed={item.progress.completed}
                accent={index % 2 === 0 ? 'warning' : 'brand'}
                action={
                  claimable ? (
                    <Button
                      as="button"
                      type="button"
                      onClick={() => claimChallengeReward(item.challenge, item.progress.periodKey, { completed: true })}
                      fullWidth
                    >
                      {language === 'tr' ? 'Odulu al' : 'Claim reward'}
                    </Button>
                  ) : undefined
                }
              />
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-black text-[var(--kt-ink-strong)]">
          {language === 'tr' ? 'Haftalik Gorevler' : 'Weekly quests'}
        </h2>
        <div className="grid gap-4 xl:grid-cols-2">
          {weekly.map((item, index) => {
            const claimable = item.progress.completed && !isChallengeClaimed(item.challenge.id, item.progress.periodKey);

            return (
              <QuestCard
                key={item.challenge.id}
                title={item.challenge.title}
                progress={item.progress.progress}
                goal={item.challenge.goalValue}
                reward={`${item.challenge.rewardValue} ${item.challenge.rewardType.toUpperCase()}`}
                completed={item.progress.completed}
                accent={index % 2 === 0 ? 'plum' : 'info'}
                action={
                  claimable ? (
                    <Button
                      as="button"
                      type="button"
                      onClick={() => claimChallengeReward(item.challenge, item.progress.periodKey, { completed: true })}
                      fullWidth
                    >
                      {language === 'tr' ? 'Odulu al' : 'Claim reward'}
                    </Button>
                  ) : undefined
                }
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};
