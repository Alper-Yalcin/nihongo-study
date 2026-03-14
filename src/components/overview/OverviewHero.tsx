import React from 'react';
import { TabType } from '../../types';
import { ArrowRight } from 'lucide-react';
import { AppLanguage } from '../../data/appPreferences';
import { overviewContent } from '../../data/overviewContent';

interface Props {
  language: AppLanguage;
  onNavigate: (tab: TabType) => void;
}

export const OverviewHero: React.FC<Props> = ({ language, onNavigate }) => {
  const copy = overviewContent[language].hero;

  return (
    <div className="overview-hero bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-8 md:p-12 border border-indigo-100 mb-12 text-center">
      <h1 className="overview-hero-title text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
        {copy.title}
      </h1>
      <p className="overview-hero-lead text-xl text-indigo-900 mb-6 font-medium">
        {copy.lead}
      </p>
      <p className="overview-hero-copy text-slate-600 max-w-2xl mx-auto mb-10 text-lg">
        {copy.copy}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => onNavigate('hiragana')}
          className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm hover:shadow"
        >
          {copy.primaryAction}
          <ArrowRight size={20} className="ml-2" />
        </button>
        <button
          onClick={() => onNavigate('katakana')}
          className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm hover:shadow"
        >
          {copy.secondaryAction}
          <ArrowRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );
};
