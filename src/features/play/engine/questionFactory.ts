import { WordItem } from '../../../types';
import { KanaItem } from '../../kana/domain/kanaItem';
import {
  KanaMatchQuestion,
  MeaningMatchQuestion,
  PlayContentType
} from '../domain/playTypes';

const shuffle = <T,>(items: T[]): T[] => {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  }

  return next;
};

const loopedSample = <T,>(items: T[], count: number): T[] => {
  if (items.length === 0 || count <= 0) {
    return [];
  }

  const sampled: T[] = [];

  while (sampled.length < count) {
    sampled.push(...shuffle(items));
  }

  return sampled.slice(0, count);
};

const uniqueText = (values: string[]) =>
  Array.from(new Set(values.map((value) => value.trim()).filter((value) => value.length > 0)));

const resolveWordMeaning = (word: WordItem) => {
  if (Array.isArray(word.meanings) && word.meanings.length > 0) {
    const firstMeaning = word.meanings.find((entry) => typeof entry === 'string' && entry.trim().length > 0);

    if (firstMeaning) {
      return firstMeaning.trim();
    }
  }

  if (typeof word.meaning === 'string' && word.meaning.trim().length > 0) {
    return word.meaning.trim();
  }

  return null;
};

const resolveWordPrompt = (word: WordItem) => {
  if (typeof word.kanji === 'string' && word.kanji.trim().length > 0) {
    return word.kanji;
  }

  return word.kana;
};

export const buildKanaMatchQuestions = (
  kanaItems: KanaItem[],
  questionCount: number,
  contentType: PlayContentType
): KanaMatchQuestion[] => {
  const sanitizedItems = kanaItems.filter(
    (item) => item.char.trim().length > 0 && item.romaji[0]?.trim().length > 0
  );
  const romajiPool = uniqueText(sanitizedItems.flatMap((item) => item.romaji));

  if (sanitizedItems.length < 2 || romajiPool.length < 2) {
    return [];
  }

  const targets = loopedSample(sanitizedItems, questionCount);
  const optionCount = Math.min(4, romajiPool.length);

  return targets.map((target, index) => {
    const correctAnswer = target.romaji[0];
    const distractors = shuffle(
      romajiPool.filter((candidate) => candidate !== correctAnswer)
    ).slice(0, Math.max(1, optionCount - 1));

    return {
      id: `kana-${target.id}-${index}`,
      kind: 'kana-match',
      itemType: 'kana',
      kanaId: target.id,
      script: target.script,
      shownItem: target.char,
      correctAnswer,
      options: shuffle(uniqueText([correctAnswer, ...distractors])).slice(0, optionCount),
      contentType
    };
  });
};

export const buildMeaningMatchQuestions = (
  words: WordItem[],
  questionCount: number,
  contentType: PlayContentType
): MeaningMatchQuestion[] => {
  const candidates = words
    .map((word) => {
      const meaning = resolveWordMeaning(word);

      if (!meaning) {
        return null;
      }

      return {
        ...word,
        meaning
      };
    })
    .filter((word): word is WordItem & { meaning: string } => word !== null);

  const meaningPool = uniqueText(candidates.map((word) => word.meaning));

  if (candidates.length < 2 || meaningPool.length < 2) {
    return [];
  }

  const targets = loopedSample(candidates, questionCount);
  const optionCount = Math.min(4, meaningPool.length);

  return targets.map((target, index) => {
    const distractors = shuffle(meaningPool.filter((meaning) => meaning !== target.meaning)).slice(
      0,
      Math.max(1, optionCount - 1)
    );

    return {
      id: `word-${target.id}-${index}`,
      kind: 'meaning-match',
      itemType: 'word',
      wordId: target.id,
      reading: target.kana,
      shownItem: resolveWordPrompt(target),
      correctAnswer: target.meaning,
      options: shuffle(uniqueText([target.meaning, ...distractors])).slice(0, optionCount),
      contentType
    };
  });
};
