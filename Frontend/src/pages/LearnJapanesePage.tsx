import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AppLanguage } from '../data/appPreferences';
import { jlearnTrack } from '../data/jlearn/jlearnContent';
import { appShellRoutes } from '../data/appShellContent';
import { readProgress } from '../data/jlearn/jlearnStorage';
import { isStepUnlocked } from '../data/jlearn/jlearnGating';
import { getChallengeCtaForLevel, markChallengeAttempted } from '../features/jlearn/challenge/challengeReadiness';
import { DebugPanel } from '../features/jlearn/debug/DebugPanel';
import {
  getJLearnFeatureFlags,
  getJLearnUserState,
  RelationshipStage,
  subscribeJLearnUserState,
} from '../features/jlearn/debug/debugStore';

interface LearnJapanesePageProps {
  language: AppLanguage;
}

const copy = {
  tr: {
    eyebrow: 'World Map',
    title: 'Japonca Ogren',
    intro: 'Sifirdan JLPT N5 ve N4 yolculuguna baslayan, gorev tabanli Japonca ogrenme izi.',
    levelHeader: 'Level',
    unitHeader: 'Unite',
    missionHeader: 'Gorev',
    checkpoint: 'Checkpoint',
    minutes: 'dk',
    completed: 'Tamamlandi',
    available: 'Hazir',
    locked: 'Kilitli',
    totalMissions: 'Toplam gorev',
    unlockedMissions: 'Acilan',
    completedMissions: 'Biten',
    routeBack: '/learn rotasina don',
    mapLabel: 'Mission map',
    progressLabel: 'Track progress',
    pathLabel: 'Yolculuk rotasi',
    current: 'Aktif',
    nextHook: 'Siradaki hikaye izi',
    unlockHint: 'Bu bolumu acmak icin once onceki level checkpointini tamamla.',
    challengeEyebrow: 'Challenge hazir',
    challengeTitle: 'Bonus meydan okuma acildi',
    challengeAction: 'Challenge karti hazir',
    challengePreview: 'S21 verisi gelene kadar preview CTA',
  },
  en: {
    eyebrow: 'World Map',
    title: 'Learn Japanese',
    intro: 'Mission-based path from zero to JLPT N5/N4.',
    levelHeader: 'Level',
    unitHeader: 'Unit',
    missionHeader: 'Mission',
    checkpoint: 'Checkpoint',
    minutes: 'min',
    completed: 'Completed',
    available: 'Ready',
    locked: 'Locked',
    totalMissions: 'Total missions',
    unlockedMissions: 'Unlocked',
    completedMissions: 'Done',
    routeBack: 'Back to /learn',
    mapLabel: 'Mission map',
    progressLabel: 'Track progress',
    pathLabel: 'Journey route',
    current: 'Current',
    nextHook: 'Next story hook',
    unlockHint: 'Complete the previous level checkpoint to open this area.',
    challengeEyebrow: 'Challenge ready',
    challengeTitle: 'Bonus challenge unlocked',
    challengeAction: 'Challenge card ready',
    challengePreview: 'Preview CTA until S21 data lands',
  }
} as const;

type LevelState = 'completed' | 'current' | 'locked';

const journeyStops: Record<string, { label: string; detail: string }> = {
  JL1: { label: 'Airport', detail: 'Host family home' },
  JL2: { label: 'School', detail: 'Homeroom class' },
  JL3: { label: 'Market', detail: 'Saturday market' },
};

type LevelCharacter = {
  id: string;
  name: string;
  initials: string;
  role: string;
  tone: string;
};

const levelCharacters: Partial<Record<string, LevelCharacter>> = {
  JL1: {
    id: 'mrs-tanaka',
    name: 'Mrs. Tanaka',
    initials: 'T',
    role: 'Host family guide',
    tone: 'bg-rose-400',
  },
  JL2: {
    id: 'yuki',
    name: 'Yuki',
    initials: 'Y',
    role: 'Classmate',
    tone: 'bg-violet-400',
  },
};

