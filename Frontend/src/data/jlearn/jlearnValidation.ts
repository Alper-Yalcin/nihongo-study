/**
 * S25a — Curriculum & storage validation utilities.
 * All functions are pure (no side-effects) and return string[] of issue descriptions.
 * An empty array means the data is valid.
 */

import { JLearnTrack, JLearnLevel, JLearnStep } from './jlearnTypes';
import { MissionProgress, VocabProgressMap } from './jlearnStorage';
import { JLearnUserState, JLEARN_RELATIONSHIP_CHARACTER_IDS } from '../../features/jlearn/debug/debugStore';

// ─── Curriculum data ──────────────────────────────────────────────────────────

export function validateCurriculumData(track: JLearnTrack): string[] {
  const issues: string[] = [];
  const seenLevelIds = new Set<string>();
  const seenUnitIds = new Set<string>();
  const seenStepIds = new Set<string>();
  const seenVocabIds = new Set<string>();
  const seenGrammarIds = new Set<string>();

  if (!track.id) issues.push('track: missing id');
  if (!track.title) issues.push('track: missing title');
  if (!Array.isArray(track.levels) || track.levels.length === 0) {
    issues.push('track: levels must be a non-empty array');
    return issues;
  }

  for (const level of track.levels) {
    const lp = `level(${level.id})`;

    if (!level.id) { issues.push(`${lp}: missing id`); continue; }
    if (seenLevelIds.has(level.id)) { issues.push(`${lp}: duplicate level id`); }
    seenLevelIds.add(level.id);

    if (!level.title) issues.push(`${lp}: missing title`);
    if (!level.theme) issues.push(`${lp}: missing theme`);
    if (!level.jlptAlignment) issues.push(`${lp}: missing jlptAlignment`);
    if (!level.checkpointUnitId) issues.push(`${lp}: missing checkpointUnitId`);

    if (!Array.isArray(level.units) || level.units.length === 0) {
      issues.push(`${lp}: units must be a non-empty array`);
      continue;
    }

    const checkpointUnitExists = level.units.some((u) => u.id === level.checkpointUnitId);
    if (!checkpointUnitExists) {
      issues.push(`${lp}: checkpointUnitId '${level.checkpointUnitId}' not found in units`);
    }

    for (const unit of level.units) {
      const up = `${lp}/unit(${unit.id})`;

      if (!unit.id) { issues.push(`${up}: missing id`); continue; }
      if (seenUnitIds.has(unit.id)) { issues.push(`${up}: duplicate unit id`); }
      seenUnitIds.add(unit.id);

      if (!unit.title) issues.push(`${up}: missing title`);
      if (!Array.isArray(unit.steps) || unit.steps.length === 0) {
        issues.push(`${up}: steps must be a non-empty array`);
        continue;
      }

      const hasCheckpointStep = unit.steps.some((s) => s.isCheckpoint);
      if (unit.id === level.checkpointUnitId && !hasCheckpointStep) {
        issues.push(`${up}: checkpoint unit must have at least one step with isCheckpoint=true`);
      }

      for (const step of unit.steps) {
        const sp = `${up}/step(${step.id})`;

        if (!step.id) { issues.push(`${sp}: missing id`); continue; }
        if (seenStepIds.has(step.id)) { issues.push(`${sp}: duplicate step id`); }
        seenStepIds.add(step.id);

        if (!step.title) issues.push(`${sp}: missing title`);
        if (!step.estimatedMinutes) issues.push(`${sp}: missing estimatedMinutes`);
        if (!Array.isArray(step.vocabulary)) issues.push(`${sp}: vocabulary must be an array`);
        if (!Array.isArray(step.grammar)) issues.push(`${sp}: grammar must be an array`);
        if (!Array.isArray(step.questions)) issues.push(`${sp}: questions must be an array`);
        if (step.tasks != null && !Array.isArray(step.tasks)) {
          issues.push(`${sp}: tasks must be an array when present`);
        }
        if (step.srsTargets != null && !Array.isArray(step.srsTargets)) {
          issues.push(`${sp}: srsTargets must be an array when present`);
        }
        if (step.adaptiveTags != null && !Array.isArray(step.adaptiveTags)) {
          issues.push(`${sp}: adaptiveTags must be an array when present`);
        }
        if (step.difficulty && (step.difficulty.level < 1 || step.difficulty.level > 5)) {
          issues.push(`${sp}: difficulty.level must be between 1 and 5`);
        }

        if (step.isCheckpoint && (step.minPassScore == null || step.minPassScore < 1 || step.minPassScore > 100)) {
          issues.push(`${sp}: checkpoint step must have minPassScore between 1 and 100`);
        }

        for (const vocab of step.vocabulary ?? []) {
          if (!vocab.id) { issues.push(`${sp}/vocab: missing id`); continue; }
          seenVocabIds.add(vocab.id);
          if (!vocab.japanese) issues.push(`${sp}/vocab(${vocab.id}): missing japanese`);
          if (!vocab.english) issues.push(`${sp}/vocab(${vocab.id}): missing english`);
          if (!vocab.romaji) issues.push(`${sp}/vocab(${vocab.id}): missing romaji`);
        }

        for (const gp of step.grammar ?? []) {
          if (!gp.id) { issues.push(`${sp}/grammar: missing id`); continue; }
          seenGrammarIds.add(gp.id);
          if (!gp.pattern) issues.push(`${sp}/grammar(${gp.id}): missing pattern`);
          if (!gp.explanation) issues.push(`${sp}/grammar(${gp.id}): missing explanation`);
        }

        for (const q of step.questions ?? []) {
          if (!q.id) { issues.push(`${sp}/question: missing id`); continue; }
          if (!q.type) issues.push(`${sp}/question(${q.id}): missing type`);
          if (!q.prompt) issues.push(`${sp}/question(${q.id}): missing prompt`);
          if (!q.correctAnswer) issues.push(`${sp}/question(${q.id}): missing correctAnswer`);
          if (
            (q.type === 'multiple-choice' || q.type === 'context-select') &&
            (!Array.isArray(q.options) || q.options.length < 2)
          ) {
            issues.push(`${sp}/question(${q.id}): ${q.type} requires at least 2 options`);
          }
        }

        for (const task of step.tasks ?? []) {
          if (!task.id) issues.push(`${sp}/task: missing id`);
          if (!task.type) issues.push(`${sp}/task(${task.id}): missing type`);
          if (!task.prompt) issues.push(`${sp}/task(${task.id}): missing prompt`);
          if (!Array.isArray(task.targetIds) || task.targetIds.length === 0) {
            issues.push(`${sp}/task(${task.id}): targetIds must be non-empty`);
          }
        }

        for (const target of step.srsTargets ?? []) {
          if (!target.targetId) issues.push(`${sp}/srsTarget: missing targetId`);
          if (!target.targetType) issues.push(`${sp}/srsTarget(${target.targetId}): missing targetType`);
          if (!Array.isArray(target.skills) || target.skills.length === 0) {
            issues.push(`${sp}/srsTarget(${target.targetId}): skills must be non-empty`);
          }
        }
      }
    }

    if (level.challengeMission) {
      issues.push(...validateStep(level.challengeMission, `${lp}/challengeMission`));
      if (!level.challengeMission.questions || level.challengeMission.questions.length < 10) {
        issues.push(`${lp}/challengeMission: should have at least 10 questions`);
      }
    }
  }

  return issues;
}

