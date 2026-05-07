import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AudioButton } from '../../../components/listening/AudioButton';
import { AppLanguage } from '../../../data/appPreferences';
import { getGoogleTranslateKanaAudioSrc } from '../../../data/kanaAudio';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../../../data/studyContent';
import { isKanaScript } from '../../../hooks/useActiveScript';
import { recordCorrect, recordWrong } from '../../../hooks/useFeedback';
import { markPracticedToday } from '../../../features/streak/tomoshibi';
import { KanaScript } from '../../../features/kana/domain/kanaItem';
import { useKanaProgressStore } from '../../../features/kana/progress/progressStore';
import { applySessionAnswerToProgress } from '../../../features/kana/progress/progressService';
import { kanaInventoryByScript } from '../../../features/kana/data/kanaInventory';
import {
  buildKanaReviewQueue,
  getKanaGroupProgressStats,
  getWeakKanaProgressEntries
} from '../../../features/kana/review/reviewSelectors';

interface PracticeKanaFlashcardsPageProps {
  language: AppLanguage;
  activeScript: KanaScript;
}

type DeckFilter = 'due' | 'weak' | 'all';
type CardMode = 'kana-front' | 'romaji-front';

const copy = {
  tr: {
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    dueDeck: 'Bekleyen',
    weakDeck: 'Zayıf',
    allDeck: 'Tümü',
    due: 'Bkl',
    weak: 'Zayıf',
    mastered: 'Tamam',
    flip: 'Çevir',
    again: 'Tekrar',
    known: 'Bildim',
    noCards: 'Bu deste şu an boş.',
    tapToFlip: 'Karta dokun',
    modeKanaFront: 'あ→a',
    modeRomajiFront: 'a→あ'
  },
  en: {
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    dueDeck: 'Due',
    weakDeck: 'Weak',
    allDeck: 'All',
    due: 'Due',
    weak: 'Weak',
    mastered: 'Done',
    flip: 'Flip',
    again: 'Again',
    known: 'Known',
    noCards: 'This deck is empty right now.',
    tapToFlip: 'Tap to flip',
    modeKanaFront: 'あ→a',
    modeRomajiFront: 'a→あ'
  }
} as const;

const isDue = (nextReviewAt: string | null, now: Date) => {
  if (!nextReviewAt) return false;
  const dueAt = new Date(nextReviewAt);
  return !Number.isNaN(dueAt.getTime()) && dueAt <= now;
};

const SCENE =
  'relative flex w-full flex-col items-center justify-center max-lg:min-h-[calc(100dvh-92px)] max-lg:overflow-y-auto lg:h-[calc(100dvh-92px)] lg:overflow-hidden';
const OVERLAY =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_38%,rgba(240,232,228,0.52)_100%)] [.theme-dark_&]:opacity-0';
const FOCUS_HALO =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_46%_36%_at_50%_42%,rgba(253,250,248,0.55)_0%,transparent_100%)] [.theme-dark_&]:opacity-0';
const DM_CHAR_HALO =
  'pointer-events-none absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl bg-[#d06070]/8 [.theme-dark_&]:opacity-100';

