import React, { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppLanguage } from '../data/appPreferences';
import { appShellRoutes } from '../data/appShellContent';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../data/studyContent';
import { useDictionaryWordSearch } from '../data/words';
import { StudyContainer } from '../components/StudyContainer';
import { ListeningStudyContainer } from '../components/listening/ListeningStudyContainer';
import { WordStudyContainer } from '../components/WordStudyContainer';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import {
  buildKanaReviewQueue,
  buildScopedSectionsFromKanaIds,
  filterWordsForKanaIds,
  getKanaConfusableSets,
  getWeakKanaProgressEntries
} from '../features/kana/review/reviewSelectors';

interface PracticeRunPageProps {
  language: AppLanguage;
}

type PracticeTab = 'review' | 'weak' | 'confusable' | 'free';
type PracticeMode = 'typing' | 'drawing' | 'listening' | 'dictionary';

const normalizeTab = (value: string | null): PracticeTab =>
  value === 'review' || value === 'weak' || value === 'confusable' || value === 'free' ? value : 'free';

const normalizeMode = (value: string | null): PracticeMode =>
  value === 'typing' || value === 'drawing' || value === 'listening' || value === 'dictionary' ? value : 'typing';

export const PracticeRunPage: React.FC<PracticeRunPageProps> = ({ language }) => {
  const [searchParams] = useSearchParams();
  const script: KanaScript = searchParams.get('script') === 'katakana' ? 'katakana' : 'hiragana';
  const tab = normalizeTab(searchParams.get('tab'));
  const mode = normalizeMode(searchParams.get('mode'));
  const selectedIdsFromQuery = (searchParams.get('ids') ?? '').split(',').map((id) => id.trim()).filter(Boolean);

  const sections = useMemo(
    () => (script === 'hiragana' ? getLocalizedHiraganaSections(language) : getLocalizedKatakanaSections(language)),
    [language, script]
  );
  const { words } = useDictionaryWordSearch({
    script,
    limit: 220,
    offset: 0
  });
  const { listByScript } = useKanaProgressStore();
  const progressEntries = listByScript(script);

  const reviewQueue = useMemo(() => buildKanaReviewQueue(script, progressEntries).slice(0, 24), [progressEntries, script]);
  const weakEntries = useMemo(() => getWeakKanaProgressEntries(script, progressEntries).slice(0, 24), [progressEntries, script]);
  const confusableSets = useMemo(() => getKanaConfusableSets(script, progressEntries).slice(0, 8), [progressEntries, script]);

  const allSectionCharacterIds = useMemo(
    () =>
      Array.from(
        new Set(
          sections.flatMap((section) =>
            section.matrix.flatMap((row) => row.filter((item): item is NonNullable<typeof item> => item !== null).map((item) => item.id))
          )
        )
      ),
    [sections]
  );

  const focusItemIds = useMemo(() => {
    if (tab === 'free') {
      return selectedIdsFromQuery.length > 0 ? selectedIdsFromQuery : allSectionCharacterIds;
    }
    if (tab === 'review') {
      return reviewQueue.map((entry) => entry.kanaId);
    }
    if (tab === 'weak') {
      return weakEntries.map((entry) => entry.kanaId);
    }
    return Array.from(new Set(confusableSets.flatMap((set) => set.kanaIds)));
  }, [allSectionCharacterIds, confusableSets, reviewQueue, selectedIdsFromQuery, tab, weakEntries]);

  const scopedSections = useMemo(
    () => (focusItemIds.length > 0 ? buildScopedSectionsFromKanaIds(sections, focusItemIds) : sections),
    [focusItemIds, sections]
  );
  const scopedWords = useMemo(
    () => (focusItemIds.length > 0 ? filterWordsForKanaIds(words, focusItemIds) : words),
    [focusItemIds, words]
  );

  const backHref = `${appShellRoutes.practice}?script=${script}${tab ? `&tab=${tab}` : ''}`;

  return (
    <div className="space-y-6 pb-8">
      <section className="rounded-[1.6rem] border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5 shadow-[var(--kt-shadow-sm)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
              {script === 'hiragana' ? 'Hiragana' : 'Katakana'}
            </div>
            <h1 className="mt-1 text-2xl font-black text-[var(--kt-ink-strong)]">
              {language === 'tr' ? 'Alistirma oturumu' : 'Practice session'}
            </h1>
            <p className="mt-1 text-sm text-[var(--kt-ink-muted)]">
              {language === 'tr' ? `Mod: ${mode} • Secili karakter: ${focusItemIds.length}` : `Mode: ${mode} • Selected characters: ${focusItemIds.length}`}
            </p>
          </div>
          <Link
            to={backHref}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-2 text-sm font-semibold text-[var(--kt-ink)] transition hover:bg-[var(--kt-surface-muted)]"
          >
            <ArrowLeft size={16} />
            <span>{language === 'tr' ? 'Geri don' : 'Go back'}</span>
          </Link>
        </div>
      </section>

      {mode === 'typing' && scopedSections.length > 0 && (
        <StudyContainer
          key={`practice-run-${script}-${tab}-typing-${focusItemIds.join(',')}`}
          title={`${script === 'hiragana' ? 'Hiragana' : 'Katakana'} Practice`}
          language={language}
          script={script}
          sections={scopedSections}
          mode="typing"
          autoStart={true}
        />
      )}

      {mode === 'drawing' && scopedSections.length > 0 && (
        <StudyContainer
          key={`practice-run-${script}-${tab}-drawing-${focusItemIds.join(',')}`}
          title={`${script === 'hiragana' ? 'Hiragana' : 'Katakana'} Practice`}
          language={language}
          script={script}
          sections={scopedSections}
          mode="drawing"
          autoStart={true}
        />
      )}

      {mode === 'listening' && scopedSections.length > 0 && (
        <ListeningStudyContainer
          key={`practice-run-${script}-${tab}-listening-${focusItemIds.join(',')}`}
          title={`${script === 'hiragana' ? 'Hiragana' : 'Katakana'} Practice`}
          language={language}
          sections={scopedSections}
          words={scopedWords}
          script={script}
          autoStart={true}
        />
      )}

      {mode === 'dictionary' && (
        <WordStudyContainer
          title={`${script === 'hiragana' ? 'Hiragana' : 'Katakana'} Dictionary`}
          language={language}
          script={script}
        />
      )}
    </div>
  );
};

