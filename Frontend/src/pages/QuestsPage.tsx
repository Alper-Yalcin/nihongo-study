import React, { useMemo } from 'react';
import { Clock3, Gift, Sparkles } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { evaluateChallengeProgress, getPlayChallenges } from '../features/play/challenges/challengeEngine';
import { usePlayProgressStore } from '../features/play/progress/usePlayProgressStore';
import { awardBonusHanabira } from '../hooks/useFeedback';
import { playKoto } from '../components/feedback/sounds';
import { getSeasonInfo } from '../features/quests/seasonalQuest';
import { SceneHeader, ScenePanel, SceneShell } from '../components/layout';
import { MissionBoard, QuestRow, RewardTrack } from '../components/game';
import { StatPill } from '../components/shared';

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
  try {
    nav.vibrate?.(pattern);
  } catch {
    // Device vibration is optional.
  }
};

interface NextRewardPreview {
  totalRemaining: number;
  count: number;
}

export const QuestsPage: React.FC<QuestsPageProps> = ({ language }) => {
  const { runs, isChallengeClaimed, claimChallengeReward } = usePlayProgressStore(localUserId);
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
      const claimable = item.progress.completed && !isChallengeClaimed(item.challenge.id, item.progress.periodKey);
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
  const dailyComplete = daily.filter((item) => item.progress.completed).length;
  const weeklyComplete = weekly.filter((item) => item.progress.completed).length;

  const renderQuestRows = (items: typeof daily, accent: string) =>
    items.map((item) => {
      const claimed = isChallengeClaimed(item.challenge.id, item.progress.periodKey);
      const claimable = item.progress.completed && !claimed;

      return (
        <QuestRow
          key={item.challenge.id}
          title={item.challenge.title}
          reward={`${item.challenge.rewardValue} ${item.challenge.rewardType.toUpperCase()}`}
          progress={item.progress.progress}
          goal={item.challenge.goalValue}
          completed={item.progress.completed}
          claimed={claimed}
          claimLabel={language === 'tr' ? 'Al' : 'Claim'}
          claimedLabel={language === 'tr' ? 'Alindi' : 'Claimed'}
          accent={accent}
          onClaim={
            claimable
              ? () => claim(item.challenge.id, item.progress.periodKey, item.challenge.rewardValue, item.challenge.rewardType)
              : undefined
          }
        />
      );
    });

  return (
    <SceneShell variant="wide">
      <ScenePanel className="overflow-hidden">
        <SceneHeader
          eyebrow={language === 'tr' ? 'Gorev Panosu' : 'Mission Board'}
          title={language === 'tr' ? 'Bugunun Gorevleri' : "Today's Quests"}
          description={
            language === 'tr'
              ? 'Gunluk hedefleri temizle, haftalik yolu ilerlet ve sezon odullerini ac.'
              : 'Clear daily goals, move the weekly path, and unlock seasonal rewards.'
          }
          glyph="任務"
          actions={
            <button
              type="button"
              onClick={claimAll}
              disabled={!anyClaimable}
              className={`kt-tap-bounce inline-flex items-center gap-2 rounded-full bg-[var(--kt-brand)] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-brand-on)] transition disabled:cursor-not-allowed disabled:opacity-45 ${
                anyClaimable ? 'kt-claim-anticipation' : ''
              }`}
            >
              <Gift size={14} />
              <span>{language === 'tr' ? 'Tumunu al' : 'Claim all'}</span>
            </button>
          }
          stats={
            <>
              <StatPill label={language === 'tr' ? 'Gunluk' : 'Daily'} value={`${dailyComplete}/${daily.length}`} tone="warning" />
              <StatPill label={language === 'tr' ? 'Haftalik' : 'Weekly'} value={`${weeklyComplete}/${weekly.length}`} tone="info" />
              <StatPill label={language === 'tr' ? 'Kalan' : 'Left'} value={nextPreview.count} tone="brand" />
            </>
          }
          visual={
            <div className="min-w-36 border-l border-[var(--kt-border-subtle)] pl-5">
              <div className="flex items-center gap-2 text-[var(--kt-ink-muted)]">
                <Clock3 size={17} />
                <span className="text-xs font-black uppercase tracking-[0.14em]">
                  {language === 'tr' ? 'Reset' : 'Reset'}
                </span>
              </div>
              <div className="mt-2 text-4xl font-black text-[var(--kt-ink-strong)]">{getHoursToReset()}h</div>
            </div>
          }
        />

        <div className="mt-6 border-y border-[var(--kt-border-subtle)] py-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[var(--kt-dan-ink)]">
              <Sparkles size={16} />
              <h2 className="text-sm font-black uppercase tracking-[0.14em]">
                {language === 'tr' ? 'Sezon yolu' : 'Season path'} / {season.label} {season.yearLabel}
              </h2>
            </div>
            <div className="text-sm font-black text-[var(--kt-dan-ink)]">
              {language === 'tr'
                ? `${season.daysElapsed}. gun / ${season.daysRemaining} gun kaldi`
                : `Day ${season.daysElapsed} / ${season.daysRemaining} days left`}
            </div>
          </div>
          <RewardTrack
            percent={season.percent}
            label={language === 'tr' ? 'Reward path' : 'Reward path'}
            description={
              nextPreview.count > 0
                ? language === 'tr'
                  ? `Siradaki oduller: +${nextPreview.totalRemaining} hanabira / ${nextPreview.count} gorev kaldi`
                  : `Next rewards: +${nextPreview.totalRemaining} hanabira / ${nextPreview.count} quests left`
                : language === 'tr'
                  ? 'Tum gorevler tamamlandi.'
                  : 'All available quests are complete.'
            }
          />
        </div>

        <div className="grid gap-7 pt-6 xl:grid-cols-2">
          <MissionBoard
            title={language === 'tr' ? 'Gunluk Misyonlar' : 'Daily Missions'}
            summary={`${dailyComplete}/${daily.length} ${language === 'tr' ? 'tamam' : 'complete'}`}
          >
            {renderQuestRows(daily, 'var(--kt-accent-warning)')}
          </MissionBoard>

          <MissionBoard
            title={language === 'tr' ? 'Haftalik Yol' : 'Weekly Path'}
            summary={`${weeklyComplete}/${weekly.length} ${language === 'tr' ? 'tamam' : 'complete'}`}
          >
            {renderQuestRows(weekly, 'var(--kt-accent-plum)')}
          </MissionBoard>
        </div>

        <style>{`
          @keyframes kt-claim-pulse {
            0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--kt-dan-gold) 60%, transparent); }
            50% { box-shadow: 0 0 14px 3px color-mix(in srgb, var(--kt-dan-gold) 70%, transparent); }
          }
          .kt-claim-anticipation {
            animation: kt-claim-pulse 1.6s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .kt-claim-anticipation { animation: none; }
          }
        `}</style>
      </ScenePanel>
    </SceneShell>
  );
};
