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
  return (
    <div className="w-full overflow-x-auto pb-2">
      <table className="border-collapse w-max bg-white text-center text-slate-800 shadow-sm rounded-sm">
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((char, colIndex) => {
                const groupId = columnGroupIds ? columnGroupIds[colIndex] : null;
                const isSelected = selectedGroupIds && groupId ? selectedGroupIds.has(groupId) : false;
                const hasSelection = selectedGroupIds && selectedGroupIds.size > 0;
                const isClickable = interactive && char && groupId;

                return (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => {
                      if (isClickable && onToggleGroup && groupId) {
                        onToggleGroup(groupId);
                      }
                    }}
                    className={`border border-slate-200 p-1 w-14 h-14 align-middle transition-all ${
                      char ? 'bg-white' : 'bg-slate-50/30'
                    } ${
                      isClickable ? 'cursor-pointer hover:bg-indigo-50/50' : ''
                    } ${
                      isSelected ? 'bg-indigo-50 border-indigo-200' : ''
                    } ${
                      hasSelection && !isSelected && char ? 'opacity-40 hover:opacity-80' : ''
                    }`}
                  >
                    {char ? (
                      <div className={`flex flex-col items-center justify-center ${isSelected ? 'text-indigo-900' : ''}`}>
                        <span className={`text-xl font-medium font-jp leading-none mb-1 transition-colors ${isSelected ? 'text-indigo-700' : 'text-slate-800'}`}>
                          {char.symbol}
                        </span>
                        <span className={`text-[10px] font-mono tracking-wide leading-none ${isSelected ? 'text-indigo-500 font-semibold' : 'text-slate-400'}`}>
                          {char.label}
                        </span>
                      </div>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
