import React, { useMemo } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, StatCard } from '../shared/ui';
import { AppLanguage } from '../data/appPreferences';
import { appShellRoutes } from '../data/appShellContent';
import { buildKanaRoadmapTrack, getTrackLessonOrder } from '../features/study-roadmap/content/roadmapDefinitions';
import { useStudyRoadmapStore } from '../features/study-roadmap/progress/useStudyRoadmapStore';
import { useKanaProgressSummary } from '../features/kana/progress/progressStore';
import { KanaSection, ScriptLayoutView } from '../types';
import { MascotFigure } from '../components/mascot/MascotFigure';
import { SpeechBubble } from '../components/mascot/SpeechBubble';
import { ProgressRing } from '../components/shared/ProgressRing';

interface ScriptPageProps {
  title: string;
  script: 'hiragana' | 'katakana';
  language: AppLanguage;
  getSections: (language: AppLanguage) => KanaSection[];
  initialView?: ScriptLayoutView;
}

const speechSamples = {
  hiragana: ['こんにちは！', 'すこしずつ進もう。', 'きょうもいい感じ。', 'あと少しで次の章。'],
  katakana: ['コンニチハ！', 'テンポよく進もう。', 'ローンワードに強くなる。', '次の色帯が見えてきた。']
} as const;

const accentBands = [
  'bg-[linear-gradient(135deg,var(--kt-brand)_0%,var(--kt-accent-info)_100%)]',
  'bg-[linear-gradient(135deg,var(--kt-accent-info)_0%,var(--kt-accent-plum)_100%)]',
  'bg-[linear-gradient(135deg,var(--kt-accent-plum)_0%,var(--kt-accent-warning)_100%)]',
  'bg-[linear-gradient(135deg,var(--kt-accent-sunset)_0%,var(--kt-brand)_100%)]'
];

