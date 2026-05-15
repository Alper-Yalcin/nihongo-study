import { JLearnTrack, JLearnLevel, JLearnUnit, JLearnStep, VocabItem, GrammarPoint } from './jlearnTypes';
import { jlearnLevel1 } from './jlearnL1';
import { jlearnLevel2 } from './jlearnL2';
import { jlearnLevel3 } from './jlearnL3';
import { jlearnLevel4 } from './jlearnL4';
import { jlearnLevel5 } from './jlearnL5';
import { jlearnLevel6 } from './jlearnL6';
import { jlearnLevel7 } from './jlearnL7';
import { jlearnLevel8 } from './jlearnL8';
import { jlearnLevel9 } from './jlearnL9';
import { jlearnLevel10 } from './jlearnL10';
import { jlearnLevel11 } from './jlearnL11';
import { jlearnLevel12 } from './jlearnL12';
import { jlearnLevel13 } from './jlearnL13';
import { jlearnLevel14 } from './jlearnL14';

export const jlearnTrack: JLearnTrack = {
  id: 'japanese',
  title: 'Learn Japanese',
  levels: [
    jlearnLevel1,
    jlearnLevel2,
    jlearnLevel3,
    jlearnLevel4,
    jlearnLevel5,
    jlearnLevel6,
    jlearnLevel7,
    jlearnLevel8,
    jlearnLevel9,
    jlearnLevel10,
    jlearnLevel11,
    jlearnLevel12,
    jlearnLevel13,
    jlearnLevel14,
  ]
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
