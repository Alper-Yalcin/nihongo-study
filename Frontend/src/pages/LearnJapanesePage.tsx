import React, { useMemo, useState } from 'react';
import {
  BookOpenText,
  Check,
  ChevronLeft,
  Gift,
  Lock,
  Play,
  Sparkles,
  Star,
  Trophy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLanguage } from '../data/appPreferences';
import { getLearnGuideRoute, getLearnUnitRoute } from '../data/appShellContent';
import {
  flattenLearnCourseUnits,
  getLearnCourseSections,
  LearnCourseUnit
} from '../data/learnCourseContent';
import { useLearnCourseProgress } from '../hooks/useLearnCourseProgress';
import { MascotFigure } from '../components/mascot/MascotFigure';

interface LearnJapanesePageProps {
  language: AppLanguage;
}

type UnitState = 'completed' | 'active' | 'available' | 'locked';
type StepKind = 'lesson' | 'practice' | 'bonus' | 'review' | 'checkpoint';
type RoadmapNodeState = UnitState;

interface RoadmapStep {
  id: string;
  title: string;
  kind: StepKind;
}

const pathOffsetPattern = [0, 46, -34, 38, -18];

const pageCopy = {
  tr: {
    guide: 'Rehber',
    start: 'Başlat',
    continue: 'Devam et',
    review: 'Tekrar',
    locked: 'Kilitli',
    completed: 'Tamamlandı',
    checkpoint: 'Kontrol noktası',
    bonus: 'Sandık',
    jumpHere: 'Buraya atla!',
    progress: 'İlerleme',
    startLesson: 'Başlat +10 puan',
    lessonProgress: (current: number, total: number) => `Ders: ${current}/${total}`,
    unitLabel: (part: number, unit: number) => `${part}. Kısım, ${unit}. Ünite`,
    nextUnit: (title: string) => title
  },
  en: {
    guide: 'Guide',
    start: 'Start',
    continue: 'Continue',
    review: 'Review',
    locked: 'Locked',
    completed: 'Completed',
    checkpoint: 'Checkpoint',
    bonus: 'Chest',
    jumpHere: 'Jump here!',
    progress: 'Progress',
    startLesson: 'Start +10 XP',
    lessonProgress: (current: number, total: number) => `Lesson: ${current}/${total}`,
    unitLabel: (part: number, unit: number) => `Part ${part}, Unit ${unit}`,
    nextUnit: (title: string) => title
  }
} as const;

const buildRoadmapSteps = (unit: LearnCourseUnit, checkpointLabel: string, bonusLabel: string): RoadmapStep[] => {
  const lessonSteps = unit.lessonHighlights.map((title, index) => ({
    id: `${unit.id}-step-${index + 1}`,
    title,
    kind: index === 2 ? 'bonus' : index === unit.lessonHighlights.length - 1 ? 'review' : index === 1 ? 'practice' : 'lesson'
  })) satisfies RoadmapStep[];

  return [
    ...lessonSteps,
    {
      id: `${unit.id}-checkpoint`,
      title: checkpointLabel,
      kind: 'checkpoint'
    }
  ];
};

const getStepState = (unitState: UnitState, stepIndex: number): RoadmapNodeState => {
  if (unitState === 'completed') {
    return 'completed';
  }

  if (unitState === 'locked') {
    return 'locked';
  }

  if (unitState === 'active') {
    return stepIndex === 0 ? 'active' : 'locked';
  }

  return stepIndex === 0 ? 'available' : 'locked';
};

const getStepIcon = (kind: StepKind, state: RoadmapNodeState) => {
  if (state === 'completed') {
    return <Check size={26} strokeWidth={3.2} />;
  }

  if (state === 'locked') {
    return kind === 'bonus' ? <Gift size={25} strokeWidth={2.8} /> : <Lock size={22} strokeWidth={3} />;
  }

  if (kind === 'checkpoint') {
    return <Trophy size={27} strokeWidth={3} />;
  }

  if (kind === 'bonus') {
    return <Gift size={27} strokeWidth={3} />;
  }

  if (state === 'active') {
    return <Star size={28} strokeWidth={3} fill="currentColor" />;
  }

  return <Play size={25} strokeWidth={3} fill="currentColor" />;
};

