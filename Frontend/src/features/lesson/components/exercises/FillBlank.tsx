import React, { useState } from 'react';
import type { FillBlankExercise } from '../../lessonTypes';
import { ChoicePill, deriveChoiceState } from '../ui/ChoicePill';

interface Props {
  exercise: FillBlankExercise;
  onAnswerSelect: (correct: boolean) => void;
  checked: boolean;
}

const BLANK_TYPE_LABEL: Record<FillBlankExercise['blankType'], string> = {
  particle: 'Parçacık',
  word: 'Kelime',
  verb: 'Fiil',
};

export const FillBlank: React.FC<Props> = ({ exercise, onAnswerSelect, checked }) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number, correct: boolean) => {
    if (selected !== null) return;
    setSelected(index);
    onAnswerSelect(correct);
  };

  const selectedLabel = selected !== null ? exercise.options[selected]?.label : null;

  const blankState =
    !checked
      ? selected !== null
        ? 'pending'
        : 'empty'
      : selected !== null && exercise.options[selected]?.correct
        ? 'correct'
        : 'wrong';

  const blankCls =
    blankState === 'empty'
      ? 'inline-block min-w-[2.5rem] rounded-[0.5rem] border-b-[3px] border-[var(--kt-brand)] px-2 py-0.5 text-[var(--kt-brand)] opacity-40'
      : blankState === 'pending'
        ? 'inline-block min-w-[2.5rem] rounded-[0.5rem] border-b-[3px] border-[var(--kt-brand)] bg-[var(--kt-brand-soft,var(--kt-surface-muted))] px-2 py-0.5 text-[var(--kt-brand)]'
        : blankState === 'correct'
          ? 'inline-block min-w-[2.5rem] rounded-[0.5rem] border-b-[3px] border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] px-2 py-0.5 text-[var(--kt-accent-success)]'
          : 'inline-block min-w-[2.5rem] rounded-[0.5rem] border-b-[3px] border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)] px-2 py-0.5 text-[var(--kt-accent-danger)]';

  return (
    <section className="mx-auto max-w-lg">
      {/* Type badge + label */}
      <div className="mb-5 flex items-center gap-2">
        <span className="rounded-full bg-[var(--kt-surface-muted)] px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-[0.12em] text-[var(--kt-ink-subtle)]">
          {BLANK_TYPE_LABEL[exercise.blankType]}
        </span>
        <span className="text-xs font-bold text-[var(--kt-ink-subtle)]">Boşluğu doldur</span>
      </div>

      {/* Sentence as one large inline line */}
      <div className="mb-8 font-jp text-3xl font-black leading-relaxed text-[var(--kt-ink-strong)]">
        {exercise.sentenceBefore && <span>{exercise.sentenceBefore}</span>}
        <span className={blankCls}>{selectedLabel ?? '＿'}</span>
        {exercise.sentenceAfter && <span>{exercise.sentenceAfter}</span>}
      </div>

      {/* Grammar chips */}
      <div className="grid grid-cols-2 gap-2.5">
        {exercise.options.map((option, i) => (
          <ChoicePill
            key={i}
            state={deriveChoiceState(i, option.correct, selected, checked)}
            onClick={() => handleSelect(i, option.correct)}
            className="font-jp text-xl text-center"
          >
            {option.label}
          </ChoicePill>
        ))}
      </div>
    </section>
  );
};
