import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  AudioLines,
  BookMarked,
  BookOpenText,
  Keyboard,
  PenTool,
  Route,
  ShieldAlert,
  Sparkles,
  Target
} from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { appShellRoutes, getKanaEntryRoute } from '../data/appShellContent';
import { scriptLandingContent } from '../content/scriptLandingContent';
import { studyContent } from '../data/studyContent';
import { KanaSection, ScriptStudyView } from '../types';
import { StudyTable } from './StudyTable';
import { ScriptStudyDetailModal } from './ScriptStudyDetailModal';
import { useKanaProgressSummary } from '../features/kana/progress/progressStore';

interface Props {
  title: string;
  language: AppLanguage;
  script: 'hiragana' | 'katakana';
  sections: KanaSection[];
  wordCount: number;
  availableViews: ScriptStudyView[];
}

type SummaryCardId =
  | 'nextLearn'
  | 'dueReviews'
  | 'weakItems'
  | 'confusables'
  | 'quickStart'
  | 'overallMastery';

const viewIcons = {
  typing: Keyboard,
  drawing: PenTool,
  listening: AudioLines,
  dictionary: BookMarked
} as const;

const viewCardClassMap = {
  typing: {
    shell: 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-white',
    icon: 'bg-indigo-100 text-indigo-600',
    button: 'bg-indigo-600 hover:bg-indigo-700'
  },
  drawing: {
    shell: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white',
    icon: 'bg-emerald-100 text-emerald-600',
    button: 'bg-emerald-600 hover:bg-emerald-700'
  },
  listening: {
    shell: 'border-rose-200 bg-gradient-to-br from-rose-50 to-white',
    icon: 'bg-rose-100 text-rose-600',
    button: 'bg-rose-600 hover:bg-rose-700'
  },
  dictionary: {
    shell: 'border-amber-200 bg-gradient-to-br from-amber-50 to-white',
    icon: 'bg-amber-100 text-amber-600',
    button: 'bg-amber-600 hover:bg-amber-700'
  }
} as const;

const startHrefByView: Record<'hiragana' | 'katakana', Record<ScriptStudyView, string>> = {
  hiragana: {
    typing: appShellRoutes.hiraganaLearn,
    drawing: appShellRoutes.hiraganaLearn,
    listening: appShellRoutes.hiraganaLearn,
    dictionary: appShellRoutes.hiraganaWords
  },
  katakana: {
    typing: appShellRoutes.katakanaLearn,
    drawing: appShellRoutes.katakanaLearn,
    listening: appShellRoutes.katakanaLearn,
    dictionary: appShellRoutes.katakanaWords
  }
};

const scriptToneMap = {
  hiragana: {
    heroShell: 'border-indigo-100 bg-gradient-to-br from-indigo-50 to-white',
    eyebrow: 'text-indigo-500',
    lead: 'text-indigo-900',
    accentCard: 'border-indigo-200 bg-indigo-50 text-indigo-700'
  },
  katakana: {
    heroShell: 'border-emerald-100 bg-gradient-to-br from-emerald-50 to-white',
    eyebrow: 'text-emerald-500',
    lead: 'text-emerald-900',
    accentCard: 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }
} as const;

const confusableSeeds = {
  hiragana: ['ぬ / め', 'あ / お', 'さ / ち', 'れ / わ'],
  katakana: ['シ / ツ', 'ソ / ン', 'ク / ケ', 'ス / ヌ']
} as const;

