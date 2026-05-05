import React from 'react';
import {
  ArrowRight,
  BookOpenText,
  Brain,
  Gamepad2,
  Headphones,
  LineChart,
  PencilLine,
  Repeat2,
  Sparkles
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

const copy = {
  tr: {
    title: 'Japoncayi ezberleyerek degil, oynayarak ogren.',
    subtitle: 'Dersler, pratik ve ilerleme sistemiyle kendi hizinda sakin bir Japonca yolculuguna basla.',
    cta: 'Ogrenmeye Basla',
    microcopy: 'Hesap gerekmez - aninda basla',
    valueTitle: 'Sakin bir ders yolu, canli bir pratik ritmi.',
    valueText:
      'Kototsuna Japonca calismayi tek bir basit donguye indirir: yeni konuyu ogren, kisa pratikle guclendir, ilerlemeyi gor.',
    values: ['Structured Learning', 'Gamified Practice', 'Smart Review', 'Progress Tracking'],
    flowTitle: 'Nasil ilerler?',
    flowText: 'Her oturum net baslar, hizli pekisir ve bir sonraki adimi gorunur birakir.',
    steps: [
      { title: 'Learn', text: 'Kisa derslerle kavrami ve kullanimi anla.' },
      { title: 'Practice', text: 'Flashcard, yazma ve dinleme ile bilgiyi aktif hale getir.' },
      { title: 'Master', text: 'Review, streak ve XP ile gelisimi takip et.' }
    ],
    practiceTitle: 'Pratik kisa, net ve oyun hissinde.',
    practiceText: 'Sadece en temel egzersizler: hatirla, yaz, dinle. Gereksiz kalabalik yok.',
    finalTitle: 'Hazirsan Japonca ogrenmeye basla.',
    finalText: 'Ilk dersin seni bekliyor. Tek tikla iceri gir ve ritmini kur.',
    finalCta: 'Basla'
  },
  en: {
    title: 'Learn Japanese like a game.',
    subtitle: 'Start a calm Japanese journey with lessons, practice, and progress that moves at your pace.',
    cta: 'Start Learning',
    microcopy: 'No account needed - start instantly',
    valueTitle: 'A calm lesson path with a lively practice rhythm.',
    valueText:
      'Kototsuna turns Japanese study into one simple loop: learn the next idea, strengthen it through short practice, and see your progress.',
    values: ['Structured Learning', 'Gamified Practice', 'Smart Review', 'Progress Tracking'],
    flowTitle: 'How it works',
    flowText: 'Each session starts clearly, reinforces quickly, and leaves the next step visible.',
    steps: [
      { title: 'Learn', text: 'Understand concepts and usage through focused lessons.' },
      { title: 'Practice', text: 'Make knowledge active with flashcards, writing, and listening.' },
      { title: 'Master', text: 'Use reviews, streaks, and XP to keep improving.' }
    ],
    practiceTitle: 'Practice stays short, clear, and game-like.',
    practiceText: 'Only the essentials: recall, write, listen. No clutter between you and the next answer.',
    finalTitle: 'Ready to start learning Japanese?',
    finalText: 'Your first lesson is waiting. Step in and build your rhythm.',
    finalCta: 'Start'
  }
} as const;

const valueIcons = [BookOpenText, Gamepad2, Brain, LineChart] as const;
const practiceItems = [
  { title: 'Flashcards', icon: Repeat2, sample: '日 -> day' },
  { title: 'Writing', icon: PencilLine, sample: 'type: arigatou' },
  { title: 'Listening', icon: Headphones, sample: 'hear -> choose' }
] as const;

const markLandingSeen = () => {
  try {
    window.localStorage.setItem('hasSeenLanding', 'true');
  } catch {
    // Local storage can be unavailable in private or restricted contexts.
  }
};

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
  <section className={`kt-section-reveal relative z-10 mx-auto w-full max-w-5xl px-5 py-24 sm:py-32 ${className}`}>
    {children}
  </section>
);

