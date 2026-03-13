import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const DictionaryFeatureSection: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
      <div className="flex-1 space-y-6">
        <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold tracking-wide uppercase mb-2">
          Study Mode
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Kana Vocabulary Dictionary</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Browse hiragana and katakana vocabulary lists. Search words, explore romaji readings, and test yourself with typing and quiz modes.
        </p>
        
        <ul className="space-y-4 mt-8">
          {[
            'Searchable dictionary',
            'Pagination',
            'Typing quiz',
            'Multiple choice test'
          ].map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <CheckCircle2 className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" />
              <span className="text-slate-700 font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex-1 w-full max-w-[600px] bg-slate-100 rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-center min-h-[300px]">
        <img 
          src="/gifs/dictionary-demo.gif" 
          alt="Dictionary Study Demo" 
          className="rounded-xl w-full h-auto shadow-sm border border-slate-200"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML = '<div class="text-slate-400 text-center p-8"><p class="mb-2 font-medium">Dictionary Demo GIF</p><p class="text-xs font-mono">/public/gifs/dictionary-demo.gif</p></div>';
          }}
        />
      </div>
    </div>
  );
};
