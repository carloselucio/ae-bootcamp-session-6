# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-10-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

## Summary

Add a UI-only, derived "overdue" indicator to the existing todo list: an incomplete
todo whose `dueDate` is strictly earlier than today's local date is shown with a
danger-colored card accent/border and an explicit "Overdue" badge. The determination
is a pure, date-only comparison computed at render time (never persisted), so no
backend or API changes are required. The logic will be extracted into a small,
testable utility function and consumed by `TodoCard`, with unit tests for the
utility and component-level tests for the visual indicator, following existing
Jest/RTL patterns in `packages/frontend`.

## Technical Context

**Language/Version**: JavaScript (Node.js ≥16), React 18 (existing `packages/frontend` setup)

**Primary Dependencies**: React, `@testing-library/react`, Jest (already present in
`packages/frontend/package.json`); no new dependencies required

**Storage**: N/A — overdue status is derived at display time from existing `dueDate`
and `completed` fields already returned by the backend API; no schema/API changes

**Testing**: Jest + React Testing Library, colocated in `__tests__/` directories,
matching conventions in `docs/testing-guidelines.md`

**Target Platform**: Web browser (existing React SPA), desktop-focused per UI guidelines

**Project Type**: Web application (existing `packages/frontend` + `packages/backend`
npm workspaces monorepo) — this feature touches `packages/frontend` only

**Performance Goals**: Negligible — O(1) date comparison per todo card render; no
measurable impact on list render time

**Constraints**: Must use date-only comparison (ignore time-of-day/time-zone time
component); must not persist derived state; must reuse existing danger color
tokens from `docs/ui-guidelines.md` / `styles/theme.css`

**Scale/Scope**: Single component (`TodoCard`) + one new utility function + associated
tests; no change to `TodoList`, `TodoForm`, services, or backend

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Code Clarity & Consistency**: New utility function will use `camelCase`
  naming (e.g., `isOverdue`), 2-space indentation, and follow existing import
  ordering conventions. PASS.
- **II. Single Responsibility & Simplicity (KISS/SOLID)**: Overdue determination
  is extracted into a single pure function rather than inlined in `TodoCard`,
  keeping `TodoCard` focused on rendering. No speculative abstraction (e.g., no
  generic "status" framework) is introduced — only what FR-001–FR-007 require.
  PASS.
- **III. DRY Through Shared Abstractions**: A new `packages/frontend/src/utils/`
  directory will hold the shared `isOverdue` helper so it is reusable and unit
  testable independent of `TodoCard`, avoiding duplicated date logic if reused
  elsewhere later. PASS.
- **IV. Test-First Quality Gate (NON-NEGOTIABLE)**: Unit tests for the `isOverdue`
  utility (edge cases: no due date, completed, due today, due in future, due in
  past) and `TodoCard` tests for the visual badge/accent will be added in
  colocated `__tests__/` directories before/alongside implementation. PASS.
- **V. Graceful Error Handling & User Feedback**: Date parsing will guard against
  invalid/missing `dueDate` values (return `false` rather than throwing), so a
  malformed date never crashes the list render. PASS.
- **Product Scope Constraints**: No new frameworks, no backend/schema changes,
  no out-of-scope features (filtering/sorting/notifications) introduced. PASS.
- **Design & Workflow Standards**: Visual treatment reuses existing danger color
  semantics and spacing/typography scale from `docs/ui-guidelines.md`; no new
  design tokens introduced. PASS.

No violations — Complexity Tracking table is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command) — empty, no API changes
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/frontend/
├── src/
│   ├── components/
│   │   ├── TodoCard.js                  # MODIFIED: render overdue badge/accent
│   │   └── __tests__/
│   │       └── TodoCard.test.js         # MODIFIED: add overdue display tests
│   ├── utils/                           # NEW directory
│   │   ├── todoStatus.js                # NEW: isOverdue(todo) pure function
│   │   └── __tests__/
│   │       └── todoStatus.test.js       # NEW: unit tests for isOverdue
│   └── styles/
│       └── theme.css                    # MODIFIED: add .todo-card--overdue / badge styles (reuse danger tokens)

packages/backend/                        # UNCHANGED — no API or schema changes
```

**Structure Decision**: Existing npm-workspaces monorepo (Option 2: web application,
frontend + backend already present). This feature is additive and scoped entirely
to `packages/frontend`; `packages/backend` requires no changes since `dueDate` and
`completed` are already exposed by the API.

## Complexity Tracking

*No constitution violations — table intentionally omitted.*
