import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Point, Stroke } from '../utils/DrawingEvaluator';
import { DrawingData } from '../types';
import { StrokeGuideOverlay } from './StrokeGuideOverlay';

export interface DrawingCanvasRef {
  clear: () => void;
  getStrokes: () => Stroke[];
}

interface Props {
  guideSymbol?: string; // If provided, shows the symbol in the background
  drawingData?: DrawingData;
  showStrokeOrder?: boolean;
  showDirectionArrows?: boolean;
  showTemplate?: boolean;
  width?: number;
  height?: number;
  onDrawEnd?: () => void;
  disabled?: boolean;
}

export const DrawingCanvas = forwardRef<DrawingCanvasRef, Props>(({ 
  guideSymbol, 
  drawingData,
  showStrokeOrder = false,
  showDirectionArrows = false,
  showTemplate = true,
  width = 280, 
  height = 280, 
  onDrawEnd, 
  disabled = false 
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke>([]);

  useImperativeHandle(ref, () => ({
    clear: () => {
      setStrokes([]);
      setCurrentStroke([]);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    },
    getStrokes: () => strokes
  }));

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setCurrentStroke([{ x, y }]);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#334155';
    }
    canvas.setPointerCapture(e.pointerId);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentStroke(prev => [...prev, { x, y }]);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const endDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke.length > 0) {
      setStrokes(prev => [...prev, currentStroke]);
    }
    setCurrentStroke([]);
    if (onDrawEnd) onDrawEnd();
  };

  return (
    <div style={{ width, height }} className="relative bg-white rounded-xl border-2 border-slate-200 overflow-hidden touch-none shadow-inner">
      {guideSymbol && showTemplate && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 select-none">
          <span style={{ fontSize: `${height * 0.7}px`, lineHeight: 1 }} className="font-jp text-slate-900">
            {guideSymbol}
          </span>
        </div>
      )}
      
      {drawingData && (showStrokeOrder || showDirectionArrows) && (
        <StrokeGuideOverlay
          drawingData={drawingData}
          showStrokeOrder={showStrokeOrder}
          showDirectionArrows={showDirectionArrows}
          width={width}
          height={height}
        />
      )}
      
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`absolute inset-0 touch-none z-20 ${disabled ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={endDrawing}
        onPointerCancel={endDrawing}
        onPointerOut={endDrawing}
      />
    </div>
  );
});
