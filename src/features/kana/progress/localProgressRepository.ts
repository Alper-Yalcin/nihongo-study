import { getKanaItemById, kanaInventory } from '../data/kanaInventory';
import { KanaItem, KanaScript } from '../domain/kanaItem';
import { createInitialKanaProgress, KanaProgress } from '../domain/kanaProgress';
import { KANA_PROGRESS_STORAGE_KEY, ProgressRepository } from './progressRepository';

interface ProgressStoragePayload {
  version: 1;
  entries: KanaProgress[];
  updatedAt: string;
}

const DEFAULT_PAYLOAD: ProgressStoragePayload = {
  version: 1,
  entries: [],
  updatedAt: new Date(0).toISOString()
};

let memoryPayload: ProgressStoragePayload = DEFAULT_PAYLOAD;

const isKanaScript = (value: unknown): value is KanaScript =>
  value === 'hiragana' || value === 'katakana';

const asNullableString = (value: unknown): string | null =>
  typeof value === 'string' ? value : null;

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const readRawValue = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem(KANA_PROGRESS_STORAGE_KEY);
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
    window.localStorage.setItem(KANA_PROGRESS_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Keep the in-memory fallback usable when storage writes fail.
  }
};

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

const readPayload = (): ProgressStoragePayload => {
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

const mergeEntries = (entries: KanaProgress[], nextEntries: KanaProgress[]): KanaProgress[] => {
  const merged = new Map(entries.map((entry) => [entry.kanaId, entry]));

  nextEntries.forEach((entry) => {
    merged.set(entry.kanaId, entry);
  });

  return [...merged.values()];
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

export const localProgressRepository: ProgressRepository = {
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

    return writeEntries(normalizedEntries);
  },

  seedFromInventory(items = kanaInventory) {
    return writeEntries(seedEntries(readPayload().entries, items));
  },

  clear() {
    memoryPayload = DEFAULT_PAYLOAD;

    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.removeItem(KANA_PROGRESS_STORAGE_KEY);
    } catch {
      // Ignore storage clear failures and keep the memory payload reset.
    }
  }
};
