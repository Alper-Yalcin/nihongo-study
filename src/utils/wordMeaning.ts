import { useEffect, useState } from 'react';
import { AppLanguage } from '../data/appPreferences';

export type MeaningTranslations = Record<string, string>;

let cachedTranslations: MeaningTranslations | null = null;
let translationPromise: Promise<MeaningTranslations> | null = null;

export const loadMeaningTranslations = async (): Promise<MeaningTranslations> => {
  if (cachedTranslations) {
    return cachedTranslations;
  }

  if (!translationPromise) {
    translationPromise = import('../data/meaningTranslations').then((module) => {
      cachedTranslations = module.turkishMeaningTranslations;
      return cachedTranslations;
    });
  }

  return translationPromise;
};

export const useMeaningTranslations = (language: AppLanguage) => {
  const [translations, setTranslations] = useState<MeaningTranslations | null>(
    language === 'tr' ? cachedTranslations : null
  );

  useEffect(() => {
    let isActive = true;

    if (language !== 'tr') {
      setTranslations(null);
      return () => {
        isActive = false;
      };
    }

    loadMeaningTranslations().then((map) => {
      if (isActive) {
        setTranslations(map);
      }
    });

    return () => {
      isActive = false;
    };
  }, [language]);

  return translations;
};

export const getLocalizedWordMeaning = (
  meaning: string | undefined,
  language: AppLanguage,
  translations?: MeaningTranslations | null
) => {
  if (language === 'tr') {
    if (!meaning) {
      return meaning;
    }

    return translations?.[meaning] || meaning;
  }

  return meaning;
};
