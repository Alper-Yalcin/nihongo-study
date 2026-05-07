import React, { useEffect, useMemo, useState } from 'react';
import { Volume2 } from 'lucide-react';
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

type ModeCopy = { label: string; subtitle: string };

const modeCopy: Record<AppLanguage, Record<KanjiMode, ModeCopy>> = {
  tr: {
    drawing:   { label: 'Drawing',       subtitle: 'Hafizadan çiz'               },
    reading:   { label: 'Reading',       subtitle: 'Okuyuşu yaz'                },
    listening: { label: 'Listening',     subtitle: 'Sesi dinle, kanjiyi seç'     },
    writing:   { label: 'Writing Recall',subtitle: 'Anlamdan kanjiyi geri çağır' },
    usage:     { label: 'Usage',         subtitle: 'Bağlamda doğru kanjiyi seç'  },
    challenge: { label: 'Challenge',     subtitle: 'Karışık sorularla antrenman'  },
    match:     { label: 'Match',         subtitle: 'Kanji ile anlamı eşleştir'   },
    pop:       { label: 'Pop',           subtitle: 'İpucundan hızla kanji seç'   },
  },
  en: {
    drawing:   { label: 'Drawing',       subtitle: 'Draw from memory'             },
    reading:   { label: 'Reading',       subtitle: 'Write the reading'            },
    listening: { label: 'Listening',     subtitle: 'Hear it — find the kanji'     },
    writing:   { label: 'Writing Recall',subtitle: 'Recall the kanji from meaning' },
    usage:     { label: 'Usage',         subtitle: 'Pick the right kanji in context'},
    challenge: { label: 'Challenge',     subtitle: 'Mixed questions, one round'    },
    match:     { label: 'Match',         subtitle: 'Match kanji to meanings'       },
    pop:       { label: 'Pop',           subtitle: 'Pick the kanji from the clue'  },
  },
};

const strings = {
  tr: {
    start: 'Turu başlat', restart: 'Yeniden başlat', check: 'Kontrol et',
    next: 'Sonraki', answer: 'Cevap', correct: 'Doğru', wrong: 'Yanlış',
    complete: 'Tur tamamlandı', meaning: 'Anlam',
    pool: 'Havuz', known: 'Bilinen', review: 'Tekrar',
  },
  en: {
    start: 'Start round', restart: 'Restart', check: 'Check',
    next: 'Next', answer: 'Answer', correct: 'Correct', wrong: 'Wrong',
    complete: 'Round complete', meaning: 'Meaning',
    pool: 'Pool', known: 'Known', review: 'Review',
  },
} as const;

export const shuffle = <T,>(items: T[]) => {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

interface KanjiSeed {
  char: string;
  readings: string[];
  tr: string[];
  en: string[];
  words: Array<{ surface: string; reading: string; tr: string; en: string }>;
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
  { char: '万', readings: ['まん'], tr: ['on bin'], en: ['ten thousand'], words: [{ surface: '一万', reading: 'いちまん', tr: 'on bin', en: 'ten thousand' }, { surface: '万年筆', reading: 'まんねんひつ', tr: 'dolma kalem', en: 'fountain pen' }] },
];

export const buildCuratedKanjiItems = (language: AppLanguage): KanjiPracticeItem[] =>
  kanjiSeeds.map((seed, index) => ({
    char: seed.char,
    frequency: kanjiSeeds.length - index,
    readings: seed.readings,
    meanings: language === 'tr' ? seed.tr : seed.en,
    examples: seed.words.map((word, wi) => ({
      id: `${seed.char}-${wi}`,
      surface: word.surface,
      reading: word.reading,
      meaning: language === 'tr' ? word.tr : word.en,
    })),
  }));

const normalizeAnswer = (v: string) => v.trim().toLowerCase().replace(/\s+/g, '');

const speakJapanese = (text: string) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP';
  u.rate = 0.86;
  window.speechSynthesis.speak(u);
};

export const readKanjiProgress = (): Record<string, 'known' | 'review'> => {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(window.localStorage.getItem('kototsuna.kanji.practice-progress.v1') ?? '{}'); }
  catch { return {}; }
};

export const writeKanjiProgress = (progress: Record<string, 'known' | 'review'>) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('kototsuna.kanji.practice-progress.v1', JSON.stringify(progress));
};

