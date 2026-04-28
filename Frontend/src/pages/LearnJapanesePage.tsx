import React, { useMemo } from 'react';
import {
  BarChart3,
  BookOpen,
  BookOpenText,
  Headphones,
  LockKeyhole,
  LucideIcon,
  MessageCircleMore,
  Mic,
  RotateCcw,
  Settings2,
  Sprout,
  Star,
  Utensils
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

type NodeTone = 'pink' | 'orange' | 'purple' | 'blue' | 'gray';

interface LessonNode {
  id: string;
  number: number;
  x: number;
  y: number;
  title: string;
  subtitle?: string;
  tone: NodeTone;
  icon: LucideIcon;
  checkpoint?: boolean;
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
  { id: 'u1', x: 20,   y: 270, badge: 'ÜNİTE 1', title: 'Temel İletişim',        subtitle: 'Selamlaşma ve basit ifadeler',   tone: 'pink'   },
  { id: 'u2', x: 820, y: 440, badge: 'ÜNİTE 2', title: 'İsimleri Öğreniyorum',  subtitle: 'Temel isimler ve tanışma',       tone: 'blue'   },
  { id: 'u3', x: 155,  y: 585, badge: 'ÜNİTE 3', title: 'Günlük Hayat',          subtitle: 'Günlük kelimeler ve konuşmalar', tone: 'purple' },
  { id: 'u4', x: 20,   y: 960, badge: 'ÜNİTE 4', title: 'Fiiller ve Eylemler',   subtitle: 'Temel fiiller ve cümleler',      tone: 'gray'   }
];

// x, y: node center, absolute within the 1320×1120 inner div
const lessonNodes: LessonNode[] = [
  // Ünite 1 — soldan sağa (y≈305)
  { id: 'n1',  number: 1,  x: 350,  y: 355, title: 'Hiragana 1',      subtitle: 'A - O',          tone: 'pink',   icon: Sprout           },
  { id: 'n2',  number: 2,  x: 530,  y: 355, title: 'Hiragana 2',      subtitle: 'Ka - Ko',        tone: 'pink',   icon: Sprout           },
  { id: 'n3',  number: 3,  x: 710,  y: 355, title: 'Selamlaşma',      subtitle: 'Konnichiwa!',    tone: 'pink',   icon: MessageCircleMore},
  { id: 'n4',  number: 4,  x: 890,  y: 355, title: 'Dinleme 1',       subtitle: 'Sesler',         tone: 'pink',   icon: Headphones       },
  { id: 'n5',  number: 5,  x: 1070,  y: 355, title: 'Kontrol Noktası', subtitle: 'Ünite 1 Sonu',   tone: 'orange', icon: Star,  checkpoint: true },

  // Ünite 2 — sağdan sola (y≈545)
  { id: 'n6',  number: 6,  x: 1270, y: 475, title: 'İsimler 1',       subtitle: 'Kişiler',        tone: 'blue',   icon: LockKeyhole      },
  { id: 'n7',  number: 7,  x: 1160,  y: 645, title: 'İsimler 2',       subtitle: 'Eşyalar',        tone: 'blue',   icon: LockKeyhole      },
  { id: 'n8',  number: 8,  x: 1310,  y: 645, title: 'İsimler 3',       subtitle: 'Hajimemashite',  tone: 'blue',   icon: LockKeyhole      },
  { id: 'n9',  number: 9,  x: 1310,  y: 800, title: 'İsimler 4', subtitle: 'Ü',   tone: 'blue', icon: LockKeyhole  },
  { id: 'n10',  number: 10,  x: 1160,  y: 800, title: 'Kontrol Noktası', subtitle: 'Ünite 2 Sonu',   tone: 'orange', icon: Star,  checkpoint: true },

  // Ünite 3 — sağdan sola (y≈655)
  { id: 'n11', number: 11, x: 810,  y: 835, title: 'Konuşma 1',       subtitle: 'Temel cümleler', tone: 'purple', icon: Mic              },
  { id: 'n12', number: 12, x: 660,  y: 755, title: 'Yiyecekler',      subtitle: 'Tabemono',       tone: 'purple', icon: Utensils         },
  { id: 'n13', number: 13, x: 520,  y: 755, title: 'Yiyecekler',      subtitle: 'Tabemono',       tone: 'purple', icon: Utensils         },
  { id: 'n14', number: 14, x: 370,  y: 755, title: 'Yiyecekler',      subtitle: 'Tabemono',       tone: 'purple', icon: Utensils         },
  { id: 'n15', number: 15, x: 240,  y: 805, title: 'Kontrol Noktası', subtitle: 'Ünite 3 Sonu',   tone: 'orange', icon: Star,  checkpoint: true },

  // Ünite 4 — soldan sağa (y≈995)
  { id: 'n16', number: 16, x: 280,  y: 995, title: 'Fiiller 1',       subtitle: 'Taberu',         tone: 'gray',   icon: LockKeyhole      },
  { id: 'n17', number: 17, x: 460,  y: 995, title: 'Fiiller 1',       subtitle: 'Taberu',         tone: 'gray',   icon: LockKeyhole      },
  { id: 'n18', number: 18, x: 640,  y: 995, title: 'Fiiller 2',       subtitle: '~ku',            tone: 'gray',   icon: LockKeyhole      },
  { id: 'n19', number: 19, x: 820,  y: 995, title: 'Cümleler 1',      subtitle: '~ desu',         tone: 'gray',   icon: LockKeyhole      },
  { id: 'n20', number: 20, x: 1050,  y: 995, title: 'Büyük Kontrol',   subtitle: 'Ünite 4 Sonu',   tone: 'orange', icon: Star,  checkpoint: true },
];

const sideItems = [
  { id: 'journey', icon: BookOpenText },
  { id: 'review',  icon: RotateCcw    },
  { id: 'stats',   icon: BarChart3    },
  { id: 'settings',icon: Settings2   }
] as const;

const toneStyles: Record<NodeTone, string> = {
  pink:   'border-[#ffe3ea] bg-[linear-gradient(145deg,#ff9fb4,#ef4d73)] shadow-[0_8px_0_#d8385c,0_18px_30px_rgba(237,75,112,0.24)]',
  orange: 'border-[#ffe1ad] bg-[linear-gradient(145deg,#ffc75f,#f09a20)] shadow-[0_8px_0_#d77c13,0_18px_32px_rgba(240,154,32,0.28)]',
  purple: 'border-[#e6d5ff] bg-[linear-gradient(145deg,#b990f4,#8753d5)] shadow-[0_8px_0_#7142b8,0_18px_32px_rgba(135,83,213,0.25)]',
  blue:   'border-[#d4ebff] bg-[linear-gradient(145deg,#7cc1ff,#3a8edc)] shadow-[0_8px_0_#2870b6,0_18px_30px_rgba(58,142,220,0.24)]',
  gray:   'border-[#f3f0ee] bg-[linear-gradient(145deg,#c8c8c8,#868686)] shadow-[0_8px_0_#777,0_18px_28px_rgba(80,80,80,0.14)]'
};

const badgeNumberStyles: Record<NodeTone, string> = {
  pink:   'bg-[#f05b7c]',
  orange: 'bg-[#ffa028]',
  purple: 'bg-[#8957da]',
  blue:   'bg-[#3a8edc]',
  gray:   'bg-[#8d8d8d]'
};

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

const LessonNodeButton: React.FC<{ node: LessonNode }> = ({ node }) => {
  const Icon = node.icon;
  const size = node.checkpoint ? 92 : 82;
  const iconSize = node.checkpoint ? 42 : 34;

  return (
    <div
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center z-[10]"
      style={{ left: node.x, top: node.y }}
    >
      <div
        className={`relative flex items-center justify-center rounded-full border-[7px] text-white ${toneStyles[node.tone]}`}
        style={{ width: size, height: size }}
      >
        <span className="absolute inset-[5px] rounded-full border border-white/55 bg-white/10" />
        <Icon
          size={iconSize}
          strokeWidth={2.6}
          fill={node.icon === Star ? 'currentColor' : 'none'}
          className="relative"
        />
        <span
          className={`absolute -right-2 -top-3 flex h-8 min-w-8 items-center justify-center rounded-full border-[3px] border-white px-1 text-sm font-black text-white shadow-[0_5px_10px_rgba(80,45,55,0.18)] ${badgeNumberStyles[node.tone]}`}
        >
          {node.number}
        </span>
      </div>
      <div className="mt-3 max-w-[140px] text-center">
        <div className={`text-[14px] font-bold leading-tight ${node.tone === 'orange' ? 'text-[#e36b1d]' : 'text-[#1e2a3a]'}`}>
          {node.title}
        </div>
        {node.subtitle && (
          <div className="mt-0.5 text-[12px] leading-tight text-[#4f5967]">{node.subtitle}</div>
        )}
      </div>
    </div>
  );
};

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

          {lessonNodes.map((node) => (
            <LessonNodeButton key={node.id} node={node} />
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
