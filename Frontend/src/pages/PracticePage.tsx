import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, BookMarked, Brain, Headphones, PenTool, RefreshCcw, ShieldAlert, Shuffle, Sparkles, Type } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, StatCard } from '../shared/ui';
import { AppLanguage } from '../data/appPreferences';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../data/studyContent';
import { appShellRoutes } from '../data/appShellContent';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { getKanaItemById } from '../features/kana/data/kanaInventory';
import {
  buildKanaReviewQueue,
  buildScopedSectionsFromKanaIds,
  filterWordsForKanaIds,
  getKanaConfusableSets,
  getKanaGroupProgressStats,
  getWeakKanaProgressEntries
} from '../features/kana/review/reviewSelectors';

interface PracticePageProps {
  language: AppLanguage;
}

type PracticeTab = 'review' | 'weak' | 'confusable' | 'free' | 'stats';
type PracticeMode = 'typing' | 'drawing' | 'listening' | 'dictionary' | null;

const tileMeta = {
  review: {
    icon: RefreshCcw,
    title: 'Review Queue',
    accent: 'from-[var(--kt-accent-warning)] to-[var(--kt-accent-sunset)]'
  },
  weak: {
    icon: ShieldAlert,
    title: 'Weak Drill',
    accent: 'from-[var(--kt-accent-danger)] to-[var(--kt-brand)]'
  },
  confusable: {
    icon: Shuffle,
    title: 'Confusables',
    accent: 'from-[var(--kt-accent-plum)] to-[var(--kt-accent-info)]'
  },
  free: {
    icon: Sparkles,
    title: 'Free Practice',
    accent: 'from-[var(--kt-accent-info)] to-[var(--kt-brand)]'
  },
  stats: {
    icon: BarChart3,
    title: 'Stats',
    accent: 'from-[var(--kt-accent-success)] to-[var(--kt-accent-info)]'
  }
} as const;

