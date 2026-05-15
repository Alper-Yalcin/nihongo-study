import { JLearnStep } from '../../../learn/data/jlearn/jlearnTypes';
import {
  ConfidenceLevel,
  FormalityPreference,
  JLearnUserState,
  RelationshipStage,
  defaultUserState,
} from '../debug/debugStore';

export interface AdaptiveBranchPick {
  label: string;
  result: 'wrong' | 'partial' | 'correct';
}

export interface AdaptiveTaskSummary {
  total: number;
  correctFirstTry: number;
  totalRetries: number;
  retriesByQuestion: Record<string, number>;
}

interface AdaptiveMissionUpdate {
  step: JLearnStep;
  taskSummary?: AdaptiveTaskSummary | null;
  branchPicks?: AdaptiveBranchPick[];
  completedAt?: string;
}

const MAX_RECENT_MISTAKES = 10;
const POLITE_HINTS = [
  'ございます',
  'です',
  'ます',
  'ください',
  'ません',
  'でした',
  'おねがいします',
  'はじめまして',
  'さようなら',
  'すみません',
  'おじゃまします',
];
const CASUAL_HINTS = [
  'じゃあね',
  'またね',
  'ありがとう',
  'ごめん',
  'よろしくね',
  'たのしみにしてる',
  'おやすみ',
];
const CHARACTER_ALIASES: Array<[string, string]> = [
  ['mrs. tanaka', 'mrs-tanaka'],
  ['mrs tanaka', 'mrs-tanaka'],
  ['mr. tanaka', 'mr-tanaka'],
  ['mr tanaka', 'mr-tanaka'],
  ['tanaka-sensei', 'tanaka-sensei'],
  ['yamada-sensei', 'yamada-sensei'],
  ['yuki', 'yuki'],
  ['keita', 'keita'],
  ['sora', 'sora'],
  ['obaasan', 'obaasan'],
];

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function shiftConfidence(level: ConfidenceLevel, delta: -1 | 0 | 1): ConfidenceLevel {
  const sequence: ConfidenceLevel[] = ['low', 'medium', 'high'];
  const idx = sequence.indexOf(level);
  return sequence[Math.min(sequence.length - 1, Math.max(0, idx + delta))];
}

function deriveFormalityPreference(score: number): FormalityPreference {
  if (score <= -2) return 'casual';
  if (score >= 2) return 'polite';
  return 'neutral';
}

function inferFormalitySignal(label: string): -1 | 0 | 1 {
  const text = normalizeText(label);
  const hasPoliteHint = POLITE_HINTS.some((hint) => text.includes(hint));
  const hasCasualHint =
    CASUAL_HINTS.some((hint) => text.includes(hint)) ||
    (!!text.match(/おはよう(?!ございます)/) || !!text.match(/うん[！!]?$/));

  if (hasPoliteHint === hasCasualHint) return 0;
  return hasPoliteHint ? 1 : -1;
}

function appendRecentMistakes(current: string[], additions: string[]): string[] {
  const next = [...current];

  for (const itemId of additions) {
    const existingIndex = next.indexOf(itemId);
    if (existingIndex >= 0) next.splice(existingIndex, 1);
    next.push(itemId);
  }

  return next.slice(-MAX_RECENT_MISTAKES);
}

function collectMistakeIds(step: JLearnStep, taskSummary?: AdaptiveTaskSummary | null): string[] {
  if (!taskSummary) return [];

  const ids = step.questions.flatMap((question) => {
    if ((taskSummary.retriesByQuestion[question.id] ?? 0) === 0) return [];
    return [question.targetVocabId, question.targetGrammarId].filter(
      (value): value is string => Boolean(value)
    );
  });

  return Array.from(new Set(ids));
}

function extractCharactersFromStep(step: JLearnStep): string[] {
  const characterIds = new Set<string>();

  for (const chain of step.dialogueChains ?? []) {
    for (const turn of chain.turns) {
      const normalizedSpeaker = normalizeText(turn.speaker);
      for (const [alias, characterId] of CHARACTER_ALIASES) {
        if (normalizedSpeaker === alias) {
          characterIds.add(characterId);
        }
      }
    }
  }

  const searchableText = normalizeText([
    step.title,
    step.scenario,
    step.goal,
    step.successMessage,
    step.branchingChoice?.prompt,
    step.branchingChoice?.promptJapanese,
    ...(step.branchingChoice?.options.flatMap((option) => [
      option.label,
      option.reaction,
      option.explanation,
    ]) ?? []),
  ].filter(Boolean).join(' '));

  for (const [alias, characterId] of CHARACTER_ALIASES) {
    if (searchableText.includes(alias)) {
      characterIds.add(characterId);
    }
  }

  return Array.from(characterIds);
}

