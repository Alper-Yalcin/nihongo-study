import { getKanaItemById } from '../data/kanaInventory';
import { KanaProgress } from '../domain/kanaProgress';
import { StudySessionAnswerRecord } from '../domain/studySession';

const clampScore = (value: number) => Math.max(0, Math.min(4, Math.round(value)));

const shiftScore = (score: number, correct: boolean, positiveDelta = 1, negativeDelta = 1) =>
  clampScore(score + (correct ? positiveDelta : -negativeDelta));

const addHours = (isoDate: string, hours: number) => {
  const date = new Date(isoDate);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
};

const addDays = (isoDate: string, days: number) => {
  const date = new Date(isoDate);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const deriveMasteryScore = (entry: KanaProgress) => {
  const primaryScores = [entry.typingScore, entry.drawingScore, entry.listeningScore].filter(
    (score) => score > 0
  );
  const primaryAverage =
    primaryScores.length > 0
      ? primaryScores.reduce((total, score) => total + score, 0) / primaryScores.length
      : 0;
  const recognitionBonus = entry.recognitionScore > 0 ? entry.recognitionScore * 0.25 : 0;

  return clampScore(primaryAverage + recognitionBonus);
};

const deriveState = (entry: KanaProgress): KanaProgress['state'] => {
  if (entry.timesSeen === 0) {
    return 'new';
  }

  if (entry.lastWrongAt && entry.lastSeenAt === entry.lastWrongAt) {
    return 'weak';
  }

  if (
    entry.masteryScore >= 4 &&
    entry.timesCorrect >= 8 &&
    [entry.typingScore, entry.drawingScore, entry.listeningScore].filter((score) => score >= 3).length >= 2
  ) {
    return 'mastered';
  }

  if (entry.masteryScore >= 2 && entry.timesCorrect >= 3) {
    return 'known';
  }

  return 'learning';
};

const deriveNextReviewAt = (
  entry: KanaProgress,
  correct: boolean,
  answeredAt: string
) => {
  if (!correct || entry.state === 'weak') {
    return answeredAt;
  }

  if (entry.state === 'learning') {
    return addHours(answeredAt, 12);
  }

  if (entry.state === 'known') {
    return addDays(answeredAt, 3);
  }

  if (entry.state === 'mastered') {
    return addDays(answeredAt, 7);
  }

  return addHours(answeredAt, 6);
};

export const applySessionAnswerToProgress = (
  progressEntry: KanaProgress,
  answer: StudySessionAnswerRecord
): KanaProgress => {
  const now = answer.answeredAt;
  const responseItemId = answer.responseItemId ?? null;
  const scopedResponseItem = responseItemId ? getKanaItemById(responseItemId) : null;

  const nextEntry: KanaProgress = {
    ...progressEntry,
    recognitionScore:
      answer.mode === 'typing' || answer.mode === 'listening'
        ? shiftScore(progressEntry.recognitionScore, answer.correct)
        : progressEntry.recognitionScore,
    typingScore:
      answer.mode === 'typing'
        ? shiftScore(progressEntry.typingScore, answer.correct)
        : progressEntry.typingScore,
    drawingScore:
      answer.mode === 'drawing'
        ? shiftScore(progressEntry.drawingScore, answer.correct)
        : progressEntry.drawingScore,
    listeningScore:
      answer.mode === 'listening'
        ? shiftScore(progressEntry.listeningScore, answer.correct)
        : progressEntry.listeningScore,
    timesSeen: progressEntry.timesSeen + 1,
    timesCorrect: progressEntry.timesCorrect + (answer.correct ? 1 : 0),
    timesWrong: progressEntry.timesWrong + (answer.correct ? 0 : 1),
    lastSeenAt: now,
    lastCorrectAt: answer.correct ? now : progressEntry.lastCorrectAt,
    lastWrongAt: answer.correct ? progressEntry.lastWrongAt : now,
    confusedWith:
      !answer.correct &&
      scopedResponseItem &&
      scopedResponseItem.script === progressEntry.script &&
      scopedResponseItem.id !== progressEntry.kanaId
        ? Array.from(new Set([scopedResponseItem.id, ...progressEntry.confusedWith])).slice(0, 6)
        : progressEntry.confusedWith,
    updatedAt: now
  };

  nextEntry.masteryScore = deriveMasteryScore(nextEntry);
  nextEntry.state = deriveState(nextEntry);
  nextEntry.nextReviewAt = deriveNextReviewAt(nextEntry, answer.correct, now);

  return nextEntry;
};
