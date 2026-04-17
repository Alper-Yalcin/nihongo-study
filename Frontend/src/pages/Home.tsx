import React, { useMemo, useState } from 'react';
import { ArrowRight, BookOpenText, Languages, Layers3, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, StatCard } from '../shared/ui';
import { AppLanguage } from '../data/appPreferences';
import {
  appShellRoutes,
  getLearnUnitRoute
} from '../data/appShellContent';
import {
  flattenLearnCourseUnits,
  getLearnCourseSections
} from '../data/learnCourseContent';
import { useLearnCourseProgress } from '../hooks/useLearnCourseProgress';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { JumpHereButton } from '../components/path/JumpHereButton';
import { PathNode } from '../components/path/PathNode';
import { PathNodePopover } from '../components/path/PathNodePopover';
import { SectionBanner } from '../components/path/SectionBanner';
import { MascotFigure } from '../components/mascot/MascotFigure';
import { SpeechBubble } from '../components/mascot/SpeechBubble';
import { ProgressRing } from '../components/shared/ProgressRing';

interface HomeProps {
  language: AppLanguage;
  activeScript: KanaScript;
}

const pathOffsetPattern = [0, 18, -12, 16, -8];

const pageCopy = {
  tr: {
    eyebrow: 'Japonca kurs yolu',
    title: 'Ogren kismi artik unite tabanli',
    description:
      'Kelime, konu ve gramer akisi artik Harfler den tamamen ayrildi. Burasi artik gercek ders yolun.',
    currentUnit: 'Siradaki unite',
    openUnit: 'Uniteyi ac',
    lettersCta: 'Harfler tarafina gec',
    units: 'Unite',
    words: 'Kelime',
    grammar: 'Kalip',
    lettersTitle: 'Harfler artik ayri bir modul',
    lettersDescription:
      'Hiragana ve katakana hece/alfabe ogretimi Harfler sekmesine tasindi. Ogren tarafi artik dil yapilarina odakli.',
    pathTitle: 'Kurs yolu',
    pathDescription: 'Aktif dugume tikla ve unite detayina gir.',
    activeLabel: 'Baslat',
    openLabel: 'Detayi ac',
    partLabel: (partNumber: number) => `${partNumber}. Kisim`,
    unitLabel: (unitNumber: number) => `${unitNumber}. Unite`,
    jumpLabel: 'Buraya atla',
    lockedHint: 'Onceki unite tamamlanmadan acilmaz.',
    mascotMessage: 'Once harfleri, sonra yapilari. Bu ayrim artik net.'
  },
  en: {
    eyebrow: 'Japanese course path',
    title: 'Learn is now unit-based',
    description:
      'Vocabulary, topics, and grammar now live in a dedicated course flow separate from Letters.',
    currentUnit: 'Current unit',
    openUnit: 'Open unit',
    lettersCta: 'Open letters',
    units: 'Units',
    words: 'Words',
    grammar: 'Patterns',
    lettersTitle: 'Letters now lives in its own module',
    lettersDescription:
      'Hiragana and katakana syllable teaching moved into Letters. Learn now focuses on language structure.',
    pathTitle: 'Course path',
    pathDescription: 'Click the active node and open the unit detail.',
    activeLabel: 'Start',
    openLabel: 'Open detail',
    partLabel: (partNumber: number) => `Part ${partNumber}`,
    unitLabel: (unitNumber: number) => `Unit ${unitNumber}`,
    jumpLabel: 'Jump here',
    lockedHint: 'Finish the previous unit first.',
    mascotMessage: 'Letters first, structure second. The split is clean now.'
  }
} as const;

