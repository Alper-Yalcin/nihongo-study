import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  BookText,
  Check,
  ChevronLeft,
  ChevronRight,
  Library,
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

type ReadingBookTone = 'rose' | 'indigo' | 'amber';

interface ReadingVocab {
  japanese: string;
  reading: string;
  meaning: {
    tr: string;
    en: string;
  };
}

interface ReadingPage {
  id: string;
  title: string;
  japanese: string;
  romaji: string;
  meaning: {
    tr: string;
    en: string;
  };
  vocab: ReadingVocab[];
  question: {
    tr: string;
    en: string;
    answer: string;
    options: string[];
  };
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
    minutes: 4,
    tone: 'rose',
    summary: {
      tr: 'Kisa gunluk cumlelerle sabah rutini ve parkta karsilasma.',
      en: 'A short daily-life story about a morning routine and a meeting at the park.'
    },
    pages: [
      {
        id: 'morning-1',
        title: 'あたらしい あさ',
        japanese: 'あさです。ゆきさんは みずを のみます。それから こうえんに いきます。そらは あおいです。',
        romaji: 'Asa desu. Yuki-san wa mizu o nomimasu. Sore kara kouen ni ikimasu. Sora wa aoi desu.',
        meaning: {
          tr: 'Sabah oldu. Yuki su icer, sonra parka gider. Gokyuzu mavidir.',
          en: 'It is morning. Yuki drinks water, then goes to the park. The sky is blue.'
        },
        vocab: [
          { japanese: 'あさ', reading: 'asa', meaning: { tr: 'sabah', en: 'morning' } },
          { japanese: 'みず', reading: 'mizu', meaning: { tr: 'su', en: 'water' } },
          { japanese: 'こうえん', reading: 'kouen', meaning: { tr: 'park', en: 'park' } }
        ],
        question: {
          tr: 'Yuki nereye gidiyor?',
          en: 'Where does Yuki go?',
          answer: 'こうえん',
          options: ['こうえん', 'がっこう', 'えき']
        }
      },
      {
        id: 'morning-2',
        title: 'ともだち',
        japanese: 'こうえんで ともだちに あいます。ふたりは「おはよう」と いいます。ベンチで すこし はなします。',
        romaji: 'Kouen de tomodachi ni aimasu. Futari wa "ohayou" to iimasu. Benchi de sukoshi hanashimasu.',
        meaning: {
          tr: 'Parkta bir arkadasiyla karsilasir. Ikisi "gunaydin" der. Bankta biraz konusurlar.',
          en: 'At the park, Yuki meets a friend. They say good morning and talk a little on a bench.'
        },
        vocab: [
          { japanese: 'ともだち', reading: 'tomodachi', meaning: { tr: 'arkadas', en: 'friend' } },
          { japanese: 'あいます', reading: 'aimasu', meaning: { tr: 'karsilasir', en: 'meet' } },
          { japanese: 'はなします', reading: 'hanashimasu', meaning: { tr: 'konusur', en: 'talk' } }
        ],
        question: {
          tr: 'Iki kisi nerede konusuyor?',
          en: 'Where do the two people talk?',
          answer: 'ベンチ',
          options: ['ベンチ', 'でんしゃ', 'きょうしつ']
        }
      }
    ]
  },
  {
    id: 'station-cafe',
    title: 'えきのカフェ',
    level: 'N5',
    genre: 'Travel',
    minutes: 5,
    tone: 'indigo',
    summary: {
      tr: 'Istasyonda bulusma, kafe siparisi ve saat ifadeleri.',
      en: 'A station meetup with cafe orders and time expressions.'
    },
    pages: [
      {
        id: 'station-1',
        title: 'えきで',
        japanese: 'たろうさんは えきに います。いま くじです。ともだちは まだ きません。',
        romaji: 'Tarou-san wa eki ni imasu. Ima kuji desu. Tomodachi wa mada kimasen.',
        meaning: {
          tr: 'Taro istasyondadir. Simdi saat dokuz. Arkadasi henuz gelmez.',
          en: 'Taro is at the station. It is nine o clock. His friend has not come yet.'
        },
        vocab: [
          { japanese: 'えき', reading: 'eki', meaning: { tr: 'istasyon', en: 'station' } },
          { japanese: 'くじ', reading: 'kuji', meaning: { tr: 'saat dokuz', en: 'nine o clock' } },
          { japanese: 'まだ', reading: 'mada', meaning: { tr: 'henuz', en: 'not yet' } }
        ],
        question: {
          tr: 'Taro nerede?',
          en: 'Where is Taro?',
          answer: 'えき',
          options: ['えき', 'カフェ', 'いえ']
        }
      },
      {
        id: 'station-2',
        title: 'あたたかい コーヒー',
        japanese: 'ともだちが きました。ふたりは カフェに はいります。たろうさんは あたたかい コーヒーを たのみます。',
        romaji: 'Tomodachi ga kimashita. Futari wa kafe ni hairimasu. Tarou-san wa atatakai koohii o tanomimasu.',
        meaning: {
          tr: 'Arkadasi geldi. Ikisi kafeye girer. Taro sicak kahve siparis eder.',
          en: 'The friend arrives. The two enter a cafe. Taro orders hot coffee.'
        },
        vocab: [
          { japanese: 'カフェ', reading: 'kafe', meaning: { tr: 'kafe', en: 'cafe' } },
          { japanese: 'あたたかい', reading: 'atatakai', meaning: { tr: 'sicak', en: 'warm' } },
          { japanese: 'たのみます', reading: 'tanomimasu', meaning: { tr: 'siparis eder', en: 'order' } }
        ],
        question: {
          tr: 'Taro ne siparis ediyor?',
          en: 'What does Taro order?',
          answer: 'コーヒー',
          options: ['コーヒー', 'ジュース', 'おちゃ']
        }
      }
    ]
  },
  {
    id: 'small-library',
    title: 'ちいさな としょかん',
    level: 'N5-N4',
    genre: 'School',
    minutes: 6,
    tone: 'amber',
    summary: {
      tr: 'Kutuphane, kitap secme ve sessiz okuma uzerine biraz daha uzun bir metin.',
      en: 'A slightly longer text about a library, choosing a book, and reading quietly.'
    },
    pages: [
      {
        id: 'library-1',
        title: 'ほんを さがす',
        japanese: 'まいさんは としょかんが すきです。きょうは やさしい にほんごの ほんを さがします。',
        romaji: 'Mai-san wa toshokan ga suki desu. Kyou wa yasashii nihongo no hon o sagashimasu.',
        meaning: {
          tr: 'Mai kutuphaneyi sever. Bugun kolay Japonca bir kitap arar.',
          en: 'Mai likes the library. Today she looks for an easy Japanese book.'
        },
        vocab: [
          { japanese: 'としょかん', reading: 'toshokan', meaning: { tr: 'kutuphane', en: 'library' } },
          { japanese: 'やさしい', reading: 'yasashii', meaning: { tr: 'kolay', en: 'easy' } },
          { japanese: 'さがします', reading: 'sagashimasu', meaning: { tr: 'arar', en: 'look for' } }
        ],
        question: {
          tr: 'Mai ne ariyor?',
          en: 'What is Mai looking for?',
          answer: 'にほんごの ほん',
          options: ['にほんごの ほん', 'あたらしい くつ', 'しろい かさ']
        }
      },
      {
        id: 'library-2',
        title: 'しずかな へや',
        japanese: 'まいさんは まどの ちかくに すわります。へやは しずかです。ほんの ことばを ノートに かきます。',
        romaji: 'Mai-san wa mado no chikaku ni suwarimasu. Heya wa shizuka desu. Hon no kotoba o nooto ni kakimasu.',
        meaning: {
          tr: 'Mai pencerenin yakinina oturur. Oda sessizdir. Kitaptaki kelimeleri deftere yazar.',
          en: 'Mai sits near the window. The room is quiet. She writes the book words in her notebook.'
        },
        vocab: [
          { japanese: 'まど', reading: 'mado', meaning: { tr: 'pencere', en: 'window' } },
          { japanese: 'しずか', reading: 'shizuka', meaning: { tr: 'sessiz', en: 'quiet' } },
          { japanese: 'ことば', reading: 'kotoba', meaning: { tr: 'kelime', en: 'word' } }
        ],
        question: {
          tr: 'Mai kelimeleri nereye yaziyor?',
          en: 'Where does Mai write the words?',
          answer: 'ノート',
          options: ['ノート', 'かばん', 'テーブル']
        }
      }
    ]
  }
];

