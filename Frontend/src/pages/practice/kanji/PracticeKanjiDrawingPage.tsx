import React, { useEffect, useMemo, useState } from 'react';
import {
  recordCorrect,
  recordWrong,
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

const computeStreak = (): number => {
  const grid = getHeatGrid(60);
  let streak = 0;
  for (let i = grid.length - 1; i >= 0; i--) {
    if (grid[i].active) streak++;
    else break;
  }
  return streak;
};

const SCENE =
  'relative -mx-4 sm:-mx-6 lg:-mx-10 -mt-5 xl:-mt-7 -mb-28 xl:-mb-12 flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden';

const OVERLAY =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,rgba(253,250,248,0.38)_0%,rgba(248,241,237,0.58)_100%)]';

export const PracticeKanjiDrawingPage: React.FC<PracticeKanjiPageProps> = ({ language }) => {
  const items = useMemo(() => buildCuratedKanjiItems(language), [language]);
  const [progress, setProgress] = useState<Record<string, 'known' | 'review'>>(() =>
    readKanjiProgress()
  );
  const [round, setRound] = useState<KanjiPracticeItem[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [hanabira, setHanabira] = useState(() => getFeedbackState().hanabira);
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

  /* ── Completion ── */
  if (complete) {
    return (
      <div className={SCENE}>
        <div className={OVERLAY} />
        <div className="relative z-10 flex flex-col items-center gap-5 px-4 text-center">
          <div className="select-none font-serif text-[9rem] leading-none text-[#2b2422]">完</div>
          <h2 className="text-lg font-light tracking-[0.24em] text-[#2b2422]">
            Training Complete
          </h2>
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#2b2422]/40">
            The dojo rests
          </p>
          <button
            onClick={() => setRound([])}
            className="mt-3 rounded-full bg-[#d06070] px-11 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-white transition-all hover:opacity-90 hover:scale-[1.02]"
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
        <div className={OVERLAY} />

        <div className="absolute left-5 top-6 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-[#2b2422]/35">
          <span className="inline-block h-1 w-1 rounded-full bg-[#d06070]" />
          Kanji · Drawing
        </div>

        <main className="relative z-10 flex flex-col items-center gap-5 px-4 text-center">
          <div className="select-none font-serif text-[10rem] leading-none text-[#2b2422] md:text-[13rem]">
            {nextSet[0]?.char ?? '武'}
          </div>

          <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-[#2b2422]/38">
            Recall the symbol
          </p>

          <button
            onClick={startTraining}
            className="mt-3 rounded-full bg-[#d06070] px-12 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-white transition-all hover:opacity-90 hover:scale-[1.02]"
          >
            Begin Training
          </button>

          <div className="flex items-center gap-3.5 text-[10px] uppercase tracking-[0.26em] text-[#2b2422]/32">
            <span>花 {hanabira.toLocaleString()}</span>
            <span className="opacity-50">·</span>
            <span>連 {streak}d</span>
            <span className="opacity-50">·</span>
            <span>{items.length} kanji</span>
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-2.5">
            {nextSet.map((item, i) => (
              <div
                key={item.char}
                className={`select-none rounded-full border px-5 py-2.5 font-serif text-xl transition-colors ${
                  i === 0
                    ? 'border-[#d06070]/22 bg-[#d06070]/7 text-[#d06070]'
                    : 'border-[#2b2422]/8 bg-white/18 text-[#2b2422]/52'
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
      <div className={OVERLAY} />

      <div className="absolute left-5 top-6 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-[#2b2422]/35">
        <span className="inline-block h-1 w-1 rounded-full bg-[#d06070]" />
        Drawing · {index + 1} / {round.length}
      </div>

      <main className="relative z-10 flex w-full max-w-xs flex-col items-center gap-9 px-4 text-center sm:max-w-sm">
        <div>
          <div className="mb-3 text-[10px] font-medium uppercase tracking-[0.38em] text-[#d06070]">
            Meaning
          </div>
          <div className="text-2xl font-light tracking-widest text-[#2b2422]">
            {current?.meanings[0] ?? '—'}
          </div>
        </div>

        <div className="relative flex h-60 w-60 items-center justify-center rounded-2xl border border-[#2b2422]/10 bg-white/22 backdrop-blur-[2px]">
          {!revealed ? (
            <span className="select-none text-[10px] uppercase tracking-[0.3em] text-[#2b2422]/22">
              Draw here
            </span>
          ) : (
            <div className="select-none font-serif text-[7rem] leading-none text-[#2b2422]">
              {current?.char}
            </div>
          )}
        </div>

        <div className="flex h-14 items-center justify-center">
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="rounded-full border border-[#2b2422]/14 bg-white/18 px-10 py-3 text-sm font-medium uppercase tracking-[0.2em] text-[#2b2422]/48 transition-colors hover:bg-white/32"
            >
              Reveal
            </button>
          ) : (
            <div className="flex gap-3.5">
              <button
                onClick={() => handleResult(false)}
                className="rounded-full border border-[#2b2422]/10 bg-white/15 px-8 py-3 text-sm font-medium uppercase tracking-[0.16em] text-[#2b2422]/42 transition-colors hover:bg-white/28"
              >
                Missed
              </button>
              <button
                onClick={() => handleResult(true)}
                className="rounded-full bg-[#d06070] px-8 py-3 text-sm font-medium uppercase tracking-[0.16em] text-white transition-all hover:opacity-90"
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
