import React from 'react';
import { Keyboard, PenTool, BookA, Headphones } from 'lucide-react';
import { AppLanguage } from '../../data/appPreferences';
import { overviewContent } from '../../content/overviewContent';

interface Props {
  language: AppLanguage;
}

const cardStyles = [
  {
    wrapper: 'bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all',
    icon: 'w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6',
    IconComponent: Keyboard
  },
  {
    wrapper: 'bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all',
    icon: 'w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6',
    IconComponent: PenTool
  },
  {
    wrapper: 'bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all',
    icon: 'w-14 h-14 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-6',
    IconComponent: Headphones
  },
  {
    wrapper: 'bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all',
    icon: 'w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6',
    IconComponent: BookA
  }
] as const;

export const FeatureCards: React.FC<Props> = ({ language }) => {
  const cards = overviewContent[language].featureCards;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-20">
      {cards.map((card, index) => {
        const style = cardStyles[index];
        const IconComponent = style.IconComponent;

        return (
          <div key={card.title} className={style.wrapper}>
            <div className={style.icon}>
              <IconComponent size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">{card.title}</h3>
            <p className="text-slate-600 leading-relaxed">{card.description}</p>
          </div>
        );
      })}
    </div>
  );
};
