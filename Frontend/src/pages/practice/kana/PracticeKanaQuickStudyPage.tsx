import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { AppLanguage } from '../../../data/appPreferences';
import { getGoogleTranslateKanaAudioSrc } from '../../../data/kanaAudio';
import { isKanaScript } from '../../../hooks/useActiveScript';
import { recordCorrect, recordWrong } from '../../../hooks/useFeedback';
import { markPracticedToday } from '../../../features/streak/tomoshibi';
import { KanaItem, KanaScript } from '../../../features/kana/domain/kanaItem';
import { applySessionAnswerToProgress } from '../../../features/kana/progress/progressService';
import { useKanaProgressStore } from '../../../features/kana/progress/progressStore';
import { kanaInventoryByScript } from '../../../features/kana/data/kanaInventory';
import {
  buildKanaReviewQueue,
  getWeakKanaProgressEntries
} from '../../../features/kana/review/reviewSelectors';

interface PracticeKanaQuickStudyPageProps {
  language: AppLanguage;
  activeScript: KanaScript;
}

type QuickQuestionType = 'kana-to-romaji' | 'romaji-to-kana' | 'audio-to-kana';

interface QuickQuestion {
  id: string;
  type: QuickQuestionType;
  item: KanaItem;
  choices: string[];
}

const strings = {
  tr: {
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    start: 'Hızlı turu başlat',
    restart: 'Yeniden başlat',
    next: 'Sonraki',
    due: 'Bkl',
    weak: 'Zayıf',
    mastered: 'Tamam',
    complete: 'Tur tamamlandı',
    correct: 'Doğru',
    wrong: 'Yanlış',
    kanaToRomaji: 'Okuyuşu seç',
    romajiToKana: 'Kanayi seç',
    audioToKana: 'Sesi dinle, kanayi seç',
    subtitle: 'Kana, romaji ve sesi karışık çöz',
  },
  en: {
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    start: 'Start quick round',
    restart: 'Restart',
    next: 'Next',
    due: 'Due',
    weak: 'Weak',
    mastered: 'Done',
    complete: 'Round complete',
    correct: 'Correct',
    wrong: 'Wrong',
    kanaToRomaji: 'Choose the reading',
    romajiToKana: 'Choose the kana',
    audioToKana: 'Listen and choose',
    subtitle: 'Mixed kana, romaji and audio prompts',
  }
} as const;

const sampleByScript: Record<KanaScript, string[]> = {
  hiragana: ['き', 'つ', 'ね', 'ゆ', 'は'],
  katakana: ['キ', 'ツ', 'ネ', 'ユ', 'ハ']
};

