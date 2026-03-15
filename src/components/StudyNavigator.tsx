import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { studyContent } from '../data/studyContent';

interface StudyNavigatorProps {
  title: string;
  currentIndex: number;
  totalItems: number;
  onNext: () => void;
  onPrev: () => void;
  language: AppLanguage;
}

export const StudyNavigator: React.FC<StudyNavigatorProps> = ({
  title, currentIndex, totalItems, onNext, onPrev, language
}) => {
  const copy = studyContent[language];

  return (
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <div className="flex items-center space-x-3">
        <span className="text-xs font-medium text-slate-500">
          {currentIndex + 1} / {totalItems}
        </span>
        <div className="flex space-x-1">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label={copy.common.previous}
            title={copy.common.previous}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={onNext}
            disabled={currentIndex === totalItems - 1}
            className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label={copy.common.next}
            title={copy.common.next}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
