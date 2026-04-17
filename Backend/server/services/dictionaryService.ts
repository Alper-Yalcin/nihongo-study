import {
  countWordsByScript,
  DictionaryJlptLevel,
  DictionaryQueryMode,
  DictionaryScript,
  DictionaryWordRow,
  findWordById,
  isDictionaryJlptLevel,
  isDictionaryQueryMode,
  isDictionaryScript,
  searchWordsByScript
} from '../repositories/wordRepository';

export interface DictionaryWord {
  id: string;
  script: DictionaryScript;
  kanji?: string;
  kana: string;
  romaji: string;
  meaning?: string;
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

export interface DictionaryWordsResponse {
  items: DictionaryWord[];
  page: DictionaryWordPage;
}

export interface DictionaryWordPack {
  id: string;
  title: string;
  description: string;
  script: DictionaryScript;
  level?: DictionaryJlptLevel;
  mode?: DictionaryQueryMode;
  query?: string;
  offset: number;
  maxItems: number;
  estimatedCount: number;
}

interface DictionaryWordPackSeed {
  id: string;
  title: string;
  description: string;
  script: DictionaryScript;
  level?: DictionaryJlptLevel;
  mode?: DictionaryQueryMode;
  query?: string;
  offset: number;
  maxItems: number;
}

interface DictionaryWordsQuery {
  script?: string;
  query?: string;
  mode?: string;
  level?: string;
  packId?: string;
  limit?: number;
  offset?: number;
}

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

const WORD_PACK_SEEDS: DictionaryWordPackSeed[] = [
  {
    id: 'hiragana-beginner-core-1',
    title: 'Hiragana Beginner Core 1',
    description: 'Beginner-friendly hiragana words from the first N5 segment.',
    script: 'hiragana',
    level: 'N5',
    offset: 0,
    maxItems: 120
  },
  {
    id: 'hiragana-beginner-core-2',
    title: 'Hiragana Beginner Core 2',
    description: 'Second beginner hiragana segment, still focused on N5 coverage.',
    script: 'hiragana',
    level: 'N5',
    offset: 120,
    maxItems: 120
  },
  {
    id: 'everyday-basics',
    title: 'Everyday Basics',
    description: 'Core everyday vocabulary slice for regular practice sessions.',
    script: 'hiragana',
    level: 'N4',
    offset: 0,
    maxItems: 120
  },
  {
    id: 'katakana-loanwords-basic',
    title: 'Katakana Loanwords Basic',
    description: 'Starter katakana loanword list with practical everyday forms.',
    script: 'katakana',
    level: 'N5',
    offset: 0,
    maxItems: 120
  },
  {
    id: 'food-and-drink',
    title: 'Food and Drink',
    description: 'A curated slice intended for food and drink themed drills.',
    script: 'hiragana',
    level: 'N5',
    offset: 240,
    maxItems: 100
  },
  {
    id: 'travel-and-transport',
    title: 'Travel and Transport',
    description: 'A practical set intended for travel and transport contexts.',
    script: 'katakana',
    level: 'N4',
    offset: 80,
    maxItems: 100
  }
];

export class DictionaryQueryError extends Error {}

const toDictionaryWord = (row: DictionaryWordRow): DictionaryWord => ({
  ...row,
  meaning: row.meaning ?? undefined
});

const clampLimit = (value: number | undefined) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return DEFAULT_LIMIT;
  }

  return Math.max(1, Math.min(MAX_LIMIT, Math.trunc(value)));
};

const clampOffset = (value: number | undefined) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.trunc(value));
};

const normalizeOptionalText = (value: string | undefined) => {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
};

const resolveWordPack = (packId: string | undefined) => {
  if (!packId) {
    return null;
  }

  return WORD_PACK_SEEDS.find((pack) => pack.id === packId) ?? null;
};

const resolveScript = (script: string | undefined, pack: DictionaryWordPackSeed | null): DictionaryScript => {
  const normalizedScript = normalizeOptionalText(script);

  if (pack) {
    if (normalizedScript && normalizedScript !== pack.script) {
      throw new DictionaryQueryError('The provided script does not match the selected pack.');
    }

    return pack.script;
  }

  if (!normalizedScript) {
    throw new DictionaryQueryError('The "script" query parameter is required.');
  }

  if (!isDictionaryScript(normalizedScript)) {
    throw new DictionaryQueryError(`Unsupported script: ${normalizedScript}`);
  }

  return normalizedScript;
};

