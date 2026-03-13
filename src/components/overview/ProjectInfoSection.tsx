import React from 'react';
import { Github, Info } from 'lucide-react';

export const ProjectInfoSection: React.FC = () => {
  return (
    <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 mt-12">
      <div className="max-w-3xl mx-auto text-center">
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Info size={32} className="text-slate-300" />
        </div>
        <h2 className="text-3xl font-bold mb-6">About This Project</h2>
        <p className="text-slate-300 text-lg leading-relaxed mb-8">
          This project was built to help learners practice Japanese kana through interactive exercises. 
          It combines typing practice, handwriting training, and vocabulary quizzes in a single learning environment.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-slate-800">
          <a 
            href="#" 
            className="flex items-center text-slate-400 hover:text-white transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <Github size={20} className="mr-2" />
            <span>View on GitHub</span>
          </a>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span className="text-slate-500">Version 1.0.0</span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span className="text-slate-500">Future Roadmap: Kanji Study</span>
        </div>
      </div>
    </div>
  );
};
