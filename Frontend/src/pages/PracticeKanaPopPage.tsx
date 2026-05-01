import React, { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  Clock3,
  Gamepad2,
  Headphones,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Target,
  Timer,
  Volume2,
  Zap
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Button, Eyebrow, PageHeader, PageShell } from '../components/ui';
import { AudioButton } from '../components/listening/AudioButton';
import { AppLanguage } from '../data/appPreferences';
import { getGoogleTranslateKanaAudioSrc } from '../data/kanaAudio';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../data/studyContent';
import { isKanaScript } from '../hooks/useActiveScript';
import { recordCorrect, recordWrong } from '../hooks/useFeedback';
import { markPracticedToday } from '../features/streak/tomoshibi';
import { KanaItem, KanaScript } from '../features/kana/domain/kanaItem';
import { applySessionAnswerToProgress } from '../features/kana/progress/progressService';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import { kanaInventoryByScript } from '../features/kana/data/kanaInventory';
import {
  buildKanaReviewQueue,
  getKanaGroupProgressStats,
  getWeakKanaProgressEntries
} from '../features/kana/review/reviewSelectors';

interface PracticeKanaPopPageProps {
  language: AppLanguage;
  activeScript: KanaScript;
}

type PopPromptType = 'romaji' | 'audio';

interface PopRound {
  id: string;
  type: PopPromptType;
  item: KanaItem;
  choices: KanaItem[];
}

const ROUND_COUNT = 15;
const TIME_LIMIT_SECONDS = 45;

const copy = {
  tr: {
    eyebrow: 'Kana Practice',
    title: 'Kana Pop',
    description: 'Ipucunu oku veya sesi dinle, dogru kanayi hizli sec ve combo zinciri kur.',
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    start: 'Pop turunu baslat',
    restart: 'Yeniden baslat',
    next: 'Siradaki',
    due: 'Bekleyen',
    weak: 'Zayif',
    mastered: 'Tamamlanan',
    tracked: 'Takipte',
    score: 'Skor',
    combo: 'Combo',
    time: 'Sure',
    complete: 'Tur tamamlandi',
    romajiCue: 'Romaji ipucu',
    audioCue: 'Ses ipucu',
    chooseKana: 'Dogru kanayi patlat',
    correct: 'Dogru',
    wrong: 'Yanlis',
    focusQueue: 'Pop odagi',
    focusHint: 'Bekleyen ve zayif gruplar tur havuzunda one alinir.',
    emptyFocus: 'Henuz riskli grup yok.',
    ready: 'Hazir',
    reflex: 'Refleks',
    reflexText: 'Kisa sureli sorular hizli tanimayi guclendirir.',
    comboNote: 'Combo zinciri',
    comboText: 'Arka arkaya dogru cevaplar oyun feedback sistemine baglanir.',
    progress: 'Progress bagli',
    progressText: 'Dogru ve yanlislar weak/due/mastery verisine islenir.'
  },
  en: {
    eyebrow: 'Kana Practice',
    title: 'Kana Pop',
    description: 'Read the clue or hear the sound, choose the right kana fast, and build a combo chain.',
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    start: 'Start pop round',
    restart: 'Restart',
    next: 'Next',
    due: 'Due',
    weak: 'Weak',
    mastered: 'Mastered',
    tracked: 'Tracked',
    score: 'Score',
    combo: 'Combo',
    time: 'Time',
    complete: 'Round complete',
    romajiCue: 'Romaji clue',
    audioCue: 'Audio clue',
    chooseKana: 'Pop the correct kana',
    correct: 'Correct',
    wrong: 'Wrong',
    focusQueue: 'Pop focus',
    focusHint: 'Due and weak groups are prioritized in the round pool.',
    emptyFocus: 'No risky groups yet.',
    ready: 'Ready',
    reflex: 'Reflex',
    reflexText: 'Short timed prompts strengthen fast recognition.',
    comboNote: 'Combo chain',
    comboText: 'Consecutive correct answers feed the game feedback system.',
    progress: 'Progress linked',
    progressText: 'Correct and wrong answers update weak, due, and mastery data.'
  }
} as const;

const shuffle = <T,>(items: T[]) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
};

const buildChoices = (answer: KanaItem, inventory: KanaItem[]) =>
  shuffle([
    answer,
    ...shuffle(inventory.filter((item) => item.id !== answer.id)).slice(0, 7)
  ]);

