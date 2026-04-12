import { DrawingData } from '../../../types';

export type KanaScript = 'hiragana' | 'katakana';
export type KanaItemType = 'base' | 'yoon' | 'extended' | 'small';

export interface KanaItem {
  id: string;
  script: KanaScript;
  char: string;
  romaji: string[];
  type: KanaItemType;
  sectionId: string;
  sectionTitle: string;
  groupId: string;
  groupLabel: string;
  strokeCount: number | null;
  drawingMetadata?: DrawingData;
  audioKey: string | null;
  guideImageKey: string | null;
  exampleWordIds: string[];
}
