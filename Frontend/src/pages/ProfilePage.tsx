import React, { useMemo } from 'react';
import { Award, Flame, Gem, Sparkles } from 'lucide-react';
import { Card, StatCard } from '../components/ui';
import { AppLanguage } from '../data/appPreferences';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../data/studyContent';
import { useKanaProgressSummary } from '../features/kana/progress/progressStore';
import { buildKanaRoadmapTrack, getTrackLessonOrder } from '../features/study-roadmap/content/roadmapDefinitions';
import { useStudyRoadmapStore } from '../features/study-roadmap/progress/useStudyRoadmapStore';
import { usePlayProgressStore } from '../features/play/progress/usePlayProgressStore';
import { useFeedback } from '../hooks/useFeedback';
import { getJLearnUserState, subscribeJLearnUserState } from '../features/jlearn/debug/debugStore';
import { useEffect, useState } from 'react';
import { getKyuFromXp } from '../data/danSystem';
import { HeatCalendar } from '../components/feedback/HeatCalendar';
import { tomoshibiVisual } from '../features/streak/tomoshibi';
import { getSeasonInfo } from '../features/quests/seasonalQuest';
import { getFreezeStatus } from '../features/streak/tomoshibi';

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

  return (
    <div className="space-y-6 pb-8">
      {/* Identity / Dōjō kimliği */}
      <section
        className="rounded-[1.6rem] border p-6 shadow-[var(--kt-shadow-md)]"
        style={{
          borderColor: 'color-mix(in srgb, var(--kt-dan-gold) 40%, transparent)',
          background: 'var(--kt-surface-raised)'
        }}
      >
        <div className="flex flex-wrap items-center gap-5">
          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-full text-4xl font-black"
            style={{
              background: 'color-mix(in srgb, var(--kt-tomoshibi) 18%, var(--kt-surface))',
              color: 'var(--kt-tomoshibi-strong)',
              boxShadow: streakDays > 0 ? `0 0 ${tomoshibi.glow}px color-mix(in srgb, ${tomoshibi.haloColor} 70%, transparent)` : 'none'
            }}
          >
            <Flame size={36} className={streakDays > 0 ? 'kt-tomoshibi-flicker' : ''} />
            <span
              className="absolute -bottom-2 -right-2 rounded-full px-2 py-0.5 text-[11px] font-black"
              style={{
                background: 'var(--kt-dan-gold)',
                color: 'var(--kt-dan-ink)'
              }}
              title={dan.rank}
            >
              {dan.label}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-subtle)]">
              {language === 'tr' ? 'Profil' : 'Profile'}
            </div>
            <h1 className="mt-1 text-3xl font-black text-[var(--kt-ink-strong)]">Kototsuna Learner</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full px-2 py-0.5 font-bold" style={{ background: 'var(--kt-tomoshibi)', color: '#fff' }}>
                灯 {streakDays}g · {tomoshibi.label}
              </span>
              <span className="rounded-full px-2 py-0.5 font-bold" style={{ background: 'var(--kt-hanabira-soft)', color: 'var(--kt-hanabira)' }}>
                花 {feedbackState.hanabira}
              </span>
              <span className="rounded-full px-2 py-0.5 font-bold" style={{ background: 'var(--kt-dan-gold-soft)', color: 'var(--kt-dan-ink)' }}>
                {dan.rank}
              </span>
              {freeze.available > 0 && (
                <span className="rounded-full px-2 py-0.5 font-bold" style={{ background: 'var(--kt-ki-soft)', color: 'var(--kt-ki)' }}>
                  ❄ {freeze.available}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Heat Calendar */}
      <section
        className="rounded-[1.4rem] border p-5"
        style={{
          borderColor: 'var(--kt-border-subtle)',
          background: 'var(--kt-surface)'
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink-strong)]">
            {language === 'tr' ? 'Heat takvimi' : 'Heat calendar'}
          </h2>
          <span className="text-[11px] font-bold text-[var(--kt-ink-muted)]">
            {language === 'tr' ? 'Son 30 hafta' : 'Last 30 weeks'}
          </span>
        </div>
        <div className="mt-3">
          <HeatCalendar weeks={30} />
        </div>
      </section>

      {/* Mushin / combo / mastered */}
      <section className="grid gap-3 sm:grid-cols-3">
        <article
          className="rounded-[1.2rem] border p-4"
          style={{ borderColor: 'var(--kt-border-subtle)', background: 'var(--kt-surface)' }}
        >
          <div className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--kt-ink-muted)]">
            Combo Max
          </div>
          <div className="mt-1 text-2xl font-black tabular-nums text-[var(--kt-ink-strong)]">
            ×{feedbackState.comboMaxAllTime}
          </div>
          <div className="text-[11px] text-[var(--kt-ink-muted)]">連続</div>
        </article>
        <article
          className="rounded-[1.2rem] border p-4"
          style={{ borderColor: 'var(--kt-border-subtle)', background: 'var(--kt-surface)' }}
        >
          <div className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--kt-ink-muted)]">
            {language === 'tr' ? 'Ustalaşan kana' : 'Mastered kana'}
          </div>
          <div className="mt-1 text-2xl font-black tabular-nums text-[var(--kt-ink-strong)]">
            {masteredCount}
          </div>
        </article>
        <article
          className="rounded-[1.2rem] border p-4"
          style={{ borderColor: 'var(--kt-border-subtle)', background: 'var(--kt-surface)' }}
        >
          <div className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--kt-ink-muted)]">
            {language === 'tr' ? 'Sezon' : 'Season'}
          </div>
          <div className="mt-1 text-2xl font-black tabular-nums text-[var(--kt-ink-strong)]">
            {season.label}
          </div>
          <div className="text-[11px] text-[var(--kt-ink-muted)]">
            {season.daysElapsed}/{season.durationDays} g
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Toplam XP" value={playStore.summary.totalXp} icon={<Gem size={18} />} tone="info" />
        <StatCard label="Streak" value={playStore.summary.currentStreakDays} icon={<Flame size={18} />} tone="warning" />
        <StatCard
          label="Mastered"
          value={hiraganaSummary.masteredCount + katakanaSummary.masteredCount}
          icon={<Award size={18} />}
          tone="success"
        />
        <StatCard
          label="Tracked"
          value={hiraganaSummary.tracked + katakanaSummary.tracked}
          icon={<Sparkles size={18} />}
        />
        <StatCard
          label="Lessons"
          value={hiraganaRoadmap.scriptProgress.completedLessonIds.length + katakanaRoadmap.scriptProgress.completedLessonIds.length}
        />
        <StatCard label="Game Runs" value={playStore.summary.totalSessions} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
        <Card padding="lg">
          <h2 className="text-3xl font-black text-[var(--kt-ink-strong)]">
            {language === 'tr' ? 'Rozetler ve unlocklar' : 'Badges and unlocks'}
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="rounded-full border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-2 text-sm font-semibold">
              {`${playStore.rewardRegistry.badges} badge`}
            </span>
            {playStore.rewardRegistry.unlockedThemeIds.map((themeId) => (
              <span key={themeId} className="rounded-full border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-2 text-sm font-semibold">
                {themeId}
              </span>
            ))}
            {playStore.rewardRegistry.unlockedFeatureIds.map((featureId) => (
              <span key={featureId} className="rounded-full border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-2 text-sm font-semibold">
                {featureId}
              </span>
            ))}
            {playStore.rewardRegistry.unlockedThemeIds.length === 0 &&
              playStore.rewardRegistry.unlockedFeatureIds.length === 0 &&
              playStore.rewardRegistry.badges === 0 && (
                <p className="text-sm text-[var(--kt-ink-muted)]">
                  {language === 'tr' ? 'Henuz claim edilmis odul yok.' : 'No claimed rewards yet.'}
                </p>
              )}
          </div>
        </Card>

        <Card padding="lg">
          <h2 className="text-3xl font-black text-[var(--kt-ink-strong)]">
            {language === 'tr' ? 'Track dagilimi' : 'Track distribution'}
          </h2>
          <div className="mt-5 grid gap-3">
            <StatCard label="Hiragana completed" value={hiraganaRoadmap.scriptProgress.completedLessonIds.length} tone="brand" />
            <StatCard label="Katakana completed" value={katakanaRoadmap.scriptProgress.completedLessonIds.length} tone="info" />
            <StatCard label="Challenge claims" value={playStore.summary.totalChallengeClaims} tone="warning" />
          </div>
        </Card>
      </section>

      <Card padding="lg">
        <h2 className="text-3xl font-black text-[var(--kt-ink-strong)]">
          {language === 'tr' ? 'Son aktiviteler' : 'Recent activity'}
        </h2>
        <div className="mt-5 space-y-3">
          {playStore.runs.slice(0, 5).map((run) => (
            <div
              key={run.session.id}
              className="rounded-[1.3rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-4"
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
      </Card>
    </div>
  );
};
