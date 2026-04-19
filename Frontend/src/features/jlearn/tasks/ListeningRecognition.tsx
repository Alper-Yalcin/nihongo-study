import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PracticeQuestion } from '../../../data/jlearn/jlearnTypes';
import { isAnswerCorrect } from './answerNormalizer';

interface ListeningRecognitionProps {
  question: PracticeQuestion;
  retryCount: number;
  onCorrect: () => void;
  onRetry: () => void;
}

type State = 'idle' | 'wrong' | 'correct';
type VoiceStatus = 'loading' | 'ready' | 'missing';

function getJaVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === 'ja-JP') ??
    voices.find((v) => v.lang.startsWith('ja')) ??
    null
  );
}

export const ListeningRecognition: React.FC<ListeningRecognitionProps> = ({
  question, retryCount, onCorrect, onRetry,
}) => {
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('loading');
  const [selected, setSelected] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<State>('idle');
  const [playing, setPlaying] = useState(false);
  const spokenText = question.promptJapanese ?? question.correctAnswer;
  const hasSpokenOnce = useRef(false);

  const speak = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(spokenText);
    utt.lang = 'ja-JP';
    const voice = getJaVoice();
    if (voice) utt.voice = voice;
    utt.rate = 0.85;
    utt.onstart = () => setPlaying(true);
    utt.onend = () => setPlaying(false);
    utt.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utt);
  }, [spokenText]);

  useEffect(() => {
    const resolve = () => {
      const voice = getJaVoice();
      setVoiceStatus(voice ? 'ready' : 'missing');
      if (!hasSpokenOnce.current) {
        hasSpokenOnce.current = true;
        if (voice) speak();
      }
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      resolve();
    } else {
      window.speechSynthesis.onvoiceschanged = resolve;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, retryCount]);

  const handleSubmit = () => {
    if (!selected) return;
    if (isAnswerCorrect(selected, question.correctAnswer, question.acceptedAnswers)) {
      setAnswerState('correct');
      setTimeout(onCorrect, 600);
    } else {
      setAnswerState('wrong');
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setAnswerState('idle');
    onRetry();
  };

  const options = question.options ?? [];

  return (
    <div>
      <p className="mb-5 text-base font-semibold text-[var(--kt-ink-strong)]">{question.prompt}</p>

      {/* Audio player */}
      <div className="mb-6 flex flex-col items-center gap-3 rounded-[1.4rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-6">
        {voiceStatus === 'missing' && (
          <p className="mb-2 text-xs text-amber-500">
            No Japanese (ja-JP) voice found — install one in your OS or browser for audio.
          </p>
        )}
        <button
          type="button"
          onClick={speak}
          disabled={playing || voiceStatus === 'loading'}
          className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl transition ${
            playing
              ? 'bg-[var(--kt-accent-info)] text-white opacity-80'
              : 'bg-[var(--kt-accent-info)] text-white hover:opacity-90'
          } disabled:opacity-40`}
          aria-label="Play audio"
        >
          {playing ? '⏸' : '▶'}
        </button>
        <span className="text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
          {playing ? 'Playing…' : 'Tap to listen'}
        </span>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {options.map((opt) => {
          const isSelected = selected === opt;
          const isCorrectOpt = isAnswerCorrect(opt, question.correctAnswer, question.acceptedAnswers);
          let border = 'border-[var(--kt-border-subtle)]';
          let bg = 'bg-[var(--kt-surface-raised)]';
          let text = 'text-[var(--kt-ink)]';

          if (answerState === 'correct' && isSelected) {
            border = 'border-[var(--kt-accent-info)]';
            bg = 'bg-[var(--kt-accent-info)] bg-opacity-10';
            text = 'text-[var(--kt-accent-info)]';
          } else if (answerState === 'wrong') {
            if (isSelected) {
              border = 'border-red-500'; bg = 'bg-red-500 bg-opacity-10'; text = 'text-red-500';
            } else if (isCorrectOpt) {
              border = 'border-[var(--kt-accent-info)]';
              bg = 'bg-[var(--kt-accent-info)] bg-opacity-10';
              text = 'text-[var(--kt-accent-info)]';
            }
          } else if (isSelected) {
            border = 'border-[var(--kt-accent-info)]';
          }

          return (
            <button
              key={opt}
              type="button"
              disabled={answerState !== 'idle'}
              onClick={() => setSelected(opt)}
              className={`w-full rounded-[1rem] border px-4 py-3.5 text-left text-sm font-semibold transition ${border} ${bg} ${text}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {answerState === 'idle' && (
        <button
          type="button"
          disabled={!selected}
          onClick={handleSubmit}
          className="mt-5 rounded-[1.2rem] bg-[var(--kt-accent-info)] px-8 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:opacity-40"
        >
          Check
        </button>
      )}

      {answerState === 'wrong' && (
        <div className="mt-5 rounded-[1.2rem] border border-red-500 bg-red-500 bg-opacity-10 p-4">
          {question.explanation ? (
            <p className="mb-3 text-sm text-[var(--kt-ink)]">{question.explanation}</p>
          ) : (
            <p className="mb-3 text-sm text-[var(--kt-ink-muted)]">
              Correct answer:{' '}
              <span className="font-black text-[var(--kt-ink-strong)]">{question.correctAnswer}</span>
            </p>
          )}
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-[1rem] border border-[var(--kt-border)] px-5 py-2.5 text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink)] transition hover:bg-[var(--kt-nav-item-hover)]"
          >
            Try again {retryCount > 0 ? `(${retryCount})` : ''}
          </button>
        </div>
      )}
    </div>
  );
};
