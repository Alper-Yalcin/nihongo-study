import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLanguage } from '../../../data/appPreferences';
import { isKanaScript } from '../../../hooks/useActiveScript';
import { KanaItem, KanaScript } from '../../../features/kana/domain/kanaItem';
import { kanaInventoryByScript } from '../../../features/kana/data/kanaInventory';
import { applySessionAnswerToProgress } from '../../../features/kana/progress/progressService';
import { useKanaProgressStore } from '../../../features/kana/progress/progressStore';
import {
  buildKanaReviewQueue,
  getWeakKanaProgressEntries
} from '../../../features/kana/review/reviewSelectors';
import { recordCorrect, recordWrong } from '../../../hooks/useFeedback';
import { markPracticedToday } from '../../../features/streak/tomoshibi';

interface PracticeKanaWritingRecallPageProps {
  language: AppLanguage;
  activeScript: KanaScript;
}

const strings = {
  tr: {
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    start: 'Turu başlat',
    startWeak: 'Zayıfları üret',
    restart: 'Yeniden başlat',
    check: 'Kontrol et',
    next: 'Sonraki',
    answer: 'Kana',
    correct: 'Doğru',
    wrong: 'Yanlış',
    complete: 'Tur tamamlandı',
    subtitle: 'Romaji ipucundan kanayi üret',
    reading: 'Okuyuş',
    due: 'Bkl',
    weak: 'Zayıf',
    mastered: 'Tamam',
  },
  en: {
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    start: 'Start round',
    startWeak: 'Recall weak items',
    restart: 'Restart',
    check: 'Check',
    next: 'Next',
    answer: 'Kana',
    correct: 'Correct',
    wrong: 'Wrong',
    complete: 'Round complete',
    subtitle: 'Recall the kana from meaning',
    reading: 'Reading',
    due: 'Due',
    weak: 'Weak',
    mastered: 'Done',
  }
} as const;

const sampleByScript: Record<KanaScript, string[]> = {
  hiragana: ['あ', 'き', 'そ', 'め', 'つ'],
  katakana: ['ア', 'キ', 'ソ', 'メ', 'ツ']
};

const normalize = (v: string) => v.trim();

const shuffle = <T,>(items: T[]) => {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

const SCENE_CENTER =
  'relative flex w-full flex-col items-center justify-center max-lg:min-h-[calc(100dvh-92px)] max-lg:overflow-y-auto lg:h-[calc(100dvh-92px)] lg:overflow-hidden';
const SCENE_SCROLL =
  'relative flex w-full flex-col items-center max-lg:min-h-[calc(100dvh-92px)] lg:h-[calc(100dvh-92px)] lg:overflow-y-auto';
const OVERLAY =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_38%,rgba(240,232,228,0.52)_100%)] [.theme-dark_&]:opacity-0';
const FOCUS_HALO =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_46%_36%_at_50%_42%,rgba(253,250,248,0.55)_0%,transparent_100%)] [.theme-dark_&]:opacity-0';
const DM_CHAR_HALO =
  'pointer-events-none absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl bg-[#d06070]/8 [.theme-dark_&]:opacity-100';

const Corner: React.FC<{ label: string; onClick?: () => void }> = ({ label, onClick }) =>
  onClick ? (
    <button type="button" onClick={onClick} className="absolute left-5 top-6 z-10 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-[#2b2422]/28 transition-colors duration-150 hover:text-[#2b2422]/55 [.theme-dark_&]:text-white/35 [.theme-dark_&]:hover:text-white/55">
      <span className="text-[13px] leading-none">←</span>
      {label}
    </button>
  ) : (
    <div className="absolute left-5 top-6 z-10 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-[#2b2422]/28 [.theme-dark_&]:text-white/35">
      <span className="inline-block h-[3px] w-[3px] rounded-full bg-[#d06070]/60" />
      {label}
    </div>
  );

