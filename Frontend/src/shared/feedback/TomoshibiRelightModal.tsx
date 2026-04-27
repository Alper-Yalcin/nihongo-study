/**
 * TomoshibiRelightModal — streak söndüğünde nazik davet modal'ı.
 * Plan: "灯 söndü — yeniden yak" tonu; suçluluk değil, davet.
 */
import React, { useEffect, useState } from 'react';
import { Flame, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { detectStreakStatus, StreakBreakStatus } from '../../features/streak/streakBreakDetector';
import { appShellRoutes } from '../../data/appShellContent';

const SESSION_DISMISS_KEY = 'kototsuna.tomoshibi.relight.dismissed';

interface CopyBundle {
  brokenTitle: string;
  brokenSub: (days: number) => string;
  warningTitle: string;
  warningSub: string;
  shieldedTitle: string;
  shieldedSub: string;
  cta: string;
  later: string;
}

const copyMap: Record<'tr' | 'en', CopyBundle> = {
  tr: {
    brokenTitle: '灯 söndü',
    brokenSub: (days: number) =>
      `${days} gün geçti — yeniden yakmak 5 dakika alır.`,
    warningTitle: '灯 zayıflıyor',
    warningSub: 'Bugünü kaçırma — kısa bir oturum yeter.',
    shieldedTitle: 'Hafta sonu kurtardı',
    shieldedSub: 'Freeze otomatik kullanıldı, streak korunuyor.',
    cta: 'Yeniden yak — 5 dk',
    later: 'Sonra'
  },
  en: {
    brokenTitle: '灯 went out',
    brokenSub: (days: number) =>
      `${days} days passed — relighting takes 5 minutes.`,
    warningTitle: '灯 dimming',
    warningSub: "Don't miss today — a short session is enough.",
    shieldedTitle: 'Weekend freeze used',
    shieldedSub: 'Streak protected automatically.',
    cta: 'Relight — 5 min',
    later: 'Later'
  }
};

export interface TomoshibiRelightModalProps {
  language: 'tr' | 'en';
}

export const TomoshibiRelightModal: React.FC<TomoshibiRelightModalProps> = ({ language }) => {
  const c = copyMap[language] ?? copyMap.tr;
  const [status, setStatus] = useState<StreakBreakStatus | null>(null);
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(SESSION_DISMISS_KEY) === '1';
  });

  useEffect(() => {
    // Mount'ta tek sefer kontrol — App tarafında provoke edilmez
    setStatus(detectStreakStatus());
  }, []);

  if (!status || dismissed) return null;

  // Warning sadece akşam 22:00'dan sonra göster (proaktif değil)
  if (status.kind === 'warning') {
    const hour = new Date().getHours();
    if (hour < 22) return null;
  }

  // OK ise göstermez
  if (status.kind === 'ok') return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_DISMISS_KEY, '1');
    }
  };

  let title = '';
  let subtitle = '';
  let tone: 'broken' | 'warning' | 'shielded' = 'broken';

  if (status.kind === 'broken') {
    title = c.brokenTitle;
    subtitle = c.brokenSub(status.daysMissed);
    tone = 'broken';
  } else if (status.kind === 'warning') {
    title = c.warningTitle;
    subtitle = c.warningSub;
    tone = 'warning';
  } else if (status.kind === 'shielded') {
    title = c.shieldedTitle;
    subtitle = c.shieldedSub;
    tone = 'shielded';
  }

  const accent =
    tone === 'broken'
      ? 'var(--kt-ink-subtle)'
      : tone === 'warning'
        ? 'var(--kt-tomoshibi-strong)'
        : 'var(--kt-accent-success)';

  return (
    <div
      className="kt-relight-overlay fixed inset-0 z-[80] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kt-relight-title"
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.45)' }}
        onClick={handleDismiss}
        aria-hidden="true"
      />
      <div
        className="kt-relight-card relative w-full max-w-sm rounded-t-[1.4rem] border p-6 shadow-[var(--kt-shadow-lg)] sm:rounded-[1.4rem]"
        style={{
          borderColor: 'color-mix(in srgb, var(--kt-tomoshibi) 30%, transparent)',
          background: 'var(--kt-surface-raised)'
        }}
      >
        <button
          type="button"
          onClick={handleDismiss}
          aria-label={c.later}
          className="absolute right-3 top-3 rounded-full p-1 transition hover:bg-[var(--kt-nav-item-hover)]"
        >
          <X size={16} />
        </button>
        <div className="flex flex-col items-center text-center">
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              background: tone === 'broken' ? 'var(--kt-surface-muted)' : 'color-mix(in srgb, var(--kt-tomoshibi) 14%, transparent)',
              color: accent
            }}
          >
            <Flame size={32} className={tone === 'broken' ? '' : 'kt-tomoshibi-flicker'} />
          </span>
          <h2
            id="kt-relight-title"
            className="mt-4 text-2xl font-black text-[var(--kt-ink-strong)]"
          >
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--kt-ink-muted)]">{subtitle}</p>

          <div className="mt-5 flex w-full flex-col gap-2">
            <Link
              to={`${appShellRoutes.practice}?script=hiragana`}
              onClick={handleDismiss}
              className="kt-tap-bounce inline-flex items-center justify-center rounded-[1rem] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] shadow-[var(--kt-tomoshibi-glow)]"
              style={{
                background: 'var(--kt-tomoshibi)',
                color: '#fff'
              }}
            >
              {c.cta}
            </Link>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-xs font-semibold text-[var(--kt-ink-muted)] underline-offset-2 hover:underline"
            >
              {c.later}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes kt-relight-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .kt-relight-card { animation: kt-relight-in 220ms ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .kt-relight-card { animation: none; }
        }
      `}</style>
    </div>
  );
};
