import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLanguage } from '../../../data/appPreferences';
import { getNhkKanaGuideImageSrc } from '../../../data/nhkKanaGuideImages';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../../../data/studyContent';
import { isKanaScript } from '../../../hooks/useActiveScript';
import { KanaItem, KanaScript } from '../../../features/kana/domain/kanaItem';
import { useKanaProgressStore } from '../../../features/kana/progress/progressStore';
import {
  buildKanaReviewQueue,
  getWeakKanaProgressEntries
} from '../../../features/kana/review/reviewSelectors';
import { getKanaItemById } from '../../../features/kana/data/kanaInventory';
import { recordCorrect, recordWrong } from '../../../hooks/useFeedback';
import { markPracticedToday } from '../../../features/streak/tomoshibi';

interface PracticeKanaDrawingPageProps {
  language: AppLanguage;
  activeScript: KanaScript;
}

type SessionType = 'review' | 'weak' | 'free';

const copy = {
  tr: {
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    startReview: 'Bekleyenleri çiz',
    startWeak: 'Zayıfları çiz',
    startFree: 'Serbest çizim',
    due: 'Bkl',
    weak: 'Zayıf',
    mastered: 'Tamam',
    subtitle: 'Stroke sirasini hafizadan uret',
    back: 'Geri'
  },
  en: {
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    startReview: 'Draw due items',
    startWeak: 'Draw weak items',
    startFree: 'Free drawing',
    due: 'Due',
    weak: 'Weak',
    mastered: 'Done',
    subtitle: 'Reproduce the stroke order from memory',
    back: 'Back'
  }
} as const;

const sampleIdsByScript: Record<KanaScript, string[]> = {
  hiragana: ['h-a', 'h-ki', 'h-so', 'h-me', 'h-tsu'],
  katakana: ['k-a', 'k-ki', 'k-so', 'k-me', 'k-tsu']
};

const sampleCharsByScript: Record<KanaScript, string[]> = {
  hiragana: ['あ', 'き', 'そ', 'め', 'つ'],
  katakana: ['ア', 'キ', 'ソ', 'メ', 'ツ']
};

const shuffle = <T,>(arr: T[]): T[] =>
  [...arr].sort(() => Math.random() - 0.5);

const SCENE =
  'relative flex w-full flex-col items-center justify-center max-lg:min-h-[calc(100dvh-92px)] max-lg:overflow-y-auto lg:h-[calc(100dvh-92px)] lg:overflow-hidden';

const LM_VIGNETTE =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_38%,rgba(240,232,228,0.52)_100%)] [.theme-dark_&]:opacity-0';
const LM_HALO =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_46%_36%_at_50%_42%,rgba(253,250,248,0.55)_0%,transparent_100%)] [.theme-dark_&]:opacity-0';
const DM_CHAR_HALO =
  'pointer-events-none absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl bg-[#d06070]/8 [.theme-dark_&]:opacity-100';

const Atmosphere: React.FC = () => (
  <>
    <div className={LM_VIGNETTE} />
    <div className={LM_HALO} />
    <div className={DM_CHAR_HALO} />
  </>
);