function characterFrameClass(stage: RelationshipStage): string {
  if (stage === 0) return 'rounded-[0.85rem] ring-2 ring-[var(--kt-ink-muted)]';
  if (stage === 2) return 'rounded-full ring-4 ring-[var(--kt-accent-warning-soft)]';
  if (stage === 3) return 'kt-character-wave rounded-[1rem] ring-4 ring-[var(--kt-brand-soft)]';
  return 'rounded-full ring-4 ring-[var(--kt-surface)]';
}

const LevelCharacterAvatar: React.FC<{
  character: LevelCharacter;
  stage: RelationshipStage;
  compact?: boolean;
}> = ({ character, stage, compact = false }) => (
  <div
    className={`flex items-center gap-3 rounded-[1.2rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] shadow-[var(--kt-shadow-sm)] ${
      compact ? 'px-3 py-2' : 'px-4 py-3'
    }`}
  >
    <div
      className={`flex shrink-0 items-center justify-center text-sm font-black text-white shadow-[var(--kt-shadow-sm)] ${character.tone} ${characterFrameClass(stage)} ${
        compact ? 'h-10 w-10' : 'h-12 w-12'
      }`}
      title={`${character.name} relationship stage ${stage}`}
    >
      {character.initials}
    </div>
    <div className="min-w-0">
      <div className="truncate text-sm font-black text-[var(--kt-ink-strong)]">{character.name}</div>
      <div className="truncate text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
        {character.role} / stage {stage}
      </div>
    </div>
  </div>
);

