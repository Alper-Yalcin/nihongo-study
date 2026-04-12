import { KanaScript } from './kanaItem';

export type WordPackLevel = 'beginner' | 'common' | 'all';

export interface WordPack {
  id: string;
  script: KanaScript;
  title: string;
  level: WordPackLevel;
  category: string;
  kanaIds: string[];
  wordIds: string[];
  estimatedDifficulty: number;
}
