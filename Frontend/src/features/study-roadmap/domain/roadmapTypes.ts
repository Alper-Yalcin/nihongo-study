import { KanaScript } from '../../kana/domain/kanaItem';

export type StudyTrackId = 'hiragana' | 'katakana' | 'kanji';
export type LessonStepId = 'introduction' | 'recognition' | 'reading' | 'practice' | 'mini-test';
export type LessonStatus = 'locked' | 'available' | 'completed';
export type StudyMasteryState = 'unseen' | 'learning' | 'familiar' | 'mastered';
export type LessonUnlockBlockerType = 'needs-pass' | 'needs-mastery' | 'needs-prerequisite';

export interface StudyLessonDefinition {
  id: string;
  title: string;
  description: string;
  groupIds: string[];
  stepOrder: LessonStepId[];
  minPassScore?: number;
  minMasteryRequired?: number;
  isCheckpoint?: boolean;
  prerequisiteLessonIds?: string[];
}

export interface StudyLevelDefinition {
  id: string;
  title: string;
  description: string;
  lessons: StudyLessonDefinition[];
}

export interface StudyTrackDefinition {
  id: StudyTrackId;
  title: string;
  subtitle: string;
  script: KanaScript | null;
  phaseLabel: string;
  levels: StudyLevelDefinition[];
}

export interface StudyLessonRecord {
  lessonId: string;
  attempts: number;
  bestScore: number;
  lastScore: number;
  bestMasteryScore: number;
  lastMasteryScore: number;
  passedAt: string | null;
  masteredAt: string | null;
  lastAttemptAt: string | null;
  weakKanaIds: string[];
}

export interface StudyScriptRoadmapProgress {
  unlockedLessonIds: string[];
  completedLessonIds: string[];
  lessonRecords: Record<string, StudyLessonRecord>;
}

export interface StudyRoadmapProgressState {
  version: 2;
  scripts: Record<KanaScript, StudyScriptRoadmapProgress>;
}

export interface StudyLessonCompletionPayload {
  lessonId: string;
  score: number;
  passed: boolean;
  masteryScore: number;
  weakKanaIds: string[];
}

export interface LessonUnlockBlocker {
  type: LessonUnlockBlockerType;
  sourceLessonId: string;
  requiredScore?: number;
  currentScore?: number;
  requiredMastery?: number;
  currentMastery?: number;
}

export interface StudyMasterySummary {
  unseen: number;
  learning: number;
  familiar: number;
  mastered: number;
}
