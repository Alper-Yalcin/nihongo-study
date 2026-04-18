import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppLanguage } from '../data/appPreferences';
import { getKanaEntryRoute, getKanaItemRoute } from '../data/appShellContent';
import { hiraganaSections, katakanaSections } from '../data/kana';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { Character, KanaSection } from '../types';

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
  script: KanaScript;
  tile: TileMeta | null;
  getProgress: (id: string) => { masteryScore: number; timesSeen: number; state: string } | null;
  clickable?: boolean;
}

const KanaTile: React.FC<KanaTileProps> = ({ script, tile, getProgress, clickable = true }) => {
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
    <Link to={getKanaItemRoute(script, tile.id)} className={className}>
      {content}
    </Link>
  );
};

interface KanaRowGridProps {
  script: KanaScript;
  rows: (TileMeta | null)[][];
  columns: number;
  getProgress: (id: string) => { masteryScore: number; timesSeen: number; state: string } | null;
  clickable?: boolean;
}

const KanaRowGrid: React.FC<KanaRowGridProps> = ({ script, rows, columns, getProgress, clickable = true }) => (
  <div className="space-y-2">
    {rows.map((row, rowIndex) => (
      <div key={rowIndex} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {row.map((tile, cellIndex) => (
          <KanaTile
            key={tile?.id ?? `empty-${rowIndex}-${cellIndex}`}
            script={script}
            tile={tile}
            getProgress={getProgress}
            clickable={clickable}
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

export const LettersPage: React.FC<LettersPageProps> = ({ language }) => {
  const copy = pageCopy[language];
  const [searchParams, setSearchParams] = useSearchParams();
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
            to={getKanaEntryRoute(script, 'study')}
            className="inline-flex shrink-0 items-center rounded-xl border border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[var(--kt-ink)] transition hover:-translate-y-0.5 hover:shadow-[var(--kt-shadow-sm)]"
          >
            {copy.cta}
          </Link>
        </div>
      </section>

      <Block title={copy.basicsTitle} subtitle={copy.basicsSubtitle}>
        <KanaRowGrid script={script} rows={baseRows} columns={5} getProgress={getProgress} />
      </Block>

      <Block title={copy.voicedTitle} subtitle={copy.voicedSubtitle}>
        <KanaRowGrid script={script} rows={voicedRows} columns={5} getProgress={getProgress} />
      </Block>

      <Block title={copy.comboTitle} subtitle={copy.comboSubtitle}>
        <KanaRowGrid script={script} rows={comboRows} columns={3} getProgress={getProgress} />
      </Block>

      <Block title={copy.smallTsuTitle} subtitle={copy.smallTsuSubtitle}>
        <KanaRowGrid script={script} rows={smallTsuRows[script]} columns={4} getProgress={getProgress} clickable={false} />
      </Block>

      <Block title={copy.longTitle} subtitle={copy.longSubtitle}>
        <KanaRowGrid script={script} rows={longVowelRows[script]} columns={5} getProgress={getProgress} clickable={false} />
      </Block>
    </div>
  );
};