const readingCopy = {
  tr: {
    library: 'Kitaplik',
    chooseBook: 'Kitap sec',
    startBook: 'Okumaya basla',
    backToLibrary: 'Kitapliga don',
    level: 'Seviye',
    time: 'Sure',
    pages: 'sayfa',
    minutes: 'dk',
    reader: 'Okuma alani',
    page: 'Sayfa',
    previous: 'Onceki',
    next: 'Sonraki',
    finish: 'Kitabi bitir',
    vocabulary: 'Kelimeler',
    meaning: 'Anlam',
    romaji: 'Romaji',
    comprehension: 'Anlama sorusu',
    correct: 'Dogru cevap',
    wrong: 'Tekrar kontrol et',
    progress: 'Ilerleme'
  },
  en: {
    library: 'Library',
    chooseBook: 'Choose a book',
    startBook: 'Start reading',
    backToLibrary: 'Back to library',
    level: 'Level',
    time: 'Time',
    pages: 'pages',
    minutes: 'min',
    reader: 'Reading area',
    page: 'Page',
    previous: 'Previous',
    next: 'Next',
    finish: 'Finish book',
    vocabulary: 'Vocabulary',
    meaning: 'Meaning',
    romaji: 'Romaji',
    comprehension: 'Comprehension',
    correct: 'Correct',
    wrong: 'Check again',
    progress: 'Progress'
  }
} as const;

