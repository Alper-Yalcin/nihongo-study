import { KanaScript } from '../domain/kanaItem';

export interface KanaConfusableSeed {
  id: string;
  script: KanaScript;
  kanaIds: [string, string];
}

export const kanaConfusableSeeds: Record<KanaScript, KanaConfusableSeed[]> = {
  hiragana: [
    { id: 'hiragana-nu-me', script: 'hiragana', kanaIds: ['h-nu', 'h-me'] },
    { id: 'hiragana-a-o', script: 'hiragana', kanaIds: ['h-a', 'h-o'] },
    { id: 'hiragana-sa-chi', script: 'hiragana', kanaIds: ['h-sa', 'h-chi'] },
    { id: 'hiragana-re-wa', script: 'hiragana', kanaIds: ['h-re', 'h-wa'] }
  ],
  katakana: [
    { id: 'katakana-shi-tsu', script: 'katakana', kanaIds: ['k-shi', 'k-tsu'] },
    { id: 'katakana-so-n', script: 'katakana', kanaIds: ['k-so', 'k-n'] },
    { id: 'katakana-ku-ke', script: 'katakana', kanaIds: ['k-ku', 'k-ke'] },
    { id: 'katakana-su-nu', script: 'katakana', kanaIds: ['k-su', 'k-nu'] }
  ]
};