export const LearnJapanesePage: React.FC<LearnJapanesePageProps> = ({ language }) => {
  const t = copy[language];
  const [progress, setProgress] = useState(() => readProgress());
  const [userState, setUserState] = useState(() => getJLearnUserState());
  const [featureFlags, setFeatureFlags] = useState(() => getJLearnFeatureFlags());
  const refreshProgress = useCallback(() => setProgress(readProgress()), []);
  const relationshipLevels = userState.relationshipLevels;

  useEffect(
    () =>
      subscribeJLearnUserState(() => {
        setUserState(getJLearnUserState());
        setFeatureFlags(getJLearnFeatureFlags());
        setProgress(readProgress());
      }),
    []
  );
  const trackStats = useMemo(() => {
    const steps = jlearnTrack.levels.flatMap((level) => level.units.flatMap((unit) => unit.steps));
    const completed = steps.filter((step) => progress.completedStepIds.includes(step.id)).length;
    const unlocked = steps.filter((step) => isStepUnlocked(step.id, progress, jlearnTrack)).length;
    const pct = steps.length > 0 ? Math.round((completed / steps.length) * 100) : 0;

    return { total: steps.length, completed, unlocked, pct };
  }, [progress]);
  const levelStates = useMemo<Record<string, LevelState>>(() => {
    const states: Record<string, LevelState> = {};
    const currentLevelIndex = jlearnTrack.levels.findIndex((level, levelIndex) => {
      const completed = progress.completedLevelIds.includes(level.id);
      const previousCompleted =
        levelIndex === 0 || progress.completedLevelIds.includes(jlearnTrack.levels[levelIndex - 1].id);

      return !completed && previousCompleted;
    });

    jlearnTrack.levels.forEach((level, levelIndex) => {
      if (progress.completedLevelIds.includes(level.id)) {
        states[level.id] = 'completed';
      } else if (levelIndex === currentLevelIndex) {
        states[level.id] = 'current';
      } else {
        states[level.id] = 'locked';
      }
    });

    return states;
  }, [progress.completedLevelIds]);

  return (
    <div className="mx-auto w-full max-w-6xl px-[var(--kt-space-16)] py-[var(--kt-space-32)] sm:px-[var(--kt-space-24)] lg:px-[var(--kt-space-32)]">
      <section className="relative mb-[var(--kt-space-32)] overflow-hidden rounded-[2.2rem] border border-[var(--kt-border-subtle)] bg-[radial-gradient(circle_at_15%_10%,var(--kt-accent-info-soft),transparent_30%),radial-gradient(circle_at_90%_20%,var(--kt-brand-soft),transparent_28%),linear-gradient(135deg,var(--kt-surface-raised),var(--kt-surface))] p-6 shadow-[var(--kt-shadow-md)] sm:p-8">
        <div className="absolute right-8 top-8 hidden h-24 w-24 rounded-full border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] opacity-70 shadow-[var(--kt-shadow-sm)] lg:block" />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div>
            <span className="text-[length:var(--kt-type-xs)] font-black uppercase tracking-[0.18em] text-[var(--kt-color-accent)]">
              {t.eyebrow}
            </span>
            <h1 className="mt-[var(--kt-space-8)] text-[length:var(--kt-type-3xl)] font-black leading-tight text-[var(--kt-ink-strong)] sm:text-5xl">
              {t.title}
            </h1>
            <p className="mt-[var(--kt-space-12)] max-w-2xl text-[length:var(--kt-type-base)] leading-7 text-[var(--kt-color-muted)]">
              {t.intro}
            </p>
          </div>

          <div className="rounded-[1.7rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-4 shadow-[var(--kt-shadow-sm)]">
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                {t.progressLabel}
              </span>
              <span className="text-2xl font-black text-[var(--kt-accent-info)]">{trackStats.pct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--kt-progress-track)]">
              <div className="h-full rounded-full bg-[var(--kt-accent-info)]" style={{ width: `${trackStats.pct}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-[1rem] bg-[var(--kt-surface-muted)] p-3">
                <div className="text-lg font-black text-[var(--kt-ink-strong)]">{trackStats.total}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--kt-ink-muted)]">{t.totalMissions}</div>
              </div>
              <div className="rounded-[1rem] bg-[var(--kt-accent-info-soft)] p-3">
                <div className="text-lg font-black text-[var(--kt-accent-info)]">{trackStats.unlocked}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--kt-ink-muted)]">{t.unlockedMissions}</div>
              </div>
              <div className="rounded-[1rem] bg-[var(--kt-accent-success-soft)] p-3">
                <div className="text-lg font-black text-[var(--kt-accent-success)]">{trackStats.completed}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--kt-ink-muted)]">{t.completedMissions}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-[var(--kt-space-32)] rounded-[2rem] border border-[var(--kt-border-subtle)] bg-[linear-gradient(135deg,var(--kt-surface),var(--kt-surface-muted))] p-5 shadow-[var(--kt-shadow)]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[var(--kt-ink-muted)]">
            {t.pathLabel}
          </h2>
          <span className="rounded-full border border-[var(--kt-border)] bg-[var(--kt-surface)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-accent-info)]">
            {'Airport -> School -> Market'}
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-3 md:items-stretch">
          {jlearnTrack.levels.map((level, levelIndex) => {
            const state = levelStates[level.id];
            const stop = journeyStops[level.id] ?? { label: level.location ?? level.title, detail: level.theme };
            const challengeCta = getChallengeCtaForLevel(level, progress, userState, featureFlags);
            const character = levelCharacters[level.id];
            const characterStage = character
              ? (relationshipLevels[character.id] ?? 0)
              : 0;
            const previousHook = jlearnTrack.levels[levelIndex - 1]?.storyHook;
            const stopClass =
              state === 'completed'
                ? 'border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] shadow-[0_0_0_1px_var(--kt-accent-success),var(--kt-shadow-md)]'
                : state === 'current'
                  ? 'border-[var(--kt-accent-info)] bg-[var(--kt-accent-info-soft)] shadow-[var(--kt-shadow-md)]'
                  : 'border-[var(--kt-border)] bg-[var(--kt-surface-muted)] opacity-65 grayscale';
            const dotClass =
              state === 'completed'
                ? 'border-[var(--kt-accent-success)] bg-[var(--kt-accent-success)] text-white'
                : state === 'current'
                  ? 'border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)] text-white animate-pulse'
                  : 'border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-subtle)]';

            return (
              <div key={level.id} className="relative">
                {levelIndex < jlearnTrack.levels.length - 1 && (
                  <div className="absolute left-[calc(100%-0.25rem)] top-1/2 hidden h-1 w-6 -translate-y-1/2 rounded-full bg-[var(--kt-border)] md:block" />
                )}
                <div className={`h-full rounded-[1.5rem] border p-4 transition ${stopClass}`}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-xs font-black shadow-[var(--kt-shadow-sm)] ${dotClass}`}>
                      {levelIndex + 1}
                    </span>
                    <span className="rounded-full bg-[var(--kt-surface)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
                      {state === 'completed' ? t.completed : state === 'current' ? t.current : t.locked}
                    </span>
                  </div>
                  <div className="text-xl font-black text-[var(--kt-ink-strong)]">{stop.label}</div>
                  <div className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-accent-info)]">
                    {level.title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--kt-ink-muted)]">{stop.detail}</p>
                  {character && (
                    <div className="mt-4">
                      <LevelCharacterAvatar
                        character={character}
                        stage={characterStage}
                        compact
                      />
                    </div>
                  )}
                  {state === 'completed' && level.badge && (
                    <div className="mt-4 rounded-[1rem] border border-[var(--kt-accent-success)] bg-[var(--kt-surface)] px-3 py-2 text-xs font-black text-[var(--kt-accent-success)]">
                      {level.badge.name}
                    </div>
                  )}
                  {challengeCta && (
                    <Link
                      to={`${appShellRoutes.learnJapaneseChallengeBase}/${level.id}`}
                      onClick={() => markChallengeAttempted(challengeCta)}
                      className="mt-4 block animate-pulse rounded-[1rem] border-2 border-[var(--kt-accent-warning)] bg-[linear-gradient(135deg,var(--kt-accent-warning-soft),var(--kt-surface))] p-3 shadow-[0_0_0_1px_var(--kt-accent-warning),var(--kt-shadow-md)] transition hover:brightness-105"
                    >
                      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-accent-warning)]">
                        {t.challengeEyebrow}
                      </div>
                      <div className="mt-1 text-sm font-black text-[var(--kt-ink-strong)]">
                        {challengeCta.title}
                      </div>
                    </Link>
                  )}
                  {state === 'locked' && previousHook && (
                    <div className="mt-4 rounded-[1rem] border border-dashed border-[var(--kt-border)] bg-[var(--kt-surface)] p-3">
                      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
                        {t.nextHook}
                      </div>
                      <p className="mt-1 font-jp text-base font-black text-[var(--kt-ink-strong)]">
                        {previousHook.japanese}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[var(--kt-ink-muted)]">
                        {previousHook.teaser}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="space-y-[var(--kt-space-32)]">
        {jlearnTrack.levels.map((level, levelIndex) => {
          const levelSteps = level.units.flatMap((unit) => unit.steps);
          const levelCompleted = levelSteps.filter((step) => progress.completedStepIds.includes(step.id)).length;
          const levelPct = levelSteps.length > 0 ? Math.round((levelCompleted / levelSteps.length) * 100) : 0;
          const levelState = levelStates[level.id];
          const character = levelCharacters[level.id];
          const characterStage = character
            ? (relationshipLevels[character.id] ?? 0)
            : 0;
          const previousHook = jlearnTrack.levels[levelIndex - 1]?.storyHook;
          const challengeCta = getChallengeCtaForLevel(level, progress, userState, featureFlags);
          const sectionClass =
            levelState === 'completed'
              ? 'border-[var(--kt-accent-success)] bg-[radial-gradient(circle_at_top_right,var(--kt-accent-success-soft),transparent_34%),var(--kt-surface)] shadow-[0_0_0_1px_var(--kt-accent-success),var(--kt-shadow-lg)]'
              : levelState === 'current'
                ? 'border-[var(--kt-accent-info)] bg-[radial-gradient(circle_at_top_right,var(--kt-accent-info-soft),transparent_34%),var(--kt-surface)] shadow-[var(--kt-shadow-lg)]'
                : 'border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] opacity-70 grayscale shadow-[var(--kt-shadow-sm)]';

          return (
            <section
              key={level.id}
              className={`relative overflow-hidden rounded-[2rem] border p-5 transition sm:p-6 ${sectionClass}`}
            >
              <div className="absolute left-10 top-28 bottom-8 hidden w-px bg-[linear-gradient(var(--kt-border),var(--kt-accent-info),var(--kt-border))] opacity-70 md:block" />
              <div className="relative mb-6 flex flex-wrap items-end justify-between gap-4 rounded-[1.6rem] border border-[var(--kt-border-subtle)] bg-[linear-gradient(135deg,var(--kt-surface-raised),var(--kt-surface-muted))] p-5 shadow-[var(--kt-shadow-sm)]">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--kt-ink-muted)]">
                    {t.levelHeader} {level.id} / {level.jlptAlignment}
                  </span>
                  <h2 className="mt-1 text-2xl font-black text-[var(--kt-ink-strong)]">{level.title}</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--kt-ink-muted)]">
                    {levelState === 'locked' && previousHook ? previousHook.teaser : level.theme}
                  </p>
                  {levelState === 'locked' && previousHook && (
                    <p className="mt-2 font-jp text-base font-black text-[var(--kt-ink-strong)]">
                      {previousHook.japanese}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-end gap-3">
                  {character && (
                    <LevelCharacterAvatar character={character} stage={characterStage} />
                  )}
                  <div
                    className={`rounded-full border bg-[var(--kt-surface)] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${
                      levelState === 'completed'
                        ? 'border-[var(--kt-accent-success)] text-[var(--kt-accent-success)]'
                        : levelState === 'current'
                          ? 'border-[var(--kt-accent-info)] text-[var(--kt-accent-info)] animate-pulse'
                          : 'border-[var(--kt-border)] text-[var(--kt-ink-muted)]'
                    }`}
                  >
                    {levelState === 'completed' ? t.completed : levelState === 'current' ? `${t.current} / ${levelPct}%` : t.locked}
                  </div>
                  {levelState === 'completed' && level.badge && (
                    <span className="rounded-full border border-[var(--kt-accent-success)] bg-[var(--kt-surface)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-accent-success)] shadow-[var(--kt-shadow-sm)]">
                      {level.badge.name}
                    </span>
                  )}
                </div>
              </div>

              {challengeCta && (
                <Link
                  to={`${appShellRoutes.learnJapaneseChallengeBase}/${level.id}`}
                  onClick={() => markChallengeAttempted(challengeCta)}
                  className="relative mb-6 block overflow-hidden rounded-[1.6rem] border-2 border-[var(--kt-accent-warning)] bg-[radial-gradient(circle_at_15%_25%,var(--kt-accent-warning-soft),transparent_34%),linear-gradient(135deg,var(--kt-surface-raised),var(--kt-surface))] p-5 shadow-[0_0_0_1px_var(--kt-accent-warning),0_18px_45px_rgba(245,158,11,0.22)] transition hover:brightness-105"
                >
                  <div className="absolute right-5 top-5 h-16 w-16 animate-pulse rounded-full border border-[var(--kt-accent-warning)] bg-[var(--kt-accent-warning-soft)]" />
                  <div className="relative flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--kt-accent-warning)]">
                        {t.challengeEyebrow} / {challengeCta.levelId}
                      </div>
                      <h3 className="mt-1 text-xl font-black text-[var(--kt-ink-strong)]">
                        {t.challengeTitle}: {challengeCta.title}
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--kt-ink-muted)]">
                        {challengeCta.description}
                      </p>
                      {challengeCta.isPreview && (
                        <p className="mt-2 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
                          {t.challengePreview}
                        </p>
                      )}
                    </div>
                    <div className="animate-pulse rounded-full border border-[var(--kt-accent-warning)] bg-[var(--kt-accent-warning-soft)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-accent-warning)]">
                      {t.challengeAction}
                    </div>
                  </div>
                </Link>
              )}

              {levelState === 'locked' ? (
                <div className="rounded-[1.6rem] border border-dashed border-[var(--kt-border)] bg-[var(--kt-surface)] p-5 shadow-[var(--kt-shadow-sm)]">
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                    {t.locked}
                  </div>
                  <h3 className="mt-2 text-xl font-black text-[var(--kt-ink-strong)]">{t.nextHook}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--kt-ink-muted)]">{t.unlockHint}</p>
                  {previousHook && (
                    <div className="mt-4 rounded-[1.25rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
                        {previousHook.speaker}
                      </div>
                      <p className="mt-1 font-jp text-xl font-black text-[var(--kt-ink-strong)]">
                        {previousHook.japanese}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--kt-ink-muted)]">
                        {previousHook.translation}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
              <div className="space-y-5">
                {level.units.map((unit, unitIndex) => (
                  <div key={unit.id} className="relative grid gap-4 md:grid-cols-[4rem_minmax(0,1fr)] md:items-start">
                    <div className="hidden md:flex md:justify-center">
                      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--kt-accent-info)] bg-[var(--kt-accent-info-soft)] text-sm font-black text-[var(--kt-accent-info)] shadow-[var(--kt-shadow-sm)]">
                        {levelIndex + 1}.{unitIndex + 1}
                      </div>
                    </div>

                    <div className="rounded-[1.7rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-4 shadow-[var(--kt-shadow-sm)] sm:p-5">
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--kt-ink-muted)]">
                            {t.unitHeader} {unit.id}
                          </span>
                          <h3 className="mt-1 text-lg font-black text-[var(--kt-ink-strong)]">{unit.title}</h3>
                          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--kt-ink-muted)]">{unit.summary}</p>
                        </div>
                        <span className="rounded-full bg-[var(--kt-surface-muted)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
                          {t.mapLabel}
                        </span>
                      </div>

                      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {unit.steps.map((step, stepIndex) => {
                          const unlocked = isStepUnlocked(step.id, progress, jlearnTrack);
                          const done = progress.completedStepIds.includes(step.id);
                          const statusLabel = done ? t.completed : unlocked ? t.available : t.locked;
                          const nodeClasses = done
                            ? 'border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)]'
                            : unlocked
                              ? 'border-[var(--kt-accent-info)] bg-[var(--kt-accent-info-soft)] text-[var(--kt-accent-info)]'
                              : 'border-[var(--kt-border)] bg-[var(--kt-surface-muted)] text-[var(--kt-ink-subtle)]';
                          const cardClasses = done
                            ? 'border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)]'
                            : unlocked
                              ? 'border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] hover:-translate-y-0.5 hover:border-[var(--kt-accent-info)] hover:shadow-[var(--kt-shadow-md)]'
                              : 'border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] opacity-55';

                          const content = (
                            <>
                              <div className="mb-3 flex items-center justify-between gap-3">
                                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-xs font-black shadow-[var(--kt-shadow-sm)] ${nodeClasses}`}>
                                  {done ? 'OK' : stepIndex + 1}
                                </span>
                                <span className="rounded-full bg-[var(--kt-surface-raised)] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--kt-ink-muted)]">
                                  {statusLabel}
                                </span>
                              </div>
                              <div className="font-black leading-snug text-[var(--kt-ink-strong)]">{step.title}</div>
                              <div className="mt-2 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--kt-accent-info)]">
                                {step.isCheckpoint ? t.checkpoint : (step.kind ?? t.missionHeader)} / {step.estimatedMinutes} {t.minutes}
                              </div>
                              {step.goal && (
                                <p className="mt-3 text-xs leading-5 text-[var(--kt-ink-muted)]">{step.goal}</p>
                              )}
                              <div className="mt-3 text-[10px] font-mono text-[var(--kt-ink-muted)]">{step.id}</div>
                            </>
                          );

                          return (
                            <li key={step.id}>
                              {unlocked ? (
                                <Link
                                  to={`${appShellRoutes.learnJapaneseMissionBase}/${step.id}`}
                                  onClick={refreshProgress}
                                  className={`block h-full rounded-[1.35rem] border p-4 text-sm shadow-[var(--kt-shadow-sm)] transition ${cardClasses}`}
                                >
                                  {content}
                                </Link>
                              ) : (
                                <div className={`block h-full rounded-[1.35rem] border p-4 text-sm ${cardClasses}`}>
                                  {content}
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="mt-10">
        <Link
          to="/learn"
          className="inline-flex rounded-full border border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-2 text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-accent-info)] transition hover:bg-[var(--kt-nav-item-hover)]"
        >
          {t.routeBack}
        </Link>
      </div>

      <DebugPanel />
    </div>
  );
};

export default LearnJapanesePage;
