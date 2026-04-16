import { KanaItem, KanaScript } from '../domain/kanaItem';
import { KanaProgress } from '../domain/kanaProgress';

export const KANA_PROGRESS_STORAGE_KEY = 'kototsuna.kana.progress';
export const LEGACY_KANA_PROGRESS_STORAGE_KEY = 'kotonoha.kana.progress';
export const KANA_PLAY_PROGRESS_STORAGE_KEY = 'kototsuna.kana.play.progress';
export const LEGACY_KANA_PLAY_PROGRESS_STORAGE_KEY = 'kotonoha.kana.play.progress';

export type KanaStoreScope = 'study' | 'play';

export interface ProgressStorageKeys {
  storageKey: string;
  legacyStorageKeys: string[];
}

// Canonical source of truth is the study key. Play key is kept only for migration compatibility.
export const getProgressStorageKeys = (scope: KanaStoreScope): ProgressStorageKeys =>
  scope === 'play'
    ? {
        storageKey: KANA_PLAY_PROGRESS_STORAGE_KEY,
        legacyStorageKeys: []
      }
    : {
        storageKey: KANA_PROGRESS_STORAGE_KEY,
        legacyStorageKeys: [LEGACY_KANA_PROGRESS_STORAGE_KEY]
      };

export interface ProgressRepository {
  list(): KanaProgress[];
  listByScript(script: KanaScript): KanaProgress[];
  get(kanaId: string): KanaProgress | null;
  save(entry: KanaProgress): KanaProgress[];
  saveMany(entries: KanaProgress[]): KanaProgress[];
  replaceAll(entries: KanaProgress[]): KanaProgress[];
  seedFromInventory(items: KanaItem[]): KanaProgress[];
  clear(): void;
}
