import React, { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  BookOpen,
  Crosshair,
  Ear,
  Gamepad2,
  Layers3,
  PenLine,
  RefreshCcw,
  Shuffle,
  Sparkles,
  Target,
  Volume2
} from 'lucide-react';
import { Button, Eyebrow, PageHeader, PageShell } from '../../../components/ui';
import { AppLanguage } from '../../../data/appPreferences';
import { recordCorrect, recordWrong } from '../../../hooks/useFeedback';
import { markPracticedToday } from '../../../features/streak/tomoshibi';

interface PracticeKanjiPageProps {
  language: AppLanguage;
}

type KanjiMode =
  | 'drawing'
  | 'reading'
  | 'listening'
  | 'writing'
  | 'usage'
  | 'challenge'
  | 'match'
  | 'pop';

interface KanjiExample {
  id: string;
  surface: string;
  reading: string;
  meaning: string;
}

interface KanjiPracticeItem {
  char: string;
  readings: string[];
  meanings: string[];
  examples: KanjiExample[];
  frequency: number;
}

const copy = {
  tr: {
    drawing: {
      eyebrow: 'Kanji Practice',
      title: 'Drawing Practice',
      description: 'Anlam ve ornekten kanjiyi hafizadan uret.'
    },
    reading: {
      eyebrow: 'Kanji Practice',
      title: 'Kanji Reading',
      description: 'Kanjiyi gorup okunuşunu yaz.'
    },
    listening: {
      eyebrow: 'Kanji Practice',
      title: 'Kanji Listening',
      description: 'Okumayi dinle, dogru kanjiyi sec.'
    },
    writing: {
      eyebrow: 'Kanji Practice',
      title: 'Writing Recall',
      description: 'Anlamdan kanjiyi hafizadan geri cagir.'
    },
    usage: {
      eyebrow: 'Kanji Practice',
      title: 'Kanji Usage',
      description: 'Ornek kelime baglaminda dogru kanjiyi sec.'
    },
    challenge: {
      eyebrow: 'Kanji Practice',
      title: 'Kanji Challenge',
      description: 'Okuma, anlam ve baglam sorularini tek turda calis.'
    },
    match: {
      eyebrow: 'Kanji Practice',
      title: 'Kanji Match',
      description: 'Kanji ile anlamini hizli eslestir.'
    },
    pop: {
      eyebrow: 'Kanji Practice',
      title: 'Kanji Pop',
      description: 'Ipucuna gore dogru kanjiyi hizli sec.'
    },
    loading: 'Kanji havuzu yukleniyor...',
    empty: 'Kanji havuzu bulunamadi.',
    start: 'Turu baslat',
    restart: 'Yeniden baslat',
    check: 'Kontrol et',
    next: 'Siradaki',
    reveal: 'Cevabi goster',
    known: 'Bildim',
    again: 'Tekrar et',
    answer: 'Cevap',
    correct: 'Dogru',
    wrong: 'Yanlis',
    complete: 'Tur tamamlandi',
    readingLabel: 'Okunuş',
    meaning: 'Anlam',
    example: 'Ornek',
    usageLabel: 'Kullanim',
    score: 'Skor',
    combo: 'Combo',
    pool: 'Havuz',
    review: 'Review',
    knownStat: 'Bilinen'
  },
  en: {
    drawing: {
      eyebrow: 'Kanji Practice',
      title: 'Drawing Practice',
      description: 'Produce the kanji from meaning and example context.'
    },
    reading: {
      eyebrow: 'Kanji Practice',
      title: 'Kanji Reading',
      description: 'See a kanji and type one of its readings.'
    },
    listening: {
      eyebrow: 'Kanji Practice',
      title: 'Kanji Listening',
      description: 'Hear the reading and choose the correct kanji.'
    },
    writing: {
      eyebrow: 'Kanji Practice',
      title: 'Writing Recall',
      description: 'Recall the kanji from its meaning.'
    },
    usage: {
      eyebrow: 'Kanji Practice',
      title: 'Kanji Usage',
      description: 'Choose the right kanji in word context.'
    },
    challenge: {
      eyebrow: 'Kanji Practice',
      title: 'Kanji Challenge',
      description: 'Practice readings, meanings, and usage in one round.'
    },
    match: {
      eyebrow: 'Kanji Practice',
      title: 'Kanji Match',
      description: 'Match kanji to meanings quickly.'
    },
    pop: {
      eyebrow: 'Kanji Practice',
      title: 'Kanji Pop',
      description: 'Pick the correct kanji from a clue under pressure.'
    },
    loading: 'Loading kanji pool...',
    empty: 'No kanji pool found.',
    start: 'Start round',
    restart: 'Restart',
    check: 'Check',
    next: 'Next',
    reveal: 'Reveal answer',
    known: 'I knew it',
    again: 'Review again',
    answer: 'Answer',
    correct: 'Correct',
    wrong: 'Wrong',
    complete: 'Round complete',
    readingLabel: 'Reading',
    meaning: 'Meaning',
    example: 'Example',
    usageLabel: 'Usage',
    score: 'Score',
    combo: 'Combo',
    pool: 'Pool',
    review: 'Review',
    knownStat: 'Known'
  }
} as const;

