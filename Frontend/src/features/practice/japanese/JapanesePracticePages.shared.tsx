import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BookText,
  Check,
  ChevronLeft,
  ChevronRight,
  Library,
  Languages,
  Layers3,
  MessageSquareText,
  PencilLine,
  RefreshCcw,
  Sparkles,
  Target,
  Timer
} from 'lucide-react';
import { Button, Eyebrow, PageHeader, PageShell } from '../../../components/ui';
import { AppLanguage } from '../../../data/appPreferences';
import {
  getAllJLearnGrammarPoints,
  getAllJLearnSteps,
  getAllJLearnVocabItems
} from '../../../learn/data/jlearn/jlearnContent';
import { PracticeQuestion, QuestionType, VocabItem } from '../../../learn/data/jlearn/jlearnTypes';
import { readVocab, updateVocabProgress, writeVocab } from '../../../learn/data/jlearn/jlearnStorage';
import { isAnswerCorrect } from '../../../features/jlearn/tasks/answerNormalizer';
import { recordCorrect, recordWrong } from '../../../hooks/useFeedback';
import { markPracticedToday } from '../../../features/streak/tomoshibi';

interface PracticeJapanesePageProps {
  language: AppLanguage;
}

type JapaneseMode =
  | 'quick'
  | 'topics'
  | 'reading'
  | 'fill'
  | 'translation'
  | 'sentence'
  | 'flashcards';

const modeCopy = {
  tr: {
    quick: {
      eyebrow: 'Japanese Practice',
      title: 'Quick Study',
      description: 'Kelime, grammar, ceviri ve cumle sorularini tek kisa turda karisik cozersin.'
    },
    topics: {
      eyebrow: 'Japanese Practice',
      title: 'Topic Lessons',
      description: 'Sayilar, renkler, fiiller, sifatlar ve temel ifadeleri konu konu calis.'
    },
    reading: {
      eyebrow: 'Japanese Practice',
      title: 'Kitap Okuma',
      description: 'Kitap sec, sayfa sayfa oku, kelimeleri ve kisa anlama sorularini kontrol et.'
    },
    fill: {
      eyebrow: 'Japanese Practice',
      title: 'Fill in the Blank',
      description: 'Cumledeki boslugu dogru kelime, partikul veya ek ile tamamla.'
    },
    translation: {
      eyebrow: 'Japanese Practice',
      title: 'Translation Practice',
      description: 'Ingilizce/Japonca ceviri sorulariyla aktif cumle kurma calis.'
    },
    sentence: {
      eyebrow: 'Japanese Practice',
      title: 'Sentence Writing',
      description: 'Verilen durumlara Japonca cevap yaz, sonra ornek cevapla karsilastir.'
    },
    flashcards: {
      eyebrow: 'Japanese Practice',
      title: 'Flashcards',
      description: 'Kelime kartlarini cevir, bildim/tekrar et ile tekrar sirasini guncelle.'
    },
    start: 'Turu baslat',
    restart: 'Yeniden baslat',
    check: 'Kontrol et',
    next: 'Siradaki',
    correct: 'Dogru',
    wrong: 'Yanlis',
    answer: 'Cevap',
    sample: 'Ornek cevap',
    reveal: 'Cevabi goster',
    again: 'Tekrar et',
    known: 'Bildim',
    empty: 'Bu mod icin soru bulunamadi.',
    questions: 'soru',
    words: 'kelime',
    grammar: 'grammar',
    completed: 'Tur tamamlandi'
  },
  en: {
    quick: {
      eyebrow: 'Japanese Practice',
      title: 'Quick Study',
      description: 'Mix vocabulary, grammar, translation, and sentence questions in one short round.'
    },
    topics: {
      eyebrow: 'Japanese Practice',
      title: 'Topic Lessons',
      description: 'Study numbers, colors, verbs, adjectives, and basic expressions by topic.'
    },
    reading: {
      eyebrow: 'Japanese Practice',
      title: 'Reading',
      description: 'Choose a book, read page by page, and check vocabulary plus quick comprehension.'
    },
    fill: {
      eyebrow: 'Japanese Practice',
      title: 'Fill in the Blank',
      description: 'Complete sentence gaps with the right word, particle, or ending.'
    },
    translation: {
      eyebrow: 'Japanese Practice',
      title: 'Translation Practice',
      description: 'Practice active sentence production through English/Japanese translation.'
    },
    sentence: {
      eyebrow: 'Japanese Practice',
      title: 'Sentence Writing',
      description: 'Reply to situation prompts in Japanese, then compare with a model answer.'
    },
    flashcards: {
      eyebrow: 'Japanese Practice',
      title: 'Flashcards',
      description: 'Flip vocabulary cards and update review order with known/review feedback.'
    },
    start: 'Start round',
    restart: 'Restart',
    check: 'Check',
    next: 'Next',
    correct: 'Correct',
    wrong: 'Wrong',
    answer: 'Answer',
    sample: 'Sample answer',
    reveal: 'Reveal answer',
    again: 'Review again',
    known: 'I knew it',
    empty: 'No questions found for this mode.',
    questions: 'questions',
    words: 'words',
    grammar: 'grammar',
    completed: 'Round complete'
  }
} as const;

const supportedQuickTypes: QuestionType[] = [
  'multiple-choice',
  'fill-in-blank',
  'translation-en-jp',
  'translation-jp-en',
  'sentence-build',
  'context-select'
];

const shuffle = <T,>(items: T[]) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
};

const allQuestions = () => getAllJLearnSteps().flatMap((step) => step.questions);

const pickQuestions = (types: QuestionType[], count = 12) =>
  shuffle(allQuestions().filter((question) => types.includes(question.type))).slice(0, count);

const recordQuestionAttempt = (question: PracticeQuestion, correct: boolean) => {
  if (question.targetVocabId) {
    writeVocab(
      updateVocabProgress(readVocab(), {
        vocabId: question.targetVocabId,
        missionId: 'practice-japanese',
        wasCorrect: correct
      })
    );
  }

  if (correct) {
    recordCorrect();
    markPracticedToday();
  } else {
    recordWrong();
  }
};

/* ── Immersive scene primitives ─────────────────────────────────────── */

const JP_SCENE =
  'relative flex w-full flex-col ' +
  'max-lg:min-h-[calc(100dvh-92px)] max-lg:overflow-y-auto ' +
  'lg:h-[calc(100dvh-92px)] lg:overflow-y-auto';

const JP_OVERLAY =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_38%,rgba(240,232,228,0.52)_100%)] [.theme-dark_&]:opacity-0';

const JP_HALO =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_46%_36%_at_50%_42%,rgba(253,250,248,0.55)_0%,transparent_100%)] [.theme-dark_&]:opacity-0';

const JP_DM_HALO =
  'pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl bg-[#d06070]/6 [.theme-dark_&]:opacity-100';

const ImmersiveShell: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={JP_SCENE}>
    <div className={JP_OVERLAY} />
    <div className={JP_HALO} />
    <div className={JP_DM_HALO} />
    <div className={`relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  </div>
);

const JapaneseHeader: React.FC<{ language: AppLanguage; mode: JapaneseMode; icon: React.ReactNode }> = ({
  language,
  mode,
  icon
}) => {
  const c = modeCopy[language][mode];
  const allVocab = getAllJLearnVocabItems();
  const allGrammar = getAllJLearnGrammarPoints();

  return (
    <PageHeader
      eyebrow={<Eyebrow>{c.eyebrow}</Eyebrow>}
      title={c.title}
      description={c.description}
      actions={
        <div className="grid grid-cols-3 gap-2">
          <MiniStat icon={icon} label={modeCopy[language].questions} value={allQuestions().length} />
          <MiniStat icon={<BookOpen size={14} />} label={modeCopy[language].words} value={allVocab.length} />
          <MiniStat icon={<Sparkles size={14} />} label={modeCopy[language].grammar} value={allGrammar.length} />
        </div>
      }
    />
  );
};

const MiniStat: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({ icon, label, value }) => (
  <div className="rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface)] px-3 py-2 shadow-[var(--kt-shadow-sm)]">
    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--kt-ink-subtle)]">
      <span className="text-[var(--kt-brand)]">{icon}</span>
      {label}
    </div>
    <div className="mt-1 text-lg font-black text-[var(--kt-ink-strong)]">{value}</div>
  </div>
);

const JapanesePracticeThemeStyles = () => (
  <style>{`
    .kt-jp-stage {
      --jp-panel: rgba(255, 252, 249, 0.88);
      --jp-panel-strong: rgba(255, 255, 255, 0.94);
      --jp-panel-soft: rgba(255, 245, 239, 0.78);
      --jp-panel-muted: rgba(246, 234, 223, 0.95);
      --jp-border: rgba(208, 96, 112, 0.22);
      --jp-border-strong: rgba(160, 65, 87, 0.32);
      --jp-ink: #2b2422;
      --jp-ink-strong: #181514;
      --jp-ink-muted: rgba(65, 57, 61, 0.72);
      --jp-ink-soft: rgba(111, 99, 104, 0.72);
      --jp-paper: #fff8eb;
      --jp-paper-muted: #f4eadf;
      --jp-paper-line: #e7d2c1;
      --jp-accent: #d85f79;
      --jp-accent-strong: #a04157;
      --jp-accent-soft: rgba(216, 95, 121, 0.12);
      --jp-success: #8d5965;
      --jp-success-soft: rgba(168, 97, 111, 0.14);
      --jp-danger: #c24f69;
      --jp-danger-soft: rgba(216, 95, 121, 0.13);
      --jp-elevated-shadow: 0 24px 70px rgba(120, 72, 82, 0.16), inset 0 1px 0 rgba(255,255,255,0.82);
      --jp-hero-bg:
        radial-gradient(circle at 10% 8%, rgba(216,95,121,0.13), transparent 18rem),
        radial-gradient(circle at 92% 20%, rgba(216,138,90,0.10), transparent 16rem),
        linear-gradient(135deg, rgba(255,250,247,0.96), rgba(255,239,232,0.88));
      --jp-console-bg:
        radial-gradient(circle at 12% 8%, rgba(216,95,121,0.12), transparent 15rem),
        radial-gradient(circle at 90% 85%, rgba(193,147,105,0.12), transparent 18rem),
        linear-gradient(135deg, rgba(255,252,249,0.94), rgba(255,241,235,0.9));
      --jp-ghost: rgba(255,255,255,0.68);
      --jp-ghost-hover: rgba(255,255,255,0.9);
      --jp-ghost-border: rgba(160, 65, 87, 0.16);
      --jp-track: rgba(208, 96, 112, 0.16);
      --jp-page-shadow: 0 28px 80px rgba(120, 72, 82, 0.16);
    }

    .theme-dark .kt-jp-stage {
      --jp-panel: rgba(37, 28, 36, 0.9);
      --jp-panel-strong: rgba(46, 36, 44, 0.94);
      --jp-panel-soft: rgba(255,255,255,0.06);
      --jp-panel-muted: rgba(255,255,255,0.08);
      --jp-border: rgba(245, 163, 178, 0.24);
      --jp-border-strong: rgba(245, 163, 178, 0.34);
      --jp-ink: rgba(255,255,255,0.88);
      --jp-ink-strong: #ffffff;
      --jp-ink-muted: rgba(255,255,255,0.68);
      --jp-ink-soft: rgba(255,255,255,0.52);
      --jp-paper: #fff8eb;
      --jp-paper-muted: #f4eadf;
      --jp-paper-line: #e5cdbc;
      --jp-accent: #e88b9c;
      --jp-accent-strong: #ff9aae;
      --jp-accent-soft: rgba(240, 138, 161, 0.12);
      --jp-success: #bdf3d1;
      --jp-success-soft: rgba(143, 214, 173, 0.12);
      --jp-danger: #ffb5c3;
      --jp-danger-soft: rgba(255, 138, 161, 0.12);
      --jp-elevated-shadow: 0 28px 80px rgba(10, 8, 12, 0.46), inset 0 1px 0 rgba(255,255,255,0.08);
      --jp-hero-bg:
        radial-gradient(circle at 12% 12%, rgba(216,95,121,0.2), transparent 18rem),
        radial-gradient(circle at 92% 20%, rgba(255,184,112,0.14), transparent 16rem),
        linear-gradient(135deg, rgba(45,34,42,0.98), rgba(19,16,23,0.96));
      --jp-console-bg:
        radial-gradient(circle at 12% 8%, rgba(216,95,121,0.18), transparent 15rem),
        radial-gradient(circle at 90% 85%, rgba(193,147,105,0.16), transparent 18rem),
        linear-gradient(135deg, rgba(46,36,44,0.96), rgba(28,23,30,0.94));
      --jp-ghost: rgba(255,255,255,0.08);
      --jp-ghost-hover: rgba(255,255,255,0.13);
      --jp-ghost-border: rgba(255,255,255,0.12);
      --jp-track: rgba(255,255,255,0.12);
      --jp-page-shadow: 0 28px 80px rgba(10, 8, 12, 0.46);
    }
  `}</style>
);

const QuizPanel: React.FC<{
  language: AppLanguage;
  questions: PracticeQuestion[];
}> = ({ language, questions }) => {
  const c = modeCopy[language];
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState<null | boolean>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const question = questions[index] ?? null;
  const complete = started && index >= questions.length;

  const restart = () => {
    setStarted(true);
    setIndex(0);
    setValue('');
    setSelected(null);
    setChecked(null);
    setCorrectCount(0);
    setWrongCount(0);
  };

  const submit = (answer: string) => {
    if (!question || checked !== null) return;
    const correct = isAnswerCorrect(answer, question.correctAnswer, question.acceptedAnswers);
    setChecked(correct);
    setSelected(answer);
    if (correct) setCorrectCount((current) => current + 1);
    else setWrongCount((current) => current + 1);
    recordQuestionAttempt(question, correct);
  };

  const next = () => {
    setIndex((current) => current + 1);
    setValue('');
    setSelected(null);
    setChecked(null);
  };

  if (questions.length === 0) {
    return <EmptyPanel text={c.empty} />;
  }

  if (!started) {
    return (
      <section className="mt-8 rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-8 text-center shadow-[var(--kt-shadow-sm)]">
        <Target className="mx-auto text-[var(--kt-brand)]" size={36} />
        <div className="mt-4 text-xl font-black text-[var(--kt-ink-strong)]">{questions.length} {c.questions}</div>
        <Button as="button" type="button" onClick={restart} className="mt-5">
          {c.start}
        </Button>
      </section>
    );
  }

  if (complete) {
    return (
      <section className="mt-8 rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-8 text-center shadow-[var(--kt-shadow-sm)]">
        <BadgeCheck className="mx-auto text-[var(--kt-brand)]" size={40} />
        <h2 className="mt-4 text-2xl font-black text-[var(--kt-ink-strong)]">{c.completed}</h2>
        <div className="mt-4 flex justify-center gap-3">
          <ScorePill label={c.correct} value={correctCount} tone="success" />
          <ScorePill label={c.wrong} value={wrongCount} tone="danger" />
        </div>
        <Button as="button" type="button" onClick={restart} className="mt-5" iconStart={<RefreshCcw size={16} />}>
          {c.restart}
        </Button>
      </section>
    );
  }

  const options = question?.options ?? [];
  const isChoiceQuestion = options.length > 0;

  return (
    <section className="mt-8 rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5 shadow-[var(--kt-shadow-sm)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
          {index + 1}/{questions.length}
        </div>
        <div className="rounded-full bg-[var(--kt-surface-muted)] px-3 py-1 text-sm font-bold text-[var(--kt-ink-muted)]">
          {correctCount}/{index + (checked !== null ? 1 : 0)}
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-[var(--kt-surface)] p-5">
        <p className="text-base font-bold text-[var(--kt-ink-strong)]">{question?.prompt}</p>
        {question?.promptJapanese && (
          <p className="mt-3 font-jp text-2xl font-black text-[var(--kt-ink-strong)]">{question.promptJapanese}</p>
        )}
      </div>

      {isChoiceQuestion ? (
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {options.map((option) => {
            const isCorrect = question ? isAnswerCorrect(option, question.correctAnswer, question.acceptedAnswers) : false;
            const isSelected = selected === option;
            const tone =
              checked === null
                ? 'border-[var(--kt-border)] bg-[var(--kt-surface)]'
                : isCorrect
                  ? 'border-[color:var(--kt-accent-success)]/45 bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)]'
                  : isSelected
                    ? 'border-[color:var(--kt-accent-danger)]/45 bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)]'
                    : 'border-[var(--kt-border)] bg-[var(--kt-surface)] opacity-70';
            return (
              <button
                key={option}
                type="button"
                disabled={checked !== null}
                onClick={() => submit(option)}
                className={`rounded-lg border px-4 py-3 text-left text-sm font-bold transition hover:bg-[var(--kt-surface-muted)] ${tone}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : (
        <form
          className="mt-4"
          onSubmit={(event) => {
            event.preventDefault();
            submit(value);
          }}
        >
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={checked !== null}
            className="w-full rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-3 text-base text-[var(--kt-ink)] outline-none focus:border-[var(--kt-brand)]"
            placeholder={c.answer}
          />
          {checked === null && (
            <Button as="button" type="submit" disabled={!value.trim()} className="mt-3">
              {c.check}
            </Button>
          )}
        </form>
      )}

      {checked !== null && (
        <div
          className={`mt-4 rounded-lg border p-4 ${
            checked
              ? 'border-[color:var(--kt-accent-success)]/45 bg-[var(--kt-accent-success-soft)]'
              : 'border-[color:var(--kt-accent-danger)]/45 bg-[var(--kt-accent-danger-soft)]'
          }`}
        >
          <div className="text-sm font-black text-[var(--kt-ink-strong)]">
            {checked ? c.correct : c.wrong}
          </div>
          {!checked && (
            <div className="mt-2 text-sm text-[var(--kt-ink-muted)]">
              {c.answer}: <span className="font-jp font-black text-[var(--kt-ink-strong)]">{question?.correctAnswer}</span>
            </div>
          )}
          <Button as="button" type="button" onClick={next} className="mt-3">
            {c.next}
          </Button>
        </div>
      )}
    </section>
  );
};

