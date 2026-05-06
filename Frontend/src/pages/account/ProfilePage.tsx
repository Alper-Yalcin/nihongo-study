import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  BookOpenText,
  Camera,
  Flame,
  Gamepad2,
  History,
  LucideIcon,
  Medal,
  Sparkles,
  Star,
  Swords,
  Trophy,
  Zap
} from 'lucide-react';
import { AppLanguage } from '../../data/appPreferences';
import { getDanProgress, getKyuFromXp } from '../../data/danSystem';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../../data/studyContent';
import { useFeedback } from '../../hooks/useFeedback';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useKanaProgressSummary } from '../../features/kana/progress/progressStore';
import { usePlayProgressStore } from '../../features/play/progress/usePlayProgressStore';
import { buildKanaRoadmapTrack, getTrackLessonOrder } from '../../features/study-roadmap/content/roadmapDefinitions';
import { useStudyRoadmapStore } from '../../features/study-roadmap/progress/useStudyRoadmapStore';
import { getHeatGrid, tomoshibiVisual } from '../../features/streak/tomoshibi';
import { getJLearnUserState, subscribeJLearnUserState } from '../../features/jlearn/debug/debugStore';
import { BackgroundScene } from '../../components/layout';

interface ProfilePageProps {
  language: AppLanguage;
}

type ProgressStat = {
  label: string;
  value: string;
  detail: string;
  percent: number;
  icon: LucideIcon;
  tone: 'xp' | 'streak' | 'combo';
};

type TrackInfo = {
  label: string;
  detail: string;
  percent: number;
};

const localUserId = 'local-user';
const PROFILE_NAME_KEY = 'kototsuna.profile.name';
const PROFILE_TITLE_KEY = 'kototsuna.profile.title';
const PROFILE_PHOTO_KEY = 'kototsuna.profile.photo';

const copy = {
  tr: {
    profileLabel: 'Dojo Profili',
    username: 'Kototsuna Learner',
    titleFallback: 'Kana Explorer',
    namePlaceholder: 'Adın veya takma adın',
    titlePlaceholder: 'Unvanın',
    changePhoto: 'Fotoğraf seç',
    level: 'Seviye',
    nextRank: 'sonraki rütbe',
    xpPath: 'XP yolu',
    xp: 'XP',
    streak: 'Streak',
    combo: 'Combo',
    days: 'gün',
    bestCombo: 'en iyi zincir',
    progressTitle: 'Bugünkü ritmin',
    heatmapTitle: 'Son 30 gün aktivite',
    heatmapText: 'Dolu izler, çalıştığın günleri gösterir. Boşluklar sadece ritmini yeniden kurman için bir davet.',
    journeyTitle: 'Öğrenme yolculuğun',
    achievementsTitle: 'Rozet vitrini',
    noBadgesTitle: 'Henüz rozet kazanmadın',
    noBadgesText: 'İlk rozet, birkaç düzenli pratikten sonra burada belirecek.',
    recentTitle: 'Son izler',
    noActivityTitle: 'Henüz aktivite yok',
    noActivityText: 'Bir pratik turu tamamladığında öğrenme hikayen burada akmaya başlayacak.',
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    kanjiVocabulary: 'Kanji / Vocabulary',
    completedLessons: 'tamamlanan ders',
    masteredKana: 'ustalaşılan kana',
    runs: 'oturum',
    score: 'skor',
    earned: 'kazandın',
    activityFallback: 'Pratik oturumu'
  },
  en: {
    profileLabel: 'Dojo Profile',
    username: 'Kototsuna Learner',
    titleFallback: 'Kana Explorer',
    namePlaceholder: 'Your name or nickname',
    titlePlaceholder: 'Your title',
    changePhoto: 'Choose photo',
    level: 'Level',
    nextRank: 'next rank',
    xpPath: 'XP path',
    xp: 'XP',
    streak: 'Streak',
    combo: 'Combo',
    days: 'days',
    bestCombo: 'best chain',
    progressTitle: 'Today’s rhythm',
    heatmapTitle: 'Last 30 days activity',
    heatmapText: 'Filled marks show the days you practiced. Empty space is only an invitation to return.',
    journeyTitle: 'Your learning journey',
    achievementsTitle: 'Badge showcase',
    noBadgesTitle: 'No badges yet',
    noBadgesText: 'Your first badge will appear here after a few steady practice runs.',
    recentTitle: 'Recent traces',
    noActivityTitle: 'No activity yet',
    noActivityText: 'Complete a practice run and your learning story will start flowing here.',
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    kanjiVocabulary: 'Kanji / Vocabulary',
    completedLessons: 'completed lessons',
    masteredKana: 'mastered kana',
    runs: 'runs',
    score: 'score',
    earned: 'earned',
    activityFallback: 'Practice session'
  }
} as const;

