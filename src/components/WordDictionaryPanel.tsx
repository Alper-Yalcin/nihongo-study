import React, { useMemo, useState } from 'react';
import { WordItem, WordStudyMode } from '../types';
import { WordTable } from './WordTable';
import { Search, ChevronLeft, ChevronRight, Keyboard, ListChecks } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { studyContent } from '../data/studyContent';
import { wordStudyContent } from '../data/wordStudyContent';
import { getLocalizedWordMeaning, useMeaningTranslations } from '../utils/wordMeaning';

type LevelFilter = 'all' | NonNullable<WordItem['jlptLevel']>;

const jlptFilters: NonNullable<WordItem['jlptLevel']>[] = ['N5', 'N4', 'N3', 'N2', 'N1'];
const studyModes: WordStudyMode[] = ['wordToRomaji', 'wordToMeaning', 'meaningToWord', 'test'];

interface Props {
  language: AppLanguage;
  words: WordItem[];
  onStartMode: (mode: WordStudyMode, questionCount: number, sourceWords: WordItem[]) => void;
}

export const WordDictionaryPanel: React.FC<Props> = ({
  language,
  words,
  onStartMode
}) => {
  const copy = studyContent[language];
  const wordCopy = wordStudyContent[language];
  const meaningTranslations = useMeaningTranslations(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLevel, setActiveLevel] = useState<LevelFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [questionCount, setQuestionCount] = useState(10);
  const pageSize = 10;

  const filteredWords = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return words.filter((word) => {
      const matchesLevel = activeLevel === 'all' || word.jlptLevel === activeLevel;

      if (!matchesLevel) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        word.kana.toLowerCase().includes(normalizedSearch) ||
        word.romaji.toLowerCase().includes(normalizedSearch) ||
        (getLocalizedWordMeaning(word.meaning, language, meaningTranslations)?.toLowerCase().includes(normalizedSearch) ?? false) ||
        (word.meaning && word.meaning.toLowerCase().includes(normalizedSearch)) ||
        (word.jlptLevel && word.jlptLevel.toLowerCase().includes(normalizedSearch))
      );
    });
  }, [activeLevel, language, meaningTranslations, searchTerm, words]);

  const availableWordCount = filteredWords.length;
  const maxQuestionCount = Math.max(availableWordCount, 1);
  const totalPages = Math.max(1, Math.ceil(availableWordCount / pageSize));

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeLevel]);

  React.useEffect(() => {
    setQuestionCount((previousCount) => {
      if (availableWordCount === 0) {
        return 1;
      }

      return Math.min(Math.max(previousCount, 1), availableWordCount);
    });
  }, [availableWordCount]);

  const paginatedWords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredWords.slice(start, start + pageSize);
  }, [filteredWords, currentPage, pageSize]);

  const handlePrevPage = () => setCurrentPage((page) => Math.max(1, page - 1));
  const handleNextPage = () => setCurrentPage((page) => Math.min(totalPages, page + 1));

  const handleQuestionCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(e.target.value, 10);

    if (Number.isNaN(parsedValue)) {
      setQuestionCount(1);
      return;
    }

    setQuestionCount(parsedValue);
  };

  const handleQuestionCountBlur = () => {
    if (availableWordCount === 0) {
      setQuestionCount(1);
      return;
    }

    let nextValue = questionCount;
    if (nextValue < 1) nextValue = 1;
    if (nextValue > availableWordCount) nextValue = availableWordCount;
    setQuestionCount(nextValue);
  };

  const getModeIcon = (mode: WordStudyMode) => {
    if (mode === 'test') {
      return <ListChecks size={18} className="text-emerald-600" />;
    }

    return <Keyboard size={18} className="text-indigo-600" />;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.dictionary.jlptLevels}</div>
            <div className="text-sm text-slate-500">{copy.dictionary.filterDescription}</div>
          </div>
          <div className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow-sm">
            {copy.dictionary.wordCount(availableWordCount)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveLevel('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeLevel === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {copy.dictionary.all}
          </button>
          {jlptFilters.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setActiveLevel(level)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeLevel === level
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={copy.dictionary.searchPlaceholder}
          className="w-full rounded-xl border border-slate-200 py-2 pr-4 pl-10 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <WordTable
        language={language}
        meaningTranslations={meaningTranslations}
        words={paginatedWords}
        startIndex={(currentPage - 1) * pageSize}
      />

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2">
        <div className="px-2 text-sm text-slate-500">
          {copy.dictionary.showingResults(
            availableWordCount === 0 ? 0 : (currentPage - 1) * pageSize + 1,
            Math.min(currentPage * pageSize, availableWordCount),
            availableWordCount
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={copy.common.previous}
            title={copy.common.previous}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="px-2 text-sm font-medium text-slate-700">
            {copy.dictionary.pageLabel(currentPage, totalPages)}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={copy.common.next}
            title={copy.common.next}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {wordCopy.panelTitle}
            </div>
            <div className="mt-1 text-sm text-slate-500">{wordCopy.panelDescription}</div>
          </div>
          <div className="flex items-center space-x-3">
            <label htmlFor="questionCount" className="text-sm font-medium text-slate-700">
              {copy.dictionary.questions}:
            </label>
            <input
              id="questionCount"
              type="number"
              min={1}
              max={maxQuestionCount}
              value={questionCount}
              onChange={handleQuestionCountChange}
              onBlur={handleQuestionCountBlur}
              className="w-20 rounded-lg border border-slate-200 px-3 py-1.5 text-center focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <span className="text-xs text-slate-400">{copy.dictionary.maxLabel(availableWordCount)}</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {studyModes.map((mode) => {
            const minimumWordCount = mode === 'test' ? 4 : 1;
            const isDisabled = availableWordCount < minimumWordCount;
            const disabledTitle = isDisabled ? copy.dictionary.needAtLeastWords(minimumWordCount) : '';

            return (
              <button
                key={mode}
                type="button"
                onClick={() => onStartMode(mode, questionCount, filteredWords)}
                disabled={isDisabled}
                title={disabledTitle}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                  mode === 'test'
                    ? 'border-emerald-200 bg-emerald-50/60 hover:border-emerald-300 hover:bg-emerald-50'
                    : 'border-indigo-200 bg-indigo-50/60 hover:border-indigo-300 hover:bg-indigo-50'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <div className="mt-0.5 rounded-xl bg-white p-2 shadow-sm">{getModeIcon(mode)}</div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{wordCopy.modes[mode]}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">{wordCopy.modeDescriptions[mode]}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
