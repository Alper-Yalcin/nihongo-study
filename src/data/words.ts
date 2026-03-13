import { WordItem } from '../types';

export const hiraganaDictionaryWords: WordItem[] = [
  { id: 'asa', kana: 'あさ', romaji: 'asa', meaning: 'morning', script: 'hiragana' },
  { id: 'hana', kana: 'はな', romaji: 'hana', meaning: 'flower', script: 'hiragana' },
  { id: 'inu', kana: 'いぬ', romaji: 'inu', meaning: 'dog', script: 'hiragana' },
  { id: 'kawa', kana: 'かわ', romaji: 'kawa', meaning: 'river', script: 'hiragana' },
  { id: 'mizu', kana: 'みず', romaji: 'mizu', meaning: 'water', script: 'hiragana' },
  { id: 'neko', kana: 'ねこ', romaji: 'neko', meaning: 'cat', script: 'hiragana' },
  { id: 'sakana', kana: 'さかな', romaji: 'sakana', meaning: 'fish', script: 'hiragana' },
  { id: 'sora', kana: 'そら', romaji: 'sora', meaning: 'sky', script: 'hiragana' },
  { id: 'tori', kana: 'とり', romaji: 'tori', meaning: 'bird', script: 'hiragana' },
  { id: 'yama', kana: 'やま', romaji: 'yama', meaning: 'mountain', script: 'hiragana' }
].sort((a, b) => a.romaji.localeCompare(b.romaji));

export const katakanaDictionaryWords: WordItem[] = [
  { id: 'basu', kana: 'バス', romaji: 'basu', meaning: 'bus', script: 'katakana' },
  { id: 'hoteru', kana: 'ホテル', romaji: 'hoteru', meaning: 'hotel', script: 'katakana' },
  { id: 'kamera', kana: 'カメラ', romaji: 'kamera', meaning: 'camera', script: 'katakana' },
  { id: 'konpyuuta', kana: 'コンピュータ', romaji: 'konpyuuta', meaning: 'computer', script: 'katakana' },
  { id: 'koohii', kana: 'コーヒー', romaji: 'koohii', meaning: 'coffee', script: 'katakana' },
  { id: 'resutoran', kana: 'レストラン', romaji: 'resutoran', meaning: 'restaurant', script: 'katakana' },
  { id: 'suupaa', kana: 'スーパー', romaji: 'suupaa', meaning: 'supermarket', script: 'katakana' },
  { id: 'takushii', kana: 'タクシー', romaji: 'takushii', meaning: 'taxi', script: 'katakana' },
  { id: 'terebi', kana: 'テレビ', romaji: 'terebi', meaning: 'television', script: 'katakana' },
  { id: 'toire', kana: 'トイレ', romaji: 'toire', meaning: 'toilet', script: 'katakana' }
].sort((a, b) => a.romaji.localeCompare(b.romaji));
