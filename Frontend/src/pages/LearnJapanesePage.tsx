import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Headphones,
  Landmark,
  LockKeyhole,
  LucideIcon,
  MessageCircleMore,
  Mic,
  Gamepad2,
  GraduationCap,
  Sprout,
  Star,
  Trophy,
  Utensils
} from 'lucide-react';
import { AppLanguage, ThemeMode } from '../data/appPreferences';
import { appShellRoutes, getLearnGuideRoute, getLearnUnitRoute, getPracticeRoute } from '../data/appShellContent';
import {
  flattenLearnCourseUnits,
  getLearnCourseSections
} from '../data/learnCourseContent';
import { useLearnCourseProgress } from '../hooks/useLearnCourseProgress';
import { LearnSideRail } from '../components/learn/LearnSideRail';

interface LearnJapanesePageProps {
  language: AppLanguage;
  themeMode: ThemeMode;
}

type NodeTone = 'pink' | 'orange' | 'purple' | 'blue' | 'gray';
type LessonNodeState = 'locked' | 'active' | 'available' | 'completed';

const DESKTOP_NAV_HEIGHT = 93;
const DESKTOP_SIDE_RAIL_WIDTH = 112;
const DESKTOP_MAP_WIDTH = 1800;
const DESKTOP_MAP_HEIGHT = 1120;
const DESKTOP_MAP_MIN_SCALE = 0.45;
const DESKTOP_MAP_X_OFFSET = -170;

const NODES_PER_CHAPTER = 8;
const UNIT_GROUPS_PER_CHAPTER = 4;
const NODES_PER_GROUP = NODES_PER_CHAPTER / UNIT_GROUPS_PER_CHAPTER;

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

interface LessonNodeRuntime {
  node: LessonNode;
  unitId: string | null;
  state: LessonNodeState;
  progress: number;
}

interface MobileUnitSection {
  marker: UnitMarker;
  nodes: LessonNodeRuntime[];
  guideHref?: string;
}

const pageCopy = {
  tr: {
    title: 'Japonca Yolculugu',
    subtitle: "Dan'a giden yolculugun burada baslar.",
    unitGuide: 'Unite rehberi',
    progress: 'Ilerleme',
    bolum: 'Bölüm',
    prevChapter: 'Önceki bölüm',
    nextChapter: 'Sonraki bölüm'
  },
  en: {
    title: 'Japanese Journey',
    subtitle: "Your journey toward Dan starts here.",
    unitGuide: 'Unit guide',
    progress: 'Progress',
    bolum: 'Chapter',
    prevChapter: 'Previous chapter',
    nextChapter: 'Next chapter'
  }
} as const;

// x, y: absolute coords within the 1320×1120 inner div
const unitMarkers: UnitMarker[] = [
  { id: 'u1', x: 340,   y: 170, badge: 'ÜNİTE 1', title: 'Temel İletişim',        subtitle: 'Selamlaşma ve basit ifadeler',   tone: 'pink'   },
  { id: 'u2', x: 1700, y: 440, badge: 'ÜNİTE 2', title: 'İsimleri Öğreniyorum',  subtitle: 'Temel isimler ve tanışma',       tone: 'blue'   },
  { id: 'u3', x: 650,  y: 405, badge: 'ÜNİTE 3', title: 'Günlük Hayat',          subtitle: 'Günlük kelimeler ve konuşmalar', tone: 'purple' },
  { id: 'u4', x: 650,   y: 740, badge: 'ÜNİTE 4', title: 'Fiiller ve Eylemler',   subtitle: 'Temel fiiller ve cümleler',      tone: 'gray'   }
];

const mobileUnitRanges = [
  { markerId: 'u1', start: 0, end: 5 },
  { markerId: 'u2', start: 5, end: 10 },
  { markerId: 'u3', start: 10, end: 15 },
  { markerId: 'u4', start: 15, end: 20 }
];

