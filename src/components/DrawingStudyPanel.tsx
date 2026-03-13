import React, { useState, useEffect, useRef, useMemo } from 'react';
import { KanaSection, Character, RunStats } from '../types';
import { ArrowLeft, RotateCcw, Eraser, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { DrawingCanvas, DrawingCanvasRef } from './DrawingCanvas';
import { evaluateDrawing } from '../utils/DrawingEvaluator';

interface Props {
  section: KanaSection;
  selectedGroupIds: Set<string>;
  onFinish: (stats: RunStats) => void;
  onCancel: () => void;
}

export const DrawingStudyPanel: React.FC<Props> = ({ section, selectedGroupIds, onFinish, onCancel }) => {
  const [mode, setMode] = useState<'practice' | 'test'>('practice');
  
  const initialPool = useMemo(() => {
    const chars: Character[] = [];
    section.groups.forEach(g => {
      if (selectedGroupIds.has(g.id)) {
        chars.push(...g.characters);
      }
    });
    return chars;
  }, [section, selectedGroupIds]);

  const [pool, setPool] = useState<Character[]>(initialPool);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentChar, setCurrentChar] = useState<Character | null>(null);
  
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);

  // Toggles for Practice Mode
  const [showStrokeOrder, setShowStrokeOrder] = useState(true);
  const [showDirectionArrows, setShowDirectionArrows] = useState(true);
  const [showTemplate, setShowTemplate] = useState(true);

  const canvasRef = useRef<DrawingCanvasRef>(null);

  useEffect(() => {
    if (pool.length > 0 && !currentChar) {
      if (mode === 'practice') {
        setCurrentChar(pool[0]);
      } else {
        pickRandomChar(pool);
      }
    }
  }, [pool, mode]);

  useEffect(() => {
    const timer = setInterval(() => setTimeSeconds(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const pickRandomChar = (currentPool: Character[]) => {
    const randomIndex = Math.floor(Math.random() * currentPool.length);
    setCurrentChar(currentPool[randomIndex]);
  };

  const handleClear = () => {
    canvasRef.current?.clear();
    setFeedback('idle');
  };

  const handleNextPractice = () => {
    handleClear();
    setCurrentIndex(prev => {
      const next = (prev + 1) % pool.length;
      setCurrentChar(pool[next]);
      return next;
    });
  };

  const handlePrevPractice = () => {
    handleClear();
    setCurrentIndex(prev => {
      const next = (prev - 1 + pool.length) % pool.length;
      setCurrentChar(pool[next]);
      return next;
    });
  };

  const handleCheckTest = () => {
    if (!currentChar || feedback !== 'idle') return;
    const strokes = canvasRef.current?.getStrokes() || [];
    if (strokes.length === 0) return;

    setAttempts(a => a + 1);
    const isCorrect = evaluateDrawing(strokes, currentChar);

    if (isCorrect) {
      setFeedback('correct');
      setCorrectCount(c => c + 1);
      
      setTimeout(() => {
        const newPool = pool.filter(c => c.id !== currentChar.id);
        if (newPool.length === 0) {
          onFinish({
            completed: initialPool.length,
            totalAttempts: attempts + 1,
            correct: correctCount + 1,
            wrong: wrongCount,
            accuracy: Math.round(((correctCount + 1) / (attempts + 1)) * 100),
            timeSeconds: timeSeconds
          });
        } else {
          setPool(newPool);
          pickRandomChar(newPool);
          handleClear();
        }
      }, 1000);
    } else {
      setFeedback('wrong');
      setWrongCount(w => w + 1);
      setTimeout(() => {
        setFeedback('idle');
        handleClear();
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center py-6">
      <div className="w-full max-w-md">
        
        {/* Mode Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => { setMode('practice'); handleClear(); setCurrentIndex(0); setCurrentChar(initialPool[0]); setPool(initialPool); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'practice' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Practice Mode
          </button>
          <button
            onClick={() => { setMode('test'); handleClear(); setPool(initialPool); setCorrectCount(0); setWrongCount(0); setAttempts(0); setTimeSeconds(0); pickRandomChar(initialPool); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'test' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Test Mode
          </button>
        </div>

        {/* Header / Stats */}
        {mode === 'test' ? (
          <div className="flex items-center justify-between mb-4 text-sm font-medium text-slate-500">
            <div className="flex space-x-4">
              <span className="text-emerald-600">Correct: {correctCount}</span>
              <span className="text-rose-600">Wrong: {wrongCount}</span>
            </div>
            <div className="flex space-x-4">
              <span>{formatTime(timeSeconds)}</span>
              <span>{initialPool.length - pool.length} / {initialPool.length}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-4 text-sm font-medium text-slate-500">
            <div className="flex space-x-4">
              <span>Practice</span>
            </div>
            <div className="flex space-x-4">
              <span>{currentIndex + 1} / {initialPool.length}</span>
            </div>
          </div>
        )}

        {/* Target Info */}
        <div className="text-center mb-4">
          <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold mb-1">Draw</div>
          <div className="text-4xl font-bold text-slate-800">{currentChar?.label}</div>
        </div>

        {/* Canvas Area */}
        <div className="flex justify-center mb-6 relative">
          <DrawingCanvas 
            ref={canvasRef} 
            guideSymbol={mode === 'practice' ? currentChar?.symbol : undefined} 
            drawingData={mode === 'practice' ? currentChar?.drawingData : undefined}
            showStrokeOrder={mode === 'practice' ? showStrokeOrder : false}
            showDirectionArrows={mode === 'practice' ? showDirectionArrows : false}
            showTemplate={mode === 'practice' ? showTemplate : false}
            width={280} 
            height={280}
            disabled={feedback !== 'idle'}
          />
          
          {/* Feedback Overlay for Test Mode */}
          {mode === 'test' && feedback !== 'idle' && (
            <div className={`absolute inset-0 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm z-10 transition-all ${feedback === 'correct' ? 'text-emerald-500' : 'text-rose-500'}`}>
              <div className="flex flex-col items-center">
                {feedback === 'correct' ? <Check size={48} /> : <RotateCcw size={48} />}
                <span className="text-xl font-bold mt-2">{feedback === 'correct' ? 'Correct!' : 'Try Again'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-3 mb-6">
          <button
            onClick={handleClear}
            className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            <Eraser size={18} className="mr-2" /> Clear
          </button>

          {mode === 'practice' ? (
            <>
              <button
                onClick={handlePrevPractice}
                className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNextPractice}
                className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={handleCheckTest}
              disabled={feedback !== 'idle'}
              className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Check size={18} className="mr-2" /> Check
            </button>
          )}
        </div>

        {/* Practice Mode Toggles */}
        {mode === 'practice' && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <label className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showStrokeOrder} 
                onChange={() => setShowStrokeOrder(!showStrokeOrder)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Numbers</span>
            </label>
            <label className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showDirectionArrows} 
                onChange={() => setShowDirectionArrows(!showDirectionArrows)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Arrows</span>
            </label>
            <label className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showTemplate} 
                onChange={() => setShowTemplate(!showTemplate)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Template</span>
            </label>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-6">
          <button
            onClick={onCancel}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Selection
          </button>
          {mode === 'test' && (
            <button
              onClick={() => {
                setPool(initialPool);
                setCorrectCount(0);
                setWrongCount(0);
                setAttempts(0);
                setTimeSeconds(0);
                setFeedback('idle');
                handleClear();
                pickRandomChar(initialPool);
              }}
              className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              <RotateCcw size={16} className="mr-1" /> Restart Run
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
