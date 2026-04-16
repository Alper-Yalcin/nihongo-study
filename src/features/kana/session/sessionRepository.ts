import { StudySession } from '../domain/studySession';

export const KANA_SESSION_STORAGE_KEY = 'kototsuna.kana.sessions';
export const LEGACY_KANA_SESSION_STORAGE_KEY = 'kotonoha.kana.sessions';
export const KANA_PLAY_SESSION_STORAGE_KEY = 'kototsuna.kana.play.sessions';

export interface SessionStorageKeys {
  storageKey: string;
  legacyStorageKeys: string[];
}

export const getSessionStorageKeys = (scope: 'study' | 'play'): SessionStorageKeys =>
  scope === 'play'
    ? {
        storageKey: KANA_PLAY_SESSION_STORAGE_KEY,
        legacyStorageKeys: []
      }
    : {
        storageKey: KANA_SESSION_STORAGE_KEY,
        legacyStorageKeys: [LEGACY_KANA_SESSION_STORAGE_KEY]
      };

export interface SessionRepository {
  list(): StudySession[];
  get(id: string): StudySession | null;
  getActive(): StudySession | null;
  save(session: StudySession, options?: { active?: boolean }): StudySession[];
  setActive(sessionId: string | null): void;
  clear(): void;
}
