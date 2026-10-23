---
paths:
    - 'src/**/*.{ts,tsx}'
---

# Code Style & Conventions

Quick reference distilled from repo configs. Deep dives: `.claude/skills/{typescript,react,accessible-html-jsx,tanstack-query,tanstack-router,tanstack-form,shadcn,web-security}/SKILL.md`.

## Formatting

- 4-space indent, LF, final newline, 120-col lines, semicolons, trailing commas `es5`, `arrowParens: always`.
- Single quotes in JS/TS/TSX; double quotes in CSS/HTML/SVG (`prettier.config.js` override).
- Imports auto-sorted (`@ianvs/prettier-plugin-sort-imports`): type imports → `react`/`react-dom` → builtins → third-party → `@/lib` → `@/lib/{constants,schemas,regexps,utils}` → `@/hooks|@/context` → `@/services` → `@/modules` → `@/components` → `@/components/layouts` → `@/components/ui` → relative (same hierarchy) → bare relative → `.css`. Don't hand-order — `pnpm fix:fmt`.

## TypeScript

- `strict` + `noUnusedLocals/Parameters` + `erasableSyntaxOnly` + `verbatimModuleSyntax` (`tsconfig.app.json`/`tsconfig.node.json`).
- `erasableSyntaxOnly` → no `enum`, no parameter properties; use union types / `as const` objects.
- `import type { X }` for type-only imports (`verbatimModuleSyntax` + `consistent-type-imports`/`no-import-type-side-effects` enforce).
- Alias `@/*` → `src/*`. Prefix intentionally-unused vars/args/caught-errors with `_`.
- Prefer `type` aliases; avoid `any`/unsafe assertions; use `!` sparingly (lint allows it — don't lean on it).

## ESLint gotchas

- `arrow-body-style: always` — block bodies, never implicit returns. `if` always with braces: `if (...) { return; }`, never single-line `if (...) return;`.
- `useEffect`/`useLayoutEffect`/`useImperativeHandle` callbacks must be **named functions**, not arrows (`no-restricted-syntax`).
- `forwardRef` banned — `ref` is a prop in React 19 (`@eslint-react/no-forward-ref`).
- `eqeqeq`, `no-nested-ternary`, `no-unneeded-ternary`, `require-await`, `no-alert`, `no-debugger`, `no-var`; `no-console` warns.
- `@eslint-react` (`recommended-typescript`) on. `eslint-plugin-react-hooks` is canonical for hooks rules — the ESLint React duplicates (`rules-of-hooks`, `exhaustive-deps`, `set-state-in-effect`, `purity`, `refs`, etc.) are intentionally `off`; do not re-enable.
- Render-prop children allowed: `children={(field) => …}` (`@eslint-react/jsx-no-children-prop` off).
- TanStack Query plugin `recommended-strict`; Router `recommended` (`create-route-property-order` warns).
- Generated — never edit: `src/routeTree.gen.ts`, `public/mockServiceWorker.js`.

## React (19 + Compiler)

- Named components as **function declarations** (`function Foo() {}`) with named exports — enforced by `no-restricted-syntax` selectors (PascalCase `const` + arrow/function expression); no default exports, no arrow-function components.
- Compound/composition API for new components (e.g. `Sheet` + `SheetTrigger` + `SheetContent`); canonical: `src/components/ui/Sheet/`, `src/components/ui/DropdownMenu/` (Base UI primitives).
- No `forwardRef` (`ref` is a prop); no new `useMemo`/`useCallback`/`memo()` — Compiler handles it (exception: non-render referential stability, comment why).
- Derive during render; no prop-mirroring state; `useEffect` only for external-system sync; data via TanStack Query, never `fetch` in effects.
- Named handlers (`handleClick`) for non-trivial logic; self-closing tags (convention, not lint-enforced); no useless fragments (`@eslint-react/jsx-no-useless-fragment`); stable keys (never index if reorderable).
- One hook per file; contexts via `useSafeContext` + `displayName`.

## Styling (Tailwind v4)

- Utility-first in markup; merge classes with `cn` imported directly from the [`cn`](https://github.com/shadcn-ui/cn) package (`import { cn } from 'cn'`, replaces `clsx` + `tailwind-merge`). No local wrapper.
- **Always use the tagged-template form** — `` cn`px-2 ${className}` `` — never the `cn(...)` call form (repo convention; `cn` treats the template strings array as a class array).
    - **Keep explicit whitespace at every interpolation boundary**: `` cn`px-2 ${x}` ``, and separate adjacent interpolations: `` cn`${a} ${b}` ``.
    - Multi-line templates are fine — newlines and indentation collapse to a single separator. Put each logical class group on its own line and `${className}` last.
    - Hoist multi-line conditionals into a named `const` above the `return` and interpolate the identifier, rather than embedding a ternary in the template (see `src/components/Sidebar/index.tsx`).
    - Editor autocomplete inside the template needs `"tailwindCSS.experimental.classRegex": [["cn`([^`]*)`", "[\"'`]([^\"'`]*)[\"'`]"]]` in your local VS Code settings (`.vscode/` is gitignored).
- Static class strings only (no `bg-${color}-500` — use lookup maps); extract variants with `cva` in `utils/variants.ts` (see `src/components/ui/Button`). Pass `className` as a sibling interpolation, not into the `cva` config: `` cn`${buttonVariants({ variant, size })} ${className}` ``.
- Theme via CSS variables (`:root`/`.dark` in `src/styles/index.css`) + `@theme inline`; dark mode through the `.dark` class (toggled by `ThemeContext`) plus `dark:` variants.
- Stylelint (`stylelint-config-standard`): kebab-case selectors, long hex, lowercase keywords, `::` pseudo-elements.

## A11y

- `eslint-plugin-jsx-a11y-x` (`recommended`) enforced; `jsx-a11y-x/label-has-associated-control` configured with `labelComponents: Label, FieldLabel`, `controlComponents: Input, PasswordInput`, `labelAttributes: ['label']`, `depth: 3` (see `eslint.config.js`).
- Semantic HTML first; Base UI primitives (scaffolded via shadcn CLI / `components.json`) for interactive widgets — live in `src/components/ui`.

## Structure & data flow

- Layers: `src/components/ui` (Base UI primitives via shadcn) → `src/components` (composites, little logic) → `src/modules` (page-level features) → `src/routes` (TanStack Router file-based, wiring). No `src/ui`/`src/pages`.
- Shared code: `src/lib` (`@http`, `@queryClient`, `@router`, `constants.ts`, `schemas.ts`, `regexps.ts`, `types.ts`, `utils/`), `src/hooks`, `src/context`, `src/mocks` (MSW), `src/styles`.
- Data: `src/services/<domain>/` — `api.ts` (ky) → `queries.ts` (`queryOptions`/`mutationOptions` factories) + `queryKeys.ts` (key factory) + `types.ts`. Routes preload via loader `queryClient.query({ ...factory(), staleTime: 'static' })` (cache-or-fetch; `queryClient.infiniteQuery` for infinite factories; fire-and-forget → `.catch(noop)`); components read via `useSuspenseQuery(factory())`. `ensureQueryData`/`fetchQuery`/`prefetchQuery`/`fetchInfiniteQuery`/`prefetchInfiniteQuery`/`ensureInfiniteQueryData` are `@deprecated` (v5.102, removed in v6) — never use.
- Component/module dirs: `index.tsx` (or `index.ts` barrel), optional `types.ts`, `constants.ts`, `schemas.ts` (Zod), `utils/variants.ts`, `hooks/`, `context/`, nested `components/`. No `store.ts` (no global store layer).
- Forms: `src/components/Form` exposes `useAppForm`/`withForm` (TanStack Form + Zod); build fields with `form.AppField` + `field.FormFieldWrapper`. See `tanstack-form` skill.
- Routing: Zod `validateSearch` with `.catch()`; `beforeLoad` guards — auth token, then an inline `ability.cannot(action, subject)` check against the router-context CASL ability (`src/lib/utils/auth/perms/`, `PERM_ACTIONS`/`PERM_SUBJECTS`) throwing `notFound()`. A pair naming the wrong resource type-checks, so read each one against its own route.
- Update `src/vite-env.d.ts` when adding env vars.

## Tooling

- **pnpm only**, via scripts: `pnpm tsc`, `pnpm lint` (eslint + stylelint + prettier), `pnpm fix:fmt`, `pnpm knip`. No test runner configured (no unit/e2e).
- Husky: `pre-push` runs `pnpm tsc` → `pnpm lint` → `pnpm build`; `commit-msg` runs `commitlint`.
- Commits: Conventional Commits (`build|ci|docs|feat|fix|perf|refactor|revert|style|test`), lower-case type/scope, header ≤ 100 chars.
