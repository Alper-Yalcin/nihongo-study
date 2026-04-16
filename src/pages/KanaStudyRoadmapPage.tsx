import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BookCheck, CheckCircle2, Circle, Lock, RefreshCw, Sparkles, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { AppLanguage } from '../data/appPreferences';
import { appShellRoutes } from '../data/appShellContent';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../data/studyContent';
import { KanaSection } from '../types';
import {
  buildKanaRoadmapTrack,
  buildKanjiPreviewTrack,
  findTrackLessonById,
  getTrackLessonOrder
} from '../features/study-roadmap/content/roadmapDefinitions';
import {
  LessonStepId,
  LessonUnlockBlocker,
  LessonStatus,
  StudyLessonDefinition,
  StudyMasterySummary
} from '../features/study-roadmap/domain/roadmapTypes';
import { useStudyRoadmapStore } from '../features/study-roadmap/progress/useStudyRoadmapStore';
import { KanaScript, KanaItem } from '../features/kana/domain/kanaItem';
import { KanaProgress } from '../features/kana/domain/kanaProgress';
import { getKanaItemById, kanaInventoryByScript } from '../features/kana/data/kanaInventory';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import { applySessionAnswerToProgress } from '../features/kana/progress/progressService';
import {
  buildAdaptiveWeakCarryover,
  getLessonMasteryPercent
} from '../features/kana/progress/progressSelectors';
import { isAcceptedRomajiAnswer } from '../utils/typing';
import { shuffleArray } from '../utils/listening';

interface KanaStudyRoadmapPageProps {
  script: KanaScript;
  language: AppLanguage;
}

type QuizMode = 'recognition' | 'reading' | 'typing';
type QuizStepMode = QuizMode | 'mixed';

interface QuizQuestion {
  id: string;
  item: KanaItem;
  mode: QuizMode;
  options: KanaItem[];
  retryCount: number;
}

interface QuizAnswerRecord {
  itemId: string;
  mode: QuizMode;
  correct: boolean;
  answeredAt: string;
  latencyMs: number;
  retryCount: number;
  responseItemId?: string | null;
}

interface QuizStepResult {
  correct: number;
  total: number;
  score: number;
  answers: QuizAnswerRecord[];
  weakKanaIds: string[];
}

interface LessonAttemptResult {
  lessonId: string;
  score: number;
  passed: boolean;
  stepScores: Record<LessonStepId, number>;
  weakKanaIds: string[];
  answers: QuizAnswerRecord[];
}

interface QuizStepPanelProps {
  language: AppLanguage;
  title: string;
  description: string;
  mode: QuizStepMode;
  lessonItems: KanaItem[];
  poolItems: KanaItem[];
  questionLimit: number;
  reinforcementEnabled?: boolean;
  onComplete: (result: QuizStepResult) => void;
}

