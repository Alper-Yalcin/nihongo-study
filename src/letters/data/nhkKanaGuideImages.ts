const FILENAME_OVERRIDES: Record<string, string> = {
  'h-dji': 'ji2',
  'h-dzu': 'zu2',
  'k-dji': 'ji2',
  'k-dzu': 'zu2',
};

const NHK_UNSUPPORTED_KATAKANA_IDS = new Set([
  'k-fa',
  'k-fi',
  'k-fe',
  'k-fo',
  'k-va',
  'k-vi',
  'k-vu',
  'k-ve',
  'k-vo',
  'k-tsa',
  'k-tsi',
  'k-tse',
  'k-tso',
  'k-ti',
  'k-tu',
  'k-che',
  'k-di',
  'k-du',
  'k-she',
  'k-je',
]);

export const getNhkKanaGuideImageSrc = (characterId?: string) => {
  if (!characterId) {
    return undefined;
  }

  if (NHK_UNSUPPORTED_KATAKANA_IDS.has(characterId)) {
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

  return `/images/nhk/${folder}/${filename}.png`;
};

export const getNhkHiraganaGuideImageSrc = (characterId?: string) =>
  characterId?.startsWith('h-') ? getNhkKanaGuideImageSrc(characterId) : undefined;