const iconByMode: Record<KanjiMode, React.ReactNode> = {
  drawing: <PenLine size={14} />,
  reading: <BookOpen size={14} />,
  listening: <Ear size={14} />,
  writing: <RefreshCcw size={14} />,
  usage: <Layers3 size={14} />,
  challenge: <Target size={14} />,
  match: <Shuffle size={14} />,
  pop: <Gamepad2 size={14} />
};

const shuffle = <T,>(items: T[]) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
};

interface KanjiSeed {
  char: string;
  readings: string[];
  tr: string[];
  en: string[];
  words: Array<{
    surface: string;
    reading: string;
    tr: string;
    en: string;
  }>;
}

const kanjiSeeds: KanjiSeed[] = [
  { char: '日', readings: ['にち', 'ひ'], tr: ['gün', 'güneş'], en: ['day', 'sun'], words: [{ surface: '日本', reading: 'にほん', tr: 'Japonya', en: 'Japan' }, { surface: '日曜日', reading: 'にちようび', tr: 'pazar', en: 'Sunday' }] },
  { char: '月', readings: ['げつ', 'つき'], tr: ['ay'], en: ['moon', 'month'], words: [{ surface: '月曜日', reading: 'げつようび', tr: 'pazartesi', en: 'Monday' }, { surface: '一月', reading: 'いちがつ', tr: 'ocak ayı', en: 'January' }] },
  { char: '火', readings: ['か', 'ひ'], tr: ['ateş'], en: ['fire'], words: [{ surface: '火曜日', reading: 'かようび', tr: 'salı', en: 'Tuesday' }, { surface: '火山', reading: 'かざん', tr: 'yanardağ', en: 'volcano' }] },
  { char: '水', readings: ['すい', 'みず'], tr: ['su'], en: ['water'], words: [{ surface: '水曜日', reading: 'すいようび', tr: 'çarşamba', en: 'Wednesday' }, { surface: '水', reading: 'みず', tr: 'su', en: 'water' }] },
  { char: '木', readings: ['もく', 'き'], tr: ['ağaç'], en: ['tree', 'wood'], words: [{ surface: '木曜日', reading: 'もくようび', tr: 'perşembe', en: 'Thursday' }, { surface: '木', reading: 'き', tr: 'ağaç', en: 'tree' }] },
  { char: '金', readings: ['きん', 'かね'], tr: ['altın', 'para'], en: ['gold', 'money'], words: [{ surface: '金曜日', reading: 'きんようび', tr: 'cuma', en: 'Friday' }, { surface: 'お金', reading: 'おかね', tr: 'para', en: 'money' }] },
  { char: '土', readings: ['ど', 'つち'], tr: ['toprak'], en: ['earth', 'soil'], words: [{ surface: '土曜日', reading: 'どようび', tr: 'cumartesi', en: 'Saturday' }, { surface: '土', reading: 'つち', tr: 'toprak', en: 'soil' }] },
  { char: '人', readings: ['じん', 'ひと'], tr: ['insan', 'kişi'], en: ['person'], words: [{ surface: '日本人', reading: 'にほんじん', tr: 'Japon', en: 'Japanese person' }, { surface: '人', reading: 'ひと', tr: 'insan', en: 'person' }] },
  { char: '子', readings: ['し', 'こ'], tr: ['çocuk'], en: ['child'], words: [{ surface: '子ども', reading: 'こども', tr: 'çocuk', en: 'child' }, { surface: '女子', reading: 'じょし', tr: 'kız öğrenci', en: 'girl student' }] },
  { char: '女', readings: ['じょ', 'おんな'], tr: ['kadın'], en: ['woman'], words: [{ surface: '女の人', reading: 'おんなのひと', tr: 'kadın', en: 'woman' }, { surface: '女子', reading: 'じょし', tr: 'kız öğrenci', en: 'girl student' }] },
  { char: '男', readings: ['だん', 'おとこ'], tr: ['erkek'], en: ['man'], words: [{ surface: '男の人', reading: 'おとこのひと', tr: 'erkek', en: 'man' }, { surface: '男子', reading: 'だんし', tr: 'erkek öğrenci', en: 'boy student' }] },
  { char: '大', readings: ['だい', 'おお'], tr: ['büyük'], en: ['big'], words: [{ surface: '大学', reading: 'だいがく', tr: 'üniversite', en: 'university' }, { surface: '大きい', reading: 'おおきい', tr: 'büyük', en: 'big' }] },
  { char: '小', readings: ['しょう', 'ちい'], tr: ['küçük'], en: ['small'], words: [{ surface: '小学校', reading: 'しょうがっこう', tr: 'ilkokul', en: 'elementary school' }, { surface: '小さい', reading: 'ちいさい', tr: 'küçük', en: 'small' }] },
  { char: '中', readings: ['ちゅう', 'なか'], tr: ['orta', 'iç'], en: ['middle', 'inside'], words: [{ surface: '中学校', reading: 'ちゅうがっこう', tr: 'ortaokul', en: 'middle school' }, { surface: '中', reading: 'なか', tr: 'iç', en: 'inside' }] },
  { char: '上', readings: ['じょう', 'うえ'], tr: ['üst', 'yukarı'], en: ['up', 'above'], words: [{ surface: '上手', reading: 'じょうず', tr: 'iyi yapmak', en: 'skillful' }, { surface: '上', reading: 'うえ', tr: 'üst', en: 'above' }] },
  { char: '下', readings: ['か', 'した'], tr: ['alt', 'aşağı'], en: ['down', 'below'], words: [{ surface: '地下鉄', reading: 'ちかてつ', tr: 'metro', en: 'subway' }, { surface: '下', reading: 'した', tr: 'alt', en: 'below' }] },
  { char: '左', readings: ['さ', 'ひだり'], tr: ['sol'], en: ['left'], words: [{ surface: '左', reading: 'ひだり', tr: 'sol', en: 'left' }, { surface: '左手', reading: 'ひだりて', tr: 'sol el', en: 'left hand' }] },
  { char: '右', readings: ['う', 'みぎ'], tr: ['sağ'], en: ['right'], words: [{ surface: '右', reading: 'みぎ', tr: 'sağ', en: 'right' }, { surface: '右手', reading: 'みぎて', tr: 'sağ el', en: 'right hand' }] },
  { char: '山', readings: ['さん', 'やま'], tr: ['dağ'], en: ['mountain'], words: [{ surface: '山', reading: 'やま', tr: 'dağ', en: 'mountain' }, { surface: '富士山', reading: 'ふじさん', tr: 'Fuji Dağı', en: 'Mt. Fuji' }] },
  { char: '川', readings: ['せん', 'かわ'], tr: ['nehir'], en: ['river'], words: [{ surface: '川', reading: 'かわ', tr: 'nehir', en: 'river' }, { surface: '小川', reading: 'おがわ', tr: 'dere', en: 'stream' }] },
  { char: '田', readings: ['でん', 'た'], tr: ['pirinç tarlası', 'tarla'], en: ['rice field', 'field'], words: [{ surface: '田中', reading: 'たなか', tr: 'Tanaka soyadı', en: 'Tanaka surname' }, { surface: '田んぼ', reading: 'たんぼ', tr: 'pirinç tarlası', en: 'rice field' }] },
  { char: '学', readings: ['がく', 'まな'], tr: ['öğrenmek', 'okul'], en: ['study', 'learning'], words: [{ surface: '学校', reading: 'がっこう', tr: 'okul', en: 'school' }, { surface: '学生', reading: 'がくせい', tr: 'öğrenci', en: 'student' }] },
  { char: '校', readings: ['こう'], tr: ['okul'], en: ['school'], words: [{ surface: '学校', reading: 'がっこう', tr: 'okul', en: 'school' }, { surface: '高校', reading: 'こうこう', tr: 'lise', en: 'high school' }] },
  { char: '生', readings: ['せい', 'い'], tr: ['yaşam', 'doğmak'], en: ['life', 'birth'], words: [{ surface: '学生', reading: 'がくせい', tr: 'öğrenci', en: 'student' }, { surface: '先生', reading: 'せんせい', tr: 'öğretmen', en: 'teacher' }] },
  { char: '先', readings: ['せん', 'さき'], tr: ['önce', 'ön'], en: ['previous', 'ahead'], words: [{ surface: '先生', reading: 'せんせい', tr: 'öğretmen', en: 'teacher' }, { surface: '先週', reading: 'せんしゅう', tr: 'geçen hafta', en: 'last week' }] },
  { char: '年', readings: ['ねん', 'とし'], tr: ['yıl'], en: ['year'], words: [{ surface: '今年', reading: 'ことし', tr: 'bu yıl', en: 'this year' }, { surface: '一年', reading: 'いちねん', tr: 'bir yıl', en: 'one year' }] },
  { char: '白', readings: ['はく', 'しろ'], tr: ['beyaz'], en: ['white'], words: [{ surface: '白い', reading: 'しろい', tr: 'beyaz', en: 'white' }, { surface: '白紙', reading: 'はくし', tr: 'boş kağıt', en: 'blank paper' }] },
  { char: '百', readings: ['ひゃく'], tr: ['yüz'], en: ['hundred'], words: [{ surface: '百', reading: 'ひゃく', tr: 'yüz', en: 'hundred' }, { surface: '三百', reading: 'さんびゃく', tr: 'üç yüz', en: 'three hundred' }] },
  { char: '千', readings: ['せん'], tr: ['bin'], en: ['thousand'], words: [{ surface: '千', reading: 'せん', tr: 'bin', en: 'thousand' }, { surface: '三千', reading: 'さんぜん', tr: 'üç bin', en: 'three thousand' }] },
  { char: '万', readings: ['まん'], tr: ['on bin'], en: ['ten thousand'], words: [{ surface: '一万', reading: 'いちまん', tr: 'on bin', en: 'ten thousand' }, { surface: '万年筆', reading: 'まんねんひつ', tr: 'dolma kalem', en: 'fountain pen' }] }
];

