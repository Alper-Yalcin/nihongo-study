import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, ChevronLeft, ChevronRight, Heart, Volume2, X } from 'lucide-react';
import { AppLanguage } from '../../data/appPreferences';
import { hiraganaSections, katakanaSections } from '../data/kana';
import { getGoogleTranslateKanaAudioSrc } from '../data/kanaAudio';
import { getNhkKanaGuideImageSrc } from '../data/nhkKanaGuideImages';
import { useKanaProgressStore } from '../../features/kana/progress/progressStore';
import { KanaScript } from '../../features/kana/domain/kanaItem';
import { Character, KanaSection } from '../../types';
import { DrawingCanvas, DrawingCanvasRef } from '../../components/DrawingCanvas';
import { evaluateDrawing } from '../../utils/DrawingEvaluator';
import { isAcceptedKanaAnswer, isAcceptedRomajiAnswer } from '../../utils/typing';

interface LettersPageProps {
  language: AppLanguage;
}

interface TileMeta {
  id: string;
  symbol: string;
  label: string;
}

const pageCopy = {
  tr: {
    title: {
      hiragana: "Hiragana'yi ogrenelim!",
      katakana: "Katakana'yi ogrenelim!"
    },
    subtitle: {
      hiragana: 'Japoncadaki ana yazim sistemini ogren',
      katakana: 'Yabanci kokenli kelimelerde kullanilan yazim sistemini ogren'
    },
    cta: 'Karakterleri ogren',
    basicsTitle: 'Gojuon ve Hiragana',
    basicsSubtitle: 'Japoncanin temel hece tablosunu kesfet',
    voicedTitle: 'Dakuon ve Handakuon',
    voicedSubtitle: 'Sesi degistirmek icin sembol ekle',
    comboTitle: 'Kombinasyon',
    comboSubtitle: 'Yeni heceler olusturmak icin kucuk karakterler ekle',
    smallTsuTitle: 'Kucuk tsu',
    smallTsuSubtitle: 'Takip eden sessiz harfi ikiye katla',
    longTitle: 'Uzun sesli harfler',
    longSubtitle: 'Uzun okunan sesli kaliplar',
    tabHiragana: 'Hiragana',
    tabKatakana: 'Katakana'
  },
  en: {
    title: {
      hiragana: 'Let\'s learn Hiragana!',
      katakana: 'Let\'s learn Katakana!'
    },
    subtitle: {
      hiragana: 'Learn the primary Japanese writing system',
      katakana: 'Learn the script used for foreign-origin words'
    },
    cta: 'Learn characters',
    basicsTitle: 'Gojuon',
    basicsSubtitle: 'Explore the base Japanese syllabary grid',
    voicedTitle: 'Dakuon and Handakuon',
    voicedSubtitle: 'Add marks to shift pronunciation',
    comboTitle: 'Combinations',
    comboSubtitle: 'Build new syllables with small kana',
    smallTsuTitle: 'Small Tsu',
    smallTsuSubtitle: 'Double the following consonant sound',
    longTitle: 'Long vowels',
    longSubtitle: 'Common long-vowel patterns',
    tabHiragana: 'Hiragana',
    tabKatakana: 'Katakana'
  }
} as const;

const baseColumnIds = ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n'];
const voicedColumnIds = ['ga', 'za', 'da', 'ba', 'pa'];

const smallTsuRows: Record<KanaScript, (TileMeta | null)[][]> = {
  hiragana: [[
    { id: 'h-sokuon-k', symbol: 'xtsu+k', label: 'kk' },
    { id: 'h-sokuon-s', symbol: 'xtsu+s', label: 'ss' },
    { id: 'h-sokuon-t', symbol: 'xtsu+t', label: 'tt' },
    { id: 'h-sokuon-p', symbol: 'xtsu+p', label: 'pp' }
  ]],
  katakana: [[
    { id: 'k-sokuon-k', symbol: 'XTSU+k', label: 'kk' },
    { id: 'k-sokuon-s', symbol: 'XTSU+s', label: 'ss' },
    { id: 'k-sokuon-t', symbol: 'XTSU+t', label: 'tt' },
    { id: 'k-sokuon-p', symbol: 'XTSU+p', label: 'pp' }
  ]]
};

const longVowelRows: Record<KanaScript, (TileMeta | null)[][]> = {
  hiragana: [
    [
      { id: 'h-lv-aa', symbol: 'a+a', label: 'aa' },
      { id: 'h-lv-ii', symbol: 'i+i', label: 'ii' },
      { id: 'h-lv-uu', symbol: 'u+u', label: 'uu' },
      { id: 'h-lv-ee', symbol: 'e+e', label: 'ee' },
      { id: 'h-lv-oo', symbol: 'o+o', label: 'oo' }
    ],
    [
      null,
      null,
      null,
      { id: 'h-lv-ei', symbol: 'e+i', label: 'ei' },
      { id: 'h-lv-ou', symbol: 'o+u', label: 'ou' }
    ]
  ],
  katakana: [[
    { id: 'k-lv-aa', symbol: 'ka-', label: 'kaa' },
    { id: 'k-lv-ii', symbol: 'ki-', label: 'kii' },
    { id: 'k-lv-uu', symbol: 'ku-', label: 'kuu' },
    { id: 'k-lv-ee', symbol: 'ke-', label: 'kee' },
    { id: 'k-lv-oo', symbol: 'ko-', label: 'koo' }
  ]]
};

const getSectionById = (sections: KanaSection[], id: string) => sections.find((section) => section.id === id) ?? null;

const getColumnIndex = (section: KanaSection, columnId: string) =>
  section.columnGroupIds?.findIndex((id) => id === columnId) ?? -1;

const getColumnCells = (section: KanaSection, columnId: string): (Character | null)[] => {
  const colIndex = getColumnIndex(section, columnId);
  if (colIndex < 0) {
    return [];
  }

  const column = section.matrix.map((row) => row[colIndex] ?? null);

  if (columnId === 'n') {
    const nCell = column.find((cell) => cell !== null) ?? null;
    return [nCell, null, null, null, null];
  }

  return column;
};

const transpose = <T,>(matrix: T[][]): T[][] => {
  if (matrix.length === 0) return [];
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
};

const toTileMetaRows = (rows: (Character | null)[][]): (TileMeta | null)[][] =>
  rows.map((row) => row.map((cell) => (cell ? { id: cell.id, symbol: cell.symbol, label: cell.label } : null)));

interface KanaTileProps {
  tile: TileMeta | null;
  character: Character | null;
  getProgress: (id: string) => { masteryScore: number; timesSeen: number; state: string } | null;
  clickable?: boolean;
  onCharacterSelect?: (character: Character) => void;
}

