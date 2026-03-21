import React, { useMemo, useState } from 'react';
import { ArrowRight, BookA, CheckCircle2, Headphones, Keyboard, PenTool } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { scriptLandingContent, ScriptAccentTone } from '../data/scriptLandingContent';
import { KanaSection, ScriptStudyView, WordItem } from '../types';
import { OverviewDemoFrame } from './overview/OverviewDemoFrame';
import { ScriptStudyDetailModal } from './ScriptStudyDetailModal';

interface Props {
  title: string;
  language: AppLanguage;
  script: 'hiragana' | 'katakana';
  sections: KanaSection[];
  words: WordItem[];
  availableViews: ScriptStudyView[];
  onSelectView: (view: ScriptStudyView) => void;
}

const cardStyles = [
  {
    wrapper: 'bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all',
    icon: 'w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6',
    IconComponent: Keyboard
  },
  {
    wrapper: 'bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all',
    icon: 'w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6',
    IconComponent: PenTool
  },
  {
    wrapper: 'bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all',
    icon: 'w-14 h-14 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-6',
    IconComponent: Headphones
  },
  {
    wrapper: 'bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all',
    icon: 'w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6',
    IconComponent: BookA
  }
] as const;

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

export const ScriptOverviewPanel: React.FC<Props> = ({
  title,
  language,
  script,
  sections,
  words,
  availableViews,
  onSelectView
}) => {
  const copy = scriptLandingContent[language];
  const pageCopy = copy[script];
  const [activeDetailSection, setActiveDetailSection] = useState<ScriptStudyView | null>(null);

  const totalCharacters = useMemo(
    () =>
      sections.reduce(
        (total, section) => total + section.groups.reduce((groupTotal, group) => groupTotal + group.characters.length, 0),
        0
      ),
    [sections]
  );

  const handleSectionKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
    onActivate: () => void
  ) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate();
    }
  };

  const handleInnerButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    action: () => void
  ) => {
    event.stopPropagation();
    action();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="overview-hero bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-8 md:p-12 border border-indigo-100 mb-12">
        <div className="max-w-4xl">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-500">{pageCopy.hero.eyebrow}</div>
          <h1 className="overview-hero-title text-4xl md:text-5xl font-bold text-slate-900 mt-4 tracking-tight">
            {pageCopy.hero.title}
          </h1>
          <p className="overview-hero-lead text-xl text-indigo-900 mt-4 font-medium">{pageCopy.hero.lead}</p>
          <p className="overview-hero-copy text-slate-600 mt-5 max-w-3xl text-lg leading-8">{pageCopy.hero.copy}</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{pageCopy.stats.sections}</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{sections.length}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{pageCopy.stats.characters}</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{totalCharacters}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{pageCopy.stats.words}</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{words.length}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{pageCopy.stats.modes}</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{availableViews.length}</div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => onSelectView(pageCopy.hero.primaryAction.target)}
            className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm hover:shadow"
          >
            {pageCopy.hero.primaryAction.label}
            <ArrowRight size={20} className="ml-2" />
          </button>
          <button
            onClick={() => onSelectView(pageCopy.hero.secondaryAction.target)}
            className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm hover:shadow"
          >
            {pageCopy.hero.secondaryAction.label}
            <ArrowRight size={20} className="ml-2" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-20">
        {pageCopy.featureCards.map((card, index) => {
          const style = cardStyles[index];
          const IconComponent = style.IconComponent;

          return (
            <div key={card.title} className={style.wrapper}>
              <div className={style.icon}>
                <IconComponent size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{card.title}</h3>
              <p className="text-slate-600 leading-relaxed">{card.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-24 space-y-28">
        {availableViews.map((view, index) => {
          const sectionCopy = pageCopy.sections[view];
          const ui = accentUi[sectionCopy.accent];
          const reverseLayout = index % 2 === 1;

          return (
            <section
              key={view}
              className={`cursor-pointer rounded-3xl transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-slate-300 ${
                reverseLayout ? 'lg:flex-row-reverse' : 'lg:flex-row'
              } flex flex-col items-center gap-12`}
              onClick={() => setActiveDetailSection(view)}
              onKeyDown={(event) => handleSectionKeyDown(event, () => setActiveDetailSection(view))}
              role="button"
              tabIndex={0}
              aria-label={`${sectionCopy.title} ${copy.common.detailsLabel}`}
            >
              <div className="flex-1 space-y-6">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold tracking-wide uppercase ${ui.badge}`}>
                  {sectionCopy.badge}
                </div>
                <h2 className="text-3xl font-bold text-slate-900">{sectionCopy.title}</h2>
                <p className="text-lg text-slate-600 leading-relaxed">{sectionCopy.description}</p>

                <ul className="space-y-4 mt-8">
                  {sectionCopy.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircle2 className={`w-6 h-6 mr-3 flex-shrink-0 ${ui.bullet}`} />
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={(event) => handleInnerButtonClick(event, () => setActiveDetailSection(view))}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    {copy.common.detailsLabel}
                  </button>
                  <button
                    type="button"
                    onClick={(event) => handleInnerButtonClick(event, () => onSelectView(view))}
                    className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors ${ui.button}`}
                  >
                    {sectionCopy.actionLabel}
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="group relative block w-full rounded-3xl text-left">
                  <OverviewDemoFrame
                    src={sectionCopy.previewSrc}
                    alt={sectionCopy.previewAlt}
                    fallbackTitle={sectionCopy.fallbackTitle}
                    fallbackPath={sectionCopy.fallbackPath}
                  />
                  <div className="pointer-events-none absolute inset-x-5 bottom-5 rounded-2xl bg-slate-950/78 px-4 py-3 text-sm font-medium text-white shadow-lg">
                    {copy.common.gifHint}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {activeDetailSection && (
        <ScriptStudyDetailModal
          language={language}
          section={pageCopy.sections[activeDetailSection]}
          onClose={() => setActiveDetailSection(null)}
        />
      )}
    </div>
  );
};
