import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, AudioLines, BookMarked, Gamepad2, Keyboard, PenTool, Route, ShieldAlert, Sparkles, Target } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { StudyContainer } from '../components/StudyContainer';
import { WordStudyContainer } from '../components/WordStudyContainer';
import { ListeningStudyContainer } from '../components/listening/ListeningStudyContainer';
import { AppLanguage } from '../data/appPreferences';
import {
  appShellRoutes,
  getKanaItemRoute,
  getKanaStatsRoute,
  KanaAppScope
} from '../data/appShellContent';
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
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Eyebrow,
  PageHeader,
  PageSection,
  PageShell,
  StatCard
} from '../shared/ui';

type KanaPathVariant = 'learn' | 'review' | 'weak' | 'confusable' | 'play';
type ActiveView = 'overview' | 'typing' | 'drawing' | 'listening' | 'dictionary';
type PlayViewQuery = 'overview' | 'typing' | 'drawing' | 'listening' | 'flashcards' | 'dictionary';

interface KanaPathPageProps {
  script: KanaScript;
  language: AppLanguage;
  variant: KanaPathVariant;
  scope?: KanaAppScope;
}

const overviewRouteByScript: Record<KanaScript, string> = {
  hiragana: appShellRoutes.hiraganaOverview,
  katakana: appShellRoutes.katakanaOverview
};

const scriptTitleMap: Record<KanaScript, string> = {
  hiragana: 'Hiragana',
  katakana: 'Katakana'
};

const variantIconMap = {
  learn: Route,
  review: Target,
  weak: ShieldAlert,
  confusable: Sparkles,
  play: Gamepad2
} as const;

const pageCopy = {
  tr: {
    back: 'Overview sayfasina don',
    stats: 'Stats ekrani',
    openMode: 'Modu ac',
    backToFlow: 'Akisa don',
    modeDetailsTitle: 'Mode detaylari',
    modeDetailsDescription: 'Her mode tek bir kartta odak, olcum ve calisma bicimi ile gosterilir.',
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
      confusable: 'Confusable setler',
      play: 'Serbest havuz'
    },
    modeDescriptions: {
      typing: 'Romaji recall ve hiz kontrolu.',
      drawing: 'Form ve stroke tekrarini guclendir.',
      listening: 'Ses -> karakter bagini kontrol et.',
      dictionary: 'Kelime havuzunda script odakli orneklerle baglam kur.'
    },
    modeDetails: {
      typing: [
        'Girdi: Romaji -> kana eslesmesi.',
        'Olcum: typing skoru ve dogru hizli recall.',
        'Kullanim: Kisa sureli hizli tekrar seanslari.'
      ],
      drawing: [
        'Girdi: Karakteri cizerek hatirlama.',
        'Olcum: drawing skoru ve form tutarliligi.',
        'Kullanim: El yazisi ve sekil pekistirme.'
      ],
      listening: [
        'Girdi: Ses kaydi -> dogru karakter secimi.',
        'Olcum: listening skoru ve isitsel ayrim.',
        'Kullanim: Benzer sesleri ayirt etme calismasi.'
      ],
      dictionary: [
        'Girdi: Script odakli kelime ornekleri.',
        'Odak: Karakteri kelime icinde baglama oturtma.',
        'Kullanim: Flashcards benzeri baglamsal tekrar.'
      ]
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
      },
      play: {
        eyebrow: 'Play',
        title: (scriptTitle: string) => `${scriptTitle} serbest calisma alani`,
        description: 'Learn path kisiti olmadan istedigin gruptan baslayip istedigin sirada calis.'
      }
    }
  },
  en: {
    back: 'Back to overview',
    stats: 'Open stats',
    openMode: 'Open mode',
    backToFlow: 'Back to flow',
    modeDetailsTitle: 'Mode details',
    modeDetailsDescription: 'Each mode is shown in a single card with focus, measurement, and study style.',
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
      confusable: 'Confusable sets',
      play: 'Free-form pool'
    },
    modeDescriptions: {
      typing: 'Romaji recall and speed control.',
      drawing: 'Reinforce form and stroke recall.',
      listening: 'Check the sound-to-character link.',
      dictionary: 'Build context from script-focused vocabulary pools.'
    },
    modeDetails: {
      typing: [
        'Input: Romaji -> kana mapping.',
        'Measured by typing score and quick recall accuracy.',
        'Best for short, high-frequency repetition bursts.'
      ],
      drawing: [
        'Input: Draw the character from memory.',
        'Measured by drawing score and shape consistency.',
        'Best for handwriting and visual form reinforcement.'
      ],
      listening: [
        'Input: Audio cue -> correct character match.',
        'Measured by listening score and auditory discrimination.',
        'Best for separating similar-sounding kana.'
      ],
      dictionary: [
        'Input: Script-focused vocabulary examples.',
        'Focus: Build character meaning in context.',
        'Best for flashcard-like contextual reinforcement.'
      ]
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
      },
      play: {
        eyebrow: 'Play',
        title: (scriptTitle: string) => `${scriptTitle} free-form area`,
        description: 'Start from any group and study in any order without learn-path gating.'
      }
    }
  }
} as const;