const overviewCopy = {
  tr: {
    stats: {
      sections: 'Bolum',
      characters: 'Karakter',
      words: 'Kelime',
      modes: 'Mod'
    },
    summary: {
      sectionEyebrow: 'Overview Ozeti',
      title: 'Bu ekran ne ise yariyor?',
      description:
        'Bu overview ekrani, once script alanini anlaman, sonra dogru moda gecmen icin tasarlandi. Bilgi bloklari ile aksiyon alanlari birbirinden ayrildi.',
      cards: {
        nextLearn: {
          title: 'Next Learn Group',
          description: 'Ilk oturum icin en temiz giris noktasi bu gruptan baslamak.'
        },
        dueReviews: {
          title: 'Due Reviews',
          description: 'Review queue Phase 3 ile baglanacak. Bu slot simdiden overview icinde ayrildi.'
        },
        weakItems: {
          title: 'Weak Items',
          description: 'Zayif karakter takibi progress omurgasi geldikten sonra bu bloktan gorunecek.'
        },
        confusables: {
          title: 'Confusable Kana',
          description: 'Karistirilan ciftler ayri drill olarak ele alinacak. Seed setler simdiden tanimli.'
        },
        quickStart: {
          title: 'Quick Start',
          description: 'Su anda en hizli giris, alttaki calisma kartlarindan birini secmek.'
        },
        overallMastery: {
          title: 'Overall Mastery',
          description: 'Gercek mastery ozeti progress katmani ile baglanacak. Bu blok onun yeri olarak korunuyor.'
        }
      }
    },
    actions: {
      eyebrow: 'Calismayi Baslat',
      title: 'Bilgi al, sonra dogru moda gec',
      description:
        'Aksiyon kartlari bu ekranin ikinci katmani. Buradan typing, drawing, listening ve dictionary alanlarina dogrudan gecebilirsin.',
      learnMore: 'Detayli bilgi',
      start: 'Calismaya gec',
      openFlow: 'Akisi ac'
    },
    table: {
      eyebrow: 'Kana Tablosu',
      title: 'Tablo korunuyor, giris katmani degisiyor',
      description:
        'Kana matrix yapisi ayni kaliyor. Rebuild bu tabloyu degistirmek yerine etrafindaki aciklama, yonlendirme ve baslatma deneyimini guclendiriyor.',
      groupCount: (count: number) => `${count} grup`,
      charCount: (count: number) => `${count} karakter`
    },
    reviewValue: (count: number) => `${count}`,
    weakValue: (count: number) => `${count}`,
    masteryValue: (mastered: number, total: number) => `${mastered}/${total}`,
    quickStartValue: (count: number) => `${count} mod`,
    nextLearnValue: (value: string) => value,
    confusableValue: (count: number) => `${count} seed set`,
    recentSectionLabel: 'Ilk giris icin onerilen alan'
  },
  en: {
    stats: {
      sections: 'Sections',
      characters: 'Characters',
      words: 'Words',
      modes: 'Modes'
    },
    summary: {
      sectionEyebrow: 'Overview Summary',
      title: 'What is this screen for?',
      description:
        'This overview is meant to help users understand the script first, then move into the right mode. Information blocks and action blocks are intentionally separated.',
      cards: {
        nextLearn: {
          title: 'Next Learn Group',
          description: 'For a first session, this is the cleanest place to begin.'
        },
        dueReviews: {
          title: 'Due Reviews',
          description: 'The review queue will connect in Phase 3. This slot is already reserved in the overview.'
        },
        weakItems: {
          title: 'Weak Items',
          description: 'Weak-character tracking will surface here once the progress layer exists.'
        },
        confusables: {
          title: 'Confusable Kana',
          description: 'Commonly mixed pairs will become separate drills. Seed sets are already defined.'
        },
        quickStart: {
          title: 'Quick Start',
          description: 'Right now, the fastest entry is to choose one of the study cards below.'
        },
        overallMastery: {
          title: 'Overall Mastery',
          description: 'A real mastery summary will arrive with the progress layer. This block preserves its future place.'
        }
      }
    },
    actions: {
      eyebrow: 'Start Studying',
      title: 'Read first, then move into the right mode',
      description:
        'These action cards are the second layer of the screen. They give direct entry into typing, drawing, listening, and dictionary flows.',
      learnMore: 'Learn more',
      start: 'Open mode',
      openFlow: 'Open flow'
    },
    table: {
      eyebrow: 'Kana Table',
      title: 'The table stays, the entry layer changes',
      description:
        'The kana matrix remains intact. The rebuild focuses on the explanation, guidance, and start flow around it.',
      groupCount: (count: number) => `${count} groups`,
      charCount: (count: number) => `${count} characters`
    },
    reviewValue: (count: number) => `${count}`,
    weakValue: (count: number) => `${count}`,
    masteryValue: (mastered: number, total: number) => `${mastered}/${total}`,
    quickStartValue: (count: number) => `${count} modes`,
    nextLearnValue: (value: string) => value,
    confusableValue: (count: number) => `${count} seed sets`,
    recentSectionLabel: 'Recommended first area'
  }
} as const;

