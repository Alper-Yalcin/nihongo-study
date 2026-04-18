import React, { useMemo } from 'react';
import { ArrowLeft, ArrowRight, BookOpenText, CheckCircle2, Languages, Layers3 } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Button, Card, StatCard } from '../shared/ui';
import { AppLanguage } from '../data/appPreferences';
import {
  appShellRoutes,
  getLearnUnitRoute
} from '../data/appShellContent';
import {
  findLearnUnitById,
  flattenLearnCourseUnits,
  getLearnCourseSections
} from '../data/learnCourseContent';
import { useLearnCourseProgress } from '../hooks/useLearnCourseProgress';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { MascotFigure } from '../components/mascot/MascotFigure';
import { SpeechBubble } from '../components/mascot/SpeechBubble';

interface LearnUnitPageProps {
  language: AppLanguage;
  activeScript: KanaScript;
}

const pageCopy = {
  tr: {
    backToLearn: 'Ogren yoluna don',
    learningGoals: 'Bu unitede ogreneceklerin',
    vocabulary: 'Kelime seti',
    grammar: 'Gramer odagi',
    lessonFlow: 'Ders akisi',
    dialogue: 'Ornek diyalog',
    markComplete: 'Uniteyi tamamlandi isaretle',
    markIncomplete: 'Tamamlandi durumunu kaldir',
    previousUnit: 'Onceki unite',
    nextUnit: 'Sonraki unite',
    lettersCta: 'Harfler tarafina gec',
    lockedMessage: 'Bu uniteyi acmak icin once bir onceki uniteyi tamamla.',
    lockedTitle: 'Bu unite henuz kilitli',
    missingMessage: 'Unite bulunamadi.',
    statsLessons: 'Ders',
    statsWords: 'Kelime',
    statsGrammar: 'Kalip'
  },
  en: {
    backToLearn: 'Back to learn path',
    learningGoals: 'What you will learn',
    vocabulary: 'Vocabulary set',
    grammar: 'Grammar focus',
    lessonFlow: 'Lesson flow',
    dialogue: 'Sample dialogue',
    markComplete: 'Mark unit as complete',
    markIncomplete: 'Remove completed state',
    previousUnit: 'Previous unit',
    nextUnit: 'Next unit',
    lettersCta: 'Open letters',
    lockedMessage: 'Complete the previous unit first to unlock this one.',
    lockedTitle: 'This unit is still locked',
    missingMessage: 'Unit not found.',
    statsLessons: 'Lessons',
    statsWords: 'Words',
    statsGrammar: 'Patterns'
  }
} as const;

