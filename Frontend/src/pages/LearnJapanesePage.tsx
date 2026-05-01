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
import { appShellRoutes, getLearnGuideRoute, getLearnUnitRoute, getPracticeHomeRoute } from '../data/appShellContent';
import {
  flattenLearnCourseUnits,
  getLearnCourseSections
} from '../data/learnCourseContent';
import { useLearnCourseProgress } from '../hooks/useLearnCourseProgress';
import { useLearnLevelProgress } from '../hooks/useLearnLevelProgress';
import { getLevelInfo } from '../data/learnLevels';
import { LearnSideRail } from '../components/learn/LearnSideRail';
import { LearnFallingFlowers } from '../components/learn/LearnFallingFlowers';
import { getLearnExamRoute } from '../data/appShellContent';

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

const NODES_PER_CHAPTER = 20;
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
    nextChapter: 'Sonraki bölüm',
    examButton: 'Sınava Gir',
    examHint: 'Tüm üniteler tamamlandı! Sınava girerek sonraki seviyeye geç.'
  },
  en: {
    title: 'Japanese Journey',
    subtitle: "Your journey toward Dan starts here.",
    unitGuide: 'Unit guide',
    progress: 'Progress',
    bolum: 'Chapter',
    prevChapter: 'Previous chapter',
    nextChapter: 'Next chapter',
    examButton: 'Take Exam',
    examHint: 'All units complete! Take the exam to advance to the next level.'
  }
} as const;

// x, y: absolute coords within the 1320×1120 inner div
const unitMarkers: UnitMarker[] = [
  { id: 'u1', x: 340,  y: 170, badge: 'UNITE 1', title: 'Unit 1', subtitle: 'Lessons 1-4 + checkpoint', tone: 'pink' },
  { id: 'u2', x: 1700, y: 440, badge: 'UNITE 2', title: 'Unit 2', subtitle: 'Lessons 1-4 + checkpoint', tone: 'blue' },
  { id: 'u3', x: 650,  y: 405, badge: 'UNITE 3', title: 'Unit 3', subtitle: 'Lessons 1-4 + checkpoint', tone: 'purple' },
  { id: 'u4', x: 650,  y: 740, badge: 'UNITE 4', title: 'Unit 4', subtitle: 'Lessons 1-4 + checkpoint', tone: 'gray' }
];

const mobileUnitRanges = [
  { markerId: 'u1', start: 0, end: 5 },
  { markerId: 'u2', start: 5, end: 10 },
  { markerId: 'u3', start: 10, end: 15 },
  { markerId: 'u4', start: 15, end: 20 }
];