const KanaTile: React.FC<KanaTileProps> = ({
  tile,
  character,
  getProgress,
  clickable = true,
  onCharacterSelect
}) => {
  if (!tile) {
    return <div className="h-14 rounded-[0.7rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] opacity-30" />;
  }

  const progress = getProgress(tile.id);
  const mastered = progress?.state === 'mastered';
  const seen = (progress?.timesSeen ?? 0) > 0;
  const progressPercent = Math.max(0, Math.min(100, Math.round(progress?.masteryScore ?? 0)));

  const className = `group flex h-14 flex-col items-center justify-center rounded-[0.7rem] border px-1 transition hover:-translate-y-0.5 hover:shadow-[var(--kt-shadow)] ${
    mastered
      ? 'border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)]'
      : seen
        ? 'border-[var(--kt-border)] bg-[var(--kt-surface-muted)]'
        : 'border-[var(--kt-border-subtle)] bg-[var(--kt-surface)]'
  }`;

  const content = (
    <>
      <span className="font-jp text-lg font-bold leading-none text-[var(--kt-ink-strong)]">{tile.symbol}</span>
      <span className="mt-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-[var(--kt-ink-subtle)]">{tile.label}</span>
      <span className="mt-1 block h-[4px] w-full rounded-full bg-[var(--kt-border-subtle)]">
        <span
          className={`block h-full rounded-full ${mastered ? 'bg-[var(--kt-accent-success)]' : 'bg-[var(--kt-brand)]'}`}
          style={{ width: `${progressPercent}%` }}
        />
      </span>
    </>
  );

  if (!clickable) {
    return <div className={className}>{content}</div>;
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (character && onCharacterSelect) {
          onCharacterSelect(character);
        }
      }}
    >
      {content}
    </button>
  );
};

interface KanaRowGridProps {
  rows: (TileMeta | null)[][];
  columns: number;
  getProgress: (id: string) => { masteryScore: number; timesSeen: number; state: string } | null;
  characterById: Map<string, Character>;
  clickable?: boolean;
  onCharacterSelect?: (character: Character) => void;
}

const KanaRowGrid: React.FC<KanaRowGridProps> = ({
  rows,
  columns,
  getProgress,
  characterById,
  clickable = true,
  onCharacterSelect
}) => (
  <div className="space-y-2">
    {rows.map((row, rowIndex) => (
      <div key={rowIndex} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {row.map((tile, cellIndex) => (
          <KanaTile
            key={tile?.id ?? `empty-${rowIndex}-${cellIndex}`}
            tile={tile}
            character={tile ? characterById.get(tile.id) ?? null : null}
            getProgress={getProgress}
            clickable={clickable}
            onCharacterSelect={onCharacterSelect}
          />
        ))}
      </div>
    ))}
  </div>
);

interface BlockProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const Block: React.FC<BlockProps> = ({ title, subtitle, children }) => (
  <section className="mt-10">
    <h2 className="text-xl font-extrabold tracking-[-0.01em] text-[var(--kt-ink-strong)]">{title}</h2>
    {subtitle ? <p className="mt-1 text-sm font-medium text-[var(--kt-ink-subtle)]">{subtitle}</p> : null}
    <div className="mt-5">{children}</div>
  </section>
);

type LearnPhase = 'watch' | 'quiz' | 'listenWrite' | 'listenTouch' | 'match' | 'matrixKana' | 'matrixRomaji' | 'summary';

const shuffleArray = <T,>(items: T[]) => {
  const cloned = [...items];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
};

const lessonCopy = {
  tr: {
    watchTitle: 'Karakteri izle',
    drawTitle: 'Karakteri ciz',
    quizTitle: 'Bu karakter nasil okunur?',
    listenWriteTitle: 'Dinledigini yaz',
    listenWriteHint: 'Sesi dinle ve dogru cevabi yaz',
    listenTouchTitle: 'Isittigine dokun',
    hardExercise: 'Zor egzersiz',
    matchTitle: 'Eslestirme',
    matchHint: 'Romaji ve kana kartlarini eslestir',
    matrixKanaTitle: '5x5 yazma alistirmasi',
    matrixKanaSubtitle: 'Romaji gorup dogru kanayi yaz',
    matrixRomajiTitle: '5x5 okuma alistirmasi',
    matrixRomajiSubtitle: 'Kana gorup dogru romajiyi yaz',
    check: 'Kontrol et',
    next: 'Devam et',
    close: 'Kapat',
    clear: 'Temizle',
    answerPlaceholder: 'Cevap yaz',
    correct: 'Dogru',
    summaryTitle: 'Dersi bitirdin!',
    summaryScore: 'Dogru',
    summaryLives: 'Can',
    summaryRestart: 'Tekrar baslat',
    summaryDone: 'Bitir',
    wrong: 'Tekrar dene',
    replayAudio: 'Sesi tekrar oynat'
  },
  en: {
    watchTitle: 'Watch the character',
    drawTitle: 'Draw the character',
    quizTitle: 'How is this character read?',
    listenWriteTitle: 'Type what you hear',
    listenWriteHint: 'Play the sound and type the answer',
    listenTouchTitle: 'Tap what you hear',
    hardExercise: 'Hard exercise',
    matchTitle: 'Matching',
    matchHint: 'Match romaji and kana cards',
    matrixKanaTitle: '5x5 writing drill',
    matrixKanaSubtitle: 'See romaji and type the correct kana',
    matrixRomajiTitle: '5x5 reading drill',
    matrixRomajiSubtitle: 'See kana and type the correct romaji',
    check: 'Check',
    next: 'Continue',
    close: 'Close',
    clear: 'Clear',
    answerPlaceholder: 'Type answer',
    correct: 'Correct',
    summaryTitle: 'Lesson complete!',
    summaryScore: 'Correct',
    summaryLives: 'Lives',
    summaryRestart: 'Restart',
    summaryDone: 'Finish',
    wrong: 'Try again',
    replayAudio: 'Replay audio'
  }
} as const;

interface LearningSessionOverlayProps {
  language: AppLanguage;
  script: KanaScript;
  lessonCharacters: Character[];
  matrixCharacters: Character[][];
  onClose: () => void;
}

