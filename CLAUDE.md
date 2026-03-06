# CLAUDE.md

Guidance for working in the accessibility-devkit TypeScript monorepo.

## Repo Overview

pnpm workspaces monorepo. Three published packages under `@accessibility-devkit/`. TypeScript 5.3, tsup for builds, `@changesets/cli` for versioning.

```
accessibility-devkit/
├── packages/
│   ├── audit/           # @accessibility-devkit/audit
│   ├── components/      # @accessibility-devkit/components
│   └── accommodations/  # @accessibility-devkit/accommodations
├── tsconfig.base.json   # Root config; each package extends it
├── CONVENTIONS.md       # Naming and commit conventions
└── package.json         # Workspace root (private)
```

## Commands

```bash
# Build all packages in parallel
pnpm build

# Build a single package
pnpm --filter @accessibility-devkit/audit build

# Watch mode (per package)
pnpm --filter @accessibility-devkit/components dev

# Lint and format
pnpm lint
pnpm format

# Versioning and release
pnpm changeset              # Create a changeset (fill prompt, commit .changeset/*.md)
pnpm version-packages       # Apply changesets → bump versions + update CHANGELOG
pnpm release                # pnpm build && changeset publish
```

## Packages

| Package | Description |
|---------|-------------|
| `@accessibility-devkit/audit` | axe-core runner returning structured `AuditResult`; also exports ESLint `jsx-a11y` config |
| `@accessibility-devkit/components` | `FocusTrap`, `createRovingTabindex`, `announceToScreenReader`, `createSkipLink`, `AccessibleDialog`, `AccessibleMenu` |
| `@accessibility-devkit/accommodations` | Color blindness simulation (7 types), `contrastRatio`, `meetsWCAG`, `findAccessibleColor`, media query watchers |

## Architecture

Each package follows the same shape:

- Entry: `src/index.ts`
- Build: `tsup src/index.ts --format cjs,esm --dts` → `dist/`
- Exports: `main` (CJS) + `types` (`.d.ts`); no `exports` field yet
- All three are at v0.1.0 — not yet stable API

Root `tsconfig.base.json` sets compiler options; each package's `tsconfig.json` extends it with its own `include`.

## Conventions

From `CONVENTIONS.md`:

- **Packages**: scoped as `@accessibility-devkit/<name>`
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `perf:`, `test:`, `chore:`)
- **Docs**: TSDoc on all exported functions and types
- **No `console.log`** in published package code
- **Style**: Prettier for formatting, ESLint + `@typescript-eslint` for linting

## Changesets Workflow

1. Make code changes
2. `pnpm changeset` — select affected packages and bump type (patch/minor/major), write summary
3. Commit the generated `.changeset/*.md` file with the code changes
4. When ready to release: `pnpm release`
