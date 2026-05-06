import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  recordCorrect,
  getFeedbackState,
  subscribeFeedback
} from '../../../hooks/useFeedback';
import { markPracticedToday, getHeatGrid } from '../../../features/streak/tomoshibi';
import {
  PracticeKanjiPageProps,
  KanjiPracticeItem,
  buildCuratedKanjiItems,
  readKanjiProgress,
  writeKanjiProgress,
  shuffle
} from '../../../features/practice/kanji/KanjiPracticePages.shared';
import { DrawingPracticePad, DrawingPracticePadRef } from '../../../components/DrawingPracticePad';
import { Stroke } from '../../../utils/DrawingEvaluator';

const getStrokeLength = (stroke: Stroke) => {
  let total = 0;
  for (let index = 1; index < stroke.length; index += 1) {
    const left = stroke[index - 1];
    const right = stroke[index];
    total += Math.hypot(left.x - right.x, left.y - right.y);
  }
  return total;
};

const hasMeaningfulDrawing = (strokes: Stroke[]) => {
  const points = strokes.flat();
  if (points.length < 4) return false;

  const length = strokes.reduce((sum, stroke) => sum + getStrokeLength(stroke), 0);
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);

  return length >= 80 && width >= 28 && height >= 28;
};

const computeStreak = (): number => {
  const grid = getHeatGrid(60);
  let streak = 0;
  for (let i = grid.length - 1; i >= 0; i--) {
    if (grid[i].active) streak++;
    else break;
  }
  return streak;
};

/*
 * AppShell strips all padding for /practice/kanji/drawing routes, so no
 * negative margins are needed. SCENE fills exactly viewport minus TopNav (92px).
 * Mobile uses min-height + inner scroll so short viewports can still access all content.
 */
const SCENE =
  'relative flex w-full flex-col items-center justify-center ' +
  'max-lg:min-h-[calc(100dvh-92px)] max-lg:overflow-y-auto ' +
  'lg:h-[calc(100dvh-92px)] lg:overflow-hidden';

/*
 * Light-mode: warm edge vignette + centred halo. Both hidden in dark mode via
 * [.theme-dark_&]:opacity-0 so they don't create a rectangular fog overlay.
 * Dark mode: one tiny sakura radial glow directly behind the focal character —
 * the global darkmode.png background from App.tsx handles everything else.
 */
const LM_VIGNETTE =
  'pointer-events-none absolute inset-0 ' +
  'bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_38%,rgba(240,232,228,0.52)_100%)] ' +
  '[.theme-dark_&]:opacity-0';

const LM_HALO =
  'pointer-events-none absolute inset-0 ' +
  'bg-[radial-gradient(ellipse_46%_36%_at_50%_42%,rgba(253,250,248,0.55)_0%,transparent_100%)] ' +
  '[.theme-dark_&]:opacity-0';

const DM_CHAR_HALO =
  'pointer-events-none absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 ' +
  'rounded-full opacity-0 blur-3xl bg-[#d06070]/8 [.theme-dark_&]:opacity-100';

const Atmosphere: React.FC = () => (
  <>
    <div className={LM_VIGNETTE} />
    <div className={LM_HALO} />
    <div className={DM_CHAR_HALO} />
  </>
);

