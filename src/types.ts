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

export interface DrawingData {
  viewBoxWidth?: number;
  viewBoxHeight?: number;
  strokeCount?: number;
  guidePaths?: string[];
  strokeGuides?: StrokeGuide[];
  safeZone?: SafeZone;
  testTemplate?: any;
  boundingHints?: any;
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

export interface RunStats {
  completed: number;
  totalAttempts: number;
  correct: number;
  wrong: number;
  accuracy: number;
  timeSeconds: number;
  mode?: TypingMode;
  speed?: number;
  bestStreak?: number;
  averageAnswerMs?: number;
  timeLimitSeconds?: number;
}

export type TypingMode = 'current' | 'reverse' | 'timed';

export type TabType = 'overview' | 'hiragana' | 'katakana' | 'kanji' | 'settings';
