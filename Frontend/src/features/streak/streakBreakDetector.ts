/**
 * streakBreakDetector — kullanıcı kaç gün boş bırakmış kontrolü.
 * Heat takvimine bakar; bugün ve dün ikisi de boşsa "söndü" durumu.
 * 1 gün boş ama freeze varsa otomatik tüket; aksi halde modal'a teslim et.
 */

import {
  consumeFreeze,
  getFreezeStatus,
  getHeatGrid
} from './tomoshibi';

export type StreakBreakStatus =
  | { kind: 'ok' }
  | { kind: 'warning'; missedToday: boolean; freezeAvailable: number }
  | { kind: 'shielded'; daysCovered: number }
  | { kind: 'broken'; daysMissed: number; freezeAvailable: number };

const todayKey = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const yesterdayKey = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * detectStreakStatus — App mount + kritik etkileşimlerde çağırılır.
 * Yan etki: shielded durumda otomatik freeze tüketir.
 */
export const detectStreakStatus = (): StreakBreakStatus => {
  const grid = getHeatGrid(7);
  const today = todayKey();
  const yesterday = yesterdayKey();
  const hasToday = grid.some((g) => g.date === today && g.active);
  const hasYesterday = grid.some((g) => g.date === yesterday && g.active);
  const freeze = getFreezeStatus().available;

  if (hasToday) return { kind: 'ok' };

  if (hasYesterday) {
    // Bugün yok ama dün var → henüz kırılmadı; uyarı tonu (saat 23'ten sonra UI gösterir)
    return { kind: 'warning', missedToday: true, freezeAvailable: freeze };
  }

  // Dün de yok — 1 gün freeze varsa kurtar; yoksa söndü
  if (freeze > 0) {
    if (consumeFreeze()) {
      return { kind: 'shielded', daysCovered: 1 };
    }
  }

  let missedDays = 0;
  for (let i = grid.length - 1; i >= 0; i--) {
    if (grid[i].active) break;
    missedDays += 1;
  }
  return { kind: 'broken', daysMissed: missedDays, freezeAvailable: freeze };
};
