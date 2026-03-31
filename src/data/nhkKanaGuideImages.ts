const HIRAGANA_FILENAME_OVERRIDES: Record<string, string> = {
  'h-dji': 'ji2',
  'h-dzu': 'zu2',
};

export const getNhkHiraganaGuideImageSrc = (characterId?: string) => {
  if (!characterId?.startsWith('h-')) {
    return undefined;
  }

  const filename = HIRAGANA_FILENAME_OVERRIDES[characterId] ?? characterId.slice(2);

  if (!/^[a-z0-9]+$/.test(filename)) {
    return undefined;
  }

  return `/images/nhk/hiragana/${filename}.png`;
};