function validateStep(step: JLearnStep, path: string): string[] {
  const issues: string[] = [];
  if (!step.id) issues.push(`${path}: missing id`);
  if (!step.title) issues.push(`${path}: missing title`);
  if (!Array.isArray(step.questions)) issues.push(`${path}: questions must be an array`);
  return issues;
}

// ─── Mission progress ─────────────────────────────────────────────────────────

export function validateProgress(progress: MissionProgress, knownLevelIds: string[] = []): string[] {
  const issues: string[] = [];

  if (!Array.isArray(progress.completedStepIds)) {
    issues.push('progress: completedStepIds must be an array');
  }
  if (!Array.isArray(progress.completedUnitIds)) {
    issues.push('progress: completedUnitIds must be an array');
  }
  if (!Array.isArray(progress.completedLevelIds)) {
    issues.push('progress: completedLevelIds must be an array');
  }
  if (!Array.isArray(progress.earnedBadgeIds)) {
    issues.push('progress: earnedBadgeIds must be an array');
  }
  if (!progress.lastUpdatedAt || Number.isNaN(Date.parse(progress.lastUpdatedAt))) {
    issues.push(`progress: invalid lastUpdatedAt '${progress.lastUpdatedAt}'`);
  }

  if (knownLevelIds.length > 0) {
    for (const levelId of progress.completedLevelIds ?? []) {
      if (!knownLevelIds.includes(levelId)) {
        issues.push(`progress: completedLevelId '${levelId}' not in curriculum`);
      }
    }
  }

  return issues;
}

// ─── Vocab progress ───────────────────────────────────────────────────────────

