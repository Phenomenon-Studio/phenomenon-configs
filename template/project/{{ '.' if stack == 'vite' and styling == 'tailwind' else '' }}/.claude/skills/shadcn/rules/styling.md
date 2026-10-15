# Styling & Customization

See [customization.md](../customization.md) for theming, CSS variables, and adding custom colors.

## Contents

- Semantic colors
- No raw color values for status indicators
- Built-in variants first
- className for layout only
- No space-x-* / space-y-*
- Prefer size-* over w-* h-* when equal
- Prefer truncate shorthand
- No manual dark: color overrides
- Use cn() for conditional classes
- No manual z-index on overlay components

---

## Semantic colors

**Incorrect:**

```tsx
<div className="bg-blue-500 text-white">
    <p className="text-gray-600">Secondary text</p>
</div>
```

**Correct:**

```tsx
<div className="bg-primary text-primary-foreground">
    <p className="text-muted-foreground">Secondary text</p>
</div>
```

---

## No raw color values for status/state indicators

Use Badge variants, semantic tokens like `text-destructive`, or custom CSS variables.

**Incorrect:**

```tsx
<span className="text-emerald-600">+20.1%</span>
<span className="text-red-600">-3.2%</span>
```

**Correct:**

```tsx
<Badge variant="secondary">+20.1%</Badge>
<span className="text-destructive">-3.2%</span>
```

---

## Built-in variants first

**Incorrect:**

```tsx
<Button className="border border-input bg-transparent hover:bg-accent">Click me</Button>
```

**Correct:**

```tsx
<Button variant="outline">Click me</Button>
```

---

## className for layout only

Use `className` for layout (`max-w-md`, `mx-auto`, `mt-4`), not for colors or typography.

**Incorrect:**

```tsx
<Card className="bg-blue-100 text-blue-900 font-bold">
    <CardContent>Dashboard</CardContent>
</Card>
```

**Correct:**

```tsx
<Card className="max-w-md mx-auto">
    <CardContent>Dashboard</CardContent>
</Card>
```

---

## No space-x-* / space-y-*

Use `gap-*` instead.

```tsx
// Correct
<div className="flex flex-col gap-4">
    <Input />
    <Button>Submit</Button>
</div>

// Wrong
<div className="space-y-4">
```

---

## Prefer size-* over w-* h-* when equal

`size-10` not `w-10 h-10`. Applies to icons, avatars, skeletons, etc.

---

## Prefer truncate shorthand

`truncate` not `overflow-hidden text-ellipsis whitespace-nowrap`.

---

## No manual dark: color overrides

Use semantic tokens -- they handle light/dark via CSS variables. `bg-background text-foreground` not `bg-white dark:bg-gray-950`.

---

## Use cn for conditional classes

**Incorrect** — a plain template literal does no Tailwind conflict resolution:

```tsx
<div className={`flex items-center ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
```

**Incorrect** — the `cn(...)` call form breaks the repo's tagged-template convention:

```tsx
<div className={cn('flex items-center', isActive ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
```

**Correct** — tagged template, with whitespace before `${`:

```tsx
import { cn } from 'cn';

<div className={cn`flex items-center ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
```

Note the mandatory space before every `${`. See `.claude/rules/code-style.md` for the full convention.

---

## No manual z-index on overlay components

`Dialog`, `Sheet`, `Drawer`, `AlertDialog`, `DropdownMenu`, `Popover`, `Tooltip`, `HoverCard` handle their own stacking. Never add `z-50` or `z-[999]`.
