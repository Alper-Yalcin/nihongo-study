import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Star } from 'lucide-react';
import type { LearnedWord, LessonResult, NpcCharacter } from '../lessonTypes';
import { LearnFallingFlowers } from '../../../components/learn/LearnFallingFlowers';
import type { ThemeMode } from '../../../data/appPreferences';
import { markPracticedToday } from '../../streak/tomoshibi';
import { getHeatGrid } from '../../streak/tomoshibi';

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

const TIER_COLORS: Record<Tier, string> = {
  'Mükemmel': 'text-[var(--kt-accent-success)]',
  'İyi': 'text-[var(--kt-accent-info)]',
  'Gelişiyor': 'text-[var(--kt-brand)]',
};

const TIER_BG: Record<Tier, string> = {
  'Mükemmel': 'bg-[var(--kt-accent-success-soft)]',
  'İyi': 'bg-[var(--kt-accent-info-soft)]',
  'Gelişiyor': 'bg-[var(--kt-surface-muted)]',
};

function computeCurrentStreak(): number {
  const grid = getHeatGrid(60);
  let streak = 0;
  for (let i = grid.length - 1; i >= 0; i--) {
    if (grid[i].active) {
      streak++;
    } else if (i === grid.length - 1) {
      // today not yet practiced — start counting from yesterday
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

export const LessonComplete: React.FC<Props> = ({
  result,
  themeMode,
  learnedWords,
  npc,
}) => {
  const navigate = useNavigate();
  const xp = useCountUp(result.xpEarned, 1200);
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    markPracticedToday();
    setStreakDays(computeCurrentStreak());
  }, []);

  const accuracy = result.totalExercises > 0
    ? Math.round((result.correctFirstTry / result.totalExercises) * 100)
    : 0;

  const skills: Array<{ label: string; score: number }> = [
    { label: 'Listening', score: result.confidenceScores.listening },
    { label: 'Kana Recall', score: result.confidenceScores.kana },
    { label: 'Production', score: result.confidenceScores.production },
  ];

  const starCount = accuracy >= 90 ? 3 : accuracy >= 60 ? 2 : 1;

  return (
    <div className="relative min-h-screen overflow-hidden px-5 py-8 text-[var(--kt-ink)]">
      <LearnFallingFlowers themeMode={themeMode} />

      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-lg flex-col items-center justify-center gap-6 text-center">

        {/* NPC closing message */}
        {npc && (
          <div className="flex items-center gap-3 rounded-[1.3rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-5 py-4 shadow-[var(--kt-shadow-sm)] text-left">
            <span className="shrink-0 text-4xl leading-none">{npc.emoji}</span>
            <div>
              <p className="font-jp text-base font-black text-[var(--kt-brand)]">
                {accuracy >= 75 ? 'すごい！' : 'いいね！'}
              </p>
              <p className="text-sm font-bold text-[var(--kt-ink-muted)]">
                {accuracy >= 75
                  ? `${npc.name} bugünkü dersten çok memnun!`
                  : `${npc.name}: Devam et, her seferinde daha iyi olacaksın!`}
              </p>
            </div>
          </div>
        )}

        {/* XP badge */}
        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-[var(--kt-brand)] shadow-[0_0_48px_color-mix(in_srgb,var(--kt-brand)_45%,transparent)]">
          <div className="text-3xl font-black text-[var(--kt-brand-on)]">+{xp}</div>
          <div className="text-xs font-black uppercase tracking-widest text-[var(--kt-brand-on)] opacity-75">XP</div>
        </div>

        <div>
          <h1 className="text-4xl font-black text-[var(--kt-ink-strong)]">Ders Tamamlandı!</h1>
          <p className="mt-1.5 text-sm font-bold text-[var(--kt-ink-muted)]">
            İlk denemede %{accuracy} doğruluk
          </p>
        </div>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <Star
              key={i}
              size={32}
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
          <div className="flex items-center gap-2 rounded-[1rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-5 py-3 shadow-[var(--kt-shadow-sm)]">
            <Flame size={20} className="text-[var(--kt-brand)]" />
            <span className="text-sm font-black text-[var(--kt-ink-strong)]">
              {streakDays} günlük seri
            </span>
          </div>
        )}

        {/* Skill mastery breakdown */}
        <div className="w-full rounded-[1.3rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] p-5 shadow-[var(--kt-shadow-md)]">
          <p className="mb-4 text-left text-xs font-black uppercase tracking-wider text-[var(--kt-ink-muted)]">
            Beceri Performansı
          </p>
          <div className="space-y-3">
            {skills.map((skill) => {
              const tier = getTier(skill.score);
              return (
                <div key={skill.label} className="flex items-center justify-between gap-4">
                  <span className="shrink-0 text-sm font-black text-[var(--kt-ink-strong)]">
                    {skill.label}
                  </span>
                  <div className="flex flex-1 items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--kt-surface-muted)]">
                      <div
                        className="h-full rounded-full bg-[var(--kt-brand)] transition-all duration-700"
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-black ${TIER_COLORS[tier]} ${TIER_BG[tier]}`}>
                      {tier}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Learned words list */}
        {learnedWords.length > 0 && (
          <div className="w-full rounded-[1.3rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] p-5 shadow-[var(--kt-shadow-md)]">
            <p className="mb-3 text-left text-xs font-black uppercase tracking-wider text-[var(--kt-ink-muted)]">
              Bu Derste Öğrendiklerin
            </p>
            <div className="space-y-2">
              {learnedWords.map((word) => (
                <div
                  key={word.japanese}
                  className="flex items-center justify-between rounded-[0.75rem] bg-[var(--kt-surface-muted)] px-4 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--kt-accent-success)]">✓</span>
                    <div>
                      <span className="font-jp text-lg font-black text-[var(--kt-ink-strong)]">
                        {word.japanese}
                      </span>
                      <span className="ml-2 text-xs font-bold text-[var(--kt-ink-subtle)]">
                        {word.romaji}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[var(--kt-ink-muted)]">
                    {word.meaning}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="grid w-full gap-3">
          <button
            type="button"
            onClick={() => navigate('/learn')}
            className="rounded-[0.95rem] bg-[var(--kt-brand)] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-brand-on)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-brand)_76%,black)]"
          >
            Haritaya Dön →
          </button>
        </div>

      </div>
    </div>
  );
};
