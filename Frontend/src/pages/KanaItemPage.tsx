import React, { useMemo } from 'react';
import { ArrowLeft, AudioLines, PenTool, Route, Target } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AppLanguage } from '../data/appPreferences';
import {
  appShellRoutes,
  getKanaEntryRoute,
  getKanaItemRoute,
  getKanaStatsRoute,
  KanaAppScope
} from '../data/appShellContent';
import { useDictionaryWordSearch } from '../data/words';
import { getGoogleTranslateKanaAudioSrc } from '../data/kanaAudio';
import { getNhkKanaGuideImageSrc } from '../data/nhkKanaGuideImages';
import { getKanaItemById } from '../features/kana/data/kanaInventory';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import {
  Button,
  Card,
  CardHeader,
  StatCard
} from '../shared/ui';
import { ProgressRing } from '../components/shared/ProgressRing';

interface KanaItemPageProps {
  language: AppLanguage;
  scope?: KanaAppScope;
}

export const KanaItemPage: React.FC<KanaItemPageProps> = ({
  language,
  scope = 'study' as KanaAppScope
}) => {
  const resolvedScope: KanaAppScope = scope;
  const { kanaId } = useParams<{ kanaId: string }>();
  const item = kanaId ? getKanaItemById(kanaId) : null;
  const resolvedScript = item?.script ?? 'hiragana';
  const { getProgress } = useKanaProgressStore();
  const progress = item ? getProgress(item.id) : null;
  const {
    words,
    loading: areRelatedWordsLoading,
    error: relatedWordsError
  } = useDictionaryWordSearch({
    script: resolvedScript,
    query: item?.char,
    mode: 'contains',
    limit: 20,
    offset: 0,
    enabled: Boolean(item)
  });
  const audioSrc = item ? getGoogleTranslateKanaAudioSrc(item.id) : undefined;
  const guideImageSrc = item ? getNhkKanaGuideImageSrc(item.id) : undefined;
  const relatedWords = useMemo(
    () => (item ? words.filter((word) => word.kana.includes(item.char)).slice(0, 6) : []),
    [item, words]
  );
  const confusedItems = (progress?.confusedWith ?? [])
    .map((confusedId) => getKanaItemById(confusedId))
    .filter((entry): entry is NonNullable<ReturnType<typeof getKanaItemById>> => entry !== null);

  if (!item) {
    return <Navigate to={appShellRoutes.home} replace />;
  }

  return (
    <div className="space-y-8 pb-8">
      <section className="rounded-[2rem] border border-[var(--kt-border)] bg-[rgba(8,14,22,0.88)] p-7 shadow-[var(--kt-shadow-lg)]">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="rounded-[2rem] border border-[var(--kt-border)] bg-[rgba(255,255,255,0.04)] px-8 py-6">
              <div className="font-jp text-[120px] leading-none text-white">{item.char}</div>
            </div>
            <div>
              <div className="text-sm font-black uppercase tracking-[0.16em] text-[var(--kt-ink-subtle)]">
                {item.script}
              </div>
              <h1 className="mt-3 text-5xl font-black text-white">{item.romaji.join(', ')}</h1>
              <p className="mt-3 text-base leading-8 text-white/72">
                {language === 'tr'
                  ? 'Karakter vitrini, mastery ve ilgili baglam kartlari artik tek bir detay sayfasinda.'
                  : 'The character spotlight, mastery, and related context now live in one detail screen.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <ProgressRing
              value={Math.round(((progress?.masteryScore ?? 0) / 4) * 100)}
              size={112}
              strokeWidth={10}
              tone="brand"
              label={<span className="text-xs font-black text-white">{`${Math.round(((progress?.masteryScore ?? 0) / 4) * 100)}%`}</span>}
            />
            <Button
              as="link"
              to={getKanaEntryRoute(item.script, resolvedScope)}
              variant="secondary"
              size="sm"
            >
              <ArrowLeft size={16} className="mr-2" />
              {language === 'tr' ? 'Harflere don' : 'Back to letters'}
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="State" value={progress?.state ?? 'new'} />
        <StatCard label="Mastery" value={`${progress?.masteryScore ?? 0}/4`} tone="brand" />
        <StatCard label="Seen" value={progress?.timesSeen ?? 0} />
        <StatCard label="Wrong" value={progress?.timesWrong ?? 0} tone="danger" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <Card padding="md">
            <CardHeader
              title={language === 'tr' ? 'Profile' : 'Profile'}
              description={
                language === 'tr'
                  ? 'Karakter bilgisi ve score dagilimi.'
                  : 'Character metadata and score distribution.'
              }
            />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <InfoTile label="Section" value={item.sectionTitle} />
              <InfoTile label="Group" value={item.groupLabel} />
              <InfoTile
                label={
                  <span className="flex items-center gap-2">
                    <Target size={14} /> Typing
                  </span>
                }
                value={`${progress?.typingScore ?? 0}/4`}
              />
              <InfoTile
                label={
                  <span className="flex items-center gap-2">
                    <PenTool size={14} /> Drawing
                  </span>
                }
                value={`${progress?.drawingScore ?? 0}/4`}
              />
              <div className="sm:col-span-2">
                <InfoTile
                  label={
                    <span className="flex items-center gap-2">
                      <AudioLines size={14} /> Listening
                    </span>
                  }
                  value={`${progress?.listeningScore ?? 0}/4`}
                />
              </div>
            </div>
          </Card>

          <Card padding="md">
            <CardHeader
              title={language === 'tr' ? 'Assets' : 'Assets'}
              description={
                language === 'tr'
                  ? 'Ses ve guide image varsa burada gorunur.'
                  : 'Audio and guide image appear here when available.'
              }
            />
            <div className="mt-5 space-y-4">
              {audioSrc && <audio controls src={audioSrc} className="w-full" />}
              {guideImageSrc ? (
                <div className="overflow-hidden rounded-[var(--kt-radius)] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-4">
                  <img src={guideImageSrc} alt={`${item.char} guide`} className="mx-auto h-auto max-h-80 w-auto" />
                </div>
              ) : (
                <div className="rounded-[var(--kt-radius)] border border-dashed border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-6 text-sm text-[var(--kt-ink-muted)]">
                  {language === 'tr'
                    ? 'Bu karakter icin guide image bulunmuyor.'
                    : 'No guide image is available for this character.'}
                </div>
              )}
            </div>
          </Card>
      </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Card padding="md">
            <CardHeader
              title={language === 'tr' ? 'Confusions' : 'Confusions'}
              description={
                language === 'tr'
                  ? 'Bu karakterle karisan itemler.'
                  : 'Items commonly confused with this character.'
              }
            />
            <div className="mt-5 flex flex-wrap gap-3">
              {confusedItems.length === 0 && (
                <div className="rounded-[var(--kt-radius)] border border-dashed border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-4 text-sm text-[var(--kt-ink-muted)]">
                  {language === 'tr' ? 'Henuz kayitli karisma verisi yok.' : 'No confusion data is recorded yet.'}
                </div>
              )}
              {confusedItems.map((confusedItem) => (
                <Link
                  key={confusedItem.id}
                  to={getKanaItemRoute(item.script, confusedItem.id, resolvedScope)}
                  className="rounded-[var(--kt-radius)] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-4 text-center transition-colors hover:bg-[var(--kt-surface)]"
                >
                  <div
                    className="text-3xl text-[var(--kt-ink-strong)]"
                    style={{ fontFamily: 'var(--font-jp-current)' }}
                  >
                    {confusedItem.char}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                    {confusedItem.romaji.join(', ')}
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {resolvedScope === 'play' ? (
                <>
                  <Button as="link" to={getKanaEntryRoute(item.script, 'play')} variant="secondary" size="sm">
                    <Route size={16} className="mr-2" />
                    {language === 'tr' ? 'Play akisini ac' : 'Open play flow'}
                  </Button>
                  <Button as="link" to={getKanaStatsRoute(item.script, 'play')} variant="secondary" size="sm">
                    <Target size={16} className="mr-2" />
                    {language === 'tr' ? 'Play stats ac' : 'Open play stats'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    as="link"
                    to={item.script === 'hiragana' ? appShellRoutes.hiraganaReview : appShellRoutes.katakanaReview}
                    variant="secondary"
                    size="sm"
                  >
                    <Route size={16} className="mr-2" />
                    {language === 'tr' ? 'Review akisini ac' : 'Open review flow'}
                  </Button>
                  <Button
                    as="link"
                    to={item.script === 'hiragana' ? appShellRoutes.hiraganaWeak : appShellRoutes.katakanaWeak}
                    variant="secondary"
                    size="sm"
                  >
                    <Target size={16} className="mr-2" />
                    {language === 'tr' ? 'Weak akisini ac' : 'Open weak flow'}
                  </Button>
                  <Button
                    as="link"
                    to={item.script === 'hiragana' ? appShellRoutes.hiraganaConfusable : appShellRoutes.katakanaConfusable}
                    variant="secondary"
                    size="sm"
                  >
                    <Route size={16} className="mr-2" />
                    {language === 'tr' ? 'Confusable akisini ac' : 'Open confusable flow'}
                  </Button>
                </>
              )}
            </div>
          </Card>

          <Card padding="md">
            <CardHeader
              title={language === 'tr' ? 'Related words' : 'Related words'}
              description={
                language === 'tr'
                  ? 'Karakteri iceren ilk kelime ornekleri.'
                  : 'First vocabulary examples containing this character.'
              }
            />
            <div className="mt-5 space-y-3">
              {areRelatedWordsLoading && (
                <div className="rounded-[var(--kt-radius)] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-4 text-sm text-[var(--kt-ink-muted)]">
                  {language === 'tr' ? 'Ilgili kelimeler yukleniyor...' : 'Loading related words...'}
                </div>
              )}
              {relatedWordsError && (
                <div className="rounded-[var(--kt-radius)] border border-[var(--kt-accent-danger)]/30 bg-[var(--kt-accent-danger-soft)] px-4 py-4 text-sm text-[var(--kt-accent-danger)]">
                  {relatedWordsError}
                </div>
              )}
              {relatedWords.length === 0 && !areRelatedWordsLoading && (
                <div className="rounded-[var(--kt-radius)] border border-dashed border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-4 text-sm text-[var(--kt-ink-muted)]">
                  {language === 'tr'
                    ? 'Bu karakterle iliskili kelime bulunamadi.'
                    : 'No related words were found for this character.'}
                </div>
              )}
              {relatedWords.map((word) => (
                <div
                  key={word.id}
                  className="rounded-[var(--kt-radius)] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-4"
                >
                  <div className="text-lg font-semibold text-[var(--kt-ink-strong)]">{word.kana}</div>
                  <div className="mt-1 text-sm text-[var(--kt-ink-muted)]">{word.romaji}</div>
                  <div className="mt-2 text-sm text-[var(--kt-ink-muted)]">
                    {word.meaning ?? word.meanings?.join(', ') ?? '--'}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
    </div>
  );
};

const InfoTile: React.FC<{ label: React.ReactNode; value: React.ReactNode }> = ({ label, value }) => (
  <div className="rounded-[var(--kt-radius)] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-4">
    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">{label}</div>
    <div className="mt-2 text-lg font-semibold text-[var(--kt-ink-strong)]">{value}</div>
  </div>
);
