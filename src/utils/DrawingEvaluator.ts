import { Character } from '../types';

export type Point = { x: number; y: number };
export type Stroke = Point[];

export const evaluateDrawing = (strokes: Stroke[], expectedChar: Character): boolean => {
  // Placeholder template matching system
  // In a real app, this would compare normalized strokes against expectedChar.drawingData.testTemplate
  
  if (strokes.length === 0) return false;

  // Basic heuristic for the first version:
  // Just check if the user drew something substantial (e.g., total points > 5)
  // We can leave this open for future improvements.
  
  const totalPoints = strokes.reduce((acc, stroke) => acc + stroke.length, 0);
  if (totalPoints < 5) return false;

  // For now, we accept any substantial drawing as "Correct" to unblock the user,
  // since we don't have a real OCR/template matching engine yet.
  return true;
};