export const LandingPage: React.FC<LandingPageProps> = ({ language, themeMode }) => {
  const text = copy[language];
  const isDark = themeMode === 'dark';
  const pageText = isDark ? 'text-white' : 'text-[#1f2937]';
  const mutedText = isDark ? 'text-white/64' : 'text-[#536174]';
  const faintText = isDark ? 'text-white/40' : 'text-[#7d8796]';
  const hairline = isDark ? 'bg-white/14' : 'bg-[#1f2937]/14';
  const surface = isDark
    ? 'border-white/10 bg-white/[0.035] text-white shadow-none'
    : 'border-[#d9e0ea] bg-white/48 text-[#1f2937] shadow-[0_18px_60px_rgba(31,41,55,0.08)]';
  const pageBackground = isDark
    ? 'radial-gradient(circle at 50% 26%, rgba(240,77,114,0.22), transparent 25%), radial-gradient(circle at 18% 18%, rgba(94,158,232,0.18), transparent 29%), radial-gradient(circle at 82% 76%, rgba(82,199,166,0.11), transparent 31%), linear-gradient(140deg, #060912 0%, #111827 46%, #160c18 100%)'
    : 'radial-gradient(circle at 50% 24%, rgba(240,77,114,0.13), transparent 28%), radial-gradient(circle at 18% 18%, rgba(94,158,232,0.14), transparent 31%), radial-gradient(circle at 82% 76%, rgba(82,199,166,0.10), transparent 33%), linear-gradient(140deg, #fff8fb 0%, #f5f9ff 48%, #fff7ef 100%)';

  return (
    <main className={`relative isolate min-h-screen overflow-x-clip ${pageText}`} style={{ background: pageBackground }}>
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
        <div
          className="absolute inset-0"
          style={{
            background: pageBackground
          }}
        />

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
          <div className={`mb-10 flex items-center gap-3 ${faintText}`}>
            <span className={`h-px w-10 ${hairline}`} />
            <span className="text-xs font-black uppercase tracking-[0.34em]">Kototsuna</span>
            <span className={`h-px w-10 ${hairline}`} />
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
            {text.title}
          </h1>

          <p className={`mt-6 max-w-2xl text-pretty text-base leading-7 sm:text-lg ${mutedText}`}>
            {text.subtitle}
          </p>

          <div className="mt-10">
            <StartButton label={text.cta} />
          </div>

          <p className={`mt-4 text-xs font-semibold tracking-[0.12em] ${faintText}`}>{text.microcopy}</p>
        </div>
      </section>

      <SectionShell>
        <div className="mx-auto max-w-3xl text-center">
          <div className={`mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border ${surface}`}>
            <Sparkles size={20} className="text-[#f04d72]" />
          </div>
          <h2 className="text-3xl font-black leading-tight sm:text-5xl">{text.valueTitle}</h2>
          <p className={`mx-auto mt-5 max-w-2xl text-base leading-8 sm:text-lg ${mutedText}`}>{text.valueText}</p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {text.values.map((value, index) => {
            const Icon = valueIcons[index];
            return (
              <div
                key={value}
                className="group flex flex-col items-center gap-3 text-center transition duration-200 hover:-translate-y-1"
              >
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${surface}`}>
                  <Icon size={22} className="text-[#f04d72]" />
                </span>
                <span className="text-sm font-black">{value}</span>
              </div>
            );
          })}
        </div>
      </SectionShell>

      <SectionShell>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black leading-tight sm:text-5xl">{text.flowTitle}</h2>
          <p className={`mx-auto mt-5 max-w-2xl text-base leading-8 sm:text-lg ${mutedText}`}>{text.flowText}</p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-8 lg:grid-cols-3 lg:gap-5">
          {text.steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {index < text.steps.length - 1 && (
                <div className={`absolute left-[calc(50%+2rem)] top-7 hidden h-px w-[calc(100%-4rem)] lg:block ${hairline}`} />
              )}
              <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f04d72] text-sm font-black text-white shadow-[0_0_28px_rgba(240,77,114,0.24)]">
                {index + 1}
              </div>
              <h3 className="mt-6 text-xl font-black">{step.title}</h3>
              <p className={`mx-auto mt-3 max-w-xs text-sm leading-7 ${mutedText}`}>{step.text}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-black leading-tight sm:text-5xl">{text.practiceTitle}</h2>
            <p className={`mt-5 max-w-xl text-base leading-8 sm:text-lg ${mutedText}`}>{text.practiceText}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {practiceItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`group flex items-center justify-between gap-4 rounded-2xl border p-4 backdrop-blur transition duration-200 hover:-translate-y-1 ${surface}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f04d72]/12 text-[#f04d72]">
                      <Icon size={20} />
                    </span>
                    <div>
                      <h3 className="text-sm font-black">{item.title}</h3>
                      <p className={`mt-1 text-xs ${faintText}`}>{item.sample}</p>
                    </div>
                  </div>
                  <span className={`hidden h-2 w-16 rounded-full sm:block ${isDark ? 'bg-white/10' : 'bg-[#1f2937]/10'}`}>
                    <span className="block h-full w-2/3 rounded-full bg-[#f04d72]" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </SectionShell>

      <SectionShell className="pb-32 sm:pb-40">
        <div className={`mx-auto max-w-4xl rounded-[2rem] border px-6 py-14 text-center backdrop-blur sm:px-10 sm:py-16 ${surface}`}>
          <h2 className="text-3xl font-black leading-tight sm:text-5xl">{text.finalTitle}</h2>
          <p className={`mx-auto mt-5 max-w-2xl text-base leading-8 ${mutedText}`}>{text.finalText}</p>
          <div className="mt-9">
            <StartButton label={text.finalCta} compact />
          </div>
        </div>
      </SectionShell>
    </main>
  );
};
