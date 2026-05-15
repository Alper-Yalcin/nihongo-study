import type { LessonConcept } from '../lessonTypes';
import { greetingsConcept } from './concepts/greetingsConcept';
import { numbersConcept } from './concepts/numbersConcept';
import { foodConcept } from './concepts/foodConcept';

export const lessonConcepts: LessonConcept[] = [
  greetingsConcept,
  numbersConcept,
  foodConcept,
];

export function getLessonConcept(id: string): LessonConcept | undefined {
  return lessonConcepts.find((c) => c.id === id);
}
