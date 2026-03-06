# accessibility-devkit

A TypeScript monorepo of tools for building genuinely accessible web interfaces — no overlays, no shortcuts, no generated fixes. Each package implements real patterns grounded in WCAG 2.x.

## Packages

| Package | Description |
|---------|-------------|
| [`@accessibility-devkit/audit`](./packages/audit/README.md) | axe-core runner, violation summaries, and a pre-built ESLint jsx-a11y config |
| [`@accessibility-devkit/components`](./packages/components/README.md) | Accessible UI primitives: focus traps, roving tabindex, live regions, skip links, dialogs, menus |
| [`@accessibility-devkit/accommodations`](./packages/accommodations/README.md) | Color blindness simulation, contrast ratios, WCAG checks, and media-query watchers |

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

## Quick Examples

```ts
// Run an audit against the current document
import { runAudit, formatReport } from '@accessibility-devkit/audit';
const result = await runAudit(document, { level: 'AA' });
console.log(formatReport(result, 'markdown'));

// Add a skip link and trap focus in a modal
import { createSkipLink, FocusTrap } from '@accessibility-devkit/components';
document.body.insertBefore(createSkipLink('main'), document.body.firstChild);
const trap = new FocusTrap(document.getElementById('modal')!);

// Check contrast before shipping a color
import { meetsWCAG, findAccessibleColor } from '@accessibility-devkit/accommodations';
if (!meetsWCAG('#aaaaaa', '#ffffff')) {
  const fixed = findAccessibleColor('#aaaaaa', '#ffffff');
  console.log('Use this instead:', fixed);
}
```

## Philosophy

- **No overlays.** Accessibility overlays mask problems rather than fix them. This toolkit gives you the primitives to fix the source.
- **WCAG-first.** Every utility maps to a specific WCAG 2.x success criterion.
- **Real implementations.** Focus management, contrast math, and live regions are implemented correctly, not approximated.
- **Framework-agnostic.** Plain TypeScript. Works with React, Vue, Svelte, or no framework.

## Related Projects

| Project | Description |
|---------|-------------|
| [accessibility-devkit-llm](https://github.com/lukeslp/accessibility-devkit-llm) | LLM extension: prompts, skills, tools, MCP servers, and API wrappers for accessibility workflows |
| [awesome-accessibility](https://github.com/lukeslp/awesome-accessibility) | Curated list of accessibility resources, tools, and best practices |
| [accessibility-atlas](https://github.com/lukeslp/accessibility-atlas) | 53 datasets on disability demographics, web accessibility, and assistive technology usage |

## Development

```bash
# Build all packages
pnpm run build --recursive

# Build a single package
cd packages/audit && pnpm run build
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT. Author: Luke Steuber.
