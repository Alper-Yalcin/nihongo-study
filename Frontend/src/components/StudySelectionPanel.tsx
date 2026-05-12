import React from 'react';
import { KanaSection, TypingMode, DrawingMode } from '../types';
import { StudyTable } from './StudyTable';
import { CheckSquare, Square, Keyboard, PenTool } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { studyContent } from '../learn/data/studyContent';
import { StudyModeSelector } from './StudyModeSelector';

interface Props {
  section: KanaSection;
  language: AppLanguage;
  selectedGroupIds: Set<string>;
  onChangeSelection: (newSelection: Set<string>) => void;
  onStart: () => void;
  typingMode: TypingMode;
  onTypingModeChange: (mode: TypingMode) => void;
  drawingMode: DrawingMode;
  onDrawingModeChange: (mode: DrawingMode) => void;
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
  language,
  selectedGroupIds,
  onChangeSelection,
  onStart,
  typingMode,
  onTypingModeChange,
  drawingMode,
  onDrawingModeChange,
  isAllSelected,
  isNoneSelected,
  onSelectAll,
  onDeselectAll,
  totalSelectedGroups,
  totalSelectedChars,
  mode
}) => {
  const copy = studyContent[language];
  const typingModeButtons: { id: TypingMode; label: string }[] = [
    { id: 'current', label: copy.studyRun.currentMode },
    { id: 'reverse', label: copy.studyRun.reverseMode },
    { id: 'timed', label: copy.studyRun.timedMode }
  ];
  const drawingModeButtons: { id: DrawingMode; label: string }[] = [
    { id: 'practice', label: copy.drawing.practiceMode },
    { id: 'test', label: copy.drawing.testMode },
    { id: 'speed', label: copy.drawing.speedMode },
    { id: 'memory', label: copy.drawing.memoryMode }
  ];

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
        {copy.selection.instruction}
      </div>
      
      <StudyTable 
        matrix={section.matrix} 
        columnGroupIds={section.columnGroupIds}
        selectedGroupIds={selectedGroupIds}
        onToggleGroup={toggleGroup}
        interactive={true}
      />

      {mode === 'typing' && (
        <StudyModeSelector
          label={copy.studyRun.modeLabel}
          value={typingMode}
          options={typingModeButtons}
          onChange={onTypingModeChange}
          gridClassName="grid-cols-3"
        />
      )}

      {mode === 'drawing' && (
        <StudyModeSelector
          label={copy.drawing.modeLabel}
          value={drawingMode}
          options={drawingModeButtons}
          onChange={onDrawingModeChange}
          gridClassName="grid-cols-2 md:grid-cols-4"
        />
      )}
      
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
            {isAllSelected ? (
              <CheckSquare size={17} strokeWidth={2.1} className="shrink-0" />
            ) : (
              <Square size={17} strokeWidth={2.1} className="shrink-0" />
            )}{' '}
            <span>{copy.selection.all}</span>
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
            {isNoneSelected ? (
              <CheckSquare size={17} strokeWidth={2.1} className="shrink-0" />
            ) : (
              <Square size={17} strokeWidth={2.1} className="shrink-0" />
            )}{' '}
            <span>{copy.selection.none}</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-slate-500 font-medium">
            {copy.selection.summary(totalSelectedGroups, totalSelectedChars)}
          </div>
          <div className="flex space-x-2">
            {mode === 'typing' ? (
              <button
                onClick={onStart}
                disabled={totalSelectedGroups === 0}
                className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={copy.selection.typingStudyTitle}
              >
                <Keyboard size={16} className="mr-1.5" />
                {copy.selection.startTyping}
              </button>
            ) : (
              <button
                onClick={onStart}
                disabled={totalSelectedGroups === 0}
                className="flex items-center px-3 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={copy.selection.drawingStudyTitle}
              >
                <PenTool size={16} className="mr-1.5" />
                {copy.selection.startDrawing}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
