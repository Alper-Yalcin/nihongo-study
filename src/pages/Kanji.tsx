import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpenText,
  Layers3
} from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { SectionCard } from '../components/SectionCard';
import { StudyNavigator } from '../components/StudyNavigator';
import { AppLanguage } from '../data/appPreferences';
import { kanjiContent } from '../data/studyContent';
import { KanjiOverviewTrack, scriptLandingContent } from '../content/scriptLandingContent';
import { StudyLandingPage } from '../components/landing/StudyLandingPage';
import { getBackToOverviewLabel } from '../components/landing/landingUtils';

interface Props {
  language: AppLanguage;
}

const featureCardStyles = [
  {
    wrapper: 'bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all',
    icon: 'w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6',
    IconComponent: Layers3
  },
  {
    wrapper: 'bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all',
    icon: 'w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6',
    IconComponent: BookOpenText
  },
  {
    wrapper: 'bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all',
    icon: 'w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6',
    IconComponent: ArrowLeft
  }
] as const;

export const Kanji: React.FC<Props> = ({ language }) => {
  const copy = kanjiContent[language];
  const landingCopy = scriptLandingContent[language];
  const pageCopy = landingCopy.kanji;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeView, setActiveView] = useState<'overview' | 'study'>('overview');
  const currentSection = copy.sections[currentIndex];
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
    <PageContainer title={copy.pageTitle}>
      <div className="space-y-6">
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

    </PageContainer>
  );
};
