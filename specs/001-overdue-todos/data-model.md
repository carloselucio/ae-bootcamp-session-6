# Phase 1 Data Model: Support for Overdue Todo Items

## Entities

### Todo (existing — no schema change)

| Field       | Type              | Required | Notes                                   |
|-------------|-------------------|----------|------------------------------------------|
| id          | number            | yes      | Existing primary key                     |
| title       | string (≤255)     | yes      | Existing                                 |
| dueDate     | string (ISO date) | no       | Existing, nullable                       |
| completed   | boolean (0/1)     | yes      | Existing                                 |
| createdAt   | string (ISO date) | yes      | Existing                                 |

No new persisted fields are introduced. This feature does not modify the
database schema, the backend `TodoService`, or the REST API contract.

### Overdue (derived, non-persisted, UI-only)

A boolean computed at render time from an existing `Todo`:

```text
isOverdue(todo) =
  todo.dueDate is present
  AND todo.completed is falsy
  AND dateOnly(todo.dueDate) < dateOnly(today)
```

Where `dateOnly(x)` compares only the calendar date (year/month/day),
ignoring time-of-day and time-zone offsets, per FR-006.

**Validation / guard rules**:
- Missing or empty `dueDate` → `false` (never overdue). (FR-002)
- `completed` truthy (`1`/`true`) → `false` regardless of `dueDate`. (FR-003)
- `dueDate` equal to today → `false`. (FR-004, Edge Cases)
- `dueDate` in the future → `false`. (FR-004)
- Malformed/unparseable `dueDate` → `false` (fail safe, no throw), consistent
  with Constitution Principle V (graceful error handling).

**State transitions**: None — this is a pure, stateless derivation recomputed
on every render; it has no lifecycle of its own and is not stored.

## Relationships

No new relationships. The derived overdue flag belongs conceptually to the
existing `Todo` entity but is never persisted or transmitted over the API.
