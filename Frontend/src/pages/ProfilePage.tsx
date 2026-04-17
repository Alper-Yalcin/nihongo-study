import React, { useMemo } from 'react';
import { Award, Flame, Gem, Sparkles } from 'lucide-react';
import { Card, StatCard } from '../shared/ui';
import { AppLanguage } from '../data/appPreferences';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../data/studyContent';
import { useKanaProgressSummary } from '../features/kana/progress/progressStore';
import { buildKanaRoadmapTrack, getTrackLessonOrder } from '../features/study-roadmap/content/roadmapDefinitions';
import { useStudyRoadmapStore } from '../features/study-roadmap/progress/useStudyRoadmapStore';
import { usePlayProgressStore } from '../features/play/progress/usePlayProgressStore';

interface ProfilePageProps {
  language: AppLanguage;
}

const localUserId = 'local-user';

export const ProfilePage: React.FC<ProfilePageProps> = ({ language }) => {
  const playStore = usePlayProgressStore(localUserId);
  const hiraganaSummary = useKanaProgressSummary('hiragana');
  const katakanaSummary = useKanaProgressSummary('katakana');

  const hiraganaSections = useMemo(() => getLocalizedHiraganaSections(language), [language]);
  const katakanaSections = useMemo(() => getLocalizedKatakanaSections(language), [language]);
  const hiraganaTrack = useMemo(() => buildKanaRoadmapTrack('hiragana', hiraganaSections, language), [hiraganaSections, language]);
  const katakanaTrack = useMemo(() => buildKanaRoadmapTrack('katakana', katakanaSections, language), [katakanaSections, language]);
  const hiraganaLessons = useMemo(() => hiraganaTrack.levels.flatMap((level) => level.lessons), [hiraganaTrack]);
  const katakanaLessons = useMemo(() => katakanaTrack.levels.flatMap((level) => level.lessons), [katakanaTrack]);
  const hiraganaRoadmap = useStudyRoadmapStore('hiragana', getTrackLessonOrder(hiraganaTrack), hiraganaLessons);
  const katakanaRoadmap = useStudyRoadmapStore('katakana', getTrackLessonOrder(katakanaTrack), katakanaLessons);

  return (
    <div className="space-y-8 pb-8">
      <section className="rounded-[2rem] border border-[var(--kt-border)] bg-[rgba(8,14,22,0.88)] p-7 shadow-[var(--kt-shadow-lg)]">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--kt-brand)] text-4xl font-black text-[var(--kt-brand-on)]">
            K
          </div>
          <div>
            <div className="text-sm font-black uppercase tracking-[0.16em] text-[var(--kt-ink-subtle)]">
              {language === 'tr' ? 'Local profil' : 'Local profile'}
            </div>
            <h1 className="mt-2 text-5xl font-black text-white">Kototsuna Learner</h1>
            <p className="mt-3 text-base leading-8 text-white/72">
              {language === 'tr'
                ? 'Auth sistemi hazir degil, ama bu ekran yeni shell icindeki profil omurgasini ve tum local ilerleme ozetini veriyor.'
                : 'Auth is not live yet, but this screen already acts as the profile backbone and surfaces your local progress.'}
            </p>
          </div>
        </div>
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
