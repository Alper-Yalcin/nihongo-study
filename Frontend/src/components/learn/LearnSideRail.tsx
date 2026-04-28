import React from 'react';
import { BarChart3, BookOpenText, LucideIcon, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppLanguage, ThemeMode } from '../../data/appPreferences';
import { appShellRoutes } from '../../data/appShellContent';
import { MascotFigure } from '../mascot/MascotFigure';

export type LearnSideItemId = 'journey' | 'review' | 'stats';

interface LearnSideRailProps {
  language: AppLanguage;
  themeMode: ThemeMode;
  activeItem: LearnSideItemId;
  position?: 'absolute' | 'fixed';
}

const copy = {
  tr: {
    journey: 'Yolculuk',
    review: 'Tekrar',
    stats: 'Istatistik',
    profile: 'Profil'
  },
  en: {
    journey: 'Journey',
    review: 'Review',
    stats: 'Stats',
    profile: 'Profile'
  }
} as const;

const sideItems = [
  { id: 'journey', icon: BookOpenText, href: appShellRoutes.learn },
  { id: 'review', icon: RotateCcw, href: appShellRoutes.learnReview },
  { id: 'stats', icon: BarChart3, href: appShellRoutes.learnStatistic }
] satisfies { id: LearnSideItemId; icon: LucideIcon; href: string }[];

export const LearnSideRail: React.FC<LearnSideRailProps> = ({
  language,
  themeMode,
  activeItem,
  position = 'absolute'
}) => {
  const isDark = themeMode === 'dark';
  const labels = copy[language];
  const positionClass =
    position === 'fixed'
      ? 'fixed bottom-0 left-0 top-[92px]'
      : 'absolute bottom-0 left-0 top-0';

  return (
    <aside className={`${positionClass} z-20 hidden w-[112px] flex-col items-center border-r pt-6 backdrop-blur-xl lg:flex xl:pt-16 ${
      isDark
        ? 'border-[rgba(255,255,255,0.07)] bg-[rgba(18,12,22,0.52)] shadow-[8px_0_24px_rgba(0,0,0,0.22)]'
        : 'border-[rgba(180,120,90,0.13)] bg-[rgba(255,250,244,0.52)] shadow-[8px_0_24px_rgba(132,82,62,0.04)]'
    }`}>
      <nav className="flex flex-1 flex-col items-center gap-3 xl:gap-7">
        {sideItems.map((item) => {
          const Icon = item.icon;
          const active = activeItem === item.id;

          return (
            <Link
              key={item.id}
              to={item.href}
              className={`relative flex h-[70px] w-[70px] flex-col items-center justify-center gap-1.5 rounded-[0.65rem] text-xs font-semibold transition xl:h-[82px] xl:gap-2 ${
                active
                  ? isDark
                    ? 'bg-[rgba(255,255,255,0.13)] text-[#ff7c99] shadow-[0_12px_28px_rgba(0,0,0,0.22)]'
                    : 'bg-[#fffdfb] text-[#f04d72] shadow-[0_12px_28px_rgba(220,90,110,0.18)]'
                  : isDark
                    ? 'text-[#c6d0e4] hover:bg-[rgba(255,255,255,0.08)] hover:text-white'
                    : 'text-[#67717d] hover:bg-[rgba(255,255,255,0.7)]'
              }`}
            >
              {active && <span className="absolute left-0 h-[54px] w-[3px] rounded-full bg-[#ff5b82]" />}
              <Icon size={25} strokeWidth={active ? 2.6 : 2.1} />
              <span>{labels[item.id]}</span>
            </Link>
          );
        })}
      </nav>
      <div className={`mb-4 flex flex-col items-center gap-2 text-xs font-semibold xl:mb-8 ${isDark ? 'text-[#d6deef]' : 'text-[#4f5965]'}`}>
        <div className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 shadow-[0_8px_18px_rgba(220,90,110,0.16)] ${
          isDark ? 'border-[#ffb7c7] bg-[rgba(255,255,255,0.12)]' : 'border-[#ffd6de] bg-[#fff1f4]'
        }`}>
          <MascotFigure pose="cheer" tone="brand" size={48} />
        </div>
        <span>{labels.profile}</span>
      </div>
    </aside>
  );
};

export default LearnSideRail;
