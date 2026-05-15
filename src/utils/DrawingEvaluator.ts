import { generatedKanaDrawingGuides } from '../letters/data/generatedKanaDrawingGuides';
import { Character, DrawingData, GuidePath } from '../types';

export type Point = { x: number; y: number };
export type Stroke = Point[];
export type DrawingEvaluationTolerance = 'standard' | 'practice';
export type GuideImageLayout = {
  image: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  canvasWidth: number;
  canvasHeight: number;
};

interface DrawingEvaluationOptions {
  tolerance?: DrawingEvaluationTolerance;
  guideImageLayout?: GuideImageLayout | null;
}

type Rect = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
};

type Matrix = [number, number, number, number, number, number];

type SampledStroke = {
  points: Point[];
  length: number;
  centroid: Point;
};

type RasterMask = {
  pixels: Uint8Array;
  dilatedPixels: Uint8Array;
  count: number;
  bounds: Rect | null;
};

const SVG_NS = 'http://www.w3.org/2000/svg';
const DEFAULT_VIEWBOX_SIZE = 300;
const MIN_STROKE_LENGTH_PX = 6;
const MIN_DRAWING_SIZE_PX = 10;
const MIN_SAMPLE_COUNT = 18;
const MAX_SAMPLE_COUNT = 60;
const VISIBLE_POINT_PADDING_RATIO = 0.08;
const IMAGE_MASK_MIN_ALPHA = 24;
const IMAGE_MASK_MAX_RGB = 92;
const TEMPLATE_DILATION_RADIUS = 12;
const USER_DILATION_RADIUS = 12;
const USER_MASK_LINE_WIDTH = 12;
const SCORE_THRESHOLDS: Record<
  DrawingEvaluationTolerance,
  { maxStrokeScore: number; maxAverageScore: number }
> = {
  standard: {
    maxStrokeScore: 0.98,
    maxAverageScore: 0.86,
  },
  practice: {
    maxStrokeScore: 1.2,
    maxAverageScore: 1.02,
  },
};
const IMAGE_SCORE_THRESHOLDS: Record<
  DrawingEvaluationTolerance,
  { minPrecision: number; minRecall: number }
> = {
  standard: {
    minPrecision: 0.48,
    minRecall: 0.28,
  },
  practice: {
    minPrecision: 0.4,
    minRecall: 0.22,
  },
};
const GUIDE_IMAGE_MASK_CACHE = new Map<string, RasterMask>();

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const average = (values: number[]) =>
  values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;

const distance = (left: Point, right: Point) => Math.hypot(left.x - right.x, left.y - right.y);

const interpolate = (from: Point, to: Point, ratio: number): Point => ({
  x: from.x + (to.x - from.x) * ratio,
  y: from.y + (to.y - from.y) * ratio,
});

const getStrokeLength = (stroke: Stroke) => {
  let total = 0;

  for (let index = 1; index < stroke.length; index += 1) {
    total += distance(stroke[index - 1], stroke[index]);
  }

  return total;
};

