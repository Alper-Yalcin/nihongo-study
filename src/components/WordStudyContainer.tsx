import React, { useState } from 'react';
import { WordItem, RunStats } from '../types';
import { SectionCard } from './SectionCard';
import { WordDictionaryPanel } from './WordDictionaryPanel';
import { WordStudyTyping } from './WordStudyTyping';
import { WordStudyTest } from './WordStudyTest';
import { WordResultPanel } from './WordResultPanel';

interface WordStudyContainerProps {
  title: string;
  words: WordItem[];
}

export const WordStudyContainer: React.FC<WordStudyContainerProps> = ({ title, words }) => {
  const [view, setView] = useState<'dictionary' | 'typing' | 'test' | 'typing-result' | 'test-result'>('dictionary');
  const [runStats, setRunStats] = useState<RunStats | null>(null);
  const [quizWords, setQuizWords] = useState<WordItem[]>([]);
  const [quizSourceWords, setQuizSourceWords] = useState<WordItem[]>(words);

  const buildRandomQuizWords = (sourceWords: WordItem[], count: number) => {
    const shuffled = [...sourceWords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, sourceWords.length));
  };

  const handleStartTyping = (count: number, sourceWords: WordItem[]) => {
    if (sourceWords.length === 0) return;
    setQuizSourceWords(sourceWords);
    setQuizWords(buildRandomQuizWords(sourceWords, count));
    setView('typing');
  };

  const handleStartTest = (count: number, sourceWords: WordItem[]) => {
    if (sourceWords.length === 0) return;
    setQuizSourceWords(sourceWords);
    setQuizWords(buildRandomQuizWords(sourceWords, count));
    setView('test');
  };

  return (
    <SectionCard title={`${title} Dictionary`} description={`Browse and study ${title} vocabulary by JLPT level.`}>
      {view === 'dictionary' && (
        <WordDictionaryPanel
          words={words}
          onStartTyping={handleStartTyping}
          onStartTest={handleStartTest}
        />
      )}
      {view === 'typing' && (
        <WordStudyTyping
          words={quizWords}
          onFinish={(stats) => {
            setRunStats(stats);
            setView('typing-result');
          }}
          onCancel={() => setView('dictionary')}
        />
      )}
      {view === 'test' && (
        <WordStudyTest
          words={quizWords}
          allDictionaryWords={quizSourceWords}
          onFinish={(stats) => {
            setRunStats(stats);
            setView('test-result');
          }}
          onCancel={() => setView('dictionary')}
        />
      )}
      {view === 'typing-result' && runStats && (
        <WordResultPanel
          title={title}
          stats={runStats}
          onRestart={() => handleStartTyping(quizWords.length, quizSourceWords)}
          onBack={() => setView('dictionary')}
          mode="typing"
        />
      )}
      {view === 'test-result' && runStats && (
        <WordResultPanel
          title={title}
          stats={runStats}
          onRestart={() => handleStartTest(quizWords.length, quizSourceWords)}
          onBack={() => setView('dictionary')}
          mode="test"
        />
      )}
    </SectionCard>
  );
};
