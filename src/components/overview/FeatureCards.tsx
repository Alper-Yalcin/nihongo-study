import React from 'react';
import { Keyboard, PenTool, BookA } from 'lucide-react';

export const FeatureCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
        <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
          <Keyboard size={28} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">Kana Typing</h3>
        <p className="text-slate-600 leading-relaxed">
          Practice reading kana by typing their romaji equivalents. Improve your recognition speed and accuracy.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
          <PenTool size={28} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">Drawing Practice</h3>
        <p className="text-slate-600 leading-relaxed">
          Learn the correct stroke order by tracing and drawing kana characters on an interactive canvas.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all">
        <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
          <BookA size={28} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">Dictionary & Word Quiz</h3>
        <p className="text-slate-600 leading-relaxed">
          Study vocabulary using searchable dictionaries and test yourself with typing and multiple-choice quiz modes.
        </p>
      </div>
    </div>
  );
};