const getBounds = (points: Point[]): Rect | null => {
  if (points.length === 0) {
    return null;
  }

  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;

  points.forEach((point) => {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  });

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

const getCentroid = (points: Point[]): Point => {
  if (points.length === 0) {
    return { x: 0, y: 0 };
  }

  const total = points.reduce(
    (accumulator, point) => ({
      x: accumulator.x + point.x,
      y: accumulator.y + point.y,
    }),
    { x: 0, y: 0 }
  );

  return {
    x: total.x / points.length,
    y: total.y / points.length,
  };
};

const createSampledStroke = (points: Point[]): SampledStroke => ({
  points,
  length: getStrokeLength(points),
  centroid: getCentroid(points),
});

const getMaskBounds = (pixels: Uint8Array, width: number, height: number): Rect | null => {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let index = 0; index < pixels.length; index += 1) {
    if (!pixels[index]) {
      continue;
    }

    const x = index % width;
    const y = Math.floor(index / width);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  if (maxX < minX || maxY < minY) {
    return null;
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
};

const dilateMask = (pixels: Uint8Array, width: number, height: number, radius: number) => {
  if (radius <= 0) {
    return pixels.slice();
  }

  const dilated = new Uint8Array(pixels.length);
  const offsets: Array<{ x: number; y: number }> = [];

  for (let y = -radius; y <= radius; y += 1) {
    for (let x = -radius; x <= radius; x += 1) {
      if (x * x + y * y <= radius * radius) {
        offsets.push({ x, y });
      }
    }
  }

  for (let index = 0; index < pixels.length; index += 1) {
    if (!pixels[index]) {
      continue;
    }

    const originX = index % width;
    const originY = Math.floor(index / width);

    offsets.forEach(({ x, y }) => {
      const nextX = originX + x;
      const nextY = originY + y;

      if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) {
        return;
      }

      dilated[nextY * width + nextX] = 1;
    });
  }

  return dilated;
};

const countMaskPixels = (pixels: Uint8Array) =>
  pixels.reduce((total, value) => total + (value ? 1 : 0), 0);

const countMaskOverlap = (left: Uint8Array, right: Uint8Array) => {
  let overlap = 0;

  for (let index = 0; index < left.length; index += 1) {
    if (left[index] && right[index]) {
      overlap += 1;
    }
  }

  return overlap;
};

const createRasterMask = (
  pixels: Uint8Array,
  width: number,
  height: number,
  dilationRadius: number
): RasterMask => ({
  pixels,
  dilatedPixels: dilateMask(pixels, width, height, dilationRadius),
  count: countMaskPixels(pixels),
  bounds: getMaskBounds(pixels, width, height),
});

const getGuideImageMaskKey = (layout: GuideImageLayout) =>
  [
    layout.image.currentSrc || layout.image.src,
    layout.canvasWidth,
    layout.canvasHeight,
    layout.x.toFixed(2),
    layout.y.toFixed(2),
    layout.width.toFixed(2),
    layout.height.toFixed(2),
  ].join('|');

const getGuideImageMask = (layout: GuideImageLayout): RasterMask | null => {
  if (typeof document === 'undefined' || !layout.image.complete || layout.image.naturalWidth === 0) {
    return null;
  }

  const cacheKey = getGuideImageMaskKey(layout);
  const cachedMask = GUIDE_IMAGE_MASK_CACHE.get(cacheKey);

  if (cachedMask) {
    return cachedMask;
  }

  const canvas = document.createElement('canvas');
  canvas.width = layout.canvasWidth;
  canvas.height = layout.canvasHeight;

  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) {
    return null;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(layout.image, layout.x, layout.y, layout.width, layout.height);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = new Uint8Array(canvas.width * canvas.height);

  for (let index = 0; index < pixels.length; index += 1) {
    const offset = index * 4;
    const red = imageData.data[offset];
    const green = imageData.data[offset + 1];
    const blue = imageData.data[offset + 2];
    const alpha = imageData.data[offset + 3];

    if (
      alpha >= IMAGE_MASK_MIN_ALPHA &&
      red <= IMAGE_MASK_MAX_RGB &&
      green <= IMAGE_MASK_MAX_RGB &&
      blue <= IMAGE_MASK_MAX_RGB
    ) {
      pixels[index] = 1;
    }
  }

  const rasterMask = createRasterMask(
    pixels,
    canvas.width,
    canvas.height,
    TEMPLATE_DILATION_RADIUS
  );

  if (rasterMask.count === 0) {
    return null;
  }

  GUIDE_IMAGE_MASK_CACHE.set(cacheKey, rasterMask);
  return rasterMask;
};

const renderStrokeMask = (
  strokes: Stroke[],
  width: number,
  height: number
): RasterMask | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) {
    return null;
  }

  context.clearRect(0, 0, width, height);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.lineWidth = USER_MASK_LINE_WIDTH;
  context.strokeStyle = '#000';

  strokes.forEach((stroke) => {
    if (stroke.length === 0) {
      return;
    }

    context.beginPath();
    context.moveTo(stroke[0].x, stroke[0].y);

    for (let index = 1; index < stroke.length; index += 1) {
      context.lineTo(stroke[index].x, stroke[index].y);
    }

    context.stroke();
  });

  const imageData = context.getImageData(0, 0, width, height);
  const pixels = new Uint8Array(width * height);

  for (let index = 0; index < pixels.length; index += 1) {
    if (imageData.data[index * 4 + 3] > 0) {
      pixels[index] = 1;
    }
  }

  const rasterMask = createRasterMask(pixels, width, height, USER_DILATION_RADIUS);
  return rasterMask.count > 0 ? rasterMask : null;
};

