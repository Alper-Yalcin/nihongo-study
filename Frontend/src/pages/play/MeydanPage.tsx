import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Flame, Swords, Timer, Trophy, Users } from 'lucide-react';
import { AppLanguage } from '../../data/appPreferences';
import { appShellRoutes } from '../../data/appShellContent';
import { KanaScript } from '../../features/kana/domain/kanaItem';
import {
  consumeXpMultiplier,
  getActiveMeydanBoost,
  startTimedXpBoost,
  subscribeMeydanBoost
} from '../../features/meydan/meydanBoosts';
import { getCurrentDojoBoss, getDojoChampions } from '../../features/meydan/dojoStore';
import { getDanProgress, getKyuFromXp } from '../../data/danSystem';
import { useFeedback } from '../../hooks/useFeedback';
import { getJLearnUserState, subscribeJLearnUserState } from '../../features/jlearn/debug/debugStore';
import { SceneHeader, ScenePanel, SceneShell } from '../../components/layout';
import { DanHall, RewardTrack } from '../../components/game';

interface MeydanPageProps {
  language: AppLanguage;
}

const copy = {
  tr: {
    title: 'Meydan',
    sub: 'Rekabet modu, hizli turlar ve dojo boss ilerlemesi ayni arena lobisinde.',
    speed: 'Speed Mode',
    speedSub: 'Hizli dogru zinciri ile streak baskisi.',
    timed: 'Timed Challenge',
    timedSub: '30 dakika boyunca x2 hanabira boost.',
    dojo: 'Dojo Boss',
    dojoSub: 'Haftalik ortak boss ilerlemesi.',
    duel: 'Duel',
    duelSub: 'Async 1v1 modu hazirlaniyor.',
    soon: 'Yakinda',
    activeBoost: 'Aktif boost',
    boostRemaining: 'kalan',
    startSpeed: 'Speed baslat',
    startTimed: 'Timed calistir',
    boss: 'Bu haftanin bossu',
    leaderboard: 'Dan salonu / aylik ilk 5',
    danLabel: 'Rutbe',
    nextRank: 'Sonraki',
    progress: 'Dan ilerlemesi'
  },
  en: {
    title: 'Meydan',
    sub: 'Competitive modes, fast runs, and dojo boss progress in one arena lobby.',
    speed: 'Speed Mode',
    speedSub: 'Fast correct chains with streak pressure.',
    timed: 'Timed Challenge',
    timedSub: 'Activate a 30 minute x2 hanabira boost.',
    dojo: 'Dojo Boss',
    dojoSub: 'Weekly shared boss progress.',
    duel: 'Duel',
    duelSub: 'Async 1v1 mode is being prepared.',
    soon: 'Soon',
    activeBoost: 'Active boost',
    boostRemaining: 'remaining',
    startSpeed: 'Start Speed',
    startTimed: 'Activate Timed',
    boss: "This week's boss",
    leaderboard: 'Dan hall / monthly top 5',
    danLabel: 'Rank',
    nextRank: 'Next',
    progress: 'Dan progress'
  }
} as const;

const formatMmSs = (ms: number): string => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

interface ArenaPortalContentProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  action: string;
  accent: string;
  locked?: boolean;
  children?: React.ReactNode;
}

