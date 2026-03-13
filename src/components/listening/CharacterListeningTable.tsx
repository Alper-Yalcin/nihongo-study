import React, { useState } from 'react';
import { KanaSection, Character } from '../../types';
import { CharacterModal } from './CharacterModal';

interface Props {
  sections: KanaSection[];
  script: 'hiragana' | 'katakana';
}

export const CharacterListeningTable: React.FC<Props> = ({ sections, script }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Flatten all characters to allow easy navigation
  const allCharacters = sections.flatMap(section => 
    section.groups.flatMap(group => group.characters)
  );

  const handleCharacterClick = (char: Character) => {
    const index = allCharacters.findIndex(c => c.id === char.id);
    if (index !== -1) {
      setCurrentIndex(index);
      setModalOpen(true);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allCharacters.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allCharacters.length) % allCharacters.length);
  };

  return (
    <div className="space-y-8">
      {sections.map(section => (
        <div key={section.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4">{section.title}</h3>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {section.groups.map(group => (
              group.characters.map(char => (
                <button
                  key={char.id}
                  onClick={() => handleCharacterClick(char)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors group"
                >
                  <span className="text-2xl font-jp text-slate-800 group-hover:text-indigo-700 mb-1">
                    {char.symbol}
                  </span>
                  <span className="text-xs font-medium text-slate-500 group-hover:text-indigo-500">
                    {char.label}
                  </span>
                </button>
              ))
            ))}
          </div>
        </div>
      ))}

      {modalOpen && (
        <CharacterModal
          characters={allCharacters}
          currentIndex={currentIndex}
          onNext={handleNext}
          onPrev={handlePrev}
          onClose={() => setModalOpen(false)}
          script={script}
        />
      )}
    </div>
  );
};