const resampleStroke = (stroke: Stroke, sampleCount: number): Point[] => {
  if (stroke.length === 0) {
    return [];
  }

  if (stroke.length === 1 || sampleCount <= 1) {
    return Array.from({ length: sampleCount }, () => ({ ...stroke[0] }));
  }

  const segmentLengths: number[] = [];
  let totalLength = 0;

  for (let index = 1; index < stroke.length; index += 1) {
    const length = distance(stroke[index - 1], stroke[index]);
    segmentLengths.push(length);
    totalLength += length;
  }

  if (totalLength === 0) {
    return Array.from({ length: sampleCount }, () => ({ ...stroke[0] }));
  }

  const resampled: Point[] = [];
  let currentSegment = 0;
  let traversed = 0;

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const targetDistance =
      sampleCount === 1 ? 0 : (totalLength * sampleIndex) / (sampleCount - 1);

    while (
      currentSegment < segmentLengths.length - 1 &&
      traversed + segmentLengths[currentSegment] < targetDistance
    ) {
      traversed += segmentLengths[currentSegment];
      currentSegment += 1;
    }

    const segmentLength = segmentLengths[currentSegment] || 1;
    const localDistance = targetDistance - traversed;
    const ratio = clamp(localDistance / segmentLength, 0, 1);

    resampled.push(interpolate(stroke[currentSegment], stroke[currentSegment + 1], ratio));
  }

  return resampled;
};

const angleDifference = (left: number, right: number) => {
  let delta = Math.abs(left - right);

  while (delta > Math.PI) {
    delta = Math.abs(delta - Math.PI * 2);
  }

  return delta;
};

const getAngles = (points: Point[]) => {
  const angles: number[] = [];

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    angles.push(Math.atan2(current.y - previous.y, current.x - previous.x));
  }

  return angles;
};

const identityMatrix = (): Matrix => [1, 0, 0, 1, 0, 0];

const multiplyMatrices = (left: Matrix, right: Matrix): Matrix => [
  left[0] * right[0] + left[2] * right[1],
  left[1] * right[0] + left[3] * right[1],
  left[0] * right[2] + left[2] * right[3],
  left[1] * right[2] + left[3] * right[3],
  left[0] * right[4] + left[2] * right[5] + left[4],
  left[1] * right[4] + left[3] * right[5] + left[5],
];

const parseTransform = (transform?: string): Matrix => {
  if (!transform) {
    return identityMatrix();
  }

  const matcher = /(translate|scale)\(([^)]+)\)/g;
  let matrix = identityMatrix();
  let match: RegExpExecArray | null;

  while ((match = matcher.exec(transform)) !== null) {
    const [, type, rawArgs] = match;
    const args = rawArgs
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number);

    if (type === 'translate') {
      const [tx = 0, ty = 0] = args;
      matrix = multiplyMatrices(matrix, [1, 0, 0, 1, tx, ty]);
      continue;
    }

    if (type === 'scale') {
      const [sx = 1, sy = sx] = args;
      matrix = multiplyMatrices(matrix, [sx, 0, 0, sy, 0, 0]);
    }
  }

  return matrix;
};

const applyMatrix = (point: Point, matrix: Matrix): Point => ({
  x: point.x * matrix[0] + point.y * matrix[2] + matrix[4],
  y: point.x * matrix[1] + point.y * matrix[3] + matrix[5],
});

const getCanonicalDrawingData = (expectedChar: Character): DrawingData | null => {
  const inlineDrawingData = expectedChar.drawingData;

  if (inlineDrawingData?.guidePaths?.length) {
    return inlineDrawingData;
  }

  const generatedDrawingData = generatedKanaDrawingGuides[expectedChar.id];

  if (!generatedDrawingData) {
    return inlineDrawingData ?? null;
  }

  const preferredStrokeCount =
    inlineDrawingData?.strokeCount ??
    (inlineDrawingData?.strokeGuides?.length
      ? inlineDrawingData.strokeGuides.length
      : undefined);

  return {
    ...generatedDrawingData,
    strokeCount: preferredStrokeCount ?? generatedDrawingData.strokeCount,
    guidePaths:
      preferredStrokeCount && generatedDrawingData.guidePaths?.length
        ? generatedDrawingData.guidePaths.slice(0, preferredStrokeCount)
        : generatedDrawingData.guidePaths,
  };
};

const sampleGuidePath = (guidePath: GuidePath): SampledStroke | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', guidePath.d);

  let totalLength = 0;

  try {
    totalLength = path.getTotalLength();
  } catch {
    return null;
  }

  if (!Number.isFinite(totalLength) || totalLength <= 0) {
    return null;
  }

  const transform = parseTransform(guidePath.transform);
  const sampleCount = clamp(Math.round(totalLength / 18), MIN_SAMPLE_COUNT, MAX_SAMPLE_COUNT);
  const points: Point[] = [];

  for (let index = 0; index < sampleCount; index += 1) {
    const pointAtLength =
      sampleCount === 1 ? path.getPointAtLength(0) : path.getPointAtLength((totalLength * index) / (sampleCount - 1));

    points.push(applyMatrix({ x: pointAtLength.x, y: pointAtLength.y }, transform));
  }

  return createSampledStroke(points);
};

