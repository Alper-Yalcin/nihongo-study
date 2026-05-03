import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
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
import { PageShell } from '../../../components/ui';
import { AppLanguage } from '../../../data/appPreferences';
import { recordCorrect, recordWrong } from '../../../hooks/useFeedback';
import { markPracticedToday } from '../../../features/streak/tomoshibi';

export interface PracticeKanjiPageProps {
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

export interface KanjiExample {
  id: string;
  surface: string;
  reading: string;
  meaning: string;
}

export interface KanjiPracticeItem {
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

export const shuffle = <T,>(items: T[]) => {
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

export const buildCuratedKanjiItems = (language: AppLanguage): KanjiPracticeItem[] =>
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

export const readKanjiProgress = (): Record<string, 'known' | 'review'> => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem('kototsuna.kanji.practice-progress.v1') ?? '{}');
  } catch {
    return {};
  }
};

export const writeKanjiProgress = (progress: Record<string, 'known' | 'review'>) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('kototsuna.kanji.practice-progress.v1', JSON.stringify(progress));
};

const KanjiPracticeThemeStyles = () => (
  <style>{`
    .kt-kanji-stage {
      --kanji-panel: rgba(255, 252, 249, 0.88);
      --kanji-panel-strong: rgba(255, 255, 255, 0.94);
      --kanji-panel-soft: rgba(255, 245, 239, 0.78);
      --kanji-border: rgba(208, 96, 112, 0.22);
      --kanji-border-strong: rgba(160, 65, 87, 0.32);
      --kanji-ink: #2b2422;
      --kanji-ink-strong: #181514;
      --kanji-ink-muted: rgba(65, 57, 61, 0.72);
      --kanji-ink-soft: rgba(111, 99, 104, 0.72);
      --kanji-paper: #fff8eb;
      --kanji-paper-muted: #f4eadf;
      --kanji-paper-line: #e7d2c1;
      --kanji-accent: #d85f79;
      --kanji-accent-strong: #a04157;
      --kanji-accent-soft: rgba(216, 95, 121, 0.12);
      --kanji-success: #8d5965;
      --kanji-success-soft: rgba(168, 97, 111, 0.14);
      --kanji-danger: #c24f69;
      --kanji-danger-soft: rgba(216, 95, 121, 0.13);
      --kanji-track: rgba(208, 96, 112, 0.16);
      --kanji-ghost: rgba(255,255,255,0.68);
      --kanji-ghost-hover: rgba(255,255,255,0.9);
      --kanji-ghost-border: rgba(160, 65, 87, 0.16);
      --kanji-shadow: 0 24px 70px rgba(120, 72, 82, 0.16), inset 0 1px 0 rgba(255,255,255,0.82);
      --kanji-page-shadow: 0 28px 80px rgba(120, 72, 82, 0.16);
      --kanji-console-bg:
        radial-gradient(circle at 12% 8%, rgba(216,95,121,0.12), transparent 15rem),
        radial-gradient(circle at 90% 85%, rgba(193,147,105,0.12), transparent 18rem),
        linear-gradient(135deg, rgba(255,252,249,0.94), rgba(255,241,235,0.9));
      --kanji-hero-bg:
        radial-gradient(circle at 10% 8%, rgba(216,95,121,0.13), transparent 18rem),
        radial-gradient(circle at 92% 20%, rgba(216,138,90,0.10), transparent 16rem),
        linear-gradient(135deg, rgba(255,250,247,0.96), rgba(255,239,232,0.88));
    }

    .theme-dark .kt-kanji-stage {
      --kanji-panel: rgba(37, 28, 36, 0.9);
      --kanji-panel-strong: rgba(46, 36, 44, 0.94);
      --kanji-panel-soft: rgba(255,255,255,0.06);
      --kanji-border: rgba(245, 163, 178, 0.24);
      --kanji-border-strong: rgba(245, 163, 178, 0.34);
      --kanji-ink: rgba(255,255,255,0.88);
      --kanji-ink-strong: #ffffff;
      --kanji-ink-muted: rgba(255,255,255,0.68);
      --kanji-ink-soft: rgba(255,255,255,0.52);
      --kanji-paper: #fff8eb;
      --kanji-paper-muted: #f4eadf;
      --kanji-paper-line: #e5cdbc;
      --kanji-accent: #e88b9c;
      --kanji-accent-strong: #ff9aae;
      --kanji-accent-soft: rgba(240, 138, 161, 0.12);
      --kanji-success: #bdf3d1;
      --kanji-success-soft: rgba(143, 214, 173, 0.12);
      --kanji-danger: #ffb5c3;
      --kanji-danger-soft: rgba(255, 138, 161, 0.12);
      --kanji-track: rgba(255,255,255,0.12);
      --kanji-ghost: rgba(255,255,255,0.08);
      --kanji-ghost-hover: rgba(255,255,255,0.13);
      --kanji-ghost-border: rgba(255,255,255,0.12);
      --kanji-shadow: 0 28px 80px rgba(10, 8, 12, 0.46), inset 0 1px 0 rgba(255,255,255,0.08);
      --kanji-page-shadow: 0 28px 80px rgba(10, 8, 12, 0.46);
      --kanji-console-bg:
        radial-gradient(circle at 12% 8%, rgba(216,95,121,0.18), transparent 15rem),
        radial-gradient(circle at 90% 85%, rgba(193,147,105,0.16), transparent 18rem),
        linear-gradient(135deg, rgba(46,36,44,0.96), rgba(28,23,30,0.94));
      --kanji-hero-bg:
        radial-gradient(circle at 12% 12%, rgba(216,95,121,0.2), transparent 18rem),
        radial-gradient(circle at 92% 20%, rgba(255,184,112,0.14), transparent 16rem),
        linear-gradient(135deg, rgba(45,34,42,0.98), rgba(19,16,23,0.96));
    }
  `}</style>
);

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
      <KanjiPracticeThemeStyles />
      <section className="kt-kanji-stage mt-8 overflow-hidden rounded-[1.25rem] border border-[var(--kanji-border-strong)] bg-[var(--kanji-panel)] shadow-[var(--kanji-shadow)]">
        <div className="grid min-h-[22rem] lg:grid-cols-[1fr_0.95fr]" style={{ background: 'var(--kanji-hero-bg)' }}>
          <div className="flex flex-col justify-between border-b border-[var(--kanji-border)] p-8 lg:border-b-0 lg:border-r lg:p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--kanji-border-strong)] bg-[var(--kanji-accent-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--kanji-accent-strong)]">
                {iconByMode[mode]}
                {pageCopy.eyebrow}
              </div>
              <h1 className="mt-7 max-w-xl text-5xl font-black leading-none text-[var(--kanji-ink-strong)] lg:text-6xl">
                {pageCopy.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-[var(--kanji-ink-muted)]">
                {pageCopy.description}
              </p>
            </div>
            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              <KanjiStat icon={iconByMode[mode]} label={c.pool} value={items.length} />
              <KanjiStat icon={<BadgeCheck size={16} />} label={c.knownStat} value={knownCount} />
              <KanjiStat icon={<RefreshCcw size={16} />} label={c.review} value={reviewCount} />
            </div>
          </div>
          <div className="relative flex items-center justify-center p-8 lg:p-10">
            <div className="relative w-full max-w-md rounded-[1.1rem] border border-[var(--kanji-paper-line)] bg-[var(--kanji-paper)] p-6 text-[#251a18] shadow-[var(--kanji-page-shadow)]">
              <div className="flex items-start justify-between border-b border-[var(--kanji-paper-line)] pb-4">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--kanji-accent-strong)]">
                    {mode === 'challenge' || mode === 'pop' ? '15' : '10'} {language === 'tr' ? 'kartlik tur' : 'card round'}
                  </div>
                  <div className="mt-2 font-jp text-7xl font-black leading-none">{items[0]?.char ?? '漢'}</div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--kanji-accent)] text-white shadow-[0_12px_24px_rgba(216,95,121,0.28)]">
                  <Crosshair size={24} />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {items.slice(0, 6).map((item) => (
                  <div key={item.char} className="rounded-lg bg-[var(--kanji-paper-muted)] p-3 text-center font-jp text-3xl font-black">
                    {item.char}
                  </div>
                ))}
              </div>
              {round.length === 0 && (
                <button
                  type="button"
                  onClick={startRound}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--kanji-accent)] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_16px_28px_rgba(216,95,121,0.34)] transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  {c.start}
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="kt-kanji-stage mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="overflow-hidden rounded-[1.25rem] border border-[var(--kanji-border-strong)] bg-[var(--kanji-panel-strong)] shadow-[var(--kanji-shadow)]">
          <div className="min-h-[32rem] p-7 lg:p-8" style={{ background: 'var(--kanji-console-bg)' }}>
            {items.length === 0 ? (
            <div className="py-20 text-center text-sm text-[var(--kanji-ink-muted)]">{c.empty}</div>
          ) : round.length === 0 ? (
            <div className="flex min-h-[24rem] flex-col items-center justify-center text-center">
              <Crosshair size={42} className="text-[var(--kanji-accent-strong)]" />
              <h2 className="mt-4 text-3xl font-black text-[var(--kanji-ink-strong)]">{pageCopy.title}</h2>
              <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-[var(--kanji-ink-muted)]">{pageCopy.description}</p>
              <button
                type="button"
                onClick={startRound}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--kanji-accent)] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_14px_28px_rgba(216,95,121,0.3)] transition hover:-translate-y-0.5 hover:brightness-105"
              >
                {c.start}
                <ArrowRight size={16} />
              </button>
            </div>
          ) : complete ? (
            <div className="flex min-h-[24rem] flex-col items-center justify-center text-center">
              <BadgeCheck size={48} className="text-[var(--kanji-accent-strong)]" />
              <h2 className="mt-4 text-4xl font-black text-[var(--kanji-ink-strong)]">{c.complete}</h2>
              <div className="mt-4 flex justify-center gap-3">
                <ResultPill label={c.correct} value={correctCount} tone="success" />
                <ResultPill label={c.wrong} value={wrongCount} tone="danger" />
                <ResultPill label={c.combo} value={combo} tone="brand" />
              </div>
              <button
                type="button"
                onClick={startRound}
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[var(--kanji-border-strong)] bg-[var(--kanji-ghost)] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[var(--kanji-ink-strong)] transition hover:bg-[var(--kanji-ghost-hover)]"
              >
                <RefreshCcw size={16} />
                {c.restart}
              </button>
            </div>
          ) : current ? (
            <div className="min-h-[24rem]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-[var(--kanji-ink-soft)]">
                  {index + 1}/{round.length}
                </div>
                <div className="rounded-full border border-[var(--kanji-ghost-border)] bg-[var(--kanji-ghost)] px-3 py-1 text-sm font-bold text-[var(--kanji-ink-muted)]">
                  {c.score}: {correctCount} · {c.combo}: {combo}
                </div>
              </div>

              <div className="mt-5 rounded-[1rem] border border-[var(--kanji-paper-line)] bg-[var(--kanji-paper)] p-7 text-center text-[#251a18] shadow-[var(--kanji-page-shadow)]">
                {mode === 'reading' ? (
                  <div className="font-jp text-8xl font-black">{current.char}</div>
                ) : mode === 'listening' ? (
                  <button
                    type="button"
                    onClick={() => speakJapanese(current.readings[0] ?? current.char)}
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--kanji-accent-soft)] text-[var(--kanji-accent-strong)] shadow-[0_16px_34px_rgba(216,95,121,0.24)] transition hover:scale-105"
                  >
                    <Volume2 size={34} />
                  </button>
                ) : showMeaningCue ? (
                  <>
                    <div className="text-sm font-black uppercase tracking-[0.14em] text-[var(--kanji-accent-strong)]">{c.meaning}</div>
                    <div className="mt-2 text-3xl font-black">
                      {current.meanings[0] ?? current.examples[0]?.meaning ?? '-'}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-jp text-7xl font-black">{current.char}</div>
                    <div className="mt-3 text-lg font-bold text-[#6f5a50]">
                      {current.meanings[0] ?? '-'}
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4 grid gap-3 rounded-[1rem] border border-[var(--kanji-ghost-border)] bg-[var(--kanji-panel-soft)] p-4 md:grid-cols-3">
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
                            ? 'border-[var(--kanji-success)] bg-[var(--kanji-success-soft)] text-[var(--kanji-success)]'
                            : showWrong
                              ? 'border-[var(--kanji-danger)] bg-[var(--kanji-danger-soft)] text-[var(--kanji-danger)]'
                              : 'border-[var(--kanji-ghost-border)] bg-[var(--kanji-ghost)] text-[var(--kanji-ink-strong)] hover:bg-[var(--kanji-ghost-hover)]'
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
                    className="w-full rounded-lg border border-[var(--kanji-paper-line)] bg-[var(--kanji-paper)] px-4 py-3 text-center text-2xl font-bold text-[#251a18] outline-none transition focus:border-[var(--kanji-accent)] focus:ring-4 focus:ring-[var(--kanji-accent-soft)]"
                    placeholder={c.answer}
                  />
                  {checked === null && (
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="mt-3 inline-flex items-center justify-center rounded-lg bg-[var(--kanji-accent)] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_14px_28px_rgba(216,95,121,0.3)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      {c.check}
                    </button>
                  )}
                </form>
              )}

              {(checked !== null || revealed) && (
                <div
                  className={`mt-4 rounded-lg border p-4 ${
                    checked
                      ? 'border-[var(--kanji-success)] bg-[var(--kanji-success-soft)]'
                      : 'border-[var(--kanji-danger)] bg-[var(--kanji-danger-soft)]'
                  }`}
                >
                  <div className="text-sm font-black text-[var(--kanji-ink-strong)]">
                    {checked ? c.correct : c.wrong}
                  </div>
                  <div className="mt-2 font-jp text-2xl font-black text-[var(--kanji-ink-strong)]">
                    {current.char} · {current.readings[0] ?? '-'}
                  </div>
                  <button
                    type="button"
                    onClick={next}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[var(--kanji-accent)] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_14px_28px_rgba(216,95,121,0.3)] transition hover:-translate-y-0.5 hover:brightness-105"
                  >
                    {c.next}
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : null}
          </div>
        </div>

        <aside className="rounded-[1.1rem] border border-[var(--kanji-border-strong)] bg-[var(--kanji-panel)] p-5 shadow-[var(--kanji-shadow)]">
          <div className="grid gap-2">
            <KanjiStat icon={<Target size={14} />} label={c.pool} value={items.length} />
            <KanjiStat icon={<BadgeCheck size={14} />} label={c.knownStat} value={knownCount} />
            <KanjiStat icon={<RefreshCcw size={14} />} label={c.review} value={reviewCount} />
            <KanjiStat icon={<Sparkles size={14} />} label={c.usageLabel} value={items.reduce((sum, item) => sum + item.frequency, 0)} />
          </div>
        </aside>
      </section>

      <section className="kt-kanji-stage mt-6 rounded-[1.25rem] border border-[var(--kanji-border-strong)] bg-[var(--kanji-panel)] p-5 shadow-[var(--kanji-shadow)]">
        <h2 className="text-base font-black text-[var(--kanji-ink-strong)]">Kanji Pool</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10">
          {items.slice(0, 40).map((item) => (
            <div key={item.char} className="rounded-lg border border-[var(--kanji-ghost-border)] bg-[var(--kanji-ghost)] p-3 text-center transition hover:-translate-y-0.5 hover:bg-[var(--kanji-ghost-hover)]">
              <div className="font-jp text-3xl font-black text-[var(--kanji-ink-strong)]">{item.char}</div>
              <div className="mt-1 truncate text-[10px] font-bold text-[var(--kanji-ink-muted)]">{item.readings[0] ?? '-'}</div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

const KanjiStat: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({
  icon,
  label,
  value
}) => (
  <div className="rounded-lg border border-[var(--kanji-ghost-border)] bg-[var(--kanji-ghost)] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--kanji-ink-soft)]">
      <span className="text-[var(--kanji-accent-strong)]">{icon}</span>
      {label}
    </div>
    <div className="mt-1 text-lg font-black text-[var(--kanji-ink-strong)]">{value}</div>
  </div>
);

const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kanji-ink-soft)]">{label}</div>
    <div className="mt-1 text-sm font-bold text-[var(--kanji-ink-strong)]">{value}</div>
  </div>
);

const ResultPill: React.FC<{ label: string; value: number; tone: 'success' | 'danger' | 'brand' }> = ({
  label,
  value,
  tone
}) => {
  const toneClass =
    tone === 'success'
      ? 'bg-[var(--kanji-success-soft)] text-[var(--kanji-success)]'
      : tone === 'danger'
        ? 'bg-[var(--kanji-danger-soft)] text-[var(--kanji-danger)]'
        : 'bg-[var(--kanji-accent-soft)] text-[var(--kanji-accent-strong)]';
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
