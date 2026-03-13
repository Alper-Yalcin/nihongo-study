import React, { useState, useMemo } from 'react';
import { WordItem } from '../types';
import { WordTable } from './WordTable';
import { Search, ChevronLeft, ChevronRight, Keyboard, ListChecks } from 'lucide-react';

interface Props {
  words: WordItem[];
  onStartTyping: (questionCount: number) => void;
  onStartTest: (questionCount: number) => void;
}

export const WordDictionaryPanel: React.FC<Props> = ({
  words,
  onStartTyping,
  onStartTest
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [questionCount, setQuestionCount] = useState(10);
  const pageSize = 10;

  const filteredWords = useMemo(() => {
    if (!searchTerm.trim()) return words;
    const lowerSearch = searchTerm.toLowerCase().trim();
    return words.filter(w => 
      w.kana.toLowerCase().includes(lowerSearch) ||
      w.romaji.toLowerCase().includes(lowerSearch) ||
      (w.meaning && w.meaning.toLowerCase().includes(lowerSearch))
    );
  }, [words, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredWords.length / pageSize));
  
  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const paginatedWords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredWords.slice(start, start + pageSize);
  }, [filteredWords, currentPage, pageSize]);

  const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  const handleQuestionCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 1;
    setQuestionCount(val);
  };

  const handleQuestionCountBlur = () => {
    let val = questionCount;
    if (val < 1) val = 1;
    if (val > words.length) val = words.length;
    setQuestionCount(val);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search kana, romaji, or meaning..."
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>
      
      {/* Dictionary Table */}
      <WordTable 
        words={paginatedWords}
        startIndex={(currentPage - 1) * pageSize}
      />
      
      {/* Pagination */}
      <div className="flex items-center justify-between bg-slate-50 rounded-xl p-2 border border-slate-200">
        <div className="text-sm text-slate-500 px-2">
          Showing {filteredWords.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredWords.length)} of {filteredWords.length} words
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-slate-700 px-2">
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Quiz Controls */}
      <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-slate-200 shadow-sm mt-6">
        <div className="flex items-center space-x-3">
          <label htmlFor="questionCount" className="text-sm font-medium text-slate-700">
            Questions:
          </label>
          <input
            id="questionCount"
            type="number"
            min={1}
            max={words.length}
            value={questionCount}
            onChange={handleQuestionCountChange}
            onBlur={handleQuestionCountBlur}
            className="w-20 px-3 py-1.5 border border-slate-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <span className="text-xs text-slate-400">/ {words.length} max</span>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => onStartTyping(questionCount)}
            disabled={words.length === 0}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Keyboard size={18} className="mr-2" />
            Start Typing
          </button>
          <button
            onClick={() => onStartTest(questionCount)}
            disabled={words.length < 4}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={words.length < 4 ? "Need at least 4 words" : ""}
          >
            <ListChecks size={18} className="mr-2" />
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
};
