# @accessibility-devkit/motion

Utilities for seizure and vestibular safety: gating animation on the reduced-motion preference, scrolling without motion sickness, and metering flash rate against the WCAG threshold. These protect people with vestibular disorders and photosensitive conditions.

## Build and test from source

This package is source-only and not yet published to npm. Clone the repository and work with it through the pnpm workspace:

```bash
git clone https://github.com/actually-useful-ai/accessibility-devkit.git
cd accessibility-devkit
pnpm install
pnpm --filter @accessibility-devkit/motion build
pnpm --filter @accessibility-devkit/motion test
```

The examples below assume you are working from that cloned workspace.

## Reduced Motion (WCAG 2.3.3)

### prefersReducedMotion / withReducedMotion

```ts
import { withReducedMotion } from '@accessibility-devkit/motion';

withReducedMotion(
  () => element.animate(slideKeyframes, 300),
  () => element.animate(fadeKeyframes, 0),
);
```

`prefersReducedMotion()` is safe to call outside the browser (returns `false`).

### applyMotionPreference

Toggles animated/static classes to match the preference and keeps them in sync as it changes.

```ts
import { applyMotionPreference } from '@accessibility-devkit/motion';

const stop = applyMotionPreference(hero, {
  animatedClass: 'hero--parallax',
  staticClass: 'hero--flat',
});
```

### safeScrollIntoView

Scrolls instantly under reduced motion, smoothly otherwise — avoiding the large motion that can trigger vestibular symptoms.

```ts
import { safeScrollIntoView } from '@accessibility-devkit/motion';

safeScrollIntoView(section, { block: 'start' });
```

## Flash Safety (WCAG 2.3.1)

### isUnsafeFlashRate / createFlashMeter

The general threshold is three flashes per second. Feed each light/dark transition to a meter to self-check a strobing effect.

```ts
import { createFlashMeter, isUnsafeFlashRate } from '@accessibility-devkit/motion';

isUnsafeFlashRate(4); // true

const meter = createFlashMeter({ onUnsafe: () => stopAnimation() });
onEachFrameToggle(() => meter.record());
```

## License

MIT. Author: Luke Steuber.
