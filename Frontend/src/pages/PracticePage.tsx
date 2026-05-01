import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookMarked,
  Headphones,
  PenTool,
  RefreshCcw,
  ShieldAlert,
  Shuffle,
  Sparkles,
  Type,
  X
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui';
import { AppLanguage } from '../data/appPreferences';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../data/studyContent';
import { appShellRoutes } from '../data/appShellContent';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { getKanaItemById } from '../features/kana/data/kanaInventory';
import {
  buildKanaReviewQueue,
  getKanaConfusableSets,
  getKanaGroupProgressStats,
  getWeakKanaProgressEntries
} from '../features/kana/review/reviewSelectors';

interface PracticePageProps {
  language: AppLanguage;
  focusDrill?: DrillId;
  pageVariant?: 'overview' | 'drill' | 'custom' | 'stats';
}

type DrillId = 'review' | 'weak' | 'confusable' | 'free';
type RunnableMode = 'typing' | 'drawing' | 'listening' | 'dictionary';
type DrillTone = 'warning' | 'danger' | 'plum' | 'sakura';

interface DrillDef {
  id: DrillId;
  glyph: string;
  tone: DrillTone;
  icon: React.ElementType;
}

const drills: Record<DrillId, DrillDef> = {
  review:     { id: 'review',     glyph: '復', tone: 'warning', icon: RefreshCcw  },
  weak:       { id: 'weak',       glyph: '鐙', tone: 'danger',  icon: ShieldAlert },
  confusable: { id: 'confusable', glyph: '紛', tone: 'plum',    icon: Shuffle     },
  free:       { id: 'free',       glyph: '自', tone: 'sakura',  icon: Sparkles    }
};

const toneAccent: Record<DrillTone, string> = {
  warning: '#b97155',
  danger:  '#b03a55',
  plum:    '#7a4a68',
  sakura:  '#d35d76'
};

const toneSoftBg: Record<DrillTone, string> = {
  warning: 'bg-[var(--kt-accent-warning-soft)] text-[var(--kt-accent-warning)]',
  danger:  'bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)]',
  plum:    'bg-[var(--kt-accent-plum-soft)] text-[var(--kt-accent-plum)]',
  sakura:  'bg-[var(--kt-brand-soft)] text-[var(--kt-brand)]'
};

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  spin: number;
  opacity: number;
}

const petals: Petal[] = [
  { id: 1,  left: 4,  size: 18, duration: 24, delay: -18, drift: 82,  spin: 320,  opacity: 0.55 },
  { id: 2,  left: 10, size: 12, duration: 19, delay: -7,  drift: -54, spin: -260, opacity: 0.38 },
  { id: 3,  left: 16, size: 20, duration: 27, delay: -24, drift: 96,  spin: 380,  opacity: 0.50 },
  { id: 4,  left: 22, size: 14, duration: 22, delay: -11, drift: -72, spin: -340, opacity: 0.42 },
  { id: 5,  left: 30, size: 17, duration: 25, delay: -4,  drift: 68,  spin: 300,  opacity: 0.48 },
  { id: 6,  left: 36, size: 11, duration: 18, delay: -16, drift: -44, spin: -220, opacity: 0.34 },
  { id: 7,  left: 44, size: 19, duration: 29, delay: -27, drift: 112, spin: 420,  opacity: 0.52 },
  { id: 8,  left: 51, size: 13, duration: 21, delay: -9,  drift: -64, spin: -300, opacity: 0.40 },
  { id: 9,  left: 58, size: 16, duration: 24, delay: -21, drift: 78,  spin: 360,  opacity: 0.48 },
  { id: 10, left: 65, size: 12, duration: 20, delay: -2,  drift: -50, spin: -240, opacity: 0.36 },
  { id: 11, left: 72, size: 21, duration: 30, delay: -14, drift: 118, spin: 460,  opacity: 0.50 },
  { id: 12, left: 79, size: 15, duration: 23, delay: -29, drift: -80, spin: -360, opacity: 0.44 },
  { id: 13, left: 86, size: 18, duration: 26, delay: -6,  drift: 86,  spin: 340,  opacity: 0.48 },
  { id: 14, left: 92, size: 12, duration: 19, delay: -20, drift: -58, spin: -280, opacity: 0.36 },
  { id: 15, left: 96, size: 19, duration: 27, delay: -1,  drift: 92,  spin: 390,  opacity: 0.50 }
];

interface Copy {
  eyebrowDojo: string;
  pageTitle: string;
  pageSubtitle: string;
  todayKata: string;
  whyTrain: string;
  beginTraining: string;
  pickMode: string;
  characters: string;
  due: string;
  weak: string;
  mastered: string;
  drill: Record<DrillId, string>;
  drillReason: Record<DrillId, string>;
  drillEmpty: Record<DrillId, string>;
  recordTitle: string;
  recordHint: string;
  customTitle: string;
  customHint: string;
  recordOpen: string;
  customOpen: string;
  modeTyping: string;
  modeDrawing: string;
  modeListening: string;
  modeDictionary: string;
  selectAll: string;
  clear: string;
  selectedCount: (n: number) => string;
  rowToggle: string;
  closeDrawer: string;
  recentMistakes: string;
  noMistakes: string;
  alternativesHeading: string;
  runDrill: string;
  customRun: string;
}

const copyTr: Copy = {
  eyebrowDojo: 'Kana Dojo · 道場',
  pageTitle: 'Antrenman Dojosu',
  pageSubtitle: 'Bugun ne calisman gerektigi sana zaten yazilmis. Modu sec ve mate cik.',
  todayKata: 'Bugunun kata\'si',
  whyTrain: 'Neden',
  beginTraining: 'Antrenmani baslat',
  pickMode: 'Modunu sec',
  characters: 'karakter',
  due: 'Bekleyen',
  weak: 'Zayif',
  mastered: 'Tamamlanan',
  drill: {
    review: 'Tekrar sirasi',
    weak: 'Zayif kana',
    confusable: 'Karistirilanlar',
    free: 'Serbest tur'
  },
  drillReason: {
    review: 'Bekleyen tekrarlarini temizle, hafiza takvimini koru.',
    weak: 'Cuvalladigin kana uzerine kisa odakli bir tur kos.',
    confusable: 'Birbirine benzeyen kana gruplarini netlestir.',
    free: 'Acil bir sey yok. Kendi kana havuzunla sicak kal.'
  },
  drillEmpty: {
    review: 'Bekleyen tekrar yok.',
    weak: 'Henuz zayif kana yok.',
    confusable: 'Karistirilan grup yok.',
    free: 'En az 1 kana sec.'
  },
  recordTitle: 'Antrenman raporu',
  recordHint: 'Mastery, zayif gruplar ve son hatalari tek sayfada incele.',
  customTitle: 'Ozel calisma',
  customHint: 'Kendi kana havuzunu sec ve serbest tur kos.',
  recordOpen: 'Raporu ac',
  customOpen: 'Ozel tur ac',
  modeTyping: 'Yazma',
  modeDrawing: 'Cizim',
  modeListening: 'Dinleme',
  modeDictionary: 'Sozluk',
  selectAll: 'Tumunu sec',
  clear: 'Temizle',
  selectedCount: (n) => `${n} secili`,
  rowToggle: 'Hat sec',
  closeDrawer: 'Kapat',
  recentMistakes: 'Son hatalar',
  noMistakes: 'Henuz hata kaydi yok.',
  alternativesHeading: 'Veya farkli calis',
  runDrill: 'Bu turu kos',
  customRun: 'Ozel turu baslat'
};

