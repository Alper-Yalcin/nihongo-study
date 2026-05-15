import {
  StudySession,
  StudySessionAnswerRecord,
  StudySessionConfigValue,
  StudySessionMode,
  StudySessionStatus,
  StudySessionSummary,
  StudySessionType
} from '../domain/studySession';
import { KanaScript } from '../domain/kanaItem';

interface CreateStudySessionInput {
  script: KanaScript;
  type: StudySessionType;
  mode: StudySessionMode;
  itemIds: string[];
  currentIndex?: number;
  config?: Record<string, StudySessionConfigValue>;
  startedAt?: string;
}

interface UpdateStudySessionInput {
  itemIds?: string[];
  currentIndex?: number;
  config?: Record<string, StudySessionConfigValue>;
  status?: StudySessionStatus;
  completedAt?: string | null;
}

const clampAccuracy = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const generateSessionId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `kana-session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const buildStudySessionSummary = (
  answerHistory: StudySessionAnswerRecord[]
): StudySessionSummary => {
  const total = answerHistory.length;
  const correct = answerHistory.filter((entry) => entry.correct).length;
  const wrong = total - correct;

  return {
    total,
    correct,
    wrong,
    accuracy: total > 0 ? clampAccuracy((correct / total) * 100) : 0
  };
};

export const createStudySession = ({
  script,
  type,
  mode,
  itemIds,
  currentIndex = 0,
  config = {},
  startedAt = new Date().toISOString()
}: CreateStudySessionInput): StudySession => ({
  id: generateSessionId(),
  script,
  type,
  mode,
  itemIds,
  currentIndex,
  startedAt,
  completedAt: null,
  status: 'active',
  config,
  resultsSummary: {
    total: 0,
    correct: 0,
    wrong: 0,
    accuracy: 0
  },
  answerHistory: []
});

export const updateStudySession = (
  session: StudySession,
  input: UpdateStudySessionInput
): StudySession => ({
  ...session,
  itemIds: input.itemIds ?? session.itemIds,
  currentIndex: input.currentIndex ?? session.currentIndex,
  config: input.config ? { ...session.config, ...input.config } : session.config,
  status: input.status ?? session.status,
  completedAt:
    input.completedAt === undefined
      ? session.completedAt
      : input.completedAt
});

export const recordStudySessionAnswer = (
  session: StudySession,
  answer: StudySessionAnswerRecord,
  input: UpdateStudySessionInput = {}
): StudySession => {
  const answerHistory = [...session.answerHistory, answer];

  return {
    ...updateStudySession(session, input),
    answerHistory,
    resultsSummary: buildStudySessionSummary(answerHistory)
  };
};

export const completeStudySession = (
  session: StudySession,
  completedAt = new Date().toISOString()
): StudySession =>
  updateStudySession(session, {
    status: 'completed',
    completedAt
  });

export const abandonStudySession = (
  session: StudySession,
  completedAt = new Date().toISOString()
): StudySession =>
  updateStudySession(session, {
    status: 'abandoned',
    completedAt
  });

export const getSessionConfigString = (session: StudySession | null, key: string) => {
  const value = session?.config[key];
  return typeof value === 'string' ? value : null;
};

export const getSessionConfigNumber = (session: StudySession | null, key: string) => {
  const value = session?.config[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
};

export const getSessionConfigBoolean = (session: StudySession | null, key: string) => {
  const value = session?.config[key];
  return typeof value === 'boolean' ? value : null;
};

export const getSessionConfigStringArray = (session: StudySession | null, key: string) => {
  const value = session?.config[key];

  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === 'string')
    : [];
};

export const isSessionKeyMatch = (session: StudySession | null, sessionKey: string) =>
  getSessionConfigString(session, 'sessionKey') === sessionKey;
