import React, { useMemo } from 'react';
import { ArrowLeft, BookOpenText, CheckCircle2, Sparkles, Volume2 } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AppLanguage } from '../../data/appPreferences';
import { appShellRoutes } from '../../data/appShellContent';
import {
  findLearnUnitById,
  getLearnCourseSections,
  LearnCourseUnit
} from '../../data/learnCourseContent';
import { MascotFigure } from '../../components/mascot/MascotFigure';

interface LearnGuidePageProps {
  language: AppLanguage;
}

interface GuidePhrase {
  japanese: string;
  romaji: string;
  tr: string;
  en: string;
}

const copy = {
  tr: {
    back: 'Geri',
    title: (unitNumber: number) => `${unitNumber}. Ünite Rehberi`,
    intro: 'Bu ünitenin dil bilgisi ipuçlarını öğren ve anahtar ifadeleri gör',
    keyPhrases: 'Anahtar ifadeler',
    grammar: 'Dil bilgisi ipuçları',
    lessons: 'Dersler',
    vocabulary: 'Kelime seti',
    goals: 'Bu ünitede yapabileceklerin',
    listen: 'Dinle'
  },
  en: {
    back: 'Back',
    title: (unitNumber: number) => `Unit ${unitNumber} Guide`,
    intro: 'Learn the language tips and key phrases for this unit',
    keyPhrases: 'Key phrases',
    grammar: 'Language tips',
    lessons: 'Lessons',
    vocabulary: 'Word set',
    goals: 'What you will be able to do',
    listen: 'Listen'
  }
} as const;

const guidePhrasesByUnit: Record<string, GuidePhrase[]> = {
  'p1-u1': [
    { japanese: 'おちゃ、ください！', romaji: 'ocha, kudasai', tr: 'Çay, lütfen!', en: 'Tea, please!' },
    { japanese: 'すし、ください！', romaji: 'sushi, kudasai', tr: 'Suşi, lütfen!', en: 'Sushi, please!' },
    { japanese: 'みず、ください。', romaji: 'mizu, kudasai', tr: 'Su, lütfen.', en: 'Water, please.' },
    { japanese: 'ごはんとみず、ください。', romaji: 'gohan to mizu, kudasai', tr: 'Pilav ve su, lütfen.', en: 'Rice and water, please.' },
    { japanese: 'すしです。', romaji: 'sushi desu', tr: 'Suşidir.', en: 'It is sushi.' }
  ],
  'p1-u2': [
    { japanese: 'これは大きいです。', romaji: 'kore wa ookii desu', tr: 'Bu büyüktür.', en: 'This is big.' },
    { japanese: 'この本は新しいです。', romaji: 'kono hon wa atarashii desu', tr: 'Bu kitap yenidir.', en: 'This book is new.' },
    { japanese: 'あの店は静かです。', romaji: 'ano mise wa shizuka desu', tr: 'Şu dükkan sakindir.', en: 'That shop is quiet.' }
  ],
  'p1-u3': [
    { japanese: 'おはようございます。', romaji: 'ohayou gozaimasu', tr: 'Günaydın.', en: 'Good morning.' },
    { japanese: 'こんにちは。', romaji: 'konnichiwa', tr: 'Merhaba.', en: 'Hello.' },
    { japanese: 'またね。', romaji: 'mata ne', tr: 'Görüşürüz.', en: 'See you.' }
  ],
  'p1-u4': [
    { japanese: 'トルコから来ました。', romaji: 'Toruko kara kimashita', tr: 'Türkiye’den geldim.', en: 'I came from Turkey.' },
    { japanese: '日本語を勉強します。', romaji: 'nihongo o benkyou shimasu', tr: 'Japonca çalışıyorum.', en: 'I study Japanese.' },
    { japanese: '英語も話します。', romaji: 'eigo mo hanashimasu', tr: 'İngilizce de konuşurum.', en: 'I also speak English.' }
  ]
};

const phraseWidths = ['max-w-[14.5rem]', 'max-w-[14rem]', 'max-w-[14.5rem]', 'max-w-[18rem]', 'max-w-[12rem]'];

const buildFallbackPhrases = (unit: LearnCourseUnit): GuidePhrase[] =>
  unit.dialogue.map((line) => ({
    japanese: line.text,
    romaji: line.text,
    tr: line.translation,
    en: line.translation
  }));

const speakJapanese = (text: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
};