const copyEn: Copy = {
  eyebrowDojo: 'Kana Dojo · 道場',
  pageTitle: 'Training Dojo',
  pageSubtitle: 'Today\'s training is already written for you. Pick a mode and step onto the mat.',
  todayKata: 'Today\'s kata',
  whyTrain: 'Why',
  beginTraining: 'Begin training',
  pickMode: 'Pick a mode',
  characters: 'characters',
  due: 'Due',
  weak: 'Weak',
  mastered: 'Mastered',
  drill: {
    review: 'Review queue',
    weak: 'Weak drill',
    confusable: 'Confusables',
    free: 'Free round'
  },
  drillReason: {
    review: 'Clear what is due to keep your memory schedule honest.',
    weak: 'Short focused round on the kana that keep tripping you up.',
    confusable: 'Sharpen groups of kana that look or sound alike.',
    free: 'Nothing urgent. Stay warm with your own kana pool.'
  },
  drillEmpty: {
    review: 'No reviews due.',
    weak: 'No weak kana yet.',
    confusable: 'No confusable groups detected.',
    free: 'Pick at least 1 kana.'
  },
  recordTitle: 'Training record',
  recordHint: 'Review mastery, weak groups, and recent mistakes in one place.',
  customTitle: 'Custom drill',
  customHint: 'Pick your own kana pool and run a free round.',
  recordOpen: 'Open record',
  customOpen: 'Open custom drill',
  modeTyping: 'Typing',
  modeDrawing: 'Drawing',
  modeListening: 'Listening',
  modeDictionary: 'Dictionary',
  selectAll: 'Select all',
  clear: 'Clear',
  selectedCount: (n) => `${n} selected`,
  rowToggle: 'Toggle row',
  closeDrawer: 'Close',
  recentMistakes: 'Recent mistakes',
  noMistakes: 'No mistakes recorded yet.',
  alternativesHeading: 'Or train differently',
  runDrill: 'Run drill',
  customRun: 'Run custom drill'
};

