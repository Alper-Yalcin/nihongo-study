import React from 'react';
import { WordItem } from '../types';

interface Props {
  words: WordItem[];
  startIndex: number;
}

export const WordTable: React.FC<Props> = ({ words, startIndex }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium uppercase tracking-wider">
            <th className="p-3 w-12 text-center">#</th>
            <th className="p-3">Kana</th>
            <th className="p-3">Romaji</th>
            <th className="p-3">Meaning</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {words.length > 0 ? (
            words.map((word, index) => (
              <tr key={word.id} className="transition-colors hover:bg-slate-50">
                <td className="p-3 text-center text-slate-400 text-sm">{startIndex + index + 1}</td>
                <td className="p-3 font-jp text-lg font-medium text-slate-800">{word.kana}</td>
                <td className="p-3 text-slate-600 font-mono">{word.romaji}</td>
                <td className="p-3 text-slate-500">{word.meaning || '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-8 text-center text-slate-500">
                No words found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
