import { AppLanguage } from '../data/appPreferences';
import { MeaningTranslations, getLocalizedWordMeaning } from './wordMeaning';
import { isAcceptedKanaAnswer, isAcceptedRomajiAnswer } from './typing';

const normalizeMeaningText = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[’']/g, '')
    .replace(/[()[\]{}\"]/g, ' ')
    .replace(/[.!?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const stripEnglishPrefix = (value: string) => value.replace(/^(?:to|a|an|the)\s+/i, '').trim();

const buildMeaningVariants = (value?: string) => {
  if (!value) {
    return [];
  }

  const rawVariants = [value, ...value.split(/[;,/]/)];
  const accepted = new Set<string>();

  rawVariants.forEach((variant) => {
    const normalized = normalizeMeaningText(variant);

    if (!normalized) {
      return;
    }

    accepted.add(normalized);

    const stripped = stripEnglishPrefix(normalized);
    if (stripped) {
      accepted.add(stripped);
    }
  });

  return [...accepted];
};

export const getAcceptedMeaningAnswers = (
  meaning: string | undefined,
  language: AppLanguage,
  meaningTranslations?: MeaningTranslations | null
) => {
  const localizedMeaning = getLocalizedWordMeaning(meaning, language, meaningTranslations);
  const accepted = new Set<string>();

  [meaning, localizedMeaning].forEach((source) => {
    buildMeaningVariants(source).forEach((variant) => accepted.add(variant));
  });

  return [...accepted];
};

export const isAcceptedMeaningAnswer = (
  value: string,
  meaning: string | undefined,
  language: AppLanguage,
  meaningTranslations?: MeaningTranslations | null
) => {
  const normalizedInput = normalizeMeaningText(value);

  if (!normalizedInput) {
    return false;
  }

  const acceptedAnswers = getAcceptedMeaningAnswers(meaning, language, meaningTranslations);

  if (acceptedAnswers.includes(normalizedInput)) {
    return true;
  }

  const strippedInput = stripEnglishPrefix(normalizedInput);
  return strippedInput ? acceptedAnswers.includes(strippedInput) : false;
};

export const isAcceptedWordAnswer = (value: string, kana: string, romaji: string) =>
  isAcceptedKanaAnswer(value, kana) || isAcceptedRomajiAnswer(value, romaji);