const modeCards = {
  typing: {
    label: 'Typing',
    descriptionKey: 'typing' as const,
    Icon: Keyboard,
    gifSrc: 'gifs/typing-demo.gif',
    gifAlt: 'Typing mode preview gif'
  },
  drawing: {
    label: 'Drawing',
    descriptionKey: 'drawing' as const,
    Icon: PenTool,
    gifSrc: 'gifs/drawing-demo.gif',
    gifAlt: 'Drawing mode preview gif'
  },
  listening: {
    label: 'Listening',
    descriptionKey: 'listening' as const,
    Icon: AudioLines,
    gifSrc: 'gifs/listening-demo.gif',
    gifAlt: 'Listening mode preview gif'
  },
  dictionary: {
    label: 'Dictionary',
    descriptionKey: 'dictionary' as const,
    Icon: BookMarked,
    gifSrc: 'gifs/dictionary-demo.gif',
    gifAlt: 'Dictionary mode preview gif'
  }
} as const;

const getPublicAssetPath = (assetPath: string) => {
  const basePath = import.meta.env.BASE_URL ?? '/';
  return `${basePath.replace(/\/$/, '')}/${assetPath.replace(/^\/+/, '')}`;
};

const getSectionsForScript = (script: KanaScript, language: AppLanguage) =>
  script === 'hiragana'
    ? getLocalizedHiraganaSections(language)
    : getLocalizedKatakanaSections(language);

const resolveActiveViewFromQuery = (value: string | null): ActiveView => {
  const normalizedValue = (value ?? '').toLowerCase() as PlayViewQuery;

  if (normalizedValue === 'typing') return 'typing';
  if (normalizedValue === 'drawing') return 'drawing';
  if (normalizedValue === 'listening') return 'listening';
  if (normalizedValue === 'dictionary' || normalizedValue === 'flashcards') return 'dictionary';
  return 'overview';
};