export const PracticeKanaWritingRecallPage: React.FC<PracticeKanaWritingRecallPageProps> = ({
  language,
  activeScript
}) => {
  const c = strings[language];
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedScript = searchParams.get('script');
  const script: KanaScript = isKanaScript(requestedScript) ? requestedScript : activeScript;

  const inventory = kanaInventoryByScript[script];
  const { getProgress, listByScript, saveProgress, summaries } = useKanaProgressStore();
  const progressEntries = listByScript(script);
  const summary = summaries[script];
  const reviewQueue = useMemo(() => buildKanaReviewQueue(script, progressEntries), [progressEntries, script]);
  const weakEntries = useMemo(() => getWeakKanaProgressEntries(script, progressEntries), [progressEntries, script]);
  const samples = sampleByScript[script];

  const [round, setRound] = useState<KanaItem[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const current = round[index] ?? null;

  const goBack = () => {
    setRound([]); setIsComplete(false); setChecked(null); setIndex(0);
    setInput(''); setCorrectCount(0); setWrongCount(0); setCombo(0);
  };

  const setScript = (next: KanaScript) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('script', next);
    setSearchParams(nextParams);
    setRound([]);
    setIndex(0);
    setInput('');
    setChecked(null);
    setCorrectCount(0);
    setWrongCount(0);
    setCombo(0);
    setIsComplete(false);
  };

  const startRound = (type: 'review' | 'weak' | 'free') => {
    const ids =
      type === 'review' ? reviewQueue.slice(0, 20).map(e => e.kanaId) :
      type === 'weak'   ? weakEntries.slice(0, 20).map(e => e.kanaId) :
      inventory.map(i => i.id);
    const items = shuffle(
      ids.map(id => inventory.find(i => i.id === id)).filter((i): i is KanaItem => !!i)
    ).slice(0, 10);
    setRound(items);
    setIndex(0);
    setInput('');
    setChecked(null);
    setCorrectCount(0);
    setWrongCount(0);
    setCombo(0);
    setIsComplete(false);
  };

  const checkAnswer = () => {
    if (!current || checked !== null) return;
    const correct = normalize(input) === current.char;
    const progress = getProgress(current.id);
    if (progress) {
      saveProgress(applySessionAnswerToProgress(progress, {
        itemId: current.id,
        mode: 'typing',
        correct,
        answeredAt: new Date().toISOString(),
        latencyMs: 0,
        hintsUsed: 0,
        retries: 0,
        responseItemId: null,
        variant: 'quick-study'
      }));
    }
    if (correct) {
      setCorrectCount(v => v + 1);
      setCombo(v => v + 1);
      recordCorrect();
      markPracticedToday();
    } else {
      setWrongCount(v => v + 1);
      setCombo(0);
      recordWrong();
    }
    setChecked(correct);
  };

  const next = () => {
    if (index + 1 >= round.length) { setIsComplete(true); setChecked(null); return; }
    setIndex(v => v + 1);
    setInput('');
    setChecked(null);
  };

  /* ── Completion ── */
  if (isComplete) {
    return (
      <div className={SCENE_CENTER}>
        <div className={OVERLAY} />
        <div className={FOCUS_HALO} />
        <div className={DM_CHAR_HALO} />
        <Corner label="Kana · Writing Recall" onClick={goBack} />
        <div className="relative z-10 flex flex-col items-center gap-4 px-4 text-center">
          <div
            className="select-none font-serif text-[9rem] leading-none text-[#2b2422] [.theme-dark_&]:text-[#f2d8d6]/85"
            style={{ textShadow: '0 3px 24px rgba(43,36,34,0.09)' }}
          >
            完
          </div>
          <h2 className="text-base font-light tracking-[0.28em] text-[#2b2422]/80 [.theme-dark_&]:text-white/80">
            {c.complete}
          </h2>
          <div className="flex items-center gap-5 text-[10px] uppercase tracking-[0.28em] text-[#2b2422]/32 [.theme-dark_&]:text-white/35">
            <span className="text-[#8d5965]/70">{c.correct} {correctCount}</span>
            <span>·</span>
            <span className="text-[#c24f69]/60">{c.wrong} {wrongCount}</span>
            <span>·</span>
            <span>×{combo} combo</span>
          </div>
          <button
            onClick={() => startRound('free')}
            className="mt-5 rounded-full bg-[#d06070] px-11 py-4 text-sm font-medium uppercase tracking-[0.22em] text-white transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.025] active:scale-[0.98]"
          >
            {c.restart}
          </button>
        </div>
      </div>
    );
  }

  /* ── Active round ── */
  if (round.length > 0) {
    return (
      <div className={SCENE_SCROLL}>
        <div className={OVERLAY} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_46%,rgba(253,250,248,0.5)_0%,transparent_100%)] [.theme-dark_&]:opacity-0" />
        <div className={DM_CHAR_HALO} />

        <Corner label={`Writing Recall · ${index + 1} / ${round.length}`} onClick={goBack} />

        <div className="absolute right-5 top-6 z-10 flex items-center gap-3 text-[9px] uppercase tracking-[0.24em] text-[#2b2422]/25 [.theme-dark_&]:text-white/30">
          <span>{correctCount} {c.correct.toLowerCase()}</span>
          <span>·</span>
          <span>×{combo}</span>
        </div>

        <main className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8 px-4 pt-20 pb-16 text-center">

          {/* Romaji cue — mirrors kanji "Meaning" cue */}
          <div>
            <div className="mb-2.5 text-[9px] font-medium uppercase tracking-[0.42em] text-[#d06070]/70">
              {c.reading}
            </div>
            <div className="text-2xl font-light tracking-widest text-[#2b2422]/85 [.theme-dark_&]:text-white/80">
              {current?.romaji[0] ?? '—'}
            </div>
          </div>

          {/* Text input */}
          <form className="w-full" onSubmit={(e) => { e.preventDefault(); checkAnswer(); }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={checked !== null}
              autoComplete="off"
              placeholder={c.answer}
              className="w-full rounded-full border border-[#2b2422]/12 bg-white/22 px-6 py-3.5 text-center font-serif text-xl text-[#2b2422] placeholder-[#2b2422]/25 outline-none backdrop-blur-[1px] transition-all duration-150 focus:border-[#d06070]/35 focus:ring-2 focus:ring-[#d06070]/10 disabled:opacity-50 [.theme-dark_&]:border-white/15 [.theme-dark_&]:bg-white/8 [.theme-dark_&]:text-white [.theme-dark_&]:placeholder-white/30"
            />
            {checked === null && (
              <button
                type="submit"
                disabled={!input.trim()}
                className="mt-4 rounded-full bg-[#d06070] px-10 py-3.5 text-sm font-medium uppercase tracking-[0.22em] text-white transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.025] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35"
              >
                {c.check}
              </button>
            )}
          </form>

          {/* Feedback + next */}
          {checked !== null && current && (
            <div className="flex flex-col items-center gap-4">
              <p className={`text-[10px] font-medium uppercase tracking-[0.36em] ${checked ? 'text-[#8d5965]/80' : 'text-[#c24f69]/70'}`}>
                {checked ? c.correct : c.wrong}
              </p>
              <div className="flex items-baseline gap-3">
                <span
                  className="select-none font-serif text-5xl leading-none text-[#2b2422] [.theme-dark_&]:text-[#f2d8d6]/85"
                  style={{ textShadow: '0 2px 16px rgba(43,36,34,0.08)' }}
                >
                  {current.char}
                </span>
                <span className="text-base font-light tracking-widest text-[#2b2422]/50 [.theme-dark_&]:text-white/50">
                  {current.romaji[0] ?? '—'}
                </span>
              </div>
              <button
                type="button"
                onClick={next}
                className="mt-1 rounded-full bg-[#d06070] px-10 py-3.5 text-sm font-medium uppercase tracking-[0.22em] text-white transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.025] active:scale-[0.98]"
              >
                {c.next}
              </button>
            </div>
          )}
        </main>
      </div>
    );
  }

  /* ── Pre-start (lobby) ── */
  return (
    <div className={SCENE_CENTER}>
      <div className={OVERLAY} />
      <div className={FOCUS_HALO} />
      <div className={DM_CHAR_HALO} />
      <Corner label="Kana · Writing Recall" />

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
          className="select-none font-serif text-[11rem] leading-none tracking-[-0.01em] text-[#2b2422] md:text-[14rem] [.theme-dark_&]:text-[#f2d8d6]/85"
          style={{ textShadow: '0 3px 24px rgba(43,36,34,0.10)' }}
        >
          {samples[0]}
        </div>

        <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.48em] text-[#2b2422]/28 [.theme-dark_&]:text-white/35">
          {c.subtitle}
        </p>

        <button
          onClick={() => startRound(reviewQueue.length > 0 ? 'review' : 'free')}
          className="mt-7 rounded-full bg-[#d06070] px-12 py-4 text-sm font-medium uppercase tracking-[0.22em] text-white transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.025] active:scale-[0.98]"
        >
          {c.start}
        </button>

        {weakEntries.length > 0 && (
          <button
            onClick={() => startRound('weak')}
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
          {samples.map((kana, i) => (
            <div
              key={kana}
              className={`select-none rounded-full border px-5 py-2.5 font-serif text-lg transition-all duration-150 ease-out hover:scale-105 ${
                i === 0
                  ? 'border-[#d06070]/20 bg-[#d06070]/6 text-[#d06070]/80 [.theme-dark_&]:border-[#d06070]/40 [.theme-dark_&]:bg-[#d06070]/22 [.theme-dark_&]:text-[#ffd6dc] hover:bg-[#d06070]/10 hover:text-[#d06070]'
                  : 'border-[#2b2422]/7 bg-white/12 text-[#2b2422]/38 [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-white/8 [.theme-dark_&]:text-white/55 hover:bg-white/24 hover:text-[#2b2422]/60'
              }`}
            >
              {kana}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
