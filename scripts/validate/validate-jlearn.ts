/**
 * validate:jlearn — CLI runner for curriculum & storage validation (S25a + S25b).
 * Usage: npm run validate:jlearn
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { jlearnTrack } from '../../Frontend/src/data/jlearn/jlearnContent';
import {
  validateCurriculumData,
  validateProgress,
  validateVocabProgress,
  validateUserState,
} from '../../Frontend/src/data/jlearn/jlearnValidation';
import { defaultUserState } from '../../Frontend/src/features/jlearn/debug/debugStore';
import type { MissionProgress, VocabProgressMap } from '../../Frontend/src/data/jlearn/jlearnStorage';
import type { JLearnUserState } from '../../Frontend/src/features/jlearn/debug/debugStore';

const PASS = '\x1b[32m✓\x1b[0m';
const FAIL = '\x1b[31m✗\x1b[0m';

function report(label: string, issues: string[]): boolean {
  if (issues.length === 0) {
    console.log(`${PASS} ${label}`);
    return true;
  }
  console.log(`${FAIL} ${label} — ${issues.length} issue(s)`);
  for (const issue of issues) console.log(`    • ${issue}`);
  return false;
}

let allPassed = true;

// 1. Curriculum structure
const curriculumIssues = validateCurriculumData(jlearnTrack);
if (!report(`Curriculum data (${jlearnTrack.levels.length} levels)`, curriculumIssues)) {
  allPassed = false;
}

// 2. Default progress shape
const emptyProgress: MissionProgress = {
  completedStepIds: [],
  completedUnitIds: [],
  completedLevelIds: [],
  earnedBadgeIds: [],
  lastUpdatedAt: new Date().toISOString(),
};
const progressIssues = validateProgress(emptyProgress, jlearnTrack.levels.map((l) => l.id));
if (!report('Default MissionProgress', progressIssues)) allPassed = false;

// 3. Empty vocab map
const vocabIssues = validateVocabProgress({});
if (!report('Empty VocabProgressMap', vocabIssues)) allPassed = false;

// 4. Default user state
const userStateIssues = validateUserState(defaultUserState);
if (!report('Default JLearnUserState', userStateIssues)) allPassed = false;

// 5–7. Full-progression fixture (S25b)
const fixturePath = resolve('scripts/fixtures/jlearn-full-progression.json');
try {
  const raw = JSON.parse(readFileSync(fixturePath, 'utf-8'));
  const knownLevelIds = jlearnTrack.levels.map((l) => l.id);

  const fixtureProgress = raw['kototsuna.jlearn.progress'] as MissionProgress;
  const fixtureProgressIssues = validateProgress(fixtureProgress, knownLevelIds);
  if (!report('Full-progression fixture — MissionProgress', fixtureProgressIssues)) allPassed = false;

  const fixtureVocab = raw['kototsuna.jlearn.vocab-progress'] as VocabProgressMap;
  const fixtureVocabIssues = validateVocabProgress(fixtureVocab);
  if (!report('Full-progression fixture — VocabProgressMap', fixtureVocabIssues)) allPassed = false;

  const fixtureUserState = raw['kototsuna.jlearn.user-state'] as JLearnUserState;
  const fixtureUserStateIssues = validateUserState(fixtureUserState);
  if (!report('Full-progression fixture — JLearnUserState', fixtureUserStateIssues)) allPassed = false;
} catch (e) {
  console.log(`${FAIL} Full-progression fixture — could not load: ${(e as Error).message}`);
  allPassed = false;
}

// Summary
console.log('');
if (allPassed) {
  console.log('\x1b[32mAll checks passed.\x1b[0m');
  process.exit(0);
} else {
  console.log('\x1b[31mSome checks failed — see issues above.\x1b[0m');
  process.exit(1);
}