export const LearnUnitPage: React.FC<LearnUnitPageProps> = ({ language, activeScript }) => {
  const { unitId = '' } = useParams();
  const copy = pageCopy[language];
  const sections = useMemo(() => getLearnCourseSections(language), [language]);
  const units = useMemo(() => flattenLearnCourseUnits(sections), [sections]);
  const unit = useMemo(() => findLearnUnitById(sections, unitId), [sections, unitId]);
  const {
    currentUnitId,
    getUnitState,
    isUnitCompleted,
    setUnitCompleted
  } = useLearnCourseProgress(units.map((entry) => entry.id));

  if (!unit) {
    return <Navigate to={appShellRoutes.learn} replace />;
  }

  const unitIndex = units.findIndex((entry) => entry.id === unit.id);
  const previousUnit = unitIndex > 0 ? units[unitIndex - 1] : null;
  const nextUnit = unitIndex >= 0 && unitIndex < units.length - 1 ? units[unitIndex + 1] : null;
  const unitState = getUnitState(unit.id);
  const isUnlocked = unitState !== 'locked';
  const isCompleted = isUnitCompleted(unit.id);

  if (!isUnlocked) {
    return (
      <div className="space-y-6 pb-8">
        <Link
          to={appShellRoutes.learn}
          className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-[var(--kt-ink-subtle)]"
        >
          <ArrowLeft size={16} />
          {copy.backToLearn}
        </Link>

        <Card padding="lg" className="max-w-3xl">
          <h1 className="text-3xl font-black text-[var(--kt-ink-strong)]">{copy.lockedTitle}</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--kt-ink-muted)]">{copy.lockedMessage}</p>
          <div className="mt-6">
            <Button as="link" to={currentUnitId ? getLearnUnitRoute(currentUnitId) : appShellRoutes.learn}>
              {copy.nextUnit}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <Link
        to={appShellRoutes.learn}
        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-[var(--kt-ink-subtle)] hover:text-[var(--kt-ink)]"
      >
        <ArrowLeft size={16} />
        {copy.backToLearn}
      </Link>

      <section className={`overflow-hidden rounded-[2rem] border border-[var(--kt-border)] p-7 text-white shadow-[var(--kt-shadow-lg)] ${unit.bannerClassName}`}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
              {`${unit.partNumber}. Kisim, ${unit.unitNumber}. Unite`}
            </div>
            <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">{unit.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--kt-ink)]">{unit.summary}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                as="button"
                type="button"
                onClick={() => setUnitCompleted(unit.id, !isCompleted)}
              >
                {isCompleted ? copy.markIncomplete : copy.markComplete}
              </Button>
              <Button
                as="link"
                to={`${appShellRoutes.letters}?script=${activeScript}`}
                variant="secondary"
              >
                {copy.lettersCta}
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <SpeechBubble accent={unit.tone}>
              {unit.dialogue[0]?.translation ?? unit.summary}
            </SpeechBubble>
            <MascotFigure pose={unit.mascotPose} tone={unit.tone} size={156} />
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <StatCard label={copy.statsLessons} value={unit.lessonHighlights.length} icon={<Layers3 size={18} />} />
        <StatCard label={copy.statsWords} value={unit.vocabulary.length} tone="info" icon={<Languages size={18} />} />
        <StatCard label={copy.statsGrammar} value={unit.grammarFocus.length} tone="success" icon={<BookOpenText size={18} />} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)]">
        <Card padding="lg">
          <h2 className="text-2xl font-black text-[var(--kt-ink-strong)]">{copy.learningGoals}</h2>
          <div className="mt-5 grid gap-3">
            {unit.goals.map((goal) => (
              <div
                key={goal}
                className="flex items-start gap-3 rounded-[1.2rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-4"
              >
                <CheckCircle2 size={18} className="mt-0.5 text-[var(--kt-brand)]" />
                <p className="text-sm leading-7 text-[var(--kt-ink)]">{goal}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg" className="bg-[var(--kt-surface-raised)]">
          <h2 className="text-2xl font-black text-[var(--kt-ink-strong)]">{copy.dialogue}</h2>
          <div className="mt-5 space-y-4">
            {unit.dialogue.map((line, index) => (
              <div key={`${line.speaker}-${index}`} className="rounded-[1.3rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-4">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">{line.speaker}</div>
                <div className="mt-2 text-lg font-black">{line.text}</div>
                <div className="mt-2 text-sm leading-7 text-[var(--kt-ink-muted)]">{line.translation}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)]">
        <Card padding="lg">
          <h2 className="text-2xl font-black text-[var(--kt-ink-strong)]">{copy.vocabulary}</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {unit.vocabulary.map((entry) => (
              <span
                key={entry}
                className="rounded-[1rem] border border-[var(--kt-border)] bg-[var(--kt-surface-muted)] px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-ink-strong)]"
              >
                {entry}
              </span>
            ))}
          </div>
        </Card>

        <Card padding="lg">
          <h2 className="text-2xl font-black text-[var(--kt-ink-strong)]">{copy.grammar}</h2>
          <div className="mt-5 grid gap-3">
            {unit.grammarFocus.map((entry) => (
              <div
                key={entry}
                className="rounded-[1.2rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-4 text-sm font-semibold text-[var(--kt-ink)]"
              >
                {entry}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card padding="lg">
        <h2 className="text-2xl font-black text-[var(--kt-ink-strong)]">{copy.lessonFlow}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {unit.lessonHighlights.map((entry, index) => (
            <div
              key={entry}
              className="rounded-[1.4rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-5"
            >
              <div className="text-xs font-black uppercase tracking-[0.16em] text-[var(--kt-ink-subtle)]">
                {`Ders ${index + 1}`}
              </div>
              <div className="mt-2 text-lg font-black text-[var(--kt-ink-strong)]">{entry}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {previousUnit ? (
          <Button as="link" to={getLearnUnitRoute(previousUnit.id)} variant="secondary" iconStart={<ArrowLeft size={16} />}>
            {copy.previousUnit}
          </Button>
        ) : (
          <span />
        )}

        {nextUnit ? (
          <Button as="link" to={getLearnUnitRoute(nextUnit.id)} iconEnd={<ArrowRight size={16} />}>
            {copy.nextUnit}
          </Button>
        ) : null}
      </div>
    </div>
  );
};
