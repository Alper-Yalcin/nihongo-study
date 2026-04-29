import { writeFile } from 'node:fs/promises';
import { Character, DrawingData, StrokeGuide } from '../../Frontend/src/types';
import {
  hiraganaSingleMatrix,
  katakanaExtendedMatrix,
  katakanaSingleMatrix,
} from '../../Frontend/src/data/kana';

type CharacterSeed = {
  id: string;
  symbol: string;
};

const OUTPUT_FILE = new URL('../../Frontend/src/data/generatedKanaDrawingGuides.ts', import.meta.url);
const SOURCE_BASE_URL = 'https://raw.githubusercontent.com/zhengkyl/strokesvg/main/dist';
const GUIDE_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const EXTRA_CHARACTERS: CharacterSeed[] = [
  { id: 'h-small-ya', symbol: 'ゃ' },
  { id: 'h-small-yu', symbol: 'ゅ' },
  { id: 'h-small-yo', symbol: 'ょ' },
  { id: 'k-small-a', symbol: 'ァ' },
  { id: 'k-small-i', symbol: 'ィ' },
  { id: 'k-small-u', symbol: 'ゥ' },
  { id: 'k-small-e', symbol: 'ェ' },
  { id: 'k-small-o', symbol: 'ォ' },
  { id: 'k-small-ya', symbol: 'ャ' },
  { id: 'k-small-yu', symbol: 'ュ' },
  { id: 'k-small-yo', symbol: 'ョ' },
];