interface UnitBannerProps {
  copy: typeof pageCopy.tr | typeof pageCopy.en;
  unit: LearnCourseUnit;
  progressPercent: number;
  onGuide: () => void;
}

const UnitBanner: React.FC<UnitBannerProps> = ({ copy, unit, progressPercent, onGuide }) => (
  <div className={`sticky top-3 z-20 overflow-hidden rounded-[1rem] shadow-[var(--kt-shadow-md)] ${unit.bannerClassName}`}>
    <div className="flex items-center justify-between gap-3 px-4 py-3.5 text-white sm:px-5">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-white/80">
          <ChevronLeft size={15} strokeWidth={3} />
          <span>{copy.unitLabel(unit.partNumber, unit.unitNumber)}</span>
        </div>
        <h1 className="mt-1 truncate text-lg font-black leading-tight sm:text-xl">{unit.title}</h1>
      </div>

      <button
        type="button"
        onClick={onGuide}
        className="shrink-0 rounded-[0.8rem] border-2 border-white/35 bg-white/12 px-3 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.16)] transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <span className="inline-flex items-center gap-2">
          <BookOpenText size={16} strokeWidth={3} />
          {copy.guide}
        </span>
      </button>
    </div>
    <div className="h-1.5 bg-white/20">
      <div className="h-full bg-white/70 transition-all" style={{ width: `${progressPercent}%` }} />
    </div>
  </div>
);

interface RoadmapNodeProps {
  unit: LearnCourseUnit;
  step: RoadmapStep;
  state: RoadmapNodeState;
  label?: string;
  offset: number;
  isActiveUnit: boolean;
  onOpen: () => void;
}

const RoadmapNode: React.FC<RoadmapNodeProps> = ({
  unit,
  step,
  state,
  label,
  offset,
  isActiveUnit,
  onOpen
}) => {
  const isLocked = state === 'locked';
  const isActive = state === 'active';
  const isCompleted = state === 'completed';
  const isCheckpoint = step.kind === 'checkpoint';
  const isBonus = step.kind === 'bonus';
  const accent = unit.accentGlow;

  const outerClass =
    isCompleted
      ? 'border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)]'
      : isActive
        ? 'border-[var(--kt-brand)] bg-[var(--kt-brand-soft)] text-[var(--kt-brand)]'
        : isLocked
          ? 'border-[var(--kt-border-subtle)] bg-[var(--kt-surface-sunken)] text-[var(--kt-ink-subtle)]'
          : 'border-[var(--kt-accent-info)] bg-[var(--kt-accent-info-soft)] text-[var(--kt-accent-info)]';

  const innerClass =
    isCompleted
      ? 'bg-[var(--kt-accent-success)] text-[var(--kt-brand-on)]'
      : isActive
        ? 'bg-[var(--kt-brand)] text-[var(--kt-brand-on)]'
        : isLocked
          ? 'bg-[var(--kt-surface-muted)] text-[var(--kt-ink-subtle)]'
          : 'bg-[var(--kt-accent-info)] text-[var(--kt-brand-on)]';

  return (
    <div
      className="relative flex w-full flex-col items-center"
      style={{ transform: `translateX(${offset}px)` }}
    >
      {label && (
        <div className="mb-2 rounded-[0.7rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[var(--kt-brand)] shadow-[var(--kt-shadow-sm)]">
          {label}
        </div>
      )}

      <button
        type="button"
        disabled={isLocked}
        onClick={onOpen}
        aria-label={`${unit.title}: ${step.title}`}
        className={`relative flex h-[76px] w-[76px] items-center justify-center rounded-full border-[7px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kt-focus-ring)] ${
          isLocked ? 'cursor-not-allowed' : 'hover:-translate-y-0.5 hover:brightness-105'
        } ${outerClass}`}
        style={{
          boxShadow: isActive
            ? `0 12px 0 color-mix(in_srgb, var(--kt-brand) 46%, transparent), 0 18px 34px ${accent}`
            : isCompleted || !isLocked
              ? `0 9px 0 color-mix(in_srgb, currentColor 30%, transparent), 0 14px 28px ${accent}`
              : '0 8px 0 color-mix(in_srgb, var(--kt-ink-subtle) 18%, transparent)'
        }}
      >
        {isActive && <span className="absolute inset-[-9px] animate-ping rounded-full bg-[var(--kt-brand)] opacity-15" />}
        <span className={`relative flex h-[54px] w-[54px] items-center justify-center rounded-full ${innerClass}`}>
          {getStepIcon(step.kind, state)}
        </span>
      </button>

      <div className="mt-3 min-h-[2.1rem] max-w-[8.5rem] text-center">
        <div className="text-[11px] font-black uppercase leading-snug tracking-[0.08em] text-[var(--kt-ink-muted)]">
          {isCheckpoint || isBonus ? step.title : step.title}
        </div>
      </div>

      {isActive && isActiveUnit && (
        <MascotFigure
          pose={unit.mascotPose}
          tone={unit.tone}
          size={96}
          className="absolute left-[calc(50%+4.1rem)] top-7 hidden sm:block"
        />
      )}
    </div>
  );
};