const clampPercent = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const cleanDisplayLabel = (value: string) =>
  value
    .replaceAll('Ã‚Â°', '°')
    .replaceAll('Â°', '°')
    .replaceAll('kyÃ…Â«', 'kyu')
    .replaceAll('kyÅ«', 'kyu')
    .replaceAll('Ã¢â‚¬â€', '-');

const formatGameId = (gameId: string) =>
  gameId
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const initialsFromName = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || '学';

export const ProfilePage: React.FC<ProfilePageProps> = ({ language }) => {
  const text = copy[language];
  const playStore = usePlayProgressStore(localUserId);
  const hiraganaSummary = useKanaProgressSummary('hiragana');
  const katakanaSummary = useKanaProgressSummary('katakana');
  const { state: feedbackState } = useFeedback();
  const [streakDays, setStreakDays] = useState(() => getJLearnUserState().streakDays);
  const [profileName, setProfileName] = usePersistentState<string>(PROFILE_NAME_KEY, text.username);
  const [profileTitle, setProfileTitle] = usePersistentState<string>(PROFILE_TITLE_KEY, text.titleFallback);
  const [profilePhoto, setProfilePhoto] = usePersistentState<string | null>(PROFILE_PHOTO_KEY, null);

  useEffect(
    () => subscribeJLearnUserState(() => setStreakDays(getJLearnUserState().streakDays)),
    []
  );

  const dan = getKyuFromXp(feedbackState.hanabira, streakDays);
  const danProgress = getDanProgress(feedbackState.hanabira, streakDays);
  const tomoshibi = tomoshibiVisual(streakDays);

  const hiraganaSections = useMemo(() => getLocalizedHiraganaSections(language), [language]);
  const katakanaSections = useMemo(() => getLocalizedKatakanaSections(language), [language]);
  const hiraganaTrack = useMemo(() => buildKanaRoadmapTrack('hiragana', hiraganaSections, language), [hiraganaSections, language]);
  const katakanaTrack = useMemo(() => buildKanaRoadmapTrack('katakana', katakanaSections, language), [katakanaSections, language]);
  const hiraganaLessons = useMemo(() => hiraganaTrack.levels.flatMap((level) => level.lessons), [hiraganaTrack]);
  const katakanaLessons = useMemo(() => katakanaTrack.levels.flatMap((level) => level.lessons), [katakanaTrack]);
  const hiraganaRoadmap = useStudyRoadmapStore('hiragana', getTrackLessonOrder(hiraganaTrack), hiraganaLessons);
  const katakanaRoadmap = useStudyRoadmapStore('katakana', getTrackLessonOrder(katakanaTrack), katakanaLessons);

  const hiraganaPercent = clampPercent(
    hiraganaLessons.length > 0
      ? (hiraganaRoadmap.scriptProgress.completedLessonIds.length / hiraganaLessons.length) * 100
      : 0
  );
  const katakanaPercent = clampPercent(
    katakanaLessons.length > 0
      ? (katakanaRoadmap.scriptProgress.completedLessonIds.length / katakanaLessons.length) * 100
      : 0
  );
  const kanjiVocabularyPercent = clampPercent(
    playStore.summary.totalQuestions > 0
      ? (playStore.summary.totalCorrectAnswers / Math.max(80, playStore.summary.totalQuestions)) * 100
      : 0
  );

  const stats: ProgressStat[] = [
    {
      label: text.xp,
      value: `${feedbackState.hanabira}`,
      detail: `${Math.round(danProgress.percent)}% ${text.nextRank}`,
      percent: danProgress.percent,
      icon: Zap,
      tone: 'xp'
    },
    {
      label: text.streak,
      value: `${streakDays} ${text.days}`,
      detail: tomoshibi.label,
      percent: clampPercent((streakDays / 30) * 100),
      icon: Flame,
      tone: 'streak'
    },
    {
      label: text.combo,
      value: `x${feedbackState.comboMaxAllTime}`,
      detail: text.bestCombo,
      percent: clampPercent((feedbackState.comboMaxAllTime / 25) * 100),
      icon: Swords,
      tone: 'combo'
    }
  ];

  const tracks: TrackInfo[] = [
    {
      label: text.hiragana,
      detail: `${hiraganaRoadmap.scriptProgress.completedLessonIds.length}/${hiraganaLessons.length} ${text.completedLessons} · ${hiraganaSummary.masteredCount ?? 0} ${text.masteredKana}`,
      percent: hiraganaPercent
    },
    {
      label: text.katakana,
      detail: `${katakanaRoadmap.scriptProgress.completedLessonIds.length}/${katakanaLessons.length} ${text.completedLessons} · ${katakanaSummary.masteredCount ?? 0} ${text.masteredKana}`,
      percent: katakanaPercent
    },
    {
      label: text.kanjiVocabulary,
      detail: `${playStore.summary.totalSessions} ${text.runs} · ${playStore.summary.averageAccuracy}%`,
      percent: kanjiVocabularyPercent
    }
  ];

  const badges = [
    ...Array.from({ length: playStore.rewardRegistry.badges }, (_, index) => ({
      id: `badge-${index + 1}`,
      label: `Badge ${index + 1}`,
      icon: Medal
    })),
    ...playStore.rewardRegistry.unlockedThemeIds.map((themeId) => ({
      id: themeId,
      label: themeId.replace(/^theme-/, 'Theme '),
      icon: Star
    })),
    ...playStore.rewardRegistry.unlockedFeatureIds.map((featureId) => ({
      id: featureId,
      label: featureId.replace(/^unlock-/, 'Unlock '),
      icon: Trophy
    }))
  ];

  return (
    <main className="relative min-h-[calc(100vh-92px)] overflow-x-hidden text-[var(--kt-ink-strong)]">
      <BackgroundScene />

      <div className="relative z-10 px-4 pb-24 pt-10 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-[1180px]">
          <IdentitySection
            text={text}
            name={profileName}
            title={profileTitle}
            photo={profilePhoto}
            onNameChange={setProfileName}
            onTitleChange={setProfileTitle}
            onPhotoChange={setProfilePhoto}
            danLabel={cleanDisplayLabel(dan.label)}
            danRank={cleanDisplayLabel(dan.rank)}
            xp={feedbackState.hanabira}
            xpPercent={danProgress.percent}
            nextLabel={cleanDisplayLabel(danProgress.nextLabel)}
            initials={initialsFromName(profileName)}
            streakDays={streakDays}
            tomoshibiGlow={tomoshibi.glow}
            tomoshibiHaloColor={tomoshibi.haloColor}
          />

          <ProgressLine title={text.progressTitle} stats={stats} />

          <ActivityFlow title={text.heatmapTitle} description={text.heatmapText} />

          <LearningJourney title={text.journeyTitle} tracks={tracks} />

          <Achievements title={text.achievementsTitle} emptyTitle={text.noBadgesTitle} emptyText={text.noBadgesText} badges={badges} />

          <ActivityTimeline
            title={text.recentTitle}
            emptyTitle={text.noActivityTitle}
            emptyText={text.noActivityText}
            runs={playStore.runs.slice(0, 6)}
            text={text}
          />
        </div>
      </div>
    </main>
  );
};

