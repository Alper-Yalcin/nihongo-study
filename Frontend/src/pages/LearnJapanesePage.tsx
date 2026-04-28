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
import { AppLanguage, ThemeMode } from '../data/appPreferences';
import {
  flattenLearnCourseUnits,
  getLearnCourseSections
} from '../data/learnCourseContent';
import { useLearnCourseProgress } from '../hooks/useLearnCourseProgress';
import { MascotFigure } from '../components/mascot/MascotFigure';

interface LearnJapanesePageProps {
  language: AppLanguage;
  themeMode: ThemeMode;
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

interface RoadmapLink {
  id: string;
  fromId: string;
  toId: string;
  tone: NodeTone;
  curveOffset?: number;
}

interface FallingFlower {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  spin: number;
  opacity: number;
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
  { id: 'u2', x: 950, y: 590, badge: 'ÜNİTE 2', title: 'İsimleri Öğreniyorum',  subtitle: 'Temel isimler ve tanışma',       tone: 'blue'   },
  { id: 'u3', x: 300,  y: 555, badge: 'ÜNİTE 3', title: 'Günlük Hayat',          subtitle: 'Günlük kelimeler ve konuşmalar', tone: 'purple' },
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
  { id: 'n7',  number: 7,  x: 1220,  y: 645, title: 'İsimler 2',       subtitle: 'Eşyalar',        tone: 'blue',   icon: LockKeyhole      },
  { id: 'n8',  number: 8,  x: 1410,  y: 645, title: 'İsimler 3',       subtitle: 'Hajimemashite',  tone: 'blue',   icon: LockKeyhole      },
  { id: 'n9',  number: 9,  x: 1310,  y: 800, title: 'İsimler 4', subtitle: 'Ü',   tone: 'blue', icon: LockKeyhole  },
  { id: 'n10',  number: 10,  x: 1100,  y: 800, title: 'Kontrol Noktası', subtitle: 'Ünite 2 Sonu',   tone: 'orange', icon: Star,  checkpoint: true },

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

const roadmapTrackStyles = {
  light: {
    shadow: '#e8a69d',
    rim: '#f4bdb6',
    outer: '#fde2df',
    inner: '#fff8f3',
    highlight: '#ffffff',
    shadowWidth: 40,
    rimWidth: 34,
    outerWidth: 30,
    innerWidth: 20,
    highlightWidth: 12,
    shadowOpacity: 0.22,
    highlightOpacity: 0.42
  },
  dark: {
    shadow: '#ff8fa3',
    rim: '#ffb7c1',
    outer: '#ffd9dc',
    inner: '#fff4ef',
    highlight: '#ffffff',
    shadowWidth: 34,
    rimWidth: 28,
    outerWidth: 24,
    innerWidth: 14,
    highlightWidth: 6,
    shadowOpacity: 0.26,
    highlightOpacity: 0.26
  }
};

const roadmapLinks: RoadmapLink[] = [
  { id: 'n1-n2', fromId: 'n1', toId: 'n2', tone: 'pink' },
  { id: 'n2-n3', fromId: 'n2', toId: 'n3', tone: 'pink' },
  { id: 'n3-n4', fromId: 'n3', toId: 'n4', tone: 'pink' },
  { id: 'n4-n5', fromId: 'n4', toId: 'n5', tone: 'orange' },
  { id: 'n5-n6', fromId: 'n5', toId: 'n6', tone: 'blue' },
  { id: 'n6-n7', fromId: 'n6', toId: 'n7', tone: 'blue' },
  { id: 'n7-n8', fromId: 'n7', toId: 'n8', tone: 'blue' },
  { id: 'n8-n9', fromId: 'n8', toId: 'n9', tone: 'blue', curveOffset: 90 },
  { id: 'n9-n10', fromId: 'n9', toId: 'n10', tone: 'orange' },
  { id: 'n10-n11', fromId: 'n10', toId: 'n11', tone: 'purple' },
  { id: 'n11-n12', fromId: 'n11', toId: 'n12', tone: 'purple' },
  { id: 'n12-n13', fromId: 'n12', toId: 'n13', tone: 'purple' },
  { id: 'n13-n14', fromId: 'n13', toId: 'n14', tone: 'purple' },
  { id: 'n14-n15', fromId: 'n14', toId: 'n15', tone: 'orange' },
  { id: 'n15-n16', fromId: 'n15', toId: 'n16', tone: 'gray' },
  { id: 'n16-n17', fromId: 'n16', toId: 'n17', tone: 'gray' },
  { id: 'n17-n18', fromId: 'n17', toId: 'n18', tone: 'gray' },
  { id: 'n18-n19', fromId: 'n18', toId: 'n19', tone: 'gray' },
  { id: 'n19-n20', fromId: 'n19', toId: 'n20', tone: 'orange' }
];

const fallingFlowers: FallingFlower[] = [
  { id: 1, left: 4, size: 18, duration: 24, delay: -18, drift: 82, spin: 320, opacity: 0.62 },
  { id: 2, left: 8, size: 12, duration: 19, delay: -7, drift: -54, spin: -260, opacity: 0.42 },
  { id: 3, left: 13, size: 20, duration: 27, delay: -24, drift: 96, spin: 380, opacity: 0.56 },
  { id: 4, left: 18, size: 14, duration: 22, delay: -11, drift: -72, spin: -340, opacity: 0.46 },
  { id: 5, left: 23, size: 17, duration: 25, delay: -4, drift: 68, spin: 300, opacity: 0.54 },
  { id: 6, left: 28, size: 11, duration: 18, delay: -16, drift: -44, spin: -220, opacity: 0.38 },
  { id: 7, left: 33, size: 19, duration: 29, delay: -27, drift: 112, spin: 420, opacity: 0.6 },
  { id: 8, left: 38, size: 13, duration: 21, delay: -9, drift: -64, spin: -300, opacity: 0.44 },
  { id: 9, left: 44, size: 16, duration: 24, delay: -21, drift: 78, spin: 360, opacity: 0.52 },
  { id: 10, left: 49, size: 12, duration: 20, delay: -2, drift: -50, spin: -240, opacity: 0.4 },
  { id: 11, left: 54, size: 21, duration: 30, delay: -14, drift: 118, spin: 460, opacity: 0.58 },
  { id: 12, left: 59, size: 15, duration: 23, delay: -29, drift: -80, spin: -360, opacity: 0.48 },
  { id: 13, left: 64, size: 18, duration: 26, delay: -6, drift: 86, spin: 340, opacity: 0.55 },
  { id: 14, left: 69, size: 12, duration: 19, delay: -20, drift: -58, spin: -280, opacity: 0.4 },
  { id: 15, left: 74, size: 20, duration: 28, delay: -13, drift: 104, spin: 400, opacity: 0.6 },
  { id: 16, left: 79, size: 14, duration: 22, delay: -25, drift: -76, spin: -330, opacity: 0.45 },
  { id: 17, left: 84, size: 17, duration: 25, delay: -8, drift: 70, spin: 310, opacity: 0.53 },
  { id: 18, left: 89, size: 11, duration: 18, delay: -17, drift: -46, spin: -230, opacity: 0.36 },
  { id: 19, left: 94, size: 19, duration: 27, delay: -1, drift: 92, spin: 390, opacity: 0.57 },
  { id: 20, left: 97, size: 13, duration: 21, delay: -23, drift: -66, spin: -310, opacity: 0.42 }
];

const drawRoadmapPath = (from: { x: number; y: number }, to: { x: number; y: number }, curveOffset = 0) => {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const horizontalBias = Math.abs(to.x - from.x) >= Math.abs(to.y - from.y);

  if (curveOffset !== 0) {
    return `M ${from.x} ${from.y} C ${midX + curveOffset} ${from.y}, ${midX + curveOffset} ${to.y}, ${to.x} ${to.y}`;
  }

  if (horizontalBias) {
    return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
  }

  return `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
};

const RoadmapConnections: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const trackStyle = isDark ? roadmapTrackStyles.dark : roadmapTrackStyles.light;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[2] h-[1120px] w-[1320px] overflow-visible"
      viewBox="0 0 1320 1120"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="roadmap-soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#b65f58" floodOpacity="0.16" />
        </filter>
      </defs>

      {roadmapLinks.map((link) => {
        const fromNode = lessonNodes.find((node) => node.id === link.fromId);
        const toNode = lessonNodes.find((node) => node.id === link.toId);

        if (!fromNode || !toNode) {
          return null;
        }

        const path = drawRoadmapPath(fromNode, toNode, link.curveOffset);

        return (
          <g key={link.id}>
            <path
              d={path}
              stroke={trackStyle.shadow}
              strokeWidth={trackStyle.shadowWidth}
              opacity={trackStyle.shadowOpacity}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#roadmap-soft-shadow)"
            />
            <path
              d={path}
              stroke={trackStyle.rim}
              strokeWidth={trackStyle.rimWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={path}
              stroke={trackStyle.outer}
              strokeWidth={trackStyle.outerWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={path}
              stroke={trackStyle.inner}
              strokeWidth={trackStyle.innerWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={path}
              stroke={trackStyle.highlight}
              strokeWidth={trackStyle.highlightWidth}
              opacity={trackStyle.highlightOpacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      })}
    </svg>
  );
};

const FallingFlowerSvg: React.FC<{ size: number; isDark: boolean }> = ({ size, isDark }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="block">
    <g fill={isDark ? '#ff9eb8' : '#f56f93'}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="12"
          cy="6.4"
          rx="3.2"
          ry="5.2"
          transform={`rotate(${angle} 12 12)`}
          opacity="0.9"
        />
      ))}
    </g>
    <circle cx="12" cy="12" r="1.7" fill={isDark ? '#ffe9f0' : '#fff6d6'} opacity="0.92" />
  </svg>
);

const LearnFallingFlowers: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden" aria-hidden="true">
    {fallingFlowers.map((flower) => (
      <span
        key={flower.id}
        className="kt-learn-flower"
        style={
          {
            left: `${flower.left}%`,
            animationDuration: `${flower.duration}s`,
            animationDelay: `${flower.delay}s`,
            opacity: flower.opacity,
            ['--kt-learn-flower-opacity' as string]: flower.opacity,
            ['--kt-learn-flower-drift' as string]: `${flower.drift}px`,
            ['--kt-learn-flower-mid-spin' as string]: `${flower.spin * 0.48}deg`,
            ['--kt-learn-flower-spin' as string]: `${flower.spin}deg`
          } as React.CSSProperties
        }
      >
        <FallingFlowerSvg size={flower.size} isDark={isDark} />
      </span>
    ))}
    <style>{`
      @keyframes kt-learn-flower-fall {
        0% {
          transform: translate3d(0, -9rem, 0) rotate(0deg);
          opacity: 0;
        }
        8% {
          opacity: var(--kt-learn-flower-opacity, 0.58);
        }
        42% {
          transform: translate3d(var(--kt-learn-flower-drift), 44vh, 0) rotate(var(--kt-learn-flower-mid-spin));
        }
        78% {
          opacity: var(--kt-learn-flower-opacity, 0.58);
        }
        100% {
          transform: translate3d(calc(var(--kt-learn-flower-drift) * -0.35), 1180px, 0) rotate(var(--kt-learn-flower-spin));
          opacity: 0;
        }
      }

      .kt-learn-flower {
        position: absolute;
        top: 0;
        display: block;
        filter: drop-shadow(0 4px 7px ${isDark ? 'rgba(0,0,0,0.28)' : 'rgba(190,70,95,0.14)'});
        transform: translate3d(0, -9rem, 0);
        animation: kt-learn-flower-fall linear infinite;
        will-change: transform, opacity;
      }

      @media (prefers-reduced-motion: reduce) {
        .kt-learn-flower {
          animation: none;
          opacity: 0;
        }
      }
    `}</style>
  </div>
);

const LearnSideRail: React.FC<{
  copy: typeof pageCopy.tr.side | typeof pageCopy.en.side;
  isDark: boolean;
}> = ({ copy, isDark }) => (
  <aside className={`absolute bottom-0 left-0 top-0 z-20 hidden w-[112px] flex-col items-center border-r pt-16 backdrop-blur lg:flex ${
    isDark
      ? 'border-[#2c3144] bg-[rgba(19,22,34,0.82)] shadow-[8px_0_30px_rgba(0,0,0,0.2)]'
      : 'border-[#f2e7df] bg-[rgba(255,255,255,0.76)] shadow-[8px_0_30px_rgba(150,96,72,0.05)]'
  }`}>
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
                ? isDark
                  ? 'bg-[rgba(255,255,255,0.13)] text-[#ff7c99] shadow-[0_12px_28px_rgba(0,0,0,0.22)]'
                  : 'bg-[#fffdfb] text-[#f04d72] shadow-[0_12px_28px_rgba(220,90,110,0.18)]'
                : isDark
                  ? 'text-[#c6d0e4] hover:bg-[rgba(255,255,255,0.08)] hover:text-white'
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
    <div className={`mb-8 flex flex-col items-center gap-2 text-xs font-semibold ${isDark ? 'text-[#d6deef]' : 'text-[#4f5965]'}`}>
      <div className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 shadow-[0_8px_18px_rgba(220,90,110,0.16)] ${
        isDark ? 'border-[#ffb7c7] bg-[rgba(255,255,255,0.12)]' : 'border-[#ffd6de] bg-[#fff1f4]'
      }`}>
        <MascotFigure pose="cheer" tone="brand" size={48} />
      </div>
      <span>{copy.profile}</span>
    </div>
  </aside>
);

const UnitMarkerLabel: React.FC<{ marker: UnitMarker; isDark: boolean }> = ({ marker, isDark }) => (
  <div className="absolute z-[5]" style={{ left: marker.x, top: marker.y }}>
    <div className={`inline-flex rounded-[0.45rem] px-3 py-1.5 text-sm font-black text-white shadow-[0_8px_16px_rgba(160,70,90,0.18)] ${badgeStyles[marker.tone]}`}>
      {marker.badge}
    </div>
    <h2 className={`mt-2 text-xl font-extrabold tracking-[-0.01em] ${isDark ? 'text-[#f8fbff] drop-shadow-[0_2px_5px_rgba(0,0,0,0.75)]' : 'text-[#1f2b3b]'}`}>{marker.title}</h2>
    <p className={`mt-1 text-sm font-medium ${isDark ? 'text-[#d5dceb] drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)]' : 'text-[#465161]'}`}>{marker.subtitle}</p>
  </div>
);

const LessonNodeButton: React.FC<{ node: LessonNode; isDark: boolean }> = ({ node, isDark }) => {
  const Icon = node.icon;
  const size = node.checkpoint ? 92 : 82;
  const iconSize = node.checkpoint ? 42 : 34;

  return (
    <div
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center z-[10]"
      style={{ left: node.x, top: node.y }}
    >
      <div
        className={`relative flex items-center justify-center rounded-full border-[7px] text-white ${toneStyles[node.tone]} ${
          isDark ? 'drop-shadow-[0_12px_20px_rgba(0,0,0,0.42)]' : ''
        }`}
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
        <div className={`text-[14px] font-bold leading-tight ${
          isDark
            ? node.tone === 'orange'
              ? 'text-[#ffad58] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]'
              : 'text-[#f8fbff] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]'
            : node.tone === 'orange'
              ? 'text-[#e36b1d]'
              : 'text-[#1e2a3a]'
        }`}>
          {node.title}
        </div>
        {node.subtitle && (
          <div className={`mt-0.5 text-[12px] leading-tight ${
            isDark ? 'text-[#d7deec] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]' : 'text-[#4f5967]'
          }`}>{node.subtitle}</div>
        )}
      </div>
    </div>
  );
};

export const LearnJapanesePage: React.FC<LearnJapanesePageProps> = ({ language, themeMode }) => {
  const copy = pageCopy[language];
  const isDark = themeMode === 'dark';
  const sections = useMemo(() => getLearnCourseSections(language), [language]);
  const units = useMemo(() => flattenLearnCourseUnits(sections), [sections]);
  const orderedUnitIds = useMemo(() => units.map((unit) => unit.id), [units]);
  const { completedCount } = useLearnCourseProgress(orderedUnitIds);

  return (
    <div
      className={`relative min-h-[1120px] overflow-hidden rounded-b-[0.6rem] bg-cover bg-top bg-no-repeat text-[#1f2937] ${
        isDark ? 'bg-[#151017]' : 'bg-[#fff5ef]'
      }`}
      style={{ backgroundImage: `url('${isDark ? '/images/dark.png' : '/images/learn-background.png'}')` }}
    >
      <div className="sr-only">
        <h1>{copy.title}</h1>
        <p>
          {completedCount} / {units.length} {copy.progress}
        </p>
      </div>
      <LearnFallingFlowers isDark={isDark} />
      <LearnSideRail copy={copy.side} isDark={isDark} />

      <section className="relative z-10 min-h-[1120px] overflow-x-auto overflow-y-hidden pl-0 lg:pl-[112px]">
        <div className="relative h-[1120px] w-[1320px]">
          <div className="absolute left-[62px] top-[34px] lg:left-[170px]">
            <h1 className="text-[28px] font-extrabold tracking-[-0.02em] text-[#1f2b3b]">{copy.title}</h1>
            <p className="mt-2 text-[17px] font-medium text-[#405064]">{copy.subtitle}</p>
          </div>

          <RoadmapConnections isDark={isDark} />

          {unitMarkers.map((marker) => (
            <UnitMarkerLabel key={marker.id} marker={marker} isDark={isDark} />
          ))}

          {lessonNodes.map((node) => (
            <LessonNodeButton key={node.id} node={node} isDark={isDark} />
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
