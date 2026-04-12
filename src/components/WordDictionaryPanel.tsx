import React, { useState } from 'react';
import { WordItem, WordStudyMode } from '../types';
import { WordTable } from './WordTable';
import { Search, ChevronLeft, ChevronRight, Keyboard, ListChecks } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { studyContent } from '../data/studyContent';
import { wordStudyContent } from '../data/wordStudyContent';
import { useMeaningTranslations } from '../utils/wordMeaning';
import { searchDictionaryWords, useDictionaryWordSearch } from '../data/words';

const studyModes: WordStudyMode[] = ['wordToRomaji', 'wordToMeaning', 'meaningToWord', 'test'];

interface Props {
  language: AppLanguage;
  script: NonNullable<WordItem['script']>;
  onStartMode: (mode: WordStudyMode, questionCount: number, sourceWords: WordItem[]) => void;
}

export const WordDictionaryPanel: React.FC<Props> = ({
  language,
  script,
  onStartMode
}) => {
  const copy = studyContent[language];
  const wordCopy = wordStudyContent[language];
  const meaningTranslations = useMeaningTranslations(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [questionCount, setQuestionCount] = useState(10);
  const [isStartingMode, setIsStartingMode] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const pageSize = 10;
  const normalizedSearch = searchTerm.trim();

  const { words: paginatedWords, page, loading, error } = useDictionaryWordSearch({
    script,
    query: normalizedSearch || undefined,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize
  });

  const availableWordCount = page.total;
  const maxQuestionCount = Math.max(Math.min(availableWordCount, 100), 1);
  const totalPages = Math.max(1, Math.ceil(availableWordCount / pageSize));

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  React.useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages));
  }, [totalPages]);

  React.useEffect(() => {
    setQuestionCount((previousCount) => {
      if (availableWordCount === 0) {
        return 1;
      }

      return Math.min(Math.max(previousCount, 1), maxQuestionCount);
    });
  }, [availableWordCount, maxQuestionCount]);

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
    if (nextValue > maxQuestionCount) nextValue = maxQuestionCount;
    setQuestionCount(nextValue);
  };

  const fetchStudySourceWords = async (mode: WordStudyMode, requestedCount: number) => {
    const minimumWordCount = mode === 'test' ? 4 : 1;
    const targetCount = Math.max(minimumWordCount, Math.min(requestedCount, maxQuestionCount));

    if (targetCount <= 0) {
      return [] as WordItem[];
    }

    const collectedWords: WordItem[] = [];
    let nextOffset = 0;
    const requestLimit = Math.min(Math.max(targetCount, pageSize), 100);

    while (collectedWords.length < targetCount) {
      const response = await searchDictionaryWords({
        script,
        query: normalizedSearch || undefined,
        limit: requestLimit,
        offset: nextOffset
      });

      if (response.items.length === 0) {
        break;
      }

      collectedWords.push(...response.items);
      nextOffset += response.items.length;

      if (!response.page.hasMore) {
        break;
      }
    }

    return collectedWords.slice(0, targetCount);
  };

  const handleStartMode = async (mode: WordStudyMode) => {
    const minimumWordCount = mode === 'test' ? 4 : 1;

    if (availableWordCount < minimumWordCount) {
      return;
    }

    setIsStartingMode(true);
    setStartError(null);

    try {
      const sourceWords = await fetchStudySourceWords(mode, questionCount);

      if (sourceWords.length < minimumWordCount) {
        setStartError(copy.dictionary.needAtLeastWords(minimumWordCount));
        return;
      }

      onStartMode(mode, Math.min(questionCount, sourceWords.length), sourceWords);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : language === 'tr'
            ? 'Kelime listesi yuklenemedi.'
            : 'Failed to load dictionary words.';
      setStartError(message);
    } finally {
      setIsStartingMode(false);
    }
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
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.views.dictionary}</div>
            <div className="text-sm text-slate-500">{copy.dictionary.filterDescription}</div>
          </div>
          <div className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow-sm">
            {copy.dictionary.wordCount(availableWordCount)}
          </div>
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
        startIndex={page.offset}
      />

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {language === 'tr' ? 'Kelime listesi yukleniyor...' : 'Loading dictionary words...'}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2">
        <div className="px-2 text-sm text-slate-500">
          {copy.dictionary.showingResults(
            availableWordCount === 0 ? 0 : page.offset + 1,
            Math.min(page.offset + paginatedWords.length, availableWordCount),
            availableWordCount
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || loading}
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
            disabled={currentPage === totalPages || loading}
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
            <span className="text-xs text-slate-400">{copy.dictionary.maxLabel(maxQuestionCount)}</span>
          </div>
        </div>

        {startError && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {startError}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {studyModes.map((mode) => {
            const minimumWordCount = mode === 'test' ? 4 : 1;
            const isDisabled = availableWordCount < minimumWordCount;
            const disabledTitle = isDisabled ? copy.dictionary.needAtLeastWords(minimumWordCount) : '';

            return (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  void handleStartMode(mode);
                }}
                disabled={isDisabled || loading || isStartingMode}
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
