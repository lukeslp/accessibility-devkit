# Philosophy

Accessibility tools already exist. The hard part is making their configurations, APIs, and assumptions work together. Accessibility Devkit gathers the useful pieces into one opinionated framework.

## Guiding Principles

**Accessibility changes with people and context.** A single checkbox cannot represent every need. The toolkit covers a range of disabilities and preferences, from screen-reader compatibility to safer animation.

**Source-level fixes over runtime patches.** The most effective accessibility improvements are made in the source code. A properly structured heading hierarchy, semantic HTML, and correct ARIA attributes will always outperform a runtime widget that tries to compensate for their absence.

**Respect user agency.** Users with disabilities are experts on their own needs. They have configured their operating systems, browsers, and assistive technologies to work for them. The toolkit respects these preferences by detecting and responding to system-level settings like `prefers-reduced-motion` and `prefers-color-scheme`, rather than imposing its own.

**Make the right thing the easy thing.** If accessible patterns are harder to implement than inaccessible ones, developers will take the path of least resistance. The toolkit provides accessible components and configurations that are as easy to use as their inaccessible counterparts.
