import React, { useMemo } from 'react';
import { BarChart3, CirclePlay, LockKeyhole, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppLanguage, ThemeMode } from '../../data/appPreferences';
import { appShellRoutes, getLearnUnitRoute } from '../../data/appShellContent';
import { flattenLearnCourseUnits, getLearnCourseSections } from '../data/learnCourseContent';
import { useLearnCourseProgress } from '../../hooks/useLearnCourseProgress';
import { LearnSideRail } from '../components/LearnSideRail';

interface LearnStatisticPageProps {
  language: AppLanguage;
  themeMode: ThemeMode;
}

const copy = {
  tr: {
    eyebrow: 'Istatistik',
    title: 'Ogrenme Ozeti',
    description: 'Ders ilerlemesi, kilit durumu ve siradaki hedef burada.',
    back: 'Haritaya don',
    completed: 'Tamamlanan',
    active: 'Aktif',
    locked: 'Kilitli',
    courseProgress: 'Kurs ilerlemesi',
    nodeProgress: 'Node ilerlemesi',
    next: 'Siradaki ders',
    open: 'Ac',
    noNext: 'Tum acik dersler tamamlandi.'
  },
  en: {
    eyebrow: 'Stats',
    title: 'Learning Summary',
    description: 'Lesson progress, lock state, and the next target live here.',
    back: 'Back to map',
    completed: 'Completed',
    active: 'Active',
    locked: 'Locked',
    courseProgress: 'Course progress',
    nodeProgress: 'Node progress',
    next: 'Next lesson',
    open: 'Open',
    noNext: 'All open lessons are complete.'
  }
} as const;