const sanitizeExpectedStroke = (
  stroke: SampledStroke,
  drawingData: DrawingData
): SampledStroke => {
  const viewBoxWidth = drawingData.viewBoxWidth ?? DEFAULT_VIEWBOX_SIZE;
  const viewBoxHeight = drawingData.viewBoxHeight ?? DEFAULT_VIEWBOX_SIZE;
  const paddingX = viewBoxWidth * VISIBLE_POINT_PADDING_RATIO;
  const paddingY = viewBoxHeight * VISIBLE_POINT_PADDING_RATIO;

  const visiblePoints = stroke.points.filter(
    (point) =>
      point.x >= -paddingX &&
      point.x <= viewBoxWidth + paddingX &&
      point.y >= -paddingY &&
      point.y <= viewBoxHeight + paddingY
  );

  if (visiblePoints.length < Math.max(8, Math.floor(stroke.points.length * 0.35))) {
    return stroke;
  }

  return createSampledStroke(visiblePoints);
};

const getTargetBounds = (expectedStrokes: SampledStroke[], drawingData: DrawingData): Rect | null => {
  if (drawingData.safeZone) {
    const { x, y, width, height } = drawingData.safeZone;
    return {
      minX: x,
      minY: y,
      maxX: x + width,
      maxY: y + height,
      width,
      height,
    };
  }

  const points = expectedStrokes.flatMap((stroke) => stroke.points);
  return getBounds(points);
};

const normalizeUserStrokes = (strokes: Stroke[], targetBounds: Rect): Stroke[] => {
  const points = strokes.flat();
  const sourceBounds = getBounds(points);

  if (!sourceBounds) {
    return [];
  }

  const sourceWidth = Math.max(sourceBounds.width, 1);
  const sourceHeight = Math.max(sourceBounds.height, 1);
  const scale = Math.min(targetBounds.width / sourceWidth, targetBounds.height / sourceHeight);
  const offsetX =
    targetBounds.minX + (targetBounds.width - sourceWidth * scale) / 2 - sourceBounds.minX * scale;
  const offsetY =
    targetBounds.minY + (targetBounds.height - sourceHeight * scale) / 2 - sourceBounds.minY * scale;

  return strokes.map((stroke) =>
    stroke.map((point) => ({
      x: point.x * scale + offsetX,
      y: point.y * scale + offsetY,
    }))
  );
};

const evaluateStroke = (
  userStroke: Stroke,
  expectedStroke: SampledStroke,
  scaleReference: number
) => {
  const resampledUserStroke = resampleStroke(userStroke, expectedStroke.points.length);

  if (resampledUserStroke.length === 0) {
    return Number.POSITIVE_INFINITY;
  }

  const averageDistanceScore =
    average(
      resampledUserStroke.map((point, index) => distance(point, expectedStroke.points[index]))
    ) / scaleReference;

  const startPointScore =
    distance(resampledUserStroke[0], expectedStroke.points[0]) / scaleReference;
  const endPointScore =
    distance(
      resampledUserStroke[resampledUserStroke.length - 1],
      expectedStroke.points[expectedStroke.points.length - 1]
    ) / scaleReference;

  const userAngles = getAngles(resampledUserStroke);
  const expectedAngles = getAngles(expectedStroke.points);
  const angleScore =
    average(
      userAngles.map((angle, index) => angleDifference(angle, expectedAngles[index]) / Math.PI)
    ) || 0;

  const userLength = getStrokeLength(resampledUserStroke);
  const lengthScore = Math.abs(userLength - expectedStroke.length) / Math.max(expectedStroke.length, 1);
  const centroidScore =
    distance(getCentroid(resampledUserStroke), expectedStroke.centroid) / scaleReference;

  return (
    averageDistanceScore * 2.15 +
    ((startPointScore + endPointScore) / 2) * 1.15 +
    angleScore * 1.35 +
    lengthScore * 0.85 +
    centroidScore * 0.8
  );
};

