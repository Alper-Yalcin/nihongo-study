import React from 'react';
import { Link } from 'react-router-dom';
import { AppLanguage } from '../data/appPreferences';
import { jlearnTrack } from '../data/jlearn/jlearnContent';
import { DebugPanel } from '../features/jlearn/debug/DebugPanel';

interface LearnJapanesePageProps {
  language: AppLanguage;
}

const copy = {
  tr: {
    eyebrow: 'Yeni Track',
    title: 'Japonca Ogren',
    intro: 'Sifirdan JLPT N5 ve N4 yolculuguna baslayan, gorev tabanli Japonca ogrenme izi.',
    levelHeader: 'Level',
    unitHeader: 'Unite',
    missionHeader: 'Gorev',
    checkpoint: 'Checkpoint',
    minutes: 'dk'
  },
  en: {
    eyebrow: 'New Track',
    title: 'Learn Japanese',
    intro: 'Mission-based path from zero to JLPT N5/N4.',
    levelHeader: 'Level',
    unitHeader: 'Unit',
    missionHeader: 'Mission',
    checkpoint: 'Checkpoint',
    minutes: 'min'
  }
} as const;

export const LearnJapanesePage: React.FC<LearnJapanesePageProps> = ({ language }) => {
  const t = copy[language];

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-8">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-[var(--kt-accent-info)]">
          {t.eyebrow}
        </span>
        <h1 className="mt-2 text-4xl font-black text-[var(--kt-ink-strong)]">{t.title}</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--kt-ink-muted)]">{t.intro}</p>
      </div>

      <div className="space-y-10">
        {jlearnTrack.levels.map((level) => (
          <section key={level.id} className="rounded-[1.4rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--kt-ink-muted)]">
                  {t.levelHeader} {level.id} · {level.jlptAlignment}
                </span>
                <h2 className="mt-1 text-2xl font-black text-[var(--kt-ink-strong)]">{level.title}</h2>
                <p className="mt-1 text-sm text-[var(--kt-ink-muted)]">{level.theme}</p>
              </div>
              {level.badge && (
                <span className="rounded-full border border-[var(--kt-border)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-accent-info)]">
                  {level.badge.name}
                </span>
              )}
            </div>

            <div className="mt-6 space-y-6">
              {level.units.map((unit) => (
                <div key={unit.id} className="rounded-[1.2rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-page)] p-5">
                  <div className="mb-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--kt-ink-muted)]">
                      {t.unitHeader} {unit.id}
                    </span>
                    <h3 className="mt-1 text-lg font-black text-[var(--kt-ink-strong)]">{unit.title}</h3>
                    <p className="mt-1 text-sm text-[var(--kt-ink-muted)]">{unit.summary}</p>
                  </div>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {unit.steps.map((step) => (
                      <li
                        key={step.id}
                        className="rounded-[1rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-3 text-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-black text-[var(--kt-ink-strong)]">{step.title}</span>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
                            {step.estimatedMinutes} {t.minutes}
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--kt-accent-info)]">
                          {step.isCheckpoint ? t.checkpoint : (step.kind ?? t.missionHeader)}
                        </div>
                        {step.goal && (
                          <p className="mt-2 text-xs leading-5 text-[var(--kt-ink-muted)]">{step.goal}</p>
                        )}
                        <div className="mt-2 text-[10px] font-mono text-[var(--kt-ink-muted)]">{step.id}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10">
        <Link
          to="/learn"
          className="text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-accent-info)] hover:underline"
        >
          ← /learn
        </Link>
      </div>

      <DebugPanel />
    </div>
  );
};

export default LearnJapanesePage;
