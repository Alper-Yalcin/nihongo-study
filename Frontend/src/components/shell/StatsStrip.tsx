import React from 'react';
import { Flame, Gem, Heart } from 'lucide-react';
import jpFlag from '../../flags/jp.svg';
import { StatPill } from './StatPill';

interface StatsStripProps {
  streak: number;
  xp: number;
  activeScriptLabel: string;
}

export const StatsStrip: React.FC<StatsStripProps> = ({ streak, xp, activeScriptLabel }) => (
  <div className="flex flex-wrap gap-3">
    <StatPill
      icon={<img src={jpFlag} alt="JP" className="h-4 w-6 rounded-sm object-cover" />}
      value="JP"
      label={activeScriptLabel}
      tone="neutral"
    />
    <StatPill icon={<Flame size={16} />} value={streak} label="Seri" tone="warning" />
    <StatPill icon={<Gem size={16} />} value={xp} label="XP" tone="info" />
    <StatPill icon={<Heart size={16} />} value={5} label="Can" tone="danger" />
  </div>
);
