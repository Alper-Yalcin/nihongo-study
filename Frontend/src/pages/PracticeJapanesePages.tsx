import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
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
