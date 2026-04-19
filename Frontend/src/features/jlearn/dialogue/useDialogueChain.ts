import { useCallback, useState } from 'react';
import { DialogueChain, DialogueTurn } from '../../../data/jlearn/jlearnTypes';
import { isAnswerCorrect } from '../tasks/answerNormalizer';

export interface MissedTurn {
  turnIndex: number;
  speaker: string;
  expected: string;
  given: string;
}

export interface DialogueChainState {
  currentTurn: DialogueTurn | null;
  turnIndex: number;
  isDone: boolean;
  missedTurns: MissedTurn[];
}

export interface UseDialogueChainReturn extends DialogueChainState {
  advance: (givenAnswer?: string) => void;
  reset: () => void;
}

export function useDialogueChain(chain: DialogueChain): UseDialogueChainReturn {
  const [turnIndex, setTurnIndex] = useState(0);
  const [missedTurns, setMissedTurns] = useState<MissedTurn[]>([]);

  const isDone = turnIndex >= chain.turns.length;
  const currentTurn = isDone ? null : chain.turns[turnIndex];

  const advance = useCallback(
    (givenAnswer?: string) => {
      const turn = chain.turns[turnIndex];
      if (!turn) return;

      if (turn.isLearnerTurn && turn.expectedAnswer && givenAnswer !== undefined) {
        const correct = isAnswerCorrect(
          givenAnswer,
          turn.expectedAnswer,
          turn.acceptedAnswers
        );
        if (!correct) {
          const missed: MissedTurn = {
            turnIndex,
            speaker: turn.speaker,
            expected: turn.expectedAnswer,
            given: givenAnswer,
          };
          setMissedTurns((prev) => [...prev, missed]);
          console.log(
            `[DialogueChain:${chain.id}] Turn ${turnIndex} missed — expected: "${turn.expectedAnswer}", got: "${givenAnswer}"`
          );
        } else {
          console.log(
            `[DialogueChain:${chain.id}] Turn ${turnIndex} correct — "${givenAnswer}"`
          );
        }
      } else {
        console.log(
          `[DialogueChain:${chain.id}] Turn ${turnIndex} advanced — speaker: "${turn.speaker}"`
        );
      }

      setTurnIndex((i) => i + 1);
    },
    [chain, turnIndex]
  );

  const reset = useCallback(() => {
    setTurnIndex(0);
    setMissedTurns([]);
    console.log(`[DialogueChain:${chain.id}] Reset`);
  }, [chain.id]);

  return { currentTurn, turnIndex, isDone, missedTurns, advance, reset };
}
