import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import {
  ScriptAccentTone,
  ScriptOverviewDetailSection,
  scriptLandingContent
} from '../content/scriptLandingContent';
import { OverviewDemoFrame } from './overview/OverviewDemoFrame';

interface Props {
  language: AppLanguage;
  section: ScriptOverviewDetailSection;
  onClose: () => void;
}

const accentStyles: Record<
  ScriptAccentTone,
  {
    badge: string;
    bullet: string;
  }
> = {
  indigo: {
    badge: 'bg-indigo-100 text-indigo-700',
    bullet: 'text-indigo-500'
  },
  emerald: {
    badge: 'bg-emerald-100 text-emerald-700',
    bullet: 'text-emerald-500'
  },
  rose: {
    badge: 'bg-rose-100 text-rose-700',
    bullet: 'text-rose-500'
  },
  amber: {
    badge: 'bg-amber-100 text-amber-700',
    bullet: 'text-amber-500'
  },
  slate: {
    badge: 'bg-slate-200 text-slate-700',
    bullet: 'text-slate-500'
  }
};

export const ScriptStudyDetailModal: React.FC<Props> = ({ language, section, onClose }) => {
  const copy = scriptLandingContent[language].common;
  const styles = accentStyles[section.accent];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 p-4 backdrop-blur-md md:p-6" onClick={onClose}>
      <div
        className="mx-auto flex h-full max-h-[920px] max-w-6xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6 border-b border-slate-200 px-6 py-5 md:px-8">
          <div className="min-w-0">
            <div className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${styles.badge}`}>
              {section.badge}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{section.detailsTitle}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">{section.detailsIntro}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            aria-label={copy.close}
            title={copy.close}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8">
          <div className="space-y-12">
            {section.topics.map((topic, index) => {
              const reverseLayout = index % 2 === 1;

              return (
                <section
                  key={topic.id}
                  className={`grid gap-8 border-b border-slate-100 pb-10 last:border-b-0 last:pb-0 lg:grid-cols-2 ${
                    reverseLayout ? 'lg:[&>div:first-child]:order-2 lg:[&>div:last-child]:order-1' : ''
                  }`}
                >
                  <div className="space-y-5">
                    <h3 className="text-2xl font-bold text-slate-900">{topic.title}</h3>
                    <p className="text-base font-medium leading-7 text-slate-700">{topic.lead}</p>
                    <div className="space-y-4 text-sm leading-8 text-slate-600 md:text-base">
                      {topic.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    <div>
                      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {copy.learningLabel}
                      </div>
                      <ul className="space-y-3">
                        {topic.learningPoints.map((point) => (
                          <li key={point} className="flex items-start">
                            <CheckCircle2 className={`mr-3 mt-0.5 h-5 w-5 shrink-0 ${styles.bullet}`} />
                            <span className="text-sm font-medium leading-6 text-slate-700 md:text-base">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <OverviewDemoFrame
                      src={topic.demoSrc}
                      alt={topic.demoAlt}
                      fallbackTitle={topic.fallbackTitle}
                      fallbackPath={topic.fallbackPath}
                      className="max-w-none min-h-[260px] p-0 hover:scale-100"
                      imageClassName="h-full w-full rounded-none object-cover group-hover:scale-100"
                    />
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