const pageCopy = {
  tr: {
    backToOverview: 'Overview sayfasina don',
    roadmapTitle: (scriptLabel: string) => `${scriptLabel} Roadmap`,
    roadmapDescription:
      'Yol goster -> ogret -> tekrar ettir -> olc -> ilerlet akisiyla dersleri tek tek ac.',
    activeLesson: 'Aktif ders',
    continueLearning: 'Devam et',
    startLesson: 'Dersi baslat',
    reviewLesson: 'Dersi tekrar et',
    lockedLesson: 'Kilitli',
    completed: 'Tamamlandi',
    available: 'Hazir',
    levelProgress: (completed: number, total: number) => `${completed}/${total} ders`,
    lessonItems: (count: number) => `${count} karakter`,
    passRule: 'Gecis kurali: Mini testte en az %70.',
    unlockRule: (passScore: number, masteryScore: number) =>
      `Kilit acma: >=%${passScore} mini test + >=%${masteryScore} mastery`,
    masteryTitle: 'Mastery dagilimi',
    unseen: 'Unseen',
    learning: 'Learning',
    familiar: 'Familiar',
    mastered: 'Mastered',
    kanjiPreviewTitle: 'Kanji stratejisi (Faz 2)',
    kanjiPreviewDescription:
      'Kanji track, kana tamamlanma ve mastery oranina gore acilacak. Su an Faz 1 kana altyapisi aktif.',
    introTitle: 'Ders girisi',
    introSubtitle: 'Bu adimda karakterleri gorup ses-romanizasyon bagini kur.',
    introWeakCarryover: 'Bugun ayrica zayif karakter tekrarlarin da eklendi.',
    startStep: 'Adimi baslat',
    nextStep: 'Sonraki adim',
    completeLesson: 'Roadmape don',
    retryLesson: 'Dersi tekrar dene',
    lessonPassed: 'Ders gecildi',
    lessonFailed: 'Ders tekrar edilmeli',
    lessonPassHint: 'Harika. Bir sonraki dersin kilidi acildi.',
    lessonFailHint: 'Sorun degil. Zayif karakterler sonraki turda tekrar sorulacak.',
    scoreLabel: 'Skor',
    masteryLabel: 'Mastery',
    questionLabel: (current: number, total: number) => `Soru ${current}/${total}`,
    chooseAnswer: 'Dogru cevabi sec',
    typeAnswer: 'Romaji yaz',
    submit: 'Onayla',
    correct: 'Dogru',
    wrong: 'Yanlis',
    expected: (value: string) => `Dogru cevap: ${value}`,
    noItems: 'Bu ders icin uygun karakter bulunamadi.',
    blockerPass: (requiredScore: number, currentScore: number) =>
      `Once onceki dersi gec: gerekli >=%${requiredScore}, su an %${currentScore}.`,
    blockerMastery: (requiredMastery: number, currentMastery: number) =>
      `Mastery yetersiz: gerekli >=%${requiredMastery}, su an %${currentMastery}.`,
    blockerPrerequisite: (lessonTitle: string, requiredMastery: number, currentMastery: number) =>
      `${lessonTitle} tamamlanmali ve mastery >=%${requiredMastery} olmali (su an %${currentMastery}).`,
    checkpointBadge: 'Checkpoint',
    reviewWeakItems: 'Zayiflari tekrar et'
  },
  en: {
    backToOverview: 'Back to overview',
    roadmapTitle: (scriptLabel: string) => `${scriptLabel} Roadmap`,
    roadmapDescription:
      'Guide -> teach -> reinforce -> measure -> unlock, with lesson-by-lesson progression.',
    activeLesson: 'Active lesson',
    continueLearning: 'Continue',
    startLesson: 'Start lesson',
    reviewLesson: 'Review lesson',
    lockedLesson: 'Locked',
    completed: 'Completed',
    available: 'Ready',
    levelProgress: (completed: number, total: number) => `${completed}/${total} lessons`,
    lessonItems: (count: number) => `${count} characters`,
    passRule: 'Pass rule: at least 70% on the mini test.',
    unlockRule: (passScore: number, masteryScore: number) =>
      `Unlock rule: >=${passScore}% mini-test + >=${masteryScore}% mastery`,
    masteryTitle: 'Mastery distribution',
    unseen: 'Unseen',
    learning: 'Learning',
    familiar: 'Familiar',
    mastered: 'Mastered',
    kanjiPreviewTitle: 'Kanji strategy (Phase 2)',
    kanjiPreviewDescription:
      'The kanji track will unlock based on kana completion and mastery rates. Phase 1 currently focuses on kana foundations.',
    introTitle: 'Lesson intro',
    introSubtitle: 'Review characters and connect sound with romanization.',
    introWeakCarryover: 'Weak-character reinforcement is also added for this run.',
    startStep: 'Start step',
    nextStep: 'Next step',
    completeLesson: 'Back to roadmap',
    retryLesson: 'Retry lesson',
    lessonPassed: 'Lesson passed',
    lessonFailed: 'Lesson needs another try',
    lessonPassHint: 'Great work. The next lesson has been unlocked.',
    lessonFailHint: 'No problem. Weak characters will resurface in your next run.',
    scoreLabel: 'Score',
    masteryLabel: 'Mastery',
    questionLabel: (current: number, total: number) => `Question ${current}/${total}`,
    chooseAnswer: 'Choose the correct answer',
    typeAnswer: 'Type romaji',
    submit: 'Submit',
    correct: 'Correct',
    wrong: 'Wrong',
    expected: (value: string) => `Expected: ${value}`,
    noItems: 'No usable characters were found for this lesson.',
    blockerPass: (requiredScore: number, currentScore: number) =>
      `Pass the previous lesson first: need >=${requiredScore}%, current ${currentScore}%.`,
    blockerMastery: (requiredMastery: number, currentMastery: number) =>
      `Mastery is below the threshold: need >=${requiredMastery}%, current ${currentMastery}%.`,
    blockerPrerequisite: (lessonTitle: string, requiredMastery: number, currentMastery: number) =>
      `${lessonTitle} must be completed with >=${requiredMastery}% mastery (current ${currentMastery}%).`,
    checkpointBadge: 'Checkpoint',
    reviewWeakItems: 'Review weak items'
  }
} as const;

const masteryOrder: Array<keyof StudyMasterySummary> = ['unseen', 'learning', 'familiar', 'mastered'];

const getSectionsForScript = (script: KanaScript, language: AppLanguage): KanaSection[] =>
  script === 'hiragana'
    ? getLocalizedHiraganaSections(language)
    : getLocalizedKatakanaSections(language);

const getOverviewRoute = (script: KanaScript) =>
  script === 'hiragana' ? appShellRoutes.hiraganaOverview : appShellRoutes.katakanaOverview;

const getScriptLabel = (script: KanaScript) => (script === 'hiragana' ? 'Hiragana' : 'Katakana');

