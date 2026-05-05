import React from 'react';
import {
  ArrowRight,
  BookOpenText,
  Flame,
  Gamepad2,
  Headphones,
  LineChart,
  LucideIcon,
  PencilLine,
  Repeat2,
  Shuffle,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppLanguage, ThemeMode } from '../../data/appPreferences';
import { appShellRoutes } from '../../data/appShellContent';
import { KanaScript } from '../../features/kana/domain/kanaItem';

interface LandingPageProps {
  language: AppLanguage;
  activeScript: KanaScript;
  themeMode: ThemeMode;
}

type ToneClasses = {
  pageText: string;
  mutedText: string;
  faintText: string;
  hairline: string;
  surface: string;
  softSurface: string;
  pageBackground: string;
};

type FeatureItemProps = {
  icon: LucideIcon;
  title: string;
  text: string;
  tone: ToneClasses;
};

type StepItemProps = {
  index: number;
  title: string;
  text: string;
  tone: ToneClasses;
  isLast?: boolean;
};

type PracticeItemProps = {
  icon: LucideIcon;
  title: string;
  text: string;
  sample: string;
  tone: ToneClasses;
};

const landingCopy = {
  title: 'Japoncayı ezberleyerek değil, oynayarak öğren.',
  subtitle: 'Dersler, pratik ve ilerleme sistemiyle kendi hızında sakin bir Japonca yolculuğuna başla.',
  cta: 'Öğrenmeye Başla',
  microcopy: 'Hesap gerekmez - anında başla',
  systemTitle: 'Kototsuna nasıl çalışır?',
  systemText:
    'Learn, Practice ve Review akışı birlikte çalışır. Önce konuyu kontrollü şekilde öğrenirsin, sonra pratikle aktif hale getirirsin.',
  features: [
    {
      title: 'Learn',
      text: 'Ünite ünite ilerleyen ders yapısıyla Japoncayı dağınık değil, kontrollü şekilde öğren.',
      icon: BookOpenText
    },
    {
      title: 'Practice',
      text: 'Flashcard, yazma, dinleme ve eşleştirme pratikleriyle öğrendiklerini aktif hale getir.',
      icon: Gamepad2
    },
    {
      title: 'Progress',
      text: 'XP, streak ve combo sistemiyle ilerlemeni görünür hale getir.',
      icon: LineChart
    }
  ],
  steps: [
    {
      title: 'Learn',
      text: 'Önce kısa ve net derslerle konuyu öğren.'
    },
    {
      title: 'Practice',
      text: 'Sonra farklı pratik modlarıyla bilgiyi pekiştir.'
    },
    {
      title: 'Review',
      text: 'Zayıf kaldığın yerleri tekrar ederek kalıcı öğren.'
    }
  ],
  practiceTitle: 'Pratik sadece test çözmek değil',
  practiceText:
    'Kana, kanji ve kelime çalışmaları kısa pratik modlarına ayrılır. Her mod tek bir beceriyi güçlendirir.',
  practiceItems: [
    {
      title: 'Flashcards',
      text: 'Kelime, kana ve anlamları hızlı hatırlama döngüsüyle tekrar et.',
      sample: '日 -> gün',
      icon: Repeat2
    },
    {
      title: 'Writing',
      text: 'Yazma ve cevap hatırlama pratikleriyle pasif bilgiyi aktifleştir.',
      sample: 'type: arigatou',
      icon: PencilLine
    },
    {
      title: 'Listening',
      text: 'Duyduğun Japoncayı seçerek veya yazarak dinleme refleksini geliştir.',
      sample: 'hear -> choose',
      icon: Headphones
    },
    {
      title: 'Matching',
      text: 'Kana, kanji ve kelime eşleştirmeleriyle hızlı tanıma becerisi kazan.',
      sample: 'kana -> reading',
      icon: Shuffle
    }
  ],
  progressTitle: 'İlerlemeni gör, ritmini koru',
  progressText:
    'Doğru cevaplar sadece biten sorular değil. XP, streak, combo ve günlük ilerleme hissiyle çalışma ritmin görünür kalır.',
  finalTitle: 'İlk dersin seni bekliyor.',
  finalText: 'Kısa derslerle başla, pratikle güçlendir ve her gün biraz daha ilerle.',
  finalCta: "Learn'e Git"
} as const;

const markLandingSeen = () => {
  try {
    window.localStorage.setItem('hasSeenLanding', 'true');
  } catch {
    // Local storage can be unavailable in private or restricted contexts.
  }
};

