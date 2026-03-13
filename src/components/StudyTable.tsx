import React from 'react';
import { Character } from '../types';

interface StudyTableProps {
  matrix: (Character | null)[][];
  selectedGroupIds?: Set<string>;
  columnGroupIds?: (string | null)[];
  onToggleGroup?: (groupId: string) => void;
  interactive?: boolean;
}

export const StudyTable: React.FC<StudyTableProps> = ({ 
  matrix, 
  selectedGroupIds, 
  columnGroupIds, 
  onToggleGroup,
  interactive 
}) => {
  const columnCount = Math.max(...matrix.map(row => row.length), 1);

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div
        className="inline-grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(64px, 64px))` }}
      >
        {matrix.flatMap((row, rowIndex) =>
          row.map((char, colIndex) => {
            const groupId = columnGroupIds ? columnGroupIds[colIndex] : null;
            const isSelected = selectedGroupIds && groupId ? selectedGroupIds.has(groupId) : false;
            const hasSelection = Boolean(selectedGroupIds && selectedGroupIds.size > 0);
            const isClickable = Boolean(interactive && char && groupId);

            if (!char) {
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  aria-hidden="true"
                  className={`min-h-16 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-indigo-200 bg-indigo-50/50'
                      : 'border-transparent bg-transparent'
                  }`}
                />
              );
            }

            return (
              <button
                key={char.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  if (isClickable && onToggleGroup && groupId) {
                    onToggleGroup(groupId);
                  }
                }}
                className={`group flex min-h-16 flex-col items-center justify-center rounded-xl border p-3 transition-all ${
                  isSelected
                    ? 'border-indigo-200 bg-indigo-50'
                    : 'border-slate-100 bg-slate-50'
                } ${
                  isClickable
                    ? 'cursor-pointer hover:border-indigo-200 hover:bg-indigo-50'
                    : 'cursor-default'
                } ${
                  hasSelection && !isSelected ? 'opacity-40 hover:opacity-80' : ''
                }`}
              >
                <span
                  className={`mb-1 text-2xl font-jp transition-colors ${
                    isSelected ? 'text-indigo-700' : 'text-slate-800 group-hover:text-indigo-700'
                  }`}
                >
                  {char.symbol}
                </span>
                <span
                  className={`text-xs font-medium transition-colors ${
                    isSelected
                      ? 'font-semibold text-indigo-500'
                      : 'text-slate-500 group-hover:text-indigo-500'
                  }`}
                >
                  {char.label}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
