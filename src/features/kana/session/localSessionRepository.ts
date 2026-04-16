import {
  StudySession,
  StudySessionAnswerRecord,
  StudySessionConfigValue,
  StudySessionSummary
} from '../domain/studySession';
import {
  getSessionStorageKeys,
  SessionRepository,
  SessionStorageKeys
} from './sessionRepository';

interface SessionStoragePayload {
  version: 1;
  sessions: StudySession[];
  activeSessionId: string | null;
  updatedAt: string;
}

const createDefaultPayload = (): SessionStoragePayload => ({
  version: 1,
  sessions: [],
  activeSessionId: null,
  updatedAt: new Date(0).toISOString()
});

const DEFAULT_RESULTS_SUMMARY: StudySessionSummary = {
  total: 0,
  correct: 0,
  wrong: 0,
  accuracy: 0
};

const normalizeConfigValue = (value: unknown): StudySessionConfigValue => {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value as Exclude<StudySessionConfigValue, string[]>;
  }

  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === 'string') as string[];
  }

  return null;
};

const normalizeSessionConfig = (value: unknown): Record<string, StudySessionConfigValue> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce<Record<string, StudySessionConfigValue>>(
    (accumulator, [key, entryValue]) => {
      accumulator[key] = normalizeConfigValue(entryValue);
      return accumulator;
    },
    {}
  );
};

const normalizeAnswerHistory = (value: unknown): StudySessionAnswerRecord[] =>
  Array.isArray(value)
    ? value.reduce<StudySessionAnswerRecord[]>((accumulator, entry) => {
        if (!entry || typeof entry !== 'object') {
          return accumulator;
        }

        const raw = entry as Partial<StudySessionAnswerRecord>;

        if (
          typeof raw.itemId !== 'string' ||
          typeof raw.mode !== 'string' ||
          typeof raw.correct !== 'boolean' ||
          typeof raw.answeredAt !== 'string' ||
          typeof raw.latencyMs !== 'number' ||
          typeof raw.hintsUsed !== 'number' ||
          typeof raw.retries !== 'number'
        ) {
          return accumulator;
        }

        accumulator.push({
          itemId: raw.itemId,
          mode: raw.mode,
          correct: raw.correct,
          answeredAt: raw.answeredAt,
          latencyMs: raw.latencyMs,
          hintsUsed: raw.hintsUsed,
          retries: raw.retries,
          responseItemId:
            typeof raw.responseItemId === 'string' || raw.responseItemId === null
              ? raw.responseItemId
              : null,
          variant: typeof raw.variant === 'string' ? raw.variant : null
        });

        return accumulator;
      }, [])
    : [];

const normalizeResultsSummary = (value: unknown): StudySessionSummary => {
  if (!value || typeof value !== 'object') {
    return DEFAULT_RESULTS_SUMMARY;
  }

  const raw = value as Partial<StudySessionSummary>;

  return {
    total: typeof raw.total === 'number' ? raw.total : 0,
    correct: typeof raw.correct === 'number' ? raw.correct : 0,
    wrong: typeof raw.wrong === 'number' ? raw.wrong : 0,
    accuracy: typeof raw.accuracy === 'number' ? raw.accuracy : 0
  };
};

const normalizeStudySession = (value: unknown): StudySession | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const raw = value as Partial<StudySession>;

  if (
    typeof raw.id !== 'string' ||
    typeof raw.type !== 'string' ||
    typeof raw.mode !== 'string' ||
    typeof raw.script !== 'string' ||
    !Array.isArray(raw.itemIds) ||
    typeof raw.currentIndex !== 'number' ||
    typeof raw.startedAt !== 'string' ||
    typeof raw.status !== 'string'
  ) {
    return null;
  }

  return {
    id: raw.id,
    type: raw.type,
    script: raw.script,
    mode: raw.mode,
    itemIds: raw.itemIds.filter((item): item is string => typeof item === 'string'),
    currentIndex: raw.currentIndex,
    startedAt: raw.startedAt,
    completedAt: typeof raw.completedAt === 'string' ? raw.completedAt : null,
    status: raw.status,
    config: normalizeSessionConfig(raw.config),
    answerHistory: normalizeAnswerHistory(raw.answerHistory),
    resultsSummary: normalizeResultsSummary(raw.resultsSummary)
  };
};

