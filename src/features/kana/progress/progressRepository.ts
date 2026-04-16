import { KanaItem, KanaScript } from '../domain/kanaItem';
import { KanaProgress } from '../domain/kanaProgress';

export const KANA_PROGRESS_STORAGE_KEY = 'kototsuna.kana.progress';
export const LEGACY_KANA_PROGRESS_STORAGE_KEY = 'kotonoha.kana.progress';

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