/* ── Shared scene primitives ────────────────────────────────────────── */

const SCENE_CENTER =
  'relative flex w-full flex-col items-center justify-center ' +
  'max-lg:min-h-[calc(100dvh-92px)] max-lg:overflow-y-auto ' +
  'lg:h-[calc(100dvh-92px)] lg:overflow-hidden';

const SCENE_SCROLL =
  'relative flex w-full flex-col items-center ' +
  'max-lg:min-h-[calc(100dvh-92px)] ' +
  'lg:h-[calc(100dvh-92px)] lg:overflow-y-auto';

/* Edge-softening vignette — hidden in dark mode (global bg handles dark) */
const OVERLAY =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_38%,rgba(240,232,228,0.52)_100%)] [.theme-dark_&]:opacity-0';

/* Warm focus halo — hidden in dark mode */
const FOCUS_HALO =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_46%_36%_at_50%_42%,rgba(253,250,248,0.55)_0%,transparent_100%)] [.theme-dark_&]:opacity-0';

/* Subtle sakura glow behind the focal character — dark mode only */
const DM_CHAR_HALO =
  'pointer-events-none absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl bg-[#d06070]/8 [.theme-dark_&]:opacity-100';

/* ── Corner breadcrumb ─────────────────────────────────────────────── */
const Corner: React.FC<{ label: string; onClick?: () => void }> = ({ label, onClick }) =>
  onClick ? (
    <button type="button" onClick={onClick} className="absolute left-5 top-6 z-10 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-[#2b2422]/28 transition-colors duration-150 hover:text-[#2b2422]/55 [.theme-dark_&]:text-white/35 [.theme-dark_&]:hover:text-white/55">
      <span className="text-[13px] leading-none">←</span>
      {label}
    </button>
  ) : (
    <div className="absolute left-5 top-6 z-10 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-[#2b2422]/28 [.theme-dark_&]:text-white/35">
      <span className="inline-block h-[3px] w-[3px] rounded-full bg-[#d06070]/60" />
      {label}
    </div>
  );

