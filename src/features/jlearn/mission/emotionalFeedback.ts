export type EmotionalFeedbackTier = 'perfect' | 'good' | 'struggle';

export interface EmotionalFeedbackScore {
  total: number;
  totalRetries: number;
  hintCount?: number;
}

export function deriveEmotionalFeedbackTier(
  score?: EmotionalFeedbackScore | null
): EmotionalFeedbackTier | null {
  if (!score || score.total === 0) return null;

  const totalInterventions = score.totalRetries + (score.hintCount ?? 0);

  if (totalInterventions === 0) return 'perfect';
  if (totalInterventions <= 2) return 'good';
  return 'struggle';
}
