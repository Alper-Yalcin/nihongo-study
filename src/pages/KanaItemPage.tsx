import React, { useMemo } from 'react';
import { ArrowLeft, AudioLines, PenTool, Route, Target } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { SectionCard } from '../components/SectionCard';
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
    <PageContainer>
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <Link to={getKanaEntryRoute(item.script, resolvedScope)} className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900">
                <ArrowLeft size={16} className="mr-2" />
                {language === 'tr' ? 'Overview sayfasina don' : 'Back to overview'}
              </Link>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Item Detail</div>
              <div className="flex items-end gap-5">
                <div className="font-japanese text-7xl text-slate-900" style={{ fontFamily: 'var(--font-jp-current)' }}>{item.char}</div>
                <div className="pb-2">
                  <div className="text-sm uppercase tracking-[0.16em] text-slate-500">{item.script}</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900">{item.romaji.join(', ')}</div>
                </div>
              </div>
              <p className="text-base leading-8 text-slate-600 md:text-lg">
                {language === 'tr'
                  ? 'Karakterin grup, score ve karisma verisi bu panelde bir araya gelir.'
                  : 'This panel gathers the character group, score profile, and confusion data in one place.'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:w-[24rem]">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">State</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{progress?.state ?? 'new'}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Mastery</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{progress?.masteryScore ?? 0}/4</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Seen</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{progress?.timesSeen ?? 0}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Wrong</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{progress?.timesWrong ?? 0}</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <SectionCard title={language === 'tr' ? 'Profile' : 'Profile'} description={language === 'tr' ? 'Karakter bilgisi ve score dagilimi.' : 'Character metadata and score distribution.'}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Section</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{item.sectionTitle}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Group</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{item.groupLabel}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"><Target size={14} /> Typing</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{progress?.typingScore ?? 0}/4</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"><PenTool size={14} /> Drawing</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{progress?.drawingScore ?? 0}/4</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"><AudioLines size={14} /> Listening</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{progress?.listeningScore ?? 0}/4</div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title={language === 'tr' ? 'Assets' : 'Assets'} description={language === 'tr' ? 'Ses ve guide image varsa burada gorunur.' : 'Audio and guide image appear here when available.'}>
            <div className="space-y-4">
              {audioSrc && <audio controls src={audioSrc} className="w-full" />}
              {guideImageSrc ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
                  <img src={guideImageSrc} alt={`${item.char} guide`} className="mx-auto h-auto max-h-80 w-auto" />
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  {language === 'tr' ? 'Bu karakter icin guide image bulunmuyor.' : 'No guide image is available for this character.'}
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <SectionCard title={language === 'tr' ? 'Confusions' : 'Confusions'} description={language === 'tr' ? 'Bu karakterle karisan itemler.' : 'Items commonly confused with this character.'}>
            <div className="flex flex-wrap gap-3">
              {confusedItems.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                  {language === 'tr' ? 'Henuz kayitli karisma verisi yok.' : 'No confusion data is recorded yet.'}
                </div>
              )}
              {confusedItems.map((confusedItem) => (
                <Link
                  key={confusedItem.id}
                  to={getKanaItemRoute(item.script, confusedItem.id, resolvedScope)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center transition-colors hover:bg-slate-100"
                >
                  <div className="font-japanese text-3xl text-slate-900" style={{ fontFamily: 'var(--font-jp-current)' }}>{confusedItem.char}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">{confusedItem.romaji.join(', ')}</div>
                </Link>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {resolvedScope === 'play' ? (
                <>
                  <Link to={getKanaEntryRoute(item.script, 'play')} className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <Route size={16} className="mr-2" />
                    {language === 'tr' ? 'Play akisini ac' : 'Open play flow'}
                  </Link>
                  <Link to={getKanaStatsRoute(item.script, 'play')} className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <Target size={16} className="mr-2" />
                    {language === 'tr' ? 'Play stats ac' : 'Open play stats'}
                  </Link>
                </>
              ) : (
                <>
                  <Link to={item.script === 'hiragana' ? appShellRoutes.hiraganaReview : appShellRoutes.katakanaReview} className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <Route size={16} className="mr-2" />
                    {language === 'tr' ? 'Review akisini ac' : 'Open review flow'}
                  </Link>
                  <Link to={item.script === 'hiragana' ? appShellRoutes.hiraganaWeak : appShellRoutes.katakanaWeak} className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <Target size={16} className="mr-2" />
                    {language === 'tr' ? 'Weak akisini ac' : 'Open weak flow'}
                  </Link>
                  <Link to={item.script === 'hiragana' ? appShellRoutes.hiraganaConfusable : appShellRoutes.katakanaConfusable} className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <Route size={16} className="mr-2" />
                    {language === 'tr' ? 'Confusable akisini ac' : 'Open confusable flow'}
                  </Link>
                </>
              )}
            </div>
          </SectionCard>

          <SectionCard title={language === 'tr' ? 'Related words' : 'Related words'} description={language === 'tr' ? 'Karakteri iceren ilk kelime ornekleri.' : 'First vocabulary examples containing this character.'}>
            <div className="space-y-3">
              {areRelatedWordsLoading && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  {language === 'tr' ? 'Ilgili kelimeler yukleniyor...' : 'Loading related words...'}
                </div>
              )}
              {relatedWordsError && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
                  {relatedWordsError}
                </div>
              )}
              {relatedWords.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                  {language === 'tr' ? 'Bu karakterle iliskili kelime bulunamadi.' : 'No related words were found for this character.'}
                </div>
              )}
              {relatedWords.map((word) => (
                <div key={word.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="text-lg font-semibold text-slate-900">{word.kana}</div>
                  <div className="mt-1 text-sm text-slate-600">{word.romaji}</div>
                  <div className="mt-2 text-sm text-slate-500">{word.meaning ?? word.meanings?.join(', ') ?? '--'}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </PageContainer>
  );
};