const IdentitySection: React.FC<{
  text: typeof copy.tr | typeof copy.en;
  name: string;
  title: string;
  photo: string | null;
  onNameChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onPhotoChange: (value: string | null) => void;
  danLabel: string;
  danRank: string;
  xp: number;
  xpPercent: number;
  nextLabel: string;
  initials: string;
  streakDays: number;
  tomoshibiGlow: number;
  tomoshibiHaloColor: string;
}> = ({
  text,
  name,
  title,
  photo,
  onNameChange,
  onTitleChange,
  onPhotoChange,
  danLabel,
  danRank,
  xp,
  xpPercent,
  nextLabel,
  initials,
  streakDays,
  tomoshibiGlow,
  tomoshibiHaloColor
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onPhotoChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="relative flex min-h-[26rem] flex-col justify-center gap-10 py-10 md:flex-row md:items-center md:justify-between md:py-16">
      <div className="pointer-events-none absolute right-0 top-4 font-jp text-[10rem] font-black leading-none text-[var(--kt-brand)] opacity-[0.045]" aria-hidden="true">
        学
      </div>

      <div className="relative flex justify-center md:w-[18rem] md:justify-start">
        <div
          className="absolute inset-0 m-auto h-44 w-44 rounded-full bg-[var(--kt-tomoshibi)] opacity-20 blur-3xl"
          style={{
            boxShadow: streakDays > 0 ? `0 0 ${tomoshibiGlow + 18}px color-mix(in srgb, ${tomoshibiHaloColor} 60%, transparent)` : undefined
          }}
          aria-hidden="true"
        />
        <div className="relative h-44 w-44">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_30%,var(--kt-surface-raised),var(--kt-brand-soft)_65%,var(--kt-surface-sunken))] text-5xl font-black text-[var(--kt-brand)] shadow-[0_28px_90px_rgba(208,96,112,0.24)] outline-none transition duration-300 hover:scale-[1.02] focus-visible:ring-4 focus-visible:ring-[var(--kt-brand-soft)]"
            aria-label={text.changePhoto}
          >
            {photo ? (
              <img src={photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/42 py-3 text-xs font-black text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
              <Camera size={15} />
              {text.changePhoto}
            </span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

          <div className="absolute -bottom-2 -right-2 flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--kt-dan-gold),var(--kt-tomoshibi))] text-sm font-black text-[var(--kt-dan-ink)] shadow-[0_16px_36px_rgba(226,162,62,0.28)]">
            {danLabel}
          </div>
        </div>
      </div>

      <div className="relative flex-1 text-center md:text-left">
        <div className="text-xs font-black uppercase tracking-[0.24em] text-[var(--kt-ink-subtle)]">{text.profileLabel}</div>
        <input
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder={text.namePlaceholder}
          className="mt-4 w-full bg-transparent text-center text-5xl font-black leading-none tracking-tight text-[var(--kt-ink-strong)] outline-none placeholder:text-[var(--kt-ink-subtle)] md:text-left md:text-7xl"
        />
        <input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={text.titlePlaceholder}
          className="mt-4 w-full bg-transparent text-center text-lg font-semibold text-[var(--kt-brand)] outline-none placeholder:text-[var(--kt-ink-subtle)] md:text-left md:text-2xl"
        />

        <div className="mt-8 flex flex-col gap-2 text-sm font-bold text-[var(--kt-ink-muted)] sm:flex-row sm:items-center sm:justify-center md:justify-start">
          <span>{text.level} {danRank}</span>
          <span className="hidden text-[var(--kt-ink-subtle)] sm:inline">•</span>
          <span>{xp} {text.xp}</span>
          <span className="hidden text-[var(--kt-ink-subtle)] sm:inline">•</span>
          <span>{Math.round(xpPercent)}% {text.nextRank}: {nextLabel}</span>
        </div>

        <div className="mt-7 h-2 w-full max-w-2xl overflow-hidden rounded-full bg-[var(--kt-progress-track)]">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,var(--kt-brand),var(--kt-tomoshibi),var(--kt-dan-gold))] shadow-[0_0_24px_color-mix(in_srgb,var(--kt-brand)_55%,transparent)]"
            style={{ width: `${clampPercent(xpPercent)}%` }}
          />
        </div>
        <div className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--kt-ink-subtle)]">{text.xpPath}</div>
      </div>
    </section>
  );
};

