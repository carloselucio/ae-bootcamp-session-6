import { isOverdue } from '../todoStatus';

describe('isOverdue', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-10-30T12:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns true for an incomplete todo with a past due date', () => {
    const todo = { dueDate: '2026-10-29', completed: 0 };
    expect(isOverdue(todo)).toBe(true);
  });

  it('returns false for a completed todo with a past due date', () => {
    const todo = { dueDate: '2026-10-29', completed: 1 };
    expect(isOverdue(todo)).toBe(false);
  });

  it('returns false when due date is today', () => {
    const todo = { dueDate: '2026-10-30', completed: 0 };
    expect(isOverdue(todo)).toBe(false);
  });

  it('returns false when due date is in the future', () => {
    const todo = { dueDate: '2026-11-01', completed: 0 };
    expect(isOverdue(todo)).toBe(false);
  });

  it('returns false when there is no due date', () => {
    const todo = { completed: 0 };
    expect(isOverdue(todo)).toBe(false);
  });

  it('returns false for a malformed/unparseable due date without throwing', () => {
    const todo = { dueDate: 'not-a-date', completed: 0 };
    expect(() => isOverdue(todo)).not.toThrow();
    expect(isOverdue(todo)).toBe(false);
  });

  it('transitions from false to true when the system date advances past the due date', () => {
    const todo = { dueDate: '2026-10-30', completed: 0 };
    expect(isOverdue(todo)).toBe(false);

    jest.setSystemTime(new Date('2026-10-31T12:00:00'));

    expect(isOverdue(todo)).toBe(true);
  });
});