const buildCuratedKanjiItems = (language: AppLanguage): KanjiPracticeItem[] =>
  kanjiSeeds.map((seed, index) => ({
    char: seed.char,
    frequency: kanjiSeeds.length - index,
    readings: seed.readings,
    meanings: language === 'tr' ? seed.tr : seed.en,
    examples: seed.words.map((word, wordIndex) => ({
      id: `${seed.char}-${wordIndex}`,
      surface: word.surface,
      reading: word.reading,
      meaning: language === 'tr' ? word.tr : word.en
    }))
  }));

const normalizeAnswer = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '');

const speakJapanese = (text: string) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.86;
  window.speechSynthesis.speak(utterance);
};

const readKanjiProgress = (): Record<string, 'known' | 'review'> => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem('kototsuna.kanji.practice-progress.v1') ?? '{}');
  } catch {
    return {};
  }
};

const writeKanjiProgress = (progress: Record<string, 'known' | 'review'>) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('kototsuna.kanji.practice-progress.v1', JSON.stringify(progress));
};

const PracticeKanjiPage: React.FC<PracticeKanjiPageProps & { mode: KanjiMode }> = ({ language, mode }) => {
  const c = copy[language];
  const pageCopy = c[mode];
  const items = useMemo(() => buildCuratedKanjiItems(language), [language]);
  const [progress, setProgress] = useState<Record<string, 'known' | 'review'>>(() => readKanjiProgress());
  const [round, setRound] = useState<KanjiPracticeItem[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState<null | boolean>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const current = round[index] ?? null;
  const complete = round.length > 0 && index >= round.length;
  const knownCount = Object.values(progress).filter((value) => value === 'known').length;
  const reviewCount = Object.values(progress).filter((value) => value === 'review').length;

  useEffect(() => {
    writeKanjiProgress(progress);
  }, [progress]);

  const startRound = () => {
    const reviewChars = new Set(Object.entries(progress).filter(([, status]) => status === 'review').map(([char]) => char));
    const prioritized = [
      ...items.filter((item) => reviewChars.has(item.char)),
      ...shuffle(items.filter((item) => !reviewChars.has(item.char)))
    ];
    setRound(shuffle(prioritized).slice(0, mode === 'challenge' || mode === 'pop' ? 15 : 10));
    setIndex(0);
    setInput('');
    setSelected(null);
    setChecked(null);
    setCorrectCount(0);
    setWrongCount(0);
    setCombo(0);
    setRevealed(false);
  };

  const record = (item: KanjiPracticeItem, correct: boolean) => {
    setProgress((previous) => ({ ...previous, [item.char]: correct ? 'known' : 'review' }));
    if (correct) {
      setCorrectCount((value) => value + 1);
      setCombo((value) => value + 1);
      recordCorrect();
      markPracticedToday();
    } else {
      setWrongCount((value) => value + 1);
      setCombo(0);
      recordWrong();
    }
  };

  const checkTextAnswer = () => {
    if (!current || checked !== null) return;
    const answer = normalizeAnswer(input);
    const correct =
      mode === 'reading'
        ? current.readings.some((reading) => normalizeAnswer(reading) === answer)
        : normalizeAnswer(current.char) === answer;
    setChecked(correct);
    record(current, correct);
  };

  const choose = (choice: KanjiPracticeItem) => {
    if (!current || checked !== null) return;
    const correct = choice.char === current.char;
    setSelected(choice.char);
    setChecked(correct);
    record(current, correct);
  };

  const next = () => {
    setIndex((value) => value + 1);
    setInput('');
    setSelected(null);
    setChecked(null);
    setRevealed(false);
  };

  const choices = useMemo(() => {
    if (!current) return [];
    return shuffle([current, ...shuffle(items.filter((item) => item.char !== current.char)).slice(0, 5)]);
  }, [current, items]);

  const isChoiceMode = mode === 'listening' || mode === 'usage' || mode === 'challenge' || mode === 'match' || mode === 'pop';
  const showMeaningCue = mode === 'drawing' || mode === 'writing' || mode === 'pop';

  return (
    <PageShell width="wide" className="pb-14">
      <PageHeader
        eyebrow={<Eyebrow>{pageCopy.eyebrow}</Eyebrow>}
        title={pageCopy.title}
        description={pageCopy.description}
        actions={
          <div className="grid grid-cols-3 gap-2">
            <MiniStat icon={iconByMode[mode]} label={c.pool} value={items.length} />
            <MiniStat icon={<BadgeCheck size={14} />} label={c.knownStat} value={knownCount} />
            <MiniStat icon={<RefreshCcw size={14} />} label={c.review} value={reviewCount} />
          </div>
        }
      />

      <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_18rem]">
        <div className="rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5 shadow-[var(--kt-shadow-sm)]">
          {items.length === 0 ? (
            <div className="py-20 text-center text-sm text-[var(--kt-ink-muted)]">{c.empty}</div>
          ) : round.length === 0 ? (
            <div className="flex min-h-[24rem] flex-col items-center justify-center text-center">
              <Crosshair size={38} className="text-[var(--kt-brand)]" />
              <h2 className="mt-4 text-xl font-black text-[var(--kt-ink-strong)]">{pageCopy.title}</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-[var(--kt-ink-muted)]">{pageCopy.description}</p>
              <Button as="button" type="button" onClick={startRound} className="mt-5" iconStart={<Target size={16} />}>
                {c.start}
              </Button>
            </div>
          ) : complete ? (
            <div className="flex min-h-[24rem] flex-col items-center justify-center text-center">
              <BadgeCheck size={42} className="text-[var(--kt-brand)]" />
              <h2 className="mt-4 text-2xl font-black text-[var(--kt-ink-strong)]">{c.complete}</h2>
              <div className="mt-4 flex justify-center gap-3">
                <ResultPill label={c.correct} value={correctCount} tone="success" />
                <ResultPill label={c.wrong} value={wrongCount} tone="danger" />
                <ResultPill label={c.combo} value={combo} tone="brand" />
              </div>
              <Button as="button" type="button" onClick={startRound} className="mt-5" iconStart={<RefreshCcw size={16} />}>
                {c.restart}
              </Button>
            </div>
          ) : current ? (
            <div className="min-h-[24rem]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
                  {index + 1}/{round.length}
                </div>
                <div className="rounded-full bg-[var(--kt-surface-muted)] px-3 py-1 text-sm font-bold text-[var(--kt-ink-muted)]">
                  {c.score}: {correctCount} · {c.combo}: {combo}
                </div>
              </div>

              <div className="mt-5 rounded-lg bg-[var(--kt-surface)] p-5 text-center">
                {mode === 'reading' ? (
                  <div className="font-jp text-8xl font-black text-[var(--kt-ink-strong)]">{current.char}</div>
                ) : mode === 'listening' ? (
                  <button
                    type="button"
                    onClick={() => speakJapanese(current.readings[0] ?? current.char)}
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--kt-brand-soft)] text-[var(--kt-brand)]"
                  >
                    <Volume2 size={34} />
                  </button>
                ) : showMeaningCue ? (
                  <>
                    <div className="text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">{c.meaning}</div>
                    <div className="mt-2 text-3xl font-black text-[var(--kt-ink-strong)]">
                      {current.meanings[0] ?? current.examples[0]?.meaning ?? '-'}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-jp text-7xl font-black text-[var(--kt-ink-strong)]">{current.char}</div>
                    <div className="mt-3 text-lg font-bold text-[var(--kt-ink-muted)]">
                      {current.meanings[0] ?? '-'}
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4 grid gap-3 rounded-lg border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-4 md:grid-cols-3">
                <Info label={c.readingLabel} value={current.readings.join(', ') || '-'} />
                <Info label={c.meaning} value={current.meanings.join(', ') || '-'} />
                <Info label={c.example} value={current.examples[0] ? `${current.examples[0].surface} (${current.examples[0].reading})` : '-'} />
              </div>

              {isChoiceMode ? (
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {choices.map((choice) => {
                    const isSelected = selected === choice.char;
                    const showCorrect = checked !== null && choice.char === current.char;
                    const showWrong = isSelected && choice.char !== current.char;
                    return (
                      <button
                        key={choice.char}
                        type="button"
                        disabled={checked !== null}
                        onClick={() => choose(choice)}
                        className={`min-h-20 rounded-lg border font-jp text-4xl font-black transition ${
                          showCorrect
                            ? 'border-[color:var(--kt-accent-success)]/45 bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)]'
                            : showWrong
                              ? 'border-[color:var(--kt-accent-danger)]/45 bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)]'
                              : 'border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] hover:bg-[var(--kt-surface-muted)]'
                        }`}
                      >
                        {choice.char}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <form
                  className="mt-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    checkTextAnswer();
                  }}
                >
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    disabled={checked !== null}
                    className="w-full rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-3 text-center text-2xl text-[var(--kt-ink)] outline-none focus:border-[var(--kt-brand)]"
                    placeholder={c.answer}
                  />
                  {checked === null && (
                    <Button as="button" type="submit" disabled={!input.trim()} className="mt-3">
                      {c.check}
                    </Button>
                  )}
                </form>
              )}

              {(checked !== null || revealed) && (
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
                  <div className="mt-2 font-jp text-2xl font-black text-[var(--kt-ink-strong)]">
                    {current.char} · {current.readings[0] ?? '-'}
                  </div>
                  <Button as="button" type="button" onClick={next} className="mt-3">
                    {c.next}
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <aside className="rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5 shadow-[var(--kt-shadow-sm)]">
          <div className="grid gap-2">
            <MiniStat icon={<Target size={14} />} label={c.pool} value={items.length} />
            <MiniStat icon={<BadgeCheck size={14} />} label={c.knownStat} value={knownCount} />
            <MiniStat icon={<RefreshCcw size={14} />} label={c.review} value={reviewCount} />
            <MiniStat icon={<Sparkles size={14} />} label={c.usageLabel} value={items.reduce((sum, item) => sum + item.frequency, 0)} />
          </div>
        </aside>
      </section>

      <section className="mt-6 rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5 shadow-[var(--kt-shadow-sm)]">
        <h2 className="text-base font-black text-[var(--kt-ink-strong)]">Kanji Pool</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10">
          {items.slice(0, 40).map((item) => (
            <div key={item.char} className="rounded-lg border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-3 text-center">
              <div className="font-jp text-3xl font-black text-[var(--kt-ink-strong)]">{item.char}</div>
              <div className="mt-1 truncate text-[10px] font-bold text-[var(--kt-ink-muted)]">{item.readings[0] ?? '-'}</div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

const MiniStat: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({
  icon,
  label,
  value
}) => (
  <div className="rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface)] px-3 py-2 shadow-[var(--kt-shadow-sm)]">
    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--kt-ink-subtle)]">
      <span className="text-[var(--kt-brand)]">{icon}</span>
      {label}
    </div>
    <div className="mt-1 text-lg font-black text-[var(--kt-ink-strong)]">{value}</div>
  </div>
);

const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">{label}</div>
    <div className="mt-1 text-sm font-bold text-[var(--kt-ink)]">{value}</div>
  </div>
);

const ResultPill: React.FC<{ label: string; value: number; tone: 'success' | 'danger' | 'brand' }> = ({
  label,
  value,
  tone
}) => {
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

export const PracticeKanjiDrawingPage: React.FC<PracticeKanjiPageProps> = (props) => (
  <PracticeKanjiPage {...props} mode="drawing" />
);

export const PracticeKanjiReadingPage: React.FC<PracticeKanjiPageProps> = (props) => (
  <PracticeKanjiPage {...props} mode="reading" />
);

export const PracticeKanjiListeningPage: React.FC<PracticeKanjiPageProps> = (props) => (
  <PracticeKanjiPage {...props} mode="listening" />
);

export const PracticeKanjiWritingRecallPage: React.FC<PracticeKanjiPageProps> = (props) => (
  <PracticeKanjiPage {...props} mode="writing" />
);

export const PracticeKanjiUsagePage: React.FC<PracticeKanjiPageProps> = (props) => (
  <PracticeKanjiPage {...props} mode="usage" />
);

export const PracticeKanjiChallengePage: React.FC<PracticeKanjiPageProps> = (props) => (
  <PracticeKanjiPage {...props} mode="challenge" />
);

export const PracticeKanjiMatchPage: React.FC<PracticeKanjiPageProps> = (props) => (
  <PracticeKanjiPage {...props} mode="match" />
);

export const PracticeKanjiPopPage: React.FC<PracticeKanjiPageProps> = (props) => (
  <PracticeKanjiPage {...props} mode="pop" />
);