const buildTone = (isDark: boolean): ToneClasses => ({
  pageText: isDark ? 'text-white' : 'text-[#1f2937]',
  mutedText: isDark ? 'text-white/64' : 'text-[#536174]',
  faintText: isDark ? 'text-white/40' : 'text-[#7d8796]',
  hairline: isDark ? 'bg-white/14' : 'bg-[#1f2937]/14',
  surface: isDark
    ? 'border-white/10 bg-white/[0.035] text-white shadow-none'
    : 'border-[#d9e0ea] bg-white/54 text-[#1f2937] shadow-[0_16px_48px_rgba(31,41,55,0.07)]',
  softSurface: isDark
    ? 'border-white/10 bg-white/[0.055] text-white shadow-[0_0_44px_rgba(240,77,114,0.08)]'
    : 'border-[#ead6dd] bg-white/68 text-[#1f2937] shadow-[0_20px_70px_rgba(240,77,114,0.12)]',
  pageBackground: isDark
    ? 'radial-gradient(circle at 50% 26%, rgba(240,77,114,0.22), transparent 25%), radial-gradient(circle at 18% 18%, rgba(94,158,232,0.18), transparent 29%), radial-gradient(circle at 82% 76%, rgba(82,199,166,0.11), transparent 31%), linear-gradient(140deg, #060912 0%, #111827 46%, #160c18 100%)'
    : 'radial-gradient(circle at 50% 24%, rgba(240,77,114,0.13), transparent 28%), radial-gradient(circle at 18% 18%, rgba(94,158,232,0.14), transparent 31%), radial-gradient(circle at 82% 76%, rgba(82,199,166,0.10), transparent 33%), linear-gradient(140deg, #fff8fb 0%, #f5f9ff 48%, #fff7ef 100%)'
});

const StartButton: React.FC<{ label: string; compact?: boolean }> = ({ label, compact = false }) => (
  <Link
    to={appShellRoutes.learn}
    onClick={markLandingSeen}
    className={`inline-flex items-center justify-center gap-3 rounded-full bg-[linear-gradient(135deg,#ff6f8f_0%,#f04d72_48%,#f4b64d_100%)] font-black text-white shadow-[0_0_34px_rgba(240,77,114,0.34),0_18px_48px_rgba(0,0,0,0.22)] transition duration-200 hover:scale-[1.03] hover:shadow-[0_0_44px_rgba(240,77,114,0.50),0_22px_60px_rgba(0,0,0,0.26)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#080b12] ${
      compact ? 'min-h-12 px-7 text-sm' : 'min-h-14 px-8 text-base'
    }`}
  >
    <span>{label}</span>
    <ArrowRight size={compact ? 17 : 19} />
  </Link>
);

const SectionShell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <section className={`kt-section-reveal relative z-10 mx-auto w-full max-w-5xl px-5 py-24 sm:py-28 ${className}`}>
    {children}
  </section>
);

const SectionHeading: React.FC<{
  title: string;
  text: string;
  tone: ToneClasses;
  align?: 'center' | 'left';
}> = ({ title, text, tone, align = 'center' }) => (
  <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}>
    <h2 className="text-3xl font-black leading-tight sm:text-5xl">{title}</h2>
    <p className={`mt-5 text-base leading-8 sm:text-lg ${tone.mutedText}`}>{text}</p>
  </div>
);

