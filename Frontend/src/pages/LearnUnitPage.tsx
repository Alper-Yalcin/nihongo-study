import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Heart, Volume2, X } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AppLanguage } from '../data/appPreferences';
import { appShellRoutes, getLearnUnitRoute } from '../data/appShellContent';
import {
  findLearnUnitById,
  flattenLearnCourseUnits,
  getLearnCourseSections,
  LearnCourseUnit
} from '../data/learnCourseContent';
import { useLearnCourseProgress } from '../hooks/useLearnCourseProgress';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { MascotFigure } from '../components/mascot/MascotFigure';

interface LearnUnitPageProps {
  language: AppLanguage;
  activeScript: KanaScript;
}

interface LessonWord {
  key: string;
  japanese: string;
  romaji: string;
  tr: string;
  en: string;
}

type LessonTask =
  | { type: 'teach'; word: LessonWord }
  | { type: 'listen'; word: LessonWord; options: LessonWord[] }
  | { type: 'build'; japanese: string; romaji: string; answerTokens: string[]; bankTokens: string[] }
  | { type: 'choice'; word: LessonWord; options: string[]; answer: string };

const pageCopy = {
  tr: {
    close: 'Kapat',
    lockedTitle: 'Bu ders kilitli',
    lockedMessage: 'Önce yol haritasındaki aktif üniteyi tamamla.',
    nextUnit: 'Sonraki ünite',
    backToMap: 'Haritaya dön',
    continue: 'Devam et',
    check: 'Kontrol et',
    completeTitle: 'Ders tamamlandı',
    completeBody: '+10 puan kazandın. Bir sonraki düğüm haritada açıldı.',
    teachTitle: 'Yeni kelime',
    listenTitle: 'İşittiğine dokun',
    buildTitle: 'Aşağıdakinin Türkçesini yaz',
    choiceTitle: 'Doğru anlamı seç',
    correct: 'Doğru',
    wrong: 'Tekrar dene',
    tapToHear: 'Dinle'
  },
  en: {
    close: 'Close',
    lockedTitle: 'This lesson is locked',
    lockedMessage: 'Complete the active unit on the roadmap first.',
    nextUnit: 'Next unit',
    backToMap: 'Back to map',
    continue: 'Continue',
    check: 'Check',
    completeTitle: 'Lesson complete',
    completeBody: 'You earned +10 XP. The next node is now open on the map.',
    teachTitle: 'New word',
    listenTitle: 'Tap what you hear',
    buildTitle: 'Write this in English',
    choiceTitle: 'Choose the correct meaning',
    correct: 'Correct',
    wrong: 'Try again',
    tapToHear: 'Listen'
  }
} as const;

