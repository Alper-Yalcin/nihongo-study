import { getKanaItemById, kanaInventory } from '../data/kanaInventory';
import { KanaItem, KanaScript } from '../domain/kanaItem';
import { createInitialKanaProgress, KanaProgress } from '../domain/kanaProgress';
import {
  KANA_PROGRESS_STORAGE_KEY,
  KANA_PLAY_PROGRESS_STORAGE_KEY,
  LEGACY_KANA_PLAY_PROGRESS_STORAGE_KEY,
  getProgressStorageKeys,
  ProgressRepository,
  ProgressStorageKeys
} from './progressRepository';

interface ProgressStoragePayload {
  version: 1;
  entries: KanaProgress[];
  updatedAt: string;
}

const createDefaultPayload = (): ProgressStoragePayload => ({
  version: 1,
  entries: [],
  updatedAt: new Date(0).toISOString()
});

const isKanaScript = (value: unknown): value is KanaScript =>
  value === 'hiragana' || value === 'katakana';

const asNullableString = (value: unknown): string | null =>
  typeof value === 'string' ? value : null;

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const normalizeEntry = (value: unknown): KanaProgress | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const raw = value as Partial<KanaProgress>;
  const inventoryItem = typeof raw.kanaId === 'string' ? getKanaItemById(raw.kanaId) : null;
  const script = inventoryItem?.script ?? (isKanaScript(raw.script) ? raw.script : null);

  if (!inventoryItem || !script) {
    return null;
  }

  const createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString();
  const baseEntry = createInitialKanaProgress(inventoryItem, createdAt);

  return {
    ...baseEntry,
    state: raw.state ?? baseEntry.state,
    masteryScore: Math.max(0, Math.min(4, Math.round(asNumber(raw.masteryScore, baseEntry.masteryScore)))),
    recognitionScore: asNumber(raw.recognitionScore, baseEntry.recognitionScore),
    typingScore: asNumber(raw.typingScore, baseEntry.typingScore),
    drawingScore: asNumber(raw.drawingScore, baseEntry.drawingScore),
    listeningScore: asNumber(raw.listeningScore, baseEntry.listeningScore),
    timesSeen: asNumber(raw.timesSeen, baseEntry.timesSeen),
    timesCorrect: asNumber(raw.timesCorrect, baseEntry.timesCorrect),
    timesWrong: asNumber(raw.timesWrong, baseEntry.timesWrong),
    lastSeenAt: asNullableString(raw.lastSeenAt),
    lastCorrectAt: asNullableString(raw.lastCorrectAt),
    lastWrongAt: asNullableString(raw.lastWrongAt),
    nextReviewAt: asNullableString(raw.nextReviewAt),
    confusedWith: asStringArray(raw.confusedWith),
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : createdAt
  };
};

const mergeEntries = (entries: KanaProgress[], nextEntries: KanaProgress[]): KanaProgress[] => {
  const merged = new Map(entries.map((entry) => [entry.kanaId, entry]));

  nextEntries.forEach((entry) => {
    merged.set(entry.kanaId, entry);
  });

  return [...merged.values()];
};

