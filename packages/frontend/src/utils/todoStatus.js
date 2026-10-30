/**
 * Normalizes a Date/date-string to a date-only value (year/month/day),
 * ignoring time-of-day and time-zone time components.
 * Returns null for unparseable input (fail-safe, no throw).
 */
function dateOnly(value) {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return null;
  }
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Determines whether a todo is overdue: it has a due date, is not
 * completed, and its due date (date-only) is strictly earlier than
 * today's date (date-only). Computed fresh on every call so status
 * always reflects the current date without persisting any state.
 * @param {{ dueDate?: string, completed?: boolean|number }} todo
 * @returns {boolean}
 */
export function isOverdue(todo) {
  if (!todo || !todo.dueDate || todo.completed) {
    return false;
  }

  const due = dateOnly(todo.dueDate);
  const today = dateOnly(new Date());

  if (!due || !today) {
    return false;
  }

  return due < today;
}
