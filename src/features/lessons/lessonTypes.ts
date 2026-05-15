// ─── Exercise Kind ────────────────────────────────────────────────────────────

export type LessonExerciseKind =
  | 'tap-meaning'
  | 'tap-japanese'
  | 'listen-and-tap'
  | 'tap-missing-word'
  | 'tap-image-match'
  | 'tap-context-answer'
  | 'arrange-sentence'
  | 'arrange-conversation'
  | 'build-translation'
  | 'build-listening'
  | 'identify-spoken-word'
  | 'npc-reply-choice'
  | 'shop-interaction'
  | 'train-station-choice'
  | 'conversation-continuation';

// ─── Base ─────────────────────────────────────────────────────────────────────

interface ExerciseBase {
  id: string;
  kind: LessonExerciseKind;
  targetVocabId?: string;
  explanation?: string; // gösterilecek wrong-answer açıklaması
}

// ─── Tap family (multiple-choice) ─────────────────────────────────────────────

export interface TapMeaningExercise extends ExerciseBase {
  kind: 'tap-meaning';
  japanese: string;
  romaji?: string;
  options: string[];        // İngilizce / Türkçe anlam seçenekleri
  correctAnswer: string;
}

export interface TapJapaneseExercise extends ExerciseBase {
  kind: 'tap-japanese';
  prompt: string;           // Türkçe / İngilizce anlam
  options: string[];        // Japonca seçenekler
  correctAnswer: string;
}

export interface ListenAndTapExercise extends ExerciseBase {
  kind: 'listen-and-tap';
  spokenText: string;       // SpeechSynthesis'e verilecek metin
  displayPrompt: string;    // "Ne duydun?"
  options: string[];
  correctAnswer: string;
}

export interface TapMissingWordExercise extends ExerciseBase {
  kind: 'tap-missing-word';
  sentenceWithBlank: string; // "おはよう [___]。" formatında
  gapMarker: string;         // '[___]'
  options: string[];
  correctAnswer: string;
}

export interface TapImageMatchExercise extends ExerciseBase {
  kind: 'tap-image-match';
  imageEmoji: string;        // MVP için emoji placeholder
  imageAlt: string;
  options: string[];         // Japonca seçenekler
  correctAnswer: string;
}

export interface TapContextAnswerExercise extends ExerciseBase {
  kind: 'tap-context-answer';
  situation: string;         // Türkçe / İngilizce durum açıklaması
  situationJapanese?: string;
  options: string[];         // Japonca seçenekler
  correctAnswer: string;
}

// ─── Arrange family (ordering) ────────────────────────────────────────────────

export interface ArrangeSentenceExercise extends ExerciseBase {
  kind: 'arrange-sentence';
  prompt: string;
  englishHint?: string;
  tiles: string[];           // karışık token'lar
  correctAnswer: string;     // boşlukla ayrılmış doğru sıra
}

export interface ArrangeConversationExercise extends ExerciseBase {
  kind: 'arrange-conversation';
  prompt: string;
  turns: string[];           // karışık sırayla diyalog satırları
  correctOrder: number[];    // turns[] içindeki doğru indeks sırası
}

// ─── Build family (tile construction) ────────────────────────────────────────

export interface BuildTranslationExercise extends ExerciseBase {
  kind: 'build-translation';
  englishPrompt: string;
  tiles: string[];           // karışık Japonca tile'lar
  correctAnswer: string;     // boşlukla ayrılmış doğru sıra
}

export interface BuildListeningExercise extends ExerciseBase {
  kind: 'build-listening';
  spokenText: string;
  tiles: string[];           // karışık Japonca tile'lar
  correctAnswer: string;
}

export interface IdentifySpokenWordExercise extends ExerciseBase {
  kind: 'identify-spoken-word';
  spokenText: string;
  displayPrompt: string;
  options: string[];         // Japonca yazılı seçenekler
  correctAnswer: string;
}

// ─── NPC / Scenario family ────────────────────────────────────────────────────

export interface NpcReplyChoiceExercise extends ExerciseBase {
  kind: 'npc-reply-choice';
  npcName: string;
  npcLine: string;           // Japonca
  npcLineRomaji?: string;
  npcLineTranslation?: string;
  options: string[];         // Japonca cevap seçenekleri
  correctAnswer: string;
}

export interface ShopInteractionExercise extends ExerciseBase {
  kind: 'shop-interaction';
  scenario: string;
  scenarioJapanese?: string;
  options: string[];
  correctAnswer: string;
}

export interface TrainStationChoiceExercise extends ExerciseBase {
  kind: 'train-station-choice';
  scenario: string;
  scenarioJapanese?: string;
  options: string[];
  correctAnswer: string;
}

export interface ConversationContinuationExercise extends ExerciseBase {
  kind: 'conversation-continuation';
  conversationSoFar: Array<{ speaker: string; line: string }>;
  options: string[];
  correctAnswer: string;
}

// ─── Union ────────────────────────────────────────────────────────────────────

export type LessonExercise =
  | TapMeaningExercise
  | TapJapaneseExercise
  | ListenAndTapExercise
  | TapMissingWordExercise
  | TapImageMatchExercise
  | TapContextAnswerExercise
  | ArrangeSentenceExercise
  | ArrangeConversationExercise
  | BuildTranslationExercise
  | BuildListeningExercise
  | IdentifySpokenWordExercise
  | NpcReplyChoiceExercise
  | ShopInteractionExercise
  | TrainStationChoiceExercise
  | ConversationContinuationExercise;

// ─── Session & Concept ────────────────────────────────────────────────────────

export type LessonSessionNumber = 1 | 2 | 3 | 4;

export const SESSION_LABELS: Record<LessonSessionNumber, string> = {
  1: 'Introduction',
  2: 'Reinforcement',
  3: 'Context Usage',
  4: 'Mastery',
};

export const SESSION_PROGRESS: Record<LessonSessionNumber, number> = {
  1: 25,
  2: 50,
  3: 75,
  4: 100,
};

export interface LessonSession {
  sessionNumber: LessonSessionNumber;
  label: string;
  exercises: LessonExercise[];
}

export interface LessonConcept {
  id: string;
  title: string;
  titleJapanese?: string;
  description: string;
  emoji: string;
  sessions: [LessonSession, LessonSession, LessonSession, LessonSession];
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export type SessionCompletionStatus = 'locked' | 'available' | 'complete';

export interface ConceptProgress {
  conceptId: string;
  completedSessions: LessonSessionNumber[];
  lastSessionCompletedAt?: string; // ISO date string
}

export type LessonProgressMap = Record<string, ConceptProgress>;

// ─── Session result ───────────────────────────────────────────────────────────

export interface LessonSessionResult {
  conceptId: string;
  sessionNumber: LessonSessionNumber;
  totalExercises: number;
  correctFirstTry: number;
  completedAt: string;
}
