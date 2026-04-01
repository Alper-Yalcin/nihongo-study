import { DictionaryWordRow, findWordsByScript } from '../repositories/wordRepository';

export interface DictionaryWord {
  id: string;
  script: string;
  kanji?: string;
  kana: string;
  romaji: string;
  meaning?: string;
  meanings: string[];
  jlptLevel?: string;
}

export interface DictionaryWordsResponse {
  items: DictionaryWord[];
}

const toDictionaryWord = (row: DictionaryWordRow): DictionaryWord => ({
  ...row,
  meaning: row.meaning ?? undefined
});

export const getDictionaryWords = (script: string): DictionaryWordsResponse => ({
  items: findWordsByScript(script).map(toDictionaryWord)
});