const mapProgressStateToMastery = (state: string): keyof StudyMasterySummary => {
  if (state === 'mastered') {
    return 'mastered';
  }

  if (state === 'known') {
    return 'familiar';
  }

  if (state === 'new') {
    return 'unseen';
  }

  return 'learning';
};

const getQuestionLimitByStep = (step: LessonStepId) => {
  if (step === 'mini-test') {
    return 12;
  }

  if (step === 'practice') {
    return 10;
  }

  if (step === 'recognition' || step === 'reading') {
    return 8;
  }

  return 0;
};

const buildGroupItemMap = (sections: KanaSection[]) => {
  const groupMap = new Map<string, string[]>();

  sections.forEach((section) => {
    section.groups.forEach((group) => {
      groupMap.set(
        group.id,
        group.characters.map((character) => character.id)
      );
    });
  });

  return groupMap;
};

const getLessonCoreItemIds = (
  lesson: StudyLessonDefinition,
  groupMap: Map<string, string[]>
) =>
  Array.from(new Set(lesson.groupIds.flatMap((groupId) => groupMap.get(groupId) ?? [])));

const buildLessonItems = (
  lesson: StudyLessonDefinition,
  groupMap: Map<string, string[]>,
  weakCarryoverIds: string[]
) => {
  const lessonItemIds = getLessonCoreItemIds(lesson, groupMap);
  const mergedIds = Array.from(new Set([...lessonItemIds, ...weakCarryoverIds]));

  return mergedIds
    .map((itemId) => getKanaItemById(itemId))
    .filter((item): item is KanaItem => Boolean(item));
};

const buildOptions = (item: KanaItem, poolItems: KanaItem[], optionCount = 4) => {
  const distractors = shuffleArray(poolItems.filter((candidate) => candidate.id !== item.id)).slice(
    0,
    Math.max(optionCount - 1, 0)
  );

  return shuffleArray([item, ...distractors]);
};

const buildQuizQuestions = (
  lessonItems: KanaItem[],
  poolItems: KanaItem[],
  mode: QuizStepMode,
  questionLimit: number
): QuizQuestion[] => {
  const scopedLessonItems =
    lessonItems.length <= questionLimit
      ? shuffleArray(lessonItems)
      : shuffleArray(lessonItems).slice(0, Math.max(1, questionLimit));

  if (mode === 'mixed') {
    return scopedLessonItems.map((item, index) => {
      const questionMode: QuizMode = index % 2 === 0 ? 'recognition' : 'typing';

      return {
        id: `${item.id}-${questionMode}-${index}`,
        item,
        mode: questionMode,
        options: questionMode === 'typing' ? [] : buildOptions(item, poolItems),
        retryCount: 0
      };
    });
  }

  return scopedLessonItems.map((item, index) => ({
    id: `${item.id}-${mode}-${index}`,
    item,
    mode,
    options: mode === 'typing' ? [] : buildOptions(item, poolItems),
    retryCount: 0
  }));
};

const resolveQuizModeForStep = (step: LessonStepId): QuizStepMode => {
  if (step === 'recognition') {
    return 'recognition';
  }

  if (step === 'reading') {
    return 'reading';
  }

  if (step === 'practice') {
    return 'typing';
  }

  return 'mixed';
};

const getStepTitle = (step: LessonStepId, language: AppLanguage) => {
  if (step === 'recognition') {
    return language === 'tr' ? 'Adim 2 - Recognition' : 'Step 2 - Recognition';
  }

  if (step === 'reading') {
    return language === 'tr' ? 'Adim 3 - Reading' : 'Step 3 - Reading';
  }

  if (step === 'practice') {
    return language === 'tr' ? 'Adim 4 - Practice' : 'Step 4 - Practice';
  }

  return language === 'tr' ? 'Adim 5 - Mini Test' : 'Step 5 - Mini Test';
};

const getStepDescription = (step: LessonStepId, language: AppLanguage) => {
  if (step === 'recognition') {
    return language === 'tr'
      ? 'Karakteri gor ve dogru romajiyi sec.'
      : 'See the character and pick the right romaji.';
  }

  if (step === 'reading') {
    return language === 'tr'
      ? 'Romajiyi gor ve dogru karakteri sec.'
      : 'See the romaji and choose the correct character.';
  }

  if (step === 'practice') {
    return language === 'tr'
      ? 'Karakteri yazili olarak hatirla. Yanlislar tekrar sorulur.'
      : 'Recall each character by typing. Mistakes are repeated.';
  }

  return language === 'tr'
    ? 'Karismik mini test. Gecis icin %70 gerekli.'
    : 'Mixed mini test. 70% is required to pass.';
};

