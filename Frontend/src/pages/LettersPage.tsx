import React, { useMemo } from 'react';
import { ArrowRight, Languages, PenTool, Volume2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Button, Card, StatCard } from '../shared/ui';
import { AppLanguage } from '../data/appPreferences';
import { appShellRoutes, getKanaItemRoute, getPracticeRoute } from '../data/appShellContent';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../data/studyContent';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { CharacterCell } from '../components/letters/CharacterCell';

interface LettersPageProps {
  language: AppLanguage;
}

const pageCopy = {
  tr: {
    title: {
      hiragana: "Hiragana hecelerini ogren",
      katakana: "Katakana hecelerini ogren"
    },
    description:
      'Bu alan sadece alfabe/hece ogretimi icin. Satirlari, benzer formlari ve temel ses eslesmelerini burada oturt.',
    roadmapCta: 'Hece yolunu ac',
    practiceCta: 'Harf pratigi ac',
    groupsTitle: 'Satirlar ve hece bloklari',
    gridTitle: 'Tum karakter tablosu',
    roadmapLabel: 'Yol',
    writingLabel: 'Yazim',
    listeningLabel: 'Ses',
    whyTitle: 'Harfler neden ayri?',
    whyDescription:
      'Cunku burada gorev karakterleri, heceleri ve alfabe mantigini oturtmak. Kelime, konu ve gramer akisi ise artik Ogren tarafinda.'
  },
  en: {
    title: {
      hiragana: 'Learn hiragana syllables',
      katakana: 'Learn katakana syllables'
    },
    description:
      'This area is only for alphabet and syllable teaching. Use it to lock in rows, similar shapes, and core sound mapping.',
    roadmapCta: 'Open syllable path',
    practiceCta: 'Open letter practice',
    groupsTitle: 'Rows and syllable blocks',
    gridTitle: 'Full character table',
    roadmapLabel: 'Path',
    writingLabel: 'Writing',
    listeningLabel: 'Audio',
    whyTitle: 'Why Letters is separate',
    whyDescription:
      'Because this area is for characters, syllables, and alphabet logic. Vocabulary, topics, and grammar now live under Learn.'
  }
} as const;

export const LettersPage: React.FC<LettersPageProps> = ({ language }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedScript = searchParams.get('script');
  const script: KanaScript = requestedScript === 'katakana' ? 'katakana' : 'hiragana';
  const copy = pageCopy[language];
  const sections = useMemo(
    () => (script === 'hiragana' ? getLocalizedHiraganaSections(language) : getLocalizedKatakanaSections(language)),
    [language, script]
  );
  const { getProgress, summaries } = useKanaProgressStore();
  const summary = summaries[script];
  const groups = useMemo(
    () => sections.flatMap((section) => section.groups.map((group) => ({ ...group, sectionTitle: section.title }))),
    [sections]
  );
  const characters = useMemo(
    () =>
      Array.from(
        new Map(
          groups.flatMap((group) => group.characters.map((character) => [character.id, character]))
        ).values()
      ),
    [groups]
  );
  const roadmapHref = script === 'hiragana' ? appShellRoutes.hiraganaLearn : appShellRoutes.katakanaLearn;

  return (
    <div className="space-y-8 pb-8">
      <section className="rounded-[2rem] border border-[var(--kt-border)] bg-[rgba(8,14,22,0.88)] p-7 shadow-[var(--kt-shadow-lg)]">
        <div className="mx-auto max-w-5xl text-center">
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
          <h1 className="mt-8 text-5xl font-black text-white">{copy.title[script]}</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-white/72">{copy.description}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button as="link" to={roadmapHref} iconEnd={<ArrowRight size={16} />}>
              {copy.roadmapCta}
            </Button>
            <Button as="link" to={getPracticeRoute(script)} variant="secondary">
              {copy.practiceCta}
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <StatCard label="Tracked" value={summary.tracked} icon={<Languages size={18} />} />
        <StatCard label="Due" value={summary.dueCount} tone="warning" icon={<Volume2 size={18} />} />
        <StatCard label="Mastered" value={summary.masteredCount} tone="success" icon={<PenTool size={18} />} />
      </section>

      <section className="space-y-4">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--kt-ink-subtle)]">
            {copy.groupsTitle}
          </div>
          <h2 className="mt-2 text-3xl font-black text-[var(--kt-ink-strong)]">{script === 'hiragana' ? 'Gojuon akisi' : 'Katakana satirlari'}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <Card key={`${group.sectionTitle}-${group.id}`} padding="lg">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-[var(--kt-ink-subtle)]">
                    {group.sectionTitle}
                  </div>
                  <h3 className="mt-2 text-2xl font-black text-[var(--kt-ink-strong)]">{group.label}</h3>
                </div>
                <span className="rounded-full bg-[var(--kt-brand-soft)] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-brand)]">
                  {`${group.characters.length} hece`}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {group.characters.map((character) => (
                  <span
                    key={character.id}
                    className="rounded-[0.9rem] border border-[var(--kt-border)] bg-[var(--kt-surface-muted)] px-3 py-2 text-sm font-bold text-[var(--kt-ink-strong)]"
                  >
                    {`${character.symbol} / ${character.label}`}
                  </span>
                ))}
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                <div className="rounded-[1rem] bg-[var(--kt-surface-muted)] px-3 py-3 text-center text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
                  {copy.roadmapLabel}
                </div>
                <div className="rounded-[1rem] bg-[var(--kt-surface-muted)] px-3 py-3 text-center text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
                  {copy.writingLabel}
                </div>
                <div className="rounded-[1rem] bg-[var(--kt-surface-muted)] px-3 py-3 text-center text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
                  {copy.listeningLabel}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--kt-ink-subtle)]">
            {copy.gridTitle}
          </div>
          <h2 className="mt-2 text-3xl font-black text-[var(--kt-ink-strong)]">
            {script === 'hiragana' ? 'Hiragana karakter katalgu' : 'Katakana karakter katalgu'}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
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
        </div>
      </section>

      <Card padding="lg">
        <h2 className="text-2xl font-black text-[var(--kt-ink-strong)]">{copy.whyTitle}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--kt-ink-muted)]">{copy.whyDescription}</p>
      </Card>
    </div>
  );
};
