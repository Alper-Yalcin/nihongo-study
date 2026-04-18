import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLanguage } from '../data/appPreferences';
import { appShellRoutes, getLearnUnitRoute } from '../data/appShellContent';
import { flattenLearnCourseUnits, getLearnCourseSections } from '../data/learnCourseContent';
import { useLearnCourseProgress } from '../hooks/useLearnCourseProgress';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { JumpHereButton } from '../components/path/JumpHereButton';
import { PathNode } from '../components/path/PathNode';
import { PathNodePopover } from '../components/path/PathNodePopover';
import { SectionBanner } from '../components/path/SectionBanner';

interface HomeProps {
  language: AppLanguage;
  activeScript: KanaScript;
}

const pathOffsetPattern = [0, 40, -30, 35, -20];

const pageCopy = {
  tr: {
    openUnit: 'Uniteyi ac',
    guideLabel: 'Rehber',
    activeLabel: 'Baslat',
    partLabel: (n: number) => `${n}. Kisim`,
    unitLabel: (n: number) => `${n}. Unite`,
    jumpLabel: 'Buraya atla!',
    nextSection: (title: string) => title,
  },
  en: {
    openUnit: 'Open unit',
    guideLabel: 'Guide',
    activeLabel: 'Start',
    partLabel: (n: number) => `Part ${n}`,
    unitLabel: (n: number) => `Unit ${n}`,
    jumpLabel: 'Jump here!',
    nextSection: (title: string) => title,
  },
} as const;

export const Home: React.FC<HomeProps> = ({ language, activeScript: _activeScript }) => {
  const navigate = useNavigate();
  const copy = pageCopy[language];
  const [previewUnitId, setPreviewUnitId] = useState<string | null>(null);
  const sections = useMemo(() => getLearnCourseSections(language), [language]);
  const units = useMemo(() => flattenLearnCourseUnits(sections), [sections]);
  const { currentUnitId, getUnitState } = useLearnCourseProgress(units.map((u) => u.id));

  const previewUnit = useMemo(
    () => units.find((u) => u.id === previewUnitId) ?? null,
    [previewUnitId, units]
  );

  return (
    <div className="mx-auto max-w-md pb-16">
      {sections.map((section, sectionIndex) => {
        const availableUnit =
          section.units.find((u) => getUnitState(u.id) !== 'locked') ?? null;
        const currentSectionUnit =
          section.units.find((u) => u.id === currentUnitId) ??
          section.units.find((u) => getUnitState(u.id) === 'active') ??
          section.units[0];

        return (
          <div key={section.id}>
            {/* Section divider between sections */}
            {sectionIndex > 0 && (
              <div className="flex items-center gap-3 py-6">
                <div className="h-px flex-1 bg-[var(--kt-border-subtle)]" />
                <span className="text-xs font-semibold text-[var(--kt-ink-subtle)]">
                  {section.title}
                </span>
                <div className="h-px flex-1 bg-[var(--kt-border-subtle)]" />
              </div>
            )}

            {/* Sticky section banner */}
            <div className="mb-6">
              <SectionBanner
                eyebrow={`← ${copy.partLabel(section.partNumber)}, ${copy.unitLabel(currentSectionUnit?.unitNumber ?? 1)}`}
                title={currentSectionUnit?.title ?? section.title}
                accentClassName={section.bannerClassName}
                guideLabel={copy.guideLabel}
              />
            </div>

            {/* Path nodes */}
            <div className="flex flex-col items-center gap-6">
              {availableUnit && sectionIndex > 0 && (
                <JumpHereButton
                  label={copy.jumpLabel}
                  onClick={() => setPreviewUnitId(availableUnit.id)}
                />
              )}

              {section.units.map((unit, unitIndex) => {
                const state = getUnitState(unit.id);
                const isPreviewOpen = previewUnit?.id === unit.id;

                return (
                  <div key={unit.id} className="flex w-full flex-col items-center gap-3">
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
                          : () => setPreviewUnitId(unit.id)
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
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
