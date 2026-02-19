# @accessibility-devkit/accommodations

Utilities for specific disability accommodations, including color blindness simulation, reduced motion detection, and dyslexia-friendly font loading.

## Installation

```bash
pnpm install @accessibility-devkit/accommodations
```

## Usage

```typescript
import { simulateColorBlindness } from '@accessibility-devkit/accommodations';

// Simulate how a color appears to someone with protanopia
const simulated = simulateColorBlindness('#FF0000', 'protan');
console.log(simulated); // The color as perceived with protanopia
```

## What's Included

| Utility | Purpose |
|---|---|
| `simulateColorBlindness` | Simulate protanopia, deuteranopia, and tritanopia for design validation. |

## License

MIT
