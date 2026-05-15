import React from 'react';
import { useNavigate } from 'react-router-dom';
import { lessonConcepts } from '../data/lessonContent';
import {
  getConceptPercentage,
  getNextAvailableSession,
  getSessionStatus,
} from '../lessonStorage';
import type { LessonConcept, LessonSessionNumber, SessionCompletionStatus } from '../lessonTypes';
import { SESSION_PROGRESS } from '../lessonTypes';

const LESSON_SESSION_BASE = '/lessons/session';

function getLessonSessionRoute(conceptId: string, sessionNumber: number): string {
  return `${LESSON_SESSION_BASE}/${conceptId}/${sessionNumber}`;
}

function SessionDot({ status }: { status: SessionCompletionStatus }) {
  if (status === 'complete') {
    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--kt-accent-info)]">
        <svg viewBox="0 0 24 24" fill="white" className="h-3 w-3">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </div>
    );
  }
  if (status === 'available') {
    return (
      <div className="h-5 w-5 rounded-full border-2 border-[var(--kt-accent-info)] bg-transparent" />
    );
  }
  return (
    <div className="h-5 w-5 rounded-full border-2 border-[var(--kt-border-subtle)] bg-transparent opacity-40" />
  );
}

function ConceptCard({ concept }: { concept: LessonConcept }) {
  const navigate = useNavigate();
  const pct = getConceptPercentage(concept.id);
  const nextSession = getNextAvailableSession(concept.id);

  const handleClick = () => {
    if (nextSession !== null) {
      navigate(getLessonSessionRoute(concept.id, nextSession));
    } else {
      // All complete — replay session 1
      navigate(getLessonSessionRoute(concept.id, 1));
    }
  };

  const ctaLabel =
    pct === 0
      ? 'Başla'
      : pct === 100
      ? 'Tekrar Et'
      : 'Devam Et';

  return (
    <div className="flex flex-col gap-4 rounded-[1.6rem] border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5 transition hover:border-[var(--kt-accent-info)] hover:shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{concept.emoji}</span>
          <div>
            <p className="font-bold text-[var(--kt-ink-strong)]">{concept.title}</p>
            {concept.titleJapanese && (
              <p className="font-jp text-sm text-[var(--kt-ink-muted)]">{concept.titleJapanese}</p>
            )}
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
            pct === 100
              ? 'bg-[var(--kt-accent-info)] bg-opacity-15 text-[var(--kt-accent-info)]'
              : 'bg-[var(--kt-border-subtle)] text-[var(--kt-ink-muted)]'
          }`}
        >
          {pct}%
        </span>
      </div>

      <p className="text-sm text-[var(--kt-ink-muted)]">{concept.description}</p>

      {/* Session dots */}
      <div className="flex items-center gap-2">
        {([1, 2, 3, 4] as LessonSessionNumber[]).map((n) => {
          const status = getSessionStatus(concept.id, n);
          return (
            <div key={n} className="flex flex-col items-center gap-1">
              <SessionDot status={status} />
              <span className="text-[10px] text-[var(--kt-ink-muted)]">{SESSION_PROGRESS[n]}%</span>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={handleClick}
        className="w-full rounded-[1.2rem] bg-[var(--kt-accent-info)] py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:opacity-90"
      >
        {ctaLabel}
      </button>
    </div>
  );
}

export const LessonMapPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[var(--kt-ink-strong)]">Dersler</h1>
        <p className="mt-1 text-sm text-[var(--kt-ink-muted)]">
          Her ders 4 oturum içerir. Concept'i adım adım öğren.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {lessonConcepts.map((concept) => (
          <ConceptCard key={concept.id} concept={concept} />
        ))}
      </div>
    </div>
  );
};