const getBadgeStyleByStatus = (status: LessonStatus) => {
  if (status === 'completed') {
    return 'bg-emerald-100 text-emerald-700';
  }

  if (status === 'available') {
    return 'bg-blue-100 text-blue-700';
  }

  return 'bg-slate-100 text-slate-500';
};

const formatLessonUnlockBlocker = (
  blocker: LessonUnlockBlocker,
  lessonById: Map<string, StudyLessonDefinition>,
  copy: (typeof pageCopy)[AppLanguage]
) => {
  if (blocker.type === 'needs-pass') {
    return copy.blockerPass(blocker.requiredScore ?? 70, blocker.currentScore ?? 0);
  }

  if (blocker.type === 'needs-mastery') {
    return copy.blockerMastery(blocker.requiredMastery ?? 80, blocker.currentMastery ?? 0);
  }

  const lessonTitle = lessonById.get(blocker.sourceLessonId)?.title ?? blocker.sourceLessonId;
  return copy.blockerPrerequisite(lessonTitle, blocker.requiredMastery ?? 80, blocker.currentMastery ?? 0);
};

export const QuizStepPanel: React.FC<QuizStepPanelProps> = ({
  language,
  title,
  description,
  mode,
  lessonItems,
  poolItems,
  questionLimit,
  reinforcementEnabled = true,
  onComplete
}) => {
  const copy = pageCopy[language];
  const initialQuestions = useMemo(
    () => buildQuizQuestions(lessonItems, poolItems, mode, questionLimit),
    [lessonItems, mode, poolItems, questionLimit]
  );
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswerRecord[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; expected: string } | null>(null);
  const [questionStartedAt, setQuestionStartedAt] = useState<number>(() => Date.now());

  useEffect(() => {
    setQuestions(initialQuestions);
    setQuestionIndex(0);
    setAnswers([]);
    setSelectedOptionId(null);
    setTypedAnswer('');
    setFeedback(null);
    setQuestionStartedAt(Date.now());
  }, [initialQuestions]);

  const currentQuestion = questions[questionIndex] ?? null;

  const finalizeStepIfNeeded = (
    nextAnswers: QuizAnswerRecord[],
    nextQuestionIndex: number,
    nextQuestions: QuizQuestion[]
  ) => {
    if (nextQuestionIndex < nextQuestions.length) {
      return;
    }

    const correct = nextAnswers.filter((answer) => answer.correct).length;
    const total = Math.max(nextAnswers.length, 1);

    onComplete({
      correct,
      total,
      score: Math.round((correct / total) * 100),
      answers: nextAnswers,
      weakKanaIds: Array.from(
        new Set(nextAnswers.filter((answer) => !answer.correct).map((answer) => answer.itemId))
      )
    });
  };

  const submitAnswer = (input: { selectedOptionId?: string | null; typedValue?: string }) => {
    if (!currentQuestion || feedback) {
      return;
    }

    const now = new Date();
    const answeredAt = now.toISOString();
    const latencyMs = Math.max(0, Date.now() - questionStartedAt);

    let correct = false;
    let responseItemId: string | null = null;

    if (currentQuestion.mode === 'typing') {
      correct = isAcceptedRomajiAnswer(input.typedValue ?? '', currentQuestion.item.romaji[0] ?? '');
    } else {
      responseItemId = input.selectedOptionId ?? null;
      correct = responseItemId === currentQuestion.item.id;
    }

    const nextAnswer: QuizAnswerRecord = {
      itemId: currentQuestion.item.id,
      mode: currentQuestion.mode,
      correct,
      answeredAt,
      latencyMs,
      retryCount: currentQuestion.retryCount,
      responseItemId
    };

    const nextAnswers = [...answers, nextAnswer];
    setAnswers(nextAnswers);

    let nextQuestions = questions;

    if (!correct && reinforcementEnabled && currentQuestion.retryCount < 1) {
      nextQuestions = [
        ...questions,
        {
          ...currentQuestion,
          id: `${currentQuestion.id}-retry`,
          retryCount: currentQuestion.retryCount + 1
        }
      ];
      setQuestions(nextQuestions);
    }

    setFeedback({
      correct,
      expected:
        currentQuestion.mode === 'reading' || currentQuestion.mode === 'recognition'
          ? `${currentQuestion.item.char} (${currentQuestion.item.romaji[0] ?? ''})`
          : currentQuestion.item.romaji[0] ?? ''
    });

    const nextQuestionIndex = questionIndex + 1;
    finalizeStepIfNeeded(nextAnswers, nextQuestionIndex, nextQuestions);
  };

  const goToNextQuestion = () => {
    if (!feedback) {
      return;
    }

    const nextIndex = questionIndex + 1;

    if (nextIndex >= questions.length) {
      return;
    }

    setQuestionIndex(nextIndex);
    setFeedback(null);
    setSelectedOptionId(null);
    setTypedAnswer('');
    setQuestionStartedAt(Date.now());
  };

  if (initialQuestions.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        {copy.noItems}
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  const answeredCount = Math.min(questionIndex + 1, questions.length);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {copy.questionLabel(answeredCount, questions.length)}
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-6">
        {currentQuestion.mode === 'recognition' && (
          <>
            <div className="text-sm font-semibold text-slate-500">{copy.chooseAnswer}</div>
            <div className="mt-3 text-5xl font-bold text-slate-900">{currentQuestion.item.char}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  disabled={Boolean(feedback)}
                  onClick={() => {
                    setSelectedOptionId(option.id);
                    submitAnswer({ selectedOptionId: option.id });
                  }}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    feedback && option.id === currentQuestion.item.id
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                      : selectedOptionId === option.id
                        ? 'border-blue-400 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {option.romaji[0]}
                </button>
              ))}
            </div>
          </>
        )}

        {currentQuestion.mode === 'reading' && (
          <>
            <div className="text-sm font-semibold text-slate-500">{copy.chooseAnswer}</div>
            <div className="mt-3 text-4xl font-bold text-slate-900">{currentQuestion.item.romaji[0]}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  disabled={Boolean(feedback)}
                  onClick={() => {
                    setSelectedOptionId(option.id);
                    submitAnswer({ selectedOptionId: option.id });
                  }}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    feedback && option.id === currentQuestion.item.id
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                      : selectedOptionId === option.id
                        ? 'border-blue-400 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl font-bold">{option.char}</span>
                  <span className="ml-2 text-xs text-slate-500">{option.romaji[0]}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {currentQuestion.mode === 'typing' && (
          <>
            <div className="text-sm font-semibold text-slate-500">{copy.typeAnswer}</div>
            <div className="mt-3 text-5xl font-bold text-slate-900">{currentQuestion.item.char}</div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                value={typedAnswer}
                disabled={Boolean(feedback)}
                onChange={(event) => setTypedAnswer(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    submitAnswer({ typedValue: typedAnswer });
                  }
                }}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400"
                placeholder="romaji"
              />
              <button
                type="button"
                disabled={Boolean(feedback)}
                onClick={() => submitAnswer({ typedValue: typedAnswer })}
                className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copy.submit}
              </button>
            </div>
          </>
        )}
      </div>

      {feedback && (
        <div
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${
            feedback.correct
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          <div>{feedback.correct ? copy.correct : copy.wrong}</div>
          {!feedback.correct && <div className="mt-1 text-xs">{copy.expected(feedback.expected)}</div>}
        </div>
      )}

      {feedback && questionIndex + 1 < questions.length && (
        <button
          type="button"
          onClick={goToNextQuestion}
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {copy.nextStep}
        </button>
      )}
    </div>
  );
};