const resolveMode = (mode: string | undefined, fallback?: DictionaryQueryMode): DictionaryQueryMode => {
  const normalizedMode = normalizeOptionalText(mode);

  if (!normalizedMode) {
    return fallback ?? 'contains';
  }

  if (!isDictionaryQueryMode(normalizedMode)) {
    throw new DictionaryQueryError(`Unsupported mode: ${normalizedMode}`);
  }

  return normalizedMode;
};

const resolveLevel = (level: string | undefined, fallback?: DictionaryJlptLevel) => {
  const normalizedLevel = normalizeOptionalText(level);

  if (!normalizedLevel) {
    return fallback;
  }

  if (!isDictionaryJlptLevel(normalizedLevel)) {
    throw new DictionaryQueryError(`Unsupported level: ${normalizedLevel}`);
  }

  return normalizedLevel;
};

const buildWordPack = (pack: DictionaryWordPackSeed): DictionaryWordPack => {
  const totalForFilter = countWordsByScript(pack.script, {
    query: pack.query,
    mode: pack.mode,
    level: pack.level
  });
  const availableAfterOffset = Math.max(totalForFilter - pack.offset, 0);
  const estimatedCount = Math.min(availableAfterOffset, pack.maxItems);

  return {
    ...pack,
    estimatedCount
  };
};

export const listDictionaryWordPacks = (script?: string): DictionaryWordPack[] => {
  const normalizedScript = normalizeOptionalText(script);

  if (normalizedScript && !isDictionaryScript(normalizedScript)) {
    throw new DictionaryQueryError(`Unsupported script: ${normalizedScript}`);
  }

  return WORD_PACK_SEEDS
    .filter((pack) => !normalizedScript || pack.script === normalizedScript)
    .map(buildWordPack);
};

export const getDictionaryWordById = (wordId: string, script?: string): DictionaryWord | null => {
  const normalizedWordId = wordId.trim();

  if (!normalizedWordId) {
    throw new DictionaryQueryError('Word id is required.');
  }

  const normalizedScript = normalizeOptionalText(script);

  if (normalizedScript && !isDictionaryScript(normalizedScript)) {
    throw new DictionaryQueryError(`Unsupported script: ${normalizedScript}`);
  }

  const resolvedScript =
    normalizedScript && isDictionaryScript(normalizedScript)
      ? normalizedScript
      : undefined;

  const word = findWordById(normalizedWordId, resolvedScript);
  return word ? toDictionaryWord(word) : null;
};

export const getDictionaryWords = ({
  script,
  query,
  mode,
  level,
  packId,
  limit,
  offset
}: DictionaryWordsQuery): DictionaryWordsResponse => {
  const pack = resolveWordPack(normalizeOptionalText(packId));

  if (packId && !pack) {
    throw new DictionaryQueryError(`Unknown packId: ${packId}`);
  }

  const resolvedScript = resolveScript(script, pack);
  const resolvedQuery = normalizeOptionalText(query);
  const resolvedMode = resolveMode(mode, pack?.mode);
  const resolvedLevel = resolveLevel(level, pack?.level);
  const resolvedLimit = clampLimit(limit);
  const requestedOffset = clampOffset(offset);

  const baseOffset = pack?.offset ?? 0;
  const packCap = pack?.maxItems ?? Number.POSITIVE_INFINITY;
  const totalForFilter = countWordsByScript(resolvedScript, {
    query: resolvedQuery,
    mode: resolvedMode,
    level: resolvedLevel
  });
  const availableAfterBaseOffset = Math.max(totalForFilter - baseOffset, 0);
  const total = Number.isFinite(packCap)
    ? Math.min(availableAfterBaseOffset, packCap)
    : availableAfterBaseOffset;

  if (total <= requestedOffset) {
    return {
      items: [],
      page: {
        total,
        limit: resolvedLimit,
        offset: requestedOffset,
        hasMore: false
      }
    };
  }

  const remaining = total - requestedOffset;
  const effectiveLimit = Math.min(resolvedLimit, remaining);
  const searchResult = searchWordsByScript({
    script: resolvedScript,
    query: resolvedQuery,
    mode: resolvedMode,
    level: resolvedLevel,
    limit: effectiveLimit,
    offset: baseOffset + requestedOffset
  });

  const items = searchResult.items.map(toDictionaryWord);

  return {
    items,
    page: {
      total,
      limit: resolvedLimit,
      offset: requestedOffset,
      hasMore: requestedOffset + items.length < total
    }
  };
};