export const Home: React.FC<HomeProps> = ({ language, activeScript }) => {
  const navigate = useNavigate();
  const copy = pageCopy[language];
  const [previewUnitId, setPreviewUnitId] = useState<string | null>(null);
  const sections = useMemo(() => getLearnCourseSections(language), [language]);
  const units = useMemo(() => flattenLearnCourseUnits(sections), [sections]);
  const {
    completedCount,
    currentUnitId,
    getUnitState,
    progressPercent
  } = useLearnCourseProgress(units.map((unit) => unit.id));

  const currentUnit = useMemo(
    () => units.find((unit) => unit.id === currentUnitId) ?? units[0] ?? null,
    [currentUnitId, units]
  );

  const previewUnit = useMemo(
    () => units.find((unit) => unit.id === previewUnitId) ?? null,
    [previewUnitId, units]
  );

  const learnedWordCount = useMemo(
    () =>
      units
        .slice(0, completedCount)
        .reduce((total, unit) => total + unit.vocabulary.length, 0),
    [completedCount, units]
  );

  const grammarCount = currentUnit?.grammarFocus.length ?? 0;
  const lettersHref = `${appShellRoutes.letters}?script=${activeScript}`;

  return (
    <div className="space-y-8 pb-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)]">
        <div className="overflow-hidden rounded-[2rem] border border-[var(--kt-border)] bg-[linear-gradient(135deg,rgba(6,12,18,0.96)_0%,rgba(20,31,43,0.96)_48%,rgba(24,43,39,0.94)_100%)] p-7 shadow-[var(--kt-shadow-lg)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="rounded-full bg-[rgba(255,255,255,0.08)] px-4 py-2 text-sm font-black uppercase tracking-[0.14em] text-white/72">
              {copy.eyebrow}
            </div>
            <ProgressRing
              value={progressPercent}
              tone="success"
              label={<span className="text-xs font-black text-white">{`${progressPercent}%`}</span>}
            />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-center">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.16em] text-white/62">
                {copy.currentUnit}
              </div>
              <h1 className="mt-3 text-4xl font-black leading-tight text-white md:text-5xl">
                {currentUnit?.title ?? copy.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/74 md:text-lg">
                {currentUnit?.summary ?? copy.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {currentUnit && (
                  <Button
                    as="link"
                    to={getLearnUnitRoute(currentUnit.id)}
                    iconEnd={<ArrowRight size={16} />}
                  >
                    {copy.openUnit}
                  </Button>
                )}
                <Button as="link" to={lettersHref} variant="secondary">
                  {copy.lettersCta}
                </Button>
              </div>
            </div>

            <div className="justify-self-center">
              <MascotFigure
                pose={currentUnit?.mascotPose ?? 'wave'}
                tone={currentUnit?.tone ?? 'success'}
                size={168}
              />
            </div>
          </div>
        </div>

        <Card padding="lg" className="border-[var(--kt-border)] bg-[rgba(8,14,22,0.92)] text-white">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-white/52">
            {copy.lettersTitle}
          </div>
          <h2 className="mt-3 text-2xl font-black leading-tight text-white">{copy.title}</h2>
          <p className="mt-4 text-sm leading-7 text-white/70">{copy.lettersDescription}</p>
          <div className="mt-6">
            <SpeechBubble accent="success">{copy.mascotMessage}</SpeechBubble>
          </div>
          <div className="mt-6">
            <Button as="link" to={lettersHref} fullWidth>
              {copy.lettersCta}
            </Button>
          </div>
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <StatCard label={copy.units} value={`${completedCount}/${units.length}`} icon={<Layers3 size={18} />} />
        <StatCard label={copy.words} value={learnedWordCount} tone="info" icon={<Languages size={18} />} />
        <StatCard label={copy.grammar} value={grammarCount} tone="success" icon={<BookOpenText size={18} />} />
      </section>

      <Card padding="lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--kt-ink-subtle)]">
              {copy.pathTitle}
            </div>
            <h2 className="mt-2 text-3xl font-black text-[var(--kt-ink-strong)]">{copy.pathDescription}</h2>
          </div>
          {currentUnit && (
            <Button
              as="button"
              type="button"
              variant="secondary"
              onClick={() => setPreviewUnitId(currentUnit.id)}
              iconStart={<Sparkles size={16} />}
            >
              {copy.openLabel}
            </Button>
          )}
        </div>
      </Card>

      <div className="space-y-16">
        {sections.map((section) => {
          const availableUnit = section.units.find((unit) => getUnitState(unit.id) !== 'locked') ?? null;

          return (
            <section key={section.id} className="space-y-10">
              <SectionBanner
                eyebrow={copy.partLabel(section.partNumber)}
                title={`${section.title} - ${section.description}`}
                accentClassName={section.bannerClassName}
                guideLabel={copy.openUnit}
              />

              <div className="flex flex-col items-center gap-10 pt-4">
                {availableUnit && section.partNumber > 1 && (
                  <JumpHereButton
                    label={copy.jumpLabel}
                    onClick={() => setPreviewUnitId(availableUnit.id)}
                  />
                )}

                {section.units.map((unit, unitIndex) => {
                  const state = getUnitState(unit.id);
                  const isPreviewOpen = previewUnit?.id === unit.id;

                  return (
                    <div key={unit.id} className="flex w-full flex-col items-center gap-4">
                      <PathNode
                        title={unit.title}
                        subtitle={copy.unitLabel(unit.unitNumber)}
                        glyph={String(unit.unitNumber)}
                        state={state}
                        accent={unit.accentGlow}
                        offset={pathOffsetPattern[unitIndex % pathOffsetPattern.length]}
                        activeLabel={state === 'active' ? copy.activeLabel : undefined}
                        onClick={
                          state === 'locked'
                            ? undefined
                            : () => {
                                setPreviewUnitId(unit.id);
                              }
                        }
                      />

                      {isPreviewOpen && (
                        <PathNodePopover
                          title={unit.title}
                          description={unit.summary}
                          actionLabel={copy.openUnit}
                          secondaryLabel={copy.partLabel(unit.partNumber)}
                          onClose={() => setPreviewUnitId(null)}
                          onStart={() => navigate(getLearnUnitRoute(unit.id))}
                        />
                      )}

                      {state === 'locked' && (
                        <div className="w-full max-w-xl rounded-[1.3rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[var(--kt-ink-subtle)]">
                          {copy.lockedHint}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
