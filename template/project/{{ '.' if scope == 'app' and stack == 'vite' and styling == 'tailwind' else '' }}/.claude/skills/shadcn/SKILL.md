---
name: shadcn
description: Manages shadcn components and projects — adding, searching, fixing, debugging, styling, and composing UI. Provides project context, component docs, and usage examples. Applies when working with shadcn/ui, component registries, presets, --preset codes, or any project with a components.json file. Also triggers for "shadcn init", "create an app with --preset", or "switch to --preset".
user-invocable: false
---

# shadcn/ui

## Project Context

| Field | Value |
|---|---|
| Style / Base | `base-nova` / `base` (@base-ui/react) |
| Icons | `lucide-react` |
| Framework | Vite SPA (no RSC, no `"use client"`) |
| Tailwind | v4, CSS variables in `src/styles/index.css` |
| UI path | `src/components/ui/` |
| Alias | `@/` -> `./src/` |
| Package manager | pnpm |
| Forms | TanStack Form + Zod (not React Hook Form) |
| Data fetching | TanStack Query v5 (Suspense-first) |
| HTTP client | ky (`http`/`httpPrivate`) |

> Run `pnpm exec shadcn@latest info` to refresh. Run `pnpm exec shadcn@latest docs <component>` for docs.

## Principles

1. **Use existing components first.** `pnpm exec shadcn@latest search` before custom UI.
2. **Compose, don't reinvent.** Combine components for complex patterns.
3. **Built-in variants first.** `variant="outline"`, `size="sm"`, etc.
4. **Semantic colors only.** `bg-primary`, `text-muted-foreground` -- never `bg-blue-500`.
5. **Suspense-first.** `useSuspenseQuery` + `<Suspense>` with `<Skeleton>` fallbacks.

## Code Style (ESLint/Prettier enforced)

- Named `function` declarations for components (not arrow functions)
- `import type` for type-only imports; follow Prettier import sort order
- Single quotes, 4-space indent, 120 char width, trailing comma `es5`
- No `forwardRef` (React 19 -- pass `ref` as prop)
- No arrow callbacks in `useEffect`/`useLayoutEffect` (use named functions)
- `gap-*` not `space-x-*`/`space-y-*`; `size-*` not `w-* h-*` when equal

## Critical Rules

Each links to a file with Incorrect/Correct pairs:

- **[Styling](./rules/styling.md)** -- Semantic colors, `cn()`, `gap-*`, `size-*`, `truncate`, no `dark:`, no `z-index` on overlays
- **[Forms](./rules/forms.md)** -- `FieldGroup` + `Field` + TanStack Form, `data-invalid`/`aria-invalid`
- **[Composition](./rules/composition.md)** -- Items in Groups, Card/Dialog/Sheet structure, Button `isLoading`, Suspense + Skeleton
- **[Icons](./rules/icons.md)** -- `data-icon` on buttons, no sizing classes, pass as objects
- **[Base UI APIs](./rules/base-ui.md)** -- `render` (not `asChild`), `nativeButton={false}`, Select `items` prop
- **[Data Loading](./data-loading.md)** -- Suspense patterns, mutation states, empty states, error toasts

## Component Selection

| Need | Use |
|---|---|
| Button/action | `Button` with variant (`isLoading` for pending) |
| Form inputs | `Input`, `PasswordInput`, `Select`, `Switch`, `Checkbox`, `RadioGroup`, `Textarea`, `Slider` |
| Toggle 2-5 options | `ToggleGroup` + `ToggleGroupItem` |
| Data display | `Table`, `Card`, `Badge`, `Avatar` (always with `AvatarFallback`) |
| Navigation | `Sidebar`, `Breadcrumb`, `Tabs`, `Pagination` |
| Overlays | `Dialog` (modal), `Sheet` (side panel), `Drawer` (bottom), `AlertDialog` (confirm) |
| Feedback | `Toast` (`toast.add`, Base UI), `Alert`, `Skeleton`, `Loader`, `Empty` |
| Layout | `Card`, `Separator`, `Accordion`, `Collapsible` |
| Menus | `DropdownMenu`, `ContextMenu` |
| Tooltips | `Tooltip`, `HoverCard`, `Popover` |

## Workflow

1. **Check installed** -- list `src/components/ui/` before running `add`
2. **Get docs** -- `pnpm exec shadcn@latest docs <component>` and fetch URLs
3. **Add** -- `pnpm exec shadcn@latest add <component>` (preview with `--dry-run`/`--diff`)
4. **Review** -- verify imports, composition, Critical Rules; replace icons with `lucide-react`
5. **Integrate** -- wire TanStack Query/Form per [data-loading.md](./data-loading.md) and [forms.md](./rules/forms.md)

## References

- [rules/forms.md](./rules/forms.md) -- Field system + TanStack Form
- [rules/composition.md](./rules/composition.md) -- Component composition, overlays, loading
- [rules/styling.md](./rules/styling.md) -- Semantic colors, Tailwind conventions
- [rules/icons.md](./rules/icons.md) -- Icon usage patterns
- [rules/base-ui.md](./rules/base-ui.md) -- Base UI API specifics
- [data-loading.md](./data-loading.md) -- TanStack Query + shadcn integration
- [cli.md](./cli.md) -- CLI commands and flags
- [customization.md](./customization.md) -- Theming and CSS variables
- [mcp.md](./mcp.md) -- MCP server tools
