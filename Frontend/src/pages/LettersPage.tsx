import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Volume2, X } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { appShellRoutes } from '../data/appShellContent';
import { hiraganaSections, katakanaSections } from '../data/kana';
import { getGoogleTranslateKanaAudioSrc } from '../data/kanaAudio';
import { getNhkKanaGuideImageSrc } from '../data/nhkKanaGuideImages';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { Character, KanaSection } from '../types';
import { DrawingCanvas } from '../components/DrawingCanvas';

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
  <section className="rounded-[1.4rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-4 shadow-[var(--kt-shadow-sm)]">
    <h2 className="text-sm font-black text-[var(--kt-ink-strong)]">{title}</h2>
    {subtitle ? <p className="mt-1 text-xs font-semibold text-[var(--kt-ink-subtle)]">{subtitle}</p> : null}
    <div className="mt-3">{children}</div>
  </section>
);

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
    return toTileMetaRows(baseColumnIds.map((columnId) => getColumnCells(singleSection, columnId)));
  }, [singleSection]);

  const voicedRows = useMemo<(TileMeta | null)[][]>(() => {
    if (!singleSection) return [];
    return toTileMetaRows(voicedColumnIds.map((columnId) => getColumnCells(singleSection, columnId)));
  }, [singleSection]);

  const comboRows = useMemo<(TileMeta | null)[][]>(() => {
    if (!doubleSection) return [];
    const ids = (doubleSection.columnGroupIds ?? []).filter((id): id is string => Boolean(id));
    return toTileMetaRows(ids.map((id) => getColumnCells(doubleSection, id)));
  }, [doubleSection]);

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

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10">
      <div className="flex items-center justify-center gap-2 border-b border-[var(--kt-border-subtle)] pb-4">
        {(['hiragana', 'katakana'] as KanaScript[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSearchParams({ script: tab })}
            className={`border-b-2 px-6 pb-3 text-sm font-black uppercase tracking-[0.12em] transition ${
              script === tab
                ? 'border-[color:var(--kt-accent-info)] text-[var(--kt-accent-info)]'
                : 'border-transparent text-[var(--kt-ink-subtle)] hover:text-[var(--kt-ink)]'
            }`}
          >
            {tab === 'hiragana' ? copy.tabHiragana : copy.tabKatakana}
          </button>
        ))}
      </div>

      <section className="rounded-[1.6rem] border border-[var(--kt-border)] bg-[linear-gradient(135deg,var(--kt-surface)_0%,var(--kt-surface-muted)_100%)] p-5 shadow-[var(--kt-shadow-sm)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-[var(--kt-ink-strong)]">{copy.title[script]}</h1>
            <p className="mt-1 text-sm font-semibold text-[var(--kt-ink-subtle)]">{copy.subtitle[script]}</p>
          </div>
          <Link
            to={`${appShellRoutes.letters}?script=${script}`}
            className="inline-flex shrink-0 items-center rounded-xl border border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[var(--kt-ink)] transition hover:-translate-y-0.5 hover:shadow-[var(--kt-shadow-sm)]"
          >
            {copy.cta}
          </Link>
        </div>
      </section>

      <Block title={copy.basicsTitle} subtitle={copy.basicsSubtitle}>
        <KanaRowGrid
          rows={baseRows}
          columns={5}
          getProgress={getProgress}
          characterById={characterById}
          onCharacterSelect={(character) => setSelectedCharacterId(character.id)}
        />
      </Block>

      <Block title={copy.voicedTitle} subtitle={copy.voicedSubtitle}>
        <KanaRowGrid
          rows={voicedRows}
          columns={5}
          getProgress={getProgress}
          characterById={characterById}
          onCharacterSelect={(character) => setSelectedCharacterId(character.id)}
        />
      </Block>

      <Block title={copy.comboTitle} subtitle={copy.comboSubtitle}>
        <KanaRowGrid
          rows={comboRows}
          columns={3}
          getProgress={getProgress}
          characterById={characterById}
          onCharacterSelect={(character) => setSelectedCharacterId(character.id)}
        />
      </Block>

      <Block title={copy.smallTsuTitle} subtitle={copy.smallTsuSubtitle}>
        <KanaRowGrid
          rows={smallTsuRows[script]}
          columns={4}
          getProgress={getProgress}
          characterById={characterById}
          clickable={false}
        />
      </Block>

      <Block title={copy.longTitle} subtitle={copy.longSubtitle}>
        <KanaRowGrid
          rows={longVowelRows[script]}
          columns={5}
          getProgress={getProgress}
          characterById={characterById}
          clickable={false}
        />
      </Block>

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
    </div>
  );
};
