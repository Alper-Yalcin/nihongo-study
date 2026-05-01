import React, { useMemo } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Ear,
  Headphones,
  Keyboard,
  PenLine,
  ShieldAlert,
  Sparkles,
  Volume2
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Eyebrow, PageHeader, PageShell } from '../components/ui';
import { AudioButton } from '../components/listening/AudioButton';
import { ListeningStudyContainer } from '../components/listening/ListeningStudyContainer';
import { AppLanguage } from '../data/appPreferences';
import { appShellRoutes } from '../data/appShellContent';
import { getGoogleTranslateKanaAudioSrc } from '../data/kanaAudio';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../data/studyContent';
import { isKanaScript } from '../hooks/useActiveScript';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import {
  buildKanaReviewQueue,
  getKanaGroupProgressStats,
  getWeakKanaProgressEntries
} from '../features/kana/review/reviewSelectors';

interface PracticeKanaListeningPageProps {
  language: AppLanguage;
  activeScript: KanaScript;
}

const copy = {
  tr: {
    eyebrow: 'Kana Practice',
    title: 'Listening Practice',
    description: 'Sesi dinle, dogru kanayi tanı, romajiyi yaz veya duydugun karakteri ciz.',
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    startReview: 'Bekleyenleri dinle',
    startWeak: 'Zayiflari dinle',
    startFree: 'Serbest dinleme',
    practiceTitle: 'Dinleme alani',
    due: 'Bekleyen',
    weak: 'Zayif',
    mastered: 'Tamamlanan',
    tracked: 'Takipte',
    recognition: 'Tanima',
    recognitionText: 'Sesi duyup dogru kana kartini secersin.',
    typing: 'Romaji yazma',
    typingText: 'Sesi duyup okunuşu klavyeden yazarsin.',
    writing: 'Duydugunu ciz',
    writingText: 'Karakter veri setinde sesi duyup kanayi cizersin.',
    focusQueue: 'Dinleme odagi',
    focusHint: 'Zayif ve bekleyen gruplar once gorunur.',
    emptyFocus: 'Henuz riskli grup yok.',
    characters: 'karakter',
    ready: 'Hazir',
    playSample: 'Ornek sesler'
  },
  en: {
    eyebrow: 'Kana Practice',
    title: 'Listening Practice',
    description: 'Hear the sound, recognize the kana, type the romaji, or draw what you heard.',
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    startReview: 'Listen to due items',
    startWeak: 'Listen to weak items',
    startFree: 'Free listening',
    practiceTitle: 'Listening area',
    due: 'Due',
    weak: 'Weak',
    mastered: 'Mastered',
    tracked: 'Tracked',
    recognition: 'Recognition',
    recognitionText: 'Hear the sound and choose the matching kana card.',
    typing: 'Romaji typing',
    typingText: 'Hear the sound and type the reading from the keyboard.',
    writing: 'Draw what you hear',
    writingText: 'On the character dataset, hear the sound and draw the kana.',
    focusQueue: 'Listening focus',
    focusHint: 'Weak and due groups appear first.',
    emptyFocus: 'No risky groups yet.',
    characters: 'characters',
    ready: 'Ready',
    playSample: 'Sample sounds'
  }
} as const;

const sampleItemsByScript: Record<KanaScript, { id: string; kana: string; romaji: string }[]> = {
  hiragana: [
    { id: 'h-a', kana: 'あ', romaji: 'a' },
    { id: 'h-ki', kana: 'き', romaji: 'ki' },
    { id: 'h-so', kana: 'そ', romaji: 'so' },
    { id: 'h-me', kana: 'め', romaji: 'me' }
  ],
  katakana: [
    { id: 'k-a', kana: 'ア', romaji: 'a' },
    { id: 'k-ki', kana: 'キ', romaji: 'ki' },
    { id: 'k-so', kana: 'ソ', romaji: 'so' },
    { id: 'k-me', kana: 'メ', romaji: 'me' }
  ]
};

const buildRunHref = (script: KanaScript, tab: 'review' | 'weak' | 'free') => {
  const params = new URLSearchParams();
  params.set('script', script);
  params.set('tab', tab);
  params.set('mode', 'listening');

  return `${appShellRoutes.practiceKanaListeningRun}?${params.toString()}`;
};

