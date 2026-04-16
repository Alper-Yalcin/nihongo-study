import { KanaScript } from '../../kana/domain/kanaItem';

export type PlayContentType = 'hiragana' | 'katakana' | 'basic_words' | 'kanji' | 'mixed';
export type PlayDifficultyLevel = 'easy' | 'normal' | 'hard';
export type PlayGameId = 'kana-match' | 'meaning-match' | 'speed-tap' | 'memory-flip';
export type PlayItemType = 'kana' | 'word' | 'kanji';

export type ChallengeType =
  | 'correct_answers'
  | 'games_completed'
  | 'accuracy_threshold'
  | 'active_days'
  | 'distinct_games';

export type ChallengeRewardType = 'xp' | 'badge' | 'streak' | 'theme' | 'unlock';
export type ChallengeResetPeriod = 'daily' | 'weekly';

export interface GameScoringRules {
  baseCorrectPoints: number;
  comboStep: number;
  maxComboMultiplier: number;
  wrongPenalty: number;
  fastAnswerBonusMs: number;
  fastAnswerBonus: number;
}

export interface GameDefinition {
  id: PlayGameId;
  title: string;
  description: string;
  contentType: PlayContentType[];
  difficultyLevels: PlayDifficultyLevel[];
  scoringRules: GameScoringRules;
  timeLimit: number;
  enabled: boolean;
}

export interface GameSession {
  id: string;
  userId: string;
  gameId: PlayGameId;
  startedAt: string;
  endedAt: string;
  score: number;
  accuracy: number;
  comboMax: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  contentSetUsed: PlayContentType;
  difficulty: PlayDifficultyLevel;
}

export interface GameAnswerLog {
  sessionId: string;
  questionId: string;
  itemType: PlayItemType;
  shownItem: string;
  userAnswer: string;
  isCorrect: boolean;
  responseTimeMs: number;
}

export interface Challenge {
  id: string;
  title: string;
  type: ChallengeType;
  goalValue: number;
  rewardType: ChallengeRewardType;
  rewardValue: number;
  resetPeriod: ChallengeResetPeriod;
}

export interface UserChallengeProgress {
  userId: string;
  challengeId: string;
  progress: number;
  completed: boolean;
  completedAt: string | null;
  periodKey: string;
}

export interface UserChallengeClaim {
  userId: string;
  challengeId: string;
  periodKey: string;
  resetPeriod: ChallengeResetPeriod;
  rewardType: ChallengeRewardType;
  rewardValue: number;
  claimedAt: string;
}

export interface PlayRewardUnlockRegistry {
  userId: string;
  unlockedThemeIds: string[];
  unlockedFeatureIds: string[];
  badges: number;
  streakBonusDays: number;
  updatedAt: string;
}

interface PlayQuestionBase {
  id: string;
  kind: 'kana-match' | 'meaning-match';
  itemType: PlayItemType;
  shownItem: string;
  correctAnswer: string;
  options: string[];
  contentType: PlayContentType;
}

export interface KanaMatchQuestion extends PlayQuestionBase {
  kind: 'kana-match';
  itemType: 'kana';
  kanaId: string;
  script: KanaScript;
}

export interface MeaningMatchQuestion extends PlayQuestionBase {
  kind: 'meaning-match';
  itemType: 'word';
  wordId: string;
  reading: string;
}

export type PlayQuestion = KanaMatchQuestion | MeaningMatchQuestion;

export interface CompletedGameRun {
  session: GameSession;
  answerLog: GameAnswerLog[];
  xpEarned: number;
}

export type PendingAnswerLog = Omit<GameAnswerLog, 'sessionId'>;
