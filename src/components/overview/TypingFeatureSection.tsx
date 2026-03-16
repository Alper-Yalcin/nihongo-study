import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AppLanguage } from '../../data/appPreferences';
import { overviewContent } from '../../data/overviewContent';
import { OverviewDemoFrame } from './OverviewDemoFrame';

interface Props {
  language: AppLanguage;
  onOpenDetails?: () => void;
}

export const TypingFeatureSection: React.FC<Props> = ({ language, onOpenDetails }) => {
  const copy = overviewContent[language].typingSection;
  const isInteractive = Boolean(onOpenDetails);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onOpenDetails) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpenDetails();
    }
  };

  return (
    <div
      className={`flex flex-col items-center gap-12 mb-24 lg:flex-row ${
        isInteractive ? 'cursor-pointer rounded-3xl transition-transform duration-300 hover:-translate-y-1' : ''
      }`}
      onClick={onOpenDetails}
      onKeyDown={handleKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      <div className="flex-1 space-y-6">
        <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold tracking-wide uppercase mb-2">
          {copy.badge}
        </div>
        <h2 className="text-3xl font-bold text-slate-900">{copy.title}</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          {copy.description}
        </p>
        
        <ul className="space-y-4 mt-8">
          {copy.features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <CheckCircle2 className="w-6 h-6 text-indigo-500 mr-3 flex-shrink-0" />
              <span className="text-slate-700 font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <OverviewDemoFrame
        src="/gifs/typing-demo.gif"
        alt={copy.imageAlt}
        fallbackTitle={copy.fallbackTitle}
        fallbackPath={copy.fallbackPath}
      />
    </div>
  );
};
