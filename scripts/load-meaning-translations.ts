import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { turkishMeaningTranslations as baseTranslations } from './data/meaningTranslations';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GENERATED_TRANSLATIONS_PATH = path.join(__dirname, 'data', 'meaningTranslations.generated.json');

const isRecord = (value: unknown): value is Record<string, string> =>
  typeof value === 'object' &&
  value !== null &&
  Object.values(value).every((entry) => typeof entry === 'string');

export const loadTurkishMeaningTranslations = (): Record<string, string> => {
  if (!fs.existsSync(GENERATED_TRANSLATIONS_PATH)) {
    return { ...baseTranslations };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(GENERATED_TRANSLATIONS_PATH, 'utf8')) as unknown;

    if (!isRecord(parsed)) {
      return { ...baseTranslations };
    }

    return {
      ...baseTranslations,
      ...parsed
    };
  } catch {
    return { ...baseTranslations };
  }
};

export const getGeneratedMeaningTranslationsPath = () => GENERATED_TRANSLATIONS_PATH;
