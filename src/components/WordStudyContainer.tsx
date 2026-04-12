import React, { useState } from 'react';
import { WordItem, RunStats, WordStudyMode } from '../types';
import { SectionCard } from './SectionCard';
import { WordDictionaryPanel } from './WordDictionaryPanel';
import { WordStudyTyping } from './WordStudyTyping';
import { WordStudyTest } from './WordStudyTest';
import { WordResultPanel } from './WordResultPanel';
import { AppLanguage } from '../data/appPreferences';
import { studyContent } from '../data/studyContent';

interface WordStudyContainerProps {
  title: string;
  language: AppLanguage;
  script: 'hiragana' | 'katakana';
  words: WordItem[];
}

export const WordStudyContainer: React.FC<WordStudyContainerProps> = ({ title, language, script, words }) => {
  const copy = studyContent[language];
  const [view, setView] = useState<'dictionary' | 'practice' | 'test' | 'result'>('dictionary');
  const [runStats, setRunStats] = useState<RunStats | null>(null);
  const [quizWords, setQuizWords] = useState<WordItem[]>([]);
  const [quizSourceWords, setQuizSourceWords] = useState<WordItem[]>(words);
  const [activeMode, setActiveMode] = useState<WordStudyMode>('wordToRomaji');

  const buildRandomQuizWords = (sourceWords: WordItem[], count: number) => {
    const shuffled = [...sourceWords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, sourceWords.length));
  };

  const handleStartMode = (mode: WordStudyMode, count: number, sourceWords: WordItem[]) => {
    if (sourceWords.length === 0) return;

    setActiveMode(mode);
    setQuizSourceWords(sourceWords);
    setQuizWords(buildRandomQuizWords(sourceWords, count));
    setView(mode === 'test' ? 'test' : 'practice');
  };

  return (
    <SectionCard title={`${title} ${copy.views.dictionary}`} description={copy.dictionary.sectionDescription(title)}>
      {view === 'dictionary' && (
        <WordDictionaryPanel
          language={language}
          script={script}
          onStartMode={handleStartMode}
        />
      )}
      {view === 'practice' && activeMode !== 'test' && (
        <WordStudyTyping
          language={language}
          mode={activeMode}
          words={quizWords}
          onFinish={(stats) => {
            setRunStats(stats);
            setView('result');
          }}
          onCancel={() => setView('dictionary')}
        />
      )}
      {view === 'test' && activeMode === 'test' && (
        <WordStudyTest
          language={language}
          words={quizWords}
          allDictionaryWords={quizSourceWords}
          onFinish={(stats) => {
            setRunStats(stats);
            setView('result');
          }}
          onCancel={() => setView('dictionary')}
        />
      )}
      {view === 'result' && runStats && (
        <WordResultPanel
          title={title}
          language={language}
          stats={runStats}
          mode={activeMode}
          onRestart={() => handleStartMode(activeMode, quizWords.length, quizSourceWords)}
          onBack={() => setView('dictionary')}
        />
      )}
    </SectionCard>
  );
};