const FeatureItem: React.FC<FeatureItemProps> = ({ icon: Icon, title, text, tone }) => (
  <div className="group flex items-start gap-4 text-left transition duration-200 hover:-translate-y-0.5">
    <span className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${tone.surface}`}>
      <Icon size={20} className="text-[#f04d72]" />
    </span>
    <div>
      <h3 className="text-base font-black">{title}</h3>
      <p className={`mt-2 text-sm leading-7 ${tone.mutedText}`}>{text}</p>
    </div>
  </div>
);

const StepItem: React.FC<StepItemProps> = ({ index, title, text, tone, isLast = false }) => (
  <div className="relative grid gap-5 sm:grid-cols-[4rem_minmax(0,1fr)]">
    {!isLast && (
      <div className={`absolute left-7 top-16 hidden h-[calc(100%+1.5rem)] w-px sm:block ${tone.hairline}`} />
    )}
    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#f04d72] text-sm font-black text-white shadow-[0_0_28px_rgba(240,77,114,0.25)]">
      {index + 1}
    </div>
    <div className="pb-8">
      <h3 className="text-2xl font-black">{title}</h3>
      <p className={`mt-3 max-w-2xl text-base leading-8 ${tone.mutedText}`}>{text}</p>
    </div>
  </div>
);

const PracticeItem: React.FC<PracticeItemProps> = ({ icon: Icon, title, text, sample, tone }) => (
  <div className={`group rounded-2xl border p-4 backdrop-blur transition duration-200 hover:-translate-y-1 ${tone.surface}`}>
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f04d72]/12 text-[#f04d72]">
        <Icon size={19} />
      </span>
      <div>
        <h3 className="text-sm font-black">{title}</h3>
        <p className={`mt-1 text-xs ${tone.faintText}`}>{sample}</p>
      </div>
    </div>
    <p className={`mt-4 text-sm leading-7 ${tone.mutedText}`}>{text}</p>
  </div>
);

const MiniProgressMock: React.FC<{ tone: ToneClasses; isDark: boolean }> = ({ tone, isDark }) => (
  <div className={`rounded-3xl border p-5 backdrop-blur ${tone.softSurface}`}>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className={`text-xs font-black uppercase tracking-[0.2em] ${tone.faintText}`}>Bugünkü ritim</div>
        <div className="mt-1 text-xl font-black">+320 XP</div>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-[#f04d72]/12 px-3 py-2 text-sm font-black text-[#f04d72]">
        <Flame size={16} fill="currentColor" />
        12 streak
      </div>
    </div>

    <div className="mt-6 space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-bold">
          <span className={tone.faintText}>Günlük hedef</span>
          <span>68%</span>
        </div>
        <div className={`h-3 rounded-full ${isDark ? 'bg-white/10' : 'bg-[#1f2937]/10'}`}>
          <div className="h-full w-[68%] rounded-full bg-[linear-gradient(90deg,#f04d72,#f4b64d)]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-2xl border p-3 ${tone.surface}`}>
          <div className="flex items-center gap-2 text-sm font-black">
            <Zap size={16} className="text-[#f4b64d]" fill="currentColor" />
            Combo x7
          </div>
        </div>
        <div className={`rounded-2xl border p-3 ${tone.surface}`}>
          <div className="flex items-center gap-2 text-sm font-black">
            <Target size={16} className="text-[#52c7a6]" />
            Review hazır
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {[36, 54, 72, 48, 82, 66].map((height, index) => (
          <div key={index} className={`flex h-16 flex-1 items-end rounded-xl ${isDark ? 'bg-white/6' : 'bg-white/58'}`}>
            <div
              className="w-full rounded-xl bg-[linear-gradient(180deg,#f04d72,#ffb36b)]"
              style={{ height }}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FinalCTA: React.FC<{ tone: ToneClasses; isDark: boolean }> = ({ tone, isDark }) => (
  <div
    className={`relative mx-auto max-w-3xl overflow-hidden rounded-3xl border px-8 py-14 text-center backdrop-blur ${tone.softSurface}`}
    style={{
      background: isDark
        ? 'radial-gradient(circle at 50% 0%, rgba(240,77,114,0.24), transparent 42%), linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025))'
        : 'radial-gradient(circle at 50% 0%, rgba(240,77,114,0.18), transparent 46%), linear-gradient(145deg, rgba(255,255,255,0.88), rgba(255,247,239,0.76))'
    }}
  >
    <div className="pointer-events-none absolute -right-6 -top-6 font-jp text-9xl font-black text-[#f04d72]/10">
      学
    </div>
    <div className="relative">
      <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#f04d72]/20 bg-[#f04d72]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#f04d72]">
        <Sparkles size={14} />
        Kototsuna
      </div>
      <h2 className="text-3xl font-black leading-tight sm:text-5xl">{landingCopy.finalTitle}</h2>
      <p className={`mx-auto mt-5 max-w-xl text-base leading-8 ${tone.mutedText}`}>{landingCopy.finalText}</p>
      <div className="mt-8">
        <StartButton label={landingCopy.finalCta} compact />
      </div>
    </div>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ themeMode }) => {
  const isDark = themeMode === 'dark';
  const tone = buildTone(isDark);

  return (
    <main className={`relative isolate min-h-screen overflow-x-clip ${tone.pageText}`} style={{ background: tone.pageBackground }}>
      <style>
        {`
          html { scroll-behavior: smooth; }

          @keyframes kt-entry-fade {
            from { opacity: 0; transform: translateY(14px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes kt-entry-shift {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.72; }
            50% { transform: translate3d(2.5rem, -1.5rem, 0) scale(1.08); opacity: 0.92; }
          }

          @keyframes kt-entry-drift {
            from { transform: translate3d(0, 0, 0); }
            to { transform: translate3d(-3rem, -4rem, 0); }
          }

          .kt-section-reveal {
            animation: kt-entry-fade 720ms ease-out both;
            animation-timeline: view();
            animation-range: entry 10% cover 34%;
          }

          @supports not (animation-timeline: view()) {
            .kt-section-reveal { animation: kt-entry-fade 720ms ease-out both; }
          }

          @media (prefers-reduced-motion: reduce) {
            html { scroll-behavior: auto; }
            .kt-entry-fade,
            .kt-entry-shift,
            .kt-entry-drift,
            .kt-section-reveal {
              animation: none !important;
            }
          }
        `}
      </style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: tone.pageBackground }} />

        <div
          className={`kt-entry-shift absolute left-1/2 top-[22rem] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${
            isDark ? 'bg-[#f04d72]/16' : 'bg-[#f04d72]/10'
          }`}
          style={{ animation: 'kt-entry-shift 12s ease-in-out infinite' }}
        />

        <div
          className={`absolute inset-0 ${isDark ? 'opacity-[0.08]' : 'opacity-[0.11]'}`}
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '18px 18px',
            color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(31,41,55,0.35)'
          }}
        />

        <div
          className={`kt-entry-drift absolute inset-[-6rem] ${isDark ? 'opacity-35' : 'opacity-20'}`}
          style={{
            animation: 'kt-entry-drift 34s linear infinite alternate',
            backgroundImage:
              'radial-gradient(circle at 14% 20%, currentColor 0 1px, transparent 2px), radial-gradient(circle at 72% 34%, currentColor 0 1px, transparent 2px), radial-gradient(circle at 38% 78%, currentColor 0 1px, transparent 2px), radial-gradient(circle at 86% 82%, currentColor 0 1px, transparent 2px)',
            backgroundSize: '19rem 19rem',
            color: isDark ? 'rgba(255,255,255,0.38)' : 'rgba(31,41,55,0.20)'
          }}
        />
      </div>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
        <div
          className="kt-entry-fade mx-auto flex max-w-4xl flex-col items-center text-center"
          style={{ animation: 'kt-entry-fade 760ms ease-out both' }}
        >
          <div className={`mb-10 flex items-center gap-3 ${tone.faintText}`}>
            <span className={`h-px w-10 ${tone.hairline}`} />
            <span className="text-xs font-black uppercase tracking-[0.34em]">Kototsuna</span>
            <span className={`h-px w-10 ${tone.hairline}`} />
          </div>

          <div
            className={`mb-6 font-jp text-6xl font-black leading-none sm:text-7xl ${
              isDark
                ? 'text-white/92 drop-shadow-[0_0_28px_rgba(240,77,114,0.28)]'
                : 'text-[#f04d72] drop-shadow-[0_12px_28px_rgba(240,77,114,0.12)]'
            }`}
          >
            学
          </div>

          <h1 className="max-w-4xl text-balance text-4xl font-black leading-[1.04] tracking-normal sm:text-6xl lg:text-7xl">
            {landingCopy.title}
          </h1>

          <p className={`mt-6 max-w-2xl text-pretty text-base leading-7 sm:text-lg ${tone.mutedText}`}>
            {landingCopy.subtitle}
          </p>

          <div className="mt-10">
            <StartButton label={landingCopy.cta} />
          </div>

          <p className={`mt-4 text-xs font-semibold tracking-[0.12em] ${tone.faintText}`}>{landingCopy.microcopy}</p>
        </div>
      </section>

      <SectionShell>
        <SectionHeading title={landingCopy.systemTitle} text={landingCopy.systemText} tone={tone} />

        <div className="mx-auto mt-14 grid max-w-4xl gap-8 lg:grid-cols-3">
          {landingCopy.features.map((feature) => (
            <FeatureItem key={feature.title} {...feature} tone={tone} />
          ))}
        </div>

        <div className={`mx-auto mt-16 max-w-3xl rounded-3xl border px-5 py-6 sm:px-8 ${tone.softSurface}`}>
          {landingCopy.steps.map((step, index) => (
            <StepItem
              key={step.title}
              index={index}
              title={step.title}
              text={step.text}
              tone={tone}
              isLast={index === landingCopy.steps.length - 1}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <SectionHeading title={landingCopy.practiceTitle} text={landingCopy.practiceText} tone={tone} />

        <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2">
          {landingCopy.practiceItems.map((item) => (
            <PracticeItem key={item.title} {...item} tone={tone} />
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <SectionHeading
            title={landingCopy.progressTitle}
            text={landingCopy.progressText}
            tone={tone}
            align="left"
          />
          <MiniProgressMock tone={tone} isDark={isDark} />
        </div>
      </SectionShell>

      <SectionShell className="pb-28 sm:pb-36">
        <FinalCTA tone={tone} isDark={isDark} />
      </SectionShell>
    </main>
  );
};
