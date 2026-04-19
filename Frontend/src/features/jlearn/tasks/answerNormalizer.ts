const normalize = (s: string): string => s.trim().toLowerCase();

const expand = (answer: string): string[] =>
  answer.split('/').map((a) => normalize(a));

export const isAnswerCorrect = (
  given: string,
  correct: string,
  accepted?: string[]
): boolean => {
  const n = normalize(given);
  if (expand(correct).includes(n)) return true;
  if (accepted?.some((a) => expand(a).includes(n))) return true;
  return false;
};
