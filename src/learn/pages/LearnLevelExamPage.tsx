import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, ChevronRight, Trophy, ArrowLeft } from 'lucide-react';
import { AppLanguage, ThemeMode } from '../../data/appPreferences';
import { JLPTLevel, getLevelInfo, JLPT_LEVEL_ORDER } from '../data/learnLevels';
import { getLearnCourseSections, flattenLearnCourseUnits } from '../data/learnCourseContent';
import { useLearnLevelProgress } from '../../hooks/useLearnLevelProgress';
import { appShellRoutes } from '../../data/appShellContent';
import { LearnFallingFlowers } from '../components/LearnFallingFlowers';

interface Props {
  language: AppLanguage;
  themeMode: ThemeMode;
}

interface Question {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
}

const PASS_THRESHOLD = 0.7;

const buildQuestions = (language: AppLanguage, level: JLPTLevel): Question[] => {
  const sections = getLearnCourseSections(language, level);
  const units = flattenLearnCourseUnits(sections);
  const questions: Question[] = [];

  for (const unit of units.slice(0, 8)) {
    if (unit.vocabulary.length < 2) continue;
    const correct = unit.vocabulary[0];
    const wrongs = unit.vocabulary.slice(1, 4);
    while (wrongs.length < 3) wrongs.push(unit.vocabulary[wrongs.length % unit.vocabulary.length]);
    const choices = [correct, ...wrongs].sort(() => Math.random() - 0.5);
    questions.push({
      id: `${unit.id}-vocab`,
      question:
        language === 'tr'
          ? `"${unit.dialogue[0]?.text ?? correct}" cümlesinin ilk kelimesi hangisi?`
          : `Which word appears first in "${unit.dialogue[0]?.text ?? correct}"?`,
      choices,
      correctIndex: choices.indexOf(correct)
    });
  }

  return questions.slice(0, 5);
};

const copy = {
  tr: {
    title: (level: string) => `${level} Seviye Sınavı`,
    subtitle: 'Bu sınavı geçersen bir sonraki seviyeye yükselirsin.',
    question: (n: number, total: number) => `Soru ${n} / ${total}`,
    resultPass: 'Tebrikler! Sınavı geçtin.',
    resultFail: 'Bir daha dene.',
    advance: 'Sonraki seviyeye geç',
    retry: 'Tekrar dene',
    back: 'Haritaya dön',
    score: (correct: number, total: number) => `${correct} / ${total} doğru`
  },
  en: {
    title: (level: string) => `${level} Level Exam`,
    subtitle: 'Pass this exam to advance to the next level.',
    question: (n: number, total: number) => `Question ${n} / ${total}`,
    resultPass: 'Congratulations! You passed.',
    resultFail: 'Try again.',
    advance: 'Advance to next level',
    retry: 'Try again',
    back: 'Back to map',
    score: (correct: number, total: number) => `${correct} / ${total} correct`
  }
} as const;

