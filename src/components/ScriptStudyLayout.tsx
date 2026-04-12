import React, { useEffect, useState } from 'react';
import { KanaSection, ScriptLayoutView, ScriptStudyView, WordItem } from '../types';
import { StudyContainer } from './StudyContainer';
import { WordStudyContainer } from './WordStudyContainer';
import { ListeningStudyContainer } from './listening/ListeningStudyContainer';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppLanguage } from '../data/appPreferences';
import { studyContent } from '../data/studyContent';
import { scriptLandingContent } from '../content/scriptLandingContent';
import { ScriptOverviewPanel } from './ScriptOverviewPanel';
import { getBackToOverviewLabel } from './landing/landingUtils';
import { appShellRoutes } from '../data/appShellContent';

interface Props {
  title: string;
  language: AppLanguage;
  script: 'hiragana' | 'katakana';
  kanaSections: KanaSection[];
  dictionaryWords: WordItem[];
  availableViews?: ScriptStudyView[];
  initialView?: ScriptLayoutView;
}

export const ScriptStudyLayout: React.FC<Props> = ({
  title,
  language,
  script,
  kanaSections,
  dictionaryWords,
  availableViews = ['typing', 'drawing', 'listening', 'dictionary'],
  initialView = 'overview'
}) => {
  const [activeView, setActiveView] = useState<ScriptLayoutView>(initialView);
  const copy = studyContent[language];
  const overviewCopy = scriptLandingContent[language][script];
  const overviewHref = script === 'hiragana' ? appShellRoutes.hiraganaOverview : appShellRoutes.katakanaOverview;
  const activeViewLabel =
    activeView === 'typing'
      ? copy.views.typing
      : activeView === 'drawing'
        ? copy.views.drawing
        : activeView === 'listening'
          ? copy.views.listening
          : copy.views.dictionary;
  const backToOverviewLabel = getBackToOverviewLabel(language);

  useEffect(() => {
    setActiveView(initialView);
  }, [initialView]);

  return (
    <div className="space-y-6">
      <div className="mt-6">
        {activeView !== 'overview' && (
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {overviewCopy.overviewTab}
              </div>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{`${title} ${activeViewLabel}`}</h2>
            </div>
            <Link
              to={overviewHref}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              <ArrowLeft size={16} className="mr-2" />
              {backToOverviewLabel}
            </Link>
          </div>
        )}
        <div style={{ display: activeView === 'overview' ? 'block' : 'none' }}>
          <ScriptOverviewPanel
            title={title}
            language={language}
            script={script}
            sections={kanaSections}
            words={dictionaryWords}
            availableViews={availableViews}
          />
        </div>
        <div style={{ display: activeView === 'typing' ? 'block' : 'none' }}>
          {availableViews.includes('typing') && (
            <StudyContainer
              title={`${title} ${copy.views.typing}`}
              language={language}
              script={script}
              sections={kanaSections}
              mode="typing"
            />
          )}
        </div>
        <div style={{ display: activeView === 'drawing' ? 'block' : 'none' }}>
          {availableViews.includes('drawing') && (
            <StudyContainer
              title={`${title} ${copy.views.drawing}`}
              language={language}
              script={script}
              sections={kanaSections}
              mode="drawing"
            />
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
            <WordStudyContainer title={title} language={language} script={script} words={dictionaryWords} />
          )}
        </div>
      </div>
    </div>
  );
};