export const KanaPathPage: React.FC<KanaPathPageProps> = ({
  script,
  language,
  variant,
  scope = 'study' as KanaAppScope
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const resolvedScope: KanaAppScope = scope;
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
  const [failedModePreviews, setFailedModePreviews] = useState<Record<string, boolean>>({});
  const [activeView, setActiveView] = useState<ActiveView>(() =>
    variant === 'play' ? resolveActiveViewFromQuery(searchParams.get('view')) : 'overview'
  );

  useEffect(() => {
    setFailedModePreviews({});
  }, [language, script, variant]);

  useEffect(() => {
    if (variant !== 'play') return;
    setActiveView(resolveActiveViewFromQuery(searchParams.get('view')));
  }, [searchParams, variant]);

  const setActiveViewWithRoute = useCallback(
    (nextView: ActiveView) => {
      setActiveView(nextView);

      if (variant !== 'play') return;

      const nextSearchParams = new URLSearchParams(searchParams);

      if (nextView === 'overview') {
        nextSearchParams.delete('view');
      } else if (nextView === 'dictionary') {
        nextSearchParams.set('view', 'flashcards');
      } else {
        nextSearchParams.set('view', nextView);
      }

      setSearchParams(nextSearchParams, { replace: true });
    },
    [searchParams, setSearchParams, variant]
  );

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
    if (variant === 'learn') return nextGroup?.itemIds ?? [];
    if (variant === 'play') {
      return sections.flatMap((section) =>
        section.groups.flatMap((group) => group.characters.map((character) => character.id))
      );
    }
    if (variant === 'review') return reviewQueue.map((entry) => entry.kanaId);
    if (variant === 'weak') return weakEntries.map((entry) => entry.kanaId);
    return Array.from(new Set(confusableSets.flatMap((set) => set.kanaIds)));
  }, [confusableSets, nextGroup, reviewQueue, sections, variant, weakEntries]);

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
  const modeEntries = useMemo(() => {
    const entries = Object.entries(modeCards) as Array<[Exclude<ActiveView, 'overview'>, typeof modeCards.typing]>;
    return variant === 'play' ? entries : entries.filter(([modeId]) => modeId !== 'dictionary');
  }, [variant]);

  const backToFlowButton = (
    <Button
      as="button"
      type="button"
      variant="secondary"
      size="sm"
      onClick={() => setActiveViewWithRoute('overview')}
    >
      <ArrowLeft size={16} className="mr-2" />
      {copy.backToFlow}
    </Button>
  );

  const renderFlowSummary = () => {
    if (variant === 'learn') {
      return (
        <Card padding="md">
          <Eyebrow>{copy.queueLabels.learn}</Eyebrow>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--kt-ink-strong)]">
            {nextGroup ? `${nextGroup.sectionTitle} / ${nextGroup.groupLabel}` : '--'}
          </h2>
          <p className="mt-2 text-sm leading-7 text-[var(--kt-ink-muted)]">{variantCopy.description}</p>
        </Card>
      );
    }

    if (variant === 'play') {
      const totalGroups = scopedSections.reduce((total, section) => total + section.groups.length, 0);

      return (
        <Card padding="md">
          <Eyebrow>{copy.queueLabels.play}</Eyebrow>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--kt-ink-strong)]">
            {`${focusItems.length} ${language === 'tr' ? 'karakter /' : 'items /'} ${totalGroups} ${language === 'tr' ? 'grup' : 'groups'}`}
          </h2>
          <p className="mt-2 text-sm leading-7 text-[var(--kt-ink-muted)]">{variantCopy.description}</p>
        </Card>
      );
    }

    if (variant === 'review') {
      return (
        <Card padding="md">
          <CardHeader title={copy.queueTitle} description={copy.queueDescription} />
          <div className="mt-5 space-y-3">
            {reviewQueue.length === 0 && (
              <p className="text-sm text-[var(--kt-ink-muted)]">{copy.emptyDescription}</p>
            )}
            {reviewQueue.map((entry) => {
              const item = getKanaItemById(entry.kanaId);
              return (
                <div
                  key={entry.kanaId}
                  className="flex items-center justify-between rounded-[var(--kt-radius)] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-3"
                >
                  <div>
                    <div className="text-lg font-semibold text-[var(--kt-ink-strong)]">
                      {item?.char ?? entry.kanaId}
                    </div>
                    <div className="text-xs uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                      {entry.reason}
                    </div>
                  </div>
                  <Link
                    to={getKanaItemRoute(script, entry.kanaId, resolvedScope)}
                    className="text-sm font-semibold text-[var(--kt-brand)] hover:opacity-80"
                  >
                    {copy.itemLink}
                  </Link>
                </div>
              );
            })}
          </div>
        </Card>
      );
    }

    if (variant === 'weak') {
      return (
        <Card padding="md">
          <CardHeader title={copy.queueTitle} description={copy.queueDescription} />
          <div className="mt-5 space-y-3">
            {weakEntries.length === 0 && (
              <p className="text-sm text-[var(--kt-ink-muted)]">{copy.emptyDescription}</p>
            )}
            {weakEntries.map((entry) => {
              const item = getKanaItemById(entry.kanaId);
              return (
                <div
                  key={entry.kanaId}
                  className="flex items-center justify-between rounded-[var(--kt-radius)] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-3"
                >
                  <div>
                    <div className="text-lg font-semibold text-[var(--kt-ink-strong)]">
                      {item?.char ?? entry.kanaId}
                    </div>
                    <div className="text-xs uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                      {`${copy.mistakes}: ${entry.timesWrong}`}
                    </div>
                  </div>
                  <Link
                    to={getKanaItemRoute(script, entry.kanaId, resolvedScope)}
                    className="text-sm font-semibold text-[var(--kt-brand)] hover:opacity-80"
                  >
                    {copy.itemLink}
                  </Link>
                </div>
              );
            })}
          </div>
        </Card>
      );
    }

    return (
      <Card padding="md">
        <CardHeader title={copy.queueTitle} description={copy.queueDescription} />
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {confusableSets.length === 0 && (
            <p className="text-sm text-[var(--kt-ink-muted)]">{copy.emptyDescription}</p>
          )}
          {confusableSets.map((set) => (
            <div
              key={set.id}
              className="rounded-[var(--kt-radius)] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-4"
            >
              <div className="text-lg font-semibold text-[var(--kt-ink-strong)]">{set.label}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                {`${copy.confusions}: ${set.count}`}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {set.kanaIds.map((kanaId) => (
                  <Link
                    key={kanaId}
                    to={getKanaItemRoute(script, kanaId, resolvedScope)}
                    className="rounded-full border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] px-3 py-1 text-xs font-semibold text-[var(--kt-ink)] hover:bg-[var(--kt-surface-muted)]"
                  >
                    {getKanaItemById(kanaId)?.char ?? kanaId}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow={
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[var(--kt-radius)] bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] shadow-[var(--kt-shadow-sm)]">
              <HeroIcon size={20} />
            </span>
            <Eyebrow>{variantCopy.eyebrow}</Eyebrow>
          </div>
        }
        title={variantCopy.title(scriptTitle)}
        description={variantCopy.description}
        actions={
          <Button as="link" to={overviewRouteByScript[script]} variant="secondary" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            {copy.back}
          </Button>
        }
      />

      <PageSection className="mt-8" spacing="default">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Tracked" value={summary.tracked} />
          <StatCard label="Due" value={summary.dueCount} tone="warning" />
          <StatCard label="Weak" value={summary.weakCount} tone="danger" />
          <StatCard label="Mastered" value={summary.masteredCount} tone="success" />
        </div>

        {activeView === 'overview' && (
          <>
            {renderFlowSummary()}

            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-[var(--kt-ink-strong)]">
                  {copy.modeDetailsTitle}
                </h2>
                <p className="mt-2 text-sm leading-7 text-[var(--kt-ink-muted)]">
                  {copy.modeDetailsDescription}
                </p>
              </div>
              <Button as="link" to={getKanaStatsRoute(script, resolvedScope)} variant="secondary" size="sm">
                {copy.stats}
              </Button>
            </div>

            <div className="flex flex-col gap-5">
              {modeEntries.map(([modeId, modeCard]) => {
                const Icon = modeCard.Icon;
                const previewPath = getPublicAssetPath(modeCard.gifSrc);
                const hasPreviewError = Boolean(failedModePreviews[modeId]);

                return (
                  <Card key={modeId} padding="md">
                    <div className="flex flex-col gap-5 md:flex-row md:items-stretch md:justify-between md:gap-6">
                      <div className="min-w-0 flex-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-[var(--kt-radius)] bg-[var(--kt-brand-soft)] text-[var(--kt-brand)]">
                          <Icon size={22} />
                        </div>
                        <h3 className="mt-5 text-xl font-semibold text-[var(--kt-ink-strong)]">
                          {modeCard.label}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-[var(--kt-ink-muted)]">
                          {copy.modeDescriptions[modeCard.descriptionKey]}
                        </p>

                        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-6 text-[var(--kt-ink-muted)]">
                          {copy.modeDetails[modeId].map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>

                        <div className="mt-6">
                          <Button
                            as="button"
                            type="button"
                            variant="primary"
                            size="md"
                            disabled={!hasUsableItems}
                            onClick={() => setActiveViewWithRoute(modeId)}
                          >
                            {copy.openMode}
                          </Button>
                        </div>
                      </div>

                      <div className="w-full overflow-hidden rounded-[var(--kt-radius)] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] md:w-72 lg:w-80">
                        <div className="relative aspect-[16/10]">
                          {hasPreviewError ? (
                            <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
                              {modeCard.label} preview
                            </div>
                          ) : (
                            <img
                              src={previewPath}
                              alt={modeCard.gifAlt}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              onError={() => {
                                setFailedModePreviews((current) => ({
                                  ...current,
                                  [modeId]: true
                                }));
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {activeView !== 'overview' && !hasUsableItems && (
          <Card padding="md">
            <CardHeader title={copy.emptyTitle} description={copy.emptyDescription} />
            <div className="mt-5">{backToFlowButton}</div>
          </Card>
        )}

        {activeView === 'typing' && hasUsableItems && (
          <div className="space-y-4">
            {backToFlowButton}
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
            {backToFlowButton}
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
            {backToFlowButton}
            {isWordsLoading && (
              <Card padding="sm" tone="muted">
                <p className="text-sm text-[var(--kt-ink-muted)]">
                  {language === 'tr' ? 'Kelime havuzu yukleniyor...' : 'Loading word pool...'}
                </p>
              </Card>
            )}
            {wordsError && (
              <Card padding="sm">
                <div className="flex items-center gap-2">
                  <Badge tone="danger">!</Badge>
                  <p className="text-sm text-[var(--kt-accent-danger)]">{wordsError}</p>
                </div>
              </Card>
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

        {activeView === 'dictionary' && hasUsableItems && variant === 'play' && (
          <div className="space-y-4">
            {backToFlowButton}
            <WordStudyContainer title={`${scriptTitle} Dictionary`} language={language} script={script} />
          </div>
        )}
      </PageSection>
    </PageShell>
  );
};
