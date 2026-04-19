import { JLearnTrack, JLearnLevel, JLearnUnit, JLearnStep, VocabItem, GrammarPoint } from './jlearnTypes';
import { jlearnLevel1 } from './jlearnL1';
import { jlearnLevel2 } from './jlearnL2';
import { jlearnLevel3 } from './jlearnL3';

export const jlearnTrack: JLearnTrack = {
  id: 'japanese',
  title: 'Learn Japanese',
  levels: [jlearnLevel1, jlearnLevel2, jlearnLevel3]
};

export const getJLearnLevel = (levelId: string): JLearnLevel | undefined =>
  jlearnTrack.levels.find((level) => level.id === levelId);

export const getJLearnUnit = (unitId: string): JLearnUnit | undefined => {
  for (const level of jlearnTrack.levels) {
    const unit = level.units.find((u) => u.id === unitId);
    if (unit) return unit;
  }
  return undefined;
};

export const getJLearnStep = (stepId: string): JLearnStep | undefined => {
  for (const level of jlearnTrack.levels) {
    for (const unit of level.units) {
      const step = unit.steps.find((s) => s.id === stepId);
      if (step) return step;
    }
  }
  return undefined;
};

export const getAllJLearnSteps = (): JLearnStep[] =>
  jlearnTrack.levels.flatMap((level) => level.units.flatMap((unit) => unit.steps));

export const getJLearnLevelForStep = (stepId: string): JLearnLevel | undefined => {
  for (const level of jlearnTrack.levels) {
    if (level.units.some((unit) => unit.steps.some((step) => step.id === stepId))) {
      return level;
    }
  }

  return undefined;
};

export const getAllJLearnVocabItems = (): VocabItem[] => {
  const deduped = new Map<string, VocabItem>();

  for (const step of getAllJLearnSteps()) {
    for (const vocab of step.vocabulary) {
      deduped.set(vocab.id, vocab);
    }
  }

  return Array.from(deduped.values());
};

export const getAllJLearnGrammarPoints = (): GrammarPoint[] => {
  const deduped = new Map<string, GrammarPoint>();

  for (const step of getAllJLearnSteps()) {
    for (const grammarPoint of step.grammar) {
      deduped.set(grammarPoint.id, grammarPoint);
    }
  }

  return Array.from(deduped.values());
};