const TODAY_GLYPH_TR = (date: Date) => {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${m}月${d}日`;
};

export const PracticePage: React.FC<PracticePageProps> = ({ language, focusDrill, pageVariant = 'overview' }) => {
  const c = language === 'tr' ? copyTr : copyEn;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedScript = searchParams.get('script');
  const script: KanaScript = requestedScript === 'katakana' ? 'katakana' : 'hiragana';

  const [activeMode, setActiveMode] = useState<RunnableMode>('typing');
  const [manualSelectedIds, setManualSelectedIds] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<'free' | 'stats' | null>(null);

  const sections = useMemo(
    () => (script === 'hiragana' ? getLocalizedHiraganaSections(language) : getLocalizedKatakanaSections(language)),
    [language, script]
  );

  const allSectionCharacterIds = useMemo(
    () =>
      Array.from(
        new Set(
          sections.flatMap((section) =>
            section.matrix.flatMap((row) =>
              row.filter((item): item is NonNullable<typeof item> => item !== null).map((item) => item.id)
            )
          )
        )
      ),
    [sections]
  );

  useEffect(() => {
    setManualSelectedIds((prev) => (prev.length > 0 ? prev : allSectionCharacterIds));
  }, [allSectionCharacterIds, script]);

  const { listByScript, summaries } = useKanaProgressStore();
  const summary = summaries[script];
  const progressEntries = listByScript(script);
  const reviewQueue = useMemo(() => buildKanaReviewQueue(script, progressEntries).slice(0, 16), [progressEntries, script]);
  const weakEntries = useMemo(() => getWeakKanaProgressEntries(script, progressEntries).slice(0, 16), [progressEntries, script]);
  const confusableSets = useMemo(() => getKanaConfusableSets(script, progressEntries).slice(0, 6), [progressEntries, script]);
  const groupStats = useMemo(() => getKanaGroupProgressStats(sections, progressEntries).slice(0, 8), [progressEntries, sections]);

  const drillCount = (id: DrillId): number => {
    switch (id) {
      case 'review': return reviewQueue.length;
      case 'weak': return weakEntries.length;
      case 'confusable': return confusableSets.length;
      case 'free': return manualSelectedIds.length;
    }
  };

  const drillPool = (id: DrillId): string[] => {
    switch (id) {
      case 'review': return reviewQueue.map((e) => e.kanaId);
      case 'weak': return weakEntries.map((e) => e.kanaId);
      case 'confusable': return Array.from(new Set(confusableSets.flatMap((set) => set.kanaIds)));
      case 'free': return manualSelectedIds;
    }
  };

  const recommendedId: DrillId =
    reviewQueue.length > 0 ? 'review' : weakEntries.length > 0 ? 'weak' : 'free';
  const primaryDrillId = focusDrill ?? recommendedId;
  const primaryPool = primaryDrillId === 'free' ? manualSelectedIds : drillPool(primaryDrillId);
  const primaryCharacterCount =
    primaryDrillId === 'free' && primaryPool.length === 0 ? allSectionCharacterIds.length : primaryPool.length;

  const setScript = (next: KanaScript) => setSearchParams({ script: next });

  const runDrill = (id: DrillId, idsOverride?: string[]) => {
    const itemIds = idsOverride ?? drillPool(id);
    if (itemIds.length === 0) return;
    const params = new URLSearchParams();
    params.set('script', script);
    params.set('tab', id);
    params.set('mode', activeMode);
    if (id === 'free') params.set('ids', itemIds.join(','));
    const runRouteByMode: Record<RunnableMode, string> = {
      typing: appShellRoutes.practiceKanaAnswerTypeRun,
      drawing: appShellRoutes.practiceKanaDrawingRun,
      listening: appShellRoutes.practiceKanaListeningRun,
      dictionary: appShellRoutes.practiceKanaFlashcardsRun
    };
    navigate(`${runRouteByMode[activeMode]}?${params.toString()}`);
  };

  const beginPrimary = () => {
    if (primaryDrillId === 'free') {
      runDrill('free', primaryPool.length > 0 ? primaryPool : allSectionCharacterIds);
    } else {
      runDrill(primaryDrillId);
    }
  };

  const onAlternative = (id: DrillId) => {
    if (id === 'free') {
      setDrawer('free');
      return;
    }
    runDrill(id);
  };

  const heroBackdropChars = useMemo(
    () => primaryPool.slice(0, 12).map((id) => getKanaItemById(id)?.char ?? '').filter(Boolean),
    [primaryPool]
  );

  const drillTitle = (id: DrillId) =>
    id === 'review'
      ? language === 'tr'
        ? `${primaryCharacterCount} bekleyen kana`
        : `${primaryCharacterCount} due kana`
      : id === 'weak'
        ? language === 'tr'
          ? `${primaryCharacterCount} zayif kana`
          : `${primaryCharacterCount} weak kana`
        : id === 'confusable'
          ? language === 'tr'
            ? `${drillCount('confusable')} karistirilan grup`
            : `${drillCount('confusable')} confusable groups`
          : language === 'tr'
            ? 'Serbest tur'
            : 'Free round';

  const modes: { id: RunnableMode; label: string; icon: React.ElementType; glyph: string }[] = [
    { id: 'typing',     label: c.modeTyping,     icon: Type,       glyph: '字' },
    { id: 'drawing',    label: c.modeDrawing,    icon: PenTool,    glyph: '書' },
    { id: 'listening',  label: c.modeListening,  icon: Headphones, glyph: '聴' },
    { id: 'dictionary', label: c.modeDictionary, icon: BookMarked, glyph: '辞' }
  ];

  const todayLabel = TODAY_GLYPH_TR(new Date());
  const isCustomPage = pageVariant === 'custom';
  const isStatsPage = pageVariant === 'stats';
  const pageTitle = isStatsPage
    ? c.recordTitle
    : isCustomPage
      ? c.customTitle
      : focusDrill
        ? c.drill[focusDrill]
        : c.pageTitle;
  const pageSubtitle = isStatsPage
    ? c.recordHint
    : isCustomPage
      ? c.customHint
      : focusDrill
        ? c.drillReason[focusDrill]
        : c.pageSubtitle;

  const alternatives: DrillId[] = (['review', 'weak', 'confusable', 'free'] as DrillId[]).filter(
    (id) => id !== primaryDrillId
  );

  return (
    <div className="kt-dojo-page relative min-h-screen w-full overflow-hidden">
      <DojoStyles />
      <DojoAtmosphere />
      <DojoPetals />

      <main className="relative z-10 mx-auto w-full max-w-[1100px] px-4 pt-5 pb-12 sm:px-6 lg:pt-7">
        {/* Header strip */}
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--kt-brand)]">
              {c.eyebrowDojo}
            </div>
            <h1 className="mt-1 text-[1.85rem] font-black tracking-[-0.01em] text-[var(--kt-ink-strong)] md:text-[2.1rem]">
              {pageTitle}
            </h1>
            <p className="mt-1 max-w-xl text-sm leading-6 text-[var(--kt-ink-muted)]">{pageSubtitle}</p>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <ScriptSwitch value={script} onChange={setScript} />
            <div className="flex flex-wrap items-center gap-1.5">
              <StatusPip icon={<RefreshCcw size={12} />}  label={c.due}      value={summary.dueCount}      tone="warning" />
              <StatusPip icon={<ShieldAlert size={12} />} label={c.weak}     value={summary.weakCount}     tone="danger"  />
              <StatusPip icon={<Sparkles size={12} />}    label={c.mastered} value={summary.masteredCount} tone="success" />
            </div>
          </div>
        </header>

        {isStatsPage ? (
          <TrainingRecordPanel c={c} groupStats={groupStats} weakEntries={weakEntries} />
        ) : isCustomPage ? (
          <CustomDrillPagePanel
            c={c}
            script={script}
            activeMode={activeMode}
            modes={modes}
            onChangeMode={setActiveMode}
            sections={sections}
            allIds={allSectionCharacterIds}
            selectedIds={manualSelectedIds}
            setSelectedIds={setManualSelectedIds}
            onRun={() => runDrill('free')}
          />
        ) : (
          <>
        {/* HERO — today's kata */}
        <TodayKata
          c={c}
          tone={drills[primaryDrillId].tone}
          glyph={drills[primaryDrillId].glyph}
          drillName={c.drill[primaryDrillId]}
          drillTitle={drillTitle(primaryDrillId)}
          reason={c.drillReason[primaryDrillId]}
          backdropChars={heroBackdropChars}
          script={script}
          characters={primaryCharacterCount}
          todayLabel={todayLabel}
          modes={modes}
          activeMode={activeMode}
          onChangeMode={setActiveMode}
          onBegin={beginPrimary}
          canBegin={primaryCharacterCount > 0}
          empty={primaryCharacterCount === 0 ? c.drillEmpty[primaryDrillId] : null}
        />

        {/* Alternatives row */}
        <section className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="font-jp text-base font-black text-[var(--kt-dan-gold)] opacity-80">他</span>
            <h2 className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--kt-ink-subtle)]">
              {c.alternativesHeading}
            </h2>
            <div className="h-px flex-1 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--kt-brand)_50%,transparent),transparent)] opacity-40" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {alternatives.map((id) => (
              <AlternativeChip
                key={id}
                def={drills[id]}
                title={c.drill[id]}
                desc={c.drillReason[id]}
                count={drillCount(id)}
                emptyText={drillCount(id) === 0 ? c.drillEmpty[id] : null}
                runLabel={id === 'free' ? c.customOpen : c.runDrill}
                onAction={() => onAlternative(id)}
              />
            ))}
            <RecordChip
              title={c.recordTitle}
              tracked={summary.tracked}
              recordOpen={c.recordOpen}
              onOpen={() => setDrawer('stats')}
            />
          </div>
        </section>
          </>
        )}
      </main>

      {drawer === 'free' ? (
        <CustomDrillDrawer
          c={c}
          script={script}
          activeMode={activeMode}
          modes={modes}
          onChangeMode={setActiveMode}
          sections={sections}
          allIds={allSectionCharacterIds}
          selectedIds={manualSelectedIds}
          setSelectedIds={setManualSelectedIds}
          onClose={() => setDrawer(null)}
          onRun={() => {
            setDrawer(null);
            runDrill('free');
          }}
        />
      ) : null}

      {drawer === 'stats' ? (
        <TrainingRecordDrawer
          c={c}
          groupStats={groupStats}
          weakEntries={weakEntries}
          onClose={() => setDrawer(null)}
        />
      ) : null}
    </div>
  );
};

/* ============================ HERO ============================ */

interface TodayKataProps {
  c: Copy;
  tone: DrillTone;
  glyph: string;
  drillName: string;
  drillTitle: string;
  reason: string;
  backdropChars: string[];
  script: KanaScript;
  characters: number;
  todayLabel: string;
  modes: { id: RunnableMode; label: string; icon: React.ElementType; glyph: string }[];
  activeMode: RunnableMode;
  onChangeMode: (next: RunnableMode) => void;
  onBegin: () => void;
  canBegin: boolean;
  empty: string | null;
}

const TodayKata: React.FC<TodayKataProps> = ({
  c,
  tone,
  glyph,
  drillName,
  drillTitle,
  reason,
  backdropChars,
  script,
  characters,
  todayLabel,
  modes,
  activeMode,
  onChangeMode,
  onBegin,
  canBegin,
  empty
}) => {
  const accent = toneAccent[tone];
  return (
    <section
      className="relative mt-6 overflow-hidden rounded-[1.75rem] border"
      style={{
        background:
          'radial-gradient(circle at 88% 12%, color-mix(in srgb, var(--kt-dan-gold-soft) 70%, transparent), transparent 58%), linear-gradient(155deg, color-mix(in srgb, var(--kt-brand-soft) 60%, transparent), color-mix(in srgb, var(--kt-surface) 55%, transparent) 60%, color-mix(in srgb, var(--kt-dan-gold-soft) 50%, transparent))',
        borderColor: `color-mix(in srgb, ${accent} 30%, transparent)`,
        boxShadow: '0 22px 60px rgba(132, 82, 62, 0.16)'
      }}
    >
      {/* Diagonal kana backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 grid grid-cols-6 items-center justify-items-center gap-2 opacity-[0.07]"
          style={{ transform: 'rotate(-8deg) scale(1.4)' }}
          aria-hidden
        >
          {Array.from({ length: 18 }).map((_, idx) => (
            <span
              key={idx}
              className="font-jp font-black leading-none text-[var(--kt-ink-strong)]"
              style={{ fontSize: `${4 + ((idx * 0.6) % 3)}rem` }}
            >
              {backdropChars[idx % Math.max(1, backdropChars.length)] || '・'}
            </span>
          ))}
        </div>
      </div>

      {/* Hanko seal */}
      <div
        aria-hidden
        className="absolute right-5 top-5 hidden h-14 w-14 items-center justify-center rounded-[0.55rem] border-[3px] font-jp text-[1.4rem] font-black md:flex"
        style={{
          color: '#b03a55',
          borderColor: '#b03a55',
          background: 'color-mix(in srgb, #b03a55 6%, transparent)',
          transform: 'rotate(6deg)'
        }}
      >
        稽
      </div>

      <div className="relative px-5 py-6 md:px-9 md:py-8">
        {/* Eyebrow */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]"
            style={{
              borderColor: `color-mix(in srgb, ${accent} 35%, transparent)`,
              background: 'color-mix(in srgb, var(--kt-surface) 70%, transparent)',
              color: accent
            }}
          >
            <span className="font-jp text-[12px] leading-none">本日の稽古</span>
            <span>·</span>
            <span>{c.todayKata}</span>
          </span>
          <span className="font-jp text-xs font-black text-[var(--kt-ink-subtle)] tracking-[0.1em]">
            {todayLabel}
          </span>
        </div>

        {/* Drill body */}
        <div className="mt-4 grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start lg:gap-7">
          {/* Big glyph plinth */}
          <div className="flex items-start gap-4 lg:flex-col lg:items-stretch">
            <div
              className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.4rem] border-[5px] text-white md:h-28 md:w-28"
              style={{
                background: `linear-gradient(145deg, color-mix(in srgb, ${accent} 80%, white 8%), ${accent})`,
                borderColor: 'color-mix(in srgb, white 80%, transparent)',
                boxShadow: `0 10px 0 color-mix(in srgb, ${accent} 70%, black), 0 22px 32px color-mix(in srgb, ${accent} 30%, transparent)`
              }}
            >
              <span className="absolute inset-[5px] rounded-[1rem] border border-white/55 bg-white/10" />
              <span className="relative font-jp text-[3rem] font-black leading-none md:text-[3.4rem]">{glyph}</span>
            </div>
            <div className="lg:hidden">
              <div className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: accent }}>
                {drillName}
              </div>
              <div className="mt-1 text-2xl font-black leading-tight text-[var(--kt-ink-strong)]">{drillTitle}</div>
            </div>
          </div>

          {/* Title + reason + meta + modes + CTA */}
          <div className="min-w-0">
            <div className="hidden lg:block">
              <div className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: accent }}>
                {drillName}
              </div>
              <div className="mt-1 text-[2rem] font-black leading-[1.05] tracking-[-0.01em] text-[var(--kt-ink-strong)] md:text-[2.4rem]">
                {drillTitle}
              </div>
            </div>

            <div className="mt-2 flex items-start gap-2 text-sm leading-6 text-[var(--kt-ink-muted)] lg:mt-3">
              <span className="mt-0.5 inline-flex h-5 items-center rounded-full bg-[var(--kt-surface-muted)] px-2 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
                {c.whyTrain}
              </span>
              <p className="min-w-0 flex-1">{empty ?? reason}</p>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
              <DotChip>{script === 'hiragana' ? 'Hiragana' : 'Katakana'}</DotChip>
              <DotChip>
                {characters} {c.characters}
              </DotChip>
              <DotChip>{drillName}</DotChip>
            </div>

            {/* Modes */}
            <div className="mt-5">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--kt-ink-subtle)]">
                {c.pickMode}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {modes.map((m) => {
                  const Icon = m.icon;
                  const active = activeMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onChangeMode(m.id)}
                      aria-pressed={active}
                      className={`group relative overflow-hidden rounded-2xl border px-3 py-3 text-left transition ${
                        active
                          ? 'border-[color:var(--kt-brand)]/60 bg-[var(--kt-brand)] text-[var(--kt-brand-on)] shadow-[0_8px_22px_rgba(196,93,79,0.22)]'
                          : 'border-[var(--kt-border-subtle)] bg-[color-mix(in_srgb,var(--kt-surface)_72%,transparent)] text-[var(--kt-ink-strong)] hover:bg-[var(--kt-surface-muted)]'
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute -bottom-3 -right-2 font-jp text-[3.6rem] font-black leading-none ${
                          active ? 'text-[var(--kt-brand-on)]/22' : 'text-[var(--kt-ink-strong)]/10'
                        }`}
                      >
                        {m.glyph}
                      </span>
                      <Icon size={18} />
                      <div className="relative mt-2 text-sm font-black">{m.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-5 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
              <Button
                as="button"
                type="button"
                size="lg"
                onClick={onBegin}
                disabled={!canBegin}
                iconEnd={<ArrowRight size={18} />}
                className="sm:min-w-[16rem]"
              >
                {c.beginTraining}
              </Button>
              <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
                {modes.find((m) => m.id === activeMode)?.label} · {characters} {c.characters}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================ ALTERNATIVES ============================ */

const AlternativeChip: React.FC<{
  def: DrillDef;
  title: string;
  desc: string;
  count: number;
  emptyText: string | null;
  runLabel: string;
  onAction: () => void;
}> = ({ def, title, desc, count, emptyText, runLabel, onAction }) => {
  const Icon = def.icon;
  const accent = toneAccent[def.tone];
  const disabled = emptyText !== null && def.id !== 'free';
  return (
    <button
      type="button"
      onClick={onAction}
      disabled={disabled}
      className={`group relative overflow-hidden rounded-[1.1rem] border bg-[color-mix(in_srgb,var(--kt-surface)_85%,transparent)] p-4 text-left transition ${
        disabled
          ? 'border-[var(--kt-border-subtle)] opacity-60'
          : 'border-[var(--kt-border-subtle)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(132,82,62,0.14)]'
      }`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-3 -right-2 select-none font-jp text-[5rem] font-black leading-none opacity-[0.07]"
        style={{ color: accent }}
      >
        {def.glyph}
      </span>
      <div className="relative flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-[3px] text-white"
          style={{
            background: `linear-gradient(145deg, color-mix(in srgb, ${accent} 80%, white 6%), ${accent})`,
            borderColor: 'color-mix(in srgb, white 75%, transparent)',
            boxShadow: `0 5px 0 color-mix(in srgb, ${accent} 70%, black)`
          }}
        >
          <span className="font-jp text-xl font-black leading-none">{def.glyph}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-black tracking-[-0.01em] text-[var(--kt-ink-strong)]">{title}</span>
            <span
              className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-black tabular-nums"
              style={{ background: `color-mix(in srgb, ${accent} 18%, transparent)`, color: accent }}
            >
              {count}
            </span>
          </div>
          <p className="mt-0.5 line-clamp-2 text-[12px] leading-5 text-[var(--kt-ink-muted)]">
            {emptyText ?? desc}
          </p>
          <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.14em]" style={{ color: accent }}>
            <Icon size={12} />
            <span>{runLabel}</span>
            <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </button>
  );
};

const RecordChip: React.FC<{
  title: string;
  tracked: number;
  recordOpen: string;
  onOpen: () => void;
}> = ({ title, tracked, recordOpen, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    className="group relative overflow-hidden rounded-[1.1rem] border border-[var(--kt-border-subtle)] bg-[color-mix(in_srgb,var(--kt-surface)_85%,transparent)] p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(132,82,62,0.14)]"
  >
    <span
      aria-hidden
      className="pointer-events-none absolute -bottom-3 -right-2 select-none font-jp text-[5rem] font-black leading-none text-[var(--kt-accent-info)]/10"
    >
      録
    </span>
    <div className="relative flex items-start gap-3">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-[3px] text-white"
        style={{
          background: 'linear-gradient(145deg,#dd8b9c,#a44a5e)',
          borderColor: 'color-mix(in srgb, white 75%, transparent)',
          boxShadow: '0 5px 0 #7e3346'
        }}
      >
        <span className="font-jp text-xl font-black leading-none">録</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-black tracking-[-0.01em] text-[var(--kt-ink-strong)]">{title}</span>
          <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--kt-accent-info-soft)] px-1.5 text-[10px] font-black tabular-nums text-[var(--kt-accent-info)]">
            {tracked}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-[12px] leading-5 text-[var(--kt-ink-muted)]">
          記録 · mastery, weak groups, mistakes
        </p>
        <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--kt-accent-info)]">
          <BarChart3 size={12} />
          <span>{recordOpen}</span>
          <ArrowRight size={12} />
        </div>
      </div>
    </div>
  </button>
);

/* ============================ ATMOSPHERE ============================ */

const DojoStyles: React.FC = () => (
  <style>{`
    @keyframes kt-dojo-petal-fall {
      0%   { transform: translate3d(0, -9rem, 0) rotate(0deg); opacity: 0; }
      8%   { opacity: var(--kt-dojo-petal-opacity, 0.5); }
      42%  { transform: translate3d(var(--kt-dojo-petal-drift), 44vh, 0) rotate(var(--kt-dojo-petal-mid-spin)); }
      78%  { opacity: var(--kt-dojo-petal-opacity, 0.5); }
      100% { transform: translate3d(calc(var(--kt-dojo-petal-drift) * -0.35), 1180px, 0) rotate(var(--kt-dojo-petal-spin)); opacity: 0; }
    }
    .kt-dojo-petal {
      position: absolute; top: 0; display: block;
      filter: drop-shadow(0 4px 7px rgba(190,70,95,0.14));
      transform: translate3d(0, -9rem, 0);
      animation: kt-dojo-petal-fall linear infinite;
      will-change: transform, opacity;
    }
    @media (prefers-reduced-motion: reduce) {
      .kt-dojo-petal { animation: none; opacity: 0; }
    }
  `}</style>
);

const DojoAtmosphere: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
    <div className="absolute -left-32 top-12 h-[22rem] w-[22rem] rounded-full bg-[color-mix(in_srgb,var(--kt-brand)_22%,transparent)] blur-3xl" />
    <div className="absolute -right-24 top-40 h-[18rem] w-[18rem] rounded-full bg-[color-mix(in_srgb,var(--kt-dan-gold)_28%,transparent)] blur-3xl" />
    <div className="absolute left-1/2 bottom-10 h-[20rem] w-[28rem] -translate-x-1/2 rounded-full bg-[color-mix(in_srgb,var(--kt-accent-plum)_18%,transparent)] blur-3xl" />
    <div className="pointer-events-none absolute right-6 bottom-2 select-none font-jp text-[12rem] font-black leading-none text-[var(--kt-brand)]/10">
      道場
    </div>
    <div className="pointer-events-none absolute left-4 top-1 select-none font-jp text-[5rem] font-black leading-none text-[var(--kt-dan-gold)]/14">
      稽古
    </div>
  </div>
);

const DojoPetals: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden" aria-hidden>
    {petals.map((petal) => (
      <span
        key={petal.id}
        className="kt-dojo-petal"
        style={
          {
            left: `${petal.left}%`,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
            opacity: petal.opacity,
            ['--kt-dojo-petal-opacity' as string]: petal.opacity,
            ['--kt-dojo-petal-drift' as string]: `${petal.drift}px`,
            ['--kt-dojo-petal-mid-spin' as string]: `${petal.spin * 0.48}deg`,
            ['--kt-dojo-petal-spin' as string]: `${petal.spin}deg`
          } as React.CSSProperties
        }
      >
        <PetalSvg size={petal.size} />
      </span>
    ))}
  </div>
);

const PetalSvg: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className="block">
    <g fill="#f56f93">
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse key={angle} cx="12" cy="6.4" rx="3.2" ry="5.2" transform={`rotate(${angle} 12 12)`} opacity={0.9} />
      ))}
    </g>
    <circle cx="12" cy="12" r="1.7" fill="#fff6d6" opacity={0.92} />
  </svg>
);

/* ============================ SHARED CHIPS ============================ */

const ScriptSwitch: React.FC<{ value: KanaScript; onChange: (next: KanaScript) => void }> = ({ value, onChange }) => (
  <div className="inline-flex items-center rounded-full border border-[var(--kt-border-subtle)] bg-[color-mix(in_srgb,var(--kt-surface)_70%,transparent)] p-1 backdrop-blur-sm">
    {(['hiragana', 'katakana'] as KanaScript[]).map((s) => {
      const active = value === s;
      return (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={`rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] transition ${
            active ? 'bg-[var(--kt-brand)] text-[var(--kt-brand-on)]' : 'text-[var(--kt-ink-muted)] hover:bg-[var(--kt-surface-muted)]'
          }`}
        >
          {s === 'hiragana' ? 'Hiragana' : 'Katakana'}
        </button>
      );
    })}
  </div>
);

const StatusPip: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: 'warning' | 'danger' | 'success';
}> = ({ icon, label, value, tone }) => {
  const toneClass =
    tone === 'warning'
      ? 'text-[var(--kt-accent-warning)] bg-[var(--kt-accent-warning-soft)]'
      : tone === 'danger'
        ? 'text-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)]'
        : 'text-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)]';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${toneClass}`}>
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/55">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-[0.14em] opacity-80">{label}</span>
      <span className="text-sm font-black tabular-nums">{value}</span>
    </span>
  );
};

const DotChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--kt-surface)_60%,transparent)] px-2.5 py-1">
    <span className="h-1.5 w-1.5 rounded-full bg-[var(--kt-dan-gold)]" />
    {children}
  </span>
);

const CustomDrillPagePanel: React.FC<Omit<CustomDrillDrawerProps, 'onClose'>> = ({
  c,
  script,
  activeMode,
  modes,
  onChangeMode,
  sections,
  allIds,
  selectedIds,
  setSelectedIds,
  onRun
}) => (
  <section className="mt-6 overflow-hidden rounded-[1.4rem] border border-[var(--kt-border-subtle)] bg-[color-mix(in_srgb,var(--kt-surface)_88%,transparent)] shadow-[0_16px_40px_rgba(132,82,62,0.14)]">
    <div className="flex flex-wrap items-center gap-2 border-b border-[var(--kt-border-subtle)] px-5 py-4">
      <span className="rounded-full bg-[var(--kt-accent-info-soft)] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--kt-accent-info)]">
        {c.selectedCount(selectedIds.length)}
      </span>
      <Button as="button" type="button" variant="secondary" size="sm" onClick={() => setSelectedIds(allIds)}>
        {c.selectAll}
      </Button>
      <Button as="button" type="button" variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
        {c.clear}
      </Button>
      <span className="ml-auto text-[11px] text-[var(--kt-ink-subtle)]">
        {script === 'hiragana' ? 'Hiragana' : 'Katakana'}
      </span>
    </div>

    <div className="grid gap-5 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="space-y-5">
        {sections.map((section) => {
          const sectionIds = section.matrix.flatMap((row) =>
            row.filter((cell): cell is NonNullable<typeof cell> => cell !== null).map((cell) => cell.id)
          );
          const allSelected = sectionIds.every((id) => selectedIds.includes(id));
          return (
            <div key={section.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-subtle)]">
                  {section.title}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedIds((prev) =>
                      allSelected
                        ? prev.filter((id) => !sectionIds.includes(id))
                        : Array.from(new Set([...prev, ...sectionIds]))
                    )
                  }
                  className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--kt-brand)] hover:underline"
                >
                  {c.rowToggle}
                </button>
              </div>
              {section.matrix.map((row, rowIndex) => (
                <div
                  key={`${section.id}-${rowIndex}`}
                  className="grid gap-1.5"
                  style={{ gridTemplateColumns: `repeat(${Math.max(row.length, 1)}, minmax(0, 1fr))` }}
                >
                  {row.map((cell, columnIndex) => {
                    if (!cell) {
                      return (
                        <div
                          key={`empty-${section.id}-${rowIndex}-${columnIndex}`}
                          className="border-b border-dashed border-[var(--kt-border-subtle)] opacity-30"
                        />
                      );
                    }
                    const item = getKanaItemById(cell.id);
                    const selected = selectedIds.includes(cell.id);
                    return (
                      <button
                        key={cell.id}
                        type="button"
                        onClick={() =>
                          setSelectedIds((prev) =>
                            selected ? prev.filter((id) => id !== cell.id) : [...prev, cell.id]
                          )
                        }
                        className={`group rounded-xl border px-2 py-2 text-center transition ${
                          selected
                            ? 'border-[color:var(--kt-brand)]/45 bg-[var(--kt-brand-soft)] text-[var(--kt-brand)] shadow-[0_4px_12px_rgba(196,93,79,0.16)]'
                            : 'border-transparent text-[var(--kt-ink-muted)] hover:bg-[var(--kt-surface-muted)]'
                        }`}
                      >
                        <div className="font-jp text-xl font-black leading-none text-[var(--kt-ink-strong)]">
                          {item?.char ?? '?'}
                        </div>
                        <div className="mt-1 text-[10px] font-black uppercase tracking-[0.08em] text-[var(--kt-ink-subtle)]">
                          {item?.romaji ?? cell.id}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <aside className="rounded-[1rem] border border-[var(--kt-border-subtle)] bg-[color-mix(in_srgb,var(--kt-surface)_72%,transparent)] p-4">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--kt-ink-subtle)]">
          {c.pickMode}
        </div>
        <div className="mt-3 grid gap-2">
          {modes.map((m) => {
            const Icon = m.icon;
            const active = activeMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onChangeMode(m.id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-black transition ${
                  active
                    ? 'border-[color:var(--kt-brand)]/55 bg-[var(--kt-brand)] text-[var(--kt-brand-on)]'
                    : 'border-[var(--kt-border-subtle)] bg-[color-mix(in_srgb,var(--kt-surface)_70%,transparent)] text-[var(--kt-ink-strong)] hover:bg-[var(--kt-surface-muted)]'
                }`}
              >
                <Icon size={15} />
                {m.label}
              </button>
            );
          })}
        </div>
        <Button
          as="button"
          type="button"
          size="md"
          onClick={onRun}
          disabled={selectedIds.length === 0}
          iconEnd={<ArrowRight size={16} />}
          className="mt-4 w-full"
        >
          {c.customRun}
        </Button>
      </aside>
    </div>
  </section>
);

const TrainingRecordPanel: React.FC<Omit<TrainingRecordDrawerProps, 'onClose'>> = ({ c, groupStats, weakEntries }) => (
  <section className="mt-6 overflow-hidden rounded-[1.4rem] border border-[var(--kt-border-subtle)] bg-[color-mix(in_srgb,var(--kt-surface)_88%,transparent)] shadow-[0_16px_40px_rgba(132,82,62,0.14)]">
    <div className="grid gap-7 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div>
        <div className="space-y-3">
          {groupStats.map((group) => {
            const masteredPercent = group.total > 0 ? Math.round((group.mastered / group.total) * 100) : 0;
            return (
              <div key={group.groupId} className="border-b border-[var(--kt-border-subtle)] pb-3 last:border-b-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <div className="text-base font-black text-[var(--kt-ink-strong)]">{group.groupLabel}</div>
                    <div className="text-xs text-[var(--kt-ink-muted)]">{group.sectionTitle}</div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
                    <span>{group.mastered}/{group.total}</span>
                    {group.due > 0 ? (
                      <span className="rounded-full bg-[var(--kt-accent-warning-soft)] px-2 py-0.5 text-[var(--kt-accent-warning)]">
                        {c.due} {group.due}
                      </span>
                    ) : null}
                    {group.weak > 0 ? (
                      <span className={`rounded-full px-2 py-0.5 ${toneSoftBg.danger}`}>
                        {c.weak} {group.weak}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--kt-progress-track)]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--kt-brand),var(--kt-dan-gold))] transition-[width]"
                    style={{ width: `${masteredPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <aside>
        <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--kt-accent-plum)]">
          {c.recentMistakes}
        </div>
        {weakEntries.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {weakEntries.slice(0, 14).map((entry) => {
              const item = getKanaItemById(entry.kanaId);
              return (
                <span
                  key={entry.kanaId}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--kt-accent-danger)]/35 bg-[var(--kt-accent-danger-soft)] px-2.5 py-1.5"
                >
                  <span className="font-jp text-base font-black leading-none text-[var(--kt-ink-strong)]">
                    {item?.char ?? '?'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--kt-ink-muted)]">
                    {item?.romaji ?? entry.kanaId} Ã—{entry.timesWrong}
                  </span>
                </span>
              );
            })}
          </div>
        ) : (
          <div className="mt-3 text-sm text-[var(--kt-ink-muted)]">{c.noMistakes}</div>
        )}
      </aside>
    </div>
  </section>
);

/* ============================ DRAWERS ============================ */

interface CustomDrillDrawerProps {
  c: Copy;
  script: KanaScript;
  activeMode: RunnableMode;
  modes: { id: RunnableMode; label: string; icon: React.ElementType; glyph: string }[];
  onChangeMode: (next: RunnableMode) => void;
  sections: ReturnType<typeof getLocalizedHiraganaSections>;
  allIds: string[];
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  onClose: () => void;
  onRun: () => void;
}

const CustomDrillDrawer: React.FC<CustomDrillDrawerProps> = ({
  c,
  script,
  activeMode,
  modes,
  onChangeMode,
  sections,
  allIds,
  selectedIds,
  setSelectedIds,
  onClose,
  onRun
}) => (
  <div className="fixed inset-0 z-40 flex items-end justify-center" role="dialog" aria-modal="true">
    <button
      type="button"
      aria-label={c.closeDrawer}
      onClick={onClose}
      className="absolute inset-0 bg-[rgba(31,43,59,0.42)] backdrop-blur-sm"
    />
    <div
      className="relative mx-auto flex w-full max-w-[1100px] flex-col overflow-hidden rounded-t-[1.6rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] shadow-[0_-20px_50px_rgba(132,82,62,0.22)]"
      style={{ maxHeight: '82vh' }}
    >
      <header className="flex items-center justify-between border-b border-[var(--kt-border-subtle)] px-5 py-3">
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--kt-brand)]">
            自由稽古 · {c.drill.free}
          </div>
          <h2 className="mt-0.5 text-lg font-black text-[var(--kt-ink-strong)]">{c.customTitle}</h2>
        </div>
        <button
          type="button"
          aria-label={c.closeDrawer}
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--kt-ink-muted)] hover:bg-[var(--kt-surface-muted)]"
        >
          <X size={16} />
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--kt-border-subtle)] px-5 py-3">
        <span className="rounded-full bg-[var(--kt-accent-info-soft)] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--kt-accent-info)]">
          {c.selectedCount(selectedIds.length)}
        </span>
        <Button as="button" type="button" variant="secondary" size="sm" onClick={() => setSelectedIds(allIds)}>
          {c.selectAll}
        </Button>
        <Button as="button" type="button" variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
          {c.clear}
        </Button>
        <span className="ml-auto text-[11px] text-[var(--kt-ink-subtle)]">
          {script === 'hiragana' ? 'Hiragana' : 'Katakana'}
        </span>
      </div>

      <div className="overflow-auto px-5 py-4">
        <p className="text-sm text-[var(--kt-ink-muted)]">{c.customHint}</p>
        <div className="mt-4 space-y-5">
          {sections.map((section) => {
            const sectionIds = section.matrix.flatMap((row) =>
              row.filter((cell): cell is NonNullable<typeof cell> => cell !== null).map((cell) => cell.id)
            );
            const allSelected = sectionIds.every((id) => selectedIds.includes(id));
            return (
              <div key={section.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-subtle)]">
                    {section.title}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedIds((prev) =>
                        allSelected
                          ? prev.filter((id) => !sectionIds.includes(id))
                          : Array.from(new Set([...prev, ...sectionIds]))
                      )
                    }
                    className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--kt-brand)] hover:underline"
                  >
                    {c.rowToggle}
                  </button>
                </div>
                {section.matrix.map((row, rowIndex) => (
                  <div
                    key={`${section.id}-${rowIndex}`}
                    className="grid gap-1.5"
                    style={{ gridTemplateColumns: `repeat(${Math.max(row.length, 1)}, minmax(0, 1fr))` }}
                  >
                    {row.map((cell, columnIndex) => {
                      if (!cell) {
                        return (
                          <div
                            key={`empty-${section.id}-${rowIndex}-${columnIndex}`}
                            className="border-b border-dashed border-[var(--kt-border-subtle)] opacity-30"
                          />
                        );
                      }
                      const itemId = cell.id;
                      const item = getKanaItemById(itemId);
                      const selected = selectedIds.includes(itemId);
                      return (
                        <button
                          key={itemId}
                          type="button"
                          onClick={() =>
                            setSelectedIds((prev) =>
                              selected ? prev.filter((id) => id !== itemId) : [...prev, itemId]
                            )
                          }
                          className={`group rounded-xl border px-2 py-2 text-center transition ${
                            selected
                              ? 'border-[color:var(--kt-brand)]/45 bg-[var(--kt-brand-soft)] text-[var(--kt-brand)] shadow-[0_4px_12px_rgba(196,93,79,0.16)]'
                              : 'border-transparent text-[var(--kt-ink-muted)] hover:bg-[var(--kt-surface-muted)]'
                          }`}
                        >
                          <div className="font-jp text-xl font-black leading-none text-[var(--kt-ink-strong)]">
                            {item?.char ?? '?'}
                          </div>
                          <div className="mt-1 text-[10px] font-black uppercase tracking-[0.08em] text-[var(--kt-ink-subtle)]">
                            {item?.romaji ?? itemId}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[var(--kt-border-subtle)] bg-[color-mix(in_srgb,var(--kt-surface)_88%,transparent)] px-5 py-3 backdrop-blur-md md:flex md:items-center md:justify-between md:gap-4">
        <div className="grid grid-cols-4 gap-1.5 md:max-w-md md:flex-1">
          {modes.map((m) => {
            const Icon = m.icon;
            const active = activeMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onChangeMode(m.id)}
                aria-pressed={active}
                className={`group inline-flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-[11px] font-black transition ${
                  active
                    ? 'border-[color:var(--kt-brand)]/55 bg-[var(--kt-brand)] text-[var(--kt-brand-on)]'
                    : 'border-[var(--kt-border-subtle)] bg-[color-mix(in_srgb,var(--kt-surface)_70%,transparent)] text-[var(--kt-ink-strong)] hover:bg-[var(--kt-surface-muted)]'
                }`}
              >
                <Icon size={13} />
                {m.label}
              </button>
            );
          })}
        </div>
        <Button
          as="button"
          type="button"
          size="md"
          onClick={onRun}
          disabled={selectedIds.length === 0}
          iconEnd={<ArrowRight size={16} />}
          className="mt-3 w-full md:mt-0 md:w-auto md:min-w-[12rem]"
        >
          {c.customRun}
        </Button>
      </div>
    </div>
  </div>
);

interface TrainingRecordDrawerProps {
  c: Copy;
  groupStats: ReturnType<typeof getKanaGroupProgressStats>;
  weakEntries: ReturnType<typeof getWeakKanaProgressEntries>;
  onClose: () => void;
}

const TrainingRecordDrawer: React.FC<TrainingRecordDrawerProps> = ({ c, groupStats, weakEntries, onClose }) => (
  <div className="fixed inset-0 z-40 flex items-end justify-center" role="dialog" aria-modal="true">
    <button
      type="button"
      aria-label={c.closeDrawer}
      onClick={onClose}
      className="absolute inset-0 bg-[rgba(31,43,59,0.42)] backdrop-blur-sm"
    />
    <div
      className="relative mx-auto w-full max-w-[1100px] overflow-hidden rounded-t-[1.6rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] shadow-[0_-20px_50px_rgba(132,82,62,0.22)]"
      style={{ maxHeight: '74vh' }}
    >
      <header className="flex items-center justify-between border-b border-[var(--kt-border-subtle)] px-5 py-3">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--kt-brand)]">
            記録
          </div>
          <h2 className="mt-0.5 text-lg font-black text-[var(--kt-ink-strong)]">{c.recordTitle}</h2>
        </div>
        <button
          type="button"
          aria-label={c.closeDrawer}
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--kt-ink-muted)] hover:bg-[var(--kt-surface-muted)]"
        >
          <X size={16} />
        </button>
      </header>
      <div
        className="grid gap-7 overflow-auto px-5 py-4 lg:grid-cols-[minmax(0,1fr)_18rem]"
        style={{ maxHeight: 'calc(74vh - 70px)' }}
      >
        <div>
          <div className="space-y-3">
            {groupStats.map((group) => {
              const masteredPercent = group.total > 0 ? Math.round((group.mastered / group.total) * 100) : 0;
              return (
                <div key={group.groupId} className="border-b border-[var(--kt-border-subtle)] pb-3 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <div className="text-base font-black text-[var(--kt-ink-strong)]">{group.groupLabel}</div>
                      <div className="text-xs text-[var(--kt-ink-muted)]">{group.sectionTitle}</div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
                      <span>{group.mastered}/{group.total}</span>
                      {group.due > 0 ? (
                        <span className="rounded-full bg-[var(--kt-accent-warning-soft)] px-2 py-0.5 text-[var(--kt-accent-warning)]">
                          {c.due} {group.due}
                        </span>
                      ) : null}
                      {group.weak > 0 ? (
                        <span className={`rounded-full px-2 py-0.5 ${toneSoftBg.danger}`}>
                          {c.weak} {group.weak}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--kt-progress-track)]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,var(--kt-brand),var(--kt-dan-gold))] transition-[width]"
                      style={{ width: `${masteredPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <aside>
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--kt-accent-plum)]">
            {c.recentMistakes}
          </div>
          {weakEntries.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {weakEntries.slice(0, 14).map((entry) => {
                const item = getKanaItemById(entry.kanaId);
                return (
                  <span
                    key={entry.kanaId}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--kt-accent-danger)]/35 bg-[var(--kt-accent-danger-soft)] px-2.5 py-1.5"
                  >
                    <span className="font-jp text-base font-black leading-none text-[var(--kt-ink-strong)]">
                      {item?.char ?? '?'}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--kt-ink-muted)]">
                      {item?.romaji ?? entry.kanaId} ×{entry.timesWrong}
                    </span>
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 text-sm text-[var(--kt-ink-muted)]">{c.noMistakes}</div>
          )}
        </aside>
      </div>
    </div>
  </div>
);
