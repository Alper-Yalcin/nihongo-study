import { KanaScript } from './kanaItem';

export type ReviewReason =
  | 'new_failed'
  | 'weak_item'
  | 'overdue'
  | 'confusable'
  | 'manual_review';

export type ReviewSourceMode = 'typing' | 'drawing' | 'listening' | 'mixed';

export interface ReviewEntry {
  kanaId: string;
  script: KanaScript;
  priority: number;
  reason: ReviewReason;
  dueAt: string;
  sourceMode: ReviewSourceMode;
  createdAt: string;
}
