import { JLearnTrack, JLearnLevel, JLearnUnit, JLearnStep } from './jlearnTypes';
import { jlearnLevel1 } from './jlearnL1';

const jlearnLevel2Stub: JLearnLevel = {
  id: 'JL2',
  title: 'Self Introduction',
  theme: 'First day at school — who are you?',
  jlptAlignment: 'N5',
  checkpointUnitId: 'L2-U2',
  units: [],
  badge: { id: 'badge-self-introducer', name: 'Self-Introducer', description: 'You can introduce yourself completely to anyone in Japanese.' }
};

export const jlearnTrack: JLearnTrack = {
  id: 'japanese',
  title: 'Learn Japanese',
  levels: [jlearnLevel1, jlearnLevel2Stub]
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
