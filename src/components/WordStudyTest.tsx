import React, { useState, useEffect } from 'react';
import { WordItem, RunStats } from '../types';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { studyContent } from '../data/studyContent';
import { getLocalizedWordMeaning, useMeaningTranslations } from '../utils/wordMeaning';

interface Props {
  language: AppLanguage;
  words: WordItem[];
  allDictionaryWords: WordItem[];
  onFinish: (stats: RunStats) => void;
  onCancel: () => void;
}

export const WordStudyTest: React.FC<Props> = ({ language, words, allDictionaryWords, onFinish, onCancel }) => {
  const copy = studyContent[language];
  const meaningTranslations = useMeaningTranslations(language);
  const [pool, setPool] = useState<WordItem[]>(words);
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [questionType, setQuestionType] = useState<'kanaToRomaji' | 'romajiToKana'>('kanaToRomaji');
  const [options, setOptions] = useState<WordItem[]>([]);
  
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);

  useEffect(() => {
    if (pool.length > 0 && !currentWord) {
      generateQuestion(pool);
    }
  }, [pool]);

  useEffect(() => {
    const timer = setInterval(() => setTimeSeconds(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const generateQuestion = (currentPool: WordItem[]) => {
    const randomIndex = Math.floor(Math.random() * currentPool.length);
    const targetWord = currentPool[randomIndex];
    setCurrentWord(targetWord);
    
    const type = Math.random() > 0.5 ? 'kanaToRomaji' : 'romajiToKana';
    setQuestionType(type);

    // Generate 3 wrong options
    const wrongOptions: WordItem[] = [];
    const availableWrong = allDictionaryWords.filter(w => w.id !== targetWord.id);
    
    // Shuffle available wrong options
    const shuffledWrong = [...availableWrong].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < Math.min(3, shuffledWrong.length); i++) {
      wrongOptions.push(shuffledWrong[i]);
    }

    // Combine and shuffle options
    const allOptions = [targetWord, ...wrongOptions].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    setSelectedOptionId(null);
    setFeedback('idle');
  };

  const handleOptionClick = (option: WordItem) => {
    if (feedback !== 'idle' || !currentWord) return;

    setSelectedOptionId(option.id);
    setAttempts(a => a + 1);
    
    const isCorrect = option.id === currentWord.id;

    if (isCorrect) {
      setFeedback('correct');
      setCorrectCount(c => c + 1);
      
      setTimeout(() => {
        const newPool = pool.filter(w => w.id !== currentWord.id);
        if (newPool.length === 0) {
          onFinish({
            completed: words.length,
            totalAttempts: attempts + 1,
            correct: correctCount + 1,
            wrong: wrongCount,
            accuracy: Math.round(((correctCount + 1) / (attempts + 1)) * 100),
            timeSeconds: timeSeconds
          });
        } else {
          setPool(newPool);
          generateQuestion(newPool);
        }
      }, 800);
    } else {
      setFeedback('wrong');
      setWrongCount(w => w + 1);
      // Wait for user to click continue or auto-continue after a delay
      // Let's use a slightly longer delay to let them see the correct answer
      setTimeout(() => {
        setFeedback('idle');
        setSelectedOptionId(null);
      }, 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center py-6">
      <div className="w-full max-w-md">
        
        {/* Header / Stats */}
        <div className="flex items-center justify-between mb-8 text-sm font-medium text-slate-500">
          <div className="flex space-x-4">
            <span className="text-emerald-600">{copy.common.correct}: {correctCount}</span>
            <span className="text-rose-600">{copy.common.wrong}: {wrongCount}</span>
          </div>
          <div className="flex space-x-4">
            <span>{formatTime(timeSeconds)}</span>
            <span>{words.length - pool.length} / {words.length}</span>
          </div>
        </div>

        {/* Target Info */}
        <div className="text-center mb-10">
          <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold mb-2">
            {questionType === 'kanaToRomaji' ? copy.wordTest.selectRomaji : copy.wordTest.selectKana}
          </div>
          <div className={`text-6xl font-bold text-slate-800 tracking-wider ${questionType === 'romajiToKana' ? 'font-mono' : 'font-jp'}`}>
            {questionType === 'kanaToRomaji' ? currentWord?.kana : currentWord?.romaji}
          </div>
          {currentWord && getLocalizedWordMeaning(currentWord.meaning, language, meaningTranslations) && (
            <div className="text-slate-400 mt-4 text-sm">{getLocalizedWordMeaning(currentWord.meaning, language, meaningTranslations)}</div>
          )}
        </div>

        {/* Options Area */}
        <div className="grid grid-cols-1 gap-3 mb-10">
          {options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrectAnswer = option.id === currentWord?.id;
            
            let buttonClass = "w-full py-4 px-6 rounded-xl border-2 text-xl font-medium transition-all shadow-sm outline-none ";
            
            if (feedback === 'idle') {
              buttonClass += "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50";
            } else if (feedback === 'correct') {
              if (isCorrectAnswer) {
                buttonClass += "bg-emerald-50 border-emerald-400 text-emerald-700";
              } else {
                buttonClass += "bg-white border-slate-200 text-slate-400 opacity-50";
              }
            } else if (feedback === 'wrong') {
              if (isCorrectAnswer) {
                buttonClass += "bg-emerald-50 border-emerald-400 text-emerald-700 animate-pulse";
              } else if (isSelected) {
                buttonClass += "bg-rose-50 border-rose-400 text-rose-700";
              } else {
                buttonClass += "bg-white border-slate-200 text-slate-400 opacity-50";
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                disabled={feedback !== 'idle'}
                className={buttonClass}
              >
                <span className={questionType === 'kanaToRomaji' ? 'font-mono' : 'font-jp'}>
                  {questionType === 'kanaToRomaji' ? option.romaji : option.kana}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-6">
          <button
            onClick={onCancel}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft size={16} className="mr-1" /> {copy.wordTest.backToDictionary}
          </button>
          <button
            onClick={() => {
              setPool(words);
              setCorrectCount(0);
              setWrongCount(0);
              setAttempts(0);
              setTimeSeconds(0);
              setFeedback('idle');
              setSelectedOptionId(null);
              generateQuestion(words);
            }}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <RotateCcw size={16} className="mr-1" /> {copy.common.restartRun}
          </button>
        </div>

      </div>
    </div>
  );
};