const LearningSessionOverlay: React.FC<LearningSessionOverlayProps> = ({
  language,
  script,
  lessonCharacters,
  matrixCharacters,
  onClose
}) => {
  const copy = lessonCopy[language];
  const [sessionSeed, setSessionSeed] = useState(0);
  const [phase, setPhase] = useState<LearnPhase>('watch');
  const [lessonIndex, setLessonIndex] = useState(0);
  const [lives, setLives] = useState(5);
  const [correctCount, setCorrectCount] = useState(0);
  const [drawChecked, setDrawChecked] = useState(false);
  const [drawCorrect, setDrawCorrect] = useState(false);
  const [quizSelection, setQuizSelection] = useState<string | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);
  const [listenWriteInput, setListenWriteInput] = useState('');
  const [listenWriteChecked, setListenWriteChecked] = useState(false);
  const [listenWriteCorrect, setListenWriteCorrect] = useState(false);
  const [listenTouchOptions, setListenTouchOptions] = useState<string[]>([]);
  const [listenTouchSelections, setListenTouchSelections] = useState<string[]>([]);
  const [listenTouchChecked, setListenTouchChecked] = useState(false);
  const [listenTouchCorrect, setListenTouchCorrect] = useState(false);
  const [matchRound, setMatchRound] = useState<Character[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [leftSelection, setLeftSelection] = useState<string | null>(null);
  const [rightSelection, setRightSelection] = useState<string | null>(null);
  const [kanaInputs, setKanaInputs] = useState<Record<string, string>>({});
  const [romajiInputs, setRomajiInputs] = useState<Record<string, string>>({});
  const [matrixChecked, setMatrixChecked] = useState(false);
  const [matrixResults, setMatrixResults] = useState<Record<string, boolean>>({});
  const drawCanvasRef = useRef<DrawingCanvasRef | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sessionCharacters = useMemo(() => {
    if (lessonCharacters.length <= 15) {
      return lessonCharacters;
    }
    return shuffleArray(lessonCharacters).slice(0, 15);
  }, [lessonCharacters, sessionSeed]);

  const activeCharacter = sessionCharacters[lessonIndex] ?? sessionCharacters[0];
  const listenWordCharacters = useMemo(() => {
    if (!activeCharacter) {
      return [];
    }

    const alternatives = sessionCharacters.filter((character) => character.id !== activeCharacter.id);
    if (alternatives.length === 0) {
      return [activeCharacter];
    }

    const second = alternatives[(lessonIndex * 3) % alternatives.length];
    return [activeCharacter, second];
  }, [activeCharacter, sessionCharacters, lessonIndex]);
  const listenWordKana = useMemo(
    () => listenWordCharacters.map((character) => character.symbol).join(''),
    [listenWordCharacters]
  );
  const listenWordRomaji = useMemo(
    () => listenWordCharacters.map((character) => character.label).join(''),
    [listenWordCharacters]
  );
  const allMatrixCharacters = matrixCharacters.flat();
  const totalSteps = sessionCharacters.length * 5 + 2;
  const currentStep =
    phase === 'watch'
      ? lessonIndex * 5 + 1
      : phase === 'quiz'
        ? lessonIndex * 5 + 2
        : phase === 'listenWrite'
          ? lessonIndex * 5 + 3
          : phase === 'listenTouch'
            ? lessonIndex * 5 + 4
          : phase === 'match'
            ? lessonIndex * 5 + 5
        : phase === 'matrixKana'
          ? totalSteps - 1
        : phase === 'matrixRomaji'
            ? totalSteps
            : totalSteps;
  const progress = Math.max(0, Math.min(100, Math.round((currentStep / totalSteps) * 100)));

  const quizOptions = useMemo(() => {
    if (!activeCharacter) {
      return [];
    }

    const distractors = shuffleArray(
      [...new Set(sessionCharacters.map((item) => item.label))]
        .filter((label) => label !== activeCharacter.label)
    ).slice(0, 2);

    return shuffleArray([activeCharacter.label, ...distractors]);
  }, [activeCharacter, sessionCharacters, lessonIndex]);

  const matchLeftItems = useMemo(
    () => shuffleArray(matchRound.map((character) => ({ id: character.id, text: character.label }))),
    [matchRound]
  );

  const matchRightItems = useMemo(
    () => shuffleArray(matchRound.map((character) => ({ id: character.id, text: character.symbol }))),
    [matchRound]
  );

  useEffect(() => {
    setQuizSelection(null);
    setQuizChecked(false);
    setQuizCorrect(false);
    setListenWriteInput('');
    setListenWriteChecked(false);
    setListenWriteCorrect(false);
    setListenTouchSelections([]);
    setListenTouchChecked(false);
    setListenTouchCorrect(false);
    setDrawChecked(false);
    setDrawCorrect(false);
    setLeftSelection(null);
    setRightSelection(null);
    setMatchedIds([]);
    if (phase === 'watch') {
      drawCanvasRef.current?.clear();
    }
  }, [lessonIndex, phase]);

  useEffect(() => {
    if (!activeCharacter) {
      return;
    }

    if (phase !== 'watch' && phase !== 'quiz' && phase !== 'listenWrite' && phase !== 'listenTouch') {
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    const sequence = phase === 'listenWrite' || phase === 'listenTouch' ? listenWordCharacters : activeCharacter ? [activeCharacter] : [];
    if (!sequence.length) {
      return;
    }
    let cancelled = false;
    let pointer = 0;
    const playNext = () => {
      if (cancelled || pointer >= sequence.length) {
        audio.onended = null;
        audio.playbackRate = 1;
        return;
      }
      const current = sequence[pointer];
      const src = getGoogleTranslateKanaAudioSrc(current.id) ?? `/audio/${script}/${current.id}.mp3`;
      audio.src = src;
      audio.currentTime = 0;
      audio.play().catch(() => undefined);
    };
    audio.onended = () => {
      pointer += 1;
      playNext();
    };
    playNext();
    return () => {
      cancelled = true;
      audio.onended = null;
      audio.pause();
      audio.playbackRate = 1;
    };
  }, [activeCharacter, phase, listenWordCharacters, script]);

  useEffect(() => {
    if (!activeCharacter || phase !== 'match') {
      return;
    }

    const distractors = shuffleArray(
      sessionCharacters.filter((character) => character.id !== activeCharacter.id)
    ).slice(0, 3);

    setMatchRound([activeCharacter, ...distractors]);
    setLeftSelection(null);
    setRightSelection(null);
    setMatchedIds([]);
  }, [activeCharacter, phase, sessionCharacters]);

  useEffect(() => {
    if (!activeCharacter || phase !== 'listenTouch') {
      return;
    }

    const distractors = shuffleArray(
      [...new Set(sessionCharacters.map((character) => character.symbol))]
        .filter((symbol) => !listenWordCharacters.some((target) => target.symbol === symbol))
    ).slice(0, 2);

    setListenTouchOptions(shuffleArray([...listenWordCharacters.map((item) => item.symbol), ...distractors]));
    setListenTouchSelections([]);
    setListenTouchChecked(false);
    setListenTouchCorrect(false);
  }, [activeCharacter, phase, sessionCharacters, listenWordCharacters]);

  useEffect(() => {
    if (!leftSelection || !rightSelection || phase !== 'match') {
      return;
    }

    if (leftSelection === rightSelection) {
      setMatchedIds((prev) => [...prev, leftSelection]);
      setLeftSelection(null);
      setRightSelection(null);
      return;
    }

    loseLife();
    setLeftSelection(null);
    setRightSelection(null);
  }, [leftSelection, rightSelection, phase]);

  const loseLife = () => {
    setLives((prev) => Math.max(0, prev - 1));
  };

  const moveToNextCharacter = () => {
    if (lessonIndex < sessionCharacters.length - 1) {
      setLessonIndex((prev) => prev + 1);
      setPhase('watch');
      return;
    }

    setPhase('matrixKana');
    setMatrixChecked(false);
    setMatrixResults({});
  };

  const checkQuiz = () => {
    if (!activeCharacter || !quizSelection) {
      return;
    }

    const correct = quizSelection === activeCharacter.label;
    setQuizChecked(true);
    setQuizCorrect(correct);
    if (correct) {
      setCorrectCount((prev) => prev + 1);
      return;
    }
    loseLife();
  };

  const checkDraw = () => {
    if (!activeCharacter) {
      return;
    }

    const strokes = drawCanvasRef.current?.getStrokes() ?? [];
    const guideImageLayout = drawCanvasRef.current?.getGuideImageLayout() ?? undefined;
    const correct = evaluateDrawing(strokes, activeCharacter, {
      tolerance: 'practice',
      guideImageLayout
    });
    setDrawChecked(true);
    setDrawCorrect(correct);
    if (correct) {
      setCorrectCount((prev) => prev + 1);
      return;
    }
    loseLife();
  };

  const checkListenWrite = () => {
    if (!listenWordCharacters.length) {
      return;
    }

    const answer = listenWriteInput.trim();
    const correct =
      isAcceptedRomajiAnswer(answer, listenWordRomaji) ||
      isAcceptedKanaAnswer(answer, listenWordKana);
    setListenWriteChecked(true);
    setListenWriteCorrect(correct);
    if (correct) {
      setCorrectCount((prev) => prev + 1);
      return;
    }
    loseLife();
  };

  const checkListenTouch = () => {
    if (!listenWordCharacters.length || listenTouchSelections.length !== listenWordCharacters.length) {
      return;
    }

    const expected = listenWordCharacters.map((character) => character.symbol);
    const correct = expected.every((symbol, index) => symbol === listenTouchSelections[index]);
    setListenTouchChecked(true);
    setListenTouchCorrect(correct);
    if (correct) {
      setCorrectCount((prev) => prev + 1);
      return;
    }
    loseLife();
  };

  const playListenSequence = (slow = false) => {
    const audio = audioRef.current;
    if (!audio || !listenWordCharacters.length) {
      return;
    }

    let pointer = 0;
    audio.playbackRate = slow ? 0.85 : 1;
    const playNext = () => {
      if (pointer >= listenWordCharacters.length) {
        audio.onended = null;
        audio.playbackRate = 1;
        return;
      }

      const current = listenWordCharacters[pointer];
      const src = getGoogleTranslateKanaAudioSrc(current.id) ?? `/audio/${script}/${current.id}.mp3`;
      audio.src = src;
      audio.currentTime = 0;
      audio.play().catch(() => undefined);
    };

    audio.onended = () => {
      pointer += 1;
      playNext();
    };

    playNext();
  };

  const checkMatrixKana = () => {
    const results: Record<string, boolean> = {};
    allMatrixCharacters.forEach((item) => {
      const answer = kanaInputs[item.id] ?? '';
      results[item.id] = isAcceptedKanaAnswer(answer, item.symbol);
    });
    setMatrixResults(results);
    setMatrixChecked(true);

    const wrongCount = Object.values(results).filter((isCorrect) => !isCorrect).length;
    if (wrongCount === 0) {
      setCorrectCount((prev) => prev + allMatrixCharacters.length);
    } else {
      loseLife();
    }
  };

  const checkMatrixRomaji = () => {
    const results: Record<string, boolean> = {};
    allMatrixCharacters.forEach((item) => {
      const answer = romajiInputs[item.id] ?? '';
      results[item.id] = isAcceptedRomajiAnswer(answer, item.label);
    });
    setMatrixResults(results);
    setMatrixChecked(true);

    const wrongCount = Object.values(results).filter((isCorrect) => !isCorrect).length;
    if (wrongCount === 0) {
      setCorrectCount((prev) => prev + allMatrixCharacters.length);
    } else {
      loseLife();
    }
  };

  const resetSession = () => {
    setPhase('watch');
    setLessonIndex(0);
    setLives(5);
    setCorrectCount(0);
    setDrawChecked(false);
    setDrawCorrect(false);
    setQuizSelection(null);
    setQuizChecked(false);
    setQuizCorrect(false);
    setListenWriteInput('');
    setListenWriteChecked(false);
    setListenWriteCorrect(false);
    setListenTouchOptions([]);
    setListenTouchSelections([]);
    setListenTouchChecked(false);
    setListenTouchCorrect(false);
    setMatchRound([]);
    setMatchedIds([]);
    setLeftSelection(null);
    setRightSelection(null);
    setKanaInputs({});
    setRomajiInputs({});
    setMatrixChecked(false);
    setMatrixResults({});
    setSessionSeed((prev) => prev + 1);
  };

  const renderWatchPhase = () => {
    if (!activeCharacter) {
      return null;
    }
    const audioSrc = getGoogleTranslateKanaAudioSrc(activeCharacter.id) ?? `/audio/${script}/${activeCharacter.id}.mp3`;
    const imageSrc = getNhkKanaGuideImageSrc(activeCharacter.id);

    return (
      <div className="mx-auto w-full max-w-3xl">
        <h2 className="text-4xl font-black text-[var(--kt-ink-strong)]">{copy.drawTitle}</h2>
        <div className="mt-6 flex items-center gap-4">
          <audio ref={audioRef} src={audioSrc} preload="auto" />
          <button
            type="button"
            onClick={() => {
              const audio = audioRef.current;
              if (!audio) return;
              audio.currentTime = 0;
              audio.play().catch(() => undefined);
            }}
            className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500 text-slate-900 transition hover:brightness-110"
            aria-label={copy.replayAudio}
          >
            <Volume2 size={24} />
          </button>
          <div>
            <div className="text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-ink-subtle)]">{copy.watchTitle}</div>
            <div className="font-jp text-4xl font-bold text-[var(--kt-ink-strong)]">{activeCharacter.symbol}</div>
          </div>
        </div>

        <div className="mt-6 grid place-items-center rounded-3xl border border-[var(--kt-border)] bg-[var(--kt-surface)] p-5">
          <DrawingCanvas
            ref={drawCanvasRef}
            guideSymbol={activeCharacter.symbol}
            guideImageSrc={imageSrc}
            drawingData={activeCharacter.drawingData}
            showTemplate={true}
            showStrokeOrder={false}
            showDirectionArrows={false}
            width={320}
            height={320}
            disabled={drawChecked}
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className={`text-sm font-black ${drawChecked && !drawCorrect ? 'text-rose-300' : 'text-transparent'}`}>
            {copy.wrong}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                drawCanvasRef.current?.clear();
                setDrawChecked(false);
                setDrawCorrect(false);
              }}
              className="rounded-2xl border border-[var(--kt-border)] px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-ink-muted)] transition hover:bg-[var(--kt-surface-muted)]"
            >
              {copy.clear}
            </button>
            {!drawChecked ? (
              <button
                type="button"
                onClick={checkDraw}
                className="rounded-2xl bg-sky-500 px-8 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#062032] transition hover:brightness-110"
              >
                {copy.check}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPhase('quiz')}
                className="rounded-2xl bg-lime-500 px-8 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#08220f] transition hover:brightness-110"
              >
                {copy.next}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderQuizPhase = () => {
    if (!activeCharacter) {
      return null;
    }
    const audioSrc = getGoogleTranslateKanaAudioSrc(activeCharacter.id) ?? `/audio/${script}/${activeCharacter.id}.mp3`;

    return (
      <div className="mx-auto w-full max-w-3xl">
        <h2 className="text-4xl font-black text-[var(--kt-ink-strong)]">{copy.quizTitle}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="rounded-3xl border border-[var(--kt-border)] bg-[var(--kt-surface)] p-5 text-center">
            <audio ref={audioRef} src={audioSrc} preload="auto" />
            <button
              type="button"
              onClick={() => {
                const audio = audioRef.current;
                if (!audio) return;
                audio.currentTime = 0;
                audio.play().catch(() => undefined);
              }}
              className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-slate-900"
              aria-label={copy.replayAudio}
            >
              <Volume2 size={18} />
            </button>
            <div className="mt-8 font-jp text-7xl font-bold text-[var(--kt-ink-strong)]">{activeCharacter.symbol}</div>
          </div>

          <div className="space-y-3">
            {quizOptions.map((option, index) => {
              const isPicked = quizSelection === option;
              const isCorrect = quizChecked && option === activeCharacter.label;
              const isWrong = quizChecked && isPicked && option !== activeCharacter.label;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={quizChecked}
                  onClick={() => setQuizSelection(option)}
                  className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition ${
                    isCorrect
                      ? 'border-lime-400 bg-lime-500/15 text-lime-300'
                      : isWrong
                        ? 'border-rose-400 bg-rose-500/15 text-rose-300'
                        : isPicked
                          ? 'border-sky-400 bg-sky-500/15 text-sky-300'
                          : 'border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] hover:border-[var(--kt-border-strong)]'
                  }`}
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-current text-xs font-black">
                    {index + 1}
                  </span>
                  <span className="text-2xl font-black">{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className={`text-sm font-black ${quizChecked && !quizCorrect ? 'text-rose-300' : 'text-transparent'}`}>
            {copy.wrong}
          </span>
          {!quizChecked ? (
            <button
              type="button"
              onClick={checkQuiz}
              disabled={!quizSelection}
              className="rounded-2xl bg-sky-500 px-8 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#062032] transition enabled:hover:brightness-110 disabled:opacity-40"
            >
              {copy.check}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPhase('listenWrite')}
              className="rounded-2xl bg-lime-500 px-8 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#08220f] transition hover:brightness-110"
            >
              {copy.next}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderListenWritePhase = () => {
    if (!activeCharacter) {
      return null;
    }

    return (
      <div className="mx-auto w-full max-w-3xl">
        <h2 className="text-4xl font-black text-[var(--kt-ink-strong)]">{copy.listenWriteTitle}</h2>
        <p className="mt-2 text-sm font-semibold text-[var(--kt-ink-muted)]">{copy.listenWriteHint}</p>

        <div className="mt-8 rounded-3xl border border-[var(--kt-border)] bg-[var(--kt-surface)] p-6">
          <audio ref={audioRef} preload="auto" />
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => playListenSequence(false)}
              className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500 text-slate-900 transition hover:brightness-110"
              aria-label={copy.replayAudio}
            >
              <Volume2 size={28} />
            </button>
            <input
              value={listenWriteInput}
              onChange={(event) => setListenWriteInput(event.target.value)}
              placeholder={copy.answerPlaceholder}
              className="w-full max-w-sm rounded-xl border border-[var(--kt-border)] bg-[var(--kt-surface-sunken)] px-4 py-3 text-center text-lg font-bold text-[var(--kt-ink-strong)] outline-none focus:border-sky-400"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className={`text-sm font-black ${listenWriteChecked && !listenWriteCorrect ? 'text-rose-300' : 'text-transparent'}`}>
            {copy.wrong}
          </span>
          {!listenWriteChecked ? (
            <button
              type="button"
              onClick={checkListenWrite}
              disabled={!listenWriteInput.trim()}
              className="rounded-2xl bg-sky-500 px-8 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#062032] transition enabled:hover:brightness-110 disabled:opacity-40"
            >
              {copy.check}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPhase('listenTouch')}
              className="rounded-2xl bg-lime-500 px-8 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#08220f] transition hover:brightness-110"
            >
              {copy.next}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderListenTouchPhase = () => {
    if (!activeCharacter) {
      return null;
    }

    return (
      <div className="mx-auto w-full max-w-4xl">
        <p className="text-sm font-black uppercase tracking-[0.1em] text-rose-400">{copy.hardExercise}</p>
        <h2 className="mt-1 text-5xl font-black text-[var(--kt-ink-strong)]">{copy.listenTouchTitle}</h2>

        <div className="mt-8 flex items-center gap-3">
          <audio ref={audioRef} preload="auto" />
          <button
            type="button"
            onClick={() => playListenSequence(false)}
            className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-400 text-[#102330] transition hover:brightness-110"
            aria-label={copy.replayAudio}
          >
            <Volume2 size={34} />
          </button>
          <button
            type="button"
            onClick={() => playListenSequence(true)}
            className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-400 text-[#102330] transition hover:brightness-110"
            aria-label={copy.replayAudio}
          >
            <Volume2 size={24} />
          </button>
        </div>

        <div className="mt-8 border-t border-[var(--kt-border)] pt-6">
          <div className="flex min-h-[56px] items-center gap-3">
            {listenTouchSelections.length > 0 ? (
              listenTouchSelections.map((selected, index) => (
                <button
                  type="button"
                  key={`sel-${selected}-${index}`}
                  onClick={() =>
                    setListenTouchSelections((prev) => prev.filter((_, prevIndex) => prevIndex !== index))
                  }
                  className="inline-flex h-12 min-w-12 items-center justify-center rounded-xl border border-[var(--kt-border)] bg-[var(--kt-surface-sunken)] px-4 font-jp text-3xl font-bold text-[var(--kt-ink-strong)]"
                >
                  {selected}
                </button>
              ))
            ) : (
              <span className="text-sm font-semibold text-[var(--kt-ink-subtle)]">{copy.answerPlaceholder}</span>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 border-t border-[var(--kt-border)] pt-6">
            {listenTouchOptions.map((symbol) => {
              const used = listenTouchSelections.includes(symbol);
              return (
                <button
                  key={symbol}
                  type="button"
                  disabled={listenTouchChecked || used}
                  onClick={() =>
                    setListenTouchSelections((prev) => {
                      if (prev.length >= listenWordCharacters.length) {
                        return prev;
                      }
                      return [...prev, symbol];
                    })
                  }
                  className={`inline-flex h-12 min-w-12 items-center justify-center rounded-xl border px-4 font-jp text-3xl font-bold transition ${
                    used
                      ? 'opacity-0'
                      : 'border-[var(--kt-border)] bg-[var(--kt-surface-sunken)] text-[var(--kt-ink-strong)] hover:border-sky-400'
                  }`}
                >
                  {symbol}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-[var(--kt-border)] pt-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-2xl border border-[var(--kt-border)] px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-ink-subtle)]"
            >
              Simdi dinleyemem
            </button>
            <span className={`text-sm font-black ${listenTouchChecked && !listenTouchCorrect ? 'text-rose-300' : 'text-transparent'}`}>
              {copy.wrong}
            </span>
          </div>
          {!listenTouchChecked ? (
            <button
              type="button"
              onClick={checkListenTouch}
              disabled={listenTouchSelections.length !== listenWordCharacters.length}
              className="rounded-2xl bg-[var(--kt-surface-muted)] px-8 py-3 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-ink-muted)] transition enabled:bg-rose-400 enabled:text-[#102330] enabled:hover:brightness-110 disabled:opacity-40"
            >
              {copy.check}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPhase('match')}
              className="rounded-2xl bg-lime-500 px-8 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#08220f] transition hover:brightness-110"
            >
              {copy.next}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderMatchPhase = () => {
    const matchDone = matchRound.length > 0 && matchedIds.length === matchRound.length;

    return (
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="text-4xl font-black text-[var(--kt-ink-strong)]">{copy.matchTitle}</h2>
        <p className="mt-2 text-sm font-semibold text-[var(--kt-ink-muted)]">{copy.matchHint}</p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="space-y-3">
            {matchLeftItems.map((item) => {
              const selected = leftSelection === item.id;
              const done = matchedIds.includes(item.id);
              return (
                <button
                  key={`left-${item.id}`}
                  type="button"
                  onClick={() => {
                    if (done) return;
                    setLeftSelection(item.id);
                  }}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-lg font-black transition ${
                    done
                      ? 'border-lime-400 bg-lime-500/15 text-lime-300'
                      : selected
                        ? 'border-sky-400 bg-sky-500/15 text-sky-300'
                        : 'border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] hover:border-[var(--kt-border-strong)]'
                  }`}
                >
                  {item.text}
                </button>
              );
            })}
          </div>
          <div className="space-y-3">
            {matchRightItems.map((item) => {
              const selected = rightSelection === item.id;
              const done = matchedIds.includes(item.id);
              return (
                <button
                  key={`right-${item.id}`}
                  type="button"
                  onClick={() => {
                    if (done) return;
                    setRightSelection(item.id);
                  }}
                  className={`w-full rounded-2xl border px-4 py-2 text-center transition ${
                    done
                      ? 'border-lime-400 bg-lime-500/15 text-lime-300'
                      : selected
                        ? 'border-sky-400 bg-sky-500/15 text-sky-300'
                        : 'border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] hover:border-[var(--kt-border-strong)]'
                  }`}
                >
                  <span className="font-jp text-4xl font-bold">{item.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className={`text-sm font-black ${matchDone ? 'text-lime-300' : 'text-[var(--kt-ink-subtle)]'}`}>
            {matchDone ? copy.correct : `${matchedIds.length}/${matchRound.length}`}
          </span>
          {matchDone ? (
            <button
              type="button"
              onClick={() => {
                setCorrectCount((prev) => prev + 1);
                moveToNextCharacter();
              }}
              className="rounded-2xl bg-lime-500 px-8 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#08220f] transition hover:brightness-110"
            >
              {copy.next}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMatchRound(shuffleArray(matchRound));
                setLeftSelection(null);
                setRightSelection(null);
                setMatchedIds([]);
              }}
              className="rounded-2xl border border-[var(--kt-border)] px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-ink-muted)] transition hover:bg-[var(--kt-surface-muted)]"
            >
              {copy.clear}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderMatrix = (mode: 'kana' | 'romaji') => {
    const isKana = mode === 'kana';
    const title = isKana ? copy.matrixKanaTitle : copy.matrixRomajiTitle;
    const subtitle = isKana ? copy.matrixKanaSubtitle : copy.matrixRomajiSubtitle;

    const onCheck = () => {
      if (isKana) {
        checkMatrixKana();
        return;
      }
      checkMatrixRomaji();
    };

    const onContinue = () => {
      if (isKana) {
        setMatrixChecked(false);
        setMatrixResults({});
        setPhase('matrixRomaji');
        return;
      }
      setPhase('summary');
    };

    return (
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="text-4xl font-black text-[var(--kt-ink-strong)]">{title}</h2>
        <p className="mt-2 text-sm font-semibold text-[var(--kt-ink-muted)]">{subtitle}</p>

        <div className="mt-6 rounded-3xl border border-[var(--kt-border)] bg-[var(--kt-surface)] p-5">
          <div className="grid grid-cols-5 gap-3">
            {allMatrixCharacters.map((character) => {
              const prompt = isKana ? character.label : character.symbol;
              const inputValue = isKana ? kanaInputs[character.id] ?? '' : romajiInputs[character.id] ?? '';
              const isCorrect = matrixResults[character.id];
              const isWrong = matrixChecked && isCorrect === false;
              return (
                <label
                  key={`${mode}-${character.id}`}
                  className={`rounded-xl border p-3 text-center ${isWrong ? 'border-rose-400' : 'border-[var(--kt-border)]'}`}
                >
                  <div className={`mb-2 ${isKana ? 'text-sm font-black text-sky-300' : 'font-jp text-2xl font-bold text-[var(--kt-ink-strong)]'}`}>
                    {prompt}
                  </div>
                  <input
                    value={inputValue}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (isKana) {
                        setKanaInputs((prev) => ({ ...prev, [character.id]: value }));
                        return;
                      }
                      setRomajiInputs((prev) => ({ ...prev, [character.id]: value }));
                    }}
                    className="w-full rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-sunken)] px-2 py-1 text-center text-sm font-bold text-[var(--kt-ink-strong)] outline-none focus:border-sky-400"
                  />
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          {!matrixChecked ? (
            <button
              type="button"
              onClick={onCheck}
              className="rounded-2xl bg-sky-500 px-8 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#062032] transition hover:brightness-110"
            >
              {copy.check}
            </button>
          ) : (
            <button
              type="button"
              onClick={onContinue}
              className="rounded-2xl bg-lime-500 px-8 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#08220f] transition hover:brightness-110"
            >
              {copy.next}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderSummary = () => (
    <div className="mx-auto w-full max-w-2xl text-center">
      <CheckCircle2 className="mx-auto text-lime-400" size={56} />
      <h2 className="mt-5 text-5xl font-black text-[var(--kt-ink-strong)]">{copy.summaryTitle}</h2>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[var(--kt-border)] bg-[var(--kt-surface)] p-4 text-left">
          <p className="text-xs font-black uppercase tracking-[0.08em] text-[var(--kt-ink-subtle)]">{copy.summaryScore}</p>
          <p className="mt-1 text-3xl font-black text-lime-300">{correctCount}</p>
        </div>
        <div className="rounded-2xl border border-[var(--kt-border)] bg-[var(--kt-surface)] p-4 text-left">
          <p className="text-xs font-black uppercase tracking-[0.08em] text-[var(--kt-ink-subtle)]">{copy.summaryLives}</p>
          <p className="mt-1 text-3xl font-black text-rose-300">{lives}</p>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={resetSession}
          className="rounded-2xl border border-[var(--kt-border)] px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-ink-muted)] transition hover:bg-[var(--kt-surface-muted)]"
        >
          {copy.summaryRestart}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl bg-lime-500 px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#08220f] transition hover:brightness-110"
        >
          {copy.summaryDone}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[70] bg-[var(--kt-surface-page)] text-[var(--kt-ink)]">
      <div className="mx-auto flex h-full max-w-[1200px] flex-col px-6 py-6">
        <header className="flex items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--kt-border)] text-[var(--kt-ink-muted)] transition hover:bg-[var(--kt-surface-muted)]"
            aria-label={copy.close}
          >
            <X size={20} />
          </button>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--kt-progress-track)]">
            <div className="h-full rounded-full bg-lime-400 transition-[width]" style={{ width: `${progress}%` }} />
          </div>
          <div className="inline-flex items-center gap-1 text-rose-400">
            <Heart size={16} fill="currentColor" />
            <span className="text-sm font-black">{lives}</span>
          </div>
        </header>

        <main className="flex flex-1 items-center py-6">
          {phase === 'watch' && renderWatchPhase()}
          {phase === 'quiz' && renderQuizPhase()}
          {phase === 'listenWrite' && renderListenWritePhase()}
          {phase === 'listenTouch' && renderListenTouchPhase()}
          {phase === 'match' && renderMatchPhase()}
          {phase === 'matrixKana' && renderMatrix('kana')}
          {phase === 'matrixRomaji' && renderMatrix('romaji')}
          {phase === 'summary' && renderSummary()}
        </main>
      </div>
    </div>
  );
};

interface KanaDetailModalProps {
  language: AppLanguage;
  script: KanaScript;
  character: Character;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

const modalCopy = {
  tr: {
    drawing: 'Cizim rehberi',
    strokes: 'Vurus sayisi'
  },
  en: {
    drawing: 'Drawing guide',
    strokes: 'Stroke count'
  }
} as const;

const KanaDetailModal: React.FC<KanaDetailModalProps> = ({
  language,
  script,
  character,
  onPrev,
  onNext,
  onClose
}) => {
  const copy = modalCopy[language];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSrc = getGoogleTranslateKanaAudioSrc(character.id) ?? `/audio/${script}/${character.id}.mp3`;
  const guideImageSrc = getNhkKanaGuideImageSrc(character.id);

  const playAudio = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    audio.play().catch(() => undefined);
  };

  useEffect(() => {
    playAudio();
  }, [character.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'ArrowLeft') {
        onPrev();
        return;
      }

      if (event.key === 'ArrowRight') {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.56)] px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <article
        className="relative w-full max-w-md rounded-[1.6rem] border border-[var(--kt-border)] bg-[var(--kt-surface-muted)] p-4 shadow-[var(--kt-shadow-lg)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-[var(--kt-ink-muted)] transition hover:bg-[var(--kt-surface)] hover:text-[var(--kt-ink)]"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="mt-8 flex items-center justify-center">
          <audio ref={audioRef} src={audioSrc} preload="auto" />
          <div className="w-full rounded-[1.2rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] p-3">
            <div className="mb-2 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.1em] text-[var(--kt-ink-subtle)]">
              <span>{copy.drawing}</span>
              <span>
                {copy.strokes}: {character.drawingData?.strokeCount ?? '-'}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={onPrev}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-[var(--kt-ink)] transition hover:-translate-y-0.5 hover:text-[var(--kt-accent-info)]"
                aria-label="Previous character"
              >
                <ChevronLeft size={22} />
              </button>

              <div className="flex justify-center">
                <DrawingCanvas
                  guideSymbol={character.symbol}
                  guideImageSrc={guideImageSrc}
                  drawingData={character.drawingData}
                  showTemplate={true}
                  showStrokeOrder={false}
                  showDirectionArrows={false}
                  width={260}
                  height={260}
                  disabled={true}
                />
              </div>

              <button
                type="button"
                onClick={onNext}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-[var(--kt-ink)] transition hover:-translate-y-0.5 hover:text-[var(--kt-accent-info)]"
                aria-label="Next character"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-center">
              <button
                type="button"
                onClick={playAudio}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--kt-border)] bg-transparent text-[var(--kt-ink)] transition hover:-translate-y-0.5 hover:shadow-[var(--kt-shadow-sm)]"
                aria-label="Replay audio"
              >
                <Volume2 size={22} />
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export const LettersPage: React.FC<LettersPageProps> = ({ language }) => {
  const copy = pageCopy[language];
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [learningOpen, setLearningOpen] = useState(false);
  const script: KanaScript = searchParams.get('script') === 'katakana' ? 'katakana' : 'hiragana';
  const { getProgress } = useKanaProgressStore();

  const sections = script === 'hiragana' ? hiraganaSections : katakanaSections;

  const singleSection = useMemo(
    () => getSectionById(sections, script === 'hiragana' ? 'hiragana-single' : 'katakana-single'),
    [script, sections]
  );

  const doubleSection = useMemo(
    () => getSectionById(sections, script === 'hiragana' ? 'hiragana-double' : 'katakana-double'),
    [script, sections]
  );

  const baseRows = useMemo<(TileMeta | null)[][]>(() => {
    if (!singleSection) return [];
    return transpose(toTileMetaRows(baseColumnIds.map((columnId) => getColumnCells(singleSection, columnId))));
  }, [singleSection]);

  const voicedRows = useMemo<(TileMeta | null)[][]>(() => {
    if (!singleSection) return [];
    return transpose(toTileMetaRows(voicedColumnIds.map((columnId) => getColumnCells(singleSection, columnId))));
  }, [singleSection]);

  const comboRows = useMemo<(TileMeta | null)[][]>(() => {
    if (!doubleSection) return [];
    const ids = (doubleSection.columnGroupIds ?? []).filter((id): id is string => Boolean(id));
    return transpose(toTileMetaRows(ids.map((id) => getColumnCells(doubleSection, id))));
  }, [doubleSection]);

  const matrixCharacters = useMemo<Character[][]>(() => {
    if (!singleSection) {
      return [];
    }

    const colIndices = baseColumnIds
      .slice(0, 5)
      .map((columnId) => getColumnIndex(singleSection, columnId))
      .filter((index) => index >= 0);

    return singleSection.matrix
      .slice(0, 5)
      .map((row) =>
        colIndices
          .map((index) => row[index] ?? null)
          .filter((item): item is Character => item !== null)
      )
      .filter((row) => row.length > 0);
  }, [singleSection]);

  const lessonCharacters = useMemo(() => matrixCharacters.flat(), [matrixCharacters]);

  const characterById = useMemo(
    () =>
      new Map(
        sections.flatMap((section) =>
          section.matrix.flatMap((row) =>
            row
              .filter((item): item is Character => item !== null)
              .map((character) => [character.id, character] as const)
          )
        )
      ),
    [sections]
  );

  const browseableCharacters = useMemo(
    () =>
      [...baseRows, ...voicedRows, ...comboRows]
        .flatMap((row) => row)
        .filter((tile): tile is TileMeta => tile !== null)
        .map((tile) => characterById.get(tile.id))
        .filter((item): item is Character => Boolean(item)),
    [baseRows, voicedRows, comboRows, characterById]
  );

  const selectedCharacterIndex = useMemo(
    () => browseableCharacters.findIndex((item) => item.id === selectedCharacterId),
    [browseableCharacters, selectedCharacterId]
  );

  const selectedCharacter =
    selectedCharacterIndex >= 0 ? browseableCharacters[selectedCharacterIndex] : null;

  const selectPrevCharacter = () => {
    if (!browseableCharacters.length || selectedCharacterIndex < 0) {
      return;
    }

    const nextIndex =
      selectedCharacterIndex === 0
        ? browseableCharacters.length - 1
        : selectedCharacterIndex - 1;

    setSelectedCharacterId(browseableCharacters[nextIndex].id);
  };

  const selectNextCharacter = () => {
    if (!browseableCharacters.length || selectedCharacterIndex < 0) {
      return;
    }

    const nextIndex =
      selectedCharacterIndex === browseableCharacters.length - 1
        ? 0
        : selectedCharacterIndex + 1;

    setSelectedCharacterId(browseableCharacters[nextIndex].id);
  };

  useEffect(() => {
    if (!selectedCharacterId) {
      return;
    }

    if (!browseableCharacters.some((item) => item.id === selectedCharacterId)) {
      setSelectedCharacterId(null);
    }
  }, [browseableCharacters, selectedCharacterId]);

  useEffect(() => {
    if (!learningOpen) {
      return;
    }

    setSelectedCharacterId(null);
  }, [learningOpen]);

  return (
    <div className="mx-auto max-w-[1000px] space-y-6 pb-10 pt-4">
      <div className="mb-10 flex items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.02em] text-[var(--kt-ink-strong)]">
            {copy.title[script]}
          </h1>
          <p className="mt-1 text-[15px] font-medium text-[var(--kt-ink-subtle)]">
            {copy.subtitle[script]}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4">
            {(['hiragana', 'katakana'] as KanaScript[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSearchParams({ script: tab })}
                className={`rounded-full px-5 py-2 text-sm font-black uppercase tracking-[0.05em] transition ${
                  script === tab
                    ? 'bg-sky-500/15 text-sky-600 dark:text-sky-300'
                    : 'text-[var(--kt-ink-subtle)] hover:bg-[var(--kt-surface-muted)] hover:text-[var(--kt-ink)]'
                }`}
              >
                {tab === 'hiragana' ? copy.tabHiragana : copy.tabKatakana}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setLearningOpen(true)}
            className="inline-flex shrink-0 items-center rounded-xl bg-sky-500 px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#062032] transition hover:brightness-110"
          >
            {copy.cta}
          </button>
        </div>
      </div>

      <div className="px-2">
        <Block title={copy.basicsTitle} subtitle={copy.basicsSubtitle}>
          <KanaRowGrid
            rows={baseRows}
            columns={baseRows[0]?.length || 11}
            getProgress={getProgress}
            characterById={characterById}
            onCharacterSelect={(character) => setSelectedCharacterId(character.id)}
          />
        </Block>

        <Block title={copy.voicedTitle} subtitle={copy.voicedSubtitle}>
          <KanaRowGrid
            rows={voicedRows}
            columns={voicedRows[0]?.length || 5}
            getProgress={getProgress}
            characterById={characterById}
            onCharacterSelect={(character) => setSelectedCharacterId(character.id)}
          />
        </Block>

        <Block title={copy.comboTitle} subtitle={copy.comboSubtitle}>
          <KanaRowGrid
            rows={comboRows}
            columns={comboRows[0]?.length || 33}
            getProgress={getProgress}
            characterById={characterById}
            onCharacterSelect={(character) => setSelectedCharacterId(character.id)}
          />
        </Block>

        <Block title={copy.smallTsuTitle} subtitle={copy.smallTsuSubtitle}>
          <KanaRowGrid
            rows={smallTsuRows[script]}
            columns={smallTsuRows[script][0]?.length || 4}
            getProgress={getProgress}
            characterById={characterById}
            clickable={false}
          />
        </Block>

        <Block title={copy.longTitle} subtitle={copy.longSubtitle}>
          <KanaRowGrid
            rows={longVowelRows[script]}
            columns={longVowelRows[script][0]?.length || 5}
            getProgress={getProgress}
            characterById={characterById}
            clickable={false}
          />
        </Block>
      </div>

      {selectedCharacter ? (
        <KanaDetailModal
          language={language}
          script={script}
          character={selectedCharacter}
          onPrev={selectPrevCharacter}
          onNext={selectNextCharacter}
          onClose={() => setSelectedCharacterId(null)}
        />
      ) : null}

      {learningOpen && lessonCharacters.length > 0 ? (
        <LearningSessionOverlay
          language={language}
          script={script}
          lessonCharacters={lessonCharacters}
          matrixCharacters={matrixCharacters}
          onClose={() => setLearningOpen(false)}
        />
      ) : null}
    </div>
  );
};
