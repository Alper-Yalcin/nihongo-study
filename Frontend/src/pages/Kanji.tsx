import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpenText,
  Layers3
} from 'lucide-react';
import { SectionCard } from '../components/SectionCard';
import {
  Button,
  Card,
  Eyebrow,
  PageHeader,
  PageSection,
  PageShell
} from '../components/ui';
import { StudyNavigator } from '../components/StudyNavigator';
import { AppLanguage } from '../data/appPreferences';
import { useDictionaryWordSearch } from '../data/words';
import { kanjiContent } from '../data/studyContent';
import { KanjiOverviewTrack, scriptLandingContent } from '../content/scriptLandingContent';
import { StudyLandingPage } from '../components/landing/StudyLandingPage';
import { getBackToOverviewLabel } from '../components/landing/landingUtils';
import { WordItem } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface Props {
  language: AppLanguage;
}

type KanjiTrackSectionId = 'beginner' | 'intermediate' | 'advanced';
type KanjiLearningStatus = 'new' | 'review' | 'known';

interface KanjiTrackExample {
  id: string;
  surface: string;
  reading: string;
  meaning: string;
}

interface KanjiTrackItem {
  char: string;
  frequency: number;
  readings: string[];
  meanings: string[];
  examples: KanjiTrackExample[];
}

interface KanjiMvpProgressState {
  statusByChar: Record<string, KanjiLearningStatus>;
  activityDays: string[];
}

const KANJI_MVP_PROGRESS_STORAGE_KEY = 'kototsuna.kanji.mvp-progress.v1';
const LEGACY_KANJI_MVP_PROGRESS_STORAGE_KEY = 'kotonoha.kanji.mvp-progress.v1';
const kanjiCharPattern = /[\u4E00-\u9FFF]/g;

const createInitialKanjiMvpProgressState = (): KanjiMvpProgressState => ({
  statusByChar: {},
  activityDays: []
});

const deserializeKanjiMvpProgressState = (value: string): KanjiMvpProgressState => {
  try {
    const parsed = JSON.parse(value) as Partial<KanjiMvpProgressState>;

    if (!parsed || typeof parsed !== 'object') {
      return createInitialKanjiMvpProgressState();
    }

    const statusByChar =
      parsed.statusByChar && typeof parsed.statusByChar === 'object'
        ? Object.fromEntries(
            Object.entries(parsed.statusByChar).filter((entry): entry is [string, KanjiLearningStatus] => {
              const [, status] = entry;
              return status === 'new' || status === 'review' || status === 'known';
            })
          )
        : {};

    const activityDays = Array.isArray(parsed.activityDays)
      ? parsed.activityDays.filter((item): item is string => typeof item === 'string').slice(0, 90)
      : [];

    return {
      statusByChar,
      activityDays
    };
  } catch {
    return createInitialKanjiMvpProgressState();
  }
};

