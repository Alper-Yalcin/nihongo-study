import { KanaScript } from './kanaItem';

export type StudySessionType =
  | 'learn'
  | 'review'
  | 'test'
  | 'speed'
  | 'weak_drill'
  | 'confusable_drill';

export type StudySessionMode = 'typing' | 'drawing' | 'listening' | 'mixed';
export type StudySessionStatus = 'active' | 'completed' | 'abandoned';
export type StudySessionConfigValue = string | number | boolean | null | string[];

export interface StudySessionAnswerRecord {
  itemId: string;
  mode: StudySessionMode;
  correct: boolean;
  answeredAt: string;
  latencyMs: number;
  hintsUsed: number;
  retries: number;
  responseItemId?: string | null;
  variant?: string | null;
}

export interface StudySessionSummary {
  total: number;
  correct: number;
  wrong: number;
  accuracy: number;
}

export interface StudySession {
  id: string;
  type: StudySessionType;
  script: KanaScript;
  mode: StudySessionMode;
  itemIds: string[];
  currentIndex: number;
  startedAt: string;
  completedAt: string | null;
  status: StudySessionStatus;
  config: Record<string, StudySessionConfigValue>;
  resultsSummary: StudySessionSummary;
  answerHistory: StudySessionAnswerRecord[];
}
