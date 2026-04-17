import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { wordStudyContent } from '../data/wordStudyContent';
import { studyContent } from '../data/studyContent';
import { WordItem, RunStats, WordQuizMode } from '../types';
import { getLocalizedWordMeaning, useMeaningTranslations } from '../utils/wordMeaning';
import { calculateAccuracy } from '../utils/typing';
import { formatDuration } from '../utils/formatDuration';

interface Props {
  language: AppLanguage;
  words: WordItem[];
  allDictionaryWords: WordItem[];
  onFinish: (stats: RunStats) => void;
  onCancel: () => void;
}

const testQuestionTypes: WordQuizMode[] = ['wordToRomaji', 'wordToMeaning', 'meaningToWord'];

export const WordStudyTest: React.FC<Props> = ({ language, words, allDictionaryWords, onFinish, onCancel }) => {
  const copy = studyContent[language];
  const wordCopy = wordStudyContent[language];
  const meaningTranslations = useMeaningTranslations(language);
  const [pool, setPool] = useState<WordItem[]>(words);
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [questionType, setQuestionType] = useState<WordQuizMode>('wordToRomaji');
  const [options, setOptions] = useState<WordItem[]>([]);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);

  const transitionTimeoutRef = useRef<number | null>(null);

  const clearTransitionTimeout = () => {
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
  };

  const getOptionDisplayKey = (word: WordItem, type: WordQuizMode) => {
    if (type === 'wordToMeaning') {
      return (getLocalizedWordMeaning(word.meaning, language, meaningTranslations) || word.meaning || '').toLowerCase();
    }

    if (type === 'meaningToWord') {
      return word.kana;
    }

    return word.romaji.toLowerCase();
  };

  const generateQuestion = (currentPool: WordItem[]) => {
    if (currentPool.length === 0) {
      setCurrentWord(null);
      setOptions([]);
      return;
    }

    const randomIndex = Math.floor(Math.random() * currentPool.length);
    const targetWord = currentPool[randomIndex];
    const nextQuestionType = testQuestionTypes[Math.floor(Math.random() * testQuestionTypes.length)];
    const wrongOptions: WordItem[] = [];
    const shuffledWrong = [...allDictionaryWords.filter((word) => word.id !== targetWord.id)].sort(() => 0.5 - Math.random());
    const usedDisplayKeys = new Set<string>([getOptionDisplayKey(targetWord, nextQuestionType)]);

    for (const candidate of shuffledWrong) {
      const candidateKey = getOptionDisplayKey(candidate, nextQuestionType);

      if (!candidateKey || usedDisplayKeys.has(candidateKey)) {
        continue;
      }

      usedDisplayKeys.add(candidateKey);
      wrongOptions.push(candidate);

      if (wrongOptions.length === 3) {
        break;
      }
    }

    setCurrentWord(targetWord);
    setQuestionType(nextQuestionType);
    setOptions([targetWord, ...wrongOptions].sort(() => 0.5 - Math.random()));
    setFeedback('idle');
    setSelectedOptionId(null);
  };

  const resetSession = () => {
    clearTransitionTimeout();
    setPool(words);
    setCorrectCount(0);
    setWrongCount(0);
    setAttempts(0);
    setTimeSeconds(0);
    setFeedback('idle');
    setSelectedOptionId(null);
    generateQuestion(words);
  };

  useEffect(() => {
    resetSession();

    return () => {
      clearTransitionTimeout();
    };
  }, [words, language]);

  useEffect(() => {
    const timer = window.setInterval(() => setTimeSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const handleOptionClick = (option: WordItem) => {
    if (feedback !== 'idle' || !currentWord) {
      return;
    }

    setSelectedOptionId(option.id);
    setAttempts((current) => current + 1);

    const isCorrect = option.id === currentWord.id;

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
            mode: 'test',
            modeLabel: wordCopy.modes.test
          });
          return;
        }

        setPool(newPool);
        generateQuestion(newPool);
      }, 800);

      return;
    }

    setFeedback('wrong');
    setWrongCount((current) => current + 1);
    clearTransitionTimeout();
    transitionTimeoutRef.current = window.setTimeout(() => {
      setFeedback('idle');
      setSelectedOptionId(null);
    }, 2000);
  };

  const promptTitle = wordCopy.testPrompts[questionType];
  const promptValue =
    questionType === 'meaningToWord'
      ? getLocalizedWordMeaning(currentWord?.meaning, language, meaningTranslations) || currentWord?.meaning || ''
      : currentWord?.kana || '';
  const promptClass =
    questionType === 'meaningToWord'
      ? 'text-3xl font-semibold leading-tight text-slate-800 sm:text-4xl'
      : 'text-6xl font-bold tracking-wider text-slate-800 font-jp';

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

        <div className="mb-10 text-center">
          <div className="mb-2 text-sm font-semibold uppercase tracking-widest text-slate-500">{promptTitle}</div>
          <div className={promptClass}>{promptValue}</div>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-3">
          {options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrectAnswer = option.id === currentWord?.id;

            let buttonClass = 'w-full rounded-xl border-2 px-6 py-4 text-xl font-medium transition-all shadow-sm outline-none ';

            if (feedback === 'idle') {
              buttonClass += 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50';
            } else if (feedback === 'correct') {
              if (isCorrectAnswer) {
                buttonClass += 'bg-emerald-50 border-emerald-400 text-emerald-700';
              } else {
                buttonClass += 'bg-white border-slate-200 text-slate-400 opacity-50';
              }
            } else if (feedback === 'wrong') {
              if (isCorrectAnswer) {
                buttonClass += 'bg-emerald-50 border-emerald-400 text-emerald-700 animate-pulse';
              } else if (isSelected) {
                buttonClass += 'bg-rose-50 border-rose-400 text-rose-700';
              } else {
                buttonClass += 'bg-white border-slate-200 text-slate-400 opacity-50';
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                disabled={feedback !== 'idle'}
                className={buttonClass}
              >
                {questionType === 'wordToRomaji' && <span className="font-mono">{option.romaji}</span>}
                {questionType === 'wordToMeaning' && (
                  <span>{getLocalizedWordMeaning(option.meaning, language, meaningTranslations) || option.meaning}</span>
                )}
                {questionType === 'meaningToWord' && (
                  <span className="flex flex-col items-center">
                    <span className="text-2xl font-jp">{option.kana}</span>
                    <span className="mt-1 text-xs font-mono text-slate-400">{option.romaji}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

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
