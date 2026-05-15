import { useCallback, useState } from 'react';
import { BranchingChoice, BranchingOption, BranchingOutcomeKind } from '../../../learn/data/jlearn/jlearnTypes';

export interface BranchingPickResult {
  result: BranchingOutcomeKind;
  outcomeText: string;
  explanation?: string;
  option: BranchingOption;
}

export interface UseBranchingChoiceReturn {
  picked: BranchingPickResult | null;
  isPicked: boolean;
  onPick: (optionId: string) => BranchingPickResult | null;
  reset: () => void;
}

export function useBranchingChoice(bc: BranchingChoice): UseBranchingChoiceReturn {
  const [picked, setPicked] = useState<BranchingPickResult | null>(null);

  const onPick = useCallback(
    (optionId: string): BranchingPickResult | null => {
      const option = bc.options.find((o) => o.id === optionId);
      if (!option) {
        console.warn(`[BranchingChoice] Unknown optionId: "${optionId}"`);
        return null;
      }

      const pickResult: BranchingPickResult = {
        result: option.outcome,
        outcomeText: option.reaction,
        explanation: option.explanation,
        option,
      };

      console.log(
        `[BranchingChoice] Picked "${option.label}" → result: ${option.outcome} | reaction: "${option.reaction}"`
      );

      setPicked(pickResult);
      return pickResult;
    },
    [bc]
  );

  const reset = useCallback(() => {
    setPicked(null);
    console.log('[BranchingChoice] Reset');
  }, []);

  return { picked, isPicked: picked !== null, onPick, reset };
}
