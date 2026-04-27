/**
 * dojoStore — Sprint 4 D2 Dōjō (haftalık boss) + Dan salonu leaderboard.
 *
 * MVP++ skopu: backend yok. Boss'lar haftaya göre rotasyonla seçilir;
 * "communityProgress" lokal mock — kullanıcının mevcut hanabira'sından
 * türetilir. Gerçek topluluk damage backend faza ertelenmiştir.
 *
 * Champion listesi de mock, ancak "you" satırı kullanıcının hanabira
 * değeriyle senkron gösterilir (TopNav'daki feedback hook üzerinden).
 */

import { getFeedbackState } from '../../shared/hooks/useFeedback';

export interface DojoBoss {
  id: string;
  name: string;
  hint: string;
  // 0..1 kümülatif damage
  communityProgress: number;
}

const BOSS_ROTATION = [
  { id: 'shi-tsu', name: 'し vs つ', hint: 'En çok karıştırılan ikilinin haftası' },
  { id: 'nu-me-ne', name: 'ぬ め ね 三つ巴', hint: 'Üçlü kafa karışıklığı' },
  { id: 'sa-chi', name: 'さ vs ち', hint: 'Sa-Chi savaşı' },
  { id: 'ko-ka', name: 'こ vs カ', hint: 'Hira/kata sınır boss' },
  { id: 'wa-re', name: 'わ vs れ', hint: 'Sessiz tuzak' },
  { id: 'ri-ru', name: 'り vs る', hint: 'Çapraz çizgi takip' }
];

const isoWeek = (d: Date): number => {
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return weekNum;
};

export const getCurrentDojoBoss = (): DojoBoss => {
  const week = isoWeek(new Date());
  const rotation = BOSS_ROTATION[week % BOSS_ROTATION.length];
  const hanabira = getFeedbackState().hanabira;
  // Sahte topluluk damage: yeni hafta düşük (~5%) + kullanıcı katkısı
  const baselineByWeek = ((week % 13) / 13) * 0.65; // 0..0.65 dalgalanma
  const userContribution = Math.min(0.25, hanabira / 5000);
  return {
    ...rotation,
    communityProgress: Math.min(1, baselineByWeek + userContribution + 0.05)
  };
};

export interface DojoChampion {
  id: string;
  name: string;
  hanabira: number;
  isYou?: boolean;
}

const FAKE_NAMES = [
  'Akira', 'Hana', 'Ryo', 'Yuki', 'Sora', 'Mai', 'Tatsuya', 'Aoi', 'Kenji', 'Saki'
];

export const getDojoChampions = (_lang: 'tr' | 'en'): DojoChampion[] => {
  const userHanabira = getFeedbackState().hanabira;
  const seed = isoWeek(new Date()) * 31;
  const list: DojoChampion[] = FAKE_NAMES.slice(0, 4).map((name, i) => ({
    id: `champ-${i}`,
    name,
    // Determinist üretim — haftaya göre sabitlenmiş
    hanabira: 200 + ((seed + i * 137) % 1500)
  }));
  list.push({ id: 'you', name: 'Sen', hanabira: userHanabira, isYou: true });
  list.sort((a, b) => b.hanabira - a.hanabira);
  return list.slice(0, 5);
};
