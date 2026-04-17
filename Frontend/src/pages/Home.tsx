import React, { useMemo } from 'react';
import { ArrowRight, Flame, Gem, Sparkles, Swords, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, StatCard } from '../shared/ui';
import { AppLanguage } from '../data/appPreferences';
import { appShellRoutes, getPracticeRoute } from '../data/appShellContent';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../data/studyContent';
import { useKanaProgressSummary } from '../features/kana/progress/progressStore';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { buildKanaRoadmapTrack, findTrackLessonById, getTrackLessonOrder } from '../features/study-roadmap/content/roadmapDefinitions';
import { useStudyRoadmapStore } from '../features/study-roadmap/progress/useStudyRoadmapStore';
import { usePlayProgressStore } from '../features/play/progress/usePlayProgressStore';
import { MascotFigure } from '../components/mascot/MascotFigure';
import { SpeechBubble } from '../components/mascot/SpeechBubble';
import { ProgressRing } from '../components/shared/ProgressRing';

interface HomeProps {
  language: AppLanguage;
  activeScript: KanaScript;
}

const localUserId = 'local-user';

const scriptMeta = {
  hiragana: {
    symbol: 'あ',
    title: 'Hiragana',
    learnHref: appShellRoutes.hiraganaLearn,
    overviewHref: appShellRoutes.hiraganaOverview,
    accentClassName: 'from-[var(--kt-brand)] to-[var(--kt-accent-info)]'
  },
  katakana: {
    symbol: 'ア',
    title: 'Katakana',
    learnHref: appShellRoutes.katakanaLearn,
    overviewHref: appShellRoutes.katakanaOverview,
    accentClassName: 'from-[var(--kt-accent-info)] to-[var(--kt-accent-plum)]'
  }
} as const;

const pathOffsetPattern = [0, 18, -12, 16, -8];

