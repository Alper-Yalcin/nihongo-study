import { Router } from 'express';
import { DATABASE_PATH } from '../db';
import { getDictionaryWords } from '../services/dictionaryService';
import { getMeaningTranslations } from '../services/translationService';

const getErrorMessage = (error: unknown, fallbackMessage: string) =>
  error instanceof Error ? error.message : fallbackMessage;

export const apiRouter = Router();

apiRouter.get('/health', (_request, response) => {
  response.json({
    ok: true,
    databasePath: DATABASE_PATH
  });
});

apiRouter.get('/words', (request, response) => {
  const script = typeof request.query.script === 'string' ? request.query.script : '';

  if (!script) {
    response.status(400).json({
      error: 'The "script" query parameter is required.'
    });
    return;
  }

  try {
    response.json(getDictionaryWords(script));
  } catch (error) {
    response.status(500).json({
      error: getErrorMessage(error, 'Failed to load words.')
    });
  }
});

apiRouter.get('/translations/:language', (request, response) => {
  try {
    response.json(getMeaningTranslations(request.params.language.toLowerCase()));
  } catch (error) {
    response.status(500).json({
      error: getErrorMessage(error, 'Failed to load translations.')
    });
  }
});
