---

description: "Task list for implementing the Support for Overdue Todo Items feature"
---

# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todos/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md, contracts/ (empty — no API changes)

**Tests**: Explicitly requested in spec.md ("This feature must include automated tests covering the overdue determination logic and its display"). Test tasks are included and must be written before/alongside implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

This is an existing npm-workspaces monorepo. This feature is scoped entirely to `packages/frontend/src/`; `packages/backend` is unchanged.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the new utilities directory used by this feature

- [X] T001 Create `packages/frontend/src/utils/` directory with a colocated `__tests__/` subdirectory (if not already present) to hold the new `isOverdue` helper and its tests

**Checkpoint**: Setup complete — foundational work can begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core shared logic that both user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Implement pure `isOverdue(todo)` function in `packages/frontend/src/utils/todoStatus.js` per the derivation rule in [data-model.md](./data-model.md): returns `true` only when `todo.dueDate` is present, `todo.completed` is falsy, and the date-only value of `dueDate` is strictly earlier than the date-only value of "today"; returns `false` for missing due date, completed todos, due date today or in the future, and malformed/unparseable dates (fail-safe, no throw)
- [X] T003 [P] Add a `dateOnly(date)` helper as a private, unexported function in `packages/frontend/src/utils/todoStatus.js` (not part of the module's public API) that normalizes a `Date`/date-string to year/month/day for comparison, ignoring time-of-day and time-zone time components, and returns `null` for unparseable input, per FR-006

**Checkpoint**: Foundation ready — `isOverdue` utility is implemented and available for both user stories

---

## Phase 3: User Story 1 - Visually Identify Overdue Todos (Priority: P1) 🎯 MVP

**Goal**: Incomplete todos whose due date has passed are visually distinguished with a danger-colored card accent/border AND an explicit "Overdue" badge, while complete todos, todos due today/future, and todos without a due date are not.

**Independent Test**: Create a todo with a past due date (incomplete) and verify it renders with overdue styling/badge; create a todo with a future due date and verify it does not.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T004 [P] [US1] Unit tests for `isOverdue` in `packages/frontend/src/utils/__tests__/todoStatus.test.js` covering: past due date + incomplete → `true`; past due date + completed → `false`; due date today → `false`; due date in future → `false`; no due date → `false`; malformed/unparseable due date → `false` (no throw)
- [X] T005 [P] [US1] Component tests in `packages/frontend/src/components/__tests__/TodoCard.test.js` asserting the "Overdue" badge text and danger-accent CSS class (e.g. `todo-card--overdue`) are present when `todo` is incomplete with a past `dueDate`, and absent when `todo.completed` is truthy, `dueDate` is today/future, or `dueDate` is unset

### Implementation for User Story 1

- [X] T006 [US1] Import `isOverdue` from `../utils/todoStatus` in `packages/frontend/src/components/TodoCard.js` and compute an `overdue` boolean from the `todo` prop (depends on T002)
- [X] T007 [US1] Update the root `<div>` className in `packages/frontend/src/components/TodoCard.js` to conditionally include a danger-accent class (e.g. `todo-card--overdue`) when `overdue` is `true`, alongside the existing `completed` class logic
- [X] T008 [US1] Render an "Overdue" badge/tag element inside the todo content area in `packages/frontend/src/components/TodoCard.js` when `overdue` is `true` (e.g. `<span className="todo-badge todo-badge--overdue">Overdue</span>`), placed near the title/due date
- [X] T009 [US1] Add `.todo-card--overdue` and `.todo-badge--overdue` styles in `packages/frontend/src/styles/theme.css`, reusing the existing danger color tokens (light and dark mode) per [ui-guidelines.md](../../docs/ui-guidelines.md)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently — incomplete, past-due todos are visually marked overdue

---

## Phase 4: User Story 2 - Overdue Status Updates Automatically (Priority: P2)

**Goal**: A todo's overdue status is computed from the current date at render time (not persisted), so it automatically becomes overdue the day after its due date passes, with no manual action required.

**Independent Test**: Simulate/advance the system date past a todo's due date and confirm the todo becomes marked overdue on next render, independent of User Story 1's styling details.

### Tests for User Story 2 ⚠️

- [X] T010 [US2] Unit test in `packages/frontend/src/utils/__tests__/todoStatus.test.js` that mocks/advances the current date (e.g. via `jest.useFakeTimers().setSystemTime(...)`) to simulate "today" moving one day past a todo's `dueDate`, asserting `isOverdue(todo)` transitions from `false` to `true` without any change to the todo object itself (confirms dynamic, non-persisted computation per FR-007)

### Implementation for User Story 2

- [X] T011 [US2] Verify `isOverdue` in `packages/frontend/src/utils/todoStatus.js` always derives "today" from a fresh `new Date()` call at invocation time (no caching/memoization of "today" across renders), adjusting implementation if needed so status recomputes correctly on every call (depends on T002)

**Checkpoint**: Both User Story 1 and User Story 2 work independently — overdue status is both visually correct and dynamically accurate across date changes

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across both user stories

- [X] T012 [P] Run full frontend test suite with `npm test --workspace=packages/frontend` and confirm all new and existing tests pass
- [ ] T013 Manually walk through [quickstart.md](./quickstart.md) steps 1–8 to validate overdue styling, badge, completion toggling, and page-refresh recomputation end-to-end (requires manual browser verification — not run in this session; automated test coverage for the same scenarios exists in T004/T005/T010)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS both user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion; independently testable but conceptually builds on the same `isOverdue` utility validated in US1
- **Polish (Phase 5)**: Depends on both user stories being complete

### Within Each User Story

- Tests MUST be written and FAIL before implementation (T004/T005 before T006–T009; T010 before T011)
- Utility logic (Foundational) before component integration
- Story complete before moving to next priority

### Parallel Opportunities

- T003 can be implemented alongside T002 as a separate, unexported private function within the same file (`todoStatus.js`); since both land in one file, treat as a single logical edit rather than two independent file changes
- T004 and T005 can run in parallel (different test files)
- T006–T009 are sequential (same file, `TodoCard.js`, then `theme.css`)
- T012 can run in parallel with T013 (automated vs. manual validation)

---

## Parallel Example: User Story 1

```bash
# Launch both test files for User Story 1 together:
Task: "Unit tests for isOverdue in packages/frontend/src/utils/__tests__/todoStatus.test.js"
Task: "Component tests for overdue badge/accent in packages/frontend/src/components/__tests__/TodoCard.test.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (`isOverdue` utility — CRITICAL, blocks both stories)
3. Complete Phase 3: User Story 1 (visual overdue indicator)
4. **STOP and VALIDATE**: Run T004/T005 tests and manually confirm overdue badge/accent appear correctly
5. Deploy/demo if ready — this alone delivers the full visible feature value

### Incremental Delivery

1. Setup + Foundational → `isOverdue` utility ready and unit-tested
2. User Story 1 → Visual overdue indicator in `TodoCard` → Test independently → Deploy/Demo (MVP!)
3. User Story 2 → Confirm dynamic date-based recomputation → Test independently → Deploy/Demo
4. Polish → Full suite run + quickstart validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No backend changes required — `dueDate` and `completed` are already exposed by the existing API
- Verify tests fail before implementing (T004/T005/T010 first)
- Commit after each task or logical group

---

## Phase 6: Convergence

- [X] T014 Fix WCAG AA contrast failure (CRITICAL) per Constitution: Design & Workflow Standards (contradicts): in `packages/frontend/src/styles/theme.css`, the dark-mode `.todo-badge--overdue` renders white text on `--danger-color: #ef5350`, measuring ≈3.49:1 contrast — below the 4.5:1 AA threshold required for normal-size (12px) text. Adjust the dark-mode badge text/background pairing (e.g. darken the badge background, or use a darker text color) so contrast meets or exceeds 4.5:1 while still reading as the "danger" semantic color, and add/update a test or manual check confirming the fix

---

## Phase 7: Convergence

- [X] T015 Fix CSS cascade bug preventing the overdue card border/accent from rendering (CRITICAL) per FR-005 (contradicts): `packages/frontend/src/App.css` imports `./styles/theme.css` at the top of the file, hoisting `.todo-card--overdue`'s `border-color`/`border-left` declarations ahead of the base `.todo-card` rule (`App.css` ~line 314), which sets `border: 1px solid var(--border-color)` using the shorthand property. Because both selectors have equal specificity (0,1,0) and `.todo-card` is declared later in source order, the shorthand `border` resets all sides and silently overrides `.todo-card--overdue`'s border color/accent in both light and dark mode, so only the "Overdue" badge is ever visually shown — never the danger-colored card border required by FR-005. Raise `.todo-card--overdue`'s specificity (e.g. compound selector `.todo-card.todo-card--overdue` in `packages/frontend/src/styles/theme.css`) so it reliably overrides the base border regardless of CSS source/import order, and add a regression-safe check (e.g. a snapshot or computed-style assertion, since `toHaveClass` alone does not catch cascade issues) confirming the overdue border color is actually applied
