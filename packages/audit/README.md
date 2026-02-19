# @accessibility-devkit/audit

Pre-configured accessibility testing and auditing tools for the Accessibility Devkit.

## Installation

```bash
pnpm install @accessibility-devkit/audit
```

## Usage

```typescript
import { runAxe } from '@accessibility-devkit/audit';

const results = await runAxe(document);
console.log(results.violations);
```

## What's Included

| Tool | Purpose |
|---|---|
| `axe-core` | The industry-standard accessibility testing engine. |
| `eslint-plugin-jsx-a11y` | Static analysis for JSX accessibility issues. |

## License

MIT