const PARAM_COUNTS: Record<string, number> = {
  A: 7,
  C: 6,
  H: 1,
  L: 2,
  M: 2,
  Q: 4,
  S: 4,
  T: 2,
  V: 1,
  Z: 0,
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const isSingleKana = (character: Character | null): character is Character =>
  Boolean(character && Array.from(character.symbol).length === 1);

const collectCharacters = (): CharacterSeed[] => {
  const seen = new Map<string, CharacterSeed>();
  const push = (entry: CharacterSeed) => {
    if (!seen.has(entry.id)) {
      seen.set(entry.id, entry);
    }
  };

  [hiraganaSingleMatrix, katakanaSingleMatrix, katakanaExtendedMatrix].forEach((matrix) => {
    matrix.flat().filter(isSingleKana).forEach((character) => {
      push({ id: character.id, symbol: character.symbol });
    });
  });

  EXTRA_CHARACTERS.forEach(push);

  return [...seen.values()].sort((left, right) => left.id.localeCompare(right.id));
};

const tokenizePathData = (pathData: string): string[] =>
  pathData.match(/[AaCcHhLlMmQqSsTtVvZz]|[-+]?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?/g) ?? [];

const getPathEndpoints = (pathData: string) => {
  const tokens = tokenizePathData(pathData);
  let index = 0;
  let command = '';
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;
  let firstPoint: { x: number; y: number } | null = null;

  const hasMoreNumbers = () => index < tokens.length && !/^[AaCcHhLlMmQqSsTtVvZz]$/.test(tokens[index]);
  const readNumber = () => Number(tokens[index++]);

  while (index < tokens.length) {
    const token = tokens[index];
    if (/^[AaCcHhLlMmQqSsTtVvZz]$/.test(token)) {
      command = token;
      index += 1;
      if (command === 'Z' || command === 'z') {
        currentX = startX;
        currentY = startY;
      }
      continue;
    }

    if (!command) {
      throw new Error(`Invalid SVG path, missing command: ${pathData}`);
    }

    const upperCommand = command.toUpperCase();
    const isRelative = command !== upperCommand;

    if (upperCommand === 'M') {
      while (hasMoreNumbers()) {
        const x = readNumber();
        const y = readNumber();
        currentX = isRelative ? currentX + x : x;
        currentY = isRelative ? currentY + y : y;
        if (!firstPoint) {
          firstPoint = { x: currentX, y: currentY };
          startX = currentX;
          startY = currentY;
        }
        command = isRelative ? 'l' : 'L';
      }
      continue;
    }

    const paramCount = PARAM_COUNTS[upperCommand];
    while (hasMoreNumbers()) {
      const params = Array.from({ length: paramCount }, () => readNumber());
      switch (upperCommand) {
        case 'L':
        case 'T':
          currentX = isRelative ? currentX + params[0] : params[0];
          currentY = isRelative ? currentY + params[1] : params[1];
          break;
        case 'H':
          currentX = isRelative ? currentX + params[0] : params[0];
          break;
        case 'V':
          currentY = isRelative ? currentY + params[0] : params[0];
          break;
        case 'C':
          currentX = isRelative ? currentX + params[4] : params[4];
          currentY = isRelative ? currentY + params[5] : params[5];
          break;
        case 'S':
        case 'Q':
          currentX = isRelative ? currentX + params[2] : params[2];
          currentY = isRelative ? currentY + params[3] : params[3];
          break;
        case 'A':
          currentX = isRelative ? currentX + params[5] : params[5];
          currentY = isRelative ? currentY + params[6] : params[6];
          break;
        default:
          throw new Error(`Unsupported SVG command ${command} in ${pathData}`);
      }
    }
  }

  if (!firstPoint) {
    throw new Error(`SVG path has no start point: ${pathData}`);
  }

  return {
    start: firstPoint,
    end: { x: currentX, y: currentY },
  };
};

const parseSvg = (svg: string) => {
  const viewBoxMatch = svg.match(/viewBox="([\d.\s-]+)"/);
  const viewBoxParts = viewBoxMatch?.[1]?.trim().split(/\s+/).map(Number);

  if (!viewBoxParts || viewBoxParts.length !== 4) {
    throw new Error('Missing or invalid viewBox in strokesvg source');
  }

  const [, , viewBoxWidth, viewBoxHeight] = viewBoxParts;
  const strokesBlock = svg.match(/<g data-strokesvg="strokes"[\s\S]*?>([\s\S]*?)<\/g>/)?.[1];

  if (!strokesBlock) {
    throw new Error('Missing strokes block in strokesvg source');
  }

  const guidePaths = [...strokesBlock.matchAll(/<path[^>]* d="([^"]+)"/g)].map((match) => ({
    d: match[1],
  }));

  if (guidePaths.length === 0) {
    throw new Error('No stroke paths found in strokesvg source');
  }

  const strokeGuides: StrokeGuide[] = guidePaths.map((path, strokeIndex) => {
    const { start, end } = getPathEndpoints(path.d);
    return {
      index: strokeIndex + 1,
      labelX: clamp(start.x - 42, 48, viewBoxWidth - 48),
      labelY: clamp(start.y - 32, 48, viewBoxHeight - 48),
      arrowFrom: start,
      arrowTo: end,
      color: GUIDE_COLORS[strokeIndex % GUIDE_COLORS.length],
    };
  });

  return {
    viewBoxWidth,
    viewBoxHeight,
    strokeCount: guidePaths.length,
    guidePaths,
    strokeGuides,
  } satisfies DrawingData;
};

const fetchStrokeSvg = async (entry: CharacterSeed) => {
  const folder = entry.id.startsWith('h-') ? 'hiragana' : 'katakana';
  const response = await fetch(`${SOURCE_BASE_URL}/${folder}/${encodeURIComponent(entry.symbol)}.svg`);

  if (!response.ok) {
    throw new Error(`Failed to fetch strokesvg for ${entry.id} (${entry.symbol}): ${response.status}`);
  }

  return response.text();
};

const main = async () => {
  const entries = collectCharacters();
  const generated: Record<string, DrawingData> = {};

  for (const entry of entries) {
    const svg = await fetchStrokeSvg(entry);
    generated[entry.id] = parseSvg(svg);
  }

  const output = `import { DrawingData } from '../types';\n\nexport const generatedKanaDrawingGuides: Record<string, DrawingData> = ${JSON.stringify(generated, null, 2)};\n`;

  await writeFile(OUTPUT_FILE, output, 'utf8');
  console.log(`Generated ${Object.keys(generated).length} kana drawing guides.`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
