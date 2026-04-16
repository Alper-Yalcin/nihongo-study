import React, { useMemo } from 'react';
import { ArrowLeft, BarChart3, Layers3, ShieldAlert, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { SectionCard } from '../components/SectionCard';
import { AppLanguage } from '../data/appPreferences';
import { getKanaEntryRoute, KanaAppScope } from '../data/appShellContent';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../data/studyContent';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import { getKanaGroupProgressStats, getWeakKanaProgressEntries } from '../features/kana/review/reviewSelectors';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { getKanaItemById } from '../features/kana/data/kanaInventory';

interface KanaStatsPageProps {
  script: KanaScript;
  language: AppLanguage;
  scope?: KanaAppScope;
}

const scriptTitleMap: Record<KanaScript, string> = {
  hiragana: 'Hiragana',
  katakana: 'Katakana'
};

const getSectionsForScript = (script: KanaScript, language: AppLanguage) =>
  script === 'hiragana'
    ? getLocalizedHiraganaSections(language)
    : getLocalizedKatakanaSections(language);

export const KanaStatsPage: React.FC<KanaStatsPageProps> = ({
  script,
  language,
  scope = 'study' as KanaAppScope
}) => {
  const resolvedScope: KanaAppScope = scope;
  const scriptTitle = scriptTitleMap[script];
  const sections = useMemo(() => getSectionsForScript(script, language), [language, script]);
  const { listByScript, summaries } = useKanaProgressStore();
  const progressEntries = listByScript(script);
  const summary = summaries[script];
  const groupStats = useMemo(
    () => getKanaGroupProgressStats(sections, progressEntries).slice(0, 8),
    [progressEntries, sections]
  );
  const recentMistakes = useMemo(
    () => getWeakKanaProgressEntries(script, progressEntries).slice(0, 8),
    [progressEntries, script]
  );

  return (
    <PageContainer>
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <Link to={getKanaEntryRoute(script, resolvedScope)} className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900">
                <ArrowLeft size={16} className="mr-2" />
                {language === 'tr' ? 'Overview sayfasina don' : 'Back to overview'}
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                  <BarChart3 size={22} />
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Stats</div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">{`${scriptTitle} progress panel`}</h1>
              <p className="text-base leading-8 text-slate-600 md:text-lg">
                {language === 'tr'
                  ? 'Bu panel weak gruplari, due review yogunlugu ve mastery dagilimini gercek progress verisinden gosterir.'
                  : 'This panel shows weak groups, due review density, and mastery distribution from live progress data.'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:w-[24rem]">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Tracked</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{summary.tracked}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">New</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{summary.newCount}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Weak</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{summary.weakCount}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Mastered</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{summary.masteredCount}</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <SectionCard
            title={language === 'tr' ? 'Weakest groups' : 'Weakest groups'}
            description={language === 'tr' ? 'Risk en yuksek gruplar once burada gorunur.' : 'The highest-risk groups surface here first.'}
          >
            <div className="space-y-3">
              {groupStats.map((group) => (
                <div key={group.groupId} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-slate-900">{`${group.sectionTitle} / ${group.groupLabel}`}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{`${group.tracked}/${group.total} tracked`}</div>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <div>{`Weak ${group.weak}`}</div>
                      <div>{`Due ${group.due}`}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title={language === 'tr' ? 'Recent mistakes' : 'Recent mistakes'}
            description={language === 'tr' ? 'Son hatalar item bazinda listelenir.' : 'Recent misses are listed item by item.'}
          >
            <div className="space-y-3">
              {recentMistakes.map((entry) => {
                const item = getKanaItemById(entry.kanaId);
                return (
                  <div key={entry.kanaId} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-japanese text-3xl text-slate-900" style={{ fontFamily: 'var(--font-jp-current)' }}>{item?.char ?? entry.kanaId}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{item?.groupLabel ?? '--'}</div>
                      </div>
                      <div className="text-right text-sm text-slate-600">
                        <div>{`Wrong ${entry.timesWrong}`}</div>
                        <div>{`T ${entry.typingScore} / D ${entry.drawingScore} / L ${entry.listeningScore}`}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <SectionCard title="Due" description={language === 'tr' ? 'Bekleyen review sayisi.' : 'Items currently due for review.'}>
            <div className="flex items-center gap-3 text-slate-700">
              <Target size={20} />
              <span className="text-3xl font-bold text-slate-900">{summary.dueCount}</span>
            </div>
          </SectionCard>
          <SectionCard title="Weak" description={language === 'tr' ? 'Weak durumda kalan karakterler.' : 'Characters currently marked weak.'}>
            <div className="flex items-center gap-3 text-slate-700">
              <ShieldAlert size={20} />
              <span className="text-3xl font-bold text-slate-900">{summary.weakCount}</span>
            </div>
          </SectionCard>
          <SectionCard title="Sections" description={language === 'tr' ? 'Toplam bolum sayisi.' : 'Total localized sections for this script.'}>
            <div className="flex items-center gap-3 text-slate-700">
              <Layers3 size={20} />
              <span className="text-3xl font-bold text-slate-900">{sections.length}</span>
            </div>
          </SectionCard>
        </div>
      </div>
    </PageContainer>
  );
};
