import { RunStats, TypingMode } from '../types';

const ROMAJI_ALIASES: Record<string, string[]> = {
  n: ['nn', "n'"],
  wo: ['o'],
  shi: ['si'],
  chi: ['ti'],
  tsu: ['tu'],
  fu: ['hu'],
  ji: ['zi', 'dji'],
  zu: ['du', 'dzu'],
  sha: ['sya'],
  shu: ['syu'],
  sho: ['syo'],
  cha: ['tya', 'cya'],
  chu: ['tyu', 'cyu'],
  cho: ['tyo', 'cyo'],
  ja: ['zya', 'jya'],
  ju: ['zyu', 'jyu'],
  jo: ['zyo', 'jyo']
};

export const getAcceptedRomajiAnswers = (expected: string) => {
  const normalizedExpected = normalizeRomajiInput(expected);
  return [normalizedExpected, ...(ROMAJI_ALIASES[normalizedExpected] ?? [])];
};

export const TIMED_MODE_DURATION_SECONDS = 60;

export const normalizeKanaInput = (value: string) =>
  value.trim().normalize('NFKC').replace(/\s+/g, '');

export const normalizeRomajiInput = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, '');

export const isAcceptedRomajiAnswer = (value: string, expected: string) => {
  const normalizedInput = normalizeRomajiInput(value);
  const normalizedExpected = normalizeRomajiInput(expected);

  if (!normalizedInput) {
    return false;
  }

  if (normalizedInput === normalizedExpected) {
    return true;
  }

  const aliases = getAcceptedRomajiAnswers(normalizedExpected);
  return aliases.includes(normalizedInput);
};

export const isAcceptedKanaAnswer = (value: string, expected: string) =>
  normalizeKanaInput(value) === normalizeKanaInput(expected);

export const calculateAccuracy = (correct: number, attempts: number) =>
  attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

export const calculateSpeed = (correct: number, timeSeconds: number) => {
  if (correct === 0) {
    return 0;
  }

  const safeSeconds = Math.max(timeSeconds, 1);
  return Math.round((correct / safeSeconds) * 60);
};

export const isBetterTypingRun = (candidate: RunStats, incumbent: RunStats) => {
  const candidateMode = candidate.mode ?? 'current';
  const incumbentMode = incumbent.mode ?? 'current';

  if (candidateMode === 'timed' && incumbentMode === 'timed') {
    const candidateSpeed = candidate.speed ?? 0;
    const incumbentSpeed = incumbent.speed ?? 0;

    if (candidateSpeed !== incumbentSpeed) {
      return candidateSpeed > incumbentSpeed;
    }

    if (candidate.accuracy !== incumbent.accuracy) {
      return candidate.accuracy > incumbent.accuracy;
    }

    if (candidate.correct !== incumbent.correct) {
      return candidate.correct > incumbent.correct;
    }

    return candidate.timeSeconds < incumbent.timeSeconds;
  }

  if (candidate.timeSeconds !== incumbent.timeSeconds) {
    return candidate.timeSeconds < incumbent.timeSeconds;
  }

  if (candidate.accuracy !== incumbent.accuracy) {
    return candidate.accuracy > incumbent.accuracy;
  }

  return (candidate.speed ?? 0) > (incumbent.speed ?? 0);
};

export const getTypingModeStorageKey = (sectionId: string, mode: TypingMode) =>
  `best-score-${sectionId}-${mode}`;