/* ── The shared practice engine ────────────────────────────────────── */
const PracticeKanjiPage: React.FC<PracticeKanjiPageProps & { mode: KanjiMode }> = ({
  language,
  mode,
}) => {
  const c = strings[language];
  const mc = modeCopy[language][mode];
  const items = useMemo(() => buildCuratedKanjiItems(language), [language]);

  const [progress, setProgress] = useState<Record<string, 'known' | 'review'>>(() =>
    readKanjiProgress()
  );
  const [round, setRound] = useState<KanjiPracticeItem[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState<null | boolean>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [subMode, setSubMode] = useState<0 | 1>(0);

  const subModeLabels: Record<KanjiMode, [string, string]> = {
    drawing:   ['なぞる', '書く'],
    reading:   ['文字', '音声'],
    listening: ['文字', '意味'],
    writing:   ['黙', '音声'],
    usage:     ['文字', '意味'],
    challenge: ['混合', '視覚'],
    match:     ['文字', '意味'],
    pop:       ['意味', '読み'],
  };

  const current = round[index] ?? null;
  const complete = round.length > 0 && index >= round.length;

  const goBack = () => { setRound([]); setIndex(0); setInput(''); setSelected(null); setChecked(null); setCorrectCount(0); setWrongCount(0); setCombo(0); };
  const knownCount = Object.values(progress).filter((v) => v === 'known').length;
  const reviewCount = Object.values(progress).filter((v) => v === 'review').length;

  useEffect(() => { writeKanjiProgress(progress); }, [progress]);

  useEffect(() => {
    if (round.length === 0 || subMode !== 1) return;
    if (mode !== 'reading' && mode !== 'writing') return;
    const item = round[index];
    if (item) speakJapanese(item.readings[0] ?? item.char);
  }, [index, round.length, subMode]);

  const startRound = () => {
    const reviewChars = new Set(
      Object.entries(progress).filter(([, s]) => s === 'review').map(([c]) => c)
    );
    const prioritized = [
      ...items.filter((item) => reviewChars.has(item.char)),
      ...shuffle(items.filter((item) => !reviewChars.has(item.char))),
    ];
    setRound(shuffle(prioritized).slice(0, mode === 'challenge' || mode === 'pop' ? 15 : 10));
    setIndex(0);
    setInput('');
    setSelected(null);
    setChecked(null);
    setCorrectCount(0);
    setWrongCount(0);
    setCombo(0);
  };

  const record = (item: KanjiPracticeItem, correct: boolean) => {
    setProgress((prev) => ({ ...prev, [item.char]: correct ? 'known' : 'review' }));
    if (correct) {
      setCorrectCount((v) => v + 1);
      setCombo((v) => v + 1);
      recordCorrect();
      markPracticedToday();
    } else {
      setWrongCount((v) => v + 1);
      setCombo(0);
      recordWrong();
    }
  };

  const checkTextAnswer = () => {
    if (!current || checked !== null) return;
    const ans = normalizeAnswer(input);
    const correct =
      mode === 'reading'
        ? current.readings.some((r) => normalizeAnswer(r) === ans)
        : normalizeAnswer(current.char) === ans;
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
    setIndex((v) => v + 1);
    setInput('');
    setSelected(null);
    setChecked(null);
  };

  const choices = useMemo(() => {
    if (!current) return [];
    return shuffle([current, ...shuffle(items.filter((i) => i.char !== current.char)).slice(0, 5)]);
  }, [current, items]);

  const isChoiceMode =
    mode === 'listening' || mode === 'usage' || mode === 'challenge' || mode === 'match' || mode === 'pop';
  const showMeaningCue = mode === 'drawing' || mode === 'writing' || mode === 'pop';

  /* ── Completion ──────────────────────────────────────────────────── */
  if (complete) {
    return (
      <div className={SCENE_CENTER}>
        <div className={OVERLAY} />
        <div className={FOCUS_HALO} />
        <div className={DM_CHAR_HALO} />
        <Corner label={`Kanji · ${mc.label}`} onClick={goBack} />

        <div className="relative z-10 flex flex-col items-center gap-4 px-4 text-center">
          <div
            className="select-none font-serif text-[9rem] leading-none text-[#2b2422] [.theme-dark_&]:text-[#f2d8d6]/85"
            style={{ textShadow: '0 3px 24px rgba(43,36,34,0.09)' }}
          >
            完
          </div>
          <h2 className="text-base font-light tracking-[0.28em] text-[#2b2422]/80 [.theme-dark_&]:text-white/80">
            {c.complete}
          </h2>

          {/* Score inline */}
          <div className="flex items-center gap-5 text-[10px] uppercase tracking-[0.28em] text-[#2b2422]/32 [.theme-dark_&]:text-white/35">
            <span className="text-[#8d5965]/70">{c.correct} {correctCount}</span>
            <span>·</span>
            <span className="text-[#c24f69]/60">{c.wrong} {wrongCount}</span>
            <span>·</span>
            <span>×{combo} combo</span>
          </div>

          <button
            onClick={startRound}
            className="mt-5 rounded-full bg-[#d06070] px-11 py-4 text-sm font-medium uppercase tracking-[0.22em] text-white transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.025] active:scale-[0.98]"
          >
            {c.restart}
          </button>
        </div>
      </div>
    );
  }

  /* ── Pre-start dojo ──────────────────────────────────────────────── */
  if (round.length === 0) {
    return (
      <div className={SCENE_CENTER}>
        <div className={OVERLAY} />
        <div className={FOCUS_HALO} />
        <div className={DM_CHAR_HALO} />
        <Corner label={`Kanji · ${mc.label}`} />

        <main className="relative z-10 flex flex-col items-center px-4 text-center">

          {/* Dominant kanji */}
          <div
            className="select-none font-serif text-[11rem] leading-none tracking-[-0.01em] text-[#2b2422] md:text-[14rem] [.theme-dark_&]:text-[#f2d8d6]/85"
            style={{ textShadow: '0 3px 24px rgba(43,36,34,0.10)' }}
          >
            {items[0]?.char ?? '漢'}
          </div>

          {/* Mode subtitle */}
          <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.48em] text-[#2b2422]/28 [.theme-dark_&]:text-white/35">
            {mc.subtitle}
          </p>

          {/* Primary CTA */}
          <button
            onClick={startRound}
            className="mt-7 rounded-full bg-[#d06070] px-12 py-4 text-sm font-medium uppercase tracking-[0.22em] text-white transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.025] active:scale-[0.98]"
          >
            {c.start}
          </button>

          {/* Stats line */}
          <div className="mt-8 flex items-center gap-4 text-[9px] uppercase tracking-[0.3em] text-[#2b2422]/25 [.theme-dark_&]:text-white/30">
            <span>{c.pool} {items.length}</span>
            <span>·</span>
            <span>{c.known} {knownCount}</span>
            <span>·</span>
            <span>{c.review} {reviewCount}</span>
          </div>

          {/* Mode buttons */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {([0, 1] as const).map((sm) => (
              <button
                key={sm}
                type="button"
                onClick={() => setSubMode(sm)}
                className={`select-none rounded-full border px-5 py-2.5 font-serif text-lg transition-all duration-150 ease-out hover:scale-105 ${
                  subMode === sm
                    ? 'border-[#d06070]/20 bg-[#d06070]/6 text-[#d06070]/80 hover:bg-[#d06070]/10 hover:text-[#d06070] [.theme-dark_&]:border-[#d06070]/40 [.theme-dark_&]:bg-[#d06070]/22 [.theme-dark_&]:text-[#ffd6dc]'
                    : 'border-[#2b2422]/7 bg-white/12 text-[#2b2422]/38 hover:bg-white/24 hover:text-[#2b2422]/60 [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-white/8 [.theme-dark_&]:text-white/55'
                }`}
              >
                {subModeLabels[mode][sm]}
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  /* ── Active training ─────────────────────────────────────────────── */
  return (
    <div className={SCENE_CENTER}>
      <div className={OVERLAY} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_46%,rgba(253,250,248,0.5)_0%,transparent_100%)] [.theme-dark_&]:opacity-0" />
      <div className={DM_CHAR_HALO} />

      {/* Corner: progress */}
      <Corner label={`${mc.label} · ${index + 1} / ${round.length}`} onClick={goBack} />

      {/* Score — top right */}
      <div className="absolute right-5 top-6 z-10 flex items-center gap-3 text-[9px] uppercase tracking-[0.24em] text-[#2b2422]/25 [.theme-dark_&]:text-white/30">
        <span>{correctCount} {c.correct.toLowerCase()}</span>
        <span>·</span>
        <span>×{combo}</span>
      </div>

      <main className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8 px-4 text-center">

        {/* ── Question cue ── */}
        {mode === 'reading' && (
          <div
            className="select-none font-serif text-[8rem] leading-none text-[#2b2422] [.theme-dark_&]:text-[#f2d8d6]/85"
            style={{ textShadow: '0 3px 24px rgba(43,36,34,0.10)' }}
          >
            {current?.char}
          </div>
        )}

        {mode === 'listening' && (
          <button
            type="button"
            onClick={() => speakJapanese(current?.readings[0] ?? current?.char ?? '')}
            className="flex h-20 w-20 items-center justify-center rounded-full border border-[#d06070]/18 bg-[#d06070]/7 text-[#d06070]/70 transition-all duration-150 ease-out hover:bg-[#d06070]/12 hover:scale-105 active:scale-95"
          >
            <Volume2 size={30} />
          </button>
        )}

        {(mode === 'usage' || mode === 'challenge' || mode === 'match') && current && (
          <div>
            {!(mode === 'challenge' && subMode === 1) && (
              <div
                className="select-none font-serif text-[6rem] leading-none text-[#2b2422] [.theme-dark_&]:text-[#f2d8d6]/85"
                style={{ textShadow: '0 2px 20px rgba(43,36,34,0.09)' }}
              >
                {current.char}
              </div>
            )}
            <div className={`text-lg font-light tracking-widest text-[#2b2422]/60 [.theme-dark_&]:text-white/60 ${!(mode === 'challenge' && subMode === 1) ? 'mt-3' : ''}`}>
              {current.meanings[0] ?? '—'}
            </div>
          </div>
        )}

        {showMeaningCue && current && (
          <div>
            <div className="mb-2.5 text-[9px] font-medium uppercase tracking-[0.42em] text-[#d06070]/70">
              {mode === 'pop' && subMode === 1 ? 'Reading' : c.meaning}
            </div>
            <div className="text-2xl font-light tracking-widest text-[#2b2422]/85 [.theme-dark_&]:text-white/80">
              {mode === 'pop' && subMode === 1 ? (current.readings[0] ?? '—') : (current.meanings[0] ?? '—')}
            </div>
          </div>
        )}

        {/* ── Answer area ── */}
        {isChoiceMode ? (
          <div className="grid w-full grid-cols-3 gap-2">
            {choices.map((choice) => {
              const isSelected = selected === choice.char;
              const showOk = checked !== null && choice.char === current?.char;
              const showBad = isSelected && choice.char !== current?.char;
              return (
                <button
                  key={choice.char}
                  type="button"
                  disabled={checked !== null}
                  onClick={() => choose(choice)}
                  className={`min-h-[4.5rem] rounded-2xl border transition-all duration-150 ease-out ${
                    subMode === 1 && (mode === 'listening' || mode === 'usage' || mode === 'match')
                      ? 'px-2 text-sm font-light tracking-wide'
                      : 'font-serif text-3xl'
                  } ${
                    showOk
                      ? 'border-[#8d5965]/30 bg-[#8d5965]/8 text-[#8d5965]'
                      : showBad
                        ? 'border-[#c24f69]/30 bg-[#c24f69]/8 text-[#c24f69]'
                        : 'border-[#2b2422]/8 bg-white/14 text-[#2b2422]/80 hover:bg-white/24 hover:scale-[1.03] active:scale-[0.98] [.theme-dark_&]:border-white/12 [.theme-dark_&]:bg-white/8 [.theme-dark_&]:text-white/75 [.theme-dark_&]:hover:bg-white/14'
                  }`}
                >
                  {subMode === 1 && (mode === 'listening' || mode === 'usage' || mode === 'match')
                    ? (choice.meanings[0] ?? choice.char)
                    : choice.char}
                </button>
              );
            })}
          </div>
        ) : (
          <form
            className="w-full"
            onSubmit={(e) => { e.preventDefault(); checkTextAnswer(); }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={checked !== null}
              autoComplete="off"
              placeholder={c.answer}
              className="w-full rounded-full border border-[#2b2422]/12 bg-white/22 px-6 py-3.5 text-center font-serif text-xl text-[#2b2422] placeholder-[#2b2422]/25 outline-none backdrop-blur-[1px] transition-all duration-150 focus:border-[#d06070]/35 focus:ring-2 focus:ring-[#d06070]/10 disabled:opacity-50 [.theme-dark_&]:border-white/15 [.theme-dark_&]:bg-white/8 [.theme-dark_&]:text-white [.theme-dark_&]:placeholder-white/30"
            />
            {checked === null && (
              <button
                type="submit"
                disabled={!input.trim()}
                className="mt-4 rounded-full bg-[#d06070] px-10 py-3.5 text-sm font-medium uppercase tracking-[0.22em] text-white transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.025] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35"
              >
                {c.check}
              </button>
            )}
          </form>
        )}

        {/* ── Feedback + next ── */}
        {checked !== null && current && (
          <div className="flex flex-col items-center gap-4">
            {/* Result label */}
            <p className={`text-[10px] font-medium uppercase tracking-[0.36em] ${
              checked ? 'text-[#8d5965]/80' : 'text-[#c24f69]/70'
            }`}>
              {checked ? c.correct : c.wrong}
            </p>

            {/* Answer reveal */}
            <div className="flex items-baseline gap-3">
              <span
                className="select-none font-serif text-5xl leading-none text-[#2b2422] [.theme-dark_&]:text-[#f2d8d6]/85"
                style={{ textShadow: '0 2px 16px rgba(43,36,34,0.08)' }}
              >
                {current.char}
              </span>
              <span className="text-base font-light tracking-widest text-[#2b2422]/50 [.theme-dark_&]:text-white/50">
                {current.readings[0] ?? '—'}
              </span>
            </div>

            {/* Next button */}
            <button
              type="button"
              onClick={next}
              className="mt-1 rounded-full bg-[#d06070] px-10 py-3.5 text-sm font-medium uppercase tracking-[0.22em] text-white transition-all duration-200 ease-out hover:opacity-90 hover:scale-[1.025] active:scale-[0.98]"
            >
              {c.next}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

/* ── Mode exports ───────────────────────────────────────────────────── */

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
