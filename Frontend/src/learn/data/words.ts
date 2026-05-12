import { useEffect, useState } from 'react';
import { WordItem } from '../../types';
import { fetchJson } from '../../utils/api';

type ScriptType = NonNullable<WordItem['script']>;

export type DictionaryQueryMode = 'contains' | 'prefix' | 'exact';
export type DictionaryJlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface DictionaryWordPack {
  id: string;
  title: string;
  description: string;
  script: ScriptType;
  level?: DictionaryJlptLevel;
  mode?: DictionaryQueryMode;
  query?: string;
  offset: number;
  maxItems: number;
  estimatedCount: number;
}

export interface DictionaryWordDetail extends WordItem {
  script: ScriptType;
  meanings: string[];
  jlptLevel: DictionaryJlptLevel | null;
  tags?: string;
}

export interface DictionaryWordPage {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

interface DictionaryWordsResponse {
  items: WordItem[];
  page: DictionaryWordPage;
}

interface DictionaryWordPacksResponse {
  items: DictionaryWordPack[];
}

export interface DictionaryWordSearchParams {
  script: ScriptType;
  query?: string;
  mode?: DictionaryQueryMode;
  level?: DictionaryJlptLevel;
  packId?: string;
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

interface DictionaryWordsState {
  words: WordItem[];
  page: DictionaryWordPage;
}

const DEFAULT_SCRIPT_WORD_LIMIT = 200;

const buildWordsApiPath = ({
  script,
  query,
  mode,
  level,
  packId,
  limit,
  offset
}: DictionaryWordSearchParams) => {
  const searchParams = new URLSearchParams();
  searchParams.set('script', script);

  if (query) {
    searchParams.set('query', query);
  }

  if (mode) {
    searchParams.set('mode', mode);
  }

  if (level) {
    searchParams.set('level', level);
  }

  if (packId) {
    searchParams.set('packId', packId);
  }

  if (typeof limit === 'number' && Number.isFinite(limit)) {
    searchParams.set('limit', String(Math.trunc(limit)));
  }

  if (typeof offset === 'number' && Number.isFinite(offset)) {
    searchParams.set('offset', String(Math.trunc(offset)));
  }

  return `/api/words?${searchParams.toString()}`;
};

const buildWordPacksApiPath = (script: ScriptType) => {
  const searchParams = new URLSearchParams();
  searchParams.set('script', script);
  return `/api/word-packs?${searchParams.toString()}`;
};

const buildWordDetailApiPath = (wordId: string, script: ScriptType) => {
  const encodedWordId = encodeURIComponent(wordId);
  const searchParams = new URLSearchParams();
  searchParams.set('script', script);
  return `/api/words/${encodedWordId}?${searchParams.toString()}`;
};

export const searchDictionaryWords = async (
  params: DictionaryWordSearchParams
): Promise<DictionaryWordsResponse> =>
  fetchJson<DictionaryWordsResponse>(buildWordsApiPath(params));

export const listDictionaryWordPacks = async (script: ScriptType): Promise<DictionaryWordPack[]> => {
  const response = await fetchJson<DictionaryWordPacksResponse>(buildWordPacksApiPath(script));
  return response.items;
};

export const getDictionaryWordById = async (
  wordId: string,
  script: ScriptType
): Promise<DictionaryWordDetail> =>
  fetchJson<DictionaryWordDetail>(buildWordDetailApiPath(wordId, script));

const wordCache = new Map<ScriptType, DictionaryWordsState>();
const pendingRequests = new Map<ScriptType, Promise<WordItem[]>>();
const wordPackCache = new Map<ScriptType, DictionaryWordPack[]>();
const pendingWordPackRequests = new Map<ScriptType, Promise<DictionaryWordPack[]>>();

export const loadDictionaryWords = async (script: ScriptType): Promise<WordItem[]> => {
  const cached = wordCache.get(script);

  if (cached) {
    return cached.words;
  }

  const pending = pendingRequests.get(script);

  if (pending) {
    return pending;
  }

  const request = searchDictionaryWords({
    script,
    limit: DEFAULT_SCRIPT_WORD_LIMIT,
    offset: 0
  })
    .then(({ items, page }) => {
      wordCache.set(script, {
        words: items,
        page
      });
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
  const [words, setWords] = useState<WordItem[]>(() => wordCache.get(script)?.words ?? []);
  const [page, setPage] = useState<DictionaryWordPage>(() =>
    wordCache.get(script)?.page ?? {
      total: 0,
      limit: DEFAULT_SCRIPT_WORD_LIMIT,
      offset: 0,
      hasMore: false
    }
  );
  const [loading, setLoading] = useState(!wordCache.has(script));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    setError(null);
    setLoading(!wordCache.has(script));

    searchDictionaryWords({
      script,
      limit: DEFAULT_SCRIPT_WORD_LIMIT,
      offset: 0
    })
      .then((response) => {
        if (!isActive) {
          return;
        }

        wordCache.set(script, {
          words: response.items,
          page: response.page
        });
        setWords(response.items);
        setPage(response.page);
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

  return { words, page, loading, error };
};

export const useDictionaryWordPacks = (script: ScriptType) => {
  const [packs, setPacks] = useState<DictionaryWordPack[]>(() => wordPackCache.get(script) ?? []);
  const [loading, setLoading] = useState(!wordPackCache.has(script));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    setError(null);
    setLoading(!wordPackCache.has(script));

    const cached = wordPackCache.get(script);

    if (cached) {
      setPacks(cached);
      return () => {
        isActive = false;
      };
    }

    const pending = pendingWordPackRequests.get(script);

    if (pending) {
      pending
        .then((items) => {
          if (!isActive) {
            return;
          }

          setPacks(items);
          setLoading(false);
        })
        .catch((requestError: unknown) => {
          if (!isActive) {
            return;
          }

          const message =
            requestError instanceof Error ? requestError.message : 'Failed to load word packs.';
          setError(message);
          setLoading(false);
        });

      return () => {
        isActive = false;
      };
    }

    const request = listDictionaryWordPacks(script)
      .then((items) => {
        wordPackCache.set(script, items);
        pendingWordPackRequests.delete(script);
        return items;
      })
      .catch((requestError) => {
        pendingWordPackRequests.delete(script);
        throw requestError;
      });

    pendingWordPackRequests.set(script, request);

    request
      .then((items) => {
        if (!isActive) {
          return;
        }

        setPacks(items);
        setLoading(false);
      })
      .catch((requestError: unknown) => {
        if (!isActive) {
          return;
        }

        const message =
          requestError instanceof Error ? requestError.message : 'Failed to load word packs.';
        setError(message);
        setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [script]);

  return {
    packs,
    loading,
    error
  };
};

export const useDictionaryWordSearch = ({
  script,
  query,
  mode,
  level,
  packId,
  limit = 10,
  offset = 0,
  enabled = true
}: DictionaryWordSearchParams) => {
  const [words, setWords] = useState<WordItem[]>([]);
  const [page, setPage] = useState<DictionaryWordPage>({
    total: 0,
    limit,
    offset,
    hasMore: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setWords([]);
      setPage({
        total: 0,
        limit,
        offset,
        hasMore: false
      });
      setLoading(false);
      setError(null);
      return;
    }

    let isActive = true;

    setLoading(true);
    setError(null);

    searchDictionaryWords({
      script,
      query,
      mode,
      level,
      packId,
      limit,
      offset
    })
      .then((response) => {
        if (!isActive) {
          return;
        }

        setWords(response.items);
        setPage(response.page);
        setLoading(false);
      })
      .catch((requestError: unknown) => {
        if (!isActive) {
          return;
        }

        const message =
          requestError instanceof Error ? requestError.message : 'Failed to search dictionary words.';
        setError(message);
        setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [script, query, mode, level, packId, limit, offset, enabled]);

  return {
    words,
    page,
    loading,
    error
  };
};