// x, y: node center, absolute within the 1320×1120 inner div
const lessonNodes: LessonNode[] = [
  { id: 'n1',  number: 1,  x: 610,  y: 250, title: 'Ders 1', subtitle: 'Giris',       tone: 'pink',   icon: Sprout },
  { id: 'n2',  number: 2,  x: 810,  y: 250, title: 'Ders 2', subtitle: 'Gelisme',     tone: 'pink',   icon: MessageCircleMore },
  { id: 'n3',  number: 3,  x: 1010, y: 250, title: 'Ders 3', subtitle: 'Pratik',      tone: 'pink',   icon: Headphones },
  { id: 'n4',  number: 4,  x: 1210, y: 250, title: 'Ders 4', subtitle: 'Uretim',      tone: 'pink',   icon: Mic },
  { id: 'n5',  number: 5,  x: 1470, y: 350, title: 'Kontrol', subtitle: 'Unite sonu', tone: 'orange', icon: Star, checkpoint: true },

  { id: 'n6',  number: 6,  x: 1210, y: 475, title: 'Ders 1', subtitle: 'Giris',       tone: 'blue',   icon: Sprout },
  { id: 'n7',  number: 7,  x: 1420, y: 575, title: 'Ders 2', subtitle: 'Gelisme',     tone: 'blue',   icon: MessageCircleMore },
  { id: 'n8',  number: 8,  x: 1610, y: 575, title: 'Ders 3', subtitle: 'Pratik',      tone: 'blue',   icon: Headphones },
  { id: 'n9',  number: 9,  x: 1610, y: 820, title: 'Ders 4', subtitle: 'Uretim',      tone: 'blue',   icon: Mic },
  { id: 'n10', number: 10, x: 1300, y: 750, title: 'Kontrol', subtitle: 'Unite sonu', tone: 'orange', icon: Star, checkpoint: true },

  { id: 'n11', number: 11, x: 1010, y: 685, title: 'Ders 1', subtitle: 'Giris',       tone: 'purple', icon: Sprout },
  { id: 'n12', number: 12, x: 860,  y: 625, title: 'Ders 2', subtitle: 'Gelisme',     tone: 'purple', icon: MessageCircleMore },
  { id: 'n13', number: 13, x: 720,  y: 625, title: 'Ders 3', subtitle: 'Pratik',      tone: 'purple', icon: Headphones },
  { id: 'n14', number: 14, x: 570,  y: 625, title: 'Ders 4', subtitle: 'Uretim',      tone: 'purple', icon: Mic },
  { id: 'n15', number: 15, x: 340,  y: 750, title: 'Kontrol', subtitle: 'Unite sonu', tone: 'orange', icon: Star, checkpoint: true },

  { id: 'n16', number: 16, x: 420,  y: 945, title: 'Ders 1', subtitle: 'Giris',       tone: 'gray',   icon: Sprout },
  { id: 'n17', number: 17, x: 620,  y: 945, title: 'Ders 2', subtitle: 'Gelisme',     tone: 'gray',   icon: MessageCircleMore },
  { id: 'n18', number: 18, x: 820,  y: 945, title: 'Ders 3', subtitle: 'Pratik',      tone: 'gray',   icon: Headphones },
  { id: 'n19', number: 19, x: 1020, y: 945, title: 'Ders 4', subtitle: 'Uretim',      tone: 'gray',   icon: Mic },
  { id: 'n20', number: 20, x: 1220, y: 945, title: 'Kontrol', subtitle: 'Unite sonu', tone: 'orange', icon: Star, checkpoint: true },
];

const toneStyles: Record<NodeTone, string> = {
  pink:   'border-transparent bg-[linear-gradient(145deg,#ff9fb4,#ef4d73)] shadow-[0_8px_0_#d8385c,0_18px_30px_rgba(237,75,112,0.24)]',
  orange: 'border-transparent bg-[linear-gradient(145deg,#ffc75f,#f09a20)] shadow-[0_8px_0_#d77c13,0_18px_32px_rgba(240,154,32,0.28)]',
  purple: 'border-transparent bg-[linear-gradient(145deg,#b990f4,#8753d5)] shadow-[0_8px_0_#7142b8,0_18px_32px_rgba(135,83,213,0.25)]',
  blue:   'border-transparent bg-[linear-gradient(145deg,#7cc1ff,#3a8edc)] shadow-[0_8px_0_#2870b6,0_18px_30px_rgba(58,142,220,0.24)]',
  gray:   'border-transparent bg-[linear-gradient(145deg,#c8c8c8,#868686)] shadow-[0_8px_0_#777,0_18px_28px_rgba(80,80,80,0.14)]'
};

