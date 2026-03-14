import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AppLanguage } from '../../data/appPreferences';
import { overviewContent } from '../../data/overviewContent';
import { OverviewDemoFrame } from './OverviewDemoFrame';

interface Props {
  language: AppLanguage;
}

export const DictionaryFeatureSection: React.FC<Props> = ({ language }) => {
  const copy = overviewContent[language].dictionarySection;

  return (
    <div className="flex flex-col lg:flex-row-reverse items-center gap-12 mb-24">
      <div className="flex-1 space-y-6">
        <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold tracking-wide uppercase mb-2">
          {copy.badge}
        </div>
        <h2 className="text-3xl font-bold text-slate-900">{copy.title}</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          {copy.description}
        </p>
        
        <ul className="space-y-4 mt-8">
          {copy.features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <CheckCircle2 className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" />
              <span className="text-slate-700 font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <OverviewDemoFrame
        src="/gifs/dictionary-demo.gif"
        alt={copy.imageAlt}
        fallbackTitle={copy.fallbackTitle}
        fallbackPath={copy.fallbackPath}
      />
    </div>
  );
};
