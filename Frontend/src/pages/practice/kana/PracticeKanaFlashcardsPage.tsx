import React, { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  BookOpen,
  Clock3,
  Eye,
  Layers3,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Volume2
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Button, Eyebrow, PageHeader, PageShell } from '../../../components/ui';
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

const copy = {
  tr: {
    eyebrow: 'Kana Practice',
    title: 'Flashcards',
    description: 'Kana kartlarini cevir, cevabi kontrol et, kolay/zor geri bildirimiyle tekrar sirasini guncelle.',
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    dueDeck: 'Bekleyen kartlar',
    weakDeck: 'Zayif kartlar',
    allDeck: 'Tum kartlar',
    due: 'Bekleyen',
    weak: 'Zayif',
    mastered: 'Tamamlanan',
    tracked: 'Takipte',
    front: 'On yuz',
    back: 'Arka yuz',
    flip: 'Kartı cevir',
    again: 'Tekrar et',
    known: 'Bildim',
    replay: 'Sesi dinle',
    noCards: 'Bu deste su an bos.',
    card: 'kart',
    focusQueue: 'Kart odagi',
    focusHint: 'Zayif ve bekleyen gruplar once gorunur.',
    emptyFocus: 'Henuz riskli grup yok.',
    ready: 'Hazir',
    srs: 'Tekrar sirasi',
    srsText: 'Bildim dersen kart ileri tarihe atilir; tekrar et dersen yeniden one gelir.',
    audio: 'Ses baglantisi',
    audioText: 'Kartin sesiyle romaji ve kana formunu birlikte pekistirirsin.',
    memory: 'Aktif hatirlama',
    memoryText: 'Cevabi gormeden once kendi icinden okumayi denersin.'
  },
  en: {
    eyebrow: 'Kana Practice',
    title: 'Flashcards',
    description: 'Flip kana cards, check the answer, and update review order with easy/hard feedback.',
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    dueDeck: 'Due cards',
    weakDeck: 'Weak cards',
    allDeck: 'All cards',
    due: 'Due',
    weak: 'Weak',
    mastered: 'Mastered',
    tracked: 'Tracked',
    front: 'Front',
    back: 'Back',
    flip: 'Flip card',
    again: 'Review again',
    known: 'I knew it',
    replay: 'Play audio',
    noCards: 'This deck is empty right now.',
    card: 'cards',
    focusQueue: 'Card focus',
    focusHint: 'Weak and due groups appear first.',
    emptyFocus: 'No risky groups yet.',
    ready: 'Ready',
    srs: 'Review order',
    srsText: 'Known cards move forward; review-again cards return to the front.',
    audio: 'Sound link',
    audioText: 'Use audio to bind romaji and kana form together.',
    memory: 'Active recall',
    memoryText: 'Try to recall the answer before revealing the back.'
  }
} as const;

