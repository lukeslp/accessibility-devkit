# The Layered Approach

The Accessibility Devkit is organized into three distinct layers. Each layer addresses a different aspect of the accessibility challenge, and they are designed to work together or independently.

## Layer 1: Testing and Auditing (`@accessibility-devkit/audit`)

This layer is about catching problems early. It integrates into the developer's existing workflow through linting and automated testing.

**What it includes:**

A pre-configured `axe-core` integration for running accessibility audits against rendered DOM. This can be used in unit tests, integration tests, or as a standalone CLI tool. It also includes a pre-configured `eslint-plugin-jsx-a11y` ruleset for catching common accessibility issues in JSX at the linting stage, before the code even runs.

**When to use it:**

Every project should use this layer. It is the foundation of an accessible development workflow.

## Layer 2: Components and Patterns (`@accessibility-devkit/components`)

This layer provides the building blocks for accessible interfaces. It includes unstyled, framework-agnostic component patterns that handle the complex ARIA and keyboard interaction logic.

**What it includes:**

Focus management utilities (wrapping `focus-trap`), a skip navigation component, a live region announcer for screen readers, and keyboard navigation helpers. These are not styled components; they are behavioral primitives that can be composed into any design system.

**When to use it:**

Use this layer when building custom interactive components like modals, dropdowns, tabs, or any element that requires keyboard navigation and screen reader support.

## Layer 3: Accommodations (`@accessibility-devkit/accommodations`)

This layer addresses specific disability needs that go beyond structural accessibility. It provides utilities for detecting and responding to user preferences and simulating various conditions during development.

**What it includes:**

Color blindness simulation (protanopia, deuteranopia, tritanopia) for design validation. Reduced motion detection and utilities for epilepsy and vestibular disorder accommodation. Dyslexia-friendly font loading. High contrast mode detection. Text spacing and readability adjustments.

**When to use it:**

Use this layer when you need to go beyond WCAG compliance and actively accommodate specific user needs. It is particularly useful during the design and QA phases of development.