const progressTrackColors: Record<NodeTone, string> = {
  pink:   '#ffe3ea',
  orange: '#ffe1ad',
  purple: '#e6d5ff',
  blue:   '#d4ebff',
  gray:   '#f3f0ee'
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
      <h2 className={`max-w-[16rem] text-xl font-extrabold leading-tight ${isDark ? 'text-[#f8fbff] drop-shadow-[0_2px_5px_rgba(0,0,0,0.75)]' : 'text-[#1f2b3b]'}`}>{marker.title}</h2>
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
  const borderWidth = 7;
  const r = size / 2 - borderWidth / 2;
  const circumference = 2 * Math.PI * r;
  const progressOffset = circumference - (Math.max(0, Math.min(100, progress)) / 100) * circumference;
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
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
          style={{ left: -borderWidth, top: -borderWidth }}
        >
          {/* Track: only visible when node is unlocked */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={progressTrackColors[node.tone]}
            strokeWidth={borderWidth}
            opacity={isLocked ? 0 : 0.55}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={progressRingStyles[node.tone]}
            strokeLinecap="round"
            strokeWidth={borderWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            opacity={isLocked || progress === 0 ? 0 : 1}
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
  const borderWidth = 6;
  const r = size / 2 - borderWidth / 2;
  const circumference = 2 * Math.PI * r;
  const progressOffset = circumference - (Math.max(0, Math.min(100, item.progress)) / 100) * circumference;

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
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
          style={{ left: -borderWidth, top: -borderWidth }}
        >
          {/* Track: only visible when node is unlocked */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={progressTrackColors[item.node.tone]}
            strokeWidth={borderWidth}
            opacity={isLocked ? 0 : 0.55}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={progressRingStyles[item.node.tone]}
            strokeLinecap="round"
            strokeWidth={borderWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            opacity={isLocked || item.progress === 0 ? 0 : 1}
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
    { id: 'practice', label: labels.practice, href: getPracticeHomeRoute('hiragana'), icon: Gamepad2 },
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
  levelInfo: { label: string; color: string };
  allLevelUnitsComplete: boolean;
  hasNextLevel: boolean;
  currentLevel: string;
  onOpenUnit: (unitId: string) => void;
  onExam: () => void;
}> = ({ language, themeMode, copy, sections, levelInfo, allLevelUnitsComplete, hasNextLevel, onOpenUnit, onExam }) => {
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-[-0.02em]">{copy.title}</h1>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-black text-white"
              style={{ backgroundColor: levelInfo.color }}
            >
              {levelInfo.label}
            </span>
          </div>
          <p className={`mt-2 text-sm font-semibold leading-6 ${isDark ? 'text-[#d5dceb]' : 'text-[#405064]'}`}>
            {copy.subtitle}
          </p>
          {allLevelUnitsComplete && hasNextLevel && (
            <button
              type="button"
              onClick={onExam}
              className="mt-3 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-white shadow-[0_4px_14px_rgba(240,77,114,0.35)] transition hover:scale-105"
              style={{ backgroundColor: levelInfo.color }}
            >
              {copy.examButton} →
            </button>
          )}
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
                  <h2 className="text-xl font-black leading-tight">{section.marker.title}</h2>
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
  const { currentLevel, hasNextLevel } = useLearnLevelProgress();
  const levelInfo = getLevelInfo(currentLevel);
  const sections = useMemo(() => getLearnCourseSections(language, currentLevel), [language, currentLevel]);
  const units = useMemo(() => flattenLearnCourseUnits(sections), [sections]);
  const orderedUnitIds = useMemo(() => units.map((unit) => unit.id), [units]);
  const { completedCount, completedSet, getUnitProgress, getUnitState, resetProgress } = useLearnCourseProgress(orderedUnitIds);

  const allLevelUnitsComplete = units.length > 0 && completedCount === units.length;

  // Which chapter the user is currently progressing in
  const activeChapter = useMemo(() => {
    if (units.length === 0) return 0;
    const firstIncompleteIndex = orderedUnitIds.findIndex((id) => !completedSet.has(id));
    if (firstIncompleteIndex === -1) {
      return Math.max(0, Math.ceil(units.length / UNIT_GROUPS_PER_CHAPTER) - 1);
    }
    return Math.floor(firstIncompleteIndex / UNIT_GROUPS_PER_CHAPTER);
  }, [units.length, orderedUnitIds, completedSet]);

  // Which chapter the user is currently viewing (can differ from activeChapter via nav)
  const [viewChapter, setViewChapter] = useState(activeChapter);

  // When the user completes a chapter, auto-advance the view to the new active chapter
  useEffect(() => {
    setViewChapter((prev) => Math.max(prev, activeChapter));
  }, [activeChapter]);

  // Reset view to chapter 0 when the level changes (new level starts fresh)
  useEffect(() => {
    setViewChapter(0);
  }, [currentLevel]);

  const totalChapters = Math.max(1, Math.ceil(units.length / UNIT_GROUPS_PER_CHAPTER));
  const chapterStart = viewChapter * UNIT_GROUPS_PER_CHAPTER;

  // Slice of course units visible in the current chapter view
  const chapterUnits = useMemo(
    () => units.slice(chapterStart, chapterStart + NODES_PER_CHAPTER),
    [units, chapterStart]
  );

  // Each chapter shows exactly four units; each marker names one unit.
  const dynamicUnitMarkers = useMemo(
    () =>
      unitMarkers.map((marker, index) => {
        const unit = chapterUnits[index];
        const unitNumber = chapterStart + index + 1;

        return {
          ...marker,
          badge:
            language === 'tr'
              ? `ÜNİTE ${unitNumber}`
              : `UNIT ${unitNumber}`,
          title: unit?.title ?? marker.title,
          subtitle: language === 'tr' ? '4 ders + kontrol noktası' : '4 lessons + checkpoint'
        };
      }),
    [chapterStart, chapterUnits, language]
  );

  const nodeRuntime = useMemo<LessonNodeRuntime[]>(
    () =>
      lessonNodes.map((node, index) => {
        const unitIndex = Math.floor(index / NODES_PER_GROUP);
        const lessonIndex = index % NODES_PER_GROUP;
        const unit = chapterUnits[unitIndex];
        const isCheckpoint = lessonIndex === NODES_PER_GROUP - 1;

        if (!unit) {
          return {
            node,
            unitId: null,
            state: 'locked' as LessonNodeState,
            progress: 0
          };
        }

        const unitState = getUnitState(unit.id);
        const lessonTitle =
          isCheckpoint
            ? language === 'tr' ? 'Kontrol' : 'Checkpoint'
            : language === 'tr' ? `Ders ${lessonIndex + 1}` : `Lesson ${lessonIndex + 1}`;
        const lessonSubtitle =
          isCheckpoint
            ? language === 'tr' ? 'Ünite sonu' : 'Unit checkpoint'
            : unit.lessonHighlights[lessonIndex] ?? node.subtitle;

        return {
          node: {
            ...node,
            number: lessonIndex + 1,
            title: lessonTitle,
            subtitle: lessonSubtitle
          },
          unitId: unit.id,
          state: unitState,
          progress: getUnitProgress(unit.id)
        };
      }),
    [chapterUnits, getUnitProgress, getUnitState, language]
  );

  const mobileSections = useMemo<MobileUnitSection[]>(
    () =>
      mobileUnitRanges.map((range, index) => {
        const marker =
          dynamicUnitMarkers.find((item) => item.id === range.markerId) ??
          dynamicUnitMarkers[index];
        const firstGroupUnit = chapterUnits[Math.floor(range.start / NODES_PER_GROUP)];

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
  const canGoNext = viewChapter < totalChapters - 1;

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
      <LearnFallingFlowers themeMode={themeMode} />
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
        levelInfo={levelInfo}
        allLevelUnitsComplete={allLevelUnitsComplete}
        hasNextLevel={hasNextLevel}
        currentLevel={currentLevel}
        onOpenUnit={(unitId) => navigate(getLearnUnitRoute(unitId))}
        onExam={() => navigate(getLearnExamRoute(currentLevel))}
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
            <div className="flex items-center gap-3">
              <h1 className={`text-[28px] font-extrabold tracking-[-0.02em] ${
                isDark ? 'text-[#f8fbff] drop-shadow-[0_2px_5px_rgba(0,0,0,0.72)]' : 'text-[#1f2b3b]'
              }`}>{copy.title}</h1>
              <span
                className="rounded-full px-3 py-1 text-[13px] font-black text-white shadow-[0_4px_12px_rgba(0,0,0,0.18)]"
                style={{ backgroundColor: levelInfo.color }}
              >
                {levelInfo.label}
              </span>
            </div>
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
              {allLevelUnitsComplete && hasNextLevel && (
                <button
                  type="button"
                  onClick={() => navigate(getLearnExamRoute(currentLevel))}
                  className="flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-black text-white shadow-[0_4px_14px_rgba(240,77,114,0.35)] transition hover:scale-105 hover:shadow-[0_6px_18px_rgba(240,77,114,0.45)]"
                  style={{ backgroundColor: levelInfo.color }}
                >
                  {copy.examButton} →
                </button>
              )}
              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={resetProgress}
                  className={`rounded-full px-3 py-0.5 text-[12px] font-bold opacity-40 hover:opacity-70 transition ${
                    isDark ? 'bg-white/10 text-white' : 'bg-[#1f2b3b]/[0.07] text-[#1f2b3b]'
                  }`}
                >
                  ↺ Sıfırla
                </button>
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
                chapterUnits[index]
                  ? getLearnGuideRoute(chapterUnits[index].id)
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