const lessonWords: Record<string, LessonWord> = {
  mizu: { key: 'mizu', japanese: 'みず', romaji: 'mizu', tr: 'su', en: 'water' },
  ocha: { key: 'ocha', japanese: 'おちゃ', romaji: 'ocha', tr: 'çay', en: 'tea' },
  kohi: { key: 'kohi', japanese: 'コーヒー', romaji: 'koohii', tr: 'kahve', en: 'coffee' },
  pan: { key: 'pan', japanese: 'パン', romaji: 'pan', tr: 'ekmek', en: 'bread' },
  gohan: { key: 'gohan', japanese: 'ごはん', romaji: 'gohan', tr: 'pilav', en: 'rice' },
  kudasai: { key: 'kudasai', japanese: 'ください', romaji: 'kudasai', tr: 'lütfen', en: 'please' },
  ookii: { key: 'ookii', japanese: '大きい', romaji: 'ookii', tr: 'büyük', en: 'big' },
  chiisai: { key: 'chiisai', japanese: '小さい', romaji: 'chiisai', tr: 'küçük', en: 'small' },
  atarashii: { key: 'atarashii', japanese: '新しい', romaji: 'atarashii', tr: 'yeni', en: 'new' },
  shizuka: { key: 'shizuka', japanese: '静か', romaji: 'shizuka', tr: 'sakin', en: 'quiet' },
  kirei: { key: 'kirei', japanese: 'きれい', romaji: 'kirei', tr: 'güzel', en: 'pretty' },
  yuumei: { key: 'yuumei', japanese: '有名', romaji: 'yuumei', tr: 'ünlü', en: 'famous' },
  ohayou: { key: 'ohayou', japanese: 'おはよう', romaji: 'ohayou', tr: 'günaydın', en: 'good morning' },
  konnichiwa: { key: 'konnichiwa', japanese: 'こんにちは', romaji: 'konnichiwa', tr: 'merhaba', en: 'hello' },
  konbanwa: { key: 'konbanwa', japanese: 'こんばんは', romaji: 'konbanwa', tr: 'iyi akşamlar', en: 'good evening' },
  hajimemashite: { key: 'hajimemashite', japanese: 'はじめまして', romaji: 'hajimemashite', tr: 'memnun oldum', en: 'nice to meet you' },
  'jaa ne': { key: 'jaa ne', japanese: 'じゃあね', romaji: 'jaa ne', tr: 'görüşürüz', en: 'see you' },
  'mata ne': { key: 'mata ne', japanese: 'またね', romaji: 'mata ne', tr: 'sonra görüşürüz', en: 'see you later' },
  nihon: { key: 'nihon', japanese: '日本', romaji: 'nihon', tr: 'Japonya', en: 'Japan' },
  toruko: { key: 'toruko', japanese: 'トルコ', romaji: 'toruko', tr: 'Türkiye', en: 'Turkey' },
  amerika: { key: 'amerika', japanese: 'アメリカ', romaji: 'amerika', tr: 'Amerika', en: 'America' },
  nihonjin: { key: 'nihonjin', japanese: '日本人', romaji: 'nihonjin', tr: 'Japon', en: 'Japanese person' },
  eigo: { key: 'eigo', japanese: '英語', romaji: 'eigo', tr: 'İngilizce', en: 'English' },
  go: { key: 'go', japanese: '語', romaji: 'go', tr: 'dil', en: 'language' }
};

const phraseByUnit: Record<string, { japanese: string; romaji: string; tr: string[]; en: string[]; distractors: string[] }> = {
  'p1-u1': {
    japanese: 'みずとおちゃをください',
    romaji: 'mizu to ocha o kudasai',
    tr: ['su', 've', 'çay', 'lütfen'],
    en: ['water', 'and', 'tea', 'please'],
    distractors: ['pilav', 'yemek', 'suşi', 'kahve']
  },
  'p1-u2': {
    japanese: '大きいおちゃです',
    romaji: 'ookii ocha desu',
    tr: ['büyük', 'çay'],
    en: ['big', 'tea'],
    distractors: ['küçük', 'sakin', 'yeni', 'su']
  }
};

const speakJapanese = (text: string) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.78;
  window.speechSynthesis.speak(utterance);
};

const getWordTranslation = (word: LessonWord, language: AppLanguage) =>
  language === 'tr' ? word.tr : word.en;

const getUnitWords = (unit: LearnCourseUnit): LessonWord[] =>
  unit.vocabulary.map((entry) => {
    const known = lessonWords[entry];

    if (known) {
      return known;
    }

    return {
      key: entry,
      japanese: entry,
      romaji: entry,
      tr: entry,
      en: entry
    };
  });

const buildLessonTasks = (unit: LearnCourseUnit, language: AppLanguage): LessonTask[] => {
  const words = getUnitWords(unit);
  const focusWords = words.slice(0, 4);
  const first = focusWords[0] ?? words[0];
  const second = focusWords[1] ?? first;
  const phrase = phraseByUnit[unit.id];
  const answerTokens = phrase ? phrase[language] : [getWordTranslation(first, language), getWordTranslation(second, language)];
  const bankTokens = Array.from(new Set([...(answerTokens ?? []), ...(phrase?.distractors ?? words.slice(2, 6).map((word) => getWordTranslation(word, language)))]));
  const choiceAnswer = getWordTranslation(second, language);
  const choiceOptions = Array.from(
    new Set([
      choiceAnswer,
      ...words
        .filter((word) => word.key !== second.key)
        .slice(0, 4)
        .map((word) => getWordTranslation(word, language))
    ])
  ).slice(0, 4);

  return [
    ...focusWords.slice(0, 3).map((word): LessonTask => ({ type: 'teach', word })),
    { type: 'listen', word: first, options: focusWords.slice(0, 4) },
    {
      type: 'build',
      japanese: phrase?.japanese ?? `${first.japanese} と ${second.japanese}`,
      romaji: phrase?.romaji ?? `${first.romaji} to ${second.romaji}`,
      answerTokens,
      bankTokens
    },
    { type: 'choice', word: second, options: choiceOptions, answer: choiceAnswer }
  ];
};

