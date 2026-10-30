const fs = require('fs');
const path = require('path');

describe('theme.css overdue styles', () => {
  const themeCss = fs.readFileSync(
    path.join(__dirname, '..', 'theme.css'),
    'utf8'
  );
  const appCss = fs.readFileSync(
    path.join(__dirname, '..', '..', 'App.css'),
    'utf8'
  );

  it('defines .todo-card--overdue as a compound selector so it reliably overrides the base .todo-card border', () => {
    // Regression test for a cascade bug: theme.css is @import-ed at the top of
    // App.css, which hoists its rules above App.css's own declarations. The
    // base `.todo-card` rule sets `border` via the shorthand property (which
    // resets all sides). If `.todo-card--overdue` were only a single class
    // selector, it would have equal specificity to `.todo-card` and lose to
    // it due to source order, silently hiding the danger-colored card
    // accent required by FR-005. Using the compound selector
    // `.todo-card.todo-card--overdue` raises specificity so it always wins.
    expect(themeCss).toMatch(/\.todo-card\.todo-card--overdue\s*{/);
  });

  it('confirms the base .todo-card rule still uses the border shorthand (guards the premise of the regression test above)', () => {
    const todoCardRuleMatch = appCss.match(/\.todo-card\s*{[^}]*}/);
    expect(todoCardRuleMatch).not.toBeNull();
    expect(todoCardRuleMatch[0]).toMatch(/border:\s*1px solid var\(--border-color\)/);
  });
});
