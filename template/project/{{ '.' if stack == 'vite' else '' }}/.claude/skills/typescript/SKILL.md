---
name: typescript
description: Write clean, efficient TypeScript code that follows project conventions and advanced type patterns. Use when writing or reviewing TypeScript code, defining types, creating generics, handling errors, or working with React components, Zod schemas, and TanStack libraries.
user-invocable: false
---

# TypeScript

Types are a **correctness and clarity tool** — reduce bugs, reduce cognitive load, no ceremony.

## Compiler & Lint Constraints

- `strict: true` — all strict checks enabled
- `verbatimModuleSyntax: true` — always use `import type` for type-only imports
- `erasableSyntaxOnly: true` — **no `enum`, no parameter properties, no namespaces**
- `consistent-type-imports: "error"` — enforced by ESLint
- `noUnusedLocals` / `noUnusedParameters` — prefix intentionally unused with `_`
- Target/lib: **ES2022**, JSX: `react-jsx`. ES2022 = exact API ceiling for Vite `baseline-widely-available` (Vite 8: chrome111 / edge111 / firefox114 / safari16.4). No polyfills — **no ES2023+ APIs** (`toSorted`, `toReversed`, `with`, `Object.groupBy`, `Promise.withResolvers`, …). Same ceiling: `ecmaVersion: 2022` (eslint.config.js). Bump all together, re-check every Vite major

## Core Rules

- **PREFER** `type` aliases for all type definitions
- Use `interface` only for declaration merging (e.g., TanStack `Register` augmentation)
- **AVOID** `any` — use `unknown` and narrow with type guards
- **AVOID** `enum` — use union types or `as const` objects with `ObjValues<typeof X>` extraction
- **AVOID** non-null assertions (`!`) unless no alternative exists
- Let TypeScript **infer** when inference is clear and stable
- Use **explicit return types** for exported/public functions
- Use `satisfies` to validate values against types without widening

## Constants Pattern

```ts
export const STATUS = { active: 'active', inactive: 'inactive' } as const;
export type Status = ObjValues<typeof STATUS>; // 'active' | 'inactive'
```

## React Component Props

```ts
// Extend HTML elements
type ButtonProps = { isLoading?: boolean } & React.ComponentProps<'button'>;
// Narrow with Omit/Pick
type PasswordInputProps = Omit<InputProps, 'type'>;
// Compose with variants
type BadgeProps = React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>;
```

- Use `React.ComponentProps<'element'>` — not `HTMLAttributes`
- Use `React.PropsWithChildren` when only children are needed
- Never use `React.FC` with props — use function declarations with typed params

## Zod Schema Inference

```ts
export type LoginSchema = z.infer<typeof loginSchema>;
export const loginSchema = z.object({ email: z.email(), password: z.string().min(8) });
```

Always export the inferred type **above** the schema for colocation.

## Error Handling

- Type errors explicitly with `BaseErrorData<TData>`
- Use `instanceof` type guards for error narrowing (`HTTPError`, `Error`)
- Handle form errors via `formApi.setErrorMap` with typed field error maps
- Never swallow errors with broad `catch` — narrow and handle

## Nullability

- Handle `null`/`undefined` explicitly via control flow narrowing
- Prefer `??` (nullish coalescing) over `||` for defaults
- Use optional chaining (`?.`) — avoid deep nested null checks
- Early-return pattern for optional parameters

## Advanced Patterns

For generics, conditional types, mapped types, template literals, discriminated unions, type guards, and repo-specific patterns see [REFERENCE.md](mdc:REFERENCE.md).
