import { useEffect, useState } from 'react';
import { AppLanguage } from '../data/appPreferences';
import { fetchJson } from './api';

export type MeaningTranslations = Record<string, string>;

interface MeaningTranslationsResponse {
  language: AppLanguage;
  entries: MeaningTranslations;
}

const translationCache = new Map<AppLanguage, MeaningTranslations>();
const pendingTranslations = new Map<AppLanguage, Promise<MeaningTranslations>>();

export const loadMeaningTranslations = async (language: AppLanguage): Promise<MeaningTranslations> => {
  if (language !== 'tr') {
    return {};
  }

  const cached = translationCache.get(language);

  if (cached) {
    return cached;
  }

  const pending = pendingTranslations.get(language);

  if (pending) {
    return pending;
  }

  const request = fetchJson<MeaningTranslationsResponse>(`/api/translations/${language}`)
    .then(({ entries }) => {
      translationCache.set(language, entries);
      pendingTranslations.delete(language);
      return entries;
    })
    .catch((error) => {
      pendingTranslations.delete(language);
      throw error;
    });

  pendingTranslations.set(language, request);
  return request;
};

export const useMeaningTranslations = (language: AppLanguage) => {
  const [translations, setTranslations] = useState<MeaningTranslations | null>(
    language === 'tr' ? translationCache.get(language) ?? null : null
  );

  useEffect(() => {
    let isActive = true;

    if (language !== 'tr') {
      setTranslations(null);
      return () => {
        isActive = false;
      };
    }

    loadMeaningTranslations(language)
      .then((map) => {
        if (isActive) {
          setTranslations(map);
        }
      })
      .catch(() => {
        if (isActive) {
          setTranslations(null);
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
