/**
 * ForgePage — zayıf kana otomatik drill (Sprint 2 D5).
 *
 * Plan: "12 zayıf kana — 4 dakikada güçlendir". Kullanıcı Forge'a
 * girer, sayfa script'ine göre weak entry listesini gösterir, "Başla"
 * deyince /practice/run?tab=weak&mode=typing'e yönlendirir.
 *
 * Forge oturumu sonu mastery delta zaten merkezî MasteryDeltaToast
 * tarafından gösterilir.
 */
import React, { useMemo } from 'react';
import { ArrowRight, Hammer } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AppLanguage } from '../../../data/appPreferences';
import { appShellRoutes } from '../../../data/appShellContent';
import { KanaScript } from '../../../features/kana/domain/kanaItem';
import { useKanaProgressStore } from '../../../features/kana/progress/progressStore';
import { getWeakKanaProgressEntries } from '../../../features/kana/review/reviewSelectors';
import { getKanaItemById } from '../../../features/kana/data/kanaInventory';
import { computeMastery, masteryBucket } from '../../../data/masterySystem';

interface ForgePageProps {
  language: AppLanguage;
}

const copyMap = {
  tr: {
    title: 'Forge — Zayıfları Güçlendir',
    sub: 'En zayıf 12 kana, hızlı bir oturumda',
    cta: 'Forge oturumu başlat',
    empty: 'Zayıf kana yok — durumun çok iyi',
    explorer: 'Letters\'a dön',
    none: 'Zayıf bulunamadı',
    minutes: 'dk'
  },
  en: {
    title: 'Forge — Strengthen Weak',
    sub: 'Top 12 weakest kana, quick session',
    cta: 'Start forge session',
    empty: 'No weak kana — you are in great shape',
    explorer: 'Back to Letters',
    none: 'No weak items',
    minutes: 'min'
  }
} as const;

const FORGE_BATCH_SIZE = 12;

export const ForgePage: React.FC<ForgePageProps> = ({ language }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const script: KanaScript =
    searchParams.get('script') === 'katakana' ? 'katakana' : 'hiragana';
  const { listByScript, getProgress } = useKanaProgressStore();
  const copy = copyMap[language];

  const weakEntries = useMemo(
    () => getWeakKanaProgressEntries(script, listByScript(script)).slice(0, FORGE_BATCH_SIZE),
    [listByScript, script]
  );

  const enriched = useMemo(
    () =>
      weakEntries.map((entry) => {
        const item = getKanaItemById(entry.kanaId);
        const progress = getProgress(entry.kanaId);
        const mastery = computeMastery(progress);
        return { item, progress, mastery, kanaId: entry.kanaId };
      }),
    [weakEntries, getProgress]
  );

  const estimateMinutes = Math.max(2, Math.ceil(weakEntries.length * 0.35));

  const start = () => {
    if (!weakEntries.length) return;
    navigate(`${appShellRoutes.practiceKanaAnswerType}?script=${script}`);
  };

  return (
    <div className="relative space-y-5 pb-12">
      <header
        className="rounded-[1.4rem] border p-5 shadow-[var(--kt-shadow-md)]"
        style={{
          borderColor: 'color-mix(in srgb, var(--kt-brand) 35%, transparent)',
          background: 'var(--kt-surface-raised)'
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: 'var(--kt-brand-soft)', color: 'var(--kt-brand)' }}
            aria-hidden="true"
          >
            <Hammer size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-black text-[var(--kt-ink-strong)]">{copy.title}</h1>
            <p className="text-sm text-[var(--kt-ink-muted)]">{copy.sub}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!weakEntries.length}
            onClick={start}
            className="kt-tap-bounce inline-flex items-center gap-2 rounded-[1rem] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] shadow-[var(--kt-shadow-md)] transition disabled:opacity-50"
            style={{
              background: 'var(--kt-brand)',
              color: 'var(--kt-brand-on)',
              boxShadow: weakEntries.length ? 'var(--kt-tomoshibi-glow)' : undefined
            }}
          >
            <span>{weakEntries.length ? copy.cta : copy.empty}</span>
            {weakEntries.length > 0 && <ArrowRight size={16} />}
          </button>
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-bold tracking-[0.08em]"
            style={{ background: 'var(--kt-surface-muted)', color: 'var(--kt-ink-muted)' }}
          >
            ~{estimateMinutes} {copy.minutes}
          </span>
        </div>
      </header>

      <section
        className="rounded-[1.4rem] border p-4"
        style={{
          borderColor: 'var(--kt-border-subtle)',
          background: 'var(--kt-surface)'
        }}
      >
        {enriched.length === 0 ? (
          <div className="py-6 text-center text-sm text-[var(--kt-ink-muted)]">
            {copy.none}
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {enriched.map(({ item, kanaId, mastery }) => {
              const bucket = masteryBucket(mastery);
              const colorByBucket: Record<string, string> = {
                cold: 'var(--kt-ink-subtle)',
                learning: 'var(--kt-accent-plum)',
                warm: 'var(--kt-accent-warning)',
                strong: 'var(--kt-brand)',
                mastered: 'var(--kt-accent-success)'
              };
              return (
                <li
                  key={kanaId}
                  className="rounded-[0.85rem] border p-3 text-center"
                  style={{
                    borderColor: colorByBucket[bucket],
                    background: 'var(--kt-surface-muted)'
                  }}
                >
                  <div
                    className="font-black"
                    style={{
                      fontFamily: 'var(--font-jp-current, inherit)',
                      fontSize: '1.8rem',
                      color: 'var(--kt-ink-strong)'
                    }}
                  >
                    {item?.char ?? kanaId}
                  </div>
                  <div
                    className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] tabular-nums"
                    style={{ color: colorByBucket[bucket] }}
                  >
                    {mastery}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div>
        <Link
          to={`${appShellRoutes.letters}?script=${script}`}
          className="text-sm font-semibold text-[var(--kt-accent-info)] underline-offset-2 hover:underline"
        >
          ← {copy.explorer}
        </Link>
      </div>
    </div>
  );
};