export const PracticePage: React.FC<PracticePageProps> = ({ language }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const requestedScript = searchParams.get('script');
  const script: KanaScript = requestedScript === 'katakana' ? 'katakana' : 'hiragana';
  const requestedTab = searchParams.get('tab');
  const tab: PracticeTab =
    requestedTab === 'review' || requestedTab === 'weak' || requestedTab === 'confusable' || requestedTab === 'free' || requestedTab === 'stats'
      ? requestedTab
      : 'free';

  const [activeMode, setActiveMode] = useState<PracticeMode>(null);
  const [manualSelectedIds, setManualSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setActiveMode(null);
  }, [script, tab]);

  useEffect(() => {
    if (tab === 'free') {
      setManualSelectedIds(allSectionCharacterIds);
      return;
    }
    setManualSelectedIds([]);
  }, [tab, script]);

  const sections = useMemo(
    () => (script === 'hiragana' ? getLocalizedHiraganaSections(language) : getLocalizedKatakanaSections(language)),
    [language, script]
  );
  const { listByScript, summaries } = useKanaProgressStore();
  const summary = summaries[script];
  const progressEntries = listByScript(script);
  const reviewQueue = useMemo(() => buildKanaReviewQueue(script, progressEntries).slice(0, 16), [progressEntries, script]);
  const weakEntries = useMemo(() => getWeakKanaProgressEntries(script, progressEntries).slice(0, 16), [progressEntries, script]);
  const confusableSets = useMemo(() => getKanaConfusableSets(script, progressEntries).slice(0, 6), [progressEntries, script]);
  const groupStats = useMemo(() => getKanaGroupProgressStats(sections, progressEntries).slice(0, 8), [progressEntries, sections]);

  const allSectionCharacterIds = useMemo(
    () =>
      Array.from(
        new Set(
          sections.flatMap((section) =>
            section.matrix.flatMap((row) => row.filter((item): item is NonNullable<typeof item> => item !== null).map((item) => item.id))
          )
        )
      ),
    [sections]
  );

  useEffect(() => {
    if (tab === 'free') {
      setManualSelectedIds((prev) => (prev.length > 0 ? prev : allSectionCharacterIds));
    }
  }, [allSectionCharacterIds, tab]);

  const focusItemIds = useMemo(() => {
    if (tab === 'free') {
      return manualSelectedIds;
    }
    if (tab === 'review') {
      return reviewQueue.map((entry) => entry.kanaId);
    }
    if (tab === 'weak') {
      return weakEntries.map((entry) => entry.kanaId);
    }
    return Array.from(new Set(confusableSets.flatMap((set) => set.kanaIds)));
  }, [confusableSets, manualSelectedIds, reviewQueue, tab, weakEntries]);

  const modeIntro = useMemo(() => {
    if (!activeMode) {
      return null;
    }
    if (language === 'tr') {
      if (activeMode === 'typing') return { title: 'Typing alıştırması', text: 'Seçili karakterler için romaji yazma alıştırması.' };
      if (activeMode === 'drawing') return { title: 'Drawing alıştırması', text: 'Seçili karakterler için çizim ve stroke pratikleri.' };
      if (activeMode === 'listening') return { title: 'Listening alıştırması', text: 'Seçili karakter/kelimeler için dinleme odaklı alıştırmalar.' };
      return { title: 'Dictionary çalışması', text: 'Sözlük tabanlı çalışma ve test ekranı.' };
    }
    if (activeMode === 'typing') return { title: 'Typing practice', text: 'Romaji input drills for selected characters.' };
    if (activeMode === 'drawing') return { title: 'Drawing practice', text: 'Stroke and shape drills for selected characters.' };
    if (activeMode === 'listening') return { title: 'Listening practice', text: 'Listening drills for selected characters/words.' };
    return { title: 'Dictionary study', text: 'Dictionary based study and test flow.' };
  }, [activeMode, language]);

  return (
    <div className="space-y-8 pb-8">
      <section className="rounded-[2rem] border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-7 shadow-[var(--kt-shadow-lg)]">
        <div className="flex flex-wrap items-center gap-3">
          {(['hiragana', 'katakana'] as KanaScript[]).map((tabScript) => {
            const isActive = script === tabScript;

            return (
              <button
                key={tabScript}
                type="button"
                onClick={() => setSearchParams({ script: tabScript, tab })}
                className={`rounded-full px-5 py-2 text-sm font-black uppercase tracking-[0.14em] ${
                  isActive ? 'bg-[var(--kt-accent-info)] text-[var(--kt-brand-on)]' : 'bg-[var(--kt-surface-muted)] text-[var(--kt-ink-muted)]'
                }`}
              >
                {tabScript === 'hiragana' ? 'Hiragana' : 'Katakana'}
              </button>
            );
          })}
        </div>
        <h1 className="mt-6 text-5xl font-black text-[var(--kt-ink-strong)]">
          {language === 'tr' ? 'Alistirma merkezi' : 'Practice hub'}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--kt-ink-muted)]">
          {language === 'tr'
            ? 'Review, weak, confusable ve stats artik tek bir hub icinde. Her akistan istedigin moda inline girebilirsin.'
            : 'Review, weak, confusable, and stats now live in one hub. You can jump into each mode inline from here.'}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {(Object.keys(tileMeta) as PracticeTab[]).map((tileKey) => {
          const tile = tileMeta[tileKey];
          const Icon = tile.icon;
          const value =
            tileKey === 'review'
              ? reviewQueue.length
              : tileKey === 'weak'
                ? weakEntries.length
                : tileKey === 'confusable'
                  ? confusableSets.length
                  : summary.masteredCount;

          return (
            <button
              key={tileKey}
              type="button"
              onClick={() => setSearchParams({ script, tab: tileKey })}
              className={`overflow-hidden rounded-[1.8rem] border p-6 text-left shadow-[var(--kt-shadow)] ${
                tab === tileKey ? 'border-[var(--kt-accent-info)] ring-2 ring-[var(--kt-accent-info)]/28' : 'border-[var(--kt-border)]'
              } bg-[var(--kt-surface-raised)]`}
            >
              <div className={`inline-flex rounded-[1rem] bg-gradient-to-r p-3 text-white ${tile.accent}`}>
                <Icon size={22} />
              </div>
              <div className="mt-5 text-2xl font-black text-[var(--kt-ink-strong)]">{tile.title}</div>
              <div className="mt-2 text-sm text-[var(--kt-ink-muted)]">{value}</div>
            </button>
          );
        })}
      </section>

      {tab === 'free' && (
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="Tracked" value={summary.tracked} />
          <StatCard label="Due" value={summary.dueCount} tone="warning" />
          <StatCard label="Mastered" value={summary.masteredCount} tone="success" />
        </section>
      )}

      {tab !== 'stats' && (
        <>
          <section className="rounded-[1.8rem] border border-[var(--kt-border)] bg-[var(--kt-surface)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--kt-ink-subtle)]">
                  {script === 'hiragana' ? 'Hiragana' : 'Katakana'}
                </div>
                <h2 className="mt-2 text-3xl font-black text-[var(--kt-ink-strong)]">{tileMeta[tab].title}</h2>
              </div>
              {tab !== 'free' && (
                <Button as="button" type="button" variant="secondary" onClick={() => setSearchParams({ script })}>
                  {language === 'tr' ? 'Huba don' : 'Back to hub'}
                </Button>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                as="button"
                type="button"
                variant={activeMode === 'typing' ? 'primary' : 'secondary'}
                onClick={() => setActiveMode('typing')}
                iconStart={<Type size={15} />}
              >
                Typing
              </Button>
              <Button
                as="button"
                type="button"
                variant={activeMode === 'drawing' ? 'primary' : 'secondary'}
                onClick={() => setActiveMode('drawing')}
                iconStart={<PenTool size={15} />}
              >
                Drawing
              </Button>
              <Button
                as="button"
                type="button"
                variant={activeMode === 'listening' ? 'primary' : 'secondary'}
                onClick={() => setActiveMode('listening')}
                iconStart={<Headphones size={15} />}
              >
                Listening
              </Button>
              <Button
                as="button"
                type="button"
                variant={activeMode === 'dictionary' ? 'primary' : 'secondary'}
                onClick={() => setActiveMode('dictionary')}
                iconStart={<BookMarked size={15} />}
              >
                Dictionary
              </Button>
            </div>

            {tab === 'free' && (
              <div className="mt-6 rounded-2xl border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] p-4">
                <div className="mt-4">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Button
                      as="button"
                      type="button"
                      variant="secondary"
                      onClick={() => setManualSelectedIds(allSectionCharacterIds)}
                    >
                      {language === 'tr' ? 'Tumunu sec' : 'Select all'}
                    </Button>
                    <Button
                      as="button"
                      type="button"
                      variant="secondary"
                      onClick={() => setManualSelectedIds([])}
                    >
                      {language === 'tr' ? 'Temizle' : 'Clear'}
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {sections.map((section) => (
                      <div key={section.id} className="space-y-2">
                        <div className="text-xs font-black uppercase tracking-[0.12em] text-[var(--kt-ink-subtle)]">
                          {section.title}
                        </div>
                        {section.matrix.map((row, rowIndex) => (
                          <div
                            key={`${section.id}-${rowIndex}`}
                            className="grid gap-2"
                            style={{ gridTemplateColumns: `repeat(${Math.max(row.length, 1)}, minmax(0, 1fr))` }}
                          >
                            {row.map((cell, columnIndex) => {
                              if (!cell) {
                                return (
                                  <div
                                    key={`empty-${section.id}-${rowIndex}-${columnIndex}`}
                                    className="rounded-lg border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] opacity-35"
                                  />
                                );
                              }

                              const itemId = cell.id;
                              const item = getKanaItemById(itemId);
                              const selected = manualSelectedIds.includes(itemId);

                              return (
                                <button
                                  key={itemId}
                                  type="button"
                                  onClick={() =>
                                    setManualSelectedIds((prev) =>
                                      selected ? prev.filter((id) => id !== itemId) : [...prev, itemId]
                                    )
                                  }
                                  className={`rounded-lg border px-2 py-2 text-center transition ${
                                    selected
                                      ? 'border-[var(--kt-accent-info)] bg-[var(--kt-accent-info-soft)]'
                                      : 'border-[var(--kt-border-subtle)] bg-[var(--kt-surface)]'
                                  }`}
                                >
                                  <div className="font-jp text-xl font-black text-[var(--kt-ink-strong)]">{item?.char ?? '?'}</div>
                                  <div className="text-[10px] font-black uppercase text-[var(--kt-ink-subtle)]">{item?.romaji ?? itemId}</div>
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeMode && modeIntro && (
              <div className="mt-6 rounded-2xl border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-lg font-black text-[var(--kt-ink-strong)]">{modeIntro.title}</div>
                    <p className="mt-1 text-sm text-[var(--kt-ink-muted)]">{modeIntro.text}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--kt-ink-subtle)]">
                      {language === 'tr' ? 'Secili karakter' : 'Selected characters'}: {focusItemIds.length}
                    </p>
                  </div>
                  <Button
                    as="button"
                    type="button"
                    onClick={() => {
                      if (!activeMode || focusItemIds.length === 0) {
                        return;
                      }
                      const params = new URLSearchParams();
                      params.set('script', script);
                      params.set('tab', tab);
                      params.set('mode', activeMode);
                      if (tab === 'free') {
                        params.set('ids', focusItemIds.join(','));
                      }
                      navigate(`${appShellRoutes.practiceRun}?${params.toString()}`);
                    }}
                    disabled={focusItemIds.length === 0 || !activeMode}
                  >
                    {language === 'tr' ? 'Basla' : 'Start'}
                  </Button>
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {tab === 'stats' && (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
          <Card padding="lg">
            <h2 className="text-3xl font-black text-[var(--kt-ink-strong)]">
              {language === 'tr' ? 'Zayif gruplar' : 'Weak groups'}
            </h2>
            <div className="mt-5 grid gap-3">
              {groupStats.map((group) => (
                <div
                  key={group.groupId}
                  className="rounded-[1.4rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-lg font-black text-[var(--kt-ink-strong)]">{group.groupLabel}</div>
                      <div className="text-sm text-[var(--kt-ink-muted)]">{group.sectionTitle}</div>
                    </div>
                    <div className="text-right text-sm text-[var(--kt-ink-muted)]">
                      <div>{`Weak ${group.weak}`}</div>
                      <div>{`Due ${group.due}`}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <StatCard label="Tracked" value={summary.tracked} />
            <StatCard label="Due" value={summary.dueCount} tone="warning" />
            <StatCard label="Weak" value={summary.weakCount} tone="danger" />
            <StatCard label="Mastered" value={summary.masteredCount} tone="success" />
            <Card padding="lg">
              <div className="flex items-center gap-3">
                <Brain size={18} className="text-[var(--kt-accent-plum)]" />
                <h3 className="text-xl font-black text-[var(--kt-ink-strong)]">
                  {language === 'tr' ? 'Son hatalar' : 'Recent mistakes'}
                </h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {weakEntries.slice(0, 12).map((entry) => {
                  const item = getKanaItemById(entry.kanaId);

                  return (
                    <span
                      key={entry.kanaId}
                      className="rounded-full border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-3 py-2 text-sm font-semibold text-[var(--kt-ink)]"
                    >
                      {`${item?.char ?? entry.kanaId} x${entry.timesWrong}`}
                    </span>
                  );
                })}
              </div>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
};