const getLocalDayKey = (dateValue: Date | string) => {
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const calculateActivityStreak = (activityDays: string[]) => {
  if (activityDays.length === 0) {
    return 0;
  }

  const daySet = new Set(activityDays);
  const today = new Date();
  const todayKey = getLocalDayKey(today);
  const yesterday = addDays(today, -1);
  const yesterdayKey = getLocalDayKey(yesterday);

  if (!daySet.has(todayKey) && !daySet.has(yesterdayKey)) {
    return 0;
  }

  let streak = 0;
  let cursor = daySet.has(todayKey) ? today : yesterday;

  while (daySet.has(getLocalDayKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
};

const resolveWordMeanings = (word: WordItem) => {
  if (Array.isArray(word.meanings) && word.meanings.length > 0) {
    return word.meanings.map((meaning) => meaning.trim()).filter((meaning) => meaning.length > 0);
  }

  if (typeof word.meaning === 'string' && word.meaning.trim().length > 0) {
    return word.meaning
      .split(';')
      .map((meaning) => meaning.trim())
      .filter((meaning) => meaning.length > 0);
  }

  return [];
};

const buildKanjiTrackItems = (words: WordItem[], maxCharacters = 140): KanjiTrackItem[] => {
  const aggregates = new Map<string, {
    frequency: number;
    readings: Set<string>;
    meanings: Set<string>;
    examples: KanjiTrackExample[];
  }>();

  words.forEach((word) => {
    if (typeof word.kanji !== 'string' || word.kanji.trim().length === 0) {
      return;
    }

    const matchedChars = word.kanji.match(kanjiCharPattern);

    if (!matchedChars || matchedChars.length === 0) {
      return;
    }

    const uniqueChars = Array.from(new Set(matchedChars));
    const meanings = resolveWordMeanings(word);
    const primaryMeaning = meanings[0] ?? '-';

    uniqueChars.forEach((char) => {
      const aggregate =
        aggregates.get(char) ?? {
          frequency: 0,
          readings: new Set<string>(),
          meanings: new Set<string>(),
          examples: []
        };

      aggregate.frequency += 1;

      if (word.kana.trim().length > 0) {
        aggregate.readings.add(word.kana.trim());
      }

      meanings.slice(0, 3).forEach((meaning) => aggregate.meanings.add(meaning));

      if (aggregate.examples.length < 3) {
        aggregate.examples.push({
          id: word.id,
          surface: word.kanji ?? word.kana,
          reading: word.kana,
          meaning: primaryMeaning
        });
      }

      aggregates.set(char, aggregate);
    });
  });

  return Array.from(aggregates.entries())
    .sort((left, right) => {
      const frequencyDiff = right[1].frequency - left[1].frequency;

      if (frequencyDiff !== 0) {
        return frequencyDiff;
      }

      return left[0].localeCompare(right[0]);
    })
    .slice(0, maxCharacters)
    .map(([char, aggregate]) => ({
      char,
      frequency: aggregate.frequency,
      readings: Array.from(aggregate.readings).slice(0, 3),
      meanings: Array.from(aggregate.meanings).slice(0, 3),
      examples: aggregate.examples.slice(0, 2)
    }));
};

const kanjiTrackRanges: Record<KanjiTrackSectionId, [number, number]> = {
  beginner: [0, 50],
  intermediate: [50, 100],
  advanced: [100, 140]
};

const kanjiMvpCopy = {
  tr: {
    loading: 'Kanji havuzu yukleniyor...',
    error: 'Kanji havuzu yuklenemedi.',
    empty: 'Bu bolum icin yeterli kanji karakteri bulunamadi.',
    stats: {
      track: 'Track',
      known: 'Bilinen',
      review: 'Review',
      streak: 'Streak'
    },
    labels: {
      reading: 'Okunus',
      meaning: 'Anlam',
      example: 'Ornek',
      context: 'Baglam',
      frequency: 'Kullanim'
    },
    actions: {
      known: 'Biliyorum',
      review: 'Tekrar et',
      markNew: 'Sifirla'
    },
    statuses: {
      known: 'Biliniyor',
      review: 'Review',
      new: 'Yeni'
    },
    contextWithExample: (surface: string) => `${surface} icinde tekrar gorunur.`,
    fallbackContext: 'Bu karakter track icinde yuksek frekansli kelimelerde gorunur.'
  },
  en: {
    loading: 'Loading kanji pool...',
    error: 'Failed to load kanji pool.',
    empty: 'Not enough kanji characters were found for this section.',
    stats: {
      track: 'Track',
      known: 'Known',
      review: 'Review',
      streak: 'Streak'
    },
    labels: {
      reading: 'Reading',
      meaning: 'Meaning',
      example: 'Example',
      context: 'Context',
      frequency: 'Usage'
    },
    actions: {
      known: 'Know it',
      review: 'Needs review',
      markNew: 'Reset'
    },
    statuses: {
      known: 'Known',
      review: 'Review',
      new: 'New'
    },
    contextWithExample: (surface: string) => `Shows up again in ${surface}.`,
    fallbackContext: 'This character appears frequently inside the current track.'
  }
} as const;

const featureCardStyles = [
  {
    wrapper: 'bg-[var(--kt-surface)] p-8 rounded-2xl shadow-sm border border-[var(--kt-border)] hover:border-emerald-300 hover:shadow-md transition-all',
    icon: 'w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6',
    IconComponent: Layers3
  },
  {
    wrapper: 'bg-[var(--kt-surface)] p-8 rounded-2xl shadow-sm border border-[var(--kt-border)] hover:border-emerald-300 hover:shadow-md transition-all',
    icon: 'w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6',
    IconComponent: BookOpenText
  },
  {
    wrapper: 'bg-[var(--kt-surface)] p-8 rounded-2xl shadow-sm border border-[var(--kt-border)] hover:border-emerald-300 hover:shadow-md transition-all',
    icon: 'w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6',
    IconComponent: ArrowLeft
  }
] as const;

export const Kanji: React.FC<Props> = ({ language }) => {
  const copy = kanjiContent[language];
  const mvpCopy = kanjiMvpCopy[language];
  const landingCopy = scriptLandingContent[language];
  const pageCopy = landingCopy.kanji;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeView, setActiveView] = useState<'overview' | 'study'>('overview');

  const [mvpProgress, setMvpProgress] = usePersistentState<KanjiMvpProgressState>(
    KANJI_MVP_PROGRESS_STORAGE_KEY,
    createInitialKanjiMvpProgressState,
    {
      serialize: JSON.stringify,
      deserialize: deserializeKanjiMvpProgressState,
      legacyKeys: [LEGACY_KANJI_MVP_PROGRESS_STORAGE_KEY]
    }
  );

  const kanjiWordState = useDictionaryWordSearch({
    script: 'kanji',
    limit: 240,
    offset: 0
  });

  const trackItems = useMemo(
    () => buildKanjiTrackItems(kanjiWordState.words, 140),
    [kanjiWordState.words]
  );

  const currentSection = copy.sections[currentIndex];
  const currentTrackSectionId = currentSection.id as KanjiTrackSectionId;
  const [startIndex, endIndex] = kanjiTrackRanges[currentTrackSectionId] ?? [0, 0];
  const sectionTrackItems = trackItems.slice(startIndex, endIndex);

  const sectionKnownCount = sectionTrackItems.filter(
    (item) => mvpProgress.statusByChar[item.char] === 'known'
  ).length;
  const sectionReviewCount = sectionTrackItems.filter(
    (item) => mvpProgress.statusByChar[item.char] === 'review'
  ).length;
  const activityStreak = useMemo(
    () => calculateActivityStreak(mvpProgress.activityDays),
    [mvpProgress.activityDays]
  );

  const [activeChar, setActiveChar] = useState<string | null>(null);

  useEffect(() => {
    if (sectionTrackItems.length === 0) {
      setActiveChar(null);
      return;
    }

    if (!activeChar || !sectionTrackItems.some((item) => item.char === activeChar)) {
      setActiveChar(sectionTrackItems[0].char);
    }
  }, [activeChar, sectionTrackItems]);

  const activeTrackItem =
    sectionTrackItems.find((item) => item.char === activeChar) ?? sectionTrackItems[0] ?? null;

  const setCharacterStatus = (char: string, status: KanjiLearningStatus) => {
    const todayKey = getLocalDayKey(new Date());

    setMvpProgress((previous) => {
      const nextStatusByChar = {
        ...previous.statusByChar,
        [char]: status
      };
      const activityDaySet = new Set(previous.activityDays);
      activityDaySet.add(todayKey);

      return {
        statusByChar: nextStatusByChar,
        activityDays: Array.from(activityDaySet.values())
          .sort((left: string, right: string) => right.localeCompare(left))
          .slice(0, 90)
      };
    });
  };

  const clearCharacterStatus = (char: string) => {
    setMvpProgress((previous) => {
      const nextStatusByChar = { ...previous.statusByChar };
      delete nextStatusByChar[char];

      return {
        ...previous,
        statusByChar: nextStatusByChar
      };
    });
  };

  const featureCards = pageCopy.featureCards.map((card, index) => {
    const style = featureCardStyles[index];

    return {
      title: card.title,
      description: card.description,
      wrapperClassName: style.wrapper,
      iconClassName: style.icon,
      IconComponent: style.IconComponent
    };
  });
  const backToOverviewLabel = getBackToOverviewLabel(language);

  return (
    <PageShell>
      <PageHeader title={copy.pageTitle} />
      <PageSection className="mt-8" spacing="default">
        {activeView === 'overview' && (
          <StudyLandingPage<KanjiOverviewTrack>
            language={language}
            commonCopy={landingCopy.common}
            heroTheme={{
              containerClassName: 'bg-gradient-to-br from-emerald-50 to-white border-emerald-100',
              eyebrowClassName: 'text-emerald-600',
              leadClassName: 'text-emerald-900'
            }}
            hero={{
              eyebrow: pageCopy.hero.eyebrow,
              title: pageCopy.hero.title,
              lead: pageCopy.hero.lead,
              copy: pageCopy.hero.copy,
              primaryAction: {
                label: pageCopy.hero.primaryAction.label,
                onClick: () => {
                  setCurrentIndex(pageCopy.hero.primaryAction.targetIndex);
                  setActiveView('study');
                },
                className: 'bg-emerald-600 hover:bg-emerald-700'
              },
              secondaryAction: {
                label: pageCopy.hero.secondaryAction.label,
                onClick: () => {
                  setCurrentIndex(pageCopy.hero.secondaryAction.targetIndex);
                  setActiveView('study');
                },
                className: 'bg-slate-800 hover:bg-slate-900'
              }
            }}
            stats={[{ label: pageCopy.stats.tracks, value: pageCopy.sections.length }]}
            statsGridClassName="sm:max-w-xs"
            featureCards={featureCards}
            featureGridClassName="grid-cols-1 md:grid-cols-3 gap-6"
            sectionIntro={{
              eyebrow: pageCopy.tracksTitle,
              description: pageCopy.tracksDescription
            }}
            sections={pageCopy.sections}
            getSectionActionLabel={() => pageCopy.tracksAction}
            onSectionAction={(section) => {
              setCurrentIndex(section.studyIndex);
              setActiveView('study');
            }}
          />
        )}

        {activeView === 'study' && (
          <div className="space-y-6">
            <Card padding="md" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Eyebrow>{pageCopy.overviewTab}</Eyebrow>
                <h2 className="mt-2 text-2xl font-bold text-[var(--kt-ink-strong)]">
                  {currentSection.title}
                </h2>
              </div>
              <Button
                as="button"
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setActiveView('overview')}
              >
                <ArrowLeft size={16} className="mr-2" />
                {backToOverviewLabel}
              </Button>
            </Card>

            <SectionCard
              title={copy.cardTitle}
              description={copy.cardDescription}
            >
              <StudyNavigator
                title={currentSection.title}
                currentIndex={currentIndex}
                totalItems={copy.sections.length}
                onNext={() => setCurrentIndex(prev => Math.min(prev + 1, copy.sections.length - 1))}
                onPrev={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
                language={language}
              />

              {kanjiWordState.loading && (
                <div className="mt-4 rounded-xl border border-[var(--kt-border)] bg-slate-50 px-4 py-3 text-sm text-[var(--kt-ink-muted)]">
                  {mvpCopy.loading}
                </div>
              )}

              {!kanjiWordState.loading && kanjiWordState.error && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {mvpCopy.error}
                </div>
              )}

              {!kanjiWordState.loading && !kanjiWordState.error && sectionTrackItems.length === 0 && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {mvpCopy.empty}
                </div>
              )}

              {sectionTrackItems.length > 0 && (
                <div className="mt-6 space-y-6">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-[var(--kt-border)] bg-slate-50 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {mvpCopy.stats.track}
                      </div>
                      <div className="mt-2 text-2xl font-bold text-[var(--kt-ink-strong)]">{sectionTrackItems.length}</div>
                    </div>
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                        {mvpCopy.stats.known}
                      </div>
                      <div className="mt-2 text-2xl font-bold text-emerald-800">{sectionKnownCount}</div>
                    </div>
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
                        {mvpCopy.stats.review}
                      </div>
                      <div className="mt-2 text-2xl font-bold text-amber-800">{sectionReviewCount}</div>
                    </div>
                    <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">
                        {mvpCopy.stats.streak}
                      </div>
                      <div className="mt-2 text-2xl font-bold text-indigo-800">{activityStreak}</div>
                    </div>
                  </div>

                  {activeTrackItem && (
                    <article className="rounded-3xl border border-[var(--kt-border)] bg-[var(--kt-surface)] p-5 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div className="rounded-2xl border border-[var(--kt-border)] bg-slate-50 px-5 py-3 text-5xl font-bold text-[var(--kt-ink-strong)]">
                            {activeTrackItem.char}
                          </div>
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                              {mvpCopy.labels.frequency}
                            </div>
                            <div className="mt-1 text-sm font-semibold text-[var(--kt-ink)]">
                              {`${activeTrackItem.frequency}x`}
                            </div>
                          </div>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                          mvpProgress.statusByChar[activeTrackItem.char] === 'known'
                            ? 'bg-emerald-100 text-emerald-700'
                            : mvpProgress.statusByChar[activeTrackItem.char] === 'review'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-[var(--kt-ink-muted)]'
                        }`}>
                          {mvpProgress.statusByChar[activeTrackItem.char]
                            ? mvpCopy.statuses[mvpProgress.statusByChar[activeTrackItem.char]]
                            : mvpCopy.statuses.new}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div className="rounded-2xl border border-[var(--kt-border)] bg-slate-50 p-4">
                          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                            {mvpCopy.labels.reading}
                          </div>
                          <div className="mt-2 text-sm text-[var(--kt-ink)]">
                            {activeTrackItem.readings.join(', ') || '-'}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-[var(--kt-border)] bg-slate-50 p-4">
                          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                            {mvpCopy.labels.meaning}
                          </div>
                          <div className="mt-2 text-sm text-[var(--kt-ink)]">
                            {activeTrackItem.meanings.join(', ') || '-'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 rounded-2xl border border-[var(--kt-border)] bg-slate-50 p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                          {mvpCopy.labels.example}
                        </div>
                        {activeTrackItem.examples.length > 0 ? (
                          activeTrackItem.examples.map((example) => (
                            <p key={example.id} className="text-sm text-[var(--kt-ink)]">
                              {`${example.surface} (${example.reading}) - ${example.meaning}`}
                            </p>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500">-</p>
                        )}
                        <div className="pt-1 text-xs text-slate-500">
                          <span className="font-semibold text-[var(--kt-ink-muted)]">{`${mvpCopy.labels.context}: `}</span>
                          {activeTrackItem.examples[1]
                            ? mvpCopy.contextWithExample(activeTrackItem.examples[1].surface)
                            : mvpCopy.fallbackContext}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setCharacterStatus(activeTrackItem.char, 'known')}
                          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                        >
                          {mvpCopy.actions.known}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCharacterStatus(activeTrackItem.char, 'review')}
                          className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
                        >
                          {mvpCopy.actions.review}
                        </button>
                        <button
                          type="button"
                          onClick={() => clearCharacterStatus(activeTrackItem.char)}
                          className="rounded-xl border border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-2 text-sm font-semibold text-[var(--kt-ink)] transition-colors hover:bg-[var(--kt-surface-muted)]"
                        >
                          {mvpCopy.actions.markNew}
                        </button>
                      </div>
                    </article>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {sectionTrackItems.map((item) => {
                      const status = mvpProgress.statusByChar[item.char] ?? 'new';

                      return (
                        <button
                          key={item.char}
                          type="button"
                          onClick={() => setActiveChar(item.char)}
                          className={`rounded-2xl border p-3 text-left transition-colors ${
                            activeTrackItem?.char === item.char
                              ? 'border-indigo-300 bg-indigo-50'
                              : status === 'known'
                                ? 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                                : status === 'review'
                                  ? 'border-amber-200 bg-amber-50 hover:bg-amber-100'
                                  : 'border-[var(--kt-border)] bg-[var(--kt-surface)] hover:bg-[var(--kt-surface-muted)]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-3xl font-bold text-[var(--kt-ink-strong)]">{item.char}</div>
                            <span className="rounded-full bg-[var(--kt-surface-muted)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--kt-ink-muted)]">
                              {mvpCopy.statuses[status]}
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-[var(--kt-ink-muted)]">{item.readings[0] ?? '-'}</div>
                          <div className="mt-1 line-clamp-1 text-xs text-slate-500">{item.meanings[0] ?? '-'}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </SectionCard>
          </div>
        )}
      </PageSection>
    </PageShell>
  );
};
