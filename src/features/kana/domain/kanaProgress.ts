import { KanaItem, KanaScript } from './kanaItem';

export type KanaProgressState = 'new' | 'learning' | 'weak' | 'known' | 'mastered';

export interface KanaProgress {
  kanaId: string;
  script: KanaScript;
  state: KanaProgressState;
  masteryScore: number;
  recognitionScore: number;
  typingScore: number;
  drawingScore: number;
  listeningScore: number;
  timesSeen: number;
  timesCorrect: number;
  timesWrong: number;
  lastSeenAt: string | null;
  lastCorrectAt: string | null;
  lastWrongAt: string | null;
  nextReviewAt: string | null;
  confusedWith: string[];
  createdAt: string;
  updatedAt: string;
}

export interface KanaProgressSummary {
  script: KanaScript;
  totalCount: number;
  tracked: number;
  newCount: number;
  learningCount: number;
  weakCount: number;
  knownCount: number;
  masteredCount: number;
  dueCount: number;
}

export const createInitialKanaProgress = (
  item: KanaItem,
  createdAt = new Date().toISOString()
): KanaProgress => ({
  kanaId: item.id,
  script: item.script,
  state: 'new',
  masteryScore: 0,
  recognitionScore: 0,
  typingScore: 0,
  drawingScore: 0,
  listeningScore: 0,
  timesSeen: 0,
  timesCorrect: 0,
  timesWrong: 0,
  lastSeenAt: null,
  lastCorrectAt: null,
  lastWrongAt: null,
  nextReviewAt: null,
  confusedWith: [],
  createdAt,
  updatedAt: createdAt
});
