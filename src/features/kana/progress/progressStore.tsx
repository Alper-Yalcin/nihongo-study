import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { kanaInventory } from '../data/kanaInventory';
import { KanaProgress, KanaProgressSummary } from '../domain/kanaProgress';
import { KanaScript } from '../domain/kanaItem';
import { StudySession } from '../domain/studySession';
import { buildKanaProgressSummary } from './progressSelectors';
import { localProgressRepository } from './localProgressRepository';
import { localSessionRepository } from '../session/localSessionRepository';

interface KanaProgressStoreValue {
  progressEntries: KanaProgress[];
  activeSession: StudySession | null;
  summaries: Record<KanaScript, KanaProgressSummary>;
  refreshProgress: () => void;
  refreshSessions: () => void;
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

export const KanaProgressProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [progressEntries, setProgressEntries] = useState<KanaProgress[]>(() =>
    localProgressRepository.seedFromInventory(kanaInventory)
  );
  const [activeSession, setActiveSessionState] = useState<StudySession | null>(() =>
    localSessionRepository.getActive()
  );

  const refreshProgress = useCallback(() => {
    setProgressEntries(localProgressRepository.seedFromInventory(kanaInventory));
  }, []);

  const refreshSessions = useCallback(() => {
    setActiveSessionState(localSessionRepository.getActive());
  }, []);

  const summaries = useMemo(
    () => ({
      hiragana: buildKanaProgressSummary('hiragana', progressEntries),
      katakana: buildKanaProgressSummary('katakana', progressEntries)
    }),
    [progressEntries]
  );

  const value = useMemo<KanaProgressStoreValue>(
    () => ({
      progressEntries,
      activeSession,
      summaries,
      refreshProgress,
      refreshSessions,
      getProgress: (kanaId) =>
        progressEntries.find((entry) => entry.kanaId === kanaId) ?? null,
      listByScript: (script) =>
        progressEntries.filter((entry) => entry.script === script),
      saveProgress: (entry) => {
        setProgressEntries(localProgressRepository.save(entry));
      },
      saveProgressMany: (entries) => {
        setProgressEntries(localProgressRepository.saveMany(entries));
      },
      replaceAllProgress: (entries) => {
        setProgressEntries(localProgressRepository.replaceAll(entries));
      },
      clearProgress: () => {
        localProgressRepository.clear();
        setProgressEntries(localProgressRepository.seedFromInventory(kanaInventory));
      },
      saveSession: (session, options) => {
        localSessionRepository.save(session, options);
        setActiveSessionState(localSessionRepository.getActive());
      },
      setActiveSession: (sessionId) => {
        localSessionRepository.setActive(sessionId);
        setActiveSessionState(localSessionRepository.getActive());
      },
      clearSessions: () => {
        localSessionRepository.clear();
        setActiveSessionState(null);
      }
    }),
    [activeSession, progressEntries, refreshProgress, refreshSessions, summaries]
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