type BookCopy = typeof readingCopy['en'] | typeof readingCopy['tr'];

const BookLeftPage: React.FC<{
  page: ReadingPage;
  language: AppLanguage;
  c: BookCopy;
  roundedLeft?: boolean;
}> = ({ page, language, c, roundedLeft = true }) => (
  <div
    className={`relative min-h-[34rem] bg-[#fff8eb] px-5 py-6 shadow-[inset_-24px_0_28px_rgba(91,63,36,0.08)] sm:px-9 sm:py-8 ${
      roundedLeft ? 'lg:rounded-l-[0.9rem]' : ''
    }`}
  >
    <div className="mx-auto max-w-[34rem]">
      <div className="text-center">
        <BookOpen className="mx-auto text-[#6e5642]" size={24} />
        <div className="mt-2 font-jp text-sm font-black text-[#7a5445]">✿ {page.title} ✿</div>
        <div className="mx-auto mt-4 h-px w-4/5 bg-[#d8c7ab]" />
      </div>
      <div className="mt-8 border-y border-[#dfcfb3] py-5">
        <p className="font-jp text-2xl leading-10 text-[#201a17] sm:text-3xl sm:leading-[3.3rem]">{page.japanese}</p>
      </div>
      <div className="mt-6 border-t border-[#dfcfb3] pt-5">
        <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7460]">{c.romaji}</div>
        <p className="mt-2 text-sm leading-6 text-[#5d4d41]">{page.romaji}</p>
      </div>
      <div className="mt-5 border-t border-[#dfcfb3] pt-5">
        <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7460]">{c.meaning}</div>
        <p className="mt-2 text-sm leading-6 text-[#4d4037]">{page.meaning[language]}</p>
      </div>
    </div>
  </div>
);

