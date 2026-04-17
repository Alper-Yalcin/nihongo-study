import React, { useMemo } from 'react';
import { ArrowLeft, BarChart3, Layers3, ShieldAlert, Target } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { getKanaEntryRoute, KanaAppScope } from '../data/appShellContent';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../data/studyContent';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import { getKanaGroupProgressStats, getWeakKanaProgressEntries } from '../features/kana/review/reviewSelectors';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { getKanaItemById } from '../features/kana/data/kanaInventory';
import {
  Button,
  Card,
  CardHeader,
  Eyebrow,
  PageHeader,
  PageSection,
  PageShell,
  StatCard
} from '../shared/ui';

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
    <PageShell>
      <PageHeader
        eyebrow={
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[var(--kt-radius)] bg-[var(--kt-brand-soft)] text-[var(--kt-brand)]">
              <BarChart3 size={20} />
            </span>
            <Eyebrow>Stats</Eyebrow>
          </div>
        }
        title={`${scriptTitle} progress panel`}
        description={
          language === 'tr'
            ? 'Bu panel weak gruplari, due review yogunlugu ve mastery dagilimini gercek progress verisinden gosterir.'
            : 'This panel shows weak groups, due review density, and mastery distribution from live progress data.'
        }
        actions={
          <Button as="link" to={getKanaEntryRoute(script, resolvedScope)} variant="secondary" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            {language === 'tr' ? 'Overview sayfasina don' : 'Back to overview'}
          </Button>
        }
      />

      <PageSection className="mt-8" spacing="default">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Tracked" value={summary.tracked} />
          <StatCard label="New" value={summary.newCount} tone="brand" />
          <StatCard label="Weak" value={summary.weakCount} tone="danger" />
          <StatCard label="Mastered" value={summary.masteredCount} tone="success" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <Card padding="md">
            <CardHeader
              title={language === 'tr' ? 'Weakest groups' : 'Weakest groups'}
              description={
                language === 'tr'
                  ? 'Risk en yuksek gruplar once burada gorunur.'
                  : 'The highest-risk groups surface here first.'
              }
            />
            <div className="mt-5 space-y-3">
              {groupStats.map((group) => (
                <div
                  key={group.groupId}
                  className="rounded-[var(--kt-radius)] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-[var(--kt-ink-strong)]">
                        {`${group.sectionTitle} / ${group.groupLabel}`}
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                        {`${group.tracked}/${group.total} tracked`}
                      </div>
                    </div>
                    <div className="text-right text-sm text-[var(--kt-ink-muted)]">
                      <div>{`Weak ${group.weak}`}</div>
                      <div>{`Due ${group.due}`}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="md">
            <CardHeader
              title={language === 'tr' ? 'Recent mistakes' : 'Recent mistakes'}
              description={
                language === 'tr'
                  ? 'Son hatalar item bazinda listelenir.'
                  : 'Recent misses are listed item by item.'
              }
            />
            <div className="mt-5 space-y-3">
              {recentMistakes.map((entry) => {
                const item = getKanaItemById(entry.kanaId);
                return (
                  <div
                    key={entry.kanaId}
                    className="rounded-[var(--kt-radius)] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div
                          className="text-3xl text-[var(--kt-ink-strong)]"
                          style={{ fontFamily: 'var(--font-jp-current)' }}
                        >
                          {item?.char ?? entry.kanaId}
                        </div>
                        <div className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                          {item?.groupLabel ?? '--'}
                        </div>
                      </div>
                      <div className="text-right text-sm text-[var(--kt-ink-muted)]">
                        <div>{`Wrong ${entry.timesWrong}`}</div>
                        <div>{`T ${entry.typingScore} / D ${entry.drawingScore} / L ${entry.listeningScore}`}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card padding="md">
            <CardHeader
              title="Due"
              description={
                language === 'tr' ? 'Bekleyen review sayisi.' : 'Items currently due for review.'
              }
            />
            <div className="mt-5 flex items-center gap-3 text-[var(--kt-ink)]">
              <Target size={20} />
              <span className="text-3xl font-bold text-[var(--kt-ink-strong)]">{summary.dueCount}</span>
            </div>
          </Card>
          <Card padding="md">
            <CardHeader
              title="Weak"
              description={
                language === 'tr' ? 'Weak durumda kalan karakterler.' : 'Characters currently marked weak.'
              }
            />
            <div className="mt-5 flex items-center gap-3 text-[var(--kt-ink)]">
              <ShieldAlert size={20} />
              <span className="text-3xl font-bold text-[var(--kt-ink-strong)]">{summary.weakCount}</span>
            </div>
          </Card>
          <Card padding="md">
            <CardHeader
              title="Sections"
              description={
                language === 'tr'
                  ? 'Toplam bolum sayisi.'
                  : 'Total localized sections for this script.'
              }
            />
            <div className="mt-5 flex items-center gap-3 text-[var(--kt-ink)]">
              <Layers3 size={20} />
              <span className="text-3xl font-bold text-[var(--kt-ink-strong)]">{sections.length}</span>
            </div>
          </Card>
        </div>
      </PageSection>
    </PageShell>
  );
};
