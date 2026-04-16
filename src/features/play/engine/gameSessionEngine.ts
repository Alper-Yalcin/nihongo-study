import {
  CompletedGameRun,
  GameDefinition,
  GameSession,
  PendingAnswerLog,
  PlayContentType,
  PlayDifficultyLevel
} from '../domain/playTypes';

const difficultyQuestionCountMap: Record<PlayDifficultyLevel, number> = {
  easy: 10,
  normal: 14,
  hard: 18
};

const difficultyTimeMultiplierMap: Record<PlayDifficultyLevel, number> = {
  easy: 1.15,
  normal: 1,
  hard: 0.85
};

const clampToSingleDecimal = (value: number) => Math.round(value * 10) / 10;

const createSessionId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `play-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

interface ScoreDeltaInput {
  isCorrect: boolean;
  combo: number;
  responseTimeMs: number;
  definition: GameDefinition;
}

export const calculateScoreDelta = ({
  isCorrect,
  combo,
  responseTimeMs,
  definition
}: ScoreDeltaInput) => {
  const rules = definition.scoringRules;

  if (!isCorrect) {
    return -rules.wrongPenalty;
  }

  const comboMultiplier = Math.min(1 + combo * rules.comboStep, rules.maxComboMultiplier);
  const fastBonus = responseTimeMs <= rules.fastAnswerBonusMs ? rules.fastAnswerBonus : 0;
  return Math.round(rules.baseCorrectPoints * comboMultiplier + fastBonus);
};

interface FinalizeGameRunInput {
  userId: string;
  gameId: GameDefinition['id'];
  startedAt: string;
  endedAt: string;
  score: number;
  comboMax: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  contentSetUsed: PlayContentType;
  difficulty: PlayDifficultyLevel;
  answerLog: PendingAnswerLog[];
}

export const calculateXpFromSession = (session: GameSession) => {
  const scoreFactor = session.score * 0.08;
  const accuracyFactor = session.accuracy * 0.7;
  const comboFactor = session.comboMax * 2;
  const completionBonus = session.correctAnswers === session.totalQuestions ? 12 : 0;

  return Math.max(5, Math.round(scoreFactor + accuracyFactor + comboFactor + completionBonus));
};

export const finalizeGameRun = ({
  userId,
  gameId,
  startedAt,
  endedAt,
  score,
  comboMax,
  totalQuestions,
  correctAnswers,
  wrongAnswers,
  contentSetUsed,
  difficulty,
  answerLog
}: FinalizeGameRunInput): CompletedGameRun => {
  const sessionId = createSessionId();
  const accuracy =
    totalQuestions > 0
      ? clampToSingleDecimal((correctAnswers / totalQuestions) * 100)
      : 0;

  const session: GameSession = {
    id: sessionId,
    userId,
    gameId,
    startedAt,
    endedAt,
    score: Math.max(0, Math.round(score)),
    accuracy,
    comboMax,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    contentSetUsed,
    difficulty
  };

  const completedRun: CompletedGameRun = {
    session,
    answerLog: answerLog.map((answer) => ({
      ...answer,
      sessionId
    })),
    xpEarned: calculateXpFromSession(session)
  };

  return completedRun;
};

export const getQuestionCountByDifficulty = (difficulty: PlayDifficultyLevel) =>
  difficultyQuestionCountMap[difficulty];

export const getTimeLimitByDifficulty = (
  baseSeconds: number,
  difficulty: PlayDifficultyLevel
) => Math.round(baseSeconds * difficultyTimeMultiplierMap[difficulty]);
