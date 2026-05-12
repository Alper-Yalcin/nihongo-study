import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { LearnedWord, LessonResult, NpcCharacter } from '../lessonTypes';
import { LearnFallingFlowers } from '../../../components/learn/LearnFallingFlowers';
import type { ThemeMode } from '../../../data/appPreferences';
import { markPracticedToday, getHeatGrid } from '../../streak/tomoshibi';

interface Props {
  result: LessonResult;
  themeMode: ThemeMode;
  learnedWords: LearnedWord[];
  npc?: NpcCharacter;
}

type Tier = 'Mükemmel' | 'İyi' | 'Gelişiyor';

function getTier(score: number): Tier {
  if (score >= 75) return 'Mükemmel';
  if (score >= 45) return 'İyi';
  return 'Gelişiyor';
}

const TIER_STYLE: Record<Tier, string> = {
  'Mükemmel': 'bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)]',
  'İyi': 'bg-[var(--kt-accent-info-soft)] text-[var(--kt-accent-info)]',
  'Gelişiyor': 'bg-[var(--kt-surface-muted)] text-[var(--kt-ink-muted)]',
};

function computeCurrentStreak(): number {
  const grid = getHeatGrid(60);
  let streak = 0;
  for (let i = grid.length - 1; i >= 0; i--) {
    if (grid[i].active) {
      streak++;
    } else if (i === grid.length - 1) {
      continue;
    } else {
      break;
    }
  }
  return streak;
}

function useCountUp(target: number, durationMs = 1200): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / durationMs, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, durationMs]);
  return value;
}

export const LessonComplete: React.FC<Props> = ({ result, themeMode, learnedWords, npc }) => {
  const navigate = useNavigate();
  const xp = useCountUp(result.xpEarned, 1200);
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    markPracticedToday();
    setStreakDays(computeCurrentStreak());
  }, []);

  const accuracy =
    result.totalExercises > 0
      ? Math.round((result.correctFirstTry / result.totalExercises) * 100)
      : 0;

  const starCount = accuracy >= 90 ? 3 : accuracy >= 60 ? 2 : 1;

  const skills: Array<{ label: string; score: number }> = [
    { label: 'Listening', score: result.confidenceScores.listening },
    { label: 'Kana', score: result.confidenceScores.kana },
    { label: 'Production', score: result.confidenceScores.production },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden px-5 py-10 text-[var(--kt-ink)]">
      <LearnFallingFlowers themeMode={themeMode} />

      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center gap-5 text-center">

        {/* NPC closing message — floating, no heavy card */}
        {npc && (
          <div className="flex items-center gap-3">
            <span className="text-4xl leading-none">{npc.emoji}</span>
            <div className="text-left">
              <p className="font-jp text-lg font-black text-[var(--kt-brand)]">
                {accuracy >= 75 ? 'すごい！' : 'いいね！'}
              </p>
              <p className="text-sm font-bold text-[var(--kt-ink-muted)]">
                {accuracy >= 75
                  ? `${npc.name} bugünkü dersten çok memnun!`
                  : `${npc.name}: Devam et, her seferinde daha iyi!`}
              </p>
            </div>
          </div>
        )}

        {/* Hero: XP + stars + streak in one compact row */}
        <div className="flex items-center gap-4">
          {/* XP badge */}
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[var(--kt-brand)] shadow-[0_0_40px_color-mix(in_srgb,var(--kt-brand)_40%,transparent)]">
            <div className="text-2xl font-black text-[var(--kt-brand-on)]">+{xp}</div>
            <div className="text-[0.6rem] font-black uppercase tracking-widest text-[var(--kt-brand-on)] opacity-75">
              XP
            </div>
          </div>

          <div className="text-left">
            <h1 className="text-2xl font-black text-[var(--kt-ink-strong)]">Ders Bitti!</h1>
            <p className="mt-0.5 text-sm font-bold text-[var(--kt-ink-muted)]">
              %{accuracy} doğruluk
            </p>

            {/* Stars */}
            <div className="mt-1.5 flex items-center gap-1">
              {[1, 2, 3].map((i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i <= starCount
                      ? 'fill-[var(--kt-brand)] text-[var(--kt-brand)]'
                      : 'text-[var(--kt-border)]'
                  }
                />
              ))}
            </div>

            {/* Streak */}
            {streakDays > 0 && (
              <p className="mt-1.5 text-xs font-black text-[var(--kt-ink-subtle)]">
                🔥 {streakDays} günlük seri
              </p>
            )}
          </div>
        </div>

        {/* Skill badges — compact horizontal row */}
        <div className="flex w-full flex-wrap justify-center gap-2">
          {skills.map((skill) => {
            const tier = getTier(skill.score);
            return (
              <div key={skill.label} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${TIER_STYLE[tier]}`}>
                <span className="text-xs font-black">{skill.label}</span>
                <span className="text-[0.65rem] font-bold opacity-75">{tier}</span>
              </div>
            );
          })}
        </div>

        {/* Learned words — lighter list */}
        {learnedWords.length > 0 && (
          <div className="w-full">
            <p className="mb-2 text-left text-[0.65rem] font-black uppercase tracking-widest text-[var(--kt-ink-subtle)]">
              Bu derste öğrendiklerin
            </p>
            <div className="rounded-[1.1rem] bg-[var(--kt-surface)] px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <div className="divide-y divide-[var(--kt-border)]">
                {learnedWords.map((word) => (
                  <div key={word.japanese} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm text-[var(--kt-accent-success)]">✓</span>
                      <span className="font-jp text-lg font-black text-[var(--kt-ink-strong)]">
                        {word.japanese}
                      </span>
                      <span className="text-[0.65rem] font-bold text-[var(--kt-ink-subtle)]">
                        {word.romaji}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[var(--kt-ink-muted)]">
                      {word.meaning}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="w-full rounded-[0.95rem] bg-[var(--kt-brand)] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-brand-on)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-brand)_76%,black)] transition hover:opacity-90"
        >
          Haritaya Dön →
        </button>
      </div>
    </div>
  );
};
