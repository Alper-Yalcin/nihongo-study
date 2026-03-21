import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Layers3
} from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { SectionCard } from '../components/SectionCard';
import { StudyNavigator } from '../components/StudyNavigator';
import { OverviewDemoFrame } from '../components/overview/OverviewDemoFrame';
import { ScriptStudyDetailModal } from '../components/ScriptStudyDetailModal';
import { AppLanguage } from '../data/appPreferences';
import { kanjiContent } from '../data/studyContent';
import { scriptLandingContent } from '../data/scriptLandingContent';

interface Props {
  language: AppLanguage;
}

const accentUi = {
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
  slate: {
    badge: 'bg-slate-200 text-slate-700',
    bullet: 'text-slate-500',
    button: 'bg-slate-700 hover:bg-slate-800'
  }
} as const;

export const Kanji: React.FC<Props> = ({ language }) => {
  const copy = kanjiContent[language];
  const landingCopy = scriptLandingContent[language];
  const pageCopy = landingCopy.kanji;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeView, setActiveView] = useState<'overview' | 'study'>('overview');
  const [activeDetailSection, setActiveDetailSection] = useState<string | null>(null);
  const currentSection = copy.sections[currentIndex];
  const detailSection =
    pageCopy.sections.find((section) => section.id === activeDetailSection) ?? null;
  const backToOverviewLabel = language === 'tr' ? "Overview'a don" : 'Back to overview';

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
    <PageContainer title={copy.pageTitle}>
      <div className="space-y-6">
        {activeView === 'overview' && (
          <div className="max-w-6xl mx-auto">
            <div className="overview-hero bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-8 md:p-12 border border-emerald-100 mb-12">
              <div className="max-w-4xl">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
                  {pageCopy.hero.eyebrow}
                </div>
                <h1 className="overview-hero-title text-4xl md:text-5xl font-bold text-slate-900 mt-4 tracking-tight">
                  {pageCopy.hero.title}
                </h1>
                <p className="overview-hero-lead text-xl text-emerald-900 mt-4 font-medium">
                  {pageCopy.hero.lead}
                </p>
                <p className="overview-hero-copy text-slate-600 mt-5 max-w-3xl text-lg leading-8">
                  {pageCopy.hero.copy}
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:max-w-xs">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {pageCopy.stats.tracks}
                  </div>
                  <div className="mt-2 text-3xl font-bold text-slate-900">{pageCopy.sections.length}</div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => {
                    setCurrentIndex(pageCopy.hero.primaryAction.targetIndex);
                    setActiveView('study');
                  }}
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm hover:shadow"
                >
                  {pageCopy.hero.primaryAction.label}
                  <ArrowRight size={20} className="ml-2" />
                </button>
                <button
                  onClick={() => {
                    setCurrentIndex(pageCopy.hero.secondaryAction.targetIndex);
                    setActiveView('study');
                  }}
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-900 transition-colors shadow-sm hover:shadow"
                >
                  {pageCopy.hero.secondaryAction.label}
                  <ArrowRight size={20} className="ml-2" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
              {pageCopy.featureCards.map((card, index) => (
                <div
                  key={card.title}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                    {index === 0 && <Layers3 size={28} />}
                    {index === 1 && <BookOpenText size={28} />}
                    {index === 2 && <ArrowLeft size={28} />}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{card.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>

            <div className="space-y-28">
              <div className="mb-4">
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  {pageCopy.tracksTitle}
                </div>
                <p className="mt-2 text-lg text-slate-600 leading-8">{pageCopy.tracksDescription}</p>
              </div>

              {pageCopy.sections.map((section, index) => {
                const ui = accentUi[section.accent as keyof typeof accentUi];
                const reverseLayout = index % 2 === 1;

                return (
                  <section
                    key={section.id}
                    className={`cursor-pointer rounded-3xl transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-slate-300 ${
                      reverseLayout ? 'lg:flex-row-reverse' : 'lg:flex-row'
                    } flex flex-col items-center gap-12`}
                    onClick={() => setActiveDetailSection(section.id)}
                    onKeyDown={(event) => handleSectionKeyDown(event, () => setActiveDetailSection(section.id))}
                    role="button"
                    tabIndex={0}
                    aria-label={`${section.title} ${landingCopy.common.detailsLabel}`}
                  >
                    <div className="flex-1 space-y-6">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold tracking-wide uppercase ${ui.badge}`}>
                        {section.badge}
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900">{section.title}</h2>
                      <p className="text-lg text-slate-600 leading-relaxed">{section.description}</p>

                      <ul className="space-y-4 mt-8">
                        {section.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <CheckCircle2 className={`w-6 h-6 mr-3 flex-shrink-0 ${ui.bullet}`} />
                            <span className="text-slate-700 font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                        <button
                          type="button"
                          onClick={(event) => handleInnerButtonClick(event, () => setActiveDetailSection(section.id))}
                          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          {landingCopy.common.detailsLabel}
                        </button>
                        <button
                          type="button"
                          onClick={(event) =>
                            handleInnerButtonClick(event, () => {
                              setCurrentIndex(section.studyIndex);
                              setActiveView('study');
                            })
                          }
                          className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors ${ui.button}`}
                        >
                          {pageCopy.tracksAction}
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
                          {landingCopy.common.gifHint}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}

        {activeView === 'study' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {pageCopy.overviewTab}
                </div>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">{currentSection.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('overview')}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                <ArrowLeft size={16} className="mr-2" />
                {backToOverviewLabel}
              </button>
            </div>

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
              <div className="h-64 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center">
                <p className="mb-2 font-medium text-slate-500">{currentSection.description}</p>
                <p className="text-sm text-slate-400">{copy.placeholder}</p>
              </div>
            </SectionCard>
          </div>
        )}
      </div>

      {detailSection && (
        <ScriptStudyDetailModal
          language={language}
          section={detailSection}
          onClose={() => setActiveDetailSection(null)}
        />
      )}
    </PageContainer>
  );
};
