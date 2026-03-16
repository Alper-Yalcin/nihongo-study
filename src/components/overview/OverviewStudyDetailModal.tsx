import React, { useEffect, useMemo, useRef, useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { AppLanguage } from '../../data/appPreferences';
import {
  overviewModalContent,
  OverviewStudyAreaId
} from '../../data/overviewModalContent';
import { OverviewDemoFrame } from './OverviewDemoFrame';

interface Props {
  language: AppLanguage;
  studyArea: OverviewStudyAreaId;
  onClose: () => void;
}

const accentStyles: Record<
  OverviewStudyAreaId,
  {
    badge: string;
    activeTopic: string;
    activeHeading: string;
    bullet: string;
  }
> = {
  typing: {
    badge: 'bg-indigo-100 text-indigo-700',
    activeTopic: 'border-l-4 border-indigo-200 pl-5',
    activeHeading: 'text-indigo-700',
    bullet: 'text-indigo-500'
  },
  drawing: {
    badge: 'bg-emerald-100 text-emerald-700',
    activeTopic: 'border-l-4 border-emerald-200 pl-5',
    activeHeading: 'text-emerald-700',
    bullet: 'text-emerald-500'
  },
  listening: {
    badge: 'bg-rose-100 text-rose-700',
    activeTopic: 'border-l-4 border-rose-200 pl-5',
    activeHeading: 'text-rose-700',
    bullet: 'text-rose-500'
  },
  dictionary: {
    badge: 'bg-amber-100 text-amber-700',
    activeTopic: 'border-l-4 border-amber-200 pl-5',
    activeHeading: 'text-amber-700',
    bullet: 'text-amber-500'
  }
};

export const OverviewStudyDetailModal: React.FC<Props> = ({
  language,
  studyArea,
  onClose
}) => {
  const copy = overviewModalContent[language];
  const section = copy.sections[studyArea];
  const styles = accentStyles[studyArea];
  const [activeTopicId, setActiveTopicId] = useState(section.topics[0]?.id ?? '');
  const scrollRef = useRef<HTMLDivElement>(null);
  const topicRefs = useRef<Record<string, HTMLElement | null>>({});

  const activeTopic = useMemo(
    () => section.topics.find((topic) => topic.id === activeTopicId) ?? section.topics[0],
    [activeTopicId, section.topics]
  );

  useEffect(() => {
    setActiveTopicId(section.topics[0]?.id ?? '');
  }, [section]);

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

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) {
      return undefined;
    }

    let frameId = 0;

    const updateActiveTopic = () => {
      frameId = 0;
      const containerRect = container.getBoundingClientRect();
      const anchor = container.scrollTop + Math.max(120, container.clientHeight * 0.18);
      let nextActiveId = section.topics[0]?.id ?? '';

      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 24) {
        setActiveTopicId(section.topics[section.topics.length - 1]?.id ?? nextActiveId);
        return;
      }

      section.topics.forEach((topic) => {
        const element = topicRefs.current[topic.id];

        if (!element) {
          return;
        }

        const relativeTop =
          element.getBoundingClientRect().top - containerRect.top + container.scrollTop;

        if (relativeTop <= anchor) {
          nextActiveId = topic.id;
        }
      });

      setActiveTopicId((previousId) => (previousId === nextActiveId ? previousId : nextActiveId));
    };

    const handleScroll = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(updateActiveTopic);
    };

    updateActiveTopic();
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [section]);

  const isMediaLeft = section.mediaPosition === 'left';

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 p-4 backdrop-blur-md md:p-6"
      onClick={onClose}
    >
      <div
        className="mx-auto flex h-full max-h-[920px] max-w-7xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6 border-b border-slate-200 px-6 py-5 md:px-8">
          <div className="min-w-0">
            <div className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${styles.badge}`}>
              {section.badge}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{section.title}</h2>
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

        <div className="flex-1 overflow-hidden px-6 py-6 md:px-8 md:py-8">
          <div className="grid h-full gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
            <div className={`flex min-h-0 flex-col ${isMediaLeft ? 'lg:order-2' : 'lg:order-1'}`}>
              <div
                ref={scrollRef}
                className="min-h-0 overflow-y-auto rounded-[24px] border border-slate-200 bg-slate-50 p-6 pr-4 md:p-8 md:pr-5"
              >
                <article className="mx-auto max-w-3xl">
                  <p className="text-sm leading-8 text-slate-600 md:text-base">
                    {section.intro}
                  </p>

                  <div className="mt-8 space-y-10">
                    {section.topics.map((topic, index) => {
                      const isActive = topic.id === activeTopicId;

                      return (
                        <section
                          key={topic.id}
                          ref={(element) => {
                            topicRefs.current[topic.id] = element;
                          }}
                          className={`${index > 0 ? 'border-t border-slate-200 pt-10' : ''} ${
                            isActive ? styles.activeTopic : ''
                          }`}
                        >
                          <h3 className={`text-2xl font-bold text-slate-900 md:text-3xl ${isActive ? styles.activeHeading : ''}`}>
                            {topic.title}
                          </h3>
                          <p className="mt-4 text-sm font-medium leading-7 text-slate-700 md:text-base">
                            {topic.lead}
                          </p>

                          <div className="mt-5 space-y-4 text-sm leading-8 text-slate-600 md:text-base">
                            {topic.paragraphs.map((paragraph) => (
                              <p key={paragraph}>{paragraph}</p>
                            ))}
                          </div>

                          <div className="mt-6">
                            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                              {copy.learningLabel}
                            </div>
                            <ul className="space-y-3">
                              {topic.learningPoints.map((point) => (
                                <li key={point} className="flex items-start">
                                  <CheckCircle2 className={`mr-3 mt-0.5 h-5 w-5 shrink-0 ${styles.bullet}`} />
                                  <span className="text-sm font-medium leading-6 text-slate-700 md:text-base">
                                    {point}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </section>
                      );
                    })}
                  </div>
                </article>
              </div>
            </div>

            <div className={`flex min-h-0 flex-col ${isMediaLeft ? 'lg:order-1' : 'lg:order-2'}`}>
              {activeTopic && (
                <OverviewDemoFrame
                  key={activeTopic.id}
                  src={activeTopic.demoSrc}
                  alt={activeTopic.demoAlt}
                  fallbackTitle={activeTopic.fallbackTitle}
                  fallbackPath={activeTopic.fallbackPath}
                  className="h-full max-w-none min-h-[320px] p-0 hover:scale-100 lg:min-h-0"
                  imageClassName="h-full w-full max-h-none rounded-none object-cover group-hover:scale-100"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
