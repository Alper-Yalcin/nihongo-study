import React from 'react';
import { KanaSection } from '../types';
import { StudyTable } from './StudyTable';
import { CheckSquare, Square, Keyboard, PenTool } from 'lucide-react';

interface Props {
  section: KanaSection;
  selectedGroupIds: Set<string>;
  onChangeSelection: (newSelection: Set<string>) => void;
  onStart: () => void;
  isAllSelected: boolean;
  isNoneSelected: boolean;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  totalSelectedGroups: number;
  totalSelectedChars: number;
  mode: 'typing' | 'drawing';
}

export const StudySelectionPanel: React.FC<Props> = ({
  section,
  selectedGroupIds,
  onChangeSelection,
  onStart,
  isAllSelected,
  isNoneSelected,
  onSelectAll,
  onDeselectAll,
  totalSelectedGroups,
  totalSelectedChars,
  mode
}) => {
  const toggleGroup = (groupId: string) => {
    const next = new Set(selectedGroupIds);
    if (next.has(groupId)) {
      next.delete(groupId);
    } else {
      next.add(groupId);
    }
    onChangeSelection(next);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-500 mb-2 text-center">
        Click on any character in a column to select/deselect it for study.
      </div>
      
      <StudyTable 
        matrix={section.matrix} 
        columnGroupIds={section.columnGroupIds}
        selectedGroupIds={selectedGroupIds}
        onToggleGroup={toggleGroup}
        interactive={true}
      />
      
      <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-200">
        <div className="flex space-x-3">
          <button 
            type="button"
            onClick={onSelectAll} 
            aria-pressed={isAllSelected}
            className={`text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              isAllSelected 
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                : 'text-slate-600 hover:bg-slate-200/50 border border-transparent'
            }`}
          >
            <CheckSquare size={17} strokeWidth={2.1} className="shrink-0" /> <span>All</span>
          </button>
          <button 
            type="button"
            onClick={onDeselectAll} 
            aria-pressed={isNoneSelected}
            className={`text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              isNoneSelected 
                ? 'bg-slate-200 text-slate-700 border border-slate-300' 
                : 'text-slate-600 hover:bg-slate-200/50 border border-transparent'
            }`}
          >
            <Square size={17} strokeWidth={2.1} className="shrink-0" /> <span>None</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-slate-500 font-medium">
            <span className="text-slate-700">{totalSelectedGroups}</span> cols / <span className="text-slate-700">{totalSelectedChars}</span> chars
          </div>
          <div className="flex space-x-2">
            {mode === 'typing' ? (
              <button
                onClick={onStart}
                disabled={totalSelectedGroups === 0}
                className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Typing Study"
              >
                <Keyboard size={16} className="mr-1.5" />
                Typing
              </button>
            ) : (
              <button
                onClick={onStart}
                disabled={totalSelectedGroups === 0}
                className="flex items-center px-3 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Drawing Study"
              >
                <PenTool size={16} className="mr-1.5" />
                Drawing
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
