import React, { useMemo } from 'react';
import { CheckCircle2, CirclePlay, LockKeyhole, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppLanguage, ThemeMode } from '../../data/appPreferences';
import { appShellRoutes, getLearnUnitRoute } from '../../data/appShellContent';
import { flattenLearnCourseUnits, getLearnCourseSections } from '../../data/learnCourseContent';
import { useLearnCourseProgress } from '../../hooks/useLearnCourseProgress';
import { LearnSideRail } from '../../components/learn/LearnSideRail';

interface LearnReviewPageProps {
  language: AppLanguage;
  themeMode: ThemeMode;
}

const copy = {
  tr: {
    eyebrow: 'Tekrar',
    title: 'Tekrar Sirasi',
    description: 'Acik ve tamamlanmis dersleri tekrar etmek icin kullan.',
    back: 'Haritaya don',
    continue: 'Devam et',
    review: 'Tekrar et',
    locked: 'Kilitli',
    emptyTitle: 'Tekrar icin ders yok',
    emptyBody: 'Ilk dersi tamamladiginda tekrar listesi dolmaya baslar.'
  },
  en: {
    eyebrow: 'Review',
    title: 'Review Queue',
    description: 'Use this page to revisit open and completed lessons.',
    back: 'Back to map',
    continue: 'Continue',
    review: 'Review',
    locked: 'Locked',
    emptyTitle: 'No review lessons yet',
    emptyBody: 'Complete the first lesson and the review list will start filling up.'
  }
} as const;

export const LearnReviewPage: React.FC<LearnReviewPageProps> = ({ language, themeMode }) => {
  const pageCopy = copy[language];
  const sections = useMemo(() => getLearnCourseSections(language), [language]);
  const units = useMemo(() => flattenLearnCourseUnits(sections), [sections]);
  const orderedUnitIds = useMemo(() => units.map((unit) => unit.id), [units]);
  const { getUnitProgress, getUnitState } = useLearnCourseProgress(orderedUnitIds);

  const reviewItems = units
    .map((unit) => ({
      unit,
      state: getUnitState(unit.id),
      progress: getUnitProgress(unit.id)
    }))
    .filter((entry) => entry.state !== 'locked');

  return (
    <>
      <LearnSideRail language={language} themeMode={themeMode} activeItem="review" position="fixed" />
      <div className="mx-auto max-w-5xl pb-12 lg:pl-[112px]">
        <Link
          to={appShellRoutes.learn}
          className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)] transition hover:text-[var(--kt-brand)]"
        >
          {pageCopy.back}
        </Link>

      <section className="mt-6 rounded-[0.9rem] border border-[var(--kt-border)] bg-[var(--kt-surface)] p-6 shadow-[var(--kt-shadow-md)]">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--kt-brand)]">
          <RotateCcw size={17} strokeWidth={3} />
          {pageCopy.eyebrow}
        </div>
        <h1 className="mt-3 text-4xl font-black text-[var(--kt-ink-strong)]">{pageCopy.title}</h1>
        <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[var(--kt-ink-muted)]">
          {pageCopy.description}
        </p>
      </section>

      <section className="mt-6 grid gap-3">
        {reviewItems.length === 0 ? (
          <div className="rounded-[0.9rem] border border-[var(--kt-border)] bg-[var(--kt-surface)] p-6">
            <div className="text-xl font-black text-[var(--kt-ink-strong)]">{pageCopy.emptyTitle}</div>
            <p className="mt-2 text-sm font-semibold leading-6 text-[var(--kt-ink-muted)]">{pageCopy.emptyBody}</p>
          </div>
        ) : (
          reviewItems.map(({ unit, state, progress }) => {
            const completed = state === 'completed';
            const actionLabel = completed ? pageCopy.review : pageCopy.continue;

            return (
              <Link
                key={unit.id}
                to={getLearnUnitRoute(unit.id)}
                className="grid gap-4 rounded-[0.9rem] border border-[var(--kt-border)] bg-[var(--kt-surface)] p-5 shadow-[var(--kt-shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--kt-brand)] md:grid-cols-[3rem_minmax(0,1fr)_8rem]"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${completed ? 'bg-[var(--kt-accent-success)]' : 'bg-[var(--kt-brand)]'}`}>
                  {completed ? <CheckCircle2 size={25} strokeWidth={3} /> : <CirclePlay size={25} strokeWidth={3} />}
                </span>
                <span className="min-w-0">
                  <span className="block text-xl font-black text-[var(--kt-ink-strong)]">{unit.title}</span>
                  <span className="mt-1 block text-sm font-semibold leading-6 text-[var(--kt-ink-muted)]">{unit.summary}</span>
                  <span className="mt-4 block h-3 overflow-hidden rounded-full bg-[var(--kt-progress-track)]">
                    <span className="block h-full rounded-full bg-[var(--kt-brand)]" style={{ width: `${progress}%` }} />
                  </span>
                </span>
                <span className="flex items-center justify-start text-sm font-black text-[var(--kt-brand)] md:justify-end">
                  {actionLabel}
                </span>
              </Link>
            );
          })
        )}

        {units
          .filter((unit) => getUnitState(unit.id) === 'locked')
          .slice(0, 4)
          .map((unit) => (
            <div
              key={unit.id}
              className="grid gap-4 rounded-[0.9rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] p-5 opacity-75 md:grid-cols-[3rem_minmax(0,1fr)_8rem]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--kt-ink-subtle)] text-white">
                <LockKeyhole size={23} strokeWidth={3} />
              </span>
              <span>
                <span className="block text-xl font-black text-[var(--kt-ink-strong)]">{unit.title}</span>
                <span className="mt-1 block text-sm font-semibold leading-6 text-[var(--kt-ink-muted)]">{unit.summary}</span>
              </span>
              <span className="flex items-center justify-start text-sm font-black text-[var(--kt-ink-muted)] md:justify-end">
                {pageCopy.locked}
              </span>
            </div>
          ))}
      </section>
      </div>
    </>
  );
};

export default LearnReviewPage;
