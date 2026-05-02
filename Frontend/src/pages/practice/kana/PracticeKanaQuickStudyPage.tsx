import React, { useMemo, useState } from 'react';
import {
  BadgeCheck,
  Clock3,
  Headphones,
  Keyboard,
  RotateCcw,
  ShieldAlert,
  Shuffle,
  Sparkles,
  Timer,
  Zap
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
import { KanaItem, KanaScript } from '../../../features/kana/domain/kanaItem';
import { applySessionAnswerToProgress } from '../../../features/kana/progress/progressService';
import { useKanaProgressStore } from '../../../features/kana/progress/progressStore';
import { kanaInventoryByScript } from '../../../features/kana/data/kanaInventory';
import {
  buildKanaReviewQueue,
  getKanaGroupProgressStats,
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

const copy = {
  tr: {
    eyebrow: 'Kana Practice',
    title: 'Quick Study',
    description: 'Kana, romaji ve ses sorularini kisa bir refleks turunda karisik cozer.',
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    start: 'Hizli turu baslat',
    restart: 'Yeniden baslat',
    next: 'Siradaki',
    due: 'Bekleyen',
    weak: 'Zayif',
    mastered: 'Tamamlanan',
    tracked: 'Takipte',
    score: 'Skor',
    question: 'Soru',
    complete: 'Tur tamamlandi',
    correct: 'Dogru',
    wrong: 'Yanlis',
    kanaToRomaji: 'Kana okunuşunu sec',
    romajiToKana: 'Romajiye karsilik gelen kanayi sec',
    audioToKana: 'Sesi dinle ve kanayi sec',
    focusQueue: 'Quick odagi',
    focusHint: 'Bekleyen ve zayif gruplar tur havuzunda one alinir.',
    emptyFocus: 'Henuz riskli grup yok.',
    ready: 'Hazir',
    mixed: 'Karisik soru',
    mixedText: 'Okuma, ters hatirlama ve dinleme ayni turda gelir.',
    shortRound: 'Kisa tur',
    shortRoundText: '12 soruluk akista hiz ve dogruluk birlikte olculur.',
    progress: 'Progress bagli',
    progressText: 'Cevaplar weak/due/mastery verisine islenir.'
  },
  en: {
    eyebrow: 'Kana Practice',
    title: 'Quick Study',
    description: 'Solve kana, romaji, and audio prompts in one short reflex round.',
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    start: 'Start quick round',
    restart: 'Restart',
    next: 'Next',
    due: 'Due',
    weak: 'Weak',
    mastered: 'Mastered',
    tracked: 'Tracked',
    score: 'Score',
    question: 'Question',
    complete: 'Round complete',
    correct: 'Correct',
    wrong: 'Wrong',
    kanaToRomaji: 'Choose the kana reading',
    romajiToKana: 'Choose the kana for the romaji',
    audioToKana: 'Listen and choose the kana',
    focusQueue: 'Quick focus',
    focusHint: 'Due and weak groups are prioritized in the round pool.',
    emptyFocus: 'No risky groups yet.',
    ready: 'Ready',
    mixed: 'Mixed prompts',
    mixedText: 'Reading, reverse recall, and listening appear in one round.',
    shortRound: 'Short round',
    shortRoundText: 'A 12-question flow measures speed and accuracy together.',
    progress: 'Progress linked',
    progressText: 'Answers update weak, due, and mastery data.'
  }
} as const;

const shuffle = <T,>(items: T[]) => {
  const copyItems = [...items];
  for (let index = copyItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copyItems[index], copyItems[swapIndex]] = [copyItems[swapIndex], copyItems[index]];
  }
  return copyItems;
};

const getQuestionTitle = (type: QuickQuestionType, c: typeof copy.tr | typeof copy.en) => {
  if (type === 'kana-to-romaji') return c.kanaToRomaji;
  if (type === 'romaji-to-kana') return c.romajiToKana;
  return c.audioToKana;
};

const getAnswerValue = (question: QuickQuestion) =>
  question.type === 'kana-to-romaji' ? question.item.romaji[0] : question.item.char;

const buildChoices = (item: KanaItem, type: QuickQuestionType, inventory: KanaItem[]) => {
  const correct = type === 'kana-to-romaji' ? item.romaji[0] : item.char;
  const distractors = shuffle(
    inventory
      .filter((candidate) => candidate.id !== item.id)
      .map((candidate) => (type === 'kana-to-romaji' ? candidate.romaji[0] : candidate.char))
      .filter((value) => value !== correct)
  ).slice(0, 3);

  return shuffle([correct, ...distractors]);
};

export const PracticeKanaQuickStudyPage: React.FC<PracticeKanaQuickStudyPageProps> = ({
  language,
  activeScript
}) => {
  const c = copy[language];
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedScript = searchParams.get('script');
  const script: KanaScript = isKanaScript(requestedScript) ? requestedScript : activeScript;
  const [questions, setQuestions] = useState<QuickQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const sections = useMemo(
    () => (script === 'hiragana' ? getLocalizedHiraganaSections(language) : getLocalizedKatakanaSections(language)),
    [language, script]
  );
  const inventory = kanaInventoryByScript[script];
  const { getProgress, listByScript, saveProgress, summaries } = useKanaProgressStore();
  const progressEntries = listByScript(script);
  const progressMap = useMemo(() => new Map(progressEntries.map((entry) => [entry.kanaId, entry])), [progressEntries]);
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

  const currentQuestion = questions[currentIndex] ?? null;
  const totalAnswered = correctCount + wrongCount;

  const setScript = (next: KanaScript) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('script', next);
    setSearchParams(nextParams);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedChoice(null);
    setCorrectCount(0);
    setWrongCount(0);
    setIsComplete(false);
  };

  const startRound = () => {
    const roundItems = shuffle(prioritizedPool).slice(0, 12);
    const nextQuestions = roundItems.map((item, index) => {
      const type: QuickQuestionType =
        index % 3 === 0 ? 'kana-to-romaji' : index % 3 === 1 ? 'romaji-to-kana' : 'audio-to-kana';
      return {
        id: `${item.id}-${type}-${index}`,
        type,
        item,
        choices: buildChoices(item, type, inventory)
      };
    });

    setQuestions(nextQuestions);
    setCurrentIndex(0);
    setSelectedChoice(null);
    setCorrectCount(0);
    setWrongCount(0);
    setIsComplete(false);
  };

  const answerQuestion = (choice: string) => {
    if (!currentQuestion || selectedChoice) {
      return;
    }

    const correct = choice === getAnswerValue(currentQuestion);
    const progress = getProgress(currentQuestion.item.id);

    if (progress) {
      saveProgress(
        applySessionAnswerToProgress(progress, {
          itemId: currentQuestion.item.id,
          mode: currentQuestion.type === 'audio-to-kana' ? 'listening' : 'typing',
          correct,
          answeredAt: new Date().toISOString(),
          latencyMs: 0,
          hintsUsed: 0,
          retries: 0,
          responseItemId:
            currentQuestion.type === 'kana-to-romaji'
              ? null
              : inventory.find((item) => item.char === choice)?.id ?? null,
          variant: 'quick-study'
        })
      );
    }

    if (correct) {
      setCorrectCount((value) => value + 1);
      recordCorrect();
      markPracticedToday();
    } else {
      setWrongCount((value) => value + 1);
      recordWrong();
    }

    setSelectedChoice(choice);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setIsComplete(true);
      setSelectedChoice(null);
      return;
    }

    setCurrentIndex((value) => value + 1);
    setSelectedChoice(null);
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
              <Zap size={14} />
              {script === 'hiragana' ? c.hiragana : c.katakana}
            </div>
            <Button as="button" type="button" onClick={startRound} iconStart={<Shuffle size={16} />}>
              {questions.length > 0 ? c.restart : c.start}
            </Button>
          </div>

          <div className="mt-5 rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface)] p-5">
            {questions.length === 0 ? (
              <div className="flex min-h-[22rem] flex-col items-center justify-center text-center">
                <Shuffle size={34} className="text-[var(--kt-brand)]" />
                <h2 className="mt-4 text-xl font-black text-[var(--kt-ink-strong)]">{c.start}</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-[var(--kt-ink-muted)]">{c.description}</p>
              </div>
            ) : isComplete ? (
              <div className="flex min-h-[22rem] flex-col items-center justify-center text-center">
                <BadgeCheck size={38} className="text-[var(--kt-brand)]" />
                <h2 className="mt-4 text-2xl font-black text-[var(--kt-ink-strong)]">{c.complete}</h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-[var(--kt-accent-success-soft)] px-5 py-3 text-[var(--kt-accent-success)]">
                    <div className="text-xs font-black uppercase tracking-[0.14em]">{c.correct}</div>
                    <div className="mt-1 text-2xl font-black">{correctCount}</div>
                  </div>
                  <div className="rounded-lg bg-[var(--kt-accent-danger-soft)] px-5 py-3 text-[var(--kt-accent-danger)]">
                    <div className="text-xs font-black uppercase tracking-[0.14em]">{c.wrong}</div>
                    <div className="mt-1 text-2xl font-black">{wrongCount}</div>
                  </div>
                </div>
                <Button as="button" type="button" onClick={startRound} className="mt-5" iconStart={<RotateCcw size={16} />}>
                  {c.restart}
                </Button>
              </div>
            ) : currentQuestion ? (
              <div className="min-h-[22rem]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
                      {c.question} {currentIndex + 1}/{questions.length}
                    </div>
                    <h2 className="mt-1 text-lg font-black text-[var(--kt-ink-strong)]">
                      {getQuestionTitle(currentQuestion.type, c)}
                    </h2>
                  </div>
                  <div className="rounded-full bg-[var(--kt-surface-muted)] px-3 py-1 text-sm font-bold text-[var(--kt-ink-muted)]">
                    {c.score}: {correctCount}/{totalAnswered}
                  </div>
                </div>

                <div className="mt-6 flex min-h-36 items-center justify-center rounded-lg bg-[var(--kt-surface-muted)] p-5 text-center">
                  {currentQuestion.type === 'kana-to-romaji' ? (
                    <div className="font-jp text-8xl font-black leading-none text-[var(--kt-ink-strong)]">
                      {currentQuestion.item.char}
                    </div>
                  ) : currentQuestion.type === 'romaji-to-kana' ? (
                    <div className="font-mono text-5xl font-black lowercase text-[var(--kt-ink-strong)]">
                      {currentQuestion.item.romaji[0]}
                    </div>
                  ) : (
                    <AudioButton
                      src={getGoogleTranslateKanaAudioSrc(currentQuestion.item.id) ?? ''}
                      language={language}
                      autoPlay
                      autoPlayToken={currentQuestion.id}
                      className="h-16 w-16"
                      size={28}
                    />
                  )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {currentQuestion.choices.map((choice) => {
                    const correctAnswer = getAnswerValue(currentQuestion);
                    const selected = selectedChoice === choice;
                    const showCorrect = selectedChoice !== null && choice === correctAnswer;
                    const showWrong = selected && choice !== correctAnswer;
                    return (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => answerQuestion(choice)}
                        disabled={selectedChoice !== null}
                        className={`min-h-14 rounded-lg border px-3 py-3 text-center text-xl font-black transition ${
                          showCorrect
                            ? 'border-[color:var(--kt-accent-success)]/45 bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)]'
                            : showWrong
                              ? 'border-[color:var(--kt-accent-danger)]/45 bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)]'
                              : 'border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] hover:bg-[var(--kt-surface-muted)]'
                        } ${currentQuestion.type === 'kana-to-romaji' ? 'font-mono lowercase' : 'font-jp'}`}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>

                {selectedChoice && (
                  <div className="mt-4 flex justify-end">
                    <Button as="button" type="button" onClick={nextQuestion}>
                      {currentIndex + 1 >= questions.length ? c.complete : c.next}
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
        <ModeNote icon={<Shuffle size={18} />} title={c.mixed} text={c.mixedText} />
        <ModeNote icon={<Timer size={18} />} title={c.shortRound} text={c.shortRoundText} />
        <ModeNote icon={<Keyboard size={18} />} title={c.progress} text={c.progressText} />
      </section>

      <section className="mt-6 rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5 shadow-[var(--kt-shadow-sm)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-[var(--kt-ink-strong)]">{c.focusQueue}</h2>
            <p className="mt-1 text-sm text-[var(--kt-ink-muted)]">{c.focusHint}</p>
          </div>
          <Headphones className="text-[var(--kt-brand)]" size={20} />
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
