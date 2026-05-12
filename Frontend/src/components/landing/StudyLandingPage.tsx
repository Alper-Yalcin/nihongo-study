import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, LucideIcon } from 'lucide-react';
import {
  ScriptAccentTone,
  ScriptOverviewDetailSection
} from '../../letters/data/scriptLandingContent';
import { AppLanguage } from '../../data/appPreferences';
import { OverviewDemoFrame } from '../overview/OverviewDemoFrame';
import { ScriptStudyDetailModal } from '../ScriptStudyDetailModal';
import {
  handleLandingInnerButtonClick,
  handleLandingSectionKeyDown
} from './landingUtils';

interface StudyLandingAction {
  label: string;
  onClick: () => void;
  className: string;
}

interface StudyLandingFeatureCard {
  title: string;
  description: string;
  wrapperClassName: string;
  iconClassName: string;
  IconComponent: LucideIcon;
}

interface StudyLandingStatCard {
  label: string;
  value: number | string;
}

interface StudyLandingSectionIntro {
  eyebrow: string;
  description: string;
}

interface StudyLandingPageProps<TSection extends ScriptOverviewDetailSection> {
  language: AppLanguage;
  commonCopy: {
    detailsLabel: string;
    gifHint: string;
  };
  heroTheme: {
    containerClassName: string;
    eyebrowClassName: string;
    leadClassName: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    copy: string;
    primaryAction: StudyLandingAction;
    secondaryAction: StudyLandingAction;
  };
  stats: StudyLandingStatCard[];
  statsGridClassName: string;
  featureCards: StudyLandingFeatureCard[];
  featureGridClassName: string;
  sections: TSection[];
  onSectionAction: (section: TSection) => void;
  getSectionActionLabel?: (section: TSection) => string;
  sectionIntro?: StudyLandingSectionIntro;
}

const accentUi: Record<
  ScriptAccentTone,
  {
    badge: string;
    bullet: string;
    button: string;
  }
> = {
  indigo: {
    badge: 'bg-indigo-100 text-indigo-700',
    bullet: 'text-indigo-500',
    button: 'bg-indigo-600 hover:bg-indigo-700'
  },
  emerald: {
    badge: 'bg-emerald-100 text-emerald-700',
    bullet: 'text-emerald-500',
    button: 'bg-emerald-600 hover:bg-emerald-700'
  },
  rose: {
    badge: 'bg-rose-100 text-rose-700',
    bullet: 'text-rose-500',
    button: 'bg-rose-600 hover:bg-rose-700'
  },
  amber: {
    badge: 'bg-amber-100 text-amber-700',
    bullet: 'text-amber-500',
    button: 'bg-amber-600 hover:bg-amber-700'
  },
  slate: {
    badge: 'bg-slate-200 text-slate-700',
    bullet: 'text-slate-500',
    button: 'bg-slate-700 hover:bg-slate-800'
  }
};