const FeedbackBar: React.FC<{
  tone: 'correct' | 'wrong';
  label: string;
  onContinue: () => void;
  continueLabel: string;
}> = ({ tone, label, onContinue, continueLabel }) => (
  <div
    className={`fixed inset-x-0 bottom-0 z-40 border-t px-4 py-4 shadow-[0_-18px_40px_rgba(0,0,0,0.25)] ${
      tone === 'correct'
        ? 'border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)]'
        : 'border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)]'
    }`}
  >
    <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-lg font-black">
        {tone === 'correct' ? <Check size={24} strokeWidth={3} /> : <X size={24} strokeWidth={3} />}
        {label}
      </div>
      <button
        type="button"
        onClick={onContinue}
        className="rounded-[0.85rem] bg-[var(--kt-surface)] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] shadow-[var(--kt-shadow-sm)]"
      >
        {continueLabel}
      </button>
    </div>
  </div>
);

export const LearnUnitPage: React.FC<LearnUnitPageProps> = ({ language }) => {
  const { unitId = '' } = useParams();
  const navigate = useNavigate();
  const copy = pageCopy[language];
  const sections = useMemo(() => getLearnCourseSections(language), [language]);
  const units = useMemo(() => flattenLearnCourseUnits(sections), [sections]);
  const orderedUnitIds = useMemo(() => units.map((entry) => entry.id), [units]);
  const unit = useMemo(() => findLearnUnitById(sections, unitId), [sections, unitId]);
  const { currentUnitId, getUnitState, setUnitCompleted } = useLearnCourseProgress(orderedUnitIds);
  const [taskIndex, setTaskIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [finished, setFinished] = useState(false);

  const tasks = useMemo(() => (unit ? buildLessonTasks(unit, language) : []), [language, unit]);
  const task = tasks[taskIndex];
  const progress = tasks.length > 0 ? ((taskIndex + (finished ? 1 : 0)) / tasks.length) * 100 : 0;
  const unitIndex = unit ? units.findIndex((entry) => entry.id === unit.id) : -1;
  const nextUnit = unitIndex >= 0 && unitIndex < units.length - 1 ? units[unitIndex + 1] : null;

  useEffect(() => {
    setSelectedTokens([]);
    setFeedback(null);
  }, [taskIndex]);

  if (!unit) {
    return <Navigate to={appShellRoutes.learn} replace />;
  }

  if (getUnitState(unit.id) === 'locked') {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center pb-12">
        <h1 className="text-3xl font-black text-[var(--kt-ink-strong)]">{copy.lockedTitle}</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--kt-ink-muted)]">{copy.lockedMessage}</p>
        <button
          type="button"
          onClick={() => navigate(currentUnitId ? getLearnUnitRoute(currentUnitId) : appShellRoutes.learn)}
          className="mt-6 w-fit rounded-[0.9rem] bg-[var(--kt-brand)] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-brand-on)]"
        >
          {copy.nextUnit}
        </button>
      </div>
    );
  }

  const completeTask = () => {
    if (taskIndex >= tasks.length - 1) {
      setUnitCompleted(unit.id, true);
      setFinished(true);
      setFeedback(null);
      return;
    }

    setTaskIndex((current) => current + 1);
  };

  const markWrong = () => {
    setLives((current) => Math.max(0, current - 1));
    setFeedback('wrong');
  };

  const handleBuildCheck = () => {
    if (task?.type !== 'build') {
      return;
    }

    const isCorrect = selectedTokens.join('|') === task.answerTokens.join('|');

    if (isCorrect) {
      setFeedback('correct');
    } else {
      markWrong();
    }
  };

  const renderTask = () => {
    if (!task) {
      return null;
    }

    if (task.type === 'teach') {
      return (
        <section className="mx-auto max-w-3xl pt-20">
          <h1 className="text-3xl font-black text-[var(--kt-ink-strong)]">{copy.teachTitle}</h1>
          <div className="mt-10 grid gap-8 md:grid-cols-[11rem_minmax(0,1fr)] md:items-center">
            <MascotFigure pose={unit.mascotPose} tone={unit.tone} size={150} />
            <div className="rounded-[1.4rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] p-6 shadow-[var(--kt-shadow-md)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-jp text-5xl font-black text-[var(--kt-ink-strong)]">{task.word.japanese}</div>
                  <div className="mt-2 text-lg font-black text-[var(--kt-brand)]">{task.word.romaji}</div>
                </div>
                <button
                  type="button"
                  onClick={() => speakJapanese(task.word.japanese)}
                  className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-[var(--kt-accent-info-soft)] text-[var(--kt-accent-info)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-accent-info)_22%,transparent)]"
                  aria-label={copy.tapToHear}
                >
                  <Volume2 size={28} strokeWidth={3} />
                </button>
              </div>
              <div className="mt-6 rounded-[1rem] bg-[var(--kt-surface-muted)] px-4 py-3 text-xl font-black text-[var(--kt-ink-strong)]">
                {getWordTranslation(task.word, language)}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={completeTask}
            className="mt-10 w-full rounded-[0.95rem] bg-[var(--kt-brand)] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-brand-on)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-brand)_76%,black)]"
          >
            {copy.continue}
          </button>
        </section>
      );
    }

    if (task.type === 'listen') {
      return (
        <section className="mx-auto max-w-3xl pt-24">
          <h1 className="text-3xl font-black text-[var(--kt-ink-strong)]">{copy.listenTitle}</h1>
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => speakJapanese(task.word.japanese)}
              className="flex h-24 w-24 items-center justify-center rounded-[1.4rem] bg-[var(--kt-accent-info)] text-[var(--kt-brand-on)] shadow-[inset_0_-6px_0_color-mix(in_srgb,var(--kt-accent-info)_76%,black)]"
            >
              <Volume2 size={42} strokeWidth={3} />
            </button>
            <button
              type="button"
              onClick={() => speakJapanese(task.word.japanese)}
              className="flex h-16 w-16 items-center justify-center rounded-[1rem] bg-[var(--kt-accent-info)] text-[var(--kt-brand-on)] shadow-[inset_0_-5px_0_color-mix(in_srgb,var(--kt-accent-info)_76%,black)]"
            >
              <Volume2 size={26} strokeWidth={3} />
            </button>
          </div>
          <div className="mt-16 h-px bg-[var(--kt-border)]" />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {task.options.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => (option.key === task.word.key ? setFeedback('correct') : markWrong())}
                className="rounded-[0.8rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-5 py-3 font-jp text-lg font-black text-[var(--kt-ink-strong)] shadow-[inset_0_-3px_0_var(--kt-border-subtle)] transition hover:-translate-y-0.5"
              >
                {option.japanese}
              </button>
            ))}
          </div>
        </section>
      );
    }

    if (task.type === 'build') {
      const remainingTokens = task.bankTokens.filter(
        (token, index) => selectedTokens.filter((entry) => entry === token).length < task.bankTokens.slice(0, index + 1).filter((entry) => entry === token).length
      );

      return (
        <section className="mx-auto max-w-3xl pt-20">
          <h1 className="text-3xl font-black text-[var(--kt-ink-strong)]">{copy.buildTitle}</h1>
          <div className="mt-8 flex items-center gap-5">
            <MascotFigure pose={unit.mascotPose} tone={unit.tone} size={130} />
            <button
              type="button"
              onClick={() => speakJapanese(task.japanese)}
              className="rounded-[1rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-5 py-4 text-left shadow-[var(--kt-shadow-sm)]"
            >
              <span className="inline-flex items-center gap-3">
                <Volume2 size={24} className="text-[var(--kt-accent-info)]" strokeWidth={3} />
                <span>
                  <span className="block font-jp text-xl font-black text-[var(--kt-ink-strong)]">{task.japanese}</span>
                  <span className="mt-1 block text-xs font-bold text-[var(--kt-ink-muted)]">{task.romaji}</span>
                </span>
              </span>
            </button>
          </div>

          <div className="mt-8 min-h-16 border-y-2 border-[var(--kt-border)] py-4">
            <div className="flex min-h-10 flex-wrap gap-2">
              {selectedTokens.map((token, index) => (
                <button
                  key={`${token}-${index}`}
                  type="button"
                  onClick={() => setSelectedTokens((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  className="rounded-[0.75rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-2 text-sm font-black text-[var(--kt-ink-strong)] shadow-[inset_0_-3px_0_var(--kt-border-subtle)]"
                >
                  {token}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {remainingTokens.map((token, index) => (
              <button
                key={`${token}-bank-${index}`}
                type="button"
                onClick={() => setSelectedTokens((current) => [...current, token])}
                className="rounded-[0.75rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-3 text-sm font-black text-[var(--kt-ink-strong)] shadow-[inset_0_-3px_0_var(--kt-border-subtle)] transition hover:-translate-y-0.5"
              >
                {token}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleBuildCheck}
            disabled={selectedTokens.length === 0}
            className="mt-10 w-full rounded-[0.95rem] bg-[var(--kt-brand)] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-brand-on)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-brand)_76%,black)] disabled:opacity-50"
          >
            {copy.check}
          </button>
        </section>
      );
    }

    return (
      <section className="mx-auto max-w-3xl pt-24">
        <h1 className="text-3xl font-black text-[var(--kt-ink-strong)]">{copy.choiceTitle}</h1>
        <div className="mt-10 rounded-[1.4rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] p-6 shadow-[var(--kt-shadow-md)]">
          <div className="font-jp text-5xl font-black text-[var(--kt-ink-strong)]">{task.word.japanese}</div>
          <div className="mt-2 text-lg font-black text-[var(--kt-brand)]">{task.word.romaji}</div>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {task.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => (option === task.answer ? setFeedback('correct') : markWrong())}
              className="rounded-[0.9rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-5 py-4 text-left text-base font-black text-[var(--kt-ink-strong)] shadow-[inset_0_-4px_0_var(--kt-border-subtle)] transition hover:-translate-y-0.5"
            >
              {option}
            </button>
          ))}
        </div>
      </section>
    );
  };

  if (finished) {
    return (
      <div className="min-h-screen bg-[var(--kt-surface-page)] px-5 py-5 text-[var(--kt-ink)]">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center text-center">
          <MascotFigure pose="cheer" tone={unit.tone} size={180} />
          <h1 className="mt-6 text-4xl font-black text-[var(--kt-ink-strong)]">{copy.completeTitle}</h1>
          <p className="mt-3 max-w-md text-sm leading-7 text-[var(--kt-ink-muted)]">{copy.completeBody}</p>
          <div className="mt-8 grid w-full max-w-sm gap-3">
            {nextUnit && (
              <button
                type="button"
                onClick={() => navigate(getLearnUnitRoute(nextUnit.id))}
                className="rounded-[0.95rem] bg-[var(--kt-brand)] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-brand-on)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-brand)_76%,black)]"
              >
                {copy.nextUnit}
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate(appShellRoutes.learn)}
              className="rounded-[0.95rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-ink-strong)] shadow-[inset_0_-4px_0_var(--kt-border-subtle)]"
            >
              {copy.backToMap}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--kt-surface-page)] px-5 py-5 text-[var(--kt-ink)]">
      <header className="mx-auto flex max-w-5xl items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(appShellRoutes.learn)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--kt-ink-subtle)] transition hover:bg-[var(--kt-surface-muted)]"
          aria-label={copy.close}
        >
          <X size={26} />
        </button>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-[var(--kt-progress-track)]">
          <div className="h-full rounded-full bg-[var(--kt-brand)] transition-all" style={{ width: `${Math.max(4, progress)}%` }} />
        </div>
        <div className="flex items-center gap-1 text-lg font-black text-[var(--kt-accent-danger)]">
          <Heart size={25} fill="currentColor" />
          {lives}
        </div>
      </header>

      {renderTask()}

      {feedback && (
        <FeedbackBar
          tone={feedback}
          label={feedback === 'correct' ? copy.correct : copy.wrong}
          continueLabel={feedback === 'correct' ? copy.continue : copy.check}
          onContinue={() => {
            if (feedback === 'correct') {
              completeTask();
            } else {
              setFeedback(null);
            }
          }}
        />
      )}

      <button
        type="button"
        onClick={() => navigate(appShellRoutes.learn)}
        className="fixed left-5 bottom-5 hidden items-center gap-2 rounded-full border border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[var(--kt-ink-muted)] shadow-[var(--kt-shadow-sm)] md:inline-flex"
      >
        <ArrowLeft size={15} />
        {copy.backToMap}
      </button>
    </div>
  );
};
