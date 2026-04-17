import React, { useEffect } from 'react';
import { Character } from '../../types';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AudioButton } from './AudioButton';
import { AppLanguage } from '../../data/appPreferences';
import { studyContent } from '../../data/studyContent';
import { getGoogleTranslateKanaAudioSrc } from '../../data/kanaAudio';

interface Props {
  characters: Character[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  script: 'hiragana' | 'katakana';
  language: AppLanguage;
}

export const CharacterModal: React.FC<Props> = ({
  characters,
  currentIndex,
  onNext,
  onPrev,
  onClose,
  script,
  language
}) => {
  const copy = studyContent[language];
  const character = characters[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onClose]);

  if (!character) return null;

  const audioSrc = getGoogleTranslateKanaAudioSrc(character.id) ?? `/audio/${script}/${character.id}.mp3`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
          aria-label={copy.common.close}
          title={copy.common.close}
        >
          <X size={24} />
        </button>

        <div className="p-8 flex flex-col items-center">
          <div className="text-8xl font-jp text-slate-800 mb-6 mt-4">
            {character.symbol}
          </div>
          
          <div className="text-3xl font-bold text-slate-600 mb-8">
            {character.label}
          </div>

          <AudioButton 
            src={audioSrc}
            language={language}
            autoPlay={true}
            size={32}
            className="w-16 h-16 mb-8"
          />

          <div className="flex items-center justify-between w-full px-4 text-slate-400">
            <button
              onClick={onPrev}
              className="p-3 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"
              aria-label={copy.common.previous}
              title={copy.common.previous}
            >
              <ChevronLeft size={28} />
            </button>
            <span className="text-sm font-medium">
              {currentIndex + 1} / {characters.length}
            </span>
            <button
              onClick={onNext}
              className="p-3 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"
              aria-label={copy.common.next}
              title={copy.common.next}
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