const fallbackHeuristic = (strokes: Stroke[], expectedChar: Character) => {
  if (strokes.length === 0) {
    return false;
  }

  const totalPoints = strokes.reduce((count, stroke) => count + stroke.length, 0);
  const expectedStrokeCount = expectedChar.drawingData?.strokeCount;

  if (expectedStrokeCount && strokes.length !== expectedStrokeCount) {
    return false;
  }

  return totalPoints >= 5;
};

const evaluateAgainstGuideImage = (
  strokes: Stroke[],
  expectedChar: Character,
  tolerance: DrawingEvaluationTolerance,
  guideImageLayout: GuideImageLayout
) => {
  const thresholds = IMAGE_SCORE_THRESHOLDS[tolerance];
  const expectedStrokeCount =
    expectedChar.drawingData?.strokeCount ??
    expectedChar.drawingData?.strokeGuides?.length ??
    expectedChar.drawingData?.guidePaths?.length;

  if (expectedStrokeCount && strokes.length !== expectedStrokeCount) {
    return false;
  }

  const templateMask = getGuideImageMask(guideImageLayout);
  if (!templateMask || !templateMask.bounds) {
    return null;
  }

  const userMask = renderStrokeMask(
    strokes,
    guideImageLayout.canvasWidth,
    guideImageLayout.canvasHeight
  );

  if (!userMask || !userMask.bounds || userMask.count === 0) {
    return false;
  }

  const overlapPrecision = countMaskOverlap(userMask.pixels, templateMask.dilatedPixels);
  const overlapRecall = countMaskOverlap(templateMask.pixels, userMask.dilatedPixels);
  const precision = overlapPrecision / Math.max(userMask.count, 1);
  const recall = overlapRecall / Math.max(templateMask.count, 1);

  return precision >= thresholds.minPrecision && recall >= thresholds.minRecall;
};

export const evaluateDrawing = (
  strokes: Stroke[],
  expectedChar: Character,
  options: DrawingEvaluationOptions = {}
): boolean => {
  const thresholds = SCORE_THRESHOLDS[options.tolerance ?? 'standard'];
  const filteredStrokes = strokes.filter(
    (stroke) => stroke.length >= 2 && getStrokeLength(stroke) >= MIN_STROKE_LENGTH_PX
  );

  if (filteredStrokes.length === 0) {
    return false;
  }

  const userBounds = getBounds(filteredStrokes.flat());
  if (
    !userBounds ||
    userBounds.width < MIN_DRAWING_SIZE_PX ||
    userBounds.height < MIN_DRAWING_SIZE_PX
  ) {
    return false;
  }

  if (options.guideImageLayout) {
    const imageEvaluation = evaluateAgainstGuideImage(
      filteredStrokes,
      expectedChar,
      options.tolerance ?? 'standard',
      options.guideImageLayout
    );

    if (typeof imageEvaluation === 'boolean') {
      return imageEvaluation;
    }
  }

  const drawingData = getCanonicalDrawingData(expectedChar);
  const expectedPaths = drawingData?.guidePaths;

  if (!drawingData || !expectedPaths || expectedPaths.length === 0) {
    return fallbackHeuristic(filteredStrokes, expectedChar);
  }

  if (filteredStrokes.length !== expectedPaths.length) {
    return false;
  }

  const expectedStrokes = expectedPaths
    .map((guidePath) => sampleGuidePath(guidePath))
    .filter((stroke): stroke is SampledStroke => stroke !== null);

  if (expectedStrokes.length !== expectedPaths.length) {
    return fallbackHeuristic(filteredStrokes, expectedChar);
  }

  const sanitizedExpectedStrokes = expectedStrokes.map((stroke) =>
    sanitizeExpectedStroke(stroke, drawingData)
  );

  const targetBounds = getTargetBounds(sanitizedExpectedStrokes, drawingData);
  if (!targetBounds) {
    return fallbackHeuristic(filteredStrokes, expectedChar);
  }

  const normalizedUserStrokes = normalizeUserStrokes(filteredStrokes, targetBounds);
  const scaleReference = Math.max(
    Math.min(targetBounds.width, targetBounds.height),
    drawingData.viewBoxWidth ?? drawingData.viewBoxHeight ?? DEFAULT_VIEWBOX_SIZE
  );

  const strokeScores = normalizedUserStrokes.map((stroke, index) =>
    evaluateStroke(stroke, sanitizedExpectedStrokes[index], scaleReference)
  );

  return (
    strokeScores.every(
      (score) => Number.isFinite(score) && score <= thresholds.maxStrokeScore
    ) &&
    average(strokeScores) <= thresholds.maxAverageScore
  );
};