const parseIsoTimestamp = (value: string | null) => {
  if (!value) {
    return null;
  }

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

const pickLatestIso = (left: string | null, right: string | null): string | null => {
  if (!left) {
    return right;
  }

  if (!right) {
    return left;
  }

  const leftTimestamp = parseIsoTimestamp(left);
  const rightTimestamp = parseIsoTimestamp(right);

  if (leftTimestamp === null && rightTimestamp === null) {
    return left > right ? left : right;
  }

  if (leftTimestamp === null) {
    return right;
  }

  if (rightTimestamp === null) {
    return left;
  }

  return rightTimestamp > leftTimestamp ? right : left;
};

const pickEarliestIso = (left: string | null, right: string | null): string | null => {
  if (!left) {
    return right;
  }

  if (!right) {
    return left;
  }

  const leftTimestamp = parseIsoTimestamp(left);
  const rightTimestamp = parseIsoTimestamp(right);

  if (leftTimestamp === null && rightTimestamp === null) {
    return left < right ? left : right;
  }

  if (leftTimestamp === null) {
    return right;
  }

  if (rightTimestamp === null) {
    return left;
  }

  return rightTimestamp < leftTimestamp ? right : left;
};

const mergeConfusedWith = (left: string[], right: string[]) =>
  Array.from(new Set([...left, ...right])).slice(0, 6);

const mergeProgressEntriesDeterministically = (
  left: KanaProgress,
  right: KanaProgress
): KanaProgress => {
  const leftUpdatedAt = parseIsoTimestamp(left.updatedAt) ?? Number.NEGATIVE_INFINITY;
  const rightUpdatedAt = parseIsoTimestamp(right.updatedAt) ?? Number.NEGATIVE_INFINITY;
  const base = rightUpdatedAt > leftUpdatedAt ? right : left;

  return {
    ...base,
    masteryScore: Math.max(left.masteryScore, right.masteryScore),
    recognitionScore: Math.max(left.recognitionScore, right.recognitionScore),
    typingScore: Math.max(left.typingScore, right.typingScore),
    drawingScore: Math.max(left.drawingScore, right.drawingScore),
    listeningScore: Math.max(left.listeningScore, right.listeningScore),
    timesSeen: Math.max(left.timesSeen, right.timesSeen),
    timesCorrect: Math.max(left.timesCorrect, right.timesCorrect),
    timesWrong: Math.max(left.timesWrong, right.timesWrong),
    lastSeenAt: pickLatestIso(left.lastSeenAt, right.lastSeenAt),
    lastCorrectAt: pickLatestIso(left.lastCorrectAt, right.lastCorrectAt),
    lastWrongAt: pickLatestIso(left.lastWrongAt, right.lastWrongAt),
    nextReviewAt: pickEarliestIso(left.nextReviewAt, right.nextReviewAt),
    confusedWith: mergeConfusedWith(left.confusedWith, right.confusedWith),
    createdAt: pickEarliestIso(left.createdAt, right.createdAt) ?? base.createdAt,
    updatedAt: pickLatestIso(left.updatedAt, right.updatedAt) ?? base.updatedAt
  };
};

const mergeEntriesDeterministically = (
  entries: KanaProgress[],
  nextEntries: KanaProgress[]
) => {
  const merged = new Map(entries.map((entry) => [entry.kanaId, entry]));

  nextEntries.forEach((entry) => {
    const current = merged.get(entry.kanaId);

    if (!current) {
      merged.set(entry.kanaId, entry);
      return;
    }

    merged.set(entry.kanaId, mergeProgressEntriesDeterministically(current, entry));
  });

  return [...merged.values()].sort((left, right) => left.kanaId.localeCompare(right.kanaId));
};

const seedEntries = (entries: KanaProgress[], items: KanaItem[]): KanaProgress[] => {
  const seededMap = new Map(entries.map((entry) => [entry.kanaId, entry]));

  items.forEach((item) => {
    if (!seededMap.has(item.id)) {
      seededMap.set(item.id, createInitialKanaProgress(item));
    }
  });

  return [...seededMap.values()];
};

export const createLocalProgressRepository = (
  storageKeys: ProgressStorageKeys
): ProgressRepository => {
  const defaultPayload = createDefaultPayload();
  let memoryPayload: ProgressStoragePayload = defaultPayload;

  const readRawValue = (): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const currentValue = window.localStorage.getItem(storageKeys.storageKey);

      if (currentValue !== null) {
        return currentValue;
      }

      for (const legacyKey of storageKeys.legacyStorageKeys) {
        const legacyValue = window.localStorage.getItem(legacyKey);

        if (legacyValue !== null) {
          window.localStorage.setItem(storageKeys.storageKey, legacyValue);
          return legacyValue;
        }
      }

      return null;
    } catch {
      return null;
    }
  };

  const writeRawValue = (payload: ProgressStoragePayload) => {
    memoryPayload = payload;

    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(storageKeys.storageKey, JSON.stringify(payload));
    } catch {
      // Keep the in-memory fallback usable when storage writes fail.
    }
  };

  const readPayloadFromStorageKey = (storageKey: string): ProgressStoragePayload | null => {
    if (typeof window === 'undefined') {
      return null;
    }

    const rawValue = window.localStorage.getItem(storageKey);

    if (rawValue === null) {
      return null;
    }

    try {
      return normalizePayload(JSON.parse(rawValue));
    } catch {
      return null;
    }
  };

  const normalizePayload = (value: unknown): ProgressStoragePayload => {
    if (!value || typeof value !== 'object') {
      return memoryPayload;
    }

    const raw = value as Partial<ProgressStoragePayload>;
    const normalizedEntries = Array.isArray(raw.entries)
      ? raw.entries
          .map(normalizeEntry)
          .filter((entry): entry is KanaProgress => entry !== null)
          .sort((left, right) => left.kanaId.localeCompare(right.kanaId))
      : memoryPayload.entries;

    return {
      version: 1,
      entries: normalizedEntries,
      updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString()
    };
  };

  const migrateLegacyPlayProgressIfNeeded = () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (storageKeys.storageKey !== KANA_PROGRESS_STORAGE_KEY) {
      return;
    }

    const playPayload = readPayloadFromStorageKey(KANA_PLAY_PROGRESS_STORAGE_KEY);
    const legacyPlayPayload = readPayloadFromStorageKey(LEGACY_KANA_PLAY_PROGRESS_STORAGE_KEY);

    if (!playPayload && !legacyPlayPayload) {
      return;
    }

    const canonicalPayload =
      readPayloadFromStorageKey(storageKeys.storageKey) ?? memoryPayload;

    let mergedEntries = canonicalPayload.entries;

    if (playPayload) {
      mergedEntries = mergeEntriesDeterministically(mergedEntries, playPayload.entries);
    }

    if (legacyPlayPayload) {
      mergedEntries = mergeEntriesDeterministically(mergedEntries, legacyPlayPayload.entries);
    }

    writeRawValue({
      version: 1,
      entries: mergedEntries,
      updatedAt: new Date().toISOString()
    });

    try {
      window.localStorage.removeItem(KANA_PLAY_PROGRESS_STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_KANA_PLAY_PROGRESS_STORAGE_KEY);
    } catch {
      // Ignore remove failures and keep canonical payload as source of truth.
    }
  };

  const readPayload = (): ProgressStoragePayload => {
    migrateLegacyPlayProgressIfNeeded();

    const rawValue = readRawValue();

    if (!rawValue) {
      return memoryPayload;
    }

    try {
      const parsed = JSON.parse(rawValue);
      const payload = normalizePayload(parsed);
      memoryPayload = payload;
      return payload;
    } catch {
      return memoryPayload;
    }
  };

  const writeEntries = (entries: KanaProgress[]): KanaProgress[] => {
    const payload: ProgressStoragePayload = {
      version: 1,
      entries: [...entries].sort((left, right) => left.kanaId.localeCompare(right.kanaId)),
      updatedAt: new Date().toISOString()
    };

    writeRawValue(payload);
    return payload.entries;
  };

  return {
    list() {
      return readPayload().entries;
    },

    listByScript(script) {
      return readPayload().entries.filter((entry) => entry.script === script);
    },

    get(kanaId) {
      return readPayload().entries.find((entry) => entry.kanaId === kanaId) ?? null;
    },

    save(entry) {
      return writeEntries(mergeEntries(readPayload().entries, [normalizeEntry(entry) ?? entry]));
    },

    saveMany(entries) {
      const normalizedEntries = entries
        .map(normalizeEntry)
        .filter((entry): entry is KanaProgress => entry !== null);

      return writeEntries(mergeEntries(readPayload().entries, normalizedEntries));
    },

    replaceAll(entries) {
      const normalizedEntries = entries
        .map(normalizeEntry)
        .filter((entry): entry is KanaProgress => entry !== null);

      return writeEntries(
        [...normalizedEntries].sort((left, right) => left.kanaId.localeCompare(right.kanaId))
      );
    },

    seedFromInventory(items = kanaInventory) {
      return writeEntries(seedEntries(readPayload().entries, items));
    },

    clear() {
      memoryPayload = createDefaultPayload();

      if (typeof window === 'undefined') {
        return;
      }

      try {
        window.localStorage.removeItem(storageKeys.storageKey);

        storageKeys.legacyStorageKeys.forEach((legacyKey) => {
          window.localStorage.removeItem(legacyKey);
        });
      } catch {
        // Ignore storage clear failures and keep the memory payload reset.
      }
    }
  };
};

export const localProgressRepository = createLocalProgressRepository(
  getProgressStorageKeys('study')
);
