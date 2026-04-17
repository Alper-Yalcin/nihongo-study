import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { kanaInventory } from '../data/kanaInventory';
import { KanaProgress, KanaProgressSummary } from '../domain/kanaProgress';
import { KanaScript } from '../domain/kanaItem';
import { StudySession } from '../domain/studySession';
import { buildKanaProgressSummary } from './progressSelectors';
import { createLocalProgressRepository } from './localProgressRepository';
import {
  getProgressStorageKeys,
  KanaStoreScope,
  ProgressRepository
} from './progressRepository';
import { createLocalSessionRepository } from '../session/localSessionRepository';
import { getSessionStorageKeys, SessionRepository } from '../session/sessionRepository';

const canonicalProgressRepository = createLocalProgressRepository(getProgressStorageKeys('study'));

const progressRepositoriesByScope: Record<KanaStoreScope, ProgressRepository> = {
  study: canonicalProgressRepository,
  play: canonicalProgressRepository
};

const sessionRepositoriesByScope: Record<KanaStoreScope, SessionRepository> = {
  study: createLocalSessionRepository(getSessionStorageKeys('study')),
  play: createLocalSessionRepository(getSessionStorageKeys('play'))
};

interface KanaProgressStoreValue {
  scope: KanaStoreScope;
  progressEntries: KanaProgress[];
  activeSession: StudySession | null;
  summaries: Record<KanaScript, KanaProgressSummary>;
  refreshProgress: () => void;
  refreshSessions: () => void;
  getSession: (sessionId: string) => StudySession | null;
  listSessions: () => StudySession[];
  getProgress: (kanaId: string) => KanaProgress | null;
  listByScript: (script: KanaScript) => KanaProgress[];
  saveProgress: (entry: KanaProgress) => void;
  saveProgressMany: (entries: KanaProgress[]) => void;
  replaceAllProgress: (entries: KanaProgress[]) => void;
  clearProgress: () => void;
  saveSession: (session: StudySession, options?: { active?: boolean }) => void;
  setActiveSession: (sessionId: string | null) => void;
  clearSessions: () => void;
}

const KanaProgressContext = createContext<KanaProgressStoreValue | null>(null);

interface KanaProgressProviderProps {
  scope?: KanaStoreScope;
}

export const KanaProgressProvider: React.FC<React.PropsWithChildren<KanaProgressProviderProps>> = ({
  children,
  scope = 'study'
}) => {
  const progressRepository = progressRepositoriesByScope[scope];
  const sessionRepository = sessionRepositoriesByScope[scope];
  const [progressEntries, setProgressEntries] = useState<KanaProgress[]>(() =>
    progressRepository.seedFromInventory(kanaInventory)
  );
  const [activeSession, setActiveSessionState] = useState<StudySession | null>(() =>
    sessionRepository.getActive()
  );

  useEffect(() => {
    setProgressEntries(progressRepository.seedFromInventory(kanaInventory));
    setActiveSessionState(sessionRepository.getActive());
  }, [progressRepository, sessionRepository]);

  const refreshProgress = useCallback(() => {
    setProgressEntries(progressRepository.seedFromInventory(kanaInventory));
  }, [progressRepository]);

  const refreshSessions = useCallback(() => {
    setActiveSessionState(sessionRepository.getActive());
  }, [sessionRepository]);

  const summaries = useMemo(
    () => ({
      hiragana: buildKanaProgressSummary('hiragana', progressEntries),
      katakana: buildKanaProgressSummary('katakana', progressEntries)
    }),
    [progressEntries]
  );

  const value = useMemo<KanaProgressStoreValue>(
    () => ({
      scope,
      progressEntries,
      activeSession,
      summaries,
      refreshProgress,
      refreshSessions,
      getSession: (sessionId) => sessionRepository.get(sessionId),
      listSessions: () => sessionRepository.list(),
      getProgress: (kanaId) =>
        progressEntries.find((entry) => entry.kanaId === kanaId) ?? null,
      listByScript: (script) =>
        progressEntries.filter((entry) => entry.script === script),
      saveProgress: (entry) => {
        setProgressEntries(progressRepository.save(entry));
      },
      saveProgressMany: (entries) => {
        setProgressEntries(progressRepository.saveMany(entries));
      },
      replaceAllProgress: (entries) => {
        setProgressEntries(progressRepository.replaceAll(entries));
      },
      clearProgress: () => {
        progressRepository.clear();
        setProgressEntries(progressRepository.seedFromInventory(kanaInventory));
      },
      saveSession: (session, options) => {
        sessionRepository.save(session, options);
        setActiveSessionState(sessionRepository.getActive());
      },
      setActiveSession: (sessionId) => {
        sessionRepository.setActive(sessionId);
        setActiveSessionState(sessionRepository.getActive());
      },
      clearSessions: () => {
        sessionRepository.clear();
        setActiveSessionState(null);
      }
    }),
    [
      activeSession,
      progressEntries,
      progressRepository,
      refreshProgress,
      refreshSessions,
      scope,
      sessionRepository,
      summaries
    ]
  );

  return (
    <KanaProgressContext.Provider value={value}>
      {children}
    </KanaProgressContext.Provider>
  );
};

export const useKanaProgressStore = () => {
  const context = useContext(KanaProgressContext);

  if (!context) {
    throw new Error('useKanaProgressStore must be used within a KanaProgressProvider.');
  }

  return context;
};

export const useKanaProgressSummary = (script: KanaScript) => {
  const { summaries } = useKanaProgressStore();
  return summaries[script];
};
