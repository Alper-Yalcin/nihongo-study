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

  const allCharacters = sections.flatMap(section =>
    section.matrix.flatMap(row => row.filter((char): char is Character => char !== null))
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
      {sections.map(section => {
        const columnCount = Math.max(...section.matrix.map(row => row.length), 1);

        return (
          <div key={section.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4">{section.title}</h3>
          <div className="w-full overflow-x-auto pb-2">
            <div
              className="inline-grid gap-2"
              style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(64px, 64px))` }}
            >
              {section.matrix.flatMap((row, rowIndex) =>
                row.map((char, colIndex) =>
                  char ? (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => handleCharacterClick(char)}
                      className="group flex min-h-16 flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:border-indigo-200 hover:bg-indigo-50"
                    >
                      <span className="mb-1 text-2xl font-jp text-slate-800 group-hover:text-indigo-700">
                        {char.symbol}
                      </span>
                      <span className="text-xs font-medium text-slate-500 group-hover:text-indigo-500">
                        {char.label}
                      </span>
                    </button>
                  ) : (
                    <div
                      key={`${section.id}-${rowIndex}-${colIndex}`}
                      aria-hidden="true"
                      className="min-h-16 rounded-xl"
                    />
                  )
                )
              )}
            </div>
          </div>
        </div>
        );
      })}

      {modalOpen && allCharacters.length > 0 && (
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
