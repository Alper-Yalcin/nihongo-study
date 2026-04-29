/**
 * MeydanPage — Sprint 4 D1-D2'de tamamlanır.
 * Skeleton: 4 mod kart (Speed / Timed / Dōjō / Duel), Speed + Timed
 * çalışır; Dōjō + Duel "yakında" rozetli.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Flame, Sword, Timer, Trophy, Users } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { appShellRoutes } from '../data/appShellContent';
import { KanaScript } from '../features/kana/domain/kanaItem';
import {
  consumeXpMultiplier,
  getActiveMeydanBoost,
  startTimedXpBoost,
  subscribeMeydanBoost
} from '../features/meydan/meydanBoosts';
import { getCurrentDojoBoss, getDojoChampions } from '../features/meydan/dojoStore';
import { getDanProgress, getKyuFromXp } from '../data/danSystem';
import { useFeedback } from '../hooks/useFeedback';
import { getJLearnUserState, subscribeJLearnUserState } from '../features/jlearn/debug/debugStore';

interface MeydanPageProps {
  language: AppLanguage;
}

const copy = {
  tr: {
    title: 'Meydan',
    sub: 'Core loop\'a bağlı modlar',
    speed: 'Speed Mode',
    speedSub: 'Streak +1 — hızlı doğru zinciri',
    timed: 'Timed Challenge',
    timedSub: '30 dk × 2 hanabira',
    dojo: 'Dōjō (Boss)',
    dojoSub: 'Haftalık ortak boss',
    duel: 'Duel',
    duelSub: 'Async 1v1',
    soon: 'Yakında',
    activeBoost: 'Aktif',
    boostRemaining: 'kalan',
    startSpeed: 'Speed başlat',
    startTimed: 'Timed çalıştır',
    boss: 'Bu haftanın boss\'u',
    leaderboard: 'Dan salonu — aylık ilk 5',
    mins: 'dk',
    danLabel: 'Rütbe',
    nextRank: 'Sonraki'
  },
  en: {
    title: 'Meydan',
    sub: 'Core-loop connected modes',
    speed: 'Speed Mode',
    speedSub: 'Streak +1 — quick correct chain',
    timed: 'Timed Challenge',
    timedSub: '30 min × 2 hanabira',
    dojo: 'Dōjō (Boss)',
    dojoSub: 'Weekly shared boss',
    duel: 'Duel',
    duelSub: 'Async 1v1',
    soon: 'Soon',
    activeBoost: 'Active',
    boostRemaining: 'remaining',
    startSpeed: 'Start Speed',
    startTimed: 'Activate Timed',
    boss: 'This week\'s boss',
    leaderboard: 'Dan hall — monthly top 5',
    mins: 'min',
    danLabel: 'Rank',
    nextRank: 'Next'
  }
} as const;

const formatMmSs = (ms: number): string => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const MeydanPage: React.FC<MeydanPageProps> = ({ language }) => {
  const c = copy[language];
  const [searchParams] = useSearchParams();
  const script: KanaScript = searchParams.get('script') === 'katakana' ? 'katakana' : 'hiragana';
  const [boost, setBoost] = useState(() => getActiveMeydanBoost());
  const [streakDays, setStreakDays] = useState(() => getJLearnUserState().streakDays);
  const { state: feedbackState } = useFeedback();

  useEffect(() => {
    const unsub = subscribeMeydanBoost(() => setBoost(getActiveMeydanBoost()));
    const tick = window.setInterval(() => setBoost(getActiveMeydanBoost()), 1000);
    return () => {
      unsub();
      window.clearInterval(tick);
    };
  }, []);

  useEffect(() => {
    return subscribeJLearnUserState(() => setStreakDays(getJLearnUserState().streakDays));
  }, []);

  const dan = getKyuFromXp(feedbackState.hanabira, streakDays);
  const danProgress = getDanProgress(feedbackState.hanabira, streakDays);

  const dojoBoss = useMemo(() => getCurrentDojoBoss(), []);
  const champions = useMemo(() => getDojoChampions(language), [language]);

  return (
    <div className="space-y-6 pb-10">
      <header className="rounded-[1.4rem] border p-5"
        style={{
          borderColor: 'color-mix(in srgb, var(--kt-brand) 30%, transparent)',
          background: 'var(--kt-surface-raised)'
        }}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-[var(--kt-ink-strong)]">{c.title}</h1>
            <p className="text-sm text-[var(--kt-ink-muted)]">{c.sub}</p>
          </div>
          <div
            className="rounded-[0.95rem] border px-3 py-2 text-right"
            style={{
              borderColor: 'color-mix(in srgb, var(--kt-dan-gold) 50%, transparent)',
              background: 'var(--kt-dan-gold-soft)',
              color: 'var(--kt-dan-ink)'
            }}
          >
            <div className="text-[10px] font-black uppercase tracking-[0.18em]">{c.danLabel}</div>
            <div className="text-lg font-black">{dan.label}</div>
            <div className="text-[10px] font-bold tabular-nums opacity-80">
              {Math.round(danProgress.percent)}% · {c.nextRank}: {danProgress.nextLabel}
            </div>
          </div>
        </div>
        {boost && (
          <div
            className="mt-3 flex items-center justify-between rounded-[0.95rem] px-3 py-2 text-sm"
            style={{ background: 'var(--kt-tomoshibi)', color: 'var(--kt-brand-on)' }}
          >
            <span className="font-black">
              ⚡ ×{boost.multiplier} {c.activeBoost}
            </span>
            <span className="font-bold tabular-nums">
              {formatMmSs(boost.expiresAt - Date.now())} {c.boostRemaining}
            </span>
          </div>
        )}
      </header>

      <section className="grid gap-3 sm:grid-cols-2">
        {/* Speed Mode */}
        <Link
          to={`${appShellRoutes.practiceRun}?script=${script}&tab=review&mode=typing`}
          className="kt-tap-bounce rounded-[1.2rem] border p-4 transition hover:-translate-y-0.5"
          style={{
            borderColor: 'color-mix(in srgb, var(--kt-tomoshibi) 38%, transparent)',
            background: 'color-mix(in srgb, var(--kt-tomoshibi) 8%, var(--kt-surface))',
            boxShadow: 'var(--kt-shadow)'
          }}
        >
          <div className="flex items-start gap-3">
            <Flame size={28} style={{ color: 'var(--kt-tomoshibi-strong)' }} />
            <div>
              <div className="text-sm font-black uppercase tracking-[0.12em]" style={{ color: 'var(--kt-tomoshibi-strong)' }}>{c.speed}</div>
              <div className="mt-1 text-sm text-[var(--kt-ink-muted)]">{c.speedSub}</div>
            </div>
          </div>
          <div className="mt-3 text-[11px] font-black uppercase tracking-[0.12em]" style={{ color: 'var(--kt-tomoshibi-strong)' }}>
            → {c.startSpeed}
          </div>
        </Link>

        {/* Timed Challenge */}
        <button
          type="button"
          onClick={() => startTimedXpBoost(2, 30)}
          className="kt-tap-bounce text-left rounded-[1.2rem] border p-4 transition hover:-translate-y-0.5"
          style={{
            borderColor: 'color-mix(in srgb, var(--kt-brand) 38%, transparent)',
            background: 'color-mix(in srgb, var(--kt-brand) 6%, var(--kt-surface))',
            boxShadow: 'var(--kt-shadow)'
          }}
        >
          <div className="flex items-start gap-3">
            <Timer size={28} style={{ color: 'var(--kt-brand)' }} />
            <div>
              <div className="text-sm font-black uppercase tracking-[0.12em]" style={{ color: 'var(--kt-brand)' }}>{c.timed}</div>
              <div className="mt-1 text-sm text-[var(--kt-ink-muted)]">{c.timedSub}</div>
            </div>
          </div>
          <div className="mt-3 text-[11px] font-black uppercase tracking-[0.12em]" style={{ color: 'var(--kt-brand)' }}>
            → {c.startTimed}
          </div>
        </button>

        {/* Dōjō */}
        <article
          className="rounded-[1.2rem] border p-4"
          style={{
            borderColor: 'var(--kt-border-subtle)',
            background: 'var(--kt-surface)'
          }}
        >
          <div className="flex items-start gap-3">
            <Sword size={28} style={{ color: 'var(--kt-accent-plum)' }} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black uppercase tracking-[0.12em]" style={{ color: 'var(--kt-accent-plum)' }}>
                  {c.dojo}
                </span>
              </div>
              <div className="mt-1 text-sm text-[var(--kt-ink-muted)]">{c.dojoSub}</div>
            </div>
          </div>
          {dojoBoss && (
            <div className="mt-3">
              <div className="text-xs font-black uppercase tracking-[0.12em] text-[var(--kt-ink-muted)]">{c.boss}</div>
              <div className="mt-1 text-sm font-bold text-[var(--kt-ink-strong)]">{dojoBoss.name}</div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full" style={{ background: 'var(--kt-progress-track)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, dojoBoss.communityProgress * 100)}%`,
                    background: 'var(--kt-accent-plum)'
                  }}
                />
              </div>
              <div className="mt-1 text-[10px] tabular-nums text-[var(--kt-ink-subtle)]">
                {Math.round(dojoBoss.communityProgress * 100)}%
              </div>
            </div>
          )}
        </article>

        {/* Duel */}
        <article
          className="rounded-[1.2rem] border p-4 opacity-95"
          style={{
            borderColor: 'var(--kt-border-subtle)',
            background: 'var(--kt-surface)'
          }}
        >
          <div className="flex items-start gap-3">
            <Users size={28} style={{ color: 'var(--kt-accent-info)' }} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black uppercase tracking-[0.12em]" style={{ color: 'var(--kt-accent-info)' }}>
                  {c.duel}
                </span>
                <span className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.16em]" style={{ background: 'var(--kt-surface-muted)', color: 'var(--kt-ink-muted)' }}>{c.soon}</span>
              </div>
              <div className="mt-1 text-sm text-[var(--kt-ink-muted)]">{c.duelSub}</div>
            </div>
          </div>
        </article>
      </section>

      {/* Dan salonu mini leaderboard (mock) */}
      <section
        className="rounded-[1.2rem] border p-4"
        style={{
          borderColor: 'var(--kt-border-subtle)',
          background: 'var(--kt-surface)'
        }}
      >
        <div className="flex items-center gap-2">
          <Trophy size={18} style={{ color: 'var(--kt-dan-ink)' }} />
          <h2 className="text-sm font-black uppercase tracking-[0.12em] text-[var(--kt-ink-strong)]">
            {c.leaderboard}
          </h2>
        </div>
        <ul className="mt-3 space-y-1.5">
          {champions.map((ch, idx) => (
            <li
              key={ch.id}
              className="flex items-center justify-between rounded-[0.7rem] px-2 py-1.5"
              style={{
                background: idx === 0 ? 'var(--kt-dan-gold-soft)' : 'var(--kt-surface-muted)'
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black"
                  style={{
                    background: idx < 3 ? 'var(--kt-dan-gold)' : 'var(--kt-border)',
                    color: idx < 3 ? 'var(--kt-dan-ink)' : 'var(--kt-ink-muted)'
                  }}
                >
                  {idx + 1}
                </span>
                <span className="text-sm font-bold text-[var(--kt-ink-strong)]">{ch.name}</span>
                {ch.isYou && (
                  <span className="rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.18em]" style={{ background: 'var(--kt-brand)', color: 'var(--kt-brand-on)' }}>
                    you
                  </span>
                )}
              </div>
              <span className="text-xs font-bold tabular-nums text-[var(--kt-ink-muted)]">
                花 {ch.hanabira}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

// Sessizce export — boost manuel tüketim için
export const consumeMeydanBoost = consumeXpMultiplier;