export const Home: React.FC<HomeProps> = ({ language, activeScript }) => {
  const { summary: playSummary } = usePlayProgressStore(localUserId);
  const hiraganaSummary = useKanaProgressSummary('hiragana');
  const katakanaSummary = useKanaProgressSummary('katakana');
  const activeSummary = activeScript === 'hiragana' ? hiraganaSummary : katakanaSummary;
  const activeSections = useMemo(
    () => (activeScript === 'hiragana' ? getLocalizedHiraganaSections(language) : getLocalizedKatakanaSections(language)),
    [activeScript, language]
  );
  const activeTrack = useMemo(
    () => buildKanaRoadmapTrack(activeScript, activeSections, language),
    [activeScript, activeSections, language]
  );
  const lessonOrder = useMemo(() => getTrackLessonOrder(activeTrack), [activeTrack]);
  const lessons = useMemo(() => activeTrack.levels.flatMap((level) => level.lessons), [activeTrack]);
  const {
    completionRatio,
    getRecommendedLessonId,
    getLessonStatus
  } = useStudyRoadmapStore(activeScript, lessonOrder, lessons);
  const recommendedLessonId = getRecommendedLessonId();
  const recommendedLesson = recommendedLessonId ? findTrackLessonById(activeTrack, recommendedLessonId) : null;
  const previewLessons = useMemo(
    () => lessons.slice(0, Math.min(5, lessons.length)),
    [lessons]
  );

  const suggestedAction = useMemo(() => {
    if (activeSummary.dueCount > 0) {
      return {
        title: language === 'tr' ? 'Bugunun onceligi: review kuyruğu' : 'Priority today: review queue',
        description:
          language === 'tr'
            ? `${activeSummary.dueCount} karakter bekliyor. Ritim bozulmadan once bunu temizle.`
            : `${activeSummary.dueCount} characters are waiting. Clear this first to keep momentum.`,
        href: getPracticeRoute(activeScript, 'review'),
        icon: Target
      };
    }

    if (activeSummary.weakCount > 0) {
      return {
        title: language === 'tr' ? 'Zayiflari toparla' : 'Recover your weak set',
        description:
          language === 'tr'
            ? `${activeSummary.weakCount} karakter zayif. Kisa bir drill dogrudan fayda verir.`
            : `${activeSummary.weakCount} characters are weak. A short drill will pay off quickly.`,
        href: getPracticeRoute(activeScript, 'weak'),
        icon: Swords
      };
    }

    return {
      title: language === 'tr' ? 'Yeni uniteye gec' : 'Move into the next unit',
      description:
        language === 'tr'
          ? 'Akis temiz. Yeni karakterleri acmak icin ogrenme yoluna devam et.'
          : 'The queue is clean. Continue the learning path to unlock more characters.',
      href: activeScript === 'hiragana' ? appShellRoutes.hiraganaLearn : appShellRoutes.katakanaLearn,
      icon: Sparkles
    };
  }, [activeScript, activeSummary.dueCount, activeSummary.weakCount, language]);

  const SuggestedActionIcon = suggestedAction.icon;

  return (
    <div className="space-y-8 pb-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.85fr)]">
        <div className="overflow-hidden rounded-[2rem] border border-[var(--kt-border)] bg-[linear-gradient(135deg,rgba(6,12,18,0.96)_0%,rgba(20,31,43,0.96)_48%,rgba(51,24,40,0.94)_100%)] p-7 shadow-[var(--kt-shadow-lg)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="rounded-full bg-[rgba(255,255,255,0.08)] px-4 py-2 text-sm font-black uppercase tracking-[0.14em] text-white/72">
              {language === 'tr' ? 'Aktif Track' : 'Active track'}
            </div>
            <Link
              to={activeScript === 'hiragana' ? appShellRoutes.hiraganaOverview : appShellRoutes.katakanaOverview}
              className="text-sm font-black uppercase tracking-[0.12em] text-white/74"
            >
              {language === 'tr' ? 'Rehber' : 'Guide'}
            </Link>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-center">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.14em] text-white/62">
                {recommendedLesson
                  ? `${language === 'tr' ? 'Siradaki unite' : 'Next unit'}`
                  : `${language === 'tr' ? 'Hazir' : 'Ready'}`}
              </div>
              <h1 className="mt-3 text-4xl font-black leading-tight text-white md:text-5xl">
                {recommendedLesson?.title ?? (language === 'tr' ? 'Ogrenme yoluna geri don' : 'Return to the learning path')}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/74 md:text-lg">
                {recommendedLesson?.description ??
                  (language === 'tr'
                    ? 'Duolingo ilhamli yeni shell, Japonca calisma akisini tek bir yolda topluyor.'
                    : 'The new Duolingo-inspired shell brings the Japanese study flow into one path.')}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button as="link" to={scriptMeta[activeScript].learnHref} iconEnd={<ArrowRight size={16} />}>
                  {language === 'tr' ? 'Devam et' : 'Continue'}
                </Button>
                <Button as="link" to={getPracticeRoute(activeScript)} variant="secondary">
                  {language === 'tr' ? 'Alistirmaya gec' : 'Open practice'}
                </Button>
              </div>
            </div>

            <div className="justify-self-center">
              <MascotFigure pose="wave" tone={activeScript === 'hiragana' ? 'brand' : 'info'} size={168} />
            </div>
          </div>
        </div>

        <Card padding="lg" className="border-[var(--kt-border)] bg-[rgba(8,14,22,0.92)] text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-white/52">
                {language === 'tr' ? 'Bugunun yonlendirmesi' : 'Today’s direction'}
              </div>
              <h2 className="mt-3 text-2xl font-black leading-tight text-white">{suggestedAction.title}</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[rgba(255,255,255,0.08)]">
              <SuggestedActionIcon size={22} />
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-white/70">{suggestedAction.description}</p>
          <div className="mt-6">
            <Button as="link" to={suggestedAction.href} fullWidth>
              {language === 'tr' ? 'Basla' : 'Start'}
            </Button>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
        <Card padding="lg" className="border-[var(--kt-border)] bg-[rgba(8,14,22,0.78)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--kt-ink-subtle)]">
                {language === 'tr' ? 'Path Preview' : 'Path preview'}
              </div>
              <h2 className="mt-2 text-2xl font-black text-[var(--kt-ink-strong)]">
                {activeTrack.levels[0]?.title ?? scriptMeta[activeScript].title}
              </h2>
            </div>
            <ProgressRing
              value={Math.round(completionRatio * 100)}
              tone="brand"
              label={<span className="text-xs font-black text-[var(--kt-ink-strong)]">{`${Math.round(completionRatio * 100)}%`}</span>}
            />
          </div>

          <div className="mt-8 flex min-h-[12rem] flex-col items-center justify-center gap-5">
            {previewLessons.map((lesson, index) => {
              const status = getLessonStatus(lesson.id);
              const offset = pathOffsetPattern[index % pathOffsetPattern.length];

              return (
                <div key={lesson.id} className="flex w-full max-w-xl items-center justify-center gap-4" style={{ transform: `translateX(${offset}px)` }}>
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 text-xl font-black shadow-[var(--kt-shadow-sm)] ${
                      status === 'completed'
                        ? 'border-[color:var(--kt-accent-success)]/40 bg-[var(--kt-accent-success)] text-white'
                        : status === 'available'
                          ? 'border-[color:var(--kt-brand)]/40 bg-[var(--kt-brand)] text-white'
                          : 'border-[var(--kt-border)] bg-[var(--kt-surface-sunken)] text-[var(--kt-ink-subtle)]'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 rounded-[1.3rem] border border-[var(--kt-border-subtle)] bg-[rgba(255,255,255,0.04)] px-5 py-4">
                    <div className="text-xs font-black uppercase tracking-[0.16em] text-[var(--kt-ink-subtle)]">
                      {status === 'completed' ? 'Tamamlandi' : status === 'available' ? 'Hazir' : 'Kilitli'}
                    </div>
                    <div className="mt-1 text-base font-bold text-[var(--kt-ink-strong)]">{lesson.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--kt-ink-subtle)]">
                {language === 'tr' ? 'Hanabi diyor ki' : 'Hanabi says'}
              </div>
              <h2 className="mt-2 text-2xl font-black text-[var(--kt-ink-strong)]">
                {language === 'tr' ? 'Bugun hizli bir tur yap' : 'Do one quick run today'}
              </h2>
            </div>
            <MascotFigure pose="study" tone="plum" size={120} />
          </div>
          <div className="mt-5">
            <SpeechBubble accent="plum">
              {language === 'tr' ? 'Bugun 10 dogru cevap ve bir mini oyun. Ritim yeter.' : 'Ten correct answers and one mini game. That is enough for today.'}
            </SpeechBubble>
          </div>
          <div className="mt-6 grid gap-3">
            <StatCard label="Streak" value={playSummary.currentStreakDays} tone="warning" icon={<Flame size={18} />} />
            <StatCard label="Total XP" value={playSummary.totalXp} tone="info" icon={<Gem size={18} />} />
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--kt-ink-subtle)]">
                {language === 'tr' ? 'Script Secimi' : 'Script selector'}
              </div>
              <h2 className="mt-2 text-3xl font-black text-[var(--kt-ink-strong)]">
                {language === 'tr' ? 'Bugun neye odaklaniyorsun?' : 'What are you focusing on today?'}
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {(['hiragana', 'katakana'] as KanaScript[]).map((script) => {
              const summary = script === 'hiragana' ? hiraganaSummary : katakanaSummary;
              const isActive = activeScript === script;
              const trackedPercent = summary.totalCount > 0 ? Math.round((summary.tracked / summary.totalCount) * 100) : 0;

              return (
                <Card
                  key={script}
                  padding="lg"
                  className={`border-[var(--kt-border)] ${isActive ? 'ring-2 ring-[var(--kt-brand)]/35' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className={`inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-sm font-black text-white ${scriptMeta[script].accentClassName}`}>
                        {scriptMeta[script].symbol}
                      </div>
                      <h3 className="mt-4 text-2xl font-black text-[var(--kt-ink-strong)]">{scriptMeta[script].title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[var(--kt-ink-muted)]">
                        {language === 'tr'
                          ? `${summary.tracked} karakter izlendi, ${summary.masteredCount} mastered durumda.`
                          : `${summary.tracked} characters tracked, ${summary.masteredCount} mastered so far.`}
                      </p>
                    </div>
                    <ProgressRing
                      value={trackedPercent}
                      tone={script === 'hiragana' ? 'brand' : 'info'}
                      label={<span className="text-xs font-black text-[var(--kt-ink-strong)]">{`${trackedPercent}%`}</span>}
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button as="link" to={scriptMeta[script].overviewHref}>
                      {language === 'tr' ? 'Bolume git' : 'Open section'}
                    </Button>
                    <Button as="link" to={scriptMeta[script].learnHref} variant="secondary">
                      {language === 'tr' ? 'Yola gir' : 'Enter the path'}
                    </Button>
                  </div>
                </Card>
              );
            })}

            <Card padding="lg" className="border-dashed border-[var(--kt-border)] bg-[rgba(255,255,255,0.03)]">
              <div className="inline-flex rounded-full bg-[var(--kt-accent-warning)] px-3 py-1 text-sm font-black text-white">
                漢
              </div>
              <h3 className="mt-4 text-2xl font-black text-[var(--kt-ink-strong)]">Kanji</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--kt-ink-muted)]">
                {language === 'tr'
                  ? 'Kanji track bu yeni kabukta yerini hazirladi. Kilit, mevcut kana mastery oranina gore acilacak.'
                  : 'The kanji track already has its place in the new shell. It unlocks based on your kana mastery rate.'}
              </p>
              <div className="mt-6">
                <Button as="link" to={appShellRoutes.kanjiOverview} variant="secondary">
                  {language === 'tr' ? 'Onizlemeyi ac' : 'Open preview'}
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <Card padding="lg" className="border-[var(--kt-border)] bg-[rgba(8,14,22,0.82)]">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--kt-ink-subtle)]">
            {language === 'tr' ? 'Hizli istatistikler' : 'Quick stats'}
          </div>
          <div className="mt-5 grid gap-3">
            <StatCard label="Due" value={hiraganaSummary.dueCount + katakanaSummary.dueCount} tone="warning" />
            <StatCard label="Weak" value={hiraganaSummary.weakCount + katakanaSummary.weakCount} tone="danger" />
            <StatCard label="Mastered" value={hiraganaSummary.masteredCount + katakanaSummary.masteredCount} tone="success" />
          </div>
          <div className="mt-6 rounded-[1.4rem] border border-[var(--kt-border)] bg-[rgba(255,255,255,0.04)] p-5">
            <div className="text-sm font-black uppercase tracking-[0.16em] text-[var(--kt-ink-subtle)]">
              {language === 'tr' ? 'Sakura shell notu' : 'Sakura shell note'}
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--kt-ink-muted)]">
              {language === 'tr'
                ? 'Eski tek kolon akisi yerine artik solda sabit navigasyon, ortada yol-bazli ilerleme, sagda motivasyon rayi var.'
                : 'The old single-column flow is replaced with persistent navigation, a center path, and a motivation rail.'}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">
            <a href="#" className="hover:text-[var(--kt-ink)]">Hakkinda</a>
            <a href="#" className="hover:text-[var(--kt-ink)]">Sartlar</a>
            <a href="#" className="hover:text-[var(--kt-ink)]">Gizlilik</a>
          </div>
        </Card>
      </section>
    </div>
  );
};
