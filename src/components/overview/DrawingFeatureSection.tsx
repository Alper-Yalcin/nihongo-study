import React from 'react';

export const DrawingFeatureSection: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row-reverse items-center gap-12 mb-24">
      <div className="flex-1 space-y-6">
        <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold tracking-wide uppercase mb-2">
          Study Mode
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Kana Drawing Practice</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Practice writing Japanese kana using the interactive canvas. Trace characters to learn stroke order or draw them from memory in test mode.
        </p>
        
        <div className="space-y-6 mt-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
              Practice Mode
            </h4>
            <p className="text-slate-600 text-sm">Trace over a guide character and follow the stroke order.</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
              Test Mode
            </h4>
            <p className="text-slate-600 text-sm">Draw the character from memory and check your accuracy.</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full max-w-[600px] bg-slate-100 rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-center min-h-[300px]">
        <img 
          src="/gifs/drawing-demo.gif" 
          alt="Drawing Practice Demo" 
          className="rounded-xl w-full h-auto shadow-sm border border-slate-200"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML = '<div class="text-slate-400 text-center p-8"><p class="mb-2 font-medium">Drawing Demo GIF</p><p class="text-xs font-mono">/public/gifs/drawing-demo.gif</p></div>';
          }}
        />
      </div>
    </div>
  );
};