export const PracticeKanjiDrawingPage: React.FC<PracticeKanjiPageProps> = ({ language }) => {
  const items = useMemo(() => buildCuratedKanjiItems(language), [language]);
  const [progress, setProgress] = useState<Record<string, 'known' | 'review'>>(() =>
    readKanjiProgress()
  );
  const [round, setRound] = useState<KanjiPracticeItem[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [hanabira, setHanabira] = useState(() => getFeedbackState().hanabira);
  const drawingPadRef = useRef<DrawingPracticePadRef>(null);
  const streak = useMemo(() => computeStreak(), []);

  const current = round[index] ?? null;
  const complete = round.length > 0 && index >= round.length;

  const reviewChars = useMemo(
    () =>
      new Set(
        Object.entries(progress)
          .filter(([, s]) => s === 'review')
          .map(([c]) => c)
      ),
    [progress]
  );

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

  useEffect(() => {
    return subscribeFeedback(() => setHanabira(getFeedbackState().hanabira));
  }, []);

  const startTraining = () => {
    const prioritized = [
      ...items.filter((item) => reviewChars.has(item.char)),
      ...shuffle(items.filter((item) => !reviewChars.has(item.char)))
    ];
    setRound(shuffle(prioritized).slice(0, 10));
    setIndex(0);
    setRevealed(false);
  };

  const advanceAfterReveal = () => {
    window.setTimeout(() => {
      setIndex((v) => v + 1);
      setRevealed(false);
    }, 900);
  };

  const handleReveal = () => {
    if (!current) return;
    const correct = hasMeaningfulDrawing(drawingPadRef.current?.getStrokes() ?? []);
    setRevealed(true);
    setProgress((prev) => ({ ...prev, [current.char]: correct ? 'known' : 'review' }));
    if (correct) {
      recordCorrect();
      markPracticedToday();
    }
    advanceAfterReveal();
  };

  /* ── Completion ── */
  if (complete) {
    return (
      <div className={SCENE}>
        <Atmosphere />
        <div className="relative z-10 flex flex-col items-center gap-4 px-4 text-center">
          <div
            className="select-none font-serif text-[9rem] leading-none text-[#2b2422] [.theme-dark_&]:text-[#f2d8d6]/85"
            style={{ textShadow: '0 2px 18px rgba(43,36,34,0.09)' }}
          >
            完
          </div>
          <h2 className="text-base font-light tracking-[0.28em] text-[#2b2422]/80 [.theme-dark_&]:text-white/80">
            Training Complete
          </h2>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#2b2422]/32 [.theme-dark_&]:text-white/35">
            The dojo rests
          </p>
          <button
            onClick={() => setRound([])}
            className="mt-5 rounded-full bg-[#d06070] px-11 py-4 text-sm font-medium uppercase tracking-[0.22em] text-white transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.025] active:scale-[0.98]"
          >
            Return to Dojo
          </button>
        </div>
      </div>
    );
  }

  /* ── Pre-start dojo ── */
  if (round.length === 0) {
    return (
      <div className={SCENE}>
        <Atmosphere />

        {/* Corner breadcrumb — absolute, no layout height */}
        <div className="absolute left-5 top-6 z-10 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-[#2b2422]/28 [.theme-dark_&]:text-white/35">
          <span className="inline-block h-[3px] w-[3px] rounded-full bg-[#d06070]/70" />
          Kanji · Drawing
        </div>

        <main className="relative z-10 flex flex-col items-center px-4 text-center">

          {/* 1 · Dominant kanji — clamp keeps it from overflowing short viewports */}
          <div
            className="select-none font-serif leading-none tracking-[-0.01em] text-[#2b2422] [.theme-dark_&]:text-[#f2d8d6]/85"
            style={{
              fontSize: 'clamp(6rem, 13vw, 11rem)',
              textShadow: '0 3px 24px rgba(43,36,34,0.10)',
            }}
          >
            {nextSet[0]?.char ?? '武'}
          </div>

          {/* 2 · Subtitle */}
          <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.48em] text-[#2b2422]/28 [.theme-dark_&]:text-white/35">
            Recall the symbol
          </p>

          {/* 3 · Primary CTA */}
          <button
            onClick={startTraining}
            className="mt-6 rounded-full bg-[#d06070] px-10 py-3 text-sm font-medium uppercase tracking-[0.22em] text-white transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.025] active:scale-[0.98]"
          >
            Begin Training
          </button>

          {/* 4 · Status line */}
          <div className="mt-6 flex items-center gap-4 text-[9px] uppercase tracking-[0.3em] text-[#2b2422]/25 [.theme-dark_&]:text-white/30">
            <span>花 {hanabira.toLocaleString()}</span>
            <span>·</span>
            <span>連 {streak}d</span>
            <span>·</span>
            <span>{items.length} kanji</span>
          </div>

          {/* 5 · Chips */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {nextSet.map((item, i) => (
              <div
                key={item.char}
                className={`group select-none rounded-full border px-5 py-2.5 font-serif text-lg transition-all duration-150 ease-out hover:scale-105 ${
                  i === 0
                    ? 'border-[#d06070]/20 bg-[#d06070]/6 text-[#d06070]/80 hover:bg-[#d06070]/10 hover:text-[#d06070] [.theme-dark_&]:border-[#d06070]/40 [.theme-dark_&]:bg-[#d06070]/22 [.theme-dark_&]:text-[#ffd6dc]'
                    : 'border-[#2b2422]/7 bg-white/12 text-[#2b2422]/38 hover:bg-white/24 hover:text-[#2b2422]/60 [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-white/8 [.theme-dark_&]:text-white/55 [.theme-dark_&]:hover:bg-white/12 [.theme-dark_&]:hover:text-white/70'
                }`}
              >
                {item.char}
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  /* ── Active training ── */
  return (
    <div className={SCENE}>
      <Atmosphere />

      {/* Corner progress — absolute, no layout height */}
      <div className="absolute left-5 top-6 z-10 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-[#2b2422]/28 [.theme-dark_&]:text-white/35">
        <span className="inline-block h-[3px] w-[3px] rounded-full bg-[#d06070]/70" />
        Drawing · {index + 1} / {round.length}
      </div>

      <main className="relative z-10 flex w-full max-w-xs flex-col items-center gap-5 px-4 text-center sm:max-w-sm">

        {/* Meaning cue */}
        <div>
          <div className="mb-2 text-[9px] font-medium uppercase tracking-[0.42em] text-[#d06070]/70">
            Meaning
          </div>
          <div className="text-xl font-light tracking-widest text-[#2b2422]/85 [.theme-dark_&]:text-white/80">
            {current?.meanings[0] ?? '—'}
          </div>
        </div>

        {/* Canvas placeholder — dark mode: no white bg, just a thin border */}
        <div className="relative flex h-56 w-56 items-center justify-center rounded-2xl border border-[#2b2422]/8 bg-white/16 transition-colors duration-200 [.theme-dark_&]:border-white/12 [.theme-dark_&]:bg-transparent">
          {!revealed ? (
            <DrawingPracticePad ref={drawingPadRef} resetKey={`kanji-${current?.char ?? 'empty'}-${index}`} />
          ) : (
            <div
              className="select-none font-serif text-[7rem] leading-none text-[#2b2422] [.theme-dark_&]:text-[#f2d8d6]/85"
              style={{ textShadow: '0 2px 20px rgba(43,36,34,0.08)' }}
            >
              {current?.char}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex h-12 items-center justify-center">
          {!revealed ? (
            <button
              onClick={handleReveal}
              className="rounded-full border border-[#2b2422]/12 bg-white/15 px-10 py-3 text-sm font-medium uppercase tracking-[0.22em] text-[#2b2422]/40 transition-all duration-150 ease-out hover:bg-white/28 hover:text-[#2b2422]/60 active:scale-[0.98] [.theme-dark_&]:border-white/14 [.theme-dark_&]:bg-white/6 [.theme-dark_&]:text-white/45 [.theme-dark_&]:hover:bg-white/10 [.theme-dark_&]:hover:text-white/65"
            >
              Reveal
            </button>
          ) : (
            null
          )}
        </div>
      </main>
    </div>
  );
};