function applyRelationshipProgress(
  state: JLearnUserState,
  characterIds: string[]
): Pick<JLearnUserState, 'relationshipLevels' | 'relationshipMissionCounts'> {
  const relationshipLevels = { ...defaultUserState.relationshipLevels, ...state.relationshipLevels };
  const relationshipMissionCounts = {
    ...defaultUserState.relationshipMissionCounts,
    ...state.relationshipMissionCounts,
  };

  for (const characterId of characterIds) {
    const nextMissionCount = (relationshipMissionCounts[characterId] ?? 0) + 1;
    relationshipMissionCounts[characterId] = nextMissionCount;

    const derivedStage = Math.min(3, Math.floor(nextMissionCount / 3)) as RelationshipStage;
    relationshipLevels[characterId] = Math.max(relationshipLevels[characterId] ?? 0, derivedStage) as RelationshipStage;
  }

  return { relationshipLevels, relationshipMissionCounts };
}

function dayDiffBetween(previousIso: string, nextIso: string): number {
  const previous = new Date(previousIso);
  const next = new Date(nextIso);
  if (Number.isNaN(previous.getTime()) || Number.isNaN(next.getTime())) return 0;

  const previousDay = Date.UTC(previous.getUTCFullYear(), previous.getUTCMonth(), previous.getUTCDate());
  const nextDay = Date.UTC(next.getUTCFullYear(), next.getUTCMonth(), next.getUTCDate());
  return Math.max(0, Math.round((nextDay - previousDay) / (24 * 60 * 60 * 1000)));
}

function applySessionTiming(
  state: JLearnUserState,
  completedAt: string
): Pick<JLearnUserState, 'missedDays' | 'streakDays' | 'lastSessionAt'> {
  if (!state.lastSessionAt) {
    return {
      missedDays: 0,
      streakDays: Math.max(1, state.streakDays),
      lastSessionAt: completedAt,
    };
  }

  const elapsedDays = dayDiffBetween(state.lastSessionAt, completedAt);
  const streakDays =
    elapsedDays === 0
      ? Math.max(1, state.streakDays)
      : elapsedDays === 1
      ? Math.max(1, state.streakDays) + 1
      : 1;

  return {
    missedDays: elapsedDays,
    streakDays,
    lastSessionAt: completedAt,
  };
}

function pickMissionFormalitySignal(branchPicks: AdaptiveBranchPick[]): -1 | 0 | 1 {
  const preferredPick =
    [...branchPicks].reverse().find((pick) => pick.result !== 'wrong') ??
    branchPicks[branchPicks.length - 1];

  if (!preferredPick) return 0;
  return inferFormalitySignal(preferredPick.label);
}

export function updateUserStateForMission(
  current: JLearnUserState,
  update: AdaptiveMissionUpdate
): JLearnUserState {
  const completedAt = update.completedAt ?? new Date().toISOString();
  const branchPicks = update.branchPicks ?? [];
  const characterIds = extractCharactersFromStep(update.step);
  const mistakeIds = collectMistakeIds(update.step, update.taskSummary);
  const confidenceDelta: -1 | 0 | 1 =
    update.taskSummary && update.taskSummary.total > 0 && update.taskSummary.correctFirstTry === update.taskSummary.total
      ? 1
      : (update.taskSummary?.totalRetries ?? 0) >= 3
      ? -1
      : 0;
  const formalityDriftScore = Math.max(
    -3,
    Math.min(3, current.formalityDriftScore + pickMissionFormalitySignal(branchPicks))
  );

  return {
    ...defaultUserState,
    ...current,
    ...applyRelationshipProgress(current, characterIds),
    ...applySessionTiming(current, completedAt),
    confidenceLevel: shiftConfidence(current.confidenceLevel, confidenceDelta),
    recentMistakes: appendRecentMistakes(current.recentMistakes, mistakeIds),
    formalityDriftScore,
    formalityPreference: deriveFormalityPreference(formalityDriftScore),
  };
}