export const PracticeKanaListeningPage: React.FC<PracticeKanaListeningPageProps> = ({
  language,
  activeScript
}) => {
  const c = copy[language];
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedScript = searchParams.get('script');
  const script: KanaScript = isKanaScript(requestedScript) ? requestedScript : activeScript;

  const sections = useMemo(
    () => (script === 'hiragana' ? getLocalizedHiraganaSections(language) : getLocalizedKatakanaSections(language)),
    [language, script]
  );

  const allCharacterCount = useMemo(
    () => new Set(sections.flatMap((section) => section.groups.flatMap((group) => group.characters.map((item) => item.id)))).size,
    [sections]
  );

  const { listByScript, summaries } = useKanaProgressStore();
  const progressEntries = listByScript(script);
  const summary = summaries[script];
  const reviewQueue = useMemo(() => buildKanaReviewQueue(script, progressEntries), [progressEntries, script]);
  const weakEntries = useMemo(() => getWeakKanaProgressEntries(script, progressEntries), [progressEntries, script]);
  const focusGroups = useMemo(
    () => getKanaGroupProgressStats(sections, progressEntries).slice(0, 5),
    [progressEntries, sections]
  );

  const setScript = (next: KanaScript) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('script', next);
    setSearchParams(nextParams);
  };

  return (
    <PageShell width="wide" className="pb-14">
      <PageHeader
        eyebrow={<Eyebrow>{c.eyebrow}</Eyebrow>}
        title={c.title}
        description={c.description}
        actions={
          <div className="inline-flex rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface)] p-1 shadow-[var(--kt-shadow-sm)]">
            {(['hiragana', 'katakana'] as KanaScript[]).map((option) => {
              const active = option === script;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setScript(option)}
                  aria-pressed={active}
                  className={`h-9 rounded-md px-3 text-sm font-semibold transition ${
                    active
                      ? 'bg-[var(--kt-brand)] text-[var(--kt-brand-on)]'
                      : 'text-[var(--kt-ink-muted)] hover:bg-[var(--kt-surface-muted)] hover:text-[var(--kt-ink)]'
                  }`}
                >
                  {option === 'hiragana' ? c.hiragana : c.katakana}
                </button>
              );
            })}
          </div>
        }
      />

      <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <div className="overflow-hidden rounded-lg border border-[color:var(--kt-brand)]/20 bg-[color-mix(in_srgb,var(--kt-surface)_86%,transparent)] shadow-[var(--kt-shadow-sm)]">
          <div className="grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_18rem] md:p-6">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--kt-brand-soft)] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-brand)]">
                <Headphones size={14} />
                {script === 'hiragana' ? c.hiragana : c.katakana}
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[var(--kt-ink-muted)]">
                <Volume2 size={16} className="text-[var(--kt-brand)]" />
                {c.playSample}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {sampleItemsByScript[script].map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-4 text-center"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--kt-brand-soft)]">
                      <AudioButton
                        src={getGoogleTranslateKanaAudioSrc(item.id) ?? ''}
                        language={language}
                        size={20}
                        className="h-12 w-12"
                      />
                    </div>
                    <div className="mt-3 font-jp text-4xl font-black leading-none text-[var(--kt-ink-strong)]">
                      {item.kana}
                    </div>
                    <div className="mt-2 font-mono text-sm font-bold text-[var(--kt-ink-muted)]">{item.romaji}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  as="link"
                  to={reviewQueue.length > 0 ? buildRunHref(script, 'review') : buildRunHref(script, 'free')}
                  iconEnd={<ArrowRight size={16} />}
                >
                  {reviewQueue.length > 0 ? c.startReview : c.startFree}
                </Button>
                <Button
                  as="link"
                  to={weakEntries.length > 0 ? buildRunHref(script, 'weak') : buildRunHref(script, 'free')}
                  variant="secondary"
                  iconEnd={<ArrowRight size={16} />}
                >
                  {weakEntries.length > 0 ? c.startWeak : c.startFree}
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Metric icon={<Clock3 size={16} />} label={c.due} value={summary.dueCount} />
              <Metric icon={<ShieldAlert size={16} />} label={c.weak} value={summary.weakCount} />
              <Metric icon={<BadgeCheck size={16} />} label={c.mastered} value={summary.masteredCount} />
              <Metric icon={<Sparkles size={16} />} label={c.tracked} value={summary.tracked} />
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5 shadow-[var(--kt-shadow-sm)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-[var(--kt-ink-strong)]">{c.focusQueue}</h2>
              <p className="mt-1 text-sm text-[var(--kt-ink-muted)]">{c.focusHint}</p>
            </div>
            <Ear className="text-[var(--kt-brand)]" size={20} />
          </div>
          <div className="mt-4 space-y-3">
            {focusGroups.length > 0 ? (
              focusGroups.map((group) => {
                const risk = group.weak * 3 + group.due * 2 + (group.total - group.mastered);
                return (
                  <div key={group.groupId} className="rounded-lg border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-[var(--kt-ink-strong)]">{group.groupLabel}</div>
                        <div className="mt-0.5 text-xs text-[var(--kt-ink-muted)]">{group.sectionTitle}</div>
                      </div>
                      <span className="rounded-full bg-[var(--kt-accent-warning-soft)] px-2 py-1 text-xs font-black text-[var(--kt-accent-warning)]">
                        {risk}
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--kt-progress-track)]">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,var(--kt-brand),var(--kt-dan-gold))]"
                        style={{ width: `${group.total > 0 ? Math.round((group.mastered / group.total) * 100) : 0}%` }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-[var(--kt-ink-subtle)]">
                      {group.mastered}/{group.total} {c.ready}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-lg border border-dashed border-[var(--kt-border)] p-4 text-sm text-[var(--kt-ink-muted)]">
                {c.emptyFocus}
              </div>
            )}
          </div>
        </aside>
      </section>

      <section className="mt-4 grid gap-3 md:grid-cols-3">
        <ModeNote icon={<Ear size={18} />} title={c.recognition} text={c.recognitionText} />
        <ModeNote icon={<Keyboard size={18} />} title={c.typing} text={c.typingText} />
        <ModeNote icon={<PenLine size={18} />} title={c.writing} text={c.writingText} />
      </section>

      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-[var(--kt-ink-strong)]">{c.practiceTitle}</h2>
            <p className="mt-1 text-sm text-[var(--kt-ink-muted)]">
              {allCharacterCount} {c.characters}
            </p>
          </div>
          <Link
            to={buildRunHref(script, 'free')}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--kt-border)] bg-[var(--kt-surface)] px-3 py-2 text-sm font-semibold text-[var(--kt-ink)] transition hover:bg-[var(--kt-surface-muted)]"
          >
            {c.startFree}
            <ArrowRight size={15} />
          </Link>
        </div>
        <ListeningStudyContainer
          key={`listening-${script}-${language}`}
          title={script === 'hiragana' ? c.hiragana : c.katakana}
          language={language}
          sections={sections}
          script={script}
        />
      </section>
    </PageShell>
  );
};

interface MetricProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

const Metric: React.FC<MetricProps> = ({ icon, label, value }) => (
  <div className="rounded-lg border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-4">
    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
      <span className="text-[var(--kt-brand)]">{icon}</span>
      {label}
    </div>
    <div className="mt-2 text-2xl font-black text-[var(--kt-ink-strong)]">{value}</div>
  </div>
);

interface ModeNoteProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

const ModeNote: React.FC<ModeNoteProps> = ({ icon, title, text }) => (
  <div className="rounded-lg border border-[var(--kt-border-subtle)] bg-[color-mix(in_srgb,var(--kt-surface)_82%,transparent)] p-4">
    <div className="flex items-center gap-2 text-sm font-black text-[var(--kt-ink-strong)]">
      <span className="text-[var(--kt-brand)]">{icon}</span>
      {title}
    </div>
    <p className="mt-2 text-sm leading-6 text-[var(--kt-ink-muted)]">{text}</p>
  </div>
);