export const PracticeKanaDrawingPage: React.FC<PracticeKanaDrawingPageProps> = ({
  language,
  activeScript
}) => {
  const c = copy[language];
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedScript = searchParams.get('script');
  const script: KanaScript = isKanaScript(requestedScript) ? requestedScript : activeScript;

  const [sessionType, setSessionType] = useState<SessionType | null>(null);
  const [round, setRound] = useState<KanaItem[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const { listByScript, summaries } = useKanaProgressStore();
  const progressEntries = listByScript(script);
  const summary = summaries[script];
  const reviewQueue = useMemo(() => buildKanaReviewQueue(script, progressEntries), [progressEntries, script]);
  const weakEntries = useMemo(() => getWeakKanaProgressEntries(script, progressEntries), [progressEntries, script]);

  const sections = useMemo(
    () => (script === 'hiragana' ? getLocalizedHiraganaSections(language) : getLocalizedKatakanaSections(language)),
    [language, script]
  );

  const allSectionCharacterIds = useMemo(
    () =>
      Array.from(
        new Set(
          sections.flatMap((section) =>
            section.matrix.flatMap((row) =>
              row.filter((item): item is NonNullable<typeof item> => item !== null).map((item) => item.id)
            )
          )
        )
      ),
    [sections]
  );

  const ids = sampleIdsByScript[script];
  const chars = sampleCharsByScript[script];

  const current = round[index] ?? null;
  const complete = round.length > 0 && index >= round.length;

  const setScript = (next: KanaScript) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('script', next);
    setSearchParams(nextParams);
    setSessionType(null);
    setRound([]);
  };

  const startSession = (type: SessionType) => {
    const sourceIds =
      type === 'review'
        ? reviewQueue.slice(0, 24).map((e) => e.kanaId)
        : type === 'weak'
        ? weakEntries.slice(0, 24).map((e) => e.kanaId)
        : allSectionCharacterIds;

    const items = sourceIds
      .map((id) => getKanaItemById(id))
      .filter((item): item is KanaItem => item !== null);

    setRound(shuffle(items).slice(0, 10));
    setIndex(0);
    setRevealed(false);
    setSessionType(type);
  };

  const handleResult = (correct: boolean) => {
    if (!current) return;
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
            onClick={() => { setRound([]); setSessionType(null); }}
            className="mt-5 rounded-full bg-[#d06070] px-11 py-4 text-sm font-medium uppercase tracking-[0.22em] text-white transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.025] active:scale-[0.98]"
          >
            Return to Dojo
          </button>
        </div>
      </div>
    );
  }

  /* ── Active session ── */
  if (sessionType !== null && round.length > 0) {
    return (
      <div className={SCENE}>
        <Atmosphere />

        <div className="absolute left-5 top-6 z-10 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-[#2b2422]/28 [.theme-dark_&]:text-white/35">
          <span className="inline-block h-[3px] w-[3px] rounded-full bg-[#d06070]/70" />
          Drawing · {index + 1} / {round.length}
        </div>

        <main className="relative z-10 flex w-full max-w-xs flex-col items-center gap-5 px-4 text-center sm:max-w-sm">

          <div>
            <div className="mb-2 text-[9px] font-medium uppercase tracking-[0.42em] text-[#d06070]/70">
              Reading
            </div>
            <div className="text-xl font-light tracking-widest text-[#2b2422]/85 [.theme-dark_&]:text-white/80">
              {current?.romaji[0] ?? '—'}
            </div>
          </div>

          <div className="relative flex h-56 w-56 items-center justify-center rounded-2xl border border-[#2b2422]/8 bg-white/16 transition-colors duration-200 [.theme-dark_&]:border-white/12 [.theme-dark_&]:bg-transparent">
            {!revealed ? (
              <span className="select-none text-[9px] uppercase tracking-[0.35em] text-[#2b2422]/18 [.theme-dark_&]:text-white/22">
                Draw here
              </span>
            ) : (
              <div
                className="select-none font-serif text-[7rem] leading-none text-[#2b2422] [.theme-dark_&]:text-[#f2d8d6]/85"
                style={{ textShadow: '0 2px 20px rgba(43,36,34,0.08)' }}
              >
                {current?.char}
              </div>
            )}
          </div>

          <div className="flex h-12 items-center justify-center">
            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                className="rounded-full border border-[#2b2422]/12 bg-white/15 px-10 py-3 text-sm font-medium uppercase tracking-[0.22em] text-[#2b2422]/40 transition-all duration-150 ease-out hover:bg-white/28 hover:text-[#2b2422]/60 active:scale-[0.98] [.theme-dark_&]:border-white/14 [.theme-dark_&]:bg-white/6 [.theme-dark_&]:text-white/45 [.theme-dark_&]:hover:bg-white/10 [.theme-dark_&]:hover:text-white/65"
              >
                Reveal
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => handleResult(false)}
                  className="rounded-full border border-[#2b2422]/8 bg-white/12 px-8 py-3 text-sm font-medium uppercase tracking-[0.18em] text-[#2b2422]/36 transition-all duration-150 ease-out hover:bg-white/24 hover:text-[#2b2422]/55 active:scale-[0.98] [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-white/6 [.theme-dark_&]:text-white/42 [.theme-dark_&]:hover:bg-white/10 [.theme-dark_&]:hover:text-white/60"
                >
                  Missed
                </button>
                <button
                  onClick={() => handleResult(true)}
                  className="rounded-full bg-[#d06070] px-8 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.025] active:scale-[0.98]"
                >
                  Nailed it
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  /* ── Landing ── */
  return (
    <div className={SCENE}>
      <Atmosphere />

      <div className="absolute left-5 top-6 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-[#2b2422]/28 [.theme-dark_&]:text-white/35">
        <span className="inline-block h-[3px] w-[3px] rounded-full bg-[#d06070]/70" />
        Kana · Drawing
      </div>

      {/* Script toggle */}
      <div className="absolute right-5 top-5 inline-flex rounded-full border border-[#2b2422]/8 bg-white/14 p-0.5 backdrop-blur-[1px]">
        {(['hiragana', 'katakana'] as KanaScript[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setScript(option)}
            className={`rounded-full px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] transition-all duration-150 ${
              script === option ? 'bg-[#d06070] text-white' : 'text-[#2b2422]/40 [.theme-dark_&]:text-white/45 hover:text-[#2b2422]/60'
            }`}
          >
            {option === 'hiragana' ? c.hiragana : c.katakana}
          </button>
        ))}
      </div>

      <main className="relative z-10 flex flex-col items-center px-4 text-center">
        <div
          className="select-none font-serif text-[11rem] leading-none tracking-[-0.01em] text-[#2b2422] [.theme-dark_&]:text-[#f2d8d6]/85 md:text-[14rem]"
          style={{ textShadow: '0 3px 24px rgba(43,36,34,0.10)' }}
        >
          {chars[0]}
        </div>

        <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.48em] text-[#2b2422]/28 [.theme-dark_&]:text-white/35">
          {c.subtitle}
        </p>

        <button
          type="button"
          onClick={() => startSession(reviewQueue.length > 0 ? 'review' : 'free')}
          className="mt-7 rounded-full bg-[#d06070] px-12 py-4 text-sm font-medium uppercase tracking-[0.22em] text-white transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.025] active:scale-[0.98]"
        >
          {reviewQueue.length > 0 ? c.startReview : c.startFree}
        </button>

        {weakEntries.length > 0 && (
          <button
            type="button"
            onClick={() => startSession('weak')}
            className="mt-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#2b2422]/35 transition-all duration-150 hover:text-[#2b2422]/55"
          >
            {c.startWeak}
          </button>
        )}

        <div className="mt-8 flex items-center gap-4 text-[9px] uppercase tracking-[0.3em] text-[#2b2422]/25 [.theme-dark_&]:text-white/30">
          <span>{c.due} {summary.dueCount}</span>
          <span>·</span>
          <span>{c.weak} {summary.weakCount}</span>
          <span>·</span>
          <span>{c.mastered} {summary.masteredCount}</span>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {ids.map((id, i) => {
            const guideSrc = getNhkKanaGuideImageSrc(id);
            return (
              <div
                key={id}
                className={`flex select-none items-center justify-center rounded-xl border transition-all duration-150 ease-out hover:scale-105 ${
                  i === 0
                    ? 'border-[#d06070]/20 bg-[#d06070]/6 [.theme-dark_&]:border-[#d06070]/40 [.theme-dark_&]:bg-[#d06070]/22 hover:bg-[#d06070]/10'
                    : 'border-[#2b2422]/7 bg-white/12 [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-white/8 hover:bg-white/24'
                } ${guideSrc ? 'h-12 w-12 p-1' : 'px-5 py-2.5'}`}
              >
                {guideSrc ? (
                  <img
                    src={guideSrc}
                    alt={chars[i]}
                    className={`max-h-full max-w-full object-contain ${i === 0 ? 'opacity-75' : 'opacity-40'}`}
                  />
                ) : (
                  <span className={`font-serif text-lg leading-none ${i === 0 ? 'text-[#d06070]/80 [.theme-dark_&]:text-[#ffd6dc]' : 'text-[#2b2422]/38 [.theme-dark_&]:text-white/55'}`}>
                    {chars[i]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
