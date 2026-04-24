# JLearn Regression Runbook — S25b

Run this after any significant change to curriculum data, storage schema, task engine, or UI flow.

## How to use

1. Run automated checks first: `npm run validate:jlearn`
2. Start dev server: `npm run dev`
3. Navigate to `/learn/japanese`
4. Execute the scenarios below in order on a **fresh profile** (Debug Panel → Reset All)

If a scenario fails, log it as a bug (do not fix inline during the sweep).

---

## Checkpoint A — MVP-PLAYABLE (S8c)

### A1 · L1 start-to-finish
1. Open `/learn/japanese` — verify L1 card visible and unlocked, all others locked.
2. Enter L1-U1-M1 (Arrival Night). Play through: scenario → vocab → grammar → examples → branching → tasks → dialogue → complete.
3. Verify mission marked done; L1-U1-M2 unlocks immediately.
4. Jump to L1-U3-M8 via Debug Panel → "Jump to step".
5. Complete checkpoint with score < 80% (intentionally wrong) → verify fail screen with missed items + retry CTA.
6. Retry and pass (≥ 80%) → verify **Social Starter** badge in Debug Panel storage dump + L2 card unlocks.

### A2 · Task engine — all 5 types
In any unlocked mission that contains the type:
- **multiple-choice**: pick wrong → explanation shown → retry allowed.
- **fill-in-blank**: type wrong → explanation shown → retry.
- **translation en→jp**: accepted alt answer passes (e.g. `さん` / `san`).
- **sentence-build**: drag/tap tokens into wrong order → rejected; correct order → accepted.
- **context-select**: scenario card renders prominently; grading identical to MC.

### A3 · Dialogue chain
Play L1-U2-M4 or any mission with a dialogue chain:
- Correct answer → next turn advances.
- Wrong answer → turn still advances (dialogues are always forward).
- Final turn → emotional feedback line + successMessage shown.

### A4 · Branching choice
In any mission with a branchingChoice:
- **correct** pick → Continue button appears, dialogue unlocks.
- **partial** pick → reaction shown, Continue available.
- **wrong** pick → reaction shown, Retry available.

### A5 · Persistence across reload
1. Complete L1-U1-M1.
2. Hard reload (Ctrl+Shift+R).
3. Verify: M1 still marked done; M2 still unlocked; Debug Panel shows the step ID in `completedStepIds`.

---

## Checkpoint B — SYSTEMS-STABLE (S15b)

### B1 · SRS warm-up surfaces due items
1. Via Debug Panel, set `lastSeenAt = yesterday` and `masteryLevel = 1` on 3 vocab items.
2. Re-enter the level those items belong to.
3. Verify warm-up screen appears (label "Warm-up") with questions drawn from those 3 items.

### B2 · Adaptive confidence affects warm-up length
1. Force `confidenceLevel = low` via Debug Panel → verify warm-up shows 5 questions.
2. Force `confidenceLevel = high` → verify warm-up shows 0 questions (skipped).

### B3 · Layered emotional feedback tiers
1. Complete L1-U1-M1 with no retries → verify **perfect** tier copy appears.
2. Complete with 1–2 retries → verify **good** tier copy appears.
3. Complete with 3+ retries → verify **struggle** tier copy.

### B4 · Fail-forward recovery
1. In L1-U1-M1 branching, pick the **partial** option.
2. Debug Panel → confirm recovery flag written with `targetId` and `missionsRemaining: 2`.
3. Play L1-U1-M2 → verify injected question at the end for the flagged item.
4. Answer correctly → confirm callback line appears on completion screen + flag cleared.

### B5 · Character evolution dialogue variants
1. Force `relationshipLevels.yuki = 2` via Debug Panel.
2. Play any L2 mission with a Yuki dialogue.
3. Verify stage-2 variant lines appear (casual register, e.g. どこから来たの？).

---

## Checkpoint C — UI Phase B spot-checks (S16–S17)

### C1 · Design tokens applied
- Open `/learn/japanese` — verify no raw hex colors or px font sizes in element inspector for mission cards.
- Phase transitions between scenario/vocab/grammar/examples/tasks are 150ms fade (check DevTools animation panel).

### C2 · Story hooks on level completion
1. Complete L1 (or use Debug: mark all L1 steps done).
2. Verify story hook teaser and Japanese line appear on the L1 completion/badge screen.
3. Verify locked L2 card shows L1's hook teaser as subtitle on the world map.

---

## Checkpoint D — User-based UI spot-checks (S18–S20)

### D1 · Confidence UI variants
1. Force `confidenceLevel = low` → verify vocab panel is sticky-visible in mission, hint button appears after first miss.
2. Force `confidenceLevel = high` → verify vocab panel collapsed, no hint button, tighter completion screen.

### D2 · Re-entry splash
1. Force `missedDays = 5` via Debug Panel.
2. Reload app → verify welcome-back card shown.
3. Tap "Refresh vocab" → 10-question review session runs.

### D3 · Streak indicator
- TopNav shows flame/streak chip after completing a mission with `streakDays ≥ 1`.

---

## Checkpoint E — Challenge missions spot-checks (S21)

### E1 · Challenge locked before checkpoint
1. Navigate to `/learn/japanese/challenge/JL1` without completing L1 checkpoint.
2. Verify "Challenge locked" screen.

### E2 · Challenge strict scoring
1. Complete L1 checkpoint (pass). Navigate to challenge.
2. Verify no hint button; wrong answer locks the question (no retry).
3. Pass at ≥ 90% (14/15) → verify challenge badge in storage + `relationshipLevels` bump for primary character.

---

## Checkpoint F — Scale levels (S23–S24, L4–L14)

For each level L4 through L14, verify:
1. **Data loads** — `npm run validate:jlearn` clean (automated).
2. **One mission plays** — enter U1-M1, complete without errors.
3. **Checkpoint mission exists** — U2's last mission has `isCheckpoint: true`; minPassScore visible in Debug Panel data.
4. **Challenge mission exists** — `/learn/japanese/challenge/JL{n}` shows the challenge (after debug-forcing checkpoint passed).

Spot-check levels: **JL4**, **JL9**, **JL14** (first, mid, last).

---

## Automated validation (run last)

```
npm run validate:jlearn
```

Expected output:
```
✓ Curriculum data (14 levels)
✓ Default MissionProgress
✓ Empty VocabProgressMap
✓ Default JLearnUserState
✓ Full-progression fixture — MissionProgress
✓ Full-progression fixture — VocabProgressMap
✓ Full-progression fixture — JLearnUserState

All checks passed.
```

---

## Known acceptable gaps (do not log as bugs)

- Speaking mode (`pronunciation-repeat`, `dialogue-speak`, `shadow-read`) renders placeholder only — by design (S22).
- L14 `estimatedMinutes` shows 2 min on UI; actual review sessions run longer — UI label is a cap, not a timer.
- SRS warm-up for L4–L14 requires manual fixture setup (no pre-seeded vocab in fresh profile).