export const ScriptOverviewPanel: React.FC<Props> = ({
  title,
  language,
  script,
  sections,
  wordCount,
  availableViews
}) => {
  const copy = overviewCopy[language];
  const pageCopy = scriptLandingContent[language][script];
  const viewCopy = studyContent[language].views;
  const progressSummary = useKanaProgressSummary(script);
  const [activeDetailSectionId, setActiveDetailSectionId] = useState<ScriptStudyView | null>(null);

  const totalCharacters = useMemo(
    () =>
      sections.reduce(
        (total, section) => total + section.groups.reduce((groupTotal, group) => groupTotal + group.characters.length, 0),
        0
      ),
    [sections]
  );
  const totalGroups = useMemo(
    () => sections.reduce((total, section) => total + section.groups.length, 0),
    [sections]
  );
  const nextLearnGroup = sections[0]?.groups[0]?.label ?? '--';
  const nextLearnSectionTitle = sections[0]?.title ?? title;
  const scriptTone = scriptToneMap[script];
  const detailSection = activeDetailSectionId ? pageCopy.sections[activeDetailSectionId] : null;

  const summaryCards: Array<{
    id: SummaryCardId;
    value: string;
    description: string;
    title: string;
    Icon: typeof Route;
    href?: string;
  }> = [
    {
      id: 'nextLearn',
      title: copy.summary.cards.nextLearn.title,
      description: copy.summary.cards.nextLearn.description,
      value: copy.nextLearnValue(nextLearnGroup),
      Icon: Route,
      href: script === 'hiragana' ? appShellRoutes.hiraganaLearn : appShellRoutes.katakanaLearn
    },
    {
      id: 'dueReviews',
      title: copy.summary.cards.dueReviews.title,
      description: copy.summary.cards.dueReviews.description,
      value: copy.reviewValue(progressSummary.dueCount),
      Icon: Target,
      href: script === 'hiragana' ? appShellRoutes.hiraganaReview : appShellRoutes.katakanaReview
    },
    {
      id: 'weakItems',
      title: copy.summary.cards.weakItems.title,
      description: copy.summary.cards.weakItems.description,
      value: copy.weakValue(progressSummary.weakCount),
      Icon: ShieldAlert,
      href: script === 'hiragana' ? appShellRoutes.hiraganaWeak : appShellRoutes.katakanaWeak
    },
    {
      id: 'confusables',
      title: copy.summary.cards.confusables.title,
      description: `${copy.summary.cards.confusables.description} ${confusableSeeds[script].join(', ')}`,
      value: copy.confusableValue(confusableSeeds[script].length),
      Icon: Sparkles,
      href: script === 'hiragana' ? appShellRoutes.hiraganaConfusable : appShellRoutes.katakanaConfusable
    },
    {
      id: 'quickStart',
      title: copy.summary.cards.quickStart.title,
      description: copy.summary.cards.quickStart.description,
      value: copy.quickStartValue(availableViews.length),
      Icon: ArrowRight,
      href: getKanaEntryRoute(script, 'play')
    },
    {
      id: 'overallMastery',
      title: copy.summary.cards.overallMastery.title,
      description: copy.summary.cards.overallMastery.description,
      value: copy.masteryValue(progressSummary.masteredCount, progressSummary.totalCount),
      Icon: BookOpenText
    }
  ];

  return (
    <>
      <div className="mx-auto max-w-6xl space-y-16">
        <section className={`rounded-[2rem] border p-8 shadow-sm md:p-10 ${scriptTone.heroShell}`}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
            <div className="space-y-5">
              <div className={`text-xs font-semibold uppercase tracking-[0.24em] ${scriptTone.eyebrow}`}>
                {pageCopy.hero.eyebrow}
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                  {pageCopy.hero.title}
                </h1>
                <p className={`text-lg font-medium leading-8 ${scriptTone.lead}`}>
                  {pageCopy.hero.lead}
                </p>
                <p className="max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                  {pageCopy.hero.copy}
                </p>
              </div>
              <div className={`inline-flex rounded-full border px-4 py-2 text-sm font-medium ${scriptTone.accentCard}`}>
                {`${copy.recentSectionLabel}: ${nextLearnSectionTitle}`}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {copy.stats.sections}
                </div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{sections.length}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {copy.stats.characters}
                </div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{totalCharacters}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {copy.stats.words}
                </div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{wordCount}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {copy.stats.modes}
                </div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{availableViews.length}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              {copy.summary.sectionEyebrow}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {copy.summary.title}
            </h2>
            <p className="max-w-4xl text-base leading-8 text-slate-600 md:text-lg">
              {copy.summary.description}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {summaryCards.map((card) => (
              <div key={card.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                    <card.Icon size={20} />
                  </div>
                  <div className="text-lg font-semibold text-slate-900">{card.value}</div>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-900">{card.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{card.description}</p>
                {card.href && (
                  <Link
                    to={card.href}
                    className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
                  >
                    {copy.actions.openFlow}
                    <ArrowRight size={14} className="ml-2" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              {copy.actions.eyebrow}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {copy.actions.title}
            </h2>
            <p className="max-w-4xl text-base leading-8 text-slate-600 md:text-lg">
              {copy.actions.description}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {availableViews.map((view) => {
              const sectionDetail = pageCopy.sections[view];
              const Icon = viewIcons[view];
              const style = viewCardClassMap[view];
              const startHref = startHrefByView[script][view];

              return (
                <div
                  key={view}
                  className={`rounded-3xl border p-6 shadow-sm ${style.shell}`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.icon}`}>
                    <Icon size={22} />
                  </div>
                  <div className="mt-5 space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      {viewCopy[view]}
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900">
                      {sectionDetail.title}
                    </h3>
                    <p className="text-sm leading-7 text-slate-600">
                      {sectionDetail.description}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveDetailSectionId(view)}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      {copy.actions.learnMore}
                    </button>
                    <Link
                      to={startHref}
                      className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors ${style.button}`}
                    >
                      {copy.actions.start}
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              {copy.table.eyebrow}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {copy.table.title}
            </h2>
            <p className="max-w-4xl text-base leading-8 text-slate-600 md:text-lg">
              {copy.table.description}
            </p>
          </div>

          <div className="space-y-6">
            {sections.map((section) => {
              const sectionCharacterCount = section.groups.reduce(
                (total, group) => total + group.characters.length,
                0
              );

              return (
                <div key={section.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-slate-900">{section.title}</h3>
                      <p className="max-w-3xl text-sm leading-7 text-slate-600">{section.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        {copy.table.groupCount(section.groups.length)}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        {copy.table.charCount(sectionCharacterCount)}
                      </span>
                    </div>
                  </div>
                  <StudyTable matrix={section.matrix} columnGroupIds={section.columnGroupIds} />
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {detailSection && (
        <ScriptStudyDetailModal
          language={language}
          section={detailSection}
          onClose={() => setActiveDetailSectionId(null)}
        />
      )}
    </>
  );
};
