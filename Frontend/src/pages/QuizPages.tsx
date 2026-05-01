import React, { useMemo, useState } from 'react';
import {
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Keyboard,
  Languages,
  RefreshCcw,
  Sparkles,
  Target,
  XCircle
} from 'lucide-react';
import { Button, Eyebrow, PageHeader, PageShell } from '../components/ui';
import { AppLanguage } from '../data/appPreferences';
import { kanaInventoryByScript } from '../features/kana/data/kanaInventory';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { recordCorrect, recordWrong } from '../hooks/useFeedback';
import { markPracticedToday } from '../features/streak/tomoshibi';

interface QuizPageProps {
  language: AppLanguage;
}

interface KanaQuizPageProps extends QuizPageProps {
  activeScript: KanaScript;
}

type QuizKind = 'kana' | 'kanji' | 'japanese';

interface QuizQuestion {
  id: string;
  skill: string;
  prompt: string;
  detail?: string;
  display?: string;
  answer: string;
  acceptedAnswers?: string[];
  options?: string[];
  explanation?: string;
}

const copy = {
  tr: {
    start: 'Quiz baslat',
    restart: 'Yeniden baslat',
    check: 'Kontrol et',
    next: 'Siradaki',
    answer: 'Cevap yaz',
    complete: 'Quiz tamamlandi',
    score: 'Skor',
    correct: 'Dogru',
    wrong: 'Yanlis',
    level: 'Seviye',
    focus: 'Odak',
    questions: 'Soru',
    accuracy: 'Isabet',
    empty: 'Bu quiz icin soru bulunamadi.',
    resultStrong: 'Guculu baslangic. Hizli tekrar moduna gecebilirsin.',
    resultMid: 'Temel iyi, ama yanlis gelen maddeleri tekrar etmen iyi olur.',
    resultLow: 'Once kisa calisma turu yap, sonra quiz tekrar daha verimli olur.',
    kana: {
      eyebrow: 'Quiz',
      title: 'Kana Quiz',
      description: 'Hiragana veya katakana okuma, secme ve yazma sorulariyla seviyeni olc.',
      level: 'Kana temeli',
      focus: 'Karakter tanima'
    },
    kanji: {
      eyebrow: 'Quiz',
      title: 'Kanji Quiz',
      description: 'Temel kanjileri anlam, okuma ve kullanim ipuclarindan hizli kontrol et.',
      level: 'N5 baslangic',
      focus: 'Anlam + okuma'
    },
    japanese: {
      eyebrow: 'Quiz',
      title: 'Japanese Quiz',
      description: 'Baslangic kelime, ifade ve cumle anlama sorulariyla genel durumunu olc.',
      level: 'Beginner',
      focus: 'Kelime + cumle'
    }
  },
  en: {
    start: 'Start quiz',
    restart: 'Restart',
    check: 'Check',
    next: 'Next',
    answer: 'Type answer',
    complete: 'Quiz complete',
    score: 'Score',
    correct: 'Correct',
    wrong: 'Wrong',
    level: 'Level',
    focus: 'Focus',
    questions: 'Questions',
    accuracy: 'Accuracy',
    empty: 'No questions found for this quiz.',
    resultStrong: 'Strong start. You can move into a quick review round.',
    resultMid: 'The basics are there, but review the missed items before moving on.',
    resultLow: 'Do a short study round first, then retake the quiz.',
    kana: {
      eyebrow: 'Quiz',
      title: 'Kana Quiz',
      description: 'Measure hiragana or katakana recognition with reading, choice, and typing questions.',
      level: 'Kana basics',
      focus: 'Character recognition'
    },
    kanji: {
      eyebrow: 'Quiz',
      title: 'Kanji Quiz',
      description: 'Check core kanji from meaning, reading, and usage clues.',
      level: 'N5 starter',
      focus: 'Meaning + reading'
    },
    japanese: {
      eyebrow: 'Quiz',
      title: 'Japanese Quiz',
      description: 'Check beginner vocabulary, expressions, and sentence understanding.',
      level: 'Beginner',
      focus: 'Words + sentences'
    }
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

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '');

const isCorrectAnswer = (value: string, question: QuizQuestion) => {
  const accepted = [question.answer, ...(question.acceptedAnswers ?? [])];
  return accepted.some((answer) => normalize(answer) === normalize(value));
};

const resultText = (language: AppLanguage, accuracy: number) => {
  const c = copy[language];
  if (accuracy >= 85) return c.resultStrong;
  if (accuracy >= 60) return c.resultMid;
  return c.resultLow;
};

const buildKanaQuestions = (activeScript: KanaScript, language: AppLanguage): QuizQuestion[] => {
  const items = kanaInventoryByScript[activeScript].filter((item) => item.type === 'base').slice(0, 46);
  const pool = shuffle(items).slice(0, 18);
  const scriptLabel = activeScript === 'hiragana' ? 'Hiragana' : 'Katakana';

  return pool.map((item, index) => {
    const options = shuffle([
      item.romaji[0],
      ...shuffle(items.filter((option) => option.id !== item.id)).slice(0, 3).map((option) => option.romaji[0])
    ]);

    if (index % 3 === 0) {
      return {
        id: `kana-read-${item.id}`,
        skill: scriptLabel,
        prompt: language === 'tr' ? 'Bu karakter nasil okunur?' : 'How is this character read?',
        display: item.char,
        answer: item.romaji[0],
        options,
        explanation: `${item.char} = ${item.romaji[0]}`
      };
    }

    if (index % 3 === 1) {
      const charOptions = shuffle([
        item.char,
        ...shuffle(items.filter((option) => option.id !== item.id)).slice(0, 3).map((option) => option.char)
      ]);
      return {
        id: `kana-pick-${item.id}`,
        skill: scriptLabel,
        prompt: language === 'tr' ? `${item.romaji[0]} okunan karakter hangisi?` : `Which character reads ${item.romaji[0]}?`,
        answer: item.char,
        options: charOptions,
        explanation: `${item.romaji[0]} = ${item.char}`
      };
    }

    return {
      id: `kana-type-${item.id}`,
      skill: scriptLabel,
      prompt: language === 'tr' ? 'Romaji okunuşunu yaz.' : 'Type the romaji reading.',
      display: item.char,
      answer: item.romaji[0],
      explanation: `${item.char} = ${item.romaji[0]}`
    };
  });
};

const kanjiPool = [
  { char: '日', reading: 'にち', tr: 'gun', en: 'day' },
  { char: '月', reading: 'げつ', tr: 'ay', en: 'moon / month' },
  { char: '火', reading: 'か', tr: 'ates', en: 'fire' },
  { char: '水', reading: 'すい', tr: 'su', en: 'water' },
  { char: '木', reading: 'もく', tr: 'agac', en: 'tree / wood' },
  { char: '金', reading: 'きん', tr: 'altin / para', en: 'gold / money' },
  { char: '土', reading: 'ど', tr: 'toprak', en: 'earth / soil' },
  { char: '人', reading: 'じん', tr: 'insan', en: 'person' },
  { char: '大', reading: 'だい', tr: 'buyuk', en: 'big' },
  { char: '小', reading: 'しょう', tr: 'kucuk', en: 'small' },
  { char: '中', reading: 'ちゅう', tr: 'orta / ic', en: 'middle / inside' },
  { char: '上', reading: 'じょう', tr: 'ust / yukari', en: 'up / above' },
  { char: '下', reading: 'か', tr: 'alt / asagi', en: 'down / below' },
  { char: '山', reading: 'やま', tr: 'dag', en: 'mountain' },
  { char: '川', reading: 'かわ', tr: 'nehir', en: 'river' },
  { char: '学', reading: 'がく', tr: 'ogrenmek / okul', en: 'study / learning' },
  { char: '校', reading: 'こう', tr: 'okul', en: 'school' },
  { char: '生', reading: 'せい', tr: 'yasam', en: 'life' }
];

const buildKanjiQuestions = (language: AppLanguage): QuizQuestion[] => {
  const pool = shuffle(kanjiPool).slice(0, 15);
  return pool.map((item, index) => {
    const meaning = language === 'tr' ? item.tr : item.en;
    const meaningOptions = shuffle([
      meaning,
      ...shuffle(kanjiPool.filter((option) => option.char !== item.char))
        .slice(0, 3)
        .map((option) => (language === 'tr' ? option.tr : option.en))
    ]);
    const charOptions = shuffle([
      item.char,
      ...shuffle(kanjiPool.filter((option) => option.char !== item.char)).slice(0, 3).map((option) => option.char)
    ]);

    if (index % 3 === 0) {
      return {
        id: `kanji-meaning-${item.char}`,
        skill: language === 'tr' ? 'Anlam' : 'Meaning',
        prompt: language === 'tr' ? 'Bu kanjinin temel anlami nedir?' : 'What is the core meaning of this kanji?',
        display: item.char,
        answer: meaning,
        options: meaningOptions,
        explanation: `${item.char} = ${meaning}`
      };
    }

    if (index % 3 === 1) {
      return {
        id: `kanji-char-${item.char}`,
        skill: language === 'tr' ? 'Hatirlama' : 'Recall',
        prompt: language === 'tr' ? `"${meaning}" anlamina gelen kanji hangisi?` : `Which kanji means "${meaning}"?`,
        answer: item.char,
        options: charOptions,
        explanation: `${meaning} = ${item.char}`
      };
    }

    return {
      id: `kanji-reading-${item.char}`,
      skill: language === 'tr' ? 'Okuma' : 'Reading',
      prompt: language === 'tr' ? 'Bu kanjinin okunuşunu yaz.' : 'Type this kanji reading.',
      display: item.char,
      answer: item.reading,
      explanation: `${item.char} = ${item.reading}`
    };
  });
};

const japaneseQuestions = (language: AppLanguage): QuizQuestion[] => {
  const tr = language === 'tr';
  return [
    {
      id: 'jp-ohayou',
      skill: tr ? 'Ifade' : 'Expression',
      prompt: tr ? 'Sabah selami hangisi?' : 'Which one is a morning greeting?',
      answer: 'おはようございます',
      options: ['おはようございます', 'こんばんは', 'さようなら', 'ありがとう'],
      explanation: tr ? 'おはようございます = gunaydin' : 'おはようございます = good morning'
    },
    {
      id: 'jp-arigatou',
      skill: tr ? 'Anlam' : 'Meaning',
      prompt: tr ? 'ありがとう ne demek?' : 'What does ありがとう mean?',
      answer: tr ? 'tesekkurler' : 'thank you',
      acceptedAnswers: tr ? ['tesekkur ederim'] : ['thanks'],
      options: tr ? ['tesekkurler', 'merhaba', 'evet', 'hayir'] : ['thank you', 'hello', 'yes', 'no']
    },
    {
      id: 'jp-watashi',
      skill: tr ? 'Kelime' : 'Word',
      prompt: tr ? 'わたし kelimesinin anlami nedir?' : 'What does わたし mean?',
      answer: tr ? 'ben' : 'I / me',
      acceptedAnswers: tr ? ['ben'] : ['i', 'me'],
      options: tr ? ['ben', 'sen', 'okul', 'su'] : ['I / me', 'you', 'school', 'water']
    },
    {
      id: 'jp-gakkou',
      skill: tr ? 'Kelime' : 'Word',
      prompt: tr ? '学校 hangi anlama gelir?' : 'What does 学校 mean?',
      display: '学校',
      answer: tr ? 'okul' : 'school',
      options: tr ? ['okul', 'ev', 'kitap', 'tren'] : ['school', 'home', 'book', 'train']
    },
    {
      id: 'jp-desu',
      skill: 'Grammar',
      prompt: tr ? '「AはBです」 kalibinda です ne is yapar?' : 'In AはBです, what does です do?',
      answer: tr ? 'kibar bitis' : 'polite ending',
      options: tr ? ['kibar bitis', 'gecmis zaman', 'olumsuzluk', 'soru eki'] : ['polite ending', 'past tense', 'negative form', 'question marker']
    },
    {
      id: 'jp-ka',
      skill: 'Grammar',
      prompt: tr ? 'Cumle sonunda か ne yapar?' : 'What does か do at the end of a sentence?',
      answer: tr ? 'soru yapar' : 'makes a question',
      options: tr ? ['soru yapar', 'cogul yapar', 'gecmis yapar', 'yer bildirir'] : ['makes a question', 'makes plural', 'marks past', 'marks location']
    },
    {
      id: 'jp-kore',
      skill: tr ? 'Kelime' : 'Word',
      prompt: tr ? 'これ ne demek?' : 'What does これ mean?',
      answer: tr ? 'bu' : 'this',
      options: tr ? ['bu', 'su', 'o', 'nerede'] : ['this', 'that near you', 'that over there', 'where']
    },
    {
      id: 'jp-nihon',
      skill: tr ? 'Kelime' : 'Word',
      prompt: tr ? '日本 kelimesinin okunuşunu yaz.' : 'Type the reading of 日本.',
      display: '日本',
      answer: 'にほん',
      acceptedAnswers: ['nihon']
    },
    {
      id: 'jp-sentence-school',
      skill: tr ? 'Cumle' : 'Sentence',
      prompt: tr ? '「わたしは学生です。」 cumlesi ne demek?' : 'What does わたしは学生です。 mean?',
      display: 'わたしは学生です。',
      answer: tr ? 'ben ogrenciyim' : 'I am a student',
      acceptedAnswers: tr ? ['ogrenciyim', 'ben bir ogrenciyim'] : ['im a student', "i'm a student"],
      options: tr ? ['ben ogrenciyim', 'ben ogretmenim', 'okula gidiyorum', 'bu bir kitap'] : ['I am a student', 'I am a teacher', 'I go to school', 'This is a book']
    },
    {
      id: 'jp-sentence-book',
      skill: tr ? 'Cumle' : 'Sentence',
      prompt: tr ? '「これは本です。」 cumlesi ne demek?' : 'What does これは本です。 mean?',
      display: 'これは本です。',
      answer: tr ? 'bu bir kitap' : 'this is a book',
      acceptedAnswers: tr ? ['bu kitap'] : ['this is book'],
      options: tr ? ['bu bir kitap', 'bu su', 'o okul', 'ben ogrenciyim'] : ['This is a book', 'This is water', 'That is school', 'I am a student']
    },
    {
      id: 'jp-mizu',
      skill: tr ? 'Kelime' : 'Word',
      prompt: tr ? '水 ne demek?' : 'What does 水 mean?',
      display: '水',
      answer: tr ? 'su' : 'water',
      options: tr ? ['su', 'ates', 'dag', 'ay'] : ['water', 'fire', 'mountain', 'moon']
    },
    {
      id: 'jp-sumimasen',
      skill: tr ? 'Ifade' : 'Expression',
      prompt: tr ? 'Birinden dikkat isterken hangi ifade uygundur?' : 'Which expression is used to get someone attention politely?',
      answer: 'すみません',
      options: ['すみません', 'おやすみなさい', 'いただきます', 'いってきます'],
      explanation: tr ? 'すみません = pardon / kusura bakmayin' : 'すみません = excuse me / sorry'
    }
  ];
};

const MiniStat: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
  <div className="rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface)] px-3 py-2 shadow-[var(--kt-shadow-sm)]">
    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--kt-ink-subtle)]">
      <span className="text-[var(--kt-brand)]">{icon}</span>
      {label}
    </div>
    <div className="mt-1 text-lg font-black text-[var(--kt-ink-strong)]">{value}</div>
  </div>
);

