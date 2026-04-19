import {
  BranchingOption,
  GrammarPoint,
  JLearnStep,
  PracticeQuestion,
  VocabItem,
} from '../../../data/jlearn/jlearnTypes';
import { getAllJLearnGrammarPoints, getAllJLearnVocabItems } from '../../../data/jlearn/jlearnContent';
import { RecoveryFlag } from '../debug/debugStore';

export interface FailForwardBranchPickLike {
  result: 'wrong' | 'partial' | 'correct';
  outcomeText: string;
  explanation?: string;
  option: BranchingOption;
}

export interface ResolvedRecoveryTarget {
  targetId: string;
  targetLabel: string;
  targetKind: 'vocab' | 'grammar';
}

interface RecoveryKnowledgeBase {
  vocabById: Map<string, VocabItem>;
  grammarById: Map<string, GrammarPoint>;
  vocabPool: VocabItem[];
  grammarPool: GrammarPoint[];
}

export interface PreparedRecoveryMission {
  injectedQuestions: PracticeQuestion[];
  matchedFlags: RecoveryFlag[];
  remainingFlags: RecoveryFlag[];
}

interface RecoveryCandidate extends ResolvedRecoveryTarget {
  score: number;
}

const CALLBACK_SPEAKER_PRIORITY = [
  'mrs-tanaka',
  'mr-tanaka',
  'tanaka-sensei',
  'yamada-sensei',
  'yuki',
  'keita',
  'sora',
  'obaasan',
] as const;

const CALLBACK_LABELS: Record<(typeof CALLBACK_SPEAKER_PRIORITY)[number], string> = {
  'mrs-tanaka': 'Mrs. Tanaka',
  'mr-tanaka': 'Mr. Tanaka',
  'tanaka-sensei': 'Tanaka-sensei',
  'yamada-sensei': 'Yamada-sensei',
  yuki: 'Yuki',
  keita: 'Keita',
  sora: 'Sora',
  obaasan: 'Obaasan',
};