export const StudyLandingPage = <TSection extends ScriptOverviewDetailSection>({
  language,
  commonCopy,
  heroTheme,
  hero,
  stats,
  statsGridClassName,
  featureCards,
  featureGridClassName,
  sections,
  onSectionAction,
  getSectionActionLabel,
  sectionIntro
}: StudyLandingPageProps<TSection>) => {
  const [activeDetailSectionId, setActiveDetailSectionId] = useState<string | null>(null);
  const detailSection = sections.find((section) => section.id === activeDetailSectionId) ?? null;

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className={`overview-hero mb-12 rounded-3xl border p-8 md:p-12 ${heroTheme.containerClassName}`}>
          <div className="max-w-4xl">
            <div className={`text-xs font-semibold uppercase tracking-[0.35em] ${heroTheme.eyebrowClassName}`}>
              {hero.eyebrow}
            </div>
            <h1 className="overview-hero-title mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              {hero.title}
            </h1>
            <p className={`overview-hero-lead mt-4 text-xl font-medium ${heroTheme.leadClassName}`}>
              {hero.lead}
            </p>
            <p className="overview-hero-copy mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              {hero.copy}
            </p>
          </div>

          <div className={`mt-8 grid gap-4 ${statsGridClassName}`}>
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {stat.label}
                </div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={hero.primaryAction.onClick}
              className={`flex w-full items-center justify-center rounded-xl px-8 py-4 font-semibold text-white transition-colors shadow-sm hover:shadow sm:w-auto ${hero.primaryAction.className}`}
            >
              {hero.primaryAction.label}
              <ArrowRight size={20} className="ml-2" />
            </button>
            <button
              onClick={hero.secondaryAction.onClick}
              className={`flex w-full items-center justify-center rounded-xl px-8 py-4 font-semibold text-white transition-colors shadow-sm hover:shadow sm:w-auto ${hero.secondaryAction.className}`}
            >
              {hero.secondaryAction.label}
              <ArrowRight size={20} className="ml-2" />
            </button>
          </div>
        </div>

        <div className={`mb-20 grid ${featureGridClassName}`}>
          {featureCards.map((card) => {
            const IconComponent = card.IconComponent;

            return (
              <div key={card.title} className={card.wrapperClassName}>
                <div className={card.iconClassName}>
                  <IconComponent size={28} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-800">{card.title}</h3>
                <p className="leading-relaxed text-slate-600">{card.description}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-28">
          {sectionIntro && (
            <div className="mb-4">
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                {sectionIntro.eyebrow}
              </div>
              <p className="mt-2 text-lg leading-8 text-slate-600">{sectionIntro.description}</p>
            </div>
          )}

          {sections.map((section, index) => {
            const ui = accentUi[section.accent];
            const reverseLayout = index % 2 === 1;
            const actionLabel = getSectionActionLabel?.(section) ?? section.actionLabel;

            return (
              <section
                key={section.id}
                className={`flex flex-col items-center gap-12 rounded-3xl cursor-pointer transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-slate-300 ${
                  reverseLayout ? 'lg:flex-row-reverse' : 'lg:flex-row'
                }`}
                onClick={() => setActiveDetailSectionId(section.id)}
                onKeyDown={(event) =>
                  handleLandingSectionKeyDown(event, () => setActiveDetailSectionId(section.id))
                }
                role="button"
                tabIndex={0}
                aria-label={`${section.title} ${commonCopy.detailsLabel}`}
              >
                <div className="flex-1 space-y-6">
                  <div className={`inline-block rounded-full px-3 py-1 text-sm font-semibold uppercase tracking-wide ${ui.badge}`}>
                    {section.badge}
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">{section.title}</h2>
                  <p className="text-lg leading-relaxed text-slate-600">{section.description}</p>

                  <ul className="mt-8 space-y-4">
                    {section.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <CheckCircle2 className={`mr-3 h-6 w-6 flex-shrink-0 ${ui.bullet}`} />
                        <span className="font-medium text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                    <button
                      type="button"
                      onClick={(event) =>
                        handleLandingInnerButtonClick(event, () => setActiveDetailSectionId(section.id))
                      }
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      {commonCopy.detailsLabel}
                    </button>
                    <button
                      type="button"
                      onClick={(event) =>
                        handleLandingInnerButtonClick(event, () => onSectionAction(section))
                      }
                      className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors ${ui.button}`}
                    >
                      {actionLabel}
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="group relative block w-full rounded-3xl text-left">
                    <OverviewDemoFrame
                      src={section.previewSrc}
                      alt={section.previewAlt}
                      fallbackTitle={section.fallbackTitle}
                      fallbackPath={section.fallbackPath}
                    />
                    <div className="pointer-events-none absolute inset-x-5 bottom-5 rounded-2xl bg-slate-950/78 px-4 py-3 text-sm font-medium text-white shadow-lg">
                      {commonCopy.gifHint}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
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
