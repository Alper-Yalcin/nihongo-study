import React, { useMemo, useState } from 'react';
import { PracticeQuestion } from '../../../data/jlearn/jlearnTypes';

interface SentenceBuildProps {
  question: PracticeQuestion;
  retryCount: number;
  lowConfidence?: boolean;
  onCorrect: () => void;
  onIncorrect: () => void;
}

type State = 'idle' | 'wrong' | 'correct';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Token {
  id: string;
  text: string;
}

export const SentenceBuild: React.FC<SentenceBuildProps> = ({
  question, retryCount, lowConfidence = false, onCorrect, onIncorrect,
}) => {
  const wrongStateClasses = lowConfidence
    ? 'border-[color:var(--kt-accent-warning)]/55 bg-[var(--kt-accent-warning-soft)]'
    : 'border-red-500 bg-red-500 bg-opacity-10';
  const sourceTokens = useMemo<Token[]>(
    () =>
      shuffle(
        question.correctAnswer
          .split(' ')
          .filter(Boolean)
          .map((t, i) => ({ id: `${i}-${t}`, text: t }))
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [question.id, retryCount]
  );

  const [bank, setBank] = useState<Token[]>(sourceTokens);
  const [answer, setAnswer] = useState<Token[]>([]);
  const [state, setState] = useState<State>('idle');

  const addToken = (token: Token) => {
    if (state !== 'idle') return;
    setBank((b) => b.filter((t) => t.id !== token.id));
    setAnswer((a) => [...a, token]);
  };

  const removeToken = (token: Token) => {
    if (state !== 'idle') return;
    setAnswer((a) => a.filter((t) => t.id !== token.id));
    setBank((b) => [...b, token]);
  };

  const handleSubmit = () => {
    if (answer.length === 0) return;
    const joined = answer.map((t) => t.text).join(' ');
    if (joined === question.correctAnswer) {
      setState('correct');
      setTimeout(onCorrect, 600);
    } else {
      setState('wrong');
      onIncorrect();
    }
  };

  const handleRetry = () => {
    setBank(sourceTokens);
    setAnswer([]);
    setState('idle');
  };

  return (
    <div>
      <p className="mb-5 text-base font-semibold text-[var(--kt-ink-strong)]">{question.prompt}</p>
      {question.promptJapanese && (
        <p className="mb-5 font-jp text-xl text-[var(--kt-ink)]">{question.promptJapanese}</p>
      )}

      {/* Answer area */}
      <div
        className={`mb-4 min-h-[56px] rounded-[1.2rem] border-2 border-dashed p-3 transition ${
          state === 'correct'
            ? 'border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)] bg-opacity-10'
            : state === 'wrong'
            ? wrongStateClasses
            : answer.length > 0
            ? 'border-[var(--kt-border)]'
            : 'border-[var(--kt-border-subtle)]'
        }`}
      >
        {answer.length === 0 ? (
          <span className="text-sm text-[var(--kt-ink-muted)]">Tap tokens below to build your answer…</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {answer.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => removeToken(t)}
                disabled={state !== 'idle'}
                className="rounded-[0.8rem] border border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)] bg-opacity-15 px-3 py-1.5 font-jp text-base text-[var(--kt-ink-strong)] transition hover:bg-opacity-25 disabled:cursor-default"
              >
                {t.text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Token bank */}
      <div className="mb-5 flex flex-wrap gap-2">
        {bank.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => addToken(t)}
            disabled={state !== 'idle'}
            className="rounded-[0.8rem] border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] px-3 py-1.5 font-jp text-base text-[var(--kt-ink)] transition hover:border-[var(--kt-accent-info)] hover:bg-[var(--kt-nav-item-hover)] disabled:cursor-default disabled:opacity-50"
          >
            {t.text}
          </button>
        ))}
      </div>

      {state === 'idle' && (
        <button
          type="button"
          disabled={answer.length === 0}
          onClick={handleSubmit}
          className="rounded-[1.2rem] bg-[var(--kt-accent-info)] px-8 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:opacity-40"
        >
          Check
        </button>
      )}

      {state === 'wrong' && (
        <div className={`rounded-[1.2rem] border p-4 ${wrongStateClasses}`}>
          {question.explanation ? (
            <p className="mb-3 text-sm text-[var(--kt-ink)]">{question.explanation}</p>
          ) : (
            <p className="mb-3 text-sm text-[var(--kt-ink-muted)]">
              Correct order:{' '}
              <span className="font-jp font-black text-[var(--kt-ink-strong)]">
                {question.correctAnswer}
              </span>
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
