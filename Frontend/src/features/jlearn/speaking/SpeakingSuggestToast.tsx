import React, { useEffect, useState } from 'react';
import { AppLanguage } from '../../../data/appPreferences';
import {
  getJLearnFeatureFlags,
  getJLearnUserState,
  subscribeJLearnUserState,
} from '../debug/debugStore';

interface SpeakingSuggestToastProps {
  language: AppLanguage;
}

const SPEAKING_TOAST_DISMISSED_KEY = 'kototsuna.jlearn.speaking-suggest-dismissed.v1';
const HIGH_CONFIDENCE_CLEAR_THRESHOLD = 3;

const copy = {
  tr: {
    eyebrow: 'Konuşma modu',
    title: 'Sesli pratik yakında geliyor',
    body: 'Üst üste 3 high-confidence clear tamamladınız. Konuşma modu hazır olduğunda burada göreceksiniz.',
    dismiss: 'Tamam',
  },
  en: {
    eyebrow: 'Speaking mode',
    title: 'Audio practice is coming',
    body: 'You cleared 3 high-confidence levels in a row. When speaking mode is ready, you will see it here first.',
    dismiss: 'Got it',
  },
} as const;

export const SpeakingSuggestToast: React.FC<SpeakingSuggestToastProps> = ({ language }) => {
  const t = copy[language];
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => {
      if (typeof window === 'undefined') return;
      const dismissed = window.localStorage.getItem(SPEAKING_TOAST_DISMISSED_KEY) === '1';
      if (dismissed) { setShow(false); return; }

      const flags = getJLearnFeatureFlags();
      if (flags.speakingMode) { setShow(false); return; }

      const state = getJLearnUserState();
      setShow(state.highConfidenceClearCount >= HIGH_CONFIDENCE_CLEAR_THRESHOLD);
    };

    check();
    return subscribeJLearnUserState(check);
  }, []);

  if (!show) return null;

  const dismiss = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SPEAKING_TOAST_DISMISSED_KEY, '1');
    }
    setShow(false);
  };

  return (
    <aside className="fixed bottom-5 right-5 z-[9997] w-[calc(100%-2.5rem)] max-w-sm overflow-hidden rounded-[1.5rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-4 shadow-[var(--kt-shadow-lg)]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-[var(--kt-border)] bg-[var(--kt-surface)] text-lg">
          🎙️
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--kt-accent-info)]">
            {t.eyebrow}
          </div>
          <div className="mt-0.5 text-sm font-black text-[var(--kt-ink-strong)]">{t.title}</div>
          <p className="mt-1 text-xs leading-5 text-[var(--kt-ink-muted)]">{t.body}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full border border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)] transition hover:bg-[var(--kt-nav-item-hover)]"
        >
          {t.dismiss}
        </button>
      </div>
    </aside>
  );
};

export default SpeakingSuggestToast;
