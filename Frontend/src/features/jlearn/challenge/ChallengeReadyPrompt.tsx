import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLanguage } from '../../../data/appPreferences';
import { appShellRoutes } from '../../../data/appShellContent';
import { jlearnTrack } from '../../../data/jlearn/jlearnContent';
import { readProgress } from '../../../data/jlearn/jlearnStorage';
import {
  getJLearnFeatureFlags,
  getJLearnUserState,
  subscribeJLearnUserState,
} from '../debug/debugStore';
import { getReadyChallengeCtas } from './challengeReadiness';

interface ChallengeReadyPromptProps {
  language: AppLanguage;
}

const copy = {
  tr: {
    eyebrow: 'Challenge hazir',
    title: 'Bir bonus gorev acildi',
    body: 'Guven seviyesi yuksek ve checkpoint tamam. Istersen challenge kartini world-map uzerinden kontrol et.',
    action: 'Haritada goster',
    dismiss: 'Sonra',
  },
  en: {
    eyebrow: 'Challenge ready',
    title: 'A bonus mission opened',
    body: 'Confidence is high and the checkpoint is complete. Review the challenge card on the world map when you are ready.',
    action: 'Show on map',
    dismiss: 'Later',
  },
} as const;

const dismissedKeyFor = (challengeId: string): string =>
  `kototsuna.jlearn.challenge-ready-prompt.dismissed.${challengeId}`;

const isDismissed = (challengeId: string): boolean => {
  if (typeof window === 'undefined') return true;
  return window.localStorage.getItem(dismissedKeyFor(challengeId)) === '1';
};

const dismissChallengePrompt = (challengeId: string): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(dismissedKeyFor(challengeId), '1');
};

export const ChallengeReadyPrompt: React.FC<ChallengeReadyPromptProps> = ({ language }) => {
  const t = copy[language];
  const [progress, setProgress] = useState(() => readProgress());
  const [userState, setUserState] = useState(() => getJLearnUserState());
  const [featureFlags, setFeatureFlags] = useState(() => getJLearnFeatureFlags());
  const [dismissedChallengeId, setDismissedChallengeId] = useState<string | null>(null);

  useEffect(
    () =>
      subscribeJLearnUserState(() => {
        setProgress(readProgress());
        setUserState(getJLearnUserState());
        setFeatureFlags(getJLearnFeatureFlags());
      }),
    []
  );

  const challenge = useMemo(
    () => getReadyChallengeCtas(jlearnTrack, progress, userState, featureFlags)[0] ?? null,
    [featureFlags, progress, userState]
  );

  if (!challenge || dismissedChallengeId === challenge.challengeId || isDismissed(challenge.challengeId)) {
    return null;
  }

  return (
    <aside className="fixed bottom-5 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 overflow-hidden rounded-[1.5rem] border-2 border-[var(--kt-accent-warning)] bg-[linear-gradient(135deg,var(--kt-surface-raised),var(--kt-surface))] p-4 shadow-[0_0_0_1px_var(--kt-accent-warning),0_22px_55px_rgba(245,158,11,0.26)] sm:left-auto sm:right-5 sm:translate-x-0">
      <div className="absolute right-4 top-4 h-14 w-14 animate-pulse rounded-full bg-[var(--kt-accent-warning-soft)]" />
      <div className="relative">
        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--kt-accent-warning)]">
          {t.eyebrow} / {challenge.levelId}
        </div>
        <h2 className="mt-1 text-lg font-black text-[var(--kt-ink-strong)]">{t.title}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--kt-ink-muted)]">
          {challenge.title}: {t.body}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link
            to={appShellRoutes.learnJapanese}
            className="rounded-full bg-[var(--kt-accent-warning)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-[var(--kt-shadow-sm)] transition hover:brightness-105"
          >
            {t.action}
          </Link>
          <button
            type="button"
            onClick={() => {
              dismissChallengePrompt(challenge.challengeId);
              setDismissedChallengeId(challenge.challengeId);
            }}
            className="rounded-full border border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)] transition hover:bg-[var(--kt-nav-item-hover)]"
          >
            {t.dismiss}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ChallengeReadyPrompt;
