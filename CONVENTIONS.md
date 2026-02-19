# Accessibility Devkit Project Conventions

This document outlines the architectural and stylistic conventions for the `accessibility-devkit` family of projects. Adhering to these conventions ensures consistency, maintainability, and a cohesive developer experience across the ecosystem.

## 1. Naming Conventions

### 1.1. Repositories

- **Core Toolkit:** `accessibility-devkit`
- **Extensions:** `accessibility-devkit-<area>` (e.g., `accessibility-devkit-llm`, `accessibility-devkit-mobile`)

### 1.2. NPM Packages

All packages will be scoped under `@accessibility-devkit`.

- **Core/Main Package:** `@accessibility-devkit/core` (if a primary, framework-agnostic package exists)
- **Sub-packages:** `@accessibility-devkit/<name>` (e.g., `@accessibility-devkit/audit`, `@accessibility-devkit/components`, `@accessibility-devkit/react`, `@accessibility-devkit/llm`)

## 2. Repository Structure

The project will be structured as a monorepo managed by a workspace tool like pnpm, Lerna, or Turborepo.

```plaintext
accessibility-devkit/
├── CONVENTIONS.md         # This file
├── README.md              # High-level project overview
├── LICENSE                  # MIT License
├── package.json             # Root package.json for the workspace
├── .eslintrc.js             # Base ESLint config
├── .prettierrc.json         # Prettier config
├── tsconfig.base.json       # Base TypeScript config
├── packages/                # Directory for all individual NPM packages
│   ├── audit/               # Example: @accessibility-devkit/audit
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   └── README.md
│   └── components/          # Example: @accessibility-devkit/components
│       └── ...
├── configs/                 # Shared configurations (e.g., Jest, Storybook)
├── examples/                # Usage examples for different frameworks
│   ├── react-app/
│   └── vanilla-js/
└── docs/                    # Conceptual documentation
    ├── 01-philosophy.md
    ├── 02-why-not-overlays.md
    └── 03-layered-approach.md
```

## 3. Coding Style & Tooling

- **Language:** TypeScript will be used for all packages.
- **Style:** [Prettier](https://prettier.io/) will be used for automatic code formatting. A `.prettierrc.json` file will be present at the root.
- **Linting:** [ESLint](https://eslint.org/) will be used for static analysis. A base `.eslintrc.js` will be at the root, with packages extending it as needed.
- **Build Tool:** `tsup` or a similar modern bundler will be used to compile TypeScript for each package.

## 4. Documentation

- **Root `README.md`:** Provides a high-level overview of the entire `accessibility-devkit` project, its philosophy, and a guide to the packages within.
- **Package `README.md`:** Each package in the `packages/` directory must have its own `README.md` detailing its specific purpose, API, and usage examples.
- **`docs/` Directory:** Contains long-form conceptual documentation, including the project's philosophy, architectural decisions (e.g., why it's not an overlay), and guides on accessibility best practices.
- **API Documentation:** TypeDoc or a similar tool will be used to generate API documentation from TSDoc comments.

## 5. Commit Messages

All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This facilitates automated changelog generation and versioning.

- **`feat:`** A new feature
- **`fix:`** A bug fix
- **`docs:`** Documentation only changes
- **`style:`** Changes that do not affect the meaning of the code (white-space, formatting, etc)
- **`refactor:`** A code change that neither fixes a bug nor adds a feature
- **`perf:`** A code change that improves performance
- **`test:`** Adding missing tests or correcting existing tests
- **`chore:`** Changes to the build process or auxiliary tools and libraries

## 6. Versioning & Publishing

- **Tool:** [Changesets](https://github.com/changesets/changesets) is the preferred tool for managing versioning and publishing of packages in the monorepo.
- **Process:** When making a change that should trigger a package version bump, a developer will run `pnpm changeset` and fill out the prompt. This creates a markdown file that will be committed and later used to automate the release process.
