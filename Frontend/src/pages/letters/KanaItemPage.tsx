import React, { useMemo } from 'react';
import { ArrowLeft, AudioLines, PenTool, Route, Target, Volume2 } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AppLanguage } from '../../data/appPreferences';
import {
  appShellRoutes,
  getKanaEntryRoute,
  getKanaItemRoute,
  getKanaStatsRoute,
  KanaAppScope
} from '../../data/appShellContent';
import { useDictionaryWordSearch } from '../../data/words';
import { getGoogleTranslateKanaAudioSrc } from '../../data/kanaAudio';
import { getNhkKanaGuideImageSrc } from '../../data/nhkKanaGuideImages';
import { getKanaItemById } from '../../features/kana/data/kanaInventory';
import { useKanaProgressStore } from '../../features/kana/progress/progressStore';
import { Button } from '../../components/ui';
import { GamePageShell, PageHero, SectionBlock } from '../../components/layout';
import { ProgressRing, StatPill } from '../../components/shared';

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
  const masteryPercent = Math.round(((progress?.masteryScore ?? 0) / 4) * 100);

  if (!item) {
    return <Navigate to={appShellRoutes.home} replace />;
  }

  return (
    <GamePageShell className="space-y-7">
      <PageHero
        backgroundGlyph="文字"
        eyebrow={
          <div className="text-xs font-black uppercase tracking-[0.16em] text-[var(--kt-ink-subtle)]">
            {item.script} · {item.sectionTitle}
          </div>
        }
        title={item.romaji.join(', ')}
        description={
          language === 'tr'
            ? 'Karakterin sesini, cizim rehberini, mastery durumunu ve ilgili kelimeleri tek odakta incele.'
            : 'Review sound, drawing guide, mastery state, and related vocabulary from one focused character stage.'
        }
        actions={
          <Button as="link" to={getKanaEntryRoute(item.script, resolvedScope)} variant="secondary" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            {language === 'tr' ? 'Harflere don' : 'Back to letters'}
          </Button>
        }
        visual={
          <div className="flex flex-wrap items-center justify-end gap-5">
            <div className="flex h-48 w-48 items-center justify-center">
              <div className="font-jp text-[9.5rem] leading-none text-[var(--kt-ink-strong)]">{item.char}</div>
            </div>
            <div className="flex flex-col items-center border-l border-[var(--kt-border-subtle)] pl-5">
              <ProgressRing
                value={masteryPercent}
                size={132}
                strokeWidth={12}
                tone="brand"
                label={<span className="text-sm font-black text-[var(--kt-ink-strong)]">{`${masteryPercent}%`}</span>}
              />
              <div className="mt-4 text-center">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">Mastery</div>
                <div className="mt-1 text-xl font-black text-[var(--kt-ink-strong)]">{progress?.state ?? 'new'}</div>
              </div>
            </div>
          </div>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatPill label="Mastery" value={`${progress?.masteryScore ?? 0}/4`} tone="brand" />
        <StatPill label="Typing" value={`${progress?.typingScore ?? 0}/4`} icon={<Target size={16} />} />
        <StatPill label="Drawing" value={`${progress?.drawingScore ?? 0}/4`} icon={<PenTool size={16} />} />
        <StatPill label="Listening" value={`${progress?.listeningScore ?? 0}/4`} icon={<AudioLines size={16} />} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <SectionBlock>
          <h2 className="text-2xl font-black text-[var(--kt-ink-strong)]">
            {language === 'tr' ? 'Karakter profili' : 'Character profile'}
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoTile label="Section" value={item.sectionTitle} />
            <InfoTile label="Group" value={item.groupLabel} />
            <InfoTile label="Seen" value={progress?.timesSeen ?? 0} />
            <InfoTile label="Wrong" value={progress?.timesWrong ?? 0} tone="danger" />
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
              {language === 'tr' ? 'Karisan karakterler' : 'Confusions'}
            </h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {confusedItems.length === 0 ? (
                <div className="border-y border-dashed border-[var(--kt-border-subtle)] py-4 text-sm text-[var(--kt-ink-muted)]">
                  {language === 'tr' ? 'Henuz kayitli karisma verisi yok.' : 'No confusion data is recorded yet.'}
                </div>
              ) : null}
              {confusedItems.map((confusedItem) => (
                <Link
                  key={confusedItem.id}
                  to={getKanaItemRoute(item.script, confusedItem.id, resolvedScope)}
                  className="px-3 py-2 text-center transition hover:text-[var(--kt-brand)]"
                >
                  <div className="font-jp text-4xl text-[var(--kt-ink-strong)]">{confusedItem.char}</div>
                  <div className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                    {confusedItem.romaji.join(', ')}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </SectionBlock>

        <SectionBlock className="bg-[linear-gradient(135deg,var(--kt-surface),var(--kt-brand-soft))]">
          <h2 className="text-2xl font-black text-[var(--kt-ink-strong)]">
            {language === 'tr' ? 'Ses ve cizim' : 'Sound and drawing'}
          </h2>
          <div className="mt-5 space-y-4">
            {audioSrc ? (
              <div className="border-b border-[var(--kt-border-subtle)] pb-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-black text-[var(--kt-ink-strong)]">
                  <Volume2 size={17} />
                  Audio
                </div>
                <audio controls src={audioSrc} className="w-full" />
              </div>
            ) : null}
            {guideImageSrc ? (
              <div className="overflow-hidden py-4">
                <img src={guideImageSrc} alt={`${item.char} guide`} className="mx-auto h-auto max-h-80 w-auto" />
              </div>
            ) : (
              <div className="border-y border-dashed border-[var(--kt-border-subtle)] py-6 text-sm text-[var(--kt-ink-muted)]">
                {language === 'tr'
                  ? 'Bu karakter icin guide image bulunmuyor.'
                  : 'No guide image is available for this character.'}
              </div>
            )}
          </div>
        </SectionBlock>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <SectionBlock>
          <h2 className="text-2xl font-black text-[var(--kt-ink-strong)]">
            {language === 'tr' ? 'Calisma akislari' : 'Practice routes'}
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
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
                <Button as="link" to={item.script === 'hiragana' ? appShellRoutes.hiraganaReview : appShellRoutes.katakanaReview} variant="secondary" size="sm">
                  <Route size={16} className="mr-2" />
                  {language === 'tr' ? 'Review akisini ac' : 'Open review flow'}
                </Button>
                <Button as="link" to={item.script === 'hiragana' ? appShellRoutes.hiraganaWeak : appShellRoutes.katakanaWeak} variant="secondary" size="sm">
                  <Target size={16} className="mr-2" />
                  {language === 'tr' ? 'Weak akisini ac' : 'Open weak flow'}
                </Button>
                <Button as="link" to={item.script === 'hiragana' ? appShellRoutes.hiraganaConfusable : appShellRoutes.katakanaConfusable} variant="secondary" size="sm">
                  <Route size={16} className="mr-2" />
                  {language === 'tr' ? 'Confusable akisini ac' : 'Open confusable flow'}
                </Button>
              </>
            )}
          </div>
        </SectionBlock>

        <SectionBlock>
          <h2 className="text-2xl font-black text-[var(--kt-ink-strong)]">
            {language === 'tr' ? 'Ilgili kelimeler' : 'Related words'}
          </h2>
          <div className="mt-5 space-y-3">
            {areRelatedWordsLoading ? (
              <Message text={language === 'tr' ? 'Ilgili kelimeler yukleniyor...' : 'Loading related words...'} />
            ) : null}
            {relatedWordsError ? <Message text={relatedWordsError} danger /> : null}
            {relatedWords.length === 0 && !areRelatedWordsLoading ? (
              <Message text={language === 'tr' ? 'Bu karakterle iliskili kelime bulunamadi.' : 'No related words were found for this character.'} />
            ) : null}
            {relatedWords.map((word) => (
              <div key={word.id} className="border-b border-[var(--kt-border-subtle)] py-4">
                <div className="text-lg font-black text-[var(--kt-ink-strong)]">{word.kana}</div>
                <div className="mt-1 text-sm text-[var(--kt-ink-muted)]">{word.romaji}</div>
                <div className="mt-2 text-sm text-[var(--kt-ink-muted)]">{word.meaning ?? word.meanings?.join(', ') ?? '--'}</div>
              </div>
            ))}
          </div>
        </SectionBlock>
      </section>
    </GamePageShell>
  );
};

const InfoTile: React.FC<{ label: React.ReactNode; value: React.ReactNode; tone?: 'default' | 'danger' }> = ({ label, value, tone = 'default' }) => (
  <div
    className={`border-b border-[var(--kt-border-subtle)] py-4 ${
      tone === 'danger' ? 'text-[var(--kt-accent-danger)]' : 'text-[var(--kt-ink-strong)]'
    }`}
  >
    <div className="text-xs font-black uppercase tracking-[0.16em] opacity-70">{label}</div>
    <div className="mt-2 text-lg font-black">{value}</div>
  </div>
);

const Message: React.FC<{ text: string; danger?: boolean }> = ({ text, danger = false }) => (
  <div
    className={`border-y py-4 text-sm ${
      danger
        ? 'border-[var(--kt-accent-danger)]/30 text-[var(--kt-accent-danger)]'
        : 'border-dashed border-[var(--kt-border-subtle)] text-[var(--kt-ink-muted)]'
    }`}
  >
    {text}
  </div>
);