const BookRightPage: React.FC<{
  page: ReadingPage;
  language: AppLanguage;
  c: BookCopy;
  selected: string | null;
  onChoose: (option: string) => void;
  interactive: boolean;
  roundedRight?: boolean;
}> = ({ page, language, c, selected, onChoose, interactive, roundedRight = true }) => (
  <div
    className={`relative min-h-[34rem] border-t border-[#dfcfb3] bg-[#fff7e8] px-5 py-6 shadow-[inset_24px_0_28px_rgba(91,63,36,0.08)] sm:px-9 sm:py-8 lg:border-l lg:border-t-0 ${
      roundedRight ? 'lg:rounded-r-[0.9rem]' : ''
    }`}
  >
    <div className="mx-auto max-w-[34rem]">
      <div className="text-center">
        <Library className="mx-auto text-[#6e5642]" size={24} />
        <div className="mt-2 text-sm font-black text-[#7a5445]">✿ {c.vocabulary} ✿</div>
        <div className="mx-auto mt-4 h-px w-4/5 bg-[#d8c7ab]" />
      </div>
      <div className="mt-7 divide-y divide-[#e4d5bd]">
        {page.vocab.map((item) => (
          <div key={item.japanese} className="grid grid-cols-[minmax(5rem,0.8fr)_minmax(0,1fr)] gap-4 py-4">
            <div>
              <div className="font-jp text-3xl font-black text-[#201a17]">{item.japanese}</div>
              <div className="mt-1 font-jp text-sm font-bold text-[#5d4d41]">[ {item.reading} ]</div>
            </div>
            <div className="pt-1">
              <div className="font-jp text-base font-black text-[#2e2722]">{item.japanese}</div>
              <div className="mt-1 text-sm font-semibold text-[#7a5445]">{item.meaning[language]}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-7 border-t border-[#dfcfb3] pt-5">
        <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7460]">{c.comprehension}</div>
        <div className="mt-2 text-base font-black text-[#2e2722]">{page.question[language]}</div>
        <div className="mt-3 grid gap-2">
          {page.question.options.map((option) => (
            <button
              key={option}
              type="button"
              disabled={!interactive || selected !== null}
              onClick={() => onChoose(option)}
              className={`border-b px-1 py-3 text-left font-jp text-base font-black transition ${
                selected === null
                  ? 'border-[#dcc8a8] text-[#2e2722] hover:border-[#b69468] hover:text-[#7a5445]'
                  : option === page.question.answer
                    ? 'border-[color:var(--kt-accent-success)] text-[var(--kt-accent-success)]'
                    : selected === option
                      ? 'border-[color:var(--kt-accent-danger)] text-[var(--kt-accent-danger)]'
                      : 'border-[#dcc8a8] text-[#2e2722] opacity-70'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        {selected !== null && (
          <div
            className={`mt-3 text-sm font-black ${
              selected === page.question.answer ? 'text-[var(--kt-accent-success)]' : 'text-[var(--kt-accent-danger)]'
            }`}
          >
            {selected === page.question.answer ? c.correct : c.wrong}
          </div>
        )}
      </div>
    </div>
  </div>
);

export const PracticeJapaneseReadingPage: React.FC<PracticeJapanesePageProps> = ({ language }) => {
  const c = readingCopy[language];
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<ReadingPage | null>(null);
  const [flipDir, setFlipDir] = useState<'forward' | 'backward'>('forward');
  const selectedBook = readingBooks.find((book) => book.id === selectedBookId) ?? null;
  const page = selectedBook?.pages[pageIndex] ?? null;
  const progress = selectedBook ? Math.round(((pageIndex + 1) / selectedBook.pages.length) * 100) : 0;

  const choose = (option: string) => {
    if (!page || selected !== null) return;
    setSelected(option);
    if (option === page.question.answer) {
      recordCorrect();
      markPracticedToday();
    } else {
      recordWrong();
    }
  };

  const startBook = (bookId: string) => {
    setSelectedBookId(bookId);
    setPageIndex(0);
    setSelected(null);
  };

  const goToPage = (nextPage: number) => {
    if (!selectedBook || prevPage) return;
    const boundedPage = Math.max(0, Math.min(nextPage, selectedBook.pages.length - 1));
    setFlipDir(nextPage > pageIndex ? 'forward' : 'backward');
    setPrevPage(page);
    setPageIndex(boundedPage);
    setSelected(null);
    setTimeout(() => setPrevPage(null), 700);
  };

  const returnToLibrary = () => {
    setSelectedBookId(null);
    setPageIndex(0);
    setSelected(null);
  };

  return (
    <PageShell width="wide" className="pb-14">
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
      {!selectedBook || !page ? (
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
        <section className="mt-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={returnToLibrary}
              className="inline-flex items-center gap-2 text-sm font-black text-[var(--kt-ink-muted)] transition hover:text-[var(--kt-ink-strong)]"
            >
              <ArrowLeft size={16} />
              {c.backToLibrary}
            </button>
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
              <span className="font-jp text-sm normal-case tracking-normal text-[var(--kt-ink-strong)]">{selectedBook.title}</span>
              <span>{c.page} {pageIndex + 1}/{selectedBook.pages.length}</span>
              <span>{c.progress}: {progress}%</span>
            </div>
            <div className="flex gap-2">
              <Button
                as="button"
                type="button"
                variant="ghost"
                size="sm"
                disabled={pageIndex === 0}
                onClick={() => goToPage(pageIndex - 1)}
                iconStart={<ChevronLeft size={16} />}
              >
                {c.previous}
              </Button>
              <Button
                as="button"
                type="button"
                size="sm"
                onClick={() => {
                  if (pageIndex === selectedBook.pages.length - 1) returnToLibrary();
                  else goToPage(pageIndex + 1);
                }}
                iconEnd={pageIndex === selectedBook.pages.length - 1 ? undefined : <ChevronRight size={16} />}
              >
                {pageIndex === selectedBook.pages.length - 1 ? c.finish : c.next}
              </Button>
            </div>
          </div>

            <div
              className="relative overflow-hidden rounded-[1.25rem] border border-[#233246] bg-[#26394f] p-3 shadow-[0_28px_70px_rgba(25,18,14,0.34)] sm:p-4"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #1d2d42 0%, #2f4964 5%, #26394f 12%, #26394f 88%, #2f4964 95%, #1d2d42 100%)'
              }}
            >
              {pageIndex > 0 && (
                <button
                  type="button"
                  onClick={() => goToPage(pageIndex - 1)}
                  aria-label={c.previous}
                  className="absolute bottom-4 left-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
                >
                  <ChevronLeft size={22} />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (pageIndex === selectedBook.pages.length - 1) returnToLibrary();
                  else goToPage(pageIndex + 1);
                }}
                aria-label={pageIndex === selectedBook.pages.length - 1 ? c.finish : c.next}
                className="absolute bottom-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
              >
                {pageIndex === selectedBook.pages.length - 1 ? (
                  <Check size={20} />
                ) : (
                  <ChevronRight size={22} />
                )}
              </button>
              <div
                aria-hidden="true"
                className="absolute inset-x-8 bottom-1 h-5 rounded-[50%] bg-black/25 blur-md"
              />
              <div className="relative rounded-[1rem] bg-[#d8c5a6] p-2 shadow-[inset_0_-14px_18px_rgba(65,48,32,0.24)] sm:p-3">
                <div className="pointer-events-none absolute inset-x-8 bottom-3 h-5 rounded-b-[50%] border-b border-black/15" />
                <div className="relative overflow-hidden rounded-[0.9rem] border border-[#d8cdb8] bg-[#f6eddf]">
                  {/* Spine + ambient decorations */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-8 -translate-x-1/2 lg:block"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(73,49,32,0.22), rgba(255,250,240,0.62) 45%, rgba(73,49,32,0.24))'
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(circle at 7% 18%, rgba(208,96,112,0.12), transparent 14rem), radial-gradient(circle at 92% 82%, rgba(87,103,119,0.14), transparent 16rem)'
                    }}
                  />

                  {/* Base: destination spread (always shows the current/new page) */}
                  <div className="grid lg:grid-cols-2">
                    <BookLeftPage page={page} language={language} c={c} />
                    <BookRightPage
                      page={page}
                      language={language}
                      c={c}
                      selected={prevPage ? null : selected}
                      onChoose={choose}
                      interactive={!prevPage}
                    />
                  </div>

                  {/* 3D flip overlay — forward: right half flips left */}
                  {prevPage && flipDir === 'forward' && (
                    <div
                      style={{
                        position: 'absolute', top: 0, bottom: 0,
                        left: '50%', right: 0,
                        perspective: '2400px',
                        zIndex: 30,
                      }}
                    >
                      <div
                        style={{
                          position: 'relative', width: '100%', height: '100%',
                          transformStyle: 'preserve-3d',
                          transformOrigin: 'left center',
                          animation: 'book-flip-forward 0.65s cubic-bezier(0.645, 0.045, 0.355, 1.000) both',
                        }}
                      >
                        {/* Front: old right page (vocab side) */}
                        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', overflow: 'hidden' }}>
                          <BookRightPage page={prevPage} language={language} c={c} selected={null} onChoose={() => {}} interactive={false} roundedRight={false} />
                          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to left, rgba(0,0,0,0.18), transparent 60%)', animation: 'flip-shadow 0.65s both' }} />
                        </div>
                        {/* Back: new left page (text side) — shown after flip completes */}
                        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', overflow: 'hidden' }}>
                          <BookLeftPage page={page} language={language} c={c} roundedLeft={false} />
                          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to right, rgba(0,0,0,0.18), transparent 60%)', animation: 'flip-shadow 0.65s both' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3D flip overlay — backward: left half flips right */}
                  {prevPage && flipDir === 'backward' && (
                    <div
                      style={{
                        position: 'absolute', top: 0, bottom: 0,
                        left: 0, right: '50%',
                        perspective: '2400px',
                        zIndex: 30,
                      }}
                    >
                      <div
                        style={{
                          position: 'relative', width: '100%', height: '100%',
                          transformStyle: 'preserve-3d',
                          transformOrigin: 'right center',
                          animation: 'book-flip-backward 0.65s cubic-bezier(0.645, 0.045, 0.355, 1.000) both',
                        }}
                      >
                        {/* Front: old left page (text side) */}
                        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', overflow: 'hidden' }}>
                          <BookLeftPage page={prevPage} language={language} c={c} roundedLeft={false} />
                          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to right, rgba(0,0,0,0.18), transparent 60%)', animation: 'flip-shadow 0.65s both' }} />
                        </div>
                        {/* Back: new right page (vocab side) */}
                        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', overflow: 'hidden' }}>
                          <BookRightPage page={page} language={language} c={c} selected={null} onChoose={() => {}} interactive={false} roundedRight={false} />
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
