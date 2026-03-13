import React, { useMemo, useState } from 'react';
import { KanaSection, Character } from '../../types';
import { CharacterModal } from './CharacterModal';

interface Props {
  section: KanaSection;
  script: 'hiragana' | 'katakana';
}

export const CharacterListeningTable: React.FC<Props> = ({ section, script }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const characters = useMemo(
    () => section.matrix.flatMap(row => row.filter((char): char is Character => char !== null)),
    [section]
  );

  const handleCharacterClick = (char: Character) => {
    const index = characters.findIndex(candidate => candidate.id === char.id);
    if (index !== -1) {
      setCurrentIndex(index);
      setModalOpen(true);
    }
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % characters.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + characters.length) % characters.length);
  };

  return (
    <>
      <div className="w-full overflow-x-auto pb-2">
        <div
          className="inline-grid gap-2"
          style={{ gridTemplateColumns: `repeat(${Math.max(...section.matrix.map(row => row.length), 1)}, minmax(64px, 64px))` }}
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

      {modalOpen && characters.length > 0 && (
        <CharacterModal
          characters={characters}
          currentIndex={currentIndex}
          onNext={handleNext}
          onPrev={handlePrev}
          onClose={() => setModalOpen(false)}
          script={script}
        />
      )}
    </>
  );
};
