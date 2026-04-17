import { MutableRefObject } from 'react';
import { KanaProgress } from '../domain/kanaProgress';
import { StudySession, StudySessionAnswerRecord, StudySessionConfigValue } from '../domain/studySession';
import { applySessionAnswerToProgress } from '../progress/progressService';
import {
  completeStudySession,
  recordStudySessionAnswer,
  updateStudySession
} from './sessionEngine';

interface SessionPersistenceContext {
  sessionRef: MutableRefObject<StudySession | null>;
  saveSession: (session: StudySession, options?: { active?: boolean }) => void;
  setActiveSession: (sessionId: string | null) => void;
}

interface PersistSessionOptions {
  active?: boolean;
  clearActive?: boolean;
}

interface RecordSessionAnswerInput {
  itemIds: string[];
  currentIndex: number;
  config?: Record<string, StudySessionConfigValue>;
}

interface ProgressSyncContext {
  getProgress: (kanaId: string) => KanaProgress | null;
  saveProgress: (entry: KanaProgress) => void;
}

interface ProgressSyncOptions {
  datasetType?: 'character' | 'word';
}

export const persistSessionState = (
  context: SessionPersistenceContext,
  session: StudySession,
  options: PersistSessionOptions = { active: true }
) => {
  context.sessionRef.current = session;
  context.saveSession(session, options.active ? { active: true } : undefined);

  if (options.clearActive) {
    context.setActiveSession(null);
  }
};

export const updateSessionConfigAndPersist = (
  context: SessionPersistenceContext,
  input: { config: Record<string, StudySessionConfigValue> }
) => {
  if (!context.sessionRef.current) {
    return null;
  }

  const nextSession = updateStudySession(context.sessionRef.current, {
    config: input.config
  });

  persistSessionState(context, nextSession);
  return nextSession;
};

export const updateSessionCursorAndPersist = (
  context: SessionPersistenceContext,
  input: RecordSessionAnswerInput
) => {
  if (!context.sessionRef.current) {
    return null;
  }

  const nextSession = updateStudySession(context.sessionRef.current, {
    itemIds: input.itemIds,
    currentIndex: input.currentIndex,
    config: input.config
  });

  persistSessionState(context, nextSession);
  return nextSession;
};

export const recordAnswerAndPersistSession = (
  context: SessionPersistenceContext,
  answer: StudySessionAnswerRecord,
  input: RecordSessionAnswerInput
) => {
  if (!context.sessionRef.current) {
    return null;
  }

  const nextSession = recordStudySessionAnswer(context.sessionRef.current, answer, {
    itemIds: input.itemIds,
    currentIndex: input.currentIndex,
    config: input.config
  });

  persistSessionState(context, nextSession);
  return nextSession;
};

export const completeAndPersistSession = (context: SessionPersistenceContext) => {
  if (!context.sessionRef.current) {
    return null;
  }

  const completedSession = completeStudySession(context.sessionRef.current);
  persistSessionState(context, completedSession, { active: false, clearActive: true });
  return completedSession;
};

export const syncProgressFromSessionAnswer = (
  context: ProgressSyncContext,
  answer: StudySessionAnswerRecord,
  options: ProgressSyncOptions = {}
) => {
  if (options.datasetType === 'word') {
    return;
  }

  const currentProgress = context.getProgress(answer.itemId);

  if (!currentProgress) {
    return;
  }

  context.saveProgress(applySessionAnswerToProgress(currentProgress, answer));
};