const shuffle = <T,>(items: T[]) => {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

const getAnswerValue = (q: QuickQuestion) =>
  q.type === 'kana-to-romaji' ? q.item.romaji[0] : q.item.char;

const buildChoices = (item: KanaItem, type: QuickQuestionType, inventory: KanaItem[], count: number) => {
  const correct = type === 'kana-to-romaji' ? item.romaji[0] : item.char;
  const distractors = shuffle(
    inventory
      .filter(c => c.id !== item.id)
      .map(c => type === 'kana-to-romaji' ? c.romaji[0] : c.char)
      .filter(v => v !== correct)
  ).slice(0, count - 1);
  return shuffle([correct, ...distractors]);
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

const KanaAudioButton: React.FC<{ kanaId: string; autoPlay?: boolean; autoPlayToken?: string }> = ({
  kanaId, autoPlay = false, autoPlayToken
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const src = getGoogleTranslateKanaAudioSrc(kanaId) ?? '';

  const play = () => {
    if (!src) return;
    if (!audioRef.current || audioRef.current.src !== src) {
      audioRef.current = new Audio(src);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  useEffect(() => {
    if (autoPlay) play();
    return () => { audioRef.current?.pause(); };
  }, [autoPlayToken]);

  return (
    <button
      type="button"
      onClick={play}
      className="flex h-20 w-20 items-center justify-center rounded-full border border-[#d06070]/18 bg-[#d06070]/7 text-[#d06070]/70 transition-all duration-150 ease-out hover:bg-[#d06070]/12 hover:scale-105 active:scale-95"
    >
      <Volume2 size={30} />
    </button>
  );
};

export const PracticeKanaQuickStudyPage: React.FC<PracticeKanaQuickStudyPageProps> = ({
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

  const prioritizedPool = useMemo(() => {
    const priorityIds = new Set([...reviewQueue.map(e => e.kanaId), ...weakEntries.map(e => e.kanaId)]);
    return [...inventory.filter(i => priorityIds.has(i.id)), ...shuffle(inventory.filter(i => !priorityIds.has(i.id)))];
  }, [inventory, reviewQueue, weakEntries]);

  const [questions, setQuestions] = useState<QuickQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const current = questions[index] ?? null;

  const goBack = () => {
    setQuestions([]); setIsComplete(false); setChecked(null); setSelected(null);
    setIndex(0); setCorrectCount(0); setWrongCount(0); setCombo(0);
  };

  const setScript = (next: KanaScript) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('script', next);
    setSearchParams(nextParams);
    setQuestions([]);
    setIndex(0);
    setSelected(null);
    setChecked(null);
    setCorrectCount(0);
    setWrongCount(0);
    setCombo(0);
    setIsComplete(false);
  };

  const startRound = () => {
    const roundItems = shuffle(prioritizedPool).slice(0, 12);
    const built = roundItems.map((item, i) => {
      const type: QuickQuestionType =
        i % 3 === 0 ? 'kana-to-romaji' : i % 3 === 1 ? 'romaji-to-kana' : 'audio-to-kana';
      return { id: `${item.id}-${type}-${i}`, type, item, choices: buildChoices(item, type, inventory, 6) };
    });
    setQuestions(built);
    setIndex(0);
    setSelected(null);
    setChecked(null);
    setCorrectCount(0);
    setWrongCount(0);
    setCombo(0);
    setIsComplete(false);
  };

  const choose = (choice: string) => {
    if (!current || checked !== null) return;
    const correct = choice === getAnswerValue(current);
    const progress = getProgress(current.item.id);
    if (progress) {
      saveProgress(applySessionAnswerToProgress(progress, {
        itemId: current.item.id,
        mode: current.type === 'audio-to-kana' ? 'listening' : 'typing',
        correct,
        answeredAt: new Date().toISOString(),
        latencyMs: 0,
        hintsUsed: 0,
        retries: 0,
        responseItemId: current.type === 'kana-to-romaji'
          ? null
          : inventory.find(i => i.char === choice)?.id ?? null,
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
    setSelected(choice);
    setChecked(correct);
  };

  const next = () => {
    if (index + 1 >= questions.length) { setIsComplete(true); setChecked(null); return; }
    setIndex(v => v + 1);
    setSelected(null);
    setChecked(null);
  };

  /* ── Completion ── */
  if (isComplete) {
    return (
      <div className={SCENE_CENTER}>
        <div className={OVERLAY} />
        <div className={FOCUS_HALO} />
        <div className={DM_CHAR_HALO} />
        <Corner label="Kana · Quick Study" onClick={goBack} />
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
            onClick={startRound}
            className="mt-5 rounded-full bg-[#d06070] px-11 py-4 text-sm font-medium uppercase tracking-[0.22em] text-white transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.025] active:scale-[0.98]"
          >
            {c.restart}
          </button>
        </div>
      </div>
    );
  }

  /* ── Active round ── */
  if (questions.length > 0) {
    const correctAnswer = current ? getAnswerValue(current) : '';
    return (
      <div className={SCENE_SCROLL}>
        <div className={OVERLAY} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_46%,rgba(253,250,248,0.5)_0%,transparent_100%)] [.theme-dark_&]:opacity-0" />
        <div className={DM_CHAR_HALO} />

        <Corner label={`Quick Study · ${index + 1} / ${questions.length}`} onClick={goBack} />

        <div className="absolute right-5 top-6 z-10 flex items-center gap-3 text-[9px] uppercase tracking-[0.24em] text-[#2b2422]/25 [.theme-dark_&]:text-white/30">
          <span>{correctCount} {c.correct.toLowerCase()}</span>
          <span>·</span>
          <span>×{combo}</span>
        </div>

        <main className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8 px-4 pt-20 pb-16 text-center">

          {/* Prompt — mirrors kanji/usage cue layout */}
          {current?.type === 'kana-to-romaji' && (
            <div>
              <div
                className="select-none font-serif text-[6rem] leading-none text-[#2b2422] [.theme-dark_&]:text-[#f2d8d6]/85"
                style={{ textShadow: '0 2px 20px rgba(43,36,34,0.09)' }}
              >
                {current.item.char}
              </div>
              <div className="mt-3 text-[10px] font-medium uppercase tracking-[0.42em] text-[#2b2422]/30 [.theme-dark_&]:text-white/35">
                {c.kanaToRomaji}
              </div>
            </div>
          )}

          {current?.type === 'romaji-to-kana' && (
            <div>
              <div className="text-[4rem] font-light tracking-widest text-[#2b2422]/85 [.theme-dark_&]:text-white/80">
                {current.item.romaji[0]}
              </div>
              <div className="mt-3 text-[10px] font-medium uppercase tracking-[0.42em] text-[#2b2422]/30 [.theme-dark_&]:text-white/35">
                {c.romajiToKana}
              </div>
            </div>
          )}

          {current?.type === 'audio-to-kana' && (
            <div className="flex flex-col items-center gap-3">
              <KanaAudioButton
                kanaId={current.item.id}
                autoPlay
                autoPlayToken={current.id}
              />
              <div className="text-[10px] font-medium uppercase tracking-[0.42em] text-[#2b2422]/30 [.theme-dark_&]:text-white/35">
                {c.audioToKana}
              </div>
            </div>
          )}

          {/* Choice grid — 3-col for all types */}
          <div className="grid w-full grid-cols-3 gap-2">
            {current?.choices.map((choice) => {
              const isSelected = selected === choice;
              const showOk = checked !== null && choice === correctAnswer;
              const showBad = isSelected && choice !== correctAnswer;
              return (
                <button
                  key={choice}
                  type="button"
                  disabled={checked !== null}
                  onClick={() => choose(choice)}
                  className={`min-h-[4.5rem] rounded-2xl border transition-all duration-150 ease-out ${
                    current?.type !== 'kana-to-romaji' ? 'font-serif text-3xl' : 'font-mono text-xl lowercase'
                  } ${
                    showOk
                      ? 'border-[#8d5965]/30 bg-[#8d5965]/8 text-[#8d5965]'
                      : showBad
                        ? 'border-[#c24f69]/30 bg-[#c24f69]/8 text-[#c24f69]'
                        : 'border-[#2b2422]/8 bg-white/14 text-[#2b2422]/80 hover:bg-white/24 hover:scale-[1.03] active:scale-[0.98] [.theme-dark_&]:border-white/12 [.theme-dark_&]:bg-white/8 [.theme-dark_&]:text-white/75 [.theme-dark_&]:hover:bg-white/14'
                  }`}
                >
                  {choice}
                </button>
              );
            })}
          </div>

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
                  {current.item.char}
                </span>
                <span className="text-base font-light tracking-widest text-[#2b2422]/50 [.theme-dark_&]:text-white/50">
                  {current.item.romaji[0] ?? '—'}
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

  /* ── Pre-start ── */
  return (
    <div className={SCENE_CENTER}>
      <div className={OVERLAY} />
      <div className={FOCUS_HALO} />
      <div className={DM_CHAR_HALO} />
      <Corner label="Kana · Quick Study" />

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
          onClick={startRound}
          className="mt-7 rounded-full bg-[#d06070] px-12 py-4 text-sm font-medium uppercase tracking-[0.22em] text-white transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.025] active:scale-[0.98]"
        >
          {c.start}
        </button>

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
