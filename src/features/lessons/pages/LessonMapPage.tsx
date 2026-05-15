import React, { useState } from 'react';
import { lessonConcepts } from '../data/lessonContent';
import {
  getConceptPercentage,
  getNextAvailableSession,
  markSessionComplete,
} from '../lessonStorage';
import type {
  LessonConcept,
  LessonSessionNumber,
  LessonSessionResult,
} from '../lessonTypes';
import { LessonExerciseRunner } from '../LessonExerciseRunner';

type NodeState = 'locked' | 'active' | 'complete';

interface NodeRuntime {
  concept: LessonConcept;
  index: number;
  state: NodeState;
  nextSession: LessonSessionNumber | null;
  completedSessions: number;
  percentage: number;
}

interface ActiveLesson {
  conceptId: string;
  sessionNumber: LessonSessionNumber;
}

function getNodeStatus(
  conceptId: string,
  prevConceptId: string | null
): NodeState {
  const next = getNextAvailableSession(conceptId);
  if (next === null) return 'complete';
  if (prevConceptId === null) return 'active';
  const prevNext = getNextAvailableSession(prevConceptId);
  if (prevNext === null) return 'active';
  return 'locked';
}

function NodeIcon({ state, emoji }: { state: NodeState; emoji: string }) {
  if (state === 'complete') {
    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--kt-accent-info)] shadow-[0_6px_0_rgba(0,0,0,0.15)]">
        <svg viewBox="0 0 24 24" fill="white" className="h-10 w-10">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </div>
    );
  }
  if (state === 'active') {
    return (
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--kt-brand)] shadow-[0_6px_0_rgba(0,0,0,0.2)]">
        <span className="text-3xl">{emoji}</span>
      </div>
    );
  }
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--kt-border-subtle)] opacity-60 shadow-[0_4px_0_rgba(0,0,0,0.1)]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        className="h-8 w-8 text-[var(--kt-ink-muted)]"
      >
        <rect x="6" y="11" width="12" height="9" rx="2" />
        <path d="M9 11V7a3 3 0 016 0v4" />
      </svg>
    </div>
  );
}

function NodePopup({
  runtime,
  onStart,
  onClose,
}: {
  runtime: NodeRuntime;
  onStart: () => void;
  onClose: () => void;
}) {
  const { concept, nextSession, completedSessions } = runtime;
  const sessionLabel =
    nextSession !== null ? `Ders ${nextSession}/4` : 'Tamamlandı';

  return (
    <>
      <div
        className="fixed inset-0 z-30"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute left-1/2 top-full z-40 mt-4 w-72 -translate-x-1/2 rounded-[1.4rem] bg-[var(--kt-brand)] p-5 shadow-xl">
        <div
          className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-[var(--kt-brand)]"
          aria-hidden="true"
        />
        <p className="relative text-base font-black uppercase tracking-wide text-white">
          {concept.title}
        </p>
        {concept.titleJapanese && (
          <p className="relative mt-0.5 font-jp text-sm text-white/80">
            {concept.titleJapanese}
          </p>
        )}
        <p className="relative mt-2 text-xs font-semibold uppercase tracking-widest text-white/70">
          {sessionLabel}
        </p>
        <button
          type="button"
          onClick={onStart}
          className="relative mt-4 w-full rounded-[1rem] bg-white py-3 text-sm font-black uppercase tracking-[0.12em] text-[var(--kt-brand)] shadow-[0_4px_0_rgba(0,0,0,0.15)] transition active:translate-y-0.5 active:shadow-[0_2px_0_rgba(0,0,0,0.15)]"
        >
          {nextSession === null
            ? 'Tekrar Et'
            : completedSessions === 0
            ? 'Başla +10 puan'
            : 'Devam Et +10 puan'}
        </button>
      </div>
    </>
  );
}

function MapNode({
  runtime,
  isOpen,
  xOffset,
  onToggle,
  onStart,
}: {
  runtime: NodeRuntime;
  isOpen: boolean;
  xOffset: number;
  onToggle: () => void;
  onStart: () => void;
}) {
  const { concept, state, index } = runtime;
  const clickable = state !== 'locked';

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ transform: `translateX(${xOffset}px)` }}
    >
      <button
        type="button"
        disabled={!clickable}
        onClick={onToggle}
        className={`relative transition ${
          clickable ? 'cursor-pointer hover:-translate-y-1' : 'cursor-not-allowed'
        }`}
        aria-label={`${concept.title} dersi`}
      >
        <NodeIcon state={state} emoji={concept.emoji} />
      </button>
      <p
        className={`mt-3 max-w-[12rem] text-center text-sm font-bold ${
          state === 'locked'
            ? 'text-[var(--kt-ink-muted)] opacity-60'
            : 'text-[var(--kt-ink-strong)]'
        }`}
      >
        Ders {index + 1}: {concept.title}
      </p>

      {isOpen && (
        <NodePopup runtime={runtime} onStart={onStart} onClose={onToggle} />
      )}
    </div>
  );
}

export const LessonMapPage: React.FC = () => {
  const [openNodeId, setOpenNodeId] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<ActiveLesson | null>(null);
  const [, setRefreshTick] = useState(0);
  const refresh = () => setRefreshTick((t) => t + 1);

  const runtimes: NodeRuntime[] = lessonConcepts.map((concept, index) => {
    const prevConceptId = index > 0 ? lessonConcepts[index - 1].id : null;
    const state = getNodeStatus(concept.id, prevConceptId);
    const nextSession = getNextAvailableSession(concept.id);
    const percentage = getConceptPercentage(concept.id);
    const completedSessions = percentage / 25;
    return { concept, index, state, nextSession, percentage, completedSessions };
  });

  const handleStartLesson = (runtime: NodeRuntime) => {
    const session = runtime.nextSession ?? 1;
    setActiveLesson({
      conceptId: runtime.concept.id,
      sessionNumber: session,
    });
    setOpenNodeId(null);
  };

  const handleSessionComplete = (result: LessonSessionResult) => {
    markSessionComplete(result.conceptId, result.sessionNumber);
    setActiveLesson(null);
    refresh();
  };

  const handleExit = () => {
    setActiveLesson(null);
  };

  if (activeLesson) {
    const concept = lessonConcepts.find((c) => c.id === activeLesson.conceptId);
    if (concept) {
      return (
        <div className="fixed inset-0 z-50">
          <LessonExerciseRunner
            concept={concept}
            sessionNumber={activeLesson.sessionNumber}
            onSessionComplete={handleSessionComplete}
            onExit={handleExit}
          />
        </div>
      );
    }
  }

  const offsets = [0, 80, -60, 100, -40, 60];

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="mb-10 rounded-[1.4rem] bg-[var(--kt-brand)] px-5 py-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-white/80">
          1. Kısım, 1. Ünite
        </p>
        <h1 className="mt-1 text-xl font-black text-white">
          Japonca Yolculuğu
        </h1>
      </div>

      <div className="flex flex-col items-center gap-14">
        {runtimes.map((runtime, idx) => (
          <MapNode
            key={runtime.concept.id}
            runtime={runtime}
            xOffset={offsets[idx % offsets.length]}
            isOpen={openNodeId === runtime.concept.id}
            onToggle={() =>
              setOpenNodeId((cur) =>
                cur === runtime.concept.id ? null : runtime.concept.id
              )
            }
            onStart={() => handleStartLesson(runtime)}
          />
        ))}
      </div>
    </div>
  );
};
