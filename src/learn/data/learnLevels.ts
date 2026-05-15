export type JLPTLevel = 'n5' | 'n4' | 'n3' | 'n2' | 'n1';

export const JLPT_LEVEL_ORDER: JLPTLevel[] = ['n5', 'n4', 'n3', 'n2', 'n1'];

export interface LearnLevel {
  id: JLPTLevel;
  label: string;
  color: string;
  bgClass: string;
  description: { tr: string; en: string };
}

export const learnLevels: LearnLevel[] = [
  {
    id: 'n5',
    label: 'N5',
    color: '#22c55e',
    bgClass: 'bg-[#22c55e]',
    description: { tr: 'Temel Japonca', en: 'Basic Japanese' }
  },
  {
    id: 'n4',
    label: 'N4',
    color: '#3b82f6',
    bgClass: 'bg-[#3b82f6]',
    description: { tr: 'Başlangıç Seviyesi', en: 'Elementary' }
  },
  {
    id: 'n3',
    label: 'N3',
    color: '#f59e0b',
    bgClass: 'bg-[#f59e0b]',
    description: { tr: 'Orta Seviye', en: 'Intermediate' }
  },
  {
    id: 'n2',
    label: 'N2',
    color: '#8b5cf6',
    bgClass: 'bg-[#8b5cf6]',
    description: { tr: 'Üst Orta', en: 'Upper Intermediate' }
  },
  {
    id: 'n1',
    label: 'N1',
    color: '#ef4444',
    bgClass: 'bg-[#ef4444]',
    description: { tr: 'İleri Seviye', en: 'Advanced' }
  }
];

export const getLevelInfo = (id: JLPTLevel): LearnLevel =>
  learnLevels.find((l) => l.id === id) ?? learnLevels[0];

export const getNextLevel = (level: JLPTLevel): JLPTLevel | null => {
  const idx = JLPT_LEVEL_ORDER.indexOf(level);
  return idx >= 0 && idx < JLPT_LEVEL_ORDER.length - 1
    ? JLPT_LEVEL_ORDER[idx + 1]
    : null;
};
