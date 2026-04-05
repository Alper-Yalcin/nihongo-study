import { generatedKanaDrawingGuides } from '../data/generatedKanaDrawingGuides';
import { Character, DrawingData, GuidePath } from '../types';

export type Point = { x: number; y: number };
export type Stroke = Point[];
export type DrawingEvaluationTolerance = 'standard' | 'practice';

interface DrawingEvaluationOptions {
  tolerance?: DrawingEvaluationTolerance;
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

const SVG_NS = 'http://www.w3.org/2000/svg';
const DEFAULT_VIEWBOX_SIZE = 300;
const MIN_STROKE_LENGTH_PX = 6;
const MIN_DRAWING_SIZE_PX = 10;
const MIN_SAMPLE_COUNT = 18;
const MAX_SAMPLE_COUNT = 60;
const VISIBLE_POINT_PADDING_RATIO = 0.08;
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
  if (expectedChar.drawingData?.guidePaths?.length) {
    return expectedChar.drawingData;
  }

  return generatedKanaDrawingGuides[expectedChar.id] ?? expectedChar.drawingData ?? null;
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
