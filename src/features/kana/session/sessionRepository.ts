import { StudySession } from '../domain/studySession';

export const KANA_SESSION_STORAGE_KEY = 'kototsuna.kana.sessions';
export const LEGACY_KANA_SESSION_STORAGE_KEY = 'kotonoha.kana.sessions';

export interface SessionRepository {
  list(): StudySession[];
  get(id: string): StudySession | null;
  getActive(): StudySession | null;
  save(session: StudySession, options?: { active?: boolean }): StudySession[];
  setActive(sessionId: string | null): void;
  clear(): void;
}