interface LessonStartCardProps {
  copy: typeof pageCopy.tr | typeof pageCopy.en;
  unit: LearnCourseUnit;
  step: RoadmapStep;
  stepIndex: number;
  totalSteps: number;
  onStart: () => void;
}

const LessonStartCard: React.FC<LessonStartCardProps> = ({
  copy,
  unit,
  step,
  stepIndex,
  totalSteps,
  onStart
}) => (
  <div className="relative z-10 -mt-1 mb-2 w-full max-w-[19rem] rounded-[0.9rem] bg-[var(--kt-brand)] p-4 text-[var(--kt-brand-on)] shadow-[0_10px_0_color-mix(in_srgb,var(--kt-brand)_72%,black),var(--kt-shadow-lg)]">
    <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--kt-brand)]" />
    <div className="relative">
      <h2 className="text-base font-black leading-snug">{unit.title}</h2>
      <p className="mt-1 text-sm font-black text-white/90">
        {copy.lessonProgress(Math.min(stepIndex + 1, totalSteps), totalSteps)}
      </p>
      <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-white/80">{step.title}</p>
      <button
        type="button"
        onClick={onStart}
        className="mt-4 h-12 w-full rounded-[0.85rem] bg-[var(--kt-surface)] px-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-brand)] shadow-[inset_0_-4px_0_var(--kt-border-subtle)] transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {copy.startLesson}
      </button>
    </div>
    <MascotFigure
      pose={unit.mascotPose}
      tone={unit.tone}
      size={92}
      className="absolute -right-12 bottom-[-1.35rem] hidden sm:block"
    />
  </div>
);

