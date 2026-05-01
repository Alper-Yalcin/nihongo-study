import React, { useMemo, useState } from 'react';
import {
  BadgeCheck,
  BookOpen,
  BookText,
  Check,
  Languages,
  MessageSquareText,
  PencilLine,
  RefreshCcw,
  Sparkles,
  Target
} from 'lucide-react';
import { Button, Eyebrow, PageHeader, PageShell } from '../components/ui';
import { AppLanguage } from '../data/appPreferences';
import {
  getAllJLearnGrammarPoints,
  getAllJLearnSteps,
  getAllJLearnVocabItems
} from '../data/jlearn/jlearnContent';
import { PracticeQuestion, QuestionType, VocabItem } from '../data/jlearn/jlearnTypes';
import { readVocab, updateVocabProgress, writeVocab } from '../data/jlearn/jlearnStorage';
import { isAnswerCorrect } from '../features/jlearn/tasks/answerNormalizer';
import { recordCorrect, recordWrong } from '../hooks/useFeedback';
import { markPracticedToday } from '../features/streak/tomoshibi';

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
      description: 'Kisa Japonca parcalari oku, ana fikri ve kelimeleri kontrol et.'
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
      description: 'Read short Japanese passages and check the main idea and key vocabulary.'
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
  <PageShell width="wide" className="pb-14">
    <JapaneseHeader language={language} mode="quick" icon={<Target size={14} />} />
    <QuizPanel language={language} questions={pickQuestions(supportedQuickTypes, 12)} />
  </PageShell>
);

export const PracticeJapaneseFillBlankPage: React.FC<PracticeJapanesePageProps> = ({ language }) => (
  <PageShell width="wide" className="pb-14">
    <JapaneseHeader language={language} mode="fill" icon={<PencilLine size={14} />} />
    <QuizPanel language={language} questions={pickQuestions(['fill-in-blank'], 12)} />
  </PageShell>
);

