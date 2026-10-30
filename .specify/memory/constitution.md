<!--
Sync Impact Report
Version change: none (template) → 1.0.0
Rationale for bump: Initial ratification of the project constitution (MAJOR/initial version; no prior version existed).
Modified principles: N/A (initial creation, no prior titled principles to rename)
Added sections:
  - I. Code Clarity & Consistency
  - II. Single Responsibility & Simplicity (KISS/SOLID)
  - III. DRY Through Shared Abstractions
  - IV. Test-First Quality Gate (NON-NEGOTIABLE)
  - V. Graceful Error Handling & User Feedback
  - Product Scope Constraints
  - Design & Workflow Standards
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ⚠ pending manual review (Constitution Check section should reference these 5 principles)
  - .specify/templates/spec-template.md ⚠ pending manual review (no direct constitution reference found)
  - .specify/templates/tasks-template.md ⚠ pending manual review (no direct constitution reference found)
  - .specify/templates/checklist-template.md ⚠ pending manual review (no direct constitution reference found)
Deferred TODOs: none
-->

# Todo App Constitution

## Core Principles

### I. Code Clarity & Consistency
All code MUST use 2-space indentation, LF line endings, and have trailing
whitespace removed. Naming MUST follow project conventions: `camelCase` for
variables/functions, `UPPER_SNAKE_CASE` for constants, `PascalCase` for React
components and classes (file names matching component names). Imports MUST be
grouped and ordered as: external libraries, internal modules, styles, each
group separated by a blank line. Lines SHOULD stay under 100 characters.
Rationale: Consistent formatting and naming reduce cognitive load during
review and prevent avoidable merge conflicts and linter noise.

### II. Single Responsibility & Simplicity (KISS/SOLID)
Every module, component, or function MUST have one well-defined
responsibility (e.g., a `TodoCard` only displays a todo; it does not fetch or
delete it). Solutions MUST favor the simplest implementation that satisfies
requirements; premature optimization and speculative abstraction are
disallowed. Components MUST depend on minimal, focused prop interfaces
(Interface Segregation) and extend behavior via props/composition rather than
modification (Open/Closed). Rationale: Small, focused units are easier to
test, reuse, and reason about, and keep the codebase approachable for all
contributors.

### III. DRY Through Shared Abstractions
Duplicated logic (formatting, validation, API calls, UI patterns) MUST be
extracted into shared utilities, services, or reusable components instead of
being copy-pasted. Before adding new code, contributors MUST check
`utils/`, `services/`, and `components/` for existing solutions. Rationale:
Centralizing shared logic reduces bugs from divergent copies and makes
future changes consistent across the app.

### IV. Test-First Quality Gate (NON-NEGOTIABLE)
New functionality and bug fixes MUST include automated tests (unit and/or
integration) that verify behavior, not implementation details. Tests MUST
live in colocated `__tests__/` directories, follow Arrange-Act-Assert, and
use descriptive names stating the expected behavior. Target coverage is 80%+
across packages, with critical user workflows (create, view, update,
complete, delete todos) requiring full coverage. All tests MUST pass, and no
linting errors/warnings MUST remain, before a pull request is opened.
Rationale: Enforced testing and linting gates catch regressions early and
keep the single-user todo app reliable as it evolves.

### V. Graceful Error Handling & User Feedback
Operations that can fail (API calls, persistence, data parsing) MUST be
wrapped in explicit error handling that logs actionable diagnostics and
surfaces clear, user-facing feedback (e.g., inline error messages). Silent
failures are disallowed. Destructive actions (e.g., delete) MUST require
explicit user confirmation before taking effect. Rationale: A single-user
productivity tool must never lose data silently or leave users guessing
about failures.

## Product Scope Constraints

The application is a single-user todo app with: title (required, max 255
chars) and optional due date per todo; create, view, toggle-complete,
edit, and delete operations; backend persistence via the Express.js API so
all changes survive a page refresh. Features explicitly out of scope
(authentication, multi-user support, priorities/tags, recurring todos,
reminders, undo/redo, bulk operations, advanced search/filtering, and
mobile-specific optimization) MUST NOT be added without a documented
amendment to the functional requirements and this constitution. The stack is
fixed: React frontend, Express.js backend, organized as npm workspaces under
`packages/frontend` and `packages/backend`; introducing new frameworks or a
database schema beyond basic todo storage requires explicit justification
and approval.

## Design & Workflow Standards

UI changes MUST conform to the Material-Design-inspired, Halloween-themed
design system in `docs/ui-guidelines.md` (color palette, spacing grid,
typography scale, component patterns) for both light and dark modes, and
MUST meet WCAG AA contrast and keyboard-accessibility requirements. Git
history MUST consist of atomic commits with descriptive messages explaining
the "why"; feature work happens on feature branches and merges via pull
request review. Before opening a PR, contributors MUST confirm: naming
conventions followed, imports organized, no lint errors/warnings, code is
DRY and single-responsibility, error handling present, tests added/updated
and passing, and no stray `console.log` statements remain.

## Governance

This constitution supersedes ad-hoc conventions and prior informal practices
documented in `docs/coding-guidelines.md`, `docs/functional-requirements.md`,
`docs/ui-guidelines.md`, and `docs/testing-guidelines.md`; those documents
remain the detailed reference, and this document is the authoritative
summary of non-negotiable principles. Any amendment (adding/removing a
principle, materially changing scope, or altering governance) MUST update
this file, bump the version per semantic versioning (MAJOR for incompatible
governance/principle removals or redefinitions, MINOR for new
principles/sections or materially expanded guidance, PATCH for clarifications
and wording fixes), and record the rationale in the commit message. All pull
requests and code reviews MUST verify compliance with these principles;
unjustified complexity or scope creep MUST be flagged and resolved before
merge. Use the `docs/` guideline files for detailed, day-to-day development
guidance when this constitution does not cover a specific case.

**Version**: 1.0.0 | **Ratified**: 2026-10-30 | **Last Amended**: 2026-10-30