export const LearnJapanesePage: React.FC<LearnJapanesePageProps> = ({ language }) => {
  const navigate = useNavigate();
  const copy = pageCopy[language];
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const sections = useMemo(() => getLearnCourseSections(language), [language]);
  const units = useMemo(() => flattenLearnCourseUnits(sections), [sections]);
  const orderedUnitIds = useMemo(() => units.map((unit) => unit.id), [units]);
  const { completedCount, currentUnitId, getUnitState, progressPercent } = useLearnCourseProgress(orderedUnitIds);

  const currentUnit = useMemo(
    () => units.find((unit) => unit.id === currentUnitId) ?? units[0] ?? null,
    [currentUnitId, units]
  );

  const openUnit = (unitId: string) => {
    navigate(getLearnUnitRoute(unitId));
  };

  return (
    <div className="mx-auto w-full max-w-[34rem] pb-16">
      <div className="sr-only">
        <h1>{language === 'tr' ? 'Japonca Öğren' : 'Learn Japanese'}</h1>
        <p>
          {completedCount} / {units.length} {copy.progress}
        </p>
      </div>

      {sections.map((section) => (
        <React.Fragment key={section.id}>
          {section.units.map((unit, unitIndex) => {
            const flatIndex = units.findIndex((entry) => entry.id === unit.id);
            const state = getUnitState(unit.id);
            const unitProgress = state === 'completed' ? 100 : unit.id === currentUnit?.id ? progressPercent : 0;
            const steps = buildRoadmapSteps(unit, copy.checkpoint, copy.bonus);
            const isCurrentUnit = unit.id === currentUnit?.id;
            const firstOpenUnitInSection = section.units.find((entry) => getUnitState(entry.id) !== 'locked');
            const shouldShowJump = unitIndex === 0 && flatIndex > 0 && firstOpenUnitInSection?.id === unit.id;

            return (
              <section key={unit.id} className="relative">
                {flatIndex > 0 && (
                  <div className="flex items-center gap-3 py-7">
                    <div className="h-px flex-1 bg-[var(--kt-border)]" />
                    <span className="max-w-[15rem] truncate text-center text-xs font-black text-[var(--kt-ink-subtle)]">
                      {copy.nextUnit(unit.title)}
                    </span>
                    <div className="h-px flex-1 bg-[var(--kt-border)]" />
                  </div>
                )}

                <UnitBanner
                  copy={copy}
                  unit={unit}
                  progressPercent={unitProgress}
                  onGuide={() => navigate(getLearnGuideRoute(unit.id))}
                />

                <div className="relative flex flex-col items-center gap-7 px-4 py-9">
                  <div className="absolute left-1/2 top-6 bottom-6 w-2 -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,transparent,var(--kt-border-subtle)_12%,var(--kt-border)_50%,var(--kt-border-subtle)_88%,transparent)]" />

                  {shouldShowJump && (
                    <button
                      type="button"
                      onClick={() => openUnit(unit.id)}
                      className="relative z-10 rounded-[0.8rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-2 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-accent-plum)] shadow-[var(--kt-shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--kt-accent-plum)]"
                    >
                      {copy.jumpHere}
                    </button>
                  )}

                  {steps.map((step, stepIndex) => {
                    const nodeState = getStepState(state, stepIndex);
                    const isNodeOpen = nodeState !== 'locked';
                    const activeLabel =
                      nodeState === 'active'
                        ? copy.start
                        : nodeState === 'available'
                          ? copy.continue
                          : undefined;

                    return (
                      <React.Fragment key={step.id}>
                        <RoadmapNode
                          unit={unit}
                          step={step}
                          state={nodeState}
                          label={activeLabel}
                          offset={pathOffsetPattern[stepIndex % pathOffsetPattern.length]}
                          isActiveUnit={isCurrentUnit && selectedNodeId !== step.id}
                          onOpen={() => {
                            if (isNodeOpen) {
                              setSelectedNodeId((current) => (current === step.id ? null : step.id));
                            }
                          }}
                        />

                        {selectedNodeId === step.id && isNodeOpen && (
                          <LessonStartCard
                            copy={copy}
                            unit={unit}
                            step={step}
                            stepIndex={stepIndex}
                            totalSteps={steps.length}
                            onStart={() => openUnit(unit.id)}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}

                  {state === 'completed' && (
                    <button
                      type="button"
                      onClick={() => openUnit(unit.id)}
                      className="relative z-10 inline-flex items-center gap-2 rounded-[0.8rem] border border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[var(--kt-accent-success)] shadow-[var(--kt-shadow-sm)] transition hover:-translate-y-0.5"
                    >
                      <Sparkles size={15} strokeWidth={3} />
                      {copy.review}
                    </button>
                  )}
                </div>
              </section>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default LearnJapanesePage;
