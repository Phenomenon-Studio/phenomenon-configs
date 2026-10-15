# M0 audit: existing templates

Audited on 2026-10-15:

- [`admin-template`](https://github.com/Phenomenon-Studio/admin-template) at `b02107f` → **vite**
- [`phenomenon-next-ts-template`](https://github.com/Phenomenon-Studio/phenomenon-next-ts-template) at `e95c936` → **next**

No TanStack Start template exists yet. That stack is left out until one does. Adding it means a new `{{ '.' if stack == 'tanstack' else '' }}/` layer, an answers file and a `tanstack` ESLint entry.

Decisions taken with the team before building:

- Copier, run through `uvx`, scaffolds and updates projects.
- **Admin's rules are the base for both stacks.**
- Packages go to `@phenomenon-studio` on GitHub Packages.
- pnpm everywhere.

## Every config file

| File | vite | next | Difference | Channel (routing rule) | Intended? |
| --- | --- | --- | --- | --- | --- |
| `eslint.config.*` | `.js`, ESLint 10 | `.mjs`, ESLint 9, FlatCompat | Different plugin sets and component style (see below) | package `eslint-config` | No → unified on vite |
| `tsconfig*.json` | app + node references | single file | Strictness, target, lib (see below) | package `tsconfig` | No → unified on vite |
| `prettier.config.*` | + tailwind plugin | — | Same options; `importOrder` groups differ by folder names | package `prettier-config` | Partly: merged into one superset |
| `.stylelintrc` | + Tailwind at-rules | — | Same rules; vite allows Tailwind at-rules/`theme()`, next turns `at-rule-no-unknown` off | package `stylelint-config` (+ `/tailwind`) | Yes |
| `commitlint.config.*` | ESM | CJS | `body-max-line-length` 200 vs 100 | package `commitlint-config` | No → 200 |
| `.husky/commit-msg`, `pre-push` | `pnpm …` | `npx …`, `npm run …` | Package manager only | template | No → pnpm |
| `.editorconfig` | identical | identical | — | template | — |
| `.gitignore` | Vite outputs | Next outputs, `.vercel` | Stack-specific entries | template (Jinja per stack) | Yes |
| `.prettierignore` | + generated files | basic | Stack-specific entries | template (Jinja per stack) | Yes |
| `.gitattributes` | `* text=auto` | missing | — | template (shared) | No → both |
| `.nvmrc` | `24` | `lts/jod` (22) | Node major | template from catalog | No → 24 |
| `.npmrc` | — | `engine-strict`, `legacy-peer-deps` | npm-only settings | template (registry scope only) | No → pnpm settings in `pnpm-workspace.yaml` |
| `pnpm-workspace.yaml` | release age, exact pins | — | — | template (shared) | Yes, kept |
| `package.json` | exact pins, pnpm | carets, npm, `npm-run-all` | Script names (`lint:eslint`/`lint:fmt` vs `lint:next`/`lint:prettier`) | template from catalog | No → vite names, exact pins |
| `vite.config.ts`, `index.html`, `components.json` | ✓ | — | — | template (vite layer) | Yes |
| `next.config.ts`, `postcss.config.mjs`, `vercel.json`, `definitions/` | — | ✓ | — | template (next layer) | Yes |
| `.claude/`, `.agents/`, `AGENTS.md`, `CLAUDE.md`, `skills-lock.json` | ✓ | ✓ | Different skills per stack | template (stack layers) | Yes |
| `.vscode/settings.json` | ignored | cSpell words | — | template (next layer) | Yes |
| `.env.local.example`, `README.md`, `src/`, `public/` | ✓ | ✓ | Stack starters | template (stack layers) | Yes |
| CI workflow | none | none | — | reusable workflow `node-ci.yml` | New |
| Renovate | none | none | — | preset `renovate/default.json` | New |

## Rule and behaviour changes per stack

### vite (admin-template)

The ESLint and Stylelint output is identical. The example passes with zero changes to `src/`.

- Prettier: added `tailwindStylesheet: './src/styles/index.css'`, which Tailwind v4 needs to know custom theme classes. Classes like `bg-background` and `text-foreground` now sort correctly. 21 starter files were reformatted (class order only).
- Prettier `importOrder` gained Next's groups (`<TYPES>(next)`, `^next`, `@/providers`, `@/icons`, `*/api`, `*/regexes`, `*/public/`). These are no-ops in a Vite project.
- `prettier-plugin-tailwindcss` moved from the project's `dependencies` into `@phenomenon-studio/prettier-config`.
- `.stylelintrc` became `stylelint.config.js`. `ignoreFiles` became `.stylelintignore`, because Stylelint resolves `ignoreFiles` relative to the shared package.
- Removed the dangling `.claude/skills/write-a-skill` symlink (its target was never committed).

### next (phenomenon-next-ts-template)

**ESLint** (ESLint 9 → 10):

| Before | After |
| --- | --- |
| `eslint-config-next` (`core-web-vitals`, `typescript`) via FlatCompat | `@next/eslint-plugin-next` `core-web-vitals` + `typescript-eslint` recommended |
| `eslint-plugin-react` recommended | `@eslint-react` `recommended-typescript` (hooks/compiler rules stay with `react-hooks`) |
| `react/function-component-definition`: **arrow functions required** | `no-restricted-syntax`: **function declarations required** (inverted) |
| — | named functions required for `useEffect` / `useLayoutEffect` / `useImperativeHandle` |
| — | `jsx-a11y-x` recommended, `@typescript-eslint/consistent-type-imports`, `no-import-type-side-effects`, `no-unused-expressions` |
| `@tanstack/eslint-plugin-query` `flat/recommended` | `flat/recommended-strict` |
| `react-hooks` `recommended-latest` | `recommended` |
| `react/no-unused-prop-types`, `react/jsx-no-useless-fragment`, `react/self-closing-comp` | `@eslint-react/jsx-no-useless-fragment`, `@stylistic/jsx-self-closing-comp` (no unused-prop-types equivalent) |
| formatting rules (`quotes`, `semi`, `comma-style`, `no-multi-spaces`, `no-trailing-spaces`, `block-spacing`, `semi-spacing`, `space-before-blocks`, `no-tabs`, `no-mixed-spaces-and-tabs`, `no-extra-semi`) | removed: Prettier owns formatting |
| `max-len` | `@stylistic/max-len` (same options) |
| `@typescript-eslint/no-unused-vars` without `caughtErrors` | also reports unused `catch` bindings (`^_` ignored) |
| `eslint .` (warnings allowed) | `--max-warnings 0 --report-unused-disable-directives` |

Starter fixes made: 9 components converted to function declarations, one named effect callback, `useContext` → `use`, and one `import type`.

**TypeScript** (5 → 6, `@phenomenon-studio/tsconfig/next.json`):

- `target` ES2017 → ES2022.
- `lib` `dom, dom.iterable, esnext` → `ES2022, DOM, DOM.Iterable`. ESNext APIs are no longer typed.
- Added `verbatimModuleSyntax`, `allowImportingTsExtensions`, `moduleDetection: force`, `useDefineForClassFields`.
- Added the strict extras `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`.
- Removed `esModuleInterop`, which `verbatimModuleSyntax` supersedes.
- The starter compiled with no changes beyond the ky port below.

**Other:**

- npm → pnpm. The lockfile, hooks, `.claude/settings.json` and docs were updated.
- Script renames:
    - `lint:next` → `lint:eslint`
    - `lint:prettier` → `lint:fmt`
    - `fix:prettier` → `fix:fmt`
    - `tsc` (`next typegen && tsc`) is new.
- Node 22 → 24. `"type": "module"` added.
- Commitlint `body-max-line-length` 100 → 200.
- Dependencies aligned with the vite catalog:
    - ky 1 → 2. The hooks now take the state object and `prefixUrl` became `prefix`; `@http*.ts` was ported.
    - `@react-hookz/web` 25 → 26.
    - react 19.2 → 19.3, next 16.2 → 16.4, zod 4.3 → 4.6.
- `next.config.ts`: Turbopack and output-tracing roots read `NEXT_WORKSPACE_ROOT`, defaulting to the project folder. Monorepos (including this repo's examples) need the override.

## Vite styling option (added 2026-10-15)

`styling` (Vite only) selects the UI layer: `tailwind` (default, the admin-template UI unchanged) or `css-modules`.

- Shared by both: routing, TanStack Query/Form, auth + permissions, MSW, services, hooks, context, form field components, `@/components/ui` _APIs_ used by shared code (`Button`, `Input`, `PasswordInput`, `Field*`, `Loader`, `toast`/`Toaster`, `TooltipProvider`).
- `css-modules` ships a lean kit on Base UI headless primitives (Button, Input, PasswordInput, Label, Field, Loader, Toast, Tooltip, EmptyState), a top-bar layout (nav filtered by permissions, theme select, user, logout) instead of the collapsible sidebar, and the same pages. No Tailwind, shadcn, `cva` or `cn`; `clsx` combines classes. Same colour tokens and dark mode (`.dark`) as the Tailwind variant.
- Dropped in `css-modules`: `components.json`, the shadcn skill, Tailwind Prettier/Stylelint entries.
- `vite.config.ts`, `index.html`, `src/lib/@router.tsx` are single Jinja files branching on `styling`.

## Open for the team

- Confirm the inverted component style for Next (function declarations), or ask for a `next`-only override.
- `.github/CODEOWNERS` owners (placeholder until named).
- TanStack Start: provide or approve a starter to add the third stack.
