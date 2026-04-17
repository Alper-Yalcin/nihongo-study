import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, BookMarked, Brain, Headphones, PenTool, RefreshCcw, ShieldAlert, Shuffle, Sparkles, Type } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Button, Card, StatCard } from '../shared/ui';
import { AppLanguage } from '../data/appPreferences';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../data/studyContent';
import { useDictionaryWordSearch } from '../data/words';
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
import { StudyContainer } from '../components/StudyContainer';
import { ListeningStudyContainer } from '../components/listening/ListeningStudyContainer';
import { WordStudyContainer } from '../components/WordStudyContainer';

interface PracticePageProps {
  language: AppLanguage;
}

type PracticeTab = 'overview' | 'review' | 'weak' | 'confusable' | 'stats';
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
  stats: {
    icon: BarChart3,
    title: 'Stats',
    accent: 'from-[var(--kt-accent-success)] to-[var(--kt-accent-info)]'
  }
} as const;

export const PracticePage: React.FC<PracticePageProps> = ({ language }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedScript = searchParams.get('script');
  const script: KanaScript = requestedScript === 'katakana' ? 'katakana' : 'hiragana';
  const requestedTab = searchParams.get('tab');
  const tab: PracticeTab =
    requestedTab === 'review' || requestedTab === 'weak' || requestedTab === 'confusable' || requestedTab === 'stats'
      ? requestedTab
      : 'overview';

  const [activeMode, setActiveMode] = useState<PracticeMode>(null);

  useEffect(() => {
    setActiveMode(null);
  }, [script, tab]);

  const sections = useMemo(
    () => (script === 'hiragana' ? getLocalizedHiraganaSections(language) : getLocalizedKatakanaSections(language)),
    [language, script]
  );
  const { words, loading: wordsLoading, error: wordsError } = useDictionaryWordSearch({
    script,
    limit: 220,
    offset: 0
  });
  const { listByScript, summaries } = useKanaProgressStore();
  const summary = summaries[script];
  const progressEntries = listByScript(script);
  const reviewQueue = useMemo(() => buildKanaReviewQueue(script, progressEntries).slice(0, 16), [progressEntries, script]);
  const weakEntries = useMemo(() => getWeakKanaProgressEntries(script, progressEntries).slice(0, 16), [progressEntries, script]);
  const confusableSets = useMemo(() => getKanaConfusableSets(script, progressEntries).slice(0, 6), [progressEntries, script]);
  const groupStats = useMemo(() => getKanaGroupProgressStats(sections, progressEntries).slice(0, 8), [progressEntries, sections]);

  const focusItemIds = useMemo(() => {
    if (tab === 'review') {
      return reviewQueue.map((entry) => entry.kanaId);
    }

    if (tab === 'weak') {
      return weakEntries.map((entry) => entry.kanaId);
    }

    if (tab === 'confusable') {
      return Array.from(new Set(confusableSets.flatMap((set) => set.kanaIds)));
    }

    return [];
  }, [confusableSets, reviewQueue, tab, weakEntries]);

  const scopedSections = useMemo(() => buildScopedSectionsFromKanaIds(sections, focusItemIds), [focusItemIds, sections]);
  const scopedWords = useMemo(() => filterWordsForKanaIds(words, focusItemIds), [focusItemIds, words]);

  return (
    <div className="space-y-8 pb-8">
      <section className="rounded-[2rem] border border-[var(--kt-border)] bg-[rgba(8,14,22,0.88)] p-7 shadow-[var(--kt-shadow-lg)]">
        <div className="flex flex-wrap items-center gap-3">
          {(['hiragana', 'katakana'] as KanaScript[]).map((tabScript) => {
            const isActive = script === tabScript;

            return (
              <button
                key={tabScript}
                type="button"
                onClick={() => setSearchParams({ script: tabScript, ...(tab !== 'overview' ? { tab } : {}) })}
                className={`rounded-full px-5 py-2 text-sm font-black uppercase tracking-[0.14em] ${
                  isActive ? 'bg-[var(--kt-accent-info)] text-[var(--kt-brand-on)]' : 'bg-[rgba(255,255,255,0.05)] text-white/70'
                }`}
              >
                {tabScript === 'hiragana' ? 'Hiragana' : 'Katakana'}
              </button>
            );
          })}
        </div>
        <h1 className="mt-6 text-5xl font-black text-white">
          {language === 'tr' ? 'Alistirma merkezi' : 'Practice hub'}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/72">
          {language === 'tr'
            ? 'Review, weak, confusable ve stats artik tek bir hub icinde. Her akistan istedigin moda inline girebilirsin.'
            : 'Review, weak, confusable, and stats now live in one hub. You can jump into each mode inline from here.'}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(Object.keys(tileMeta) as Array<Exclude<PracticeTab, 'overview'>>).map((tileKey) => {
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
              } bg-[rgba(8,14,22,0.82)]`}
            >
              <div className={`inline-flex rounded-[1rem] bg-gradient-to-r p-3 text-white ${tile.accent}`}>
                <Icon size={22} />
              </div>
              <div className="mt-5 text-2xl font-black text-white">{tile.title}</div>
              <div className="mt-2 text-sm text-white/70">{value}</div>
            </button>
          );
        })}
      </section>

      {tab === 'overview' && (
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="Tracked" value={summary.tracked} />
          <StatCard label="Due" value={summary.dueCount} tone="warning" />
          <StatCard label="Mastered" value={summary.masteredCount} tone="success" />
        </section>
      )}

      {tab !== 'overview' && tab !== 'stats' && (
        <>
          <section className="rounded-[1.8rem] border border-[var(--kt-border)] bg-[var(--kt-surface)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--kt-ink-subtle)]">
                  {script === 'hiragana' ? 'Hiragana' : 'Katakana'}
                </div>
                <h2 className="mt-2 text-3xl font-black text-[var(--kt-ink-strong)]">{tileMeta[tab].title}</h2>
              </div>
              <Button as="button" type="button" variant="secondary" onClick={() => setSearchParams({ script })}>
                {language === 'tr' ? 'Huba don' : 'Back to hub'}
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button as="button" type="button" onClick={() => setActiveMode('typing')} iconStart={<Type size={15} />}>
                Typing
              </Button>
              <Button as="button" type="button" variant="secondary" onClick={() => setActiveMode('drawing')} iconStart={<PenTool size={15} />}>
                Drawing
              </Button>
              <Button as="button" type="button" variant="secondary" onClick={() => setActiveMode('listening')} iconStart={<Headphones size={15} />}>
                Listening
              </Button>
              <Button as="button" type="button" variant="secondary" onClick={() => setActiveMode('dictionary')} iconStart={<BookMarked size={15} />}>
                Dictionary
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {focusItemIds.slice(0, 18).map((itemId) => {
                const item = getKanaItemById(itemId);

                return (
                  <div
                    key={itemId}
                    className="rounded-full border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-2 text-sm font-semibold text-[var(--kt-ink)]"
                  >
                    {item?.char ?? itemId}
                  </div>
                );
              })}
            </div>
          </section>

          {activeMode === 'typing' && scopedSections.length > 0 && (
            <StudyContainer
              title={`${script === 'hiragana' ? 'Hiragana' : 'Katakana'} ${tileMeta[tab].title}`}
              language={language}
              script={script}
              sections={scopedSections}
              mode="typing"
            />
          )}

          {activeMode === 'drawing' && scopedSections.length > 0 && (
            <StudyContainer
              title={`${script === 'hiragana' ? 'Hiragana' : 'Katakana'} ${tileMeta[tab].title}`}
              language={language}
              script={script}
              sections={scopedSections}
              mode="drawing"
            />
          )}

          {activeMode === 'listening' && scopedSections.length > 0 && (
            <div className="space-y-4">
              {wordsLoading && <Card padding="md">Kelime havuzu yukleniyor...</Card>}
              {wordsError && <Card padding="md">{wordsError}</Card>}
              <ListeningStudyContainer
                title={`${script === 'hiragana' ? 'Hiragana' : 'Katakana'} ${tileMeta[tab].title}`}
                language={language}
                sections={scopedSections}
                words={scopedWords}
                script={script}
              />
            </div>
          )}

          {activeMode === 'dictionary' && (
            <WordStudyContainer
              title={`${script === 'hiragana' ? 'Hiragana' : 'Katakana'} Dictionary`}
              language={language}
              script={script}
            />
          )}
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
