/**
 * HeatCalendar — GitHub-vari aktiflik ızgarası, tomoshibi heat üzerinden.
 * 53 hafta × 7 gün; aktif gün dolu kare, pasif boş.
 */
import React from 'react';
import { getHeatGrid } from '../../features/streak/tomoshibi';

export interface HeatCalendarProps {
  weeks?: number;
  size?: number;
}

export const HeatCalendar: React.FC<HeatCalendarProps> = ({ weeks = 30, size = 10 }) => {
  const days = weeks * 7;
  const grid = getHeatGrid(days);

  // 7 satır × N kolon — kolonlara böl
  const cols: { date: string; active: boolean }[][] = [];
  for (let i = 0; i < grid.length; i += 7) {
    cols.push(grid.slice(i, i + 7));
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-[3px]">
        {cols.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-[3px]">
            {col.map((d) => (
              <span
                key={d.date}
                title={`${d.date}${d.active ? ' · aktif' : ''}`}
                style={{
                  width: size,
                  height: size,
                  borderRadius: 2,
                  background: d.active
                    ? 'color-mix(in srgb, var(--kt-tomoshibi) 80%, var(--kt-brand))'
                    : 'var(--kt-progress-track)',
                  boxShadow: d.active
                    ? '0 0 4px color-mix(in srgb, var(--kt-tomoshibi) 70%, transparent)'
                    : 'none'
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
