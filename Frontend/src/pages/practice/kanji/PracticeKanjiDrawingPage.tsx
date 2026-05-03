import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles, Trophy, Flame, Layers } from 'lucide-react';
import { PageShell } from '../../../components/ui';
import { recordCorrect, recordWrong } from '../../../hooks/useFeedback';
import { markPracticedToday } from '../../../features/streak/tomoshibi';
import {
  PracticeKanjiPageProps,
  KanjiPracticeItem,
  buildCuratedKanjiItems,
  readKanjiProgress,
  writeKanjiProgress,
  shuffle
} from '../../../features/practice/kanji/KanjiPracticePages.shared';

// -- CUSTOM DOJO STYLES --
const DojoStyles = () => (
  <style>{`
    .dojo-stage {
      background: radial-gradient(circle at 50% 40%, rgba(40, 25, 30, 0.4) 0%, rgba(10, 5, 8, 0.9) 100%);
      color: rgba(255, 255, 255, 0.9);
      position: relative;
      overflow: hidden;
    }
    .dojo-stage::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: url('/images/sakura-bg.png') center/cover no-repeat;
      opacity: 0.15;
      mix-blend-mode: color-dodge;
      pointer-events: none;
      z-index: -1;
    }
    .dojo-hero-kanji {
      font-family: serif;
      background: linear-gradient(180deg, #FFFFFF 0%, #F0D5DA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 25px rgba(255, 140, 160, 0.4));
      animation: breathe 4s ease-in-out infinite;
    }
    @keyframes breathe {
      0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 140, 160, 0.3)); transform: scale(1); }
      50% { filter: drop-shadow(0 0 50px rgba(255, 140, 160, 0.7)); transform: scale(1.02); }
    }
    .dojo-btn {
      background: linear-gradient(135deg, rgba(220, 50, 80, 0.8) 0%, rgba(150, 20, 45, 0.8) 100%);
      backdrop-filter: blur(8px);
      box-shadow: 0 0 20px rgba(220, 50, 80, 0.4), inset 0 1px 1px rgba(255,255,255,0.3);
      border: 1px solid rgba(255, 140, 160, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .dojo-btn:hover {
      box-shadow: 0 0 40px rgba(220, 50, 80, 0.7), inset 0 1px 1px rgba(255,255,255,0.4);
      transform: scale(1.05);
      background: linear-gradient(135deg, rgba(230, 60, 90, 0.9) 0%, rgba(170, 30, 55, 0.9) 100%);
    }
    .dojo-btn:active {
      transform: scale(0.95);
    }
    .chip {
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .chip:hover {
      background: rgba(255, 255, 255, 0.06);
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(255, 140, 160, 0.15);
      border-color: rgba(255, 255, 255, 0.15);
    }
    .chip.active {
      background: rgba(220, 50, 80, 0.1);
      border-color: rgba(255, 140, 160, 0.4);
      box-shadow: 0 0 25px rgba(220, 50, 80, 0.3);
      color: #fff;
    }
  `}</style>
);

