/**
 * smartNotifications — son 14 gün ortalama pratik saatinden ±15 dk
 * pencerede tarayıcı bildirimi tetikleyen lokal scheduler.
 *
 * Plan tonu: davet, suçluluk değil. Push servisi yok — sadece web
 * `Notification` API'si, kullanıcı tabı açıkken çalışır. Backend +
 * service worker faza ertelendi.
 */

import { getHeatGrid } from '../streak/tomoshibi';

const SCHEDULE_KEY = 'kototsuna.notif.schedule.v1';
const ACTIVITY_HOURS_KEY = 'kototsuna.notif.activityHours.v1';

interface ScheduleRecord {
  lastNotifiedDay: string;       // YYYY-MM-DD
  preferredHour: number;         // 0-23
}

interface ActivityHoursRecord {
  // hourBuckets[h] = sayı
  hourBuckets: number[];
  lastBumpedAt: number;
}

const todayKey = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const readSchedule = (): ScheduleRecord => {
  if (typeof window === 'undefined') return { lastNotifiedDay: '', preferredHour: 19 };
  try {
    const raw = window.localStorage.getItem(SCHEDULE_KEY);
    if (!raw) return { lastNotifiedDay: '', preferredHour: 19 };
    const parsed = JSON.parse(raw);
    return {
      lastNotifiedDay: typeof parsed.lastNotifiedDay === 'string' ? parsed.lastNotifiedDay : '',
      preferredHour: typeof parsed.preferredHour === 'number' ? Math.max(0, Math.min(23, parsed.preferredHour)) : 19
    };
  } catch {
    return { lastNotifiedDay: '', preferredHour: 19 };
  }
};

const writeSchedule = (rec: ScheduleRecord): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SCHEDULE_KEY, JSON.stringify(rec));
  } catch { /* yok say */ }
};

const readActivity = (): ActivityHoursRecord => {
  if (typeof window === 'undefined') return { hourBuckets: new Array(24).fill(0), lastBumpedAt: 0 };
  try {
    const raw = window.localStorage.getItem(ACTIVITY_HOURS_KEY);
    if (!raw) return { hourBuckets: new Array(24).fill(0), lastBumpedAt: 0 };
    const parsed = JSON.parse(raw);
    const buckets = Array.isArray(parsed.hourBuckets) && parsed.hourBuckets.length === 24
      ? parsed.hourBuckets.map((n: unknown) => (typeof n === 'number' && Number.isFinite(n) ? Math.max(0, n) : 0))
      : new Array(24).fill(0);
    return {
      hourBuckets: buckets,
      lastBumpedAt: typeof parsed.lastBumpedAt === 'number' ? parsed.lastBumpedAt : 0
    };
  } catch {
    return { hourBuckets: new Array(24).fill(0), lastBumpedAt: 0 };
  }
};

const writeActivity = (rec: ActivityHoursRecord): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ACTIVITY_HOURS_KEY, JSON.stringify(rec));
  } catch { /* yok say */ }
};

/** Kullanıcı pratik yaptıkça çağırılır → o saat dilimini öğrenir. */
export const recordPracticeHour = (): void => {
  const now = Date.now();
  const rec = readActivity();
  // Aynı saat içinde tekrar bumplama (gürültü azaltma)
  if (now - rec.lastBumpedAt < 60 * 60 * 1000) return;
  const h = new Date(now).getHours();
  rec.hourBuckets[h] = (rec.hourBuckets[h] ?? 0) + 1;
  rec.lastBumpedAt = now;
  // Slow decay: en eski 30 günde bir nominal azalt
  if (now % 31 === 0) {
    rec.hourBuckets = rec.hourBuckets.map((v) => Math.max(0, v * 0.9));
  }
  writeActivity(rec);
  // Tercih saati hesapla
  const preferred = rec.hourBuckets.indexOf(Math.max(...rec.hourBuckets));
  if (preferred >= 0) {
    const sched = readSchedule();
    sched.preferredHour = preferred;
    writeSchedule(sched);
  }
};

/** Tarayıcıda sessize alınmamış bildirim göster — yalnız bir kez/gün. */
export const maybeNotifyNow = (lang: 'tr' | 'en' = 'tr'): boolean => {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;

  const sched = readSchedule();
  const today = todayKey();
  if (sched.lastNotifiedDay === today) return false;

  const now = new Date();
  const target = sched.preferredHour;
  const diff = Math.abs(now.getHours() - target);
  if (diff > 1) return false;

  // Bugün heat'e ekleme yapılmadıysa nazik davet
  const grid = getHeatGrid(2);
  const todayActive = grid.some((g) => g.date === today && g.active);
  const title = todayActive
    ? lang === 'tr' ? 'Bugün de yaktın 灯' : 'You kept the flame today'
    : lang === 'tr' ? '灯 hazır — kısa bir oturum?' : '灯 ready — a short session?';
  const body = todayActive
    ? lang === 'tr' ? 'Yarın için sırada Forge oturumu var.' : 'Forge session is up for tomorrow.'
    : lang === 'tr' ? '5 dakika yeter, devam edebilirsin.' : '5 minutes is enough to keep going.';

  try {
    const n = new Notification(title, {
      body,
      icon: '/logo/kototsuna-logo.png',
      tag: 'kototsuna-daily',
      silent: false
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
    sched.lastNotifiedDay = today;
    writeSchedule(sched);
    return true;
  } catch {
    return false;
  }
};

/** App mount'ta scheduler'ı kur — saat başı kontrol et. */
export const installSmartNotifier = (lang: 'tr' | 'en' = 'tr'): (() => void) => {
  if (typeof window === 'undefined') return () => undefined;
  // Boot'ta dene
  maybeNotifyNow(lang);
  const timer = window.setInterval(() => maybeNotifyNow(lang), 60 * 60 * 1000);
  return () => window.clearInterval(timer);
};