const isDue = (nextReviewAt: string | null, now: Date) => {
  if (!nextReviewAt) {
    return false;
  }

  const dueAt = new Date(nextReviewAt);
  return !Number.isNaN(dueAt.getTime()) && dueAt <= now;
};

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
  const focusGroups = useMemo(
    () => getKanaGroupProgressStats(sections, progressEntries).slice(0, 5),
    [progressEntries, sections]
  );

  const deck = useMemo(() => {
    const items = kanaInventoryByScript[script].filter((item) => {
      const progress = progressMap.get(item.id);

      if (deckFilter === 'weak') {
        return progress?.state === 'weak' || (progress?.timesWrong ?? 0) > 0;
      }

      if (deckFilter === 'due') {
        return progress ? isDue(progress.nextReviewAt, now) || progress.state === 'weak' : false;
      }

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
  const currentProgress = currentCard ? progressMap.get(currentCard.id) : null;

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
    if (deck.length === 0) {
      return;
    }

    setCurrentIndex((previousIndex) => (previousIndex + 1) % deck.length);
    setIsFlipped(false);
  };

  const rateCard = (correct: boolean) => {
    if (!currentCard) {
      return;
    }

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

  return (
    <PageShell width="wide" className="pb-14">
      <PageHeader
        eyebrow={<Eyebrow>{c.eyebrow}</Eyebrow>}
        title={c.title}
        description={c.description}
        actions={
          <div className="inline-flex rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface)] p-1 shadow-[var(--kt-shadow-sm)]">
            {(['hiragana', 'katakana'] as KanaScript[]).map((option) => {
              const active = option === script;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setScript(option)}
                  aria-pressed={active}
                  className={`h-9 rounded-md px-3 text-sm font-semibold transition ${
                    active
                      ? 'bg-[var(--kt-brand)] text-[var(--kt-brand-on)]'
                      : 'text-[var(--kt-ink-muted)] hover:bg-[var(--kt-surface-muted)] hover:text-[var(--kt-ink)]'
                  }`}
                >
                  {option === 'hiragana' ? c.hiragana : c.katakana}
                </button>
              );
            })}
          </div>
        }
      />

      <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.8fr)]">
        <div className="rounded-lg border border-[color:var(--kt-brand)]/20 bg-[color-mix(in_srgb,var(--kt-surface)_86%,transparent)] p-5 shadow-[var(--kt-shadow-sm)] md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            {([
              ['due', c.dueDeck, reviewQueue.length],
              ['weak', c.weakDeck, weakEntries.length],
              ['all', c.allDeck, kanaInventoryByScript[script].length]
            ] as [DeckFilter, string, number][]).map(([id, label, count]) => (
              <button
                key={id}
                type="button"
                onClick={() => setDeckFilter(id)}
                aria-pressed={deckFilter === id}
                className={`rounded-lg border px-3 py-2 text-sm font-black transition ${
                  deckFilter === id
                    ? 'border-[color:var(--kt-brand)]/50 bg-[var(--kt-brand)] text-[var(--kt-brand-on)]'
                    : 'border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink)] hover:bg-[var(--kt-surface-muted)]'
                }`}
              >
                {label} · {count}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
            <div>
              <button
                type="button"
                onClick={() => setIsFlipped((value) => !value)}
                disabled={!currentCard}
                className="flex min-h-[22rem] w-full flex-col items-center justify-center rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface)] p-6 text-center shadow-[var(--kt-shadow-sm)] transition hover:bg-[var(--kt-surface-muted)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {currentCard ? (
                  <>
                    <div className="text-xs font-black uppercase tracking-[0.16em] text-[var(--kt-ink-subtle)]">
                      {isFlipped ? c.back : c.front}
                    </div>
                    {isFlipped ? (
                      <>
                        <div className="mt-6 font-mono text-5xl font-black lowercase text-[var(--kt-ink-strong)]">
                          {currentCard.romaji.join(' / ')}
                        </div>
                        <div className="mt-5 text-sm font-semibold text-[var(--kt-ink-muted)]">
                          {currentCard.sectionTitle} · {currentCard.groupLabel}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mt-6 font-jp text-8xl font-black leading-none text-[var(--kt-ink-strong)]">
                          {currentCard.char}
                        </div>
                        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--kt-brand-soft)] px-3 py-1 text-sm font-bold text-[var(--kt-brand)]">
                          <Eye size={15} />
                          {c.flip}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-[var(--kt-ink-muted)]">{c.noCards}</div>
                )}
              </button>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <Button
                  as="button"
                  type="button"
                  variant="secondary"
                  onClick={() => currentCard && setIsFlipped((value) => !value)}
                  disabled={!currentCard}
                >
                  {c.flip}
                </Button>
                <Button
                  as="button"
                  type="button"
                  variant="danger"
                  onClick={() => rateCard(false)}
                  disabled={!currentCard}
                >
                  {c.again}
                </Button>
                <Button
                  as="button"
                  type="button"
                  onClick={() => rateCard(true)}
                  disabled={!currentCard}
                >
                  {c.known}
                </Button>
              </div>
            </div>

            <aside className="space-y-3">
              <div className="rounded-lg border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
                  <Layers3 size={15} className="text-[var(--kt-brand)]" />
                  {deck.length} {c.card}
                </div>
                <div className="mt-2 text-2xl font-black text-[var(--kt-ink-strong)]">
                  {deck.length > 0 ? `${currentIndex + 1}/${deck.length}` : '0/0'}
                </div>
              </div>
              <div className="rounded-lg border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
                  <Volume2 size={15} className="text-[var(--kt-brand)]" />
                  {c.replay}
                </div>
                <div className="mt-3">
                  {currentCard ? (
                    <AudioButton
                      src={getGoogleTranslateKanaAudioSrc(currentCard.id) ?? ''}
                      language={language}
                      className="h-12 w-12"
                    />
                  ) : null}
                </div>
              </div>
              <div className="rounded-lg border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-4">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
                  Mastery
                </div>
                <div className="mt-2 text-2xl font-black text-[var(--kt-ink-strong)]">
                  {currentProgress?.masteryScore ?? 0}/4
                </div>
                <div className="mt-2 text-xs text-[var(--kt-ink-muted)]">
                  {currentProgress?.state ?? 'new'}
                </div>
              </div>
            </aside>
          </div>
        </div>

        <aside className="rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5 shadow-[var(--kt-shadow-sm)]">
          <div className="grid gap-2">
            <Metric icon={<Clock3 size={16} />} label={c.due} value={summary.dueCount} />
            <Metric icon={<ShieldAlert size={16} />} label={c.weak} value={summary.weakCount} />
            <Metric icon={<BadgeCheck size={16} />} label={c.mastered} value={summary.masteredCount} />
            <Metric icon={<Sparkles size={16} />} label={c.tracked} value={summary.tracked} />
          </div>
        </aside>
      </section>

      <section className="mt-4 grid gap-3 md:grid-cols-3">
        <ModeNote icon={<RotateCcw size={18} />} title={c.srs} text={c.srsText} />
        <ModeNote icon={<Volume2 size={18} />} title={c.audio} text={c.audioText} />
        <ModeNote icon={<BookOpen size={18} />} title={c.memory} text={c.memoryText} />
      </section>

      <section className="mt-6 rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5 shadow-[var(--kt-shadow-sm)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-[var(--kt-ink-strong)]">{c.focusQueue}</h2>
            <p className="mt-1 text-sm text-[var(--kt-ink-muted)]">{c.focusHint}</p>
          </div>
          <BookOpen className="text-[var(--kt-brand)]" size={20} />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {focusGroups.length > 0 ? (
            focusGroups.map((group) => {
              const risk = group.weak * 3 + group.due * 2 + (group.total - group.mastered);
              return (
                <div key={group.groupId} className="rounded-lg border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-3">
                  <div className="truncate text-sm font-bold text-[var(--kt-ink-strong)]">{group.groupLabel}</div>
                  <div className="mt-0.5 truncate text-xs text-[var(--kt-ink-muted)]">{group.sectionTitle}</div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--kt-progress-track)]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,var(--kt-brand),var(--kt-dan-gold))]"
                      style={{ width: `${group.total > 0 ? Math.round((group.mastered / group.total) * 100) : 0}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-[var(--kt-ink-subtle)]">
                    <span>{group.mastered}/{group.total} {c.ready}</span>
                    <span>{risk}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-lg border border-dashed border-[var(--kt-border)] p-4 text-sm text-[var(--kt-ink-muted)]">
              {c.emptyFocus}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
};

interface MetricProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

const Metric: React.FC<MetricProps> = ({ icon, label, value }) => (
  <div className="rounded-lg border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-4">
    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
      <span className="text-[var(--kt-brand)]">{icon}</span>
      {label}
    </div>
    <div className="mt-2 text-2xl font-black text-[var(--kt-ink-strong)]">{value}</div>
  </div>
);

interface ModeNoteProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

const ModeNote: React.FC<ModeNoteProps> = ({ icon, title, text }) => (
  <div className="rounded-lg border border-[var(--kt-border-subtle)] bg-[color-mix(in_srgb,var(--kt-surface)_82%,transparent)] p-4">
    <div className="flex items-center gap-2 text-sm font-black text-[var(--kt-ink-strong)]">
      <span className="text-[var(--kt-brand)]">{icon}</span>
      {title}
    </div>
    <p className="mt-2 text-sm leading-6 text-[var(--kt-ink-muted)]">{text}</p>
  </div>
);
