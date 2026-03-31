export interface StrokeGuide {
  index: number;
  labelX: number;
  labelY: number;
  arrowFrom: { x: number; y: number };
  arrowTo: { x: number; y: number };
  color?: string;
}

export interface SafeZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DrawingTemplatePoint {
  x: number;
  y: number;
}

export interface DrawingTemplateStroke {
  points: DrawingTemplatePoint[];
}

export interface GuidePath {
  d: string;
  transform?: string;
}

export interface DrawingTestTemplate {
  strokes?: DrawingTemplateStroke[];
  width?: number;
  height?: number;
}

export interface DrawingBoundingHints {
  minX?: number;
  minY?: number;
  maxX?: number;
  maxY?: number;
  width?: number;
  height?: number;
}

export interface DrawingData {
  viewBoxWidth?: number;
  viewBoxHeight?: number;
  strokeCount?: number;
  guidePaths?: GuidePath[];
  strokeGuides?: StrokeGuide[];
  safeZone?: SafeZone;
  testTemplate?: DrawingTestTemplate;
  boundingHints?: DrawingBoundingHints;
}

export interface Character {
  id: string;
  symbol: string;
  label: string;
  type?: string;
  drawingData?: DrawingData;
}

export interface KanaGroup {
  id: string;
  label: string;
  characters: Character[];
}

export interface KanaSection {
  id: string;
  title: string;
  description: string;
  matrix: (Character | null)[][];
  groups: KanaGroup[];
  columnGroupIds?: (string | null)[];
}

export interface WordItem {
  id: string;
  kana: string;
  romaji: string;
  meaning?: string;
  script?: 'hiragana' | 'katakana';
  jlptLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
}

export interface ListeningItem {
  id: string;
  script: 'hiragana' | 'katakana';
  kana: string;
  romaji: string;
  acceptedRomaji?: string[];
  audioSrc: string;
  datasetType: 'character' | 'word';
  character?: Character;
}

export interface RunStats {
  completed: number;
  totalAttempts: number;
  correct: number;
  wrong: number;
  accuracy: number;
  timeSeconds: number;
  mode?: TypingMode | DrawingMode | ListeningMode | WordStudyMode;
  modeLabel?: string;
  speed?: number;
  bestStreak?: number;
  averageAnswerMs?: number;
  timeLimitSeconds?: number;
  averageScore?: number;
}

export type TypingMode = 'current' | 'reverse' | 'timed';
export type DrawingMode = 'practice' | 'test' | 'speed' | 'memory';
export type ListeningMode = 'recognition' | 'typing' | 'writing';
export type WordQuizMode = 'wordToRomaji' | 'wordToMeaning' | 'meaningToWord';
export type WordStudyMode = WordQuizMode | 'test';
export type ScriptStudyView = 'typing' | 'drawing' | 'listening' | 'dictionary';
export type ScriptLayoutView = 'overview' | ScriptStudyView;

export type TabType = 'overview' | 'hiragana' | 'katakana' | 'kanji' | 'settings';
