import React, { useMemo } from 'react';
import { BookA, Headphones, Keyboard, PenTool } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { scriptLandingContent } from '../content/scriptLandingContent';
import { KanaSection, ScriptStudyView, WordItem } from '../types';
import { StudyLandingPage } from './landing/StudyLandingPage';

interface Props {
  title: string;
  language: AppLanguage;
  script: 'hiragana' | 'katakana';
  sections: KanaSection[];
  words: WordItem[];
  availableViews: ScriptStudyView[];
  onSelectView: (view: ScriptStudyView) => void;
}

const featureCardStyles = [
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

  const totalCharacters = useMemo(
    () =>
      sections.reduce(
        (total, section) => total + section.groups.reduce((groupTotal, group) => groupTotal + group.characters.length, 0),
        0
      ),
    [sections]
  );
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

  return (
    <StudyLandingPage
      language={language}
      commonCopy={copy.common}
      heroTheme={{
        containerClassName: 'bg-gradient-to-br from-indigo-50 to-white border-indigo-100',
        eyebrowClassName: 'text-indigo-500',
        leadClassName: 'text-indigo-900'
      }}
      hero={{
        eyebrow: pageCopy.hero.eyebrow,
        title: pageCopy.hero.title,
        lead: pageCopy.hero.lead,
        copy: pageCopy.hero.copy,
        primaryAction: {
          label: pageCopy.hero.primaryAction.label,
          onClick: () => onSelectView(pageCopy.hero.primaryAction.target),
          className: 'bg-indigo-600 hover:bg-indigo-700'
        },
        secondaryAction: {
          label: pageCopy.hero.secondaryAction.label,
          onClick: () => onSelectView(pageCopy.hero.secondaryAction.target),
          className: 'bg-emerald-600 hover:bg-emerald-700'
        }
      }}
      stats={[
        { label: pageCopy.stats.sections, value: sections.length },
        { label: pageCopy.stats.characters, value: totalCharacters },
        { label: pageCopy.stats.words, value: words.length },
        { label: pageCopy.stats.modes, value: availableViews.length }
      ]}
      statsGridClassName="sm:grid-cols-2 xl:grid-cols-4"
      featureCards={featureCards}
      featureGridClassName="grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      sections={availableViews.map((view) => pageCopy.sections[view])}
      onSectionAction={(section) => onSelectView(section.id as ScriptStudyView)}
    />
  );
};