const QuizRunner: React.FC<{
  language: AppLanguage;
  kind: QuizKind;
  questions: QuizQuestion[];
}> = ({ language, kind, questions }) => {
  const c = copy[language];
  const pageCopy = c[kind];
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState<null | boolean>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [missed, setMissed] = useState<QuizQuestion[]>([]);

  const current = questions[index] ?? null;
  const complete = started && index >= questions.length;
  const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  const restart = () => {
    setStarted(true);
    setIndex(0);
    setSelected(null);
    setInput('');
    setChecked(null);
    setCorrectCount(0);
    setWrongCount(0);
    setMissed([]);
  };

  const submit = (answer: string) => {
    if (!current || checked !== null) return;
    const correct = isCorrectAnswer(answer, current);
    setSelected(answer);
    setChecked(correct);
    if (correct) {
      setCorrectCount((value) => value + 1);
      recordCorrect();
      markPracticedToday();
    } else {
      setWrongCount((value) => value + 1);
      setMissed((items) => [...items, current]);
      recordWrong();
    }
  };

  const next = () => {
    setIndex((value) => value + 1);
    setSelected(null);
    setInput('');
    setChecked(null);
  };

  return (
    <PageShell width="wide" className="pb-14">
      <PageHeader
        eyebrow={<Eyebrow>{pageCopy.eyebrow}</Eyebrow>}
        title={pageCopy.title}
        description={pageCopy.description}
        actions={
          <div className="grid grid-cols-3 gap-2">
            <MiniStat icon={<Target size={14} />} label={c.questions} value={questions.length} />
            <MiniStat icon={<Sparkles size={14} />} label={c.level} value={pageCopy.level} />
            <MiniStat icon={<BookOpen size={14} />} label={c.focus} value={pageCopy.focus} />
          </div>
        }
      />

      <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_19rem]">
        <div className="rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5 shadow-[var(--kt-shadow-sm)]">
          {questions.length === 0 ? (
            <div className="py-20 text-center text-sm text-[var(--kt-ink-muted)]">{c.empty}</div>
          ) : !started ? (
            <div className="flex min-h-[24rem] flex-col items-center justify-center text-center">
              <Target size={42} className="text-[var(--kt-brand)]" />
              <h2 className="mt-4 text-2xl font-black text-[var(--kt-ink-strong)]">{pageCopy.title}</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-[var(--kt-ink-muted)]">{pageCopy.description}</p>
              <Button as="button" type="button" onClick={restart} className="mt-5" iconStart={<CheckCircle2 size={16} />}>
                {c.start}
              </Button>
            </div>
          ) : complete ? (
            <div className="flex min-h-[24rem] flex-col items-center justify-center text-center">
              <BadgeCheck size={44} className="text-[var(--kt-brand)]" />
              <h2 className="mt-4 text-2xl font-black text-[var(--kt-ink-strong)]">{c.complete}</h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--kt-ink-muted)]">{resultText(language, accuracy)}</p>
              <div className="mt-5 grid w-full max-w-xl grid-cols-3 gap-3">
                <ResultPill label={c.correct} value={correctCount} tone="success" />
                <ResultPill label={c.wrong} value={wrongCount} tone="danger" />
                <ResultPill label={c.accuracy} value={`${accuracy}%`} tone="brand" />
              </div>
              <Button as="button" type="button" onClick={restart} className="mt-5" iconStart={<RefreshCcw size={16} />}>
                {c.restart}
              </Button>
            </div>
          ) : current ? (
            <div className="min-h-[24rem]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
                  {index + 1}/{questions.length} · {current.skill}
                </div>
                <div className="rounded-full bg-[var(--kt-surface-muted)] px-3 py-1 text-sm font-bold text-[var(--kt-ink-muted)]">
                  {c.score}: {correctCount}
                </div>
              </div>

              <div className="mt-5 rounded-lg bg-[var(--kt-surface)] p-5 text-center">
                {current.display && (
                  <div className="font-jp text-7xl font-black leading-tight text-[var(--kt-ink-strong)]">{current.display}</div>
                )}
                <h2 className="mt-4 text-xl font-black text-[var(--kt-ink-strong)]">{current.prompt}</h2>
                {current.detail && <p className="mt-2 text-sm text-[var(--kt-ink-muted)]">{current.detail}</p>}
              </div>

              {current.options ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {current.options.map((option) => {
                    const isPicked = selected === option;
                    const isAnswer = isCorrectAnswer(option, current);
                    const tone =
                      checked === null
                        ? 'border-[var(--kt-border)] bg-[var(--kt-surface)]'
                        : isAnswer
                          ? 'border-emerald-400 bg-emerald-500/10'
                          : isPicked
                            ? 'border-rose-400 bg-rose-500/10'
                            : 'border-[var(--kt-border)] bg-[var(--kt-surface)] opacity-70';

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={checked !== null}
                        onClick={() => submit(option)}
                        className={`min-h-16 rounded-lg border px-4 py-3 text-left text-lg font-black text-[var(--kt-ink-strong)] transition hover:border-[var(--kt-brand)] ${tone}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && input.trim()) submit(input);
                    }}
                    disabled={checked !== null}
                    placeholder={c.answer}
                    className="h-12 flex-1 rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 text-base font-semibold text-[var(--kt-ink)] outline-none focus:border-[var(--kt-brand)]"
                  />
                  <Button as="button" type="button" onClick={() => submit(input)} disabled={!input.trim() || checked !== null} iconStart={<Keyboard size={16} />}>
                    {c.check}
                  </Button>
                </div>
              )}

              {checked !== null && (
                <div className="mt-5 rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface)] p-4">
                  <div className={`flex items-center gap-2 text-sm font-black ${checked ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {checked ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    {checked ? c.correct : c.wrong}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--kt-ink-muted)]">
                    {current.explanation ?? `${c.answer}: ${current.answer}`}
                  </p>
                  <Button as="button" type="button" onClick={next} className="mt-4" iconStart={<RefreshCcw size={16} />}>
                    {c.next}
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-4 shadow-[var(--kt-shadow-sm)]">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">{c.score}</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <MiniStat icon={<CheckCircle2 size={14} />} label={c.correct} value={correctCount} />
              <MiniStat icon={<XCircle size={14} />} label={c.wrong} value={wrongCount} />
            </div>
          </div>

          <div className="rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-4 shadow-[var(--kt-shadow-sm)]">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">{c.focus}</h2>
            <div className="mt-3 space-y-2">
              {(missed.length > 0 ? missed : questions.slice(0, 5)).slice(0, 6).map((question) => (
                <div key={question.id} className="rounded-lg bg-[var(--kt-surface)] px-3 py-2">
                  <div className="text-sm font-black text-[var(--kt-ink-strong)]">{question.display ?? question.answer}</div>
                  <div className="mt-0.5 text-xs text-[var(--kt-ink-muted)]">{question.skill}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </PageShell>
  );
};

const ResultPill: React.FC<{ label: string; value: React.ReactNode; tone: 'success' | 'danger' | 'brand' }> = ({
  label,
  value,
  tone
}) => {
  const toneClass =
    tone === 'success' ? 'text-emerald-500' : tone === 'danger' ? 'text-rose-500' : 'text-[var(--kt-brand)]';
  return (
    <div className="rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface)] p-3">
      <div className="text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">{label}</div>
      <div className={`mt-1 text-2xl font-black ${toneClass}`}>{value}</div>
    </div>
  );
};

export const QuizKanaPage: React.FC<KanaQuizPageProps> = ({ language, activeScript }) => {
  const questions = useMemo(() => buildKanaQuestions(activeScript, language), [activeScript, language]);
  return <QuizRunner language={language} kind="kana" questions={questions} />;
};

export const QuizKanjiPage: React.FC<QuizPageProps> = ({ language }) => {
  const questions = useMemo(() => buildKanjiQuestions(language), [language]);
  return <QuizRunner language={language} kind="kanji" questions={questions} />;
};

export const QuizJapanesePage: React.FC<QuizPageProps> = ({ language }) => {
  const questions = useMemo(() => shuffle(japaneseQuestions(language)), [language]);
  return <QuizRunner language={language} kind="japanese" questions={questions} />;
};
