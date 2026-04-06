const FILENAME_OVERRIDES: Record<string, string> = {
  'h-dji': 'ji2',
  'h-dzu': 'zu2',
  'k-dji': 'ji2',
  'k-dzu': 'zu2',
};

export const getGoogleTranslateKanaAudioSrc = (characterId?: string) => {
  if (!characterId) {
    return undefined;
  }

  const folder = characterId.startsWith('h-')
    ? 'hiragana'
    : characterId.startsWith('k-')
      ? 'katakana'
      : undefined;

  if (!folder) {
    return undefined;
  }

  const filename = FILENAME_OVERRIDES[characterId] ?? characterId.slice(2);

  if (!/^[a-z0-9]+$/.test(filename)) {
    return undefined;
  }

  return `/sounds/google-translate/${folder}/${filename}.mp3`;
};