export const ScriptPage: React.FC<ScriptPageProps> = ({
  title,
  script,
  language,
  getSections
}) => {
  const sections = useMemo(() => getSections(language), [getSections, language]);
  const track = useMemo(() => buildKanaRoadmapTrack(script, sections, language), [language, script, sections]);
  const lessons = useMemo(() => track.levels.flatMap((level) => level.lessons), [track]);
  const lessonOrder = useMemo(() => getTrackLessonOrder(track), [track]);
  const {
    completionRatio,
    getLessonStatus,
    getRecommendedLessonId,
    scriptProgress
  } = useStudyRoadmapStore(script, lessonOrder, lessons);
  const summary = useKanaProgressSummary(script);
  const recommendedLessonId = getRecommendedLessonId();
  const overviewHref = script === 'hiragana' ? appShellRoutes.hiraganaLearn : appShellRoutes.katakanaLearn;

  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
        <Link to={appShellRoutes.home} className="inline-flex items-center gap-2 hover:text-[var(--kt-ink)]">
          <ArrowLeft size={14} />
          {language === 'tr' ? 'Geri' : 'Back'}
        </Link>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
        <div className="rounded-[2rem] border border-[var(--kt-border)] bg-[rgba(8,14,22,0.88)] p-7 shadow-[var(--kt-shadow-lg)]">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.16em] text-[var(--kt-ink-subtle)]">
                {script === 'hiragana' ? 'あ Hiragana' : 'ア Katakana'}
              </div>
              <h1 className="mt-3 text-5xl font-black text-white">{title}</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/72">
                {language === 'tr'
                  ? 'Her kisim artik kart-stack yapisinda. Ilerleme, aktif unite ve bir sonraki acilacak alan tek ekranda gorunuyor.'
                  : 'Each section now uses a card stack. Progress, the active unit, and the next unlock all surface in one place.'}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button as="link" to={overviewHref} iconEnd={<ArrowRight size={16} />}>
                  {language === 'tr' ? 'Devam et' : 'Continue'}
                </Button>
                <Button as="link" to={`${appShellRoutes.letters}?script=${script}`} variant="secondary">
                  {language === 'tr' ? 'Harfleri ac' : 'Open letters'}
                </Button>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--kt-border)] bg-[rgba(255,255,255,0.04)] p-4">
              <ProgressRing
                value={Math.round(completionRatio * 100)}
                size={96}
                strokeWidth={9}
                tone={script === 'hiragana' ? 'brand' : 'info'}
                label={<span className="text-xs font-black text-white">{`${Math.round(completionRatio * 100)}%`}</span>}
              />
            </div>
          </div>
        </div>

        <Card padding="lg">
          <div className="grid gap-3">
            <StatCard label="Tracked" value={summary.tracked} />
            <StatCard label="Due" value={summary.dueCount} tone="warning" />
            <StatCard label="Mastered" value={summary.masteredCount} tone="success" />
          </div>
          <div className="mt-5 rounded-[1.4rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] p-4">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--kt-ink-subtle)]">
              {language === 'tr' ? 'Aktif Ders' : 'Active lesson'}
            </div>
            <div className="mt-2 text-xl font-black text-[var(--kt-ink-strong)]">
              {lessons.find((lesson) => lesson.id === recommendedLessonId)?.title ?? '-'}
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-5">
        {track.levels.map((level, index) => {
          const completedCount = level.lessons.filter((lesson) => getLessonStatus(lesson.id) === 'completed').length;
          const isLocked = completedCount === 0 && !level.lessons.some((lesson) => getLessonStatus(lesson.id) === 'available');
          const progressPercent = level.lessons.length > 0 ? Math.round((completedCount / level.lessons.length) * 100) : 0;
          const sample = speechSamples[script][index % speechSamples[script].length];

          return (
            <article
              key={level.id}
              className="overflow-hidden rounded-[2rem] border border-[var(--kt-border)] bg-[rgba(8,14,22,0.82)] shadow-[var(--kt-shadow)]"
            >
              <div className={`px-6 py-5 text-white ${accentBands[index % accentBands.length] ?? accentBands[0]}`}>
                <div className="text-sm font-black uppercase tracking-[0.14em] text-white/72">{`${index + 1}. Kisim`}</div>
                <h2 className="mt-2 text-3xl font-black">{level.title}</h2>
              </div>

              <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[rgba(255,255,255,0.08)] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--kt-ink-subtle)]">
                      {isLocked ? (language === 'tr' ? 'Kilitli' : 'Locked') : `${completedCount}/${level.lessons.length}`}
                    </span>
                    <span className="text-sm font-semibold text-[var(--kt-ink-muted)]">
                      {level.lessons.length} {language === 'tr' ? 'Unite' : 'units'}
                    </span>
                  </div>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--kt-ink-muted)]">{level.description}</p>
                  <div className="mt-5 h-3 rounded-full bg-[var(--kt-surface-sunken)]">
                    <div
                      className="h-3 rounded-full bg-[var(--kt-brand)]"
                      style={{ width: `${Math.max(isLocked ? 4 : 10, progressPercent)}%` }}
                    />
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button as="link" to={overviewHref}>
                      {isLocked
                        ? language === 'tr'
                          ? 'Kismi izle'
                          : 'View section'
                        : language === 'tr'
                          ? 'Devam et'
                          : 'Continue'}
                    </Button>
                    <Button as="link" to={`${appShellRoutes.practice}?script=${script}&tab=stats`} variant="secondary">
                      {language === 'tr' ? 'Istatistikler' : 'Stats'}
                    </Button>
                  </div>
                </div>

                <div className="justify-self-center">
                  <div className="flex flex-col items-center gap-4">
                    <SpeechBubble accent={script === 'hiragana' ? 'brand' : 'info'}>{sample}</SpeechBubble>
                    <MascotFigure
                      pose={isLocked ? 'sleep' : index === 0 ? 'wave' : 'study'}
                      tone={script === 'hiragana' ? 'brand' : 'info'}
                      size={140}
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-[1.8rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--kt-ink-subtle)]">
              {language === 'tr' ? 'Track Ozet' : 'Track summary'}
            </div>
            <h2 className="mt-2 text-2xl font-black text-[var(--kt-ink-strong)]">
              {language === 'tr' ? 'Acilan dersler ve mastery' : 'Unlocked lessons and mastery'}
            </h2>
          </div>
          <ProgressRing
            value={Math.round(completionRatio * 100)}
            size={74}
            strokeWidth={7}
            tone={script === 'hiragana' ? 'brand' : 'info'}
          />
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <StatCard label="Unlocked" value={scriptProgress.unlockedLessonIds.length} />
          <StatCard label="Completed" value={scriptProgress.completedLessonIds.length} tone="success" />
          <StatCard label="Recommended" value={recommendedLessonId ? 1 : 0} tone="warning" />
        </div>
      </section>
    </div>
  );
};
