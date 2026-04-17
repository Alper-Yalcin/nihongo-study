import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Button, Card, StatCard } from '../shared/ui';
import { AppLanguage } from '../data/appPreferences';
import { appShellRoutes, getKanaItemRoute } from '../data/appShellContent';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../data/studyContent';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { CharacterCell } from '../components/letters/CharacterCell';

interface LettersPageProps {
  language: AppLanguage;
}

export const LettersPage: React.FC<LettersPageProps> = ({ language }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedScript = searchParams.get('script');
  const script: KanaScript = requestedScript === 'katakana' ? 'katakana' : 'hiragana';
  const sections = useMemo(
    () => (script === 'hiragana' ? getLocalizedHiraganaSections(language) : getLocalizedKatakanaSections(language)),
    [language, script]
  );
  const { getProgress, summaries } = useKanaProgressStore();
  const summary = summaries[script];
  const characters = useMemo(
    () =>
      Array.from(
        new Map(
          sections.flatMap((section) =>
            section.groups.flatMap((group) => group.characters.map((character) => [character.id, character]))
          )
        ).values()
      ),
    [sections]
  );

  return (
    <div className="space-y-8 pb-8">
      <section className="rounded-[2rem] border border-[var(--kt-border)] bg-[rgba(8,14,22,0.88)] p-7 shadow-[var(--kt-shadow-lg)]">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex rounded-full border border-[var(--kt-border)] bg-[rgba(255,255,255,0.04)] p-1">
            {(['hiragana', 'katakana'] as KanaScript[]).map((tabScript) => {
              const isActive = script === tabScript;
              return (
                <button
                  key={tabScript}
                  type="button"
                  onClick={() => setSearchParams({ script: tabScript })}
                  className={`rounded-full px-6 py-2 text-sm font-black uppercase tracking-[0.14em] transition ${
                    isActive
                      ? 'bg-[var(--kt-accent-info)] text-[var(--kt-brand-on)]'
                      : 'text-[var(--kt-ink-subtle)] hover:text-[var(--kt-ink)]'
                  }`}
                >
                  {tabScript === 'hiragana' ? 'Hiragana' : 'Katakana'}
                </button>
              );
            })}
          </div>
          <h1 className="mt-8 text-5xl font-black text-white">
            {script === 'hiragana' ? "Hiragana'yi ogrenelim!" : "Katakana'yi ogrenelim!"}
          </h1>
          <p className="mt-4 text-lg text-white/72">
            {language === 'tr'
              ? 'Karakter tablosunu once vitrinde gor, sonra tek tek item detayina veya ogrenme yoluna dal.'
              : 'See the full character table first, then jump into item detail or the learning path.'}
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              as="link"
              to={script === 'hiragana' ? appShellRoutes.hiraganaLearn : appShellRoutes.katakanaLearn}
              iconEnd={<ArrowRight size={16} />}
            >
              {language === 'tr' ? 'Karakterleri ogren' : 'Learn the characters'}
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <StatCard label="Tracked" value={summary.tracked} />
        <StatCard label="Due" value={summary.dueCount} tone="warning" />
        <StatCard label="Mastered" value={summary.masteredCount} tone="success" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {characters.map((character) => {
          const progress = getProgress(character.id);
          const masteryValue = progress ? Math.round((progress.masteryScore / 4) * 100) : 0;

          return (
            <CharacterCell
              key={character.id}
              id={character.id}
              char={character.symbol}
              romaji={character.label}
              href={getKanaItemRoute(script, character.id)}
              masteryValue={masteryValue}
              tracked={Boolean(progress && progress.timesSeen > 0)}
              mastered={progress?.state === 'mastered'}
            />
          );
        })}
      </section>

      <Card padding="lg">
        <h2 className="text-2xl font-black text-[var(--kt-ink-strong)]">
          {language === 'tr' ? 'Neden bu tablo burada?' : 'Why this table here?'}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--kt-ink-muted)]">
          {language === 'tr'
            ? 'Eski daginik script sayfalari yerine artik harfler tek bir merkezde. Sol navdaki HARFLER sekmesi de dogrudan bu ekranı aciyor.'
            : 'Instead of separate scattered script pages, letters now live in one clear hub. The LETTERS item in the left nav opens this screen directly.'}
        </p>
      </Card>
    </div>
  );
};
