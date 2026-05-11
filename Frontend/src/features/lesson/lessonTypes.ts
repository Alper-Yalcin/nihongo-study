import type { AppLanguage } from '../../data/appPreferences';

// ── Exercise Types ─────────────────────────────────────────────────────────

export type ExerciseType =
  | 'teach_card'
  | 'instant_recognition'
  | 'audio_reinforcement'
  | 'kana_recognition'
  | 'audio_to_kana'
  | 'audio_to_meaning'
  | 'visual_context'
  | 'guided_response'
  | 'token_build'
  | 'listening_build'
  | 'fill_blank'
  | 'conversation_chain'
  | 'listening_conversation'
  | 'fast_recall'
  | 'npc_reaction';

export type ExerciseDifficulty = 'easy' | 'medium' | 'hard';

export type SkillTag =
  | 'listening'
  | 'kana'
  | 'recognition'
  | 'conversation'
  | 'particle'
  | 'grammar'
  | 'recall'
  | 'production'
  | 'sentence_order';

// ── Progress Gain Map ──────────────────────────────────────────────────────

export const PROGRESS_GAIN_BY_TYPE: Record<ExerciseType, number> = {
  teach_card: 3,
  instant_recognition: 5,
  audio_reinforcement: 0,
  kana_recognition: 5,
  audio_to_kana: 7,
  audio_to_meaning: 7,
  visual_context: 0,
  guided_response: 5,
  token_build: 10,
  listening_build: 10,
  fill_blank: 8,
  conversation_chain: 12,
  listening_conversation: 10,
  fast_recall: 6,
  npc_reaction: 0,
};

// Wrong = gain * 0.30, Retry correct = gain * 0.60
export const WRONG_GAIN_MULTIPLIER = 0.3;
export const RETRY_GAIN_MULTIPLIER = 0.6;

// ── Base Exercise ──────────────────────────────────────────────────────────

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  difficulty: ExerciseDifficulty;
  skillTags: SkillTag[];
  progressGain: number;
  explanation?: string;
  smartFeedback?: string;
}

// ── Exercise Variants ──────────────────────────────────────────────────────

export interface MCOption {
  label: string;
  correct: boolean;
}

export interface TeachCardExercise extends BaseExercise {
  type: 'teach_card';
  japanese: string;
  romaji: string;
  meaning: string;
  audioText: string;
  exampleJapanese?: string;
  exampleMeaning?: string;
  usageNote?: string;
}

export interface InstantRecognitionExercise extends BaseExercise {
  type: 'instant_recognition';
  japanese: string;
  romaji: string;
  options: MCOption[];
}

export interface AudioReinforcementExercise extends BaseExercise {
  type: 'audio_reinforcement';
  japanese: string;
  romaji: string;
  meaning: string;
  audioText: string;
  contextQuestion?: {
    prompt: string;
    options: MCOption[];
  };
}

export interface KanaRecognitionExercise extends BaseExercise {
  type: 'kana_recognition';
  japanese: string;
  options: MCOption[];
}

export interface AudioToKanaExercise extends BaseExercise {
  type: 'audio_to_kana';
  audioText: string;
  options: Array<{ japanese: string; correct: boolean }>;
}

export interface AudioToMeaningExercise extends BaseExercise {
  type: 'audio_to_meaning';
  audioText: string;
  japanese: string;
  options: MCOption[];
}

export interface VisualContextExercise extends BaseExercise {
  type: 'visual_context';
  scene: string;
  npcJapanese: string;
  npcMeaning: string;
  contextQuestion?: {
    prompt: string;
    options: MCOption[];
  };
}

export interface GuidedResponseExercise extends BaseExercise {
  type: 'guided_response';
  npcJapanese: string;
  npcMeaning: string;
  audioText: string;
  options: Array<{ japanese: string; correct: boolean }>;
}

export interface TokenBuildExercise extends BaseExercise {
  type: 'token_build';
  prompt: string;
  audioText?: string;
  answerTokens: string[];
  bankTokens: string[];
}

export interface ListeningBuildExercise extends BaseExercise {
  type: 'listening_build';
  audioText: string;
  prompt: string;
  answerTokens: string[];
  bankTokens: string[];
}

export interface FillBlankExercise extends BaseExercise {
  type: 'fill_blank';
  sentenceBefore: string;
  sentenceAfter: string;
  blankType: 'particle' | 'word' | 'verb';
  options: MCOption[];
}

export interface ConversationTurn {
  speaker: 'npc' | 'user';
  npcJapanese?: string;
  npcMeaning?: string;
  audioText?: string;
  userOptions?: Array<{ japanese: string; correct: boolean }>;
  memoryKey?: string;
}

export interface ConversationChainExercise extends BaseExercise {
  type: 'conversation_chain';
  turns: ConversationTurn[];
}

export interface ListeningConversationExercise extends BaseExercise {
  type: 'listening_conversation';
  audioText: string;
  hiddenJapanese: string;
  hiddenMeaning: string;
  options: Array<{ japanese: string; correct: boolean }>;
}

export interface FastRecallExercise extends BaseExercise {
  type: 'fast_recall';
  prompt: string;
  answerJapanese: string;
  timerMs: number;
  options: Array<{ japanese: string; correct: boolean }>;
}

export interface NpcReactionExercise extends BaseExercise {
  type: 'npc_reaction';
  message: string;
}

export type LessonExercise =
  | TeachCardExercise
  | InstantRecognitionExercise
  | AudioReinforcementExercise
  | KanaRecognitionExercise
  | AudioToKanaExercise
  | AudioToMeaningExercise
  | VisualContextExercise
  | GuidedResponseExercise
  | TokenBuildExercise
  | ListeningBuildExercise
  | FillBlankExercise
  | ConversationChainExercise
  | ListeningConversationExercise
  | FastRecallExercise
  | NpcReactionExercise;

// ── Adaptive / Confidence ──────────────────────────────────────────────────

export interface ExerciseAdaptiveData {
  exerciseId: string;
  lastSeen: number;
  correctCount: number;
  wrongCount: number;
  easeFactor: number;
  masteryLevel: 0 | 1 | 2 | 3;
}

export interface ConfidenceScores {
  listening: number;
  kana: number;
  particles: number;
  production: number;
}

// ── Conversation Memory ─────────────────────────────────────────────────────

export type ConversationMemory = Record<string, string>;

// ── Lesson / Unit ──────────────────────────────────────────────────────────

export interface LessonResult {
  lessonId: string;
  totalExercises: number;
  correctFirstTry: number;
  confidenceScores: ConfidenceScores;
  skillBreakdown: Partial<Record<SkillTag, { correct: number; total: number }>>;
  xpEarned: number;
  completedAt: number;
}

export interface LearnedWord {
  japanese: string;
  romaji: string;
  meaning: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: Record<AppLanguage, string>;
  estimatedMinutes: number;
  learnedWords: LearnedWord[];
  exercises: LessonExercise[];
}

export interface LessonUnit {
  id: string;
  theme: Record<AppLanguage, string>;
  description: Record<AppLanguage, string>;
  wordCount: number;
  grammarCount: number;
  isCheckpoint: boolean;
  lessons: Lesson[];
}

// ── Lesson Phase ───────────────────────────────────────────────────────────

export type LessonPhase =
  | 'easy'
  | 'listening'
  | 'guided'
  | 'production'
  | 'conversation'
  | 'recall'
  | 'review';
