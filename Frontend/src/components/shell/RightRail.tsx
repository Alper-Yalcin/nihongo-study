import React, { useMemo } from 'react';
import { Clock3, Medal, Sparkles, TrendingUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { appShellRoutes } from '../../data/appShellContent';
import { AppLanguage } from '../../data/appPreferences';
import { useKanaProgressSummary } from '../../features/kana/progress/progressStore';
import { KanaScript } from '../../features/kana/domain/kanaItem';
import {
  evaluateChallengeProgress,
  getPlayChallenges
} from '../../features/play/challenges/challengeEngine';
import { usePlayProgressStore } from '../../features/play/progress/usePlayProgressStore';
import { Button, Card, StatCard } from '../../shared/ui';
import { ProgressRing } from '../shared/ProgressRing';
import { DailyQuestsCard } from './DailyQuestsCard';
import { StatsStrip } from './StatsStrip';
import { UnlockCTA } from './UnlockCTA';

interface RightRailProps {
  language: AppLanguage;
  activeScript: KanaScript;
}

const localUserId = 'local-user';

export const RightRail: React.FC<RightRailProps> = ({ language, activeScript }) => {
  const location = useLocation();
  const { runs, summary } = usePlayProgressStore(localUserId);
  const scriptSummary = useKanaProgressSummary(activeScript);
  const challengeItems = useMemo(
    () =>
      evaluateChallengeProgress({
        challenges: getPlayChallenges(language),
        sessions: runs.map((run) => run.session),
        userId: localUserId
      }).filter((item) => item.challenge.resetPeriod === 'daily'),
    [language, runs]
  );

  const isHome = location.pathname === appShellRoutes.learn;
  const isLetters = location.pathname.startsWith(appShellRoutes.letters);
  const isPractice = location.pathname.startsWith(appShellRoutes.practice);
  const isQuests = location.pathname.startsWith(appShellRoutes.quests);
  const isProfile = location.pathname === appShellRoutes.account;
  const shouldShowAuthCard = isHome;
  const activeScriptLabel = activeScript === 'hiragana' ? 'Hiragana' : 'Katakana';
  const masteredRatio =
    scriptSummary.tracked > 0 ? Math.round((scriptSummary.masteredCount / scriptSummary.tracked) * 100) : 0;

  return (
    <aside className="hidden xl:flex xl:flex-col xl:gap-5 xl:pb-10">
      <StatsStrip
        streak={summary.currentStreakDays}
        xp={summary.totalXp}
        activeScriptLabel={activeScriptLabel}
      />

      {!isProfile && (
        <UnlockCTA
          title={language === 'tr' ? 'Kanji modulu yakinda aciliyor' : 'Kanji module unlock is coming'}
          description={
            language === 'tr'
              ? `${scriptSummary.masteredCount} mastered karakterle ilerliyorsun. Bir sonraki odak, ${activeScriptLabel} tarafinda %${Math.max(65, masteredRatio)} mastery.`
              : `You are moving with ${scriptSummary.masteredCount} mastered characters. Next milestone: ${Math.max(65, masteredRatio)}% mastery on ${activeScriptLabel}.`
          }
          actionLabel={language === 'tr' ? 'Harf yoluna don' : 'Return to letters path'}
          actionHref={activeScript === 'hiragana' ? appShellRoutes.hiraganaLearn : appShellRoutes.katakanaLearn}
        />
      )}

      {!isProfile && !isQuests && (
        <DailyQuestsCard
          title={language === 'tr' ? 'Gunluk Gorevler' : 'Daily quests'}
          items={challengeItems}
          href={appShellRoutes.quests}
        />
      )}

      {!isProfile && (
        <section className="rounded-[1.8rem] border border-[var(--kt-border-subtle)] bg-[radial-gradient(circle_at_top_right,var(--kt-accent-info-soft),transparent_38%),var(--kt-surface)] p-5 shadow-[var(--kt-shadow-sm)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-[var(--kt-ink-strong)]">
                {language === 'tr' ? 'Mastery ozeti' : 'Mastery summary'}
              </h3>
              <p className="mt-1 text-sm text-[var(--kt-ink-muted)]">{activeScriptLabel}</p>
            </div>
            <ProgressRing
              value={masteredRatio}
              tone="brand"
              label={<span className="text-xs font-black text-[var(--kt-ink-strong)]">{`${masteredRatio}%`}</span>}
            />
          </div>
          <div className="mt-4 grid gap-3">
            <StatCard label="Tracked" value={scriptSummary.tracked} icon={<TrendingUp size={18} />} />
            <StatCard label="Due" value={scriptSummary.dueCount} tone="warning" icon={<Clock3 size={18} />} />
            <StatCard label="Mastered" value={scriptSummary.masteredCount} tone="success" icon={<Medal size={18} />} />
          </div>
        </section>
      )}

      {(isHome || isPractice || isLetters) && summary.lastSession && (
        <section className="rounded-[1.8rem] border border-[var(--kt-border-subtle)] bg-[linear-gradient(180deg,var(--kt-surface-raised),var(--kt-surface))] p-5 shadow-[var(--kt-shadow-sm)]">
          <h3 className="text-xl font-black text-[var(--kt-ink-strong)]">
            {language === 'tr' ? 'Son kazanclar' : 'Recent wins'}
          </h3>
          <div className="mt-4 space-y-3">
            {runs.slice(0, 3).map((run) => (
              <Card key={run.session.id} padding="sm" tone="muted">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-[var(--kt-ink-strong)]">{run.session.gameId}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--kt-ink-muted)]">
                      {new Date(run.session.endedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-[var(--kt-ink-strong)]">{run.session.score}</div>
                    <div className="text-xs text-[var(--kt-ink-muted)]">{`${run.xpEarned} XP`}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {shouldShowAuthCard && (
        <section className="rounded-[1.8rem] border border-[var(--kt-border-subtle)] bg-[radial-gradient(circle_at_top_left,var(--kt-brand-soft),transparent_40%),var(--kt-surface)] p-5 shadow-[var(--kt-shadow-sm)]">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-[var(--kt-brand)]" />
            <h3 className="text-xl font-black text-[var(--kt-ink-strong)]">
              {language === 'tr' ? 'Ilerlemeni kaydet' : 'Save your progress'}
            </h3>
          </div>
          <p className="mt-3 text-sm leading-7 text-[var(--kt-ink-muted)]">
            {language === 'tr'
              ? 'Profil alani hazir. Gecici olarak local ilerleme kullaniyorsun; bu blok auth geldigi anda gercek kayit kartina donecek.'
              : 'The profile area is ready. You are currently using local progress; this card becomes a real auth panel later.'}
          </p>
          <div className="mt-5 grid gap-3">
            <Button as="link" to={appShellRoutes.account} fullWidth>
              {language === 'tr' ? 'Bir profil olustur' : 'Create a profile'}
            </Button>
            <Button as="link" to={appShellRoutes.settings} variant="secondary" fullWidth>
              {language === 'tr' ? 'Tercihlere git' : 'Open preferences'}
            </Button>
          </div>
        </section>
      )}
    </aside>
  );
};
