import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Award,
  Flame,
  Gamepad2,
  Hourglass,
  Layers,
  RefreshCcw,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { AppLanguage } from '../data/appPreferences';
import { appShellRoutes } from '../data/appShellContent';
import { getLocalizedHiraganaSections, getLocalizedKatakanaSections } from '../data/studyContent';
import { useDictionaryWordSearch } from '../data/words';
import { WordItem } from '../types';
import { getKanaItemById, kanaInventoryByScript } from '../features/kana/data/kanaInventory';
import { KanaScript } from '../features/kana/domain/kanaItem';
import { StudySessionAnswerRecord } from '../features/kana/domain/studySession';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import { applySessionAnswerToProgress } from '../features/kana/progress/progressService';
import { getKanaGroupProgressStats, getWeakKanaProgressEntries } from '../features/kana/review/reviewSelectors';
import {
  evaluateChallengeProgress,
  getChallengePeriodKey,
  getPlayChallenges
} from '../features/play/challenges/challengeEngine';
import {
  buildStudyConnectedKanaPool,
  buildStudyConnectedWordPool,
  buildWeightedStudyConnectedWordPool
} from '../features/play/content/contentSelectors';
import { playGameDefinitionMap, playGameDefinitions } from '../features/play/domain/gameDefinitions';
import {
  Challenge,
  CompletedGameRun,
  GameDefinition,
  PendingAnswerLog,
  PlayContentType,
  PlayDifficultyLevel,
  PlayGameId,
  PlayQuestion
} from '../features/play/domain/playTypes';
import {
  calculateScoreDelta,
  finalizeGameRun,
  getQuestionCountByDifficulty,
  getTimeLimitByDifficulty
} from '../features/play/engine/gameSessionEngine';
import {
  buildKanaMatchQuestions,
  buildMeaningMatchQuestions
} from '../features/play/engine/questionFactory';
import { usePlayProgressStore } from '../features/play/progress/usePlayProgressStore';

interface KanaPlayPageProps {
  script: KanaScript;
  language: AppLanguage;
}

interface ActiveGameRun {
  runId: string;
  definition: GameDefinition;
  contentSetUsed: PlayContentType;
  difficulty: PlayDifficultyLevel;
  questions: PlayQuestion[];
  startedAtIso: string;
  startedAtMs: number;
  expiresAtMs: number;
  currentQuestionIndex: number;
  questionStartedAtMs: number;
  score: number;
  currentCombo: number;
  comboMax: number;
  correctAnswers: number;
  wrongAnswers: number;
  answerLog: PendingAnswerLog[];
}

const userId = 'local-user';

const contentTypeOrder: PlayContentType[] = [
  'hiragana',
  'katakana',
  'basic_words',
  'mixed',
  'kanji'
];

const difficultyOrder: PlayDifficultyLevel[] = ['easy', 'normal', 'hard'];

const scriptTitleMap: Record<KanaScript, string> = {
  hiragana: 'Hiragana',
  katakana: 'Katakana'
};

const overviewRouteByScript: Record<KanaScript, string> = {
  hiragana: appShellRoutes.hiraganaOverview,
  katakana: appShellRoutes.katakanaOverview
};

const contentTypeLabels: Record<AppLanguage, Record<PlayContentType, string>> = {
  tr: {
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    basic_words: 'Basic Words',
    mixed: 'Mixed',
    kanji: 'Kanji'
  },
  en: {
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    basic_words: 'Basic Words',
    mixed: 'Mixed',
    kanji: 'Kanji'
  }
};

const difficultyLabels: Record<AppLanguage, Record<PlayDifficultyLevel, string>> = {
  tr: {
    easy: 'Kolay',
    normal: 'Orta',
    hard: 'Zor'
  },
  en: {
    easy: 'Easy',
    normal: 'Normal',
    hard: 'Hard'
  }
};

const legacyViewGameMap: Record<string, PlayGameId> = {
  typing: 'kana-match',
  drawing: 'kana-match',
  listening: 'kana-match',
  flashcards: 'meaning-match'
};

const parseGameId = (value: string | null): PlayGameId | null => {
  if (!value) {
    return null;
  }

  if (
    value === 'kana-match' ||
    value === 'meaning-match' ||
    value === 'speed-tap' ||
    value === 'memory-flip'
  ) {
    return value;
  }

  return null;
};

const dedupeWords = (items: WordItem[]) =>
  Array.from(new Map(items.map((item) => [item.id, item])).values());

const hasWordMeaning = (word: WordItem) => {
  if (Array.isArray(word.meanings) && word.meanings.some((meaning) => meaning.trim().length > 0)) {
    return true;
  }

  return typeof word.meaning === 'string' && word.meaning.trim().length > 0;
};

