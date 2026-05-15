import { findTranslationsByLanguage } from '@/lib/repositories/translationRepository'

export interface TranslationEntriesResponse {
  language: string
  entries: Record<string, string>
}

export const getMeaningTranslations = (language: string): TranslationEntriesResponse => {
  if (language !== 'tr') {
    return { language, entries: {} }
  }

  const rows = findTranslationsByLanguage(language)
  return {
    language,
    entries: Object.fromEntries(rows.map((row) => [row.sourceText, row.translation]))
  }
}