let recoveryKnowledgeBase: RecoveryKnowledgeBase | null = null;

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[_＿]+/g, '')
    .replace(/[.!?,:;'"“”‘’()[\]{}、。？！・〜～\s]/g, '')
    .trim();
}

function getRecoveryKnowledgeBase(): RecoveryKnowledgeBase {
  if (recoveryKnowledgeBase) return recoveryKnowledgeBase;

  const vocabPool = getAllJLearnVocabItems();
  const grammarPool = getAllJLearnGrammarPoints();
  recoveryKnowledgeBase = {
    vocabById: new Map(vocabPool.map((item) => [item.id, item])),
    grammarById: new Map(grammarPool.map((item) => [item.id, item])),
    vocabPool,
    grammarPool,
  };

  return recoveryKnowledgeBase;
}

function scoreTextMatch(reference: string, candidate: string): number {
  if (!reference || !candidate) return 0;
  if (reference === candidate) return 120;
  if (reference.includes(candidate) || candidate.includes(reference)) return 80;
  return 0;
}

function buildTextsForResolution(step: JLearnStep, pick: FailForwardBranchPickLike): string[] {
  const correctOption = step.branchingChoice?.options.find((option) => option.outcome === 'correct');

  return [
    correctOption?.label,
    pick.explanation,
    pick.outcomeText,
    ...step.examples.flatMap((example) => [example.japanese, example.romaji, example.english]),
  ]
    .filter((value): value is string => Boolean(value))
    .map(normalizeText)
    .filter(Boolean);
}

function scoreVocabCandidate(vocab: VocabItem, texts: string[]): RecoveryCandidate | null {
  const vocabForms = [vocab.japanese, vocab.romaji, vocab.english]
    .filter((value): value is string => Boolean(value))
    .map(normalizeText)
    .filter(Boolean);

  let score = 0;
  for (const text of texts) {
    for (const form of vocabForms) {
      score = Math.max(score, scoreTextMatch(text, form));
    }
  }

  if (score === 0) return null;
  return {
    targetId: vocab.id,
    targetLabel: vocab.japanese,
    targetKind: 'vocab',
    score,
  };
}

function scoreGrammarCandidate(grammar: GrammarPoint, texts: string[]): RecoveryCandidate | null {
  const grammarForms = [grammar.pattern, grammar.structure, grammar.explanation]
    .filter((value): value is string => Boolean(value))
    .map(normalizeText)
    .filter(Boolean);

  let score = 0;
  for (const text of texts) {
    for (const form of grammarForms) {
      score = Math.max(score, scoreTextMatch(text, form));
    }
  }

  if (score === 0) return null;
  return {
    targetId: grammar.id,
    targetLabel: grammar.pattern,
    targetKind: 'grammar',
    score: score - 5,
  };
}

function resolveFromExamples(step: JLearnStep, texts: string[]): ResolvedRecoveryTarget | null {
  for (const example of step.examples) {
    const exampleForms = [example.japanese, example.romaji, example.english]
      .map(normalizeText)
      .filter(Boolean);
    const exampleMatched = texts.some((text) =>
      exampleForms.some((form) => scoreTextMatch(text, form) > 0)
    );

    if (!exampleMatched) continue;

    const vocabId = example.vocabIds[0];
    if (vocabId) {
      const vocab = step.vocabulary.find((item) => item.id === vocabId);
      if (vocab) {
        return {
          targetId: vocab.id,
          targetLabel: vocab.japanese,
          targetKind: 'vocab',
        };
      }
    }

    const grammarId = example.grammarIds[0];
    if (grammarId) {
      const grammar = step.grammar.find((item) => item.id === grammarId);
      if (grammar) {
        return {
          targetId: grammar.id,
          targetLabel: grammar.pattern,
          targetKind: 'grammar',
        };
      }
    }
  }

  return null;
}

export function resolveRecoveryTarget(
  step: JLearnStep,
  pick: FailForwardBranchPickLike
): ResolvedRecoveryTarget | null {
  if (pick.result !== 'partial' || !step.branchingChoice) return null;

  const texts = buildTextsForResolution(step, pick);
  const candidates = [
    ...step.vocabulary
      .map((vocab) => scoreVocabCandidate(vocab, texts))
      .filter((candidate): candidate is RecoveryCandidate => candidate !== null),
    ...step.grammar
      .map((grammar) => scoreGrammarCandidate(grammar, texts))
      .filter((candidate): candidate is RecoveryCandidate => candidate !== null),
  ].sort((left, right) => right.score - left.score);

  if (candidates.length > 0) {
    const { score: _score, ...resolved } = candidates[0];
    return resolved;
  }

  return resolveFromExamples(step, texts);
}

export function upsertRecoveryFlag(
  flags: RecoveryFlag[],
  targetId: string,
  createdAt: string
): RecoveryFlag[] {
  const nextFlag: RecoveryFlag = {
    targetId,
    missionsRemaining: 2,
    createdAt,
  };

  return [
    ...flags.filter((flag) => flag.targetId !== targetId),
    nextFlag,
  ];
}

function resolveRecoveryResource(targetId: string): ResolvedRecoveryTarget | null {
  const knowledgeBase = getRecoveryKnowledgeBase();
  const vocab = knowledgeBase.vocabById.get(targetId);
  if (vocab) {
    return {
      targetId: vocab.id,
      targetLabel: vocab.japanese,
      targetKind: 'vocab',
    };
  }

  const grammar = knowledgeBase.grammarById.get(targetId);
  if (grammar) {
    return {
      targetId: grammar.id,
      targetLabel: grammar.pattern,
      targetKind: 'grammar',
    };
  }

  return null;
}

function buildMissionTexts(step: JLearnStep): string[] {
  return [
    step.title,
    step.scenario,
    step.goal,
    step.successMessage,
    ...step.vocabulary.flatMap((item) => [item.japanese, item.romaji, item.english]),
    ...step.grammar.flatMap((item) => [item.pattern, item.structure, item.explanation]),
    ...step.examples.flatMap((item) => [item.japanese, item.romaji, item.english]),
    ...(step.branchingChoice?.options.flatMap((item) => [item.label, item.reaction, item.explanation]) ?? []),
    ...step.questions.flatMap((item) => [
      item.prompt,
      item.promptJapanese,
      item.correctAnswer,
      ...(item.options ?? []),
      ...(item.acceptedAnswers ?? []),
      item.explanation,
    ]),
    ...(step.dialogueChains?.flatMap((chain) =>
      chain.turns.flatMap((turn) => [
        turn.speaker,
        turn.line,
        turn.lineRomaji,
        turn.expectedAnswer,
        ...(turn.acceptedAnswers ?? []),
        turn.translation,
      ])
    ) ?? []),
  ]
    .filter((value): value is string => Boolean(value))
    .map(normalizeText)
    .filter(Boolean);
}

function missionContainsRecoveryTarget(step: JLearnStep, target: ResolvedRecoveryTarget): boolean {
  const knowledgeBase = getRecoveryKnowledgeBase();
  const vocab = target.targetKind === 'vocab' ? knowledgeBase.vocabById.get(target.targetId) : null;
  const grammar = target.targetKind === 'grammar' ? knowledgeBase.grammarById.get(target.targetId) : null;
  const targetForms = [
    target.targetLabel,
    vocab?.romaji,
    vocab?.english,
    grammar?.structure,
    grammar?.explanation,
  ]
    .filter((value): value is string => Boolean(value))
    .map(normalizeText)
    .filter(Boolean);

  const missionTexts = buildMissionTexts(step);
  return missionTexts.some((text) =>
    targetForms.some((form) => scoreTextMatch(text, form) > 0)
  );
}

function buildOptionPool(current: string, candidates: string[], fallback: string): string[] {
  const seen = new Set<string>([current]);
  const options = [current];

  for (const candidate of candidates) {
    if (!candidate || seen.has(candidate)) continue;
    seen.add(candidate);
    options.push(candidate);
    if (options.length === 4) break;
  }

  if (options.length < 4 && !seen.has(fallback)) {
    options.push(fallback);
  }

  return options.slice(0, 4);
}

function buildRecoveryQuestion(step: JLearnStep, target: ResolvedRecoveryTarget, index: number): PracticeQuestion | null {
  const knowledgeBase = getRecoveryKnowledgeBase();

  if (target.targetKind === 'vocab') {
    const vocab = knowledgeBase.vocabById.get(target.targetId);
    if (!vocab) return null;

    return {
      id: `recovery-${step.id}-${target.targetId}-${index}`,
      type: 'context-select',
      prompt: `Recovery check: which phrase fits "${vocab.english}"?`,
      options: buildOptionPool(
        vocab.japanese,
        knowledgeBase.vocabPool.map((item) => item.japanese),
        step.vocabulary[0]?.japanese ?? vocab.japanese
      ),
      correctAnswer: vocab.japanese,
      explanation: 'A missed branching moment is coming back for one clean second chance.',
      targetVocabId: vocab.id,
    };
  }

  const grammar = knowledgeBase.grammarById.get(target.targetId);
  if (!grammar) return null;

  return {
    id: `recovery-${step.id}-${target.targetId}-${index}`,
    type: 'multiple-choice',
    prompt: 'Recovery check: which pattern fits here?',
    options: buildOptionPool(
      grammar.pattern,
      knowledgeBase.grammarPool.map((item) => item.pattern),
      step.grammar[0]?.pattern ?? grammar.pattern
    ),
    correctAnswer: grammar.pattern,
    explanation: 'A missed branching moment is coming back for one clean second chance.',
    targetGrammarId: grammar.id,
  };
}

export function prepareRecoveryMission(
  step: JLearnStep,
  flags: RecoveryFlag[]
): PreparedRecoveryMission {
  const injectedQuestions: PracticeQuestion[] = [];
  const matchedFlags: RecoveryFlag[] = [];
  const remainingFlags: RecoveryFlag[] = [];
  let hasInjectedQuestion = false;

  for (const flag of flags) {
    const target = resolveRecoveryResource(flag.targetId);
    if (!target) continue;

    if (!hasInjectedQuestion && missionContainsRecoveryTarget(step, target)) {
      const question = buildRecoveryQuestion(step, target, injectedQuestions.length);
      if (question) {
        injectedQuestions.push(question);
        matchedFlags.push(flag);
        remainingFlags.push(flag);
        hasInjectedQuestion = true;
        continue;
      }
    }

    if (flag.missionsRemaining > 1) {
      remainingFlags.push({
        ...flag,
        missionsRemaining: flag.missionsRemaining - 1,
      });
    }
  }

  return {
    injectedQuestions,
    matchedFlags,
    remainingFlags,
  };
}

function normalizeSpeakerId(speaker: string): string | null {
  const normalized = normalizeText(speaker);
  if (normalized.includes('mrstanaka')) return 'mrs-tanaka';
  if (normalized.includes('mrtanaka')) return 'mr-tanaka';
  if (normalized.includes('tanakasensei')) return 'tanaka-sensei';
  if (normalized.includes('yamadasensei')) return 'yamada-sensei';
  if (normalized.includes('yuki')) return 'yuki';
  if (normalized.includes('keita')) return 'keita';
  if (normalized.includes('sora')) return 'sora';
  if (normalized.includes('obaasan')) return 'obaasan';
  return null;
}

export function buildRecoveryCallbackLine(
  step: JLearnStep,
  matchedFlags: RecoveryFlag[]
): string | null {
  if (matchedFlags.length === 0) return null;

  const target = resolveRecoveryResource(matchedFlags[0].targetId);
  if (!target) return null;

  const speakers = new Set<string>();
  for (const chain of step.dialogueChains ?? []) {
    for (const turn of chain.turns) {
      const speakerId = normalizeSpeakerId(turn.speaker);
      if (speakerId) speakers.add(speakerId);
    }
  }

  const pickedSpeakerId =
    CALLBACK_SPEAKER_PRIORITY.find((speakerId) => speakers.has(speakerId)) ??
    'mrs-tanaka';
  const speakerLabel = CALLBACK_LABELS[pickedSpeakerId];

  return `${speakerLabel} gives you a small smile when you land ${target.targetLabel} this time.`;
}
