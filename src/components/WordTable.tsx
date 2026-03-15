import React from 'react';
import { WordItem } from '../types';
import { AppLanguage } from '../data/appPreferences';
import { studyContent } from '../data/studyContent';
import { getLocalizedWordMeaning, MeaningTranslations } from '../utils/wordMeaning';

interface Props {
  language: AppLanguage;
  meaningTranslations?: MeaningTranslations | null;
  words: WordItem[];
  startIndex: number;
}

export const WordTable: React.FC<Props> = ({ language, meaningTranslations, words, startIndex }) => {
  const copy = studyContent[language];

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium uppercase tracking-wider">
            <th className="p-3 w-12 text-center">#</th>
            <th className="p-3">{copy.wordTable.level}</th>
            <th className="p-3">{copy.wordTable.kana}</th>
            <th className="p-3">{copy.wordTable.romaji}</th>
            <th className="p-3">{copy.wordTable.meaning}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {words.length > 0 ? (
            words.map((word, index) => (
              <tr key={word.id} className="transition-colors hover:bg-slate-50">
                <td className="p-3 text-center text-slate-400 text-sm">{startIndex + index + 1}</td>
                <td className="p-3">
                  <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                    {word.jlptLevel || '-'}
                  </span>
                </td>
                <td className="p-3 font-jp text-lg font-medium text-slate-800">{word.kana}</td>
                <td className="p-3 text-slate-600 font-mono">{word.romaji}</td>
                <td className="p-3 text-slate-500">{getLocalizedWordMeaning(word.meaning, language, meaningTranslations) || '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-8 text-center text-slate-500">
                {copy.wordTable.empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