export const LearnLevelExamPage: React.FC<Props> = ({ language, themeMode }) => {
  const { level: levelParam } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const isDark = themeMode === 'dark';
  const c = copy[language];

  const level = (
    levelParam && JLPT_LEVEL_ORDER.includes(levelParam as JLPTLevel) ? levelParam : 'n5'
  ) as JLPTLevel;

  const levelInfo = getLevelInfo(level);
  const questions = useMemo(() => buildQuestions(language, level), [language, level]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const { advanceLevel, hasNextLevel } = useLearnLevelProgress();

  const correctCount = answers.filter((a, i) => a === questions[i]?.correctIndex).length;
  const passed = questions.length > 0 && correctCount / questions.length >= PASS_THRESHOLD;

  const handleChoice = (choiceIndex: number) => {
    if (selected !== null) return;
    setSelected(choiceIndex);
  };

  const handleNext = () => {
    if (selected === null) return;
    const nextAnswers = [...answers, selected];
    setAnswers(nextAnswers);
    setSelected(null);

    if (currentIndex + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleAdvance = () => {
    advanceLevel();
    navigate(appShellRoutes.learn);
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setSelected(null);
    setDone(false);
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className={`relative min-h-screen ${isDark ? 'text-[#f8fbff]' : 'text-[#1f2b3b]'}`}>
      <LearnFallingFlowers themeMode={themeMode} />

      <div className="relative z-10 mx-auto max-w-2xl px-4 pb-16 pt-6">
        <button
          type="button"
          onClick={() => navigate(appShellRoutes.learn)}
          className={`mb-6 flex items-center gap-2 text-sm font-semibold transition ${
            isDark ? 'text-white/55 hover:text-white/80' : 'text-[#1f2b3b]/50 hover:text-[#1f2b3b]/80'
          }`}
        >
          <ArrowLeft size={16} />
          {c.back}
        </button>

        <div className="mb-8 flex items-center gap-3">
          <span
            className="rounded-full px-4 py-1.5 text-sm font-black text-white"
            style={{ backgroundColor: levelInfo.color }}
          >
            {levelInfo.label}
          </span>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{c.title(levelInfo.label)}</h1>
            <p className={`mt-0.5 text-sm font-medium ${isDark ? 'text-white/55' : 'text-[#405064]'}`}>
              {c.subtitle}
            </p>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className={`rounded-2xl p-8 text-center ${isDark ? 'bg-white/5' : 'bg-white/60'}`}>
            <p>No questions available yet.</p>
          </div>
        ) : !done ? (
          <div
            className={`rounded-2xl p-6 shadow-xl ${
              isDark ? 'bg-[rgba(30,20,38,0.82)] border border-white/10' : 'bg-white/80 border border-[#f0ddd4]'
            } backdrop-blur-sm`}
          >
            <p className={`mb-4 text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-[#405064]/55'}`}>
              {c.question(currentIndex + 1, questions.length)}
            </p>
            <p className="mb-6 text-lg font-bold leading-snug">{currentQuestion.question}</p>

            <div className="flex flex-col gap-3">
              {currentQuestion.choices.map((choice, i) => {
                let bg = isDark ? 'bg-white/6 border-white/10 hover:bg-white/12' : 'bg-[#f9f5f2] border-[#e8d8d0] hover:bg-[#f0e8e4]';
                if (selected !== null) {
                  if (i === currentQuestion.correctIndex) {
                    bg = 'bg-[#22c55e]/20 border-[#22c55e]/50 text-[#22c55e]';
                  } else if (i === selected && selected !== currentQuestion.correctIndex) {
                    bg = 'bg-[#ef4444]/20 border-[#ef4444]/50 text-[#ef4444]';
                  }
                }
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleChoice(i)}
                    disabled={selected !== null}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${bg}`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <button
                type="button"
                onClick={handleNext}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f04d72] py-3 text-sm font-black text-white transition hover:bg-[#e0315a]"
              >
                {currentIndex + 1 < questions.length ? (
                  <>
                    {language === 'tr' ? 'İleri' : 'Next'} <ChevronRight size={16} />
                  </>
                ) : (
                  language === 'tr' ? 'Sonuçları Gör' : 'See Results'
                )}
              </button>
            )}
          </div>
        ) : (
          <div
            className={`rounded-2xl p-8 text-center shadow-xl ${
              isDark ? 'bg-[rgba(30,20,38,0.82)] border border-white/10' : 'bg-white/80 border border-[#f0ddd4]'
            } backdrop-blur-sm`}
          >
            {passed ? (
              <CheckCircle size={56} className="mx-auto mb-4 text-[#22c55e]" />
            ) : (
              <XCircle size={56} className="mx-auto mb-4 text-[#ef4444]" />
            )}
            <h2 className="mb-2 text-2xl font-black">{passed ? c.resultPass : c.resultFail}</h2>
            <p className={`mb-6 text-base font-semibold ${isDark ? 'text-white/60' : 'text-[#405064]'}`}>
              {c.score(correctCount, questions.length)}
            </p>

            {passed && hasNextLevel ? (
              <button
                type="button"
                onClick={handleAdvance}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e] py-3 text-sm font-black text-white transition hover:bg-[#16a34a]"
              >
                <Trophy size={18} />
                {c.advance}
              </button>
            ) : passed ? (
              <button
                type="button"
                onClick={() => navigate(appShellRoutes.learn)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f04d72] py-3 text-sm font-black text-white transition hover:bg-[#e0315a]"
              >
                {c.back}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRetry}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f04d72] py-3 text-sm font-black text-white transition hover:bg-[#e0315a]"
              >
                {c.retry}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnLevelExamPage;
