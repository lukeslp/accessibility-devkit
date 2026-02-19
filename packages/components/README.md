# @accessibility-devkit/components

Unstyled, accessible component patterns and focus management utilities for the Accessibility Devkit.

## Installation

```bash
pnpm install @accessibility-devkit/components
```

## Usage

```typescript
import { trapFocus } from '@accessibility-devkit/components';

const modal = document.getElementById('my-modal');
const trap = trapFocus(modal);
trap.activate();

// When done:
trap.deactivate();
```

## What's Included

| Utility | Purpose |
|---|---|
| `trapFocus` | Trap keyboard focus within a container element (e.g., modals, dialogs). |

## License

MIT
