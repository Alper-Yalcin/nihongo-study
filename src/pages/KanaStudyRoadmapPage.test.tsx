import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { kanaInventoryByScript } from '../features/kana/data/kanaInventory';
import { QuizStepPanel } from './KanaStudyRoadmapPage';

afterEach(() => {
  cleanup();
});

const baseLessonItems = [
  kanaInventoryByScript.hiragana[0],
  kanaInventoryByScript.hiragana[1]
];

const basePoolItems = [
  kanaInventoryByScript.hiragana[0],
  kanaInventoryByScript.hiragana[1],
  kanaInventoryByScript.hiragana[2],
  kanaInventoryByScript.hiragana[3]
];

describe('QuizStepPanel reset behavior', () => {
  it('resets typing input when question set changes in the same step', () => {
    const onComplete = vi.fn();

    const { rerender } = render(
      <QuizStepPanel
        language="en"
        title="Typing Step"
        description="Type the answer"
        mode="typing"
        lessonItems={[baseLessonItems[0]]}
        poolItems={basePoolItems}
        questionLimit={1}
        onComplete={onComplete}
      />
    );

    const input = screen.getByPlaceholderText('romaji') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'temp-answer' } });
    expect(input.value).toBe('temp-answer');

    rerender(
      <QuizStepPanel
        language="en"
        title="Typing Step"
        description="Type the answer"
        mode="typing"
        lessonItems={baseLessonItems}
        poolItems={basePoolItems}
        questionLimit={2}
        onComplete={onComplete}
      />
    );

    const resetInput = screen.getByPlaceholderText('romaji') as HTMLInputElement;
    expect(resetInput.value).toBe('');
    expect(screen.getByText(/Question 1\//)).toBeTruthy();
  });

  it('clears feedback and cursor state when step mode changes', async () => {
    const onComplete = vi.fn();

    const { rerender } = render(
      <QuizStepPanel
        language="en"
        title="Recognition"
        description="Choose the right option"
        mode="recognition"
        lessonItems={[baseLessonItems[0]]}
        poolItems={basePoolItems}
        questionLimit={1}
        onComplete={onComplete}
      />
    );

    const optionButtons = screen.getAllByRole('button');
    fireEvent.click(optionButtons[0]);

    expect(screen.getByText(/Correct|Wrong/)).toBeTruthy();

    rerender(
      <QuizStepPanel
        language="en"
        title="Reading"
        description="Select the character"
        mode="reading"
        lessonItems={[baseLessonItems[0]]}
        poolItems={basePoolItems}
        questionLimit={1}
        onComplete={onComplete}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText(/Correct|Wrong/)).toBeNull();
    });
    expect(screen.getByText(/Question 1\//)).toBeTruthy();
  });
});
