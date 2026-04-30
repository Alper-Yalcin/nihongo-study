import React, { useEffect, useMemo, useState } from 'react';
import { Award, Flame, Gem, Sparkles } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../data/studyContent';
import { useKanaProgressSummary } from '../features/kana/progress/progressStore';
import { buildKanaRoadmapTrack, getTrackLessonOrder } from '../features/study-roadmap/content/roadmapDefinitions';
import { useStudyRoadmapStore } from '../features/study-roadmap/progress/useStudyRoadmapStore';
import { usePlayProgressStore } from '../features/play/progress/usePlayProgressStore';
import { useFeedback } from '../hooks/useFeedback';
import { getJLearnUserState, subscribeJLearnUserState } from '../features/jlearn/debug/debugStore';
import { getKyuFromXp } from '../data/danSystem';
import { HeatCalendar } from '../components/feedback/HeatCalendar';
import { getFreezeStatus, tomoshibiVisual } from '../features/streak/tomoshibi';
import { getSeasonInfo } from '../features/quests/seasonalQuest';
import { GamePageShell, PageHero, SectionBlock } from '../components/layout';
import { ProgressRail, StatPill } from '../components/shared';

interface ProfilePageProps {
  language: AppLanguage;
}

const localUserId = 'local-user';

export const ProfilePage: React.FC<ProfilePageProps> = ({ language }) => {
  const playStore = usePlayProgressStore(localUserId);
  const hiraganaSummary = useKanaProgressSummary('hiragana');
  const katakanaSummary = useKanaProgressSummary('katakana');
  const { state: feedbackState } = useFeedback();
  const [streakDays, setStreakDays] = useState(() => getJLearnUserState().streakDays);

  useEffect(
    () => subscribeJLearnUserState(() => setStreakDays(getJLearnUserState().streakDays)),
    []
  );

  const dan = getKyuFromXp(feedbackState.hanabira, streakDays);
  const tomoshibi = tomoshibiVisual(streakDays);
  const season = useMemo(() => getSeasonInfo(language === 'tr' ? 'tr' : 'en'), [language]);
  const freeze = getFreezeStatus();
  const masteredCount = (hiraganaSummary?.masteredCount ?? 0) + (katakanaSummary?.masteredCount ?? 0);

  const hiraganaSections = useMemo(() => getLocalizedHiraganaSections(language), [language]);
  const katakanaSections = useMemo(() => getLocalizedKatakanaSections(language), [language]);
  const hiraganaTrack = useMemo(() => buildKanaRoadmapTrack('hiragana', hiraganaSections, language), [hiraganaSections, language]);
  const katakanaTrack = useMemo(() => buildKanaRoadmapTrack('katakana', katakanaSections, language), [katakanaSections, language]);
  const hiraganaLessons = useMemo(() => hiraganaTrack.levels.flatMap((level) => level.lessons), [hiraganaTrack]);
  const katakanaLessons = useMemo(() => katakanaTrack.levels.flatMap((level) => level.lessons), [katakanaTrack]);
  const hiraganaRoadmap = useStudyRoadmapStore('hiragana', getTrackLessonOrder(hiraganaTrack), hiraganaLessons);
  const katakanaRoadmap = useStudyRoadmapStore('katakana', getTrackLessonOrder(katakanaTrack), katakanaLessons);
  const completedLessons =
    hiraganaRoadmap.scriptProgress.completedLessonIds.length +
    katakanaRoadmap.scriptProgress.completedLessonIds.length;
  const xpPathPercent = Math.max(8, Math.min(100, playStore.summary.totalXp % 100));

  return (
    <GamePageShell className="space-y-6">
      <PageHero
        className="bg-[linear-gradient(135deg,var(--kt-surface-raised),var(--kt-dan-gold-soft)_58%,var(--kt-accent-info-soft))]"
        backgroundGlyph="道場"
        eyebrow={
          <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-subtle)]">
            {language === 'tr' ? 'Dojo profili' : 'Dojo profile'}
          </div>
        }
        title="Kototsuna Learner"
        description={
          <ProgressRail
            label={language === 'tr' ? 'XP yolu' : 'XP path'}
            value={xpPathPercent}
            max={100}
            description={`${playStore.summary.totalXp} XP`}
            className="max-w-xl"
          />
        }
        visual={
          <div
            className="relative flex h-28 w-28 items-center justify-center rounded-full text-4xl font-black"
            style={{
              background: 'color-mix(in srgb, var(--kt-tomoshibi) 18%, var(--kt-surface))',
              color: 'var(--kt-tomoshibi-strong)',
              boxShadow: streakDays > 0 ? `0 0 ${tomoshibi.glow}px color-mix(in srgb, ${tomoshibi.haloColor} 70%, transparent)` : undefined
            }}
          >
            <Flame size={40} className={streakDays > 0 ? 'kt-tomoshibi-flicker' : ''} />
            <span
              className="absolute -bottom-2 -right-2 rounded-full px-3 py-1 text-[11px] font-black"
              style={{ background: 'var(--kt-dan-gold)', color: 'var(--kt-dan-ink)' }}
              title={dan.rank}
            >
              {dan.label}
            </span>
          </div>
        }
        stats={
          <>
            <StatPill label="Tomoshibi" value={`${streakDays}d`} icon={<Flame size={16} />} tone="warning" />
            <StatPill label="Hanabira" value={feedbackState.hanabira} icon={<Sparkles size={16} />} tone="brand" />
            <StatPill label={dan.rank} value={dan.label} icon={<Award size={16} />} tone="gold" />
            {freeze.available > 0 ? <StatPill label="Freeze" value={freeze.available} tone="info" /> : null}
          </>
        }
      />

      <SectionBlock>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink-strong)]">
            {language === 'tr' ? 'Is takvimi' : 'Heat calendar'}
          </h2>
          <span className="text-[11px] font-bold text-[var(--kt-ink-muted)]">
            {language === 'tr' ? 'Son 30 hafta' : 'Last 30 weeks'}
          </span>
        </div>
        <div className="mt-3">
          <HeatCalendar weeks={30} />
        </div>
      </SectionBlock>

      <section className="flex flex-wrap gap-2 border-b border-[var(--kt-border-subtle)] pb-5">
        <StatPill label="Combo Max" value={`x${feedbackState.comboMaxAllTime}`} />
        <StatPill label={language === 'tr' ? 'Ustalasan kana' : 'Mastered kana'} value={masteredCount} tone="success" />
        <StatPill label={`${season.daysElapsed}/${season.durationDays}d`} value={season.label} tone="gold" />
        <StatPill label="Tracked" value={hiraganaSummary.tracked + katakanaSummary.tracked} />
        <StatPill label="Lessons" value={completedLessons} tone="info" />
        <StatPill label="Game Runs" value={playStore.summary.totalSessions} tone="brand" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
        <SectionBlock>
          <div className="flex items-center gap-3">
            <Award size={20} className="text-[var(--kt-dan-gold)]" />
            <h2 className="text-3xl font-black text-[var(--kt-ink-strong)]">
              {language === 'tr' ? 'Rozet vitrini' : 'Badge showcase'}
            </h2>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="rounded-full bg-[var(--kt-dan-gold-soft)] px-4 py-2 text-sm font-semibold text-[var(--kt-dan-ink)]">
              {`${playStore.rewardRegistry.badges} badge`}
            </span>
            {playStore.rewardRegistry.unlockedThemeIds.map((themeId) => (
              <span key={themeId} className="rounded-full bg-[var(--kt-surface-muted)] px-4 py-2 text-sm font-semibold">
                {themeId}
              </span>
            ))}
            {playStore.rewardRegistry.unlockedFeatureIds.map((featureId) => (
              <span key={featureId} className="rounded-full bg-[var(--kt-surface-muted)] px-4 py-2 text-sm font-semibold">
                {featureId}
              </span>
            ))}
            {playStore.rewardRegistry.unlockedThemeIds.length === 0 &&
              playStore.rewardRegistry.unlockedFeatureIds.length === 0 &&
              playStore.rewardRegistry.badges === 0 ? (
                <p className="text-sm text-[var(--kt-ink-muted)]">
                  {language === 'tr' ? 'Henuz claim edilmis odul yok.' : 'No claimed rewards yet.'}
                </p>
              ) : null}
          </div>
        </SectionBlock>

        <SectionBlock className="bg-[linear-gradient(135deg,var(--kt-surface),var(--kt-accent-info-soft))]">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-[var(--kt-accent-info)]" />
            <h2 className="text-3xl font-black text-[var(--kt-ink-strong)]">
              {language === 'tr' ? 'Track dagilimi' : 'Track distribution'}
            </h2>
          </div>
          <div className="mt-5 grid gap-3">
            <ProfileTrack label="Hiragana completed" value={hiraganaRoadmap.scriptProgress.completedLessonIds.length} icon={<Gem size={16} />} />
            <ProfileTrack label="Katakana completed" value={katakanaRoadmap.scriptProgress.completedLessonIds.length} icon={<Sparkles size={16} />} />
            <ProfileTrack label="Challenge claims" value={playStore.summary.totalChallengeClaims} icon={<Flame size={16} />} />
          </div>
        </SectionBlock>
      </section>

      <SectionBlock>
        <h2 className="text-3xl font-black text-[var(--kt-ink-strong)]">
          {language === 'tr' ? 'Son aktiviteler' : 'Recent activity'}
        </h2>
        <div className="mt-5 space-y-3">
          {playStore.runs.slice(0, 5).map((run) => (
            <div
              key={run.session.id}
              className="border-b border-[var(--kt-border-subtle)] py-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-black text-[var(--kt-ink-strong)]">{run.session.gameId}</div>
                  <div className="text-sm text-[var(--kt-ink-muted)]">{new Date(run.session.endedAt).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-[var(--kt-ink-strong)]">{run.session.score}</div>
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--kt-ink-subtle)]">{`${run.xpEarned} XP`}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionBlock>
    </GamePageShell>
  );
};

const ProfileTrack: React.FC<{ label: string; value: React.ReactNode; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex items-center justify-between gap-4 border-b border-[var(--kt-border-subtle)] py-3">
    <div className="flex items-center gap-3 text-sm font-black text-[var(--kt-ink-strong)]">
      <span className="text-[var(--kt-brand)]">{icon}</span>
      {label}
    </div>
    <div className="text-xl font-black tabular-nums text-[var(--kt-ink-strong)]">{value}</div>
  </div>
);