const ArenaPortalContent: React.FC<ArenaPortalContentProps> = ({
  icon,
  title,
  subtitle,
  action,
  accent,
  locked = false,
  children
}) => (
  <div className="group relative h-full overflow-hidden rounded-[1.6rem] border border-[var(--kt-border-subtle)] px-5 py-5 text-left transition hover:-translate-y-0.5 hover:border-[color:var(--kt-brand)]">
    <div
      className="pointer-events-none absolute inset-x-5 top-0 h-1 rounded-full opacity-80"
      style={{ background: accent }}
    />
    <div className="flex items-start gap-4">
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
        style={{ background: accent }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-black uppercase tracking-[0.12em] text-[var(--kt-ink-strong)]">{title}</h3>
          {locked ? (
            <span className="rounded-full bg-[var(--kt-surface-muted)] px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
              {action}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--kt-ink-muted)]">{subtitle}</p>
      </div>
    </div>
    {children ? <div className="mt-4">{children}</div> : null}
    {!locked ? (
      <div className="mt-5 text-[11px] font-black uppercase tracking-[0.14em]" style={{ color: accent }}>
        {action}
      </div>
    ) : null}
  </div>
);

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
    <SceneShell variant="wide">
      <ScenePanel className="overflow-hidden">
        <SceneHeader
          eyebrow={language === 'tr' ? 'Arena Lobby' : 'Arena Lobby'}
          title={c.title}
          description={c.sub}
          glyph="競"
          stats={
            <>
              <div
                className="rounded-full px-4 py-2 text-sm font-black"
                style={{ background: 'var(--kt-dan-gold-soft)', color: 'var(--kt-dan-ink)' }}
              >
                {c.danLabel}: {dan.label}
              </div>
              <div className="rounded-full bg-[var(--kt-brand-soft)] px-4 py-2 text-sm font-black text-[var(--kt-brand)]">
                {Math.round(danProgress.percent)}% / {c.nextRank}: {danProgress.nextLabel}
              </div>
            </>
          }
        />

        {boost ? (
          <div
            className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-full px-4 py-3 text-sm"
            style={{ background: 'var(--kt-tomoshibi)', color: 'var(--kt-brand-on)' }}
          >
            <span className="font-black">
              x{boost.multiplier} {c.activeBoost}
            </span>
            <span className="font-bold tabular-nums">
              {formatMmSs(boost.expiresAt - Date.now())} {c.boostRemaining}
            </span>
          </div>
        ) : null}

        <div className="mt-6 border-y border-[var(--kt-border-subtle)] py-5">
          <RewardTrack
            percent={danProgress.percent}
            label={c.progress}
            description={`${feedbackState.hanabira} hanabira / ${streakDays} streak`}
            milestones={['Kyu', 'Focus', 'Dan', 'Master']}
          />
        </div>

        <div className="grid gap-4 pt-6 lg:grid-cols-2">
          <Link to={`${appShellRoutes.practiceKanaAnswerType}?script=${script}`} className="kt-tap-bounce block">
            <ArenaPortalContent
              icon={<Flame size={24} />}
              title={c.speed}
              subtitle={c.speedSub}
              action={c.startSpeed}
              accent="var(--kt-tomoshibi-strong)"
            />
          </Link>

          <button type="button" onClick={() => startTimedXpBoost(2, 30)} className="kt-tap-bounce block text-left">
            <ArenaPortalContent
              icon={<Timer size={24} />}
              title={c.timed}
              subtitle={c.timedSub}
              action={c.startTimed}
              accent="var(--kt-brand)"
            />
          </button>

          <ArenaPortalContent
            icon={<Swords size={24} />}
            title={c.dojo}
            subtitle={c.dojoSub}
            action={dojoBoss ? `${Math.round(dojoBoss.communityProgress * 100)}%` : c.soon}
            accent="var(--kt-accent-plum)"
          >
            {dojoBoss ? (
              <div>
                <div className="text-xs font-black uppercase tracking-[0.12em] text-[var(--kt-ink-muted)]">{c.boss}</div>
                <div className="mt-1 text-sm font-bold text-[var(--kt-ink-strong)]">{dojoBoss.name}</div>
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[var(--kt-progress-track)]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, dojoBoss.communityProgress * 100)}%`,
                      background: 'var(--kt-accent-plum)'
                    }}
                  />
                </div>
              </div>
            ) : null}
          </ArenaPortalContent>

          <ArenaPortalContent
            icon={<Users size={24} />}
            title={c.duel}
            subtitle={c.duelSub}
            action={c.soon}
            accent="var(--kt-accent-info)"
            locked
          />
        </div>

        <div className="grid gap-7 pt-7 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <DanHall title={c.leaderboard} entries={champions} />
          <aside className="border-t border-[var(--kt-border-subtle)] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-5">
            <div className="flex items-center gap-2 text-[var(--kt-dan-ink)]">
              <Trophy size={18} />
              <h2 className="text-sm font-black uppercase tracking-[0.14em]">{c.danLabel}</h2>
            </div>
            <div className="mt-4 text-4xl font-black text-[var(--kt-ink-strong)]">{dan.label}</div>
            <p className="mt-2 text-sm leading-6 text-[var(--kt-ink-muted)]">
              {Math.round(danProgress.percent)}% / {c.nextRank}: {danProgress.nextLabel}
            </p>
          </aside>
        </div>
      </ScenePanel>
    </SceneShell>
  );
};

export const consumeMeydanBoost = consumeXpMultiplier;
