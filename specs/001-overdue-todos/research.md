# Phase 0 Research: Support for Overdue Todo Items

## Decisions

### Decision: Compute overdue status client-side, derived, non-persisted
**Rationale**: FR-007 requires overdue status to always reflect the current date
without data migration. The frontend already receives `dueDate` and `completed`
on every todo; a pure function at render time is sufficient and avoids any
backend/API/schema changes.
**Alternatives considered**:
- Persist an `overdue` boolean column updated by a server job — rejected: adds
  scheduling complexity, storage, and staleness risk; explicitly out of scope
  per FR-007 and the Assumptions section of the spec.
- Compute on the backend per-request and add `overdue` to API responses —
  rejected: unnecessary coupling/complexity for a value trivially computed from
  data the client already has; spec frames this as a UI-level/derived concept.

### Decision: Date-only comparison using local date components (no Date/time arithmetic with time-of-day)
**Rationale**: FR-006 and the Edge Cases section require day-level granularity,
ignoring time zone/time-of-day effects. Comparing `YYYY-MM-DD` strings
lexicographically (or constructing local-midnight `Date` objects from the date
parts) avoids off-by-one errors caused by `Date` parsing with implicit UTC
offsets.
**Alternatives considered**:
- `new Date(dueDate) < new Date()` — rejected: mixes date-only values with
  full timestamps and is vulnerable to time-zone shifting a date to the
  previous/next day.
- Using a date library (e.g., `date-fns`, `moment`) — rejected: todo app has no
  existing date library dependency; adding one is unnecessary complexity for a
  single string comparison (KISS, no new dependencies).

### Decision: Extract `isOverdue(todo)` into `packages/frontend/src/utils/todoStatus.js`
**Rationale**: Constitution Principle III (DRY) and II (single responsibility)
favor a small, pure, independently testable utility over inlining date logic in
`TodoCard`. No `utils/` directory exists yet on the frontend, so one is created
following the structure already documented in `docs/coding-guidelines.md`
("Frontend Structure" section lists `utils/`).
**Alternatives considered**: Inlining the check directly in `TodoCard.js` —
rejected: harder to unit test in isolation and violates single-responsibility
guidance from the constitution.

### Decision: Visual treatment = danger-colored card border/accent + "Overdue" badge
**Rationale**: Directly dictated by the spec Clarifications session and FR-005;
reuses existing `--danger` design tokens already defined in
`docs/ui-guidelines.md` / `styles/theme.css` rather than introducing new colors.
**Alternatives considered**: Icon-only indicator, or color-only indicator —
rejected by the clarification answer in the spec ("Both a danger-colored
accent/border on the card AND an explicit 'Overdue' text label").

## Open Questions

None — all spec ambiguities were resolved in the Clarifications session
(2026-10-30) prior to planning.