export const PracticeKanaPopPage: React.FC<PracticeKanaPopPageProps> = ({
  language,
  activeScript
}) => {
  const c = copy[language];
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedScript = searchParams.get('script');
  const script: KanaScript = isKanaScript(requestedScript) ? requestedScript : activeScript;
  const [rounds, setRounds] = useState<PopRound[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(TIME_LIMIT_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const sections = useMemo(
    () => (script === 'hiragana' ? getLocalizedHiraganaSections(language) : getLocalizedKatakanaSections(language)),
    [language, script]
  );
  const inventory = kanaInventoryByScript[script];
  const { getProgress, listByScript, saveProgress, summaries } = useKanaProgressStore();
  const progressEntries = listByScript(script);
  const summary = summaries[script];
  const reviewQueue = useMemo(() => buildKanaReviewQueue(script, progressEntries), [progressEntries, script]);
  const weakEntries = useMemo(() => getWeakKanaProgressEntries(script, progressEntries), [progressEntries, script]);
  const focusGroups = useMemo(
    () => getKanaGroupProgressStats(sections, progressEntries).slice(0, 5),
    [progressEntries, sections]
  );

  const prioritizedPool = useMemo(() => {
    const priorityIds = new Set([...reviewQueue.map((entry) => entry.kanaId), ...weakEntries.map((entry) => entry.kanaId)]);
    const priorityItems = inventory.filter((item) => priorityIds.has(item.id));
    const fallbackItems = inventory.filter((item) => !priorityIds.has(item.id));
    return [...priorityItems, ...shuffle(fallbackItems)];
  }, [inventory, reviewQueue, weakEntries]);

  const currentRound = rounds[currentIndex] ?? null;

  useEffect(() => {
    if (!isRunning || selectedId || isComplete) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          setIsComplete(true);
          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isComplete, isRunning, selectedId]);

  const resetRoundState = () => {
    setCurrentIndex(0);
    setSelectedId(null);
    setCorrectCount(0);
    setWrongCount(0);
    setCombo(0);
    setBestCombo(0);
    setRemainingSeconds(TIME_LIMIT_SECONDS);
    setIsComplete(false);
  };

  const setScript = (next: KanaScript) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('script', next);
    setSearchParams(nextParams);
    setRounds([]);
    resetRoundState();
    setIsRunning(false);
  };

  const startRound = () => {
    const selectedItems = shuffle(prioritizedPool).slice(0, ROUND_COUNT);
    const nextRounds = selectedItems.map((item, index) => ({
      id: `${item.id}-${index}`,
      type: index % 3 === 2 ? 'audio' as const : 'romaji' as const,
      item,
      choices: buildChoices(item, inventory)
    }));

    setRounds(nextRounds);
    resetRoundState();
    setIsRunning(true);
  };

  const finishRound = () => {
    setIsRunning(false);
    setIsComplete(true);
    setSelectedId(null);
  };

  const answerRound = (choice: KanaItem) => {
    if (!currentRound || selectedId || isComplete) {
      return;
    }

    const correct = choice.id === currentRound.item.id;
    const progress = getProgress(currentRound.item.id);

    if (progress) {
      saveProgress(
        applySessionAnswerToProgress(progress, {
          itemId: currentRound.item.id,
          mode: currentRound.type === 'audio' ? 'listening' : 'typing',
          correct,
          answeredAt: new Date().toISOString(),
          latencyMs: 0,
          hintsUsed: 0,
          retries: 0,
          responseItemId: choice.id,
          variant: 'kana-pop'
        })
      );
    }

    if (correct) {
      setCorrectCount((value) => value + 1);
      setCombo((value) => {
        const nextCombo = value + 1;
        setBestCombo((best) => Math.max(best, nextCombo));
        return nextCombo;
      });
      recordCorrect();
      markPracticedToday();
    } else {
      setWrongCount((value) => value + 1);
      setCombo(0);
      recordWrong();
    }

    setSelectedId(choice.id);
  };

  const nextRound = () => {
    if (currentIndex + 1 >= rounds.length) {
      finishRound();
      return;
    }

    setCurrentIndex((value) => value + 1);
    setSelectedId(null);
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--kt-brand-soft)] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-brand)]">
              <Gamepad2 size={14} />
              {script === 'hiragana' ? c.hiragana : c.katakana}
            </div>
            <Button as="button" type="button" onClick={startRound} iconStart={<Zap size={16} />}>
              {rounds.length > 0 ? c.restart : c.start}
            </Button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <RunStat icon={<Target size={15} />} label={c.score} value={correctCount * 100 - wrongCount * 25} />
            <RunStat icon={<Sparkles size={15} />} label={c.combo} value={combo} />
            <RunStat icon={<BadgeCheck size={15} />} label="Best" value={bestCombo} />
            <RunStat icon={<Timer size={15} />} label={c.time} value={remainingSeconds} />
          </div>

          <div className="mt-5 rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface)] p-5">
            {rounds.length === 0 ? (
              <div className="flex min-h-[25rem] flex-col items-center justify-center text-center">
                <Gamepad2 size={38} className="text-[var(--kt-brand)]" />
                <h2 className="mt-4 text-xl font-black text-[var(--kt-ink-strong)]">{c.start}</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-[var(--kt-ink-muted)]">{c.description}</p>
              </div>
            ) : isComplete ? (
              <div className="flex min-h-[25rem] flex-col items-center justify-center text-center">
                <BadgeCheck size={40} className="text-[var(--kt-brand)]" />
                <h2 className="mt-4 text-2xl font-black text-[var(--kt-ink-strong)]">{c.complete}</h2>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <ResultPill label={c.correct} value={correctCount} tone="success" />
                  <ResultPill label={c.wrong} value={wrongCount} tone="danger" />
                  <ResultPill label={c.combo} value={bestCombo} tone="brand" />
                </div>
                <Button as="button" type="button" onClick={startRound} className="mt-5" iconStart={<RotateCcw size={16} />}>
                  {c.restart}
                </Button>
              </div>
            ) : currentRound ? (
              <div className="min-h-[25rem]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
                      {currentIndex + 1}/{rounds.length}
                    </div>
                    <h2 className="mt-1 text-lg font-black text-[var(--kt-ink-strong)]">
                      {currentRound.type === 'audio' ? c.audioCue : c.romajiCue}
                    </h2>
                  </div>
                  <div className="text-sm font-bold text-[var(--kt-ink-muted)]">{c.chooseKana}</div>
                </div>

                <div className="mt-6 flex min-h-32 items-center justify-center rounded-lg bg-[var(--kt-surface-muted)] p-5 text-center">
                  {currentRound.type === 'audio' ? (
                    <AudioButton
                      src={getGoogleTranslateKanaAudioSrc(currentRound.item.id) ?? ''}
                      language={language}
                      autoPlay
                      autoPlayToken={currentRound.id}
                      className="h-16 w-16"
                      size={28}
                    />
                  ) : (
                    <div className="font-mono text-5xl font-black lowercase text-[var(--kt-ink-strong)]">
                      {currentRound.item.romaji[0]}
                    </div>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-4 gap-2">
                  {currentRound.choices.map((choice) => {
                    const selected = selectedId === choice.id;
                    const showCorrect = selectedId !== null && choice.id === currentRound.item.id;
                    const showWrong = selected && choice.id !== currentRound.item.id;
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => answerRound(choice)}
                        disabled={selectedId !== null}
                        className={`flex aspect-square min-h-16 items-center justify-center rounded-lg border text-center font-jp text-4xl font-black transition ${
                          showCorrect
                            ? 'border-[color:var(--kt-accent-success)]/45 bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)]'
                            : showWrong
                              ? 'border-[color:var(--kt-accent-danger)]/45 bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)]'
                              : 'border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] hover:border-[color:var(--kt-brand)]/40 hover:bg-[var(--kt-brand-soft)]'
                        }`}
                      >
                        {choice.char}
                      </button>
                    );
                  })}
                </div>

                {selectedId && (
                  <div className="mt-4 flex justify-end">
                    <Button as="button" type="button" onClick={nextRound}>
                      {currentIndex + 1 >= rounds.length ? c.complete : c.next}
                    </Button>
                  </div>
                )}
              </div>
            ) : null}
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
        <ModeNote icon={<Zap size={18} />} title={c.reflex} text={c.reflexText} />
        <ModeNote icon={<Sparkles size={18} />} title={c.comboNote} text={c.comboText} />
        <ModeNote icon={<Headphones size={18} />} title={c.progress} text={c.progressText} />
      </section>

      <section className="mt-6 rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5 shadow-[var(--kt-shadow-sm)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-[var(--kt-ink-strong)]">{c.focusQueue}</h2>
            <p className="mt-1 text-sm text-[var(--kt-ink-muted)]">{c.focusHint}</p>
          </div>
          <Volume2 className="text-[var(--kt-brand)]" size={20} />
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
                    <span>{group.mastered}/{group.total}</span>
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

interface RunStatProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

const RunStat: React.FC<RunStatProps> = ({ icon, label, value }) => (
  <div className="rounded-lg border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-3">
    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
      <span className="text-[var(--kt-brand)]">{icon}</span>
      {label}
    </div>
    <div className="mt-1 text-xl font-black text-[var(--kt-ink-strong)]">{value}</div>
  </div>
);

interface ResultPillProps {
  label: string;
  value: number;
  tone: 'success' | 'danger' | 'brand';
}

const ResultPill: React.FC<ResultPillProps> = ({ label, value, tone }) => {
  const toneClass =
    tone === 'success'
      ? 'bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)]'
      : tone === 'danger'
        ? 'bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)]'
        : 'bg-[var(--kt-brand-soft)] text-[var(--kt-brand)]';

  return (
    <div className={`rounded-lg px-5 py-3 ${toneClass}`}>
      <div className="text-xs font-black uppercase tracking-[0.14em]">{label}</div>
      <div className="mt-1 text-2xl font-black">{value}</div>
    </div>
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
