# accessibility-devkit

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2_AA-blue.svg)](https://www.w3.org/TR/WCAG22/)

Not another overlay widget. Not a snippet pack. This is a collection of code-level tools, user interaction patterns, and runtime utilities that help you build accessible applications from the ground up.

You do NOT want accessibility technical debt. It compounds, it's expensive to retrofit, and it locks out real people from using what you built. Building it right from the start is easier than fixing it later — and it's just the right thing to do.

Three packages, all framework-agnostic TypeScript, all mapped to specific WCAG 2.x success criteria.

## Packages

### @accessibility-devkit/audit

Automated accessibility testing that actually fits into your workflow.

- **axe-core runner** with configurable WCAG conformance level (A, AA, or AAA)
- **Scoped audits** — include or exclude specific selectors so you can audit a section at a time
- **Structured results** — violations come back with severity counts (critical, serious, moderate, minor), not just a pass/fail
- **Three report formats**: plain text for the console, markdown for docs and PRs, JSON for CI pipelines
- **ESLint flat-config** for jsx-a11y — drop it into `eslint.config.js` and every JSX accessibility rule lights up as a warning during development without blocking builds

```ts
import { runAudit, formatReport } from '@accessibility-devkit/audit';

const result = await runAudit(document, { level: 'AA' });
console.log(formatReport(result, 'markdown'));
console.log(`${result.summary.critical} critical, ${result.summary.serious} serious`);
```

### @accessibility-devkit/components

Accessible UI primitives — the interaction patterns that are tedious to get right and painful to get wrong.

- **FocusTrap** — confines keyboard focus to a container (modals, drawers, off-canvas panels). Supports initial focus targeting, pause/unpause for nested modals, and automatic focus restoration when deactivated
- **Roving Tabindex** — arrow key navigation within composite widgets like toolbars, tab lists, radio groups, and menus. Tab exits the group entirely. Handles wrap-around. One function call, returns a cleanup function
- **Screen Reader Announcements** — posts messages to an ARIA live region. Polite for status updates ("3 results found"), assertive for errors ("Session expired"). Creates the live region once, reuses it
- **Skip Link** — visually hidden, appears on keyboard focus, jumps past navigation to main content. One line to add
- **Accessible Dialog** — wraps `<dialog>` or `role="dialog"` elements with focus trapping, ARIA attributes (`aria-modal`, `role`), and Escape-key dismissal. Sets everything up automatically on construction
- **Accessible Menu** — disclosure-style dropdown: trigger button gets `aria-haspopup` and `aria-expanded`, arrow keys navigate items, Escape closes, click-outside dismisses

```ts
import { FocusTrap, createRovingTabindex, announceToScreenReader } from '@accessibility-devkit/components';

// Trap focus in a modal
const trap = new FocusTrap(document.getElementById('modal')!);
trap.activate();

// Arrow key navigation in a toolbar
const { destroy } = createRovingTabindex(toolbar, '[role="button"]');

// Tell screen readers what happened
announceToScreenReader('File saved');
```

### @accessibility-devkit/accommodations

Color perception, contrast math, and user preference detection.

- **Color blindness simulation** — renders any hex color as it appears under 7 vision deficiency types: protanopia, deuteranopia, tritanopia (complete loss), protanomaly, deuteranomaly, tritanomaly (partial loss), and achromatopsia (full monochromacy). Useful for design review before shipping
- **Contrast ratio calculation** — WCAG relative luminance math, returns a value between 1 (no contrast) and 21 (black on white)
- **WCAG threshold checking** — pass/fail against AA or AAA for normal or large text. AA normal = 4.5:1, AA large = 3:1, AAA normal = 7:1, AAA large = 4.5:1
- **Automatic color adjustment** — give it a failing foreground/background pair and a target level, it darkens (then lightens) until it passes. Returns the original if it already meets the threshold
- **Preference detection** — `prefersReducedMotion()`, `prefersHighContrast()`, `prefersDarkMode()` plus a `watchPrefersReducedMotion()` that subscribes to live changes and returns an unsubscribe function

```ts
import { meetsWCAG, findAccessibleColor, simulateColorBlindness } from '@accessibility-devkit/accommodations';

// Check before shipping
if (!meetsWCAG('#aaaaaa', '#ffffff')) {
  const fixed = findAccessibleColor('#aaaaaa', '#ffffff');
}

// Preview how a color looks with deuteranopia
const simulated = simulateColorBlindness('#ff0000', 'deuteranopia');
```

## Install

```bash
npm install @accessibility-devkit/audit
npm install @accessibility-devkit/components
npm install @accessibility-devkit/accommodations
```

Or all at once:

```bash
npm install @accessibility-devkit/audit @accessibility-devkit/components @accessibility-devkit/accommodations
```

## Related Projects

| Project | What it does |
|---------|-------------|
| [accessibility-devkit-llm](https://github.com/lukeslp/accessibility-devkit-llm) | LLM extension — alt text generation, WCAG auditing with language models, MCP server, and agent skill definitions |
| [awesome-accessibility](https://github.com/lukeslp/awesome-accessibility) | Curated list of accessibility resources and tools |
| [accessibility-atlas](https://github.com/lukeslp/accessibility-atlas) | 53 datasets on disability demographics, web accessibility, and assistive technology usage |

## Development

```bash
pnpm install
pnpm build              # Build all packages
pnpm lint               # Lint
pnpm changeset          # Create a changeset for versioning
pnpm release            # Build + publish
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT. Luke Steuber.
