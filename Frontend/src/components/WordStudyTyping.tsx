import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { wordStudyContent } from '../data/wordStudyContent';
import { studyContent } from '../data/studyContent';
import { WordItem, RunStats, WordQuizMode } from '../types';
import { getLocalizedWordMeaning, useMeaningTranslations } from '../utils/wordMeaning';
import { calculateAccuracy, isAcceptedRomajiAnswer } from '../utils/typing';
import { isAcceptedMeaningAnswer, isAcceptedWordAnswer } from '../utils/wordStudy';
import { formatDuration } from '../utils/formatDuration';

interface Props {
  language: AppLanguage;
  mode: WordQuizMode;
  words: WordItem[];
  onFinish: (stats: RunStats) => void;
  onCancel: () => void;
}

export const WordStudyTyping: React.FC<Props> = ({ language, mode, words, onFinish, onCancel }) => {
  const copy = studyContent[language];
  const wordCopy = wordStudyContent[language];
  const meaningTranslations = useMeaningTranslations(language);
  const [pool, setPool] = useState<WordItem[]>(words);
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const transitionTimeoutRef = useRef<number | null>(null);

  const clearTransitionTimeout = () => {
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
  };

  const pickRandomWord = (sourceWords: WordItem[]) => {
    if (sourceWords.length === 0) {
      setCurrentWord(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * sourceWords.length);
    setCurrentWord(sourceWords[randomIndex]);
  };

  const resetSession = () => {
    clearTransitionTimeout();
    setPool(words);
    setInputValue('');
    setFeedback('idle');
    setCorrectCount(0);
    setWrongCount(0);
    setAttempts(0);
    setTimeSeconds(0);
    pickRandomWord(words);
  };

  useEffect(() => {
    resetSession();

    return () => {
      clearTransitionTimeout();
    };
  }, [words, mode]);

  useEffect(() => {
    const timer = window.setInterval(() => setTimeSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (feedback === 'idle') {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [feedback, currentWord]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!currentWord || feedback !== 'idle' || !inputValue.trim()) {
      return;
    }

    setAttempts((current) => current + 1);

    const isCorrect =
      mode === 'wordToRomaji'
        ? isAcceptedRomajiAnswer(inputValue, currentWord.romaji)
        : mode === 'wordToMeaning'
          ? isAcceptedMeaningAnswer(inputValue, currentWord.meaning, language, meaningTranslations)
          : isAcceptedWordAnswer(inputValue, currentWord.kana, currentWord.romaji);

    if (isCorrect) {
      setFeedback('correct');
      setCorrectCount((current) => current + 1);
      clearTransitionTimeout();

      transitionTimeoutRef.current = window.setTimeout(() => {
        const newPool = pool.filter((word) => word.id !== currentWord.id);

        if (newPool.length === 0) {
          onFinish({
            completed: words.length,
            totalAttempts: attempts + 1,
            correct: correctCount + 1,
            wrong: wrongCount,
            accuracy: calculateAccuracy(correctCount + 1, attempts + 1),
            timeSeconds,
            mode,
            modeLabel: wordCopy.modes[mode]
          });
          return;
        }

        setPool(newPool);
        setInputValue('');
        setFeedback('idle');
        pickRandomWord(newPool);
      }, 400);

      return;
    }

    setFeedback('wrong');
    setWrongCount((current) => current + 1);
    clearTransitionTimeout();
    transitionTimeoutRef.current = window.setTimeout(() => {
      setInputValue('');
      setFeedback('idle');
    }, 800);
  };

  const promptTitle = wordCopy.prompts[mode];
  const promptValue =
    mode === 'meaningToWord'
      ? getLocalizedWordMeaning(currentWord?.meaning, language, meaningTranslations) || currentWord?.meaning || ''
      : currentWord?.kana || '';
  const promptValueClass =
    mode === 'meaningToWord'
      ? 'px-6 text-center text-3xl font-semibold leading-tight text-slate-800 sm:text-4xl'
      : 'text-6xl font-bold text-slate-800 font-jp tracking-wider';
  const inputClass = mode === 'wordToRomaji' ? 'font-mono lowercase' : 'font-medium';

  return (
    <div className="flex flex-col items-center py-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-between text-sm font-medium text-slate-500">
          <div className="flex space-x-4">
            <span className="text-emerald-600">{copy.common.correct}: {correctCount}</span>
            <span className="text-rose-600">{copy.common.wrong}: {wrongCount}</span>
          </div>
          <div className="flex space-x-4">
            <span>{formatDuration(timeSeconds)}</span>
            <span>{words.length - pool.length} / {words.length}</span>
          </div>
        </div>

        <div className="mb-12 text-center">
          <div className="mb-2 text-sm font-semibold uppercase tracking-widest text-slate-500">{promptTitle}</div>
          <div className={promptValueClass}>{promptValue}</div>
          {mode === 'wordToRomaji' && currentWord && getLocalizedWordMeaning(currentWord.meaning, language, meaningTranslations) && (
            <div className="mt-4 text-sm text-slate-400">
              {getLocalizedWordMeaning(currentWord.meaning, language, meaningTranslations)}
            </div>
          )}
          {mode === 'meaningToWord' && <div className="mt-4 text-sm text-slate-400">{wordCopy.wordInputHint}</div>}
        </div>

        <form onSubmit={handleSubmit} className="relative mb-12">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            disabled={feedback !== 'idle'}
            className={`w-full rounded-2xl border-2 px-6 py-4 text-center text-3xl outline-none transition-all shadow-sm ${inputClass} ${
              feedback === 'correct'
                ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                : feedback === 'wrong'
                  ? 'border-rose-400 bg-rose-50 text-rose-700'
                  : 'border-slate-200 bg-white text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
            }`}
            placeholder={wordCopy.placeholders[mode]}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {feedback === 'wrong' && (
            <div className="absolute -bottom-8 left-0 right-0 text-center font-medium text-rose-500 animate-pulse">
              {wordCopy.tryAgain}
            </div>
          )}
        </form>

        <div className="flex items-center justify-between border-t border-slate-100 pt-6">
          <button
            onClick={onCancel}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft size={16} className="mr-1" /> {wordCopy.backToDictionary}
          </button>
          <button
            onClick={resetSession}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <RotateCcw size={16} className="mr-1" /> {copy.common.restartRun}
          </button>
        </div>
      </div>
    </div>
  );
};
