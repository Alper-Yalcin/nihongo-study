import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Headphones, MessageSquare, Lock, ChevronRight } from 'lucide-react';
import { allUnits } from '../../features/lesson/data/greetingsUnit';
import { getCompletedLessonIds } from '../../features/lesson/lessonStorage';
import type { AppLanguage } from '../../data/appPreferences';
import type { LessonUnit } from '../../features/lesson/lessonTypes';

interface Props {
  language: AppLanguage;
}

const UnitCard: React.FC<{
  unit: LessonUnit;
  language: AppLanguage;
  completedIds: string[];
}> = ({ unit, language, completedIds }) => {
  const navigate = useNavigate();
  const completedCount = unit.lessons.filter((l) => completedIds.includes(l.id)).length;
  const isLocked = false; // First unit always unlocked

  const firstIncomplete = unit.lessons.find((l) => !completedIds.includes(l.id));
  const targetLesson = firstIncomplete ?? unit.lessons[unit.lessons.length - 1];

  return (
    <div
      className={`rounded-[1.4rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] p-6 shadow-[var(--kt-shadow-md)] transition ${
        isLocked ? 'opacity-60' : 'hover:-translate-y-0.5 cursor-pointer'
      }`}
      onClick={() => !isLocked && navigate(`/learn/lesson/${unit.id}/${targetLesson.id}`)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[var(--kt-ink-strong)]">
              {unit.theme[language]}
            </h2>
            {isLocked && <Lock size={16} className="text-[var(--kt-ink-subtle)]" />}
          </div>
          <p className="mt-1 text-sm font-bold text-[var(--kt-ink-muted)]">
            {unit.description[language]}
          </p>

          {/* Meta chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="flex items-center gap-1 rounded-full bg-[var(--kt-surface-muted)] px-3 py-1 text-xs font-black text-[var(--kt-ink-muted)]">
              <BookOpen size={11} />
              {unit.wordCount} kelime
            </span>
            <span className="flex items-center gap-1 rounded-full bg-[var(--kt-surface-muted)] px-3 py-1 text-xs font-black text-[var(--kt-ink-muted)]">
              <MessageSquare size={11} />
              {unit.grammarCount} grammar
            </span>
            <span className="flex items-center gap-1 rounded-full bg-[var(--kt-surface-muted)] px-3 py-1 text-xs font-black text-[var(--kt-ink-muted)]">
              <Headphones size={11} />
              {unit.lessons.length} ders
            </span>
          </div>

          {/* Lesson progress */}
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs font-black text-[var(--kt-ink-muted)]">
              <span>{completedCount}/{unit.lessons.length} ders tamamlandı</span>
              <span>{Math.round((completedCount / unit.lessons.length) * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--kt-surface-muted)]">
              <div
                className="h-full rounded-full bg-[var(--kt-brand)] transition-all duration-500"
                style={{ width: `${(completedCount / unit.lessons.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Individual lessons */}
          <div className="mt-4 space-y-2">
            {unit.lessons.map((lesson, i) => {
              const done = completedIds.includes(lesson.id);
              const isCurrent = lesson.id === targetLesson.id && !done;
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/learn/lesson/${unit.id}/${lesson.id}`);
                  }}
                  className={`flex w-full items-center justify-between rounded-[0.8rem] px-4 py-2.5 text-sm font-black transition ${
                    done
                      ? 'bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)]'
                      : isCurrent
                      ? 'bg-[var(--kt-brand)] text-[var(--kt-brand-on)] shadow-[inset_0_-3px_0_color-mix(in_srgb,var(--kt-brand)_76%,black)]'
                      : 'bg-[var(--kt-surface-muted)] text-[var(--kt-ink-muted)]'
                  }`}
                >
                  <span>
                    {i + 1}. {lesson.title[language]}
                  </span>
                  <span className="flex items-center gap-1">
                    {done ? '✓' : <ChevronRight size={14} />}
                    <span className="text-xs opacity-70">~{lesson.estimatedMinutes} dk</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const LessonUnitsPage: React.FC<Props> = ({ language }) => {
  const completedIds = getCompletedLessonIds();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-widest text-[var(--kt-brand)]">
          {language === 'tr' ? 'Dersler' : 'Lessons'}
        </p>
        <h1 className="mt-1 text-3xl font-black text-[var(--kt-ink-strong)]">
          {language === 'tr' ? 'Japonca Öğren' : 'Learn Japanese'}
        </h1>
        <p className="mt-2 text-sm font-bold text-[var(--kt-ink-muted)]">
          {language === 'tr'
            ? 'Her ders 3-6 dakika. Direkt Japonca kullanarak öğren.'
            : 'Each lesson takes 3-6 minutes. Learn by using Japanese directly.'}
        </p>
      </div>

      <div className="space-y-6">
        {allUnits.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            language={language}
            completedIds={completedIds}
          />
        ))}
      </div>

      {/* Coming soon */}
      <div className="mt-8 rounded-[1.2rem] border-2 border-dashed border-[var(--kt-border)] p-6 text-center opacity-50">
        <p className="text-sm font-black text-[var(--kt-ink-muted)]">
          {language === 'tr'
            ? 'Daha fazla ünite yakında geliyor...'
            : 'More units coming soon...'}
        </p>
      </div>
    </div>
  );
};