export const LearnStatisticPage: React.FC<LearnStatisticPageProps> = ({ language, themeMode }) => {
  const pageCopy = copy[language];
  const sections = useMemo(() => getLearnCourseSections(language), [language]);
  const units = useMemo(() => flattenLearnCourseUnits(sections), [sections]);
  const orderedUnitIds = useMemo(() => units.map((unit) => unit.id), [units]);
  const { completedCount, getUnitProgress, getUnitState } = useLearnCourseProgress(orderedUnitIds);

  const unitStats = units.map((unit) => ({
    unit,
    state: getUnitState(unit.id),
    progress: getUnitProgress(unit.id)
  }));
  const activeItems = unitStats.filter((entry) => entry.state === 'active' || entry.state === 'available');
  const lockedItems = unitStats.filter((entry) => entry.state === 'locked');
  const nextItem = activeItems[0] ?? null;
  const courseProgress = units.length > 0 ? Math.round((completedCount / units.length) * 100) : 0;
  const nodeProgress =
    unitStats.length > 0
      ? Math.round(unitStats.reduce((sum, entry) => sum + entry.progress, 0) / unitStats.length)
      : 0;

  return (
    <>
      <LearnSideRail language={language} themeMode={themeMode} activeItem="stats" position="fixed" />
      <div className="mx-auto max-w-6xl pb-12 lg:pl-[112px]">
        <Link
          to={appShellRoutes.learn}
          className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)] transition hover:text-[var(--kt-brand)]"
        >
          {pageCopy.back}
        </Link>

      <section className="mt-6 rounded-[0.9rem] border border-[var(--kt-border)] bg-[var(--kt-surface)] p-6 shadow-[var(--kt-shadow-md)]">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--kt-accent-info)]">
          <BarChart3 size={17} strokeWidth={3} />
          {pageCopy.eyebrow}
        </div>
        <h1 className="mt-3 text-4xl font-black text-[var(--kt-ink-strong)]">{pageCopy.title}</h1>
        <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[var(--kt-ink-muted)]">
          {pageCopy.description}
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { label: pageCopy.completed, value: completedCount, className: 'text-[var(--kt-accent-success)]' },
          { label: pageCopy.active, value: activeItems.length, className: 'text-[var(--kt-brand)]' },
          { label: pageCopy.locked, value: lockedItems.length, className: 'text-[var(--kt-ink-muted)]' }
        ].map((stat) => (
          <div key={stat.label} className="rounded-[0.9rem] border border-[var(--kt-border)] bg-[var(--kt-surface)] p-5 shadow-[var(--kt-shadow-sm)]">
            <div className={`text-5xl font-black leading-none ${stat.className}`}>{stat.value}</div>
            <div className="mt-2 text-sm font-black uppercase tracking-[0.12em] text-[var(--kt-ink-muted)]">{stat.label}</div>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          {[
            { label: pageCopy.courseProgress, value: courseProgress, className: 'bg-[linear-gradient(90deg,var(--kt-accent-success),var(--kt-brand))]' },
            { label: pageCopy.nodeProgress, value: nodeProgress, className: 'bg-[linear-gradient(90deg,var(--kt-accent-info),var(--kt-accent-plum))]' }
          ].map((entry) => (
            <div key={entry.label} className="rounded-[0.9rem] border border-[var(--kt-border)] bg-[var(--kt-surface)] p-5 shadow-[var(--kt-shadow-sm)]">
              <div className="flex items-center justify-between gap-4 text-lg font-black text-[var(--kt-ink-strong)]">
                <span>{entry.label}</span>
                <span>{entry.value}%</span>
              </div>
              <div className="mt-4 h-4 overflow-hidden rounded-full bg-[var(--kt-progress-track)]">
                <div className={`h-full rounded-full ${entry.className}`} style={{ width: `${entry.value}%` }} />
              </div>
            </div>
          ))}

          <div className="rounded-[0.9rem] border border-[var(--kt-border)] bg-[var(--kt-surface)] p-5 shadow-[var(--kt-shadow-sm)]">
            <h2 className="text-xl font-black text-[var(--kt-ink-strong)]">{pageCopy.completed}</h2>
            <div className="mt-4 grid gap-3">
              {unitStats.map(({ unit, state, progress }) => (
                <div key={unit.id} className="grid gap-3 rounded-[0.8rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] p-3 sm:grid-cols-[minmax(0,1fr)_5rem]">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-black text-[var(--kt-ink-strong)]">{unit.title}</div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--kt-progress-track)]">
                      <div className="h-full rounded-full bg-[var(--kt-brand)]" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-start text-sm font-black text-[var(--kt-ink-muted)] sm:justify-end">{progress}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="rounded-[0.9rem] border border-[var(--kt-border)] bg-[var(--kt-surface)] p-5 shadow-[var(--kt-shadow-sm)]">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-brand)]">
            <Target size={17} strokeWidth={3} />
            {pageCopy.next}
          </div>
          {nextItem ? (
            <Link to={getLearnUnitRoute(nextItem.unit.id)} className="mt-4 block rounded-[0.8rem] border border-[var(--kt-border)] bg-[var(--kt-surface-muted)] p-4 transition hover:border-[var(--kt-brand)]">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--kt-brand)] text-white">
                  <CirclePlay size={24} strokeWidth={3} />
                </span>
                <span className="min-w-0">
                  <span className="block text-lg font-black text-[var(--kt-ink-strong)]">{nextItem.unit.title}</span>
                  <span className="mt-1 block text-sm font-semibold text-[var(--kt-ink-muted)]">{nextItem.progress}%</span>
                </span>
              </div>
              <div className="mt-4 text-sm font-black text-[var(--kt-brand)]">{pageCopy.open}</div>
            </Link>
          ) : (
            <div className="mt-4 rounded-[0.8rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] p-4 text-sm font-semibold leading-6 text-[var(--kt-ink-muted)]">
              {pageCopy.noNext}
            </div>
          )}

          <div className="mt-5 flex items-center gap-2 text-sm font-black text-[var(--kt-ink-muted)]">
            <LockKeyhole size={18} />
            {pageCopy.locked}: {lockedItems.length}
          </div>
        </aside>
      </section>
      </div>
    </>
  );
};

export default LearnStatisticPage;