// x, y: node center, absolute within the 1320×1120 inner div
const lessonNodes: LessonNode[] = [
  // Ünite 1 — soldan sağa (y≈255)
  { id: 'n1',  number: 1,  x: 610,  y: 250, title: 'Hiragana 1',      subtitle: 'A - O',          tone: 'pink',   icon: Sprout           },
  { id: 'n2',  number: 2,  x: 810,  y: 250, title: 'Hiragana 2',      subtitle: 'Ka - Ko',        tone: 'pink',   icon: Sprout           },
  { id: 'n3',  number: 3,  x: 1010,  y: 250, title: 'Selamlaşma',      subtitle: 'Konnichiwa!',    tone: 'pink',   icon: MessageCircleMore},
  { id: 'n4',  number: 4,  x: 1210,  y: 250, title: 'Dinleme 1',       subtitle: 'Sesler',         tone: 'pink',   icon: Headphones       },
  { id: 'n5',  number: 5,  x: 1470,  y: 350, title: 'Kontrol Noktası', subtitle: 'Ünite 1 Sonu',   tone: 'orange', icon: Star,  checkpoint: true },

  // Ünite 2 — sağdan sola (y≈495)
  { id: 'n6',  number: 6,  x: 1210, y: 475, title: 'İsimler 1',       subtitle: 'Kişiler',        tone: 'blue',   icon: LockKeyhole      },
  { id: 'n7',  number: 7,  x: 1420,  y: 575, title: 'İsimler 2',       subtitle: 'Eşyalar',        tone: 'blue',   icon: LockKeyhole      },
  { id: 'n8',  number: 8,  x: 1610,  y: 575, title: 'İsimler 3',       subtitle: 'Hajimemashite',  tone: 'blue',   icon: LockKeyhole      },
  { id: 'n9',  number: 9,  x: 1610,  y: 820, title: 'İsimler 4', subtitle: 'Ü',   tone: 'blue', icon: LockKeyhole  },
  { id: 'n10',  number: 10,  x: 1300,  y: 750, title: 'Kontrol Noktası', subtitle: 'Ünite 2 Sonu',   tone: 'orange', icon: Star,  checkpoint: true },

  // Ünite 3 — sağdan sola (y≈605)
  { id: 'n11', number: 11, x: 1010,  y: 685, title: 'Konuşma 1',       subtitle: 'Temel cümleler', tone: 'purple', icon: Mic              },
  { id: 'n12', number: 12, x: 860,  y: 625, title: 'Yiyecekler',      subtitle: 'Tabemono',       tone: 'purple', icon: Utensils         },
  { id: 'n13', number: 13, x: 720,  y: 625, title: 'Yiyecekler',      subtitle: 'Tabemono',       tone: 'purple', icon: Utensils         },
  { id: 'n14', number: 14, x: 570,  y: 625, title: 'Yiyecekler',      subtitle: 'Tabemono',       tone: 'purple', icon: Utensils         },
  { id: 'n15', number: 15, x: 340,  y: 750, title: 'Kontrol Noktası', subtitle: 'Ünite 3 Sonu',   tone: 'orange', icon: Star,  checkpoint: true },

  // Ünite 4 — soldan sağa (y≈945)
  { id: 'n16', number: 16, x: 420,  y: 945, title: 'Fiiller 1',       subtitle: 'Taberu',         tone: 'gray',   icon: LockKeyhole      },
  { id: 'n17', number: 17, x: 620,  y: 945, title: 'Fiiller 1',       subtitle: 'Taberu',         tone: 'gray',   icon: LockKeyhole      },
  { id: 'n18', number: 18, x: 820,  y: 945, title: 'Fiiller 2',       subtitle: '~ku',            tone: 'gray',   icon: LockKeyhole      },
  { id: 'n19', number: 19, x: 1020,  y: 945, title: 'Cümleler 1',      subtitle: '~ desu',         tone: 'gray',   icon: LockKeyhole      },
  { id: 'n20', number: 20, x: 1220,  y: 945, title: 'Büyük Kontrol',   subtitle: 'Ünite 4 Sonu',   tone: 'orange', icon: Star,  checkpoint: true },
];

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

