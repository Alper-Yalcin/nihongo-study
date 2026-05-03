import React, { useEffect, useMemo, useState } from 'react';
import { Trophy, Flame, Layers } from 'lucide-react';
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
    /* ── BASE SCENE ─────────────────────────────────────── */
    .dojo-stage {
      /* Rich night-dojo: deep wine-indigo, not pure black */
      background:
        radial-gradient(ellipse at 50% 22%, rgba(160, 50, 80, 0.45) 0%, transparent 52%),
        radial-gradient(ellipse at 18% 88%, rgba(90, 25, 55, 0.30) 0%, transparent 42%),
        radial-gradient(ellipse at 82% 78%, rgba(70, 20, 45, 0.25) 0%, transparent 42%),
        linear-gradient(170deg, #12091a 0%, #1c0b12 45%, #0e0609 100%);
      color: rgba(255, 255, 255, 0.92);
      position: relative;
      overflow: hidden;
    }

    /* Vignette — soft dark edges, keeps center bright */
    .dojo-stage::after {
      content: '';
      position: fixed;
      inset: 0;
      background: radial-gradient(ellipse at 50% 38%, transparent 28%, rgba(6, 2, 10, 0.72) 100%);
      pointer-events: none;
      z-index: 0;
    }

    /* Everything above the vignette */
    .dojo-stage > * { position: relative; z-index: 1; }

    /* ── FLOATING SAKURA PETALS ──────────────────────────── */
    .petal {
      position: fixed;
      width: 7px;
      height: 7px;
      border-radius: 50% 0 50% 0;
      pointer-events: none;
      z-index: 0;
      opacity: 0;
      animation: fall-petal linear infinite;
    }
    @keyframes fall-petal {
      0%   { transform: translateY(110vh) translateX(0px) rotate(0deg);   opacity: 0; }
      5%   { opacity: 0.55; }
      85%  { opacity: 0.35; }
      100% { transform: translateY(-8vh)  translateX(60px) rotate(420deg); opacity: 0; }
    }

    /* ── HERO KANJI ──────────────────────────────────────── */
    .dojo-hero-kanji {
      font-family: serif;
      background: linear-gradient(160deg, #ffffff 0%, #f5d8e0 55%, #e8b4c0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: breathe 4.5s ease-in-out infinite;
      will-change: filter, transform;
    }
    @keyframes breathe {
      0%,100% {
        filter: drop-shadow(0 0 18px rgba(255,130,155,0.30))
                drop-shadow(0 0 60px rgba(200, 60, 90, 0.12));
        transform: scale(1);
      }
      50% {
        filter: drop-shadow(0 0 45px rgba(255,140,165,0.65))
                drop-shadow(0 0 100px rgba(200, 60, 90, 0.28));
        transform: scale(1.025);
      }
    }

    /* ── PRIMARY BUTTON ──────────────────────────────────── */
    .dojo-btn {
      background: linear-gradient(135deg, rgba(215, 45, 75, 0.82) 0%, rgba(145, 18, 42, 0.82) 100%);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow:
        0 0 22px rgba(210, 45, 75, 0.45),
        0 4px 24px rgba(0,0,0,0.35),
        inset 0 1px 1px rgba(255,255,255,0.28);
      border: 1px solid rgba(255, 140, 160, 0.30);
      transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    }
    .dojo-btn:hover {
      box-shadow:
        0 0 48px rgba(220, 55, 85, 0.75),
        0 6px 32px rgba(0,0,0,0.4),
        inset 0 1px 1px rgba(255,255,255,0.38);
      transform: scale(1.05);
      background: linear-gradient(135deg, rgba(228, 58, 88, 0.92) 0%, rgba(165, 28, 52, 0.92) 100%);
    }
    .dojo-btn:active {
      transform: scale(0.95);
      box-shadow: 0 0 18px rgba(210, 45, 75, 0.35), inset 0 2px 4px rgba(0,0,0,0.3);
    }

    /* ── GLASS CHIPS ─────────────────────────────────────── */
    .chip {
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
      transition: transform 0.2s ease, box-shadow 0.2s ease,
                  background 0.2s ease, border-color 0.2s ease;
    }
    .chip:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-5px);
      box-shadow: 0 14px 30px rgba(255, 130, 155, 0.18), 0 4px 10px rgba(0,0,0,0.3);
      border-color: rgba(255, 255, 255, 0.18);
    }
    .chip.active {
      background: rgba(215, 45, 75, 0.14);
      border-color: rgba(255, 145, 165, 0.50);
      box-shadow:
        0 0 28px rgba(215, 45, 75, 0.35),
        0 4px 18px rgba(0,0,0,0.25);
      color: #fff;
    }

    /* ── GLASS PANEL (status bar) ────────────────────────── */
    .dojo-glass {
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(255, 255, 255, 0.09);
      box-shadow: 0 8px 32px rgba(0,0,0,0.30);
    }

    /* ── CANVAS AREA ─────────────────────────────────────── */
    .dojo-canvas {
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.09);
      box-shadow:
        0 0 0 1px rgba(255,255,255,0.04) inset,
        0 8px 40px rgba(0,0,0,0.40);
      transition: background 0.25s ease, box-shadow 0.25s ease;
    }
    .dojo-canvas:hover {
      background: rgba(255, 255, 255, 0.07);
      box-shadow:
        0 0 0 1px rgba(255,255,255,0.07) inset,
        0 12px 50px rgba(200,50,80,0.10);
    }
  `}</style>
);

/* Five fixed petals — pure CSS, no JS randomness needed */
const SakuraPetals = () => (
  <>
    {([
      { left: '12%', dur: '18s', delay: '0s',   color: 'rgba(255,185,200,0.70)' },
      { left: '33%', dur: '24s', delay: '6s',   color: 'rgba(240,160,180,0.55)' },
      { left: '55%', dur: '20s', delay: '11s',  color: 'rgba(255,200,215,0.60)' },
      { left: '72%', dur: '26s', delay: '3s',   color: 'rgba(230,145,165,0.50)' },
      { left: '88%', dur: '22s', delay: '15s',  color: 'rgba(255,175,195,0.65)' },
    ] as const).map((p, i) => (
      <span
        key={i}
        className="petal"
        style={{
          left: p.left,
          background: `radial-gradient(circle at 40% 40%, ${p.color}, transparent 70%)`,
          animationDuration: p.dur,
          animationDelay: p.delay,
        }}
      />
    ))}
  </>
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
        <SakuraPetals />
        <div className="dojo-hero-kanji text-8xl mb-6">完</div>
        <h2 className="text-3xl font-black tracking-[0.18em] text-white/90 drop-shadow-lg mb-2">Training Complete</h2>
        <p className="text-sm tracking-[0.25em] text-white/40 uppercase mb-10">The dojo rests</p>
        <button onClick={() => setRound([])} className="dojo-btn rounded-full px-12 py-5 text-base font-black uppercase tracking-[0.18em] text-white">
          Return to Dojo
        </button>
      </div>
    );
  }

  useEffect(() => {
    if (round.length === 0 && !complete) {
      startTraining();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  if (round.length === 0) {
    return null;
  }

  // ACTIVE DOJO TRAINING SCREEN
  return (
    <div className="dojo-stage flex min-h-[100dvh] flex-col items-center">
      <DojoStyles />
      <SakuraPetals />

      <div className="absolute left-6 top-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/35">
        <div className="h-1.5 w-1.5 rounded-full bg-red-500/70"></div>
        Drawing · {index + 1} of {round.length}
      </div>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-4">
        {/* Cue */}
        <div className="mb-10 text-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-red-400/60 mb-3">Meaning</div>
          <h2 className="text-4xl font-black tracking-wider text-white/90 md:text-5xl">{current?.meanings.join(', ')}</h2>
        </div>

        {/* Center Canvas */}
        <div className="dojo-canvas group relative flex h-72 w-72 items-center justify-center rounded-3xl md:h-96 md:w-96">
          {!revealed ? (
            <div className="text-white/18 text-sm uppercase tracking-[0.3em] font-semibold flex items-center justify-center h-full w-full select-none">
              Draw from memory
            </div>
          ) : (
            <div className="dojo-hero-kanji text-9xl md:text-[10rem]">
              {current?.char}
            </div>
          )}
        </div>

        {/* Action */}
        <div className="mt-14 h-16 flex items-center justify-center">
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="chip rounded-full px-12 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white"
            >
              Reveal Answer
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => handleResult(false)}
                className="chip rounded-full px-10 py-4 text-sm font-bold uppercase tracking-[0.15em] text-red-300/80 hover:bg-red-500/15 hover:text-red-200"
              >
                Missed
              </button>
              <button
                onClick={() => handleResult(true)}
                className="dojo-btn rounded-full px-10 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white"
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

