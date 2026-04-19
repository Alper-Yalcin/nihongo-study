import { JLearnTrack } from './jlearnTypes';
import { MissionProgress } from './jlearnStorage';

interface StepLocation {
  levelIdx: number;
  unitIdx: number;
  stepIdx: number;
  levelId: string;
  unitId: string;
  stepId: string;
}

function locateStep(stepId: string, track: JLearnTrack): StepLocation | null {
  for (let li = 0; li < track.levels.length; li++) {
    const level = track.levels[li];
    for (let ui = 0; ui < level.units.length; ui++) {
      const unit = level.units[ui];
      for (let si = 0; si < unit.steps.length; si++) {
        if (unit.steps[si].id === stepId) {
          return { levelIdx: li, unitIdx: ui, stepIdx: si, levelId: level.id, unitId: unit.id, stepId };
        }
      }
    }
  }
  return null;
}

function checkpointStepId(track: JLearnTrack, levelIdx: number, unitIdx: number): string | null {
  const unit = track.levels[levelIdx]?.units[unitIdx];
  if (!unit) return null;
  const cp = unit.steps.find((s) => s.isCheckpoint);
  return cp?.id ?? unit.steps[unit.steps.length - 1]?.id ?? null;
}

export function isStepUnlocked(stepId: string, progress: MissionProgress, track: JLearnTrack): boolean {
  const loc = locateStep(stepId, track);
  if (!loc) return false;

  const { levelIdx, unitIdx, stepIdx } = loc;
  const unit = track.levels[levelIdx].units[unitIdx];

  // First step in first unit of first level — always unlocked
  if (levelIdx === 0 && unitIdx === 0 && stepIdx === 0) return true;

  // Nth step in a unit: previous step must be completed
  if (stepIdx > 0) {
    const prevStepId = unit.steps[stepIdx - 1].id;
    if (!progress.completedStepIds.includes(prevStepId)) return false;
  }

  // First step in a non-first unit: previous unit's checkpoint must be completed
  if (stepIdx === 0 && unitIdx > 0) {
    const prevCheckpointId = checkpointStepId(track, levelIdx, unitIdx - 1);
    if (!prevCheckpointId || !progress.completedStepIds.includes(prevCheckpointId)) return false;
  }

  // First step in first unit of a non-first level: previous level's checkpoint must be completed
  if (stepIdx === 0 && unitIdx === 0 && levelIdx > 0) {
    const prevLevel = track.levels[levelIdx - 1];
    const prevLastUnitIdx = prevLevel.units.length - 1;
    const prevCheckpointId = checkpointStepId(track, levelIdx - 1, prevLastUnitIdx);
    if (!prevCheckpointId || !progress.completedStepIds.includes(prevCheckpointId)) return false;
  }

  return true;
}

export function completeStep(stepId: string, progress: MissionProgress, track: JLearnTrack): MissionProgress {
  if (progress.completedStepIds.includes(stepId)) return progress;

  const next: MissionProgress = {
    ...progress,
    completedStepIds: [...progress.completedStepIds, stepId],
    lastUpdatedAt: new Date().toISOString(),
  };

  const loc = locateStep(stepId, track);
  if (!loc) return next;

  const { levelIdx, unitIdx, levelId, unitId } = loc;
  const unit = track.levels[levelIdx].units[unitIdx];

  // Mark unit complete if its checkpoint step is now done
  const cpId = checkpointStepId(track, levelIdx, unitIdx);
  if (cpId && next.completedStepIds.includes(cpId) && !next.completedUnitIds.includes(unitId)) {
    next.completedUnitIds = [...next.completedUnitIds, unitId];
  }

  // Mark level complete if all units are done
  const level = track.levels[levelIdx];
  const allUnitsDone = level.units.every((u) => next.completedUnitIds.includes(u.id));
  if (allUnitsDone && !next.completedLevelIds.includes(levelId)) {
    next.completedLevelIds = [...next.completedLevelIds, levelId];
    if (level.badge && !next.earnedBadgeIds.includes(level.badge.id)) {
      next.earnedBadgeIds = [...next.earnedBadgeIds, level.badge.id];
    }
  }

  return next;
}
