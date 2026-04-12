import React, { useMemo, useState } from 'react';
import { ArrowLeft, AudioLines, Keyboard, PenTool, Route, ShieldAlert, Sparkles, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { SectionCard } from '../components/SectionCard';
import { StudyContainer } from '../components/StudyContainer';
import { ListeningStudyContainer } from '../components/listening/ListeningStudyContainer';
import { AppLanguage } from '../data/appPreferences';
import { appShellRoutes } from '../data/appShellContent';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../data/studyContent';
import { useDictionaryWordSearch } from '../data/words';
import { getKanaItemById } from '../features/kana/data/kanaInventory';
import { getNextKanaCurriculumGroup } from '../features/kana/curriculum/curriculum';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import {
  buildKanaReviewQueue,
  buildScopedSectionsFromKanaIds,
  filterWordsForKanaIds,
  getKanaConfusableSets,
  getWeakKanaProgressEntries
} from '../features/kana/review/reviewSelectors';
import { KanaScript } from '../features/kana/domain/kanaItem';

type KanaPathVariant = 'learn' | 'review' | 'weak' | 'confusable';
type ActiveView = 'overview' | 'typing' | 'drawing' | 'listening';

interface KanaPathPageProps {
  script: KanaScript;
  language: AppLanguage;
  variant: KanaPathVariant;
}

const routeByVariant: Record<KanaPathVariant, Record<KanaScript, string>> = {
  learn: {
    hiragana: appShellRoutes.hiraganaLearn,
    katakana: appShellRoutes.katakanaLearn
  },
  review: {
    hiragana: appShellRoutes.hiraganaReview,
    katakana: appShellRoutes.katakanaReview
  },
  weak: {
    hiragana: appShellRoutes.hiraganaWeak,
    katakana: appShellRoutes.katakanaWeak
  },
  confusable: {
    hiragana: appShellRoutes.hiraganaConfusable,
    katakana: appShellRoutes.katakanaConfusable
  }
};

const statsRouteByScript: Record<KanaScript, string> = {
  hiragana: appShellRoutes.hiraganaStats,
  katakana: appShellRoutes.katakanaStats
};

const overviewRouteByScript: Record<KanaScript, string> = {
  hiragana: appShellRoutes.hiraganaOverview,
  katakana: appShellRoutes.katakanaOverview
};

const scriptTitleMap: Record<KanaScript, string> = {
  hiragana: 'Hiragana',
  katakana: 'Katakana'
};

const variantToneMap: Record<KanaPathVariant, string> = {
  learn: 'from-indigo-50 to-white border-indigo-100',
  review: 'from-amber-50 to-white border-amber-100',
  weak: 'from-rose-50 to-white border-rose-100',
  confusable: 'from-sky-50 to-white border-sky-100'
};

const variantIconMap = {
  learn: Route,
  review: Target,
  weak: ShieldAlert,
  confusable: Sparkles
} as const;

const pageCopy = {
  tr: {
    back: 'Overview sayfasina don',
    stats: 'Stats ekrani',
    openMode: 'Modu ac',
    backToFlow: 'Akisa don',
    focusItems: 'Odak itemler',
    focusItemsDescription: 'Bu akista oncelikli calisilacak karakterler.',
    queueTitle: 'Calisma ozeti',
    queueDescription: 'Bu rota gercek progress verisine gore hesaplanir.',
    emptyTitle: 'Su anda hazir item yok',
    emptyDescription: 'Bu akis icin kullanilabilir item bulunmuyor. Once overview veya learn akisini kullan.',
    itemLink: 'Detay',
    itemState: 'Durum',
    itemGroup: 'Grup',
    itemScores: 'Skorlar',
    dueNow: 'Due',
    mistakes: 'Hata',
    confusions: 'Karismalar',
    queueLabels: {
      learn: 'Siradaki grup',
      review: 'Due queue',
      weak: 'Weak items',
      confusable: 'Confusable setler'
    },
    modeDescriptions: {
      typing: 'Romaji recall ve hiz kontrolu.',
      drawing: 'Form ve stroke tekrarini guclendir.',
      listening: 'Ses -> karakter bagini kontrol et.'
    },
    variants: {
      learn: {
        eyebrow: 'Learn Path',
        title: (scriptTitle: string) => `${scriptTitle} icin siradaki ogrenme grubu`,
        description: 'Curriculum sirasi ve progress durumuna gore bir sonraki grup seciliyor.'
      },
      review: {
        eyebrow: 'Review Queue',
        title: (scriptTitle: string) => `${scriptTitle} due review akisi`,
        description: 'Due olan karakterler oncelik sirasina gore seciliyor.'
      },
      weak: {
        eyebrow: 'Weak Items',
        title: (scriptTitle: string) => `${scriptTitle} zayif karakter alani`,
        description: 'Son hatalar ve dusuk skorlar weak listesine tasiniyor.'
      },
      confusable: {
        eyebrow: 'Confusable Kana',
        title: (scriptTitle: string) => `${scriptTitle} karisan karakter drill'i`,
        description: 'Seed setler ve gercek karisma verisi birlikte kullaniliyor.'
      }
    }
  },
  en: {
    back: 'Back to overview',
    stats: 'Open stats',
    openMode: 'Open mode',
    backToFlow: 'Back to flow',
    focusItems: 'Focus items',
    focusItemsDescription: 'Characters prioritized for this route.',
    queueTitle: 'Flow summary',
    queueDescription: 'This route is derived from live progress data.',
    emptyTitle: 'No items are ready yet',
    emptyDescription: 'There are no usable items for this flow yet. Start from overview or the learn flow first.',
    itemLink: 'Details',
    itemState: 'State',
    itemGroup: 'Group',
    itemScores: 'Scores',
    dueNow: 'Due',
    mistakes: 'Mistakes',
    confusions: 'Confusions',
    queueLabels: {
      learn: 'Next group',
      review: 'Due queue',
      weak: 'Weak items',
      confusable: 'Confusable sets'
    },
    modeDescriptions: {
      typing: 'Romaji recall and speed control.',
      drawing: 'Reinforce form and stroke recall.',
      listening: 'Check the sound-to-character link.'
    },
    variants: {
      learn: {
        eyebrow: 'Learn Path',
        title: (scriptTitle: string) => `Next learning group for ${scriptTitle}`,
        description: 'The next group is chosen from curriculum order and current progress.'
      },
      review: {
        eyebrow: 'Review Queue',
        title: (scriptTitle: string) => `${scriptTitle} due review flow`,
        description: 'Due characters are selected by priority.'
      },
      weak: {
        eyebrow: 'Weak Items',
        title: (scriptTitle: string) => `${scriptTitle} weak-character area`,
        description: 'Recent misses and lower scores move items into the weak list.'
      },
      confusable: {
        eyebrow: 'Confusable Kana',
        title: (scriptTitle: string) => `${scriptTitle} confusion drill`,
        description: 'Seed sets and real confusion data are combined here.'
      }
    }
  }
} as const;

const modeCards = {
  typing: {
    label: 'Typing',
    descriptionKey: 'typing',
    Icon: Keyboard,
    shell: 'border-indigo-200 bg-white',
    icon: 'bg-indigo-100 text-indigo-600',
    button: 'bg-indigo-600 hover:bg-indigo-700'
  },
  drawing: {
    label: 'Drawing',
    descriptionKey: 'drawing',
    Icon: PenTool,
    shell: 'border-emerald-200 bg-white',
    icon: 'bg-emerald-100 text-emerald-600',
    button: 'bg-emerald-600 hover:bg-emerald-700'
  },
  listening: {
    label: 'Listening',
    descriptionKey: 'listening',
    Icon: AudioLines,
    shell: 'border-rose-200 bg-white',
    icon: 'bg-rose-100 text-rose-600',
    button: 'bg-rose-600 hover:bg-rose-700'
  }
} as const;

const getSectionsForScript = (script: KanaScript, language: AppLanguage) =>
  script === 'hiragana'
    ? getLocalizedHiraganaSections(language)
    : getLocalizedKatakanaSections(language);

export const KanaPathPage: React.FC<KanaPathPageProps> = ({ script, language, variant }) => {
  const copy = pageCopy[language];
  const scriptTitle = scriptTitleMap[script];
  const sections = useMemo(() => getSectionsForScript(script, language), [language, script]);
  const {
    words,
    loading: isWordsLoading,
    error: wordsError
  } = useDictionaryWordSearch({
    script,
    limit: 200,
    offset: 0
  });
  const { listByScript, summaries } = useKanaProgressStore();
  const progressEntries = listByScript(script);
  const summary = summaries[script];
  const [activeView, setActiveView] = useState<ActiveView>('overview');

  const nextGroup = useMemo(
    () => getNextKanaCurriculumGroup(script, sections, progressEntries),
    [progressEntries, script, sections]
  );
  const reviewQueue = useMemo(
    () => buildKanaReviewQueue(script, progressEntries).slice(0, 12),
    [progressEntries, script]
  );
  const weakEntries = useMemo(
    () => getWeakKanaProgressEntries(script, progressEntries).slice(0, 12),
    [progressEntries, script]
  );
  const confusableSets = useMemo(
    () => getKanaConfusableSets(script, progressEntries).slice(0, 6),
    [progressEntries, script]
  );

  const focusItemIds = useMemo(() => {
    if (variant === 'learn') {
      return nextGroup?.itemIds ?? [];
    }

    if (variant === 'review') {
      return reviewQueue.map((entry) => entry.kanaId);
    }

    if (variant === 'weak') {
      return weakEntries.map((entry) => entry.kanaId);
    }

    return Array.from(new Set(confusableSets.flatMap((set) => set.kanaIds)));
  }, [confusableSets, nextGroup, reviewQueue, variant, weakEntries]);

  const scopedSections = useMemo(
    () => buildScopedSectionsFromKanaIds(sections, focusItemIds),
    [focusItemIds, sections]
  );
  const scopedWords = useMemo(
    () => filterWordsForKanaIds(words, focusItemIds),
    [focusItemIds, words]
  );
  const focusItems = useMemo(
    () => focusItemIds.map((itemId) => getKanaItemById(itemId)).filter((item): item is NonNullable<ReturnType<typeof getKanaItemById>> => item !== null),
    [focusItemIds]
  );
  const variantCopy = copy.variants[variant];
  const HeroIcon = variantIconMap[variant];
  const hasUsableItems = scopedSections.length > 0 && focusItems.length > 0;

  const renderFlowSummary = () => {
    if (variant === 'learn') {
      return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {copy.queueLabels.learn}
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            {nextGroup ? `${nextGroup.sectionTitle} / ${nextGroup.groupLabel}` : '--'}
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">{variantCopy.description}</p>
        </div>
      );
    }

    if (variant === 'review') {
      return (
        <SectionCard title={copy.queueTitle} description={copy.queueDescription}>
          <div className="space-y-3">
            {reviewQueue.length === 0 && <p className="text-sm text-slate-500">{copy.emptyDescription}</p>}
            {reviewQueue.map((entry) => {
              const item = getKanaItemById(entry.kanaId);
              return (
                <div key={entry.kanaId} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <div className="text-lg font-semibold text-slate-900">{item?.char ?? entry.kanaId}</div>
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{entry.reason}</div>
                  </div>
                  <Link to={`/kana/item/${entry.kanaId}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                    {copy.itemLink}
                  </Link>
                </div>
              );
            })}
          </div>
        </SectionCard>
      );
    }

    if (variant === 'weak') {
      return (
        <SectionCard title={copy.queueTitle} description={copy.queueDescription}>
          <div className="space-y-3">
            {weakEntries.length === 0 && <p className="text-sm text-slate-500">{copy.emptyDescription}</p>}
            {weakEntries.map((entry) => {
              const item = getKanaItemById(entry.kanaId);
              return (
                <div key={entry.kanaId} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <div className="text-lg font-semibold text-slate-900">{item?.char ?? entry.kanaId}</div>
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{`${copy.mistakes}: ${entry.timesWrong}`}</div>
                  </div>
                  <Link to={`/kana/item/${entry.kanaId}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                    {copy.itemLink}
                  </Link>
                </div>
              );
            })}
          </div>
        </SectionCard>
      );
    }

    return (
      <SectionCard title={copy.queueTitle} description={copy.queueDescription}>
        <div className="grid gap-3 md:grid-cols-2">
          {confusableSets.length === 0 && <p className="text-sm text-slate-500">{copy.emptyDescription}</p>}
          {confusableSets.map((set) => (
            <div key={set.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="text-lg font-semibold text-slate-900">{set.label}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{`${copy.confusions}: ${set.count}`}</div>
              <div className="mt-3 flex gap-2">
                {set.kanaIds.map((kanaId) => (
                  <Link key={kanaId} to={`/kana/item/${kanaId}`} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                    {getKanaItemById(kanaId)?.char ?? kanaId}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <section className={`rounded-[2rem] border bg-gradient-to-br p-8 shadow-sm md:p-10 ${variantToneMap[variant]}`}>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <Link to={overviewRouteByScript[script]} className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900">
                <ArrowLeft size={16} className="mr-2" />
                {copy.back}
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                  <HeroIcon size={22} />
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {variantCopy.eyebrow}
                </div>
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                  {variantCopy.title(scriptTitle)}
                </h1>
                <p className="text-base leading-8 text-slate-600 md:text-lg">{variantCopy.description}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:w-[24rem]">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Tracked</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{summary.tracked}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Due</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{summary.dueCount}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Weak</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{summary.weakCount}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Mastered</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{summary.masteredCount}</div>
              </div>
            </div>
          </div>
        </section>

        {activeView === 'overview' && (
          <>
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
              <div className="space-y-6">{renderFlowSummary()}</div>
              <SectionCard title={copy.focusItems} description={copy.focusItemsDescription}>
                <div className="space-y-4">
                  {focusItems.length === 0 && <p className="text-sm text-slate-500">{copy.emptyDescription}</p>}
                  {focusItems.map((item) => {
                    const progressEntry = progressEntries.find((entry) => entry.kanaId === item.id);
                    return (
                      <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-japanese text-3xl text-slate-900" style={{ fontFamily: 'var(--font-jp-current)' }}>{item.char}</div>
                            <div className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">{item.romaji.join(', ')}</div>
                          </div>
                          <Link to={`/kana/item/${item.id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                            {copy.itemLink}
                          </Link>
                        </div>
                        <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
                          <div>
                            <div className="font-semibold text-slate-500">{copy.itemState}</div>
                            <div className="mt-1">{progressEntry?.state ?? 'new'}</div>
                          </div>
                          <div>
                            <div className="font-semibold text-slate-500">{copy.itemGroup}</div>
                            <div className="mt-1">{item.groupLabel}</div>
                          </div>
                          <div>
                            <div className="font-semibold text-slate-500">{copy.itemScores}</div>
                            <div className="mt-1">T {progressEntry?.typingScore ?? 0} / D {progressEntry?.drawingScore ?? 0} / L {progressEntry?.listeningScore ?? 0}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            </div>

            <section className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Start a focused run</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">Only the characters in this flow are loaded into the study containers below.</p>
                </div>
                <Link to={statsRouteByScript[script]} className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
                  {copy.stats}
                </Link>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {(Object.entries(modeCards) as Array<[Exclude<ActiveView, 'overview'>, typeof modeCards.typing]>).map(([modeId, modeCard]) => {
                  const Icon = modeCard.Icon;
                  return (
                    <div key={modeId} className={`rounded-3xl border p-5 shadow-sm ${modeCard.shell}`}>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${modeCard.icon}`}>
                        <Icon size={22} />
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-slate-900">{modeCard.label}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{copy.modeDescriptions[modeCard.descriptionKey]}</p>
                      <button
                        type="button"
                        onClick={() => setActiveView(modeId)}
                        disabled={!hasUsableItems}
                        className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${modeCard.button}`}
                      >
                        {copy.openMode}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {activeView !== 'overview' && !hasUsableItems && (
          <SectionCard title={copy.emptyTitle} description={copy.emptyDescription}>
            <button
              type="button"
              onClick={() => setActiveView('overview')}
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <ArrowLeft size={16} className="mr-2" />
              {copy.backToFlow}
            </button>
          </SectionCard>
        )}

        {activeView === 'typing' && hasUsableItems && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setActiveView('overview')}
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <ArrowLeft size={16} className="mr-2" />
              {copy.backToFlow}
            </button>
            <StudyContainer
              title={`${scriptTitle} ${modeCards.typing.label}`}
              language={language}
              script={script}
              sections={scopedSections}
              mode="typing"
            />
          </div>
        )}

        {activeView === 'drawing' && hasUsableItems && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setActiveView('overview')}
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <ArrowLeft size={16} className="mr-2" />
              {copy.backToFlow}
            </button>
            <StudyContainer
              title={`${scriptTitle} ${modeCards.drawing.label}`}
              language={language}
              script={script}
              sections={scopedSections}
              mode="drawing"
            />
          </div>
        )}

        {activeView === 'listening' && hasUsableItems && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setActiveView('overview')}
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <ArrowLeft size={16} className="mr-2" />
              {copy.backToFlow}
            </button>
            {isWordsLoading && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {language === 'tr' ? 'Kelime havuzu yukleniyor...' : 'Loading word pool...'}
              </div>
            )}
            {wordsError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {wordsError}
              </div>
            )}
            <ListeningStudyContainer
              title={scriptTitle}
              language={language}
              sections={scopedSections}
              words={scopedWords}
              script={script}
            />
          </div>
        )}
      </div>
    </PageContainer>
  );
};
