import React, { useEffect, useState } from 'react';
import { KanaSection, ScriptLayoutView, ScriptStudyView } from '../types';
import { StudyContainer } from './StudyContainer';
import { WordStudyContainer } from './WordStudyContainer';
import { ListeningStudyContainer } from './listening/ListeningStudyContainer';
import { ArrowLeft } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { studyContent } from '../data/studyContent';
import { scriptLandingContent } from '../content/scriptLandingContent';
import { ScriptOverviewPanel } from './ScriptOverviewPanel';
import { getBackToOverviewLabel } from './landing/landingUtils';
import { appShellRoutes } from '../data/appShellContent';
import { Button, Card, Eyebrow } from '../shared/ui';

interface Props {
  title: string;
  language: AppLanguage;
  script: 'hiragana' | 'katakana';
  kanaSections: KanaSection[];
  dictionaryWordCount: number;
  availableViews?: ScriptStudyView[];
  initialView?: ScriptLayoutView;
}

export const ScriptStudyLayout: React.FC<Props> = ({
  title,
  language,
  script,
  kanaSections,
  dictionaryWordCount,
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
          <Card padding="md" className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Eyebrow>{overviewCopy.overviewTab}</Eyebrow>
              <h2 className="mt-2 text-2xl font-bold text-[var(--kt-ink-strong)]">
                {`${title} ${activeViewLabel}`}
              </h2>
            </div>
            <Button as="link" to={overviewHref} variant="secondary" size="md">
              <ArrowLeft size={16} className="mr-2" />
              {backToOverviewLabel}
            </Button>
          </Card>
        )}
        <div style={{ display: activeView === 'overview' ? 'block' : 'none' }}>
          <ScriptOverviewPanel
            title={title}
            language={language}
            script={script}
            sections={kanaSections}
            wordCount={dictionaryWordCount}
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
              script={script}
            />
          )}
        </div>
        <div style={{ display: activeView === 'dictionary' ? 'block' : 'none' }}>
          {availableViews.includes('dictionary') && (
            <WordStudyContainer title={title} language={language} script={script} />
          )}
        </div>
      </div>
    </div>
  );
};