interface LessonRunnerProps {
  language: AppLanguage;
  lesson: StudyLessonDefinition;
  lessonItems: KanaItem[];
  weakCarryoverItems: KanaItem[];
  scriptPoolItems: KanaItem[];
  onBack: () => void;
  onAttemptFinished: (result: LessonAttemptResult) => void;
}

const LessonRunner: React.FC<LessonRunnerProps> = ({
  language,
  lesson,
  lessonItems,
  weakCarryoverItems,
  scriptPoolItems,
  onBack,
  onAttemptFinished
}) => {
  const copy = pageCopy[language];
  const createInitialStepScores = (): Record<LessonStepId, number> => ({
    introduction: 0,
    recognition: 0,
    reading: 0,
    practice: 0,
    'mini-test': 0
  });
  const [stepIndex, setStepIndex] = useState(0);
  const [stepScores, setStepScores] = useState<Record<LessonStepId, number>>(createInitialStepScores);
  const [attemptResult, setAttemptResult] = useState<LessonAttemptResult | null>(null);
  const [answerHistory, setAnswerHistory] = useState<QuizAnswerRecord[]>([]);

  const steps = lesson.stepOrder;
  const currentStep = steps[stepIndex];

  const finalizeAttempt = (
    nextStepScores: Record<LessonStepId, number>,
    weakKanaIds: string[],
    aggregatedAnswers: QuizAnswerRecord[]
  ) => {
    const finalScore = nextStepScores['mini-test'];
    const passed = finalScore >= (lesson.minPassScore ?? 70);

    const result: LessonAttemptResult = {
      lessonId: lesson.id,
      score: finalScore,
      passed,
      stepScores: nextStepScores,
      weakKanaIds,
      answers: aggregatedAnswers
    };

    setAttemptResult(result);
    onAttemptFinished(result);
  };

  const handleStepComplete = (step: LessonStepId, result: QuizStepResult) => {
    const nextScores = {
      ...stepScores,
      [step]: result.score
    };

    const nextAnswerHistory = [...answerHistory, ...result.answers];

    setStepScores(nextScores);
    setAnswerHistory(nextAnswerHistory);

    if (step === 'mini-test') {
      finalizeAttempt(nextScores, result.weakKanaIds, nextAnswerHistory);
      return;
    }

    setStepIndex((previous) => Math.min(previous + 1, steps.length - 1));
  };

  const restartLesson = () => {
    setStepIndex(0);
    setStepScores(createInitialStepScores());
    setAttemptResult(null);
    setAnswerHistory([]);
  };

  if (attemptResult) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          {attemptResult.passed ? (
            <CheckCircle2 className="text-emerald-600" />
          ) : (
            <RefreshCw className="text-amber-600" />
          )}
          <h3 className="text-2xl font-semibold text-slate-900">
            {attemptResult.passed ? copy.lessonPassed : copy.lessonFailed}
          </h3>
        </div>

        <p className="mt-2 text-sm text-slate-600">
          {attemptResult.passed ? copy.lessonPassHint : copy.lessonFailHint}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {steps.map((step) => (
            <div key={step} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{step}</div>
              <div className="mt-1 text-xl font-bold text-slate-900">{stepScores[step]}%</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          {copy.scoreLabel}: <span className="font-bold">{attemptResult.score}%</span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {copy.completeLesson}
          </button>
          <button
            type="button"
            onClick={restartLesson}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {copy.retryLesson}
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'introduction') {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-semibold text-slate-900">{copy.introTitle}</h3>
        <p className="mt-2 text-sm text-slate-600">{copy.introSubtitle}</p>

        {weakCarryoverItems.length > 0 && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {copy.introWeakCarryover}
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lessonItems.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-3xl font-bold text-slate-900">{item.char}</div>
              <div className="mt-1 text-sm font-semibold text-slate-600">{item.romaji[0]}</div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setStepIndex(1)}
          className="mt-6 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {copy.startStep}
        </button>
      </div>
    );
  }

  const quizMode = resolveQuizModeForStep(currentStep);

  return (
    <QuizStepPanel
      language={language}
      title={getStepTitle(currentStep, language)}
      description={getStepDescription(currentStep, language)}
      mode={quizMode}
      lessonItems={lessonItems}
      poolItems={scriptPoolItems}
      questionLimit={getQuestionLimitByStep(currentStep)}
      reinforcementEnabled={currentStep !== 'mini-test'}
      onComplete={(result) => handleStepComplete(currentStep, result)}
    />
  );
};

export const KanaStudyRoadmapPage: React.FC<KanaStudyRoadmapPageProps> = ({ script, language }) => {
  const copy = pageCopy[language];
  const sections = useMemo(() => getSectionsForScript(script, language), [language, script]);
  const groupItemMap = useMemo(() => buildGroupItemMap(sections), [sections]);
  const track = useMemo(() => buildKanaRoadmapTrack(script, sections, language), [language, script, sections]);
  const trackLessons = useMemo(() => track.levels.flatMap((level) => level.lessons), [track]);
  const lessonById = useMemo(
    () => new Map(trackLessons.map((lesson) => [lesson.id, lesson])),
    [trackLessons]
  );
  const lessonOrder = useMemo(() => getTrackLessonOrder(track), [track]);
  const kanjiPreviewTrack = useMemo(() => buildKanjiPreviewTrack(language), [language]);

  const { listByScript, saveProgressMany } = useKanaProgressStore();
  const progressEntries = listByScript(script);

  const {
    completionRatio,
    getLessonStatus,
    getLessonRecord,
    getLessonUnlockBlockers,
    getLessonPassRequirement,
    getLessonMasteryRequirement,
    getRecommendedLessonId,
    recordLessonCompletion
  } = useStudyRoadmapStore(script, lessonOrder, trackLessons);

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const masterySummary = useMemo<StudyMasterySummary>(() => {
    return progressEntries.reduce<StudyMasterySummary>(
      (summary, entry) => {
        summary[mapProgressStateToMastery(entry.state)] += 1;
        return summary;
      },
      {
        unseen: 0,
        learning: 0,
        familiar: 0,
        mastered: 0
      }
    );
  }, [progressEntries]);

  const activeLesson = useMemo(
    () => (activeLessonId ? findTrackLessonById(track, activeLessonId) : null),
    [activeLessonId, track]
  );

  const activeLessonCoreItemIds = useMemo(
    () => (activeLesson ? getLessonCoreItemIds(activeLesson, groupItemMap) : []),
    [activeLesson, groupItemMap]
  );

  const weakCarryoverIds = useMemo(
    () =>
      buildAdaptiveWeakCarryover(progressEntries, {
        excludedKanaIds: activeLessonCoreItemIds,
        maxCount: 8
      }),
    [activeLessonCoreItemIds, progressEntries]
  );

  const weakCarryoverItems = useMemo(
    () => weakCarryoverIds.map((id) => getKanaItemById(id)).filter((item): item is KanaItem => Boolean(item)),
    [weakCarryoverIds]
  );

  const activeLessonItems = useMemo(
    () => (activeLesson ? buildLessonItems(activeLesson, groupItemMap, weakCarryoverIds) : []),
    [activeLesson, groupItemMap, weakCarryoverIds]
  );

  const recommendedLessonId = getRecommendedLessonId();
  const progressById = useMemo<Map<string, KanaProgress>>(
    () => new Map<string, KanaProgress>(progressEntries.map((entry) => [entry.kanaId, entry])),
    [progressEntries]
  );

  const scriptPoolItems = kanaInventoryByScript[script];

  const applyLessonAnswersToProgress = (answers: QuizAnswerRecord[]) => {
    const updatedEntries = new Map<string, KanaProgress>(progressById);
    const touchedKanaIds = new Set<string>();

    answers.forEach((answer) => {
      const existingProgress = updatedEntries.get(answer.itemId);

      if (!existingProgress) {
        return;
      }

      const nextProgress = applySessionAnswerToProgress(existingProgress, {
        itemId: answer.itemId,
        mode: 'typing',
        correct: answer.correct,
        answeredAt: answer.answeredAt,
        latencyMs: answer.latencyMs,
        hintsUsed: 0,
        retries: answer.retryCount,
        responseItemId: answer.responseItemId ?? null,
        variant: answer.mode
      });

      touchedKanaIds.add(answer.itemId);
      updatedEntries.set(answer.itemId, nextProgress);
    });

    const changedEntries = Array.from(touchedKanaIds)
      .map((kanaId) => updatedEntries.get(kanaId))
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

    if (changedEntries.length > 0) {
      saveProgressMany(changedEntries);
    }

    return updatedEntries;
  };

  const handleAttemptFinished = (result: LessonAttemptResult) => {
    if (!activeLesson) {
      return;
    }

    const updatedProgressById = applyLessonAnswersToProgress(result.answers);
    const lessonMasteryScore = getLessonMasteryPercent(
      getLessonCoreItemIds(activeLesson, groupItemMap),
      Array.from(updatedProgressById.values())
    );

    recordLessonCompletion({
      lessonId: result.lessonId,
      score: result.score,
      passed: result.passed,
      masteryScore: lessonMasteryScore,
      weakKanaIds: result.weakKanaIds
    });
  };

  const scriptLabel = getScriptLabel(script);
  const overviewRoute = getOverviewRoute(script);
  const weakRoute = script === 'hiragana' ? appShellRoutes.hiraganaWeak : appShellRoutes.katakanaWeak;
  const defaultPassScore = trackLessons[0]?.minPassScore ?? 70;
  const defaultMasteryScore = trackLessons[0]?.minMasteryRequired ?? 80;

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to={overviewRoute}
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} className="mr-2" />
            {copy.backToOverview}
          </Link>

          {recommendedLessonId && !activeLesson && (
            <button
              type="button"
              onClick={() => setActiveLessonId(recommendedLessonId)}
              className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <BookCheck size={16} className="mr-2" />
              {copy.continueLearning}
            </button>
          )}
        </div>

        <section className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                <Sparkles size={14} className="mr-1" />
                {track.phaseLabel}
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                {copy.roadmapTitle(scriptLabel)}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">{copy.roadmapDescription}</p>
              <p className="mt-1 text-xs text-slate-500">{copy.passRule}</p>
              <p className="mt-1 text-xs text-slate-500">
                {copy.unlockRule(defaultPassScore, defaultMasteryScore)}
              </p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-700">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {copy.activeLesson}
              </div>
              <div className="mt-1 font-semibold text-slate-900">
                {recommendedLessonId
                  ? findTrackLessonById(track, recommendedLessonId)?.title ?? '-'
                  : '-'}
              </div>
            </div>
          </div>

          <div className="mt-5 h-2 rounded-full bg-white/90">
            <div
              className="h-2 rounded-full bg-blue-500"
              style={{ width: `${Math.max(4, Math.round(completionRatio * 100))}%` }}
            />
          </div>
        </section>

        {activeLesson && activeLessonItems.length > 0 && (
          <LessonRunner
            language={language}
            lesson={activeLesson}
            lessonItems={activeLessonItems}
            weakCarryoverItems={weakCarryoverItems}
            scriptPoolItems={scriptPoolItems}
            onBack={() => setActiveLessonId(null)}
            onAttemptFinished={handleAttemptFinished}
          />
        )}

        {activeLesson && activeLessonItems.length === 0 && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {copy.noItems}
          </div>
        )}

        {!activeLesson && (
          <>
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-slate-500" />
                <h2 className="text-xl font-semibold text-slate-900">{copy.masteryTitle}</h2>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {masteryOrder.map((stateKey) => (
                  <div key={stateKey} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {stateKey === 'unseen'
                        ? copy.unseen
                        : stateKey === 'learning'
                          ? copy.learning
                          : stateKey === 'familiar'
                            ? copy.familiar
                            : copy.mastered}
                    </div>
                    <div className="mt-1 text-2xl font-bold text-slate-900">
                      {masterySummary[stateKey]}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              {track.levels.map((level) => {
                const completedCount = level.lessons.filter(
                  (lesson) => getLessonStatus(lesson.id) === 'completed'
                ).length;

                return (
                  <div key={level.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">{level.title}</h2>
                        <p className="mt-1 text-sm text-slate-600">{level.description}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {copy.levelProgress(completedCount, level.lessons.length)}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {level.lessons.map((lesson) => {
                        const status = getLessonStatus(lesson.id);
                        const lessonRecord = getLessonRecord(lesson.id);
                        const lessonItems = buildLessonItems(lesson, groupItemMap, []);
                        const lessonUnlockBlockers = getLessonUnlockBlockers(lesson.id);
                        const passRequirement = getLessonPassRequirement(lesson.id);
                        const masteryRequirement = getLessonMasteryRequirement(lesson.id);
                        const isMasteryBlocked =
                          status === 'available' &&
                          Boolean(lessonRecord?.passedAt) &&
                          !lessonRecord?.masteredAt;
                        const statusLabel =
                          status === 'completed'
                            ? copy.completed
                            : status === 'available'
                              ? copy.available
                              : copy.lockedLesson;

                        return (
                          <article
                            key={lesson.id}
                            className={`rounded-2xl border p-4 ${
                              status === 'locked'
                                ? 'border-slate-200 bg-slate-50'
                                : status === 'completed'
                                  ? 'border-emerald-200 bg-emerald-50/40'
                                  : 'border-blue-200 bg-blue-50/40'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-sm font-semibold text-slate-900">{lesson.title}</div>
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getBadgeStyleByStatus(status)}`}
                              >
                                {statusLabel}
                              </span>
                            </div>

                            <p className="mt-2 text-sm text-slate-600">{lesson.description}</p>
                            <div className="mt-3 text-xs font-semibold text-slate-500">
                              {copy.lessonItems(lessonItems.length)}
                            </div>

                            <div className="mt-2 text-xs text-slate-500">
                              {copy.unlockRule(passRequirement, masteryRequirement)}
                            </div>

                            {lesson.isCheckpoint && (
                              <div className="mt-2 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                                {copy.checkpointBadge}
                              </div>
                            )}

                            {lessonRecord && (
                              <div className="mt-2 space-y-1 text-xs text-slate-500">
                                <div>
                                  {copy.scoreLabel}: <span className="font-semibold">{lessonRecord.bestScore}%</span>
                                </div>
                                <div>
                                  {copy.masteryLabel}: <span className="font-semibold">{lessonRecord.bestMasteryScore}%</span>
                                </div>
                              </div>
                            )}

                            {status === 'locked' && lessonUnlockBlockers.length > 0 && (
                              <div className="mt-3 space-y-1 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                                {lessonUnlockBlockers.map((blocker) => (
                                  <div key={`${lesson.id}-${blocker.type}-${blocker.sourceLessonId}`}>
                                    {formatLessonUnlockBlocker(blocker, lessonById, copy)}
                                  </div>
                                ))}
                              </div>
                            )}

                            {isMasteryBlocked && (
                              <div className="mt-3 space-y-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800">
                                <div>
                                  {copy.blockerMastery(
                                    masteryRequirement,
                                    lessonRecord?.bestMasteryScore ?? lessonRecord?.lastMasteryScore ?? 0
                                  )}
                                </div>
                                <Link
                                  to={weakRoute}
                                  className="inline-flex items-center rounded-lg border border-blue-300 bg-white px-2 py-1 font-semibold text-blue-700 transition hover:bg-blue-100"
                                >
                                  {copy.reviewWeakItems}
                                </Link>
                              </div>
                            )}

                            <div className="mt-4">
                              {status === 'locked' ? (
                                <button
                                  type="button"
                                  disabled
                                  className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-400"
                                >
                                  <Lock size={14} className="mr-1" />
                                  {copy.lockedLesson}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setActiveLessonId(lesson.id)}
                                  className="inline-flex items-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                                >
                                  {status === 'completed' ? (
                                    <>
                                      <RefreshCw size={14} className="mr-1" />
                                      {copy.reviewLesson}
                                    </>
                                  ) : (
                                    <>
                                      <Circle size={14} className="mr-1" />
                                      {copy.startLesson}
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-amber-900">{copy.kanjiPreviewTitle}</h2>
              <p className="mt-2 text-sm text-amber-800">{copy.kanjiPreviewDescription}</p>
              <div className="mt-3 text-xs font-semibold text-amber-700">{kanjiPreviewTrack.phaseLabel}</div>
            </section>
          </>
        )}
      </div>
    </PageContainer>
  );
};
