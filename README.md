# accessibility-devkit

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2_AA-blue.svg)](https://www.w3.org/TR/WCAG22/)

Not another overlay widget. Not a snippet pack. This is a collection of code-level tools, interaction patterns, and runtime utilities for building accessible applications from the ground up.

Accessibility technical debt compounds fast. It's expensive to retrofit, and it locks real people out of what you built. Building it in from the start is easier than fixing it later — and it's the right thing to do.

Three packages, all framework-agnostic TypeScript, all mapped to specific WCAG 2.x success criteria.

---

## Packages

### [@accessibility-devkit/audit](./packages/audit)

Runs axe-core accessibility audits and formats the results. Fits into CI pipelines, PR workflows, or one-off spot checks.

- **axe-core runner** with configurable WCAG conformance level (A, AA, or AAA)
- **Scoped audits** — include or exclude specific selectors to audit one section at a time
- **Structured results** — violations come back with severity counts (critical, serious, moderate, minor), not just pass/fail
- **Three report formats**: plain text for the console, markdown for docs and PRs, JSON for pipelines
- **ESLint flat-config** for jsx-a11y — drop it into `eslint.config.js` and every JSX accessibility rule surfaces as a warning during development without blocking builds

```ts
import { runAudit, formatReport } from '@accessibility-devkit/audit';

const result = await runAudit(document, { level: 'AA' });
console.log(formatReport(result, 'markdown'));
console.log(`${result.summary.critical} critical, ${result.summary.serious} serious`);

// Audit a specific section, skip a noisy element
const scoped = await runAudit('#main-content', {
  level: 'AAA',
  exclude: ['#legacy-widget'],
});
```

---

### [@accessibility-devkit/components](./packages/components)

Accessible UI primitives — the interaction patterns that are tedious to get right and painful to get wrong.

- **FocusTrap** — confines keyboard focus to a container (modals, drawers, off-canvas panels). Supports initial focus targeting, pause/unpause for nested modals, and focus restoration on deactivation
- **Roving Tabindex** — arrow key navigation within composite widgets (toolbars, tab lists, radio groups, menus). Tab exits the group. Handles wrap-around. Returns a cleanup function
- **Screen Reader Announcements** — posts messages to an ARIA live region. Polite for status updates, assertive for errors. Creates the region once, reuses it
- **Skip Link** — visually hidden, appears on keyboard focus, jumps past navigation to main content
- **AccessibleDialog** — wraps `<dialog>` or `role="dialog"` elements with focus trapping, ARIA attributes, and Escape-key dismissal
- **AccessibleMenu** — disclosure-style dropdown: trigger gets `aria-haspopup` and `aria-expanded`, arrow keys navigate items, Escape closes, click-outside dismisses

```ts
import { FocusTrap, createRovingTabindex, announceToScreenReader } from '@accessibility-devkit/components';

// Trap focus in a modal
const trap = new FocusTrap(document.getElementById('modal')!);
trap.activate();

// Arrow key navigation in a toolbar
const { destroy } = createRovingTabindex(toolbar, '[role="button"]');

// Tell screen readers what happened
announceToScreenReader('File saved');
announceToScreenReader('Session expired. Please sign in again.', 'assertive');
```

---

### [@accessibility-devkit/accommodations](./packages/accommodations)

Color perception, contrast math, and user preference detection.

- **Color blindness simulation** — transforms any hex color as seen under 7 vision deficiency types: protanopia, deuteranopia, tritanopia (complete), protanomaly, deuteranomaly, tritanomaly (partial), and achromatopsia (full monochromacy)
- **Contrast ratio calculation** — WCAG relative luminance math, returns a value between 1 (no contrast) and 21 (black on white)
- **WCAG threshold checking** — pass/fail for AA or AAA on normal or large text (AA normal = 4.5:1, AA large = 3:1, AAA normal = 7:1, AAA large = 4.5:1)
- **Automatic color adjustment** — give it a failing foreground/background pair and a target level, it darkens then lightens until it passes
- **Preference detection** — `prefersReducedMotion()`, `prefersHighContrast()`, `prefersDarkMode()`, plus `watchPrefersReducedMotion()` which subscribes to live changes and returns an unsubscribe function

```ts
import { meetsWCAG, findAccessibleColor, simulateColorBlindness } from '@accessibility-devkit/accommodations';

// Check before shipping
if (!meetsWCAG('#aaaaaa', '#ffffff')) {
  const fixed = findAccessibleColor('#aaaaaa', '#ffffff');
}

// See how a color looks with deuteranopia
const simulated = simulateColorBlindness('#ff0000', 'deuteranopia');
```

---

## Install

Install only what you need:

```bash
npm install @accessibility-devkit/audit
npm install @accessibility-devkit/components
npm install @accessibility-devkit/accommodations
```

Or all three at once:

```bash
npm install @accessibility-devkit/audit @accessibility-devkit/components @accessibility-devkit/accommodations
```

All packages ship CJS and ESM builds with full TypeScript declarations.

---

## Development

```bash
pnpm install
pnpm build       # Build all packages in parallel
pnpm lint        # Lint
pnpm test        # Run tests across all packages
pnpm changeset   # Create a changeset for versioning
pnpm release     # Build and publish
```

---

## Related Projects

| Project | What it does |
|---------|-------------|
| [accessibility-devkit-llm](https://github.com/lukeslp/accessibility-devkit-llm) | Language model extension — alt text generation, WCAG auditing with LLMs, MCP server, and agent skill definitions |
| [awesome-accessibility](https://github.com/lukeslp/awesome-accessibility) | Curated list of accessibility resources and tools |
| [accessibility-atlas](https://github.com/lukeslp/accessibility-atlas) | 53 datasets on disability demographics, web accessibility, and assistive technology usage |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Author

**Luke Steuber** · [lukesteuber.com](https://lukesteuber.com) · [@lukesteuber.com](https://bsky.app/profile/lukesteuber.com)

## License

MIT
