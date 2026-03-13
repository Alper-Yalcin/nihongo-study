import { WordItem } from '../types';

type JlptLevel = NonNullable<WordItem['jlptLevel']>;

const jlptLevelOrder: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

const createWord = (
  id: string,
  kana: string,
  romaji: string,
  meaning: string,
  script: WordItem['script'],
  jlptLevel: JlptLevel
): WordItem => ({
  id,
  kana,
  romaji,
  meaning,
  script,
  jlptLevel
});

const sortDictionaryWords = (words: WordItem[]) =>
  [...words].sort((a, b) => {
    const levelDiff =
      jlptLevelOrder.indexOf(a.jlptLevel as JlptLevel) -
      jlptLevelOrder.indexOf(b.jlptLevel as JlptLevel);

    if (levelDiff !== 0) {
      return levelDiff;
    }

    return a.romaji.localeCompare(b.romaji);
  });

const hiraganaWords: WordItem[] = [
  createWord('hiragana-n5-asoko', 'あそこ', 'asoko', 'there, over there', 'hiragana', 'N5'),
  createWord('hiragana-n5-achira', 'あちら', 'achira', 'this way; that way', 'hiragana', 'N5'),
  createWord('hiragana-n5-ikutsu', 'いくつ', 'ikutsu', 'how many; how old', 'hiragana', 'N5'),
  createWord('hiragana-n5-itsu', 'いつ', 'itsu', 'when', 'hiragana', 'N5'),
  createWord('hiragana-n4-gomi', 'ごみ', 'gomi', 'trash; garbage', 'hiragana', 'N4'),
  createWord('hiragana-n4-shikkari', 'しっかり', 'shikkari', 'firmly; steadily', 'hiragana', 'N4'),
  createWord('hiragana-n4-tsumori', 'つもり', 'tsumori', 'intention; plan', 'hiragana', 'N4'),
  createWord('hiragana-n4-dame', 'だめ', 'dame', 'no good; useless', 'hiragana', 'N4'),
  createWord('hiragana-n3-shaberu', 'しゃべる', 'shaberu', 'to chat; to talk', 'hiragana', 'N3'),
  createWord('hiragana-n3-shibashiba', 'しばしば', 'shibashiba', 'often; frequently', 'hiragana', 'N3'),
  createWord('hiragana-n3-suteki', 'すてき', 'suteki', 'lovely; wonderful', 'hiragana', 'N3'),
  createWord('hiragana-n3-zutto', 'ずっと', 'zutto', 'all the time; by far', 'hiragana', 'N3'),
  createWord('hiragana-n2-aimai', 'あいまい', 'aimai', 'vague; ambiguous', 'hiragana', 'N2'),
  createWord('hiragana-n2-akubi', 'あくび', 'akubi', 'yawn', 'hiragana', 'N2'),
  createWord('hiragana-n2-afureru', 'あふれる', 'afureru', 'to overflow', 'hiragana', 'N2'),
  createWord('hiragana-n2-ikinari', 'いきなり', 'ikinari', 'all of a sudden', 'hiragana', 'N2'),
  createWord('hiragana-n1-kojireru', 'こじれる', 'kojireru', 'to grow complicated', 'hiragana', 'N1'),
  createWord('hiragana-n1-kodawaru', 'こだわる', 'kodawaru', 'to be particular about', 'hiragana', 'N1'),
  createWord('hiragana-n1-gomakasu', 'ごまかす', 'gomakasu', 'to deceive; to falsify', 'hiragana', 'N1'),
  createWord('hiragana-n1-shikitari', 'しきたり', 'shikitari', 'custom; convention', 'hiragana', 'N1')
];

const katakanaWords: WordItem[] = [
  createWord('katakana-n5-apaato', 'アパート', 'apaato', 'apartment', 'katakana', 'N5'),
  createWord('katakana-n5-kamera', 'カメラ', 'kamera', 'camera', 'katakana', 'N5'),
  createWord('katakana-n5-gitaa', 'ギター', 'gitaa', 'guitar', 'katakana', 'N5'),
  createWord('katakana-n5-koohii', 'コーヒー', 'koohii', 'coffee', 'katakana', 'N5'),
  createWord('katakana-n4-gasorin', 'ガソリン', 'gasorin', 'gasoline; petrol', 'katakana', 'N4'),
  createWord('katakana-n4-sandoicchi', 'サンドイッチ', 'sandoicchi', 'sandwich', 'katakana', 'N4'),
  createWord('katakana-n4-sutereo', 'ステレオ', 'sutereo', 'stereo', 'katakana', 'N4'),
  createWord('katakana-n4-tekisuto', 'テキスト', 'tekisuto', 'textbook; text', 'katakana', 'N4'),
  createWord('katakana-n3-juusu', 'ジュース', 'juusu', 'juice; soft drink', 'katakana', 'N3'),
  createWord('katakana-n3-suicchi', 'スイッチ', 'suicchi', 'switch', 'katakana', 'N3'),
  createWord('katakana-n3-sukejuuru', 'スケジュール', 'sukejuuru', 'schedule', 'katakana', 'N3'),
  createWord('katakana-n3-supiichi', 'スピーチ', 'supiichi', 'speech', 'katakana', 'N3'),
  createWord('katakana-n2-akusento', 'アクセント', 'akusento', 'accent', 'katakana', 'N2'),
  createWord('katakana-n2-antena', 'アンテナ', 'antena', 'antenna', 'katakana', 'N2'),
  createWord('katakana-n2-epuron', 'エプロン', 'epuron', 'apron', 'katakana', 'N2'),
  createWord('katakana-n2-ookesutora', 'オーケストラ', 'ookesutora', 'orchestra', 'katakana', 'N2'),
  createWord('katakana-n1-koonaa', 'コーナー', 'koonaa', 'corner', 'katakana', 'N1'),
  createWord('katakana-n1-komento', 'コメント', 'komento', 'comment', 'katakana', 'N1'),
  createWord('katakana-n1-kontorooru', 'コントロール', 'kontorooru', 'control', 'katakana', 'N1'),
  createWord('katakana-n1-saikuru', 'サイクル', 'saikuru', 'cycle', 'katakana', 'N1')
];

export const hiraganaDictionaryWords: WordItem[] = sortDictionaryWords(hiraganaWords);

export const katakanaDictionaryWords: WordItem[] = sortDictionaryWords(katakanaWords);