const QuickStudyExperience: React.FC<{
  language: AppLanguage;
  questions: PracticeQuestion[];
}> = ({ language, questions }) => {
  const c = modeCopy[language];
  const quickCopy = modeCopy[language].quick;
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState<null | boolean>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const question = questions[index] ?? null;
  const complete = started && index >= questions.length;
  const attempts = correctCount + wrongCount;
  const accuracy = attempts > 0 ? Math.round((correctCount / attempts) * 100) : 0;
  const progressPercent = questions.length > 0 ? Math.min(100, Math.round((index / questions.length) * 100)) : 0;
  const activeProgressPercent =
    questions.length > 0 ? Math.min(100, Math.round(((index + (checked !== null ? 1 : 0)) / questions.length) * 100)) : 0;

  const restart = () => {
    setStarted(true);
    setIndex(0);
    setValue('');
    setSelected(null);
    setChecked(null);
    setCorrectCount(0);
    setWrongCount(0);
  };

  const submit = (answer: string) => {
    if (!question || checked !== null) return;
    const correct = isAnswerCorrect(answer, question.correctAnswer, question.acceptedAnswers);
    setChecked(correct);
    setSelected(answer);
    if (correct) setCorrectCount((current) => current + 1);
    else setWrongCount((current) => current + 1);
    recordQuestionAttempt(question, correct);
  };

  const next = () => {
    setIndex((current) => current + 1);
    setValue('');
    setSelected(null);
    setChecked(null);
  };

  if (questions.length === 0) {
    return <EmptyPanel text={c.empty} />;
  }

  if (!started) {
    return (
      <section className="kt-jp-stage mt-8 overflow-hidden rounded-[1.25rem] border border-[var(--jp-border-strong)] bg-[var(--jp-panel)] shadow-[var(--jp-elevated-shadow)]">
        <JapanesePracticeThemeStyles />
        <div
          className="relative grid min-h-[28rem] gap-0 lg:grid-cols-[1.05fr_0.95fr]"
          style={{ background: 'var(--jp-hero-bg)' }}
        >
          <div className="relative flex flex-col justify-between border-b border-[var(--jp-border)] p-8 lg:border-b-0 lg:border-r lg:p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--jp-border-strong)] bg-[var(--jp-accent-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
                <Target size={14} />
                {quickCopy.eyebrow}
              </div>
              <h1 className="mt-7 max-w-xl text-5xl font-black leading-none text-[var(--jp-ink-strong)] lg:text-6xl">
                {quickCopy.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-[var(--jp-ink-muted)]">
                {quickCopy.description}
              </p>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              <QuickStudyMetric icon={<Layers3 size={16} />} label={language === 'tr' ? 'Karisik' : 'Mixed'} value={questions.length} />
              <QuickStudyMetric icon={<Timer size={16} />} label={language === 'tr' ? 'Tempo' : 'Pace'} value="5-8m" />
              <QuickStudyMetric icon={<Sparkles size={16} />} label={language === 'tr' ? 'Odak' : 'Focus'} value="N5" />
            </div>
          </div>

          <div className="relative flex items-center justify-center p-8 lg:p-10">
            <div
              aria-hidden="true"
              className="absolute inset-y-10 left-10 right-10 rounded-[50%] bg-[var(--jp-accent-soft)] blur-3xl"
            />
            <div className="relative w-full max-w-md rounded-[1.1rem] border border-[var(--jp-paper-line)] bg-[var(--jp-paper)] p-5 text-[#251a18] shadow-[var(--jp-page-shadow)]">
              <div className="flex items-start justify-between border-b border-[var(--jp-paper-line)] pb-4">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
                    {language === 'tr' ? 'Tur plani' : 'Round plan'}
                  </div>
                  <div className="mt-2 text-2xl font-black">{questions.length} {c.questions}</div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--jp-accent)] text-white shadow-[0_12px_24px_rgba(216,95,121,0.28)]">
                  <Target size={24} />
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  language === 'tr' ? 'Kelime ve grammar hizli tanima' : 'Fast vocabulary and grammar recognition',
                  language === 'tr' ? 'Ceviri ve cumle kurma karisimi' : 'Translation and sentence building mix',
                  language === 'tr' ? 'Aninda dogru/yanlis geri bildirim' : 'Immediate right/wrong feedback'
                ].map((item, itemIndex) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg bg-[var(--jp-paper-muted)] px-4 py-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-black text-[var(--jp-accent-strong)]">
                      {itemIndex + 1}
                    </span>
                    <span className="text-sm font-black text-[#493833]">{item}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={restart}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--jp-accent)] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_16px_28px_rgba(216,95,121,0.34)] transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kt-focus-ring)]"
              >
                {c.start}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (complete) {
    return (
      <section className="kt-jp-stage mt-8 overflow-hidden rounded-[1.25rem] border border-[var(--jp-border-strong)] bg-[var(--jp-panel)] shadow-[var(--jp-elevated-shadow)]">
        <JapanesePracticeThemeStyles />
        <div className="relative grid min-h-[26rem] place-items-center p-10 text-center">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: 'var(--jp-hero-bg)' }}
          />
          <div className="relative">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[var(--jp-border-strong)] bg-[var(--jp-accent-soft)] text-[var(--jp-accent-strong)] shadow-[0_0_38px_rgba(216,95,121,0.2)]">
              <BadgeCheck size={48} />
            </div>
            <h2 className="mt-6 text-4xl font-black text-[var(--jp-ink-strong)]">{c.completed}</h2>
            <div className="mt-6 grid min-w-[24rem] gap-3 sm:grid-cols-3">
              <QuickStudyMetric label={c.correct} value={correctCount} tone="success" />
              <QuickStudyMetric label={c.wrong} value={wrongCount} tone="danger" />
              <QuickStudyMetric label={language === 'tr' ? 'Isabet' : 'Accuracy'} value={`${accuracy}%`} />
            </div>
            <button
              type="button"
              onClick={restart}
              className="mt-7 inline-flex items-center gap-2 rounded-lg border border-[var(--jp-border-strong)] bg-[var(--jp-ghost)] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[var(--jp-ink-strong)] transition hover:bg-[var(--jp-ghost-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kt-focus-ring)]"
            >
              <RefreshCcw size={16} />
              {c.restart}
            </button>
          </div>
        </div>
      </section>
    );
  }

  const options = question?.options ?? [];
  const isChoiceQuestion = options.length > 0;

  return (
    <section className="kt-jp-stage mt-8 grid gap-5 lg:grid-cols-[18rem_1fr]">
      <JapanesePracticeThemeStyles />
      <aside className="rounded-[1.1rem] border border-[var(--jp-border-strong)] bg-[var(--jp-panel)] p-5 shadow-[var(--jp-elevated-shadow)]">
        <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
          {quickCopy.title}
        </div>
        <div className="mt-5 rounded-lg bg-[var(--jp-paper)] p-4 text-[#251a18]">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--jp-accent-strong)]">
                {language === 'tr' ? 'Kart' : 'Card'}
              </div>
              <div className="mt-1 text-3xl font-black">{Math.min(index + 1, questions.length)}</div>
            </div>
            <div className="text-sm font-black text-[#8d7067]">/{questions.length}</div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-[var(--jp-track)]">
            <div
              className="h-full rounded-full bg-[var(--jp-accent)] transition-all"
              style={{ width: `${activeProgressPercent}%` }}
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <QuickStudyMetric label={c.correct} value={correctCount} tone="success" compact />
          <QuickStudyMetric label={c.wrong} value={wrongCount} tone="danger" compact />
        </div>
        <div className="mt-4 rounded-lg border border-[var(--jp-ghost-border)] bg-[var(--jp-panel-soft)] p-4">
          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.14em] text-[var(--jp-ink-soft)]">
            <span>{language === 'tr' ? 'Ilerleme' : 'Progress'}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="mt-3 grid grid-cols-12 gap-1">
            {questions.map((item, itemIndex) => (
              <span
                key={`${item.prompt}-${itemIndex}`}
                className={`h-8 rounded-sm ${
                  itemIndex < index
                    ? 'bg-[var(--jp-accent)]'
                    : itemIndex === index
                      ? 'bg-[var(--jp-paper)]'
                      : 'bg-[var(--jp-track)]'
                }`}
              />
            ))}
          </div>
        </div>
      </aside>

      <div className="overflow-hidden rounded-[1.25rem] border border-[var(--jp-border-strong)] bg-[var(--jp-panel-strong)] shadow-[var(--jp-elevated-shadow)]">
        <div
          className="relative min-h-[34rem] p-6 lg:p-8"
          style={{ background: 'var(--jp-console-bg)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--jp-border-strong)] bg-[var(--jp-accent-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
              <Target size={14} />
              {question?.type.replaceAll('-', ' ')}
            </div>
            <div className="rounded-full border border-[var(--jp-ghost-border)] bg-[var(--jp-ghost)] px-3 py-1 text-sm font-black text-[var(--jp-ink-muted)]">
              {correctCount}/{attempts || 0}
            </div>
          </div>

          <div className="mt-6 rounded-[1rem] border border-[#e9d4c1] bg-[#fff8eb] p-7 text-[#201a17] shadow-[0_20px_50px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.7)]">
            <p className="text-xl font-black leading-8">{question?.prompt}</p>
            {question?.promptJapanese && (
              <p className="mt-5 rounded-lg bg-[#f4eadf] px-5 py-4 font-jp text-3xl font-black leading-relaxed text-[#201a17]">
                {question.promptJapanese}
              </p>
            )}
          </div>

          {isChoiceQuestion ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {options.map((option) => {
                const isCorrect = question ? isAnswerCorrect(option, question.correctAnswer, question.acceptedAnswers) : false;
                const isSelected = selected === option;
                const tone =
                  checked === null
                    ? 'border-[var(--jp-ghost-border)] bg-[var(--jp-ghost)] text-[var(--jp-ink-strong)] hover:border-[var(--jp-border-strong)] hover:bg-[var(--jp-ghost-hover)]'
                    : isCorrect
                      ? 'border-[var(--jp-success)] bg-[var(--jp-success-soft)] text-[var(--jp-success)]'
                      : isSelected
                        ? 'border-[var(--jp-danger)] bg-[var(--jp-danger-soft)] text-[var(--jp-danger)]'
                        : 'border-[var(--jp-ghost-border)] bg-[var(--jp-panel-soft)] text-[var(--jp-ink-soft)]';
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={checked !== null}
                    onClick={() => submit(option)}
                    className={`min-h-[4.5rem] rounded-[0.9rem] border px-5 py-4 text-left text-base font-black leading-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition ${tone}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          ) : (
            <form
              className="mt-5"
              onSubmit={(event) => {
                event.preventDefault();
                submit(value);
              }}
            >
              <div className="rounded-[0.95rem] border border-[var(--jp-ghost-border)] bg-[var(--jp-panel-soft)] p-2">
                <input
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  disabled={checked !== null}
                  className="w-full rounded-[0.75rem] border border-transparent bg-[var(--jp-paper)] px-5 py-4 font-jp text-xl font-black text-[#201a17] outline-none focus:border-[var(--jp-accent)]"
                  placeholder={c.answer}
                />
              </div>
              {checked === null && (
                <button
                  type="submit"
                  disabled={!value.trim()}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--jp-accent)] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_14px_28px_rgba(216,95,121,0.3)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {c.check}
                  <Check size={16} />
                </button>
              )}
            </form>
          )}

          {checked !== null && (
            <div
              className={`mt-5 rounded-[1rem] border p-5 ${
                checked
                  ? 'border-[var(--jp-success)] bg-[var(--jp-success-soft)]'
                  : 'border-[var(--jp-danger)] bg-[var(--jp-danger-soft)]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className={`text-sm font-black uppercase tracking-[0.16em] ${checked ? 'text-[var(--jp-success)]' : 'text-[var(--jp-danger)]'}`}>
                    {checked ? c.correct : c.wrong}
                  </div>
                  {!checked && (
                    <div className="mt-2 text-sm font-semibold text-[var(--jp-ink-muted)]">
                      {c.answer}: <span className="font-jp font-black text-[var(--jp-ink-strong)]">{question?.correctAnswer}</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--jp-paper)] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#6f4450] transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  {c.next}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const QuickStudyMetric: React.FC<{
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  tone?: 'neutral' | 'success' | 'danger';
  compact?: boolean;
}> = ({ icon, label, value, tone = 'neutral', compact = false }) => {
  const toneClass =
    tone === 'success'
      ? 'border-[var(--jp-success)] bg-[var(--jp-success-soft)] text-[var(--jp-success)]'
      : tone === 'danger'
        ? 'border-[var(--jp-danger)] bg-[var(--jp-danger-soft)] text-[var(--jp-danger)]'
        : 'border-[var(--jp-ghost-border)] bg-[var(--jp-ghost)] text-[var(--jp-ink-strong)]';

  return (
    <div className={`rounded-lg border ${toneClass} ${compact ? 'px-3 py-3' : 'px-4 py-3'}`}>
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] opacity-70">
        {icon}
        {label}
      </div>
      <div className={`${compact ? 'mt-1 text-2xl' : 'mt-2 text-3xl'} font-black leading-none`}>{value}</div>
    </div>
  );
};

const FillPromptText: React.FC<{ prompt: string }> = ({ prompt }) => {
  const parts = prompt.split('___');

  if (parts.length === 1) {
    return <>{prompt}</>;
  }

  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 && (
            <span className="mx-2 inline-flex min-w-28 justify-center rounded-md border-b-4 border-[var(--jp-accent)] bg-[var(--jp-accent-soft)] px-4 py-1 text-[var(--jp-accent-strong)]">
              ?
            </span>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

const FillBlankExperience: React.FC<{
  language: AppLanguage;
  questions: PracticeQuestion[];
}> = ({ language, questions }) => {
  const c = modeCopy[language];
  const fillCopy = modeCopy[language].fill;
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState<null | boolean>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const question = questions[index] ?? null;
  const complete = started && index >= questions.length;
  const attempts = correctCount + wrongCount;
  const accuracy = attempts > 0 ? Math.round((correctCount / attempts) * 100) : 0;
  const activeProgressPercent =
    questions.length > 0 ? Math.min(100, Math.round(((index + (checked !== null ? 1 : 0)) / questions.length) * 100)) : 0;

  const restart = () => {
    setStarted(true);
    setIndex(0);
    setValue('');
    setChecked(null);
    setCorrectCount(0);
    setWrongCount(0);
  };

  const submit = () => {
    if (!question || checked !== null || !value.trim()) return;
    const correct = isAnswerCorrect(value, question.correctAnswer, question.acceptedAnswers);
    setChecked(correct);
    if (correct) setCorrectCount((current) => current + 1);
    else setWrongCount((current) => current + 1);
    recordQuestionAttempt(question, correct);
  };

  const next = () => {
    setIndex((current) => current + 1);
    setValue('');
    setChecked(null);
  };

  if (questions.length === 0) {
    return <EmptyPanel text={c.empty} />;
  }

  if (!started) {
    return (
      <section className="kt-jp-stage mt-8 overflow-hidden rounded-[1.25rem] border border-[var(--jp-border-strong)] bg-[var(--jp-panel)] shadow-[var(--jp-elevated-shadow)]">
        <JapanesePracticeThemeStyles />
        <div className="relative grid min-h-[28rem] gap-0 lg:grid-cols-[0.95fr_1.05fr]" style={{ background: 'var(--jp-hero-bg)' }}>
          <div className="relative flex flex-col justify-between border-b border-[var(--jp-border)] p-8 lg:border-b-0 lg:border-r lg:p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--jp-border-strong)] bg-[var(--jp-accent-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
                <PencilLine size={14} />
                {fillCopy.eyebrow}
              </div>
              <h1 className="mt-7 max-w-xl text-5xl font-black leading-none text-[var(--jp-ink-strong)] lg:text-6xl">
                {fillCopy.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-[var(--jp-ink-muted)]">
                {fillCopy.description}
              </p>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              <QuickStudyMetric icon={<PencilLine size={16} />} label={c.questions} value={questions.length} />
              <QuickStudyMetric icon={<Target size={16} />} label={language === 'tr' ? 'Odak' : 'Focus'} value="Cloze" />
              <QuickStudyMetric icon={<Timer size={16} />} label={language === 'tr' ? 'Tempo' : 'Pace'} value="4-6m" />
            </div>
          </div>

          <div className="relative flex items-center justify-center p-8 lg:p-10">
            <div className="relative w-full max-w-lg rounded-[1.1rem] border border-[var(--jp-paper-line)] bg-[var(--jp-paper)] p-6 text-[#251a18] shadow-[var(--jp-page-shadow)]">
              <div className="flex items-center justify-between border-b border-[var(--jp-paper-line)] pb-4">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
                    {language === 'tr' ? 'Bosluk atölyesi' : 'Blank workshop'}
                  </div>
                  <div className="mt-2 text-2xl font-black">{questions.length} {c.questions}</div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--jp-accent)] text-white shadow-[0_12px_24px_rgba(216,95,121,0.28)]">
                  <PencilLine size={24} />
                </div>
              </div>
              <div className="mt-5 rounded-lg bg-[var(--jp-paper-muted)] p-5">
                <p className="font-jp text-3xl font-black leading-relaxed">
                  <FillPromptText prompt={questions[0]?.prompt ?? '___'} />
                </p>
              </div>
              <button
                type="button"
                onClick={restart}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--jp-accent)] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_16px_28px_rgba(216,95,121,0.34)] transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kt-focus-ring)]"
              >
                {c.start}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (complete) {
    return (
      <section className="kt-jp-stage mt-8 overflow-hidden rounded-[1.25rem] border border-[var(--jp-border-strong)] bg-[var(--jp-panel)] shadow-[var(--jp-elevated-shadow)]">
        <JapanesePracticeThemeStyles />
        <div className="relative grid min-h-[26rem] place-items-center p-10 text-center" style={{ background: 'var(--jp-hero-bg)' }}>
          <div className="relative">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[var(--jp-border-strong)] bg-[var(--jp-accent-soft)] text-[var(--jp-accent-strong)] shadow-[0_0_38px_rgba(216,95,121,0.2)]">
              <BadgeCheck size={48} />
            </div>
            <h2 className="mt-6 text-4xl font-black text-[var(--jp-ink-strong)]">{c.completed}</h2>
            <div className="mt-6 grid min-w-[24rem] gap-3 sm:grid-cols-3">
              <QuickStudyMetric label={c.correct} value={correctCount} tone="success" />
              <QuickStudyMetric label={c.wrong} value={wrongCount} tone="danger" />
              <QuickStudyMetric label={language === 'tr' ? 'Isabet' : 'Accuracy'} value={`${accuracy}%`} />
            </div>
            <button
              type="button"
              onClick={restart}
              className="mt-7 inline-flex items-center gap-2 rounded-lg border border-[var(--jp-border-strong)] bg-[var(--jp-ghost)] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[var(--jp-ink-strong)] transition hover:bg-[var(--jp-ghost-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kt-focus-ring)]"
            >
              <RefreshCcw size={16} />
              {c.restart}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="kt-jp-stage mt-8 grid gap-5 lg:grid-cols-[1fr_20rem]">
      <JapanesePracticeThemeStyles />
      <div className="overflow-hidden rounded-[1.25rem] border border-[var(--jp-border-strong)] bg-[var(--jp-panel-strong)] shadow-[var(--jp-elevated-shadow)]">
        <div className="relative min-h-[34rem] p-7 lg:p-8" style={{ background: 'var(--jp-console-bg)' }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--jp-border-strong)] bg-[var(--jp-accent-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
              <PencilLine size={14} />
              {language === 'tr' ? 'Eksik parca' : 'Missing piece'}
            </div>
            <div className="rounded-full border border-[var(--jp-ghost-border)] bg-[var(--jp-ghost)] px-3 py-1 text-sm font-black text-[var(--jp-ink-muted)]">
              {index + 1}/{questions.length}
            </div>
          </div>

          <div className="mt-7 rounded-[1rem] border border-[var(--jp-paper-line)] bg-[var(--jp-paper)] p-8 text-[#201a17] shadow-[var(--jp-page-shadow)]">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
              {language === 'tr' ? 'Cumleyi tamamla' : 'Complete the sentence'}
            </div>
            <p className="mt-5 font-jp text-4xl font-black leading-[1.9]">
              <FillPromptText prompt={question?.prompt ?? ''} />
            </p>
            {question?.promptJapanese && (
              <p className="mt-5 rounded-lg bg-[var(--jp-paper-muted)] px-5 py-4 font-jp text-2xl font-black leading-relaxed">
                {question.promptJapanese}
              </p>
            )}
          </div>

          <form
            className="mt-6"
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
              <div className="rounded-[0.95rem] border border-[var(--jp-ghost-border)] bg-[var(--jp-panel-soft)] p-2">
                <input
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  disabled={checked !== null}
                  autoFocus
                  className="w-full rounded-[0.75rem] border border-transparent bg-[var(--jp-paper)] px-5 py-4 font-jp text-2xl font-black text-[#201a17] outline-none focus:border-[var(--jp-accent)]"
                  placeholder={c.answer}
                />
              </div>
              {checked === null ? (
                <button
                  type="submit"
                  disabled={!value.trim()}
                  className="inline-flex min-w-40 items-center justify-center gap-2 rounded-lg bg-[var(--jp-accent)] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_14px_28px_rgba(216,95,121,0.3)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {c.check}
                  <Check size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex min-w-40 items-center justify-center gap-2 rounded-lg bg-[var(--jp-paper)] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#6f4450] transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  {c.next}
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </form>

          {checked !== null && (
            <div
              className={`mt-5 rounded-[1rem] border p-5 ${
                checked
                  ? 'border-[var(--jp-success)] bg-[var(--jp-success-soft)]'
                  : 'border-[var(--jp-danger)] bg-[var(--jp-danger-soft)]'
              }`}
            >
              <div className={`text-sm font-black uppercase tracking-[0.16em] ${checked ? 'text-[var(--jp-success)]' : 'text-[var(--jp-danger)]'}`}>
                {checked ? c.correct : c.wrong}
              </div>
              {!checked && (
                <div className="mt-2 text-sm font-semibold text-[var(--jp-ink-muted)]">
                  {c.answer}: <span className="font-jp text-lg font-black text-[var(--jp-ink-strong)]">{question?.correctAnswer}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <aside className="rounded-[1.1rem] border border-[var(--jp-border-strong)] bg-[var(--jp-panel)] p-5 shadow-[var(--jp-elevated-shadow)]">
        <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
          {fillCopy.title}
        </div>
        <div className="mt-5 rounded-lg bg-[var(--jp-paper)] p-4 text-[#251a18]">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--jp-accent-strong)]">
                {language === 'tr' ? 'Bosluk' : 'Blank'}
              </div>
              <div className="mt-1 text-3xl font-black">{Math.min(index + 1, questions.length)}</div>
            </div>
            <div className="text-sm font-black text-[#8d7067]">/{questions.length}</div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-[var(--jp-track)]">
            <div className="h-full rounded-full bg-[var(--jp-accent)] transition-all" style={{ width: `${activeProgressPercent}%` }} />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <QuickStudyMetric label={c.correct} value={correctCount} tone="success" compact />
          <QuickStudyMetric label={c.wrong} value={wrongCount} tone="danger" compact />
        </div>
        <div className="mt-4 rounded-lg border border-[var(--jp-ghost-border)] bg-[var(--jp-panel-soft)] p-4">
          <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--jp-ink-soft)]">
            {language === 'tr' ? 'Cevap izi' : 'Answer trace'}
          </div>
          <div className="mt-3 grid grid-cols-6 gap-1">
            {questions.map((item, itemIndex) => (
              <span
                key={`${item.id}-${itemIndex}`}
                className={`h-8 rounded-sm ${
                  itemIndex < index
                    ? 'bg-[var(--jp-accent)]'
                    : itemIndex === index
                      ? 'bg-[var(--jp-paper)]'
                      : 'bg-[var(--jp-track)]'
                }`}
              />
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
};

const getTranslationDirection = (question: PracticeQuestion | null, language: AppLanguage) => {
  if (question?.type === 'translation-jp-en') {
    return {
      from: language === 'tr' ? 'Japonca' : 'Japanese',
      to: language === 'tr' ? 'İngilizce' : 'English'
    };
  }

  return {
    from: language === 'tr' ? 'İngilizce' : 'English',
    to: language === 'tr' ? 'Japonca' : 'Japanese'
  };
};

const TranslationExperience: React.FC<{
  language: AppLanguage;
  questions: PracticeQuestion[];
}> = ({ language, questions }) => {
  const c = modeCopy[language];
  const translationCopy = modeCopy[language].translation;
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState<null | boolean>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const question = questions[index] ?? null;
  const complete = started && index >= questions.length;
  const attempts = correctCount + wrongCount;
  const accuracy = attempts > 0 ? Math.round((correctCount / attempts) * 100) : 0;
  const activeProgressPercent =
    questions.length > 0 ? Math.min(100, Math.round(((index + (checked !== null ? 1 : 0)) / questions.length) * 100)) : 0;
  const direction = getTranslationDirection(question, language);
  const options = question?.options ?? [];

  const restart = () => {
    setStarted(true);
    setIndex(0);
    setValue('');
    setSelected(null);
    setChecked(null);
    setCorrectCount(0);
    setWrongCount(0);
  };

  const submit = (answer: string) => {
    if (!question || checked !== null || !answer.trim()) return;
    const correct = isAnswerCorrect(answer, question.correctAnswer, question.acceptedAnswers);
    setChecked(correct);
    setSelected(answer);
    if (correct) setCorrectCount((current) => current + 1);
    else setWrongCount((current) => current + 1);
    recordQuestionAttempt(question, correct);
  };

  const next = () => {
    setIndex((current) => current + 1);
    setValue('');
    setSelected(null);
    setChecked(null);
  };

  if (questions.length === 0) {
    return <EmptyPanel text={c.empty} />;
  }

  if (!started) {
    const firstDirection = getTranslationDirection(questions[0] ?? null, language);

    return (
      <section className="kt-jp-stage mt-8 overflow-hidden rounded-[1.25rem] border border-[var(--jp-border-strong)] bg-[var(--jp-panel)] shadow-[var(--jp-elevated-shadow)]">
        <JapanesePracticeThemeStyles />
        <div className="relative grid min-h-[28rem] gap-0 lg:grid-cols-[1fr_1fr]" style={{ background: 'var(--jp-hero-bg)' }}>
          <div className="relative flex flex-col justify-between border-b border-[var(--jp-border)] p-8 lg:border-b-0 lg:border-r lg:p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--jp-border-strong)] bg-[var(--jp-accent-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
                <Languages size={14} />
                {translationCopy.eyebrow}
              </div>
              <h1 className="mt-7 max-w-xl text-5xl font-black leading-none text-[var(--jp-ink-strong)] lg:text-6xl">
                {translationCopy.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-[var(--jp-ink-muted)]">
                {translationCopy.description}
              </p>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              <QuickStudyMetric icon={<Languages size={16} />} label={c.questions} value={questions.length} />
              <QuickStudyMetric icon={<ArrowRight size={16} />} label={language === 'tr' ? 'Yön' : 'Route'} value={`${firstDirection.from.slice(0, 2)}→${firstDirection.to.slice(0, 2)}`} />
              <QuickStudyMetric icon={<Timer size={16} />} label={language === 'tr' ? 'Tempo' : 'Pace'} value="6-8m" />
            </div>
          </div>

          <div className="relative flex items-center justify-center p-8 lg:p-10">
            <div className="relative w-full max-w-lg rounded-[1.1rem] border border-[var(--jp-paper-line)] bg-[var(--jp-paper)] p-6 text-[#251a18] shadow-[var(--jp-page-shadow)]">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-[var(--jp-paper-line)] pb-5">
                <div className="rounded-lg bg-[var(--jp-paper-muted)] p-4">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">{firstDirection.from}</div>
                  <div className="mt-2 text-2xl font-black">Source</div>
                </div>
                <ArrowRight className="text-[var(--jp-accent-strong)]" size={24} />
                <div className="rounded-lg bg-[var(--jp-paper-muted)] p-4">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">{firstDirection.to}</div>
                  <div className="mt-2 text-2xl font-black">Target</div>
                </div>
              </div>
              <div className="mt-5 rounded-lg bg-[var(--jp-paper-muted)] p-5">
                <p className="font-jp text-3xl font-black leading-relaxed">{questions[0]?.prompt}</p>
              </div>
              <button
                type="button"
                onClick={restart}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--jp-accent)] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_16px_28px_rgba(216,95,121,0.34)] transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kt-focus-ring)]"
              >
                {c.start}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (complete) {
    return (
      <section className="kt-jp-stage mt-8 overflow-hidden rounded-[1.25rem] border border-[var(--jp-border-strong)] bg-[var(--jp-panel)] shadow-[var(--jp-elevated-shadow)]">
        <JapanesePracticeThemeStyles />
        <div className="relative grid min-h-[26rem] place-items-center p-10 text-center" style={{ background: 'var(--jp-hero-bg)' }}>
          <div className="relative">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[var(--jp-border-strong)] bg-[var(--jp-accent-soft)] text-[var(--jp-accent-strong)] shadow-[0_0_38px_rgba(216,95,121,0.2)]">
              <BadgeCheck size={48} />
            </div>
            <h2 className="mt-6 text-4xl font-black text-[var(--jp-ink-strong)]">{c.completed}</h2>
            <div className="mt-6 grid min-w-[24rem] gap-3 sm:grid-cols-3">
              <QuickStudyMetric label={c.correct} value={correctCount} tone="success" />
              <QuickStudyMetric label={c.wrong} value={wrongCount} tone="danger" />
              <QuickStudyMetric label={language === 'tr' ? 'Isabet' : 'Accuracy'} value={`${accuracy}%`} />
            </div>
            <button
              type="button"
              onClick={restart}
              className="mt-7 inline-flex items-center gap-2 rounded-lg border border-[var(--jp-border-strong)] bg-[var(--jp-ghost)] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[var(--jp-ink-strong)] transition hover:bg-[var(--jp-ghost-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kt-focus-ring)]"
            >
              <RefreshCcw size={16} />
              {c.restart}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="kt-jp-stage mt-8 grid gap-5 lg:grid-cols-[1fr_20rem]">
      <JapanesePracticeThemeStyles />
      <div className="overflow-hidden rounded-[1.25rem] border border-[var(--jp-border-strong)] bg-[var(--jp-panel-strong)] shadow-[var(--jp-elevated-shadow)]">
        <div className="relative min-h-[34rem] p-7 lg:p-8" style={{ background: 'var(--jp-console-bg)' }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--jp-border-strong)] bg-[var(--jp-accent-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
              <Languages size={14} />
              {direction.from} → {direction.to}
            </div>
            <div className="rounded-full border border-[var(--jp-ghost-border)] bg-[var(--jp-ghost)] px-3 py-1 text-sm font-black text-[var(--jp-ink-muted)]">
              {index + 1}/{questions.length}
            </div>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-[1rem] border border-[var(--jp-paper-line)] bg-[var(--jp-paper)] p-7 text-[#201a17] shadow-[var(--jp-page-shadow)]">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">{direction.from}</div>
              <p className="mt-5 font-jp text-4xl font-black leading-[1.7]">{question?.prompt}</p>
            </div>
            <div className="hidden items-center justify-center lg:flex">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--jp-border-strong)] bg-[var(--jp-accent-soft)] text-[var(--jp-accent-strong)]">
                <ArrowRight size={26} />
              </span>
            </div>
            <div className="rounded-[1rem] border border-[var(--jp-ghost-border)] bg-[var(--jp-ghost)] p-7">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">{direction.to}</div>
              {options.length > 0 ? (
                <div className="mt-5 grid gap-3">
                  {options.map((option) => {
                    const isCorrect = question ? isAnswerCorrect(option, question.correctAnswer, question.acceptedAnswers) : false;
                    const isSelected = selected === option;
                    const tone =
                      checked === null
                        ? 'border-[var(--jp-ghost-border)] bg-[var(--jp-ghost)] text-[var(--jp-ink-strong)] hover:border-[var(--jp-border-strong)] hover:bg-[var(--jp-ghost-hover)]'
                        : isCorrect
                          ? 'border-[var(--jp-success)] bg-[var(--jp-success-soft)] text-[var(--jp-success)]'
                          : isSelected
                            ? 'border-[var(--jp-danger)] bg-[var(--jp-danger-soft)] text-[var(--jp-danger)]'
                            : 'border-[var(--jp-ghost-border)] bg-[var(--jp-panel-soft)] text-[var(--jp-ink-soft)]';
                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={checked !== null}
                        onClick={() => submit(option)}
                        className={`rounded-lg border px-4 py-3 text-left text-sm font-black transition ${tone}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <form
                  className="mt-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    submit(value);
                  }}
                >
                  <textarea
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    disabled={checked !== null}
                    autoFocus
                    className="min-h-44 w-full resize-none rounded-[0.85rem] border border-[var(--jp-ghost-border)] bg-[var(--jp-paper)] px-5 py-4 font-jp text-2xl font-black leading-relaxed text-[#201a17] outline-none focus:border-[var(--jp-accent)]"
                    placeholder={c.answer}
                  />
                  {checked === null && (
                    <button
                      type="submit"
                      disabled={!value.trim()}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--jp-accent)] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_14px_28px_rgba(216,95,121,0.3)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      {c.check}
                      <Check size={16} />
                    </button>
                  )}
                </form>
              )}
            </div>
          </div>

          {checked !== null && (
            <div
              className={`mt-5 rounded-[1rem] border p-5 ${
                checked
                  ? 'border-[var(--jp-success)] bg-[var(--jp-success-soft)]'
                  : 'border-[var(--jp-danger)] bg-[var(--jp-danger-soft)]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className={`text-sm font-black uppercase tracking-[0.16em] ${checked ? 'text-[var(--jp-success)]' : 'text-[var(--jp-danger)]'}`}>
                    {checked ? c.correct : c.wrong}
                  </div>
                  {!checked && (
                    <div className="mt-2 text-sm font-semibold text-[var(--jp-ink-muted)]">
                      {c.answer}: <span className="font-jp text-lg font-black text-[var(--jp-ink-strong)]">{question?.correctAnswer}</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--jp-paper)] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#6f4450] transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  {c.next}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <aside className="rounded-[1.1rem] border border-[var(--jp-border-strong)] bg-[var(--jp-panel)] p-5 shadow-[var(--jp-elevated-shadow)]">
        <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
          {translationCopy.title}
        </div>
        <div className="mt-5 rounded-lg bg-[var(--jp-paper)] p-4 text-[#251a18]">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--jp-accent-strong)]">
                {language === 'tr' ? 'Aktarım' : 'Transfer'}
              </div>
              <div className="mt-1 text-3xl font-black">{Math.min(index + 1, questions.length)}</div>
            </div>
            <div className="text-sm font-black text-[#8d7067]">/{questions.length}</div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-[var(--jp-track)]">
            <div className="h-full rounded-full bg-[var(--jp-accent)] transition-all" style={{ width: `${activeProgressPercent}%` }} />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <QuickStudyMetric label={c.correct} value={correctCount} tone="success" compact />
          <QuickStudyMetric label={c.wrong} value={wrongCount} tone="danger" compact />
        </div>
        <div className="mt-4 rounded-lg border border-[var(--jp-ghost-border)] bg-[var(--jp-panel-soft)] p-4">
          <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--jp-ink-soft)]">
            {language === 'tr' ? 'Yön izleri' : 'Route trace'}
          </div>
          <div className="mt-3 grid grid-cols-6 gap-1">
            {questions.map((item, itemIndex) => (
              <span
                key={`${item.id}-${itemIndex}`}
                className={`h-8 rounded-sm ${
                  itemIndex < index
                    ? 'bg-[var(--jp-accent)]'
                    : itemIndex === index
                      ? 'bg-[var(--jp-paper)]'
                      : 'bg-[var(--jp-track)]'
                }`}
              />
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
};

const ScorePill: React.FC<{ label: string; value: number; tone: 'success' | 'danger' }> = ({
  label,
  value,
  tone
}) => (
  <div
    className={`rounded-lg px-5 py-3 ${
      tone === 'success'
        ? 'bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)]'
        : 'bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)]'
    }`}
  >
    <div className="text-xs font-black uppercase tracking-[0.14em]">{label}</div>
    <div className="mt-1 text-2xl font-black">{value}</div>
  </div>
);

const EmptyPanel: React.FC<{ text: string }> = ({ text }) => (
  <section className="mt-8 rounded-lg border border-dashed border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-8 text-center text-sm text-[var(--kt-ink-muted)]">
    {text}
  </section>
);

export const PracticeJapaneseQuickStudyPage: React.FC<PracticeJapanesePageProps> = ({ language }) => (
  <QuickStudyPageContent language={language} />
);

const QuickStudyPageContent: React.FC<PracticeJapanesePageProps> = ({ language }) => {
  const questions = useMemo(() => pickQuestions(supportedQuickTypes, 12), []);

  return (
    <ImmersiveShell className="pb-14">
      <QuickStudyExperience language={language} questions={questions} />
    </ImmersiveShell>
  );
};

export const PracticeJapaneseFillBlankPage: React.FC<PracticeJapanesePageProps> = ({ language }) => (
  <FillBlankPageContent language={language} />
);

const FillBlankPageContent: React.FC<PracticeJapanesePageProps> = ({ language }) => {
  const questions = useMemo(() => pickQuestions(['fill-in-blank'], 12), []);

  return (
    <ImmersiveShell className="pb-14">
      <FillBlankExperience language={language} questions={questions} />
    </ImmersiveShell>
  );
};

export const PracticeJapaneseTranslationPage: React.FC<PracticeJapanesePageProps> = ({ language }) => (
  <TranslationPageContent language={language} />
);

const TranslationPageContent: React.FC<PracticeJapanesePageProps> = ({ language }) => {
  const questions = useMemo(() => pickQuestions(['translation-en-jp', 'translation-jp-en'], 12), []);

  return (
    <ImmersiveShell className="pb-14">
      <TranslationExperience language={language} questions={questions} />
    </ImmersiveShell>
  );
};

const topicDefs = [
  { id: 'noun', label: 'Nouns', pos: 'noun' },
  { id: 'verb', label: 'Verbs', pos: 'verb' },
  { id: 'adjective', label: 'Adjectives', pos: 'adjective' },
  { id: 'particle', label: 'Particles', pos: 'particle' },
  { id: 'expression', label: 'Expressions', pos: 'expression' }
] as const;

export const PracticeJapaneseTopicLessonsPage: React.FC<PracticeJapanesePageProps> = ({ language }) => {
  const c = modeCopy[language];
  const vocab = getAllJLearnVocabItems();
  const grammar = getAllJLearnGrammarPoints();
  const [topic, setTopic] = useState<(typeof topicDefs)[number]['id']>('noun');
  const activeTopic = topicDefs.find((item) => item.id === topic) ?? topicDefs[0];
  const words = vocab.filter((item) => item.partOfSpeech === activeTopic.pos).slice(0, 16);
  const topicQuestions = allQuestions()
    .filter((question) => words.some((word) => word.id === question.targetVocabId))
    .slice(0, 8);
  const practiceQuestions = topicQuestions.length > 0 ? topicQuestions : pickQuestions(['multiple-choice'], 6);
  const topicSummary =
    language === 'tr'
      ? `${activeTopic.label} konusundaki kelimeleri kart gibi tara, ornek kaliplari gor ve sonra kisa konu turuna gir.`
      : `Scan ${activeTopic.label.toLowerCase()} vocabulary like cards, review sample patterns, then run a short topic drill.`;

  return (
    <ImmersiveShell className="pb-14">
      <section className="kt-jp-stage mt-8 grid gap-5 lg:grid-cols-[18rem_1fr]">
        <JapanesePracticeThemeStyles />
        <aside className="rounded-[1.1rem] border border-[var(--jp-border-strong)] bg-[var(--jp-panel)] p-5 shadow-[var(--jp-elevated-shadow)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--jp-border-strong)] bg-[var(--jp-accent-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
            <BookText size={14} />
            {modeCopy[language].topics.eyebrow}
          </div>
          <h1 className="mt-5 text-3xl font-black leading-tight text-[var(--jp-ink-strong)]">
            {modeCopy[language].topics.title}
          </h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-[var(--jp-ink-muted)]">
            {modeCopy[language].topics.description}
          </p>

          <div className="mt-6 space-y-2">
            {topicDefs.map((item, itemIndex) => {
              const count = vocab.filter((entry) => entry.partOfSpeech === item.pos).length;
              const isActive = topic === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTopic(item.id)}
                  className={`group flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${
                    isActive
                      ? 'border-[var(--jp-border-strong)] bg-[var(--jp-paper)] text-[#251a18] shadow-[0_14px_28px_rgba(216,95,121,0.12)]'
                      : 'border-[var(--jp-ghost-border)] bg-[var(--jp-ghost)] text-[var(--jp-ink)] hover:bg-[var(--jp-ghost-hover)]'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                      isActive ? 'bg-[var(--jp-accent)] text-white' : 'bg-[var(--jp-panel-muted)] text-[var(--jp-accent-strong)]'
                    }`}
                  >
                    {itemIndex + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black">{item.label}</span>
                    <span className={`mt-0.5 block text-[11px] font-bold ${isActive ? 'text-[#8d7067]' : 'text-[var(--jp-ink-soft)]'}`}>
                      {count} {c.words}
                    </span>
                  </span>
                  <ChevronRight size={16} className={isActive ? 'text-[var(--jp-accent)]' : 'text-[var(--jp-ink-soft)]'} />
                </button>
              );
            })}
          </div>
        </aside>

        <div className="space-y-5">
          <div className="overflow-hidden rounded-[1.25rem] border border-[var(--jp-border-strong)] bg-[var(--jp-panel-strong)] shadow-[var(--jp-elevated-shadow)]">
            <div className="relative p-7 lg:p-8" style={{ background: 'var(--jp-console-bg)' }}>
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
                    {language === 'tr' ? 'Konu dosyasi' : 'Topic file'}
                  </div>
                  <h2 className="mt-2 text-5xl font-black leading-none text-[var(--jp-ink-strong)]">{activeTopic.label}</h2>
                  <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-[var(--jp-ink-muted)]">
                    {topicSummary}
                  </p>
                </div>
                <div className="grid min-w-[24rem] grid-cols-3 gap-3">
                  <QuickStudyMetric icon={<BookOpen size={16} />} label={c.words} value={words.length} />
                  <QuickStudyMetric icon={<Sparkles size={16} />} label={c.grammar} value={grammar.length} />
                  <QuickStudyMetric icon={<Target size={16} />} label={c.questions} value={practiceQuestions.length} />
                </div>
              </div>

              <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {words.map((word) => (
                  <article
                    key={word.id}
                    className="group min-h-[8.5rem] rounded-[0.95rem] border border-[var(--jp-ghost-border)] bg-[var(--jp-ghost)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:-translate-y-0.5 hover:border-[var(--jp-border-strong)] hover:bg-[var(--jp-ghost-hover)]"
                  >
                    <div className="font-jp text-2xl font-black text-[var(--jp-ink-strong)]">{word.kanji ?? word.japanese}</div>
                    <div className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--jp-accent-strong)]">{word.romaji}</div>
                    <div className="mt-3 text-sm font-semibold leading-5 text-[var(--jp-ink-muted)]">{word.english}</div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
            <section className="rounded-[1.1rem] border border-[var(--jp-border-strong)] bg-[var(--jp-panel)] p-5 shadow-[var(--jp-elevated-shadow)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
                    {language === 'tr' ? 'Grammar rafı' : 'Grammar shelf'}
                  </div>
                  <h3 className="mt-1 text-2xl font-black text-[var(--jp-ink-strong)]">Patterns</h3>
                </div>
                <BookOpen className="text-[var(--jp-accent-strong)]" size={24} />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {grammar.slice(0, 4).map((item) => (
                  <article key={item.id} className="rounded-lg border border-[var(--jp-ghost-border)] bg-[var(--jp-panel-soft)] p-4">
                    <div className="font-jp text-lg font-black text-[var(--jp-ink-strong)]">{item.pattern}</div>
                    <p className="mt-2 line-clamp-3 text-xs font-semibold leading-5 text-[var(--jp-ink-muted)]">
                      {item.explanation}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[1.1rem] border border-[var(--jp-border-strong)] bg-[var(--jp-paper)] p-5 text-[#251a18] shadow-[var(--jp-page-shadow)]">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
                    {language === 'tr' ? 'Konu turu' : 'Topic drill'}
                  </div>
                  <h3 className="mt-2 text-3xl font-black">{practiceQuestions.length} {c.questions}</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[#6f5450]">
                    {language === 'tr'
                      ? 'Secili konuya bagli sorularla hizli bir kontrol turu baslat.'
                      : 'Start a focused check with questions tied to the selected topic.'}
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-6 gap-1">
                  {practiceQuestions.map((question, questionIndex) => (
                    <span key={`${question.prompt}-${questionIndex}`} className="h-8 rounded-sm bg-[#d85f79]/80" />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <div className="kt-jp-stage">
        <JapanesePracticeThemeStyles />
        <QuizPanel language={language} questions={practiceQuestions} />
      </div>
    </ImmersiveShell>
  );
};

type ReadingBookTone = 'rose' | 'indigo' | 'amber';

interface ReadingPage {
  id: string;
  japanese: string;
}

interface ReadingBook {
  id: string;
  title: string;
  level: string;
  genre: string;
  minutes: number;
  tone: ReadingBookTone;
  summary: {
    tr: string;
    en: string;
  };
  pages: ReadingPage[];
}

const readingBooks: ReadingBook[] = [
  {
    id: 'morning-walk',
    title: 'あさのさんぽ',
    level: 'N5',
    genre: 'Daily life',
    minutes: 8,
    tone: 'rose',
    summary: { tr: 'Yuki\'nin sabah yürüyüşü hikayesi.', en: 'The story of Yuki\'s morning walk.' },
    pages: [
      { id: 'p1', japanese: 'あさ、ゆきさんは はやく おきます。\nまどを あけると、そらは あおくて きれいです。\nきもちの いい かぜが はいってきます。\nゆきさんは みずを いっぱい のんで、\nさんぽに でかけます。' },
      { id: 'p2', japanese: 'こうえんへの みちは しずかです。\n木の はっぱが かぜに ゆれています。\nとりの こえが きこえます。\nゆきさんは ゆっくり あるきながら、\nあさの くうきを すいます。' },
      { id: 'p3', japanese: 'こうえんで、ゆきさんは ともだちに あいます。\n「おはよう！ きょうも いい てんきだね」\nふたりは ベンチに すわって、\nすこし はなします。\nとても たのしい じかんです。' },
      { id: 'p4', japanese: 'こうえんには たくさんの はなが さいています。\nあかい はな、しろい はな、むらさきの はな。\nゆきさんは いちばん すきな はなの まえに たって、\nそっと てを のばします。' },
      { id: 'p5', japanese: 'しばらくして、ゆきさんは うちに かえります。\nきょうも いい あさでした。\n「あしたも さんぽしよう」\nゆきさんは そう おもいながら、\nげんかんの ドアを そっと あけました。' },
    ]
  },
  {
    id: 'station-cafe',
    title: 'えきのカフェ',
    level: 'N5',
    genre: 'Daily life',
    minutes: 9,
    tone: 'indigo',
    summary: { tr: 'Taro ve Ken\'in istasyon kafesindeki buluşması.', en: 'Taro and Ken\'s meeting at the station cafe.' },
    pages: [
      { id: 'p1', japanese: 'たろうさんは えきの まえで ともだちを まっています。\nいま くじ はんです。\nひとが たくさん います。\nでんしゃの おとが きこえます。\nたろうさんは すこし どきどきしています。' },
      { id: 'p2', japanese: 'じゅっぷんご、けんさんが はしって きました。\n「ごめん、おくれた！ バスが こなくて」\n「だいじょうぶだよ、ゆっくりね」\nたろうさんは わらいながら いいます。\nふたりは えきの なかに はいります。' },
      { id: 'p3', japanese: 'えきの なかの カフェは あたたかいです。\nコーヒーと パンの においが します。\n「いい においだね」と けんさんは いいます。\nふたりは メニューを みながら、\nなにを たのもうか かんがえます。' },
      { id: 'p4', japanese: 'たろうさんは ホットコーヒーを たのみます。\nけんさんは アイスティーと ケーキを たのみます。\nふたりは まどの そばの せきに すわります。\nそとでは ひとびとが いそがしそうに あるいています。' },
      { id: 'p5', japanese: 'ふたりは ながい じかん はなします。\nしごとの こと、りょこうの こと、\nすきな えいがの こと。\nコーヒーは もう つめたく なりましたが、\nはなしは まだ まだ つづきます。' },
    ]
  },
  {
    id: 'small-library',
    title: 'ちいさな としょかん',
    level: 'N5–N4',
    genre: 'School',
    minutes: 10,
    tone: 'amber',
    summary: { tr: 'Mai kütüphanede bir kedi hikayesi bulur.', en: 'Mai finds a cat story at the library.' },
    pages: [
      { id: 'p1', japanese: 'まいさんは まいにち としょかんに いきます。\nしずかで、ほんの においが します。\nまいさんは この ばしょが だいすきです。\nきょうも あたらしい ほんを さがしに きました。' },
      { id: 'p2', japanese: 'たなには たくさんの ほんが ならんでいます。\nあかい ほん、あおい ほん、おおきい ほん。\nまいさんは ゆっくり みていきます。\nどれも おもしろそうです。' },
      { id: 'p3', japanese: 'まいさんは かわいい ねこの えが ついた ほんを みつけました。\n「ねこの きせつ」という ほんです。\nまいさんは うれしくて、\nそっと ほんを むねに だきました。' },
      { id: 'p4', japanese: 'まいさんは まどの ちかくに すわります。\nひかりが やさしく あたっています。\nゆっくり ページを めくると、\nねこの はなしが はじまりました。' },
      { id: 'p5', japanese: 'よみおわって、まいさんは にっこり わらいます。\nねこの はなしは とても よかったです。\n「また あした つづきを よもう」\nそう おもいながら、まいさんは\nそっと ほんを たなに もどしました。' },
    ]
  }
];

const readingCopy = {
  tr: {
    library: 'Kitaplik',
    chooseBook: 'Kitap sec',
    startBook: 'Okumaya basla',
    backToLibrary: 'Kitapliga don',
    pages: 'sayfa',
    minutes: 'dk',
    page: 'Sayfa',
    previous: 'Onceki',
    next: 'Sonraki',
    finish: 'Kitabi bitir',
    vocabulary: 'Kelimeler',
    meaning: 'Anlam',
    romaji: 'Romaji',
    progress: 'Ilerleme'
  },
  en: {
    library: 'Library',
    chooseBook: 'Choose a book',
    startBook: 'Start reading',
    backToLibrary: 'Back to library',
    pages: 'pages',
    minutes: 'min',
    page: 'Page',
    previous: 'Previous',
    next: 'Next',
    finish: 'Finish book',
    vocabulary: 'Vocabulary',
    meaning: 'Meaning',
    romaji: 'Romaji',
    progress: 'Progress'
  }
} as const;

interface ReadingSpread {
  left: ReadingPage;
  right: ReadingPage | null;
  startIndex: number;
}

const fixedBookText = {
  fontSizePx: 27.2,
  lineHeightPx: 53.6,
  pagePaddingX: 40,
  pagePaddingY: 32,
  footerReserve: 72,
  averageCharWidthRatio: 1.12
} as const;

interface ReadingPageSlots {
  charsPerLine: number;
  linesPerPage: number;
}

const defaultReadingPageSlots: ReadingPageSlots = {
  charsPerLine: 14,
  linesPerPage: 8
};

const getLastReadableSpreadStart = (pages: ReadingPage[]) => Math.max(0, pages.length - 2);

const getPreviousReadingSpreadStart = (pages: ReadingPage[], startIndex: number) => {
  const lastStart = getLastReadableSpreadStart(pages);
  if (startIndex === lastStart && startIndex % 2 !== 0) {
    return Math.max(0, startIndex - 1);
  }

  return Math.max(0, startIndex - 2);
};

const getNextReadingSpreadStart = (pages: ReadingPage[], startIndex: number) =>
  Math.min(startIndex + 2, getLastReadableSpreadStart(pages));

const getReadingSpread = (pages: ReadingPage[], startIndex: number): ReadingSpread | null => {
  const boundedStart = Math.max(0, Math.min(startIndex, getLastReadableSpreadStart(pages)));
  const left = pages[boundedStart] ?? null;
  if (!left) return null;

  return {
    left,
    right: pages[boundedStart + 1] ?? null,
    startIndex: boundedStart
  };
};

const getCharacterWeight = (char: string) => {
  if (!char) return 0;
  if (char === ' ') return 0.42;
  return /[\x00-\x7F]/.test(char) ? 0.62 : 1;
};

const noLineStartPunctuation = new Set(Array.from('。、，．,.!?！？)）]】」』”’'));

const wrapReadingLine = (text: string, capacity: number) => {
  const lines: string[] = [];
  let line = '';
  let width = 0;

  Array.from(text).forEach((char) => {
    const charWidth = getCharacterWeight(char);
    if (line && noLineStartPunctuation.has(char)) {
      line += char;
      width += charWidth;
      return;
    }

    if (line && width + charWidth > capacity) {
      lines.push(line.trimEnd());
      line = char.trimStart();
      width = getCharacterWeight(line);
      return;
    }

    line += char;
    width += charWidth;
  });

  if (line.trim().length > 0) {
    lines.push(line.trimEnd());
  }

  return lines;
};

const paginateReadingBook = (book: ReadingBook, slots: ReadingPageSlots): ReadingPage[] => {
  const sourceLines = book.pages
    .flatMap((page) => page.japanese.split('\n'))
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const wrappedLines = sourceLines.flatMap((line) => wrapReadingLine(line, slots.charsPerLine));
  const pages: ReadingPage[] = [];

  for (let index = 0; index < wrappedLines.length; index += slots.linesPerPage) {
    pages.push({
      id: `${book.id}-auto-${pages.length + 1}`,
      japanese: wrappedLines.slice(index, index + slots.linesPerPage).join('\n')
    });
  }

  return pages.length > 0 ? pages : book.pages;
};

const bookPageTextStyle: React.CSSProperties = {
  fontSize: `${fixedBookText.fontSizePx}px`,
  lineHeight: `${fixedBookText.lineHeightPx}px`
};

const bookPagePaddingStyle: React.CSSProperties = {
  paddingInline: `${fixedBookText.pagePaddingX}px`,
  paddingBlock: `${fixedBookText.pagePaddingY}px`
};

const bookLeftPageStyle: React.CSSProperties = {
  ...bookPagePaddingStyle,
  backgroundImage:
    'linear-gradient(180deg, rgba(255,252,244,0.98), rgba(255,247,232,0.98)), radial-gradient(circle at 92% 12%, rgba(216,95,121,0.08), transparent 15rem)'
};

const bookRightPageStyle: React.CSSProperties = {
  ...bookPagePaddingStyle,
  backgroundImage:
    'linear-gradient(180deg, rgba(255,250,240,0.98), rgba(255,245,226,0.98)), radial-gradient(circle at 8% 10%, rgba(193,147,105,0.1), transparent 13rem)'
};

const BookLeftPage: React.FC<{
  page: ReadingPage;
  pageNum: number;
  roundedLeft?: boolean;
}> = ({ page, pageNum, roundedLeft = true }) => (
  <div
    className={`relative flex h-full min-h-0 flex-col bg-[#fff8eb] shadow-[inset_-24px_0_30px_rgba(111,74,48,0.1),inset_0_0_36px_rgba(255,255,255,0.46)] ${
      roundedLeft ? 'lg:rounded-l-[0.9rem]' : ''
    }`}
    style={bookLeftPageStyle}
  >
    <p
      className="flex-1 overflow-hidden whitespace-pre-line font-jp text-[#201a17]"
      style={bookPageTextStyle}
    >
      {page.japanese}
    </p>
    <div className="mt-6 text-center font-jp text-xs text-[#b8a080]">- {pageNum} -</div>
  </div>
);

const BookRightPage: React.FC<{
  bookTitle: string;
  page?: ReadingPage | null;
  pageNum?: number;
  roundedRight?: boolean;
}> = ({ bookTitle, page = null, pageNum, roundedRight = true }) => (
  <div
    className={`relative flex h-full min-h-0 flex-col border-l border-[#e4d2bb] bg-[#fff7e8] shadow-[inset_24px_0_30px_rgba(111,74,48,0.1),inset_0_0_36px_rgba(255,255,255,0.42)] ${
      roundedRight ? 'lg:rounded-r-[0.9rem]' : ''
    }`}
    style={bookRightPageStyle}
  >
    {page ? (
      <>
        <p
          className="flex-1 overflow-hidden whitespace-pre-line font-jp text-[#201a17]"
          style={bookPageTextStyle}
        >
          {page.japanese}
        </p>
        <div className="mt-6 text-center font-jp text-xs text-[#b8a080]">- {pageNum} -</div>
      </>
    ) : (
      <div className="flex flex-1 select-none flex-col items-center justify-center text-center">
      <div className="font-jp text-[#d4b896] text-4xl">✿</div>
        <div className="mt-4 font-jp text-sm text-[#c0a070] opacity-70">{bookTitle}</div>
      </div>
    )}
  </div>
);

export const PracticeJapaneseReadingPage: React.FC<PracticeJapanesePageProps> = ({ language }) => {
  const c = readingCopy[language];
  const spreadRef = useRef<HTMLDivElement | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSlots, setPageSlots] = useState<ReadingPageSlots>(defaultReadingPageSlots);
  const [prevSpread, setPrevSpread] = useState<ReadingSpread | null>(null);
  const [flipDir, setFlipDir] = useState<'forward' | 'backward'>('forward');
  const selectedBook = readingBooks.find((book) => book.id === selectedBookId) ?? null;
  const readingPages = useMemo(
    () => (selectedBook ? paginateReadingBook(selectedBook, pageSlots) : []),
    [pageSlots, selectedBook]
  );
  const spread = readingPages.length > 0 ? getReadingSpread(readingPages, pageIndex) : null;
  const lastReadableSpreadStart = readingPages.length > 0 ? getLastReadableSpreadStart(readingPages) : 0;
  const previousSpreadStart = readingPages.length > 0 ? getPreviousReadingSpreadStart(readingPages, pageIndex) : 0;
  const nextSpreadStart = readingPages.length > 0 ? getNextReadingSpreadStart(readingPages, pageIndex) : 0;

  const startBook = (bookId: string) => {
    setSelectedBookId(bookId);
    setPageIndex(0);
    setPrevSpread(null);
  };

  const goToPage = (nextPage: number) => {
    if (!selectedBook || !spread || prevSpread) return;
    const boundedPage = Math.max(0, Math.min(nextPage, lastReadableSpreadStart));
    setFlipDir(nextPage > pageIndex ? 'forward' : 'backward');
    setPrevSpread(spread);
    setPageIndex(boundedPage);
    setTimeout(() => setPrevSpread(null), 700);
  };

  const returnToLibrary = () => {
    setSelectedBookId(null);
    setPageIndex(0);
    setPrevSpread(null);
  };

  useEffect(() => {
    if (!selectedBook) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    };
  }, [selectedBook]);

  useEffect(() => {
    if (!selectedBook || !spreadRef.current) return undefined;

    const spreadElement = spreadRef.current;
    const updatePageSlots = () => {
      const rect = spreadElement.getBoundingClientRect();
      const textWidth = rect.width / 2 - fixedBookText.pagePaddingX * 2;
      const textHeight = rect.height - fixedBookText.pagePaddingY * 2 - fixedBookText.footerReserve;
      const nextSlots = {
        charsPerLine: Math.max(8, Math.floor(textWidth / (fixedBookText.fontSizePx * fixedBookText.averageCharWidthRatio))),
        linesPerPage: Math.max(4, Math.floor(textHeight / fixedBookText.lineHeightPx))
      };

      setPageSlots((current) =>
        current.charsPerLine === nextSlots.charsPerLine && current.linesPerPage === nextSlots.linesPerPage
          ? current
          : nextSlots
      );
    };

    updatePageSlots();
    const resizeObserver = new ResizeObserver(updatePageSlots);
    resizeObserver.observe(spreadElement);
    window.addEventListener('resize', updatePageSlots);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePageSlots);
    };
  }, [selectedBook]);

  useEffect(() => {
    if (!selectedBook || pageIndex <= lastReadableSpreadStart) return;
    setPageIndex(lastReadableSpreadStart);
    setPrevSpread(null);
  }, [lastReadableSpreadStart, pageIndex, selectedBook]);

  return (
    <PageShell
      width="wide"
      className={selectedBook ? 'h-[calc(100vh-7.5rem)] overflow-hidden !py-0 !pb-0' : 'pb-14'}
    >
      <style>{`
        @keyframes book-flip-forward {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(-180deg); }
        }
        @keyframes book-flip-backward {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(180deg); }
        }
        @keyframes flip-shadow {
          0%   { opacity: 0; }
          40%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
      {!selectedBook || !spread ? (
        <section className="mt-8">
          <div className="mb-6 flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
            <Library size={16} className="text-[var(--kt-brand)]" />
            {c.chooseBook}
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {readingBooks.map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => startBook(book.id)}
                className="group flex flex-col items-center text-center outline-none"
              >
                <div
                  className="relative flex h-[22rem] w-full max-w-[15rem] flex-col justify-between overflow-hidden rounded-r-xl border-y border-r border-black/20 px-5 py-7 text-left shadow-[12px_18px_34px_rgba(24,18,16,0.22)] transition group-hover:-translate-y-1 group-hover:shadow-[16px_24px_42px_rgba(24,18,16,0.28)]"
                  style={{
                    background:
                      book.tone === 'indigo'
                        ? 'linear-gradient(135deg, #27384f 0%, #44617f 100%)'
                        : book.tone === 'amber'
                          ? 'linear-gradient(135deg, #7c5540 0%, #c19369 100%)'
                          : 'linear-gradient(135deg, #79394b 0%, #c96e81 100%)'
                  }}
                >
                  <div className="absolute inset-y-0 left-0 w-8 bg-black/24 shadow-[inset_-4px_0_8px_rgba(0,0,0,0.2)]" />
                  <div className="absolute inset-x-6 top-8 h-px bg-white/30" />
                  <div className="absolute inset-x-6 bottom-8 h-px bg-white/25" />
                  <div className="relative pl-6">
                    <BookOpen className="text-white/86" size={34} />
                    <div className="mt-8 font-jp text-3xl font-black leading-tight text-white">{book.title}</div>
                    <div className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-white/70">{book.level}</div>
                  </div>
                  <div className="relative pl-6 text-xs font-bold text-white/78">
                    {book.pages.length} {c.pages} · {book.minutes} {c.minutes}
                  </div>
                </div>
                <div className="mt-4 max-w-[18rem] text-sm font-bold leading-6 text-[var(--kt-ink-muted)]">
                  {book.summary[language]}
                </div>
                <div className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-brand)]">
                  {c.startBook}
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="flex h-full items-center justify-center">
            <div
              className="relative h-full w-full overflow-hidden rounded-[1.25rem] border border-[#6f4450] bg-[#8e5864] p-2 shadow-[0_28px_70px_rgba(77,44,48,0.36),0_4px_18px_rgba(255,232,222,0.22)] sm:p-3 lg:p-4"
              style={{
                minWidth: 'min(100%, 48rem)',
                maxWidth: '88rem',
                backgroundImage:
                  'linear-gradient(90deg, #5f3944 0%, #8f5965 5%, #a86e76 12%, #8f5965 88%, #6f4450 95%, #4f3340 100%)'
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-8 bottom-1 h-5 rounded-[50%] bg-black/25 blur-md"
              />
              <div className="relative h-full rounded-[1rem] bg-[#d8bfa5] p-2 shadow-[inset_0_-14px_18px_rgba(86,57,37,0.24),inset_0_1px_0_rgba(255,255,255,0.48)] sm:p-3">
                <div className="pointer-events-none absolute inset-x-8 bottom-3 h-5 rounded-b-[50%] border-b border-[#7c5540]/20" />
                <div className="relative h-full overflow-hidden rounded-[0.9rem] border border-[#ead9c5] bg-[#fff7e8] shadow-[0_10px_26px_rgba(83,55,37,0.16)]">
                  {/* Spine + ambient decorations */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-8 -translate-x-1/2 lg:block"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(104,70,48,0.24), rgba(255,247,232,0.72) 44%, rgba(104,70,48,0.2))'
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(circle at 7% 18%, rgba(216,95,121,0.08), transparent 14rem), radial-gradient(circle at 92% 82%, rgba(193,147,105,0.12), transparent 16rem), linear-gradient(90deg, rgba(111,74,48,0.04), transparent 16%, transparent 84%, rgba(111,74,48,0.05))'
                    }}
                  />

                  {/* Base spread: visible side keeps old content until flip completes */}
                  <div ref={spreadRef} className="grid h-full grid-cols-2">
                    <BookLeftPage
                      page={prevSpread && flipDir === 'forward' ? prevSpread.left : spread.left}
                      pageNum={prevSpread && flipDir === 'forward' ? prevSpread.startIndex + 1 : spread.startIndex + 1}
                    />
                    <BookRightPage
                      bookTitle={selectedBook.title}
                      page={prevSpread && flipDir === 'backward' ? prevSpread.right : spread.right}
                      pageNum={
                        prevSpread && flipDir === 'backward'
                          ? prevSpread.right
                            ? prevSpread.startIndex + 2
                            : undefined
                          : spread.right
                            ? spread.startIndex + 2
                            : undefined
                      }
                    />
                  </div>

                  {pageIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => goToPage(previousSpreadStart)}
                      aria-label={c.previous}
                      className="absolute bottom-4 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[#e6d3bd] bg-[#fff8eb]/96 text-[#6f4450] shadow-[0_10px_24px_rgba(86,57,37,0.22)] transition hover:border-[#d9ad9f] hover:bg-white hover:text-[#201a17] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d06070]"
                    >
                      <ChevronLeft size={26} strokeWidth={2.4} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (pageIndex >= lastReadableSpreadStart) returnToLibrary();
                      else goToPage(nextSpreadStart);
                    }}
                    aria-label={pageIndex >= lastReadableSpreadStart ? c.finish : c.next}
                    className="absolute bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[#e6d3bd] bg-[#fff8eb]/96 text-[#6f4450] shadow-[0_10px_24px_rgba(86,57,37,0.22)] transition hover:border-[#d9ad9f] hover:bg-white hover:text-[#201a17] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d06070]"
                  >
                    {pageIndex >= lastReadableSpreadStart ? (
                      <Check size={23} strokeWidth={2.5} />
                    ) : (
                      <ChevronRight size={26} strokeWidth={2.4} />
                    )}
                  </button>

                  {/* 3D flip overlay — forward: right half flips left */}
                  {prevSpread && flipDir === 'forward' && (
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', right: 0, perspective: '2400px', zIndex: 30 }}>
                      <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transformOrigin: 'left center', animation: 'book-flip-forward 0.65s cubic-bezier(0.645, 0.045, 0.355, 1.000) both' }}>
                        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', overflow: 'hidden' }}>
                          <BookRightPage
                            bookTitle={selectedBook.title}
                            page={prevSpread.right}
                            pageNum={prevSpread.right ? prevSpread.startIndex + 2 : undefined}
                            roundedRight={false}
                          />
                          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to left, rgba(0,0,0,0.18), transparent 60%)', animation: 'flip-shadow 0.65s both' }} />
                        </div>
                        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', overflow: 'hidden' }}>
                          <BookLeftPage page={spread.left} pageNum={spread.startIndex + 1} roundedLeft={false} />
                          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to right, rgba(0,0,0,0.18), transparent 60%)', animation: 'flip-shadow 0.65s both' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3D flip overlay — backward: left half flips right */}
                  {prevSpread && flipDir === 'backward' && (
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: '50%', perspective: '2400px', zIndex: 30 }}>
                      <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transformOrigin: 'right center', animation: 'book-flip-backward 0.65s cubic-bezier(0.645, 0.045, 0.355, 1.000) both' }}>
                        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', overflow: 'hidden' }}>
                          <BookLeftPage page={prevSpread.left} pageNum={prevSpread.startIndex + 1} roundedLeft={false} />
                          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to right, rgba(0,0,0,0.18), transparent 60%)', animation: 'flip-shadow 0.65s both' }} />
                        </div>
                        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', overflow: 'hidden' }}>
                          <BookRightPage
                            bookTitle={selectedBook.title}
                            page={spread.right}
                            pageNum={spread.right ? spread.startIndex + 2 : undefined}
                            roundedRight={false}
                          />
                          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to left, rgba(0,0,0,0.18), transparent 60%)', animation: 'flip-shadow 0.65s both' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
        </section>
      )}
    </PageShell>
  );
};

const writingPrompts = [
  {
    id: 'intro',
    prompt: 'Introduce yourself politely.',
    sample: 'はじめまして。わたしはアリです。よろしくおねがいします。'
  },
  {
    id: 'like',
    prompt: 'Say that you like Japanese.',
    sample: 'にほんごがすきです。'
  },
  {
    id: 'invite',
    prompt: 'Invite someone to go to the library together.',
    sample: 'いっしょにとしょかんにいきませんか。'
  }
];

const LegacyPracticeJapaneseSentenceWritingPage: React.FC<PracticeJapanesePageProps> = ({ language }) => {
  const c = modeCopy[language];
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [revealed, setRevealed] = useState(false);
  const prompt = writingPrompts[index];
  const charCount = value.trim().length;
  const hasDraft = charCount > 0;

  const revealSample = () => {
    setRevealed(true);
    if (hasDraft) {
      recordCorrect();
      markPracticedToday();
    }
  };

  const nextPrompt = () => {
    setIndex((current) => (current + 1) % writingPrompts.length);
    setValue('');
    setRevealed(false);
  };

  return (
    <ImmersiveShell className="pb-14">
      <JapaneseHeader language={language} mode="sentence" icon={<MessageSquareText size={14} />} />
      <section className="mt-8 rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5 shadow-[var(--kt-shadow-sm)]">
        <div className="text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
          {index + 1}/{writingPrompts.length}
        </div>
        <h2 className="mt-2 text-xl font-black text-[var(--kt-ink-strong)]">{prompt.prompt}</h2>
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="mt-5 min-h-36 w-full rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-3 font-jp text-xl text-[var(--kt-ink)] outline-none focus:border-[var(--kt-brand)]"
          placeholder="日本語で書いてください..."
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            as="button"
            type="button"
            onClick={() => {
              setRevealed(true);
              if (value.trim().length > 0) {
                recordCorrect();
                markPracticedToday();
              }
            }}
            iconStart={<Check size={16} />}
          >
            {c.reveal}
          </Button>
          <Button
            as="button"
            type="button"
            variant="secondary"
            onClick={() => {
              setIndex((current) => (current + 1) % writingPrompts.length);
              setValue('');
              setRevealed(false);
            }}
          >
            {c.next}
          </Button>
        </div>
        {revealed && (
          <div className="mt-5 rounded-lg border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-4">
            <div className="text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">{c.sample}</div>
            <div className="mt-2 font-jp text-xl font-black text-[var(--kt-ink-strong)]">{prompt.sample}</div>
          </div>
        )}
      </section>
    </ImmersiveShell>
  );
};

export const PracticeJapaneseSentenceWritingPage: React.FC<PracticeJapanesePageProps> = ({ language }) => {
  const c = modeCopy[language];
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [revealed, setRevealed] = useState(false);
  const prompt = writingPrompts[index];
  const charCount = value.trim().length;
  const hasDraft = charCount > 0;

  const revealSample = () => {
    setRevealed(true);
    if (hasDraft) {
      recordCorrect();
      markPracticedToday();
    }
  };

  const nextPrompt = () => {
    setIndex((current) => (current + 1) % writingPrompts.length);
    setValue('');
    setRevealed(false);
  };

  return (
    <ImmersiveShell className="pb-14">
      <section className="kt-jp-stage mt-8 grid gap-5 lg:grid-cols-[18rem_1fr]">
        <JapanesePracticeThemeStyles />
        <aside className="rounded-[1.1rem] border border-[var(--jp-border-strong)] bg-[var(--jp-panel)] p-5 shadow-[var(--jp-elevated-shadow)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--jp-border-strong)] bg-[var(--jp-accent-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
            <MessageSquareText size={14} />
            {modeCopy[language].sentence.eyebrow}
          </div>
          <h1 className="mt-5 text-3xl font-black leading-tight text-[var(--jp-ink-strong)]">
            {modeCopy[language].sentence.title}
          </h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-[var(--jp-ink-muted)]">
            {modeCopy[language].sentence.description}
          </p>

          <div className="mt-6 space-y-2">
            {writingPrompts.map((item, itemIndex) => {
              const isActive = itemIndex === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setIndex(itemIndex);
                    setValue('');
                    setRevealed(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${
                    isActive
                      ? 'border-[var(--jp-border-strong)] bg-[var(--jp-paper)] text-[#251a18] shadow-[0_14px_28px_rgba(216,95,121,0.12)]'
                      : 'border-[var(--jp-ghost-border)] bg-[var(--jp-ghost)] text-[var(--jp-ink)] hover:bg-[var(--jp-ghost-hover)]'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                      isActive ? 'bg-[var(--jp-accent)] text-white' : 'bg-[var(--jp-panel-muted)] text-[var(--jp-accent-strong)]'
                    }`}
                  >
                    {itemIndex + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black leading-5">{item.prompt}</span>
                    <span className={`mt-0.5 block text-[11px] font-bold ${isActive ? 'text-[#8d7067]' : 'text-[var(--jp-ink-soft)]'}`}>
                      {language === 'tr' ? 'Yazı görevi' : 'Writing task'}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="overflow-hidden rounded-[1.25rem] border border-[var(--jp-border-strong)] bg-[var(--jp-panel-strong)] shadow-[var(--jp-elevated-shadow)]">
          <div className="relative min-h-[36rem] p-7 lg:p-8" style={{ background: 'var(--jp-console-bg)' }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--jp-border-strong)] bg-[var(--jp-accent-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
                <PencilLine size={14} />
                {language === 'tr' ? 'Serbest üretim' : 'Free production'}
              </div>
              <div className="rounded-full border border-[var(--jp-ghost-border)] bg-[var(--jp-ghost)] px-3 py-1 text-sm font-black text-[var(--jp-ink-muted)]">
                {index + 1}/{writingPrompts.length}
              </div>
            </div>

            <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_20rem]">
              <div>
                <div className="rounded-[1rem] border border-[var(--jp-paper-line)] bg-[var(--jp-paper)] p-7 text-[#201a17] shadow-[var(--jp-page-shadow)]">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
                    {language === 'tr' ? 'Durum' : 'Prompt'}
                  </div>
                  <h2 className="mt-4 text-4xl font-black leading-tight">{prompt.prompt}</h2>
                  <p className="mt-4 text-sm font-semibold leading-6 text-[#6f5450]">
                    {language === 'tr'
                      ? 'Japonca cevap yaz. Sonra model cevapla karşılaştır.'
                      : 'Write a Japanese response, then compare it with the model answer.'}
                  </p>
                </div>

                <div className="mt-5 rounded-[1rem] border border-[var(--jp-ghost-border)] bg-[var(--jp-panel-soft)] p-2">
                  <textarea
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    className="min-h-64 w-full resize-none rounded-[0.85rem] border border-transparent bg-[var(--jp-paper)] px-5 py-4 font-jp text-2xl font-black leading-relaxed text-[#201a17] outline-none focus:border-[var(--jp-accent)]"
                    placeholder="日本語で書いてください..."
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={revealSample}
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--jp-accent)] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_14px_28px_rgba(216,95,121,0.3)] transition hover:-translate-y-0.5 hover:brightness-105"
                  >
                    <Check size={16} />
                    {c.reveal}
                  </button>
                  <button
                    type="button"
                    onClick={nextPrompt}
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--jp-border-strong)] bg-[var(--jp-ghost)] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[var(--jp-ink-strong)] transition hover:bg-[var(--jp-ghost-hover)]"
                  >
                    {c.next}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <aside className="rounded-[1rem] border border-[var(--jp-border-strong)] bg-[var(--jp-panel)] p-5 shadow-[var(--jp-elevated-shadow)]">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--jp-accent-strong)]">
                  {language === 'tr' ? 'Yazı masası' : 'Writing desk'}
                </div>
                <div className="mt-4 rounded-lg bg-[var(--jp-paper)] p-4 text-[#251a18]">
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--jp-accent-strong)]">
                    {language === 'tr' ? 'Taslak' : 'Draft'}
                  </div>
                  <div className="mt-2 text-3xl font-black">{charCount}</div>
                  <div className="mt-1 text-xs font-bold text-[#8d7067]">{language === 'tr' ? 'karakter' : 'characters'}</div>
                </div>

                <div className="mt-4 rounded-lg border border-[var(--jp-ghost-border)] bg-[var(--jp-panel-soft)] p-4">
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--jp-ink-soft)]">
                    {c.sample}
                  </div>
                  {revealed ? (
                    <div className="mt-3 rounded-lg bg-[var(--jp-paper)] p-4 font-jp text-xl font-black leading-relaxed text-[#251a18]">
                      {prompt.sample}
                    </div>
                  ) : (
                    <div className="mt-3 rounded-lg border border-dashed border-[var(--jp-border-strong)] p-4 text-sm font-semibold leading-6 text-[var(--jp-ink-muted)]">
                      {language === 'tr' ? 'Model cevap gizli.' : 'Model answer hidden.'}
                    </div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-1">
                  {writingPrompts.map((item, itemIndex) => (
                    <span
                      key={item.id}
                      className={`h-8 rounded-sm ${
                        itemIndex < index
                          ? 'bg-[var(--jp-accent)]'
                          : itemIndex === index
                            ? 'bg-[var(--jp-paper)]'
                            : 'bg-[var(--jp-track)]'
                      }`}
                    />
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </ImmersiveShell>
  );
};

export const PracticeJapaneseFlashcardsPage: React.FC<PracticeJapanesePageProps> = ({ language }) => {
  const c = modeCopy[language];
  const vocab = getAllJLearnVocabItems();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = vocab[index] ?? null;

  const rate = (known: boolean) => {
    if (card) {
      writeVocab(
        updateVocabProgress(readVocab(), {
          vocabId: card.id,
          missionId: 'practice-japanese-flashcards',
          wasCorrect: known
        })
      );
      if (known) {
        recordCorrect();
        markPracticedToday();
      } else {
        recordWrong();
      }
    }
    setIndex((current) => (current + 1) % vocab.length);
    setFlipped(false);
  };

  return (
    <ImmersiveShell className="pb-14">
      <JapaneseHeader language={language} mode="flashcards" icon={<RefreshCcw size={14} />} />
      <section className="mt-8 rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5 shadow-[var(--kt-shadow-sm)]">
        {card ? (
          <>
            <button
              type="button"
              onClick={() => setFlipped((value) => !value)}
              className="flex min-h-[22rem] w-full flex-col items-center justify-center rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface)] p-6 text-center transition hover:bg-[var(--kt-surface-muted)]"
            >
              <div className="text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
                {index + 1}/{vocab.length}
              </div>
              {!flipped ? (
                <>
                  <div className="mt-6 font-jp text-7xl font-black text-[var(--kt-ink-strong)]">
                    {card.kanji ?? card.japanese}
                  </div>
                  <div className="mt-4 text-sm font-bold text-[var(--kt-ink-muted)]">{card.partOfSpeech}</div>
                </>
              ) : (
                <>
                  <div className="mt-6 text-3xl font-black text-[var(--kt-ink-strong)]">{card.english}</div>
                  <div className="mt-3 font-mono text-lg font-bold text-[var(--kt-ink-muted)]">{card.romaji}</div>
                  <div className="mt-3 font-jp text-2xl font-black text-[var(--kt-ink)]">{card.japanese}</div>
                </>
              )}
            </button>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <Button as="button" type="button" variant="secondary" onClick={() => setFlipped((value) => !value)}>
                {c.reveal}
              </Button>
              <Button as="button" type="button" variant="danger" onClick={() => rate(false)}>
                {c.again}
              </Button>
              <Button as="button" type="button" onClick={() => rate(true)}>
                {c.known}
              </Button>
            </div>
          </>
        ) : (
          <EmptyPanel text={c.empty} />
        )}
      </section>
    </ImmersiveShell>
  );
};
