import React from 'react';
import { TabType } from '../../types';
import { ArrowRight } from 'lucide-react';

interface Props {
  onNavigate: (tab: TabType) => void;
}

export const OverviewHero: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-8 md:p-12 border border-indigo-100 mb-12 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
        Japanese Kana Study App
      </h1>
      <p className="text-xl text-indigo-900 mb-6 font-medium">
        Practice Hiragana and Katakana with typing, drawing, and dictionary exercises.
      </p>
      <p className="text-slate-600 max-w-2xl mx-auto mb-10 text-lg">
        This application helps you learn Japanese kana through multiple interactive study methods including typing exercises, handwriting practice, and vocabulary quizzes.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => onNavigate('hiragana')}
          className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm hover:shadow"
        >
          Start Hiragana Study
          <ArrowRight size={20} className="ml-2" />
        </button>
        <button
          onClick={() => onNavigate('katakana')}
          className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm hover:shadow"
        >
          Start Katakana Study
          <ArrowRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );
};
