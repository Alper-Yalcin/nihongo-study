import { ListeningItem, RunStats, ListeningMode } from '../types';
import { calculateAccuracy, calculateSpeed, getAcceptedRomajiAnswers, normalizeRomajiInput } from './typing';

export const shuffleArray = <T,>(items: T[]) => {
  const cloned = [...items];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[swapIndex]] = [cloned[swapIndex], cloned[index]];
  }

  return cloned;
};

export const getAcceptedListeningAnswers = (item: ListeningItem) => {
  if (item.acceptedRomaji && item.acceptedRomaji.length > 0) {
    return item.acceptedRomaji.map(normalizeRomajiInput);
  }

  return getAcceptedRomajiAnswers(item.romaji);
};

export const getAcceptedListeningCharacterIds = (item: ListeningItem) => {
  if (item.acceptedCharacterIds && item.acceptedCharacterIds.length > 0) {
    return Array.from(new Set(item.acceptedCharacterIds));
  }

  return [item.id];
};

export const isCorrectListeningRecognitionAnswer = (item: ListeningItem, selectedId: string) =>
  getAcceptedListeningCharacterIds(item).includes(selectedId);

export const isCorrectListeningTypingAnswer = (item: ListeningItem, value: string) => {
  const normalizedInput = normalizeRomajiInput(value);

  if (!normalizedInput) {
    return false;
  }

  return getAcceptedListeningAnswers(item).includes(normalizedInput);
};

export const buildRecognitionOptions = (
  currentItem: ListeningItem,
  sourceItems: ListeningItem[],
  optionCount = 4
) => {
  const acceptedIds = new Set(getAcceptedListeningCharacterIds(currentItem));
  const distractors = shuffleArray(
    sourceItems.filter((item) => !acceptedIds.has(item.id) && item.kana !== currentItem.kana)
  ).slice(0, Math.max(optionCount - 1, 0));

  return shuffleArray([currentItem, ...distractors]);
};

interface ListeningResultInput {
  attempts: number;
  correct: number;
  wrong: number;
  completed: number;
  timeSeconds: number;
  mode: ListeningMode;
  modeLabel: string;
  bestStreak: number;
  totalResponseMs: number;
  averageScore?: number;
}

export const buildListeningRunStats = ({
  attempts,
  correct,
  wrong,
  completed,
  timeSeconds,
  mode,
  modeLabel,
  bestStreak,
  totalResponseMs,
  averageScore
}: ListeningResultInput): RunStats => ({
  completed,
  totalAttempts: attempts,
  correct,
  wrong,
  accuracy: calculateAccuracy(correct, attempts),
  timeSeconds,
  mode,
  modeLabel,
  speed: calculateSpeed(correct, timeSeconds),
  bestStreak,
  averageAnswerMs: attempts > 0 ? Math.round(totalResponseMs / attempts) : 0,
  averageScore
});

export const isBetterListeningRun = (candidate: RunStats, incumbent: RunStats) => {
  if (candidate.accuracy !== incumbent.accuracy) {
    return candidate.accuracy > incumbent.accuracy;
  }

  if ((candidate.bestStreak ?? 0) !== (incumbent.bestStreak ?? 0)) {
    return (candidate.bestStreak ?? 0) > (incumbent.bestStreak ?? 0);
  }

  if ((candidate.averageScore ?? 0) !== (incumbent.averageScore ?? 0)) {
    return (candidate.averageScore ?? 0) > (incumbent.averageScore ?? 0);
  }

  return candidate.timeSeconds < incumbent.timeSeconds;
};
