/**
 * OnboardingPage — yeni kullanıcı first 5 dk akışı.
 * 3 ekran intro + mini quiz (5 hiragana) → 5/5 → büyük flyUp + "10. kyū hoş geldin"
 *
 * Plan: bildirim izni soft prompt sadece bu noktada; ilk gün quest seed.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bell, Check, Sparkles } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { appShellRoutes } from '../data/appShellContent';
import {
  awardBonusHanabira,
  recordCorrect,
  recordWrong,
  startSession,
  endSession
} from '../shared/hooks/useFeedback';
import { markPracticedToday } from '../features/streak/tomoshibi';
import { playKoto, playShoji, unlockAudio } from '../shared/feedback/sounds';

const ONBOARDING_DONE_KEY = 'kototsuna.onboarding.done.v1';

interface OnboardingPageProps {
  language: AppLanguage;
}

const copyMap = {
  tr: {
    skip: 'Geç',
    next: 'Devam',
    intro1Title: 'Kototsuna\'ya hoş geldin',
    intro1Sub: 'Japonca sakura ritüeliyle. Her doğru cevap bir yaprak.',
    intro2Title: 'Tomoshibi 灯',
    intro2Sub: 'Mum gibi büyür. Her gün biraz daha parlak.',
    intro3Title: 'Dan rütbesi',
    intro3Sub: '10. kyū\'dan başlar, sabırla yükselir.',
    quizTitle: 'İlk 5 hiragana',
    quizSub: 'Hangi okunuşu doğru?',
    finalTitle: '10. kyū\'ya hoş geldin',
    finalSub: 'Tomoshibi\'n yandı. Şimdi pratiğe.',
    finalCta: 'Pratiğe başla',
    notifAsk: 'Günlük hatırlatma bildirim olsun mu?',
    notifAllow: 'İzin ver',
    notifLater: 'Şimdi değil'
  },
  en: {
    skip: 'Skip',
    next: 'Next',
    intro1Title: 'Welcome to Kototsuna',
    intro1Sub: 'Japanese, with a sakura ritual. Each correct answer is a petal.',
    intro2Title: 'Tomoshibi 灯',
    intro2Sub: 'Grows like a candle. Brighter each day.',
    intro3Title: 'Dan rank',
    intro3Sub: 'Starts at 10. kyū, rises with patience.',
    quizTitle: 'First 5 hiragana',
    quizSub: 'Which reading is right?',
    finalTitle: 'Welcome to 10. kyū',
    finalSub: 'Your tomoshibi is lit. Now to practice.',
    finalCta: 'Start practicing',
    notifAsk: 'Get daily reminders?',
    notifAllow: 'Allow',
    notifLater: 'Not now'
  }
} as const;

const QUIZ_ITEMS: { char: string; correct: string; choices: string[] }[] = [
  { char: 'あ', correct: 'a', choices: ['a', 'i', 'u', 'e'] },
  { char: 'い', correct: 'i', choices: ['o', 'i', 'a', 'u'] },
  { char: 'う', correct: 'u', choices: ['e', 'o', 'u', 'i'] },
  { char: 'え', correct: 'e', choices: ['e', 'a', 'u', 'i'] },
  { char: 'お', correct: 'o', choices: ['i', 'a', 'o', 'u'] }
];

export const isOnboardingDone = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.localStorage.getItem(ONBOARDING_DONE_KEY) === '1';
};

export const markOnboardingDone = (): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ONBOARDING_DONE_KEY, '1');
  } catch { /* yok say */ }
};

