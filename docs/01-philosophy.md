# Philosophy

The Accessibility Devkit exists because the gap in accessibility tooling is not a lack of tools, but a lack of cohesion. The best tools are scattered across dozens of packages, each with its own configuration, API, and philosophy. This project brings them together into a single, opinionated, developer-friendly framework.

## Guiding Principles

**Accessibility is a spectrum, not a checkbox.** There is no single "accessible" state. Different users have different needs, and those needs can change depending on context. The toolkit is designed to address a wide range of disabilities and preferences, from screen reader compatibility to epilepsy-safe animations.

**Source-level fixes over runtime patches.** The most effective accessibility improvements are made in the source code. A properly structured heading hierarchy, semantic HTML, and correct ARIA attributes will always outperform a runtime widget that tries to compensate for their absence.

**Respect user agency.** Users with disabilities are experts on their own needs. They have configured their operating systems, browsers, and assistive technologies to work for them. The toolkit respects these preferences by detecting and responding to system-level settings like `prefers-reduced-motion` and `prefers-color-scheme`, rather than imposing its own.

**Make the right thing the easy thing.** If accessible patterns are harder to implement than inaccessible ones, developers will take the path of least resistance. The toolkit provides accessible components and configurations that are as easy to use as their inaccessible counterparts.
