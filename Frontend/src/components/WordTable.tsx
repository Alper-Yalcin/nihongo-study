import React from 'react';
import { WordItem } from '../types';
import { AppLanguage } from '../data/appPreferences';
import { studyContent } from '../learn/data/studyContent';
import { getLocalizedWordMeaning, MeaningTranslations } from '../utils/wordMeaning';

interface Props {
  language: AppLanguage;
  meaningTranslations?: MeaningTranslations | null;
  words: WordItem[];
  startIndex: number;
  onSelectWord?: (word: WordItem) => void;
  selectedWordId?: string | null;
  detailActionLabel?: string;
}

export const WordTable: React.FC<Props> = ({
  language,
  meaningTranslations,
  words,
  startIndex,
  onSelectWord,
  selectedWordId,
  detailActionLabel
}) => {
  const copy = studyContent[language];
  const showDetailAction = typeof onSelectWord === 'function';

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium uppercase tracking-wider">
            <th className="p-3 w-12 text-center">#</th>
            <th className="p-3">{copy.wordTable.kana}</th>
            <th className="p-3">{copy.wordTable.romaji}</th>
            <th className="p-3">{copy.wordTable.meaning}</th>
            {showDetailAction && <th className="p-3 text-right" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {words.length > 0 ? (
            words.map((word, index) => (
              <tr
                key={word.id}
                className={`transition-colors hover:bg-slate-50 ${selectedWordId === word.id ? 'bg-indigo-50/60' : ''}`}
              >
                <td className="p-3 text-center text-slate-400 text-sm">{startIndex + index + 1}</td>
                <td className="p-3 font-jp text-lg font-medium text-slate-800">
                  {word.kanji ? (
                    <div className="space-y-1">
                      <div>{word.kanji}</div>
                      <div className="text-sm font-normal text-slate-500">{word.kana}</div>
                    </div>
                  ) : (
                    word.kana
                  )}
                </td>
                <td className="p-3 text-slate-600 font-mono">{word.romaji}</td>
                <td className="p-3 text-slate-500">{getLocalizedWordMeaning(word.meaning, language, meaningTranslations) || '-'}</td>
                {showDetailAction && (
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectWord(word)}
                      className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                    >
                      {detailActionLabel}
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={showDetailAction ? 5 : 4} className="p-8 text-center text-slate-500">
                {copy.wordTable.empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
