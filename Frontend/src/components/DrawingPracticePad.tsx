import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Stroke } from '../utils/DrawingEvaluator';

export interface DrawingPracticePadRef {
  clear: () => void;
  getStrokes: () => Stroke[];
}

interface DrawingPracticePadProps {
  resetKey: string;
  placeholder?: string;
}

const getStrokeColor = () =>
  document.documentElement.classList.contains('theme-dark')
    ? 'rgba(242,216,214,0.88)'
    : 'rgba(43,36,34,0.82)';

export const DrawingPracticePad = forwardRef<DrawingPracticePadRef, DrawingPracticePadProps>(({
  resetKey,
  placeholder = 'Draw here'
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke>([]);
  const [hasInk, setHasInk] = useState(false);

  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    strokesRef.current = [];
    currentStrokeRef.current = [];
    setHasInk(false);
  };

  useImperativeHandle(ref, () => ({
    clear,
    getStrokes: () => {
      const currentStroke = currentStrokeRef.current;
      return currentStroke.length > 1
        ? [...strokesRef.current, currentStroke]
        : strokesRef.current;
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return undefined;

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const context = canvas.getContext('2d');
      if (context) {
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.lineCap = 'round';
        context.lineJoin = 'round';
      }
      setHasInk(false);
      strokesRef.current = [];
      currentStrokeRef.current = [];
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    clear();
    drawingRef.current = false;
    lastPointRef.current = null;
  }, [resetKey]);

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const point = getPoint(event);
    if (!canvas || !point) return;

    canvas.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    lastPointRef.current = point;
    currentStrokeRef.current = [point];
    setHasInk(true);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const nextPoint = getPoint(event);
    const lastPoint = lastPointRef.current;
    if (!canvas || !context || !nextPoint || !lastPoint) return;

    context.strokeStyle = getStrokeColor();
    context.lineWidth = 9;
    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(nextPoint.x, nextPoint.y);
    context.stroke();
    currentStrokeRef.current = [...currentStrokeRef.current, nextPoint];
    lastPointRef.current = nextPoint;
  };

  const stopDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas?.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    if (currentStrokeRef.current.length > 1) {
      strokesRef.current = [...strokesRef.current, currentStrokeRef.current];
    }
    currentStrokeRef.current = [];
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-label={placeholder}
        className="absolute inset-0 h-full w-full touch-none rounded-2xl"
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
        onPointerLeave={stopDrawing}
      />
      {!hasInk && (
        <span className="pointer-events-none select-none text-[9px] uppercase tracking-[0.35em] text-[#2b2422]/18 [.theme-dark_&]:text-white/22">
          {placeholder}
        </span>
      )}
    </>
  );
});

DrawingPracticePad.displayName = 'DrawingPracticePad';
