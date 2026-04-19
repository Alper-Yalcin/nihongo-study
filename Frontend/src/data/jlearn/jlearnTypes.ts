/**
 * Japanese learning track — data types.
 * Mirrors the curriculum blueprint (JLearnTrack → Level → Unit → Step/Mission).
 */

export type JlptLevel = 'N5' | 'N4' | 'N3';
export type GrammarSource = 'genki1' | 'genki2' | 'taekim' | 'custom';

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'particle'
  | 'expression'
  | 'counter'
  | 'suffix';

export interface VocabItem {
  id: string;
  japanese: string;
  kanji?: string;
  romaji: string;
  english: string;
  partOfSpeech: PartOfSpeech;
  jlptLevel: JlptLevel;
  audioKey?: string;
}

export interface GrammarPoint {
  id: string;
  pattern: string;
  explanation: string;
  structure: string;
  examples: string[];
  source: GrammarSource;
  jlptLevel: JlptLevel;
}

export interface ExampleSentence {
  id: string;
  japanese: string;
  romaji: string;
  english: string;
  vocabIds: string[];
  grammarIds: string[];
}

export type QuestionType =
  | 'multiple-choice'
  | 'translation-en-jp'
  | 'translation-jp-en'
  | 'fill-in-blank'
  | 'sentence-build'
  | 'listening-recognition'
  | 'context-select'
  | 'dialogue-complete';

export interface PracticeQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  promptJapanese?: string;
  options?: string[];
  correctAnswer: string;
  acceptedAnswers?: string[];
  explanation?: string;
  targetVocabId?: string;
  targetGrammarId?: string;
}

export type BranchingOutcomeKind = 'wrong' | 'partial' | 'correct';

export interface BranchingOption {
  id: string;
  label: string;
  outcome: BranchingOutcomeKind;
  reaction: string;
  explanation?: string;
}

export interface BranchingChoice {
  prompt: string;
  promptJapanese?: string;
  options: BranchingOption[];
}

export type DialogueRelationshipStage = 0 | 1 | 2 | 3;
export type DialogueLineVariant = string | Partial<Record<DialogueRelationshipStage, string>>;

export interface DialogueTurn {
  speaker: string;
  line?: DialogueLineVariant;
  lineRomaji?: string;
  expectedAnswer?: string;
  acceptedAnswers?: string[];
  translation?: string;
  isLearnerTurn: boolean;
}

export interface DialogueChain {
  id: string;
  title?: string;
  turns: DialogueTurn[];
}

export interface EmotionalFeedback {
  perfect: string;
  good: string;
  struggle: string;
}

export type MissionKind = 'introduce' | 'expand' | 'review' | 'produce' | 'checkpoint';

export interface JLearnStep {
  id: string;
  title: string;
  kind?: MissionKind;
  scenario?: string;
  goal?: string;
  estimatedMinutes: 1 | 2;
  vocabulary: VocabItem[];
  grammar: GrammarPoint[];
  examples: ExampleSentence[];
  questions: PracticeQuestion[];
  branchingChoice?: BranchingChoice;
  dialogueChains?: DialogueChain[];
  successMessage?: string;
  emotionalFeedback?: EmotionalFeedback;
  isReviewStep?: boolean;
  isCheckpoint?: boolean;
  minPassScore?: number;
}

export interface JLearnUnit {
  id: string;
  title: string;
  summary: string;
  steps: JLearnStep[];
  prerequisiteUnitIds?: string[];
}

export interface JLearnLevel {
  id: string;
  title: string;
  theme: string;
  location?: string;
  jlptAlignment: JlptLevel;
  genkiChapters?: number[];
  units: JLearnUnit[];
  checkpointUnitId: string;
  badge?: {
    id: string;
    name: string;
    description: string;
  };
}

export interface JLearnTrack {
  id: 'japanese';
  title: string;
  levels: JLearnLevel[];
}