type Phase = 'intro1' | 'intro2' | 'intro3' | 'quiz' | 'final' | 'notif';

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ language }) => {
  const c = copyMap[language];
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('intro1');
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const item = QUIZ_ITEMS[quizIndex];

  useEffect(() => {
    // İlk pointerdown ile audio unlock zaten App tarafında — burada sadece preheat
  }, []);

  const advance = () => {
    if (phase === 'intro1') setPhase('intro2');
    else if (phase === 'intro2') setPhase('intro3');
    else if (phase === 'intro3') {
      startSession();
      setPhase('quiz');
    } else if (phase === 'final') {
      setPhase('notif');
    } else if (phase === 'notif') {
      complete();
    }
  };

  const complete = () => {
    markOnboardingDone();
    markPracticedToday();
    awardBonusHanabira(50); // welcome bonus
    navigate(`${appShellRoutes.practice}?script=hiragana`);
  };

  const skipQuiz = () => {
    endSession();
    setPhase('final');
  };

  const answer = (choice: string) => {
    unlockAudio();
    if (choice === item.correct) {
      recordCorrect();
      playShoji();
      setScore((s) => s + 1);
      setFeedback('correct');
    } else {
      recordWrong();
      setFeedback('wrong');
    }
    window.setTimeout(() => {
      setFeedback('idle');
      if (quizIndex + 1 >= QUIZ_ITEMS.length) {
        endSession();
        if (score + (choice === item.correct ? 1 : 0) === QUIZ_ITEMS.length) {
          // 5/5 — büyük flyUp
          awardBonusHanabira(100);
          playKoto();
        }
        setPhase('final');
      } else {
        setQuizIndex((i) => i + 1);
      }
    }, 350);
  };

  const askNotificationPermission = async () => {
    try {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        await Notification.requestPermission();
      }
    } catch { /* yok say */ }
    complete();
  };

  // === Render ===
  const wrapper = (children: React.ReactNode) => (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ background: 'var(--kt-surface-page)' }}>
      <div className="w-full max-w-md rounded-[1.6rem] border p-6 shadow-[var(--kt-shadow-lg)]"
        style={{ borderColor: 'var(--kt-border-subtle)', background: 'var(--kt-surface-raised)' }}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--kt-ink-subtle)]">
            Kototsuna
          </span>
          <button
            type="button"
            onClick={() => {
              endSession();
              markOnboardingDone();
              navigate(appShellRoutes.home);
            }}
            className="text-[11px] font-bold text-[var(--kt-ink-muted)] underline-offset-2 hover:underline"
          >
            {c.skip}
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );

  if (phase === 'intro1' || phase === 'intro2' || phase === 'intro3') {
    const txt = phase === 'intro1' ? { t: c.intro1Title, s: c.intro1Sub, emoji: '🌸' }
              : phase === 'intro2' ? { t: c.intro2Title, s: c.intro2Sub, emoji: '🕯️' }
              : { t: c.intro3Title, s: c.intro3Sub, emoji: '⛩️' };
    return wrapper(
      <div className="text-center">
        <div className="text-7xl">{txt.emoji}</div>
        <h2 className="mt-4 text-2xl font-black text-[var(--kt-ink-strong)]">{txt.t}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--kt-ink-muted)]">{txt.s}</p>
        <button
          type="button"
          onClick={advance}
          className="kt-tap-bounce mt-6 inline-flex items-center gap-2 rounded-[1rem] px-5 py-3 text-sm font-black uppercase tracking-[0.14em]"
          style={{ background: 'var(--kt-brand)', color: 'var(--kt-brand-on)' }}
        >
          {c.next} <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  if (phase === 'quiz') {
    return wrapper(
      <div>
        <div className="flex items-center justify-between text-[11px] font-bold tabular-nums text-[var(--kt-ink-muted)]">
          <span>{c.quizTitle}</span>
          <span>{quizIndex + 1}/{QUIZ_ITEMS.length} · {score} ✓</span>
        </div>
        <div
          className="mt-4 flex h-32 items-center justify-center rounded-[1rem]"
          style={{
            background: 'var(--kt-surface-muted)',
            border: feedback === 'correct'
              ? '2px solid var(--kt-accent-success)'
              : feedback === 'wrong'
                ? '2px solid var(--kt-accent-danger)'
                : '2px solid var(--kt-border)'
          }}
        >
          <span style={{ fontFamily: 'var(--font-jp-current, inherit)', fontSize: '5rem', color: 'var(--kt-ink-strong)' }}>
            {item.char}
          </span>
        </div>
        <p className="mt-3 text-center text-xs text-[var(--kt-ink-muted)]">{c.quizSub}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {item.choices.map((ch) => (
            <button
              key={ch}
              type="button"
              disabled={feedback !== 'idle'}
              onClick={() => answer(ch)}
              className="kt-tap-bounce rounded-[0.85rem] border-2 px-4 py-3 text-lg font-black uppercase transition disabled:opacity-50"
              style={{
                borderColor: 'var(--kt-border)',
                background: 'var(--kt-surface)',
                color: 'var(--kt-ink-strong)'
              }}
            >
              {ch}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={skipQuiz}
          className="mt-3 w-full text-center text-[11px] font-bold text-[var(--kt-ink-muted)] underline-offset-2 hover:underline"
        >
          {c.skip}
        </button>
      </div>
    );
  }

  if (phase === 'final') {
    return wrapper(
      <div className="text-center">
        <div className="text-7xl">⛩️</div>
        <h2 className="mt-4 text-2xl font-black text-[var(--kt-ink-strong)]">{c.finalTitle}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--kt-ink-muted)]">{c.finalSub}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black"
          style={{ background: 'var(--kt-hanabira-soft)', color: 'var(--kt-hanabira)' }}>
          <Sparkles size={14} /> +{score === QUIZ_ITEMS.length ? 150 : 50} 花
        </div>
        <button
          type="button"
          onClick={advance}
          className="kt-tap-bounce mt-6 inline-flex items-center gap-2 rounded-[1rem] px-5 py-3 text-sm font-black uppercase tracking-[0.14em]"
          style={{ background: 'var(--kt-brand)', color: 'var(--kt-brand-on)' }}
        >
          {c.next} <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  // notif
  return wrapper(
    <div className="text-center">
      <div className="flex items-center justify-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: 'var(--kt-tomoshibi)', color: '#fff' }}
        >
          <Bell size={26} />
        </div>
      </div>
      <h2 className="mt-4 text-xl font-black text-[var(--kt-ink-strong)]">{c.notifAsk}</h2>
      <div className="mt-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={askNotificationPermission}
          className="kt-tap-bounce rounded-[1rem] px-5 py-3 text-sm font-black uppercase tracking-[0.14em]"
          style={{ background: 'var(--kt-tomoshibi)', color: '#fff' }}
        >
          <Check size={14} className="mr-1 inline" /> {c.notifAllow}
        </button>
        <button
          type="button"
          onClick={complete}
          className="text-xs font-bold text-[var(--kt-ink-muted)] underline-offset-2 hover:underline"
        >
          {c.notifLater}
        </button>
      </div>
    </div>
  );
};

export const OnboardingGate: React.FC<{ language: AppLanguage }> = ({ language }) => {
  const [show, setShow] = useState<boolean>(false);
  useEffect(() => {
    setShow(!isOnboardingDone());
  }, []);
  if (!show) return null;
  return <OnboardingPage language={language} />;
};