export const LearnGuidePage: React.FC<LearnGuidePageProps> = ({ language }) => {
  const navigate = useNavigate();
  const { unitId } = useParams();
  const pageCopy = copy[language];
  const sections = useMemo(() => getLearnCourseSections(language), [language]);
  const unit = unitId ? findLearnUnitById(sections, unitId) : null;

  if (!unit) {
    return <Navigate to={appShellRoutes.learn} replace />;
  }

  const phrases = buildFallbackPhrases(unit);

  return (
    <div className="mx-auto w-full max-w-[42rem] pb-20">
      <button
        type="button"
        onClick={() => navigate(appShellRoutes.learn)}
        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)] transition hover:text-[var(--kt-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kt-focus-ring)]"
      >
        <ArrowLeft size={19} strokeWidth={3} />
        {pageCopy.back}
      </button>

      <section className="mt-4 border-y border-[var(--kt-border)] py-5 sm:py-7">
        <div className="grid items-center gap-5 sm:grid-cols-[9.5rem_minmax(0,1fr)]">
          <div className="relative flex justify-center sm:justify-start">
            <div className="absolute bottom-1 h-16 w-24 rounded-full bg-[var(--kt-ink-subtle)] opacity-25" />
            <MascotFigure pose={unit.mascotPose} tone={unit.tone} size={136} className="relative" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-accent-info)]">
              <BookOpenText size={16} strokeWidth={3} />
              {unit.title}
            </div>
            <h1 className="mt-2 text-2xl font-black leading-tight text-[var(--kt-ink-strong)] sm:text-3xl">
              {pageCopy.title(unit.unitNumber)}
            </h1>
            <p className="mt-3 max-w-[28rem] text-base font-bold leading-7 text-[var(--kt-ink)]">
              {pageCopy.intro}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--kt-accent-info)]">
          {pageCopy.keyPhrases}
        </h2>
        <div className="mt-4 space-y-5">
          {phrases.map((phrase, index) => (
            <article
              key={`${phrase.japanese}-${index}`}
              className={`relative rounded-[1rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-3 shadow-[var(--kt-shadow-sm)] ${phraseWidths[index % phraseWidths.length]}`}
            >
              <span className="absolute left-[-0.55rem] top-6 h-4 w-4 rotate-45 border-b-2 border-l-2 border-[var(--kt-border)] bg-[var(--kt-surface)]" />
              <div className="relative flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => speakJapanese(phrase.japanese)}
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--kt-accent-info-soft)] text-[var(--kt-accent-info)] transition hover:bg-[var(--kt-accent-info)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kt-focus-ring)]"
                  aria-label={`${pageCopy.listen}: ${phrase.romaji}`}
                >
                  <Volume2 size={19} strokeWidth={3} />
                </button>
                <div className="min-w-0">
                  <div className="font-jp text-lg font-black leading-7 text-[var(--kt-ink-strong)] decoration-[var(--kt-border)] decoration-dashed underline-offset-4 underline">
                    {phrase.japanese}
                  </div>
                  <div className="mt-1 text-sm font-bold leading-5 text-[var(--kt-ink-muted)]">
                    {language === 'tr' ? phrase.tr : phrase.en}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--kt-accent-info)]">
            {pageCopy.grammar}
          </h2>
          <div className="mt-3 space-y-3">
            {unit.grammarFocus.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-[1rem] border border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-3 text-sm font-bold leading-6 text-[var(--kt-ink)]"
              >
                <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--kt-accent-success)]" size={18} strokeWidth={3} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--kt-accent-info)]">
            {pageCopy.goals}
          </h2>
          <div className="mt-3 space-y-3">
            {unit.goals.map((goal) => (
              <div
                key={goal}
                className="flex items-start gap-3 rounded-[1rem] border border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-3 text-sm font-bold leading-6 text-[var(--kt-ink)]"
              >
                <Sparkles className="mt-0.5 shrink-0 text-[var(--kt-accent-warning)]" size={18} strokeWidth={3} />
                <span>{goal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--kt-accent-info)]">
          {pageCopy.lessons}
        </h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {unit.lessonHighlights.map((lesson, index) => (
            <div
              key={`${lesson}-${index}`}
              className="rounded-[0.9rem] border border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-3 text-sm font-black text-[var(--kt-ink)] shadow-[var(--kt-shadow-sm)]"
            >
              {index + 1}. {lesson}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--kt-accent-info)]">
          {pageCopy.vocabulary}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {unit.vocabulary.map((word) => (
            <span
              key={word}
              className="rounded-[0.8rem] border border-[var(--kt-border)] bg-[var(--kt-surface)] px-3 py-2 font-jp text-sm font-black text-[var(--kt-ink)] shadow-[var(--kt-shadow-sm)]"
            >
              {word}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LearnGuidePage;
