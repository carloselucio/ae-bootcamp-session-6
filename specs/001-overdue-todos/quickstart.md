# Quickstart: Support for Overdue Todo Items

## Goal

Verify that incomplete todos with a past due date are visually marked overdue
(danger-colored card accent + "Overdue" badge), while completed todos, todos
due today/in the future, and todos without a due date are not.

## Steps

1. Install dependencies and start the app from the repo root:
   ```bash
   npm install
   npm run start
   ```
2. Open the frontend in the browser (default dev server, e.g. http://localhost:3000).
3. Create a todo with a due date set to yesterday (or any past date) and leave
   it incomplete. Confirm it renders with:
   - A danger-colored border/accent on the card.
   - An "Overdue" badge/tag.
4. Mark that same todo complete. Confirm the overdue styling/badge disappears.
5. Create a todo due today. Confirm it is NOT marked overdue.
6. Create a todo due tomorrow (future). Confirm it is NOT marked overdue.
7. Create a todo with no due date. Confirm it is NOT marked overdue.
8. Refresh the page after all todos are created. Confirm overdue status is
   recomputed correctly on reload (no stale persisted state).

## Automated Verification

Run frontend tests:
```bash
npm test --workspace=packages/frontend
```

Expected new/updated test coverage:
- `packages/frontend/src/utils/__tests__/todoStatus.test.js` — unit tests for
  `isOverdue` covering: past date + incomplete (true), past date + completed
  (false), today (false), future (false), no due date (false), malformed date
  (false).
- `packages/frontend/src/components/__tests__/TodoCard.test.js` — tests that
  the "Overdue" badge and danger styling class are present/absent as expected
  based on the `todo` prop passed in.
