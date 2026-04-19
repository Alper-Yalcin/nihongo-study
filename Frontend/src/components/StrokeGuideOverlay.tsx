import React from 'react';
import { DrawingData, StrokeGuide } from '../types';

interface Props {
  drawingData?: DrawingData;
  showGuidePaths?: boolean;
  showStrokeOrder: boolean;
  showDirectionArrows: boolean;
  width: number;
  height: number;
}

type Point = {
  x: number;
  y: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const scalePoint = (point: Point, scaleX: number, scaleY: number): Point => ({
  x: point.x * scaleX,
  y: point.y * scaleY,
});

const getRenderedArrow = (
  guide: StrokeGuide,
  scaleX: number,
  scaleY: number,
  width: number,
  height: number
) => {
  const start = scalePoint(guide.arrowFrom, scaleX, scaleY);
  const end = scalePoint(guide.arrowTo, scaleX, scaleY);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);

  if (length < 1) {
    return null;
  }

  const unitX = dx / length;
  const unitY = dy / length;
  const canvasUnit = Math.min(width, height);
  const headGap = clamp(canvasUnit * 0.04, 10, 16);
  const maxLength = clamp(canvasUnit * 0.18, 34, 58);
  const preferredLength = clamp(length * 0.58, 22, maxLength);
  const availableLength = Math.max(length - headGap, 12);
  const renderLength = Math.min(preferredLength, availableLength);

  const to = {
    x: end.x - unitX * headGap,
    y: end.y - unitY * headGap,
  };

  const from = {
    x: to.x - unitX * renderLength,
    y: to.y - unitY * renderLength,
  };

  return { from, to };
};

export const StrokeGuideOverlay: React.FC<Props> = ({
  drawingData,
  showGuidePaths = false,
  showStrokeOrder,
  showDirectionArrows,
  width,
  height
}) => {
  if (
    !drawingData ||
    ((!drawingData.strokeGuides || drawingData.strokeGuides.length === 0) &&
      (!drawingData.guidePaths || drawingData.guidePaths.length === 0))
  ) {
    return null;
  }

  const {
    viewBoxWidth = 300,
    viewBoxHeight = 300,
    strokeGuides = [],
    guidePaths = [],
  } = drawingData;

  // Calculate scaling factors
  const scaleX = width / viewBoxWidth;
  const scaleY = height / viewBoxHeight;

  return (
    <svg
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ overflow: 'visible' }}
    >
      {showGuidePaths && guidePaths.length > 0 && (
        <g
          transform={`scale(${scaleX} ${scaleY})`}
          fill="none"
          stroke="var(--kt-ink-muted)"
          strokeWidth={Math.round(Math.min(viewBoxWidth, viewBoxHeight) * 0.08)}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.18}
        >
          {guidePaths.map((guidePath, index) => (
            <path
              key={`guide-path-${index}`}
              d={guidePath.d}
              transform={guidePath.transform}
            />
          ))}
        </g>
      )}

      <defs>
        {/* Define arrowheads for different colors */}
        {strokeGuides.map((guide) => {
          const color = guide.color || '#ef4444';
          const markerId = `arrowhead-${guide.index}-${color.replace('#', '')}`;
          return (
            <marker
              key={markerId}
              id={markerId}
              markerWidth="8"
              markerHeight="6"
              refX="7.2"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill={color} />
            </marker>
          );
        })}
      </defs>

      {strokeGuides.map((guide) => {
        const color = guide.color || '#ef4444';
        const markerId = `url(#arrowhead-${guide.index}-${color.replace('#', '')})`;
        const renderedArrow = getRenderedArrow(guide, scaleX, scaleY, width, height);

        return (
          <g key={guide.index}>
            {/* Direction Arrow */}
            {showDirectionArrows && renderedArrow && (
              <line
                x1={renderedArrow.from.x}
                y1={renderedArrow.from.y}
                x2={renderedArrow.to.x}
                y2={renderedArrow.to.y}
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                markerEnd={markerId}
                opacity={0.7}
              />
            )}

            {/* Stroke Order Number */}
            {showStrokeOrder && (
              <g transform={`translate(${guide.labelX * scaleX}, ${guide.labelY * scaleY})`}>
                <circle cx="0" cy="0" r="10" fill={color} opacity={0.9} />
                <text
                  x="0"
                  y="0"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {guide.index}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};
