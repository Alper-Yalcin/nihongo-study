import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppLanguage } from '../data/appPreferences';
import { getKanaItemRoute } from '../data/appShellContent';
import { hiraganaSections, katakanaSections } from '../data/kana';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { Character, KanaSection } from '../types';

interface LettersPageProps {
  language: AppLanguage;
}

const sectionLabels: Record<string, { tr: string; en: string }> = {
  'hiragana-single': { tr: 'Temel Karakterler', en: 'Basic Characters' },
  'hiragana-double': { tr: 'Birlesik Karakterler', en: 'Combined Characters' },
  'katakana-single': { tr: 'Temel Karakterler', en: 'Basic Characters' },
  'katakana-double': { tr: 'Birlesik Karakterler', en: 'Combined Characters' },
  'katakana-extended': { tr: 'Genisletilmis Karakterler', en: 'Extended Characters' },
};

interface KanaTableProps {
  section: KanaSection;
  script: KanaScript;
  getProgress: (id: string) => { masteryScore: number; timesSeen: number; state: string } | undefined;
}

const KanaTable: React.FC<KanaTableProps> = ({ section, script, getProgress }) => {
  const numConsonantGroups = section.matrix[0]?.length ?? 0;
  const numVowelRows = section.matrix.length;

  // Flatten: consonant-group-first, vowel-second → correct reading order for the grid
  const cells: (Character | null)[] = [];
  for (let colIdx = 0; colIdx < numConsonantGroups; colIdx++) {
    for (let rowIdx = 0; rowIdx < numVowelRows; rowIdx++) {
      cells.push(section.matrix[rowIdx]?.[colIdx] ?? null);
    }
  }

  return (
    <div
      className="mx-auto"
      style={{ display: 'grid', gridTemplateColumns: `repeat(${numVowelRows}, 1fr)`, gap: '4px' }}
    >
      {cells.map((cell, idx) => {
        if (!cell) {
          return (
            <div
              key={idx}
              className="h-14 w-14 rounded-[0.7rem] bg-[var(--kt-surface-muted)] opacity-20"
            />
          );
        }
        const progress = getProgress(cell.id);
        const mastered = progress?.state === 'mastered';
        const seen = progress && progress.timesSeen > 0;

        return (
          <Link
            key={cell.id}
            to={getKanaItemRoute(script, cell.id)}
            className={`flex h-14 w-14 flex-col items-center justify-center rounded-[0.7rem] border transition hover:-translate-y-0.5 hover:shadow-[var(--kt-shadow)] ${
              mastered
                ? 'border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)]'
                : seen
                  ? 'border-[var(--kt-border)] bg-[var(--kt-surface-muted)]'
                  : 'border-[var(--kt-border-subtle)] bg-[var(--kt-surface)]'
            }`}
          >
            <span className="font-jp text-xl font-bold text-[var(--kt-ink-strong)]">
              {cell.symbol}
            </span>
            <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--kt-ink-subtle)]">
              {cell.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export const LettersPage: React.FC<LettersPageProps> = ({ language }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedScript = searchParams.get('script');
  const script: KanaScript = requestedScript === 'katakana' ? 'katakana' : 'hiragana';
  const { getProgress } = useKanaProgressStore();

  const sections = script === 'hiragana' ? hiraganaSections : katakanaSections;

  return (
    <div className="space-y-8 pb-8">
      {/* Tab switcher */}
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
            {tab === 'hiragana' ? 'Hiragana' : 'Katakana'}
          </button>
        ))}
      </div>

      {/* Tables */}
      {sections.map((section) => (
        <section key={section.id} className="space-y-4 text-center">
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--kt-ink-subtle)]">
            {sectionLabels[section.id]?.[language] ?? section.title}
          </h2>
          <KanaTable section={section} script={script} getProgress={getProgress} />
        </section>
      ))}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[var(--kt-ink-subtle)]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)]" />
          {language === 'tr' ? 'Gorulmedi' : 'Not seen'}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm border border-[var(--kt-border)] bg-[var(--kt-surface-muted)]" />
          {language === 'tr' ? 'Calismaya baslandı' : 'In progress'}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm border border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)]" />
          {language === 'tr' ? 'Ustalasildi' : 'Mastered'}
        </span>
      </div>
    </div>
  );
};
