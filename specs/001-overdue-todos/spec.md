# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todos`

**Created**: 2026-10-30

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items - As a todo application user, I want to easily identify and distinguish overdue tasks in my todo list, so that I can prioritize my work and quickly see which tasks are past their due date. Users need a clear, visual way to identify which todos have not been completed by their due date. This feature must include automated tests covering the overdue determination logic and its display, following the existing Jest patterns in the repository."

## Clarifications

### Session 2026-10-30

- Q: How should overdue todos be visually indicated? → A: Both a danger-colored accent/border on the card AND an explicit "Overdue" text label shown as a tag/badge.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visually Identify Overdue Todos (Priority: P1)

As a user viewing my todo list, I want incomplete todos whose due date has passed to be visually distinguished from other todos, so I can immediately spot what needs my attention without manually comparing dates.

**Why this priority**: This is the core value of the feature — without visual distinction, users gain no benefit. This single capability delivers the entire user story on its own.

**Independent Test**: Can be fully tested by creating a todo with a due date in the past and verifying it is displayed with overdue styling/indicator, while a todo with a future due date is not.

**Acceptance Scenarios**:

1. **Given** a todo with a due date earlier than today and marked incomplete, **When** the todo list is displayed, **Then** the todo is visually marked as overdue (e.g., distinct styling and/or label).
2. **Given** a todo with a due date earlier than today but marked complete, **When** the todo list is displayed, **Then** the todo is NOT marked as overdue.
3. **Given** a todo with a due date of today, **When** the todo list is displayed, **Then** the todo is NOT marked as overdue.
4. **Given** a todo with a due date in the future, **When** the todo list is displayed, **Then** the todo is NOT marked as overdue.
5. **Given** a todo with no due date set, **When** the todo list is displayed, **Then** the todo is NOT marked as overdue.

---

### User Story 2 - Overdue Status Updates Automatically (Priority: P2)

As a user, I want a todo's overdue status to be based on the current date, so that a todo automatically becomes marked overdue the day after its due date passes, without requiring any manual action.

**Why this priority**: Enhances trust in the feature's accuracy over time, but the app is still useful even if a user has to refresh the page to see updated status (standard web app behavior).

**Independent Test**: Can be tested by setting the system/test clock to a date after a todo's due date and confirming the todo becomes marked overdue on next render, independent of any other feature logic.

**Acceptance Scenarios**:

1. **Given** a todo due "today" according to the current date, **When** the next calendar day arrives and the page is reloaded, **Then** the todo is now marked as overdue.

---

### Edge Cases

- What happens when a todo's due date is exactly today? It is treated as not yet overdue (overdue only applies strictly after the due date has passed).
- How does the system handle todos with no due date? They are never considered overdue.
- How does the system handle a completed todo whose due date has passed? It is not shown as overdue, since the overdue indicator only applies to outstanding (incomplete) work.
- How does the system handle time zone differences between client and server? Overdue determination uses the date portion only (day-level granularity) based on the user's local date, avoiding time-of-day/time-zone edge effects.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST determine a todo to be "overdue" when its due date is earlier than the current date AND the todo is not marked complete.
- **FR-002**: System MUST NOT mark a todo as overdue if it has no due date.
- **FR-003**: System MUST NOT mark a todo as overdue if it is marked complete, regardless of due date.
- **FR-004**: System MUST NOT mark a todo as overdue if its due date is today or in the future.
- **FR-005**: The todo list display MUST visually distinguish overdue todos from non-overdue todos using both a danger-colored accent/border on the todo card AND an explicit "Overdue" text label displayed as a tag/badge.
- **FR-006**: The overdue determination MUST be evaluated using date-only comparison (ignoring time-of-day) to avoid inconsistent results within the same calendar day.
- **FR-007**: Overdue status MUST be computed dynamically at display time based on the current date, rather than being stored as a persisted field, so it always reflects the latest date without requiring data migration.

### Key Entities

- **Todo**: Existing entity representing a task; relevant attributes for this feature are `dueDate` (optional date) and `completed` (boolean). This feature adds a derived, non-persisted "overdue" state computed from these two attributes and the current date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can visually identify all overdue todos in their list within 3 seconds of viewing the list, without reading individual due dates.
- **SC-002**: 100% of incomplete todos with a past due date are marked overdue, and 0% of completed todos or todos without a due date are incorrectly marked overdue, as verified by automated tests.
- **SC-003**: Overdue status is accurate on every page load/render without requiring a manual refresh workflow beyond the standard page reload.

## Assumptions

- "Current date" refers to the end user's local date as determined by their device/browser.
- Overdue status is a UI-level/derived concept and does not require changes to the backend data model or API contract beyond what is already exposed (`dueDate`, `completed`).
- Visual distinction will follow the existing design system (colors/typography) already defined in the project's UI guidelines, using the existing "danger" color semantics for overdue indicators.
- No notifications, reminders, or sorting/filtering changes are in scope — this feature is limited to visual identification of overdue status.
