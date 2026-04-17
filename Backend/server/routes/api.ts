import { Router } from 'express';
import { DATABASE_PATH } from '../db';
import {
  DictionaryQueryError,
  getDictionaryWordById,
  getDictionaryWords,
  listDictionaryWordPacks
} from '../services/dictionaryService';
import { getMeaningTranslations } from '../services/translationService';

const getErrorMessage = (error: unknown, fallbackMessage: string) =>
  error instanceof Error ? error.message : fallbackMessage;

export const apiRouter = Router();

const asOptionalString = (value: unknown) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();
  return normalized ? normalized : undefined;
};

const asOptionalInteger = (value: unknown, paramName: string) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new DictionaryQueryError(`Invalid "${paramName}" query parameter.`);
  }

  const parsed = Number.parseInt(String(value), 10);

  if (!Number.isFinite(parsed)) {
    throw new DictionaryQueryError(`Invalid "${paramName}" query parameter.`);
  }

  return parsed;
};

apiRouter.get('/health', (_request, response) => {
  response.json({
    ok: true,
    databasePath: DATABASE_PATH
  });
});

apiRouter.get('/words', (request, response) => {
  try {
    response.json(
      getDictionaryWords({
        script: asOptionalString(request.query.script),
        query: asOptionalString(request.query.query),
        mode: asOptionalString(request.query.mode),
        level: asOptionalString(request.query.level),
        packId: asOptionalString(request.query.packId),
        limit: asOptionalInteger(request.query.limit, 'limit'),
        offset: asOptionalInteger(request.query.offset, 'offset')
      })
    );
  } catch (error) {
    if (error instanceof DictionaryQueryError) {
      response.status(400).json({
        error: error.message
      });
      return;
    }

    response.status(500).json({
      error: getErrorMessage(error, 'Failed to load words.')
    });
  }
});

apiRouter.get('/word-packs', (request, response) => {
  try {
    response.json({
      items: listDictionaryWordPacks(asOptionalString(request.query.script))
    });
  } catch (error) {
    if (error instanceof DictionaryQueryError) {
      response.status(400).json({
        error: error.message
      });
      return;
    }

    response.status(500).json({
      error: getErrorMessage(error, 'Failed to load word packs.')
    });
  }
});

apiRouter.get('/words/:id', (request, response) => {
  try {
    const word = getDictionaryWordById(
      request.params.id,
      asOptionalString(request.query.script)
    );

    if (!word) {
      response.status(404).json({
        error: 'Word not found.'
      });
      return;
    }

    response.json(word);
  } catch (error) {
    if (error instanceof DictionaryQueryError) {
      response.status(400).json({
        error: error.message
      });
      return;
    }

    response.status(500).json({
      error: getErrorMessage(error, 'Failed to load word detail.')
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
