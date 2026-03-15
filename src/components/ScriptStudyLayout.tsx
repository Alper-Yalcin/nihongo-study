import React, { useState } from 'react';
import { KanaSection, WordItem } from '../types';
import { StudyContainer } from './StudyContainer';
import { WordStudyContainer } from './WordStudyContainer';
import { ListeningStudyContainer } from './listening/ListeningStudyContainer';
import { Keyboard, PenTool, BookA, Headphones } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { studyContent } from '../data/studyContent';

export type StudyView = 'typing' | 'drawing' | 'listening' | 'dictionary';

interface Props {
  title: string;
  language: AppLanguage;
  script: 'hiragana' | 'katakana';
  kanaSections: KanaSection[];
  dictionaryWords: WordItem[];
  availableViews?: StudyView[];
}

export const ScriptStudyLayout: React.FC<Props> = ({
  title,
  language,
  script,
  kanaSections,
  dictionaryWords,
  availableViews = ['typing', 'drawing', 'listening', 'dictionary']
}) => {
  const [activeView, setActiveView] = useState<StudyView>(availableViews[0]);
  const copy = studyContent[language];

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex justify-center">
        <div className="inline-flex bg-slate-100 p-1 rounded-xl shadow-sm border border-slate-200">
          {availableViews.includes('typing') && (
            <button
              onClick={() => setActiveView('typing')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === 'typing'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              <Keyboard size={16} className="mr-2" />
              {copy.views.typing}
            </button>
          )}
          {availableViews.includes('drawing') && (
            <button
              onClick={() => setActiveView('drawing')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === 'drawing'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              <PenTool size={16} className="mr-2" />
              {copy.views.drawing}
            </button>
          )}
          {availableViews.includes('listening') && (
            <button
              onClick={() => setActiveView('listening')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === 'listening'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              <Headphones size={16} className="mr-2" />
              {copy.views.listening}
            </button>
          )}
          {availableViews.includes('dictionary') && (
            <button
              onClick={() => setActiveView('dictionary')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === 'dictionary'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              <BookA size={16} className="mr-2" />
              {copy.views.dictionary}
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="mt-6">
        <div style={{ display: activeView === 'typing' ? 'block' : 'none' }}>
          {availableViews.includes('typing') && (
            <StudyContainer title={`${title} ${copy.views.typing}`} language={language} sections={kanaSections} mode="typing" />
          )}
        </div>
        <div style={{ display: activeView === 'drawing' ? 'block' : 'none' }}>
          {availableViews.includes('drawing') && (
            <StudyContainer title={`${title} ${copy.views.drawing}`} language={language} sections={kanaSections} mode="drawing" />
          )}
        </div>
        <div style={{ display: activeView === 'listening' ? 'block' : 'none' }}>
          {availableViews.includes('listening') && (
            <ListeningStudyContainer
              title={title}
              language={language}
              sections={kanaSections}
              words={dictionaryWords}
              script={script}
            />
          )}
        </div>
        <div style={{ display: activeView === 'dictionary' ? 'block' : 'none' }}>
          {availableViews.includes('dictionary') && (
            <WordStudyContainer title={title} language={language} words={dictionaryWords} />
          )}
        </div>
      </div>
    </div>
  );
};
