import { useEffect, useState } from 'react';
import { WordItem } from '../types';
import { fetchJson } from '../utils/api';

type ScriptType = NonNullable<WordItem['script']>;

interface DictionaryWordsResponse {
  items: WordItem[];
}

const wordCache = new Map<ScriptType, WordItem[]>();
const pendingRequests = new Map<ScriptType, Promise<WordItem[]>>();

export const loadDictionaryWords = async (script: ScriptType): Promise<WordItem[]> => {
  const cached = wordCache.get(script);

  if (cached) {
    return cached;
  }

  const pending = pendingRequests.get(script);

  if (pending) {
    return pending;
  }

  const request = fetchJson<DictionaryWordsResponse>(`/api/words?script=${script}`)
    .then(({ items }) => {
      wordCache.set(script, items);
      pendingRequests.delete(script);
      return items;
    })
    .catch((error) => {
      pendingRequests.delete(script);
      throw error;
    });

  pendingRequests.set(script, request);
  return request;
};

export const useDictionaryWords = (script: ScriptType) => {
  const [words, setWords] = useState<WordItem[]>(() => wordCache.get(script) ?? []);
  const [loading, setLoading] = useState(!wordCache.has(script));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    setError(null);
    setLoading(!wordCache.has(script));

    loadDictionaryWords(script)
      .then((items) => {
        if (!isActive) {
          return;
        }

        setWords(items);
        setLoading(false);
      })
      .catch((requestError: unknown) => {
        if (!isActive) {
          return;
        }

        const message =
          requestError instanceof Error ? requestError.message : 'Failed to load dictionary words.';
        setError(message);
        setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [script]);

  return { words, loading, error };
};