export const PracticeKanjiDrawingPage: React.FC<PracticeKanjiPageProps> = ({ language }) => {
  const items = useMemo(() => buildCuratedKanjiItems(language), [language]);
  const [progress, setProgress] = useState<Record<string, 'known' | 'review'>>(() => readKanjiProgress());
  const [round, setRound] = useState<KanjiPracticeItem[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const current = round[index] ?? null;
  const complete = round.length > 0 && index >= round.length;

  const reviewChars = useMemo(() => new Set(Object.entries(progress).filter(([, status]) => status === 'review').map(([char]) => char)), [progress]);
  
  const nextSet = useMemo(() => {
    const prioritized = [
      ...items.filter((item) => reviewChars.has(item.char)),
      ...shuffle(items.filter((item) => !reviewChars.has(item.char)))
    ];
    return prioritized.slice(0, 5);
  }, [items, reviewChars]);

  useEffect(() => {
    writeKanjiProgress(progress);
  }, [progress]);

  const startTraining = () => {
    const prioritized = [
      ...items.filter((item) => reviewChars.has(item.char)),
      ...shuffle(items.filter((item) => !reviewChars.has(item.char)))
    ];
    setRound(shuffle(prioritized).slice(0, 10));
    setIndex(0);
    setRevealed(false);
  };

  const handleResult = (correct: boolean) => {
    if (!current) return;
    setProgress((prev) => ({ ...prev, [current.char]: correct ? 'known' : 'review' }));
    if (correct) {
      recordCorrect();
      markPracticedToday();
    } else {
      recordWrong();
    }
    setIndex((v) => v + 1);
    setRevealed(false);
  };

  // If complete, briefly show completion before restarting
  if (complete) {
    return (
      <div className="dojo-stage flex min-h-[100dvh] flex-col items-center justify-center p-6">
        <DojoStyles />
        <h2 className="text-4xl font-black tracking-widest text-white drop-shadow-lg mb-8">TRAINING COMPLETE</h2>
        <button onClick={() => setRound([])} className="dojo-btn rounded-full px-12 py-5 text-lg font-black uppercase tracking-widest text-white">
          Return to Dojo
        </button>
      </div>
    );
  }

  // Pre-start DOJO screen
  if (round.length === 0) {
    return (
      <div className="dojo-stage flex min-h-[100dvh] flex-col items-center">
        <DojoStyles />
        
        {/* Top Header Label */}
        <div className="absolute left-6 top-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/50">
          <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
          Kanji Training • Drawing
        </div>

        {/* HERO SCENE (60% screen) */}
        <main className="flex h-[60dvh] w-full flex-col items-center justify-center px-4 pt-10">
          <div className="dojo-hero-kanji text-[12rem] leading-none mb-4 md:text-[16rem]">
            {nextSet[0]?.char ?? '武'}
          </div>
          <div className="text-sm font-medium uppercase tracking-[0.3em] text-white/60 drop-shadow-md">
            Summon from memory
          </div>
        </main>

        {/* PRIMARY ACTION */}
        <div className="mt-4 flex flex-col items-center justify-center z-10 w-full px-4">
          <button
            onClick={startTraining}
            className="dojo-btn rounded-full px-14 py-5 text-xl font-black uppercase tracking-[0.2em] text-white"
            style={{ minWidth: '220px' }}
          >
            <span className="flex items-center gap-3"><Flame size={22} className="text-red-200" /> Start Training</span>
          </button>
          
          <div className="mt-4 text-xs font-semibold tracking-widest text-white/40 uppercase">
            {reviewChars.size} reviews pending
          </div>
        </div>

        {/* PLAYER STATUS BAR */}
        <div className="mt-8 flex items-center justify-center gap-8 rounded-full bg-white/5 border border-white/10 px-8 py-3 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-2 font-bold tracking-wider text-white border-r border-white/10 pr-8">
            <Trophy size={16} className="text-amber-400" />
            <span className="text-white/60 text-xs">XP:</span> 465
          </div>
          <div className="flex items-center gap-2 font-bold tracking-wider text-white border-r border-white/10 pr-8">
            <Flame size={16} className="text-red-400" />
            <span className="text-white/60 text-xs">Streak:</span> 11
          </div>
          <div className="flex items-center gap-2 font-bold tracking-wider text-white">
            <Layers size={16} className="text-emerald-400" />
            <span className="text-white/60 text-xs">Pool:</span> {items.length}
          </div>
        </div>

        {/* SECONDARY PANEL: Floating Chips */}
        <div className="mt-12 flex flex-col items-center pb-20 z-10 w-full px-4">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-white/50 mb-6">
            Today's Training Set
          </div>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
            {nextSet.map((item, i) => (
              <div
                key={item.char}
                className={`chip flex items-center justify-center rounded-2xl px-6 py-4 text-3xl font-serif text-white/90 ${i === 0 ? 'active' : ''}`}
                style={{ minWidth: '80px' }}
              >
                {item.char}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE DOJO TRAINING SCREEN
  return (
    <div className="dojo-stage flex min-h-[100dvh] flex-col items-center">
      <DojoStyles />
      <div className="absolute left-6 top-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/50">
        <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
        Drawing Practice • {index + 1} / {round.length}
      </div>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-4">
        {/* Cue */}
        <div className="mb-12 text-center">
          <div className="text-sm font-bold uppercase tracking-[0.3em] text-red-400/80 mb-4">Meaning</div>
          <h2 className="text-4xl font-black tracking-wider text-white md:text-5xl">{current?.meanings.join(', ')}</h2>
        </div>

        {/* Center Canvas */}
        <div className="group relative flex h-72 w-72 items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl transition-all hover:bg-white/10 md:h-96 md:w-96">
          {!revealed ? (
            <div className="text-white/20 text-lg uppercase tracking-widest font-semibold flex items-center justify-center h-full w-full">
              Canvas Area
            </div>
          ) : (
            <div className="dojo-hero-kanji text-9xl md:text-[10rem]">
              {current?.char}
            </div>
          )}
        </div>

        {/* Action */}
        <div className="mt-16 h-24">
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="chip rounded-full px-12 py-4 text-lg font-bold uppercase tracking-widest text-white shadow-xl hover:text-red-100"
            >
              Reveal Answer
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => handleResult(false)}
                className="chip rounded-full border-red-500/30 px-10 py-4 text-sm font-bold uppercase tracking-widest text-red-200 hover:bg-red-500/20"
              >
                Missed
              </button>
              <button
                onClick={() => handleResult(true)}
                className="dojo-btn rounded-full px-10 py-4 text-sm font-bold uppercase tracking-widest text-white"
              >
                Nailed it
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

