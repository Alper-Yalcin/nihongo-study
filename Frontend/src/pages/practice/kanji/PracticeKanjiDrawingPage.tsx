import React, { useEffect, useMemo, useState } from 'react';
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
      <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-[#F6EFEA] text-[#2B2B2B] font-sans">
        <div className="font-serif text-8xl mb-6">完</div>
        <h2 className="text-2xl font-light tracking-[0.18em] mb-2 text-[#2B2B2B]">Training Complete</h2>
        <p className="text-xs tracking-[0.25em] text-[#2B2B2B]/50 uppercase mb-10">The dojo rests</p>
        <button onClick={() => setRound([])} className="rounded-full px-12 py-4 text-sm font-medium tracking-[0.18em] text-white bg-[#E06C75] hover:opacity-90 transition-opacity uppercase">
          Return to Dojo
        </button>
      </div>
    );
  }

  // Pre-start DOJO screen
  if (round.length === 0) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center bg-[#F6EFEA] text-[#2B2B2B] font-sans">
        {/* Top Header Label */}
        <div className="absolute left-6 top-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#2B2B2B]/40">
          <div className="h-1.5 w-1.5 rounded-full bg-[#E06C75]"></div>
          Kanji Training · Drawing
        </div>

        {/* HERO SCENE */}
        <main className="flex h-[50dvh] w-full flex-col items-center justify-center px-4 pt-10">
          <div className="font-serif text-[12rem] leading-none mb-4 md:text-[14rem] text-[#2B2B2B]">
            {nextSet[0]?.char ?? '武'}
          </div>
          <div className="text-xs font-medium uppercase tracking-[0.35em] text-[#2B2B2B]/40">
            Recall the symbol
          </div>
        </main>

        {/* PRIMARY ACTION */}
        <div className="mt-8 flex flex-col items-center justify-center z-10 w-full px-4">
          <button
            onClick={startTraining}
            className="rounded-full px-14 py-4 text-sm font-medium uppercase tracking-[0.2em] text-white bg-[#E06C75] hover:opacity-90 transition-opacity shadow-sm"
            style={{ minWidth: '220px' }}
          >
            Begin Training
          </button>

          {reviewChars.size > 0 && (
            <div className="mt-4 text-[10px] tracking-widest text-[#2B2B2B]/40 uppercase">
              {reviewChars.size} awaiting review
            </div>
          )}
        </div>

        {/* SECONDARY PANEL: Floating Chips (TRAINING SET) */}
        <div className="mt-16 flex flex-col items-center pb-20 z-10 w-full px-4">
          <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2B2B2B]/40 mb-6">
            Today's Set
          </div>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
            {nextSet.map((item, i) => (
              <div
                key={item.char}
                className={`flex items-center justify-center rounded-full px-6 py-3 text-2xl font-serif border ${
                  i === 0 
                    ? 'border-[#E06C75]/40 bg-[#E06C75]/10 text-[#E06C75]' 
                    : 'border-[#2B2B2B]/10 bg-white/40 text-[#2B2B2B]/80'
                }`}
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
    <div className="flex min-h-[100dvh] flex-col items-center bg-[#F6EFEA] text-[#2B2B2B] font-sans">

      <div className="absolute left-6 top-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#2B2B2B]/40">
        <div className="h-1.5 w-1.5 rounded-full bg-[#E06C75]"></div>
        Drawing · {index + 1} of {round.length}
      </div>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-4">
        {/* Cue */}
        <div className="mb-12 text-center">
          <div className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#E06C75] mb-4">Meaning</div>
          <h2 className="text-3xl font-light tracking-widest md:text-4xl">{current?.meanings.join(', ')}</h2>
        </div>

        {/* Center Canvas */}
        <div className="group relative flex h-72 w-72 items-center justify-center rounded-[2rem] border border-[#2B2B2B]/10 bg-white/40 md:h-96 md:w-96 shadow-sm">
          {!revealed ? (
            <div className="text-[#2B2B2B]/30 text-xs uppercase tracking-[0.3em] font-medium flex items-center justify-center h-full w-full select-none">
              Draw from memory
            </div>
          ) : (
            <div className="font-serif text-9xl md:text-[10rem] text-[#2B2B2B]">
              {current?.char}
            </div>
          )}
        </div>

        {/* Action */}
        <div className="mt-16 h-16 flex items-center justify-center">
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="rounded-full px-12 py-4 text-sm font-medium uppercase tracking-[0.2em] text-[#2B2B2B]/60 border border-[#2B2B2B]/20 hover:bg-[#2B2B2B]/5 transition-colors"
            >
              Reveal Answer
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => handleResult(false)}
                className="rounded-full px-10 py-4 text-sm font-medium uppercase tracking-[0.15em] text-[#2B2B2B]/50 border border-[#2B2B2B]/10 hover:bg-[#2B2B2B]/5 transition-colors"
              >
                Missed
              </button>
              <button
                onClick={() => handleResult(true)}
                className="rounded-full px-10 py-4 text-sm font-medium uppercase tracking-[0.15em] text-white bg-[#E06C75] hover:opacity-90 transition-opacity shadow-sm"
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
