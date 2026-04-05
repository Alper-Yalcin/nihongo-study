import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { GuideImageLayout, Point, Stroke } from '../utils/DrawingEvaluator';
import { DrawingData } from '../types';
import { StrokeGuideOverlay } from './StrokeGuideOverlay';

export interface DrawingCanvasRef {
  clear: () => void;
  getStrokes: () => Stroke[];
  getGuideImageLayout: () => GuideImageLayout | null;
}

interface Props {
  guideSymbol?: string; // If provided, shows the symbol in the background
  guideImageSrc?: string;
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
  guideImageSrc,
  drawingData,
  showStrokeOrder = false,
  showDirectionArrows = false,
  showTemplate = true,
  width = 280, 
  height = 280, 
  onDrawEnd, 
  disabled = false 
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const guideImageRef = useRef<HTMLImageElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke>([]);
  const hasGuidePaths = Boolean(drawingData?.guidePaths && drawingData.guidePaths.length > 0);
  const hasGuideImage = Boolean(guideImageSrc);
  const shouldRenderOverlay = Boolean(
    drawingData &&
      (!hasGuideImage
        ? showTemplate || showStrokeOrder || showDirectionArrows
        : !showTemplate && (showStrokeOrder || showDirectionArrows))
  );

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
    getStrokes: () => strokes,
    getGuideImageLayout: () => {
      const container = containerRef.current;
      const guideImage = guideImageRef.current;

      if (!container || !guideImage || !guideImage.complete || guideImage.naturalWidth === 0) {
        return null;
      }

      const containerRect = container.getBoundingClientRect();
      const imageRect = guideImage.getBoundingClientRect();

      return {
        image: guideImage,
        x: imageRect.left - containerRect.left,
        y: imageRect.top - containerRect.top,
        width: imageRect.width,
        height: imageRect.height,
        canvasWidth: width,
        canvasHeight: height,
      };
    }
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
    <div
      ref={containerRef}
      style={{ width, height }}
      className="relative bg-white rounded-xl border-2 border-slate-200 overflow-hidden touch-none shadow-inner"
    >
      {hasGuideImage && showTemplate && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-3 pointer-events-none select-none">
          <img
            ref={guideImageRef}
            src={guideImageSrc}
            alt=""
            className="max-h-full max-w-full object-contain"
            draggable={false}
            style={{ opacity: 0.55 }}
          />
        </div>
      )}

      {guideSymbol && showTemplate && !hasGuidePaths && !hasGuideImage && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 select-none">
          <span style={{ fontSize: `${height * 0.7}px`, lineHeight: 1 }} className="font-jp text-slate-900">
            {guideSymbol}
          </span>
        </div>
      )}
      
      {shouldRenderOverlay && (
        <StrokeGuideOverlay
          drawingData={drawingData}
          showGuidePaths={!hasGuideImage && showTemplate}
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