const createRunId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `run-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

const getRewardLabel = (challenge: Challenge, language: AppLanguage) => {
  if (challenge.rewardType === 'xp') {
    return `${challenge.rewardValue} XP`;
  }

  if (challenge.rewardType === 'badge') {
    return language === 'tr' ? `${challenge.rewardValue} badge` : `${challenge.rewardValue} badge`;
  }

  if (challenge.rewardType === 'streak') {
    return language === 'tr' ? `+${challenge.rewardValue} streak` : `+${challenge.rewardValue} streak`;
  }

  if (challenge.rewardType === 'theme') {
    return language === 'tr' ? 'Yeni tema' : 'New theme';
  }

  return language === 'tr' ? 'Yeni unlock' : 'New unlock';
};

const copyByLanguage = {
  tr: {
    eyebrow: 'Play Hub',
    title: (scriptTitle: string) => `${scriptTitle} Play Dashboard`,
    subtitle:
      'Study tarafinda ogrendigini oyunlarla pekistir, zayif oldugun itemleri daha sik gor ve challenge hedeflerini tamamla.',
    backToOverview: 'Overview sayfasina don',
    streak: 'Streak',
    totalXp: 'Toplam XP',
    completedChallenges: 'Tamamlanan challenge',
    lastScore: 'Son skor',
    noScoreYet: 'Henuz oyun tamamlanmadi',
    dailyChallenges: 'Gunluk challenge',
    weeklyChallenges: 'Haftalik challenge',
    challengeCompleted: 'Tamamlandi',
    challengeInProgress: 'Devam ediyor',
    claimReward: 'Odulu al',
    rewardClaimed: 'Odul alindi',
    claimedRewards: 'Alinan odul',
    streakBonus: 'Streak bonusu',
    resetDailyClaims: 'Gunluk odulleri sifirla',
    resetWeeklyClaims: 'Haftalik odulleri sifirla',
    confirmReset: 'Onayla',
    claimUnavailable: 'Bu odul su anda alinamiyor. Challenge durumunu yenile ve tekrar dene.',
    unlockedThemes: 'Acilan tema',
    unlockedFeatures: 'Acilan ozellik',
    unlockedRewards: 'Acilan oduller',
    badges: 'Badge',
    miniGames: 'Mini Games',
    miniGamesDescription:
      'Bu kartlar ortak game session altyapisini kullanir. Yeni oyun eklemek artik sadece soru generatoru ve UI yazmayla sinirli.',
    recommendedGame: 'Onerilen oyun',
    launchGame: 'Oyunu Baslat',
    comingSoon: 'Yakinda',
    contentSetTitle: 'Content Set',
    difficultyTitle: 'Zorluk',
    unsupportedContent: 'Bu icerik seti su an bu oyun icin uygun degil.',
    missingContent:
      'Bu oyun icin yeterli icerik bulunamadi. Once Study tarafinda biraz daha ilerle veya farkli bir content set sec.',
    resultTitle: 'Son Oyun Sonucu',
    playAgain: 'Ayni oyunu tekrar oyna',
    returnToDashboard: 'Dashboarda don',
    sessionSummary: 'Session ozeti',
    accuracy: 'Accuracy',
    comboMax: 'Max Combo',
    averageAnswer: 'Ortalama cevap suresi',
    questions: 'Soru',
    correct: 'Dogru',
    wrong: 'Yanlis',
    runHeader: (title: string) => `${title} calisiyor`,
    timeLeft: 'Kalan sure',
    score: 'Skor',
    combo: 'Combo',
    questionLabel: 'Soru',
    finishNow: 'Oyunu Bitir',
    kanaPrompt: 'Gosterilen karakterin dogru okunuusunu sec.',
    meaningPrompt: (reading: string) => `Kelime: ${reading} - dogru anlami sec.`,
    weakAreaTitle: 'Zayif alan odaklari',
    weakAreaDescription:
      'Play sonuclari challenge ilerlemesine yazilir; kana-match ve meaning-match cevaplari weak/due odaklarini da gunceller.',
    weakItems: 'Weak items',
    noWeakItems: 'Su anda weak item yok. Challenge hedefleriyle ritmi koru.',
    todaySuggestions: 'Bugun bunlari oyna',
    suggestionKana: 'Weak itemleri temizlemek icin Kana Match',
    suggestionMeaning: 'Anlam bagini guclendirmek icin Meaning Match',
    suggestionChallenge: 'Gunluk challengei bitirmek icin hizli bir run',
    gameLocked: 'Bu mini game bir sonraki sprintte acilacak.',
    contentPool: 'Icerik havuzu',
    bestScore: 'Best score',
    unsupportedGame: 'Bu game tipi su an devre disi.',
    loadingWords: 'Kelime havuzu yukleniyor...',
    wordPoolError: 'Kelime havuzu yuklenemedi.'
  },
  en: {
    eyebrow: 'Play Hub',
    title: (scriptTitle: string) => `${scriptTitle} Play Dashboard`,
    subtitle:
      'Reinforce what you learned in Study, revisit weak items more often, and complete challenge goals with short game loops.',
    backToOverview: 'Back to overview',
    streak: 'Streak',
    totalXp: 'Total XP',
    completedChallenges: 'Completed challenges',
    lastScore: 'Last score',
    noScoreYet: 'No completed game yet',
    dailyChallenges: 'Daily challenges',
    weeklyChallenges: 'Weekly challenges',
    challengeCompleted: 'Completed',
    challengeInProgress: 'In progress',
    claimReward: 'Claim reward',
    rewardClaimed: 'Reward claimed',
    claimedRewards: 'Claimed rewards',
    streakBonus: 'Streak bonus',
    resetDailyClaims: 'Reset daily claims',
    resetWeeklyClaims: 'Reset weekly claims',
    confirmReset: 'Confirm',
    claimUnavailable: 'This reward cannot be claimed right now. Refresh challenge status and try again.',
    unlockedThemes: 'Unlocked themes',
    unlockedFeatures: 'Unlocked features',
    unlockedRewards: 'Unlocked rewards',
    badges: 'Badges',
    miniGames: 'Mini Games',
    miniGamesDescription:
      'These cards run on a shared game session infrastructure. Adding a new game now mainly means adding a question generator and a UI shell.',
    recommendedGame: 'Recommended game',
    launchGame: 'Start Game',
    comingSoon: 'Coming soon',
    contentSetTitle: 'Content Set',
    difficultyTitle: 'Difficulty',
    unsupportedContent: 'This content set is not compatible with the selected game.',
    missingContent:
      'Not enough content for this game. Learn a bit more in Study or switch to another content set.',
    resultTitle: 'Latest Result',
    playAgain: 'Play this game again',
    returnToDashboard: 'Back to dashboard',
    sessionSummary: 'Session summary',
    accuracy: 'Accuracy',
    comboMax: 'Max combo',
    averageAnswer: 'Average answer time',
    questions: 'Questions',
    correct: 'Correct',
    wrong: 'Wrong',
    runHeader: (title: string) => `${title} in progress`,
    timeLeft: 'Time left',
    score: 'Score',
    combo: 'Combo',
    questionLabel: 'Question',
    finishNow: 'Finish now',
    kanaPrompt: 'Pick the correct reading for the shown character.',
    meaningPrompt: (reading: string) => `Word reading: ${reading}. Pick the correct meaning.`,
    weakAreaTitle: 'Weak-area focus',
    weakAreaDescription:
      'Play results update challenge progress, and both Kana Match and Meaning Match now feed weak/due progression.',
    weakItems: 'Weak items',
    noWeakItems: 'No weak items right now. Keep momentum with challenge goals.',
    todaySuggestions: 'Play these today',
    suggestionKana: 'Run Kana Match to clear weak items',
    suggestionMeaning: 'Run Meaning Match for meaning recall',
    suggestionChallenge: 'Complete one fast run for today\'s challenge',
    gameLocked: 'This mini game will unlock in the next sprint.',
    contentPool: 'Content pool',
    bestScore: 'Best score',
    unsupportedGame: 'This game type is currently disabled.',
    loadingWords: 'Loading word pool...',
    wordPoolError: 'Word pool failed to load.'
  }
} as const;

export const KanaPlayPage: React.FC<KanaPlayPageProps> = ({ script, language }) => {
  const copy = copyByLanguage[language];
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedContentType, setSelectedContentType] = useState<PlayContentType>(script);
  const [selectedDifficulty, setSelectedDifficulty] = useState<PlayDifficultyLevel>('normal');
  const [activeRun, setActiveRun] = useState<ActiveGameRun | null>(null);
  const [latestResult, setLatestResult] = useState<CompletedGameRun | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [pendingResetPeriod, setPendingResetPeriod] = useState<Challenge['resetPeriod'] | null>(null);
  const [clockTick, setClockTick] = useState(Date.now());
  const finalizedRunIdsRef = useRef<Set<string>>(new Set());
  const isDebugMode = import.meta.env.DEV;

  const {
    listByScript,
    getProgress,
    saveProgress
  } = useKanaProgressStore();

  const {
    runs,
    rewardRegistry,
    summary,
    saveRun,
    isChallengeClaimed,
    claimChallengeReward,
    resetChallengeClaims
  } = usePlayProgressStore(userId);

  const hiraganaProgressEntries = listByScript('hiragana');
  const katakanaProgressEntries = listByScript('katakana');

  const hiraganaKanaPool = useMemo(
    () => buildStudyConnectedKanaPool('hiragana', hiraganaProgressEntries),
    [hiraganaProgressEntries]
  );
  const katakanaKanaPool = useMemo(
    () => buildStudyConnectedKanaPool('katakana', katakanaProgressEntries),
    [katakanaProgressEntries]
  );

  const mixedKanaPool = useMemo(
    () =>
      Array.from(
        new Map(
          [...hiraganaKanaPool.prioritized, ...katakanaKanaPool.prioritized].map((item) => [
            item.id,
            item
          ])
        ).values()
      ),
    [hiraganaKanaPool.prioritized, katakanaKanaPool.prioritized]
  );

  const mixedWeightedKanaPool = useMemo(
    () => [...hiraganaKanaPool.weighted, ...katakanaKanaPool.weighted],
    [hiraganaKanaPool.weighted, katakanaKanaPool.weighted]
  );

  const scriptKanaCharToIdMap = useMemo(
    () => new Map(kanaInventoryByScript[script].map((item) => [item.char, item.id])),
    [script]
  );

  const hiraganaWordState = useDictionaryWordSearch({
    script: 'hiragana',
    limit: 220,
    offset: 0
  });

  const katakanaWordState = useDictionaryWordSearch({
    script: 'katakana',
    limit: 220,
    offset: 0
  });

  const kanjiWordState = useDictionaryWordSearch({
    script: 'kanji',
    limit: 220,
    offset: 0
  });

  const hiraganaWordPool = useMemo(
    () => buildStudyConnectedWordPool(hiraganaWordState.words, hiraganaKanaPool),
    [hiraganaWordState.words, hiraganaKanaPool]
  );

  const katakanaWordPool = useMemo(
    () => buildStudyConnectedWordPool(katakanaWordState.words, katakanaKanaPool),
    [katakanaWordState.words, katakanaKanaPool]
  );

  const hiraganaWeightedWordPool = useMemo(
    () => buildWeightedStudyConnectedWordPool(hiraganaWordState.words, hiraganaKanaPool),
    [hiraganaKanaPool, hiraganaWordState.words]
  );

  const katakanaWeightedWordPool = useMemo(
    () => buildWeightedStudyConnectedWordPool(katakanaWordState.words, katakanaKanaPool),
    [katakanaKanaPool, katakanaWordState.words]
  );

  const basicWordPool = useMemo(
    () => dedupeWords([...hiraganaWordPool, ...katakanaWordPool]),
    [hiraganaWordPool, katakanaWordPool]
  );

  const basicWeightedWordPool = useMemo(
    () => [...hiraganaWeightedWordPool, ...katakanaWeightedWordPool],
    [hiraganaWeightedWordPool, katakanaWeightedWordPool]
  );

  const kanjiWordPool = useMemo(
    () =>
      dedupeWords(
        kanjiWordState.words.filter(
          (word) => hasWordMeaning(word) && typeof word.kanji === 'string' && word.kanji.trim().length > 0
        )
      ).slice(0, 180),
    [kanjiWordState.words]
  );

  const contentAvailability = useMemo<Record<PlayContentType, boolean>>(
    () => ({
      hiragana: hiraganaKanaPool.prioritized.length > 0 || hiraganaWordPool.length > 0,
      katakana: katakanaKanaPool.prioritized.length > 0 || katakanaWordPool.length > 0,
      basic_words: basicWordPool.length > 0,
      mixed: mixedKanaPool.length > 0 || basicWordPool.length > 0,
      kanji: kanjiWordPool.length > 0
    }),
    [
      basicWordPool.length,
      hiraganaKanaPool.prioritized.length,
      hiraganaWordPool.length,
      kanjiWordPool.length,
      katakanaKanaPool.prioritized.length,
      katakanaWordPool.length,
      mixedKanaPool.length
    ]
  );

  useEffect(() => {
    setSelectedContentType(script);
  }, [script]);

  useEffect(() => {
    if (contentAvailability[selectedContentType]) {
      return;
    }

    const fallback = contentTypeOrder.find((contentType) => contentAvailability[contentType]);

    if (fallback) {
      setSelectedContentType(fallback);
    }
  }, [contentAvailability, selectedContentType]);

  const routeProgressEntries = script === 'hiragana' ? hiraganaProgressEntries : katakanaProgressEntries;

  const weakEntries = useMemo(
    () => getWeakKanaProgressEntries(script, routeProgressEntries).slice(0, 8),
    [routeProgressEntries, script]
  );

  const localizedSections = useMemo(
    () =>
      script === 'hiragana'
        ? getLocalizedHiraganaSections(language)
        : getLocalizedKatakanaSections(language),
    [language, script]
  );

  const weakGroups = useMemo(
    () => getKanaGroupProgressStats(localizedSections, routeProgressEntries).slice(0, 3),
    [localizedSections, routeProgressEntries]
  );

  const challenges = useMemo(() => getPlayChallenges(language), [language]);

  const challengeSessions = useMemo(() => {
    const sessions = runs.map((run) => run.session);

    if (latestResult && !sessions.some((session) => session.id === latestResult.session.id)) {
      return [latestResult.session, ...sessions];
    }

    return sessions;
  }, [latestResult, runs]);

  const evaluatedChallenges = useMemo(
    () =>
      evaluateChallengeProgress({
        challenges,
        sessions: challengeSessions,
        userId
      }),
    [challengeSessions, challenges]
  );

  const dailyChallenges = evaluatedChallenges.filter(
    (item) => item.challenge.resetPeriod === 'daily'
  );
  const weeklyChallenges = evaluatedChallenges.filter(
    (item) => item.challenge.resetPeriod === 'weekly'
  );

  const completedChallenges = evaluatedChallenges.filter((item) => item.progress.completed).length;
  const claimedChallenges = evaluatedChallenges.filter((item) =>
    isChallengeClaimed(item.challenge.id, item.progress.periodKey)
  ).length;

  const handleClaimReward = (
    challenge: Challenge,
    periodKey: string,
    completed: boolean
  ) => {
    if (!challenge || !periodKey) {
      return;
    }

    const didClaim = claimChallengeReward(challenge, periodKey, { completed });

    if (!didClaim) {
      setRunError(copy.claimUnavailable);
      return;
    }

    setRunError(null);
  };

  const handleResetClaims = (resetPeriod: Challenge['resetPeriod']) => {
    if (!isDebugMode) {
      return;
    }

    if (pendingResetPeriod === resetPeriod) {
      resetChallengeClaims(resetPeriod);
      setPendingResetPeriod(null);
      return;
    }

    setPendingResetPeriod(resetPeriod);
  };

  const recommendedGameId = useMemo<PlayGameId>(() => {
    if (weakEntries.length > 0) {
      return 'kana-match';
    }

    if (basicWordPool.length >= 12) {
      return 'meaning-match';
    }

    return 'kana-match';
  }, [basicWordPool.length, weakEntries.length]);

  const queryGameId = useMemo(() => {
    const direct = parseGameId(searchParams.get('game'));

    if (direct) {
      return direct;
    }

    const legacyView = searchParams.get('view');
    return legacyView ? legacyViewGameMap[legacyView] ?? null : null;
  }, [searchParams]);

  const highlightedGameId = queryGameId ?? recommendedGameId;

  const getKanaCandidates = useCallback(
    (contentType: PlayContentType) => {
      if (contentType === 'hiragana') {
        return hiraganaKanaPool.prioritized;
      }

      if (contentType === 'katakana') {
        return katakanaKanaPool.prioritized;
      }

      if (contentType === 'mixed') {
        return mixedKanaPool;
      }

      return script === 'hiragana'
        ? hiraganaKanaPool.prioritized
        : katakanaKanaPool.prioritized;
    },
    [
      hiraganaKanaPool.prioritized,
      katakanaKanaPool.prioritized,
      mixedKanaPool,
      script
    ]
  );

  const getKanaQuestionCandidates = useCallback(
    (contentType: PlayContentType) => {
      if (contentType === 'hiragana') {
        return hiraganaKanaPool.weighted;
      }

      if (contentType === 'katakana') {
        return katakanaKanaPool.weighted;
      }

      if (contentType === 'mixed') {
        return mixedWeightedKanaPool;
      }

      return script === 'hiragana'
        ? hiraganaKanaPool.weighted
        : katakanaKanaPool.weighted;
    },
    [
      hiraganaKanaPool.weighted,
      katakanaKanaPool.weighted,
      mixedWeightedKanaPool,
      script
    ]
  );

  const getWordCandidates = useCallback(
    (contentType: PlayContentType) => {
      if (contentType === 'hiragana') {
        return hiraganaWordPool;
      }

      if (contentType === 'katakana') {
        return katakanaWordPool;
      }

      if (contentType === 'basic_words' || contentType === 'mixed') {
        return basicWordPool;
      }

      if (contentType === 'kanji') {
        return kanjiWordPool;
      }

      return basicWordPool;
    },
    [basicWordPool, hiraganaWordPool, kanjiWordPool, katakanaWordPool]
  );

  const getWordQuestionCandidates = useCallback(
    (contentType: PlayContentType) => {
      if (contentType === 'hiragana') {
        return hiraganaWeightedWordPool;
      }

      if (contentType === 'katakana') {
        return katakanaWeightedWordPool;
      }

      if (contentType === 'basic_words' || contentType === 'mixed') {
        return basicWeightedWordPool;
      }

      if (contentType === 'kanji') {
        return kanjiWordPool;
      }

      return basicWeightedWordPool;
    },
    [
      basicWeightedWordPool,
      hiraganaWeightedWordPool,
      kanjiWordPool,
      katakanaWeightedWordPool
    ]
  );

  const isGamePlayable = useCallback(
    (definition: GameDefinition) => {
      if (!definition.enabled) {
        return false;
      }

      return definition.contentType.some((contentType) => {
        if (definition.id === 'kana-match') {
          return getKanaCandidates(contentType).length >= 4;
        }

        if (definition.id === 'meaning-match') {
          return getWordCandidates(contentType).length >= 4;
        }

        return false;
      });
    },
    [getKanaCandidates, getWordCandidates]
  );

  const finishRun = useCallback(
    (run: ActiveGameRun, endedAtMs: number) => {
      if (finalizedRunIdsRef.current.has(run.runId)) {
        return;
      }

      finalizedRunIdsRef.current.add(run.runId);

      const answeredCount = run.correctAnswers + run.wrongAnswers;
      const unansweredCount = Math.max(0, run.questions.length - answeredCount);

      const completedRun = finalizeGameRun({
        userId,
        gameId: run.definition.id,
        startedAt: run.startedAtIso,
        endedAt: new Date(endedAtMs).toISOString(),
        score: run.score,
        comboMax: run.comboMax,
        totalQuestions: run.questions.length,
        correctAnswers: run.correctAnswers,
        wrongAnswers: run.wrongAnswers + unansweredCount,
        contentSetUsed: run.contentSetUsed,
        difficulty: run.difficulty,
        answerLog: run.answerLog
      });

      if (run.definition.id === 'kana-match') {
        const questionMap = new Map(run.questions.map((question) => [question.id, question]));

        run.answerLog.forEach((answer) => {
          const sourceQuestion = questionMap.get(answer.questionId);

          if (!sourceQuestion || sourceQuestion.kind !== 'kana-match') {
            return;
          }

          const currentProgress = getProgress(sourceQuestion.kanaId);

          if (!currentProgress) {
            return;
          }

          const sessionAnswer: StudySessionAnswerRecord = {
            itemId: sourceQuestion.kanaId,
            mode: 'typing',
            correct: answer.isCorrect,
            answeredAt: new Date().toISOString(),
            latencyMs: answer.responseTimeMs,
            hintsUsed: 0,
            retries: 0,
            responseItemId: null,
            variant: 'play-kana-match'
          };

          saveProgress(applySessionAnswerToProgress(currentProgress, sessionAnswer));
        });
      }

      if (run.definition.id === 'meaning-match') {
        const questionMap = new Map(run.questions.map((question) => [question.id, question]));

        run.answerLog.forEach((answer) => {
          const sourceQuestion = questionMap.get(answer.questionId);

          if (!sourceQuestion || sourceQuestion.kind !== 'meaning-match') {
            return;
          }

          const relatedKanaIds = Array.from(
            new Set(
              sourceQuestion.reading
                .split('')
                .map((char) => scriptKanaCharToIdMap.get(char) ?? null)
                .filter((kanaId): kanaId is string => Boolean(kanaId))
            )
          ).slice(0, 2);

          relatedKanaIds.forEach((kanaId) => {
            const currentProgress = getProgress(kanaId);

            if (!currentProgress) {
              return;
            }

            const sessionAnswer: StudySessionAnswerRecord = {
              itemId: kanaId,
              mode: 'typing',
              correct: answer.isCorrect,
              answeredAt: new Date().toISOString(),
              latencyMs: answer.responseTimeMs,
              hintsUsed: 0,
              retries: 0,
              responseItemId: null,
              variant: 'play-meaning-match'
            };

            saveProgress(applySessionAnswerToProgress(currentProgress, sessionAnswer));
          });
        });
      }

      saveRun(completedRun);
      setLatestResult(completedRun);
      setActiveRun(null);
      setRunError(null);
    },
    [getProgress, saveProgress, saveRun, scriptKanaCharToIdMap]
  );

  const startGame = useCallback(
    (
      gameId: PlayGameId,
      overrides?: {
        difficulty?: PlayDifficultyLevel;
        contentType?: PlayContentType;
      }
    ) => {
      const definition = playGameDefinitionMap[gameId];

      if (!definition) {
        setRunError(copy.unsupportedGame);
        return;
      }

      if (!definition.enabled) {
        setRunError(copy.gameLocked);
        return;
      }

      const preferredContentType = overrides?.contentType ?? selectedContentType;
      const resolvedContentType =
        definition.contentType.includes(preferredContentType) && contentAvailability[preferredContentType]
          ? preferredContentType
          : definition.contentType.find((contentType) => contentAvailability[contentType]) ??
            definition.contentType[0];

      if (!contentAvailability[resolvedContentType]) {
        setRunError(copy.unsupportedContent);
        return;
      }

      const difficulty = overrides?.difficulty ?? selectedDifficulty;
      const questionCount = getQuestionCountByDifficulty(difficulty);
      const timeLimitSeconds = getTimeLimitByDifficulty(definition.timeLimit, difficulty);

      let questions: PlayQuestion[] = [];

      if (gameId === 'kana-match') {
        questions = buildKanaMatchQuestions(
          getKanaQuestionCandidates(resolvedContentType),
          questionCount,
          resolvedContentType
        );
      }

      if (gameId === 'meaning-match') {
        questions = buildMeaningMatchQuestions(
          getWordQuestionCandidates(resolvedContentType),
          questionCount,
          resolvedContentType
        );
      }

      if (questions.length < 4) {
        setRunError(copy.missingContent);
        return;
      }

      const now = Date.now();
      const startedAtIso = new Date(now).toISOString();
      const runId = createRunId();

      const nextRun: ActiveGameRun = {
        runId,
        definition,
        contentSetUsed: resolvedContentType,
        difficulty,
        questions,
        startedAtIso,
        startedAtMs: now,
        expiresAtMs: now + timeLimitSeconds * 1000,
        currentQuestionIndex: 0,
        questionStartedAtMs: now,
        score: 0,
        currentCombo: 0,
        comboMax: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        answerLog: []
      };

      setActiveRun(nextRun);
      setLatestResult(null);
      setRunError(null);
      setClockTick(now);

      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.set('game', gameId);
      setSearchParams(nextSearchParams, { replace: true });
    },
    [
      contentAvailability,
      copy.gameLocked,
      copy.missingContent,
      copy.unsupportedContent,
      copy.unsupportedGame,
      getKanaQuestionCandidates,
      getWordQuestionCandidates,
      searchParams,
      selectedContentType,
      selectedDifficulty,
      setSearchParams
    ]
  );

  useEffect(() => {
    if (!activeRun) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setClockTick(Date.now());
    }, 200);

    return () => window.clearInterval(intervalId);
  }, [activeRun]);

  const timeLeftMs = activeRun
    ? Math.max(0, activeRun.expiresAtMs - clockTick)
    : 0;

  useEffect(() => {
    if (!activeRun) {
      return;
    }

    if (timeLeftMs > 0) {
      return;
    }

    finishRun(activeRun, Date.now());
  }, [activeRun, finishRun, timeLeftMs]);

  const currentQuestion = activeRun
    ? activeRun.questions[activeRun.currentQuestionIndex] ?? null
    : null;

  const onAnswer = (selectedAnswer: string) => {
    if (!activeRun || !currentQuestion) {
      return;
    }

    const answeredAtMs = Date.now();
    const responseTimeMs = Math.max(80, answeredAtMs - activeRun.questionStartedAtMs);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const nextCombo = isCorrect ? activeRun.currentCombo + 1 : 0;
    const scoreDelta = calculateScoreDelta({
      isCorrect,
      combo: nextCombo,
      responseTimeMs,
      definition: activeRun.definition
    });

    const nextRun: ActiveGameRun = {
      ...activeRun,
      score: Math.max(0, activeRun.score + scoreDelta),
      currentCombo: nextCombo,
      comboMax: Math.max(activeRun.comboMax, nextCombo),
      correctAnswers: activeRun.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: activeRun.wrongAnswers + (isCorrect ? 0 : 1),
      answerLog: [
        ...activeRun.answerLog,
        {
          questionId: currentQuestion.id,
          itemType: currentQuestion.itemType,
          shownItem: currentQuestion.shownItem,
          userAnswer: selectedAnswer,
          isCorrect,
          responseTimeMs
        }
      ]
    };

    const isLastQuestion = activeRun.currentQuestionIndex >= activeRun.questions.length - 1;

    if (isLastQuestion) {
      finishRun(nextRun, answeredAtMs);
      return;
    }

    setActiveRun({
      ...nextRun,
      currentQuestionIndex: activeRun.currentQuestionIndex + 1,
      questionStartedAtMs: answeredAtMs
    });
  };

  const stopRun = () => {
    if (!activeRun) {
      return;
    }

    finishRun(activeRun, Date.now());
  };

  const showWordPoolLoading =
    (selectedContentType === 'basic_words' ||
      selectedContentType === 'mixed' ||
      selectedContentType === 'hiragana' ||
      selectedContentType === 'katakana' ||
      selectedContentType === 'kanji') &&
    (hiraganaWordState.loading || katakanaWordState.loading || kanjiWordState.loading);

  const hasWordPoolError = Boolean(
    hiraganaWordState.error || katakanaWordState.error || kanjiWordState.error
  );

  const latestSummary = latestResult?.session ?? summary.lastSession;

  const latestAverageAnswerMs = latestResult
    ? Math.round(
        latestResult.answerLog.reduce((total, answer) => total + answer.responseTimeMs, 0) /
          Math.max(1, latestResult.answerLog.length)
      )
    : 0;

  const dailyCompleted = dailyChallenges.filter((item) => item.progress.completed).length;
  const weeklyCompleted = weeklyChallenges.filter((item) => item.progress.completed).length;
  const dailyClaimed = dailyChallenges.filter((item) =>
    isChallengeClaimed(item.challenge.id, item.progress.periodKey)
  ).length;
  const weeklyClaimed = weeklyChallenges.filter((item) =>
    isChallengeClaimed(item.challenge.id, item.progress.periodKey)
  ).length;

  const topWeakItems = weakEntries
    .map((entry) => ({
      entry,
      item: getKanaItemById(entry.kanaId)
    }))
    .filter((item) => item.item !== null);

  return (
    <PageContainer>
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-7 shadow-[0_20px_45px_rgba(16,185,129,0.18)] md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <Link
                to={overviewRouteByScript[script]}
                className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft size={16} className="mr-2" />
                {copy.backToOverview}
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                  <Gamepad2 size={22} />
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  {copy.eyebrow}
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                  {copy.title(scriptTitleMap[script])}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                  {copy.subtitle}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[27rem]">
              <div className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {copy.streak}
                </div>
                <div className="mt-2 flex items-center gap-2 text-3xl font-bold text-slate-900">
                  <Flame size={24} className="text-amber-500" />
                  {summary.currentStreakDays}
                </div>
                {summary.streakRewardDays > 0 && (
                  <p className="mt-1 text-xs text-amber-700">
                    {`+${summary.streakRewardDays} ${copy.streakBonus}`}
                  </p>
                )}
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {copy.totalXp}
                </div>
                <div className="mt-2 flex items-center gap-2 text-3xl font-bold text-slate-900">
                  <Zap size={24} className="text-sky-500" />
                  {summary.totalXp}
                </div>
                {summary.claimedXp > 0 && (
                  <p className="mt-1 text-xs text-sky-700">{`+${summary.claimedXp} XP ${copy.rewardClaimed.toLowerCase()}`}</p>
                )}
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {copy.claimedRewards}
                </div>
                <div className="mt-2 flex items-center gap-2 text-3xl font-bold text-slate-900">
                  <Award size={24} className="text-violet-500" />
                  {claimedChallenges}
                </div>
                <p className="mt-1 text-xs text-slate-500">{`${completedChallenges} ${copy.challengeCompleted.toLowerCase()}`}</p>
                {(summary.unlockedThemeIds.length > 0 || summary.unlockedFeatureIds.length > 0 || summary.badges > 0) && (
                  <div className="mt-2 space-y-1 text-xs text-violet-700">
                    {summary.unlockedThemeIds.length > 0 && (
                      <div>{`${copy.unlockedThemes}: ${summary.unlockedThemeIds.length}`}</div>
                    )}
                    {summary.unlockedFeatureIds.length > 0 && (
                      <div>{`${copy.unlockedFeatures}: ${summary.unlockedFeatureIds.length}`}</div>
                    )}
                    {summary.badges > 0 && (
                      <div>{`${copy.badges}: ${summary.badges}`}</div>
                    )}
                  </div>
                )}
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {copy.lastScore}
                </div>
                <div className="mt-2 text-3xl font-bold text-slate-900">
                  {latestSummary ? latestSummary.score : '--'}
                </div>
                {!latestSummary && (
                  <p className="mt-1 text-xs text-slate-500">{copy.noScoreYet}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {activeRun && currentQuestion && (
          <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {copy.runHeader(activeRun.definition.title)}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {`${copy.questionLabel} ${activeRun.currentQuestionIndex + 1}/${activeRun.questions.length}`}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {copy.timeLeft}
                  </div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    {Math.ceil(timeLeftMs / 1000)}s
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {copy.score}
                  </div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    {activeRun.score}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {copy.combo}
                  </div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    {activeRun.currentCombo}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${Math.round(((activeRun.currentQuestionIndex + 1) / activeRun.questions.length) * 100)}%`
                }}
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
              {currentQuestion.kind === 'kana-match' && (
                <>
                  <div className="text-center text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {copy.kanaPrompt}
                  </div>
                  <div className="mt-4 text-center text-7xl font-bold text-slate-900">
                    {currentQuestion.shownItem}
                  </div>
                </>
              )}

              {currentQuestion.kind === 'meaning-match' && (
                <>
                  <div className="text-center text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {copy.meaningPrompt(currentQuestion.reading)}
                  </div>
                  <div className="mt-4 text-center text-5xl font-bold text-slate-900">
                    {currentQuestion.shownItem}
                  </div>
                </>
              )}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onAnswer(option)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={stopRun}
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Hourglass size={16} className="mr-2" />
              {copy.finishNow}
            </button>
          </section>
        )}

        {!activeRun && latestResult && (
          <section className="space-y-5 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  {copy.resultTitle}
                </div>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {latestResult.session.gameId === 'kana-match' ? 'Kana Match' : 'Meaning Match'}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {copy.sessionSummary}
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  XP
                </div>
                <div className="text-4xl font-bold text-emerald-600">+{latestResult.xpEarned}</div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/70 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{copy.score}</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{latestResult.session.score}</div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{copy.accuracy}</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{latestResult.session.accuracy}%</div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{copy.comboMax}</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{latestResult.session.comboMax}</div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{copy.averageAnswer}</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{latestAverageAnswerMs}ms</div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => startGame(latestResult.session.gameId)}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                <Trophy size={16} className="mr-2" />
                {copy.playAgain}
              </button>
              <button
                type="button"
                onClick={() => setLatestResult(null)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                {copy.returnToDashboard}
              </button>
            </div>
          </section>
        )}

        {!activeRun && (
          <>
            {runError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {runError}
              </div>
            )}

            {showWordPoolLoading && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {copy.loadingWords}
              </div>
            )}

            {hasWordPoolError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {copy.wordPoolError}
              </div>
            )}

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{copy.dailyChallenges}</h2>
                    <p className="mt-1 text-xs text-slate-500">{`${dailyClaimed}/${dailyChallenges.length} ${copy.rewardClaimed.toLowerCase()}`}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                      {`${dailyCompleted}/${dailyChallenges.length}`}
                    </span>
                    {isDebugMode && (
                      <button
                        type="button"
                        onClick={() => handleResetClaims('daily')}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 transition-colors hover:bg-slate-50"
                      >
                        <RefreshCcw size={12} className="mr-1" />
                        {pendingResetPeriod === 'daily' ? copy.confirmReset : copy.resetDailyClaims}
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {dailyChallenges.map((item) => {
                    const percent = Math.round(
                      (item.progress.progress / item.challenge.goalValue) * 100
                    );
                    const periodKey = item.progress.periodKey || getChallengePeriodKey(item.challenge.resetPeriod, new Date());
                    const challengeClaimed = isChallengeClaimed(item.challenge.id, periodKey);
                    return (
                      <div key={item.challenge.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{item.challenge.title}</div>
                            <div className="mt-1 text-xs text-slate-500">
                              {getRewardLabel(item.challenge, language)}
                            </div>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                            item.progress.completed
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {item.progress.completed ? copy.challengeCompleted : copy.challengeInProgress}
                          </span>
                        </div>
                        {item.progress.completed && (
                          <div className="mt-3 flex justify-end">
                            <button
                              type="button"
                              disabled={challengeClaimed}
                              onClick={() =>
                                handleClaimReward(item.challenge, periodKey, item.progress.completed)
                              }
                              className="inline-flex items-center rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                            >
                              {challengeClaimed ? copy.rewardClaimed : copy.claimReward}
                            </button>
                          </div>
                        )}
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${Math.max(6, Math.min(100, percent))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{copy.weeklyChallenges}</h2>
                    <p className="mt-1 text-xs text-slate-500">{`${weeklyClaimed}/${weeklyChallenges.length} ${copy.rewardClaimed.toLowerCase()}`}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                      {`${weeklyCompleted}/${weeklyChallenges.length}`}
                    </span>
                    {isDebugMode && (
                      <button
                        type="button"
                        onClick={() => handleResetClaims('weekly')}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 transition-colors hover:bg-slate-50"
                      >
                        <RefreshCcw size={12} className="mr-1" />
                        {pendingResetPeriod === 'weekly' ? copy.confirmReset : copy.resetWeeklyClaims}
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {weeklyChallenges.map((item) => {
                    const percent = Math.round(
                      (item.progress.progress / item.challenge.goalValue) * 100
                    );
                    const periodKey = item.progress.periodKey || getChallengePeriodKey(item.challenge.resetPeriod, new Date());
                    const challengeClaimed = isChallengeClaimed(item.challenge.id, periodKey);
                    return (
                      <div key={item.challenge.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{item.challenge.title}</div>
                            <div className="mt-1 text-xs text-slate-500">
                              {getRewardLabel(item.challenge, language)}
                            </div>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                            item.progress.completed
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {item.progress.completed ? copy.challengeCompleted : copy.challengeInProgress}
                          </span>
                        </div>
                        {item.progress.completed && (
                          <div className="mt-3 flex justify-end">
                            <button
                              type="button"
                              disabled={challengeClaimed}
                              onClick={() =>
                                handleClaimReward(item.challenge, periodKey, item.progress.completed)
                              }
                              className="inline-flex items-center rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                            >
                              {challengeClaimed ? copy.rewardClaimed : copy.claimReward}
                            </button>
                          </div>
                        )}
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                          <div
                            className="h-full rounded-full bg-sky-500"
                            style={{ width: `${Math.max(6, Math.min(100, percent))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-5 lg:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {copy.contentSetTitle}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {contentTypeOrder.map((contentType) => {
                      const isActive = contentType === selectedContentType;
                      const isAvailable = contentAvailability[contentType];

                      return (
                        <button
                          key={contentType}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setSelectedContentType(contentType)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                            isActive
                              ? 'border-emerald-300 bg-emerald-100 text-emerald-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          } disabled:cursor-not-allowed disabled:opacity-40`}
                        >
                          {contentTypeLabels[language][contentType]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {copy.difficultyTitle}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {difficultyOrder.map((difficulty) => (
                      <button
                        key={difficulty}
                        type="button"
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                          selectedDifficulty === difficulty
                            ? 'border-sky-300 bg-sky-100 text-sky-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {difficultyLabels[language][difficulty]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">{copy.miniGames}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                    {copy.miniGamesDescription}
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                  {`${copy.recommendedGame}: ${playGameDefinitionMap[recommendedGameId].title}`}
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {playGameDefinitions.map((definition) => {
                  const canPlay = isGamePlayable(definition);
                  const gameRuns = runs.filter((run) => run.session.gameId === definition.id);
                  const bestScore = gameRuns.reduce(
                    (best, run) => Math.max(best, run.session.score),
                    0
                  );

                  return (
                    <article
                      key={definition.id}
                      className={`rounded-3xl border bg-white p-5 shadow-sm transition-colors ${
                        highlightedGameId === definition.id
                          ? 'border-emerald-300 ring-2 ring-emerald-100'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900">{definition.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-slate-600">
                            {definition.description}
                          </p>
                        </div>
                        {recommendedGameId === definition.id && (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                            <Star size={12} className="mr-1" />
                            {copy.recommendedGame}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                          <div className="font-semibold uppercase tracking-[0.12em] text-slate-600">
                            {copy.contentPool}
                          </div>
                          <div className="mt-1">
                            {definition.contentType.map((contentType) => contentTypeLabels[language][contentType]).join(', ')}
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                          <div className="font-semibold uppercase tracking-[0.12em] text-slate-600">
                            {copy.bestScore}
                          </div>
                          <div className="mt-1">{bestScore || '--'}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          {difficultyLabels[language][selectedDifficulty]}
                        </div>

                        {definition.enabled ? (
                          <button
                            type="button"
                            disabled={!canPlay}
                            onClick={() => startGame(definition.id)}
                            className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Sparkles size={15} className="mr-2" />
                            {copy.launchGame}
                          </button>
                        ) : (
                          <span className="inline-flex items-center rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
                            {copy.comingSoon}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              {(rewardRegistry.unlockedThemeIds.length > 0 || rewardRegistry.unlockedFeatureIds.length > 0) && (
                <div className="mb-5 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">
                    {copy.unlockedRewards}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {rewardRegistry.unlockedThemeIds.map((themeId) => (
                      <span
                        key={themeId}
                        className="rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-semibold text-violet-700"
                      >
                        {themeId}
                      </span>
                    ))}
                    {rewardRegistry.unlockedFeatureIds.map((featureId) => (
                      <span
                        key={featureId}
                        className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-700"
                      >
                        {featureId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">{copy.weakAreaTitle}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{copy.weakAreaDescription}</p>

                  <div className="mt-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {copy.weakItems}
                    </div>

                    {topWeakItems.length === 0 && (
                      <p className="mt-2 text-sm text-slate-500">{copy.noWeakItems}</p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {topWeakItems.map(({ entry, item }) => (
                        <span
                          key={entry.kanaId}
                          className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-700"
                        >
                          <span className="mr-2 text-lg">{item.char}</span>
                          {`x${entry.timesWrong}`}
                        </span>
                      ))}
                    </div>
                  </div>

                  {weakGroups.length > 0 && (
                    <div className="mt-5 grid gap-2 md:grid-cols-3">
                      {weakGroups.map((group) => (
                        <div key={group.groupId} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                          <div className="text-sm font-semibold text-slate-800">{group.groupLabel}</div>
                          <div className="mt-1 text-xs text-slate-500">{group.sectionTitle}</div>
                          <div className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-rose-600">
                            {`Weak: ${group.weak} / Due: ${group.due}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    <Layers size={14} />
                    {copy.todaySuggestions}
                  </div>
                  <div className="mt-4 space-y-3">
                    <button
                      type="button"
                      onClick={() => startGame('kana-match')}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:border-emerald-200 hover:bg-emerald-50"
                    >
                      <span className="text-sm font-semibold text-slate-800">{copy.suggestionKana}</span>
                      <Target size={16} className="text-emerald-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => startGame('meaning-match')}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:border-sky-200 hover:bg-sky-50"
                    >
                      <span className="text-sm font-semibold text-slate-800">{copy.suggestionMeaning}</span>
                      <Trophy size={16} className="text-sky-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => startGame(recommendedGameId, { difficulty: 'hard' })}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:border-amber-200 hover:bg-amber-50"
                    >
                      <span className="text-sm font-semibold text-slate-800">{copy.suggestionChallenge}</span>
                      <Zap size={16} className="text-amber-600" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </PageContainer>
  );
};