export const PracticeJapaneseTranslationPage: React.FC<PracticeJapanesePageProps> = ({ language }) => (
  <PageShell width="wide" className="pb-14">
    <JapaneseHeader language={language} mode="translation" icon={<Languages size={14} />} />
    <QuizPanel language={language} questions={pickQuestions(['translation-en-jp', 'translation-jp-en'], 12)} />
  </PageShell>
);

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

  return (
    <PageShell width="wide" className="pb-14">
      <JapaneseHeader language={language} mode="topics" icon={<BookText size={14} />} />
      <section className="mt-8 grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-3 shadow-[var(--kt-shadow-sm)]">
          {topicDefs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTopic(item.id)}
              className={`mb-2 w-full rounded-lg px-3 py-2 text-left text-sm font-black transition ${
                topic === item.id
                  ? 'bg-[var(--kt-brand)] text-[var(--kt-brand-on)]'
                  : 'text-[var(--kt-ink)] hover:bg-[var(--kt-surface-muted)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </aside>
        <div className="rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5 shadow-[var(--kt-shadow-sm)]">
          <h2 className="text-xl font-black text-[var(--kt-ink-strong)]">{activeTopic.label}</h2>
          <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {words.map((word) => (
              <div key={word.id} className="rounded-lg border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-3">
                <div className="font-jp text-xl font-black text-[var(--kt-ink-strong)]">{word.kanji ?? word.japanese}</div>
                <div className="mt-1 text-xs font-bold text-[var(--kt-ink-muted)]">{word.romaji}</div>
                <div className="mt-2 text-sm text-[var(--kt-ink)]">{word.english}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-4">
            <div className="text-sm font-black text-[var(--kt-ink-strong)]">Grammar samples</div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {grammar.slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-lg bg-[var(--kt-surface-muted)] p-3">
                  <div className="font-jp text-base font-black text-[var(--kt-ink-strong)]">{item.pattern}</div>
                  <p className="mt-1 text-xs leading-5 text-[var(--kt-ink-muted)]">{item.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <QuizPanel language={language} questions={topicQuestions.length > 0 ? topicQuestions : pickQuestions(['multiple-choice'], 6)} />
    </PageShell>
  );
};

const readingStories = [
  {
    id: 'morning',
    title: 'あさの あいさつ',
    japanese: 'あさです。たなかさんは がっこうに いきます。ともだちに「おはようございます」と いいます。',
    romaji: 'Asa desu. Tanaka-san wa gakkou ni ikimasu. Tomodachi ni "ohayou gozaimasu" to iimasu.',
    meaning: 'It is morning. Tanaka goes to school and says good morning to a friend.',
    question: 'What greeting is used?',
    answer: 'おはようございます',
    options: ['おはようございます', 'こんばんは', 'いただきます']
  },
  {
    id: 'shop',
    title: 'コンビニで',
    japanese: 'これは パンです。その ジュースは いくらですか。たなかさんは パンと ジュースを かいます。',
    romaji: 'Kore wa pan desu. Sono juusu wa ikura desu ka. Tanaka-san wa pan to juusu o kaimasu.',
    meaning: 'This is bread. Tanaka asks how much that juice is and buys bread and juice.',
    question: 'What does Tanaka buy?',
    answer: 'パンとジュース',
    options: ['パンとジュース', 'ほんとえんぴつ', 'さかなとみず']
  }
];

export const PracticeJapaneseReadingPage: React.FC<PracticeJapanesePageProps> = ({ language }) => {
  const c = modeCopy[language];
  const [storyIndex, setStoryIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const story = readingStories[storyIndex];

  const choose = (option: string) => {
    setSelected(option);
    if (option === story.answer) {
      recordCorrect();
      markPracticedToday();
    } else {
      recordWrong();
    }
  };

  return (
    <PageShell width="wide" className="pb-14">
      <JapaneseHeader language={language} mode="reading" icon={<BookOpen size={14} />} />
      <section className="mt-8 rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5 shadow-[var(--kt-shadow-sm)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-black text-[var(--kt-ink-strong)]">{story.title}</h2>
          <Button
            as="button"
            type="button"
            variant="secondary"
            onClick={() => {
              setStoryIndex((current) => (current + 1) % readingStories.length);
              setSelected(null);
            }}
          >
            {c.next}
          </Button>
        </div>
        <p className="mt-5 font-jp text-2xl leading-10 text-[var(--kt-ink-strong)]">{story.japanese}</p>
        <p className="mt-4 text-sm leading-6 text-[var(--kt-ink-muted)]">{story.romaji}</p>
        <p className="mt-3 rounded-lg bg-[var(--kt-surface)] p-4 text-sm leading-6 text-[var(--kt-ink)]">{story.meaning}</p>
        <div className="mt-5 text-base font-black text-[var(--kt-ink-strong)]">{story.question}</div>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {story.options.map((option) => (
            <button
              key={option}
              type="button"
              disabled={selected !== null}
              onClick={() => choose(option)}
              className={`rounded-lg border px-4 py-3 font-jp text-lg font-black transition ${
                selected === null
                  ? 'border-[var(--kt-border)] bg-[var(--kt-surface)] hover:bg-[var(--kt-surface-muted)]'
                  : option === story.answer
                    ? 'border-[color:var(--kt-accent-success)]/45 bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)]'
                    : selected === option
                      ? 'border-[color:var(--kt-accent-danger)]/45 bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)]'
                      : 'border-[var(--kt-border)] bg-[var(--kt-surface)] opacity-70'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </section>
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

export const PracticeJapaneseSentenceWritingPage: React.FC<PracticeJapanesePageProps> = ({ language }) => {
  const c = modeCopy[language];
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [revealed, setRevealed] = useState(false);
  const prompt = writingPrompts[index];

  return (
    <PageShell width="wide" className="pb-14">
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
    </PageShell>
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
    <PageShell width="wide" className="pb-14">
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
    </PageShell>
  );
};