export function validateVocabProgress(vocab: VocabProgressMap): string[] {
  const issues: string[] = [];

  for (const [vocabId, entry] of Object.entries(vocab)) {
    if (entry.vocabId !== vocabId) {
      issues.push(`vocab(${vocabId}): key/vocabId mismatch (entry has '${entry.vocabId}')`);
    }
    if (!Number.isInteger(entry.masteryLevel) || entry.masteryLevel < 0 || entry.masteryLevel > 4) {
      issues.push(`vocab(${vocabId}): invalid masteryLevel ${entry.masteryLevel}`);
    }
    if (!Number.isInteger(entry.errorCount) || entry.errorCount < 0) {
      issues.push(`vocab(${vocabId}): invalid errorCount ${entry.errorCount}`);
    }
    if (!entry.lastSeenAt || Number.isNaN(Date.parse(entry.lastSeenAt))) {
      issues.push(`vocab(${vocabId}): invalid lastSeenAt '${entry.lastSeenAt}'`);
    }
    if (!entry.nextReviewAt || Number.isNaN(Date.parse(entry.nextReviewAt))) {
      issues.push(`vocab(${vocabId}): invalid nextReviewAt '${entry.nextReviewAt}'`);
    }
    if (!Array.isArray(entry.seenInMissions)) {
      issues.push(`vocab(${vocabId}): seenInMissions must be an array`);
    }
    if (entry.confusedWith != null && !Array.isArray(entry.confusedWith)) {
      issues.push(`vocab(${vocabId}): confusedWith must be an array if present`);
    }
  }

  return issues;
}

// ─── User state ───────────────────────────────────────────────────────────────

const VALID_CONFIDENCE_LEVELS = new Set(['low', 'medium', 'high']);
const VALID_FORMALITY_PREFS = new Set(['casual', 'neutral', 'polite']);
const VALID_RELATIONSHIP_STAGES = new Set([0, 1, 2, 3]);

export function validateUserState(state: JLearnUserState): string[] {
  const issues: string[] = [];

  if (!VALID_CONFIDENCE_LEVELS.has(state.confidenceLevel)) {
    issues.push(`userState: invalid confidenceLevel '${state.confidenceLevel}'`);
  }
  if (!VALID_FORMALITY_PREFS.has(state.formalityPreference)) {
    issues.push(`userState: invalid formalityPreference '${state.formalityPreference}'`);
  }
  if (!Array.isArray(state.recentMistakes)) {
    issues.push('userState: recentMistakes must be an array');
  }
  if (!Array.isArray(state.recoveryFlags)) {
    issues.push('userState: recoveryFlags must be an array');
  }
  if (typeof state.formalityDriftScore !== 'number') {
    issues.push('userState: formalityDriftScore must be a number');
  }
  if (!Number.isInteger(state.missedDays) || state.missedDays < 0) {
    issues.push(`userState: invalid missedDays ${state.missedDays}`);
  }
  if (!Number.isInteger(state.streakDays) || state.streakDays < 0) {
    issues.push(`userState: invalid streakDays ${state.streakDays}`);
  }
  if (state.lastSessionAt != null && Number.isNaN(Date.parse(state.lastSessionAt))) {
    issues.push(`userState: invalid lastSessionAt '${state.lastSessionAt}'`);
  }
  if (!Number.isInteger(state.highConfidenceClearCount) || state.highConfidenceClearCount < 0) {
    issues.push(`userState: invalid highConfidenceClearCount ${state.highConfidenceClearCount}`);
  }

  if (typeof state.relationshipLevels !== 'object' || state.relationshipLevels == null) {
    issues.push('userState: relationshipLevels must be an object');
  } else {
    for (const charId of JLEARN_RELATIONSHIP_CHARACTER_IDS) {
      const stage = state.relationshipLevels[charId];
      if (stage == null || !VALID_RELATIONSHIP_STAGES.has(stage)) {
        issues.push(`userState: invalid relationshipLevel for '${charId}': ${stage}`);
      }
    }
  }

  if (typeof state.relationshipMissionCounts !== 'object' || state.relationshipMissionCounts == null) {
    issues.push('userState: relationshipMissionCounts must be an object');
  } else {
    for (const charId of JLEARN_RELATIONSHIP_CHARACTER_IDS) {
      const count = state.relationshipMissionCounts[charId];
      if (!Number.isInteger(count) || count < 0) {
        issues.push(`userState: invalid relationshipMissionCount for '${charId}': ${count}`);
      }
    }
  }

  for (const flag of state.recoveryFlags ?? []) {
    if (!flag.targetId) issues.push('userState: recoveryFlag missing targetId');
    if (!Number.isInteger(flag.missionsRemaining) || flag.missionsRemaining < 0) {
      issues.push(`userState: recoveryFlag(${flag.targetId}): invalid missionsRemaining`);
    }
    if (!flag.createdAt || Number.isNaN(Date.parse(flag.createdAt))) {
      issues.push(`userState: recoveryFlag(${flag.targetId}): invalid createdAt`);
    }
  }

  return issues;
}