const progressRingStyles: Record<NodeTone, string> = {
  pink: '#f05b7c',
  orange: '#ffa028',
  purple: '#8957da',
  blue: '#3a8edc',
  gray: '#8d8d8d'
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
  { id: 'n4-n5', fromId: 'n4', toId: 'n5', tone: 'orange', curveOffset: 190 },
  { id: 'n5-n6', fromId: 'n5', toId: 'n6', tone: 'blue', curveOffset: -170 },
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

const getDesktopMapScale = () => {
  if (typeof window === 'undefined') {
    return 1;
  }

  const availableWidth = Math.max(1, window.innerWidth - DESKTOP_SIDE_RAIL_WIDTH);
  const availableHeight = Math.max(1, window.innerHeight - DESKTOP_NAV_HEIGHT);
  const nextScale = Math.min(1, availableWidth / DESKTOP_MAP_WIDTH, availableHeight / DESKTOP_MAP_HEIGHT);

  return Math.max(DESKTOP_MAP_MIN_SCALE, nextScale);
};

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

const RoadmapConnections: React.FC<{ isDark: boolean; xOffset?: number }> = ({ isDark, xOffset = 0 }) => {
  const trackStyle = isDark ? roadmapTrackStyles.dark : roadmapTrackStyles.light;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[2] overflow-visible"
      width={DESKTOP_MAP_WIDTH}
      height={DESKTOP_MAP_HEIGHT}
      viewBox={`0 0 ${DESKTOP_MAP_WIDTH} ${DESKTOP_MAP_HEIGHT}`}
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

        const path = drawRoadmapPath(
          { x: fromNode.x + xOffset, y: fromNode.y },
          { x: toNode.x + xOffset, y: toNode.y },
          link.curveOffset
        );

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

const UnitMarkerLabel: React.FC<{
  marker: UnitMarker;
  isDark: boolean;
  guideHref?: string;
  guideLabel: string;
  xOffset?: number;
}> = ({ marker, isDark, guideHref, guideLabel, xOffset = 0 }) => (
  <div className="absolute z-[5]" style={{ left: marker.x + xOffset, top: marker.y }}>
    <div className={`inline-flex rounded-[0.45rem] px-3 py-1.5 text-sm font-black text-white shadow-[0_8px_16px_rgba(160,70,90,0.18)] ${badgeStyles[marker.tone]}`}>
      {marker.badge}
    </div>
    <div className="mt-2 flex items-center gap-2">
      <h2 className={`whitespace-nowrap text-xl font-extrabold tracking-[-0.01em] ${isDark ? 'text-[#f8fbff] drop-shadow-[0_2px_5px_rgba(0,0,0,0.75)]' : 'text-[#1f2b3b]'}`}>{marker.title}</h2>
      {guideHref && (
        <Link
          to={guideHref}
          className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
            isDark
              ? 'border-white/15 bg-white/10 text-[#f8fbff] hover:bg-white/18'
              : 'border-[#ffd6de] bg-white/85 text-[#f04d72] hover:bg-[#fff1f4]'
          }`}
          aria-label={`${guideLabel}: ${marker.title}`}
          title={`${guideLabel}: ${marker.title}`}
        >
          <BookOpen size={18} strokeWidth={2.5} />
        </Link>
      )}
    </div>
    <p className={`mt-1 text-sm font-medium ${isDark ? 'text-[#d5dceb] drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)]' : 'text-[#465161]'}`}>{marker.subtitle}</p>
  </div>
);

const LessonNodeButton: React.FC<{
  node: LessonNode;
  isDark: boolean;
  state: LessonNodeState;
  progress: number;
  onSelect?: () => void;
  xOffset?: number;
}> = ({ node, isDark, state, progress, onSelect, xOffset = 0 }) => {
  const Icon = node.icon;
  const size = node.checkpoint ? 92 : 82;
  const iconSize = node.checkpoint ? 42 : 34;
  const ringSize = size + 24;
  const ringStroke = 8;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const progressOffset = ringCircumference - (Math.max(0, Math.min(100, progress)) / 100) * ringCircumference;
  const isLocked = state === 'locked';
  const isActive = state === 'active';
  const isCompleted = state === 'completed';

  return (
    <div
      className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center z-[10] ${
        isActive ? 'kt-learn-node-active' : ''
      }`}
      style={{ left: node.x + xOffset, top: node.y }}
    >
      <button
        type="button"
        disabled={isLocked || !onSelect}
        onClick={onSelect}
        aria-label={`${node.title}${node.subtitle ? `, ${node.subtitle}` : ''}`}
        aria-disabled={isLocked}
        className={`relative flex appearance-none items-center justify-center rounded-full border-[7px] p-0 text-white transition ${
          isLocked ? 'cursor-not-allowed saturate-[0.55]' : 'cursor-pointer'
        } ${toneStyles[node.tone]} ${
          isDark ? 'drop-shadow-[0_12px_20px_rgba(0,0,0,0.42)]' : ''
        }`}
        style={{ width: size, height: size }}
      >
        {isActive && (
          <span
            className="pointer-events-none absolute rounded-full border-2 border-white/70"
            style={{
              inset: -16,
              boxShadow: `0 0 0 8px ${progressRingStyles[node.tone]}22, 0 0 26px ${progressRingStyles[node.tone]}66`
            }}
          />
        )}
        <svg
          className="pointer-events-none absolute -rotate-90 overflow-visible"
          width={ringSize}
          height={ringSize}
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          aria-hidden="true"
          style={{ left: -12, top: -12 }}
        >
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={ringRadius}
            fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.18)' : 'rgba(71,84,103,0.16)'}
            strokeWidth={ringStroke}
          />
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={ringRadius}
            fill="none"
            stroke={progressRingStyles[node.tone]}
            strokeLinecap="round"
            strokeWidth={ringStroke}
            strokeDasharray={ringCircumference}
            strokeDashoffset={progressOffset}
            opacity={isLocked && progress === 0 ? 0 : 1}
            className="transition-[stroke-dashoffset,opacity] duration-700 ease-out"
          />
        </svg>
        <span className="absolute inset-[5px] rounded-full border border-white/55 bg-white/10" />
        <Icon
          size={iconSize}
          strokeWidth={2.6}
          fill={node.icon === Star ? 'currentColor' : 'none'}
          className={`relative ${isLocked ? 'opacity-50' : ''}`}
        />
        {isLocked && (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-[#1f2937]/18">
            <LockKeyhole size={node.checkpoint ? 34 : 28} strokeWidth={2.8} className="text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.25)]" />
          </span>
        )}
        {isCompleted && <span className="absolute inset-[8px] rounded-full bg-white/10" />}
        <span
          className={`absolute -right-2 -top-3 flex h-8 min-w-8 items-center justify-center rounded-full border-[3px] border-white px-1 text-sm font-black text-white shadow-[0_5px_10px_rgba(80,45,55,0.18)] ${badgeNumberStyles[node.tone]}`}
        >
          {node.number}
        </span>
      </button>
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

const MobileLessonNode: React.FC<{
  item: LessonNodeRuntime;
  isDark: boolean;
  onSelect?: () => void;
}> = ({ item, isDark, onSelect }) => {
  const Icon = item.node.icon;
  const isLocked = item.state === 'locked';
  const isActive = item.state === 'active';
  const isCompleted = item.state === 'completed';
  const size = item.node.checkpoint ? 74 : 68;
  const iconSize = item.node.checkpoint ? 34 : 28;
  const ringSize = size + 18;
  const ringStroke = 7;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const progressOffset = ringCircumference - (Math.max(0, Math.min(100, item.progress)) / 100) * ringCircumference;

  return (
    <div className="relative flex min-w-[7.4rem] flex-col items-center text-center">
      <button
        type="button"
        disabled={isLocked || !onSelect}
        onClick={onSelect}
        className={`relative flex appearance-none items-center justify-center rounded-full border-[6px] p-0 text-white transition ${
          isLocked ? 'cursor-not-allowed saturate-[0.45]' : 'cursor-pointer'
        } ${toneStyles[item.node.tone]} ${
          isActive ? 'animate-[kt-learn-node-active-pulse_1.8s_ease-in-out_infinite]' : ''
        }`}
        style={{ width: size, height: size }}
        aria-label={`${item.node.title}${item.node.subtitle ? `, ${item.node.subtitle}` : ''}`}
      >
        <svg
          className="pointer-events-none absolute -rotate-90 overflow-visible"
          width={ringSize}
          height={ringSize}
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          aria-hidden="true"
          style={{ left: -9, top: -9 }}
        >
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={ringRadius}
            fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.18)' : 'rgba(71,84,103,0.15)'}
            strokeWidth={ringStroke}
          />
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={ringRadius}
            fill="none"
            stroke={progressRingStyles[item.node.tone]}
            strokeLinecap="round"
            strokeWidth={ringStroke}
            strokeDasharray={ringCircumference}
            strokeDashoffset={progressOffset}
            opacity={isLocked && item.progress === 0 ? 0 : 1}
          />
        </svg>
        <span className="absolute inset-[5px] rounded-full border border-white/55 bg-white/10" />
        <Icon
          size={iconSize}
          strokeWidth={2.6}
          fill={item.node.icon === Star ? 'currentColor' : 'none'}
          className={`relative ${isLocked ? 'opacity-50' : ''}`}
        />
        {isLocked && (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-[#1f2937]/18">
            <LockKeyhole size={24} strokeWidth={2.8} />
          </span>
        )}
        {isCompleted && <span className="absolute inset-[8px] rounded-full bg-white/10" />}
        <span className={`absolute -right-1 -top-2 flex h-7 min-w-7 items-center justify-center rounded-full border-[3px] border-white px-1 text-xs font-black text-white shadow-[0_5px_10px_rgba(80,45,55,0.18)] ${badgeNumberStyles[item.node.tone]}`}>
          {item.node.number}
        </span>
      </button>
      <div className={`mt-3 text-[13px] font-black leading-tight ${isDark ? 'text-[#f8fbff]' : 'text-[#1f2b3b]'}`}>
        {item.node.title}
      </div>
      {item.node.subtitle && (
        <div className={`mt-0.5 text-[12px] font-medium leading-tight ${isDark ? 'text-[#d7deec]' : 'text-[#4f5967]'}`}>
          {item.node.subtitle}
        </div>
      )}
    </div>
  );
};

const MobileBottomNav: React.FC<{ language: AppLanguage }> = ({ language }) => {
  const labels = language === 'tr'
    ? { learn: 'Öğren', letters: 'Harfler', practice: 'Pratik', meydan: 'Meydan', quests: 'Görevler' }
    : { learn: 'Learn', letters: 'Letters', practice: 'Practice', meydan: 'Meydan', quests: 'Quests' };
  const items = [
    { id: 'learn', label: labels.learn, href: appShellRoutes.learn, icon: Landmark },
    { id: 'letters', label: labels.letters, href: appShellRoutes.letters, icon: BookOpen },
    { id: 'practice', label: labels.practice, href: getPracticeRoute('hiragana', 'review'), icon: Gamepad2 },
    { id: 'meydan', label: labels.meydan, href: appShellRoutes.meydan, icon: GraduationCap },
    { id: 'quests', label: labels.quests, href: appShellRoutes.quests, icon: Trophy }
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#f4d8cf] bg-[rgba(255,253,250,0.92)] px-3 py-2 shadow-[0_-12px_24px_rgba(160,90,80,0.12)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-[34rem] grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.id === 'learn';

          return (
            <Link
              key={item.id}
              to={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 text-[11px] font-bold ${active ? 'text-[#f04d72]' : 'text-[#606a78]'}`}
            >
              <Icon size={23} strokeWidth={active ? 2.6 : 2.1} />
              <span>{item.label}</span>
              {active && <span className="h-1 w-1 rounded-full bg-[#f04d72]" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

const MobileLearnRoadmap: React.FC<{
  language: AppLanguage;
  themeMode: ThemeMode;
  copy: typeof pageCopy.tr | typeof pageCopy.en;
  sections: MobileUnitSection[];
  onOpenUnit: (unitId: string) => void;
}> = ({ language, themeMode, copy, sections, onOpenUnit }) => {
  const isDark = themeMode === 'dark';

  return (
    <section className={`relative z-10 min-h-screen overflow-hidden pb-24 lg:hidden ${isDark ? 'text-[#f8fbff]' : 'text-[#1f2b3b]'}`}>
      <div className={`relative overflow-hidden border-b px-6 pb-16 pt-6 ${
        isDark ? 'border-white/10 bg-[rgba(26,18,31,0.34)]' : 'border-[#f2ddd4] bg-[rgba(255,248,239,0.74)]'
      }`}>
        <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true">
          <div className="absolute left-[-4rem] top-20 h-28 w-36 rounded-[50%] bg-[#f7d9c7]/50 blur-xl" />
          <div className="absolute right-[-3rem] top-10 h-32 w-44 rounded-[50%] bg-[#f6b6c7]/45 blur-xl" />
          <div className="absolute bottom-0 right-8 text-[88px] opacity-20">⛩</div>
        </div>
        <div className="relative">
          <h1 className="text-2xl font-black tracking-[-0.02em]">{copy.title}</h1>
          <p className={`mt-2 text-sm font-semibold leading-6 ${isDark ? 'text-[#d5dceb]' : 'text-[#405064]'}`}>
            {copy.subtitle}
          </p>
        </div>
      </div>

      <div className="relative">
        {sections.map((section, sectionIndex) => (
          <section
            key={section.marker.id}
            className={`relative border-b px-5 py-7 ${
              isDark
                ? 'border-white/10 bg-[rgba(25,18,31,0.28)]'
                : sectionIndex % 2 === 0
                  ? 'border-[#f1ddd4] bg-[rgba(255,248,239,0.64)]'
                  : 'border-[#eadced] bg-[rgba(248,240,255,0.54)]'
            }`}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              <div className="absolute right-[-4rem] top-2 h-32 w-36 rounded-full bg-white/30 blur-2xl" />
              <div className="absolute left-[-2rem] bottom-4 h-24 w-24 rounded-full bg-[#f3b6c4]/20 blur-xl" />
            </div>
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <div className={`inline-flex rounded-[0.45rem] px-2.5 py-1 text-xs font-black text-white shadow-[0_8px_16px_rgba(160,70,90,0.18)] ${badgeStyles[section.marker.tone]}`}>
                  {section.marker.badge}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <h2 className="whitespace-nowrap text-xl font-black tracking-[-0.01em]">{section.marker.title}</h2>
                  {section.guideHref && (
                    <Link
                      to={section.guideHref}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                        isDark ? 'border-white/15 bg-white/10' : 'border-[#ffd6de] bg-white/85 text-[#f04d72]'
                      }`}
                      aria-label={`${copy.unitGuide}: ${section.marker.title}`}
                    >
                      <BookOpen size={18} strokeWidth={2.5} />
                    </Link>
                  )}
                </div>
                <p className={`mt-1 text-sm font-semibold ${isDark ? 'text-[#d7deec]' : 'text-[#4f5967]'}`}>{section.marker.subtitle}</p>
              </div>
            </div>

            <div className="relative mt-8 overflow-x-auto pb-3">
              <div className="relative flex min-w-max items-start gap-6 px-2">
                <div className={`absolute left-10 right-10 top-[34px] h-4 rounded-full border shadow-[inset_0_2px_0_rgba(255,255,255,0.7)] ${
                  isDark ? 'border-white/10 bg-[#fff4ef]/75' : 'border-[#ead6cc] bg-[#fff8f3]'
                }`} />
                {section.nodes.map((item) => (
                  <MobileLessonNode
                    key={item.node.id}
                    item={item}
                    isDark={isDark}
                    onSelect={item.unitId && item.state !== 'locked' ? () => onOpenUnit(item.unitId as string) : undefined}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
      <MobileBottomNav language={language} />
    </section>
  );
};

// く shape navigation arrow icon
const KuShapeIcon: React.FC<{ mirrored?: boolean }> = ({ mirrored }) => (
  <svg width="22" height="38" viewBox="0 0 20 34" fill="none" aria-hidden="true">
    <path
      d={
        mirrored
          ? 'M 5 3 Q 17 10 17 17 Q 17 24 5 31'
          : 'M 15 3 Q 3 10 3 17 Q 3 24 15 31'
      }
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// Chapter navigation button shown on the left/right edge of the screen
const ChapterNavButton: React.FC<{
  direction: 'prev' | 'next';
  chapterLabel: string;
  targetChapter: number;
  isDark: boolean;
  disabled?: boolean;
  onClick: () => void;
}> = ({ direction, chapterLabel, targetChapter, isDark, disabled, onClick }) => {
  const isPrev = direction === 'prev';

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={`${chapterLabel} ${targetChapter + 1}`}
      className={`fixed top-1/2 z-20 -translate-y-1/2 flex flex-col items-center justify-center gap-2 py-6 group transition-all ${
        isPrev
          ? 'left-0 lg:left-[112px] pl-2 pr-3'
          : 'right-0 pr-2 pl-3'
      } ${disabled ? 'pointer-events-none' : 'cursor-pointer'}`}
    >
      <div
        className={`flex items-center justify-center rounded-xl px-2 py-4 transition-all duration-200 ${
          disabled
            ? isDark
              ? 'bg-white/[0.03] border border-white/[0.05] text-white/18'
              : 'bg-[#1f2b3b]/[0.025] border border-[#1f2b3b]/[0.045] text-[#1f2b3b]/18'
            : isDark
              ? 'bg-white/[0.07] border border-white/[0.11] text-white/55 group-hover:bg-white/[0.14] group-hover:text-white/85 group-hover:border-white/20 group-hover:scale-105'
              : 'bg-[#1f2b3b]/[0.06] border border-[#1f2b3b]/[0.09] text-[#1f2b3b]/45 group-hover:bg-[#1f2b3b]/[0.11] group-hover:text-[#1f2b3b]/75 group-hover:border-[#1f2b3b]/15 group-hover:scale-105'
        } shadow-[0_4px_16px_rgba(0,0,0,0.07)] backdrop-blur-sm`}
      >
        <KuShapeIcon mirrored={!isPrev} />
      </div>
      <span
        className={`text-[10px] font-bold tracking-wide transition-colors ${
          disabled
            ? isDark ? 'text-white/15' : 'text-[#1f2b3b]/15'
            : isDark ? 'text-white/30 group-hover:text-white/55' : 'text-[#1f2b3b]/28 group-hover:text-[#1f2b3b]/50'
        }`}
      >
        {targetChapter + 1}
      </span>
    </button>
  );
};

export const LearnJapanesePage: React.FC<LearnJapanesePageProps> = ({ language, themeMode }) => {
  const navigate = useNavigate();
  const [desktopMapScale, setDesktopMapScale] = useState(getDesktopMapScale);
  const copy = pageCopy[language];
  const isDark = themeMode === 'dark';
  const sections = useMemo(() => getLearnCourseSections(language), [language]);
  const units = useMemo(() => flattenLearnCourseUnits(sections), [sections]);
  const orderedUnitIds = useMemo(() => units.map((unit) => unit.id), [units]);
  const { completedCount, completedSet, getUnitProgress, getUnitState } = useLearnCourseProgress(orderedUnitIds);

  // Which chapter the user is currently progressing in
  const activeChapter = useMemo(() => {
    if (units.length === 0) return 0;
    const firstIncompleteIndex = orderedUnitIds.findIndex((id) => !completedSet.has(id));
    if (firstIncompleteIndex === -1) {
      return Math.max(0, Math.ceil(units.length / NODES_PER_CHAPTER) - 1);
    }
    return Math.floor(firstIncompleteIndex / NODES_PER_CHAPTER);
  }, [units.length, orderedUnitIds, completedSet]);

  // Which chapter the user is currently viewing (can differ from activeChapter via nav)
  const [viewChapter, setViewChapter] = useState(activeChapter);

  // When the user completes a chapter, auto-advance the view to the new active chapter
  useEffect(() => {
    setViewChapter((prev) => Math.max(prev, activeChapter));
  }, [activeChapter]);

  const totalChapters = Math.max(1, Math.ceil(units.length / NODES_PER_CHAPTER));
  const chapterStart = viewChapter * NODES_PER_CHAPTER;

  // Slice of course units visible in the current chapter view
  const chapterUnits = useMemo(
    () => units.slice(chapterStart, chapterStart + NODES_PER_CHAPTER),
    [units, chapterStart]
  );

  // Unit group badge numbers shift by chapter (e.g. chapter 1 → ÜNİTE 5,6,7,8)
  const groupOffset = viewChapter * UNIT_GROUPS_PER_CHAPTER;
  const dynamicUnitMarkers = useMemo(
    () =>
      unitMarkers.map((marker, index) => ({
        ...marker,
        badge:
          language === 'tr'
            ? `ÜNİTE ${groupOffset + index + 1}`
            : `UNIT ${groupOffset + index + 1}`
      })),
    [groupOffset, language]
  );

  const nodeRuntime = useMemo<LessonNodeRuntime[]>(
    () =>
      lessonNodes.map((node, index) => {
        const unit = chapterUnits[index];

        if (!unit) {
          return {
            node,
            unitId: null,
            state: 'locked' as LessonNodeState,
            progress: 0
          };
        }

        return {
          node,
          unitId: unit.id,
          state: getUnitState(unit.id),
          progress: getUnitProgress(unit.id)
        };
      }),
    [chapterUnits, getUnitProgress, getUnitState]
  );

  const mobileSections = useMemo<MobileUnitSection[]>(
    () =>
      mobileUnitRanges.map((range, index) => {
        const marker =
          dynamicUnitMarkers.find((item) => item.id === range.markerId) ??
          dynamicUnitMarkers[index];
        const firstGroupUnit = chapterUnits[range.start];

        return {
          marker,
          nodes: nodeRuntime.slice(range.start, range.end),
          guideHref: firstGroupUnit ? getLearnGuideRoute(firstGroupUnit.id) : undefined
        };
      }),
    [nodeRuntime, chapterUnits, dynamicUnitMarkers]
  );

  useEffect(() => {
    const updateScale = () => setDesktopMapScale(getDesktopMapScale());

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const canGoPrev = viewChapter > 0;
  const canGoNext = viewChapter < activeChapter;

  return (
    <div
      className="kt-learn-page relative min-h-screen w-full overflow-hidden text-[#1f2937]"
    >
      <div className="sr-only">
        <h1>{copy.title}</h1>
        <p>
          {completedCount} / {units.length} {copy.progress}
        </p>
      </div>
      <style>{`
        @keyframes kt-learn-node-active-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 0 rgba(240, 91, 124, 0));
          }
          50% {
            filter: drop-shadow(0 0 18px rgba(240, 91, 124, 0.36));
          }
        }

        .kt-learn-node-active {
          animation: kt-learn-node-active-pulse 1.8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .kt-learn-node-active {
            animation: none;
          }
        }

        @media (min-width: 1024px) {
          .kt-learn-page {
            height: calc(100vh - ${DESKTOP_NAV_HEIGHT}px);
            min-height: 0;
          }
        }
      `}</style>
      <LearnFallingFlowers isDark={isDark} />
      <div className="hidden lg:block">
        <LearnSideRail language={language} themeMode={themeMode} activeItem="journey" position="fixed" />
      </div>

      {/* Chapter navigation arrows — always visible, disabled when no chapter to navigate to */}
      <ChapterNavButton
        direction="prev"
        chapterLabel={copy.bolum}
        targetChapter={viewChapter - 1}
        isDark={isDark}
        disabled={!canGoPrev}
        onClick={() => setViewChapter((v) => v - 1)}
      />
      <ChapterNavButton
        direction="next"
        chapterLabel={copy.bolum}
        targetChapter={viewChapter + 1}
        isDark={isDark}
        disabled={!canGoNext}
        onClick={() => setViewChapter((v) => v + 1)}
      />

      <MobileLearnRoadmap
        language={language}
        themeMode={themeMode}
        copy={copy}
        sections={mobileSections}
        onOpenUnit={(unitId) => navigate(getLearnUnitRoute(unitId))}
      />

      <section
        className="relative z-10 hidden overflow-hidden pl-0 lg:block lg:pl-[112px]"
        style={{ height: `calc(100vh - ${DESKTOP_NAV_HEIGHT}px)` }}
      >
        <div
          className="relative mx-auto"
          style={{
            width: DESKTOP_MAP_WIDTH * desktopMapScale,
            height: DESKTOP_MAP_HEIGHT * desktopMapScale
          }}
        >
          <div
            className="relative"
            style={{
              width: DESKTOP_MAP_WIDTH,
              height: DESKTOP_MAP_HEIGHT,
              transform: `scale(${desktopMapScale})`,
              transformOrigin: 'top left'
            }}
          >
          <div
            className="absolute top-[34px]"
            style={{ left: 170 + DESKTOP_MAP_X_OFFSET }}
          >
            <h1 className={`text-[28px] font-extrabold tracking-[-0.02em] ${
              isDark ? 'text-[#f8fbff] drop-shadow-[0_2px_5px_rgba(0,0,0,0.72)]' : 'text-[#1f2b3b]'
            }`}>{copy.title}</h1>
            <div className="mt-2 flex items-center gap-4">
              <p className={`text-[17px] font-medium ${
                isDark ? 'text-[#d5dceb] drop-shadow-[0_2px_4px_rgba(0,0,0,0.62)]' : 'text-[#405064]'
              }`}>{copy.subtitle}</p>
              {totalChapters > 1 && (
                <span className={`rounded-full px-3 py-0.5 text-[13px] font-bold ${
                  isDark
                    ? 'bg-white/10 text-white/60'
                    : 'bg-[#1f2b3b]/[0.07] text-[#1f2b3b]/55'
                }`}>
                  {copy.bolum} {viewChapter + 1} / {totalChapters}
                </span>
              )}
            </div>
          </div>

          <RoadmapConnections isDark={isDark} xOffset={DESKTOP_MAP_X_OFFSET} />

          {dynamicUnitMarkers.map((marker, index) => (
            <UnitMarkerLabel
              key={marker.id}
              marker={marker}
              isDark={isDark}
              guideHref={
                chapterUnits[index * NODES_PER_GROUP]
                  ? getLearnGuideRoute(chapterUnits[index * NODES_PER_GROUP].id)
                  : undefined
              }
              guideLabel={copy.unitGuide}
              xOffset={DESKTOP_MAP_X_OFFSET}
            />
          ))}

          {nodeRuntime.map(({ node, unitId, state, progress }) => (
            <LessonNodeButton
              key={node.id}
              node={node}
              isDark={isDark}
              state={state}
              progress={progress}
              onSelect={unitId && state !== 'locked' ? () => navigate(getLearnUnitRoute(unitId)) : undefined}
              xOffset={DESKTOP_MAP_X_OFFSET}
            />
          ))}

          </div>
        </div>
      </section>
    </div>
  );
};

export default LearnJapanesePage;
