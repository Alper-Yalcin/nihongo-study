import React from 'react';
import { ArrowRight, BookOpenText, Languages, PlayCircle, Sparkles, Swords, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../shared/ui';
import { AppLanguage, ThemeMode } from '../data/appPreferences';
import { appShellRoutes, getPracticeRoute } from '../data/appShellContent';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { MascotFigure } from '../components/mascot/MascotFigure';

interface LandingPageProps {
  language: AppLanguage;
  activeScript: KanaScript;
  themeMode: ThemeMode;
}

const copy = {
  tr: {
    eyebrow: 'Kototsuna',
    title: 'Japoncayi karakterden cumleye tasiyan yeni calisma alani',
    lead:
      'Landing artik ayri. Ogren, Harfler, Alistirma ve Oyun artik farkli amaclara hizmet eden net alanlar.',
    primaryCta: 'Ogren alanina gir',
    secondaryCta: 'Harfleri ac',
    tertiaryCta: 'Pratige gec',
    topLearn: 'Ogren',
    topLetters: 'Harfler',
    topPractice: 'Alistirma',
    featureEyebrow: 'Neyi ayirdik?',
    featureTitle: 'Her alanin artik tek bir isi var',
    cards: [
      {
        title: 'Ogren',
        description: 'Unite, konu, kelime ve gramer akisi. Burasi artik ana kurs yolu.',
        cta: 'Kurs yolunu ac'
      },
      {
        title: 'Harfler',
        description: 'Hiragana ve katakana hecelerini, satirlari ve benzer formlari burada oturt.',
        cta: 'Hece modulu'
      },
      {
        title: 'Alistirma',
        description: 'Review, weak, confusable ve istatistik odakli tekrar alanlari.',
        cta: 'Tekrar ekranlari'
      }
    ],
    sectionsEyebrow: 'Sistemin omurgasi',
    sectionsTitle: 'Ilk adimdan beri net ilerleyen bir akis',
    railTitle: 'Bugun ne yapmak istiyorsun?',
    railCopy:
      'Yeni landing seni shell icine zorla atmiyor. Ilk giriste dogrudan amac secimi yapiyorsun.',
    questsCta: 'Gorevlere bak',
    playCta: 'Oyuna git'
  },
  en: {
    eyebrow: 'Kototsuna',
    title: 'A new Japanese study surface that moves from characters to sentences',
    lead:
      'Landing is now separate. Learn, Letters, Practice, and Play each have a clearer purpose.',
    primaryCta: 'Enter learn',
    secondaryCta: 'Open letters',
    tertiaryCta: 'Open practice',
    topLearn: 'Learn',
    topLetters: 'Letters',
    topPractice: 'Practice',
    featureEyebrow: 'What changed?',
    featureTitle: 'Each area now has one clear job',
    cards: [
      {
        title: 'Learn',
        description: 'Unit-based course flow for topics, vocabulary, and grammar.',
        cta: 'Open course path'
      },
      {
        title: 'Letters',
        description: 'Use this area for hiragana and katakana syllables, rows, and shape recall.',
        cta: 'Open syllable module'
      },
      {
        title: 'Practice',
        description: 'Review, weak, confusable, and stats-focused repetition screens.',
        cta: 'Open review tools'
      }
    ],
    sectionsEyebrow: 'Core structure',
    sectionsTitle: 'A clearer flow from the first click',
    railTitle: 'What do you want to do today?',
    railCopy:
      'The new landing does not dump you directly into the shell. You choose your intent first.',
    questsCta: 'Open quests',
    playCta: 'Open play'
  }
} as const;

const landingCards = [
  {
    id: 'learn',
    icon: BookOpenText,
    accent:
      'bg-[linear-gradient(135deg,var(--kt-brand)_0%,var(--kt-accent-sunset)_100%)]',
    glow: 'rgba(208,96,112,0.28)'
  },
  {
    id: 'letters',
    icon: Languages,
    accent:
      'bg-[linear-gradient(135deg,var(--kt-accent-info)_0%,var(--kt-accent-success)_100%)]',
    glow: 'rgba(54,160,255,0.24)'
  },
  {
    id: 'practice',
    icon: Swords,
    accent:
      'bg-[linear-gradient(135deg,var(--kt-accent-warning)_0%,var(--kt-accent-sunset)_100%)]',
    glow: 'rgba(255,186,90,0.24)'
  }
] as const;

export const LandingPage: React.FC<LandingPageProps> = ({ language, activeScript, themeMode }) => {
  const text = copy[language];
  const lettersHref = `${appShellRoutes.letters}?script=${activeScript}`;
  const practiceHref = getPracticeRoute(activeScript);
  const logoSrc = themeMode === 'dark' ? '/logo/kototsuna-logo.png' : '/logo/kototsuna-logo-light.png';
  const isDark = themeMode === 'dark';

  const pageClassName = isDark
    ? 'min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(54,160,255,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(208,96,112,0.14),transparent_28%),linear-gradient(180deg,#071017_0%,#0d1822_52%,#111d28_100%)] text-white'
    : 'min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(54,160,255,0.10),transparent_34%),radial-gradient(circle_at_top_right,rgba(208,96,112,0.10),transparent_28%),linear-gradient(180deg,#f9fbfd_0%,#f7f3f6_52%,#fdf7f6_100%)] text-[var(--kt-ink)]';

  const headerSurfaceClassName = isDark
    ? 'border-white/10 bg-[rgba(10,18,26,0.72)]'
    : 'border-[var(--kt-border)] bg-[rgba(255,255,255,0.86)] shadow-[var(--kt-shadow-sm)]';

  const heroSurfaceClassName = isDark
    ? 'border-white/10 bg-[rgba(10,18,26,0.76)] shadow-[0_30px_80px_rgba(0,0,0,0.28)]'
    : 'border-[var(--kt-border)] bg-[rgba(255,255,255,0.90)] shadow-[var(--kt-shadow-lg)]';

  const railSurfaceClassName = isDark
    ? 'border-white/10 bg-[rgba(10,18,26,0.76)] shadow-[0_20px_50px_rgba(0,0,0,0.24)]'
    : 'border-[var(--kt-border)] bg-[rgba(255,255,255,0.92)] shadow-[var(--kt-shadow)]';

  const featureSurfaceClassName = isDark
    ? 'border-white/10 bg-[rgba(10,18,26,0.68)]'
    : 'border-[var(--kt-border)] bg-[rgba(255,255,255,0.94)] shadow-[var(--kt-shadow-sm)]';

  const featureCardClassName = isDark
    ? 'border-white/10 bg-[rgba(255,255,255,0.04)] text-white'
    : 'border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] text-[var(--kt-ink)]';

  const headingTextClassName = isDark ? 'text-white' : 'text-[var(--kt-ink-strong)]';
  const mutedTextClassName = isDark ? 'text-white/72' : 'text-[var(--kt-ink-muted)]';
  const subtleTextClassName = isDark ? 'text-white/52' : 'text-[var(--kt-ink-subtle)]';
  const featureEyebrowTextClassName = isDark ? 'text-white/48' : 'text-[var(--kt-ink-subtle)]';
  const featureIconClassName = isDark
    ? 'bg-[rgba(255,255,255,0.08)] text-white'
    : 'bg-[var(--kt-surface-muted)] text-[var(--kt-ink-strong)]';

  return (
    <div className={pageClassName}>
      <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header
          className={`flex flex-wrap items-center justify-between gap-4 rounded-[1.8rem] border px-5 py-4 backdrop-blur ${headerSurfaceClassName}`}
        >
          <Link to={appShellRoutes.home} className="flex items-center gap-3">
            <img src={logoSrc} alt="Kototsuna" className="h-10 w-auto" />
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Button as="link" to={appShellRoutes.learn} variant="secondary" size="sm">
              {text.topLearn}
            </Button>
            <Button as="link" to={lettersHref} variant="secondary" size="sm">
              {text.topLetters}
            </Button>
            <Button as="link" to={practiceHref} variant="secondary" size="sm">
              {text.topPractice}
            </Button>
          </div>
        </header>

        <main className="flex-1 py-8 lg:py-12">
          <section className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(24rem,0.9fr)] xl:items-center">
            <div className="relative">
              <div className="absolute -left-12 top-6 h-36 w-36 rounded-full bg-[rgba(208,96,112,0.18)] blur-3xl" />
              <div className="absolute left-44 top-28 h-44 w-44 rounded-full bg-[rgba(54,160,255,0.16)] blur-3xl" />
                <div
                  className={`relative rounded-[2.3rem] border p-7 backdrop-blur md:p-10 ${heroSurfaceClassName}`}
                >
                  <div className={`text-xs font-black uppercase tracking-[0.28em] ${subtleTextClassName}`}>
                  {text.eyebrow}
                </div>
                  <h1 className={`mt-5 max-w-4xl text-5xl font-black leading-[1.04] md:text-6xl xl:text-7xl ${headingTextClassName}`}>
                  {text.title}
                </h1>
                  <p className={`mt-6 max-w-3xl text-lg leading-8 md:text-xl ${mutedTextClassName}`}>
                  {text.lead}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button as="link" to={appShellRoutes.learn} iconEnd={<ArrowRight size={16} />}>
                    {text.primaryCta}
                  </Button>
                  <Button as="link" to={lettersHref} variant="secondary">
                    {text.secondaryCta}
                  </Button>
                  <Button as="link" to={practiceHref} variant="secondary">
                    {text.tertiaryCta}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                {landingCards.slice(0, 2).map((card, index) => {
                  const Icon = card.icon;
                  const cardCopy = text.cards[index];

                  return (
                    <article
                      key={card.id}
                      className={`rounded-[2rem] border border-white/10 p-6 shadow-[0_20px_50px_var(--shadow-color)] ${card.accent}`}
                      style={{ ['--shadow-color' as string]: card.glow }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs font-black uppercase tracking-[0.2em] text-white/68">
                            {cardCopy.cta}
                          </div>
                          <h2 className="mt-3 text-3xl font-black text-white">{cardCopy.title}</h2>
                        </div>
                        <span className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[rgba(255,255,255,0.16)]">
                          <Icon size={24} />
                        </span>
                      </div>
                      <p className="mt-5 max-w-sm text-sm leading-7 text-white/82">{cardCopy.description}</p>
                    </article>
                  );
                })}
              </div>

              <article
                className={`rounded-[2rem] border p-6 backdrop-blur ${railSurfaceClassName}`}
              >
                <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_12rem] md:items-center">
                  <div>
                    <div className={`text-xs font-black uppercase tracking-[0.2em] ${featureEyebrowTextClassName}`}>
                      {text.railTitle}
                    </div>
                    <p className={`mt-4 text-base leading-8 ${mutedTextClassName}`}>{text.railCopy}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button as="link" to={appShellRoutes.quests} variant="secondary" size="sm" iconStart={<Trophy size={16} />}>
                        {text.questsCta}
                      </Button>
                      <Button as="link" to={`${appShellRoutes.hiraganaPlay}?game=kana-match`} size="sm" iconStart={<PlayCircle size={16} />}>
                        {text.playCta}
                      </Button>
                    </div>
                  </div>
                  <div className="justify-self-center">
                    <MascotFigure pose="cheer" tone="brand" size={164} />
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section className={`mt-16 rounded-[2.2rem] border p-7 backdrop-blur md:p-9 ${featureSurfaceClassName}`}>
            <div className={`text-xs font-black uppercase tracking-[0.22em] ${featureEyebrowTextClassName}`}>
              {text.featureEyebrow}
            </div>
            <h2 className={`mt-4 text-4xl font-black md:text-5xl ${headingTextClassName}`}>{text.featureTitle}</h2>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {text.cards.map((card, index) => {
                const config = landingCards[index];
                const Icon = config.icon;
                const href =
                  config.id === 'learn'
                    ? appShellRoutes.learn
                    : config.id === 'letters'
                      ? lettersHref
                      : practiceHref;

                return (
                  <Card
                    key={card.title}
                    padding="lg"
                    className={featureCardClassName}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className={`text-2xl font-black ${headingTextClassName}`}>{card.title}</h3>
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-[1rem] ${featureIconClassName}`}
                      >
                        <Icon size={22} />
                      </span>
                    </div>
                    <p className={`mt-4 text-sm leading-7 ${mutedTextClassName}`}>{card.description}</p>
                    <div className="mt-6">
                      <Button as="link" to={href} fullWidth variant={config.id === 'learn' ? 'primary' : 'secondary'}>
                        {card.cta}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
