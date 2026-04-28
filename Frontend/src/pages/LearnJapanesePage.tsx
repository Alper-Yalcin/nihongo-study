import React, { useMemo } from 'react';
import {
  BarChart3,
  BookOpen,
  BookOpenText,
  RotateCcw,
  Settings2
} from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import {
  flattenLearnCourseUnits,
  getLearnCourseSections
} from '../data/learnCourseContent';
import { useLearnCourseProgress } from '../hooks/useLearnCourseProgress';
import { MascotFigure } from '../components/mascot/MascotFigure';

interface LearnJapanesePageProps {
  language: AppLanguage;
}

interface UnitMarker {
  id: string;
  x: number;
  y: number;
  badge: string;
  title: string;
  subtitle: string;
  tone: 'pink' | 'blue' | 'purple' | 'gray';
}

const pageCopy = {
  tr: {
    title: 'Japonca Yolculugu',
    subtitle: "Dan'a giden yolculugun burada baslar.",
    side: {
      journey: 'Yolculuk',
      review: 'Tekrar',
      stats: 'Istatistik',
      settings: 'Ayarlar',
      profile: 'Profil'
    },
    progress: 'Ilerleme'
  },
  en: {
    title: 'Japanese Journey',
    subtitle: "Your journey toward Dan starts here.",
    side: {
      journey: 'Journey',
      review: 'Review',
      stats: 'Stats',
      settings: 'Settings',
      profile: 'Profile'
    },
    progress: 'Progress'
  }
} as const;

// x, y: absolute coords within the 1320×1120 inner div
const unitMarkers: UnitMarker[] = [
  { id: 'u1', x: 20,  y: 270, badge: 'ÜNİTE 1', title: 'Temel İletişim',       subtitle: 'Selamlaşma ve basit ifadeler',   tone: 'pink' },
  { id: 'u2', x: 1090, y: 510, badge: 'ÜNİTE 2', title: 'İsimleri Öğreniyorum', subtitle: 'Temel isimler ve tanışma',       tone: 'blue' },
  { id: 'u3', x: 155, y: 585, badge: 'ÜNİTE 3', title: 'Günlük Hayat',         subtitle: 'Günlük kelimeler ve konuşmalar', tone: 'purple' },
  { id: 'u4', x: 20,  y: 960, badge: 'ÜNİTE 4', title: 'Fiiller ve Eylemler',  subtitle: 'Temel fiiller ve cümleler',      tone: 'gray' }
];

const sideItems = [
  { id: 'journey', icon: BookOpenText },
  { id: 'review', icon: RotateCcw },
  { id: 'stats', icon: BarChart3 },
  { id: 'settings', icon: Settings2 }
] as const;

const badgeStyles: Record<UnitMarker['tone'], string> = {
  pink:   'bg-[linear-gradient(135deg,#ff6b8d,#e94467)]',
  blue:   'bg-[linear-gradient(135deg,#63b9ff,#3e8edc)]',
  purple: 'bg-[linear-gradient(135deg,#a984f0,#7e52d0)]',
  gray:   'bg-[linear-gradient(135deg,#aaaaaa,#777777)]'
};

const LearnSideRail: React.FC<{ copy: typeof pageCopy.tr.side | typeof pageCopy.en.side }> = ({ copy }) => (
  <aside className="absolute bottom-0 left-0 top-0 z-20 hidden w-[112px] flex-col items-center border-r border-[#f2e7df] bg-[rgba(255,255,255,0.76)] pt-16 shadow-[8px_0_30px_rgba(150,96,72,0.05)] backdrop-blur lg:flex">
    <nav className="flex flex-1 flex-col items-center gap-7">
      {sideItems.map((item, index) => {
        const Icon = item.icon;
        const active = index === 0;

        return (
          <button
            key={item.id}
            type="button"
            className={`relative flex h-[82px] w-[70px] flex-col items-center justify-center gap-2 rounded-[0.65rem] text-xs font-semibold transition ${
              active
                ? 'bg-[#fffdfb] text-[#f04d72] shadow-[0_12px_28px_rgba(220,90,110,0.18)]'
                : 'text-[#67717d] hover:bg-[rgba(255,255,255,0.7)]'
            }`}
          >
            {active && <span className="absolute left-0 h-[54px] w-[3px] rounded-full bg-[#ff5b82]" />}
            <Icon size={25} strokeWidth={active ? 2.4 : 2.1} />
            <span>{copy[item.id]}</span>
          </button>
        );
      })}
    </nav>
    <div className="mb-8 flex flex-col items-center gap-2 text-xs font-semibold text-[#4f5965]">
      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-[#ffd6de] bg-[#fff1f4] shadow-[0_8px_18px_rgba(220,90,110,0.16)]">
        <MascotFigure pose="cheer" tone="brand" size={48} />
      </div>
      <span>{copy.profile}</span>
    </div>
  </aside>
);

const UnitMarkerLabel: React.FC<{ marker: UnitMarker }> = ({ marker }) => (
  <div className="absolute z-[5]" style={{ left: marker.x, top: marker.y }}>
    <div className={`inline-flex rounded-[0.45rem] px-3 py-1.5 text-sm font-black text-white shadow-[0_8px_16px_rgba(160,70,90,0.18)] ${badgeStyles[marker.tone]}`}>
      {marker.badge}
    </div>
    <h2 className="mt-2 text-xl font-extrabold tracking-[-0.01em] text-[#1f2b3b]">{marker.title}</h2>
    <p className="mt-1 text-sm font-medium text-[#465161]">{marker.subtitle}</p>
  </div>
);

export const LearnJapanesePage: React.FC<LearnJapanesePageProps> = ({ language }) => {
  const copy = pageCopy[language];
  const sections = useMemo(() => getLearnCourseSections(language), [language]);
  const units = useMemo(() => flattenLearnCourseUnits(sections), [sections]);
  const orderedUnitIds = useMemo(() => units.map((unit) => unit.id), [units]);
  const { completedCount } = useLearnCourseProgress(orderedUnitIds);

  return (
    <div
      className="relative min-h-[1120px] overflow-hidden rounded-b-[0.6rem] bg-[#fff5ef] bg-cover bg-top bg-no-repeat text-[#1f2937]"
      style={{ backgroundImage: "url('/images/learn-background.png')" }}
    >
      <div className="sr-only">
        <h1>{copy.title}</h1>
        <p>
          {completedCount} / {units.length} {copy.progress}
        </p>
      </div>
      <LearnSideRail copy={copy.side} />

      <section className="relative z-10 min-h-[1120px] overflow-x-auto overflow-y-hidden pl-0 lg:pl-[112px]">
        <div className="relative h-[1120px] min-w-[1320px]">
          <div className="absolute left-[62px] top-[34px] lg:left-[170px]">
            <h1 className="text-[28px] font-extrabold tracking-[-0.02em] text-[#1f2b3b]">{copy.title}</h1>
            <p className="mt-2 text-[17px] font-medium text-[#405064]">{copy.subtitle}</p>
          </div>

          {unitMarkers.map((marker) => (
            <UnitMarkerLabel key={marker.id} marker={marker} />
          ))}

          <div className="absolute bottom-4 right-12 flex h-24 w-40 items-center justify-center opacity-80">
            <BookOpen size={32} className="text-[#a7a0a0]" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearnJapanesePage;
