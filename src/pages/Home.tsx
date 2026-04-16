import React, { useMemo } from 'react';
import {
  ArrowRight,
  AudioLines,
  BookMarked,
  BookOpenText,
  Gamepad2,
  GraduationCap,
  Keyboard,
  PenTool,
  Route,
  Search,
  ShieldCheck,
  Shuffle,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { AppLanguage } from '../data/appPreferences';
import { appShellRoutes } from '../data/appShellContent';
import { homeContent } from '../content/homeContent';
import { useKanaProgressSummary } from '../features/kana/progress/progressStore';

interface HomeProps {
  language: AppLanguage;
}

interface NextBestActionCard {
  id: string;
  title: string;
  reason: string;
  actionLabel: string;
  href: string;
  priority: 'high' | 'normal';
}

const shellAreaIcons = {
  study: GraduationCap,
  test: ShieldCheck,
  play: Gamepad2
} as const;

const currentSystemIcons = {
  typing: Keyboard,
  drawing: PenTool,
  listening: AudioLines,
  dictionary: BookMarked
} as const;

const foundationIcons = {
  learnPath: Route,
  reviewQueue: Shuffle,
  weakItems: ShieldCheck,
  confusables: Sparkles,
  wordBridge: BookOpenText
} as const;

const scriptRouteMap = {
  hiragana: {
    primaryHref: appShellRoutes.hiraganaOverview,
    secondaryHref: appShellRoutes.hiraganaLearn
  },
  katakana: {
    primaryHref: appShellRoutes.katakanaOverview,
    secondaryHref: appShellRoutes.katakanaPlay
  },
  kanji: {
    primaryHref: appShellRoutes.kanjiOverview,
    secondaryHref: appShellRoutes.kanjiOverview
  }
} as const;

const scriptCardShellClass = {
  hiragana: 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-white',
  katakana: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white',
  kanji: 'border-amber-200 bg-gradient-to-br from-amber-50 to-white'
} as const;

const nextBestActionCopy = {
  tr: {
    eyebrow: 'Next Best Action',
    title: 'Bugun en iyi sonraki adim',
    description:
      'Bu kartlar progress verisine gore otomatik onerilir. Once due/weak temizlenir, sonra learn ve play dengesine gecilir.',
    priorityHigh: 'Yuksek oncelik',
    priorityNormal: 'Siradaki adim',
    reasons: {
      due: (count: number) => `${count} due item bekliyor. Once review queue ile ritmi koru.`,
      weak: (count: number) => `${count} weak item goruluyor. Kisa bir weak drill etkili olur.`,
      learn: 'Yeni item acmak icin learn path tarafinda ilerleme zamani.',
      play: 'Temel denge iyi. Simdi play challenge ile pekistirme zamani.',
      kanji: 'Kanji MVP track (100-140 karakter) aktif. Reading/meaning/example kartlari hazir.'
    },
    actions: {
      review: 'Review queueyi ac',
      weak: 'Weak drilli ac',
      learn: 'Learn pathi ac',
      play: 'Play dashboardi ac',
      kanji: 'Kanji tracki ac'
    }
  },
  en: {
    eyebrow: 'Next Best Action',
    title: 'Your best next move today',
    description:
      'These cards are generated from progress signals. Clear due/weak pressure first, then continue with learn/play balance.',
    priorityHigh: 'High priority',
    priorityNormal: 'Next step',
    reasons: {
      due: (count: number) => `${count} items are due. Start with the review queue to keep momentum.`,
      weak: (count: number) => `${count} weak items detected. A short weak drill will help.`,
      learn: 'You have room to unlock new items from the learn path.',
      play: 'Core progress looks stable. Reinforce with a quick play challenge.',
      kanji: 'The Kanji MVP track (100-140 characters) is live with reading/meaning/example cards.'
    },
    actions: {
      review: 'Open review queue',
      weak: 'Open weak drill',
      learn: 'Open learn path',
      play: 'Open play dashboard',
      kanji: 'Open kanji track'
    }
  }
} as const;

const buildNextBestActionCard = (
  script: 'hiragana' | 'katakana',
  dueCount: number,
  weakCount: number,
  tracked: number,
  total: number,
  language: AppLanguage
): NextBestActionCard => {
  const copy = nextBestActionCopy[language];
  const scriptTitle = script === 'hiragana' ? 'Hiragana' : 'Katakana';

  if (dueCount > 0) {
    return {
      id: `${script}-due`,
      title: `${scriptTitle} Review`,
      reason: copy.reasons.due(dueCount),
      actionLabel: copy.actions.review,
      href: script === 'hiragana' ? appShellRoutes.hiraganaReview : appShellRoutes.katakanaReview,
      priority: 'high'
    };
  }

  if (weakCount > 0) {
    return {
      id: `${script}-weak`,
      title: `${scriptTitle} Weak Drill`,
      reason: copy.reasons.weak(weakCount),
      actionLabel: copy.actions.weak,
      href: script === 'hiragana' ? appShellRoutes.hiraganaWeak : appShellRoutes.katakanaWeak,
      priority: 'high'
    };
  }

  if (tracked < Math.max(8, Math.round(total * 0.45))) {
    return {
      id: `${script}-learn`,
      title: `${scriptTitle} Learn Path`,
      reason: copy.reasons.learn,
      actionLabel: copy.actions.learn,
      href: script === 'hiragana' ? appShellRoutes.hiraganaLearn : appShellRoutes.katakanaLearn,
      priority: 'normal'
    };
  }

  return {
    id: `${script}-play`,
    title: `${scriptTitle} Play`,
    reason: copy.reasons.play,
    actionLabel: copy.actions.play,
    href: script === 'hiragana' ? appShellRoutes.hiraganaPlay : appShellRoutes.katakanaPlay,
    priority: 'normal'
  };
};

export const Home: React.FC<HomeProps> = ({ language }) => {
  const copy = homeContent[language];
  const nextCopy = nextBestActionCopy[language];
  const hiraganaSummary = useKanaProgressSummary('hiragana');
  const katakanaSummary = useKanaProgressSummary('katakana');

  const nextBestActions = useMemo<NextBestActionCard[]>(() => {
    const hiraganaAction = buildNextBestActionCard(
      'hiragana',
      hiraganaSummary.dueCount,
      hiraganaSummary.weakCount,
      hiraganaSummary.tracked,
      hiraganaSummary.totalCount,
      language
    );
    const katakanaAction = buildNextBestActionCard(
      'katakana',
      katakanaSummary.dueCount,
      katakanaSummary.weakCount,
      katakanaSummary.tracked,
      katakanaSummary.totalCount,
      language
    );

    return [
      hiraganaAction,
      katakanaAction,
      {
        id: 'kanji-track',
        title: 'Kanji MVP',
        reason: nextCopy.reasons.kanji,
        actionLabel: nextCopy.actions.kanji,
        href: appShellRoutes.kanjiOverview,
        priority: 'normal'
      }
    ];
  }, [
    hiraganaSummary.dueCount,
    hiraganaSummary.totalCount,
    hiraganaSummary.tracked,
    hiraganaSummary.weakCount,
    katakanaSummary.dueCount,
    katakanaSummary.totalCount,
    katakanaSummary.tracked,
    katakanaSummary.weakCount,
    language,
    nextCopy.actions.kanji,
    nextCopy.reasons.kanji
  ]);

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl space-y-24">
        <section className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-[#fff4f4] via-white to-sky-50 p-8 shadow-[0_18px_40px_rgba(208,96,112,0.12)] md:p-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)] lg:items-center">
            <div className="space-y-6">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-500">
                {copy.hero.eyebrow}
              </div>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                  {copy.hero.title}
                </h1>
                <p className="max-w-3xl text-lg font-medium leading-8 text-sky-900">
                  {copy.hero.lead}
                </p>
                <p className="max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                  {copy.hero.copy}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to={appShellRoutes.hiraganaOverview}
                  className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
                >
                  {copy.hero.primaryAction}
                  <ArrowRight size={16} className="ml-2" />
                </Link>
                <Link
                  to={appShellRoutes.katakanaOverview}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  {copy.hero.secondaryAction}
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 rounded-[1.75rem] border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-slate-100 bg-white p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Study
                </div>
                <div className="mt-2 text-lg font-semibold text-slate-900">
                  Overview ve yonlendirilmis girisler
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Hiragana ve katakana alanlarina temiz bir ilk adim verir.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Test
                </div>
                <div className="mt-2 text-lg font-semibold text-slate-900">
                  Weak ve confusable odakli kontrol
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Rebuild tamamlandikca daha net bir kontrol katmani olacak.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:col-span-2 lg:col-span-1">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Play
                </div>
                <div className="mt-2 text-lg font-semibold text-slate-900">
                  Hafif, hizli ve tekrar agirlikli girisler
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Tool listesi gibi degil, urun alani gibi davranan daha akiskan bir shell.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              {nextCopy.eyebrow}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {nextCopy.title}
            </h2>
            <p className="max-w-4xl text-base leading-8 text-slate-600 md:text-lg">
              {nextCopy.description}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {nextBestActions.map((action) => (
              <div
                key={action.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-2xl font-semibold text-slate-900">{action.title}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                    action.priority === 'high'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {action.priority === 'high' ? nextCopy.priorityHigh : nextCopy.priorityNormal}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{action.reason}</p>
                <Link
                  to={action.href}
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  {action.actionLabel}
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              {copy.shellSection.eyebrow}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {copy.shellSection.title}
            </h2>
            <p className="max-w-4xl text-base leading-8 text-slate-600 md:text-lg">
              {copy.shellSection.description}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {copy.shellSection.areas.map((area) => {
              const Icon = shellAreaIcons[area.id];

              return (
                <div key={area.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-slate-900">{area.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{area.description}</p>
                  <ul className="mt-5 space-y-2">
                    {area.bullets.map((bullet) => (
                      <li key={bullet} className="text-sm text-slate-500">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-8">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              {copy.currentSystemsSection.eyebrow}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {copy.currentSystemsSection.title}
            </h2>
            <p className="max-w-4xl text-base leading-8 text-slate-600 md:text-lg">
              {copy.currentSystemsSection.description}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {copy.currentSystemsSection.systems.map((system) => {
              const Icon = currentSystemIcons[system.id];

              return (
                <div key={system.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900">{system.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{system.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-8">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              {copy.foundationSection.eyebrow}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {copy.foundationSection.title}
            </h2>
            <p className="max-w-4xl text-base leading-8 text-slate-600 md:text-lg">
              {copy.foundationSection.description}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            {copy.foundationSection.items.map((item) => {
              const Icon = foundationIcons[item.id];

              return (
                <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                      <Icon size={20} />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-8">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              {copy.scriptsSection.eyebrow}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {copy.scriptsSection.title}
            </h2>
            <p className="max-w-4xl text-base leading-8 text-slate-600 md:text-lg">
              {copy.scriptsSection.description}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {copy.scriptsSection.cards.map((card) => (
              <div
                key={card.id}
                className={`rounded-3xl border p-6 shadow-sm ${scriptCardShellClass[card.id]}`}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {card.secondaryLabel}
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-slate-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    to={scriptRouteMap[card.id].primaryHref}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    {card.actionLabel}
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                  <Link
                    to={scriptRouteMap[card.id].secondaryHref}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    {card.secondaryLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:items-start">
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                {copy.quickStartSection.eyebrow}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                {copy.quickStartSection.title}
              </h2>
              <p className="max-w-xl text-base leading-8 text-slate-600 md:text-lg">
                {copy.quickStartSection.description}
              </p>
              <Link
                to={appShellRoutes.search}
                className="inline-flex items-center text-sm font-semibold text-sky-600 transition-colors hover:text-sky-700"
              >
                <Search size={16} className="mr-2" />
                Search alanini da gor
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {copy.quickStartSection.steps.map((step) => (
                <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
};