const ProgressLine: React.FC<{ title: string; stats: ProgressStat[] }> = ({ title, stats }) => (
  <section className="py-12">
    <div className="mb-8 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-[var(--kt-ink-subtle)]">
      <Sparkles size={16} className="text-[var(--kt-brand)]" />
      <span>{title}</span>
    </div>
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const accent =
          stat.tone === 'xp'
            ? 'var(--kt-brand)'
            : stat.tone === 'streak'
              ? 'var(--kt-tomoshibi)'
              : 'var(--kt-accent-plum)';

        return (
          <div key={stat.label} className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <Icon size={22} style={{ color: accent }} />
                <span className="text-sm font-black uppercase tracking-[0.18em] text-[var(--kt-ink-subtle)]">{stat.label}</span>
              </div>
              <span className="text-2xl font-black text-[var(--kt-ink-strong)]">{stat.value}</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--kt-border-subtle)]">
                <div className="relative h-px" style={{ width: `${clampPercent(stat.percent)}%`, background: accent }}>
                  <span className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full" style={{ background: accent, boxShadow: `0 0 18px ${accent}` }} />
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-[var(--kt-ink-muted)]">{stat.detail}</p>
          </div>
        );
      })}
    </div>
  </section>
);

const ActivityFlow: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  const heatGrid = getHeatGrid(30);

  return (
    <section className="py-14">
      <SectionHeading icon={Flame} title={title} />
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--kt-ink-muted)]">{description}</p>
      <div className="mt-8 flex max-w-4xl flex-wrap gap-2">
        {heatGrid.map((day) => (
          <span
            key={day.date}
            title={day.date}
            className={`h-5 w-5 rounded-md transition duration-200 hover:scale-125 ${
              day.active
                ? 'bg-[linear-gradient(135deg,var(--kt-tomoshibi),var(--kt-brand))] shadow-[0_0_14px_color-mix(in_srgb,var(--kt-tomoshibi)_50%,transparent)]'
                : 'bg-[var(--kt-progress-track)] opacity-75'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

const LearningJourney: React.FC<{ title: string; tracks: TrackInfo[] }> = ({ title, tracks }) => (
  <section className="py-14">
    <SectionHeading icon={BookOpenText} title={title} />
    <div className="mt-10 space-y-9">
      {tracks.map((track, index) => (
        <div key={track.label} className="relative flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
          <div className="flex min-w-[14rem] items-baseline gap-4">
            <span className="font-jp text-2xl font-black text-[var(--kt-brand)]">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="text-2xl font-black text-[var(--kt-ink-strong)]">{track.label}</h3>
              <p className="mt-1 text-sm text-[var(--kt-ink-muted)]">{track.detail}</p>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-4">
            <div className="h-px flex-1 bg-[var(--kt-border-subtle)]">
              <div className="relative h-px bg-[linear-gradient(90deg,var(--kt-brand),var(--kt-accent-sunset))]" style={{ width: `${track.percent}%` }}>
                <span className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[var(--kt-brand)] shadow-[0_0_20px_color-mix(in_srgb,var(--kt-brand)_52%,transparent)]" />
              </div>
            </div>
            <span className="w-12 text-right text-sm font-black tabular-nums text-[var(--kt-ink-muted)]">{track.percent}%</span>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const Achievements: React.FC<{
  title: string;
  emptyTitle: string;
  emptyText: string;
  badges: { id: string; label: string; icon: LucideIcon }[];
}> = ({ title, emptyTitle, emptyText, badges }) => (
  <section className="py-14">
    <SectionHeading icon={Award} title={title} />
    {badges.length > 0 ? (
      <div className="mt-9 flex flex-wrap gap-x-9 gap-y-7">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.id} className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_35%,var(--kt-dan-gold),var(--kt-dan-gold-soft))] text-[var(--kt-dan-ink)] shadow-[0_0_24px_color-mix(in_srgb,var(--kt-dan-gold)_30%,transparent)]">
                <Icon size={23} />
              </span>
              <span className="text-sm font-black text-[var(--kt-ink-muted)]">{badge.label}</span>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="mt-10 flex max-w-xl items-start gap-5">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--kt-dan-gold-soft)] text-[var(--kt-dan-ink)]">
          <Medal size={25} />
        </span>
        <div>
          <h3 className="text-2xl font-black text-[var(--kt-ink-strong)]">{emptyTitle}</h3>
          <p className="mt-2 text-base leading-7 text-[var(--kt-ink-muted)]">{emptyText}</p>
        </div>
      </div>
    )}
  </section>
);

const ActivityTimeline: React.FC<{
  title: string;
  emptyTitle: string;
  emptyText: string;
  runs: ReturnType<typeof usePlayProgressStore>['runs'];
  text: typeof copy.tr | typeof copy.en;
}> = ({ title, emptyTitle, emptyText, runs, text }) => (
  <section className="py-14">
    <SectionHeading icon={History} title={title} />
    {runs.length > 0 ? (
      <div className="mt-9 space-y-8">
        {runs.map((run, index) => (
          <div key={run.session.id} className="relative flex gap-5">
            <div className="flex flex-col items-center">
              <span className="mt-1 h-3 w-3 rounded-full bg-[var(--kt-brand)] shadow-[0_0_16px_color-mix(in_srgb,var(--kt-brand)_55%,transparent)]" />
              {index < runs.length - 1 ? <span className="mt-2 h-full min-h-16 w-px bg-[var(--kt-border-subtle)]" /> : null}
            </div>
            <div className="pb-2">
              <h3 className="text-lg font-black text-[var(--kt-ink-strong)]">
                {formatGameId(run.session.gameId) || text.activityFallback}
              </h3>
              <p className="mt-1 text-sm font-semibold text-[var(--kt-brand)]">
                +{run.xpEarned} XP {text.earned}
              </p>
              <p className="mt-1 text-sm text-[var(--kt-ink-muted)]">
                {text.score} {run.session.score} · {new Date(run.session.endedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="mt-10 flex max-w-xl items-start gap-5">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--kt-accent-info-soft)] text-[var(--kt-accent-info)]">
          <Gamepad2 size={25} />
        </span>
        <div>
          <h3 className="text-2xl font-black text-[var(--kt-ink-strong)]">{emptyTitle}</h3>
          <p className="mt-2 text-base leading-7 text-[var(--kt-ink-muted)]">{emptyText}</p>
        </div>
      </div>
    )}
  </section>
);

const SectionHeading: React.FC<{ icon: LucideIcon; title: string }> = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3">
    <Icon size={22} className="text-[var(--kt-brand)]" />
    <h2 className="text-3xl font-black tracking-tight text-[var(--kt-ink-strong)]">{title}</h2>
  </div>
);