export const PracticeKanaFlashcardsPage: React.FC<PracticeKanaFlashcardsPageProps> = ({
  language,
  activeScript
}) => {
  const c = copy[language];
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedScript = searchParams.get('script');
  const script: KanaScript = isKanaScript(requestedScript) ? requestedScript : activeScript;
  const requestedDeck = searchParams.get('deck');
  const deckFilter: DeckFilter =
    requestedDeck === 'weak' || requestedDeck === 'all' || requestedDeck === 'due' ? requestedDeck : 'due';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardMode, setCardMode] = useState<CardMode>('kana-front');

  const sections = useMemo(
    () => (script === 'hiragana' ? getLocalizedHiraganaSections(language) : getLocalizedKatakanaSections(language)),
    [language, script]
  );

  const { getProgress, listByScript, saveProgress, summaries } = useKanaProgressStore();
  const progressEntries = listByScript(script);
  const progressMap = useMemo(
    () => new Map(progressEntries.map((entry) => [entry.kanaId, entry])),
    [progressEntries]
  );
  const now = useMemo(() => new Date(), [progressEntries, script, deckFilter]);
  const summary = summaries[script];
  const reviewQueue = useMemo(() => buildKanaReviewQueue(script, progressEntries), [progressEntries, script]);
  const weakEntries = useMemo(() => getWeakKanaProgressEntries(script, progressEntries), [progressEntries, script]);

  const deck = useMemo(() => {
    const items = kanaInventoryByScript[script].filter((item) => {
      const progress = progressMap.get(item.id);
      if (deckFilter === 'weak') return progress?.state === 'weak' || (progress?.timesWrong ?? 0) > 0;
      if (deckFilter === 'due') return progress ? isDue(progress.nextReviewAt, now) || progress.state === 'weak' : false;
      return true;
    });

    return items.sort((left, right) => {
      const leftProgress = progressMap.get(left.id);
      const rightProgress = progressMap.get(right.id);
      const leftRisk =
        (leftProgress?.state === 'weak' ? 40 : 0) +
        (isDue(leftProgress?.nextReviewAt ?? null, now) ? 20 : 0) +
        (leftProgress?.timesWrong ?? 0) * 3 -
        (leftProgress?.masteryScore ?? 0);
      const rightRisk =
        (rightProgress?.state === 'weak' ? 40 : 0) +
        (isDue(rightProgress?.nextReviewAt ?? null, now) ? 20 : 0) +
        (rightProgress?.timesWrong ?? 0) * 3 -
        (rightProgress?.masteryScore ?? 0);
      return rightRisk - leftRisk;
    });
  }, [deckFilter, now, progressMap, script]);

  const currentCard = deck[currentIndex] ?? null;

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [deckFilter, script]);

  useEffect(() => {
    if (currentIndex >= deck.length) {
      setCurrentIndex(Math.max(deck.length - 1, 0));
      setIsFlipped(false);
    }
  }, [currentIndex, deck.length]);

  const setScript = (next: KanaScript) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('script', next);
    setSearchParams(nextParams);
  };

  const setDeckFilter = (next: DeckFilter) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('script', script);
    nextParams.set('deck', next);
    setSearchParams(nextParams);
  };

  const advance = () => {
    if (deck.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % deck.length);
    setIsFlipped(false);
  };

  const rateCard = (correct: boolean) => {
    if (!currentCard) return;
    const progress = getProgress(currentCard.id);
    if (progress) {
      saveProgress(
        applySessionAnswerToProgress(progress, {
          itemId: currentCard.id,
          mode: 'typing',
          correct,
          answeredAt: new Date().toISOString(),
          latencyMs: 0,
          hintsUsed: isFlipped ? 0 : 1,
          retries: 0,
          responseItemId: null,
          variant: 'flashcards'
        })
      );
    }
    if (correct) {
      recordCorrect();
      markPracticedToday();
    } else {
      recordWrong();
    }
    advance();
  };

  const deckCounts: [DeckFilter, string, number][] = [
    ['due', c.dueDeck, reviewQueue.length],
    ['weak', c.weakDeck, weakEntries.length],
    ['all', c.allDeck, kanaInventoryByScript[script].length]
  ];

  return (
    <div className={SCENE}>
      <div className={OVERLAY} />
      <div className={FOCUS_HALO} />
      <div className={DM_CHAR_HALO} />

      {/* Corner breadcrumb */}
      <div className="absolute left-5 top-6 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-[#2b2422]/28 [.theme-dark_&]:text-white/35">
        <span className="inline-block h-[3px] w-[3px] rounded-full bg-[#d06070]/70" />
        Kana · Flashcards
        {deck.length > 0 && (
          <span className="ml-1 opacity-60">· {currentIndex + 1}/{deck.length}</span>
        )}
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

      <main className="relative z-10 flex w-full max-w-xs flex-col items-center gap-6 px-4 text-center sm:max-w-sm">

        {/* Deck filter tabs */}
        <div className="flex items-center gap-1.5">
          {deckCounts.map(([id, label, count]) => (
            <button
              key={id}
              type="button"
              onClick={() => setDeckFilter(id)}
              className={`rounded-full border px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] transition-all duration-150 ${
                deckFilter === id
                  ? 'border-[#d06070]/30 bg-[#d06070]/10 text-[#d06070]/80'
                  : 'border-[#2b2422]/8 bg-white/10 text-[#2b2422]/30 hover:text-[#2b2422]/50'
              }`}
            >
              {label} · {count}
            </button>
          ))}
        </div>

        {/* Card area */}
        {deck.length === 0 ? (
          <div className="flex h-52 w-full items-center justify-center rounded-2xl border border-[#2b2422]/8 bg-white/14 backdrop-blur-[2px]">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#2b2422]/30">{c.noCards}</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsFlipped((v) => !v)}
            className="flex h-52 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-[#2b2422]/8 bg-white/18 backdrop-blur-[2px] transition-all duration-200 hover:bg-white/26 active:scale-[0.99]"
          >
            {isFlipped ? (
              cardMode === 'kana-front' ? (
                <>
                  <div className="font-mono text-6xl font-black lowercase leading-none text-[#2b2422]">
                    {currentCard?.romaji.join(' / ')}
                  </div>
                  <div className="text-[9px] uppercase tracking-[0.3em] text-[#2b2422]/28">
                    {currentCard?.groupLabel}
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="select-none font-serif text-[7rem] leading-none text-[#2b2422]"
                    style={{ textShadow: '0 2px 20px rgba(43,36,34,0.08)' }}
                  >
                    {currentCard?.char}
                  </div>
                  <div className="text-[9px] uppercase tracking-[0.3em] text-[#2b2422]/28">
                    {currentCard?.groupLabel}
                  </div>
                </>
              )
            ) : (
              cardMode === 'kana-front' ? (
                <>
                  <div
                    className="select-none font-serif text-[7rem] leading-none text-[#2b2422]"
                    style={{ textShadow: '0 2px 20px rgba(43,36,34,0.08)' }}
                  >
                    {currentCard?.char}
                  </div>
                  <div className="text-[9px] uppercase tracking-[0.3em] text-[#2b2422]/22">
                    {c.tapToFlip}
                  </div>
                </>
              ) : (
                <>
                  <div className="font-mono text-6xl font-black lowercase leading-none text-[#2b2422]">
                    {currentCard?.romaji.join(' / ')}
                  </div>
                  <div className="text-[9px] uppercase tracking-[0.3em] text-[#2b2422]/22">
                    {c.tapToFlip}
                  </div>
                </>
              )
            )}
          </button>
        )}

        {/* AudioButton + indicator */}
        {currentCard && (
          <div className="flex items-center gap-5">
            <AudioButton
              src={getGoogleTranslateKanaAudioSrc(currentCard.id) ?? ''}
              language={language}
              className="h-9 w-9 opacity-50 hover:opacity-80"
              size={16}
            />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#2b2422]/28">
              {currentIndex + 1} / {deck.length}
            </span>
            <div className="h-9 w-9" />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex h-14 items-center justify-center gap-3">
          {deck.length === 0 ? null : (
            <>
              <button
                type="button"
                onClick={() => rateCard(false)}
                className="rounded-full border border-[#2b2422]/8 bg-white/12 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-[#2b2422]/36 transition-all duration-150 ease-out hover:bg-white/24 hover:text-[#2b2422]/55 active:scale-[0.98]"
              >
                {c.again}
              </button>
              <button
                type="button"
                onClick={() => setIsFlipped((v) => !v)}
                className="rounded-full border border-[#2b2422]/10 bg-white/16 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-[#2b2422]/40 transition-all duration-150 ease-out hover:bg-white/26 hover:text-[#2b2422]/60 active:scale-[0.98]"
              >
                {c.flip}
              </button>
              <button
                type="button"
                onClick={() => rateCard(true)}
                className="rounded-full bg-[#d06070] px-7 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-white transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.025] active:scale-[0.98]"
              >
                {c.known}
              </button>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.3em] text-[#2b2422]/25 [.theme-dark_&]:text-white/30">
          <span>{c.due} {summary.dueCount}</span>
          <span>·</span>
          <span>{c.weak} {summary.weakCount}</span>
          <span>·</span>
          <span>{c.mastered} {summary.masteredCount}</span>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {(['kana-front', 'romaji-front'] as CardMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setCardMode(mode)}
              className={`select-none rounded-full border px-5 py-2.5 font-serif text-lg transition-all duration-150 ease-out hover:scale-105 ${
                cardMode === mode
                  ? 'border-[#d06070]/20 bg-[#d06070]/6 text-[#d06070]/80 [.theme-dark_&]:border-[#d06070]/40 [.theme-dark_&]:bg-[#d06070]/22 [.theme-dark_&]:text-[#ffd6dc] hover:bg-[#d06070]/10 hover:text-[#d06070]'
                  : 'border-[#2b2422]/7 bg-white/12 text-[#2b2422]/38 [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-white/8 [.theme-dark_&]:text-white/55 hover:bg-white/24 hover:text-[#2b2422]/60'
              }`}
            >
              {mode === 'kana-front' ? c.modeKanaFront : c.modeRomajiFront}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};
