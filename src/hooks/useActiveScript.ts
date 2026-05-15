import { KanaScript } from '../features/kana/domain/kanaItem';

export const ACTIVE_SCRIPT_STORAGE_KEY = 'kototsuna.active-script';

export const kanaScripts: KanaScript[] = ['hiragana', 'katakana'];

export const isKanaScript = (value: string | null | undefined): value is KanaScript =>
  value === 'hiragana' || value === 'katakana';

export const resolveActiveScript = (
  pathname: string,
  search: string,
  fallback: KanaScript = 'hiragana'
): KanaScript => {
  if (pathname.includes('/kana/katakana')) {
    return 'katakana';
  }

  if (pathname.includes('/kana/hiragana')) {
    return 'hiragana';
  }

  const searchParams = new URLSearchParams(search);
  const script = searchParams.get('script');

  if (isKanaScript(script)) {
    return script;
  }

  return fallback;
};