export const createLocalSessionRepository = (
  storageKeys: SessionStorageKeys
): SessionRepository => {
  const defaultPayload = createDefaultPayload();
  let memoryPayload: SessionStoragePayload = defaultPayload;

  const readRawValue = (): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const currentValue = window.localStorage.getItem(storageKeys.storageKey);

      if (currentValue !== null) {
        return currentValue;
      }

      for (const legacyKey of storageKeys.legacyStorageKeys) {
        const legacyValue = window.localStorage.getItem(legacyKey);

        if (legacyValue !== null) {
          window.localStorage.setItem(storageKeys.storageKey, legacyValue);
          return legacyValue;
        }
      }

      return null;
    } catch {
      return null;
    }
  };

  const writeRawValue = (payload: SessionStoragePayload) => {
    memoryPayload = payload;

    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(storageKeys.storageKey, JSON.stringify(payload));
    } catch {
      // Keep the in-memory fallback usable when storage writes fail.
    }
  };

  const normalizePayload = (value: unknown): SessionStoragePayload => {
    if (!value || typeof value !== 'object') {
      return memoryPayload;
    }

    const raw = value as Partial<SessionStoragePayload>;
    const sessions = Array.isArray(raw.sessions)
      ? raw.sessions
          .map(normalizeStudySession)
          .filter((session): session is StudySession => session !== null)
          .sort((left, right) => right.startedAt.localeCompare(left.startedAt))
      : memoryPayload.sessions;

    const activeSessionId =
      typeof raw.activeSessionId === 'string' || raw.activeSessionId === null
        ? raw.activeSessionId
        : memoryPayload.activeSessionId;

    return {
      version: 1,
      sessions,
      activeSessionId,
      updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString()
    };
  };

  const readPayload = (): SessionStoragePayload => {
    const rawValue = readRawValue();

    if (!rawValue) {
      return memoryPayload;
    }

    try {
      const parsed = JSON.parse(rawValue);
      const payload = normalizePayload(parsed);
      memoryPayload = payload;
      return payload;
    } catch {
      return memoryPayload;
    }
  };

  const writePayload = (payload: SessionStoragePayload) => {
    writeRawValue({
      ...payload,
      sessions: [...payload.sessions].sort((left, right) => right.startedAt.localeCompare(left.startedAt)),
      updatedAt: new Date().toISOString()
    });
  };

  return {
    list() {
      return readPayload().sessions;
    },

    get(id) {
      return readPayload().sessions.find((session) => session.id === id) ?? null;
    },

    getActive() {
      const payload = readPayload();

      if (!payload.activeSessionId) {
        return null;
      }

      return payload.sessions.find((session) => session.id === payload.activeSessionId) ?? null;
    },

    save(session, options) {
      const normalizedSession = normalizeStudySession(session);

      if (!normalizedSession) {
        return readPayload().sessions;
      }

      const payload = readPayload();
      const sessions = payload.sessions.filter((entry) => entry.id !== normalizedSession.id);
      sessions.unshift(normalizedSession);

      writePayload({
        ...payload,
        sessions,
        activeSessionId: options?.active ? normalizedSession.id : payload.activeSessionId
      });

      return readPayload().sessions;
    },

    setActive(sessionId) {
      const payload = readPayload();
      const nextActiveId =
        sessionId && payload.sessions.some((session) => session.id === sessionId)
          ? sessionId
          : null;

      writePayload({
        ...payload,
        activeSessionId: nextActiveId
      });
    },

    clear() {
      memoryPayload = createDefaultPayload();

      if (typeof window === 'undefined') {
        return;
      }

      try {
        window.localStorage.removeItem(storageKeys.storageKey);

        storageKeys.legacyStorageKeys.forEach((legacyKey) => {
          window.localStorage.removeItem(legacyKey);
        });
      } catch {
        // Ignore storage clear failures and keep the memory payload reset.
      }
    }
  };
};

export const localSessionRepository = createLocalSessionRepository(
  getSessionStorageKeys('study')
);
