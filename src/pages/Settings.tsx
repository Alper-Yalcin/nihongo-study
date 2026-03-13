import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { SectionCard } from '../components/SectionCard';

export const Settings: React.FC = () => {
  return (
    <PageContainer title="Settings">
      <SectionCard title="Application Settings" description="Customize your learning experience.">
        <div className="space-y-6 max-w-2xl">
          
          {/* Theme Setting */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-medium text-slate-800">Theme</h4>
              <p className="text-sm text-slate-500">Choose your preferred color theme.</p>
            </div>
            <select className="block w-32 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-slate-50 px-3 py-2 border">
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>

          {/* Font Size Setting */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-medium text-slate-800">Font Size</h4>
              <p className="text-sm text-slate-500">Adjust the size of Japanese characters.</p>
            </div>
            <select className="block w-32 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-slate-50 px-3 py-2 border">
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>

          {/* Show Romaji Toggle */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-medium text-slate-800">Show Romaji</h4>
              <p className="text-sm text-slate-500">Display romaji readings below characters.</p>
            </div>
            <button type="button" className="bg-indigo-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2" role="switch" aria-checked="true">
              <span aria-hidden="true" className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
            </button>
          </div>

          {/* Study Mode */}
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-medium text-slate-800">Study Mode</h4>
              <p className="text-sm text-slate-500">Select how you want to practice.</p>
            </div>
            <select className="block w-32 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-slate-50 px-3 py-2 border">
              <option>Read</option>
              <option>Write</option>
              <option>Quiz</option>
            </select>
          </div>

          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="text-sm font-medium text-slate-800">Sound Effects</h4>
              <p className="text-sm text-slate-500">Play audio pronunciation when clicking characters.</p>
            </div>
            <button type="button" className="bg-slate-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2" role="switch" aria-checked="false">
              <span aria-hidden="true" className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
            </button>
          </div>

        </div>
      </SectionCard>
    </PageContainer>
  );
};
